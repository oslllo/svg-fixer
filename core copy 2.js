"use strict";

const colors = require("colors");
const fs = require("fs");
const fg = require("fast-glob");
const { JSDOM } = require("jsdom");
const sharp = require("sharp");
const potrace = require("oslllo-potrace");
const path = require("path");
const cliprogress = require("cli-progress");
const asyncPool = require("tiny-async-pool");

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
		return fg.sync(path.join(p, "/*.svg"));
	},
	pathExists: function (p, name, throwErr = null) {
		var exists = fs.existsSync(p);
		if (throwErr === null) {
			throwErr = this.options.throwIfPathDoesNotExist;
		}
		if (!exists && throwErr) {
			var errorMessage = `path ${p} does not exist.`;
			if (name) {
				errorMessage = `${name} ${errorMessage}`
			}
			throw TypeError(errorMessage);
			return;
		}

		return exists;
	},
	pathIsDir: function (p) {
		return fs.existsSync(p) && fs.statSync(p).isDirectory();
	},
	pathIsFile: function (p) {
		return fs.existsSync(p) && fs.statSync(p).isFile();
	},
	setSource: function (source) {
		switch (true) {
			case typeof source === "string":
				this.pathExists(source, 'Source');
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
		this.source = source;
		this.setSvgs();
	},
	setDest: function (destination) {
		switch (true) {
			case typeof destination === "string":
				this.pathExists(destination, 'Destination');
				destination = this.makePathAbsolute(destination);
				break;
			default:
				throw TypeError(
					`'destination' argument should be a string (path), ${this.getType(
						destination
					)} given`
				);
		}
		this.destination = destination;
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
	newDom: function (content = '<html></html>') {
		return new JSDOM(content);
	},
	process: function () {
		return new Promise(async (resolve, reject) => {
			try {
				var self = this;
				var spb = this.options.showProgressBar;
				var storage = {
					objects: [],
					buffers: [],
				};
				var process = {
					setup: function () {
						if (spb) {
							console.log(`${colors.green("Fixing: ")} ${self.source}`);
							self.progressbar.start(self.svgs.length, 0, {
								speed: "N/A",
							});
						}
					},
					tick: function (data) {
						if (spb) {
							self.progressbar.update(data.progressbar.index);
						}
						storage.objects.push(data.svg);
					},
					teardown: function () {
						if (spb) {
							self.progressbar.update(self.svgs.length);
							self.progressbar.stop();
							console.log(`${colors.green("Done!")}`);
						}
						switch (true) {
							case typeof self.destination === "string":
								for (var i = 0; i < storage.objects.length; i++) {
									var svg = storage.objects[i];
									fs.writeFileSync(
										path.join(self.destination, path.basename(svg.source)),
										svg.data
									);
								}
								break;
						}
					},
				};
				process.setup();
				var trace = new potrace.Potrace();
				var tracedDom = this.newDom();
				var dom = this.newDom();
				function _fixInstance(index) {
					return new Promise(async (resolve, reject) => {
						var svg = self.svgs[index];
						if (! self.pathIsFile(svg)) {
							console.log(
								`Expected a direct path to file, ${svg} given. Skipping entry.`
							);
							resolve();
						}
						var svgData = fs.readFileSync(svg, "utf8");
						dom.window.document.write(svgData);
						var svgNode = self.getSvgElementFromDom(dom);
						var originalSvgNode = svgNode.cloneNode(true);
						var {
							svgUpscaled,
							svgUpscaleMultiplier,
						} = self.upscaleSvgElementDimensions(svgNode);

						var svgNodeDimensions = self.getSvgElementDimensions(svgNode);
						var originalSvgNodeDimensions = self.getSvgElementDimensions(
							originalSvgNode
						);

						var originalAttributes = Object.values(
							originalSvgNode.attributes
						).map(function (attribute) {
							return { name: attribute.name, value: attribute.value };
						});

						var raw = svgNode.outerHTML;
						var svgBuffer = Buffer.from(raw);
						var svgPngBuffer = await self.svgToPng(svgBuffer);
						await trace.loadImage(svgPngBuffer);
						await trace.process();
						var scale = 1;
						if (svgUpscaled) {
							scale = originalSvgNodeDimensions.height / svgNodeDimensions.height;
						}
						var tracedSvg = trace.getSVG(scale);
						tracedDom.window.document.write(tracedSvg);
						var tracedSvgNode = self.getSvgElementFromDom(tracedDom);
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
						process.tick({
							svg: {
								data: raw,
								source: svg,
							},
							progressbar: {
								index,
							},
						});
						resolve();
					});
				}
				for (var svgIndex = 0; svgIndex < this.svgs.length; svgIndex++) {
					await _fixInstance(svgIndex);

				}
				process.teardown();
				resolve(storage.buffers);
			} catch (e) {
				reject(e);
			}
		});
	},
	getSvgElementFromDom: function (dom, index = 0) {
		return dom.window.document.getElementsByTagName("svg")[index];
	},
	makePathAbsolute: function (p) {
		if (! path.isAbsolute(p)) {
			p = path.resolve(p);
		}

		return p;
	},
	/**
	 *
	 * @param {string | Buffer} svg
	 * @param {string | null} opts
	 */
	svgToPng: async function (svg, opts) {
		var options = {
			destination: null,
			extend: false,
			flatten: true,
		};
		if (arguments.length === 2) {
			for (var opt in opts) {
				if (options.hasOwnProperty(opt)) {
					options[opt] = opts[opt];
				}
			}
		}
		return new Promise(async (resolve, reject) => {
			if (!typeof svg !== "string" && !svg instanceof Buffer) {
				reject(
					TypeError(
						`'svg' argument should be of type Buffer or string, ${typeof svg} given`
					)
				);
			}
			if (typeof svg === "string" && svg !== path.basename(svg)) {
				svg = Buffer.from(svg);
			}
			try {
				var s = await sharp(svg).png();
				if (options.flatten) {
					s = s.flatten({ background: { r: 255, g: 255, b: 255 } });
				}
				if (options.extend) {
					s = s.extend({
						top: 5,
						bottom: 5,
						left: 5,
						right: 5,
						background: { r: 255, g: 255, b: 255, alpha: 1 },
					});
				}
				if (options.destination !== null) {
					await s.toFile(options.destination);
					resolve();
				} else {
					var buffer = await s.toBuffer();
					resolve(buffer);
				}
			} catch (e) {
				reject(e);
			}
		});
	},
	getSvgElementDimensions: function (svgElement) {
		var dimensions = ["width", "height"];
		var d = { width: 0, height: 0 };
		if (
			svgElement.hasAttribute(dimensions[0]) &&
			svgElement.hasAttribute(dimensions[1])
		) {
			d.width = Number(svgElement.getAttribute(dimensions[0]));
			d.height = Number(svgElement.getAttribute(dimensions[1]));
		} else if (svgElement.hasAttribute("viewBox")) {
			var wxyz = svgElement.getAttribute("viewBox").split(" ");
			d.width = Number(wxyz[2]);
			d.height = Number(wxyz[3]);
		}
		return d;
	},
	upscaleSvgElementDimensions: function (svgElement, upscaleTo = 600) {
		var svgUpscaled = false;
		var svgUpscaleMultiplier = 1;
		var svgDimensions = this.getSvgElementDimensions(svgElement);
		if (svgDimensions.width < upscaleTo || svgDimensions.height < upscaleTo) {
			var lowest = "height";
			if (svgDimensions.width < svgDimensions.height) {
				lowest = "width";
			}
			svgUpscaleMultiplier = upscaleTo / svgDimensions[lowest];
			var sdArray = Object.values(svgDimensions);
			sdArray.forEach((value, index) => {
				switch (index) {
					case 0:
						svgElement.setAttribute(
							"width",
							svgDimensions.width * svgUpscaleMultiplier
						);
						break;
					case 1:
						svgElement.setAttribute(
							"height",
							svgDimensions.height * svgUpscaleMultiplier
						);
						break;
				}
			});
			svgUpscaled = true;
		}
		return { svgUpscaled, svgUpscaleMultiplier };
	},
};

module.exports = { Core };
