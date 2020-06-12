"use strict";

const svgfixer = require("../src");
const fs = require("fs-extra");
const fg = require("fast-glob");
const path = require("path");
const looksame = require("looks-same");
const { JSDOM } = require("jsdom");
const chai = require('chai');
const { assert, expect } = chai;
const { fix, Core } = svgfixer;
chai.use(require('chai-as-promised'));

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
} else {
	fs.mkdirSync(ABSOLUTE_FIXED_ICONS_DIR_PATH);
}

if (fs.existsSync(ABSOLUTE_FAILED_ICONS_DIR_PATH)) {
	fs.emptyDirSync(ABSOLUTE_FAILED_ICONS_DIR_PATH);
} else {
	fs.mkdirSync(ABSOLUTE_FAILED_ICONS_DIR_PATH);
}

describe("svgfixer.fix()", function () {
	var options = {};

	it("can set paramenters", async () => {
		var testParameters = {
			throwIfPathDoesNotExist: false,
			showProgressBar: false,
			fixConcurrency: 55,
		};
		var { instance } = await svgfixer.fix(
			RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE,
			RELATIVE_FIXED_ICONS_DIR_PATH,
			testParameters
		);
		var _options = instance.options;
		assert.equal(_options.throwIfPathDoesNotExist, testParameters.throwIfPathDoesNotExist)
		assert.equal(_options.showProgressBar, testParameters.showProgressBar)
		assert.equal(_options.fixConcurrency, testParameters.fixConcurrency)
	});

	it("resolves with valid arguments", function (done) {
		this.timeout(20000);
		svgfixer.fix(
			ABSOLUTE_BROKEN_ICONS_DIR_PATH,
			ABSOLUTE_FIXED_ICONS_DIR_PATH
		).then(() => {
			done()
		}).catch((e) => {
			done(e)
		});
	});

	ABSOLUTE_BROKEN_ICON_FILE_PATHS_ARRAY = fg.sync(
		path.join(path.resolve(RELATIVE_BROKEN_ICONS_DIR_PATH), "/*.svg")
	);

	it("resolves with absolute source FILE path", function (done) {
		svgfixer.fix(
			ABSOLUTE_BROKEN_ICON_FILE_PATHS_ARRAY[0],
			ABSOLUTE_FIXED_ICONS_DIR_PATH
		).then(() => {
			done()
		}).catch((e) => {
			done(e)
		})
	});

	it("resolves with relative source FILE path", function (done) {
		svgfixer.fix(
			path.join(
				RELATIVE_BROKEN_ICONS_DIR_PATH,
				path.basename(ABSOLUTE_BROKEN_ICON_FILE_PATHS_ARRAY[0])
			),
			ABSOLUTE_FIXED_ICONS_DIR_PATH
		).then(() => {
			done();
		}).catch((e) => {
			done(e)
		})
	});

	it("resolves with absolute source DIR path", function (done) {
		svgfixer.fix(
			path.resolve(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE),
			ABSOLUTE_FIXED_ICONS_DIR_PATH
		).then(() => {
			done();
		}).catch((e) => {
			done(e);
		})
	});

	it("resolves with relative source DIR path", function (done) {
		svgfixer.fix(
			RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE,
			ABSOLUTE_FIXED_ICONS_DIR_PATH
		).then(() => {
			done()
		}).catch((e) => {
			done(e)
		})
	});

	it("resolves with relative DIR path as source and destination", function (done) {
		svgfixer.fix(
			RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE,
			RELATIVE_FIXED_ICONS_DIR_PATH
		).then(() => {
			done()
		}).catch((e) => {
			done(e)
		})
	});

	it("throws with invalid source argument", async function () {
		await expect(svgfixer.fix("invalid/path", ABSOLUTE_FIXED_ICONS_DIR_PATH, options)).to.be.rejectedWith(TypeError);
		await expect(svgfixer.fix("invalid/path/icon.svg", ABSOLUTE_FIXED_ICONS_DIR_PATH, options)).to.be.rejectedWith(TypeError);
		await expect(svgfixer.fix(1, ABSOLUTE_FIXED_ICONS_DIR_PATH, options)).to.be.rejectedWith(TypeError);
	});

	it("throws with invalid destination argument", async function () {
		await expect(svgfixer.fix(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE, "invalid/path", options)).to.be.rejectedWith(TypeError);
		await expect(svgfixer.fix(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE, "invalid/path.icon.svg", options)).to.be.rejectedWith(TypeError);
		await expect(svgfixer.fix(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE, 1, options)).to.be.rejectedWith(TypeError);
	});

	it("throws with invalid options argument", async function () {
		await expect(svgfixer.fix(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE, ABSOLUTE_FIXED_ICONS_DIR_PATH, 1)).to.be.rejectedWith(TypeError);
	});
});
