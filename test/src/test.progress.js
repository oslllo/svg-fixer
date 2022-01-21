"use strict";

const { SVGFixer, assert, path2, hookStream } = require("./helper");

describe("test.progress", () => {
  // Windows is being a pain to test for some reason. it could be a github actions issue since its passing on my local machine, but somethimes passing and failing on github actions.
  if (process.platform !== "win32") {
    it("shows progress bar if showProgressBar is set to true", (done) => {
      var output = [];
      const unhookStream = hookStream(process.stdout, function(string) {
        output.push(string);
      });
      var options = {
        showProgressBar: true,
      };
      const source = path2.single.absolute;
      const destination = path2.fixed.absolute;

      SVGFixer(source, destination, options).fix().then(() => {
        unhookStream();

        var expected = ["Fixing:", source, "Done!"];

        output = output.join(" ");

        if (process.platform !== "win32") {
          expected.forEach((value) => {
            assert.isTrue(output.includes(value));
          });
        }

        done();
      });
    });


    it("does not show progress bar if showProgressBar is set to false", async () => {
      var output = [];
      const unhookStream = hookStream(process.stdout, function(string) {
        output.push(string);
      });

      var options = {
        showProgressBar: false,
      };

      const source = path2.single.absolute;
      const destination = path2.fixed.absolute;

      await SVGFixer(source, destination, options).fix();

      unhookStream();

      var expected = [];

      if (process.platform !== "win32") {
        assert.deepEqual(output, expected);
      }
    });
  }
});
