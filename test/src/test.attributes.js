"use strict";

const path = require("path");
const Svg2 = require("oslllo-svg2");
const { assert, path2, fg } = require("./helper");

describe("test.attributes", () => {
  var fixed = fg.sync(path2.fixed.relative + "/*.svg");
  var broken = fg.sync(path2.multiple.relative + "/*.svg");
  fixed.forEach((svg, index) => {
    var basename = path.basename(svg);
    it(`outputs svg with the correct attributes for ${basename}`, () => {
      var elements = [broken[index], fixed[index]].map(function (svgPath) {
        return Svg2(svgPath).toElement();
      });
      var svgs = {
        broken: elements[0],
        fixed: elements[1],
      };
      assert.equal(
        svgs.broken.attributes.length,
        svgs.fixed.attributes.length,
        `Attributes length does not match the original for ${basename}`
      );
      /**
       * @description - Get element attributes object.
       * @param {SVGSVGElement} element
       * @returns {Object}
       */
      function getElementAttributes (element) {
        return Array.prototype.slice.call(element.attributes).map((attribute) => {
          var value = {};
          value[attribute.nodeName] = attribute.nodeValue;

          return value;
        });
      }
      var attributes = {
        broken: getElementAttributes(svgs.broken),
        fixed: getElementAttributes(svgs.fixed),
      };
      assert.deepEqual(attributes.broken, attributes.fixed);
    });
  });
});
