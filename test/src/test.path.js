"use strict";

const path = require("path");
const Svg2 = require("oslllo-svg2");
const { assert, path2, fg } = require("./helper");

describe("test.path", () => {
  describe("if broken svg has a <path> element", () => {
    describe("fixed & broken <path> d attribute paths should not match", () => {
      var fixed = fg.sync(path2.fixed.relative + "/*.svg");
      var broken = fg.sync(path2.multiple.relative + "/*.svg");
      assert.equal(fixed.length, broken.length, "The number of fixed and broken icons does not match.");
      fixed.forEach((svg, index) => {
        var brokenSvg = Svg2(broken[index]);
        var brokenSvgPath = brokenSvg.toElement().getElementsByTagName("path")[0];
        if (brokenSvgPath) {
          var basename = path.basename(svg);
          var fixedSvg = Svg2(fixed[index]);
          var fixedSvgPath = fixedSvg.toElement().getElementsByTagName("path")[0];
          it(`${basename} fixed & broken <path> d attribute values are different`, () => {
            var equal = fixedSvgPath.attributes.d == brokenSvgPath.attributes.d;
            assert.isFalse(equal, `SVG ${basename} fixed & broken <path> d attribute values are the same`);
          });
        }
      });
    });
  });
});
