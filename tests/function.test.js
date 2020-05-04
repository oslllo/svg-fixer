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

var icons = fs.readdirSync(path.resolve("tests/icons"));

if (fs.existsSync(dest)) {
	fs.emptyDirSync(dest);
}

if (fs.existsSync(failed)) {
	fs.emptyDirSync(failed);
}

describe("svgfixer.fix()", () => {
	var options = {};
	test("resolves with valid arguments", async () => {
		await expect(svgfixer.fix(source, dest)).resolves.not.toThrow();
	}, 30000);
	test("throws with invalid arguments", async () => {
		await expect(svgfixer.fix(1, 2, 3)).rejects.toThrow(TypeError);
		await expect(svgfixer.fix(1, dest, options)).rejects.toThrow(TypeError);
		await expect(svgfixer.fix(source, 2, options)).rejects.toThrow(TypeError);
		await expect(svgfixer.fix(source, dest, 3)).rejects.toThrow(TypeError);
	});
});

