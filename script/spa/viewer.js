/**
 *
 * @param {[undefined]}
 *            undefined [确保undefined未被重定义]
 * @author quanyongxu@cfischina.com
 */
( /* <global> */ function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", 'template', 'index', 'const', 'config.widget','toolset', 'Model.Data', 'base', 'vue',], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, artTemplate, AUI, CONST, WidgetConfig, toolset, dataModel, base, Vue) {
        "use strict";

        var

            WB_CONST = {
                DEFAULT_NSL: '(项目国际化配置)',
                DEFAULT_THEME: '(项目主题配置)',
                DEFAULT: 'default',
            },
            globalApiConfig,
            globalResetSource,
            viewerAccept,oWidgetFrame,
            callbackLock = false,
            frameInstanceId,
            themeDefaultValue = 'theme.agreeV5',
            nslDefaultValue = 'nsl.translator',
            nslDefaultValue = 'nsl.translator',
            //选择器

            funStr = WidgetConfig.templateFuncInViewer.toString(),


            saveThemeWidget = function (themeWidget) {
                if (themeWidget) {
                    external.getWidget(themeWidget, function (response) {
                        if (response) {
                            external.saveFile({
                                fullPath: CONST.CONFIG_PATH[window.auiApp.FILE_TYPE].theme.replace('@projectName',auiApp.io.projectName),
                                content: response
                            }, function () {
                                var themeData = response;
                                $AW.fresher.theme = themeData.theme;
                                $AW.fresher.variables = themeData.variables;
                                $AW.fresher.variablesCopy = AUI.transformThemeVariables(themeData.variables);
                                AUI.saveFresherFile();
                            })
                        }
                    });
                }

            },
            saveNslWidget = function (nslWidget) {
                if (nslWidget) {
                    external.getWidget(nslWidget, function (response) {
                        if (response) {
                            external.saveFile({
                                fullPath: CONST.CONFIG_PATH[window.auiApp.FILE_TYPE].nsl.replace('@projectName',auiApp.io.projectName),
                                content: response
                            }, function () {

                            })
                        }
                    });
                }

            },

            getDefaultJsContent = function (href) {
                return '(' + funStr.replace(/_href_/, href) + '());'
            },


            //遍历所有配置的接口，将widgetConfig中所有的接口抽成一个map，将map中所有配置中没有的接口重新放入一一到配置中，重点在于放入哪个分类下


            getAcceptTagsItems = function (db) {
                var valueArray = [],
                    despArray = [];
                db([{
                    pType: 'ctn'
                }, {
                    pType: 'layout'
                }, {
                    type: 'mainPanel'
                }, {
                    base: {
                        isString: true
                    }
                }]).each(function (record) {
                    valueArray.push(record.type);
                    despArray.push(record.name + '(' + record.type + ')');
                });
                return {
                    valueArray: valueArray,
                    despArray: despArray
                };
            },

            wait = function (widgetData, forceSave) {
                var dtd = $.Deferred(),
                    iconArr=widgetData.iconArr;

                if( !iconArr ||(iconArr && !iconArr.length)){
                    widgetData.iconArr=aweb.iconArr;
                }

                toolset.saveApiJs({
                    save: {
                        dependence: {
                            deps: widgetData.deps,
                            iconArr: widgetData.iconArr
                        },
                        environment: widgetData.environment
                    },
                    load: CONST.AWEB_JS_LOAD
                }, forceSave, dataModel, dtd, undefined, function (apiConfig) {
                    globalApiConfig = apiConfig;
                }, true);
                return dtd.promise();
            },
            waitThemeAndNsl = function () {
                var dtd = $.Deferred(),

                    getTheme = function (nsl) {



                        external.getFile(CONST.CONFIG_PATH[window.auiApp.FILE_TYPE].theme.replace('@projectName',auiApp.io.projectName), function (response) {

                            dtd.resolve(nsl, response);

                        }, function () {

                            dtd.resolve(nsl, false);
                        })

                    };

                external.getFile(CONST.CONFIG_PATH[window.auiApp.FILE_TYPE].nsl.replace('@projectName',auiApp.io.projectName), function (response) {

                    getTheme(response);

                }, function () {

                    getTheme(false);

                });

                return dtd.promise();

            },

            widgetCreatorConfigCallbackHandler = function (oWidgetCreator, event) {
                var
                    newWidgetData = oWidgetCreator.option(),
                    temp,
                    newCss = newWidgetData.deps.css,
                    cssDeps,
                    modelSelector = event && event.modelSelector,
                    apiIndex, apiObj, namespace,
                    i, iconArr, iconIndex, filePath, index, platfromIndex;

                if (callbackLock) {
                    var frameInstanceId = dataModel.get('structure')({
                            'type': dataModel.get('type')
                        }).first().widgetID,
                        frameInstance = $AW(frameInstanceId);

                    if (modelSelector === "widgetInstance['optionCopy']['external']['widget']") {
                        $AW.loadChildrenWidget(frameInstance[0].href);
                    }

                    if (modelSelector in {
                            "widgetInstance['info']['accept']": true,
                            "widgetInstance['info']['base']": true,
                            "widgetInstance['info']['author']": true
                        }) {
                        newWidgetData.accept = newWidgetData.info.accept;
                        newWidgetData.base = newWidgetData.info.base;
                        newWidgetData.author = newWidgetData.info.author;

                        oWidgetCreator.option(newWidgetData, true);
                    }

                    if (modelSelector === "widgetInstance['deps']['css']") {
                        temp = vueManage.auiConfigureDefFrameOption.array[0].tabPanes[4].attrInEachElement[1];

                        temp.valueArray = [''].concat(newCss);
                        temp.despArray = ['无'].concat(newCss);


                        newWidgetData.deps && newWidgetData.deps.css && (cssDeps = newWidgetData.deps.css) && $AW.trigger($AW._STATUS.CSS_FRAME.LOAD);
                        /*codeCompile.compileCss(cssDeps)*/

                    }

                    if (modelSelector === "widgetInstance['info']['sources']") {
                        globalResetSource =event.newVal ;// getResetSources();
                    }

                    if (modelSelector === "widgetInstance['environment']['translate']") {
                        aweb.tanslate =event.newVal ;// getResetSources();
                        AUI[event.newVal?'addLanguageSelect':'removeLanguageSelect']();
                    }




                    if (modelSelector.indexOf("widgetInstance['iconArr']") !== -1) {
                       window.aweb.iconArr = iconArr = oWidgetCreator[0].data.optionCopy.iconArr;

                        toolset.loadIcon(iconArr, dataModel.get('dependence'));

                        if (modelSelector.indexOf('file') !== -1 || modelSelector.indexOf('namespace') !== -1) {
                            iconIndex = modelSelector.match(/(\d+)/)[0];
                            i = iconIndex;

                            if (iconArr[i] && iconArr[i].file && (namespace = iconArr[i].namespace)) {
                                temp = vueManage.auiConfigureDefFrameOption.obj.iconArr[iconIndex];

                             //   filePath = dataModel.get('dependence')[iconArr[i].file];

                                toolset.getIconCode(iconArr[i].file, function (code) {
                                    temp.code = code;
                                });
                            } else {
                                temp && (temp.code = '');
                            }
                        }
                    }

                    if (modelSelector.match(/^widgetInstance\['api'\]\['[0-9]+'\]\['type'\]$/)) {
                        apiIndex = modelSelector.match(/(\d+)/)[0];
                        apiObj = WidgetConfig.apiDefaultList[newWidgetData.api[apiIndex - 1].type];

                        base.updateResponsiveData({
                            contextID: 'auiConfigureDefFrameOption',
                            dataType: 'obj',
                            selector: '.api[' + apiIndex + ']',
                            keys: ['hasReturn', 'params', 'returnValue'],
                            arraySelector: "['0']['tabPanes']['10']['attrInEachElement']",
                            values: [apiObj.hasReturn, apiObj.params, apiObj.returnValue || {}]
                        });
                    }


                    frameInstance.updateWidget(newWidgetData);
                    // frameInstance.update({option: AUI.getCleanedOption(frameInstance[0].data.optionCopy, frameInstance[0].widget.option)});

                    base.resumeBaseConfig(frameInstance);
                    if (/^widgetInstance\['option'\]/.test(modelSelector)) {
                        frameInstance.config();
                    }


                    AUI.currentWidgetID = CONST.CREATOR.ID;
                }
            },

            WB = {
                init: function () {


                    //初始化权限角色
                    external.getRole(function (data) {
                        dataModel.get('role').insert(data);
                    });

                    //初始化数据实体列表
                    external.getEDM(function (data) {
                        dataModel.set('edmModel', app.taffy(data))
                    });

                    //初始化 Agree Bus 服务列表
                    external.getAgreeBusEDM(function (data) {

                        if (data) {

                            var originData = JSON.parse(data).data,

                                newData = [{originData: originData}],

                                handleAgreeBusEdmData = function (data) {

                                    var seek = [],
                                        i, item, pID,
                                        cursor;

                                    // data = JSON.parse(JSON.stringify(data));

                                    for (i = -1; item = data[++i];) {
                                        seek.push(item);
                                    }

                                    i = -1;

                                    while (item = seek[++i]) {
                                        cursor = i;

                                        pID = item.id;
                                        item.subGroup && item.subGroup.length && $.each(item.subGroup, function (index, item) {
                                            item.pID = pID;
                                            seek.splice.apply(seek, [cursor + 1, 0].concat(item));
                                        });

                                        item.services && item.services.length && $.each(item.services, function (index, item) {
                                            item.pID = pID;
                                            seek.splice.apply(seek, [cursor + 1, 0].concat(item));
                                        });

                                        if (item.scenarios) {

                                            item.scenarios.length && $.each(item.scenarios, function (index, item) {
                                                item.pID = pID;

                                                newData.push(item);
                                                seek.splice.apply(seek, [cursor + 1, 0].concat(item.fields));

                                            });
                                        }

                                        if (item.subField && (!item.pID)) {
                                            // item.pID = pID;
                                            newData.push(item);
                                        }

                                        item.subField && item.subField.length && $.each(item.subField, function (index, item) {
                                            item.pID = pID;
                                            newData.push(item);
                                            seek.splice.apply(seek, [cursor + 1, 0].concat(item));
                                        });

                                    }


                                };

                            handleAgreeBusEdmData(originData);

                            dataModel.set('agreeBusEdmModel', app.taffy(newData));

                        }

                    });

                    //获取页面路径
                    external.getWebContentPath(function (path) {
                        // AUI.configuration.webContentPath = path;
                        dataModel.setConfigValue('webContentPath', path);
                    });

                    //获取AUI的配置并初始化菜单
                    AUI.getPageConfig(function () {


                        WB.ui();

                        AUI.resumeDataModel($(CONST.PAGE.CONTENT_FRAME.EDITOR_CTN), CONST.WIDGET.PAGE_TYPE, CONST.WIDGET.PAGE_HREF, function (pageWidget, layoutData) {




                            AUI.resumeWidgetBuilder(dataModel.get('href'), true, layoutData,function () {
                                $AW.trigger($AW._STATUS.CSS_FRAME.LOAD); //css的加载
                                $AW.trigger($AW._STATUS.CODE_FRAME.LOAD);//js 加载
                                $AW.trigger($AW._STATUS.CONFIGURE_DEF_FRAME.LOAD);//配置的定义

                                (app.router.page.auiConfigureFrame)  && app.router.page.auiConfigureFrame.done(function () {
                                    $AW.trigger($AW._STATUS.CONFIGURE_FRAME.OPTION_LOAD,oWidgetFrame.id());
                                    //oWidgetNew.config();
                                });
                                // console.log()
                                // oWidgetFrame.config();


                            });

                            app.router.page.auiContentFrame && app.router.page.auiContentFrame.done(function () {
                                $AW.trigger($AW._STATUS.CONTENT_FRAME.LOAD); //内容树的加载
                            });

                            app.router.page.auiMenuFrame && app.router.page.auiMenuFrame.done(function () {
                                $AW.trigger($AW._STATUS.MENU_FRAME.LAYOUT_SELECT_CHANGE, layoutData.href);
                            });



                        }, function (config, data, $auiFrame) {

                            var frameList = CONST.DATA.viewerList,
                                cannotOverride = CONST.DATA.cannotOverride,
                                i, item;


                            /*auiJSEditor.setValue(config.jsFileContent || getDefaultJsContent(config.href));*/

                            /* jsCodeCallback();*/

                            for (i = frameList.length; item = frameList[--i];) {
                                !cannotOverride[item] && config[item] && (data[item] = config[item]);
                            }

                            data.uuid = app.getUID();
                            data.eventAccumulator = config.eventAccumulator || data.eventAccumulator;
                            data.accumulator = config.accumulator || data.accumulator;

                            config.customCode && (data.customCode=config.customCode);//自定义代码

                            // config.appJsCode && eval(config.appJsCode);

                            if (config.frame && config.frame.root) {
                                delete config.___id;
                                delete config.___s;

                                config.isNewest = true;
                                //data.menu.insert(config);
                                data.widget.insert(config);
                            }


                            return data;
                        });


                    });

                },
                ui: function () {

                    if(!auiApp.isNewDir){
                        $(CONST.PAGE.NAV.RESET_APP_BTN).on('click.wb', function () {
                            require(['api'],function (Api) {
                                new Api(globalResetSource);
                            })

                        });
                    }


                }
            };





        AUI.saveApiJs = toolset.saveApiJs;
        AUI.saveThemeWidget=saveThemeWidget;
        AUI.saveNslWidget=saveNslWidget;

        AUI.reset = function () {


            external.saveConfigure({
                "belongTo": dataModel.get('belongTo') || 'custom',
                "icon": "fa fa-file",
                "index": dataModel.get('index') || 0,
                "frame": true,
                "name": dataModel.get('type'),
                "type": dataModel.get('type'),
                "desp": dataModel.get('desp'),
                "href": dataModel.get('href'),
                "pType": dataModel.get('pType'),
                "version": AUI.awosAppUnitedVersion,
                "jsFileContent": getDefaultJsContent(dataModel.get('href'))
            }, function () {
                document.location.reload(true);
            });
        };
        AUI.save = function () {

            $AW(dataModel.get('uuid')).frame();
            $AW.trigger($AW._STATUS.SAVE);

            $AW.trigger($AW.STATUS.PREVIEW_FRESH);
            //保存环境配置
        };

        AUI.resumeWidgetBuilder = function (href, notInStep, data,callback) {
            external.getDependenceConfig(function (depsData) {

                var appInterfacesSources = WidgetConfig.appInterfacesSources,
                    key,

                    sourcesDesp = [], sourceValue = [],
                    themeDesp = [], themeValue = [], nslDesp = [], nslValue = [],
                    context = $AW(dataModel.get('uuid')),
                    href = data.href,
                    frameName = data.name,
                    resumeWidgetCreator = function () {
                        var oWidgetCreator,
                            i, len,
                            js,
                            css, item,
                            $contextCreator,
                            frameWidgetData,
                            creatorOption,
                            theme,
                            key,
                            value,
                            jsConfigArray = [],
                            cssConfigArray = [];

                        for (key in depsData) {
                            if (depsData.hasOwnProperty(key)) {
                                value = depsData[key];
                                if (value && value.name) {
                                    jsConfigArray.push(value.name);
                                } else {
                                    cssConfigArray.push(key);
                                }
                            }

                        }

                        $.when(waitThemeAndNsl()).done(function (nslData, themeData) {
                            var themeName, nslName;

                            if (themeData) {
                                themeData = JSON.parse(themeData);
                                themeName= (themeData.info &&themeData.info.name)|| (themeData.name);


                                themeValue.push(WB_CONST.DEFAULT);

                                themeDesp.push(themeName + WB_CONST.DEFAULT_THEME);

                                themeDefaultValue = WB_CONST.DEFAULT;

                                data.info.theme = WB_CONST.DEFAULT;

                                $AW.fresher.theme = themeData.theme;
                                $AW.fresher.variables = themeData.variables;
                                $AW.fresher.variablesCopy = AUI.transformThemeVariables(themeData.variables);

                                AUI.saveFresherFile();


                            } else {
                                data.info.nsl = themeDefaultValue;
                                saveThemeWidget(data.info.theme);

                            }

                            if (nslData) {
                                nslData = JSON.parse(nslData);
                                nslName= (nslData.info && nslData.info.name) || ('默认国际化配置');

                                nslValue.push(WB_CONST.DEFAULT);
                                nslDesp.push(nslName + WB_CONST.DEFAULT_NSL);
                                nslDefaultValue = WB_CONST.DEFAULT;

                                data.info.nsl = WB_CONST.DEFAULT;

                            } else {
                                data.info.nsl = nslDefaultValue;
                                saveNslWidget(data.info.nsl);

                            }

                            //insert: 虚拟组件
                            if (dataModel.get('widget')({
                                    type: CONST.CREATOR.TYPE
                                }).get().length === 0) {

                                dataModel.get('widget').insert({
                                    name: 'creator',
                                    desp: 'creator',
                                    icon: 'fa fa-files',
                                    type: CONST.CREATOR.TYPE,
                                    pType: '',
                                    href: CONST.CREATOR.HREF,
                                    belongTo: 'creator',
                                    version: AUI.awosAppUnitedVersion,
                                    index: 0,
                                    option: [{
                                        type: 'tab',
                                        tabPanes: [{
                                            name: 'info',
                                            type: 'object',
                                            desp: '信息',
                                            expand: true,
                                            attr: [{
                                                name: 'author',
                                                desp: '作者',
                                                type: 'string_input',
                                                placeholder: '请填入邮箱地址'
                                            },
                                                {
                                                    name: 'name',
                                                    desp: '网页标题',
                                                    type: 'string_input'
                                                },
                                                {
                                                    name: 'desp',
                                                    desp: '描述',
                                                    type: 'string_input'
                                                },
                                                {
                                                    name: "details",
                                                    desp: "详情",
                                                    type: 'string_input'
                                                },
                                                {
                                                    name: 'icon',
                                                    desp: '图标',
                                                    type: 'icon'
                                                },
                                                {
                                                    name: 'src',
                                                    desp: '缩略图',
                                                    type: 'string_input',
                                                    defaultValue: './img/viewer.png'
                                                },
                                                {
                                                    name: 'category',
                                                    desp: '分类',
                                                    type: 'string_select',
                                                    valueArray: dataModel.get('category').valueArray,
                                                    despArray: dataModel.get('category').despArray
                                                },
                                                {
                                                    name: "accept",
                                                    desp: "可放置于",
                                                    type: 'multiple_select',
                                                    separator: ' ',
                                                    despArray: viewerAccept.despArray,
                                                    valueArray: viewerAccept.valueArray
                                                },
                                                {
                                                    name: 'isLayout',
                                                    desp: '布局容器类组件',
                                                    type: 'boolean',
                                                    defaultValue: true
                                                },
                                                {
                                                    name: "base",
                                                    desp: "布局模式继承于",
                                                    type: 'multiple_select',
                                                    separator: ' ',
                                                    despArray: viewerAccept.despArray,
                                                    valueArray: viewerAccept.valueArray,
                                                    defaultValue: 'mainPanel',
                                                    require: {
                                                        isLayout: 'true'
                                                    }
                                                },
                                                {
                                                    name: 'sources',
                                                    desp: '接口渠道',
                                                    type: 'multiple_select',
                                                    despArray: sourcesDesp,
                                                    valueArray: sourceValue,
                                                    defaultValue: ['universal'],
                                                },
                                                {
                                                    name: 'theme',
                                                    desp: '主题',
                                                    type: 'string_select',
                                                    despArray: Array.from(new Set(themeDesp)),
                                                    valueArray: Array.from(new Set(themeValue)),
                                                    defaultValue: themeDefaultValue
                                                },

                                                {
                                                    name: 'nsl',
                                                    desp: '国际化',
                                                    type: 'string_select',
                                                    despArray: Array.from(new Set(nslDesp)),
                                                    valueArray: Array.from(new Set(nslValue)),
                                                    defaultValue: nslDefaultValue
                                                }
                                            ]
                                        },
                                            {
                                                name: 'environment',
                                                type: 'object',
                                                desp: '环境',
                                                details: '配置生产与开发环境',
                                                expand: true,
                                                attr: [{
                                                    name: 'debug',
                                                    desp: '测试模式',
                                                    type: 'boolean',
                                                    defaultValue: 'true'
                                                }, {
                                                    name: 'error',
                                                    desp: '报错提示',
                                                    type: 'boolean',
                                                    defaultValue: 'true'
                                                }, {
                                                    name: 'fresher',
                                                    desp: '主题配置',
                                                    type: 'boolean',
                                                    defaultValue: 'true'
                                                }, {
                                                    name: 'log',
                                                    desp: '显示日志',
                                                    type: 'boolean',
                                                    defaultValue: 'true'
                                                }, {
                                                    name: 'translate',
                                                    desp: '国际化',
                                                    details: '是否开启国际化配置',
                                                    type: 'boolean',
                                                    defaultValue: true
                                                }, {
                                                    name: 'preloading',
                                                    desp: '是否预加载资源',
                                                    type: 'boolean',
                                                    defaultValue: 'false'
                                                },
                                                    {
                                                        name: 'singleStyleFile',
                                                        desp: '单一样式文件',
                                                        type: 'boolean',
                                                        defaultValue: 'false'
                                                    },
                                                    {
                                                    name: 'requireConfig',
                                                    desp: 'RequireJS配置',
                                                    type: 'object',
                                                    attr: [{
                                                        name: 'waitSeconds',
                                                        type: 'number',
                                                        desp: '资源加载等待时间（s）',
                                                        defaultValue: '30'
                                                    }, {
                                                        name: 'urlArgs',
                                                        desp: '使用缓存脚本',
                                                        type: 'boolean',
                                                        defaultValue: 'true'
                                                    }]
                                                }/*,{
                                                 name:'headless',
                                                 desp:'自动化测试',
                                                 type:'object',
                                                 attr: [{
                                                 name: 'on',
                                                 type: 'boolean',
                                                 desp: '开启录制功能',
                                                 defaultValue:'false'
                                                 }]
                                                 }*/]
                                            },
                                            {
                                                name: 'content',
                                                type: 'string_simpleHtml',
                                                desp: '模板',
                                                style: 'height: 500px',
                                                info: '请输入HTML代码  此处有两个占位符，不能删除',
                                                defaultValue: artTemplate('viewerTemplate', {}).replace(/\\\//, '/')
                                            },
                                            {
                                                "name": "deps",
                                                "type": "object",
                                                "desp": "依赖",
                                                "isTab": true,
                                                expand: true,
                                                "attr": [{
                                                    "name": "js",
                                                    "type": "multiple_select",
                                                    "desp": "脚本文件",
                                                    "valueArray": jsConfigArray,
                                                    "despArray": jsConfigArray
                                                },
                                                    {
                                                        "name": "css",
                                                        "type": "multiple_select",
                                                        "desp": "样式文件",
                                                        "valueArray": cssConfigArray,
                                                        "despArray": cssConfigArray
                                                    }
                                                ]
                                            },
                                            {
                                                name: 'iconArr',
                                                type: 'array',
                                                desp: '字体图标',
                                                expand: true,
                                                attrInEachElement: [{
                                                    name: 'namespace',
                                                    type: 'string_input',
                                                    desp: '前缀'
                                                },
                                                    {
                                                        name: 'file',
                                                        type: 'string_select',
                                                        desp: '文件',
                                                        valueArray: !data.deps.css ? [''] : [''].concat(data.deps.css),
                                                        despArray: !data.deps.css ? ['无'] : ['无'].concat(data.deps.css)
                                                    },
                                                    {
                                                        name: 'code',
                                                        type: "string_simpleHtml",
                                                        desp: '列表',
                                                        language: 'json'
                                                    }
                                                ],
                                            }
                                        ].concat(WidgetConfig.commonOption)

                                    }],
                                    attr: [],
                                    isNewest: true
                                });

                                dataModel.get('structure').insert({
                                    widgetID: CONST.CREATOR.ID, //primary key
                                    type: CONST.CREATOR.TYPE, //foreign key
                                    href: CONST.CREATOR.HREF,
                                    active: true, //是否生效，撤销之后不生效
                                    noRender: true,
                                    option: {},
                                    optionCopy: {
                                        option: [{
                                            name: 'hasLoginPage',
                                            desp: '是否有登录页',
                                            type: 'boolean'
                                        },
                                            {
                                                name: 'hasValidateCode',
                                                desp: '是否有验证码',
                                                type: 'boolean',
                                                require: {
                                                    hasLoginPage: [true]
                                                }

                                            }
                                        ]
                                    },
                                    attr: {
                                        widgetName: data.name || '业务组件creator'
                                    },
                                    css: {},
                                    children: []
                                });
                            }


                            frameInstanceId = dataModel.get('structure')({
                                'type': dataModel.get('type')
                            }).first().widgetID;

                            //初始化：虚拟组件对象和context
                            oWidgetCreator = $AW(CONST.CREATOR.ID);


                            $contextCreator = $(CONST.PAGE.CONFIGURE_DEF_FRAME.CTN);


                            if (data.deps) {
                                if (js = data.deps.js) {
                                    for (i = -1; item = js[++i];) {
                                        if (item === data.href || !dataModel.get('dependence')[item]) {
                                            data.deps.js.splice(i, 1);
                                            i = -1;
                                        }
                                    }
                                    data.deps.js.unshift(data.href);
                                } else {
                                    data.deps.js = [data.href]
                                }
                                if (css = data.deps.css || []) {
                                    for (i = -1; item = css[++i];) {
                                        if (!dataModel.get('dependence')[item]) {
                                            data.deps.css.splice(i, 1);
                                            i = -1;
                                        }
                                    }
                                }

                            } else {
                                data.deps = {
                                    js: [data.href],
                                    css: []
                                };
                            }

                            globalResetSource =data.info.sources||'universal';
                            //getResetSources();

                            if (!data.base) {
                                data.base = 'divCtn';
                            }

                            $.when(wait(data, false)).done(function () {

                                    var overrideObj = {};

                                if (!data.appInterfaces || (data.appInterfaces && !data.appInterfaces.length)) {
                                    //do nothing
                                } else {
                                    overrideObj.appInterfaces = data.appInterfaces;
                                }


                                if (!data.deps || $.isEmptyObject(data.deps)) {
                                    // do nothing

                                } else {

                                    overrideObj.deps = data.deps;
                                }

                                if (!data.environment || $.isEmptyObject(data.environment)) {
                                    // do nothing

                                } else {

                                    overrideObj.environment = data.environment;
                                }

                                if (!data.iconArr || (data.iconArr && !data.iconArr.length)) {
                                    //do nothing

                                } else {
                                    overrideObj.iconArr = data.iconArr;

                                }


                                // $.when(waitIcon()).done(function () {

                                    $.extend(data, globalApiConfig, overrideObj);

                                    creatorOption = base.baseConfigInitInstance(JSON.parse(JSON.stringify(data)), oWidgetCreator[0].widget.option, {
                                        widgetID: oWidgetCreator[0].widgetID
                                    });

                                    //利用新的option更新widget
                                    // AUI.resumeWidget(creatorOption, creatorWidget.option);
                                    // oWidgetCreator.updateWidget(creatorWidget);
                                    //更新structure
                                    oWidgetCreator.update({
                                        option: base.getCleanedOption(creatorOption, oWidgetCreator[0].widget.option),
                                        optionCopy: creatorOption
                                    });
                                    callbackLock = true;

                                    AUI.currentWidgetID = CONST.CREATOR.ID;
                                    //初始化业务组件编辑主页面

                                    /*base.baseConfigure($contextCreator, oWidgetCreator);*/




                                    //初始化：业务组件
                                    oWidgetFrame = $AW(frameInstanceId);

                                    //初始化：业务组件的widget值
                                    frameWidgetData = oWidgetCreator.option();

                                 //   $AW[data.href] = AUI.widgetInstanceDefaultCallback;

                                    frameWidgetData.pType = 'viewer';
                                    oWidgetFrame.updateWidget(frameWidgetData);

                                    base.resumeBaseConfig(oWidgetFrame);





                                    AUI.configLock = true;

                                callback && app.performance.longDelay(callback);



                            });





                        })


                    };


                data.deps = data.deps || {};

                for (key in appInterfacesSources) {
                    sourcesDesp.push(appInterfacesSources[key]);
                    sourceValue.push(key);
                }

                dataModel.get('menu')({pType: 'theme'}).each(function (obj) {

                    themeDesp.push(obj.name);
                    themeValue.push(obj.href);

                });


                dataModel.get('menu')({pType: 'nsl'}).each(function (obj) {
                    nslDesp.push(obj.name);
                    nslValue.push(obj.href);
                });


                /* codeCompile.compileCss(data.deps.css);*/
                viewerAccept = getAcceptTagsItems(dataModel.get('menu'));


               // $AW[data.href] = AUI.widgetInstanceDefaultCallback;

                //恢复界面
                if (!dataModel.get('widget')({
                        href: href
                    }).first()) {

                    //新建业务组件
                    data = $.extend(true, {
                        template: '<div data-widget-type="' + data.type + '"></div>',
                        accept: '',
                        base: 'mainPanel',
                        attr: [],
                        option: [],
                        css: {},
                        event: {},
                        edm: {},
                        action: []
                    }, data);
                    data.isNewest = true;

                    dataModel.get('widget').insert(data);
                }



                if (data.frame === true) {
                    $AW(dataModel.get('uuid')).empty().append(data.href, function (cWidget) {
                        resumeWidgetCreator();
                    });
                } else {
                    data.frame.pType = data.pType;
                    $AW._paste(context, data.frame, frameName, notInStep, resumeWidgetCreator);
                }


            });
        };

        $AW.on($AW.STATUS.WIDGET_UPDATE, function (eventName, oWidget, event) {
            if (oWidget && oWidget.length) {
                if (oWidget.id() === CONST.CREATOR.ID && event) {
                    widgetCreatorConfigCallbackHandler(oWidget, event);
                }
            }

        });


        return WB;
    });
})();

