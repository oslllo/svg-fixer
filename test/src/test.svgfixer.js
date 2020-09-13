"use strict";

const fs = require("fs-extra");
const { emptyDir } = require("./");
const { SVGFixer, assert, path2 } = require("./helper");

describe("test.svgfixer", () => {
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
        assert.deepEqual(keys.set, keys.options, "option parameter keys do not match");
        assert.deepEqual(set, options, "option parameters do not match");
    });

    describe("pathing", () => {
        var sources = {
            direct: path2.direct,
            single: path2.single,
            double: path2.double,
        };

        for (var s in sources) {
            if (!sources[s]) {
                throw new Error(`sources variable key ${s} is empty.`);
            }
        }

        var pathtest = function (source, destination, type, directory) {
            describe(`${directory} (directory/file) => ${type}`, () => {
                var spacer = "        ";
                it(`can fix and store SVGs with (${type}) pathing. \n ${spacer} | source: ${source} \n ${spacer} | destination: ${destination}`, async () => {
                    emptyDir(path2.fixed.relative);
                    assert.equal(
                        fs.readdirSync(destination).length,
                        0,
                        "destination directory is not empty"
                    );
                    await SVGFixer(source, destination).fix();
                    assert.equal(
                        fs.readdirSync(destination).length,
                        fs.lstatSync(source).isFile() ? 1 : fs.readdirSync(source).length,
                        "SVG was not saved to destination"
                    );
                });
            });
        };
        for (var directory in sources) {
            for (var type in sources[directory]) {
                var source = sources[directory][type];
                var destination = path2.fixed[type];
                pathtest(source, destination, type, directory);
            }
        }
    });

    describe("output", () => {
        /** @this */
        async function outputFixedSvgs () {
            this.timeout(30000);
            emptyDir(path2.fixed.relative);
            var source = path2.multiple.absolute;
            var destination = path2.fixed.absolute;
            assert.equal(
                fs.readdirSync(destination).length,
                0,
                "destination directory is not empty"
            );
            await SVGFixer(source, destination).fix();
            assert.equal(
                fs.readdirSync(destination).length,
                fs.readdirSync(source).length,
                "source and destination file counts do not match"
            );
        }
        it("outputs fixed SVGs", outputFixedSvgs);
    });
});

describe("exceptions", () => {
    it("throws with invalid source argument", () => {
        var invalid = [1, "invalid/path", "invalid/path/icon.svg"];
        invalid.forEach((arg) => {
            assert.throws(() => SVGFixer(arg, path2.fixed), TypeError);
        });
    });

    it("throws with invalid destination argument", () => {
        var invalid = [1, "invalid/path", "invalid/path/icon.svg"];
        invalid.forEach((arg) => {
            assert.throws(() => SVGFixer(path2.single, arg), TypeError);
        });
    });

    it("throws with invalid options argument", () => {
        var invalid = [1, "invalid/path", "invalid/path/icon.svg", []];
        invalid.forEach((arg) => {
            assert.throws(() => SVGFixer(path2.single, path2.fixed, arg), TypeError);
        });
    });
});
