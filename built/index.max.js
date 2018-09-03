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
    var Grid = /** @class */ (function (_super) {
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
            // render
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
            // provide computed and static defaults
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
                // need to capture style but don't want to effect original feature
                var originalFeature_1 = feature;
                feature = originalFeature_1.clone();
                feature.setStyle(style);
                // how to keep geometry in sync?
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
            // what to show on the tooltip
            placeholderText: 'Features',
            // zoom-to-feature options
            zoomDuration: 2000,
            zoomPadding: 256,
            zoomMinResolution: 1 / Math.pow(2, 22)
        };
        return Grid;
    }(ol.control.Control));
    exports.Grid = Grid;
});
define("index", ["require", "exports", "ol3-grid/ol3-grid"], function (require, exports, Grid) {
    "use strict";
    return Grid;
});
//# sourceMappingURL=index.max.js.map