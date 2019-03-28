define(["jquery", "const", 'config.widget', 'index'], function ($, CONST, widgetConfig, AUI) {
    var CODE_CONST = CONST.PAGE.CUSTOM_CODE_FRAME,
        NAME_SPACE = '.' + CONST.PAGE.CUSTOM_CODE_FRAME.NAME_SPACE,
        CODE_FRAME_STATUS=$AW._STATUS.CUSTOM_CODE_FRAME;


    return {
        load: function ($el, handler) {
            var dataModel = handler.dataModel,
                _editor, code, _JSEditor;

            if (!(code = dataModel.get('customCode'))) {
                code = widgetConfig.templateCustom;
                dataModel.set('customCode', code);
            }

            code = AUI.getParsedString(UglifyJS.parse(code));


            _editor = AUI.vscode.create(
                $(CODE_CONST.CTT, $el), {
                    value: code,
                    language: 'javascript'
                });



            $AW.off(CODE_FRAME_STATUS.LOAD+NAME_SPACE).on(CODE_FRAME_STATUS.LOAD+NAME_SPACE,function (type) {
                _editor.done(function (JSEditor) {


                      var  code = AUI.getParsedString(UglifyJS.parse(dataModel.get('customCode')));
                    if (JSEditor) {

                        JSEditor.layout();
                        JSEditor.setValue( code);

                        if (!_JSEditor) {
                            JSEditor.onDidBlurEditorText(function () {
                                dataModel.set('customCode', JSEditor.getValue());
                            });

                            JSEditor.onKeyDown(function (e) {
                                if (e.ctrlKey && e.keyCode === 49) {
                                    dataModel.set('customCode', JSEditor.getValue());

                                }
                            });

                            _JSEditor = JSEditor;
                        }

                    }
                });
            });
            $AW.trigger(CODE_FRAME_STATUS.LOAD);


        },
        unload: function ($el, handler) {
            //   $AW.off(type);


        },
        pause: function ($el, handler) {

        },
        resume: function ($el, handler) {


        }
    };
});