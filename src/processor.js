"use strict";

const fs = require("fs");
const path = require("path");
const Svg = require("./svg");
const colors = require("colors");
const cliprogress = require("cli-progress");

const Processor = function (fixer) {
    this.fixer = fixer;
    this.progress = {
        status: 0,
        bar: undefined,
        show: this.fixer.options.get("showProgressBar"),
    };
    this.source = this.fixer.source;
    this.destination = this.fixer.destination;
};

Processor.prototype = {
    start: async function () {
        this.setup();
        var svgs = this.source;
        svgs = svgs.map((source) => {
            var destination = path.join(
                this.destination,
                path.basename(source)
            );

            return { source, destination };
        });
        for (var i = 0; i < svgs.length; i++) {
            await this.instance(svgs[i]);
        }
        this.teardown();
    },
    setup: function () {
        if (this.progress.show) {
            process.stdout.write(
                `${colors.green("Fixing: ")} ${this.fixer.location.original.source}`
            );
            process.stdout.write("\n");
            this.progress.bar = new cliprogress.SingleBar(
                {
                    format:
                        `${colors.yellow("Progress")} |` +
                        colors.yellow("{bar}") +
                        "| {percentage}% || {value}/{total} Chunks || Speed: {speed}",
                },
                cliprogress.Presets.shades_classic
            );
            this.progress.bar.start(this.source.length, 0, {
                speed: "N/A",
            });
        }
    },
    tick: function (callback) {
        if (this.progress.show) {
            this.progress.status++;
            this.progress.bar.update(this.progress.status);
        }
        callback();
    },
    teardown: function () {
        if (this.progress.show) {
            this.progress.bar.update(this.source.length);
            this.progress.bar.stop();
            process.stdout.write(`${colors.green("Done!")}`);
            process.stdout.write("\n");
        }
    },
    instance: function ({ source, destination }) {
        return new Promise(async (resolve, reject) => {
            try {
                var svg = new Svg(source);
                var fixed = await svg.process();
                fs.writeFileSync(destination, fixed);
                this.tick(() => resolve());
            } catch (err) {
                reject(err);
            }
        });
    },
};

module.exports = Processor;
