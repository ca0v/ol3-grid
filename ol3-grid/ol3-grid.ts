import ol = require("openlayers");
import { html, mixin, cssin, debounce } from "ol3-fun/ol3-fun/common";
import Snapshot = require("ol3-fun/ol3-fun/snapshot");

const css = `
    .ol-grid {
        position:absolute;
    }
    .ol-grid.top {
        top: 0.5em;
    }
    .ol-grid.top-1 {
        top: 1.5em;
    }
    .ol-grid.top-2 {
        top: 2.5em;
    }
    .ol-grid.top-3 {
        top: 3.5em;
    }
    .ol-grid.top-4 {
        top: 4.5em;
    }
    .ol-grid.left {
        left: 0.5em;
    }
    .ol-grid.left-1 {
        left: 1.5em;
    }
    .ol-grid.left-2 {
        left: 2.5em;
    }
    .ol-grid.left-3 {
        left: 3.5em;
    }
    .ol-grid.left-4 {
        left: 4.5em;
    }
    .ol-grid.bottom {
        bottom: 0.5em;
    }
    .ol-grid.bottom-1 {
        bottom: 1.5em;
    }
    .ol-grid.bottom-2 {
        bottom: 2.5em;
    }
    .ol-grid.bottom-3 {
        bottom: 3.5em;
    }
    .ol-grid.bottom-4 {
        bottom: 4.5em;
    }
    .ol-grid.right {
        right: 0.5em;
    }
    .ol-grid.right-1 {
        right: 1.5em;
    }
    .ol-grid.right-2 {
        right: 2.5em;
    }
    .ol-grid.right-3 {
        right: 3.5em;
    }
    .ol-grid.right-4 {
        right: 4.5em;
    }
    .ol-grid .ol-grid-container {
        max-height: 16em;
        overflow-y: auto;
    }
    .ol-grid .ol-grid-container.ol-hidden {
        display: none;
    }
    .ol-grid .feature-row {
        cursor: pointer;
    }
    .ol-grid .feature-row:hover {
        background: black;
        color: white;
    }
    .ol-grid .feature-row:focus {
        background: #ccc;
        color: black;
    }
`;

const grid_html = `
<div class='ol-grid-container'>
    <table class='ol-grid-table'>
        <tbody><tr><td/></tr></tbody>
    </table>
</div>
`;

let olcss = {
    CLASS_CONTROL: 'ol-control',
    CLASS_UNSELECTABLE: 'ol-unselectable',
    CLASS_UNSUPPORTED: 'ol-unsupported',
    CLASS_HIDDEN: 'ol-hidden'
};

export interface IOptions {
    // what css class name to assign to the main element
    className?: string;
    expanded?: boolean;
    hideButton?: boolean;
    autoCollapse?: boolean;
    autoPan?: boolean;
    canCollapse?: boolean;
    currentExtent?: boolean;
    showIcon?: boolean;
    labelAttributeName?: string;
    closedText?: string;
    openedText?: string;
    element?: HTMLElement;
    target?: HTMLElement;
    layers?: ol.layer.Vector[];
    // what to show on the tooltip
    placeholderText?: string;
}

const expando = {
    right: '»',
    left: '«'
};

const defaults: IOptions = {
    className: 'ol-grid top right',
    expanded: false,
    autoCollapse: true,
    autoPan: true,
    canCollapse: true,
    currentExtent: true,
    hideButton: false,
    showIcon: false,
    labelAttributeName: "",
    closedText: expando.right,
    openedText: expando.left,
    placeholderText: 'Features'
};

export class Grid extends ol.control.Control {

    static create(options: IOptions = {}): Grid {

        cssin('ol-grid', css);

        // provide computed defaults        
        options = mixin({
            openedText: options.className && -1 < options.className.indexOf("left") ? expando.left : expando.right,
            closedText: options.className && -1 < options.className.indexOf("left") ? expando.right : expando.left,
        }, options || {});

        // provide static defaults        
        options = mixin(mixin({}, defaults), options);

        let element = document.createElement('div');
        element.className = `${options.className} ${olcss.CLASS_UNSELECTABLE} ${olcss.CLASS_CONTROL}`;

        let gridOptions = mixin({
            element: element,
            expanded: false
        }, options);

        return new Grid(gridOptions);
    }

    private features: ol.source.Vector;

    private button: HTMLButtonElement;
    private grid: HTMLTableElement;

    private options: IOptions;

