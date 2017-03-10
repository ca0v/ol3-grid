import ol = require("openlayers");
import { cssin, debounce, defaults, html, mixin, pair, range } from "ol3-fun";
import Snapshot = require("ol3-fun/ol3-fun/snapshot");
import { zoomToFeature } from "ol3-fun/ol3-fun/navigation";

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

export interface GridOptions {
    map?: ol.Map;
    // what css class name to assign to the main element
    className?: string;
    position?: string;
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
    // zoom-to-feature options
    zoomDuration?: number;
    zoomPadding?: number;
    zoomMinResolution?: number;
}

const expando = {
    right: '»',
    left: '«'
};

export class Grid extends ol.control.Control {

    static DEFAULT_OPTIONS: GridOptions = {
        className: 'ol-grid',
        position: 'top right',
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
        // what to show on the tooltip
        placeholderText: 'Features',
        // zoom-to-feature options
        zoomDuration: 2000,
        zoomPadding: 256,
        zoomMinResolution: 1 / Math.pow(2, 22)
    }

    static create(options: GridOptions): Grid {

        // provide computed and static defaults
        options = defaults(mixin({
            openedText: options.position && -1 < options.position.indexOf("left") ? expando.left : expando.right,
            closedText: options.position && -1 < options.position.indexOf("left") ? expando.right : expando.left,
        }, options), Grid.DEFAULT_OPTIONS);

        let element = document.createElement('div');
        element.className = `${options.className} ${options.position} ${olcss.CLASS_UNSELECTABLE} ${olcss.CLASS_CONTROL}`;

        let gridOptions = mixin({
            map: options.map,
            element: element,
            expanded: false
        }, options);

        let grid = new Grid(gridOptions);
        if (options.map) {
            options.map.addControl(grid);
        }

        grid.handlers.push(() => element.remove());

        return grid;
    }

    private features: ol.source.Vector;

    private button: HTMLButtonElement;
    private grid: HTMLTableElement;

    private options: GridOptions;
    public handlers: Array<() => void>;

    private constructor(options: GridOptions) {

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
        this.featureMap = [];
        this.handlers = [];

        this.cssin();

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

        if (this.options.currentExtent) {
            this.options.map.getView().on(["change:center", "change:resolution"], debounce(() => this.redraw()));
        }

        if (this.options.layers) {
            this.options.layers.forEach(l => {
                let source = l.getSource();
                source.on("addfeature", (args: { feature: ol.Feature }) => {
                    this.add(args.feature, l);
                });
                source.on("removefeature", (args: { feature: ol.Feature }) => {
                    this.remove(args.feature, l);
                });
            });
        }

    }

    destroy() {
        this.handlers.forEach(h => h());
        this.setTarget(null);
    }

    setPosition(position: string) {
        this.options.position.split(' ')
            .forEach(k => this.options.element.classList.remove(k));

        position.split(' ')
            .forEach(k => this.options.element.classList.add(k));

        this.options.position = position;
    }

    cssin() {
        let className = this.options.className;
        let positions = pair("top left right bottom".split(" "), range(24))
            .map(pos => `.${className}.${pos[0] + (-pos[1] || '')} { ${pos[0]}:${0.5 + pos[1]}em; }`);

        this.handlers.push(cssin(className,
            `
.${className} .${className}-container {
    max-height: 16em;
    overflow-y: auto;
}
.${className} .${className}-container.ol-hidden {
    display: none;
}
.${className} .feature-row {
    cursor: pointer;
}
.${className} .feature-row:hover {
    background: black;
    color: white;
}
.${className} .feature-row:focus {
    background: #ccc;
    color: black;
}
${positions.join('\n')}
`
        ));
    }

    redraw() {
        let options = this.options;
        let map = options.map;

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
                        zoomToFeature(map, feature, {
                            duration: options.zoomDuration,
                            padding: options.zoomPadding,
                            minResolution: options.zoomMinResolution
                        });
                    }
                }));

            tbody.appendChild(tr);

        });
    }

    private featureMap: Array<{ f1: ol.Feature, f2: ol.Feature }>;

    add(feature: ol.Feature, layer?: ol.layer.Vector) {
        let style = feature.getStyle();
        if (!style && layer && this.options.showIcon) {
            style = layer.getStyleFunction()(feature, 0);
            // need to capture style but don't want to effect original feature
            let originalFeature = feature;
            feature = originalFeature.clone();
            feature.setStyle(style);
            // how to keep geometry in sync?
            originalFeature.on("change", debounce(() => {
                feature.setGeometry(originalFeature.getGeometry());
                this.redraw();
            }));
            this.featureMap.push({ f1: originalFeature, f2: feature });
        }
        this.features.addFeature(feature);
    }

    remove(feature: ol.Feature, layer: ol.layer.Vector) {
        this.featureMap.filter(map => map.f1 === feature).forEach(m => this.features.removeFeature(m.f2));
        this.redraw();
    }

    clear() {
        let tbody = this.grid.tBodies[0];
        tbody.innerHTML = "";
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