/**
 *
 * @param {[undefined]}
 *            undefined [确保undefined未被重定义]
 * @author lijiancheng@cfischina.com
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", 'template', 'bridge', 'vue', 'const', 'Model.Data', 'layout'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, artTemplate, Bridge, Vue, CONST, dataModel, Layout) {
        "use strict";
        var
            //AUI对象
            AUI = {
                initLayout: function () {
                    var NAV = CONST.PAGE.NAV,
                        $nav = $(NAV.PAGE_NAV_CTN, $(NAV.CTN)),
                        mode = auiApp.mode,
                        layout = auiApp.layout,
                        configuration = dataModel.getConfig(),
                        openPage = null,
                        k, value;


                    if (!configuration[mode] || !configuration[mode].version || configuration[mode].version < layout.version) {
                        configuration[mode] = JSON.parse(JSON.stringify(layout));
                    }
                    app.router = new Layout({
                        view: {
                            $nav: $nav,
                            $windows: $(CONST.PAGE.CTN)
                        },
                        model: configuration[mode],
                        on: {
                            beforeRender: function (type, layout) {
                                layout.getView().get$windows().removeClass('hidden');
                            },
                            resize: function (type, layout) {
                                dataModel.setConfigValue(auiApp.mode, layout.getModel().getModel());
                                AUI.updatePageConfig();
                                $AW.trigger($AW._STATUS.RESIZE);
                            },
                            change: function (type, layout) {

                                dataModel.setConfigValue(auiApp.mode, layout.getModel().getModel());
                                AUI.updatePageConfig();

                                AUI.resizeOverview && AUI.resizeOverview();
                            },

                            active: function (type, layout, $pane) {
                                var id = $pane.attr('id');

                                $nav
                                    .children().removeClass('active')
                                    .filter('[data-role="' + id + '"]').addClass('active');
                                AUI.vscode.layout($pane.parent());
                            }
                        }
                    });

                    configuration[mode] && (openPage = configuration[mode].panels);

                    for (k in openPage) {
                        if (openPage.hasOwnProperty(k) && ( openPage[k].display === 'block')) {
                            app.router.open({path: 'module/' + k});
                        }
                    }
                },
                /*基本操作管理*/
                /*
                 *   desp 恢复数据模型层数据及桥接
                 *   version 4.3
                 *   author lijiancheng@agree.com.cn
                 * update log
                 *
                 * build 5357
                 * version AUI 4.1
                 * change logs:更改resumeWidget接口，以适应除AUI Editor之外的其他页面的恢复使用
                 *              由$AW.resumeWidget()改为$AW.resume($ctn,type)
                 *              $ctn表示恢复组件的容器的
                 *              type表示容器的基础类型 如：viewer|theme|page等
                 * author lijiancheng@agree.com.cn
                 *
                 * update log
                 * version AUI 4.3
                 * build 7513
                 * change logs:将该功能改成写入数据模型层功能和引入兼容桥接功能,改名为AUI.resumeDataModel
                 * author lijiancheng@agree.com.cn
                 * */

                resumeDataModel: function ($auiFrame, BASE_TYPE, BASE_HREF, resumeViewModelCallback, resumeDataModelCallback) {

                    var
                        widget = $AW,
                        i, item,

                        _config, _data,


                        callback = function (response) {
                            var nslCallback = function (content) {
                                    var content = JSON.parse(content),
                                        properties = content.property || [],
                                        lang = content.lang || [],
                                        length = properties.length,
                                        range, property, i,
                                        tempList = [],
                                        copyViewer;

                                    for (i = 0; i < length; i++) {
                                        property = properties[i];
                                        range = property.range;
                                        switch (range) {
                                            case CONST.NSL.RANGE.GLOBAL:
                                                tempList.push(property);
                                                break;

                                            default:
                                                //do nothing
                                                break;
                                        }
                                    }

                                    //  copyViewer = dataModel.get('nslList');
                                    //copyViewer.nsl = tempList;

                                    dataModel.set('nslList', tempList);
                                    dataModel.set('nslLanguage', lang);

                                    if (aweb && aweb.translate) {
                                        AUI.addLanguageSelect();
                                    }
                                },
                                resumePage = function () {
                                    var getPageWidgetCallback = function (widgetData) {

                                            var widgetCollection = dataModel.get('widget')({type: BASE_TYPE}),
                                                widgetConfig,
                                                dataCollection, data,
                                                widgetID = dataModel.get('uuid'),
                                                pageWidget;


                                            //refresh page widget configuration
                                            if (widgetData) {
                                                widgetCollection.remove();

                                                delete widgetData.___id;
                                                delete widgetData.___s;

                                                widgetCollection = dataModel.get('widget').insert(widgetData);
                                            }
                                            widgetCollection.update({isNewest: true});

                                            if (widgetConfig = widgetCollection.first()) {

                                                dataCollection = dataModel.get('structure')({type: widgetConfig.type});

                                                if (!(data = dataCollection.first())) {
                                                    data = dataModel.get('structure').insert({
                                                        widgetID: widgetID,
                                                        href: widgetConfig.href,
                                                        type: widgetConfig.type,
                                                        base: '',
                                                        children: [],
                                                        active: true,
                                                        option: {},
                                                        optionCopy: {},
                                                        attr: {
                                                            widgetName: dataModel.get('pageName') || '页面',
                                                            desp: dataModel.get('desp') || '页面',
                                                            id: CONST.PAGE.CONTENT_FRAME.EDITOR_CTN.substr(1)
                                                        },
                                                        css: {},
                                                        event: {
                                                            selector: {}
                                                        }
                                                    }).first();
                                                }

                                                //init WIDGET object
                                                pageWidget = widget(widgetID);

                                                if (pageWidget.length) {
                                                    /*
                                                     *  version 4.2
                                                     *  author lijiancheng@agree.com.cn
                                                     *  log 修复旧版structure中没有href的bug
                                                     * */
                                                    if (!pageWidget[0].data.href) {
                                                        pageWidget.update({href: widgetConfig.href});
                                                    }

                                                    //init Page Panel to be draggable
                                                    //注册ID，如果冲突则自动添加累加器
                                                    widget.updateDomID(null, pageWidget[0].data.attr.id, widgetID, true, true);


                                                    resumeViewModelCallback && resumeViewModelCallback(pageWidget, _config, _data);

                                                    AUI.resumingLock = _data.structure().count();
                                                } else {
                                                    app.alert('获取页面基础组件错误！', app.alert.ERROR);
                                                    AUI.resumingLock = 0;
                                                }
                                            } else {
                                                app.alert('获取页面基础组件错误！', app.alert.ERROR);
                                                AUI.resumingLock = 0;
                                            }
                                        },
                                        uuid = dataModel.getData() ? dataModel.get('uuid') : false;

                                    external.getWidget(BASE_HREF, getPageWidgetCallback, getPageWidgetCallback);
                                };

                            if (auiApp.io && auiApp.io.projectName) {


                                external.getFile(CONST.CONFIG_PATH[window.auiApp.FILE_TYPE].nsl.replace(/@projectName/, auiApp.io.projectName), function (nslContent) {
                                    nslCallback(nslContent);

                                }, function () {
                                    //平台级组件为其设置语言切换默认值
                                    dataModel.set('nslLanguage', [{name: 'zh-CN', desp: '中文（简体）'}, {
                                        name: 'en-US',
                                        desp: '英语（美国）'
                                    }]);
                                    switch (auiApp.mode) {
                                        case CONST.MODE.WIDGET_CREATOR:

                                            if (aweb && aweb.translate) {
                                                AUI.addLanguageSelect();
                                            }

                                            break;
                                    }
                                });
                            }


                            if (resumeDataModelCallback) {
                                external.getConfigure(function (config) {
                                    // 切换模式到编辑模式
                                    var data = resumeDataModelCallback(config, dataModel.getData(), $auiFrame);


                                    _config = config;
                                    _data = data;

                                    //兼容转化
                                    data.version = config.version = config.version || CONST.AWOS_APP_UNITED_VERSION;

                                    // dataModel.set()
                                    data = Bridge(auiApp.mode, data);
                                    dataModel.resetData(data);


                                    resumePage();

                                }, resumePage);
                            } else if (resumeViewModelCallback) {

                                resumeViewModelCallback();
                            }
                        };

                    //init all namespace object
                    for (i = CONST.DATA.appNamespaceList.length; item = CONST.DATA.appNamespaceList[--i];) {
                        dataModel.set(item, dataModel.get(item) || {});
                    }

                    auiApp.io = auiApp.io || {};

                    AUI.initLayout();


                    callback();


                },
                /*
                 *  update log 将菜单更新完毕后再恢复页面
                 *
                 * */
                save: function () {
                    var data, nsl, structure, i, item,
                        //data = AUI.data,
                        structure = dataModel.get('structure')().get(),
                        uuid = dataModel.get('uuid'),
                        chainData = $AW.chain.cache[uuid],
                        subset = (chainData && chainData.subset) || [];

                    if (subset.length) {
                        for (i = -1; item = structure[++i];) {
                             if(!$AW(item.widgetID).length){
                                    structure.splice(i, 1);

                                    i--;
                             }else{

                             if (item.widgetID !== uuid) {
                                 if (subset.indexOf(item.widgetID) === -1) {
                                                                 structure.splice(i, 1);
                                                                 i--;
                                                             }
                                                         }
                             }


                        }
                    }

                    if (!AUI.savingLock) {
                        try {
                            AUI.savingLock = true;

                            data = dataModel.preSave();

                            require(['nsl'], function (_nsl) {
                                nsl = _nsl;
                                nsl && nsl.saveTranslatorFile(data);
                            });

                            data[CONST.USE_VERSION] = version;
                            // data['customCode']=dataModel.get('customCode');
                            external.saveConfigure(data, function (response) {

                                response ? app.alert('保存成功！', app.alert.SUCCESS) : app.alert('保存失败！', app.alert.ERROR);

                                $AW.trigger($AW._STATUS.PAGE_CODE);
                                $AW.trigger($AW.STATUS.PREVIEW_FRESH);
                                AUI.savingLock = false;


                            }, function () {
                                AUI.savingLock = false;
                            });

                            $AW.trigger($AW._STATUS.SAVE);

                        } catch (e) {
                            AUI.savingLock = false;
                            throw e;
                        }
                    } else {
                        app.alert('页面保存中，请稍候…', app.alert.WARNING);
                    }
                },
                //重置页面
                reset: function () {
                    var //data = AUI.data,
                        frameList, frame,
                        i, item;

                    if (AUI.mode === CONST.MODE.WIDGET_BUILDER) {

                        frameList = CONST.DATA.frame;
                        frame = {};
                        for (i = frameList.length; item = frameList[--i];) {
                            frame[item] = dataModel.get(item);
                        }
                        frame.frame = true;

                        external.saveWidget(frame, function (response) {
                            response ? document.location.reload(true) : app.alert('重置失败！', app.alert.ERROR);
                        });
                    } else {
                        external.saveConfigure({
                            name: dataModel.get('name'),
                            desp: dataModel.get('desp'),
                            pageName: dataModel.get('pageName'),
                            pageModule: dataModel.get('pageModule'),
                            uuid: dataModel.get('uuid'),
                            lastModifiedTime: (new Date().getTime()),
                            version: CONST.VERSION
                        }, function (response) {
                            response ? document.location.reload(true) : app.alert('重置失败！', app.alert.ERROR);
                        });
                    }
                },
                //预览

                getParsedString: function (ast, beautify) {
                    var stream = UglifyJS.OutputStream({comments: true, beautify: true});
                    ast.print(stream);
                    return stream.toString();
                },


                /*页面配置管理*/
                getPageConfig: function (getPageConfigCallback) {
                    var callback = function (data) {


                        var config = data ? $.extend(true, dataModel.getConfig(), JSON.parse(data)) : dataModel.getConfig(),
                            NAV_CONST = CONST.PAGE.NAV,
                            $helpBtn = $(NAV_CONST.HELP_MODE_BTN, NAV_CONST.CTN);

                        // AUI.configuration = config;


                        dataModel.setConfig(config);


                        //帮助模式
                        $helpBtn.attr('title', config.debug ? '关闭帮助模式' : '开启帮助模式');
                        $helpBtn.children().attr('class', config.debug ? 'aui aui-kaiguan-kai' : 'aui aui-kaiguan-guan');

                        getPageConfigCallback && getPageConfigCallback();
                    };
                    external.getPageConfig(callback, callback);
                },
                updatePageConfig: function () {
                    external.savePageConfig(dataModel.getConfig());
                },
                getDependenceConfig: function (callback) {
                    external.getDependenceConfig(function (config) {
                        var cssMap = dataModel.get('cssMap'),
                            key;
                        for (key in config) {
                            if (config.hasOwnProperty(key) && cssMap.hasOwnProperty(key)) {
                                config[key] = config[key].replace(key.replace(/\//g, '\\'), cssMap[key].replace(/\//g, '\\'));
                            }
                        }

                        callback && callback(config);
                    }, function () {
                        callback && callback();
                    });
                },
                dependence: (function () {
                    var map = {},
                        requireConfig = {
                            shim: {},
                            paths: {}
                        },
                        _config,
                        codeCompile,
                        defer = [],
                        loadedJSMap = {},
                        _dependence = function (deps, callback, context) {
                            if (!_config) {
                                defer.push(arguments);
                            } else {
                                var i, len, arr, name,
                                    j, config,
                                    jsLoadList,
                                    isPath;
                                if (deps) {
                                    if ((arr = deps.css) && (len = arr.length)) {
                                        for (i = -1; ++i < len;) {

                                            if (_config[arr[i]]) {
                                                (function (cssItem) {

                                                    codeCompile.validateCss(cssItem, dataModel.get('dependence'), function () {
                                                        codeCompile.requireCss(cssItem);
                                                    })
                                                }(arr[i]));
                                            }
                                        }
                                    }
                                    if ((arr = deps.js) && (len = arr.length)) {
                                        for (jsLoadList = [], i = -1; ++i < len;) {

                                            name = arr[i];

                                            //将路径切换为名字
                                            if (map[name] || map['dependence/' + name]) {

                                                name = map[name] || map['dependence/' + name];

                                            } else if (/[\\\/]/.test(name)) {
                                                isPath = false;
                                                config = _config;

                                                for (j in config) {
                                                    if (config[j] && config[j].path && config[j].path.indexOf(name) !== -1) {
                                                        name = map[name] = j;
                                                        isPath = true;
                                                        break;
                                                    }
                                                }

                                                if (!isPath) {

                                                    name = 'dependence/' + name;

                                                    if (!/.js$/.test(name)) {
                                                        name += '.js';
                                                    }
                                                }

                                                map[name] = name;
                                            } else {
                                                if (requireConfig.paths[name]) {
                                                    map[name] = name;
                                                } else {
                                                    map[name] = '';
                                                    name = '';
                                                }
                                            }

                                            if (!loadedJSMap[name]) {
                                                jsLoadList.push(name);
                                                loadedJSMap[name] = true;
                                            }


                                        }

                                        if (jsLoadList && jsLoadList.length) {
                                            require(jsLoadList, function () {
                                                var exportTo = context || window,
                                                    args = arguments,
                                                    _i, _item,
                                                    namespaces, obj;

                                                //对外暴露接口
                                                for (_i = jsLoadList.length; _item = jsLoadList[--_i];) {
                                                    if (requireConfig.shim[_item] && requireConfig.shim[_item].exports && args[_i]) {
                                                        namespaces = requireConfig.shim[_item].exports.split('.');
                                                        obj = exportTo;

                                                        while (namespaces.length > 1) {
                                                            obj = obj[namespaces[0]] || (obj[namespaces[0]] = {});
                                                            namespaces.shift();
                                                        }
                                                        obj[namespaces[0]] = args[_i];
                                                    }
                                                }

                                                callback && callback();
                                            });
                                        } else {
                                            callback && callback();
                                        }
                                    } else {
                                        callback && callback();
                                    }
                                } else {
                                    callback && callback();
                                }
                            }
                        };

                    require(['codeCompile'], function (CodeCompile) {
                        codeCompile = new CodeCompile(dataModel);

                        AUI.getDependenceConfig(function (config) {
                            var dependenceList = dataModel.get('dependence');

                            if (!dependenceList || $.isEmptyObject(dependenceList)) {
                                dataModel.set('dependence', config);
                            }
                            _config = config;
                            var _i, _path;

                            //将IDE配置转换为require config配置
                            for (_i in config) {
                                if (_i && config.hasOwnProperty(_i)) {
                                    if (config[_i].path) {
                                        requireConfig.shim[_i] = {
                                            deps: config[_i].deps,
                                            exports: config[_i]["export"]   //IE 不兼容的问题
                                        };
                                        _path = config[_i].path;
                                        requireConfig.paths[_i] = ~_path.indexOf('.js') ? _path.substring(0, _path.length - 3) : _path;
                                    } else if (_i.match(/\.css$/)) {

                                    }
                                }


                            }

                           require.config(requireConfig);

                            defer.map(function (args) {
                                _dependence.apply(AUI, args);
                            });

                            require(['ui'], function () {
                                AUI.hideWelcomeScreen();
                            });
                        });
                    });

                    return _dependence;
                }()),

                /*占位符处理管理*/
                transformThemeVariables: function (variables) {
                    var data = {}, index, elem, idx, c;

                    if (variables) {
                        for (index = -1; elem = variables[++index];) {
                            if (elem.name && elem.desp) {
                                var key = '@' + elem.name,
                                    obj = {
                                        desp: elem.desp,
                                        name: key
                                    }, css;
                                if (typeof elem.cssAttrs === 'string') {
                                    css = elem.cssAttrs.split(" ");
                                } else {
                                    css = elem.cssAttrs;
                                }
                                for (idx = -1; c = css[++idx];) {
                                    (data[c] || (data[c] = [])).push(obj);
                                }
                                // $.each(css, function (idx, c) {
                                //
                                // });
                                data[key] = elem.defaultValue;
                            }
                        }
                        // $.each(variables, function (index, elem) {
                        //
                        // });
                    }

                    return data;
                },
                transformForeignKey: function (str, widgetID, urlID) {
                    return str && str
                            .replace(CONST.REGEX.FOREIGN_WIDGET.FOREIGN_WIDGET_MATCH, '##' + widgetID + '_WID$1##')
                            .replace(CONST.REGEX.FOREIGN_WIDGET.URL_MATCH, '##' + urlID + '_URL##')
                            .replace(/_WID_URL/g, '_URL');
                },
                transformIntoForeignKey: function (str, widgetID) {
                    return str && str
                            .replace(CONST.REGEX.WIDGET.PLACEHOLDER, '##' + widgetID + '_WID$1##');
                },
                /*
                 * version 4.1 build 5358
                 * log： 将var、attr、css、option纳入到默认处理函数中
                 * author：lijiancheng@agree.com.cn
                 * */
                getForeignKey: function (type, id) {
                    var TYPE = CONST.REGEX.TYPE;
                    switch (type) {
                        case TYPE.ID:
                            return '##' + id + '_WID##';
                        case TYPE.URL:
                            return '##' + id + '_URL##';
                        default:
                            return '##' + id + '_' + type.toUpperCase() + '##';
                    }
                },

                //code editor
                //code editor
                vscode: function () {
                    var editors = {},
                        hasRegister = false,
                        dtd = $.Deferred(),
                        done = function (callback) {
                            if (dtd.state() !== 'resolved') {
                                $.when(dtd.promise()).done(callback);
                            } else {
                                callback();
                            }
                        },
                        createDependencyProposals = function (model, position) {
                            // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
                            // here you could do a server side lookup
                            var text = model.getValueInRange({
                                startLineNumber: position.lineNumber,
                                startColumn: 1,
                                endLineNumber: position.lineNumber,
                                endColumn: position.column
                            }), code = text.trim().match(/[\w\.]+(?:$|\))/);

                            code = text && text.length && code ? code[0] : text;


                            if (code.startsWith('app')) {
                                return [{
                                    label: 'alert',
                                    kind: monaco.languages.CompletionItemKind.Method,
                                    detail: "提示,app.alert(string:tips，enum:alertType)",
                                    insertText: "alert('提示语句',app.alert.ERROR);"
                                }, {
                                    label: 'alert.WARNING',
                                    kind: monaco.languages.CompletionItemKind.Enum,
                                    detail: "警告提示",
                                    insertText: "alert.WARNING"
                                }, {
                                    label: 'alert._DEFAULT',
                                    kind: monaco.languages.CompletionItemKind.Enum,
                                    detail: "默认提示",
                                    insertText: "alert._DEFAULT"
                                }, {
                                    label: 'alert.SUCCESS',
                                    kind: monaco.languages.CompletionItemKind.Enum,
                                    detail: "成功提示",
                                    insertText: "alert.SUCCESS"
                                }, {
                                    label: 'alert.ERROR',
                                    kind: monaco.languages.CompletionItemKind.Enum,
                                    detail: "错误提示",
                                    insertText: "alert.ERROR"
                                }, {
                                    label: 'shelter.show',
                                    kind: monaco.languages.CompletionItemKind.Method,
                                    detail: "遮罩,app.shelter.show(string:tips,boolean:immediately)",
                                    insertText: "shelter.show('请稍候…');"
                                }, {
                                    label: 'shelter.hide',
                                    kind: monaco.languages.CompletionItemKind.Method,
                                    detail: "关闭遮罩,app.shelter.hide()",
                                    insertText: "shelter.hide();"
                                }, {
                                    label: 'shelter.hideAll',
                                    kind: monaco.languages.CompletionItemKind.Method,
                                    detail: "关闭所有遮罩,app.shelter.hideAll()",
                                    insertText: "shelter.hideAll();"
                                }];
                            } else {
                                return [
                                    {
                                        label: '$AW',
                                        kind: monaco.languages.CompletionItemKind.Function,
                                        detail: "组件操作对象",
                                        insertText: '$AW(widgetID)'
                                    }
                                    , {
                                        label: 'app',
                                        kind: monaco.languages.CompletionItemKind.Interface,
                                        detail: "提示,app.alert(提示语句，提示类型)",
                                        insertText: 'app'
                                    }
                                ];
                            }
                        },
                        createThemeVariablesProposals = function (model, position) {
                            var themeVariables, i, item, ret = [], variablesName,
                                text = model.getValueInRange({
                                    startLineNumber: position.lineNumber,
                                    startColumn: 1,
                                    endLineNumber: position.lineNumber,
                                    endColumn: position.column
                                }), code = text.trim().match(/[\w\:]+(?:$|\))/);

                            code = text && text.length && code ? code[0] : text;


                            if (/[:@]/.test(code)) {
                                themeVariables = $AW.fresher && $AW.fresher.variables;
                                for (i = -1; item = themeVariables[++i];) {
                                    variablesName = item.name.replace(/[(\@)(\#)(\$)(\%)(\&)]+/g, '');
                                    ret.push({
                                        label: '@' + variablesName,
                                        detail: item.defaultValue + item.desp,
                                        insertText: '@' + variablesName
                                    })
                                }

                            }

                            return ret;
                        };

                    return {

                        layout: function ($ctn) {
                            var i, elem, editor, $editor, elems = $ctn.find('[data-vscode-id]');
                            for (i = -1; elem = elems[++i];) {
                                $editor = $(elem);
                                editor = editors[$editor.attr('data-vscode-id')];
                                editor && editor.layout();
                            }

                        },

                        create: function ($editor, options) {
                            var uid = app.getUID(), myEditor,
                                requiredCallback = function () {
                                    if (!hasRegister) {
                                        monaco.languages.registerCompletionItemProvider('javascript', {
                                            triggerCharacters: ["."],
                                            provideCompletionItems: createDependencyProposals
                                        });

                                        monaco.languages.registerCompletionItemProvider('less', {
                                            triggerCharacters: [":"],
                                            provideCompletionItems: createThemeVariablesProposals
                                        });
                                        hasRegister = true;
                                    }

                                    myEditor = editors[uid] = monaco.editor.create($editor[0], options);
                                };


                            if ($editor.length) {
                                $editor.attr('data-vscode-id', uid);

                                options.fixedOverflowWidgets = true;
                                options.folding = true;
                                options.formatOnPaste = true;
                                options.mouseWheelZoom = true;
                                options.parameterHints = true;
                                options.renderIndentGuides = true;
                                options.tabCompletion = true;
                                options.autoIndent = true;

                                if (!window.monaco) {
                                    require(['vs/loader', 'vs/editor/editor.main'], function () {
                                        requiredCallback();
                                        dtd.resolve();

                                    });
                                } else {
                                    requiredCallback();
                                    dtd.resolve();
                                }
                            }


                            return {
                                setValue: function (str) {
                                    done(function () {
                                        myEditor && myEditor.setValue(str);

                                    })
                                },
                                getValue: function () {

                                    return myEditor && myEditor.getValue();
                                },
                                dispose: function () {
                                    delete editors[uid];
                                    myEditor && myEditor.dispose();
                                },
                                getInstance: function () {
                                    return myEditor;
                                },
                                onBlur: function (callback) {
                                    //currentEditor = null;
                                    done(function () {
                                        myEditor && myEditor.onDidBlurEditorText(callback);
                                    })
                                },
                                layout: function () {

                                    myEditor && myEditor.layout();
                                },
                                setModel: function (data, mode) {
                                    done(function () {
                                        myEditor && myEditor.setModel(new monaco.editor.createModel(data, mode));
                                    });
                                    return myEditor;
                                },
                                done: function (callback) {
                                    done(function () {
                                        callback(myEditor);
                                    })
                                }
                            }
                        }
                    }
                }(),
                delEmptyObj: (function () {
                    var isEmpty = function (obj) {
                        var name;

                        for (name in obj) {
                            if (obj.hasOwnProperty(name) && obj[name]) {
                                return false;
                            }
                        }

                        return true;
                    }, _ = function (object) {
                        var i, value;

                        for (i in object) {
                            value = object[i];
                            // sodino.com
                            // console.log('typeof object[' + i + ']', (typeof value));
                            if (typeof value === 'object') {
                                if (Array.isArray(value)) {
                                    if (value.length === 0) {
                                        delete object[i];
                                        continue;
                                    }
                                }
                                _(value);

                                if (isEmpty(value)) {
                                    delete object[i];
                                }
                            } else if (!(object instanceof Array)) {
                                if (value === '' || value === null || value === undefined) {
                                    delete object[i];
                                }
                            }
                        }
                    };


                    return function (content) {
                        if (content) {
                            content = JSON.parse(JSON.stringify(content));
                            _(content);
                        }

                        return content;
                    }
                }()),
                saveFresherFile: function () {
                    var webContentPath, path, smallTheme,
                        projectName = auiApp.io.projectName,
                        indexLayoutContent = {},
                        content, ast, stream,
                        replaceRex = window.auiApp.isNewDir ? 'src/main/webapp' : 'WebRoot',
                        replaceTag = window.auiApp.isNewDir ? 'target/webapp' : 'WebContent';

                    if (projectName) {

                        path = CONST.CONFIG_PATH[window.auiApp.FILE_TYPE].awebFresher.replace('@projectName', projectName);
                        // webContentPath = projectName + '/WebContent/dependence/AWEB/js/aweb.fresher.js';

                        // app.alert('保存' + CONST.WIDGET.TYPE_TEXT[auiApp.mode.toUpperCase()] + '“' + data.name + '”成功', app.alert.SUCCESS);
                        AUI.savingLock = false;


                        smallTheme = AUI.delEmptyObj($AW.fresher.theme);
                        indexLayoutContent.theme = smallTheme || {};

                        indexLayoutContent.variables = $AW.fresher.variables || {};

                        content = "define(function(){ return " + JSON.stringify(indexLayoutContent) + ";})";


                        ast = UglifyJS.parse(content);
                        stream = UglifyJS.OutputStream({beautify: false});

                        ast.print(stream);
                        content = stream.toString();


                        external.saveFile({
                            fullPath: path,
                            content: content
                        });

                        external.saveFile({  //同时保存到webContent里面
                            fullPath: path.replace(new RegExp(replaceRex), replaceTag),
                            content: content
                        });


                    }
                },


                //combo tree
                traverseTree: function (treeData) {

                    var treeData = JSON.parse(JSON.stringify(treeData)),
                        data = {children: treeData},
                        i, item, treeMap = {}, stack,
                        tmpNode, domId, pathArr = [], pathMap = {},
                        miniTreeToMap = function (treeMap, node) {
                            var i, item, f = 0, cFlag = false, pFlag = false,
                                domId, cArr = [], chilNumber = node.children && node.children.length;
                            if (chilNumber) {
                                for (i = -1; item = node.children[++i];) {

                                    if (!item.children) {
                                        cFlag = true;
                                        f++;
                                        cArr.push(item);
                                        item.dataType = item.hasReturn === false ? '' : (item.dataType || item.toAddOptionType || (item.returnValue && item.returnValue.type) || item.apiType || item.type);
                                        item.canHide = true;
                                    } else {
                                        pFlag = true;
                                    }
                                    if (!item.desp && !item.text) {
                                        item.canHide = true;
                                    }
                                }
                                if (f === chilNumber || (cFlag && pFlag)) {
                                    domId = app.getUID();
                                    node.domId = domId;
                                    treeMap[domId] = cArr;
                                }
                                if (f === chilNumber) {
                                    node.showIcon = false;
                                } else {
                                    node.showIcon = true;
                                }
                            }
                        };


                    if (!data) {
                        return;
                    }
                    stack = [];
                    stack.push(data);
                    while (stack.length > 0) {
                        tmpNode = stack.pop();

                        tmpNode.level = tmpNode.level || 0;

                        if (!tmpNode.desp && tmpNode.text) {
                            tmpNode.desp = tmpNode.text || '';
                        }
                        if (!tmpNode.path) {
                            tmpNode.path = tmpNode.desp || '';
                        }
                        miniTreeToMap(treeMap, tmpNode);

                        if (tmpNode.children && tmpNode.children.length > 0) {
                            i = tmpNode.children.length - 1;
                            for (i = tmpNode.children.length - 1; i >= 0; i--) {

                                tmpNode.children[i].path = tmpNode.path || tmpNode.desp;
                                tmpNode.children[i].level = tmpNode.level + 1;

                                if (tmpNode.children[i].children) {
                                    tmpNode.children[i].path = tmpNode.path + '>' + (tmpNode.children[i].desp || tmpNode.children[i].text);
                                }

                                stack.push(tmpNode.children[i]);
                            }

                        } else {

                            if (tmpNode.desp) {
                                if (!tmpNode.path) {
                                    tmpNode.path = tmpNode.desp;
                                } else {
                                    tmpNode.path = tmpNode.path + '>' + tmpNode.desp;
                                }

                                tmpNode.margingLeft = ((tmpNode.path.split('>').length - 1) * 1.8) + 'em';
                                pathArr.push({
                                    desp: tmpNode.desp,
                                    path: tmpNode.path.replace(/^\>/g, ''),
                                    id: tmpNode.id || ''
                                });
                                if (tmpNode.id) {
                                    pathMap[tmpNode.id] = tmpNode.path.replace(/^\>/g, '');
                                } else {
                                    pathMap[''] = '无';
                                }

                            }

                        }
                    }

                    return {
                        treeMap: treeMap,
                        pathArr: pathArr,
                        pathMap: pathMap,
                        data: treeData
                    }

                },
                treeSearch: (function () {
                    var searchTree = function ($input, $ctn) {
                        return new searchTree.fn.init($input, $ctn);
                    };

                    searchTree.fn = searchTree.prototype = {
                        constructor: searchTree,

                        init: function ($input, $ctn) {
                            this.$input = $input;
                            this.$ctn = $ctn;


                            if (this.$input) {
                                this.$input.on({
                                    'keyup.tree': function () {
                                        var str = this.value;

                                        var nodes = $ctn.find('.aui-search-tree-node').children('span'),
                                            len = nodes.length,
                                            node,
                                            $showNodes = $(),
                                            $hideNodes = $();

                                        while (node = nodes[--len]) {
                                            (~node.textContent.trim().indexOf(str) ? $showNodes : $hideNodes).push(node);
                                        }

                                        $hideNodes.parent().hide();
                                        $showNodes.parent().show();
                                        //父级显示
                                        $showNodes.parents('.aui-search-tree-node').show();
                                        //子集显示
                                        $('.aui-search-tree-node', $showNodes.next()).show();
                                    }
                                });
                            }


                            return this;
                        },

                        refresh: function (data, type, callback) {
                            var i, item, j, value,
                                iconName = ['aui-logic-transmission', 'aui-logic-screen'];

                            switch (type) {
                                case 'varList':
                                    if (!data[0].desp) {
                                        data.splice(0, 1);
                                    }
                                    for (i = -1; item = data[++i];) {
                                        item.colorBlock = item.namespace + '-block';
                                        if (item.children) {
                                            for (j = -1; value = item.children[++j];) {
                                                value.colorBlock = item.namespace + '-block';
                                                value.blockIcon = iconName[j];
                                            }
                                        }
                                    }

                                    this.$ctn.empty().append(artTemplate('html_overviewVarList', {varList: data}));

                                    $('.aui-normal-block-title', this.$ctn)
                                        .off('.varList')
                                        .on('click.varList', function (e) {
                                            var $target = $(e.target || e.srcElement),
                                                $i = $target.closest("[data-event-role='toggle']"),
                                                $ul = $i.closest('ul');

                                            if ($ul.hasClass('open')) {
                                                $ul.removeClass('open').addClass('hid');
                                            } else {
                                                $ul.removeClass('hid').addClass('open');
                                            }

                                        });
                                    break;

                                case 'graph':
                                    for (i = -1; item = data[++i];) {
                                        if (item.statementType) {
                                            item.graph = 'aui-graph-' + item.statementType;
                                        } else {
                                            item.graph = 'aui-graph-rectangles'
                                        }
                                    }
                                default:
                                    this.$ctn.empty().append(artTemplate('html_overviewCodeMenu', {
                                        children: data
                                    }));
                            }

                            callback && callback(this.$ctn);
                        }
                    };
                    searchTree.fn.init.prototype = searchTree.fn;

                    return searchTree;
                }()),
                tabTreeSearch: (function () {
                    var searchTabTree = function ($ctn, callback) {
                        return new searchTabTree.fn.init($ctn, callback);
                    };


                    searchTabTree.fn = searchTabTree.prototype = {
                        constructor: searchTabTree,

                        init: function ($ctn, callback) {

                            var
                                searchPanelShowing,
                                that = this,
                                $searchPanel,
                                $search,
                                helper,
                                apiSearchResult,
                                initData = {
                                    searchId: app.getUID(),
                                    searchPanelId: app.getUID(),
                                    ctnId: app.getUID()
                                },
                                showSearchPanel = function () {
                                    if (!searchPanelShowing) {

                                        $searchPanel.slideDown();

                                        searchPanelShowing = true;
                                    }
                                },
                                hideSearchPanel = function () {
                                    if (searchPanelShowing) {
                                        $searchPanel
                                            .empty()
                                            .slideUp();

                                        $search.val('');
                                        searchPanelShowing = false;
                                    }
                                };

                            $ctn.empty().append(artTemplate('html_overviewTabTreeSearchBar', initData));

                            $(".aui-tabtree-search-result-panel", $ctn).hide();
                            $search = $("#" + initData.searchId, $ctn);
                            $searchPanel = $("#" + initData.searchPanelId, $ctn);

                            this.$ctn = $("#" + initData.ctnId, $ctn);
                            this.$search = $search;
                            this.callback = callback;


                            $search.on({
                                'keyup.tree': function () {
                                    var value = this.value, pushedFlag = false,
                                        result = [], i, item, searchItem, str,
                                        searchData = dataModel.get(that.key).pathArr, preObjectID;

                                    if (value) {
                                        for (i = -1; item = searchData[++i];) {

                                            if (item.desp && ~item.desp.toLowerCase().indexOf(value.toLowerCase())) {
                                                searchItem = JSON.parse(JSON.stringify(item));
                                                str = searchItem.desp;
                                                searchItem.desp = str.replace(new RegExp('(' + value + ')', 'ig'), '<em>$1</em>');
                                                result.push(searchItem);
                                                pushedFlag = true;
                                            }

                                            if (!pushedFlag && item.path && ~item.path.toLowerCase().indexOf(value.toLowerCase())) {

                                                searchItem = JSON.parse(JSON.stringify(item));
                                                str = searchItem.path;
                                                searchItem.path = str.replace(new RegExp('(' + value + ')', 'ig'), '<em>$1</em>');
                                                result.push(searchItem);
                                            }
                                        }

                                        $searchPanel.empty().append(artTemplate('html_TabTreeSearchResult', {result: result}));
                                        preObjectID = $searchPanel.prevObject.attr('id');

                                        apiSearchResult = {
                                            "version": version,
                                            "keyword": value,
                                            "num": result.length,
                                            "type": (preObjectID && preObjectID.indexOf('AwebCode') !== -1) ? 'auiApp' : 'widgetApi',
                                            "href": '',
                                            "pageId": ''
                                        };

                                        callback && callback($searchPanel)
                                    } else {
                                        $searchPanel.empty();
                                    }

                                },
                                'focus.tree': function () {
                                    showSearchPanel();
                                },
                                'blur.tree': function () {
                                    var val = this.value;
                                    AUI.report && AUI.report(apiSearchResult);
                                    if (!val) {
                                        hideSearchPanel();
                                    }
                                }
                            });
                        },

                        refresh: function (key) {
                            var data = dataModel.get(key),
                                tabContent = data.treeMap,
                                // pathArr=data.pathArr,
                                // pathMap=data.pathMap,
                                data = data.data,
                                that = this,
                                helper,
                                oldEventRole;

                            this.key = key;

                            // this.searchData = pathArr;
                            // this.pathMap = pathMap;
                            helper = this.helper || '';
                            this.$ctn.empty().append(artTemplate('html_overviewTabTreePanel', {children: data}));

                            $('.aui-tabtree-left-container', this.$ctn)
                                .off('.tabTree')
                                .on('click.tabTree', function (e) {
                                    var $target = $(e.target || e.srcElement),
                                        eventRole = $target.attr("data-event-role") || $target.closest('div').attr("data-event-role"),
                                        tabData = tabContent[eventRole],
                                        $div = $target.closest('div'),
                                        $ul = $div.next('ul'),
                                        $i = $ul.siblings('div').children('i'),
                                        liNumber = $ul.children('li').length,
                                        $rightCtn, callback = that.callback, listData;

                                    if (eventRole && tabData) {

                                        $rightCtn = $(this).next(".aui-tabtree-right-container");
                                        listData = {};
                                        listData.children = tabData;

                                        helper && (listData.helper = helper);

                                        $rightCtn.empty().append(artTemplate('html_overviewTabTreeList', listData));


                                        callback && callback($rightCtn);


                                        if (!$div.hasClass('active')) {
                                            $('[data-event-role="' + oldEventRole + '"]').removeClass('active');
                                            $div.addClass('active');
                                            oldEventRole = eventRole;
                                        }
                                    }
                                    if (liNumber > 0 && $target.closest('i').length) {
                                        if ($ul.hasClass('open')) {

                                            $ul.removeClass('open').addClass('hide');
                                            $i.removeClass(CONST.PAGE.COMMON_CLASS.ANGLE_UP);
                                            $i.addClass(CONST.PAGE.COMMON_CLASS.ANGLE_DOWN);
                                        } else {
                                            $ul.removeClass('hide').addClass('open');
                                            $i.removeClass(CONST.PAGE.COMMON_CLASS.ANGLE_DOWN);
                                            $i.addClass(CONST.PAGE.COMMON_CLASS.ANGLE_UP);
                                        }

                                    }

                                });


                            $(".aui-tabtree-left-container >ul>li:first-child>div", this.$ctn).trigger('click');

                        }
                    };
                    searchTabTree.fn.init.prototype = searchTabTree.fn;

                    return searchTabTree;
                }()),
                treeSelectV2: (function () {
                    var
                        popoverInstance,
                        Tree = function ($list, $search, $input, type, onlyTreeNode) {
                            var context = this;


                            context.tree = new AUI.tabTreeSearch($list, function () {
                                context.setValue.apply(context, arguments);
                            });

                            context.tree.helper = true;
                            context.$search = $search;
                            context.$input = $input;
                            context.type = type;
                            context.onlyTreeNode = onlyTreeNode;

                        },
                        $body = $('body');

                    Tree.prototype = {
                        constructor: Tree,
                        map: {},
                        refresh: function (key) {

                            this.tree.refresh(key);

                            this.key = key;
                            // this.map = AUI.data[this.tree.key].pathMap;
                            this.$ctn = this.tree.$ctn;
                            this.$input.val('');
                            this.$search.val('');
                        },

                        setValue: function ($el) {
                            var that = this,

                                $list = that.$search.next().next('.tree-select-list');

                            $(CONST.PAGE.DATA_CODE_ID_SELECTOR, $el).css('cursor', 'pointer');
                            $(CONST.PAGE.DATA_CODE_ID_SELECTOR, $el).off('.tabTree').on({
                                'click.tabTree': function (event) {
                                    var $e = $(event.target).closest('li'),
                                        id = $e.attr('data-code-id') || '',
                                        map = dataModel.get(that.key).pathMap,
                                        text;


                                    if (id) {
                                        if (id !== 'nothing') {
                                            that.$input.val(id);
                                        } else {
                                            that.$input.val('');
                                        }
                                        if (text = map[id]) {
                                            text = text.substr(text.lastIndexOf('>') + 1);
                                        } else {
                                            text = "无";
                                        }

                                        that.$search.val(text || map[id]).attr('title', map[id]);
                                        that.$input.trigger('change');
                                        $list.addClass('hide');
                                        popoverInstance.close();

                                    }
                                }
                            });

                        },
                        setSelectValue: function (arr) {
                            var map = dataModel.get(this.key).pathMap,
                                oldIdV1, oldIdV2, id, text;
                            if (arr && arr.length) {
                                id = arr[0] || '';

                                if (id !== 'nothing') {
                                    this.$input.val(id);
                                } else {
                                    this.$input.val('');
                                }

                                //有分号版本
                                if (id[id.length - 1] !== ';') {
                                    oldIdV2 = id + ';';
                                } else {
                                    oldIdV2 = id;
                                }

                                //换行版本
                                oldIdV1 = oldIdV2.replace(/;/, '\n');

                                text = map[id] || map[oldIdV2] || map[oldIdV1];


                                this.$search.attr('title', text);


                                if (text) {
                                    text = text.substr(text.lastIndexOf('>') + 1);
                                } else {
                                    text = "无";
                                }

                                this.$search.val(text);
                                this.$input.trigger('change');
                            }
                        },
                        getText: function () {
                            return this.$search.val();
                        }
                    };

                    return function ($input, option) {
                        var $ctn,
                            $search,
                            $list,

                            _option = option || {},
                            panelHeight = _option.panelHeight || '100%',
                            marginTop = _option.marginTop || 0;

                        if ($input.attr("data-wrap")) {
                            $ctn = $input.parent();

                            $search = $ctn.children("[data-role=search]");

                            $list = $ctn.children("[data-role=list]");
                        } else {
                            $input.attr("data-wrap", "true");
                            $input.wrap('<div data-role="wrap" class="tree-select-ctn ' + $input.attr('class') + '"/>');

                            $input.addClass('hide');

                            $ctn = $input.parent();

                            $search = $('<input data-role="search" type="text" class="tree-select-search"/>');
                            $ctn.append($search);
                            $ctn.append('<i class="aui aui-yunhang tree-select-icon-arrow"></i>');

                            $list = $('<div data-role="list" class="tree-select-list hide"/>')
                                .css({
                                    maxHeight: panelHeight
                                });
                            $ctn.append($list);
                            $search.on({
                                'keyup.treeSelect': function () {
                                    var val = this.value,

                                        nodes = $list.find('.tree-select-node'),
                                        len = nodes.length,
                                        node,
                                        $showNodes = $(),
                                        $hideNodes = $();


                                    if (val) {
                                        $list.removeClass('hide');
                                        val = val.toLowerCase();
                                    }

                                    while (node = nodes[--len]) {
                                        (~node.textContent.toLowerCase().indexOf(val) ? $showNodes : $hideNodes).push(node);
                                    }

                                    $hideNodes.hide();
                                    $showNodes.show();
                                    //父级显示
                                    $showNodes.parents('ul').prev('.tree-select-node').show();
                                    //子集显示
                                    $('.tree-select-node', $showNodes.next()).show();
                                },
                                'focus.treeSelect': function (e) {
                                    var $target = $(e.target || event.srcElement),
                                        $modal,

                                        offset = $target.parent().offset(),
                                        ctnWidth = $ctn.parent().width(),
                                        css = {},
                                        namespace = app.getUID();

                                    // this.value='';
                                    // $(this).trigger('change');
                                    $target.next('i').addClass('icon-drop');
                                    if (($modal = $ctn.closest('.modal')) && $modal.length) {
                                        css.width = $ctn.width() - 40;
                                        css.right = offset.left - $ctn.width();
                                        /*   if(css.top<offset.top){
                                         css.top-=$input.outerHeight();
                                         }*/
                                        css.top = 73;
                                        css.height = $modal.children('.modal-body').height();
                                    } else if (AUI.edmLock) {  //在edm配置面板
                                        css.width = $ctn.width();
                                        css.left = 0;
                                    } else {
                                        css.width = ctnWidth + 20;
                                        css.left = ctnWidth + 20;
                                    }

                                    app.popover({
                                        $elem: $target,
                                        title: $target.parent().prev().html(),
                                        content: '',
                                        width: '100%',
                                        height: '99%',
                                        focusable:false,
                                        init: function (popInstance) {
                                            var $popoverBody = $(this).find('.aweb-popover-body');
                                            $popoverBody.append($list.removeClass('hide').detach());

                                            popoverInstance = popInstance;
                                        },
                                        confirmHandler: function () {
                                            $target.closest('.aweb-popover').focus();
                                        }

                                    });

                                    $list.css(css);

                                    $body.on('click.' + namespace, function (e) {
                                        var $target = $(e.target || window.event.srcElement);

                                        if (!$target.closest($list).length && !$target.closest($search).length) {
                                            // $list.addClass('hide');
                                            $body.off('.' + namespace);
                                            $search.next('i').removeClass('icon-drop');

                                        }
                                    });
                                }
                            });
                        }
                        return new Tree($list, $search, $input, _option.type, _option.onlyTreeNode);
                    }
                })(),
                capitalize: function (string) {
                    var words = string.split('');

                    words[0] = words[0].toUpperCase();
                    return words.join('');

                },
                auiSwitch: function ($input, value, callback) {
                    var $ctn,

                        id = 'vue' + app.getUID(),
                        ins,
                        option = {
                            selected: !!value
                        };


                    $input.attr('data-wrap', 'true').addClass('hide').wrap('<div id="' + id + '" class="aui-switcher-ctn"/>');

                    $ctn = $input.parent();
                    $ctn.append('<span data-role="switcher" class="aui-switcher-core" v-bind:class="{checked:selected}"><span class="aui-switcher-yes">是</span><span class="aui-switcher-no">否</span></span>');

                    ins = new Vue({
                        el: '#' + id,
                        data: option
                    });

                    $ctn = $('#' + id);
                    $input = $(':input', $ctn);

                    $('[data-role="switcher"]', $ctn).on('click.switch', function (e) {
                        ins.selected = !ins.selected;
                        $input
                            [ins.selected ? 'attr' : 'removeAttr']('checked', 'checked')
                            .trigger('change.switch');

                    });

                    $(':input', $ctn).on({
                        'change.switch': function (e) {
                            if (callback) {
                                callback.call(this, e, this.checked);
                            }
                        }
                    });
                },
                Nav: (function () {
                    function Nav(option) {
                        if (option) {
                            this.$context = option.$context || $('#auiNavTabsRightGroup');
                            this.attr = option.attr;
                            this.init();
                        }
                    }

                    Nav.prototype = {
                        constructor: Nav,
                        constant: {
                            BTN_TEMP: '<button id="_ID_" type="button" title="_title_" class="aui-btn _class__name_">' +
                            '<i class="aui _icon__class_"></i>' +
                            '</button>',
                            VERSION_TAG_TEMP: '<div style="display: inline-block;vertical-align: middle;"> 版本：_version_</div>'
                        },
                        init: function () {
                            var
                                html = [],
                                i, item,

                                version,

                                BTN_TEMP = this.constant.BTN_TEMP;

                            for (i = -1; item = this.attr[++i];) {

                                html.push(BTN_TEMP.replace(/_ID_/, item.id || '')
                                    .replace(/_class__name_/, item.btnClass || '')
                                    .replace(/_icon__class_/, item.iconClass || '')
                                    .replace(/_title_/, item.title || '')
                                )
                            }

                            version = window.version;

                            version = this.constant.VERSION_TAG_TEMP.replace(/_version_/, version.substring(version.indexOf('_') + 1));

                            this.$context.empty().append(html.join('') + version);
                        }
                    };

                    new Nav(auiApp.nav);
                }()),

                editorInit: function () {
                    //初始化权限角色
                    external.getRole(function (data) {
                        dataModel.get('role').insert(data);
                    });

                    //初始化数据实体列表
                    external.getEDM(function (data) {
                        dataModel.set('edmModel', app.taffy(data));
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
                            //  AUI.data.agreeBusEdmModel = app.taffy(newData);

                        }

                    });

                    //获取页面路径
                    external.getWebContentPath(function (path) {
                        dataModel.setConfigValue('webContentPath', path);
                    });


                    //获取AUI的配置并初始化菜单
                    AUI.getPageConfig(function () {

                        AUI.resumeDataModel($(CONST.PAGE.CONTENT_FRAME.EDITOR_CTN), CONST.WIDGET.PAGE_TYPE, CONST.WIDGET.PAGE_HREF, function (pageWidget) {

                            var treeMap = {},
                                i, ins, id,
                                j, item, items,
                                pageWidgetList,
                                auiContentFrame,
                                _resumeWidget = function () {

                                    var widget;
                                    ++i;
                                    if (i < pageWidgetList.length) {
                                        ins = pageWidgetList[i];

                                        if (treeMap[ins.pID]) {
                                            widget = $AW(ins.pID);
                                            if (widget.length && treeMap[ins.cID]) {

                                                if (widget.acceptable() === false) {
                                                    _resumeWidget();
                                                } else {
                                                    widget.append(null, _resumeWidget, ins.cID, dataModel.get('structure')().first().widgetID);
                                                }

                                            }
                                        }
                                    } else {

                                    }
                                };

                            dataModel.get('structure')({active: true}).each(function (instance) {
                                treeMap[instance.widgetID] = {
                                    children: [].concat(instance.children)
                                };
                            });


                            pageWidgetList = [{
                                pID: '',
                                cID: pageWidget.id()
                            }];
                            i = -1;
                            while (ins = pageWidgetList[++i]) {
                                id = ins.cID;

                                if (ins = treeMap[id]) {
                                    items = ins.children;
                                    for (j = -1; item = items[++j];) {
                                        if (treeMap[item]) {
                                            pageWidgetList.push({
                                                pID: id,
                                                cID: item
                                            });
                                        } else {

                                        }
                                    }
                                } else {

                                }
                            }
                            pageWidgetList.shift();
                            i = -1;

                            _resumeWidget();


                            (auiContentFrame = app.router.page.auiContentFrame) && auiContentFrame.done(function () {
                                $AW.trigger($AW._STATUS.CONTENT_FRAME.LOAD); //内容树的加载
                            });

                            (app.router.page.auiConfigureFrame) && app.router.page.auiConfigureFrame.done(function () {
                                $AW.trigger($AW._STATUS.CONFIGURE_FRAME.OPTION_LOAD, dataModel.get('uuid'));
                                //oWidgetNew.config();
                            });


                            // (app.router.page.auiConfigureFrame)  && app.router.page.auiConfigureFrame.done(function () {
                            //
                            // })
                            //


                        }, function (config, data, $auiFrame) {
                            var list = CONST.DATA.list,
                                taffyList = CONST.DATA.taffyList,
                                i, item,
                                page;


                            //恢复数据模型
                            for (i = list.length; item = list[--i];) {
                                config[item] && (data[item] = config[item]);
                            }

                            for (i = taffyList.length; item = taffyList[--i];) {
                                config[item] && (data[item] = app.taffy(config[item]));
                            }

                            config.structure && (data.structure = app.taffy(config.structure));

                            config.widget && (data.widget = app.taffy(config.widget));

                            config.customCode && (data.customCode = config.customCode);//自定义代码
                            app.router.page.auiCustomCodeFrame && app.router.page.auiCustomCodeFrame.done(function () {
                                $AW.trigger($AW._STATUS.CUSTOM_CODE_FRAME.LOAD);
                            });


                            page = data.structure({type: CONST.WIDGET.PAGE_TYPE}).first();

                            if (page && page.widgetID && page.widgetID !== dataModel.get('uuid')) {
                                config = JSON.parse(JSON.stringify(config).replace(new RegExp(page.widgetID, 'gi'), dataModel.get('uuid')));
                                config.uuid = dataModel.get('uuid');

                                external.saveConfigure(config, function () {
                                    document.location.reload(true);
                                });
                            }
                            return data;
                        });


                        // AUI.editorLayout = AUI.Layout.Editor();
                    });
                },
                developmentOpen: function (href, title, has) {
                    var frames = window.frames,
                        time = 0,
                        open = function () {
                            if (href) {
                                frames = $("iframe");
                                for (i = -1; frame = frames[++i];) {
                                    if (frame && ~frame.src.indexOf(CONST.MODE.DOCS)) {
                                        docWindow = frame.contentWindow;
                                    }
                                }

                                if ((data = dataModel.get('menu')({href: href}).get()) && data.length) {
                                    name = data[0].name;
                                }
                                name = title || name || '无标题页面';

                                docWindow.Docs.openWidgetDetails(href, name);
                                if (has) {
                                    app.performance.longDelay(function () {
                                        domID = href.replace(/\./g, '-');
                                        docWindow.Docs.scrollTo(domID, has);
                                    });
                                }

                            }
                        },
                        frame, i, docWindow, name, data, domID;

                    if (!app.router.page.auiDevelopmentFrame) {
                        time = 3000;
                    }

                    AUI.openPage(CONST.PAGE.DEVELOPMENT_FRAME.SELF, function () {
                        setTimeout(function () {
                            open();
                        }, time);

                    })
                },
                openPage: function (pageName, callback) {

                    var page = app.router.page[pageName];

                    if (!page) {
                        page = app.router.open({path: CONST.AS_NEEDED_OPNE[pageName]});
                    }

                    page.done(function () {
                        app.router.setActive(pageName);
                        callback && callback();
                    })
                },
                setConfigureTabVisible: function ($el, visible) {

                    var $context = $el.parent().parent(),
                        id = $el.attr('id'),
                        $li = $('[data-href=' + id + ']', $context),
                        STYLE_STATUS = CONST.STYLE_STATUS;

                    $li[visible ? 'removeClass' : 'addClass'](STYLE_STATUS.HIDE);

                    if (visible && $li.hasClass(STYLE_STATUS.ACTIVE)) {
                        $el.removeClass(STYLE_STATUS.HIDE)
                    } else {

                        $el.addClass(STYLE_STATUS.HIDE);
                        $('li:first', $context).trigger('click');
                    }
                },


                /*锁管理*/
                //恢复锁
                resumingLock: undefined,
                //配置锁
                configLock: false,
                currentWidgetID: undefined,
                //数据实体模型锁
                edmLock: false,
                currentEdmID: undefined,
                currentEdmUpdatingIndex: undefined,

                //应用撤销锁
                stepLock: false,
                //预览锁
                previewLock: false,
                //保存锁
                savingLock: false,
                //鼠标滚动锁
                mouseWheelLock: false,
                currentOverviewEntrance: undefined,
                /*版本号*/
                version: CONST.VERSION,

                /*
                 *   desp    awos 统一版本号
                 *   version 4.3
                 *   author  lijiancheng@Agree.com.cn
                 *   date    20170509 1431
                 *   format  version+new func version+debugger version
                 * */
                awosAppUnitedVersion: CONST.awosAppUnitedVersion
            }
        ;


        return AUI
    });
})();