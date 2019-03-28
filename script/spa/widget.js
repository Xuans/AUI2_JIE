/*!
 * Javascript library v3.0
 *
 * Date: 2016.04.21
 */

/**
 * @author lijiancheng@cfischina.com
 */
( /* <global> */function (undefined) {

    (function (factory) {
        'use strict';

        // amd module
        if (typeof define === 'function' && define.amd) {
            define(['jquery', 'index', 'const', 'bridge', 'chain', 'base', 'Model.Data', 'edm', 'event', 'lifecycle', 'css'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, AUI, CONST, Bridge, Chain, base, dataModel, edmUtil, eventUtil, lifecycleUtil, cssUtil, undefined) {
        'use strict';

        //变量定义
        var
            PAGE_TYPE = CONST.WIDGET.PAGE_TYPE,
            FOREIGN_WIDGET_REGEX = CONST.REGEX.FOREIGN_WIDGET,
            TAFFY_LIST = CONST.DATA.taffyList,
            COMPLEX_WIDGET_ID = CONST.WIDGET.CONFIG_WIDGET_ID,
            nsl,
            OVERVIEW_VAR_TYPE = {
                DOMAIN: 'domain',
                SCOPE: 'scope',
                LOCAL: 'local'
            },

            //组件对象
            widget = function (widgetID, params) {
                return new widget.fn.init(widgetID, params);
            },

            getEvent = (function () {

                var event = new app.dispatcher(100);
                return event;
            }());
        //参数容器


        //自定义方法:
        var _append = function (pWidget, widgetHref, dataCollection, callback, insertIndex) {


                widget.fn.each.call(pWidget, function (index, pElem) {
                    var pWidgetID = pElem.widgetID,
                        pWidget = widget(pElem.widgetID),
                        data = dataCollection ? dataCollection.first() : undefined,
                        isAppend = dataCollection ? true : false,
                        isResume = data ? data.widgetID : false,
                        widgetConfig = widget._widget[widgetHref],
                        cWidget,
                        widgetID,
                        widgetIndex,
                        widgetName,
                        $widget;

                    if (pWidget.canPaste(widgetConfig.accept, widgetConfig.pType)) {
                        //生成组件View
                        if (isResume) {
                            widgetID = isResume;
                            widgetName = data.attr.widgetName;
                        } else {
                            widgetID = app.getUID();
                            widgetIndex = dataModel.getAccumulator();
                            widgetName = widgetConfig.name + widgetIndex;
                        }


                        //修改数据模型

                        dataCollection = dataCollection || dataModel.get('structure').insert({
                                widgetID: widgetID,//primary key
                                href: widgetConfig.href,//foreign key
                                type: widgetConfig.type,//foreign key
                                base: widgetConfig.base,
                                active: true,//是否生效，撤销之后不生效
                                option: {},
                                optionCopy: {},
                                attr: {
                                    id: widgetConfig.type + widgetIndex,
                                    widgetName: widgetName,
                                    desp: widgetName
                                },
                                css: {},
                                children: [],
                                pID: pElem.widgetID
                            });

                        //初始化对象
                        cWidget = widget(widgetID, {
                            $widget: $widget,
                            widgetID: widgetID,
                            dataCollection: dataCollection,
                            data: dataCollection.first(),
                            href: widgetConfig.href,
                            type: widgetConfig.type,
                            widget: widgetConfig,
                            callbackList: []
                        });
                        /*
                         *  version 4.2
                         *  author lijiancheng@agree.com.cn
                         *  log 修复旧版structure中没有href的bug
                         * */
                        if (!cWidget[0].data.href) {
                            cWidget.update({href: widgetConfig.href});
                        }


                        widget.chain.add(pWidgetID, widgetID);

                        //添加到widget组件链中
                        // debugger;


                        if (!isResume) {

                            //插入到父节点的children中
                            pElem.data.children = pElem.data.children || [];

                            if (insertIndex === widget.LAST) {
                                pElem.data.children.push(widgetID);
                            } else {
                                pElem.data.children.splice(insertIndex, 0, widgetID);
                            }

                            pWidget.update({children: pElem.data.children});
                        }

                        if (insertIndex !== widget.LAST) {
                            insertIndex++;
                        }


                        base.resumeBaseConfig(cWidget, false, cssUtil.resumeCssConfig);

                        //注册ID，如果冲突则自动添加累加器

                        widget.updateDomID(null, cWidget[0].data.attr.id, cWidget.id(), true, true);

                        if (cWidget[0].data.css && cWidget[0].data.css.cssCode && cWidget[0].data.cssCopy) {
                            widget.updateDomCustomClass(cWidget[0].data.css.cssCode.className, cWidget.id());
                            cssUtil.resumeCssConfig(cWidget, true);
                        }

                        app.performance.shortDelay(function () {

                            widget.trigger(isAppend ? widget.STATUS.WIDGET_APPEND : widget.STATUS.WIDGET_INIT, cWidget, true);
                            // if (!isAppend) {
                            //     widget.trigger(widget.STATUS.WIDGET_INIT, cWidget, true);
                            // }

                            callback && callback(cWidget);
                        });


                    }
                });
            },
            getTranslatorResult = function (str, nslList, lang) {
                var result = false, length, item, order, regex,
                    match, keys, order, value,
                    j, len;

                if (str && nslList && lang) {
                    for (length = nslList.length; item = nslList[--length];) {
                        value = item.value[lang];
                        if (item.key && value) {
                            order = item.key.match(CONST.NSL.PLACEHOLDER_NUM_G);
                            if (order) {
                                regex = new RegExp(item.key.replace(CONST.NSL.PLACEHOLDER_NUM_G, CONST.NSL.REPLACEMENT_NUM_G));// regex=/哈哈.*，.*，.*/
                            } else {
                                regex = new RegExp(item.key, 'g');
                            }
                            match = str.match(regex);

                            if (match) {
                                keys = {};
                                if (order) {
                                    for (j = 1, len = match.length; j < len; ++j) {
                                        keys[order[j - 1]] = match[j];
                                        /*
                                         *   keys={
                                         *       '{0}':'你'，
                                         *       '{1}'：'我'，
                                         *       '{2}'：'他'
                                         *   };
                                         * */
                                    }
                                    result = item.value[lang].replace(CONST.NSL.PLACEHOLDER_NUM_G, function (matcher) {
                                        return keys[matcher];
                                    });
                                } else {
                                    result = str.replace(regex, item.value[lang]);
                                }
                                break;
                            }

                        }

                    }
                    return result
                }


            },
            isLanguageDeleted = function (lang) {
                var nslLanguage = dataModel.get("nslLanguage") || [],
                    length = nslLanguage.length,
                    result = true,
                    i;
                for (i = 0; i < length; i++) {
                    if ((nslLanguage[i].name === lang) && (result = false)) {
                        break;
                    }
                }
                return result
            };


        require(['nsl'], function (_nsl) {
            nsl = _nsl;
        });

        //method
        $.extend(widget, {
            //constant
            FIRST: 0,
            LAST: -1,

            //actions
            ADD: 'add',
            DELETE: 'del',
            UPDATE: 'upd',
            CONFIG: 'config',
            REFRESH: 'refresh',

            UPDATE_CONFIG: 'updateConfig',
            SORT: 'sort',
            ADD_NAME: 'addName',
            DELETE_NAME: 'deleteName',
            UPDATE_NAME: 'updateName',
            CONFIG_NAME: 'configName',
            STATUS: {
                WIDGET_INIT: 'widget_init',
                WIDGET_APPEND: 'widget_append',
                WIDGET_DELETE: 'widget_delete',
                WIDGET_UPDATE: 'widget_update',
                EVENT_APPEND: 'event_append',
                EVENT_DELETE: 'event_delete',
                EVENT_UPDATE: 'event_update',
                LIFECYCLE_APPEND: 'lifecycle_append',
                LIFECYCLE_DELETE: 'lifecycle_delete',
                LIFECYCLE_UPDATE: 'lifecycle_update',
                JS_UPDATE: 'js_update',
                CSS_UPDATE: 'css_update',
                CSS_CODE_UPDATE: 'css_code_update',
                PREVIEW_FRESH: 'preview_fresh'
            },
            _STATUS: {
                COMPLETE: 'complete',
                SAVE: 'save',
                RESIZE: 'resize',
                // //PREVIEW: 'preview',
                // OVERVIEW_UPDATE: 'overview_update',
                WIDGET_CODE: 'WIDGET_CODE',
                PAGE_CODE: 'PAGE_CODE',
                CSS_FRAME: {
                    LOAD: 'CSS_FRAME_LOAD'
                },
                PREVIEW_FRAME: {
                    PREVIEW_CODE: 'preview_code',
                    FRESH:'preview_fresh'
                },
                CODE_FRAME: {
                    UPDATE: 'js_code_update',
                    LOAD: 'js_editor_load',
                },
                CONFIGURE_FRAME: {
                    CONFIG: 'config',
                    NAME: 'config_name',
                    OPTION_LOAD:'config_option_load'
                },
                CONFIGURE_DEF_FRAME: {
                    LOAD: 'configure_def_frame_load'
                },
                CUSTOM_CODE_FRAME:{
                    LOAD:'custom_code_load'
                },
                MENU_FRAME: {
                    LAYOUT_SELECT_CHANGE: 'layout_select_change'
                },
                OVERVIEW_FRAME: {
                    SHOW: 'overview_show',
                    NAME: 'overview_name',
                    ADVANCE: 'overview_advance'
                },
                CONTENT_FRAME: {
                    LOAD: 'content_load',
                    DRAG_WIDGET: 'drag_widget',
                    REVOKE: 'content_revoke',
                    SCROLL: 'content_scroll',
                },
                NAV_CONFIGURE_FRAME: {
                    LOAD: "nav_configure_load",
                    CLEAR: 'nav_configure_clear',

                },
                NAV_MENU_TREE_FRAME: {
                    FRESH: 'nav_menu_tree_fresh'
                },
                NAV_JSON_FRAME: {
                    FRESH: 'nav_json_fresh'
                },
                NAV_SQL_FRAME: {
                    FRESH: 'nav_sql_fresh'
                },
                NAV_CSV_FRAME: {
                    FRESH: 'nav_csv_fresh'
                }

            },

            //method
            updateDomID: function (oldID, newID, widgetID, autoUpdate, renameAlso) {
                var ret = false,
                    widgetInstance,
                    attr, id, widgetName,
                    accumulator;

                if ((newID += '').length) {
                    if (!widget._idMap[newID]) {
                        oldID && delete widget._idMap[oldID];
                        widget._idMap[newID] = widgetID;

                        ret = true;
                    } else if (newID.length && autoUpdate) {
                        widgetInstance = widget(widgetID);
                        id = newID.replace(/\d+$/, '');
                        accumulator = 1;

                        if (widgetInstance.length && id) {
                            attr = widgetInstance[0].data.attr;

                            while (widget._idMap[id + accumulator]) {
                                ++accumulator;
                            }
                            id += accumulator;
                            attr.id = id;

                            oldID && delete widget._idMap[oldID];

                            widget._idMap[id] = widgetID;


                            if (renameAlso) {
                                widgetName = (renameAlso === true ? attr.widgetName : renameAlso).replace(/\d+$/, '') + accumulator;

                                attr.widgetName = widgetName;

                                widgetInstance.name(widgetName);
                            }

                            //AUI.data.accumulator = ++accumulator;
                            widgetInstance.update({attr: attr});

                            ret = true;
                        }
                    } else if (widget._idMap[newID] === widgetID) {
                        ret = true;
                    }
                }

                return ret;
            },
            updateDomCustomClass: function (newClass, widgetID) {
                var ret = false,
                    widgetInstance, cssCode,
                    cssCopyCode, className,
                    accumulator;

                if (!widget._classNameMap[newClass]) {
                    widget._classNameMap[newClass] = widgetID;
                }
                if (widget._classNameMap[newClass] === widgetID) {
                    ret = true;
                } else if (newClass && widget(widgetID)) {
                    widgetInstance = widget(widgetID)[0].data;
                    cssCode = widgetInstance.css.cssCode;
                    cssCopyCode = widgetInstance.cssCopy.cssCode;
                    className = cssCode.className;
                    accumulator = 1;

                    while (widget._classNameMap[newClass + 'c' + accumulator]) {
                        ++accumulator;
                    }
                    className = className + 'c' + accumulator;
                    cssCode.className = className;
                    cssCopyCode.className = className;
                    cssCopyCode.cssCode = cssCopyCode.cssCode.replace(newClass, className);


                    widget._classNameMap[className] = widgetID;


                    ret = true;

                }

                return ret;
            },
            updateWidget: function (widgetHref, data) {
                var widgetConfig,
                    i, item, items;

                data = JSON.parse(JSON.stringify(data));

                delete data.type;
                delete data.href;
                delete data.___id;
                delete data.___s;

                if (data.api) {
                    data.href = data.href;

                    data = Bridge('WIDGET', data);

                    delete data.href;
                }

                dataModel.get("widget")({href: widgetHref}).update(data);


                widgetConfig = widget._widget[widgetHref] = dataModel.get("widget")({href: widgetHref}).first();

                items = widget.data;
                for (i in items) {
                    if (items.hasOwnProperty(i)) {
                        item = items[i];
                        if (item && item.href === widgetHref) {
                            item.widget = widgetConfig;
                        }
                    }
                }


            },

            loadChildrenWidget: function (widgetHref, callback) {
                var widgetConfig = widget._widget[widgetHref],
                    childWidgetConfig,
                    externalWidget, i, href,
                    addWidgetFuc;

                if ((externalWidget = widgetConfig.external) && (externalWidget = externalWidget.widget) && externalWidget.length) {

                    if (typeof externalWidget === 'string') {
                        externalWidget = externalWidget.split(',');
                    }
                    i = externalWidget.length;


                    addWidgetFuc = function () {
                        if (href = externalWidget[--i]) {
                            if (!(childWidgetConfig = (widget._widget[href] || dataModel.get("widget")({href: href}).first()))) {
                                external.getWidget(href, function (childWidgetConfig) {
                                    var childHref = childWidgetConfig.href;
                                    dataModel.get("widget").insert(childWidgetConfig);

                                    widget._widget[childHref] = widget.widget[childWidgetConfig.type] = dataModel.get("widget")({href: childHref}).first();

                                    widget.updateWidget(href, {isExternal: true, isNewest: true});

                                    // AUI.dependence(childWidgetConfig.deps, function () {
                                    //     app.eval(('$AW["' + childHref + '"]=$AW.' + childHref));
                                    // });

                                    addWidgetFuc();


                                }, addWidgetFuc);
                            } else {
                                if (!childWidgetConfig.isExternal) {
                                    widget.updateWidget(href, {isExternal: true, isNewest: true});

                                    // AUI.dependence(childWidgetConfig.deps, function () {
                                    //     app.eval(('$AW["' + childWidgetConfig.href + '"]=$AW.' + childWidgetConfig.href));
                                    // });
                                }
                                addWidgetFuc();
                            }
                        } else {
                            callback && callback();
                        }
                    };
                    addWidgetFuc();
                } else {
                    callback && callback();
                }
            },

            _params: function (widgetID) {
                var params = {
                    $widget: $('[data-widget-id=' + widgetID + ']'),
                    widgetID: widgetID,
                    dataCollection: dataModel.get("structure")({widgetID: widgetID}),
                    callbackList: []
                }, widgetData, widgetHref;

                params.data = params.dataCollection.first();
                params.type = params.data.type;
                params.href = params.data.href;
                params.noRender = params.data.noRender;


                if (!params.href) {
                    widgetData = dataModel.get("widget")({type: params.type}).first();
                    widgetHref = widgetData.href;
                }

                if (!(params.widget = widget._widget[params.href])) {
                    if (!widgetHref) {
                        widgetData = dataModel.get("widget")({href: params.href}).first();
                        widgetHref = widgetData.href;
                    }
                    params.widget = widget._widget[widgetHref] = widgetData;
                }

                if (params.widget && params.data) {
                    return params;
                } else {
                }
            },
            _appendChild: function (type, pWidget, dataCollection, callback, index) {

                var len, widgetCollection,
                    widgetHref, widgetTypes, list, i, belongTo,
                    widgetConfig;

                if (type.indexOf('.') !== -1) {
                    widgetHref = type;
                } else {
                    widgetCollection = dataModel.get("menu")({type: type});

                    //v4.2修复widget type重复的问题
                    //date 201703221718
                    //author    lijiancheng@agree.com.cn
                    if ((len = widgetCollection.count()) && len !== 1) {
                        widgetTypes = CONST.WIDGET.TYPE;

                        list = [widgetTypes.APP, widgetTypes.CUSTOM, widgetTypes.BANK, widgetTypes.PLATFORM];

                        for (i = -1; belongTo = list[++i];) {
                            widgetConfig = widgetCollection.filter({belongTo: belongTo}).first();
                            if (widgetConfig) {
                                widgetHref = widgetConfig.href;
                                break;
                            }
                        }
                    }

                    if (!widgetHref) {
                        widgetConfig = widgetCollection.first();
                        widgetHref = widgetConfig.href;
                    }
                }

                if (widgetHref) {

                    //如果是最新，则缓存该组件
                    if (!widget._widget[widgetHref]) {
                        widgetConfig = dataModel.get("widget")({href: widgetHref}).first();
                        if (widgetConfig && widgetConfig.isNewest) {
                            widget._widget[widgetHref] = widgetConfig;
                        }
                    } else {
                        widgetConfig = widget._widget[widgetHref];
                    }

                    if (widgetConfig && widgetConfig.isNewest) {
                        widget.loadChildrenWidget(widgetHref, function () {

                            _append(pWidget, widgetHref, dataCollection, callback, index);
                        });
                    } else {
                        external.getWidget(widgetHref, function (data) {
                            if (data) {
                                dataModel.get("widget")({href: widgetHref}).remove();
                                widgetConfig = dataModel.get("widget").insert(data).update({
                                    isNewest: true
                                }).first();
                                widget._widget[widgetHref] = widgetConfig;
                            }
                            //加入组件当中
                            widget.loadChildrenWidget(widgetHref, function () {
                                _append(pWidget, widgetHref, dataCollection, callback, index);
                            });
                        }, function () {
                            //加入组件当中
                            if (widget._widget[widgetHref] = widgetConfig) {
                                widget.loadChildrenWidget(widgetHref, function () {
                                    _append(pWidget, widgetHref, dataCollection, callback, index);
                                });
                            }
                        });
                    }
                }
            },


            /*
             *   desp    业务组件及复制组件
             *   version 4.1 build 5445
             *   author  lijiancheng@agree.com.cn
             * */
            _copy: function (copiedWidget, isSingle, saveWidget) {
                var widgetID = copiedWidget.id(), name = copiedWidget.name(), widgetConfig = copiedWidget[0].widget,
                    isPage = (widgetConfig.type === PAGE_TYPE),
                    data = dataModel.removeRedundancy(),
                    hashMap = {}, edmFilter,
                    sArr = [], ioArr = [], cIoArr = [],
                    wArr = [], wMap = {},
                    oArr = [],
                    len, item, cache = [],
                    result = isPage ? {
                        root: copiedWidget[0].data.children,
                        pID: widgetID,
                        accept: CONST.WIDGET.DEFAULT_ACCEPT
                    } : {
                        root: [widgetID],
                        pID: copiedWidget[0].data.pID,
                        accept: widgetConfig.accept
                    };

                //clone structure
                //如果固化单个组件的话，不需要将子组件复制
                if (isSingle) {
                    //console.log('ssss');
                    for (len = result.root.length; item = result.root[--len];) {
                        hashMap[item] = true;
                        sArr.push(item);
                    }
                } else {
                    for (len = result.root.length; item = result.root[--len];) {
                        sArr.push(item);
                        sArr.push.apply(sArr, widget.chain.find(item));
                    }

                    sArr = Array.from(new Set(sArr));

                    for (len = sArr.length; item = sArr[--len];) {
                        hashMap[item] = true;
                    }

                    data.structure({pType: CONST.WIDGET.TYPE.FRAME}).update({active: true});

                    data.structure().each(function (instance) {
                        if (instance.active && hashMap[instance.pID]) {
                            //hashMap[instance.widgetID] = true;
                            //sArr.push(instance.widgetID);

                            if (!wMap[instance.href]) {
                                wMap[instance.href] = true;
                                wArr.push(instance.href);
                            }

                        }
                    });

                    sArr = Array.from(new Set(sArr));
                }

                result.structure = data.structure({widgetID: sArr}).update({active: true}).get();

                //将子组件设为空
                if (isSingle && result.structure.length) {
                    result.structure[0].children = [];
                }

                if (saveWidget) {
                    result.widget = app.taffy(JSON.parse(dataModel.stringify(data.widget)))({href: wArr}).update({isNewest: false}).get();
                }

                //clone lifecycle
                result.lifecycle = data.lifecycle({widgetID: sArr}, {active: true});

                ioArr = ioArr.concat(result.lifecycle.select('lifecycleID'));
                result.lifecycle = result.lifecycle.get();


                //clone event
                result.event = data.event({widgetID: sArr}, {active: true});

                ioArr = ioArr.concat(result.event.select('eventID'));
                result.event = result.event.get();


                for (hashMap = {}, len = ioArr.length, item; item = ioArr[--len];) {
                    if (!hashMap[item]) {
                        hashMap[item] = true;
                        cIoArr.push(item);
                    }
                }


                //clone edm
                edmFilter = {active: true};
                sArr.length && (edmFilter.widgetID = sArr);
                cIoArr.length && (edmFilter.foreignID = cIoArr.concat(sArr));
                $([CONST.EDM.DIRECTION.request, CONST.EDM.DIRECTION.response]).each(function (index, direction) {

                    var edmIO = data[direction](edmFilter).get();

                    edmIO = app.taffy(JSON.parse(JSON.stringify(edmIO)));

                    result[direction] = edmIO().each(function (item) {
                        var list, uArr = [];

                        if (list = item.list) {

                            if (list.TAFFY) {
                                list = list().get();
                            }

                            list = JSON.parse(JSON.stringify(list));
                        }

                        list = app.taffy(list);

                        list({active: false})
                            .each(function (item) {
                                item.uid && uArr.push(item.uid);
                            }).remove();

                        list({pID: uArr}).remove();

                        list().order('index').each(function (item, index) {
                            list({___id: item.___id}).update({index: index});
                        });

                        item.list = list().get();

                    }).get();
                });

                //clone overview
                if (data.code) {
                    result.code = JSON.parse(JSON.stringify(data.code({foreignID: cIoArr}).get(), function (key, value) {
                        if (typeof value === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                // Circular reference found, discard key
                                return;
                            }
                            // Store value in our collection
                            cache.push(value);
                        }
                        return value;
                    }));
                }


                if (data.var) {
                    result.var = JSON.parse(JSON.stringify(data.var({belongTo: cIoArr}).get()));
                }


                return result;
            },

            _package: function (context, callback) {


                if (!AUI.savingLock) {
                    try {
                        AUI.savingLock = true;

                        var MODE = CONST.MODE,
                            DATA = CONST.DATA,
                            saveType = auiApp.mode.toUpperCase(),
                            widgetData = $AW(COMPLEX_WIDGET_ID).option(),
                            data = {}, saveStr = '', config,
                            i, item,
                            list,
                            canSave = true;


                        switch (auiApp.mode) {
                            case MODE.VIEWER:

                                list = DATA.viewerList;
                                for (i = -1; item = list[++i];) {
                                    widgetData[item] && (data[item] = widgetData[item]);
                                }

                                //为了编译保存一下widget和structure
                                config = dataModel.preSave();
                                list = DATA.saveViewerList;
                                for (i = -1; item = list[++i];) {
                                    config[item] && (data[item] = config[item]);
                                }

                                //从$AW.fresher.fresher中保存theme和variables
                                config = $AW.fresher;
                                list = DATA.saveFresherList;
                                for (i = -1; item = list[++i];) {
                                    config[item] && (data[item] = config[item]);
                                }
                                saveStr = '\n环境变量已经保存到“WebRoot”下，请将“WebRoot\\dependence\\js”下的文件提交到版本库';
                                // data.appJsCode = AUI.interfacesToCode(widgetData.appInterfaces);
                                $AW.trigger($AW._STATUS.PAGE_CODE);
                                $AW.trigger($AW.STATUS.PREVIEW_FRESH);

                                AUI.saveApiJs({
                                    save: {
                                        dependence: {
                                            deps: widgetData.deps,
                                            iconArr: widgetData.iconArr
                                        },
                                        environment: widgetData.environment
                                    },
                                    load: CONST.AWEB_JS_LOAD
                                }, true, dataModel, '', external, function () {
                                    var infoTheme, infoNsl;
                                    if (data.info) {
                                        if ((infoTheme = data.info.theme) && infoTheme !== 'default') {
                                            AUI.saveThemeWidget(infoTheme);
                                        }


                                        if ((infoNsl = data.info.nsl) && infoNsl !== 'default') {
                                            AUI.saveNslWidget(infoNsl);
                                        }
                                    }


                                });

                            case MODE.WIDGET_BUILDER:
                                list = DATA.builderList;
                                for (i = -1; item = list[++i];) {
                                    widgetData[item] && (data[item] = widgetData[item]);
                                }
                                data.frame = widget._copy(context, false, auiApp.mode === MODE.VIEWER);

                                nsl.saveTranslatorFile(data);


                                break;
                            case MODE.THEME:

                                list = DATA.themeList;
                                for (i = -1; item = list[++i];) {
                                    widgetData[item] && (data[item] = widgetData[item]);
                                }

                                //从$AW.fresher中保存theme
                                config = $AW.fresher;
                                list = DATA.saveThemeList;
                                for (i = -1; item = list[++i];) {
                                    config[item] && (data[item] = config[item]);
                                }
                                /*		data.theme = $AW.fresher.theme||{};*/
                                saveStr = '\n主题已经保存到“WebRoot”下，请将“WebRoot\\dependence\\js”下的文件提交到版本库';
                                break;
                            default:
                                canSave = false;
                                break;
                        }


                        data.index = dataModel.get('menu')({pType: data.pType}).count();

                        data[CONST.USE_VERSION] = version;
                        external.saveConfigure(data, function (response) {
                            if (response) {

                                //清除相同href的组件
                                dataModel.get('menu')({href: data.href}).remove();
                                dataModel.get('widget')({href: data.href}).remove();


                                delete data.___id;
                                delete data.___s;

                                dataModel.get('menu').insert(data);
                                dataModel.get('widget').insert(data);
                                widget.widget[data.type] = widget._widget[data.href] = dataModel.get('widget')({href: data.href}).first();


                                data.belongTo = CONST.WIDGET.TYPE.APP;
                                /*AUI.dropWidget(data);*/


                                app.alert('保存' + CONST.WIDGET.TYPE_TEXT[saveType] + '“' + (data.name || '') + '”成功' + saveStr, app.alert.SUCCESS);
                            }

                            AUI.savingLock = false;

                            callback && callback();

                        }, function () {
                            AUI.savingLock = false;

                            callback && callback();
                        });


                    } catch (e) {
                        AUI.savingLock = false;
                        throw e;
                    }
                } else {
                    app.alert('页面保存中，请稍候…', app.alert.WARNING);
                }
            },
            /*version 4.0.1 build 5232*/
            _paste: function (context, pasteBoard, frameName, notInStep, callback, isResume) {
                function resumeWidget(widget) {
                    var items,
                        i = 0,
                        len,
                        loop = function () {

                            if (dataModel.get('structure')({widgetID: items[i]}).first()) {
                                widget.append(null, function (cwidget) {
                                    resumeWidget(cwidget);
                                    if (i < len) {
                                        i++;
                                        loop();
                                    }
                                }, items[i]);
                            } else {
                                if (i < len) {
                                    i++;
                                    loop();
                                }
                            }

                        };

                    if ((items = widget[0].data.children) && (len = items.length)) {
                        loop();
                    }

                    if (callback) {
                        callback();
                        callback = null;
                    }
                }


                if (pasteBoard && pasteBoard !== true) {
                    var VAR_TYPE = OVERVIEW_VAR_TYPE,
                        // data = AUI.data,
                        widgetData = context[0].data,

                        pageModuleList = ['structure', 'event', 'lifecycle', 'code', 'var'],
                        edmIOList = ['request', 'response'],

                        tempData = {
                            structure: [],
                            event: [],
                            lifecycle: [],
                            code: []
                        },
                        edm = {
                            response: [],
                            request: []
                        },

                        idList = [],

                        oldID, newID,
                        oldIDMap = {}, newIDMap = {},
                        roots,

                        configStr = (typeof pasteBoard === 'string') ? pasteBoard : JSON.stringify(pasteBoard),
                        config = JSON.parse(configStr),
                        tempID, tempStr, currentOverviewStr, tuple,


                        overviewList, jsonString,

                        regex = CONST.REGEX,
                        URL_REGEX = regex.URL,
                        overviewURLMap,
                        OVERVIEW_URL_REGEX = regex.OVERVIEW_URL_SINGLE,

                        treeMap = {},
                        pageWidgetList,
                        ins, id,
                        i, item, items, len,
                        j, subItems, subItem,
                        k, child, children,

                        FOREIGN_WIDGET_MATCH = FOREIGN_WIDGET_REGEX.FOREIGN_WIDGET_MATCH_PASTE,
                        FOREIGN_WIDGET_SPILT = FOREIGN_WIDGET_REGEX.FOREIGN_WIDGET_SPILT_PASTE;

                    if (context.canPaste(config.accept, config.pType)) {

                        if (config.pType !== CONST.WIDGET.TYPE.VIEWER || isResume) {
                            //change structure uuid
                            app.taffy(config.structure)().each(function (item) {
                                oldID = tempID = item.widgetID;
                                newID = item.widgetID = app.getUID();
                                delete item.___id;
                                delete item.___s;

                                tempData.structure.push(item);

                                idList.unshift({oldID: oldID, newID: newID});
                                oldIDMap[oldID] = newID;
                                newIDMap[newID] = oldID;
                            });

                            //solve the children widgetID problem
                            idList.unshift({oldID: config.pID, newID: context.id()});

                            tempStr = JSON.stringify(tempData.structure);

                            for (len = idList.length; (item = idList[--len]);) {
                                tempStr = tempStr.replace(new RegExp(item.oldID, 'gi'), item.newID);
                                configStr = configStr.replace(new RegExp(item.oldID, 'gi'), item.newID);
                            }

                            tempData.structure = JSON.parse(tempStr);


                            //change event uuid
                            app.taffy(JSON.parse(configStr).event)().each(function (item) {
                                oldID = tempID = item.eventID;
                                newID = item.eventID = app.getUID();
                                item.id = dataModel.getEventAccumulator();

                                delete item.___id;
                                delete item.___s;

                                item = JSON.parse(JSON.stringify(item).replace(new RegExp(oldID, 'gi'), newID));

                                tempData.event.push(item);

                                configStr = configStr.replace(new RegExp(oldID, 'gi'), newID);

                                oldIDMap[oldID] = newID;
                                newIDMap[newID] = oldID;
                            });

                            //change lifecycle uuid
                            config = JSON.parse(configStr);
                            roots = config.root;//log the paste root widgetID
                            app.taffy(config.lifecycle)().each(function (item) {
                                oldID = tempID = item.lifecycleID;
                                newID = item.lifecycleID = app.getUID();
                                item.id = (dataModel.getEventAccumulator());

                                delete item.___id;
                                delete item.___s;

                                tempData.lifecycle.push(item);

                                configStr = configStr.replace(new RegExp(oldID, 'gi'), newID);

                                oldIDMap[oldID] = newID;
                                newIDMap[newID] = oldID;
                            });


                            //clone edm
                            tempData = JSON.stringify(tempData);
                            config = JSON.parse(configStr);//保证生命周期的ID被改过

                            idList = [];
                            $([CONST.EDM.DIRECTION.request, CONST.EDM.DIRECTION.response]).each(function (index, direction) {
                                app.taffy(config[direction])().each(function (item) {
                                    var list = item.list || [],
                                        i, len, listItem, innerItem, props,
                                        matches, id, result;

                                    if (list.length) {
                                        for (i = list.length; listItem = list[--i];) {
                                            result = false;

                                            if (listItem.id && (matches = listItem.id.match(FOREIGN_WIDGET_MATCH))) {
                                                for (len = matches.length; innerItem = matches[--len];) {
                                                    if (
                                                        (props = innerItem.match(FOREIGN_WIDGET_SPILT)) &&
                                                        (id = props[1]) &&
                                                        (tempData.indexOf(id) !== -1 || dataModel.get('structure')({widgetID: id}).first())
                                                    ) {
                                                        result = true;
                                                        break;
                                                    }
                                                }
                                            }

                                            if (!result) {
                                                listItem.id = '';
                                            }
                                        }
                                    }

                                    oldID = tempID = item.edmID;
                                    newID = item.edmID = app.getUID();


                                    delete item.___id;
                                    delete item.___s;

                                    item.list = list;

                                    edm[direction].push(item);


                                    idList.push({oldID: oldID, newID: newID});

                                    oldIDMap[oldID] = newID;
                                    newIDMap[newID] = oldID;
                                });
                            });

                            //保证referenceID跟着换
                            tempStr = JSON.stringify(edm);
                            for (len = idList.length; (item = idList[--len]);) {
                                tempStr = tempStr.replace(new RegExp(item.oldID, 'gi'), item.newID);
                                tempData = tempData.replace(new RegExp(item.oldID, 'gi'), item.newID);
                            }

                            tempData = JSON.parse(tempData);//replace last old parent and parse
                            edm = JSON.parse(tempStr);


                            if (tempStr = JSON.stringify(config.var)) {
                                idList = tempStr.match(/"[a-zA-Z0-9]{20}\-[a-zA-Z0-9]{4}"/gi);
                                if (idList && idList.length) {
                                    //去重
                                    idList = Array.from(new Set(idList));

                                    if (idList && idList.length) {
                                        for (len = idList.length; item = idList[--len];) {
                                            item = item.substr(1, item.length - 2);

                                            //假如不是新的ID
                                            if (!newIDMap[item]) {

                                                oldID = item;

                                                //加入没有替换的
                                                if (!(newID = oldIDMap[oldID])) {
                                                    oldIDMap[oldID] = newID = app.getUID();
                                                    newIDMap[newID] = oldID;
                                                }

                                                tempStr = tempStr.replace(new RegExp(oldID, 'gi'), newID);
                                            }
                                        }
                                    }
                                }
                                tempData.var = JSON.parse(tempStr);
                            }

                            if (tempStr = JSON.stringify(config.code)) {
                                idList = tempStr.match(/"[a-zA-Z0-9]{20}\-[a-zA-Z0-9]{4}"/gi);
                                if (idList && idList.length) {
                                    //去重
                                    idList = Array.from(new Set(idList));

                                    if (idList && idList.length) {
                                        for (len = idList.length; item = idList[--len];) {
                                            item = item.substr(1, item.length - 2);

                                            //假如不是新的ID
                                            if (!newIDMap[item]) {

                                                oldID = item;

                                                //加入没有替换的
                                                if (!(newID = oldIDMap[oldID])) {
                                                    oldIDMap[oldID] = newID = app.getUID();
                                                    newIDMap[newID] = oldID;
                                                }

                                                tempStr = tempStr.replace(new RegExp(oldID, 'gi'), newID);
                                            }
                                        }
                                    }
                                }
                                item = tempData.code = JSON.parse(tempStr);
                                //  currentOverviewStr = dataModel.stringify(dataModel.get('code')().get());
                                for (len = item.length; i = item[--len];) {
                                    delete i.___id;
                                    delete i.___s;

                                    // if (i.var && i.var.length) {
                                    //     for (subItems = i.var, j = subItems.length; subItem = subItems[--j];) {
                                    //         //加入变量为全局或者页面变量时，如果已经定义了，则删除，不重复定义
                                    //         if ((subItem.namespace === VAR_TYPE.DOMAIN || subItem.namespace === VAR_TYPE.SCOPE) && (~currentOverviewStr.indexOf('"' + subItem.id + '"'))) {
                                    //             subItems.splice(j, 1);
                                    //             i.varList.splice(j, 1);
                                    //         } else {
                                    //             delete subItem.___id;
                                    //             delete subItem.___s;
                                    //         }
                                    //     }
                                    // }
                                }

                                //复制URL的问题
                                if ((overviewList = tempData.code) && overviewList.length) {

                                    if ((jsonString = dataModel.stringify(overviewList)) && (items = jsonString.match(URL_REGEX)) && items.length) {

                                        //去重
                                        items = Array.from(new Set(items));

                                        if (items && items.length) {
                                            overviewURLMap = {};

                                            for (i = items.length; item = items[--i];) {
                                                overviewURLMap[item] = true;
                                            }

                                            overviewList = [].concat(overviewList);

                                            for (i = -1; i < overviewList.length;) {
                                                if (item = overviewList[++i]) {
                                                    switch (typeof item) {
                                                        case 'object':
                                                            if (item instanceof Array) {
                                                                overviewList.push.apply(overviewList, item);
                                                            } else {
                                                                for (j in item) {
                                                                    if (item.hasOwnProperty(j) && (subItem = item[j])) {
                                                                        switch (typeof subItem) {
                                                                            case 'object':
                                                                                if (j !== 'optionCopy' && j !== 'dataJSON') {
                                                                                    if (subItem instanceof Array) {
                                                                                        overviewList.push.apply(overviewList, subItem);
                                                                                    } else {
                                                                                        overviewList.push(subItem);
                                                                                    }
                                                                                }
                                                                                break;
                                                                            default:
                                                                                if (overviewURLMap[subItem]) {
                                                                                    if ((subItems = subItem.match(OVERVIEW_URL_REGEX)) && subItems.length === 2) {
                                                                                        oldID = subItems[1];

                                                                                        newID = dataModel.getEventAccumulator();

                                                                                        jsonString =
                                                                                            jsonString
                                                                                                .replace(new RegExp('":' + item.id + '(,?)', 'gi'), '":' + newID + '$1')
                                                                                                .replace(new RegExp(subItem, 'gi'), subItem.replace(oldID, newID));
                                                                                    }

                                                                                    delete overviewURLMap[subItem];
                                                                                }
                                                                                break;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            break;
                                                    }
                                                }

                                                if ($.isEmptyObject(overviewURLMap)) {
                                                    break;
                                                }
                                            }

                                            tempData.code = JSON.parse(jsonString);
                                        }
                                    }
                                }
                            } else {
                                tempData.code = config.code;
                            }

                        } else {
                            roots = config.root;
                            tempData = edm = config;
                        }

                        //drop into data model

                        for (i = -1; item = pageModuleList[++i];) {
                            tempData[item] && dataModel.get(item).insert(tempData[item]);
                        }
                        for (i = -1; item = edmIOList[++i];) {
                            edm[item] && dataModel.get(item).insert(edm[item]);
                        }

                        if (!$.isArray(roots)) {
                            roots = [roots];
                        }
                        widgetData.children = (widgetData.children || []).concat(roots);
                        context.update({children: widgetData.children});


                        for (i = -1; item = roots[++i];) {

                            // console.log(item);
                            context.append(null, resumeWidget, item);

                        }


                    } else {
                        app.alert('组件“' + context.name() + '”不接受放置剪贴板的组件类型！', app.alert.WARNING);
                        callback && callback();
                    }

                }
            },


            /*
             *  version AUI2 v4.2
             *  log  组件能否被删除
             *  author   lijiancheng@agree.com.cn
             * */
            _canRemove: function (type, pType) {
                var canRemove = true,
                    mode = CONST.MODE;

                switch (auiApp.mode) {
                    case mode.EDITOR:
                    case mode.VIEWER:
                        canRemove = type !== PAGE_TYPE;
                        break;
                    case mode.WIDGET_CREATOR:
                        canRemove = false;
                        break;
                    case mode.WIDGET_BUILDER:
                        canRemove = pType !== CONST.WIDGET.TYPE.FRAME;
                        break;
                    default:
                        canRemove = true;
                }

                return canRemove;
            },

            /*
             *   desp    配置中动态添加伪类虚拟样式
             *   version 421703
             *   author  zhanghaixian@agree.com.cn
             * */
            cssHover: (function () {
                var /*
                     *
                     * cache[style]={
                     *   name:className,
                     *   map:{
                     *       key1:true,
                     *       key2:true
                     *   }
                     *   keys:[key1,key2]
                     * }
                     *
                     *
                     * */
                    STYLE_TEMP = '<style id="awebStyleTag" type="text/css">_content_</style>',
                    STYLE_TAG_LENGTH = 31,
                    STYLE_TEMP_ID = 'awebStyleTag',
                    IN_IE = !!window.CollectGarbage,
                    WIDGTE_TIMEOUT = IN_IE ? 220 : 16,
                    PAGE_TIMEOUT = IN_IE ? 220 : 16,
                    cache = {},
                    conflictMap = {},
                    times = 0,
                    $body = $('body'),
                    $style,


                    delayHandler,
                    delayRender = function () {
                        var html, str, style;

                        if ($style) {
                            $style.remove();
                        }

                        html = [];

                        for (str in cache) {
                            if (cache.hasOwnProperty(str)) {
                                style = cache[str];

                                if (str && style) {
                                    html.push(style.keys.join(str) + str);
                                }
                            }
                        }

                        mergeStyleSheet();

                        $style = $(STYLE_TEMP.replace(/_content_/, html.join('')));

                        $style.appendTo($body);

                        if (window.aweb.log) {
                            //console.log('刷新页面%d次', ++times);
                        }
                    },
                    mergeStyleSheet = function () {
                        var style, link,
                            styleTextList = [], linkTextList = [],
                            i, content,
                            body;

                        //仅仅用于IE
                        if (IN_IE) {
                            style = document.getElementsByTagName('style');
                            link = document.getElementsByTagName('link');


                            if (style.length + link.length > STYLE_TAG_LENGTH) {
                                //把style标签中的样式存入，然后删掉该标签，但保留第一个
                                //因为由getElementsByTagName方法返回值是nodeList，所以删除时循环用倒序
                                for (i = style.length; ~--i;) {

                                    if (style.id !== STYLE_TEMP_ID) {
                                        content = style[i];
                                        styleTextList.push(content.innerHTML);
                                        content.parentNode.removeChild(content);
                                    }
                                }

                                //在IE中只有在31之内的link标签才能通过其styleSheet.cssText获取样式
                                //无法的获取复制到一个数组aCloneLink中
                                for (i = link.length; ~--i;) {
                                    content = link[i];

                                    if (content.getAttribute && content.getAttribute('rel') === 'stylesheet') {
                                        if (content.styleSheet) {
                                            styleTextList.push(content.styleSheet.cssText);
                                        } else {
                                            linkTextList.push(content.cloneNode(true));
                                        }

                                        if (i) {
                                            content.parentNode.removeChild(content);
                                        }
                                    }
                                }

                                body = $body[0];

                                //通过前面的删除，前31个link或者style标记最多只剩下2个
                                //通过重新增加link节点的方法激活其styleSheet属性，从而获取样式
                                for (i = linkTextList.length; --i;) {
                                    content = linkTextList[i];
                                    body.appendChild(content);
                                    if (content.styleSheet) {
                                        styleTextList.push(content.styleSheet.cssText);
                                    }
                                    body.removeChild(content);
                                }

                                $body.append('<style type="text/css">' + styleTextList.reverse().join('') + '</style>');

                                window.CollectGarbage();
                            }
                        }
                    };

                return function (select, $selector, content, pseudo, isBrother) {
                    if (content) {
                        setTimeout(function () {
                            var str = JSON.stringify(content || {})
                                //IE Filter first !!!
                                    .replace(/"(progid[^"]+)"/g, function (str, match) {
                                        return '__IE_FILTER__' + match.replace(/,/g, '##IEDIVIDER##') + '__IE_FILTER__"';//注意这里要多个"
                                    })
                                    //remove undefined
                                    .replace(/,[^:]+:"undefined"/g, '')
                                    .replace(/\b[^:]+:"undefined",/g, '')

                                    //replace ,"-->;
                                    .replace(/",(")?/g, '";$1')
                                    .replace(/":(\d+),/g, '":$1;')
                                    .replace(/"/g, '')

                                    //resume
                                    .replace(/__IE_FILTER__[^_]+__IE_FILTER__/g, function (str, match) {
                                        return str
                                            .replace('__IE_FILTER__', '')
                                            .replace(/##IEDIVIDER##/, 'g')
                                            .replace('__IE_FILTER__', '');

                                    }),
                                style, className,
                                key;

                            if (str !== '{}') {
                                if (!(style = cache[str])) {
                                    style = cache[str] = {
                                        name: 'aw-' + app.getUID().substr(0, 16),
                                        map: {},
                                        keys: []
                                    }
                                }
                                className = style.name;
                                key = '.' + className + (isBrother ? '' : ' ') + select + pseudo;


                                if (!conflictMap[key]) {
                                    conflictMap[key] = str;
                                } else if (conflictMap[key] !== str) {
                                    className = 'aw-' + app.getUID().substr(0, 16);
                                    key = '.' + className + (isBrother ? '' : ' ') + select + pseudo;

                                    conflictMap[key] = str;
                                }


                                $selector.addClass(className);

                                if (!style.map[key]) {
                                    style.map[key] = true;
                                    style.keys.push(key);

                                    clearTimeout(delayHandler);
                                    delayHandler = setTimeout(delayRender, PAGE_TIMEOUT);
                                }
                            }
                        }, WIDGTE_TIMEOUT);
                    }
                };
            }()),


            setLanguage: function (lang, refresh) {
                // this.language = lang;
                app.setData('language',lang);
               // sessionStorage.setItem('language', lang);
                if (refresh) {
                    /* widget(AUI.data.uuid).refresh(true, undefined, undefined, {
                     type: CONST.WIDGET.EVENT_TYPE.SIZE_CHANGE,
                     capture: true,
                     bubble: false
                     });*/
                    widget.trigger(widget.STATUS.WIDGET_UPDATE, widget(dataModel.get('uuid')))
                }
            },

            getLanguage: function () {
                return (this.language =app.getData('language') || app.queryString('language') || navigator.language);
            },

            nsl: function (newStr, id, auiCtx, lang) {

                var widgetNSL, pageNSL, globalNSL, result = false, language, str;

                if (aweb.translate && !!(str = newStr + '')) {

                    switch (arguments.length) {

                        case 1://如果传入一个参数，默认拿全局国际化
                            language = this.getLanguage();

                            if (!isLanguageDeleted(language) && (globalNSL = dataModel.get('nslList')) && globalNSL.length) {
                                result = getTranslatorResult(str, globalNSL, language);
                            }
                            break;

                        default://默认传入三个参数，第四个可选
                            language = lang || this.getLanguage();

                            if (isLanguageDeleted(language)) {
                                return result || str;
                            }

                            if ((widgetNSL = auiCtx.widgetNSL) && (widgetNSL = widgetNSL[id]) && widgetNSL.length) {
                                result = getTranslatorResult(str, widgetNSL, language);
                            }

                            if (result === false && (pageNSL = auiCtx.pageNSL) && pageNSL.length) {
                                result = getTranslatorResult(str, pageNSL, language);
                            }

                            if (result === false && (globalNSL = dataModel.get('nslList')) && globalNSL.length) {
                                result = getTranslatorResult(str, globalNSL, language);
                            }

                            break;
                    }
                }
                return result || newStr;

            },

            /*
             *   desp    加上主题配置后的样式合并
             *   version 421703
             *   author  zhanghaixian@agree.com.cn
             * */
            css: (function () {
                var delEmptyObj = function (obj) {
                    return obj ? JSON.parse(JSON.stringify(obj).replace(/"[^"]+":"",?/g, '').replace(/,}/g, '}')) : {};
                };

                return function (href, css) {
                    var level,
                        level1, level2,
                        level3 = css && css.style || {},
                        themes = css && css.theme || '',
                        themeName = [], variables,
                        themeData,
                        newCss = {
                            cssCode: css && css.cssCode && css.cssCode,
                            style: {},
                            theme: css && css.theme
                        },
                        theme, index, item, value;

                    if ($AW.fresher) {
                        variables = $AW.fresher.variablesCopy || {};
                        themeData = !$.isEmptyObject($AW.fresher.theme) && $AW.fresher.theme[href] || {};
                    }
                    if (themeData) {
                        level1 = themeData._default;

                        if (themeData.css && !$.isEmptyObject(themeData.css.theme)) {
                            for (index = -1, theme = themeData.css.theme; item = theme[++index];) {
                                value = item.name;
                                if (themes && themes[value] !== "") {
                                    themeName.push(themes[value]);
                                }
                            }
                            // $.each(themeData.css.theme, function (index, item) {
                            //
                            // });

                            level2 = themeData[themeName.join(" ")];
                        }
                    }
                    level1 = delEmptyObj(level1, 1);
                    level2 = delEmptyObj(level2, 2);
                    level3 = delEmptyObj(level3, 3);

                    level = JSON.stringify($.extend(true, {}, level1, level2, level3));

                    level = level.replace(/@[^"]+/g, function (key) {
                        return variables[key];
                    });


                    if (aweb.fresher) {
                        newCss.style = JSON.parse(level);
                    } else {
                        newCss.style = {};
                    }

                    return newCss;
                }
            }()),

            on: function () {

                var event = getEvent;
                event.on.apply(event, arguments);
                return this;
            },

            off: function () {

                var event = getEvent;
                event.off.apply(event, arguments);

                return this;
            },

            trigger: function () {
                var event = getEvent;

                event.trigger.apply(event, arguments);
                return this;
            },

            //data
            data: {},
            widget: {},//by type
            _widget: {},//by href
            _css: {},
            _classNameMap: {},//css custom style className cache
            _hover: {},//css hover cache
            _idMap: {},

            chain: new Chain(),

            //event
            EVENT_HANDLER: CONST.EVENT.HANDLER,
            EVENT_DEPENDENCE: CONST.EVENT.DEPENDENCE,
            EVENT_ORDER: CONST.EVENT.ORDER,

            AJAX_TYPE: {
                POST: 'POST',
                GET: 'GET'
            },
            VALIDATE_CONTINUE: {
                FULL: '',
                SINGLE: 'single'
            },
            ERROR_CALLBACK: {
                DEFAULT: '',
                CUSTOM: 'custom',
                ALERT: 'alert',
                FOCUS: 'focus',
                FOCUS_AND_ALERT: 'focusAndAlert'
            },

            SPA_ACTION: {
                LOAD: 'load',
                UNLOAD: 'unload',
                PAUSE: 'pause',
                RESUME: 'resume'
            },
            PAGE_ACTION: {
                INIT: 'init',
                INTERVAL: 'interval'
            },
            CODE: CONST.LIFECYCLE.CODE,

            //library
            viewer: {},
            fresher: {
                timeout: 100
            },
            page: {},
            mainPanel: {},
            layout: {},
            ctn: {},
            custom: {},
            component: {},
            frame: {},
            package: {},
            mobile: {},
            monitor:{}
        });

        widget.self = widget;

        widget.fn = widget.prototype = {
            //属性
            constructor: widget,
            length: 0,
            version: AUI.awosAppUnitedVersion,
            language: '',

            //构造器
            init: function (widgetID, params) {
                var ret = widgetID ? this : widgetID,
                    widgetConfig, widgetHref;
                if (params) {
                    this._push(params);

                    widget.data[widgetID] = this[0];


                    ret = this;
                } else {
                    if (typeof widgetID === 'string') {

                        if (!widget.data[widgetID]) {//第一次

                            if ((widget.data[widgetID] = widget._params(widgetID)) && widget.data[widgetID].widget) {

                            }

                        } else if (!widget.data[widgetID].widget) {//有缓存 但组件为空
                            params = widget.data[widgetID];

                            if (!params.href) {
                                widgetConfig = dataModel.get('widget')({type: params.type}).first();
                                widgetHref = widgetConfig.href;
                            }

                            if (!(params.widget = widget._widget[params.href])) {
                                if (!widgetHref) {
                                    widgetConfig = dataModel.get('widget')({href: params.href}).first();
                                    widgetHref = widgetConfig.href;
                                }
                                params.widget = widget._widget[widgetHref] = widgetConfig;
                            }
                        }

                        if (widget.data[widgetID] && widget.data[widgetID].widget) {
                            this._push(widget.data[widgetID]);
                        }

                        ret = this;
                    } else {
                        params = widgetID;

                        if (params && params.widgetID && widget.data[params.widgetID] === params) {
                            this._push(params);
                            ret = this;
                        } else {
                            ret = params;
                        }
                    }
                }

                return ret;
            },

            //设置类
            updateWidget: function (data) {
                if (data) {
                    var hadUpdate = {};


                    //lijiancheng@agree.com.cn
                    //修复直接引用this.widget时，update返回为false的问题
                    if (data.type || data.href || data.___s || data.___id) {
                        data = $.extend(true, {}, data);

                        delete data.type;
                        delete data.href;
                        delete data.___id;
                        delete data.___s;
                    }

                    this.each(function () {
                        var widgetConfig,
                            widgetHref = this.href || this.data.href || widget.widget[this.type].href,
                            i, item, items;

                        if (!hadUpdate[widgetHref]) {
                            widget.updateWidget(widgetHref, data);

                            hadUpdate[widgetHref] = true;
                        }
                    });
                }
                return this;
            },
            update: function (data) {
                data && this.each(function () {
                    this.data = this.dataCollection.update(data).first();
                });
                return this;
            },

            //配置类
            /*
             * update log：保证this.widget不为false，禁止修改组件的type、href、___id、___s等的键值
             * update version：4.2.5 build 7192
             * date:2017-4-18
             * author：lijiancheng@agree.com.cn
             * */
            attr: function (key, value) {
                if (this.length) {
                    if (key && typeof key === 'object') {
                        this.each(function () {
                            var oWidget = widget(this.widgetID),
                                oldID;


                            if (key.id) {
                                oldID = this.data.attr.id;

                                oWidget.update({attr: $.extend(true, this.data.attr, key)});

                                widget.updateDomID(oldID, key.id, this.widgetID, true, key.widgetName);
                            } else {
                                oWidget.update({attr: $.extend(true, this.data.attr, key)});
                            }

                            if (key.widgetName) {
                                oWidget.name(this.data.attr.widgetName);
                            }
                            app.performance.shortDelay(function () {
                                widget.trigger(widget.STATUS.WIDGET_UPDATE, oWidget);
                            });

                        });
                        return this;
                    } else if (value !== undefined) {
                        this.each(function () {
                            var attr = this.data.attr,
                                elem = widget(this.widgetID);

                            if (key === 'id') {
                                widget.updateDomID(this.data.attr.id, key.id, this.widgetID, true, false);
                            } else {
                                attr[key] = value;

                                elem.update({attr: attr});

                                if (key === 'widgetName') {
                                    elem.name(value);
                                }
                            }
                            app.performance.shortDelay(function () {
                                widget.trigger(widget.STATUS.WIDGET_UPDATE, elem);
                            });


                        });


                        return this;
                    } else {
                        return key ? this[0].data.attr[key] : this[0].data.attr;
                    }
                }
            },
            option: function (obj, isTrigger) {
                var newOption, newOptionCopy, oWidget, _this = this;

                if (obj && typeof obj === 'object') {
                    this.each(function (index, elem) {
                        //获得属性
                        oWidget = widget(elem.widgetID);

                        if (oWidget.length) {
                            newOption = JSON.parse(JSON.stringify(obj));
                            newOptionCopy = base.baseConfigInitInstance($.extend(true, {}, obj), elem.widget.option, {widgetID: oWidget[0].widgetID});

                            //更新structure和页面
                            oWidget.update({option: newOption, optionCopy: newOptionCopy});

                        }
                    });

                    if (isTrigger) {
                        app.performance.shortDelay(function () {
                            widget.trigger(widget.STATUS.WIDGET_UPDATE, _this);
                        });
                    }

                    return this;
                } else {
                    if (this.length) {
                        return $.extend(true, {}, this[0].data.option);
                    } else {
                        return {};
                    }
                }
            },
            nsl: function (newNSL, lang) {
                var $nslContext = $(CONST.PAGE.CONFIGURE_FRAME.NSL.CTN),
                    language,
                    widgetNSL, pageNSL, globalNSL, str,
                    widgetStructure, pageStructure,
                    result = false, widgetID;

                /* if (newNSL||newNSL === '') {*/

                if (Array.isArray(newNSL)) {
                    this.each(function (index, elem) {
                        //获得属性
                        var newConfig, oWidget,

                            oWidget = widget(elem.widgetID);
                        if (oWidget.length) {
                            newConfig = JSON.parse(JSON.stringify(newNSL));

                            //更新structure和页面
                            oWidget.update({nsl: newConfig});

                            elem = oWidget[0];

                            oWidget.refresh(true, undefined, undefined, {
                                type: CONST.WIDGET.EVENT_TYPE.VALUE_CHANGE,
                                from: 'widget.fn.nsl'
                            });

                            //更新配置窗口
                            if (AUI.configLock && AUI.currentWidgetID === elem.widgetID) {
                                nslUtil.translatorConfig($nslContext, oWidget);
                            }

                        } else {
                            console.debug();
                        }

                    });
                    return this;

                } else if (typeof newNSL === 'string' || typeof newNSL === 'number') {//如果是翻译的字符串

                    if (aweb.translate && (str = newNSL + '')) {

                        language = lang || widget.getLanguage();

                        if (isLanguageDeleted(language)) {
                            return result || newNSL
                        }

                        widgetID = this[0].widgetID;

                        //匹配组件
                        widgetStructure = widget.data[widgetID].data;

                        if (widgetStructure && (widgetNSL = widgetStructure.nsl) && widgetNSL.length) {
                            result = getTranslatorResult(str, widgetNSL, language);
                        }

                        //找不到匹配结果，匹配页面
                        if (result === false && (pageStructure = widget.data[dataModel.get('uuid')].data) && (pageNSL = pageStructure.nsl) && pageNSL.length) {
                            result = getTranslatorResult(str, pageNSL, language);
                        }

                        //找不到匹配结果，匹配全局
                        if (result === false && (globalNSL = dataModel.get('nslList')) && globalNSL.length) {
                            result = getTranslatorResult(str, globalNSL, language);
                        }
                    }

                    return result || newNSL;
                } else {
                    if (this.length && this[0].data.nsl) {
                        return JSON.parse(JSON.stringify(this[0].data.nsl));
                    } else {
                        return [];
                    }
                }
            },

            //便捷属性操作
            name: function (name) {
                var _this = this;

                if (this.length) {
                    if (name) {
                        this.each(function () {

                            var oWidget = widget(this.widgetID);

                            this.data.attr.widgetName = name;

                            oWidget.update({attr: this.data.attr});


                        });
                    } else {
                        return this[0].data.attr.widgetName;
                    }
                } else {
                    return undefined;
                }

                return this;
            },
            id: function () {
                return this.length ? this[0].widgetID : undefined;
            },
            type: function () {

                return this[0] && this[0].widget.type;
            },
            href: function () {
                return this[0] && this[0].widget.href;
            },

            inDom: function () {
                if (this[0] && this[0].data.noRender) {
                    return false;
                } else {
                    return true;
                }
            },

            typeName: function () {
                return this[0] && this[0].widget.name;
            },


            css: function (obj, noRefresh) {
                var $baseContext = $(CONST.PAGE.CONFIGURE_FRAME.OPTION.CTN),
                    newCss, oWidget;
                console.log($baseContext);
                if (obj && typeof obj === 'object') {
                    this.each(function (index, elem) {
                        //获得属性
                        oWidget = widget(elem.widgetID);

                        if (oWidget.length) {
                            newCss = $.extend(true, {}, obj);

                            //更新structure和页面
                            oWidget.update({css: newCss});

                            elem = oWidget[0];


                            if (!noRefresh) {
                                oWidget.refresh(true, undefined, undefined, {
                                    type: CONST.WIDGET.EVENT_TYPE.VALUE_CHANGE,
                                    from: 'widget.fn.css'
                                });
                            }

                            //更新配置窗口
                            if (AUI.configLock && AUI.currentWidgetID === elem.widgetID) {
                                cssUtil.cssConfigure($baseContext, oWidget);
                            }

                        } else {
                            console.debug();

                        }
                    });
                    return this;
                } else {
                    // $selector = this[0].$widget.children(':last');
                    return this.length ? widget.css(this[0].href, this[0].data.css) : {};
                }
            },
            edm: function (key, value) {
                var ret;

                if (this.length) {
                    if (key && typeof key === 'object') {
                        this.each(function () {
                            var oWidget = widget(this.widgetID);
                            oWidget.update({edm: $.extend(true, this.data.edm, key)});

                            key.widgetName && oWidget.name(key.widgetName);
                        });
                        ret = this;
                    } else if (value !== undefined) {
                        this.each(function () {
                            var edm = this.data.edm || {},
                                elem = widget(this.widgetID);
                            edm[key] = value;

                            elem.update({edm: edm});
                        });

                        ret = this;
                    } else {
                        ret = this[0].data.edm || {};
                        ret = key ? ret[key] : ret;
                    }
                }

                return ret;
            },

            /*
             *   log     获取子组件的模板
             *   date    2017-07-13
             *   author  lijiancheng@agree.com.cn
             *   version AWOS 4.2.22.3
             * */
            external: function () {
                var ret = {},
                    childWidget;

                if (this.length && ((childWidget = this[0].widget) && (childWidget = childWidget.external) && (childWidget = childWidget.widget) && childWidget.length)) {
                    if (typeof childWidget === 'string') {
                        childWidget = childWidget.split(',');
                    }

                    childWidget.map(function (href) {
                        var widgetConfig = widget._widget[href];
                        ret[href] = {
                            template: widgetConfig && widgetConfig.template || ''
                        };
                    });
                }

                return ret;
            },

            //配置操作类
            change: function () {
                return this;
            },
            display: function (isInline) {
                if (isInline) {
                    this.each(function () {
                        // this.$widget.addClass('aui-widget-inline');
                    });
                } else {
                    this.each(function () {
                        //   this.$widget.removeClass('aui-widget-inline');
                    });
                }
                return this;
            },
            config: function () {
                var widgetID;
                if (this.length) {
                    widgetID = this[0].widgetID;
                    widget.trigger(widget._STATUS.CONFIGURE_FRAME.CONFIG, widgetID,true);
                    AUI.currentWidgetID = widgetID;
                    // if (widgetID !== AUI.currentWidgetID) {
                    //
                    // }
                }

                return this;
            },
            /*
             * create log：增加重新调用组件config回调函数
             * update version：4.2 build 6155
             * date:2016-12-06 13:53:00
             * author：lijiancheng@agree.com.cn
             *
             *
             *
             * update log: 统一将AUI.resumeCssCong和AUI.resumeBaseConfig 到接口接口当中
             * update version:4.2 build 6266
             * */
            refresh: function () {
                return this;
            },

            //动作类
            //添加子组件
            prepend: function (type, callback) {
                /*
                 *  method:type[,callback]
                 * */

                if (this.length && type) {
                    widget._appendChild(type, this, undefined, callback, widget.FIRST);
                }

                return this;
            },
            append: function (type, callback, isResume) {
                /*
                 *  method1:type[,callback]
                 *  method2:null,callback,widgetID
                 * */


                var dataCollection, data;

                if (this.length && (type || isResume)) {

                    if (isResume) {

                        dataCollection = dataModel.get('structure')({widgetID: isResume});

                        data = dataCollection.first();
                        if (data) {
                            data.pID = this.id();
                            type = data.href || data.type;
                        }

                    }

                    if (type) {
                        widget._appendChild(type, this, dataCollection, callback, widget.LAST);
                    }
                }


                return this;
            },

            //添加同辈
            before: function (type, callback) {
                var index, w;
                this.each(function () {
                    w = widget(this.widgetID);
                    index = w.index();

                    if (index !== -1) {
                        widget._appendChild(type, w.parent(), undefined, callback, index);
                    }
                });

                return this;
            },
            after: function (type, callback) {
                var index, w;
                this.each(function () {
                    w = widget(this.widgetID);
                    index = w.index();

                    if (index !== -1) {
                        widget._appendChild(type, w.parent(), undefined, callback, index + 1 === w.parent().children().length ? widget.LAST : index + 1);
                    }
                });

                return this;
            },
            //移除
            empty: function () {
                this.children().destroy();

                return this;
            },
            close: function () {

                if (this.deletable()) {
                    this.parent().config();
                    this.destroy();
                    cssUtil.cleanCssCode(this);
                } else {

                    app.alert('"' + this.name() + '"不能直接删除，请在"' + (this.parent().name() || "") + '"配置下删除', app.alert.WARNING);
                }
                return this;
            },
            destroy: function () {
                var cache = [],
                    taffyList = TAFFY_LIST,
                    chainReplacementTemp = '(?:,"_widgetID_":{[^}]+})|(?:"_widgetID_":{[^}]+},)|(?:"_widgetID_",)|(?:"_widgetID_")|(?:,"_widgetID_")|(?:,"[^"]+":{"parent":"_widgetID_"[^}]+})|(?:"[^"]+":{"parent":"_widgetID_"[^}]+},)',
                    widgetList = [];


                if (this.length) {
                    this.each(function () {
                        var widgetID = this.widgetID,
                            id,
                            pWidget, pChildren,
                            i, item, subset;

                        if (widgetID) {
                            cache.push(this);

                            id = this.data.attr.id;

                            //删除链
                            widgetList.push(widgetID);

                            // if (widget.chain[widgetID]) {
                            if ((subset = widget.chain.find(widgetID)) && subset.length) {
                                widgetList = widgetList.concat(subset);
                            }

                            //删除ID
                            delete widget._idMap[id];


                            //删除父子连接
                            pWidget = widget(this.data.pID);
                            if (pWidget.length) {
                                pChildren = pWidget[0].data.children;

                                for (i = pChildren.length; item = pChildren[--i];) {
                                    if (item === widgetID) {
                                        pChildren.splice(i, 1);
                                        pWidget.update({children: pChildren});
                                        break;
                                    }
                                }

                                // pWidget
                                //     .blur()
                                //     .refresh(true, undefined, false, {
                                //         type: CONST.WIDGET.EVENT_TYPE.SIZE_CHANGE,
                                //         capture: true,
                                //         bubble: true
                                //     });
                            }
                        }
                    });
                }


                widgetList.map(function (widgetID) {

                    //删除数据缓存
                    delete widget.data[widgetID];
                    widget.chain.remove(widgetID);


                });

                //删除结构中的数据
                taffyList.map(function (elem) {
                    var data = dataModel.get(elem);

                    if (data && data.TAFFY) {
                        data({widgetID: widgetList}).remove();
                    }
                });

                widget.trigger(widget.STATUS.WIDGET_DELETE, this);

                return this;
            },
            //复制
            /*version 4.0.1 build 5232*/
            copy: function (isCut) {
                var widgetID = this.id();

                external.copyWidget(widget._copy(this), function () {
                    isCut && widget(widgetID).close(true);
                });

                return this;
            },
            //剪切
            cut: function () {
                this.copy(true);
            },
            /*version 4.0.1 build 5232*/
            /*
             *
             * log 加入编辑固化组件的功能，但paste必须只能使用一次
             * version 4.1.1 build 5580
             * */
            paste: function (href, frameName, notInStep, callback) {
                if (this.length && this.droppable()) {
                    var context = this,
                        data;

                    if (href) {//页面片段
                        data = widget._widget[href];

                        if (data) {
                            widget._paste(context, data.frame, frameName, notInStep);
                        } else {
                            external.getWidget(href, function (data) {
                                if (data) {
                                    if (data.frame) {
                                        delete data.frame.___id;
                                        delete data.frame.___s;


                                        dataModel.get('widget').insert(data);
                                        widget._widget[href] = dataModel.get('widget')({href: href}).first();

                                        widget._paste(context, data.frame, frameName, notInStep, callback);
                                    }
                                }
                            });
                        }
                    } else {
                        external.pasteWidget(function (pasteBoard) {
                            widget._paste(context, pasteBoard, frameName, notInStep, callback);
                        });
                    }
                }

                return this;
            },

            //页面片段
            /*
             *  verison 4.1 build 5442
             *  log:新增页面片段功能
             *  author:lijiancheng@agree.com.cn
             * */
            frame: function (callback) {
                widget._package(this, callback);

                return this;
            },

            //sizzle
            eq: function (index) {
                return this[index] && this[index].widgetID ? widget(this[index].widgetID) : widget();
            },
            first: function () {
                return this.eq(0);
            },
            last: function () {
                return this.eq(this.length - 1);
            },
            get: function (index) {
                return this[index || 0];
            },

            //FIXME 加入更多的筛选功能
            filter: function (filter) {
                /*
                 * example
                 *       filter='divCtn'
                 *       filter='divCtn:first|:last|:active|:hide'
                 *       filter='divCtn:eq(1)'
                 *       filter=':eq(1)'
                 *       filter=':gt(1)'
                 *       filter=':lt(1)'
                 *       filter=':first'
                 *       filter=':last'
                 *       filter=':hide'
                 *
                 * */
                var ret,
                    i, len,
                    filters = filter && filter.split(':') || [],
                    type = filters[0],
                    _filter = filters[1],
                    index;

                ret = widget();
                if (type) {
                    for (i = -1, len = this.length; ++i < len;) {
                        if (type === this[i].type) {
                            ret._push(this[i]);
                        }
                    }
                } else {
                    for (i = -1, len = this.length; ++i < len;) {
                        ret._push(this[i]);
                    }
                }

                for (i = 0; _filter = filters[++i];) {
                    if (index = _filter.match(/(?:^eq\((\d+)\)$)/)) {
                        try {
                            index = parseInt(index[1], 10);
                            ret = ret.eq(index);
                        } catch (e) {
                            ret._splice(0, ret.length);
                        }
                    } else if (index = _filter.match(/(?:^gt\((\d+)\)$)/)) {
                        try {
                            index = parseInt(index[1], 10) + 1;
                            ret._splice(0, index);
                        } catch (e) {
                            ret._splice(0, ret.length);
                        }
                    } else if (index = _filter.match(/(?:^lt\((\d+)\)$)/)) {
                        try {
                            index = parseInt(index[1], 10);
                            ret._splice(index, ret.length);
                        } catch (e) {
                            ret._splice(0, ret.length);
                        }
                    } else {
                        switch (_filter) {
                            case 'first':
                                ret._splice(1, ret.length);
                                break;
                            case 'last':
                                ret._splice(0, ret.length - 1);
                                break;
                            case 'active':
                                for (len = ret.length; --len > -1;) {
                                    if (ret[len].data.active !== true) {
                                        ret._splice(len, 1);
                                    }
                                }
                                break;
                            case 'hide':
                                for (len = ret.length; --len > -1;) {
                                    if (ret[len].data.active !== 'hide') {
                                        ret._splice(len, 1);
                                    }
                                }
                                break;

                        }
                    }
                }

                return ret;
            },
            parent: function () {
                return this.length ? widget(this[0].data.pID) : widget();
            },
            closest: function (type) {
                var w = this;

                while (w.length && w[0].type !== type) {
                    w = w.parent();
                }

                return w;
            },
            children: function (filter) {
                var ret = widget(),
                    cWidgetID, cWidget,
                    children, i;

                this.each(function () {
                    if ((children = this.data.children) && children.length) {
                        for (i = -1; cWidgetID = children[++i];) {
                            cWidget = widget.data[cWidgetID] || (widget.data[cWidgetID] = widget._params(cWidgetID));

                            cWidget && ret._push(cWidget);
                        }
                    }
                });

                return ret.filter(filter);
            },
            find: function (filter) {
                var ret = widget(),
                    subset, i,
                    subWidget, subWidgetID;

                this.each(function (index, elem) {
                    if (elem.widgetID && (subset = widget.chain.find(elem.widgetID)) && !$.isEmptyObject(subset)) {
                        for (i = -1; subWidgetID = subset[++i];) {
                            subWidget = widget.data[subWidgetID] || (widget.data[subWidgetID] = widget._params(subWidgetID));

                            subWidget && ret._push(subWidget);
                        }
                    }
                });

                return ret.filter(filter);
            },

            prev: function () {
                return this.parent().children(':eq(' + (this.index() - 1) + ')');
            },
            next: function () {
                return this.parent().children(':eq(' + (this.index() + 1) + ')');
            },
            siblings: function (filter) {
                return this.parent().children(filter);
            },

            //枚举
            index: function (index) {
                var pWidget,
                    widgetID,
                    children, len, i;

                if ($.isNumeric(index)) {
                    if (this.length && this.length > index) {
                        return widget(this[index].widgetID, this[index]);
                    }
                } else {
                    if ((pWidget = this.parent()).length) {
                        widgetID = this[0].widgetID;
                        for (children = pWidget[0].data.children, len = children.length, i = 0; i < len; ++i) {
                            if (widgetID === children[i]) {
                                return i;
                            }
                        }
                    }

                    return -1;
                }
            },
            each: function (callback) {
                for (var i = -1, item; item = this[++i];) {
                    callback.call(item, i, item);
                }

                return this;
            },

            //judgement
            is: function (type) {
                return this.length && this[0].type === type;
            },
            canPaste: function (acceptType, parentType) {
                var accept, widget;

                if (auiApp.mode === CONST.MODE.THEME) {
                    return true;
                } else if (this.length
                    && (auiApp.mode in CONST.MODE.RECOMBINATION)
                    && this[0].type === PAGE_TYPE) {
                    return true;
                } else if (this.acceptable() && acceptType) {
                    widget = this[0].widget;
                    accept = widget.base ? new RegExp('\\b(?:' + widget.type + '|' + widget.base.replace(/ /g, '|') + ')\\b') : new RegExp('\\b' + widget.type + '\\b');

                    return accept.test(acceptType);
                } else {
                    //debugger;
                    return false;
                }
            },
            /*
             *  desp:    组件是否可以接纳子组件
             *  version： AUI2 4.2 build 6369
             *  author：  lijiancheng@agree.com.cn
             * */
            accept: function (enable) {
                var _this = this;
                if (enable) {
                    this.update({acceptable: true});

                    this.find(':hide').show();

                    this.each(function () {
                        //this.$widget.removeClass('aui-widget-unacceptable');
                    });
                } else {
                    this.update({acceptable: false});

                    this.find(':active').hide();

                    this.each(function () {
                        // this.$widget.addClass('aui-widget-unacceptable');
                    });
                }
                app.performance.shortDelay(function () {
                    widget.trigger(widget.STATUS.WIDGET_UPDATE, _this);
                });

                return this;
            },
            acceptable: function () {
                return this.length && (this[0].data.acceptable !== false);
            },
            /*
             *   version AUI2 v4.2
             *   log     是否可以通过拖拽放置
             *   author  lijiancheng@agree.com.cn
             *
             *   params  @enable boolean
             * */
            drag: function (enable) {
                if (enable) {
                    this.update({draggable: true});
                } else {
                    this.update({draggable: false});
                }

                return this;
            },

            draggable: function () {
                return this.length && (this[0].data.draggable !== false);
            },

            drop: function (enable) {
                if (enable) {
                    this.update({droppable: true});
                } else {
                    this.update({droppable: false});
                }

                return this;
            },
            droppable: function () {
                return this.length && (this[0].data.droppable !== false);
            },
            /*
             *   log 是否可以通过界面删除
             *   version AUI2 v4.2
             *   author  lijianchneg@agree.com.cn
             *
             * */
            del: function (enable) {
                if (enable) {
                    this.update({deletable: true});
                } else {
                    this.update({deletable: false});
                }

                return this;
            },
            deletable: function () {
                var data = this[0].data;
                return this.length && (data.deletable !== false) && (data.widgetID !== dataModel.get('uuid')) && (data.href.slice(0, 6) !== 'viewer');
            },

            /*
             *  desp:    组件隐藏hide 与组件关闭close remove不同 hide在页面awb文件还存在的
             *  version： AUI2 4.2 build 6369
             *  author：  lijiancheng@agree.com.cn
             * */
            hide: function () {
                var cache = [];

                this.each(function () {
                    if (this.type && widget._canRemove(this.type, this.widget.pType)) {
                        var fWidget = widget(this.widgetID);

                        cache.push(this);


                        fWidget.blur();
                        fWidget.update({active: 'hide'});


                        //关闭组件时，当组件或子集在配置时，关闭配置窗口
                        if (AUI.currentWidgetID === this.widgetID || widget.chain.find(this.widgetID).includes(AUI.currentWidgetID)) {
                            AUI.configure.close();
                        }

                    }
                });


                return this;
            },
            /*
             *  desp:    组件显示 与组件关闭resume 不同 show是hide的逆操作
             *  version： AUI2 4.2 build 6369
             *  author：  lijiancheng@agree.com.cn
             * */
            show: function () {
                var cache = [];

                this.each(function () {


                    var fWidget = widget(this.widgetID);


                });
                this.update({active: true});


                return this;
            },


            //listener
            //fixme 添加命名空间的功能
            /*
             *   version 4.2
             *   desp    4.2新增 删除原on、delegateEvent、undelegateEvents
             *           对事件绑定进行代码化
             *   author  lijiancheng@agree.com.cn
             *   params:
             *              @option              Object      其他数据
             *              {
             *                @desp               String      事件描述
             *                @type               String      触发条件
             *                @selector           String      触发范围
             *                @handler            CONST      触发事件     $AW.EVENT_HANDLER |Code
             *                                                Code:
             *                                                        deps:ajax && order:api
             *                                                            ##_WID_VAR##.apiName(##_AJAX_OPTION##,auiCtx.namespace.orderParams)
             *                                                        deps:ajax  && order:''
             *                                                            ##_WID_VAR##.apiName(##_RESPONSE_DATA##)
             *                                                        deps:''     && order:''
             *                                                            ##_WID_VAR##.apiName(##_EVENT##)
             *                 deps             CONST       依赖              $AW.EVENT_DEPENDENCE
             *                 order            CONST       执行顺序          $AW.EVENT_ORDER
             *
             *                 //deps===$AW.EVENT_DEPENDENCE.AJAX
             *                 requestID        EdmID       引用的传输数据字段ID
             *                 responseID       EdmID       引用的返回数据字段ID
             *                 //validate
             *                 ajaxType              CONST       传输方式                 $AW.AJAX_TYPE                  defaultValue=$AW.AJAX_TYPE.POST
             *                 validate              BOOLEAN     是否进行数据校验          true|false                     defaultValue=true
             *                 validateContinue      CONST       校验是否继续             $AW.VALIDATE_CONTINUE          defaultValue=$AW.VALIDATE_CONTINUE.SINGLE
             *                 validateErrorCallback CONST       校验失败回调             $AW.ERROR_CALLBACK             defaultValue=$AW.ERROR_CALLBACK.DEFAULT
             *
             *
             *                 //handler===$AW.EVENT_HANDLER.MODAL|SUB
             *                 width            Number      modal width
             *                 widthUnit        CONST=px|%  modal width unit
             *                 height           Number      modal height
             *                 heightUnit        CONST=px|%  modal height unit
             *
             *
             *                 //handler===$AW.EVENT_HANDLER.MODAL
             *                 modal       @String      widgetID
             *              }
             *
             * */
            on: function (option) {

                if (this.length && option && option.type) {
                    this.each(function () {
                        eventUtil.eventAppend(this.widgetID, option);

                        if (this.widgetID === AUI.currentWidgetID) {

                            widget(AUI.currentWidgetID).config(true).config();
                        }


                    });
                }


                return this;
            },
            /*
             *   version 4.2
             *   desp    事件解绑
             *   author  lijiancheng@agree.com.cn
             *   params
             *          均为非必需
             *           @string type        触发条件
             *           @string selector    触发范围
             * */
            off: function (type, selector, namespace) {
                var filter, widgetIDs, eventIDs;

                if (this.length) {
                    widgetIDs = [];
                    filter = {};

                    type && (filter.type = type);
                    selector && (filter.selector = selector);
                    namespace && (filter.namespace = namespace);


                    //update data modal
                    this.each(function () {
                        widgetIDs.push(this.widgetID);
                    });
                    filter.widgetID = widgetIDs;

                    eventIDs = dataModel.get('event')(filter).select('eventID');

                    dataModel.get('event')({eventID: eventIDs}).remove();
                    dataModel.get('response')({foreignID: eventIDs}).remove();
                    dataModel.get('request')({foreignID: eventIDs}).remove();

                    //update view
                    if (widgetIDs.includes(AUI.currentWidgetID)) {

                        widget(AUI.currentWidgetID).config(true).config();
                    }
                }

                return this;
            },
            getEvent: function (type, selector, namespace) {
                var filter, widgetIDs, eventIDs;

                if (this.length) {
                    widgetIDs = [];
                    filter = {};

                    type && (filter.type = type);
                    selector && (filter.selector = selector);
                    namespace && (filter.namespace = namespace);


                    //update data modal
                    this.each(function () {
                        widgetIDs.push(this.widgetID);
                    });
                    filter.widgetID = widgetIDs;

                    eventIDs = dataModel.get('event')(filter).select('eventID');
                }

                return eventIDs && eventIDs.length ? eventUtil.Event(eventIDs) : undefined;
            },
            //lifecycle
            /*
             *      version AUI2 4.2
             *      desp    添加生命周期
             *      author  lijiancheng@agree.com.cn
             *      date    201703220942
             *
             *      params  @object option={
             *                  @enum   spaAction   $AW.SPA_ACTION.LOAD|UNLOAD|PAUSE|RESUME
             *                  @enum   pageAction  $AW.PAGE_ACTION.INIT|INTERVAL
             *                  @string desp    lifecycle instance description
             *                  @string code    code reference to lifecycle configuration   $AW.CODE | code
             *
             *                                                        deps:ajax && order:api
             *                                                            ##_VAR##.apiName(##_AJAX_OPTION##,auiCtx.namespace.orderParams) | ##_VAR##.apiName(data)
             *                                                        deps:ajax  && order:''
             *                                                            ##_VAR##.apiName(##_RESPONSE_DATA##) |  ##_VAR##.apiName(response)
             *
             *                  not necessary
             *                 deps             CONST       依赖              $AW.EVENT_DEPENDENCE
             *                 order            CONST       执行顺序          $AW.EVENT_ORDER
             *
             *                 //deps===$AW.EVENT_DEPENDENCE.AJAX
             *                 requestID        EdmID       引用的传输数据字段ID
             *                 responseID       EdmID       引用的返回数据字段ID
             *                 //validate
             *                 ajaxType              CONST       传输方式                 $AW.AJAX_TYPE                  defaultValue=$AW.AJAX_TYPE.POST
             *                 validate              BOOLEAN     是否进行数据校验          true|false                     defaultValue=true
             *                 validateContinue      CONST       校验是否继续             $AW.VALIDATE_CONTINUE          defaultValue=$AW.VALIDATE_CONTINUE.SINGLE
             *                 validateErrorCallback CONST       校验失败回调             $AW.ERROR_CALLBACK             defaultValue=$AW.ERROR_CALLBACK.DEFAULT
             *
             *
             *
             *                  not necessary
             *                  spaAction=$AW.SPA_ACTION.LOAD  && pageAction=$AW.PAGE_ACTION.INIT
             *                  @integer    times       execute times   default=0 表示无限循环
             *                  @integer    clock       with unit 'ms'  轮询时间间隔
             *                  @boolean    immediate   if execute code immediately default=false
             *                  @boolean    isPause           切换页面时，是否暂停轮询 default=true
             *      }
             * */
            lifecycle: function (option) {
                if (this.length && option) {
                    this.each(function () {
                        lifecycleUtil.lifecycleAppend(this.widgetID, option);

                        if (this.widgetID === AUI.currentWidgetID) {
                            widget(AUI.currentWidgetID).config(true).config();
                        }
                    });
                }

                return this;
            },
            /*
             *   version AUI2 4.2
             *   desp    删除生命周期
             *   author  lijiancheng@agree.com.cn
             *   date    201703221413
             *
             *   params
             *          almost not necessary
             *                  @enum   spaAction   $AW.SPA_ACTION.LOAD|UNLOAD|PAUSE|RESUME
             *                  @enum   pageAction  $AW.PAGE_ACTION.INIT|INTERVAL
             *                  @string code    code reference to lifecycle configuration
             * */
            removeLifecycle: function (spaAction, pageAction, code) {
                var filter, widgetIDs, lifecycleIDs;

                if (this.length) {
                    widgetIDs = [];
                    filter = {};

                    spaAction && (filter.spaAction = spaAction);
                    pageAction && (filter.pageAction = pageAction);
                    code && (filter.code = code);

                    //update data modal
                    this.each(function () {
                        widgetIDs.push(this.widgetID);
                    });
                    filter.widgetID = widgetIDs;

                    lifecycleIDs = dataModel.get('lifecycle')(filter).select('lifecycleID');

                    dataModel.get('lifecycle')({lifecycleID: lifecycleIDs}).remove();
                    dataModel.get('response')({foreignID: lifecycleIDs}).remove();
                    dataModel.get('request')({foreignID: lifecycleIDs}).remove();

                    //update view
                    if (widgetIDs.includes(AUI.currentWidgetID)) {
                        widget(AUI.currentWidgetID).config(true).config();
                    }
                }

                return this;
            },
            getLifecycle: function (spaAction, pageAction, code) {
                var filter, widgetIDs, lifecycleIDs;

                if (this.length) {
                    widgetIDs = [];
                    filter = {};

                    spaAction && (filter.spaAction = spaAction);
                    pageAction && (filter.pageAction = pageAction);
                    code && (filter.code = code);

                    //update data modal
                    this.each(function () {
                        widgetIDs.push(this.widgetID);
                    });
                    filter.widgetID = widgetIDs;

                    lifecycleIDs = dataModel.get('lifecycle')(filter).select('lifecycleID');
                }

                return lifecycleIDs ? lifecycleUtil.Lifecycle(lifecycleIDs) : undefined;
            },


            getEdm: function (edmID) {
                return edmUtil.Edm(edmID);
            },
            /*
             *   version: AUI2 v4.2
             *   log     同步EDM 信息
             *   data    201702281505
             *   author  lijiancheng@agree.com.cn
             * */
            syncEdm: function (fromType, formPath, toWidget, toType, toPath, replace, noRefresh, toDirection) {
                var fromWidget = this,
                    fromOptionCopy, toOptionCopy,
                    toEdmID, toOptionTemp, index, value, elements, edmValue;

                if (fromWidget.length && toWidget.version && toWidget.length && formPath && toPath) {

                    toWidget.each(function () {
                        var toWidget = widget(this.widgetID);

                        switch (fromType) {
                            case 'option':
                                eval('fromOptionCopy = fromWidget[0].data.optionCopy.' + formPath);
                                break;
                        }

                        switch (toType) {
                            case 'option':
                                eval('toOptionCopy = toWidget[0].data.optionCopy.' + toPath);
                                break;
                        }

                        if (fromOptionCopy && fromOptionCopy.edmID && toOptionCopy && toOptionCopy.edmKey) {
                            toEdmID = edmUtil.Edm.copy(fromOptionCopy.edmID, fromWidget.id(), fromOptionCopy.data && fromOptionCopy.data.url ? fromOptionCopy.data.url : fromWidget.id(), toOptionCopy.edmID, replace, toDirection);

                            if (toEdmID) {
                                //option copy

                                toOptionTemp = JSON.parse(JSON.stringify(fromOptionCopy));
                                delete toOptionTemp.edmKey;
                                toOptionCopy.edmID = toEdmID;
                                toOptionCopy = $.extend(true, toOptionTemp, {
                                    edmID: toOptionCopy.edmID,
                                    edmKey: toOptionCopy.edmKey,
                                    elements: toOptionCopy.elements.splice(0, 1)
                                });

                                //elements 恢复默认值
                                for (index = -1, elements = fromOptionCopy.elements; value = elements[++index];) {

                                    if (index !== 0) {
                                        edmValue = fromOptionCopy.elements[index][fromOptionCopy.edmKey];
                                        toOptionCopy.elements[index] = $.extend(true, {}, toOptionCopy.elements[0]);
                                        toOptionCopy.elements[index][toOptionCopy.edmKey] = edmValue;
                                    }
                                }
                                // $.each(fromOptionCopy.elements, function (index, value) {
                                //
                                // });

                                eval('toWidget[0].data.optionCopy.' + toPath + '=toOptionCopy');
                                dataModel.get('structure')({widgetID: toWidget.id()}).update({optionCopy: toWidget[0].data.optionCopy});

                                //option
                                toWidget.option(AUI.getCleanedOption(toWidget[0].data.optionCopy, toWidget[0].widget.option), noRefresh);
                            } else {

                            }
                        }
                    });
                }

                return this;
            },

            //external
            register: function (namespace, callback) {
                if (namespace && callback) {
                    this.each(function () {
                        this.callbackList[namespace] = callback;
                    });
                }

                return this;
            },
            focus: function () {
                var callbackList;

                if (this.length) {
                    callbackList = this[0].callbackList;

                    if (callbackList.focus) {
                        callbackList.focus.call(this);
                    }
                }

                return this;
            },
            blur: function () {
                var callbackList;

                if (this.length) {
                    callbackList = this[0].callbackList;

                    if (callbackList.blur) {
                        callbackList.blur.call(this);
                    }
                }

                return this;
            },
            getRawConfig: function (option, type) {
                return this[0].callbackList.getRawConfig(option, type);
            },
            setRawConfig: function (option, type) {
                return this[0].callbackList.setRawConfig(option, type);
            },

            renderLock: function (lock) {
                this.each(function (elem) {
                    this.renderLock = lock;
                });

                return this;
            },
            isRendering: function () {
                return this.length && this[0].renderLock;
            },

            //internal use
            //act like a Array
            _push: Array.prototype.push,
            _splice: Array.prototype.splice,
            _concat: Array.prototype.concat
        };

        widget.fn.init.prototype = widget.fn;

        return widget;
    });
})();