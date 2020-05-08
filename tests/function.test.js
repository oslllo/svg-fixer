"use strict";

const svgfixer = require("..");
const fs = require("fs-extra");
const fg = require("fast-glob");
const path = require("path");
const looksame = require("looks-same");
const sharp = require("sharp");
const { JSDOM } = require("jsdom");

const RELATIVE_BROKEN_ICONS_DIR_PATH = "tests/assets/broken-icons";
const RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE =
	"tests/assets/broken-icons/single";
const RELATIVE_FAILED_ICONS_DIR_PATH = "tests/assets/failed-icons";
const RELATIVE_FIXED_ICONS_DIR_PATH = "tests/assets/fixed-icons";

const ABSOLUTE_BROKEN_ICONS_DIR_PATH = path.resolve(
	RELATIVE_BROKEN_ICONS_DIR_PATH
);
const ABSOLUTE_FAILED_ICONS_DIR_PATH = path.resolve(
	RELATIVE_FAILED_ICONS_DIR_PATH
);
const ABSOLUTE_FIXED_ICONS_DIR_PATH = path.resolve(
	RELATIVE_FIXED_ICONS_DIR_PATH
);

var ABSOLUTE_BROKEN_ICON_FILE_PATHS_ARRAY;

if (fs.existsSync(ABSOLUTE_FIXED_ICONS_DIR_PATH)) {
	fs.emptyDirSync(ABSOLUTE_FIXED_ICONS_DIR_PATH);
}

if (fs.existsSync(ABSOLUTE_FAILED_ICONS_DIR_PATH)) {
	fs.emptyDirSync(ABSOLUTE_FAILED_ICONS_DIR_PATH);
}

describe("svgfixer.fix()", () => {
	var options = {};

	test("resolves with valid arguments", async () => {
		await expect(
			svgfixer.fix(
				ABSOLUTE_BROKEN_ICONS_DIR_PATH,
				ABSOLUTE_FIXED_ICONS_DIR_PATH
			)
		).resolves.not.toThrow();
	}, 30000);

	ABSOLUTE_BROKEN_ICON_FILE_PATHS_ARRAY = fg.sync(
		path.join(path.resolve(RELATIVE_BROKEN_ICONS_DIR_PATH), "/*.svg")
	);

	test("resolves with absolute source FILE path", async () => {
		await expect(
			svgfixer.fix(
				ABSOLUTE_BROKEN_ICON_FILE_PATHS_ARRAY[0],
				ABSOLUTE_FIXED_ICONS_DIR_PATH
			)
		).resolves.not.toThrow();
	});

	test("resolves with relative source FILE path", async () => {
		await expect(
			svgfixer.fix(
				path.join(
					RELATIVE_BROKEN_ICONS_DIR_PATH,
					path.basename(ABSOLUTE_BROKEN_ICON_FILE_PATHS_ARRAY[0])
				),
				ABSOLUTE_FIXED_ICONS_DIR_PATH
			)
		).resolves.not.toThrow();
	});

	test("resolves with absolute source DIR path", async () => {
		await expect(
			svgfixer.fix(
				path.resolve(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE),
				ABSOLUTE_FIXED_ICONS_DIR_PATH
			)
		).resolves.not.toThrow();
	});

	test("resolves with relative source DIR path", async () => {
		await expect(
			svgfixer.fix(
				RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE,
				ABSOLUTE_FIXED_ICONS_DIR_PATH
			)
		).resolves.not.toThrow();
	});

	test("resolves with relative DIR path as source and destination", async () => {
		await expect(
			svgfixer.fix(
				RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE,
				RELATIVE_FIXED_ICONS_DIR_PATH
			)
		).resolves.not.toThrow();
	}, 30000);

	test("throws with invalid source argument", async () => {
		await expect(
			svgfixer.fix("invalid/path", ABSOLUTE_FIXED_ICONS_DIR_PATH, options)
		).rejects.toThrow(TypeError);
		await expect(
			svgfixer.fix(
				"invalid/path/icon.svg",
				ABSOLUTE_FIXED_ICONS_DIR_PATH,
				options
			)
		).rejects.toThrow(TypeError);
		await expect(
			svgfixer.fix(1, ABSOLUTE_FIXED_ICONS_DIR_PATH, options)
		).rejects.toThrow(TypeError);
	});

	test("throws with invalid destination argument", async () => {
		await expect(
			svgfixer.fix(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE, "invalid/path", options)
		).rejects.toThrow(TypeError);
		await expect(
			svgfixer.fix(
				RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE,
				"invalid/path.icon.svg",
				options
			)
		).rejects.toThrow(TypeError);
		await expect(
			svgfixer.fix(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE, 1, options)
		).rejects.toThrow(TypeError);
	})

	test("throws with invalid options argument", async () => {
		await expect(
			svgfixer.fix(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE, ABSOLUTE_FIXED_ICONS_DIR_PATH, 1)
		).rejects.toThrow(TypeError);
	})

	// test("throws with invalid arguments", async () => {
	// 	// All invalid
	// 	await expect(svgfixer.fix(1, 2, 3)).rejects.toThrow(TypeError);
	// 	// Source is invalid
	// 	await expect(
	// 		svgfixer.fix(1, ABSOLUTE_FIXED_ICONS_DIR_PATH, options)
	// 	).rejects.toThrow(TypeError);
	// 	await expect(
	// 		svgfixer.fix(1, ABSOLUTE_FIXED_ICONS_DIR_PATH, options)
	// 	).rejects.toThrow(TypeError);
	// 	// Destination is invalid
	// 	await expect(
	// 		svgfixer.fix(ABSOLUTE_BROKEN_ICONS_DIR_PATH, 2, options)
	// 	).rejects.toThrow(TypeError);
	// 	// Options is invalid
	// 	await expect(
	// 		svgfixer.fix(
	// 			ABSOLUTE_BROKEN_ICONS_DIR_PATH,
	// 			ABSOLUTE_FIXED_ICONS_DIR_PATH,
	// 			3
	// 		)
	// 	).rejects.toThrow(TypeError);
	// });
});
