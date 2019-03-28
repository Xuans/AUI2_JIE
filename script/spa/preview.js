(function (undefined) {
    (function (factory) {
        'use strict';

        // amd module
        if (typeof define === 'function' && define.amd) {
            define(['jquery', 'index', 'const'], factory);
        }
        // global
        else {
            factory();
        }

    })(function ($, AUI, CONST) {
        "use strict";

        var PREVIEW_CONST = CONST.PAGE.PREVIEW_FRAME,
            Preview = function ($el, dataModel) {
                this.dataModel = dataModel;
                this.$el = $el || $(PREVIEW_CONST.CTN, 'body');
                this.listener();
            };

        Preview.prototype = {
            constructor: Preview,
            jsContent: '',
            init: function () {
                var context = this,
                    dataModel = context.dataModel,
                    frames = window.frames,
                    STATUS = $AW.STATUS,
                    frame, i,
                    frameWindow,
                    status,
                    stack = [],
                    framAuiApp = null,
                    compileIns = null,
                    ready = false,
                    load = function () {
                        var
                            dataModel = context.dataModel,
                            data = dataModel.preSave(),
                            result, jsContent, htmlContent, viewerConfig, depsContent,
                            mode = auiApp.mode,
                             viewerHref, newViewerHref;

                        try {
                            data.pType = mode;

                            if (mode === CONST.MODE.VIEWER) {
                                viewerConfig = JSON.parse(JSON.stringify(dataModel.get('widget')({pType: 'viewer'}).first()));

                                viewerHref = viewerConfig.href; //



                                viewerConfig.frame = data;

                            }

                            result = compileIns.compile(mode === CONST.MODE.VIEWER ? viewerConfig : data);


                            if (result && !result.errorMsg && (result = JSON.parse(result))) {
                                context.jsContent = jsContent = result.js;
                                htmlContent = result.html;
                                depsContent = result.deps;
                                if (viewerHref) {
                                    newViewerHref = '"viewer_' + app.getUID() + '"';
                                    jsContent = jsContent.replace(new RegExp('"' + viewerHref + '"', 'g'), newViewerHref);

                                }

                                framAuiApp.load(
                                    htmlContent,
                                    jsContent,
                                    depsContent
                                );
                            }else{
                                app.alert(result.errorMsg,app.alert.ERROR);
                            }

                            // switchHandler();

                            ready = true;


                            $AW.trigger($AW._STATUS.PREVIEW_FRAME.PREVIEW_CODE, {
                                html: htmlContent,
                                deps: depsContent,
                                js: jsContent
                            });


                        } catch (e) {
                            // if (!context.ready) {
                            //     app.performance.timeout += 200;
                            // }
                            console.error(e);

                        }
                    },
                    refresh = function () {

                        if (framAuiApp) {
                            while (stack.length && ready) {
                                framAuiApp.dispatcher.apply(framAuiApp, stack.shift());
                            }
                            app.performance.longDelay(load);
                        }
                    };


                require(['compile'], function (Compile) {

                    compileIns = new Compile(dataModel);
                    window.onIframeJsLoad = function () {
                        for (i = -1; frame = frames[++i];) {
                            if (frame && ~frame.location.href.indexOf(CONST.MODE.VIRTUALIZER)) {
                                frameWindow = frame.window;

                                ready = false;
                                // frameWindow.postMessage(window,"*");
                                framAuiApp = frameWindow.auiApp;
                                framAuiApp.init(window, AUI, $AW);
                                app.performance.longDelay(load);



                            }
                        }
                    };
                    context.$el.empty().append(PREVIEW_CONST.IFRAME_TEMP);
                });


                status = [];

                for (i in STATUS) {
                    if (STATUS.hasOwnProperty(i)) {
                        status.push(STATUS[i]);
                    }
                }

                $AW.off(status.join('.preview,') + '.preview')
                    .on(status.join('.preview,') + '.preview', function (type, oWidget) {
                       // stack = [];
                        stack.push(arguments);


                        if (oWidget && type === $AW.STATUS.WIDGET_UPDATE) { //
                            oWidget.inDom() && app.performance.longDelay(refresh);
                        } else {
                            app.performance.longDelay(refresh);
                        }

                        if (type === $AW.STATUS.CSS_CODE_UPDATE) {
                            framAuiApp && framAuiApp.loadCss();
                        }


                    });


            },


            listener: function () {
                var context = this;

                $(CONST.PAGE.CTN).off('.preview')
                    .on({
                        "click.preview": function (e) {
                            var $target = $(e.target || event.srcElement).closest('[data-role]');
                            if ($target.attr('data-role') === CONST.PAGE.PREVIEW_FRAME.CODE_BTN) {
                                app.popover({
                                    $elem: $target,
                                    width: '70%',
                                    height: '90%',
                                    content: "",
                                    placement: 'auto bottom',
                                    title: '编译结果',
                                    fixClick: true,
                                    init: function () {
                                        var $popoverBody = $(this).find('.aweb-popover-body').empty(),
                                            codeEditor = AUI.vscode.create($popoverBody, {
                                                value: '',
                                                fixedOverflowWidgets: true,
                                                folding: true,
                                                readOnly: true,
                                                language: 'javascript',
                                                formatOnPaste: true,
                                                mouseWheelZoom: true,
                                                parameterHints: true,
                                                renderIndentGuides: true,
                                                tabCompletion: true
                                            });

                                        if (codeEditor && context.jsContent) {
                                            codeEditor.setValue(context.jsContent);
                                        }

                                        $(this).on('screenChange', function () {
                                            codeEditor.layout();
                                        })
                                    }
                                })

                            }

                        }
                    });


            }
        };


        return Preview;

    })
})();
