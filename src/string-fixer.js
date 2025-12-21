"use strict";

const is = require("oslllo-validator");

const { DEFAULT_TRACE_RESOLUTION } = require("./constants");
const fix = require("./fixer");
const error = require("./error");

module.exports = (svg, resolution = DEFAULT_TRACE_RESOLUTION) => {
  if (is.buffer(svg)) {
    return fix({ source: svg, resolution });
  }

  if (!is.string(svg)) {
    throw error.invalidParameterError("svg", "string or buffer", svg);
  }

  return fix({ source: Buffer.from(svg), resolution });
};
