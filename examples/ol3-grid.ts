import $ = require("jquery");
import ol = require("openlayers");
import { Grid } from "../../ol3-grid/index";
import { zoomToFeature } from "ol3-fun/ol3-fun/navigation";

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

    let layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.Collection<ol.Feature>()
        })
    });

    map.addLayer(layer);

    map.on("click", (event: any) => {
        let location = event.coordinate.map(v => v.toFixed(5)).join(", ");
        let point = new ol.geom.Point(event.coordinate);
        point.set("location", location);
        let feature = new ol.Feature(point);
        feature.set("text", randomName());

        feature.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: 20,
                stroke: new ol.style.Stroke({
                    width: 3,
                    color: "rgba(60, 120, 180, 1)"
                }),
                fill: new ol.style.Fill({
                    color: "rgba(120, 120, 180, 0.8)"
                })
            })
        }));

        layer.getSource().addFeature(feature);

    });

    Grid.create({
        map: map,
        layers: [layer],
        expanded: true,
        labelAttributeName: "text"
    });


    Grid.create({
        map: map,
        className: "ol-grid",
        position: "top left-2",
        layers: [layer],
        currentExtent: false,
        hideButton: false,
        closedText: "+",
        openedText: "-",
        autoCollapse: false,
        autoPan: false,
        canCollapse: true,
        showIcon: true,
        labelAttributeName: "",
        placeholderText: "Custom Handler",
        zoomDuration: 4000,
        zoomMinResolution: 8,
        zoomPadding: 1000
    }).on("feature-click", (args: { feature: ol.Feature }) => {
        let center = args.feature.getGeometry().getClosestPoint(map.getView().getCenter());
        zoomToFeature(map, args.feature, { padding: 50, minResolution: 1 / Math.pow(2, 20) });
        return true;
    });

    Grid.create({
        map: map,
        className: "ol-grid",
        position: "bottom left",
        layers: [layer],
        currentExtent: true,
        hideButton: false,
        closedText: "+",
        openedText: "-",
        autoCollapse: true,
        canCollapse: true,
        showIcon: true,
        labelAttributeName: ""
    });

    Grid.create({
        map: map,
        autoPan: true,
        className: "ol-grid",
        position: "bottom right",
        layers: [layer],
        currentExtent: true,
        hideButton: true,
        showIcon: true,
        labelAttributeName: "text"
    });

    return map;

}