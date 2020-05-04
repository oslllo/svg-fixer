"use strict";

const colors = require("colors");
const fs = require("fs");
const { JSDOM } = require("jsdom");
const sharp = require("sharp");
const potrace = require("oslllo-potrace");
const path = require("path");

const core = {
	setOptions: function (options) {
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				this.options[key] = options[key];
			}
		}
	},
	process: function () {
		return new Promise(async (resolve, reject) => {
			try {
				var spb = this.options.showProgressBar;
				if (spb) {
					console.log(`${colors.green("Fixing: ")} ${this.source}`);
					this.progressbar.start(this.svgs.length, 0, {
						speed: "N/A",
					});
				}
				for (var svgIndex = 0; svgIndex < this.svgs.length; svgIndex++) {
					var svg = this.svgs[svgIndex];
					var svgData = fs.readFileSync(svg);
					var dom = new JSDOM(svgData);
					var svgNode = this.getSvgElementFromDom(dom);
					var originalSvgNode = svgNode.cloneNode(true);
					var {
						svgUpscaled,
						svgUpscaleMultiplier,
					} = this.upscaleSvgElementDimensions(svgNode);

					var svgNodeDimensions = this.getSvgElementDimensions(svgNode);
					var originalSvgNodeDimensions = this.getSvgElementDimensions(
						originalSvgNode
					);

					var originalAttributes = Object.values(
						originalSvgNode.attributes
					).map(function (attribute) {
						return { name: attribute.name, value: attribute.value };
					});

					var raw = svgNode.outerHTML;
					var svgBuffer = Buffer.from(raw);
					var svgPngBuffer = await this.svgToPng(svgBuffer);
					var trace = new potrace.Potrace();
					await trace.loadImage(svgPngBuffer);
					await trace.process();
					var scale = 1;
					if (svgUpscaled) {
						scale = originalSvgNodeDimensions.height / svgNodeDimensions.height;
					}

					var tracedSvg = trace.getSVG(scale);
					var tracedDom = new JSDOM(tracedSvg);
					var tracedSvgNode = this.getSvgElementFromDom(tracedDom);
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
					var fixed = Buffer.from(raw);
					fs.writeFileSync(path.join(this.dest, path.basename(svg)), fixed);
					if (spb) {
						this.progressbar.update(svgIndex);
					}
				}
				if (spb) {
					this.progressbar.update(this.svgs.length);
					this.progressbar.stop();
				}
				resolve();
			} catch (e) {
				reject(e);
			}
		});
	},
	getSvgElementFromDom: function (dom, index = 0) {
		return dom.window.document.getElementsByTagName("svg")[index];
	},
	/**
	 *
	 * @param {string | Buffer} svg
	 * @param {string | null} opts
	 */
	svgToPng: async function (svg, opts) {
		var options = {
			dest: null,
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
				if (options.dest !== null) {
					await s.toFile(options.dest);
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

module.exports = core;
