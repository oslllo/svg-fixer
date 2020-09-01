"use strict";

const fs = require("fs-extra");
const { path2 } = require("./helper");

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

module.exports = {
    prepare,
    emptyDir,
};
