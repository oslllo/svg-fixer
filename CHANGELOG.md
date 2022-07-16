# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [2.1.2](https://www.github.com/oslllo/svg-fixer/compare/v2.1.0...v2.1.2) (2022-07-16)


### Miscellaneous Chores

* release 2.1.2 ([fd8cdaf](https://www.github.com/oslllo/svg-fixer/commit/fd8cdaf08b4645fe3fad229fefa9a97ec9124c9e))

## 2.1.1 (2022-05-1)

### Chore

- update dependencies
- npm audit fix


## [2.1.0](https://www.github.com/oslllo/svg-fixer/compare/v2.0.1...v2.1.1) (2022-03-8)

### Added

- add configurable trace resolution ([#72](https://github.com/oslllo/svg-fixer/pull/72))

### Updated

- Updated dependencies

## [2.0.1](https://www.github.com/oslllo/svg-fixer/compare/v2.0.0...v2.0.1) (2022-01-21)


### Refactor

- improve perfomance ([3b310aa](https://github.com/oslllo/svg-fixer/commit/3b310aaf3bf39f47b0bb56a722f03d40ad6a1b31))

## [2.0.0](https://www.github.com/oslllo/svg-fixer/compare/v1.4.1...v2.0.0) (2022-01-12)

This version did not break the api so upgrading from `v1.0.0` without any changes should be fine. The reason for the major version change is just in case something did break.

### Changed

- Removed `Canvas & JSDOM` to fix very slow `npm install` cycles.
- Switched from `Canvas` to `svg2png-wasm`.

### Updated

- Updated dependencies


## [1.4.1](https://www.github.com/oslllo/svg-fixer/compare/v1.4.0...v1.4.1) (2021-09-05)


### Bug Fixes

* vulnerabilities ([99621c6](https://www.github.com/oslllo/svg-fixer/commit/99621c6258e52836f0aaaf9876fe4b4859c81ab6))

## [1.4.0](https://www.github.com/oslllo/svg-fixer/compare/v1.3.2...v1.4.0) (2021-07-14)


### Features

* add support for svgs with "ex", "ch", "cm", "mm", "q", "in", "pc", "pt" ([4d2c18e](https://www.github.com/oslllo/svg-fixer/commit/4d2c18ef496b9ce08cbc917e3fbb91d9f352c6ff))
* add support for svgs with fill color in path style attribute ([1aeb079](https://www.github.com/oslllo/svg-fixer/commit/1aeb0794e9693079c79981616ea00e99379c863f))
* support svgs without a set viewBox attribute ([17b876c](https://www.github.com/oslllo/svg-fixer/commit/17b876ce49ed0a047dedb098d47adcccb22ff0cf))

### [1.3.2](https://www.github.com/oslllo/svg-fixer/compare/v1.3.1...v1.3.2) (2021-06-26)


### Bug Fixes

* security vulnerabilities ([372730b](https://www.github.com/oslllo/svg-fixer/commit/372730bef6cf761877961796635fc406a2ecc776))

### [1.3.1](https://www.github.com/oslllo/svg-fixer/compare/v1.3.0...v1.3.1) (2021-05-27)


### Bug Fixes

* output svg being smaller than viewBox ([#48](https://www.github.com/oslllo/svg-fixer/issues/48)) ([f658614](https://www.github.com/oslllo/svg-fixer/commit/f65861448802b9b7c6cd6c889207b5f1a7c66592))

## [1.3.0](https://www.github.com/oslllo/svg-fixer/compare/v1.2.1...v1.3.0) (2021-05-15)


### Features

* add support for svgs with light colored fill ([#45](https://www.github.com/oslllo/svg-fixer/issues/45)) ([47aa95d](https://www.github.com/oslllo/svg-fixer/commit/47aa95da9e7054b84f3b2d36528784c5dbe6663d))


### Bug Fixes

* **eslint:** script error ([d34780e](https://www.github.com/oslllo/svg-fixer/commit/d34780e1db64d350695f5be7c4713136f9c66331))

### [1.2.1](https://www.github.com/oslllo/svg-fixer/compare/v1.2.0...v1.2.1) (2021-05-06)


### Bug Fixes

* drop yargs version to 16 ([7b4d9cc](https://www.github.com/oslllo/svg-fixer/commit/7b4d9ccb563027b24aefe59d394848b8937067b9))
* package breaking when process.env.NODE_ENV env variable is set ([51c6318](https://www.github.com/oslllo/svg-fixer/commit/51c6318340b97d6840ab7d2c499c77aff27b6f10))

## [1.2.0] - 2021/4/1

### Fixed

- Fixed bug in test.

### Updated

- Updated dependencies.

## [1.1.2] - 2020/12/12

### Fixed

- Fixed vulnerability.

### Updated

- Updated dependencies.

## [1.1.1] - 2020/10/22

### Fixed

- Fixed large npm package.

## [1.1.0] - 2020/10/22

### Fixed

- Fixed bug that allowed you to update `options` that do not exist.

### Added

- Added `CLI` functionality.
- Added `callback` functionality to `SVGFixer.fix()`.

### Changed

- Refactored `tests`.
- Refactored `progress bar`.

## [1.0.2] - 2020/10/2

### Fixed

- Fixed not being able to process SVGs with `%` dimensions.

### Added

- SVG attribute tests.

## [1.0.1] - 2020/9/16

### Changed

- Remove tests from npm `package` to help reduce unpacked `package` size.

## [1.0.0] - 2020/9/16

⚠️ Contains breaking changes.

### Breaking Changes

- `svgfixer.fix(source, destination, options)` ***=>*** `SVGFixer(source, destination, options).fix()`.
    - It was changed from a wrapper function to a method function for `SVGFixer`.
    - It still returns a `Promise`.
    - `fix()` no more takes in `parameters`, those should be passed into `SVGFixer()`.
- `svgfixer.SVGFixer()` class ***=>*** `SVGFixer()`.
    - The `.setOptions(options)` method has been removed, `options` should now be passed in class constructor as the 3rd `parameter`.
    - The `.setSourceAndDest()` method has been removed, `source` and `destination` should now be passed in class constructor as the 1st and 2nd `parameters`.
    - The `.process()` method has been removed, use `.fix()` instead.
    - `SVGFixer()` does not require the [`new`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) operator anymore.
- `fixConcurrency` has been removed, might be reimplemented on later versions.

### Changed

- Updated dependencies.
- Refactored codebase.
- Refactored progressbar.

## [0.6.0] - 2020/8/13

### Security

- Updated dependencies. Fixes [Vulnerability](https://npmjs.com/advisories/1548)

### Changed

- Updated image processor.
- Updated `CHANGELOG.md` wording and formatting.

## [0.5.1] - 2020/7/7

### Changed

- Updated `README.md`.

### Added

- Documentation.

## [0.5.0] - 2020/6/13

### Changed

- Changed image processing engine from Sharp to Jimp. Fixes [#7](https://github.com/oslllo/svg-fixer/issues/7)
- Refactored async pools (fixConcurrency).

### Fixed

- Fixed pathing issues on windows. Fixes [#8](https://github.com/oslllo/svg-fixer/issues/8)

## [0.4.4] - 2020/6/8

### Changed

- Updated dependencies. Fixes [#7](https://github.com/oslllo/svg-fixer/issues/7)

## [0.4.3] - 2020/6/2

### Changed

- Updated `package.json` description.

## [0.4.2] - 2020/5/24

### Fixed

- Fixed incorrect svg data when source svg has 'px', 'rem' or 'em' on height and width attributes as a unit of measurement. See ([#5](https://github.com/oslllo/svg-fixer/issues/5))

## [0.4.1] - 2020/5/16

### Security

- Fixed [Vulnerability](https://www.npmjs.com/advisories/1500)

## [0.4.0] - 2020/5/14

### Added

- Added new parameter `fixConcurrency` to control how many svgs to fix at a given time.
- Added new tests
- Added an perfomance increase by ~67%

    |Version|completion (%)|Time (seconds)|Number of SVGs fixed|
    |------|------|-----|-----|
    |v0.4.0|100.00|~ 127|1315|
    |v0.3.3|100.00|~ 190|1315|
    |-|-|-|-|
    |**VPS**|**CPU**|**RAM**|||
    ||Intel(R) Xeon(R) E5-1650 v3 3.50GHz (2x) | 1548MiB|||

### Fixed

- Fixed tests

### Changed

- Reduceed npm package size.
- Updated `README.md`.

## [0.3.3] - 2020/5/12

### Added

- Added badge links to `README.md`.
- Added new tags to `package.json`.

### Changed

- Updated `README.md` content.

## [0.3.2] - 2020/5/10

### Changed

- Updated README.md

## [0.3.1] - 2020/5/9

### Changed

- Updated `README.md`

## [0.3.0] - 2020/5/8

### Changed

- Refactored the whole codebase.
- Updated README.md

### Added

- Added tests
- Added slight performance increase.

## [0.2.0] - 2020/4/18

### Added

- Added progress bar

## [0.1.0] - 2020/4/17

### Added

- Added [CHANGELOG.md](https://github.com/oslllo/svg-fixer/blob/master/CHANGELOG.md)
- Create destination folder if it does not exist.

### Changed

- Switched from `fs` to `fs-extra`
- Changed `SvgFixer()` function name from `SvgFixer` to `svgFixer` because its a function not a class.

### Removed

- Removed debug functions

## [0.0.3] - 2020/4/16

### Added

- Added package.json description

## [0.0.2] - 2020/4/16

### Added

- Added [README.md](https://github.com/oslllo/svg-fixer/blob/master/README.md)

## [0.0.1] - 2020/4/16

### Added

- Added everything, initial release.
