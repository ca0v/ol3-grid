import ol = require("openlayers");
import { should, shouldEqual } from "../base";
import {describe, it} from "mocha";
import { GridOptions, Grid } from "../../ol3-grid/ol3-grid";

describe("Grid Tests", () => {
    it("Grid", () => {
        should(!!Grid, "Grid");
    });

    it("DEFAULT_OPTIONS", () => {
        let options = Grid.DEFAULT_OPTIONS;
        checkDefaultInputOptions(options);
    });

    it("options of an Input instance", () => {
        let grid = Grid.create();
        shouldEqual(grid.getMap(), null, "no map");
        grid.destroy();
    });


});

function checkDefaultInputOptions(options: GridOptions) {
    should(!!options, "options");
    shouldEqual(options.autoCollapse, true, "autoCollapse");
    shouldEqual(options.canCollapse, true, "canCollapse");
    shouldEqual(options.className, "ol-grid", "className");
    should(options.closedText.length > 0, "closedText");
    shouldEqual(options.expanded, false, "expanded");
    shouldEqual(options.hideButton, false, "hideButton");
    shouldEqual(options.map, undefined, "map");
    shouldEqual(!!options.openedText, true, "openedText");
    shouldEqual(!!options.placeholderText, true, "placeholderText");
    shouldEqual(options.position, "top right", "position");
    shouldEqual(options.target, undefined, "target");
}
