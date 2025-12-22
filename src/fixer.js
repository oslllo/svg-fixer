"use strict";

const Svg = require("./svg");

module.exports = ({ source, resolution }) => {
  const svg = new Svg(source, resolution);

  return svg.process();
};
