"use strict";

const fs = require("fs-extra");
const Svg2 = require("oslllo-svg2");
const looksame = require("looks-same");
const { assert, path2 } = require("./helper");

describe("test.output", () => {
    var fixedArray = fs.readdirSync(path2.fixed.absolute);
    var fixed = path2.fixed.absolute;
    var broken = path2.multiple.absolute;
    var failed = path2.failed.absolute;
    fixedArray.forEach((svg, index) => {
        it(`${svg} matches expected output`, async () => {
            var resize = { width: 250, height: Svg2.AUTO };
            var brokenBuffer = await Svg2(`${broken}/${svg}`)
                .svg.resize(resize)
                .extend(20)
                .png()
                .toBuffer();
            var fixedBuffer = await Svg2(`${fixed}/${svg}`)
                .svg.resize(resize)
                .extend(20)
                .png()
                .toBuffer();

            return new Promise((resolve, reject) => {
                looksame(
                    brokenBuffer,
                    fixedBuffer,
                    { strict: false, tolerance: 3.5 },
                    (err, { equal }) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (!equal) {
                                fs.writeFileSync(`${failed}/${index}.png`, brokenBuffer);
                                fs.writeFileSync(
                                    `${failed}/${index}-fixed.png`,
                                    fixedBuffer
                                );
                            }
                            assert.isTrue(
                                equal,
                                `SVG ${svg} did not match expected output`
                            );
                            resolve();
                        }
                    }
                );
            });
        });
    });
    fixedArray.forEach((svg) => {
        it(`outputs svg with the correct attributes for ${svg}`, () => {
            var brokenSvg = Svg2(`${broken}/${svg}`).toElement();
            var fixedSvg = Svg2(`${fixed}/${svg}`).toElement();
            assert.equal(brokenSvg.attributes.length, fixedSvg.attributes.length);
            /**
             * @description - Get svg element attributes.
             * @param {SVGSVGElement} element
             */
            function getAttributesObj (element) {
                return Array.prototype.slice.call(element.attributes).map((attribute) => {
                    var value = {};
                    value[attribute.nodeName] = attribute.nodeValue;

                    return value;
                });
            }
            var brokenAttributes = getAttributesObj(brokenSvg);
            var fixedAttributes = getAttributesObj(fixedSvg);
            assert.deepEqual(brokenAttributes, fixedAttributes);
        });
    });
});
