"use strict";

const svgfixer = require("../../");
const fs = require("fs-extra");
const path = require("path");
var source = path.resolve("tests/icons");
var dest = path.resolve("tests/fixed");
var options = {
	showProgressBar: true,
};

async function run() {
	try {
		fs.emptyDirSync(dest);
		await svgfixer.fix(source, dest, options);
		console.log("done");
	} catch (err) {
		console.log("error:", err);
		throw err;
	}
}

run();
