"use strict";

const path = require("path");
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
