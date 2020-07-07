# Changelog

## 0.5.1

- Updated `README.md`.
- Updated documentation.

## 0.5.0

- Changeed image processing engine from Sharp to Jimp. Fixes [#7](https://github.com/oslllo/svg-fixer/issues/7)
- Fixed path issues on windows. Fixes [#8](https://github.com/oslllo/svg-fixer/issues/8)
- Reworked async pools (fixConcurrency).

## 0.4.4

- Updated dependencies. Fixes [#7](https://github.com/oslllo/svg-fixer/issues/7)

## 0.4.3

- Update `package.json` description.

## 0.4.2

- Fixed incorrect svg data when source svg has 'px', 'rem' or 'em' on height and width attributes as a unit of measurement. See ([#5](https://github.com/oslllo/svg-fixer/issues/5))

## 0.4.1

- fixed advisory https://www.npmjs.com/advisories/1500.

## 0.4.0

- Increase perfomance by ~67%

    |Version|completion (%)|Time (seconds)|Number of SVGs fixed|
    |------|------|-----|-----|
    |v0.4.0|100.00|~ 127|1315|
    |v0.3.3|100.00|~ 190|1315|
    |-|-|-|-|
    |**VPS**|**CPU**|**RAM**|||
    ||Intel(R) Xeon(R) E5-1650 v3 3.50GHz (2x) | 1548MiB|||

- reduced npm package size.
- added new parameter `fixConcurrency` to control how many svgs to fix at a given time.
- added and fixed tests.
- updated `README.md`.

## 0.3.3

- Added badge links to `README.md`.
- Updated `README.md` content.
- Added new tags to `package.json`.

## 0.3.2

- Updated README.md

## 0.3.1

- Updated README.md

## 0.3.0

- Refactored whole codebase.
- The package should actually work now :P.
- Slight performance increase.
- Added tests.
- Updated README.md

## 0.2.0

- Added progress bar

## 0.1.0

- Added [CHANGELOG.md](https://github.com/oslllo/svg-fixer/blob/master/CHANGELOG.md)
- `SvgFixer()` function name from `SvgFixer` to `svgFixer` because its a function not a class.
- Create destination folder if it does not exist.
- Remove debug functions
- Switch from `fs` to `fs-extra`

## 0.0.3

- Added package.json description

## 0.0.2

- Added [README.md](https://github.com/oslllo/svg-fixer/blob/master/README.md)

## 0.0.1

- Added everything, initial release.
