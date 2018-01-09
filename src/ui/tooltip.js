import * as d3 from "d3";

class Tooltip {
    
    constructor(text) {

        this.container = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        this.getText = typeof (text) === "function" ? 
            text : function () { return Promise.resolve(text); }
    }

    show(data, event) {
        this.getText(data)
            .then((updatedText) => {
                this.container
                    .html(updatedText)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
                this.container
                    .transition()
                    .duration(200)
                    .style("opacity", 0.9);
            });
    }

    hide() {
        this.container
            .transition()
                .duration(500)
            .style("opacity", 0);
    }
}

export default Tooltip;