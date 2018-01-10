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
                this.container.html(updatedText);
                this.size = this.container.node().getBoundingClientRect();
                this.move(event);
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

    move(event) {
        const distToRight = window.innerWidth - event.pageX;
        const xOffset = distToRight > (this.size.width + 50) ? 10 : (-this.size.width - 10);
        const distToBottom = window.innerHeight - event.pageY;
        const yOffset = distToBottom > (this.size.height + 10) ? -30 : (-this.size.height - 10);
        this.container
            .style("left", (event.pageX + xOffset)  + "px")
            .style("top", (event.pageY + yOffset) + "px");
    }
}

export default Tooltip;