"use strict";

var capcon = require("capture-console");
const { SVGFixer, assert, path2 } = require("./helper");

describe("test.progress", () => {
  it("shows progress bar if showProgressBar is set to true", async () => {
    var output = [];
    capcon.startCapture(process.stdout, function (stdout) {
      output.push(stdout);
    });

    var options = {
      showProgressBar: true,
    };

    const source = path2.single.absolute;
    const destination = path2.fixed.absolute;

    await SVGFixer(source, destination, options).fix();

    capcon.stopCapture(process.stdout);

    var expected = ["Fixing:", source, "Done!"];

    output = output.join(" ");

    expected.forEach((value) => {
      assert.isTrue(output.includes(value));
    });
  });
  it("does not show progress bar if showProgressBar is set to false", async () => {
    var output = [];
    capcon.startCapture(process.stdout, function (stdout) {
      output.push(stdout);
    });

    var options = {
      showProgressBar: false,
    };

    const source = path2.single.absolute;
    const destination = path2.fixed.absolute;

    await SVGFixer(source, destination, options).fix();

    capcon.stopCapture(process.stdout);

    var expected = [];

    assert.deepEqual(output, expected);
  });
});
