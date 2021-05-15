"use strict";

const path = require("path");
const fs = require("fs-extra");
const Svg2 = require("oslllo-svg2");
const { path2 } = require("./helper");
const looksame = require("looks-same");

/**
 * @description Prepare for tests.
 */
function prepare() {
  ["failed", "fixed"].forEach(function (dir) {
    var directory = path2[dir].relative;
    if (fs.existsSync(directory)) {
      fs.emptyDirSync(directory);
    } else {
      fs.mkdirSync(directory);
    }
  });
}

/**
 * @description - Empty directory
 * @param {String} dir - Directory path string
 */
function emptyDir(dir) {
  fs.emptyDirSync(dir);
  if (fs.readdirSync(dir).length) {
    throw new Error(`failed to empty the ${dir} directory`);
  }
}

/**
 * @description - Check if directory is empty.
 * @param {String} dir - Directory path string
 */
function isEmptyDir(dir) {
  return fs.readdirSync(dir).length === 0;
}

/**
 * @description - Check if the broken and fixed svg match visually.
 * @param {String} brokenSvgPath - Path to broken svg.
 * @param {String} fixedSvgPath - Path to fixed svg.
 */
function brokenAndFixedSvgsMatch(brokenSvgPath, fixedSvgPath) {
  return new Promise(async (resolve, reject) => {
    var resize = { width: 250, height: Svg2.AUTO };
    var buffers = await Promise.all(
      [brokenSvgPath, fixedSvgPath].map(function (svgPath) {
        if (path.extname(svgPath) == ".svg") {
          return Svg2(svgPath).svg.resize(resize).extend(20).png({ transparent: false }).toBuffer();
        }

        return fs.readFileSync(svgPath);
      })
    );
    looksame(buffers[0], buffers[1], { strict: false, tolerance: 3.5 }, (err, results) => {
      if (err) {
        reject(err);
      } else {
        looksame.createDiff(
          {
            reference: buffers[0],
            current: buffers[1],
            highlightColor: "#ff00ff",
            strict: false,
            tolerance: 3.5,
          },
          (error, diff) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                equal: results.equal,
                buffer: { broken: buffers[0], fixed: buffers[1], diff: diff },
              });
            }
          }
        );
      }
    });
  });
}

module.exports = {
  prepare,
  emptyDir,
  isEmptyDir,
  brokenAndFixedSvgsMatch,
};
