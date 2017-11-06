require.config({
    baseUrl: '.',
    paths: {
        SvgTransformer: '../dist/SvgTransformer'
    }
});

define(['SvgTransformer'], function (SvgTransformer) {
  var elements = document.querySelectorAll('#my-canvas > #path1, #rect1');
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

  var t1 = new SvgTransformer();
  t1.show(document.querySelector("#rect2"));
});
