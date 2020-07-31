"use strict";

const colors = require("colors");
const fs = require("fs");
const fg = require("fast-glob");
const { JSDOM } = require("jsdom");
const potrace = require("oslllo-potrace");
const path = require("path");
const cliprogress = require("cli-progress");
const asyncPool = require("tiny-async-pool");
const jimp = require("jimp");
const process = require("process");
const Svg2 = require("oslllo-svg2");

const Core = {
	optionsChanged: function () {
		if (this.options.showProgressBar) {
			this.progressbar = new cliprogress.SingleBar(
				{
					format:
						`${colors.yellow("Progress")} |` +
						colors.yellow("{bar}") +
						"| {percentage}% || {value}/{total} Chunks || Speed: {speed}",
				},
				cliprogress.Presets.shades_classic
			);
		}
	},
	slash: function (p) {
		const isExtendedLengthPath = /^\\\\\?\\/.test(p);
		const hasNonAscii = /[^\u0000-\u0080]+/.test(p);
		if (isExtendedLengthPath || hasNonAscii) {
			return p;
		}
		return p.replace(/\\/g, "/");
	},
	setSvgs: function () {
		if (this.pathExists(this.source)) {
			if (this.pathIsDir(this.source)) {
				this.svgs = this.pathToGlob(this.source);
			} else {
				this.svgs = [this.source];
			}
		}
	},
	setOptions: function (options = {}) {
		if (typeof options !== "object") {
			throw TypeError(
				`'options' argument should be an object, ${typeof options} given`
			);
		}
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				this.options[key] = options[key];
			}
		}
		this.optionsChanged();
	},
	pathToGlob: function (p) {
		return fg.sync(this.slash(path.join(p, path.join("/", "*.svg"))));
	},
	pathExists: function (p, name, throwErr = null) {
		var exists = fs.existsSync(p);
		if (throwErr === null) {
			throwErr = this.options.throwIfPathDoesNotExist;
		}
		if (!exists && throwErr) {
			var errorMessage = `path ${p} does not exist.`;
			if (name) {
				errorMessage = `${name} ${errorMessage}`;
			}
			throw TypeError(errorMessage);
			return;
		}

		return exists;
	},
	pathIsDir: function (p) {
		return fs.existsSync(p) && fs.statSync(p).isDirectory();
	},
	pathIsFile: async function (p) {
		return fs.existsSync(p) && fs.statSync(p).isFile();
	},
	setSource: function (source) {
		switch (true) {
			case typeof source === "string":
				this.pathExists(source, "Source");
				source = this.makePathAbsolute(source);
				break;
			default:
				throw TypeError(
					`'source' argument should be of type string (path), ${this.getType(
						source
					)} given.`
				);
				return;
		}
		this.source = this.slash(source);
		this.setSvgs();
	},
	setDest: function (destination) {
		switch (true) {
			case typeof destination === "string":
				this.pathExists(destination, "Destination");
				destination = this.makePathAbsolute(destination);
				break;
			default:
				throw TypeError(
					`'destination' argument should be a string (path), ${this.getType(
						destination
					)} given`
				);
		}
		this.destination = this.slash(destination);
	},
	getType: function (arg) {
		var type = typeof arg;
		if (type === "function" && type.hasOwnProperty("constructor")) {
			type = arg.constructor.name;
		}

		return type;
	},
	setSourceAndDest: function (source, destination) {
		this.setSource(source);
		this.setDest(destination);
	},
	basename: function (p, ext) {
		if (process.platform == "win32") {
			return path.win32.basename(p, ext);
		} else {
			return path.posix.basename(p, ext);
		}
	},
	process: function () {
		return new Promise(async (resolve, reject) => {
			try {
				var self = this;
				var spb = this.options.showProgressBar;
				var progress = 0;
				var process = {
					setup: function () {
						if (spb) {
							console.log(`${colors.green("Fixing: ")} ${self.source}`);
							self.progressbar.start(self.svgs.length, 0, {
								speed: "N/A",
							});
						}
					},
					tick: function (data, cb) {
						if (spb) {
							progress++;
							self.progressbar.update(progress);
						}
						var svg = data.svg;
						switch (true) {
							case typeof self.destination === "string":
								fs.writeFile(
									path.join(self.destination, self.basename(svg.source)),
									svg.data,
									cb
								);
								break;
						}
					},
					teardown: function () {
						if (spb) {
							self.progressbar.update(self.svgs.length);
							self.progressbar.stop();
							console.log(`${colors.green("Done!")}`);
						}
					},
				};
				process.setup();
				function _fixInstance(svgPath) {
					return new Promise(async (resolve, reject) => {
						var svg = svgPath;
						if (!self.pathIsFile(svg)) {
							console.log(
								`Expected a direct path to file, ${svg} given. Skipping entry.`
							);
							reject();
							return;
						}
						var svgNode = Svg2(svg).toElement();
						var originalSvgNode = svgNode.cloneNode(true);
						var instance = Svg2(svgNode.outerHTML).svg.resize({ width: 600, height: Svg2.AUTO });
						svgNode = instance.toElement();
						var svgNodeDimensions = Svg2(svgNode.outerHTML).svg.dimensions();
						var originalSvgNodeDimensions = Svg2(originalSvgNode.outerHTML).svg.dimensions();
						var originalAttributes = Object.values(
							originalSvgNode.attributes
						).map(function (attribute) {
							return { name: attribute.name, value: attribute.value };
						});

						var raw = svgNode.outerHTML;
						var svgBuffer = Buffer.from(raw);
						var svgPngBuffer = await Svg2(svgBuffer).png().toBuffer();
						var trace = new potrace.Potrace();
						await trace.loadImage(svgPngBuffer);
						await trace.process();
						var scale = originalSvgNodeDimensions.height / svgNodeDimensions.height;
						var tracedSvg = trace.getSVG(scale);
						var tracedSvgNode = Svg2(tracedSvg).toElement();
						while (tracedSvgNode.attributes.length > 0) {
							tracedSvgNode.removeAttribute(tracedSvgNode.attributes[0].name);
						}
						for (
							var attrIndex = 0;
							tracedSvgNode.attributes.length < originalAttributes.length;
							attrIndex++
						) {
							var attribute = originalAttributes[attrIndex];
							tracedSvgNode.setAttribute(attribute.name, attribute.value);
						}
						var raw = tracedSvgNode.outerHTML;
						process.tick(
							{
								svg: {
									data: raw,
									source: svg,
								},
							},
							() => resolve()
						);
					});
				}
				var results = await asyncPool(
					this.options.fixConcurrency,
					this.svgs,
					_fixInstance
				);
				process.teardown();
				resolve();
			} catch (e) {
				reject(e);
			}
		});
	},
	makePathAbsolute: function (p) {
		if (!path.isAbsolute(p)) {
			p = path.resolve(p);
		}

		return p;
	}
};

module.exports = { Core };
