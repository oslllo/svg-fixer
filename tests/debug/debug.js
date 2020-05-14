"use strict";

const svgfixer = require("../../");
const fs = require("fs-extra");
const fg = require("fast-glob");
const path = require("path");
// var source = path.resolve("tests/assets/broken-icons");
var source = path.resolve("tests/assets/alot-of-icons");
var destination = path.resolve("tests/assets/fixed-icons");
const { StopWatch } = require("stopwatch-node");
var options = {
	showProgressBar: true,
};

var ABSOLUTE_BROKEN_ICONS_FILE_PATHS_ARRAY = fg.sync(
	path.join(path.resolve("tests/assets/broken-icons"), "/*.svg")
);

// console.log(ABSOLUTE_BROKEN_ICONS_FILE_PATHS_ARRAY)

async function run() {
	try {
		fs.emptyDirSync(destination);
		const sw = new StopWatch('sw');
		sw.start('New svg process')
		await svgfixer.fix(source, destination, options);
		sw.stop();
		sw.prettyPrint();
		console.log("done");
	} catch (err) {
		console.log("error:", err);
		throw err;
	}
}

run();
