import * as d3 from "d3";

import { translator } from "./translator/index";

import Tooltip from "./ui/tooltip";
import WorldMap from "./ui/world-map";

const placeholderFormatter = (d) => `
                            <strong>Country: </strong>
                            <span class='details'>${d.properties.name}<br></span>
                            <strong>Languages: </strong>
                            <span class ='details'>${d.languages.join(", ")} </span>`;

const translaionFormatter = (d, r) => `
                             <span class='main'>${r}<br></span>
                             <strong>Country: </strong>
                             <span class='details'>${d.properties.name}<br></span>`;

const getTooltipText = function(data) {
    const text = d3.select(".source").node().value;
    if (!text) {
        const placeholder = placeholderFormatter(data);
        return Promise.resolve(placeholder);
    } 
    return translator
            .translate(text, data.languages[0]) 
            .then((translation) => {
                return translaionFormatter(data, translation);
            });
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
    
d3.queue()
    .defer(d3.json, "assets/data/countries_geo.json")
    .defer(d3.json, "assets/data/countries_info.json")
    .await(function (error, geography, info) {
        const data = prepareData(geography, info);
        const tooltip = new Tooltip(getTooltipText);
        const worldMap = new WorldMap(".map", data, tooltip);
    });

