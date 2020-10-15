"use strict";

const { prepare } = require("./src");

prepare();

require("./src/test.parameters");
require("./src/test.pathing");
require("./src/test.exceptions");
require("./src/test.svgfixer");
