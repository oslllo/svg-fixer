"use strict";

const fs = require("fs");
const path = require("path");

const { assert } = require("./helper");
const svgFixer = require("../../src");
const { DEFAULT_TRACE_RESOLUTION } = require("../../src/constants");

describe("test.svgstringfixer", () => {
  describe("fixString", () => {
    const validSvgString = fs.readFileSync(path.resolve(__filename, "../../assets/alot-of-icons/500px.svg"), "utf-8");

    it("should be a function", () => {
      assert.isFunction(svgFixer.fixString);
    });

    it("should resolve with a string when called with valid SVG string", async () => {
      const result = await svgFixer.fixString(validSvgString);
      assert.isString(result);
      assert.isTrue(result.trim().startsWith("<svg"));
    });

    it("should resolve with a string when called with valid SVG Buffer", async () => {
      const svgBuffer = Buffer.from(validSvgString);
      const result = await svgFixer.fixString(svgBuffer);
      assert.isString(result);
      assert.isTrue(result.trim().startsWith("<svg"));
    });

    it("should accept custom resolution parameter", async () => {
      const result800 = await svgFixer.fixString(validSvgString, 800);
      const resultDefault = await svgFixer.fixString(validSvgString);
      assert.notEqual(result800, resultDefault);
    });

    it("should accept default resolution parameter", async () => {
      const resultCustom = await svgFixer.fixString(validSvgString, DEFAULT_TRACE_RESOLUTION);
      const resultDefault = await svgFixer.fixString(validSvgString);
      assert.equal(resultCustom, resultDefault);
    });

    it("should throw TypeError when called with number", () => {
      assert.throws(
        () => svgFixer.fixString(123),
        TypeError,
        "Expected <string or buffer> for [svg] but received 123 of type <number>"
      );
    });
  });
});
