require.config({
    baseUrl: '.',
    paths: {
        ImageEditor: '../dist/ImageEditor'
    }
});

define(['ImageEditor'], function (ImageEditor) {
  var editor = new ImageEditor();
  editor.test();
});
