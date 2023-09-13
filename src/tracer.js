"use strict";

const fs = require("fs");
const Svg = require("./svg");

module.exports = async ({ source, destination, resolution }) => {
  const svg = new Svg(source, resolution);
  const fixed = await svg.process();
  fs.writeFileSync(destination, fixed);
};
