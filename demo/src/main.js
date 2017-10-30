require.config({
    baseUrl: '.',
    paths: {
        ImageEditor: '../dist/SvgTransformer'
    }
});

define(['ImageEditor'], function (ImageEditor) {
  var editor = new ImageEditor('my-canvas');
});
