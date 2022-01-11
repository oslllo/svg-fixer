"use strict";

const colors = require("ansi-colors");
const cliprogress = require("cli-progress");

const Progress = function (source, max) {
  this.max = max;
  this.status = 0;
  this.source = source;
  this.bar = undefined;
  this.init();
};

Progress.prototype = {
  init: function () {
    process.stdout.write(colors.green("Fixing:") + " " + this.source);
    process.stdout.write("\n");
    this.bar = new cliprogress.SingleBar(
      {
        format:
                    colors.yellow("Progress") +
                    ": " +
                    "|" +
                    colors.yellow("{bar}") +
                    "| {percentage}% || {value}/{total} Chunks || Speed: {speed}",
      },
      cliprogress.Presets.shades_classic
    );
    this.bar.start(this.max, 0, {
      speed: "N/A",
    });
  },
  tick: function () {
    this.status++;
    this.bar.update(this.status);
  },
  stop: function () {
    this.bar.update(this.max);
    this.bar.stop();
    process.stdout.write(colors.green("Done!"));
    process.stdout.write("\n");
  },
};

module.exports = Progress;
