"use strict";

const path = require("path");
const fg = require("fast-glob");
const cliprogress = require("cli-progress");
const core = require("./core");
const colors = require("colors");

function SVGFixer(source, dest, options = {}) {
	if (typeof source !== "string") {
		throw TypeError(
			`'source' argument should be a string, ${typeof source} given.`
		);
	} else if (typeof dest !== "string") {
		throw TypeError(
			`'dest' argument should be a string, ${typeof dest} given`
			);
	} else if (typeof options !== "object") {
		throw TypeError(
			`'options' argument should be an object, ${typeof options} given`
		);
	}
	this.source = source;
	this.dest = dest;
	this.svgs = fg.sync(path.join(source, "/*.svg"));
	this.options = {
		showProgressBar: false,
	};
	if (arguments.length === 3) {
		this.setOptions(options);
	}
	if (this.options.showProgressBar) {
		this.progressbar = new cliprogress.SingleBar(
			{
				format:
					`${colors.yellow("Progress")} |` +
					colors.yellow("{bar}") +
					"| {percentage}% || {value}/{total} Chunks || Speed: {speed}",
			},
			cliprogress.Presets.shades_classic
		);
	}
}

SVGFixer.prototype = core;

module.exports = SVGFixer;
