declare module "ol3-grid/ol3-grid" {
    import ol = require("openlayers");
    export interface GridOptions {
        map?: ol.Map;
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
        placeholderText?: string;
        zoomDuration?: number;
        zoomPadding?: number;
        zoomMinResolution?: number;
        preprocessFeatures?: (feature: ol.Feature[]) => ol.Feature[];
    }
    export class Grid extends ol.control.Control {
        static DEFAULT_OPTIONS: GridOptions;
        static create(options?: GridOptions): Grid;
        private features;
        private button;
        private grid;
        private options;
        handlers: Array<() => void>;
        private constructor();
        destroy(): void;
        setPosition(position: string): void;
        cssin(): void;
        redraw(): void;
        private featureMap;
        add(feature: ol.Feature, layer?: ol.layer.Vector): void;
        remove(feature: ol.Feature, layer: ol.layer.Vector): void;
        clear(): void;
        collapse(): void;
        expand(): void;
        on(type: string, cb: Function): (ol.EventsKey | ol.EventsKey[]);
        on(type: "feature-click", cb: (evt: Event | {
            type: "feature-click";
            feature: ol.Feature;
            row: HTMLTableRowElement;
        }) => boolean | void): (ol.EventsKey | ol.EventsKey[]);
    }
}
declare module "index" {
    import Grid = require("ol3-grid/ol3-grid");
    export = Grid;
}
