require.config({
    baseUrl: '.',
    paths: {
        ImageEditor: '../dist/ImageEditor'
    }
});

define(['ImageEditor'], function (editor) {
  console.log(editor.ImageEditor);
});
