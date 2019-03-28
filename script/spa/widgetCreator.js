/**
 * [widget creator]
 *
 * @param {[undefined]} undefined [undefined]
 * @author quanyongxu@agree.com.cn
 */
( /* <global> */ function (undefined) {

    (function (factory) {
        'use strict';
        // amd module
        if (typeof define === 'function' && define.amd) {
            define(['jquery', 'index', 'const', 'config.widget', 'base', 'Model.Data', 'uglifyjs', ''], factory);
        }
        // global
        else {
            factory();
        }

    })(function ($, AUI, CONST, WidgetConfig, base, dataModel) {
        'use strict';

        /*变量定义*/
        var
            newWidgetID,
            rootWidget,

            renderWidget = function (widgetData, event, renderWidgetCallback) {

              //  renderWidgetCallback();

                var
                    acceptOrder = [],
                    acceptArray,
                    i = 1,
                    depsTypeMap = {},
                    widgetType,menuItem,
                    callback = function (cWidget) {

                        if (widgetType = acceptOrder[i++]) {
                            cWidget.append(widgetType, callback);
                        } else {
                            newWidgetID = cWidget[0].widgetID;
                            renderWidgetCallback();
                            //  AUI.currentWidgetID = CONST.CREATOR.ID;
                        }

                    };


                acceptOrder.push(widgetData.type);
                if (widgetData.accept) {

                    acceptArray = widgetData.accept.split(' ');
                    while ($.inArray("mainPanel", acceptArray) < 0) {
                        if (acceptArray[0] === 'modalCtn') {
                            acceptArray[0] = 'divCtn';
                            widgetData.accept = 'divCtn';
                            $AW.updateWidget(widgetData.href, widgetData);
                        }

                        acceptOrder.unshift(acceptArray[0]);



                        acceptArray =(menuItem=dataModel.get("menu")({
                            type: acceptArray[0]
                        }).first())  && menuItem.accept.split(' ')||['mainPanel'];
                    }


                } else {
                    acceptOrder.unshift('divCtn');
                    widgetData.accept = 'divCtn';
                    $AW.updateWidget(widgetData.href, widgetData);
                }

                rootWidget.empty(true, true).append(acceptOrder[0], callback);
            },
            widgetCreatorConfigCallbackHandler = function (widget, event) {
                var ins, apiIndex, apiObj,
                    temp,
                    index,
                    cssDeps = [],
                    oWidgetCreator = $AW(CONST.CREATOR.ID),
                    newWidgetData = oWidgetCreator.option();

                if (newWidgetID && (ins = $AW(newWidgetID))) {

                    if (event.modelSelector in {
                            "widgetInstance['info']['accept']": true,
                            "widgetInstance['info']['base']": true,
                            "widgetInstance['info']['author']": true
                        }) {
                        newWidgetData.accept = newWidgetData.info.accept;
                        newWidgetData.base = newWidgetData.info.base;
                        newWidgetData.author = newWidgetData.info.author;

                        oWidgetCreator.option(newWidgetData);
                    }

                    if (event.modelSelector.match(/^widgetInstance\['api'\]\['[0-9]+'\]\['type'\]$/)) {
                        apiIndex = event.modelSelector.match(/(\d+)/)[0];
                        apiObj = WidgetConfig.apiDefaultList[oWidgetCreator[0].data.optionCopy.api[apiIndex].type];

                        base.updateResponsiveData({
                            contextID: 'auiConfigureDefFrameOption',
                            dataType: 'obj',
                            selector: '.api[' + apiIndex + ']',
                            keys: ['hasReturn', 'params', 'returnValue'],
                            arraySelector: "['0']['tabPanes']['7']['attrInEachElement']",
                            values: [apiObj.hasReturn, apiObj.params, apiObj.returnValue || {}]
                        });
                    }

                    if (event.modelSelector.match(/^widgetInstance\['api'\].+\['type'\]$/)) {
                        index = event.modelSelector.match(/(\d+)/)[0];
                        temp = vueManage.auiConfigureDefFrameOption.obj.api[index];
                        if (event.newVal === 'setter') {
                            temp.deps = 'ajax';
                            temp.lifecycle = ['load', 'resume'];
                        }
                      
                    }
                    if (event.modelSelector.match(/^widgetInstance\['option'\].+\['type'\]$/)) {
                        if (event.newVal === 'edm') {
                            index = event.modelSelector.match(/(\d+)/)[0];
                            temp = vueManage.auiConfigureDefFrameOption.obj.option[index];
                            temp.direction = 'response';

                        }
                    }

                    if (event.modelSelector.match(/^widgetInstance\['deps'\]+\['css'\]$/)) {

                        $AW.trigger($AW._STATUS.CSS_FRAME.LOAD);

                    }

                    ins.updateWidget(newWidgetData);

                    ins.update({
                        option: {},
                        optionCopy: {}
                    });

                    if (event.modelSelector in {
                            "widgetInstance['info']['accept']": true,
                            "widgetInstance['template']": true
                        }) {

                        if (ins.length === 0) {
                            $AW.updateWidget(newWidgetData.href, newWidgetData);
                            renderWidget(newWidgetData, event);
                        } else {
                            event.reRender = true;
                            // AUI.preview();
                        }
                        ins = $AW(newWidgetID);
                    }
                    base.resumeBaseConfig(ins, undefined, event);

                    ins.config();

                    //  AUI.currentWidgetID = CONST.CREATOR.ID;
                }
            },


            createFakeWidget = function (widgetData, depsData, category) {
                var jsConfigArray = [],
                    cssConfigArray = [],
                    dependence = dataModel.get('dependence'),
                    key, value, index, path, js;

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


                if (widgetData.belongTo === CONST.WIDGET.TYPE.PLATFORM && widgetData.deps && (js = widgetData.deps.js)) {
                    for (index = -1; path = js[++index];) {
                        for (key in dependence) {
                            if (dependence.hasOwnProperty(key)) {
                                value = dependence[key];
                                if (value && value.name && value.path && path.split('/').pop().indexOf(value.path.split('\\').pop()) !== -1) {
                                    js[index] = value.name;
                                }
                            }

                        }
                    }

                }

                //插入左边的大widget
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
                    option: [
                        {
                            type: 'tab',
                            tabPanes: [
                                {
                                    name: 'info',
                                    type: 'object',
                                    desp: '信息',
                                    expand: true,
                                    attr: [
                                        {
                                            name: 'author',
                                            desp: '作者',
                                            type: 'string_input',
                                            placeholder: '请填入邮箱地址'
                                        },
                                        {
                                            name: 'name',
                                            desp: '中文名',
                                            type: 'string_input'
                                        },
                                        {
                                            name: "details",
                                            desp: "详情",
                                            type: 'textarea',
                                            rows: 4
                                        },
                                        {
                                            name: "compatibility",
                                            desp: '兼容性',
                                            type: 'string_select',
                                            valueArray: ['modernBrowser', 'ie8', 'ie9', 'ie10'],
                                            despArray: ['现代浏览器', 'IE8', 'IE9', 'IE10']
                                        },
                                        {
                                            name: 'icon',
                                            desp: '图标',
                                            type: 'icon'
                                        },
                                        {
                                            name: 'category',
                                            desp: '类别',
                                            type: 'string_select',
                                            valueArray: category.valueArray,
                                            despArray: category.despArray
                                        },
                                        {
                                            name: "accept",
                                            desp: "可放置于",
                                            type: 'multiple_select',
                                            separator: ' ',
                                            despArray: dataModel.get('creator').accept.despArray,
                                            valueArray: dataModel.get('creator').accept.valueArray
                                        }, {
                                            name: 'isLayout',
                                            desp: '布局容器类组件',
                                            type: 'boolean',
                                            defaultValue: false
                                        },
                                        {
                                            name: "base",
                                            desp: "布局模式继承于",
                                            type: 'multiple_select',
                                            separator: ' ',
                                            despArray: dataModel.get('creator').accept.despArray,
                                            valueArray: dataModel.get('creator').accept.valueArray,
                                            require: {
                                                isLayout: 'true'
                                            }
                                        },
                                        {
                                            name: 'collapse',
                                            desp: '在组件菜单中收起该组件类别',
                                            type: 'boolean',
                                            defaultValue: false
                                        },
                                        {
                                            name: 'hidden',
                                            desp: '在组件菜单中隐藏该组件',
                                            type: 'boolean',
                                            defaultValue: false
                                        }
                                    ]
                                },
                                {
                                    name: 'template',
                                    type: 'string_simpleHtml',
                                    desp: '模板',
                                    style: 'height: 700px',
                                    info: '请输入HTML代码',
                                    defaultValue: '<div data-widget-type="_type_"></div>'.replace(/_type_/, $.camelCase('aweb4-' + widgetData.type))
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
                                }
                            ].concat(WidgetConfig.commonOption)
                        }
                    ],
                    attr: []
                });

                dataModel.get('structure').insert({
                    widgetID: CONST.CREATOR.ID, //primary key
                    type: CONST.CREATOR.TYPE, //foreign key
                    href: CONST.CREATOR.HREF, //foreign key
                    active: true, //是否生效，撤销之后不生效
                    option: {},
                    optionCopy: {},
                    attr: {
                        widgetName: widgetData.name
                    },
                    css: {},
                    children: []
                });


                widgetData.isNewest = true;

                //插入会生成的widget
                dataModel.get('widget').insert(JSON.parse(JSON.stringify(widgetData)));

            },


            widgetCreator = {
                /*初始化*/
                init: function () {
                    //初始化数据实体列表
                    external.getEDM(function (data) {
                        dataModel.set('edmModel', app.taffy(data))
                    });


                    //获取页面路径
                    external.getWebContentPath(function (path) {
                        dataModel.setConfigValue('webContentPath', path);

                    });

                    external.getMenu(function (data) {
                        /*普通菜单的渲染*/

                        var menusDB = dataModel.get('menu'),
                            category = dataModel.get('category'),
                            //初始化accept属性
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
                            creatorData,
                            widgetData;

                        menusDB.insert(data);

                        creatorData = dataModel.get('creator');
                        creatorData.accept = getAcceptTagsItems(menusDB);
                        dataModel.set('creator', creatorData);


                        menusDB({
                            pType: CONST.WIDGET.PAGE_TYPE
                        }).order('index').each(function (menusItem) {
                            var seed = [], cursor = -1, item, children, subChildren;


                            if (menusItem.type !== CONST.WIDGET.TYPE.FRAME) {
                                children = menusDB({
                                    pType: menusItem.type
                                });
                                if (children.count()) {
                                    children.order('index').each(function (item) {
                                        seed.push(item);
                                    });
                                }
                                category.valueArray.push(menusItem.type);
                                category.despArray.push(menusItem.name);
                            }


                            while (item = seed[++cursor]) {
                                if (item.type !== CONST.WIDGET.TYPE.FRAME) {
                                    subChildren = menusDB({
                                        pType: item.type
                                    });
                                    if (subChildren.count()) {
                                        category.valueArray.push(item.type);
                                        category.despArray.push(item.name);
                                    }
                                }
                            }
                        });


                        dataModel.set('category', category);


                        external.getDependenceConfig(function (depsData) {
                            AUI.getPageConfig(function () {
                                AUI.resumeDataModel($(CONST.PAGE.CONTENT_FRAME.EDITOR_CTN), CONST.WIDGET.PAGE_TYPE, CONST.WIDGET.PAGE_HREF,
                                    function (localRootWidget, widgetConfig, data) {
                                        var oWidgetCreator,
                                            creatorOption, i, js, css, value, auiConfigureDefFrame;

                                        createFakeWidget(widgetData, depsData, dataModel.get('category'));

                                        oWidgetCreator = $AW(CONST.CREATOR.ID);

                                        rootWidget = localRootWidget;

                                        widgetData.deps = widgetData.deps || ({
                                                js: [],
                                                css: []
                                            });

                                        if (js = widgetData.deps.js || []) {

                                            widgetData.deps.js = js;

                                            for (i = -1; value = js[++i];) {
                                                if (value === widgetData.href || !dataModel.get('dependence')[value]) {
                                                    widgetData.deps.js.splice(i, 1);
                                                    i = -1;
                                                }
                                            }
                                        }

                                        if (css = widgetData.deps.css || []) {
                                            widgetData.deps.css = css;
                                            for (i = -1; value = css[++i];) {
                                                if (!dataModel.get('dependence')[value]) {
                                                    widgetData.deps.css.splice(i, 1);
                                                    i = -1;
                                                }
                                            }
                                        }


                                        widgetData.deps.js.push(widgetData.href);

                                        creatorOption = base.baseConfigInitInstance(JSON.parse(JSON.stringify(widgetData)), oWidgetCreator[0].widget.option, {
                                            widgetID: oWidgetCreator[0].widgetID
                                        });


                                        //更新structure
                                        oWidgetCreator.update({
                                            option: base.getCleanedOption(creatorOption, oWidgetCreator[0].widget.option),
                                            optionCopy: creatorOption
                                        });

                                        //第一次render
                                        renderWidget(oWidgetCreator.option(), {}, function () {
                                            var oWidgetNew = $AW(newWidgetID),
                                               routerPage= app.router.page;


                                            (auiConfigureDefFrame = routerPage.auiConfigureDefFrame) && auiConfigureDefFrame.done(function () {
                                                $AW.trigger($AW._STATUS.CONFIGURE_DEF_FRAME.LOAD);
                                            });//配置定义面板

                                            (routerPage.auiConfigureFrame)  && routerPage.auiConfigureFrame.done(function () {
	                                            $AW.trigger($AW._STATUS.CONFIGURE_FRAME.OPTION_LOAD,newWidgetID);
                                                //oWidgetNew.config();
                                            });

                                            (routerPage.auiCssFrame)  && routerPage.auiCssFrame.done(function () {
                                                $AW.trigger($AW._STATUS.CSS_FRAME.LOAD);
                                            });


                                            AUI.hideWelcomeScreen();

                                            //    AUI.currentWidgetID = CONST.CREATOR.ID;

                                        });

                                    },
                                    function (_widgetData, data, $auiFrame) {


                                        widgetData = _widgetData;
                                        data.href = _widgetData.href;
                                        //新建
                                        widgetData.jsEditor = "option";

                                        return data;


                                    });


                            });

                        });

                    }, function (errorMsg) {
                        app.alert(errorMsg, app.alert.ERROR);
                    });


                },

                version: '510000'
            };


        dataModel.set('creator', dataModel.get('creator') || {});

        AUI.save = function () {
            if (!AUI.savingLock) {
                try {
                    AUI.savingLock = true;

                    var data = {}, item, i,
                        _i, value, js, href,
                        list = CONST.DATA.creatorList,
                        // jsCode = auiJSEditor.getValue(),
                        vueData = vueManage.auiConfigureDefFrameOption,
                        widgetData = base.getCleanedOption(JSON.parse(JSON.stringify(vueData.obj)), JSON.parse(JSON.stringify(vueData.array)));


                    for (i = -1; item = list[++i];) {
                        widgetData[item] && (data[item] = widgetData[item]);
                    }

                    if (js = data.deps.js) {
                        for (_i = -1; value = js[++_i];) {
                            if (value === data.href) {
                                data.deps.js.splice(_i, 1);
                            }
                        }

                    }

                    href = data.href;
                    data.deps.js.push(href);

                    data[CONST.USE_VERSION] = version;
                    external.saveConfigure(data, function () {
                        AUI.savingLock = false;
                        $AW.trigger($AW._STATUS.SAVE);
                        app.alert("保存组件配置成功！", app.alert.SUCCESS);
                    }, function () {
                        AUI.savingLock = false;
                        app.alert("保存组件配置失败！", app.alert.ERROR);
                    });


                } catch (e) {
                    AUI.savingLock = false;
                    throw e;
                }
            } else {
                app.alert('页面保存中，请稍候…', app.alert.WARNING);
            }
        };
        AUI.reset = function () {
            var widget = $AW(CONST.CREATOR.ID).option();
            external.saveJsCode({
                href: widget.href,
                code: ''
            });
            external.saveConfigure({
                "belongTo": widget.belongTo || "custom",
                "icon": "fa fa-files",
                "index": 0,
                "name": widget.name || widget.type,
                "type": widget.type,
                "href": widget.href,
                "pType": widget.pType,
                "version": AUI.awosAppUnitedVersion
            }, function () {
                document.location.reload(true);
            });
        };


        $AW.on($AW.STATUS.WIDGET_UPDATE, function (eventName, oWidget, event) {
            if (oWidget && oWidget.length && oWidget.id() === CONST.CREATOR.ID && event) {
                widgetCreatorConfigCallbackHandler(oWidget, event);
            }
        });

        return widgetCreator;
    });
})();