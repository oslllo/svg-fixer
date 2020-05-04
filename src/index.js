"use strict";

const SVGFixer = require("./base");
const core = require("./core");

function fix(source, dest, options) {
	return new Promise(async (resolve, reject) => {
		try {
			var svgfixer = new SVGFixer(source, dest, options);
			await svgfixer.process();
			resolve();
		} catch (e) {
			reject(e);
		}
	});
}

module.exports = {
	fix,
	core,
	SVGFixer,
};
