"use strict";

const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");
const error = require("./error");
const is = require("oslllo-validator");

const Location = function (instance, source, destination) {
  if (!is.string(source)) {
    throw error.invalidParameterError("source", "string", source);
  }
  if (!is.string(destination)) {
    throw error.invalidParameterError("destination", "string", destination);
  }
  if (!this.exists(source)) {
    throw error.invalidPathError("source", source);
  }
  if (!this.exists(destination)) {
    if (instance.options.get("throwIfDestinationDoesNotExist")) {
      throw error.invalidPathError("destination", destination);
    } else {
      fs.mkdirSync(destination);
    }
  }
  this.original = { source };
  var locations = { source, destination };
  for (var location in locations) {
    locations[location] = path.resolve(locations[location]).replace(/\\/gu, "/");
  }
  this.source = this.process(locations.source);
  this.destination = locations.destination;
};

Location.prototype = {
  exists: function (location) {
    return fs.existsSync(location);
  },
  process: function (source) {
    source = [source];
    if (is.pathToDir(source[0])) {
      source = fg.sync(
        path.join(source[0], path.join("/", "*.svg")).replace(/\\/gu, "/")
      );
    }
    source.forEach((svgPath) => {
      if (!is.pathToFile(svgPath) || path.extname(svgPath) != ".svg") {
        throw new Error(
          `one of the source file paths does not point to a .svg file. ${svgPath}`
        );
      }
    });

    return source;
  },
};

module.exports = Location;
