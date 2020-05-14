"use strict";

const path = require("path");
const { Core } = require("./core");

function SVGFixer(source, destination, options) {
	this.source;
	this.destination;
	this.svgs;
	this.progressbar;
	this.options = {
		throwIfPathDoesNotExist: true,
		showProgressBar: false,
		fixConcurrency: 50
	};
	if (options) {
		this.setOptions(options);
	}
	if (source && destination) {
		this.setSourceAndDest(source, destination);
	}
}

SVGFixer.prototype = Core;

module.exports = { SVGFixer };
