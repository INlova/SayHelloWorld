import * as d3 from "d3";
import { geoPath } from "d3-geo";
import { geoRobinson } from "d3-geo-projection";

import { translator } from "./translator/index";

function getSize()
{
    const margin = { top: 0, right: 10, bottom: 30, left: 10 };
    const width = window.innerWidth - margin.left - margin.right;
    const height = Math.max(window.innerHeight, window.innerWidth * 0.5) - margin.top - margin.bottom;
    return { width: width, height: height };
}

const initSize = getSize();

const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const svg = d3.select(".map")
    .append("svg")
    .attr("width", initSize.width)
    .attr("height", initSize.height);

const projection = geoRobinson()
    .scale((initSize.width - 1) / 2 / Math.PI)
    .translate([initSize.width / 2, initSize.height / 2]);

const path = geoPath().projection(projection);
    
d3.queue()
    .defer(d3.json, "assets/data/countries_geo.json")
    .defer(d3.json, "assets/data/countries_info.json")
    .await(ready);

function ready(error, geography, info) {
    const data = prepareData(geography, info);
    const map = initMap(data);
    prepareMapDecorations();
    setupInteractions(map);
    makeResponsive(map);
}

function prepareData(geography, info) {
    const countryLangs = {};
    Object.keys(info)
        .map((key) => {
            const item = info[key];
            countryLangs[item.name] = item.languages;
        });

    geography
        .features
        .forEach(d => {
            d.languages = countryLangs[d.properties.name] || [];
        });

    return geography;
}

function prepareMapDecorations() {
    const defs = svg.append("defs");
    const pattern = defs
        .append("svg:pattern")
            .attr("id", "map_pattern")
            .attr("width", 4)
            .attr("height", 4)
            .attr("patternUnits", "userSpaceOnUse")
            .attr("patternTransform", "rotate(-45)"); 
		
    pattern
		.append("rect")
		.attr("width", 3)
		.attr("height", 4)
		.attr("transform", "translate(0,0)")
		.attr("fill", "#FF9000");

    const gradient = defs
      .append("radialGradient")
        .attr("id", "map_gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("spreadMethod", "pad");

    const gradientData = [
        { color: "#F5E7C4", offset: "0%" },
        { color: "#FECEAB", offset: "100%" }
    ];

    gradient
        .selectAll("stop")
        .data(gradientData).enter()
            .append("stop")
            .attr("offset", function (d) { return d.offset; })
            .attr("stop-color", function (d) { return d.color; })
            .attr("stop-opacity", 1);
}

function initMap(geography) {
    const map = svg
           .append("g")
           .attr("class", "map-container");

    map.selectAll("path")
        .data(geography.features).enter()
        .append("path")
            .attr("d", path)
            .style("fill", "url(#map_gradient)")
            .style("fill-opacity", 0.7);

    return map;
}

function setupInteractions(map) {
    map.selectAll("path")
        .on("mouseover", function (d) {
               d3.select(this).style("fill", "url(#map_pattern)");
               // tooltip fast and dummy
               const text = d3.select(".source").node().value;
               tooltip.style("left", (d3.event.pageX) + "px")
                      .style("top", (d3.event.pageY - 28) + "px");
               if (!text) {
                   tooltip.html(() => `
                            <strong>Country: </strong>
                            <span class='details'>${d.properties.name}<br></span>
                            <strong>Languages: </strong>
                            <span class ='details'>${d.languages.join()} </span>`);
                   tooltip.transition().duration(200).style("opacity", .9);
               } else {
                   translator
                       .translate(text, d.languages[0]) 
                       .then((r) => { 
                           tooltip.html(() => `
                                        <span class='main'>${ r }<br></span>
                                        <strong>Country: </strong>
                                        <span class='details'>${d.properties.name}<br></span>`);
                           tooltip.transition().duration(200).style("opacity", .9);
                       });
               }
           })
           .on("mouseout", function (d) {
               tooltip
                   .transition()
                      .duration(500)
                      .style("opacity", 0);
               d3.select(this)
                   .style("fill", "url(#map_gradient)")
                   .style("fill-opacity", 0.7)               ;
           });
}

function makeResponsive(map) {
    d3.select(window)
      .on("resize", sizeChanged);
    
    function sizeChanged()
    {
        const size = getSize();
        svg     
           .attr("width", size.width)
           .attr("height", size.height);
        projection
            .scale((size.width - 1) / 2 / Math.PI)
            .translate([size.width / 2, size.height / 2]);
        map.selectAll("path").attr("d", path);
    }
}