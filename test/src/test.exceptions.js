"use strict";

const path = require("path");
const fs = require("fs-extra");
const is = require("oslllo-validator");
const error = require("../../src/error");
const { SVGFixer, assert, path2 } = require("./helper");

describe("test.exceptions", () => {
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
        it("throws if source file is not a svg file", () => {
            var source = path.resolve("test/assets/images/svg.png").replace(/\\/gu, "/");
            var destination = path2.fixed.relative;
            assert.isTrue(fs.existsSync(source), "source test image does not exist");
            assert.throws(
                () => SVGFixer(source, destination),
                Error,
                `one of the source file paths does not point to a .svg file. ${source}`
            );
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
        it("does not throw if destination folder does not exist and options.throwIfDestinationDoesNotExist is set to false", () => {
            var source = path2.single.absolute;
            var destination = "test/assets/temp-fixed-icons";
            var options = { throwIfDestinationDoesNotExist: false };
            assert.doesNotThrow(() => SVGFixer(source, destination, options));
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
