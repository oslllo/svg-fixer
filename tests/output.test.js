"use strict";

const svgfixer = require("..");
const fs = require("fs-extra");
const path = require("path");
const looksame = require("looks-same");
const sharp = require("sharp");
const { JSDOM } = require("jsdom");

var source = path.resolve("tests/icons");
var dest = path.resolve("tests/fixed");
var failed = path.resolve("tests/failed");
var fixed = fs.readdirSync(dest);

describe("input and output SVGs are the same", () => {
	var fixedMapped = fixed.map((value, index) => {
		return [value, index];
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
	test.each(fixedMapped)(
		"%p matches source icon",
		async (value, index, done) => {
			var iconBuffer = await getPngBuffer(`tests/icons/${value}`,  { extend: true });
			var fixedBuffer = await getPngBuffer(`tests/fixed/${value}`, { extend: true });
			looksame(
				iconBuffer,
				fixedBuffer,
				{ strict: false, tolerance: 5 },
				async (error, { equal }) => {
					if (error) {
						console.log(error);
					}
					if (equal != true) {
						await sharp(iconBuffer).toFile(`tests/failed/${index}.png`);
						await sharp(fixedBuffer).toFile(`tests/failed/${index}-fixed.png`);
					}
					expect(equal).toBe(true);
					done();
				}
			);
		}
	);
});