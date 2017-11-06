# SVG Transformer

An utility to move, rotate and resize a group or a single SVG element.

![screenshot](https://user-images.githubusercontent.com/5312427/32453810-92fba0b6-c31d-11e7-952f-efc0d2dc921c.png)

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
