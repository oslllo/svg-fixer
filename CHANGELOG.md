# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
