"use strict";

// const Svg = require("./svg");
const fs = require("fs");
const path = require("path");
const error = require("./error");
const Svg2 = require("oslllo-svg2");
const Svg = require("./svg");
const is = require("oslllo-validator");
const SVGFixer = require("./constructor");
const potrace = require("oslllo-potrace");
const asyncPool = require("tiny-async-pool");

const Processor = function (fixer) {
    this.fixer = fixer;
    this.progress = 0;
};

Processor.prototype = {
    start: function () {
        return new Promise(async (resolve, reject) => {
            try {
                this.setup();
                var svgs = this.fixer.source;
                var concurrency = this.fixer.options.get("fixConcurrency");
                svgs = svgs.map((path) => {
                    return { path: path, instance: this };
                });
                await asyncPool(concurrency, svgs, this.instance);
                this.teardown();
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    },
    setup: function () {},
    tick: function (callback) {
        callback();
    },
    teardown: function () {},
    instance: function (data) {
        if (!is.pathToFile(data.path) || path.extname(data.path) != ".svg") {
            throw new Error(
                `expected a direct path to a svg file, ${data.path} was given.`
            );
        }
        return new Promise(async (resolve, reject) => {
            var instance = data.instance;
            var svg = new Svg(data.path);
            var fixed = await svg.process();
            var destination = path.join(
                instance.fixer.destination,
                instance.fixer.location.basename(svg.path)
            );
            fs.writeFile(destination, fixed, () =>
                instance.tick(() => resolve())
            );
        });
    },
};

module.exports = Processor;
