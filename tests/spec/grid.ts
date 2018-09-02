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
        let input = Grid.create({});
        checkDefaultInputOptions(<any>input);
    });

    it("input dom", (done) => {
        let target = document.createElement("div");
        let input = Grid.create({element: target});
        input.add(new ol.Feature({text: "feature text"}));
        shouldEqual(target.innerHTML, "", "innerHTML");
    });

});

function checkDefaultInputOptions(options: GridOptions) {
    should(!!options, "options");
}
