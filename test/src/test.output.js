"use strict";

const path = require("path");
const fs = require("fs-extra");
const { assert, path2, fg } = require("./helper");
const { brokenAndFixedSvgsMatch } = require("./");

describe("test.output", () => {
  var failed = path2.failed.absolute;
  var fixed = fg.sync(path2.fixed.relative + "/*.svg");
  var broken = fg.sync(path2.multiple.relative + "/*.svg");
  assert.equal(fixed.length, broken.length, "The number of fixed and broken icons does not match.");
  fixed.forEach((svg, index) => {
    var basename = path.basename(svg);
    it(`${basename} matches expected output`, async () => {
      var { equal, buffer } = await brokenAndFixedSvgsMatch(broken[index], fixed[index]);
      var blank = await brokenAndFixedSvgsMatch(fixed[index], path.resolve("test/assets/images/blank.png"));
      if (!equal) {
        var filename = path.parse(basename).name;
        fs.writeFileSync(failed + "/" + filename + ".broken.png", buffer.broken);
        fs.writeFileSync(failed + "/" + filename + ".fixed.png", buffer.fixed);
        fs.writeFileSync(failed + "/" + filename + ".diff.png", buffer.diff);
      }
      assert.isFalse(blank.equal, `SVG ${basename} matched a blank image`);
      assert.isTrue(equal, `SVG ${basename} did not match expected output`);
    });
  });
});
