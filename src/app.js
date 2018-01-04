import * as d3 from "d3";
import { geoPath } from "d3-geo";
import { geoRobinson } from "d3-geo-projection";

import TranslateService from "./translator/translator";
import { apiKey } from "./translator/settings/api-key";
import { supportedLangs } from "./translator/settings/supported-langs";

const translator = new TranslateService(apiKey, supportedLangs);

function getSize()
{
    const margin = { top: 0, right: 10, bottom: 0, left: 10 };
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

    // prepare data
    const countryLangs = {};
    Object.keys(info).map((key) => {
        const item = info[key];
        countryLangs[item.name] = item.languages;
    });

    geography
        .features
        .forEach(d => {
            d.languages = countryLangs[d.properties.name] || [];
        });

    var map = svg
            .append("g")
            .attr("class", "map-container");
        
    map.selectAll("path")
       .data(geography.features).enter()
          .append("path")
                .attr("d", path)
                .style("fill", "grey")
                .style("fill-opacity", 0.8)
                .style("stroke", "white")
                .style("stroke-width", 1)
                .style("stroke-opacity", 0.5)
            // tooltips
            .on("mouseover", function (d) {
                d3.select(this)
                    .style("fill", "green")
                    .style("fill-opacity", 1)
                    .style("stroke-opacity", 1)
                    .style("stroke-width", 2);
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
                            console.log(r);
                            tooltip.html(() => `
                                        <span class='main'>${ r }<br></span>
                                        <strong>Country: </strong>
                                        <span class='details'>${d.properties.name}<br></span>`);
                            tooltip.transition().duration(200).style("opacity", .9);
                        },
                              (r) => { console.log(r);});
                }
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                       .duration(500)
                       .style("opacity", 0);
                d3.select(this)
                    .style("fill", "grey")
                    .style("fill-opacity", 0.8)
                    .style("stroke-opacity", 0.5)
                    .style("stroke-width", 1);
            });
        
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