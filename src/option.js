"use strict";

const error = require("./error");
const is = require("oslllo-validator");

const Option = function (options) {
  this.data = {
    showProgressBar: false,
    throwIfDestinationDoesNotExist: true,
    traceResolution: 600,
  };
  if (!is.object(options)) {
    throw error.invalidParameterError("options", "object", options);
  }
  if (!is.empty(options)) {
    this.update(options);
  }
};

Option.prototype = {
  all: function () {
    return this.data;
  },
  get: function (option) {
    if (!is.defined(option) || !is.string(option)) {
      throw error.invalidParameterError("option", "string", option);
    }
    var options = Object.keys(this.data);
    if (!options.includes(option)) {
      throw error.invalidParameterError(
        "setting",
        `one of ${options.toString()}`,
        option
      );
    }

    return this.data[option];
  },
  update: function (options) {
    for (var key in options) {
      if (Object.prototype.hasOwnProperty.call(this.data, key)) {
        this.data[key] = options[key];
      }
    }
  },
};

module.exports = Option;
