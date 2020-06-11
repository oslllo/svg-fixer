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
const PromisePool = require('@supercharge/promise-pool')


// class SvgToPngConverter {
// 	constructor() {
// 	  this._init = this._init.bind(this);
// 	  this._cleanUp = this._cleanUp.bind(this);
// 	  this.convertFromInput = this.convertFromInput.bind(this);
// 	}
  
// 	_init() {
// 	  this.canvas = document.createElement("canvas");
// 	  this.imgPreview = document.createElement("img");
// 	  this.imgPreview.style = "position: absolute; top: -9999px";
// 	  document.body.appendChild(this.imgPreview);
// 	  this.canvasCtx = this.canvas.getContext("2d");
// 	}
  
// 	_cleanUp() {
// 	  document.body.removeChild(this.imgPreview);
// 	}
  
// 	convertFromInput(input, callback) {
// 	  this._init();
  
// 	  let _this = this;
  
// 	  this.imgPreview.onload = function () {
// 		const img = new Image();
// 		_this.canvas.width = _this.imgPreview.clientWidth;
// 		_this.canvas.height = _this.imgPreview.clientHeight;
// 		img.crossOrigin = "anonymous";
// 		img.src = _this.imgPreview.src;
  
// 		img.onload = function () {
// 		  _this.canvasCtx.drawImage(img, 0, 0);
  
// 		  let imgData = _this.canvas.toDataURL("image/png");
  
// 		  if (typeof callback == "function") {
// 			callback(imgData);
// 		  }
  
// 		  _this._cleanUp();
// 		};
// 	  };
  
// 	  this.imgPreview.src = input;
// 	}
  
//   }

//   let input = "https://restcountries.eu/data/afg.svg"
// new SvgToPngConverter().convertFromInput(input, function(imgData){
//     // You now have your png data in base64 (imgData). 
//     // Do what ever you wish with it here.
// });

