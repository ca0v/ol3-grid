import $ = require("jquery");
import ol = require("openlayers");
import { StyleConverter } from "ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer";
import pointStyle = require("ol3-symbolizer/ol3-symbolizer/styles/star/flower");
import { Popup } from "ol3-popup/ol3-popup";
import { Grid } from "../ol3-grid";

let styler = new StyleConverter();

function doif<T>(v: T, cb: (v: T) => void) {
    if (v !== undefined && v !== null) cb(v);
}

function getParameterByName(name: string, url = window.location.href) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function parse<T>(v: string, type: T): T {
    if (typeof type === "string") return <any>v;
    if (typeof type === "number") return <any>parseFloat(v);
    if (typeof type === "boolean") return <any>(v === "1" || v === "true");
    if (Array.isArray(type)) {
        return <any>(v.split(",").map(v => parse(v, (<any>type)[0])));
    }
    throw `unknown type: ${type}`;
}

function randomName() {
    const nouns = "cat,dog,bird,horse,pig,elephant,giraffe,tiger,bear,cow,chicken,moose".split(",");
    const adverbs = "running,walking,turning,jumping,hiding,pouncing,stomping,rutting,landing,floating,sinking".split(",");
    let noun = nouns[(Math.random() * nouns.length) | 0];
    let adverb = adverbs[(Math.random() * adverbs.length) | 0];
    return `${adverb} ${noun}`.toLocaleUpperCase();
}

const html = `
<div class='popup'>
    <div class='popup-container'>
    </div>
</div>
`;

const css = `
<style name="popup" type="text/css">
    html, body, .map {
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        margin: 0;    
    }
    .popup-container {
        position: absolute;
        top: 1em;
        right: 0.5em;
        width: 10em;
        bottom: 1em;
        z-index: 1;
        pointer-events: none;
    }
    .popup-container .ol-popup.docked {
        min-width: auto;
    }
</style>
`;

const css_popup = `
.ol-popup {
    color: white;
    background-color: rgba(77,77,77,0.7);
    border: 1px solid white;
    min-width: 200px;
    padding: 12px;
}

.ol-popup:after {
    border-top-color: white;
}
`;

export function run() {

    $(html).appendTo(".map");
    $(css).appendTo("head");

    let options = {
        srs: 'EPSG:4326',
        center: <[number, number]>[-82.4, 34.85],
        zoom: 15,
        basemap: "bing"
    }

    {
        let opts = <any>options;
        Object.keys(opts).forEach(k => {
            doif(getParameterByName(k), v => {
                let value = parse(v, opts[k]);
                if (value !== undefined) opts[k] = value;
            });
        });
    }

    let map = new ol.Map({
        target: $(".map")[0],
        keyboardEventTarget: document,
        loadTilesWhileAnimating: true,
        loadTilesWhileInteracting: true,
        controls: ol.control.defaults({ attribution: false }),
        view: new ol.View({
            projection: options.srs,
            center: options.center,
            zoom: options.zoom
        }),
        layers: [
            new ol.layer.Tile({
                opacity: 0.8,
                source: options.basemap !== "bing" ? new ol.source.OSM() : new ol.source.BingMaps({
                    key: 'AuPHWkNxvxVAL_8Z4G8Pcq_eOKGm5eITH_cJMNAyYoIC1S_29_HhE893YrUUbIGl',
                    imagerySet: 'Aerial'
                })
            })]
    });

    let features = new ol.Collection<ol.Feature>();

    let source = new ol.source.Vector({
        features: features
    });


    let layer = new ol.layer.Vector({
        source: source
    });

    map.addLayer(layer);

    let popup = new Popup({
        dockContainer: '.popup-container',
        pointerPosition: 100,
        positioning: "bottom-left",
        yOffset: 20,
        css: css_popup
    });
    popup.setMap(map);

    map.on("click", (event: {
        coordinate: [number, number];
    }) => {
        let location = event.coordinate.map(v => v.toFixed(5)).join(", ");
        let point = new ol.geom.Point(event.coordinate);
        point.set("location", location);
        let feature = new ol.Feature(point);
        feature.set("text", randomName());

        let textStyle = pointStyle.filter(p => p.text)[0];;
        if (textStyle && textStyle.text) {
            textStyle.text["offset-y"] = -24;
            textStyle.text.text = feature.get("text");
        }
        pointStyle[0].star.points = 3 + (Math.random() * 12) | 0;
        pointStyle[0].star.stroke.width = 1 + Math.random() * 5;
        let style = pointStyle.map(s => styler.fromJson(s));
        feature.setStyle((resolution: number) => style);

        source.addFeature(feature);

        setTimeout(() => popup.show(event.coordinate, `<div>You clicked on ${location}</div>`), 50);

    });

    let grid = Grid.create({
        expanded: true,
        labelAttributeName: "text"
    });

    map.addControl(grid);

    map.addControl(Grid.create({
        className: "ol-grid top left-2",
        currentExtent: true,
        hideButton: false,
        closedText: "+",
        openedText: "-",
        autoCollapse: false,
        autoSelect: false,
        canCollapse: true,
        showIcon: true,
        labelAttributeName: ""
    }));

    map.addControl(Grid.create({
        className: "ol-grid bottom left",
        currentExtent: true,
        hideButton: false,
        closedText: "+",
        openedText: "-",
        autoCollapse: true,
        autoSelect: false,
        canCollapse: true,
        showIcon: true,
        labelAttributeName: ""
    }));

    map.addControl(Grid.create({
        className: "ol-grid bottom right",
        currentExtent: true,
        hideButton: true,
        showIcon: true,
        labelAttributeName: "text"
    }));

    map.getControls().getArray()
        .filter(c => c instanceof Grid)
        .forEach(grid => grid.on("feature-click", (args: { feature: ol.Feature }) => {
            let center = args.feature.getGeometry().getClosestPoint(map.getView().getCenter());
            map.getView().animate({
                center: center
            });
            popup.show(center, args.feature.get("text"));
        }));

    return map;

}