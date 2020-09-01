"use strict";

const fs = require("fs-extra");
const Svg2 = require("oslllo-svg2");
const looksame = require("looks-same");
const { assert, path2 } = require("./helper");

describe("test.output", () => {
    var fixedArray = fs.readdirSync(path2.fixed.absolute);
    fixedArray.forEach((svg, index) => {
        var fixed = path2.fixed.absolute;
        var broken = path2.multiple.absolute;
        var failed = path2.failed.absolute;
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
});
