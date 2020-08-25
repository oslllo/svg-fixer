"use strict";

const Svg2 = require("oslllo-svg2");
const potrace = require("oslllo-potrace");

const Svg = function (path) {
    this.path = path;
    this.png = new Object();
    this.resized = new Object();
    this.svg2 = Svg2(this.path);
    this.element = this.svg2.toElement();
    this.outerHTML = this.element.outerHTML;
    this.resized = this._resized();
    this.original = this._original();
    this.scale = this._scale();
};

Svg.prototype = {
    _resized: function () {
        var element = Svg2(this.outerHTML).svg
            .resize({
                width: 600,
                height: Svg2.AUTO,
            })
            .toElement();
        var svg2 = Svg2(element.outerHTML);
        var dimensions = svg2.svg.dimensions();

        return { element, svg2, dimensions };
    },
    _original: function () {
        var element = this.element.cloneNode(true);
        var dimensions = this.svg2.svg.dimensions();
        var attributes = Object.values(element.attributes).map(function (attribute) {
            return { name: attribute.name, value: attribute.value };
        });

        return { element, dimensions, attributes };
    },
    _scale: function () {
        return this.original.dimensions.height / this.resized.dimensions.height;
    },
    _restore: function (outerHTML) {
        var element = Svg2(outerHTML).toElement();
        while (element.attributes.length > 0) {
            element.removeAttribute(element.attributes[0].name);
        }
        for (
            var i = 0;
            element.attributes.length < this.original.attributes.length;
            i++
        ) {
            var attribute = this.original.attributes[i];
            element.setAttribute(attribute.name, attribute.value);
        }

        return element.outerHTML;
    },
    process: function () {
        return new Promise(async (resolve, reject) => {
            try {
                var trace = new potrace.Potrace();
                var pngBuffer = await this.resized.svg2.png().toBuffer();
                await trace.loadImage(pngBuffer);
                await trace.process();
                var traced = this._restore(trace.getSVG(this.scale));
                resolve(traced);
            } catch (err) {
                reject(err)
            }
        });
    },
};

module.exports = Svg;
