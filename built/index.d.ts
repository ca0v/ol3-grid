declare module "bower_components/ol3-fun/ol3-fun/common" {
    export function parse<T>(v: string, type: T): T;
    export function getQueryParameters(options: any, url?: string): void;
    export function getParameterByName(name: string, url?: string): string;
    export function doif<T>(v: T, cb: (v: T) => void): void;
    export function mixin<A extends any, B extends any>(a: A, b: B): A & B;
    export function defaults<A extends any, B extends any>(a: A, ...b: B[]): A & B;
    export function cssin(name: string, css: string): () => void;
    export function debounce<T extends Function>(func: T, wait?: number, immediate?: boolean): T;
    /**
     * poor $(html) substitute due to being
     * unable to create <td>, <tr> elements
     */
    export function html(html: string): HTMLElement;
    export function pair<A, B>(a1: A[], a2: B[]): [A, B][];
    export function range(n: number): any[];
    export function shuffle<T>(array: T[]): T[];
}
declare module "bower_components/ol3-fun/index" {
    import common = require("bower_components/ol3-fun/ol3-fun/common");
    export = common;
}
declare module "bower_components/ol3-fun/ol3-fun/snapshot" {
    import ol = require("openlayers");
    class Snapshot {
        static render(canvas: HTMLCanvasElement, feature: ol.Feature): void;
        /**
         * convert features into data:image/png;base64;
         */
        static snapshot(feature: ol.Feature): string;
    }
    export = Snapshot;
}
declare module "bower_components/ol3-fun/ol3-fun/navigation" {
    import ol = require("openlayers");
    /**
     * A less disorienting way of changing the maps extent (maybe!)
     * Zoom out until new feature is visible
     * Zoom to that feature
     */
    export function zoomToFeature(map: ol.Map, feature: ol.Feature, options?: {
        duration?: number;
        padding?: number;
        minResolution?: number;
    }): void;
}
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
    }
    export class Grid extends ol.control.Control {
        static DEFAULT_OPTIONS: GridOptions;
        static create(options: GridOptions): Grid;
        private features;
        private button;
        private grid;
        private options;
        handlers: Array<() => void>;
        private constructor(options);
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
        on(type: string, cb: Function): ol.Object | ol.Object[];
        on(type: "feature-click", cb: (args: {
            type: "feature-click";
            feature: ol.Feature;
            row: HTMLTableRowElement;
        }) => void): void;
    }
}
declare module "index" {
    import Grid = require("ol3-grid/ol3-grid");
    export = Grid;
}
declare module "bower_components/ol3-symbolizer/ol3-symbolizer/format/base" {
    /**
     * implemented by all style serializers
     */
    export interface IConverter<T> {
        fromJson: (json: T) => ol.style.Style;
        toJson(style: ol.style.Style): T;
    }
}
declare module "bower_components/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer" {
    import ol = require("openlayers");
    import Serializer = require("bower_components/ol3-symbolizer/ol3-symbolizer/format/base");
    export namespace Format {
        type Color = number[] | string;
        type Size = number[];
        type Offset = number[];
        type LineDash = number[];
        interface Fill {
            color?: string;
            gradient?: {
                type?: string;
                stops?: string;
            };
        }
        interface Stroke {
            color?: string;
            width?: number;
            lineCap?: string;
            lineJoin?: string;
            lineDash?: LineDash;
            miterLimit?: number;
        }
        interface Style {
            fill?: Fill;
            image?: Image;
            stroke?: Stroke;
            text?: Text;
            zIndex?: number;
        }
        interface Image {
            opacity?: number;
            rotateWithView?: boolean;
            rotation?: number;
            scale?: number;
            snapToPixel?: boolean;
        }
        interface Circle {
            radius: number;
            stroke?: Stroke;
            fill?: Fill;
            snapToPixel?: boolean;
        }
        interface Star extends Image {
            angle?: number;
            fill?: Fill;
            points?: number;
            stroke?: Stroke;
            radius?: number;
            radius2?: number;
        }
        interface Icon extends Image {
            anchor?: Offset;
            anchorOrigin?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
            anchorXUnits?: "fraction" | "pixels";
            anchorYUnits?: "fraction" | "pixels";
            color?: Color;
            crossOrigin?: string;
            src?: string;
            offset?: Offset;
            offsetOrigin?: 'top_left' | 'top_right' | 'bottom-left' | 'bottom-right';
            size?: Size;
        }
        interface Text {
            fill?: Fill;
            font?: string;
            offsetX?: number;
            offsetY?: number;
            rotation?: number;
            scale?: number;
            stroke?: Stroke;
            text?: string;
            textAlign?: string;
            textBaseline?: string;
        }
    }
    export namespace Format {
        interface Style {
            image?: Icon & Svg;
            icon?: Icon;
            svg?: Svg;
            star?: Star;
            circle?: Circle;
            text?: Text;
            fill?: Fill;
            stroke?: Stroke;
        }
        interface Icon {
            "anchor-x"?: number;
            "anchor-y"?: number;
        }
        interface Text {
            "offset-x"?: number;
            "offset-y"?: number;
        }
        interface Circle {
            opacity?: number;
        }
        interface Svg {
            anchor?: Offset;
            anchorOrigin?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
            anchorXUnits?: string;
            anchorYUnits?: string;
            color?: Color;
            crossOrigin?: string;
            img?: string;
            imgSize?: Size;
            offset?: Offset;
            offsetOrigin?: 'top_left' | 'top_right' | 'bottom-left' | 'bottom-right';
            path?: string;
            stroke?: Stroke;
            fill?: Fill;
        }
    }
    export class StyleConverter implements Serializer.IConverter<Format.Style> {
        fromJson(json: Format.Style): ol.style.Style;
        toJson(style: ol.style.Style): Format.Style;
        /**
         * uses the interior point of a polygon when rendering a 'point' style
         */
        setGeometry(feature: ol.Feature): ol.geom.Geometry;
        private assign(obj, prop, value);
        private serializeStyle(style);
        private serializeColor(color);
        private serializeFill(fill);
        private deserializeStyle(json);
        private deserializeText(json);
        private deserializeCircle(json);
        private deserializeStar(json);
        private deserializeIcon(json);
        private deserializeSvg(json);
        private deserializeFill(json);
        private deserializeStroke(json);
        private deserializeColor(fill);
        private deserializeLinearGradient(json);
        private deserializeRadialGradient(json);
    }
}
declare module "bower_components/ol3-symbolizer/ol3-symbolizer/styles/star/flower" {
    var _default: {
        "star": {
            "fill": {
                "color": string;
            };
            "opacity": number;
            "stroke": {
                "color": string;
                "width": number;
            };
            "radius": number;
            "radius2": number;
            "points": number;
        };
        "text": {
            "fill": {
                "color": string;
            };
            "stroke": {
                "color": string;
                "width": number;
            };
            "text": string;
            "offset-x": number;
            "offset-y": number;
            "font": string;
        };
    }[];
    export = _default;
}
declare module "bower_components/ol3-symbolizer/index" {
    import Symbolizer = require("bower_components/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer");
    export = Symbolizer;
}
declare module "bower_components/ol3-draw/ol3-draw/ol3-button" {
    import ol = require("openlayers");
    import { StyleConverter } from "bower_components/ol3-symbolizer/index";
    export interface ButtonOptions extends olx.control.ControlOptions {
        map?: ol.Map;
        className?: string;
        position?: string;
        label?: string;
        title?: string;
        eventName?: string;
        buttonType?: typeof Button;
    }
    export class Button extends ol.control.Control {
        static DEFAULT_OPTIONS: ButtonOptions;
        static create(options?: ButtonOptions): Button;
        options: ButtonOptions;
        handlers: Array<() => void>;
        symbolizer: StyleConverter;
        constructor(options: ButtonOptions);
        setPosition(position: string): void;
        destroy(): void;
        cssin(): void;
        setMap(map: ol.Map): void;
    }
}
declare module "bower_components/ol3-draw/ol3-draw/ol3-draw" {
    import ol = require("openlayers");
    import { Button, ButtonOptions as ButtonOptions } from "bower_components/ol3-draw/ol3-draw/ol3-button";
    import { Format } from "bower_components/ol3-symbolizer/index";
    export interface DrawControlOptions extends ButtonOptions {
        map?: ol.Map;
        layers?: Array<ol.layer.Vector>;
        style?: Format.Style[];
        geometryType?: "Point" | "LineString" | "LinearRing" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon" | "GeometryCollection" | "Circle";
        geometryName?: string;
    }
    export class Draw extends Button {
        static DEFAULT_OPTIONS: DrawControlOptions;
        options: DrawControlOptions;
        static create(options?: DrawControlOptions): Button;
        private interactions;
        private createInteraction();
        constructor(options: DrawControlOptions);
    }
}
declare module "bower_components/ol3-draw/index" {
    /**
     * Consider ways of breaking from this pattern of just proxying
     * and provides some useful out-of-the-box configurations
     * e.g. create() puts all available control in a top-right toolbar
     */
    import Draw = require("bower_components/ol3-draw/ol3-draw/ol3-draw");
    export = Draw;
}
declare module "bower_components/ol3-draw/ol3-draw/ol3-edit" {
    import { Button, ButtonOptions as IButtonOptions } from "bower_components/ol3-draw/ol3-draw/ol3-button";
    import { Format } from "bower_components/ol3-symbolizer/index";
    export interface ModifyControlOptions extends IButtonOptions {
        style?: {
            [name: string]: Format.Style[];
        };
    }
    export class Modify extends Button {
        static DEFAULT_OPTIONS: ModifyControlOptions;
        static create(options?: ModifyControlOptions): Button;
        options: ModifyControlOptions;
        constructor(options: ModifyControlOptions);
    }
}
declare module "bower_components/ol3-draw/ol3-draw/ol3-delete" {
    import ol = require("openlayers");
    import { Button, ButtonOptions as IButtonOptions } from "bower_components/ol3-draw/ol3-draw/ol3-button";
    import { Format } from "bower_components/ol3-symbolizer/index";
    export interface DeleteControlOptions extends IButtonOptions {
        multi?: boolean;
        style?: {
            [name: string]: Format.Style[];
        };
        boxSelectCondition?: (mapBrowserEvent: ol.MapBrowserEvent) => boolean;
    }
    export class Delete extends Button {
        static DEFAULT_OPTIONS: DeleteControlOptions;
        options: DeleteControlOptions;
        static create(options?: DeleteControlOptions): Button;
        private featureLayerAssociation_;
        private addFeatureLayerAssociation(feature, layer);
        constructor(options: DeleteControlOptions);
    }
}
declare module "ol3-grid/examples/draw-edit-grid" {
    import ol = require("openlayers");
    export function run(): ol.Map;
}
declare module "ol3-grid/examples/index" {
    export function run(): void;
}
declare module "bower_components/ol3-popup/ol3-popup/paging/paging" {
    import ol = require("openlayers");
    import { Popup } from "bower_components/ol3-popup/ol3-popup/ol3-popup";
    export type SourceType = HTMLElement | string | JQueryDeferred<HTMLElement | string>;
    export type SourceCallback = () => SourceType;
    export interface IPaging {
        indexOf(feature: ol.Feature): number;
    }
    /**
     * Collection of "pages"
     */
    export class Paging extends ol.Observable implements IPaging {
        options: {
            popup: Popup;
        };
        private _pages;
        private _activeIndex;
        domNode: HTMLDivElement;
        constructor(options: {
            popup: Popup;
        });
        readonly activePage: {
            element: HTMLElement;
            callback?: SourceCallback;
            feature?: ol.Feature;
            location?: ol.geom.Geometry;
        };
        readonly activeIndex: number;
        readonly count: number;
        on(name: string, listener: () => void): any;
        on(name: "add", listener: (evt: {
            pageIndex: number;
            feature: ol.Feature;
            element: HTMLElement;
            geom: ol.geom.Geometry;
        }) => void): any;
        on(name: "clear", listener: () => void): any;
        on(name: "goto", listener: () => void): any;
        addFeature(feature: ol.Feature, options: {
            searchCoordinate: ol.Coordinate;
        }): void;
        add(source: SourceType | SourceCallback, geom?: ol.geom.Geometry): void;
        clear(): void;
        goto(index: number): void;
        next(): void;
        prev(): void;
        indexOf(feature: ol.Feature): number;
    }
}
declare module "bower_components/ol3-popup/ol3-popup/paging/page-navigator" {
    import ol = require("openlayers");
    import { Paging } from "bower_components/ol3-popup/ol3-popup/paging/paging";
    /**
     * The prior + next paging buttons and current page indicator
     */
    export default class PageNavigator extends ol.Observable {
        options: {
            pages: Paging;
        };
        private domNode;
        prevButton: HTMLButtonElement;
        nextButton: HTMLButtonElement;
        pageInfo: HTMLSpanElement;
        constructor(options: {
            pages: Paging;
        });
        template(): string;
        hide(): void;
        show(): void;
    }
}
declare module "bower_components/ol3-popup/ol3-popup/interaction" {
    import ol = require("openlayers");
    import { Popup } from "bower_components/ol3-popup/ol3-popup/ol3-popup";
    export interface SelectOptions extends olx.interaction.SelectOptions {
        map?: ol.Map;
        popup?: Popup;
    }
    export class SelectInteraction {
        private handlers;
        options: SelectOptions;
        static DEFAULT_OPTIONS: SelectOptions;
        static create(options: SelectOptions): SelectInteraction;
        private constructor(options);
        private setupOverlay();
        destroy(): void;
    }
}
declare module "bower_components/ol3-popup/ol3-popup/ol3-popup" {
    /**
     * OpenLayers 3 Popup Overlay.
     */
    import ol = require("openlayers");
    import { Paging } from "bower_components/ol3-popup/ol3-popup/paging/paging";
    /**
     * The constructor options 'must' conform, most interesting is autoPan
     */
    export interface PopupOptions extends olx.OverlayOptions {
        map: ol.Map;
        multi?: boolean;
        autoPopup?: boolean;
        dockContainer?: HTMLElement;
        className?: string;
        css?: string;
        pointerPosition?: number;
        xOffset?: number;
        yOffset?: number;
        pagingStyle?: (feature: ol.Feature, resolution: number, page: number) => ol.style.Style[];
        asContent?: (feature: ol.Feature) => HTMLElement;
        layers?: ol.layer.Vector[];
        showCoordinates?: boolean;
    }
    /**
     * This is the contract that will not break between versions
     */
    export interface IPopup_4_0_1<T> {
        show(position: ol.Coordinate, markup: string): T;
        hide(): T;
        isOpened(): boolean;
        destroy(): void;
        panIntoView(): void;
        isDocked(): boolean;
        applyOffset([x, y]: [number, number]): any;
        setPointerPosition(offset: number): any;
    }
    export interface IPopup extends IPopup_4_0_1<Popup> {
    }
    /**
     * The control formerly known as ol.Overlay.Popup
     */
    export class Popup extends ol.Overlay implements IPopup {
        options: PopupOptions & {
            parentNode?: HTMLElement;
        };
        content: HTMLDivElement;
        domNode: HTMLDivElement;
        private closer;
        private docker;
        pages: Paging;
        private handlers;
        static create(options: PopupOptions): Popup;
        private constructor(options);
        private injectCss(css);
        setIndictorPosition(): void;
        setPointerPosition(offset: number): void;
        setPosition(position: ol.Coordinate): void;
        panIntoView(): void;
        destroy(): void;
        dispatch(name: string): void;
        show(coord: ol.Coordinate, html: string | HTMLElement): this;
        hide(): this;
        isOpened(): boolean;
        isDocked(): boolean;
        dock(): void;
        undock(): void;
        applyOffset([x, y]: number[]): void;
    }
}
declare module "bower_components/ol3-popup/index" {
    /**
     * forces 'ol3-popup' namespace
     */
    import Popup = require("bower_components/ol3-popup/ol3-popup/ol3-popup");
    export = Popup;
}
declare module "ol3-grid/examples/ol3-grid" {
    import ol = require("openlayers");
    export function run(): ol.Map;
}