    constructor(options: IOptions) {

        if (options.hideButton) {
            options.canCollapse = false;
            options.autoCollapse = false;
            options.expanded = true;
        }

        super({
            element: options.element,
            target: options.target
        });

        this.options = options;
        this.features = new ol.source.Vector();

        let button = this.button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.title = options.placeholderText;
        options.element.appendChild(button);
        if (options.hideButton) {
            button.style.display = "none";
        }

        let grid = html(grid_html.trim());
        this.grid = <HTMLTableElement>grid.getElementsByClassName("ol-grid-table")[0];

        options.element.appendChild(grid);

        if (this.options.autoCollapse) {
            button.addEventListener("mouseover", () => {
                !options.expanded && this.expand();
            });
            button.addEventListener("focus", () => {
                !options.expanded && this.expand();
            });
            button.addEventListener("blur", () => {
                options.expanded && this.collapse();
            });
        }
        button.addEventListener("click", () => {
            options.expanded ? this.collapse() : this.expand();
        });

        options.expanded ? this.expand() : this.collapse();

        // render
        this.features.on(["addfeature", "addfeatures"], debounce(() => this.redraw()));
    }

    redraw() {
        let map = this.getMap();
        let extent = map.getView().calculateExtent(map.getSize());
        let tbody = this.grid.tBodies[0];
        tbody.innerHTML = "";

        let features = <ol.Feature[]>[];
        if (this.options.currentExtent) {
            this.features.forEachFeatureInExtent(extent, f => void features.push(f));
        } else {
            this.features.forEachFeature(f => void features.push(f));
        }

        features.forEach(feature => {
            let tr = document.createElement("tr");
            tr.tabIndex = 0;
            tr.className = "feature-row";

            if (this.options.showIcon) {
                let td = document.createElement("td");
                let canvas = document.createElement("canvas");
                td.appendChild(canvas);
                canvas.className = "icon";
                canvas.width = 160;
                canvas.height = 64;
                tr.appendChild(td);
                Snapshot.render(canvas, feature);
            }

            if (this.options.labelAttributeName) {
                let td = document.createElement("td");
                let label = html(`<label class="label">${feature.get(this.options.labelAttributeName)}</label>`);
                td.appendChild(label);
                tr.appendChild(td);
            }

            ["click", "keypress"].forEach(k =>
                tr.addEventListener(k, () => {
                    if (this.options.autoCollapse) {
                        this.collapse();
                    }
                    this.dispatchEvent({
                        type: "feature-click",
                        feature: feature,
                        row: tr[0]
                    });
                    if (this.options.autoPan) {
                        let center = feature.getGeometry().getClosestPoint(map.getView().getCenter());
                        map.getView().animate({
                            center: center
                        });
                    }
                }));

            tbody.appendChild(tr);

        });
    }

    add(feature: ol.Feature, layer?: ol.layer.Vector) {
        let style = feature.getStyle();
        if (!style && layer && this.options.showIcon) {
            style = layer.getStyleFunction()(feature, 0);
            feature.setStyle(style);
        }
        this.features.addFeature(feature);
    }

    clear() {
        let tbody = this.grid.tBodies[0];
        tbody.innerHTML = "";
    }

    setMap(map: ol.Map) {
        super.setMap(map);

        if (this.options.currentExtent) {
            map.getView().on(["change:center", "change:resolution"], debounce(() => this.redraw()));
        }

        if (this.options.layers) {
            this.options.layers.forEach(l => l.getSource().on("addfeature", (args: { feature: ol.Feature }) => {
                this.add(args.feature, l);
            }));
        }
    }

    collapse() {
        let options = this.options;
        if (!options.canCollapse) return;
        options.expanded = false;
        this.grid.parentElement.classList.toggle(olcss.CLASS_HIDDEN, true);
        this.button.classList.toggle(olcss.CLASS_HIDDEN, false);
        this.button.innerHTML = options.closedText;
    }

    expand() {
        let options = this.options;
        options.expanded = true;
        this.grid.parentElement.classList.toggle(olcss.CLASS_HIDDEN, false);
        this.button.classList.toggle(olcss.CLASS_HIDDEN, true);
        this.button.innerHTML = options.openedText;
    }

    on(type: string, cb: Function): ol.Object | ol.Object[];
    on(type: "feature-click", cb: (args: {
        type: "feature-click";
        feature: ol.Feature;
        row: HTMLTableRowElement;
    }) => void): void;
    on(type: string, cb: Function) {
        return super.on(type, cb);
    }
}