# SVG Transformer

An utility to move, rotate and resize SVG elements.

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
