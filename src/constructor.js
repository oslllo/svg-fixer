"use strict";

const Option = require("./option");
const Location = require("./location");
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
    fix: function () {
        return new Promise(async (resolve, reject) => {
            var processor = new Processor(this);
            try {
                await processor.start();
                resolve(this);
            } catch (err) {
                reject(err);
            }
        });
    },
};

module.exports = SVGFixer;
