#!/usr/bin/env node

"use strict";

const SVGFixer = require("../");
const colors = require("ansi-colors");
var argvs = require("yargs/yargs")(process.argv.slice(2)); // eslint-disable-line no-magic-numbers

argvs
  .usage("\nUsage: oslllo-svg-fixer [source] [destination] [options]")
  .option("source", {
    alias: "s",
    describe: "path containing SVG(s).",
    type: "string",
    demandOption: true,
  })
  .option("destination", {
    alias: "d",
    describe: "path to store fixed SVG(s).",
    type: "string",
    demandOption: true,
  })
  .option("strict-destination", {
    alias: "sd",
    describe: "throw if destination path does not exist.",
    default: true,
    type: "boolean",
  })
  .option("show-progress", {
    alias: "sp",
    describe: "show progress bar in CLI.",
    default: true,
    type: "boolean",
  })
  .option("trace-resolution", {
    alias: "tr",
    describe: "resolution of trace image: larger == higher quality and slower processing",
    default: 600,
    type: "number",
  })
  .help();

argvs = argvs.argv;

const source = argvs["source"]; // eslint-disable-line dot-notation
const destination = argvs["destination"]; // eslint-disable-line dot-notation
const options = {
  showProgressBar: argvs["show-progress"],
  throwIfDestinationDoesNotExist: argvs["strict-destination"],
  traceResolution: argvs["trace-resolution"],
};

(async () => {
  try {
    await SVGFixer(source, destination, options).fix();
  } catch (err) {
    console.log("\n" + colors.red("ERR: " + err.message + "\n")); // eslint-disable-line no-console
    console.log(colors.yellow("STACK: " + err.stack + "\n")); // eslint-disable-line no-console
    process.exit(1); // eslint-disable-line no-process-exit, no-magic-numbers
  }
})();
