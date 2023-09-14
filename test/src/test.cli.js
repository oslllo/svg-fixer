"use strict";

const fs = require("fs-extra");
const { emptyDir, isEmptyDir } = require(".");
const { exec } = require("child_process");
const { assert, path2 } = require("./helper");

const timeout = 30000;
var destination = "temp";

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination);
}

describe("test.cli", () => {
  beforeEach(() => {
    emptyDir(destination);
  });
  it("works with direct path to a SVG", function (done) {
    this.timeout(timeout); // eslint-disable-line no-invalid-this
    assert.isTrue(isEmptyDir(destination));
    exec("node src/cli.js -s " + path2.direct.relative + " -d " + destination, (error, stdout, stderr) => {
      if (error) {
        done(new Error(`error: ${error.message}`));
      }
      if (stderr) {
        done(new Error(`stderr: ${stderr}`));
      }
      assert.isFalse(isEmptyDir(destination));
      assert.equal(fs.readdirSync(destination).length, 1);
      done();
    });
  });
  it("works with path to a directory containting multiple SVGs", function (done) {
    this.timeout(timeout); // eslint-disable-line no-invalid-this
    assert.isTrue(isEmptyDir(destination));
    exec("node src/cli.js -s " + path2.double.relative + " -d " + destination, (error, stdout, stderr) => {
      if (error) {
        done(new Error(`error: ${error.message}`));
      }
      if (stderr) {
        done(new Error(`stderr: ${stderr}`));
      }
      assert.isFalse(isEmptyDir(destination));
      assert.equal(fs.readdirSync(destination).length, 2);
      done();
    });
  });
  it("throws with invalid destination path", function (done) {
    this.timeout(timeout); // eslint-disable-line no-invalid-this
    assert.isTrue(isEmptyDir(destination));
    exec("node src/cli.js -s ./invalid/destination -d " + destination, (error, stdout) => {
      assert.isTrue(error instanceof Error);
      assert.isTrue(stdout.includes("source path ./invalid/destination does not exist."));
      assert.isTrue(isEmptyDir(destination));
      done();
    });
  });
});