const Core = {
	svgToPngUri: function (svg) {
		return new Promise((resolve, reject) => {
			var svgElement = this.getSvgElementFromDom(this.newDom(svg));
			var svgDimensions = this.getSvgElementDimensions(svgElement);
			var dom = this.newDom('', { resources: "usable" });
			var document = dom.window.document;
			var canvas = document.createElement("canvas");
			var imgPreview = document.createElement("img");
			var canvasCtx = canvas.getContext("2d");
			imgPreview.style = "position: absolute; top: -9999px";
			document.body.appendChild(imgPreview);
			const encoded = encodeURIComponent(svg)
			.replace(/'/g, '%27')
			.replace(/"/g, '%22')
			const header = 'data:image/svg+xml,'
			const dataUrl = header + encoded
			imgPreview.src = dataUrl;
			imgPreview.onload = function () {
				const img = new dom.window.Image();
				canvas.width = svgDimensions.width;
				canvas.height = svgDimensions.height;
				img.src = imgPreview.src
				img.onload = function () {
					canvasCtx.drawImage(img, 0, 0);
					var uri = canvas.toDataURL("image/png");
					resolve({ uri, svgDimensions, encoded });
				}
			}

		})
		// document.body.removeChild(this.imgPreview);
	},
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
	pathIsFile: function (p) {
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
		this.source = source;
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
	newDom: function (content = "<html></html>", options = {}) {
		return new JSDOM(content, options);
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
					tick: function (data) {
						if (spb) {
							progress++;
							self.progressbar.update(progress);
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
				var tracedDom = this.newDom();
				var dom = this.newDom();
				function _fixInstance(svgPath) {
					return new Promise(async (resolve, reject) => {
						var svg = svgPath;
						if (!self.pathIsFile(svg)) {
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
						var trace = new potrace.Potrace();
						await trace.loadImage(svgPngBuffer);
						await trace.process();
						var scale = 1;
						if (svgUpscaled) {
							scale =
								originalSvgNodeDimensions.height / svgNodeDimensions.height;
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
						});
						resolve();
					});
				}
				// console.log(this.svgs);
				// var results = await asyncPool(
				// 	2,
				// 	this.svgs,
				// 	_fixInstance
				// );

				// var { results, errors } = await PromisePool.for(this.svgs).process(async s => _fixInstance(s));
				for (var i = 0; i < this.svgs.length; i++) {
					await _fixInstance(this.svgs[i])
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
		if (!path.isAbsolute(p)) {
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
				function blankImage (dimensions) {
					return new Promise((resolve, reject) => {

						new jimp(dimensions.width, dimensions.height, 0xFFFFFF, (err, image) => {
							// !here
							console.log("Done Processing", dimensions)
							// image.resize(dimensions.width, dimensions.height)
							if (err) {
								reject(err)
							} else {
								resolve(image);
							}
						})
					})
				}
				// console.log(svg.toString())
				var { uri, svgDimensions } = await this.svgToPngUri(svg.toString());
				// console.log("TEST", uri)
				// var s = await sharp(svg).png();
				var s = await jimp.read(Buffer.from(uri.replace(/^data:image\/png;base64,/, ""), 'base64'));
							
				if (options.flatten) {
					// s = s.flatten({ background: { r: 255, g: 255, b: 255 } });
					try {
						var blank = await blankImage(svgDimensions)
					} catch (e) {
						console.log(e)
					}
				}
				if (options.extend) {
					var extension = svgDimensions;
					for (var d in extension) {
						extension[d] = extension[d] + 10;
					}
					try {
						var blank = await blankImage(extension)
					} catch (e) {
						console.log(e)
					}
					
					// s = s.extend({
					// 	top: 5,
					// 	bottom: 5,
					// 	left: 5,
					// 	right: 5,
					// 	background: { r: 255, g: 255, b: 255, alpha: 1 },
					// });
				}
				
				s = blank.composite(s, 0, 0);
				if (options.destination !== null) {
					// await s.toFile(options.destination);
					s.write(options.destination, (err) => {
						if (err) {
							reject(err)
						} else {
							// console.log("Path")
							resolve()
						}
					})
				} else {
					// var buffer = await s.toBuffer();
					s.getBuffer(jimp.MIME_PNG, (err, buffer) => {
						if (err) {
							reject(err)
						} else {
							// console.log("Buffer")
							resolve(buffer);
						}
					})
				}
			} catch (e) {
				reject(e);
			}
		});
	},
	filterDimensionUnits: function (dimension) {
		var _units = ["rem", "px", "em"];
		for (var i = 0; i < _units.length; i++) {
			var _unit = _units[i];
			if (dimension.search(_unit) !== -1) {
				var _replaced = dimension.replace(_unit, "");
				switch (_unit) {
					case "px":
						return _replaced;
						break;
					case "em":
					case "rem":
						return _replaced * 16;
						break;
				}
			}
		}
		return dimension;
	},
	getSvgElementDimensions: function (svgElement) {
		var _dimensionNames = ["width", "height"];
		var _d = { width: 0, height: 0 };
		if (
			svgElement.hasAttribute(_dimensionNames[0]) &&
			svgElement.hasAttribute(_dimensionNames[1])
		) {
			var _width = svgElement.getAttribute(_dimensionNames[0]);
			var _height = svgElement.getAttribute(_dimensionNames[1]);
			for (var i = 0; i < _dimensionNames.length; i++) {
				switch (_dimensionNames[i]) {
					case "width":
						_width = this.filterDimensionUnits(_width);
						break;
					case "height":
						_height = this.filterDimensionUnits(_height);
						break;
				}
			}
			_d.width = Number(_width);
			_d.height = Number(_height);
		} else if (svgElement.hasAttribute("viewBox")) {
			var _viewbox = svgElement.getAttribute("viewBox").split(" ");
			_d.width = Number(_viewbox[2]);
			_d.height = Number(_viewbox[3]);
		}
		return _d;
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
