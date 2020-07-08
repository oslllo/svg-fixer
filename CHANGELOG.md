# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.1] - 2020/7/7

### Changed

- Update `README.md`.

### Added

- Documentation.

## [0.5.0] - 2020/6/13

### Changed

- Image processing engine from Sharp to Jimp. Fixes [#7](https://github.com/oslllo/svg-fixer/issues/7)
- Refactor async pools (fixConcurrency).

### Fixed

- Pathing issues on windows. Fixes [#8](https://github.com/oslllo/svg-fixer/issues/8)

## [0.4.4] - 2020/6/8

### Changed

- Update dependencies. Fixes [#7](https://github.com/oslllo/svg-fixer/issues/7)

## [0.4.3] - 2020/6/2

### Changed

- Update `package.json` description.

## [0.4.2] - 2020/5/24

### Fixed

- Incorrect svg data when source svg has 'px', 'rem' or 'em' on height and width attributes as a unit of measurement. See ([#5](https://github.com/oslllo/svg-fixer/issues/5))

## [0.4.1] - 2020/5/16

### Security

- Address advisory https://www.npmjs.com/advisories/1500.

## [0.4.0] - 2020/5/14

### Added

- New parameter `fixConcurrency` to control how many svgs to fix at a given time.
- New tests
- Perfomance increase by ~67%

    |Version|completion (%)|Time (seconds)|Number of SVGs fixed|
    |------|------|-----|-----|
    |v0.4.0|100.00|~ 127|1315|
    |v0.3.3|100.00|~ 190|1315|
    |-|-|-|-|
    |**VPS**|**CPU**|**RAM**|||
    ||Intel(R) Xeon(R) E5-1650 v3 3.50GHz (2x) | 1548MiB|||

### Fixed

- Tests

### Changed

- Reduce npm package size.
- Update `README.md`.

## [0.3.3] - 2020/5/12

### Added

- Badge links to `README.md`.
- New tags to `package.json`.

### Changed

- Update `README.md` content.

## [0.3.2] - 2020/5/10

### Changed

- Update README.md

## [0.3.1] - 2020/5/9

### Changed

- Update README.md

## [0.3.0] - 2020/5/8

### Changed

- The whole codebase [Refactored].
- Update README.md

### Added

- Tests
- Slight performance increase.

## [0.2.0] - 2020/4/18

### Added

- Progress bar

## [0.1.0] - 2020/4/17

### Added

- [CHANGELOG.md](https://github.com/oslllo/svg-fixer/blob/master/CHANGELOG.md)
- Create destination folder if it does not exist.

### Changed

- Switch from `fs` to `fs-extra`
- `SvgFixer()` function name from `SvgFixer` to `svgFixer` because its a function not a class.

### Removed

- Debug functions

## [0.0.3] - 2020/4/16

### Added

- Package.json description

## [0.0.2] - 2020/4/16

### Added

- [README.md](https://github.com/oslllo/svg-fixer/blob/master/README.md)

## [0.0.1] - 2020/4/16

### Added

- Everything, initial release.
