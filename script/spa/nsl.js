(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", 'index','const', 'config.widget', 'base', 'config.language','Model.Data'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, global,CONST, WidgetConfig, base, languageConfig,dataModel) {
        "use strict";


       var nslPath=CONST.CONFIG_PATH[window.auiApp.FILE_TYPE].nsl,
           nsl = {
            langConfigOnlyAttrMap: {
                'name': {
                    name: 'name',
                    type: 'string_input',
                    desp: '主键标识',
                    details: '该字符串唯一标识'
                },
                'key': {
                    name: 'key',
                    type: 'string_input',
                    desp: '需翻译的字符串'
                }
            },
            langSelectedObjListDefault: [{
                name: 'zh-CN',
                desp: '中文(简体)'
            }],
            defaultProperty: [{
                name: 'SFIRST',
                key: '首页',
                range: 'global',
                value: {
                    'zh-CN': '首页'
                }
            }, {
                name: 'SLAST',
                key: '尾页',
                range: 'global',
                value: {
                    'zh-CN': '尾页'
                }
            }, {
                name: 'SEMPTYTABLE',
                key: '无数据',
                range: 'global',
                value: {
                    'zh-CN': '表中无数据'
                }
            }, {
                name: 'SINFOEMPTY',
                key: '表中数据',
                range: 'global',
                value: {
                    'zh-CN': '表中数据'
                }
            }, {
                name: 'SINFO',
                key: '显示第 _START_ 条到第 _END_ 条，共 _TOTAL_ 条数据',
                range: 'global',
                value: {
                    'zh-CN': '显示第 _START_ 条到第 _END_ 条，共 _TOTAL_ 条数据'
                }
            }, {
                name: 'SINFOFILTERED',
                key: '(共搜索到 _MAX_ 条数据)',
                range: 'global',
                value: {
                    'zh-CN': '(共搜索到 _MAX_ 条数据)'
                }
            }, {
                name: 'SLENGTHMENU',
                key: '每页显示 _MENU_ 条数据',
                range: 'global',
                value: {
                    'zh-CN': '每页显示 _MENU_ 条数据'
                }
            }, {
                name: 'SLOADINGRECORDS',
                key: '加载中...',
                range: 'global',
                value: {
                    'zh-CN': '加载中...'
                }
            }, {
                name: 'SPROCESSING',
                key: '请稍等...',
                range: 'global',
                value: {
                    'zh-CN': '请稍等...'
                }
            }, {
                name: 'SSEARCHPLACEHOLDER',
                key: '请输入查询信息',
                range: 'global',
                value: {
                    'zh-CN': '请输入查询信息'
                }
            }, {
                name: 'SZERORECORDS',
                key: '找不到相关数据',
                range: 'global',
                value: {
                    'zh-CN': '找不到相关数据'
                }
            }
            ],
            langConfigAttr: [{
                name: 'property',
                type: 'array',
                desp: '需翻译的字符串',
                attrInEachElement: [
                    {
                        name: 'name',
                        type: 'string_input',
                        desp: '主键标识（需输入英文大写）',
                        details: '该字符串唯一标识'
                    }, {
                        name: 'key',
                        type: 'string_input',
                        desp: '需翻译的字符串'
                    }, {
                        name: 'value',
                        type: 'object',
                        desp: '语言值',
                        attr: [{
                            name: 'zh-CN',
                            type: 'string_input',
                            desp: '中文（简体）'
                        }, {
                            name: 'en-US',
                            type: 'string_input',
                            desp: '英文(美国）'
                        }]
                    }]
            }],
            //生成国际化配置编辑器面板
            renderTranslatorConfig: function (config, renderID) {
                var
                    langConfigAttr, langConfigObj,
                    langConfigMap = languageConfig.langConfigMap,
                    i, j, updateCallback,
                    translatorConfigVueInstance,

                    globalProperty = [],

                    langSelectedObjList = (config.lang && config.lang.length) ? config.lang : nsl.langSelectedObjListDefault,
                    langSelectedLength = langSelectedObjList.length,

                    langDespSelectedList = [],
                    property = (config.property && config.property.length) ? config.property : nsl.defaultProperty,

                    langDespSelectedConfigAttr = [],
                    langConfigOnlyAttrMap = nsl.langConfigOnlyAttrMap,
                    langDespListAvailable = languageConfig.langDespList;


                //动态生成语言配置选项
                for (i = 0; i < langSelectedLength; i++) {
                    if (langSelectedObjList[i]) {
                        langDespSelectedList.push(langSelectedObjList[i].desp);
                        langDespSelectedConfigAttr.push({
                            name: langSelectedObjList[i].name,
                            type: 'string_input',
                            desp: langSelectedObjList[i].desp
                        })
                    }
                }

                //筛选范围

                for (j = 0; j < property.length; j++) {
                    switch (property[j].range) {
                        case 'global':
                            //全局范围内把主键名的global隐藏掉
                            property[j].name = property[j].name.replace(/^GLOBAL\./, '');
                            globalProperty.push(property[j]);
                            break;

                        default:
                            break;
                    }
                }

                langConfigAttr = [{
                    tabPanes: [{
                        name: 'language',
                        desp: '语言',
                        type: 'object',
                        attr: [{
                            name: 'language',
                            desp: '语言',
                            type: 'multiple_select',
                            despArray: langDespListAvailable,
                            valueArray: langDespListAvailable
                        }]
                    }, {
                        name: 'property',
                        type: 'array',
                        desp: '需翻译的字符串',
                        attrInEachElement: [
                            {
                                name: 'name',
                                type: 'string_input',
                                desp: '主键标识（需输入英文大写）',
                                details: '该字符串唯一标识'
                            }, {
                                name: 'key',
                                type: 'string_input',
                                desp: '需翻译的字符串'
                            }, {
                                name: 'value',
                                type: 'object',
                                desp: '语言值',
                                attr: langDespSelectedConfigAttr
                            }]
                    }],
                    type: 'tab'
                }];

                langConfigObj = {};

                updateCallback = function (args) {
                    var newValue = args.newValue,
                        i, length, newPropertyList, item,
                        checkedMap = {}, upperCaseRegExp,
                        changedKey = args.key,
                        checkRepetition = function () {
                            newPropertyList = args.newObj.property;
                            length = newPropertyList.length;

                            for (i = 0; i < length; i++) {
                                item = newPropertyList[i];
                                if (checkedMap[item[changedKey]]) {
                                    app.alert(langConfigOnlyAttrMap[changedKey].desp + newValue + '"重复，请重新输入', app.alert.ERROR)

                                } else {
                                    checkedMap[item[changedKey]] = newPropertyList[i];
                                }
                            }
                        };

                    switch (changedKey) {
                        //实时同步需翻译字符串语言值
                        case 'language':
                            length = newValue.length;
                            langDespSelectedConfigAttr = [];
                            for (i = 0; i < length; i++) {
                                langDespSelectedConfigAttr.push({
                                    name: langConfigMap[newValue[i]].name,
                                    type: 'string_input',
                                    desp: newValue[i]
                                })
                            }
                            translatorConfigVueInstance.array[0].tabPanes[1].attrInEachElement[2].attr = langDespSelectedConfigAttr;
                            break;

                        case  'key':
                            checkRepetition();
                            break;

                        case 'name':
                            upperCaseRegExp = /\b[A-Z]+\b/;
                            if (upperCaseRegExp.test(newValue)) {
                                checkRepetition();
                            } else {
                                newValue = newValue.toUpperCase();
                                eval(args.modelSelector.replace(/instanceObj/, 'translatorConfigVueInstance.obj') + '= newValue')
                            }
                            break;

                        default:
                            //do nothing
                            break;
                    }
                    // console.log(args);
                };

                //生成baseConfig要求的参数格式
                langConfigObj.language = {language: langDespSelectedList};
                langConfigObj.property = globalProperty;

                //渲染面板
                translatorConfigVueInstance = base.baseConfig(renderID, langConfigObj, langConfigAttr, updateCallback);

                return {
                    langConfigObj: langConfigObj,
                    langConfigAttr: langConfigAttr
                }

            },


            //在业务组件、页面模板、首页布局生成配置面板
            renderPanelConfig: function (oWidget, renderID) {
                var
                    langSelectedObjList,
                    langDespSelectedConfigAttr = [],
                    langConfigAttr,
                    langConfigObj,
                    panelVueInstance,

                    config = oWidget[0].data,
                    i, length, updateCallback;

                external.getProjectName(function (projectName) {
                    if (projectName) {
                        external.getFile(nslPath.replace(/@projectName/, projectName), function (content) {
                            langSelectedObjList = JSON.parse(content).hasOwnProperty('lang') ? JSON.parse(content).lang : [];

                            length = langSelectedObjList.length;
                            //生成语言配置项
                            for (i = 0; i < length; i++) {
                                if (langSelectedObjList[i]) {
                                    langDespSelectedConfigAttr.push({
                                        name: langSelectedObjList[i].name,
                                        type: 'string_input',
                                        desp: langSelectedObjList[i].desp
                                    })
                                }

                            }
                            langConfigAttr = [{
                                name: 'property',
                                type: 'array',
                                desp: '需翻译的字符串',
                                attrInEachElement: [
                                    {
                                        name: 'name',
                                        type: 'string_input',
                                        desp: '主键标识（需输入英文大写）',
                                        details: '该字符串唯一标识'
                                    }, {
                                        name: 'key',
                                        type: 'string_input',
                                        desp: '需翻译的字符串'
                                    }, {
                                        name: 'value',
                                        type: 'object',
                                        desp: '语言值',
                                        attr: langDespSelectedConfigAttr
                                    }]
                            }];
                            updateCallback = function (args) {
                                var newValue = args.newValue,
                                    upperCaseRegExp,
                                    changedKey = args.key,


                                    checkRepetition = function () {
                                        var item, newPropertyList, i, length,
                                            langConfigOnlyAttrMap = nsl.langConfigOnlyAttrMap,
                                            checkedMap = {},
                                            checkPropertyList = [];
                                        if (args.newObj.hasOwnProperty('property')) {
                                            newPropertyList = args.newObj.property;
                                            length = newPropertyList.length;


                                            for (i = 0; i < length; i++) {
                                                item = newPropertyList[i];

                                                if (checkedMap[item[changedKey]]) {
                                                    app.alert(langConfigOnlyAttrMap[changedKey].desp + newValue + '"重复，只保存第一个，请重新输入', app.alert.ERROR);
                                                } else {

                                                    checkedMap[item[changedKey]] = newPropertyList[i];
                                                    checkPropertyList.push(item);

                                                }
                                            }
                                            oWidget.update({nsl: checkPropertyList});

                                        }
                                    };
                                switch (changedKey) {

                                    case  'key':
                                        checkRepetition();
                                        break;

                                    case 'name':
                                        upperCaseRegExp = /\b[A-Z]+\b/;
                                        if (upperCaseRegExp.test(newValue)) {
                                            checkRepetition();
                                        } else {
                                            newValue = newValue.toUpperCase();
                                            eval(args.modelSelector.replace(/instanceObj/, 'panelVueInstance.obj') + '= newValue')
                                        }
                                        break;

                                    default:
                                        oWidget.update({nsl: args.newObj.property});
                                        break;
                                }

                                // oWidget.refresh(true, undefined, undefined, {
                                //     type: CONST.WIDGET.EVENT_TYPE.VALUE_CHANGE,
                                //     target: 'nsl'
                                // });

                                $AW.trigger($AW.STATUS.WIDGET_UPDATE, oWidget)

                            };
                            //获取当前配置nsl选项
                            langConfigObj = config.nsl ? config.nsl : [];
                            panelVueInstance = base.baseConfig(renderID, {property: langConfigObj}, langConfigAttr, updateCallback);

                        });
                    } else {

                        updateCallback = function (args) {

                            oWidget.update({nsl: args.newObj.property});

                            /*oWidget.refresh(true, undefined, undefined, {
                             type: CONST.WIDGET.EVENT_TYPE.VALUE_CHANGE,
                             target: 'nsl'
                             });*/

                            $AW.trigger($AW.STATUS.WIDGET_UPDATE, oWidget)

                        };

                        panelVueInstance = base.baseConfig(renderID, {}, nsl.langConfigAttr, updateCallback);

                    }

                });

            },

            saveFile: function (pageModule, pageName, data) {
                external.getProjectName(function (projectName) {
                    var fullPath = nslPath.replace(/@projectName/, projectName),
                        getFileSuccessCallback = function (content) {
                            var translatorConfigData = JSON.parse(content),
                                properties = translatorConfigData.property || [],
                                length = properties.length,
                                translatorData = {},
                                regExpObj = new RegExp('^' + pageModule + '\.' + pageName + '\..', 'g'),
                                list = data.frame ? data.frame.structure : data.structure,
                                newPropertiesList = [],
                                nsl, nslLength,
                                j, i, item,
                                saveFileSuccessCallback;


                            //抽取所有不在当前页面模型下的国际化配置
                            for (i = length; item = properties[--i];) {

                                if (!regExpObj.test(item.name)) {
                                    newPropertiesList.push(item)
                                }
                            }

                            length = list.length;

                            for (i = length; item = list[--i];) {
                                if ((nsl = item.nsl) && (nslLength = nsl.length)) {
                                    for (j = 0; j < nslLength; j++) {
                                        if (nsl[j].name && nsl[j].key) {
                                            switch (item.type) {
                                                case 'mainPanel':
                                                    newPropertiesList.push({
                                                        name: pageModule + '.' + pageName + '.' + nsl[j].name,
                                                        range: CONST.NSL.RANGE.PAGE,
                                                        key: nsl[j].key,
                                                        uuid: dataModel.get('uuid'),
                                                        value: nsl[j].value
                                                    });
                                                    break;

                                                default:
                                                    newPropertiesList.push({
                                                        name: pageModule + '.' + pageName + '.' + item.widgetID + '.' + nsl[j].name,
                                                        range: CONST.NSL.RANGE.WIDGET,
                                                        key: nsl[j].key,
                                                        uuid: dataModel.get('uuid'),
                                                        value: nsl[j].value
                                                    });
                                                    break;


                                            }

                                        }
                                    }
                                }
                            }

                            translatorConfigData.property = newPropertiesList;
                            translatorData.fullPath = fullPath;
                            translatorData.content = translatorConfigData;

                            saveFileSuccessCallback = function (result) {
                                if (result) {
                                    // console.log('国际化配置保存成功')
                                } else {
                                    // console.log('国际化配置保存失败')
                                }
                            };

                            external.saveFile(translatorData, saveFileSuccessCallback);

                        };


                    external.getFile(fullPath, getFileSuccessCallback);

                });
            },

//            saveDefaultZH_CNJSON:function(){
//                var defaultProperty = nsl.defaultProperty,
//                    i,len = defaultProperty.length,temp={},
//
//                    ZH_CNData={};
//
//                    for(i=0;i<len;i++){
//                        temp = defaultProperty[i];
//                        ZH_CNData[temp.key] = temp.value['zh-CN'];
//                    }
//
//                    external.getProjectName(function(projectName){
//                        var fullPath = '/@projectName/webContent/nls.zh_CN.json'.replace(/@projectName/,projectName);
//                        external.saveFile({
//                           fullPath:fullPath,
//                           content:ZH_CNData
//                        },function(result){
//                            if(result){
//                                console.log('获取国际化默认配置成功')
//                            }else{
//                                console.log('获取国际化默认配置失败')
//                            }
//                        })
//                    })
//
//                    console.log(ZH_CNData)
//            },


            //保存页面和组件的国际化配置文件
            saveTranslatorFile: function (data) {
                external.getConfigurePath(function (response) {
                    var pageModule, pageName,
                        indexLayoutRegExp = /index\.layout$/;

                    //首页布局保存
                    if (indexLayoutRegExp.test(response)) {
                        pageModule = CONST.NSL.LAYOUT;
                        pageName = CONST.NSL.INDEX;
                        nsl.saveFile(pageName, pageModule, data);
                        //页面模型保存文件
                    } else if ((pageModule = dataModel.get('pageModule')) && (pageName = dataModel.get('pageName'))) {
                        nsl.saveFile(pageName, pageModule, data)
                    }
                });
            },
            saveToIndexFile: function (langList) {
                external.getProjectName(function (projectName) {
                    var fullPath =nslPath.replace(/@projectName/, projectName);
                    external.getFile(fullPath, function (content) {
                        var viewerData = JSON.parse(content),
                            data = {};
                        viewerData.nsl || (viewerData.nsl = {}) && (viewerData.nsl.nslLanguage = langList);

                        data.fullPath = fullPath;
                        data.content = viewerData;

                        external.saveFile(data, function (result) {
                            if (result) {
                                // console.log('首页国际化配置保存成功')
                            } else {
                                // console.log('首页国际化配置保存失败')
                            }
                        });

                    })


                })
            },
            translatorConfig:function ($context, oWidget, setTabVisible) {

                var renderPanel = function () {
                    nsl.renderPanelConfig(oWidget, $context.attr('id'));
                    setTabVisible && setTabVisible(true);
                };


                if (aweb.translate) {
                    switch (auiApp.mode) {
                        case CONST.MODE.EDITOR:
                            // case CONST.MODE.WIDGET_CREATOR:
                            renderPanel();
                            break;

                        case CONST.MODE.THEME:
                            // case CONST.MODE.WIDGET_CREATOR:

                            break;

                        default:
                            switch (oWidget[0].type) {
                                case CONST.WIDGET.PAGE_TYPE:
                                    setTabVisible && setTabVisible(false);
                                    break;

                                default:
                                    renderPanel();
                                    break;
                            }
                            break;
                    }

                } else {
                    setTabVisible && setTabVisible(false)
                }

            }


        };


        return nsl;
    });
})();