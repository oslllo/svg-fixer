"use strict";

const Option = require("./option");
const Location = require("./location");
const is = require("oslllo-validator");
const Processor = require("./processor");

const SVGFixer = function (source, destination, options = {}) {
  if (!(this instanceof SVGFixer)) {
    return new SVGFixer(source, destination, options);
  }
  this.options = new Option(options);
  this.location = new Location(this, source, destination);
  this.source = this.location.source;
  this.destination = this.location.destination;

  return this;
};

SVGFixer.prototype = {
  fix: function (callback) {
    var processor = new Processor(this);
    if (is.fn(callback)) {
      processor.start(callback);

      return this;
    }

    return processor.start();
  },
};

module.exports = SVGFixer;
