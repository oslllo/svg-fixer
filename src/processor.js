"use strict";

const fs = require("fs");
const path = require("path");
const Svg = require("./svg");
const is = require("oslllo-validator");
const Progress = require("./progress");

const Processor = function (fixer) {
  this.fixer = fixer;
  this.progress = undefined;
  this.source = this.fixer.source;
  this.destination = this.fixer.destination;
};

Processor.prototype = {
  start: function (callback) {
    if (is.fn(callback)) {
      this.pipeline()
        .then((fixer) => {
          callback(null, fixer);
        })
        .catch((err) => {
          callback(err);
        });

      return this.fixer;
    }

    return this.pipeline();
  },
  pipeline: function () {
    return new Promise(async (resolve, reject) => {
      try {
        this.setup();
        var svgs = this.source;
        svgs = svgs.map((source) => {
          var destination = path.join(this.destination, path.basename(source));

          return { source, destination };
        });
        for (var i = 0; i < svgs.length; i++) {
          await this.instance(svgs[i]);
        }
        this.teardown();
        resolve(this.fixer);
      } catch (err) {
        reject(err);
      }
    });
  },
  setup: function () {
    if (this.fixer.options.get("showProgressBar")) {
      this.progress = new Progress(
        this.fixer.location.original.source,
        this.source.length
      );
    }
  },
  tick: function (callback) {
    if (is.defined(this.progress)) {
      this.progress.tick();
    }
    callback();
  },
  teardown: function () {
    if (is.defined(this.progress)) {
      this.progress.stop();
    }
  },
  instance: function ({ source, destination }) {
    return new Promise(async (resolve, reject) => {
      try {
        var resolution = this.fixer.options.get("traceResolution");
        var svg = new Svg(source, resolution);
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
