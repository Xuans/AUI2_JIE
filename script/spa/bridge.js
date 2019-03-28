/**
 * 兼容性代码，桥接代码（断层兼容）
 * @author lijiancheng@cfischina.com
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($) {
        'use strict';

        var AUI, CONST,
            MODE,


            WIDGET_CONST={
                TYPE:{
                    COMPONENT:'component',
                    CUSTOM:'custom'
                }
            },


            Editor = function (data) {
                var SPA_UNLOAD = CONST.LIFECYCLE.SPA_ACTION.UNLOAD,
                    SPA_UNLOAD_TEXT = CONST.LIFECYCLE.LIFECYCLE_TEXT.SPA.unload,
                    LIFECYCLE_AJAX = CONST.LIFECYCLE.CODE.AJAX;

                if (data.version) {
                    if (data.version < 421703) {
                        data.structure().update({css: {}});

                        data.widget().update({css: {}});
                    }
                }

                return data;
            },

            Creator = function (data) {
                var widget = data.widget,
                    newWidget = [];


                widget().each(function (item) {
                    if (item.version < 421702) {
                        item.css = {};
                    }

                    if (item.version < 440001) {
                        item = Widget(JSON.stringify(item));
                    }

                    newWidget.push(item);
                });


                widget().remove();
                widget.insert(newWidget);

                return data;
            },

            Builder = function (data) {

                /*4.2.17.3  将组件的css置空*/
                if (data.version < 421703) {
                    data.widget().update({css: {}, version: CONST.AWOS_APP_UNITED_VERSION});
                }

                return data;
            },

            Widget = (function () {
                var API_TYPE_MAP = {
                        UNIVERSAL: 'universal',

                        EDM: 'edm',
                        GETTER: 'getter',
                        SETTER: 'setter',
                        VALIDATE_SUCCESS_CALLBACK: 'successCallback',
                        VALIDATE_ERROR_CALLBACK: 'errorCallback',
                        VALIDATE_CLEAN_CALLBACK: 'cleanCallback',
                        VALIDATE_HANDLER: 'validateHandler',


                        EVENT: 'event',

                        BEHAVIOR: 'behavior',
                        DATA_FLOW:'dataFlow'

                    },
                    PARAMS_TYPE_MAP = {
                        URL: 'url',
                        OPTION: 'option',
                        EVENT: 'event',
                        JQUERY: 'jQuery'
                    },
                    REGEX = {
                        WIDGET_ID_SELF: '%%_WID%%',
                        WIDGET_VAR_SELF: '%%_WID_VAR%%',

                        URL_SELF: '"%%_URL%%"',

                        EVENT_HANDLER_EXP: '##_EVENT##',
                        EVENT_HANDLER_REPLACEMENT: 'E',
                        EVENT_HANDLER_REPLACEMENT_LOWERCASE: 'e',


                        OPTION: '##_OPTION##',
                        OPTION_REPLACEMENT: 'auiCtx.configs.widgetID',

                        WIDGET_INS_API_EXP: /##_VAR##.([^(]+)\((([^)]+)?)\)/i,


                        EDM_IO: /%%_WID_VAR%%.([^(]+)\((([^)]+)?)\)/i,
                        SETTER: '设置',
                        GETTER: '获取',

                        RESPONSE_DATA: '##_RESPONSE_DATA##',
                        RESPONSE_DATA_EXP: /##_RESPONSE_DATA##/ig,
                        RESPONSE_DATA_REPLACEMENT: '传入数据',

                        AJAX_OPTION: '##_AJAX_OPTION##',

                        INTERFACE_EXP: /\.?([^(]+)/i,

                        VALIDATE_EXP: /##_VAR##\./ig,
                        VALIDATE_REPLACEMENT: ''
                    },
                    ASYNC = {
                        AJAX: 'ajax',
                        API_FIRST: 'api'
                    },
                    hasNoAttr = function (href) {
                        console.log('该组件attr异常');
                    },
                    cannotHandlerApi = function (href, api) {
                        console.log('无法处理组件' + href + '的接口（' + api + '）。');
                    },
                    cannotOverrideApi = function (href, api) {
                        console.log('组件' + href + '的接口（' + api + '）重复。');
                    },
                    combineApi = function (href, api) {
                        console.log('合并组件' + href + '的接口（' + api + '）。');
                    },
                    multipleArgs = function (href, api) {
                        console.log('组件' + href + '的接口（' + api + '）有多个参数。');
                    },
                    conflictApi = function (href, api) {
                        console.error('组件' + href + '的接口（' + api + '）有冲突！');
                    },
                    upgradeWidget = function (widgetConfig) {
                        var ARGS = {
                            URL: {
                                type: 'url',
                                desp: '后台服务地址',
                                name: 'url'
                            },

                            EVENT_HANDLER: {
                                type: 'event',
                                desp: '事件句柄',
                                name: 'e'
                            },

                            OPTION: {
                                type: 'option',
                                desp: '组件实例配置',
                                name: 'option'
                            },

                            GETTER: {
                                type: 'string',
                                desp: '返回数据',
                                name: 'data'
                            },
                            SETTER: {
                                type: 'string',
                                desp: '传入数据',
                                name: 'data'
                            },

                            VALIDATE_SUCCESS_CALLBACK: {
                                agrs: [{
                                    name: '$input',
                                    desp: '表单元素的jQuery对象',
                                    type: 'jQuery'
                                }]
                            },
                            VALIDATE_ERROR_CALLBACK: {
                                agrs: [{
                                    name: '$input',
                                    type: 'jQuery',
                                    desp: '表单元素的jQuery对象'
                                }, {
                                    name: 'errorMsg',
                                    type: 'string',
                                    desp: '错误信息'
                                }]
                            },
                            VALIDATE_HANDLER: {
                                args: [{
                                    name: 'value',
                                    type: 'string',
                                    desp: '表单元素校验值'
                                }],
                                ret: {
                                    type: 'object',
                                    desp: '校验结果对象',
                                    name: 'result',
                                    children: [{
                                        type: 'boolean',
                                        desp: '校验结果',
                                        name: 'result'
                                    }, {
                                        name: 'value',
                                        type: 'string',
                                        desp: '表单元素校验值'
                                    }, {
                                        name: 'errorMsg',
                                        type: 'string',
                                        desp: '校验结果错误信息'
                                    }]
                                }
                            },

                            BEHAVIOR: [{
                                type: 'boolean',
                                desp: '比较结果',
                                name: 'result'
                            }, {
                                type: 'string',
                                desp: '比较值1',
                                name: 'input1'
                            }, {
                                type: 'string',
                                desp: '比较值2',
                                name: 'input2'
                            }, {
                                type: 'handler',
                                desp: '比较条件',
                                name: 'condition'
                            }],

                            AJAX_OPTION: {
                                type: 'object',
                                desp: '异步请求参数',
                                name: 'option'
                            },

                            _DEFAULT: {
                                type: 'object'
                            }
                        };

                        var href = widgetConfig.href,

                            config, subConfig,
                            i, item, items, len,
                            j, subItem, subItems,
                            k, child, children,
                            api, params, args, apiObj, match,
                            apiArr = [], apiMap = {},

                            js;

                        //check attr
                        if (!widgetConfig.attr || !widgetConfig.attr.length) {
                            hasNoAttr(href);
                        } else {
                            for (items = widgetConfig.attr, i = items.length; item = items[--i];) {
                                if (item.name === 'id') {
                                    if (!item.defaultValue) {
                                        item.defaultValue = 'widgetID';
                                    }
                                    break;
                                }
                            }
                        }

                        //check has own js
                        if ((js = widgetConfig.deps) && (js = js.js) && js.length) {
                            if (!js.includes(href)) {
                                console.log(href);
                            }
                        }

                        //event.handler
                        if (config = widgetConfig.event) {

                            if ((items = config.handler) && items.length) {
                                for (i = -1; item = items[++i];) {
                                    if (match = item.value.match(REGEX.WIDGET_INS_API_EXP)) {
                                        api = match[1];
                                        params = match[2];
                                        args = [];


                                        apiObj = {
                                            name: api,
                                            type: API_TYPE_MAP.EVENT,
                                            desp: item.desp,
                                            args: args
                                        };


                                        if (params && (params = params.split(',')) && params.length) {
                                            for (j = -1; subItem = params[++j];) {
                                                switch (subItem.toUpperCase()) {
                                                    case REGEX.EVENT_HANDLER_REPLACEMENT:
                                                    case REGEX.EVENT_HANDLER_EXP:
                                                        args.push(ARGS.EVENT_HANDLER);

                                                        break;
                                                    case REGEX.URL_SELF:

                                                        apiObj.type = API_TYPE_MAP.DATA_FLOW;

                                                        args.push(ARGS.URL);

                                                        break;

                                                    default:

                                                        if (subItem.indexOf(REGEX.OPTION) !== -1) {
                                                            args.push({
                                                                type: ARGS.OPTION.type,
                                                                desp: ARGS.OPTION.desp,
                                                                name: subItem.replace(REGEX.OPTION, REGEX.OPTION_REPLACEMENT)
                                                            });
                                                        } else {
                                                            cannotHandlerApi(href, subItem);
                                                        }
                                                }
                                            }
                                        }

                                        if (!apiMap[api]) {
                                            apiMap[api] = apiObj;
                                            apiArr.push(apiObj);
                                        }/* else {
											api = apiMap[api];
											api.type += ' ' + API_TYPE_MAP.EVENT;
											combineApi(href, api);
										}*/
                                    }
                                }
                            }

                            delete config.handler;
                        }


                        //edm

                        if (config = widgetConfig.edm) {

                            //edm.get
                            if ((items = config.get) && items.length) {
                                for (i = -1; item = items[++i];) {
                                    //lower then 4.2
                                    if (item.value === REGEX.WIDGET_ID_SELF) {
                                        api = item.value;

                                        params = ARGS.GETTER;

                                        if (!apiMap[api]) {
                                            apiObj = {
                                                name: api,
                                                type: API_TYPE_MAP.GETTER,
                                                desp: item.desp.replace(/[“']?%%_NAME%%['”]?/ig, ''),
                                                args: [],
                                                ret: params
                                            };


                                            apiMap[api] = apiObj;
                                            apiArr.push(apiObj);
                                        }/* else {
											apiMap[api].type += ' ' + API_TYPE_MAP.GETTER;
											apiMap[api].ret = params;
											combineApi(href, api);
										}*/
                                    } else if (match = item.value.match(REGEX.EDM_IO)) {

                                        api = match[1];

                                        params = match[2];

                                        args = [];

                                        if (params && (subItems = params.split(',')).length) {
                                            for (j = -1; subItem = subItems[++j];) {
                                                args.push({
                                                    type: ARGS._DEFAULT,
                                                    desp: subItem,
                                                    name: subItem
                                                });
                                            }
                                            multipleArgs(href, api);
                                        }

                                        if (!apiMap[api]) {
                                            apiObj = {
                                                name: api,
                                                type: API_TYPE_MAP.GETTER,
                                                desp: item.desp.replace(/[“']?%%_NAME%%['”]?/ig, ''),
                                                args: args,
                                                ret: JSON.parse(JSON.stringify(ARGS.GETTER))
                                            };

                                            apiMap[api] = apiObj;
                                            apiArr.push(apiObj);
                                        } /*else {

											apiMap[api].type += ' ' + API_TYPE_MAP.GETTER;

											if (apiMap[api].args && apiMap[api].args.length) {
												//do nothing
											} else {
												apiMap[api].args = args;
											}

											combineApi(href, api);

										}*/

                                    } else {
                                        cannotOverrideApi(href, item);
                                    }
                                }
                            }


                            //edm.set
                            if ((items = config.set) && items.length) {
                                for (i = -1; item = items[++i];) {
                                    //lower then 4.2
                                    if (item.value === REGEX.WIDGET_ID_SELF) {
                                        api = item.value;

                                        args = [ARGS.SETTER];

                                        if (!apiMap[api]) {
                                            apiObj = {
                                                name: api,
                                                type: API_TYPE_MAP.SETTER,
                                                desp: item.desp.replace(/[“']?%%_NAME%%['”]?/ig, ''),
                                                args: args
                                            };

                                            apiMap[api] = apiObj;
                                            apiArr.push(apiObj);
                                        }/* else {
											apiMap[api].type += ' ' + API_TYPE_MAP.SETTER;
											apiMap[api].args = args;
											combineApi(href, api);
										}*/
                                    } else if (match = item.value.match(REGEX.EDM_IO)) {

                                        api = match[1];
                                        params = match[2];
                                        args = [];

                                        if (params && (subItems = params.split(',')).length) {
                                            for (j = -1; subItem = subItems[++j];) {
                                                args.push({
                                                    type: ARGS._DEFAULT.type,
                                                    desp: subItem.replace(REGEX.RESPONSE_DATA_EXP, REGEX.RESPONSE_DATA_REPLACEMENT),
                                                    name: subItem
                                                });
                                            }
                                            multipleArgs(href, api);
                                        } else {
                                            args = [ARGS.SETTER];
                                        }

                                        if (!apiMap[api]) {
                                            apiObj = {
                                                name: api,
                                                type: API_TYPE_MAP.SETTER,
                                                desp: item.desp.replace(/[“']?%%_NAME%%['”]?/ig, ''),
                                                args: args
                                            };


                                            apiMap[api] = apiObj;
                                            apiArr.push(apiObj);
                                        } /*else {
											apiMap[api].type += ' '+API_TYPE_MAP.SETTER;
											apiMap[api].args = args;
											combineApi(href, api);

										}*/

                                    } else {
                                        cannotOverrideApi(href, item);
                                    }
                                }
                            }


                            //edm.validate
                            if (config = config.validate) {
                                //edm.validate.successCallback
                                if (subConfig = config.successCallback) {
                                    if ((items = subConfig.valueArray) && items.length) {
                                        for (i = -1; item = items[++i];) {
                                            api = item.replace(REGEX.VALIDATE_EXP, REGEX.VALIDATE_REPLACEMENT);

                                            if (!apiMap[api]) {
                                                apiArr.push(apiMap[api] = {
                                                    name: api,
                                                    type: API_TYPE_MAP.VALIDATE_SUCCESS_CALLBACK,
                                                    desp: subConfig.despArray[i],
                                                    args: ARGS.VALIDATE_SUCCESS_CALLBACK.agrs
                                                });
                                            } else {
                                                conflictApi(href, api);
                                            }
                                        }
                                    }
                                }


                                //edm.validate.errorCallback
                                if (subConfig = config.errorCallback) {
                                    if ((items = subConfig.valueArray) && items.length) {
                                        for (i = -1; item = items[++i];) {
                                            api = item.replace(REGEX.VALIDATE_EXP, REGEX.VALIDATE_REPLACEMENT);

                                            if (!apiMap[api]) {
                                                apiArr.push(apiMap[api] = {
                                                    name: api,
                                                    type: API_TYPE_MAP.VALIDATE_ERROR_CALLBACK,
                                                    desp: subConfig.despArray[i],
                                                    args: ARGS.VALIDATE_ERROR_CALLBACK.agrs
                                                });
                                            } else {
                                                conflictApi(href, api);
                                            }
                                        }
                                    }
                                }


                                //edm.validate.cleanCallback
                                if (subConfig = config.cleanCallback) {
                                    if ((items = subConfig.valueArray) && items.length) {
                                        for (i = -1; item = items[++i];) {
                                            api = item.replace(REGEX.VALIDATE_EXP, REGEX.VALIDATE_REPLACEMENT);

                                            if (!apiMap[api]) {
                                                apiArr.push(apiMap[api] = {
                                                    name: api,
                                                    type: API_TYPE_MAP.VALIDATE_CLEAN_CALLBACK,
                                                    desp: subConfig.despArray[i],
                                                    args: [ARGS.EVENT_HANDLER]
                                                });
                                            } else {
                                                conflictApi(href, api);
                                            }
                                        }
                                    }
                                }


                                //edm.validate.validateHandler
                                if (subConfig = config.validateHandler) {
                                    if ((items = subConfig.valueArray) && items.length) {
                                        for (i = -1; item = items[++i];) {
                                            api = item.replace(REGEX.VALIDATE_EXP, REGEX.VALIDATE_REPLACEMENT);

                                            if (!apiMap[api]) {
                                                apiArr.push(apiMap[api] = {
                                                    name: api,
                                                    type: API_TYPE_MAP.VALIDATE_HANDLER,
                                                    desp: subConfig.despArray[i],
                                                    args: ARGS.VALIDATE_HANDLER.args,
                                                    ret: ARGS.VALIDATE_HANDLER.ret
                                                });
                                            } else {
                                                conflictApi(href, api);
                                            }
                                        }
                                    }
                                }


                                //edm.validate.validateSelector
                                if (subConfig = config.validateSelector) {
                                    if ((items = subConfig.valueArray) && items.length) {

                                        subItem = (widgetConfig.event || (widgetConfig.event = {}));
                                        subItem = (subItem.selector || (subItem.selector = []));

                                        for (i = -1; item = items[++i];) {
                                            subItem.push({
                                                value: item,
                                                desp: subConfig.despArray[i]
                                            });
                                        }

                                    }
                                }

                                //edm.validate.validateType
                                if (subConfig = config.validateType) {
                                    if ((items = subConfig.valueArray) && items.length) {

                                        subItem = (widgetConfig.event || (widgetConfig.event = {}));
                                        subItem = (subItem.type || (subItem.type = []));

                                        for (i = -1; item = items[++i];) {
                                            subItem.push({
                                                value: item,
                                                desp: subConfig.despArray[i]
                                            });
                                        }

                                    }
                                }

                            }
                        }
                        delete widgetConfig.edm;


                        //action
                        if ((config = widgetConfig.action) && config.length) {
                            for (i = -1; item = config[++i];) {

                            	if(item.deps===ASYNC.AJAX) {
		                            item.type = API_TYPE_MAP.EDM;
		                            item.edmType = API_TYPE_MAP.SETTER;
	                            }

                                switch (item.type) {
                                    case API_TYPE_MAP.EVENT:
                                        if (match = item.code.match(REGEX.WIDGET_INS_API_EXP)) {
                                            api = match[1];
                                            params = match[2];
                                            args = [];

                                            apiObj = {
                                                name: api,
                                                type: API_TYPE_MAP.EVENT,
                                                desp: item.desp,
                                                args: args
                                            };

                                            if (params && (params = params.split(',')) && params.length) {

                                                for (j = -1; subItem = params[++j];) {

                                                    switch (subItem.toUpperCase()) {
                                                        case REGEX.EVENT_HANDLER_REPLACEMENT:
                                                        case REGEX.EVENT_HANDLER_EXP:

                                                            args.push(ARGS.EVENT_HANDLER);

                                                            break;
                                                        case REGEX.URL_SELF:

                                                            apiObj.type=API_TYPE_MAP.DATA_FLOW;

                                                            args.push(ARGS.URL);

                                                            break;

                                                        default:
                                                            if (subItem.indexOf(REGEX.OPTION) !== -1) {
                                                                args.push({
                                                                    type: ARGS.OPTION.type,
                                                                    desp: ARGS.OPTION.desp,
                                                                    name: subItem.replace(REGEX.OPTION, REGEX.OPTION_REPLACEMENT)
                                                                });
                                                            } else {
                                                                cannotHandlerApi(href, subItem + ' ' + REGEX.EVENT_HANDLER_REPLACEMENT);
                                                            }
                                                    }
                                                }
                                            }

                                            if (!apiMap[api]) {
                                                apiMap[api] = apiObj;
                                                apiArr.push(apiObj);
                                            } /*else {
												api = apiMap[api];
												api.type += ' ' + API_TYPE_MAP.EVENT;
												combineApi(href, api);
											}*/
                                        } else {
                                            cannotOverrideApi(href, item);
                                        }
                                        break;
                                    case API_TYPE_MAP.EDM:
                                        switch (item.edmType) {
                                            case API_TYPE_MAP.GETTER:
                                                if (match = item.code.match(REGEX.WIDGET_INS_API_EXP)) {
                                                    api = match[1];
                                                    params = match[2];
                                                    args = [ARGS.GETTER];

                                                    apiObj = {
                                                        name: api,
                                                        type: API_TYPE_MAP.GETTER,
                                                        desp: item.desp,
                                                        args: args
                                                    };

                                                    if (params && (params = params.split(',')) && params.length) {

                                                        for (j = -1; subItem = params[++j];) {

                                                            switch (subItem.toUpperCase()) {
                                                                case REGEX.RESPONSE_DATA:
                                                                    args.push(ARGS.SETTER);
                                                                    break;
                                                                default:
                                                                    cannotHandlerApi(href, subItem);
                                                            }
                                                        }
                                                    }

                                                    if (!apiMap[api]) {
                                                        apiMap[api] = apiObj;
                                                        apiArr.push(apiObj);
                                                    } /*else {
														api = apiMap[api];
														api.type += ' ' + API_TYPE_MAP.GETTER;
														combineApi(href, api);
													}*/
                                                } else {
                                                    cannotOverrideApi(href, item);
                                                }
                                                break;
                                            case API_TYPE_MAP.SETTER:
                                                if (match = item.code.match(REGEX.WIDGET_INS_API_EXP)) {
                                                    api = match[1];
                                                    params = match[2];
                                                    args = [];

                                                    apiObj = {
                                                        name: api,
                                                        type: API_TYPE_MAP.SETTER,
                                                        deps: ASYNC.AJAX,
                                                        order:item.order,
                                                        lifecycle:item.spaLife,
                                                        desp:item.desp,
                                                        args: args
                                                    };

                                                    if (params && (params = params.split(',')) && params.length) {

                                                        for (j = -1; subItem = params[++j];) {

                                                            switch (subItem.toUpperCase()) {
                                                                case REGEX.RESPONSE_DATA:
                                                                    args.push(ARGS.SETTER);
                                                                    break;
                                                                case REGEX.AJAX_OPTION:
                                                                    args.push(ARGS.AJAX_OPTION);
                                                                    break;
                                                                default:
                                                                    cannotHandlerApi(href, subItem);
                                                            }
                                                        }
                                                    }

                                                    if (!apiMap[api]) {
                                                        apiMap[api] = apiObj;
                                                        apiArr.push(apiObj);
                                                    } /*else {
														api = apiMap[api];
														api.type += ' ' + API_TYPE_MAP.SETTER;
														combineApi(href, api);
													}*/
                                                } else {
                                                    cannotOverrideApi(href, item);
                                                }
                                                break;
                                            default:
                                                cannotHandlerApi(href, item.code);
                                                break;
                                        }
                                        break;
                                    case API_TYPE_MAP.BEHAVIOR:
                                        if (match = item.code.match(REGEX.WIDGET_INS_API_EXP)) {
                                            api = match[1];
                                            args = ARGS.BEHAVIOR;

                                            apiObj = {
                                                name: api,
                                                type: API_TYPE_MAP.BEHAVIOR,
                                                desp: item.desp,
                                                args: args,
                                                hasValue:false
                                            };


                                            if (!apiMap[api]) {
                                                apiMap[api] = apiObj;
                                                apiArr.push(apiObj);
                                            } else {
                                                conflictApi(href, api);
                                            }
                                        } else {
                                            cannotOverrideApi(href, item);
                                        }
                                        break;
                                    default:
                                        if (match = item.code.match(REGEX.WIDGET_INS_API_EXP)) {
                                            api = match[1];
                                            params = match[2];
                                            args = [];

                                            apiObj = {
                                                name: api,
                                                type: API_TYPE_MAP.UNIVERSAL,
                                                desp: item.desp,
                                                order: item.order,
                                                deps: item.deps,
                                                args: args,
                                                lifecycle: item.spaLife
                                            };

                                            if (params && (params = params.split(',')) && params.length) {
                                                for (j = -1; subItem = params[++j];) {
                                                    switch (subItem.toUpperCase()) {
                                                        case REGEX.RESPONSE_DATA:
                                                            args.push(ARGS.SETTER);

                                                            break;
                                                        case REGEX.AJAX_OPTION:
                                                            args.push(ARGS.AJAX_OPTION);
                                                            break;
                                                        default:
                                                            cannotHandlerApi(href, subItem);
                                                    }
                                                }
                                            }

                                            if (!apiMap[api]) {
                                                apiMap[api] = apiObj;
                                                apiArr.push(apiObj);
                                            }/* else {
												api = apiMap[api];
												api.type += ' ' + API_TYPE_MAP.UNIVERSAL;

												delete apiObj.type;

												$.extend(true, api, apiObj);

												combineApi(href, api);
											}*/
                                        } else {
                                            cannotOverrideApi(href, item);
                                        }

                                        break;
                                }
                            }
                        }
                        delete widgetConfig.action;

                        //interfaces
                        if (config = widgetConfig.interfaces) {
                            for (i = -1; item = config[++i];) {
                                subConfig = item.name;

                                api = '';
                                for (j = -1, subItems = [REGEX.WIDGET_INS_API_EXP, REGEX.EDM_IO, REGEX.INTERFACE_EXP]; subItem = subItems[++j];) {
                                    if ((match = subConfig.match(subItem)) && match.length) {
                                        api = match[1];

                                        break;
                                    }
                                }

                                if (apiMap[api]) {
                                    api = apiMap[api];

                                    if (item.params && item.params.length) {
                                        for (k = -1, children = item.params; child = children[++k];) {
                                            if (!api.args[k]) {
                                                api.args[k] = child;

                                                //console.log('external args', child);

                                            } else if (child.children && child.children.length) {
                                                api.args[k].type=child.type;
                                                api.args[k].children = child.children;
                                                //console.log('children', child.children);
                                            }
                                        }
                                    }

                                    api.ret = item.returnValue;
                                    api.code = item.code;
                                } else {
                                    cannotHandlerApi(href, api);
                                }
                            }
                        }
                        delete widgetConfig.interfaces;


                        //api add to config
                        for (i = apiArr.length; item = apiArr[--i];) {
                            item.returnValue = item.ret;
                            item.params = item.args;

                            delete item.ret;
                            delete item.args;
                        }
                        widgetConfig.api = apiArr;


                        //delete callback
                        delete widgetConfig.callback;


                        deleteEmptyProperty(widgetConfig);

                        return widgetConfig;
                    },
                    transformApiToOldFormat = function (widgetConfig) {
                        var TYPE = API_TYPE_MAP,
                            validate,
                            interfaces,
                            value,
                            i, item, items,
                            j, subItem, subItems,
                            k, child, children,
                            temp, str;



                        /*
                        * resume the old format
                        * */
                        //edm
                        widgetConfig.edm = {
                            get: [],
                            set: [],
                            validate: {
                                successCallback: {
                                    valueArray: [],
                                    despArray: [],
                                    defaultValue: ''
                                },
                                validateSelector: {
                                    valueArray: [],
                                    despArray: [],
                                    defaultValue: ''
                                },
                                errorCallback: {
                                    valueArray: [],
                                    despArray: [],
                                    defaultValue: ''
                                },
                                cleanCallback: {
                                    valueArray: [],
                                    despArray: [],
                                    defaultValue: ''
                                },
                                validateHandler: {
                                    valueArray: [],
                                    despArray: [],
                                    defaultValue: ''
                                },
                                validateType: {
                                    valueArray: [],
                                    despArray: [],
                                    defaultValue: ''
                                }
                            }
                        };
                        validate = widgetConfig.edm.validate;

                        //event.handler
                        widgetConfig.event = widgetConfig.event || {};
                        widgetConfig.event.handler = [];
                        //action
                        if (widgetConfig.href !== CONST.WIDGET.PAGE_HREF || auiApp.mode !== CONST.MODE.VIEWER) {

                            widgetConfig.action = [{
                                code: ASYNC.AJAX,
                                deps: ASYNC.AJAX,
                                desp: '异步请求',
                                spaLife: 'load,resume',
                                pageLife: 'init,interval'
                            }];
                        }


                        //interfaces
                        interfaces = widgetConfig.interfaces = [];



                        //transform
                        if (items = widgetConfig.api) {
                            for (i = -1; (item = items[++i]) && item.type;) {
                                subItems = item.type.split(' ');

                                for (j = -1; subItem = subItems[++j];) {
                                    switch (subItem) {
                                        case TYPE.GETTER:

                                            item.value = value = item.name.toUpperCase() === REGEX.WIDGET_ID_SELF ? REGEX.WIDGET_ID_SELF : '_parseFunction_%%_WID_VAR%%' + (item.name?'.'+item.name:'') + '()';

                                            if (item.desp && item.desp.replace) {
                                                widgetConfig.edm.get.push({
                                                    desp: '“%%_NAME%%”' + item.desp.replace(REGEX.GETTER, '').replace(REGEX.SETTER, ''),
                                                    value: value,
                                                    dataType:item.returnValue && item.returnValue.type
                                                });
                                            }
                                            break;
                                        case TYPE.SETTER:

                                            item.value = value = item.name.toUpperCase() === REGEX.WIDGET_ID_SELF ? REGEX.WIDGET_ID_SELF : '_parseFunction_%%_WID_VAR%%' + (item.name?'.'+item.name:'')+ '(##_RESPONSE_DATA##)\n';

                                            if (item.desp && item.desp.replace) {
                                                widgetConfig.edm.set.push({
                                                    desp: '“%%_NAME%%”' + item.desp.replace(REGEX.GETTER, '').replace(REGEX.SETTER, ''),
                                                    value: value
                                                });


	                                            //兼容旧版4.1以下版本
	                                            item.oldValue=('##_var##.' + item.name + '(data)\n');
	                                            widgetConfig.action.push({
		                                            spaLife:item.lifecycle,
		                                            pageLife:'init,interval',
		                                            code: item.oldValue,
		                                            desp:item.desp+'（兼容模式）',
		                                            deps:ASYNC.AJAX,
                                                    order:item.order
	                                            });

                                                item.newValue = ('##_var##.' + item.name + (item.order ? '(##_AJAX_OPTION##)\n' : '(##_RESPONSE_DATA##)\n'));
                                                widgetConfig.action.push({
                                                    spaLife:item.lifecycle,
                                                    pageLife:'init,interval',
                                                    code: item.newValue,
                                                    desp:item.desp,
                                                    deps:ASYNC.AJAX,
                                                    order:item.order
                                                });
                                            }


                                            break;
                                        case TYPE.VALIDATE_SUCCESS_CALLBACK:
                                        case TYPE.VALIDATE_ERROR_CALLBACK:
                                        case TYPE.VALIDATE_CLEAN_CALLBACK:
                                        case TYPE.VALIDATE_HANDLER:

                                            item.value = value = '##_var##.' + item.name+'\n';

                                            temp = validate[subItem];

                                            temp.valueArray.push(value);
                                            temp.despArray.push(item.desp);

                                            if (!temp.defaultValue) {
                                                temp.defaultValue = '##_var##.' + item.name;
                                            }

                                            break;

                                        case TYPE.EVENT:
                                        case TYPE.DATA_FLOW:
                                            str = [];

                                            if (children = item.params) {
                                                for (k = -1; child = children[++k];) {
                                                    switch (child.type) {
                                                        case PARAMS_TYPE_MAP.URL:
                                                            str.push(REGEX.URL_SELF);
                                                            break;

                                                        case PARAMS_TYPE_MAP.OPTION:
                                                            str.push(child.name.replace(REGEX.OPTION_REPLACEMENT, REGEX.OPTION));
                                                            break;

                                                        case PARAMS_TYPE_MAP.EVENT:
                                                            str.push(REGEX.EVENT_HANDLER_REPLACEMENT_LOWERCASE);
                                                            break;
                                                        default:
                                                            str.push(child.name);
                                                            break;
                                                    }
                                                }
                                            }

                                            item.value = value = '_parseFunction_function (e){return ##_VAR##.' + item.name + '(' + str.join(',') + ');}';
                                            item.newValue = ('##_VAR##.' + item.name + '(' + str.join(',')+')\n');

                                            widgetConfig.event.handler.push({
                                                value: value,
                                                desp: item.desp,
                                                deps:item.deps,
                                                order:item.order
                                            });

                                            break;
                                        case TYPE.BEHAVIOR:

                                            item.value = value = '##_var##.' + item.name + '(##_RESULT##,##_INPUT1##,##_INPUT2##,##_CONDITION##)\n';

                                            widgetConfig.action.push({
                                                code: value,
                                                type: subItem,
                                                desp: '显示隐藏行为'
                                            });

                                            break;
                                        case TYPE.UNIVERSAL:
                                        default:
                                            str = [];

                                            if (children = item.params) {

                                                if (item.deps === ASYNC.AJAX) {

                                                    if (item.order === ASYNC.API_FIRST) {
                                                        str.push(REGEX.AJAX_OPTION);
                                                    } else {
                                                        str.push(REGEX.RESPONSE_DATA);
                                                    }

                                                    k = 0;
                                                } else {
                                                    k = -1;
                                                }

                                                for (; child = children[++k];) {
                                                    switch (child.type) {
                                                        case PARAMS_TYPE_MAP.URL:
                                                            str.push(REGEX.URL_SELF);
                                                            break;

                                                        case PARAMS_TYPE_MAP.OPTION:
                                                            str.push(item.name.replace(REGEX.OPTION_REPLACEMENT, REGEX.OPTION));
                                                            break;

                                                        case PARAMS_TYPE_MAP.EVENT:
                                                            str.push(REGEX.EVENT_HANDLER_REPLACEMENT_LOWERCASE);
                                                            break;
                                                        default:
                                                            str.push('"' + child.name + '"');
                                                            break;
                                                    }
                                                }
                                            }

                                            item.value = value = '##_var##.' + item.name + '(' + str.join(',') + ')\n';

                                            widgetConfig.action.push({
                                                code: value,
                                                desp: item.desp,
                                                type: subItem,
                                                deps: item.deps,
                                                order: item.order,
                                                spaLife: item.lifecycle,
                                                pageLife: 'init,interval'
                                            });


                                            break;
                                    }

                                    interfaces.push({
                                        name: item.value,
                                        params: item.params || item.args,
                                        returnValue: item.returnValue || item.ret
                                    });
                                }
                            }
                        }

                        if(items=widgetConfig.event){
                            if((subItems=items.type) && subItems.length){
                                children = widgetConfig.edm.validate.validateType;

                                for(j=-1;subItem=subItems[++j];){
                                    if(!children.defaultValue) {
                                        children.defaultValue = subItem.value;
                                    }
                                    children.despArray.push(subItem.desp);
                                    children.valueArray.push(subItem.value);
                                }
                            }

                            if((subItems=items.selector) && subItems.length){
                                children = widgetConfig.edm.validate.validateSelector;

                                for(j=-1;subItem=subItems[++j];){
                                    if(!children.defaultValue) {
                                        children.defaultValue = subItem.value;
                                    }
                                    children.despArray.push(subItem.desp);
                                    children.valueArray.push(subItem.value);
                                }
                            }

                        }


                        return widgetConfig;
                    };

                return function (widget) {
                    var code;

                    if (typeof widget === 'string') {
                        widget = JSON.parse(widget);
                    }

                    if ((typeof widget.version === 'string') || (widget.version < 440001)) {
                        widget = upgradeWidget(widget);
                    }

                    widget = transformApiToOldFormat(widget);
                    addInfo(widget);

                    delete widget.___id;
                    delete widget.___s;

                    widget.version = CONST.AWOS_APP_UNITED_VERSION;

                    return widget;
                }
            }()),

            //兼容转换
            Bridge = function (mode, data) {
                var code,item,i;
                switch (mode) {
                    case MODE.EDITOR:
                    case MODE.INSPECTOR:
                        data = Editor(data);
                        break;
                    case MODE.WIDGET_CREATOR:
                        data = Creator(data);
                        break;
                    case MODE.WIDGET_BUILDER:
                        data = Builder(data);
                        break;
                    case MODE.THEME:
                        /*data = Fresher(data);*/
                        break;
                    case 'WIDGET':
                        data = Widget(data);
                        return data;
                        break;
                }

				//update version into the united version
                data.version =CONST.AWOS_APP_UNITED_VERSION;

                
                //删除逻辑概览的冗余
                if (data.code) {
                    data.code().each(function(codeItem, index) {
                        delete codeItem.dataJSON;
                    })
                }


              //  console.log(data.code && JSON.parse(JSON.stringify(data.code().get())))
                //逻辑概览变量兼容
				if (data.code && data.var && !data.var().get().length) {

					data.code().each(function (codeItem, index) {
						if ($.isArray(codeItem.var)) {
							// codeListDB.insert(codeItem.var);
							// varDB.insert(codeItem.var);
							data.var.insert(codeItem.var);
						}
						delete codeItem.var;
						delete codeItem.varList;
					});

					if(data.frame&& (code=data.frame.code) && code.length ){
                        for(i=-1;item=code[++i];){
                            if ($.isArray(item.var)) {
                                // codeListDB.insert(codeItem.var);
                                // varDB.insert(codeItem.var);
                                data.var.insert(item.var);
                            }
                            delete item.var;
                            delete item.varList;
                        }
                    }

                }
                return data;
            },


            deleteEmptyProperty = function (object) {
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
                        deleteEmptyProperty(value);
                        if (isEmpty(value)) {
                            delete object[i];
                        }
                    } else if (!(object instanceof Array)) {
                        if (value === '' || value === null || value === undefined) {
                            delete object[i];
                        }
                    }
                }
            },

            addInfo = function(widget){
                var info,i;
                //info
                if (!widget.info) {
                    info = {};
                    for (i in CONST.INFO_MAP) {
                        info[i] = widget[i];
                        // delete widget[i];
                    }
                    widget.info = info;
                }
            },

            isEmpty = function (object) {
                var name;

                for (name in object) {
                    return false;
                }
                return true;
            };

        Bridge.changeWidgetPType=function(data){

            //项目级href和pType不一致
            if(data.href && data.href.indexOf(WIDGET_CONST.TYPE.CUSTOM)===0 && data.pType===WIDGET_CONST.TYPE.COMPONENT) {
	            data.pType = WIDGET_CONST.TYPE.CUSTOM;
            }

            return data;
        };

        //Bridge.deleteEmptyProperty = deleteEmptyProperty;
        Bridge.reverseInfo  = function(widgetData){
	        var i;
	        for (i in CONST.INFO_MAP) {
		        widgetData[i] = widgetData.info[i];
	        }
        };
        Bridge.addInfo = addInfo;


        require(['index','const'], function (_AUI,_CONST) {
            AUI =_AUI;
            CONST = _CONST;

            MODE = CONST.MODE;
        });

        return Bridge;
    });
})();