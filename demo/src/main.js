require.config({
    baseUrl: '.',
    paths: {
        SvgTransformer: '../dist/SvgTransformer'
    }
});

define(['SvgTransformer'], function (SvgTransformer) {
  var elements = document.querySelectorAll('#my-canvas > *');
  var t = new SvgTransformer();

  t.show(elements);
});
