/*!
 * Javascript library v3.0
 *
 * Date: 2016.01.18
 */

/**
 * [引导模块]
 *
 * 定初始化js路径，并定义模块间依赖关系
 * 初始化app基础功能，如路由、日志等
 * 初始化首页
 *
 * @param  [scope] 执行上下文
 * @author lihao01@cfischina.com
 */
(function (scope) {
    "use strict";

    var HTTP = 'http:',
        FILE = 'file:',
        app = scope.app = {},
        cssRequireList = ['css/aui-iconfont.css', 'css/bundle.css'],
        appCss = scope.auiApp.css,
        _i, _item,
        queue = [],
        next = function () {
            var next = queue.shift();
            if (next) {
                next();
            }
        },
        iconArr = [{
            namespace: 'iconfont',
            file: 'AWEB/css/icon-font.css'
        },
            {
                namespace: 'fa',
                file: 'AWEB/css/font-awesome.min.css'
            }],
        webrootSourceResult, toolset, config, awebApi,dataModel,
        protocol = document.location.protocol;
    scope.auiApp.io={};
    scope.auiApp.RROTOCOL = protocol || HTTP;


    scope.auiApp.isNewDir = (protocol === HTTP);

    scope.auiApp.isHttp = (protocol === HTTP);

    scope.aweb = {
        debug: true,//调试模式
        log: true,//显示日志
        error: true,//显示报错
        //   exception: true,//异常捕获
        translate: false,//禁用国际化
        fresher: true,//启用主题
        preloading: false,
        singleStyleFile:false,
        requireConfig: {
            waitSeconds: 30,
            urlArgs: true
        },
        deps: {
            css: [
                "AWEB/css/aweb.css",
                "AWEB/css/font-awesome.min.css",
                "AWEB/css/icon-font.css",
                "AWEB/css/aweb.page.css",
                "Shim/css/ie8.css",
                "AWEB/css/aweb.popover.css"
            ],
            js: ['es5']
        },
        iconArr: iconArr,
        globalVariables: {},
        transformJsConfig: function (jsLoadList) {
            return jsLoadList;
        },
        transformCssConfig: function (cssLoadList) {
            var _i, _item;
            //css config
            for (_i = cssLoadList.length; _item = cssLoadList[--_i];) {

                if (!/^(?:\.)?dependence/.test(_item)) {
                    _item = 'dependence/' + _item;
                }

                cssLoadList[_i] = 'requireCss!' + _item;
            }

            return cssLoadList;
        }
    };
    config = {
        //依赖定义
        waitSeconds: 0,
        shim: {
            jquery: {
                exports: "$"
            },
            external: {
                deps: ['config.widget']
            },
            'config.widget': {
                deps: ['jquery']
            },
            jqueryUI: {
                deps: ["jquery"]
            },
            zTree: {
                deps: ["jquery"]
            },
            colorPicker: {
                deps: ['jquery']
            },
            requireCss: {},
            taffy: {
                deps: []
            },
            wangEditor: {
                deps: ['jquery']
            },
            easyui: {
                deps: ['jquery']
            },

            ui: {
                desp: ["jquery", "index"]
            },
            index: {
                deps: ["jquery", "taffy", 'bridge']
            },
            event: {
                deps: ['index', 'template', 'edm']
            },
            css: {
                deps: ['index']
            },
            base: {
                deps: ['index', 'template', 'edm', 'uglifyjs']
            },
            edm: {
                deps: ['jquery', 'external', 'easyui']
            },


            //编译
            htmlclean: {
                deps: ['jquery']
            },
            uglifyjs: {},
            compileHTML: {
                deps: ['jquery', 'taffy', 'htmlclean']
            },
            compileJS: {},
            //配置
            icon: {
                exports: ['Icon']
            }
        },

        //文件路径定义
        //script/lib文件夹中部分库包含注释版本及压缩版，此处为提高加载速度统一使用压缩版
        //如特殊情况需断点调试，请暂时指向注释版本并在完成调试后更改回压缩版
        paths: {
            //此处为开发外部库文件
            text: 'script/lib/text',
            uglifyjs: 'script/lib/uglifyjs',
            jquery: "script/lib/jquery-1.9.1",
            zTree: "script/lib/jQuery.zTree/js/jquery.ztree.all-3.5.min",
            jqueryUI: "script/lib//jQuery.ui/js/jquery-ui.min",
            colorPicker: "script/lib/bootstrap-colorpicker",
            wangEditor: "script/lib/wangEditor/js/wangEditor.min",
            template: "script/lib/template/template",
            go: "script/lib/go-debug",
            g6: "script/lib/g6.min",
            tagsInput: './script/lib/bootstrap-tagsinput',
            select: './script/lib/bootstrap-select.min',
            taffy: "script/lib/taffy",
            highlight: 'script/lib/highlight.pack',
            easyui: 'script/lib/easyui-combotree/jquery.easyui.min',
            vs: './vs',
            vue: "script/lib/Vue/js/vue",
            'socket.io': "script/lib/socket.io",


            //AUI
            external: "script/spa/external",
            toolset: 'script/spa/toolset',
            apiApp: "script/spa/api.app",
            ui: "script/spa/ui",
            bridge: "script/spa/bridge",
            index: "script/spa/index",
            widget: "script/spa/widget",
            edm: "script/spa/edm",
            base: "script/spa/base",
            css: "script/spa/css",
            nsl: "script/spa/nsl",
            translator: 'script/spa/translator',
            event: "script/spa/event",
            lifecycle: "script/spa/lifecycle",
            overview: "script/spa/overview",
            bundle: "script/spa/bundle",
            dispatchEvent: "script/spa/dispatchEvent",
            codeCompile: "script/spa/codeCompile",
            chain: "script/spa/chain",
            layout: "script/spa/layout",
            report: "script/spa/report",
            controllerLayout: 'script/spa/controllerLayout',
            componentTree: "script/spa/componentTree",
            docs: "script/spa/docs",
            preview: 'script/spa/preview',
            api: 'script/spa/api',
            'Model.Data': 'script/spa/Model.Data',
            'Model.Io': 'script/spa/Model.Io',
            'const': 'script/spa/const',
            'Module.CodeCheck': 'script/spa/Module.CodeCheck',


            //编译
            // uglifyjs: 'script/lib/uglifyjs',
            htmlclean: 'script/lib/jquery.htmlClean',
            compileHTML: 'script/compile/html',
            compileJS: 'script/compile/js',
            compileDeps: 'script/compile/deps',
            compile: 'script/compile/compile',


            //配置
            'config.css': './config/config.css',
            'config.language': './config/config.language',
            'config.widget': './config/config.widget',
            'config.event': './config/config.event',


            'aweb.api': 'dependence/AWEB/js/aweb.api.config.raw'
        }
    };


    queue.push(function () {
        require.config({
            paths: {
                requireCss: "script/lib/require-css.min",
            }
        });
        //css部分
        cssRequireList = appCss ? appCss.concat(cssRequireList) : [];
        //css config
        for (_i = cssRequireList.length; _item = cssRequireList[--_i];) {
            if (_item.indexOf('./')) {
                cssRequireList[_i] = 'requireCss!./' + _item;
            } else {
                cssRequireList[_i] = 'requireCss!' + _item;
            }
        }
        require(cssRequireList, function () {

            try {
                window.localStorage.clear();
            } catch (err) {

            }
            require.config(config);
            next()
        })
    });

    queue.push(function () {


        require(['external'], function (external) {
            scope.external = external;
            next();
        });

    });
    queue.push(function () {
        external.getProjectName(function (projectName) {
            scope.auiApp.io.projectName=projectName;
            next();
        },function () {
            next();
        })
    });



    //如果是http协议，判断是新目录还是旧目录
    queue.push(function () {
        if (protocol === HTTP) {
            var projectName=scope.auiApp.io.projectName;
            external.getProjectType(function (res) {
                scope.auiApp.isNewDir = true;
                external.staticSrcPath=external.staticPath+'/src/main/webapp';
                external.staticTargetPath=external.staticPath+'/target/webapp';
                next();
            }, function () {
                external.staticSrcPath=external.staticPath+'/'+projectName+'/WebRoot';
                external.staticTargetPath=external.staticPath+'/'+projectName+'/WebContent';
                scope.auiApp.isNewDir = false;
                next();
            });
        } else {
            next();
        }
    });


    //判断项目类型 是新目录还是旧目录；
    queue.push(function () {
        var isNew=scope.auiApp.isNewDir;
        scope.auiApp.FILE_TYPE =isNew ?  'newDir' : 'oldDir';
        next();
    });




    queue.push((function () {

        require(['toolset', 'jquery'], function (_toolset, $) {
            toolset = _toolset;
            next()
        })
    }));

    queue.push(function () {
        if (!scope.auiApp.isNewDir) {
            require(['aweb.api'], function (_awebApi) {
                awebApi = _awebApi;
                next()
            })
        }else{
            next()
        }

    });


    queue.push(function () {
        if (scope.auiApp.mode !== 'docs') {


            var external = scope.external,
                dtd = $.Deferred(),
                ENVIRONMENT = ['debug', 'log', 'error', 'translate', 'fresher', 'preloading', 'requireConfig', 'waitSeconds'],
                enviromentMap = {},
                i, item,
                save;

            for (i = -1; item = ENVIRONMENT[++i];) {
                if (scope.aweb.hasOwnProperty(item)) {
                    enviromentMap[item] = scope.aweb[item];
                }
            }
            save = {
                dependence: {
                    deps: scope.aweb.deps,
                    iconArr: scope.aweb.iconArr
                },
                environment: enviromentMap,
                fresher: "{}"
            };

            if (!scope.auiApp.isNewDir) {
                save.api = {
                    appInterfaces: awebApi.appInterfaces,
                    appInterfacesConst: awebApi.appInterfacesConst
                };
            }
            toolset.saveApiJs({

                load: {
                    environment: true,
                    fresher: true,
                    apiConfig: true,
                    dependence: true,
                    api: false
                },
                save: save
            }, false, undefined, dtd, external, function (response) {
                // var iconArr;

                webrootSourceResult = response;


                next();
            });


        } else {
            next();
        }


    });

    queue.push(function () {
        external.getFileContent('/config/template.html', function (data) {
            $('body').append(data);
            //  $("#auiOverviewFrame").append($("#auiOverviewPage").removeClass('hide').detach());

            require(["taffy", "jqueryUI", "apiApp"], function (taffy) {
                scope.app.taffy = taffy.taffy;
                require(['Model.Data'], function (_dataModel) {
                    dataModel=_dataModel;
                    dataModel.set('cssMap', {});
                    if (scope.auiApp.isNewDir){
                        next();
                    }else{
                        external.getFileContent('/config/bootloader.json', function (bootloaderData) {
                            var dataJson = JSON.parse(bootloaderData),
                                cssMap = dataJson.cssMap||{};
                            dataModel.set('cssMap', cssMap);
                            next();
                        },function () {
                           // next();
                        })
                    }

                })

            })

        })

    });
    queue.push(function () {
        require(['index', 'widget'], function (AUI, WIDGET) {

            scope.$AW = WIDGET;

            AUI.mode = scope.auiApp.mode;
            AUI.init = scope.auiApp.init;

            if (scope.auiApp.debug) {
                // scope.C = global.CONST;
                scope.A = AUI;
                scope.M = dataModel;
            }

            if (scope.auiApp.mode !== 'docs') {
                if (webrootSourceResult) {


                    if (!webrootSourceResult.fresher) {
                        webrootSourceResult.fresher = {};
                    }

                    $AW.fresher = webrootSourceResult.fresher;
                    $AW.fresher.variablesCopy = AUI.transformThemeVariables(webrootSourceResult.fresher.variables);
                    dataModel.set('fresher', webrootSourceResult.fresher);

                    dataModel.set('awebApi', {
                        appInterfaces: webrootSourceResult.appInterfaces || [],
                        appInterfacesConst: webrootSourceResult.appInterfacesConst || []
                    })

                }

                AUI.getDependenceConfig(function (config) {
                    var dependenceList = dataModel.get('dependence');

                    if (!dependenceList || $.isEmptyObject(dependenceList)) {
                        dataModel.set('dependence', config);
                    }

                    require(['ui', 'report', 'Module.CodeCheck'], function (_, __, CodeCheck) {

                        AUI.Module = AUI.Module || {};
                        AUI.Module.CodeCheck = CodeCheck;

                        if (!aweb.iconArr || (aweb.iconArr && !aweb.iconArr.length)) {
                            aweb.iconArr = iconArr;
                        }
                        if (aweb.iconArr) {
                            $.when(toolset.waitLoadIcon(aweb.iconArr)).done(function () {
                                AUI.init();
                            })
                        } else {
                            AUI.init();
                        }


                    });


                });
            } else {
                require(['ui'], function () {
                    AUI.init();
                });
            }

        });
    });
    next();


    require.onError = function (err) {
        if (app && app.shelter) {
            app.shelter.hideAll();
        }
        throw  err;
    };
    /*version*/
scope.version = 'AWOS_5.2.2_2019032516'
/*version*/

})(this);