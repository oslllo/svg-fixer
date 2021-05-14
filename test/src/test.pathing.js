"use strict";

const fs = require("fs-extra");
const { emptyDir } = require(".");
const { SVGFixer, assert, path2 } = require("./helper");

describe("test.pathing", () => {
  var sources = {
    direct: path2.direct,
    single: path2.single,
    double: path2.double,
  };

  for (var s in sources) {
    if (!sources[s]) {
      throw new Error(`sources variable key ${s} is empty.`);
    }
  }

  var pathtest = function (source, destination, type, directory) {
    describe(`${directory} (directory/file) => ${type}`, () => {
      var spacer = "        ";
      it(`can fix and store SVGs with (${type}) pathing. \n ${spacer} | source: ${source} \n ${spacer} | destination: ${destination}`, async () => {
        emptyDir(path2.fixed.relative);
        assert.equal(
          fs.readdirSync(destination).length,
          0,
          "destination directory is not empty"
        );
        await SVGFixer(source, destination).fix();
        assert.equal(
          fs.readdirSync(destination).length,
          fs.lstatSync(source).isFile() ? 1 : fs.readdirSync(source).length,
          "SVG was not saved to destination"
        );
      });
    });
  };
  for (var directory in sources) {
    for (var type in sources[directory]) {
      var source = sources[directory][type];
      var destination = path2.fixed[type];
      pathtest(source, destination, type, directory);
    }
  }
});
