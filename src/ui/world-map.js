import * as d3 from "d3";
import { geoPath } from "d3-geo";
import { geoRobinson } from "d3-geo-projection";

function getSize() {
    const margin = { top: 0, right: 10, bottom: 30, left: 10 };
    const width = window.innerWidth - margin.left - margin.right;
    const height = window.innerHeight - margin.top - margin.bottom;
    return { width: width, height: height };
}

function getProjectionScale(size) {
    return (Math.min(size.width, size.height * 1.9) - 1) / 2 / Math.PI;
}

class WorldMap {

    constructor(container, data, tooltip) {
        this.setupContainer(container);
        this.prepareDecorations();
        this.initMap(data);
        this.setupInteractions(tooltip);
        this.makeResponsive();
    }

    setupContainer(container) {
        const initSize = getSize();

        this.projection = geoRobinson()
            .scale(getProjectionScale(initSize))
            .translate([initSize.width / 2, initSize.height / 2]);

        this.path = geoPath().projection(this.projection);

        this.container = d3.select(container)
                        .append("svg")
                            .attr("width", initSize.width)
                            .attr("height", initSize.height);
    }

    initMap(data) {
        
        this.map = this.container
                        .append("g")
                            .attr("class", "map-container");

        this.map
            .selectAll("path")
                .data(data.features).enter()
                .append("path")
                    .attr("d", this.path)
                    .style("fill", "url(#map_gradient)")
                    .style("fill-opacity", 0.7);
    }

    prepareDecorations() {
        const defs = this.container.append("defs");
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

    setupInteractions(tooltip) {
        this.map
            .selectAll("path")
                .on("mouseover", function (d) {
                    tooltip.show(d, d3.event);
                    d3.select(this)
                        .style("fill", "url(#map_pattern)");
                })
               .on("mouseout", function (d) {
                   tooltip.hide();
                   d3.select(this)
                      .style("fill", "url(#map_gradient)")
                      .style("fill-opacity", 0.7);
               });
    }

    makeResponsive() {
        d3.select(window)
            .on("resize", () => this.resize);
    }

    resize() {
        const size = this.getSize();
        this.container     
           .attr("width", size.width)
           .attr("height", size.height);
        this.projection
            .scale(getProjectionScale(size))
            .translate([size.width / 2, size.height / 2]);
        this.map
            .selectAll("path")
            .attr("d", this.path);
    }
}

export default WorldMap;