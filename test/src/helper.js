"use strict";

const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");
const SVGFixer = require("../../");
const { assert, expect } = require("chai").use(require("chai-as-promised"));

const path2 = (function () {
  var single = {
    relative: "test/assets/broken-icons/single",
  };
  single.absolute = path.resolve(single.relative);

  var double = {
    relative: "test/assets/broken-icons/double",
  };
  double.absolute = path.resolve(double.relative);

  var direct = {
    relative: path.join(single.relative, fs.readdirSync(single.relative)[0]),
  };
  direct.absolute = path.resolve(direct.relative);

  var multiple = {
    relative: "test/assets/broken-icons/multiple",
  };
  multiple.absolute = path.resolve(multiple.relative);

  var failed = {
    relative: "test/assets/failed-icons",
  };
  failed.absolute = path.resolve(failed.relative);

  var fixed = {
    relative: "test/assets/fixed-icons",
  };
  fixed.absolute = path.resolve(fixed.relative);

  return {
    fixed,
    single,
    multiple,
    failed,
    direct,
    double,
  };
})();

const hookStream = function(_stream, fn) {
  // Reference default write method
  var old_write = _stream.write;
  // _stream now write with our shiny function
  _stream.write = fn;

  return function() {
    // reset to the default write method
    _stream.write = old_write;
  };
};

module.exports = {
  fg,
  path2,
  assert,
  expect,
  SVGFixer,
  hookStream
};
