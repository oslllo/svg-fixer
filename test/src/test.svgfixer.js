"use strict";

const path = require("path");
const fs = require("fs-extra");
const { emptyDir } = require("./");
const is = require("oslllo-validator");
const error = require("../../src/error");
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
    /**
     * Get test exception message
     * @param {*} name
     * @param {*} arg
     */
    function message (name, arg) {
        return is.string(arg)
            ? error.invalidPathError(name, arg).message
            : error.invalidParameterError(name, "string", arg).message;
    }
    describe("invalid source arguments", () => {
        var invalid = [
            1,
            "invalid/path",
            "invalid/path/icon.svg",
            path.resolve("invalid/path/icon.svg"),
            path.resolve("invalid/path"),
        ];
        invalid.forEach((arg) => {
            it(`throws with invalid source argument (${arg.toString()})`, () => {
                assert.throws(
                    () => SVGFixer(arg, path2.fixed.absolute),
                    TypeError,
                    message("source", arg)
                );
            });
        });
    });

    describe("invalid destination arguments", () => {
        var invalid = [
            1,
            "invalid/path",
            "invalid/path/icon.svg",
            path.resolve("invalid/path/icon.svg"),
            path.resolve("invalid/path"),
        ];
        invalid.forEach((arg) => {
            it(`throws with invalid destination argument (${arg.toString()})`, () => {
                assert.throws(
                    () => SVGFixer(path2.single.absolute, arg),
                    TypeError,
                    message("destination", arg)
                );
            });
        });
    });

    describe("invalid options arguments", () => {
        var invalid = [
            1,
            "invalid/path",
            "invalid/path/icon.svg",
            path.resolve("invalid/path/icon.svg"),
            path.resolve("invalid/path"),
        ];
        invalid.forEach((arg) => {
            it(`throws with invalid options argument (${arg.toString()})`, () => {
                assert.throws(
                    () => SVGFixer(path2.single.absolute, path2.fixed.absolute, arg),
                    TypeError,
                    error.invalidParameterError("options", "object", arg).message
                );
            });
        });
    });

    describe("options", () => {
        it("throws when you try to get an option key/value that does not exist", () => {
            var instance = SVGFixer(path2.single.absolute, path2.fixed.absolute);
            var options = Object.keys(instance.options.all());
            assert.throws(
                () => instance.options.get("invalid"),
                TypeError,
                error.invalidParameterError(
                    "setting",
                    `one of ${options.toString()}`,
                    "invalid"
                ).message
            );
        });
        var invalid = [undefined, 1];
        var instance = SVGFixer(path2.single.absolute, path2.fixed.absolute);
        invalid.forEach((arg) => {
            it(`throws when you try to get an option key/value that is (${arg})`, () => {
                assert.throws(
                    () => instance.options.get(arg),
                    TypeError,
                    error.invalidParameterError("option", "string", arg).message
                );
            });
        });
    });
});
