"use strict";

const fs = require("fs");
const path = require("path");
const Svg = require("./svg");
const is = require("oslllo-validator");

const Processor = function (fixer) {
    this.fixer = fixer;
    this.progress = 0;
};

Processor.prototype = {
    start: async function () {
        this.setup();
        var svgs = this.fixer.source;
        svgs = svgs.map((source) => {
            var destination = path.join(
                this.fixer.destination,
                this.fixer.location.basename(source)
            );
            if (!is.pathToFile(source) || path.extname(source) != ".svg") {
                throw new Error(
                    `expected a direct path to a svg file, ${source} was given.`
                );
            }

            return { source, destination };
        });
        for (var i = 0; i < svgs.length; i++) {
            await this.instance(svgs[i]);
        }
        this.teardown();
    },
    setup: function () {},
    tick: function (callback) {
        callback();
    },
    teardown: function () {},
    instance: async function ({ source, destination }) {
        var svg = new Svg(source);
        var fixed = await svg.process();
        fs.writeFile(destination, fixed, () => {
            this.tick(() => Promise.resolve());
        });
    },
};

module.exports = Processor;
