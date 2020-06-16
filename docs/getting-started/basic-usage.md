# Basic Usage

```js
const svgfixer = require('oslllo-svg-fixer');
```

#### Using `svgfixer.fix()` wrapper

```js
async function svgfixerFixExample() {
    // You can use a path that points to a directory with SVGs.
    await svgfixer.fix('directory/containing/svgs', 'directory/to-store/fixed-svgs');
    // Or a path that point directly so a single file.
    await svgfixer.fix('directory/containing/broken-icon.svg', 'directory/to-store/fixed-svgs');
}
```

#### Using `svgfixer.SVGFixer()` class

```js
async function svgfixerSVGFixerExample() {
    // Create a new fixer instance.
    var fixer = new svgfixer.SVGFixer();
    // Set fixer options/parameters
    fixer.setOptions({
        throwIfPathDoesNotExist: true,
        showProgressBar: false,
    });
    // Set source and destination paths
    fixer.setSourceAndDest('directory/containing/svgs', 'directory/to-store/fixed-svgs');
    // Begin processing the SVGs.
    await fixer.process();
}
```

#### Wrapper API `(svgfixer = require("oslllo-svg-fixer"))`

- `svgfixer.fix(source, destination, options)`: Wrapper for `SVGFixer` that simplifies use down to one function call. `source` path, `destination` path and parameter `options`.

#### SVGFixer Class API `(svgfixer = new svgfixer.SVGFixer())`

- `svgfixer.setOptions(options)`: set options/paramaters.
- `svgfixer.setSourceAndDest(source, destination)`: set source and destination paths.
- `svgfixer.process()`: begin processing/fixing the SVG files.

## Parameters

- `throwIfPathDoesNotExist`: throw error if any path does not exist. **default(true)**
- `showProgressBar`: show progress bar in CLI. **default(false)**
- `fixConcurrency`: how many svgs can be fixed at the same time. **default(50)**