"use strict";

const { SVGFixer, assert, path2 } = require("./helper");

describe("test.parameters", () => {
    describe("options parameters", () => {
        it("can set the options parameter", async () => {
            var options = {
                showProgressBar: true,
                throwIfDestinationDoesNotExist: false,
            };
            var instance = await SVGFixer(
                path2.direct.absolute,
                path2.fixed.absolute,
                options
            ).fix();
            var set = instance.options.all();
            var keys = {
                set: Object.values(set),
                options: Object.values(options),
            };
            assert.deepEqual(
                keys.set,
                keys.options,
                "option parameter keys do not match"
            );
            assert.deepEqual(set, options, "option parameters do not match");
        });
        it("won't update invalid options parameters", () => {
            var valid = {
                showProgressBar: false,
                throwIfDestinationDoesNotExist: true,
            };
            var invalid = {
                invalidoptions: true,
            };
            var instance = SVGFixer(path2.direct.absolute, path2.fixed.absolute, invalid);
            assert.deepEqual(
                valid,
                instance.options.all(),
                "option parameters do not match"
            );
        });
    });
});
