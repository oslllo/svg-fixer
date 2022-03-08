"use strict";

/*eslint no-console: "off" */

const path = require("path");
const fs = require("fs-extra");
const SVGFixer = require("../src");
const inquirer = require("inquirer");
const { StopWatch } = require("stopwatch-node");

var questions = [
  {
    type: "list",
    name: "source",
    message: "Select a source",
    choices: ["single", "double", "multiple", "manual"],
  },
  {
    type: "input",
    name: "source",
    message: "Enter the source path",
    when: function (answers) {
      return answers.source === "manual";
    },
  },
  {
    type: "list",
    name: "destination",
    message: "Select a destination",
    choices: ["fixed-icons", "manual"],
  },
  {
    type: "input",
    name: "destination",
    message: "Enter the destination path",
    when: function (answers) {
      return answers.destination === "manual";
    },
  },
  {
    type: "confirm",
    name: "stopwatch",
    message: "Enable stopwatch?",
  },
  {
    type: "confirm",
    name: "showProgressBar",
    message: "Show progress bar?",
    default: "Y",
  },
  {
    type: "confirm",
    name: "throwIfDestinationDoesNotExist",
    message: "Throw if destination does not exist?",
    default: "Y",
  },
  {
    type: "input",
    name: "traceResolution",
    message: "Enter the resolution of the trace image",
    default: 600,
  },
];

inquirer.prompt(questions).then(async (answers) => {
  var source =
        answers.source === "manual"
          ? answers.source
          : path.resolve(`test/assets/broken-icons/${answers.source}`);
  var destination =
        answers.destination === "manual"
          ? answers.destination
          : path.resolve(`test/assets/${answers.destination}`);
  var options = {
    showProgressBar: answers.showProgressBar,
    throwIfDestinationDoesNotExist: answers.throwIfDestinationDoesNotExist,
    traceResolution: answers.traceResolution,
  };
  var stopwatch;
  fs.emptyDirSync(destination);
  if (answers.stopwatch) {
    stopwatch = new StopWatch("sw");
    stopwatch.start("SVGFixer");
  }
  await SVGFixer(source, destination, options).fix();
  if (answers.stopwatch) {
    stopwatch.stop();
    stopwatch.prettyPrint();
  }
});
