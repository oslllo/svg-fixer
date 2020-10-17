"use strict";

const { emptyDir, isEmptyDir } = require("./");
const { SVGFixer, assert, path2 } = require("./helper");

describe("test.async", () => {
    describe("it exports the svg(s) and", () => {
        it("returns a promise when no callback is provided", async () => {
            var source = path2.single.relative;
            var destination = path2.fixed.relative;
            emptyDir(destination);
            assert.isTrue(isEmptyDir(destination));
            var fixer = SVGFixer(source, destination).fix();
            assert.isTrue(fixer instanceof Promise);
            await fixer;
            assert.isFalse(isEmptyDir(destination));
        });
        it("returns an instance of SVGFixer when a callback function is provided", (done) => {
            var source = path2.single.relative;
            var destination = path2.fixed.relative;
            emptyDir(destination);
            assert.isTrue(isEmptyDir(destination));
            /**
             * @ignore
             * @description - Test callback function
             */
            function callback (err, fixer) {
                assert.isFalse(fixer instanceof Promise);
                assert.isTrue(fixer instanceof SVGFixer);
                assert.isFalse(isEmptyDir(destination));
                done(err);
            }
            var fixer = SVGFixer(source, destination).fix(callback);
            assert.isTrue(fixer instanceof SVGFixer);
        });
    });
});
