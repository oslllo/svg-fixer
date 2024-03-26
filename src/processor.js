"use strict";

const path = require("path");
const is = require("oslllo-validator");
const Progress = require("./progress");
const Piscina = require("piscina");

const workerPool = new Piscina({
  filename: path.resolve(__dirname, "tracer.js")
});

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

        const resolution = this.fixer.options.get("traceResolution");

        svgs = svgs.map((source) => {
          var destination = path.join(this.destination, path.basename(source));

          return { source, destination, resolution };
        });

        const workerPromises = svgs.map(async (svg) => {
          await workerPool.run(svg);
          // eslint-disable-next-line no-empty-function
          this.tick(() => {});
        });

        await Promise.all(workerPromises);

        this.teardown();
        resolve(this.fixer);
      } catch (err) {
        reject(err);
        this.teardown();
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
};

module.exports = Processor;
