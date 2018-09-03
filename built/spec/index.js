var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("tests/base", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function describe(title, cb) {
        console.log(title || "undocumented test group");
        return window.describe(title, cb);
    }
    exports.describe = describe;
    function it(title, cb) {
        console.log(title || "undocumented test");
        return window.it(title, cb);
    }
    exports.it = it;
    function should(result, message) {
        console.log(message || "undocumented assertion");
        if (!result)
            throw message;
    }
    exports.should = should;
    function shouldEqual(a, b, message) {
        if (a != b)
            console.warn(a + " <> " + b);
        should(a == b, message);
    }
    exports.shouldEqual = shouldEqual;
    function stringify(o) {
        return JSON.stringify(o, null, "\t");
    }
    exports.stringify = stringify;
});
define("node_modules/ol3-fun/ol3-fun/common", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    exports.uuid = uuid;
    function asArray(list) {
        var result = new Array(list.length);
        for (var i = 0; i < list.length; i++) {
            result[i] = list[i];
        }
        return result;
    }
    exports.asArray = asArray;
    function toggle(e, className, force) {
        var exists = e.classList.contains(className);
        if (exists && force !== true) {
            e.classList.remove(className);
            return false;
        }
        ;
        if (!exists && force !== false) {
            e.classList.add(className);
            return true;
        }
        return exists;
    }
    exports.toggle = toggle;
    function parse(v, type) {
        if (typeof type === "string")
            return v;
        if (typeof type === "number")
            return parseFloat(v);
        if (typeof type === "boolean")
            return (v === "1" || v === "true");
        if (Array.isArray(type)) {
            return (v.split(",").map(function (v) { return parse(v, type[0]); }));
        }
        throw "unknown type: " + type;
    }
    exports.parse = parse;
    function getQueryParameters(options, url) {
        if (url === void 0) { url = window.location.href; }
        var opts = options;
        Object.keys(opts).forEach(function (k) {
            doif(getParameterByName(k, url), function (v) {
                var value = parse(v, opts[k]);
                if (value !== undefined)
                    opts[k] = value;
            });
        });
    }
    exports.getQueryParameters = getQueryParameters;
    function getParameterByName(name, url) {
        if (url === void 0) { url = window.location.href; }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    exports.getParameterByName = getParameterByName;
    function doif(v, cb) {
        if (v !== undefined && v !== null)
            cb(v);
    }
    exports.doif = doif;
    function mixin(a, b) {
        Object.keys(b).forEach(function (k) { return a[k] = b[k]; });
        return a;
    }
    exports.mixin = mixin;
    function defaults(a) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        b.forEach(function (b) {
            Object.keys(b).filter(function (k) { return a[k] === undefined; }).forEach(function (k) { return a[k] = b[k]; });
        });
        return a;
    }
    exports.defaults = defaults;
    function cssin(name, css) {
        var id = "style-" + name;
        var styleTag = document.getElementById(id);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = id;
            styleTag.type = "text/css";
            document.head.appendChild(styleTag);
            styleTag.appendChild(document.createTextNode(css));
        }
        var dataset = styleTag.dataset;
        dataset["count"] = parseInt(dataset["count"] || "0") + 1 + "";
        return function () {
            dataset["count"] = parseInt(dataset["count"] || "0") - 1 + "";
            if (dataset["count"] === "0") {
                styleTag.remove();
            }
        };
    }
    exports.cssin = cssin;
    function debounce(func, wait, immediate) {
        if (wait === void 0) { wait = 50; }
        if (immediate === void 0) { immediate = false; }
        var timeout;
        return (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var later = function () {
                timeout = null;
                if (!immediate)
                    func.apply({}, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = window.setTimeout(later, wait);
            if (callNow)
                func.apply({}, args);
        });
    }
    exports.debounce = debounce;
    function html(html) {
        var a = document.createElement("div");
        a.innerHTML = html;
        return (a.firstElementChild || a.firstChild);
    }
    exports.html = html;
    function pair(a1, a2) {
        var result = new Array(a1.length * a2.length);
        var i = 0;
        a1.forEach(function (v1) { return a2.forEach(function (v2) { return result[i++] = [v1, v2]; }); });
        return result;
    }
    exports.pair = pair;
    function range(n) {
        var result = new Array(n);
        for (var i = 0; i < n; i++)
            result[i] = i;
        return result;
    }
    exports.range = range;
    function shuffle(array) {
        var currentIndex = array.length;
        var temporaryValue;
        var randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    exports.shuffle = shuffle;
});
define("node_modules/ol3-fun/ol3-fun/navigation", ["require", "exports", "openlayers", "jquery", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, ol, $, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function zoomToFeature(map, feature, options) {
        var promise = $.Deferred();
        options = common_1.defaults(options || {}, {
            duration: 1000,
            padding: 256,
            minResolution: 2 * map.getView().getMinResolution()
        });
        var view = map.getView();
        var currentExtent = view.calculateExtent(map.getSize());
        var targetExtent = feature.getGeometry().getExtent();
        var doit = function (duration) {
            view.fit(targetExtent, {
                size: map.getSize(),
                padding: [options.padding, options.padding, options.padding, options.padding],
                minResolution: options.minResolution,
                duration: duration,
                callback: function () { return promise.resolve(); },
            });
        };
        if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            doit(options.duration);
        }
        else if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            doit(options.duration);
        }
        else {
            var fullExtent = ol.extent.createEmpty();
            ol.extent.extend(fullExtent, currentExtent);
            ol.extent.extend(fullExtent, targetExtent);
            var dscale = ol.extent.getWidth(fullExtent) / ol.extent.getWidth(currentExtent);
            var duration = 0.5 * options.duration;
            view.fit(fullExtent, {
                size: map.getSize(),
                padding: [options.padding, options.padding, options.padding, options.padding],
                minResolution: options.minResolution,
                duration: duration
            });
            setTimeout(function () { return doit(0.5 * options.duration); }, duration);
        }
        return promise;
    }
    exports.zoomToFeature = zoomToFeature;
});
define("node_modules/ol3-fun/ol3-fun/parse-dms", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function decDegFromMatch(m) {
        var signIndex = {
            "-": -1,
            "N": 1,
            "S": -1,
            "E": 1,
            "W": -1
        };
        var latLonIndex = {
            "-": "",
            "N": "lat",
            "S": "lat",
            "E": "lon",
            "W": "lon"
        };
        var degrees, minutes, seconds, sign, latLon;
        sign = signIndex[m[2]] || signIndex[m[1]] || signIndex[m[6]] || 1;
        degrees = Number(m[3]);
        minutes = m[4] ? Number(m[4]) : 0;
        seconds = m[5] ? Number(m[5]) : 0;
        latLon = latLonIndex[m[1]] || latLonIndex[m[6]];
        if (!inRange(degrees, 0, 180))
            throw 'Degrees out of range';
        if (!inRange(minutes, 0, 60))
            throw 'Minutes out of range';
        if (!inRange(seconds, 0, 60))
            throw 'Seconds out of range';
        return {
            decDeg: sign * (degrees + minutes / 60 + seconds / 3600),
            latLon: latLon
        };
    }
    function inRange(value, a, b) {
        return value >= a && value <= b;
    }
    function parse(dmsString) {
        var _a;
        dmsString = dmsString.trim();
        var dmsRe = /([NSEW])?(-)?(\d+(?:\.\d+)?)[°º:d\s]?\s?(?:(\d+(?:\.\d+)?)['’‘′:]\s?(?:(\d{1,2}(?:\.\d+)?)(?:"|″|’’|'')?)?)?\s?([NSEW])?/i;
        var dmsString2;
        var m1 = dmsString.match(dmsRe);
        if (!m1)
            throw 'Could not parse string';
        if (m1[1]) {
            m1[6] = undefined;
            dmsString2 = dmsString.substr(m1[0].length - 1).trim();
        }
        else {
            dmsString2 = dmsString.substr(m1[0].length).trim();
        }
        var decDeg1 = decDegFromMatch(m1);
        var m2 = dmsString2.match(dmsRe);
        var decDeg2 = m2 && decDegFromMatch(m2);
        if (typeof decDeg1.latLon === 'undefined') {
            if (!isNaN(decDeg1.decDeg) && decDeg2 && isNaN(decDeg2.decDeg)) {
                return decDeg1.decDeg;
            }
            else if (!isNaN(decDeg1.decDeg) && decDeg2 && !isNaN(decDeg2.decDeg)) {
                decDeg1.latLon = 'lat';
                decDeg2.latLon = 'lon';
            }
            else {
                throw 'Could not parse string';
            }
        }
        if (typeof decDeg2.latLon === 'undefined') {
            decDeg2.latLon = decDeg1.latLon === 'lat' ? 'lon' : 'lat';
        }
        return _a = {},
            _a[decDeg1.latLon] = decDeg1.decDeg,
            _a[decDeg2.latLon] = decDeg2.decDeg,
            _a;
    }
    exports.parse = parse;
});
define("node_modules/ol3-fun/index", ["require", "exports", "node_modules/ol3-fun/ol3-fun/common", "node_modules/ol3-fun/ol3-fun/navigation", "node_modules/ol3-fun/ol3-fun/parse-dms"], function (require, exports, common, navigation, dms) {
    "use strict";
    var index = common.defaults(common, {
        dms: dms,
        navigation: navigation
    });
    return index;
});
define("node_modules/ol3-fun/ol3-fun/snapshot", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    function getStyle(feature) {
        var style = feature.getStyle();
        if (!style) {
            var styleFn = feature.getStyleFunction();
            if (styleFn) {
                style = styleFn(0);
            }
        }
        if (!style) {
            style = new ol.style.Style({
                text: new ol.style.Text({
                    text: "?"
                })
            });
        }
        if (!Array.isArray(style))
            style = [style];
        return style;
    }
    var Snapshot = (function () {
        function Snapshot() {
        }
        Snapshot.render = function (canvas, feature) {
            feature = feature.clone();
            var geom = feature.getGeometry();
            var extent = geom.getExtent();
            var _a = ol.extent.getCenter(extent), cx = _a[0], cy = _a[1];
            var _b = [ol.extent.getWidth(extent), ol.extent.getHeight(extent)], w = _b[0], h = _b[1];
            var isPoint = w === 0 || h === 0;
            var ff = 1 / (window.devicePixelRatio || 1);
            var scale = isPoint ? 1 : Math.min(ff * canvas.width / w, ff * canvas.height / h);
            geom.translate(-cx, -cy);
            geom.scale(scale, -scale);
            geom.translate(Math.ceil(ff * canvas.width / 2), Math.ceil(ff * canvas.height / 2));
            console.log(scale, cx, cy, w, h, geom.getCoordinates());
            var vtx = ol.render.toContext(canvas.getContext("2d"));
            var styles = getStyle(feature);
            if (!Array.isArray(styles))
                styles = [styles];
            styles.forEach(function (style) { return vtx.drawFeature(feature, style); });
        };
        Snapshot.snapshot = function (feature, size) {
            if (size === void 0) { size = 128; }
            var canvas = document.createElement("canvas");
            canvas.width = canvas.height = size;
            this.render(canvas, feature);
            return canvas.toDataURL();
        };
        return Snapshot;
    }());
    return Snapshot;
});
define("ol3-grid/ol3-grid", ["require", "exports", "openlayers", "node_modules/ol3-fun/index", "node_modules/ol3-fun/ol3-fun/snapshot", "node_modules/ol3-fun/ol3-fun/navigation"], function (require, exports, ol, index_1, Snapshot, navigation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var grid_html = "\n<div class='ol-grid-container'>\n    <table class='ol-grid-table'>\n        <tbody><tr><td/></tr></tbody>\n    </table>\n</div>\n";
    var olcss = {
        CLASS_CONTROL: 'ol-control',
        CLASS_UNSELECTABLE: 'ol-unselectable',
        CLASS_UNSUPPORTED: 'ol-unsupported',
        CLASS_HIDDEN: 'ol-hidden'
    };
    var expando = {
        right: '»',
        left: '«'
    };
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid(options) {
            var _this = this;
            if (options.hideButton) {
                options.canCollapse = false;
                options.autoCollapse = false;
                options.expanded = true;
            }
            _this = _super.call(this, {
                element: options.element,
                target: options.target
            }) || this;
            _this.options = options;
            _this.features = new ol.source.Vector();
            _this.featureMap = [];
            _this.handlers = [];
            _this.cssin();
            var button = _this.button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.title = options.placeholderText;
            options.element.appendChild(button);
            if (options.hideButton) {
                button.style.display = "none";
            }
            var grid = index_1.html(grid_html.trim());
            _this.grid = grid.getElementsByClassName("ol-grid-table")[0];
            options.element.appendChild(grid);
            if (_this.options.autoCollapse) {
                button.addEventListener("mouseover", function () {
                    !options.expanded && _this.expand();
                });
                button.addEventListener("focus", function () {
                    !options.expanded && _this.expand();
                });
                button.addEventListener("blur", function () {
                    options.expanded && _this.collapse();
                });
            }
            button.addEventListener("click", function () {
                options.expanded ? _this.collapse() : _this.expand();
            });
            options.expanded ? _this.expand() : _this.collapse();
            _this.features.on(["addfeature", "addfeatures"], index_1.debounce(function () { return _this.redraw(); }));
            if (_this.options.currentExtent) {
                if (!_this.options.map)
                    throw "must provide a map when currentExtent is true";
                _this.options.map.getView().on(["change:center", "change:resolution"], index_1.debounce(function () { return _this.redraw(); }));
            }
            if (_this.options.layers) {
                _this.options.layers.forEach(function (l) {
                    var source = l.getSource();
                    source.on("addfeature", function (args) {
                        _this.add(args.feature, l);
                    });
                    source.on("removefeature", function (args) {
                        _this.remove(args.feature, l);
                    });
                });
            }
            return _this;
        }
        Grid.create = function (options) {
            options = index_1.defaults(index_1.mixin({
                openedText: (options && options.position && -1 < options.position.indexOf("left")) ? expando.left : expando.right,
                closedText: (options && options.position && -1 < options.position.indexOf("left")) ? expando.right : expando.left,
            }, options || {}), Grid.DEFAULT_OPTIONS);
            var element = document.createElement('div');
            element.className = options.className + " " + options.position + " " + olcss.CLASS_UNSELECTABLE + " " + olcss.CLASS_CONTROL;
            var gridOptions = index_1.mixin({
                map: options.map,
                element: element,
                expanded: false
            }, options);
            var grid = new Grid(gridOptions);
            if (options.map) {
                options.map.addControl(grid);
            }
            grid.handlers.push(function () { return element.remove(); });
            return grid;
        };
        Grid.prototype.destroy = function () {
            this.handlers.forEach(function (h) { return h(); });
            this.setTarget(null);
        };
        Grid.prototype.setPosition = function (position) {
            var _this = this;
            this.options.position.split(' ')
                .forEach(function (k) { return _this.options.element.classList.remove(k); });
            position.split(' ')
                .forEach(function (k) { return _this.options.element.classList.add(k); });
            this.options.position = position;
        };
        Grid.prototype.cssin = function () {
            var className = this.options.className;
            var positions = index_1.pair("top left right bottom".split(" "), index_1.range(24))
                .map(function (pos) { return "." + className + "." + (pos[0] + (-pos[1] || '')) + " { " + pos[0] + ":" + (0.5 + pos[1]) + "em; }"; });
            this.handlers.push(index_1.cssin(className, "\n." + className + " {\n    position: absolute;\n}\n." + className + " ." + className + "-container {\n    max-height: 16em;\n    overflow-y: auto;\n}\n." + className + " ." + className + "-container.ol-hidden {\n    display: none;\n}\n." + className + " .feature-row {\n    cursor: pointer;\n}\n." + className + " .feature-row:hover {\n    background: black;\n    color: white;\n}\n." + className + " .feature-row:focus {\n    background: #ccc;\n    color: black;\n}\n" + positions.join('\n') + "\n"));
        };
        Grid.prototype.redraw = function () {
            var _this = this;
            var options = this.options;
            var map = options.map;
            var extent = map.getView().calculateExtent(map.getSize());
            var tbody = this.grid.tBodies[0];
            tbody.innerHTML = "";
            var features = [];
            if (this.options.currentExtent) {
                this.features.forEachFeatureInExtent(extent, function (f) { return void features.push(f); });
            }
            else {
                this.features.forEachFeature(function (f) { return void features.push(f); });
            }
            if (options.preprocessFeatures) {
                features = options.preprocessFeatures(features);
            }
            features.forEach(function (feature) {
                var tr = document.createElement("tr");
                tr.tabIndex = 0;
                tr.className = "feature-row";
                if (_this.options.showIcon) {
                    var td = document.createElement("td");
                    var canvas = document.createElement("canvas");
                    td.appendChild(canvas);
                    canvas.className = "icon";
                    canvas.width = 160;
                    canvas.height = 64;
                    tr.appendChild(td);
                    Snapshot.render(canvas, feature);
                }
                if (_this.options.labelAttributeName) {
                    var td = document.createElement("td");
                    var label = index_1.html("<label class=\"label\">" + feature.get(_this.options.labelAttributeName) + "</label>");
                    td.appendChild(label);
                    tr.appendChild(td);
                }
                ["click", "keypress"].forEach(function (k) {
                    return tr.addEventListener(k, function () {
                        if (_this.options.autoCollapse) {
                            _this.collapse();
                        }
                        _this.dispatchEvent({
                            type: "feature-click",
                            feature: feature,
                            row: tr
                        });
                        if (_this.options.autoPan) {
                            navigation_1.zoomToFeature(map, feature, {
                                duration: options.zoomDuration,
                                padding: options.zoomPadding,
                                minResolution: options.zoomMinResolution
                            });
                        }
                    });
                });
                tbody.appendChild(tr);
            });
        };
        Grid.prototype.add = function (feature, layer) {
            var _this = this;
            var style = feature.getStyle();
            if (!style && layer && this.options.showIcon) {
                style = layer.getStyleFunction()(feature, 0);
                var originalFeature_1 = feature;
                feature = originalFeature_1.clone();
                feature.setStyle(style);
                originalFeature_1.on("change", index_1.debounce(function () {
                    feature.setGeometry(originalFeature_1.getGeometry());
                    _this.redraw();
                }));
                this.featureMap.push({ f1: originalFeature_1, f2: feature });
            }
            this.features.addFeature(feature);
        };
        Grid.prototype.remove = function (feature, layer) {
            var _this = this;
            this.featureMap.filter(function (map) { return map.f1 === feature; }).forEach(function (m) { return _this.features.removeFeature(m.f2); });
            this.redraw();
        };
        Grid.prototype.clear = function () {
            var tbody = this.grid.tBodies[0];
            tbody.innerHTML = "";
        };
        Grid.prototype.collapse = function () {
            var options = this.options;
            if (!options.canCollapse)
                return;
            options.expanded = false;
            this.grid.parentElement.classList.toggle(olcss.CLASS_HIDDEN, true);
            this.button.classList.toggle(olcss.CLASS_HIDDEN, false);
            this.button.innerHTML = options.closedText;
        };
        Grid.prototype.expand = function () {
            var options = this.options;
            options.expanded = true;
            this.grid.parentElement.classList.toggle(olcss.CLASS_HIDDEN, false);
            this.button.classList.toggle(olcss.CLASS_HIDDEN, true);
            this.button.innerHTML = options.openedText;
        };
        Grid.prototype.on = function (type, cb) {
            return _super.prototype.on.call(this, type, cb);
        };
        Grid.DEFAULT_OPTIONS = {
            className: 'ol-grid',
            position: 'top right',
            expanded: false,
            autoCollapse: true,
            autoPan: true,
            canCollapse: true,
            currentExtent: false,
            hideButton: false,
            showIcon: false,
            labelAttributeName: "",
            closedText: expando.right,
            openedText: expando.left,
            placeholderText: 'Features',
            zoomDuration: 2000,
            zoomPadding: 256,
            zoomMinResolution: 1 / Math.pow(2, 22)
        };
        return Grid;
    }(ol.control.Control));
    exports.Grid = Grid;
});
define("tests/spec/grid", ["require", "exports", "tests/base", "mocha", "ol3-grid/ol3-grid"], function (require, exports, base_1, mocha_1, ol3_grid_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    mocha_1.describe("Grid Tests", function () {
        mocha_1.it("Grid", function () {
            base_1.should(!!ol3_grid_1.Grid, "Grid");
        });
        mocha_1.it("DEFAULT_OPTIONS", function () {
            var options = ol3_grid_1.Grid.DEFAULT_OPTIONS;
            checkDefaultInputOptions(options);
        });
        mocha_1.it("options of an Input instance", function () {
            var grid = ol3_grid_1.Grid.create();
            base_1.shouldEqual(grid.getMap(), null, "no map");
            grid.destroy();
        });
    });
    function checkDefaultInputOptions(options) {
        base_1.should(!!options, "options");
        base_1.shouldEqual(options.autoCollapse, true, "autoCollapse");
        base_1.shouldEqual(options.canCollapse, true, "canCollapse");
        base_1.shouldEqual(options.className, "ol-grid", "className");
        base_1.should(options.closedText.length > 0, "closedText");
        base_1.shouldEqual(options.expanded, false, "expanded");
        base_1.shouldEqual(options.hideButton, false, "hideButton");
        base_1.shouldEqual(options.map, undefined, "map");
        base_1.shouldEqual(!!options.openedText, true, "openedText");
        base_1.shouldEqual(!!options.placeholderText, true, "placeholderText");
        base_1.shouldEqual(options.position, "top right", "position");
        base_1.shouldEqual(options.target, undefined, "target");
    }
});
define("tests/index", ["require", "exports", "tests/spec/grid"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=index.js.map