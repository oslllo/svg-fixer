"use strict";

const { SVGFixer } = require("./base");
const { Core } = require("./core");

function fix(source, destination, options) {
	return new Promise(async (resolve, reject) => {
		try {
			var svgfixer = new SVGFixer();
			svgfixer.setSourceAndDest(source, destination);
			svgfixer.setOptions(options);
			await svgfixer.process();
			resolve();
		} catch (e) {
			reject(e);
		}
	});
}

module.exports = {
	fix,
	Core,
	SVGFixer,
};
