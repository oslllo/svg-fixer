"use strict";

const svgfixer = require("../src");
const fs = require("fs-extra");
const fg = require("fast-glob");
const path = require("path");
const looksame = require("looks-same");
const { JSDOM } = require("jsdom");
const chai = require("chai");
const { assert, expect } = chai;
// const { fix, Core } = svgfixer;
chai.use(require("chai-as-promised"));

const RELATIVE_BROKEN_ICONS_DIR_PATH = "tests/assets/broken-icons";
const RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE = "tests/assets/broken-icons/single";
const RELATIVE_FAILED_ICONS_DIR_PATH = "tests/assets/failed-icons";
const RELATIVE_FIXED_ICONS_DIR_PATH = "tests/assets/fixed-icons";

const ABSOLUTE_BROKEN_ICONS_DIR_PATH = path.resolve(RELATIVE_BROKEN_ICONS_DIR_PATH);
const ABSOLUTE_FAILED_ICONS_DIR_PATH = path.resolve(RELATIVE_FAILED_ICONS_DIR_PATH);
const ABSOLUTE_FIXED_ICONS_DIR_PATH = path.resolve(RELATIVE_FIXED_ICONS_DIR_PATH);

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

function rds(dir) {
    return fs.readdirSync(dir);
}

describe("svgfixer()", function () {
    afterEach(function () {
        fs.emptyDirSync(ABSOLUTE_FIXED_ICONS_DIR_PATH);
        if (fs.readdirSync(ABSOLUTE_FIXED_ICONS_DIR_PATH).length) {
            throw new Error(`fixed icon directory did not empty`);
        }
    });

    it("can set paramenters", async () => {
        var testParameters = {
            throwIfDestinationDoesNotExist: false,
            showProgressBar: false,
            fixConcurrency: 55,
        };
        var instance = await svgfixer(
            RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE,
            RELATIVE_FIXED_ICONS_DIR_PATH,
            testParameters
        ).fix();
        var _options = instance.options.all();
        assert.equal(
            _options.throwIfDestinationDoesNotExist,
            testParameters.throwIfDestinationDoesNotExist
        );
        assert.equal(_options.showProgressBar, testParameters.showProgressBar);
        assert.equal(_options.fixConcurrency, testParameters.fixConcurrency);
    });

    var ABSOLUTE_BROKEN_ICON_FILE_PATH = path.join(
        path.resolve(RELATIVE_BROKEN_ICONS_DIR_PATH),
        fs.readdirSync(RELATIVE_BROKEN_ICONS_DIR_PATH)[0]
    );

    it("resolves with absolute source FILE path", function (done) {
        assert.equal(fs.readdirSync(ABSOLUTE_FIXED_ICONS_DIR_PATH).length, 0);
        svgfixer(ABSOLUTE_BROKEN_ICON_FILE_PATH, ABSOLUTE_FIXED_ICONS_DIR_PATH)
            .fix()
            .then(() => {
                assert.equal(fs.readdirSync(ABSOLUTE_FIXED_ICONS_DIR_PATH).length, 1);
                done();
            })
            .catch((e) => {
                done(e);
            });
    });

    it("resolves with relative source FILE path", function (done) {
        assert.equal(fs.readdirSync(ABSOLUTE_FIXED_ICONS_DIR_PATH).length, 0);
        svgfixer(
            path.join(
                RELATIVE_BROKEN_ICONS_DIR_PATH,
                path.basename(ABSOLUTE_BROKEN_ICON_FILE_PATH)
            ),
            ABSOLUTE_FIXED_ICONS_DIR_PATH
        )
            .fix()
            .then(() => {
                assert.equal(fs.readdirSync(ABSOLUTE_FIXED_ICONS_DIR_PATH).length, 1);
                done();
            })
            .catch((e) => {
                done(e);
            });
    });

    it("resolves with absolute source DIR path", function (done) {
        assert.equal(fs.readdirSync(ABSOLUTE_FIXED_ICONS_DIR_PATH).length, 0);
        svgfixer(
            path.resolve(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE),
            ABSOLUTE_FIXED_ICONS_DIR_PATH
        )
            .fix()
            .then(() => {
                assert.equal(fs.readdirSync(ABSOLUTE_FIXED_ICONS_DIR_PATH).length, 1);
                done();
            })
            .catch((e) => {
                done(e);
            });
    });

    it("resolves with relative source DIR path", function (done) {
        assert.equal(fs.readdirSync(ABSOLUTE_FIXED_ICONS_DIR_PATH).length, 0);
        svgfixer(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE, ABSOLUTE_FIXED_ICONS_DIR_PATH)
            .fix()
            .then(() => {
                assert.equal(fs.readdirSync(ABSOLUTE_FIXED_ICONS_DIR_PATH).length, 1);
                done();
            })
            .catch((e) => {
                done(e);
            });
    });

    it("resolves with relative DIR path as source and destination", function (done) {
        assert.equal(fs.readdirSync(RELATIVE_FIXED_ICONS_DIR_PATH).length, 0);
        svgfixer(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE, RELATIVE_FIXED_ICONS_DIR_PATH)
            .fix()
            .then(() => {
                assert.equal(fs.readdirSync(RELATIVE_FIXED_ICONS_DIR_PATH).length, 1);
                done();
            })
            .catch((e) => {
                done(e);
            });
    });
});

describe("Main", function () {
    it("resolves with valid arguments", function (done) {
        this.timeout(30000);
        svgfixer(ABSOLUTE_BROKEN_ICONS_DIR_PATH, ABSOLUTE_FIXED_ICONS_DIR_PATH)
            .fix()
            .then(() => {
                var brokenIcons = fs
                    .readdirSync(ABSOLUTE_BROKEN_ICONS_DIR_PATH)
                    .filter((entry) => {
                        return path.extname(entry) == ".svg";
                    });
                assert.equal(
                    brokenIcons.length,
                    fs.readdirSync(ABSOLUTE_FIXED_ICONS_DIR_PATH).length
                );
                done();
            })
            .catch((e) => {
                done(e);
            });
    });
});

describe("Exceptions", function () {
    it("throws with invalid source argument", async function () {
        assert.throws(
            () => svgfixer("invalid/path", ABSOLUTE_FIXED_ICONS_DIR_PATH),
            TypeError
        );
        assert.throws(
            () => svgfixer("invalid/path/icon.svg", ABSOLUTE_FIXED_ICONS_DIR_PATH),
            TypeError
        );
        assert.throws(() => svgfixer(1, ABSOLUTE_FIXED_ICONS_DIR_PATH), TypeError);
    });

    it("throws with invalid destination argument", async function () {
        assert.throws(
            () => svgfixer(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE, "invalid/path"),
            TypeError
        );
        assert.throws(
            () =>
                svgfixer(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE, "invalid/path.icon.svg"),
            TypeError
        );
        assert.throws(
            () => svgfixer(RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE, 1),
            TypeError
        );
    });

    it("throws with invalid options argument", async function () {
        assert.throws(
            () =>
                svgfixer(
                    RELATIVE_BROKEN_ICONS_DIR_PATH_SINGLE,
                    ABSOLUTE_FIXED_ICONS_DIR_PATH,
                    1
                ),
            TypeError
        );
    });
});
