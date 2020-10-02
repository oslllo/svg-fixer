# Basic Usage

- [`constructor`](#svgfixer-constructor)
- [`fix()`](#svgfixer-fix)

## Require Package

```js
const SVGFixer = require('oslllo-svg-fixer');
```

---

<a id="svgfixer-constructor"></a>

## Using the SVGFixer `constructor`

Constructor factory to create an instance of `SVGFixer`, to which further methods are chained.

### Usage

```js
SVGFixer(source, destination, options);
```

### Parameters

- `source` ([**String**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)): path to folder containing multiple `SVG` files or a direct path to a single `SVG` file.
- `destination`  ([**String**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)): path to store fixed svg icons.
- `options` ([**Object**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)): fixer option parameters.
    - `throwIfDestinationDoesNotExist` ([**Boolean**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)): throw `TypeError` if destination path does not exist. **default(true)**
    - `showProgressBar` ([**Boolean**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)) : show progress bar in CLI. **default(false)**

### Throws

- [**TypeError**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError): if a `parameter` is invalid.

### Returns

- [**SVGFixer**](#svgfixer-constructor) `this`

### Examples

```js

var options = {
    showProgressBar: true,
    throwIfDestinationDoesNotExist: false,
};

SVGFixer('directory/containing/svgs', 'directory/to-store/fixed-svgs', options); // Returns instance

// Or with a path that points directly so a single file.

SVGFixer('directory/containing/broken-icon.svg', 'directory/to-store/fixed-svgs', options); // Returns instance
```

---

<a id="svgfixer-fix"></a>

## Using the `.fix()` method

Used to begin processing/fixing the SVG file(s).

### Usage

```js
SVGFixer(source, destination, options).fix()
.then(() => {
    console.log("done");
})
.catch((err) => {
    throw err;
});
```

### Parameters

- `none`

### Returns

- [**Promise**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

### Examples

```js
SVGFixer('directory/containing/svgs', 'directory/to-store/fixed-svgs').fix()
.then(() => {
    console.log("done");
})
.catch((err) => {
    throw err;
});
```
