"use strict";

const { fix, Core } = require("..");
const fs = require("fs-extra");
const path = require("path");
const looksame = require("looks-same");
const { JSDOM } = require("jsdom");
const chai = require("chai");
const { assert } = chai;
const Svg2 = require("oslllo-svg2");

var brokenIconsPath = path.resolve("tests/assets/broken-icons");
var failedIconsPath = path.resolve("tests/assets/failed-icons");
var fixedIconsPath = path.resolve("tests/assets/fixed-icons");
var fixedIconsArray = fs.readdirSync(fixedIconsPath);

describe("input and output SVGs are the same", () => {
	for (var i = 0; i < fixedIconsArray.length; i++) {
		var icon = fixedIconsArray[i];
		var index = i;
		it(icon + " matches expected output", (done) => {
			var resize = { width: 250, height: Svg2.AUTO };
			Svg2(`${brokenIconsPath}/${icon}`)
				.svg.resize(resize)
				.png()
				.toBuffer()
				.then((iconBuffer) => {
					Svg2(`${fixedIconsPath}/${icon}`)
						.svg.resize(resize)
						.png()
						.toBuffer()
						.then((fixedBuffer) => {
							looksame(
								iconBuffer,
								fixedBuffer,
								{ strict: false, tolerance: 5 },
								async (err, { equal }) => {
									if (err) {
										done(err);
									} else {
										if (equal != true) {
											await Svg2(iconBuffer)
												.png()
												.toFile(`${failedIconsPath}/${index}.png`);
											await Svg2(iconBuffer)
												.png()
												.toFile(`${failedIconsPath}/${index}-fixed.png`);
										}
										assert.equal(equal, true);
										done();
									}
								}
							);
						})
						.catch((err) => {
							done(err);
						});
				})
				.catch((err) => {
					done(err);
				});
		});
	}
});
