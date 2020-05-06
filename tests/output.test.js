"use strict";

const svgfixer = require("..");
const fs = require("fs-extra");
const path = require("path");
const looksame = require("looks-same");
const sharp = require("sharp");
const { JSDOM } = require("jsdom");

var brokenIconsPath = path.resolve("tests/assets/broken-icons");
var failedIconsPath = path.resolve("tests/assets/failed-icons");
var fixedIconsPath = path.resolve("tests/assets/fixed-icons");
var fixedIconsArray = fs.readdirSync(fixedIconsPath);

describe("input and output SVGs are the same", () => {
	var fixedIconsMapped = fixedIconsArray.map((iconExtensionName, index) => {
		return [iconExtensionName, index];
	});
	async function getPngBuffer(p, options) {
		var p = path.resolve(p);
		var raw = fs.readFileSync(p, "utf8");
		var dom = new JSDOM(raw);
        var svgElement = svgfixer.core.getSvgElementFromDom(dom);
        svgfixer.core.upscaleSvgElementDimensions(svgElement, 250);
		var buffer = await svgfixer.core.svgToPng(svgElement.outerHTML, options);
		return buffer;
	}
	test.each(fixedIconsMapped)(
		"%p matches expected icon",
		async (iconExtensionName, index, done) => {
			var iconBuffer = await getPngBuffer(`${brokenIconsPath}/${iconExtensionName}`,  { extend: true });
			var fixedBuffer = await getPngBuffer(`${fixedIconsPath}/${iconExtensionName}`, { extend: true });
			looksame(
				iconBuffer,
				fixedBuffer,
				{ strict: false, tolerance: 5 },
				async (error, { equal }) => {
					if (error) {
						console.log(error);
					}
					if (equal != true) {
						await sharp(iconBuffer).toFile(`${failedIcons}/${index}.png`);
						await sharp(fixedBuffer).toFile(`${failedIcons}/${index}-fixed.png`);
					}
					expect(equal).toBe(true);
					done();
				}
			);
		}
	);
});