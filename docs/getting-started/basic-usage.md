# Basic Usage

## Require Package

```js
const svgfixer = require('oslllo-svg-fixer');
```

---

## Using the `svgfixer.fix()` wrapper

```js
svgfixer.fix(source, destination, options);
```

### Parameters

- `source`: path to folder containing multiple `SVG` files or a direct path to a single `SVG` file.
- `destination`: path to store fixed svg icons.
- `options`: fixer option parameters, see [HERE](#parameters).

> You can use a path that points to a directory with SVGs.

```js
svgfixer.fix('directory/containing/svgs', 'directory/to-store/fixed-svgs')
.then(() => {
    console.log("Done");
})
.catch((error) => {
    console.log("Error: " + error);
});
```

> Or a path that point directly so a single file.

```js
svgfixer.fix('directory/containing/broken-icon.svg', 'directory/to-store/fixed-svgs')
.then(() => {
    console.log("Done");
})
.catch((error) => {
    console.log("Error: " + error);
});
```

---

## Using the `svgfixer.SVGFixer()` class

### API

- `svgfixer.setOptions(options)`: set options/paramaters.
    - `options`: see [HERE](#parameters)
- `svgfixer.setSourceAndDest(source, destination)`: set source and destination paths.
    - `source`: path to folder containing multiple `SVG` files or a direct path to a single `SVG` file.
    - `destination`: path to store fixed svg icons.
- `svgfixer.process()`: begin processing/fixing the SVG file(s).

```js
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
fixer.process()
.then(() => {
    console.log("Done");
})
.catch((error) => {
    console.log("Error: " + error);
});
```

## Parameters

- `throwIfPathDoesNotExist`: throw error if any path does not exist. **default(true)**
- `showProgressBar`: show progress bar in CLI. **default(false)**
- `fixConcurrency`: how many svgs can be fixed at the same time. **default(50)**