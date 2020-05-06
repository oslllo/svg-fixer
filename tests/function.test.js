"use strict";

const svgfixer = require("..");
const fs = require("fs-extra");
const path = require("path");
const looksame = require("looks-same");
const sharp = require("sharp");
const { JSDOM } = require("jsdom");

const RELATIVE_BROKEN_ICONS_PATH = "tests/assets/broken-icons";
const RELATIVE_FAILED_ICONS_PATH = "tests/assets/failed-icons";
const RELATIVE_FIXED_ICONS_PATH = "tests/assets/fixed-icons";

const ABSOLUTE_BROKEN_ICONS_PATH = path.resolve(RELATIVE_BROKEN_ICONS_PATH);
const ABSOLUTE_FAILED_ICONS_PATH = path.resolve(RELATIVE_FAILED_ICONS_PATH);
const ABSOLUTE_FIXED_ICONS_PATH = path.resolve(RELATIVE_FIXED_ICONS_PATH);

if (fs.existsSync(ABSOLUTE_FIXED_ICONS_PATH)) {
	fs.emptyDirSync(ABSOLUTE_FIXED_ICONS_PATH);
}

if (fs.existsSync(ABSOLUTE_FAILED_ICONS_PATH)) {
	fs.emptyDirSync(ABSOLUTE_FAILED_ICONS_PATH);
}

describe("svgfixer.fix()", () => {
	var options = {};

	test("resolves with valid arguments", async () => {
		await expect(
			svgfixer.fix(ABSOLUTE_BROKEN_ICONS_PATH, ABSOLUTE_FIXED_ICONS_PATH)
		).resolves.not.toThrow();
	}, 30000);

	test("resolves with relative source and destination paths", async () => {
		await expect(
			svgfixer.fix(RELATIVE_BROKEN_ICONS_PATH, RELATIVE_FIXED_ICONS_PATH)
		).resolves.not.toThrow();
	}, 30000);

	test("throws with invalid arguments", async () => {
		await expect(svgfixer.fix(1, 2, 3)).rejects.toThrow(TypeError);
		await expect(
			svgfixer.fix(1, ABSOLUTE_FIXED_ICONS_PATH, options)
		).rejects.toThrow(TypeError);
		await expect(
			svgfixer.fix(ABSOLUTE_BROKEN_ICONS_PATH, 2, options)
		).rejects.toThrow(TypeError);
		await expect(
			svgfixer.fix(ABSOLUTE_BROKEN_ICONS_PATH, ABSOLUTE_FIXED_ICONS_PATH, 3)
		).rejects.toThrow(TypeError);
	});
});
