"use strict";

const fs = require("fs-extra");
const { emptyDir } = require("./");
const { SVGFixer, assert, path2 } = require("./helper");

describe("test.svgfixer", () => {
    it("outputs fixed SVGs", async function () {
        this.timeout(30000); // eslint-disable-line no-invalid-this
        emptyDir(path2.fixed.relative);
        var source = path2.multiple.absolute;
        var destination = path2.fixed.absolute;
        assert.equal(
            fs.readdirSync(destination).length,
            0,
            "destination directory is not empty"
        );
        await SVGFixer(source, destination).fix();
        assert.equal(
            fs.readdirSync(destination).length,
            fs.readdirSync(source).length,
            "source and destination file counts do not match"
        );
    });
});
