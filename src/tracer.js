"use strict";

const fs = require("fs/promises");
const Svg = require("./svg");

module.exports = async ({ source, destination, resolution }) => {
  const svg = new Svg(source, resolution);
  const fixed = await svg.process();
  await fs.writeFile(destination, fixed);
};
