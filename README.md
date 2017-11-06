# SVG Transformer

An tool to move, rotate and resize a group or a single SVG element.

![screenshot](https://user-images.githubusercontent.com/5312427/32453810-92fba0b6-c31d-11e7-952f-efc0d2dc921c.png)

## Requirements

This utility requires [RequireJS](https://github.com/requirejs/requirejs) or any other compatible JavaScript loader.

## Installation

Place `dist/SvgTransformer.js` into your project and load it. For example:

```ts
// Load SvgTransfomer
require.config({
    baseUrl: '.',
    paths: {
        SvgTransformer: 'path/to/SvgTransformer'
    }
});

// and use it
define(['SvgTransformer'], function (SvgTransformer) {
  var elements = document.querySelectorAll('#my-canvas > *');
  var items = [];
  for (var element of elements) {
    items.push(element);
  }

  var t = new SvgTransformer();
  t.neckLength = 50;
  t.stroke = "red";
  t.strokeWidth = 3;
  t.handleRadius = 15;
  t.isDraggable = true;
  t.isResizable = true;
  t.isAspectRatioPreserved = false;
  t.isRotable = true;
  t.show(items);
});
```

## Example of use

```ts
// shows the "transformation tool" over the selected "elements"
var t = new SvgTransformer();
t.neckLength = 50;
t.stroke = "red";
t.strokeWidth = 3;
t.handleRadius = 15;
t.isDraggable = true;
t.isResizable = true;
t.isAspectRatioPreserved = false;
t.isRotable = true;
t.show(elements);
```

See the `demo` folder for a complete example.
