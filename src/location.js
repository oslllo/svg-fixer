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
            throw error.invalidPathError("destination", source);
        }
    }
    var locations = { source, destination };
    for (var location in locations) {
        locations[location] = this.makeAbsolute(locations[location]);
        locations[location] = this.slash(locations[location]);
    }
    source = locations.source;
    source = this.processSource(source);
    destination = locations.destination;
    this.source = source;
    this.destination = destination;
};

Location.prototype = {
    basename: function (location) {
        if (process.platform == "win32") {
            return path.win32.basename(location);
        } else {
            return path.posix.basename(location);
        }
    },
    exists: function (location) {
        return fs.existsSync(location);
    },
    makeAbsolute: function (location) {
        if (!path.isAbsolute(location)) {
            location = path.resolve(location);
        }

        return location;
    },
    toGlob: function (location) {
        return fg.sync(this.slash(path.join(location, path.join("/", "*.svg"))));
    },
    slash: function (location) {
        const isExtendedLengthPath = /^\\\\\?\\/.test(location);
        const hasNonAscii = /[^\u0000-\u0080]+/.test(location);
        if (isExtendedLengthPath || hasNonAscii) {
            return location;
        }

        return location.replace(/\\/g, "/");
    },
    processSource: function (source) {
        if (is.pathToDir(source)) {
            source = this.toGlob(source);
        } else {
            source = [source];
        }

        return source;
    },
};

module.exports = Location;
