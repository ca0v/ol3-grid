/// <reference types="jquery" />
declare module "node_modules/ol3-fun/ol3-fun/common" {
    /**
     * Generate a UUID
     * @returns UUID
     *
     * Adapted from http://stackoverflow.com/a/2117523/526860
     */
    export function uuid(): string;
    /**
     * Converts a GetElementsBy* to a classic array
     * @param list HTML collection to be converted to standard array
     * @returns The @param list represented as a native array of elements
     */
    export function asArray<T extends HTMLInputElement>(list: NodeList | HTMLCollectionOf<Element>): T[];
    /***
     * ie11 compatible version of e.classList.toggle
     * if class exists then remove it and return false, if not, then add it and return true.
     * @param force true to add specified class value, false to remove it.
     * @returns true if className exists.
     */
    export function toggle(e: HTMLElement, className: string, force?: boolean): boolean;
    /**
     * Converts a string representation of a value to it's desired type (e.g. parse("1", 0) returns 1)
     * @param v string representation of desired return value
     * @param type desired type
     * @returns @param v converted to a @param type
     */
    export function parse<T>(v: string, type: T): T;
    /**
     * Replaces the options elements with the actual query string parameter values (e.g. {a: 0, "?a=10"} becomes {a: 10})
     * @param options Attributes on this object with be assigned the value of the matching parameter in the query string
     * @param url The url to scan
     */
    export function getQueryParameters(options: any, url?: string): void;
    /**
     * Returns individual query string value from a url
     * @param name Extract parameter of this name from the query string
     * @param url Search this url
     * @returns parameter value
     */
    export function getParameterByName(name: string, url?: string): string;
    /**
     * Only execute callback when @param v is truthy
     * @param v passing a non-trivial value will invoke the callback with this as the sole argument
     * @param cb callback to execute when the value is non-trivial (not null, not undefined)
     */
    export function doif<T>(v: T, cb: (v: T) => void): void;
    /**
     * shallow copies b into a, replacing any existing values in a
     * @param a target
     * @param b values to shallow copy into target
     */
    export function mixin<A extends any, B extends any>(a: A, ...b: B[]): A & B;
    /**
     * shallow copies b into a, preserving any existing values in a
     * @param a target
     * @param b values to copy into target if they are not already present
     */
    export function defaults<A extends any, B extends any>(a: A, ...b: B[]): A & B;
    /**
     * delay execution of a method
     * @param func invoked after @param wait milliseconds
     * @param immediate true to invoke @param func before waiting
     */
    export function debounce<T extends Function>(func: T, wait?: number, immediate?: boolean): T;
    /**
     * poor $(html) substitute due to being
     * unable to create <td>, <tr> elements
     */
    export function html(html: string): HTMLElement;
    /**
     * returns all combinations of a1 with a2 (a1 X a2 pairs)
     * @param a1 1xN matrix of first elements
     * @param a2 1xN matrix of second elements
     * @returns 2xN^2 matrix of a1 x a2 combinations
     */
    export function pair<A, B>(a1: A[], a2: B[]): [A, B][];
    /**
     * Returns an array [0..n)
     * @param n number of elements
     */
    export function range(n: number): number[];
    /**
     * in-place shuffling of an array
     * @see http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * @param array array to randomize
     */
    export function shuffle<T>(array: T[]): T[];
}
declare module "node_modules/ol3-fun/ol3-fun/css" {
    /**
     * Adds exactly one instance of the CSS to the app with a mechanism
     * for disposing by invoking the destructor returned by this method.
     * Note the css will not be removed until the dependency count reaches
     * 0 meaning the number of calls to cssin('id') must match the number
     * of times the destructor is invoked.
     * let d1 = cssin('foo', '.foo { background: white }');
     * let d2 = cssin('foo', '.foo { background: white }');
     * d1(); // reduce dependency count
     * d2(); // really remove the css
     * @param name unique id for this style tag
     * @param css css content
     * @returns destructor
     */
    export function cssin(name: string, css: string): () => void;
    export function loadCss(options: {
        name: string;
        url?: string;
        css?: string;
    }): () => void;
}
declare module "node_modules/ol3-fun/ol3-fun/navigation" {
    import * as ol from "openlayers";
    /**
     * A less disorienting way of changing the maps extent (maybe!)
     * Zoom out until new feature is visible
     * Zoom to that feature
     * @param map The openlayers map
     * @param feature The feature to zoom to
     * @param options Animation constraints
     */
    export function zoomToFeature(map: ol.Map, feature: ol.Feature, options?: {
        duration?: number;
        padding?: number;
        minResolution?: number;
    }): JQuery.Deferred<any, any, any>;
}
declare module "node_modules/ol3-fun/ol3-fun/parse-dms" {
    /**
     * Converts DMS<->LonLat
     * @param value A DMS string or lonlat coordinate to be converted
     */
    export function parse(value: {
        lon: number;
        lat: number;
    }): string;
    export function parse(value: string): {
        lon: number;
        lat: number;
    } | number;
}
declare module "node_modules/ol3-fun/ol3-fun/slowloop" {
    /**
     * Executes a series of functions in a delayed manner
     * @param functions one function executes per interval
     * @param interval length of the interval in milliseconds
     * @param cycles number of types to run each function
     * @returns promise indicating the process is complete
     */
    export function slowloop(functions: Array<Function>, interval?: number, cycles?: number): JQuery.Deferred<any, any, any>;
}
declare module "node_modules/ol3-fun/ol3-fun/is-primitive" {
    export function isPrimitive(a: any): boolean;
}
declare module "node_modules/ol3-fun/ol3-fun/is-cyclic" {
    /**
     * Determine if an object refers back to itself
     */
    export function isCyclic(a: any): boolean;
}
declare module "node_modules/ol3-fun/ol3-fun/deep-extend" {
    /**
     * Each merge action is recorded in a trace item
     */
    export interface TraceItem {
        path?: Path;
        target: Object;
        key: string | number;
        value: any;
        was: any;
    }
    /**
     * Internally tracks visited objects for cycle detection
     */
    type History = Array<object>;
    type Path = Array<any>;
    /**
     * deep mixin, replacing items in a with items in b
     * array items with an "id" are used to identify pairs, otherwise b overwrites a
     * @param a object to extend
     * @param b data to inject into the object
     * @param trace optional change tracking
     * @param history object added here are not visited
     */
    export function extend<A extends object>(a: A, b?: Partial<A>, trace?: Array<TraceItem>, history?: History): A;
}
declare module "node_modules/ol3-fun/ol3-fun/extensions" {
    /**
     * Stores associated data in an in-memory repository using a WeakMap
     */
    export class Extensions {
        private hash;
        isExtended(o: any): boolean;
        /**
        Forces the existence of an extension container for an object
        @param o the object of interest
        @param [ext] sets these value on the extension object
        @returns the extension object
        */
        extend<T extends object, U extends any>(o: T, ext?: U): U;
        /**
        Ensures extensions are shared across objects
        */
        bind(o1: any, o2: any): void;
    }
}
declare module "node_modules/ol3-fun/index" {
    /**
     * decouples API from implementation
     */
    import { asArray, debounce, defaults, doif, getParameterByName, getQueryParameters, html, mixin, pair, parse, range, shuffle, toggle, uuid } from "node_modules/ol3-fun/ol3-fun/common";
    import { cssin, loadCss } from "node_modules/ol3-fun/ol3-fun/css";
    import { zoomToFeature } from "node_modules/ol3-fun/ol3-fun/navigation";
    import { parse as dmsParse } from "node_modules/ol3-fun/ol3-fun/parse-dms";
    import { slowloop } from "node_modules/ol3-fun/ol3-fun/slowloop";
    import { extend as deepExtend } from "node_modules/ol3-fun/ol3-fun/deep-extend";
    import { Extensions } from "node_modules/ol3-fun/ol3-fun/extensions";
    let index: {
        asArray: typeof asArray;
        cssin: typeof cssin;
        loadCss: typeof loadCss;
        debounce: typeof debounce;
        defaults: typeof defaults;
        doif: typeof doif;
        deepExtend: typeof deepExtend;
        getParameterByName: typeof getParameterByName;
        getQueryParameters: typeof getQueryParameters;
        html: typeof html;
        mixin: typeof mixin;
        pair: typeof pair;
        parse: typeof parse;
        range: typeof range;
        shuffle: typeof shuffle;
        toggle: typeof toggle;
        uuid: typeof uuid;
        slowloop: typeof slowloop;
        dms: {
            parse: typeof dmsParse;
            fromDms: (dms: string) => {
                lon: number;
                lat: number;
            };
            fromLonLat: (o: {
                lon: number;
                lat: number;
            }) => string;
        };
        navigation: {
            zoomToFeature: typeof zoomToFeature;
        };
        Extensions: typeof Extensions;
    };
    export = index;
}
declare module "node_modules/ol3-fun/ol3-fun/snapshot" {
    import ol = require("openlayers");
    /**
     * Converts a feature to an image
     */
    class Snapshot {
        /**
         * @param canvas Canvas which will contain the feature
         * @param feature Feature to render on the canvas, the style must be assigned to the style
         */
        static render(canvas: HTMLCanvasElement, feature: ol.Feature): void;
        /**
         * @param feature Feature to render as image data
         * @return convert features into data:image/png;base64;
         */
        static snapshot(feature: ol.Feature, size?: number): string;
    }
    export = Snapshot;
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
