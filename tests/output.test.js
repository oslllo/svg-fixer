"use strict";

const { fix, Core } = require("..");
const fs = require("fs-extra");
const path = require("path");
const looksame = require("looks-same");
const { JSDOM } = require("jsdom");
const chai = require('chai');
const { assert } = chai;

var brokenIconsPath = path.resolve("tests/assets/broken-icons");
var failedIconsPath = path.resolve("tests/assets/failed-icons");
var fixedIconsPath = path.resolve("tests/assets/fixed-icons");
var fixedIconsArray = fs.readdirSync(fixedIconsPath);

describe("input and output SVGs are the same", () => {
	async function getPngBuffer(p, options) {
		var p = path.resolve(p);
		var raw = fs.readFileSync(p, "utf8");
		var dom = new JSDOM(raw);
        var svgElement = Core.getSvgElementFromDom(dom);
        Core.upscaleSvgElementDimensions(svgElement, 250);
		var buffer = await Core.svgToPng(svgElement.outerHTML, options);
		return buffer;
	}

	for(var i = 0; i < fixedIconsArray.length; i++) {
		var icon = fixedIconsArray[i];
		var index = i;
		it(icon + ' matches expected output', async () => {
			var iconBuffer = await getPngBuffer(`${brokenIconsPath}/${icon}`,  { extend: true });
			var fixedBuffer = await getPngBuffer(`${fixedIconsPath}/${icon}`, { extend: true });
			looksame(
				iconBuffer,
				fixedBuffer,
				{ strict: false, tolerance: 5 },
				async (error, { equal }) => {
					if (error) {
						console.log(error);
					}
					if (equal != true) {
						await Core.svgToPng(iconBuffer, { opts: `${failedIconsPath}/${index}.png` });
						await Core.svgToPng(iconBuffer, { opts: `${failedIconsPath}/${index}-fixed.png` });
					}
					assert.equal(equal, true);
				}
			);
		})
	}
});