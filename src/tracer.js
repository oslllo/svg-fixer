"use strict";

const fs = require("fs/promises");

const fix = require("./fixer");

module.exports = async ({ source, destination, resolution }) => {
  const fixed = await fix({ source, resolution });
  await fs.writeFile(destination, fixed);
};
