define(["jquery", 'index', 'const', 'config.widget', 'external'], function ($, AUI, CONST, WidgetConfig, external) {

    var CODE_FRAME_STATUS = $AW._STATUS.CODE_FRAME,
        NAME_SPACE = '.' + CONST.PAGE.CODE_FRAME.SELF,
        STATUS_STACK = [],
        k, type,
        AuiJSEditor = function ($el, dataModel) {
            this.$el = $el;
            this.dataModel = dataModel;
            this.init();

        };

    AuiJSEditor.prototype = {
        constructor: AuiJSEditor,
        _funStr: WidgetConfig.templateFuncInViewer.toString(),
        _editor: null,
        _JSEditor: null,
        init: function () {
            var $el = this.$el;

            this._editor = AUI.vscode.create(
                $(CONST.PAGE.CODE_FRAME.CODE_EDITOR_SELECTOR, $el), {
                    value: [
                        'function x() {',
                        '\tconsole.log("Hello world!");',
                        '}'
                    ].join('\n'),
                    language: 'javascript'
                });

            this.success();


        },
        setValue: function () {
            var context = this,
                dataModel = context.dataModel,
                href = dataModel.get('href'),
                _editor = context._editor,
                DefaultJSFileContent = context.getDefaultJSFileContent(),
                widgetIns;
            switch (auiApp.mode) {
                case CONST.MODE.VIEWER:
                    widgetIns = dataModel.get("widget")({href: href}).first();
                    _editor.setValue((widgetIns ? widgetIns.jsFileContent : false) || DefaultJSFileContent);
                    break;

                case CONST.MODE.WIDGET_CREATOR:

                    external.getJsCode({
                        href: href
                    }, function (codeString) {
                        if (codeString) {
                            _editor.setValue(codeString);
                            $AW.trigger($AW._STATUS.WIDGET_CODE, codeString);

                        } else {

                            _editor.setValue(DefaultJSFileContent);


                            external.saveJsCode({
                                href: href,
                                code: DefaultJSFileContent
                            }, function () {
                                context.saveTarget(href,DefaultJSFileContent,function () {})

                            }, function () {

                            });

                        }
                    });
                    break;
            }

        },
        saveTarget:function (href,value,callback) {

            var targetPath=auiApp.isNewDir?'/target/webapp/dependence/'+href + '/js/' + href + '.js':'/WebContent/dependence/'+href + '/' + href + '.js';

            if(auiApp.io.projectName){
                external.saveFile({
                    fullPath: auiApp.io.projectName +targetPath,
                    content: value
                }, function () {
                    callback && callback();
                });
            }

        },
        updateJsFileContent: function () {
            var dataModel = this.dataModel,

                value = this._editor.getValue(),
                context=this,
                oWidgetCreator, creatorOption, oWidgetFrame,href;

            switch (auiApp.mode) {

                case CONST.MODE.VIEWER:

                    oWidgetCreator = $AW(CONST.CREATOR.ID);
                    creatorOption = oWidgetCreator.option();
                    oWidgetFrame = $AW(dataModel.get('structure')({
                        'type': dataModel.get('type')
                    }).first().widgetID);

                    creatorOption.jsFileContent = value;

                    oWidgetCreator.update({
                        option: creatorOption
                    });
                    oWidgetFrame.updateWidget(creatorOption);

                    $AW.trigger($AW.STATUS.PREVIEW_FRESH);


                    break;

                case CONST.MODE.WIDGET_CREATOR:
                    href=dataModel.get('href');
                    external.saveJsCode({
                        href: href,
                        code: value
                    }, function () {

                        $AW.trigger($AW._STATUS.WIDGET_CODE, value);

                        context.saveTarget(href,value,function () {
                            app.alert('JS代码已同步到 WebContent ,\n到浏览器刷新页面即可看到效果！', app.alert.SUCCESS);
                            if (app.router.page.auiPreviewFrame) {
                                require(['preview'], function (Preview) {
                                    var previewIns = new Preview($(CONST.PAGE.PREVIEW_FRAME.CTN), dataModel);
                                    previewIns.init();
                                })
                            }
                        })


                    }, function () {
                        $AW.trigger($AW._STATUS.WIDGET_CODE, value);
                    });


                    break;
            }


        },
        getDefaultJSFileContent: function (href) {

            var href = this.dataModel.get('href');

            return '(' + this._funStr.replace(/_href_/, href) + '());'
        },

        success: function () {
            var context = this;

            this._editor.done(function (JSEditor) {

                if (JSEditor) {

                    JSEditor.layout();
                    context.setValue();

                    if (!context._JSEditor) {
                        JSEditor.onDidBlurEditorText(function () {
                            context.updateJsFileContent();
                        });

                        JSEditor.onKeyDown(function (e) {
                            if (e.ctrlKey && e.keyCode === 49) {
                                context.updateJsFileContent();

                            }
                        });

                        context._JSEditor = JSEditor;
                    }

                }
            })

        }
    };

    for (k in CODE_FRAME_STATUS) {
        STATUS_STACK.push(CODE_FRAME_STATUS[k] + NAME_SPACE);
    }

    type = STATUS_STACK.join(',');

    return {
        load: function ($el, handler) {

            var dataModel = handler.dataModel,
                auiJSEditor = new AuiJSEditor($el, dataModel);


            $AW.off(type)
                .on(type, function (type) {
                    switch (type) {
                        case CODE_FRAME_STATUS.LOAD:
                            auiJSEditor.success();
                            break;
                        default:
                            break;

                    }
                });


        },
        unload: function ($el, handler) {
            $el.off();
            $AW.off(type);

        },
        pause: function ($el, scope, handler) {

        },
        resume: function ($el, scope, handler) {

        }
    };
});