/*!
 * Javascript library v3.0
 *
 * Date: 2016.05.19
 */
/**
 * @author lihao01@cfischina.com
 */
( /* <global> */function (undefined) {

    var MODE = {
        COMPILER: 'compiler'
    };

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            if (window.auiApp.mode === MODE.COMPILER) {
                define(["jquery", "taffy", 'compileDeps'], factory);
            } else {
                define(["jquery", "taffy", 'compileDeps', 'index'], factory);
            }
        }
        // global
        else {
            factory();
        }
    })
    (function ($, taffy, compileDeps, global) {
        'use strict';

        //CONST
        var
            //widget type
            WIDGET_TYPE = {
                FRAME: 'frame',
                THEME: 'theme',
                COMPLEX_WIDGET: {
                    frame: true,
                    viewer: true
                },
                PACKAGE: 'package'
            },
            WIDGET_HREF = {
                MAIN_PANEL: 'page.mainPanel'
            },
            APPLY_TO = {
                LIFECYCLE: 'lifecycle',
                EVENT: 'event',
                STRUCTURE: 'structure'
            },
            NOT_COMPILER = window.auiApp && window.auiApp.mode !== 'compiler',
            //aui ctx
            AUI_CONTEXT_REGEXP = /##_AUICTX##/ig,
            AUI_CONTEXT_REPLACEMENT = 'auiCtx',
            //eventType
            TYPE = {
                AJAX: 'ajax',
                ECHO: 'echo',
                CUSTOM: 'custom',
                MODAL: 'modal',
                SUB: 'sub',
                REDIRECT: 'redirect',
                SELF: 'self',
                WINDOW: 'window',
                POPOVER: 'popover'
            },
            PROPS = {
                PARAMS: 'auiCtx.pageParams.result',//注意这里是没有点号的

                ID: '',
                VAR: 'auiCtx.variables.',
                ATTR: 'auiCtx.attr.',
                CSS: 'auiCtx.css.',
                OPTION: 'auiCtx.configs.',
                VALIDATIONS: 'auiCtx.validations.',
                EVENT_CALLBACK: 'auiCtx.eventCallback.',
                AJAX_OPTION: 'auiCtx.ajaxOption.',
                LIFECYCLE: 'auiCtx.lifecycle.',
                WIDGET_LOADED_EVENTS: 'auiCtx.widgetLoadedEvents.',

                params: 'auiCtx.pageParams.result',
                id: '',
                'var': 'auiCtx.variables.',
                attr: 'auiCtx.attr.',
                option: 'auiCtx.configs.',
                validations: 'auiCtx.validations.',
                event: 'auiCtx.events',
                lifecycle: 'auiCtx.lifecycle.',
                pageNSL: 'auiCtx.pageNSL.',
                widgetNSL: 'auiCtx.widgetNSL.'
            },
            APPLY_TO_DESP = {
                EVENT: '事件配置',
                LIFECYCLE: '生命周期配置',
                EDM: '校验配置',
                REQUEST: '传输数据',
                RESPONSE: '返回数据',
                MODAL: '弹出框',
                modal: '弹出框',
                AJAX: '异步请求',
                ajax: '异步请求',
                REDIRECT: '打开新页面',
                redirect: '打开新页面',
                SUB: '打开子页面',
                sub: '打开子页面',
                POPOVER: '打开气泡页面',
                popover: '打开气泡页面',
                WINDOW: '打开新窗口',
                window: '打开新窗口'
            },

            //lifecycle4
            SPA_LIFE = {
                LOAD: 'load',
                PAUSE: 'pause',
                UNLOAD: 'unload',
                RESUME: 'resume'
            },
            PAGE_LIFE = {
                INIT: 'init',
                TIMEOUT: 'timeout',
                INTERVAL: 'interval'
            },
            //lifecycle
            SPA_UNLOAD = SPA_LIFE.UNLOAD,

            //regex 占位符
            //id
            ID_REGEXP = /##_ID##/ig,
            //widget
            FOREIGN_WIDGET_MATCH = /##(?:[^#_]+)_WID(?:_[^#]+)?##/ig,
            FOREIGN_WIDGET_REDUNDANCY = /(##|_WID(?:_[^#]+)?##)/g,
            FOREIGN_WIDGET_SPILT = /##([^#_]+)_WID(?:_([^#]+))?##/,
            WIDGET_MISSING = 'widgetMissing',
            //attr
            ATTR_REGEXP = /##_ATTR##/ig,
            ATTR_REPLACEMENT = PROPS.ATTR,
            //css
            CSS_REGEXP = /##_CSS##/ig,
            CSS_REPLACEMENT = PROPS.CSS,
            //option
            OPTION_REGEXP = /##_OPTION##/ig,
            OPTION_REGEXP_END = '_OPTION##',
            OPTION_REPLACEMENT = PROPS.OPTION,
            //validations
            VALIDATIONS_REPLACEMENT = PROPS.VALIDATIONS,
            VALIDATIONS_REDUNDANCY = ';',
            VALIDATE_PROPS = ['require', 'hasChineseCharacter', 'maxLength', 'minLength'],
            //AJAX
            AJAX_SHELTER_TEXT = '正在加载数据，请稍候…',
            AJAX_RESPONSE_PREFIX = 'response.content.result',
            AJAX_RESPONSE = 'response',
            AJAX_OPTION_REPLACEMENT = PROPS.AJAX_OPTION,
            AJAX_HANDLER = {
                ajaxType: {
                    POST: 'POST',
                    GET: 'GET',
                    'undefined': 'POST'
                },
                validate: {
                    'true': 'true',
                    'false': 'false',
                    '': 'true',
                    'undefined': 'true'
                },
                validateContinue: {
                    '': 'true',
                    'single': 'false',
                    'undefined': 'true'
                },
                validateErrorCallback: {
                    '': 'null',
                    'undefined': 'null',
                    'custom': 'function($elem,message){}',
                    'alert': 'function($elem,message){app.alert(message,app.alert.ERROR);}',
                    'focus': 'function($elem,message){$elem.focus();}',
                    'focusAndAlert': 'function($elem,message){$elem.focus();app.alert(message,app.alert.ERROR);}'
                }

            },
            AJAX_OPTION_REGEXP = /##_AJAX_OPTION##/ig,
            URL_REGEXP = /%%_URL%%/ig,
            AJAX_OPTION_STR = '##_AJAX_OPTION##',
            URL_DIVIDER = '"\/"',

            //response
            RESPONSE_DATA_REGEXP = /##_RESPONSE_DATA##/ig,

            //event
            EVENT_SPILT_REGEXP = /[^\d\w]/g,
            EVENT_CALLBACK_REPLACEMENT = PROPS.EVENT_CALLBACK,
            EVENT_SPILT_REPLACEMENT = '_',
            EVENT_HANDLER_REGEXP = /##_EVENT##/ig,


            //modal
            MODAL_PARAM_KEY = ['width', 'height'],
            UNIT = 'Unit',
            //window
            WINDOW_PARAM_KEY = ['fullscreen', 'displayNav'],
            //var
            VAR_REGEXP = /##_VAR##/ig,
            VAR_REPLACEMENT = PROPS.VAR,
            //lifecycle
            LIFECYCLE_REPLACEMENT = PROPS.LIFECYCLE,
            LIFECYCLE_ORDER = 'api',
            //widget loaded events
            WIDGET_LOADED_EVENTS_REPLACEMENT = PROPS.WIDGET_LOADED_EVENTS,
            WIDGET = 'WIDGET',
            //function
            FUNCTION_PREFIX = '_parseFunction_',
            FUNCTION_PREFIX_REPLACEMENT = /_parseFunction_/ig,
            //response
            PAGE_PARAMS = PROPS.PARAMS,

            //overview
            EXPRESSION_REPLACEMENT = /##_VALUE##/ig,
            GLOBAL_PARAM_PREFIX = 'g_globalParams.',
            PAGE_PARAM_PREFIX = 'pageParams.',
            OVERVIEW_AJAX_ANCHOR = '$.ajax',
            OVERVIEW_AJAX_METHOD = '$.ajax()',
            OVERVIEW_VARIABLES_PLACEMENT = 'OVERVIEW_VAR##',
            //OVERVIEW_VARIABLES_DIVIDER = '_',
            VAR_MAP = {
                'domain': GLOBAL_PARAM_PREFIX,
                'scope': PAGE_PARAM_PREFIX,
                'local': ''
            },

            OVERVIEW_FUNCTION_TYPE = {
                REQUEST: 'startData',
                RESPONSE: 'startSuccess',
                CUSTOM: ''
            },


            //$el
            PAGE_ELEMENT = /"##_\$el##"/g;

        var spaModuleTemplate = [
                'define((function (auiCtx) {',
                '"use strict";',
                'var $el,handler,scope,spaLifecycle;',
                '     "IDETAG";',
                '"CUSTOM_CODE";',
                '     "IDETAG";',
                '      if(!spaLifecycle){',
                '           spaLifecycle= {',
                '           	load: function (_$el, _scope, _handler) {',
                '                     auiCtx.pageParams = $.extend(true, _scope, app.domain.get("page"));',
                '                     auiCtx.context = this;',
                '                     $el=_$el,handler=_handler,scope=_scope;',
                '                     /*覆盖页面加载时的属性或方法*/',
                '                     /*覆盖auiCtx属性或方法 */',
                '                     auiCtx.auiCtxLoad.call(this, auiCtx,_$el, _scope, _handler);',
                '                     /*事件绑定*/',
                '                     this.delegateEvents.call(this,auiCtx.delegateEvents);',
                '           	},',
                '           	resume: function ($el, scope, handler) {',
                '                    /*覆盖页面恢复时的属性或方法*/',
                '           	   auiCtx.auiCtxResume.call(this, auiCtx,$el, scope, handler);',
                '           	},',
                '           	pause: function ($el, scope, handler) {',
                '                    /*覆盖页面切出时的属性或方法*/',
                '           	   auiCtx.auiCtxPause.call(this, auiCtx,$el, scope, handler);',
                '           	},',
                '           	unload: function ($el, scope, handler) {',
                '                    /*覆盖页面销毁时的属性或方法*/',
                '           	   auiCtx.auiCtxUnload.call(this, auiCtx,$el, scope, handler);',
                '           	}',
                '           };',
                '      }',
                'return spaLifecycle;',
                '})(function(){',
                '	var auiCtx,$el,scope,handler,',
                '       g_globalParams=aweb.globalVariables,',
                '       pageParams;',
                '       auiCtx={',
                '           WIDGET_CONFIG_NEWEST:##_WIDGET_CONFIG_NEWEST##,',
                '           external:{},',
                '	    	attr: {},',
                '	    	css: {},',
                '	    	configs: {},',
                '           pageNSL: [],',
                '           widgetNSL: {},',
                '	    	validations: {},',
                '	    	lifecycle: {},',
                '	    	variables: {},',
                '	    	ajaxOption: {},',
                '	    	eventCallback: {},',
                '	    	delegateEvents: {},',
                '	    	widgetLoadedEvents: {},',
                '	    	intervals: {},',
                '	    	auiCtxLoad: function (auiCtx,_$el, _scope, _handler) {',
                '               var configs=auiCtx.configs,attr=auiCtx.attr,css=auiCtx.css,variables=auiCtx.variables;',
                '               $el=_$el;pageParams=scope=_scope;handler=_handler;',
                '               auiCtx.$el=_$el;auiCtx.scope=_scope;auiCtx.handler=_handler;handler.auiCtx=auiCtx;',
                '           },',
                '	    	auiCtxResume: function (auiCtx,$el, scope, handler) {},',
                '	    	auiCtxPause: function (auiCtx,$el, scope, handler) {},',
                '	    	auiCtxUnload: function (auiCtx,$el, scope, handler) {}',
                '	    };',
                '	window.aweb&&window.aweb.debug&&(window.auiCtx=auiCtx);',
                '	return auiCtx;',
                '}()));'].join(''),
            getParsedString = function (ast) {
                var stream = UglifyJS.OutputStream({comments: true, beautify: true});
                if (ast) {
                    ast.print(stream);
                    return stream.toString();
                }
            };

        return function (config, widgetChange, viewerConfig, codeID) {
            //variables
            var
                //configures
                pageName = config.pageName || 'layout',
                pageModule = config.pageModule || 'index',
                widget = config.widget,
                structure = config.structure,
                lifecycle = config.lifecycle,
                events = config.event,
                request = config.request,
                response = config.response,
                overview = config.overview,
                // overview = undefined,
                code = config.code || app.taffy([]),
                varList = config.var || app.taffy([]),
                customCode=config.customCode,
                url = app.taffy(config.url),
                eventAccumulator = 0,


                //variables
                module = UglifyJS.parse(spaModuleTemplate.replace(/##_WIDGET_CONFIG_NEWEST##/g, widgetChange)),

                walker = new UglifyJS.TreeWalker(function (node) {
                    if (node.start.type === 'name') {
                        switch (node.start.value) {
                            case 'auiCtxLoad':
                                loadNode = node;
                                break;
                            case 'auiCtxPause':
                                pauseNode = node;
                                break;
                            case 'auiCtxResume':
                                resumeNode = node;
                                break;
                            case 'auiCtxUnload':
                                unloadNode = node;
                                break;

                            //aui context
                            case 'external':
                                externalNode = node;
                                break;
                            case 'attr':
                                if (node && node.value && node.value.properties) {
                                    attrNode = node;
                                }
                                break;
                            case 'css':
                                if (node && node.value && node.value.properties) {
                                    cssNode = node;
                                }
                                break;
                            case 'configs':
                                if (node && node.value && node.value.properties) {
                                    configsNode = node;
                                }
                                break;
                            case 'pageNSL':
                                pageNSLNode = node;
                                break;
                            case 'widgetNSL':
                                widgetNSLNode = node;
                                break;
                            case 'validations':
                                validationsNode = node;
                                break;
                            case 'ajaxOption':
                                ajaxNode = node;
                                break;
                            case 'eventCallback':
                                eventCallbackNode = node;
                                break;
                            case 'lifecycle':
                                lifecycleNode = node;
                                break;
                            case 'delegateEvents':
                                delegateEventsNode = node;
                                break;
                            case 'widgetLoadedEvents':
                                widgetLoadedEvents = node;
                                break;
                        }
                    }
                }),

                structureMap = {}, keyMap = {},
                widgetMap = {},

                //overview
                codeMap = {},
                varMap = {
                    domain: {},
                    scope: {}
                },


                loadNode, pauseNode, resumeNode, unloadNode, pageNSLNode, widgetNSLNode,
                externalNode, attrNode, cssNode, configsNode, validationsNode, ajaxNode, eventCallbackNode,
                lifecycleNode, delegateEventsNode, widgetLoadedEvents,
                loadTechWidgetList = [], loadBusinessWidgetList = [], loadWidgetApiList = [], loadLifecycleList = [],
                unloadTechWidgetList = [], unloadBusinessWidgetList = [], unloadWidgetApiList = [],

                codeInstance, globalParamDefineArr = [], pageParamDefineArr = [],
                varArr = {
                    'domain': globalParamDefineArr,
                    'scope': pageParamDefineArr
                },

                currentWidgetID, currentConfig, currentSubConfig, currentConfigName,


                lifecycleTryCatchBody,

                errorMsg = [],
                deps,
                result;

            //methods
            var
                //widget id
                getID = function (widgetID, checkOnly) {
                    var id, tempWidgetID;
                    if (!(id = keyMap[widgetID]) && (tempWidgetID = structure({widgetID: widgetID}).first())) {
                        keyMap[widgetID] = id = tempWidgetID.attr.id;
                    }

                    if (!id) {
                        !checkOnly && structure({widgetID: currentWidgetID}).first() && errorMsg.push(['组件"' + structure({widgetID: currentWidgetID}).first().attr.widgetName + '"' + currentConfig + '(' + currentConfigName + ')的' + currentSubConfig + '绑定元素没有配置或被删除。']);

                        id = keyMap[widgetID] = WIDGET_MISSING;
                    }

                    return id;
                },
                checkHasWidgetID = function (str) {
                    var result = true,
                        matches, item, len, props;

                    if (matches = str.match(FOREIGN_WIDGET_MATCH)) {
                        for (len = matches.length; item = matches[--len];) {
                            props = item.match(FOREIGN_WIDGET_SPILT);

                            result = result && hasWidgetID(props[1], true);
                        }
                    } else {
                        result = false;
                    }

                    return result;
                },
                hasWidgetID = function (widgetID, checkOnly) {
                    return getID(widgetID, checkOnly) !== WIDGET_MISSING;
                },
                transformWidgetKey = function (str, id) {
                    return str && id && str.replace(ID_REGEXP, id)
                            .replace(VAR_REGEXP, VAR_REPLACEMENT + id)
                            .replace(ATTR_REGEXP, ATTR_REPLACEMENT + id)
                            .replace(CSS_REGEXP, CSS_REPLACEMENT + id)
                            .replace(OPTION_REGEXP, OPTION_REPLACEMENT + id)
                            .replace(AUI_CONTEXT_REGEXP, AUI_CONTEXT_REPLACEMENT);
                },
                transformForeignKey = function (str) {
                    var matches, item, len, props, key;

                    str = str || '';

                    if (matches = str.match(FOREIGN_WIDGET_MATCH)) {
                        for (len = matches.length; item = matches[--len];) {
                            props = item.match(FOREIGN_WIDGET_SPILT);

                            key = getID(props[1]);

                            str = str.replace(item, PROPS[props[2] || 'ID'] + key);
                        }
                    }

                    return str.replace(AUI_CONTEXT_REGEXP, AUI_CONTEXT_REPLACEMENT);
                },

                cleanUndeclaredPlaceholder = function (str) {
                    return str.replace(/##_[^#]+##,?/g, '');
                },
                replaceFunctionPlaceHolder = function (str) {
                    return str &&
                        str
                            .replace(RESPONSE_DATA_REGEXP, AJAX_RESPONSE_PREFIX)
                            .replace(EVENT_HANDLER_REGEXP, 'e');
                },

                //function
                functionWalker = new UglifyJS.TreeWalker(function (node) {
                    var parent;

                    if (node instanceof UglifyJS.AST_String) {
                        parent = functionWalker.find_parent(UglifyJS.AST_ObjectKeyVal);
                        if (node.value.startsWith(FUNCTION_PREFIX)) {
                            parent.value = UglifyJS.parse("(" + node.value.replace(FUNCTION_PREFIX, '') + ")").body[0].body;
                        }
                    }
                }),
                transformFunction = function (node) {
                    var str;

                    //修复多层函数时，里面的函数没有被转化
                    str = getParsedString(node);
                    while (str.indexOf('"' + FUNCTION_PREFIX) !== -1 || str.indexOf("'" + FUNCTION_PREFIX) !== -1) {
                        node.walk(functionWalker);
                        str = getParsedString(node);
                    }

                    if (str.indexOf(FUNCTION_PREFIX) !== -1) {
                        node = UglifyJS.parse(str.replace(new RegExp(FUNCTION_PREFIX, 'gi'), ''));
                    }

                    return node;
                },

                //css
                delEmptyObj = (function () {
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

                //edm
                setDataObject = function (namespace, edmID, undefined) {
                    var code = [],
                        edm = edmID ? response({edmID: edmID}).first() : undefined,
                        list, prefix, staticPrefix, edmCollection,
                        loopTransformProcess = function (items) {
                            var seek = [],
                                i, item,
                                cursor, map = {};

                            for (i = -1; item = items[++i];) {
                                if (!item.pID) {
                                    seek.push(item);
                                }
                            }

                            i = -1;

                            staticPrefix = prefix || '';

                            while (item = seek[++i]) {
                                cursor = i;
                                if (item.uid) {

                                    staticPrefix = prefix;

                                    prefix = ((prefix || '') ? ((prefix || '') + '.') : '') + (item.alias || 'alias');

                                    list({pID: item.uid, active: true}).each(function (item) {

                                        if (item.uid) {
                                            map[item.uid] = {
                                                deep: 1,
                                                prefix: ((prefix || '') ? ((prefix || '') + '.') : '') + (item.alias || 'alias')
                                            };
                                            seek.splice.apply(seek, [cursor + 1, 0].concat(item));
                                        } else {

                                            if (map[item.pID] && map[item.pID].deep) {
                                                prefix = map[item.pID].prefix;
                                            }

                                            transformResponseField(code, item, namespace + '.' + prefix);
                                        }


                                    });

                                    prefix = staticPrefix;


                                } else {
                                    transformResponseField(code, item, namespace);
                                }

                            }
                        };

                    currentSubConfig = APPLY_TO_DESP.RESPONSE;

                    if (edm && (list = edm.list) && (list.TAFFY || list.length)) {
                        if (!list.TAFFY) {
                            list = app.taffy(list);
                        }

                        edmCollection = list({active: true}).get();

                        loopTransformProcess(edmCollection);

                    }

                    return code.length ? transformForeignKey(NOT_COMPILER ? 'try{' + (code.join('}catch(e){auiApp.log(e);}try{') + '}catch(e){auiApp.log(e);}') : code.join(';')) : '';
                },
                transformResponseField = function (data, field, prefix) {
                    var id, value, expression, param, input1;

                    currentSubConfig = APPLY_TO_DESP.RESPONSE;

                    if (field) {
                        id = field.id;

                        value = prefix ? (prefix + '.' + (field.alias || field.name)) : (field.alias || field.name);

                        input1 = expression = field.expression ? field.expression.replace(EXPRESSION_REPLACEMENT, value) : value;

                        if (id && (checkHasWidgetID(id) || (param = getVariableByIdInEDM(id))) || expression) {
                            if (param) {
                                expression = param + '=' + expression + ';';
                            } else if (id.indexOf('##') === 0) {
                                id = getID(id.replace(FOREIGN_WIDGET_REDUNDANCY, ''));

                                expression = '$("#' + id + '","##_$el##").val(' + expression + ')';
                            } else {
                                id = id.replace(FUNCTION_PREFIX, '');

                                if (id.match(RESPONSE_DATA_REGEXP)) {//AUI2 v4.2新增 edm setter data 占位符，提高代码复用性
                                    expression = id.replace(RESPONSE_DATA_REGEXP, expression);
                                } else {
                                    expression = id.replace('(data)', '(' + expression + ')');
                                }
                            }

                            data.push(expression);
                        }

                        //field behavior
                        if (field.fieldBehaviorCode && field.fieldBehaviorFormulaUnit && input1) {
                            //input1 = expression.replace(/^[^=]+=/, '');
                            //input1 = input1.substring(0, input1.length - 1);
                            data.push(
                                'app.behavior(' +
                                input1 + ',"' +
                                encodeURIComponent(field.fieldBehaviorFormula) + '","' +
                                field.fieldBehaviorFormulaUnit + '",' +
                                (transformForeignKey(field.fieldBehaviorCode).replace(/\([^$]+$/, '')) +
                                ')');
                        }
                    }
                },
                getDataObject = function (edmID, undefined) {
                    var data = [], dataString,
                        edm = edmID ? request({edmID: edmID}).first() : undefined,
                        list, prefix, staticPrefix, edmCollection,
                        loopTransformProcess = function (items) {

                            var seek = [],
                                i, item,
                                cursor, map = {};

                            for (i = -1; item = items[++i];) {
                                if (!item.pID) {
                                    seek.push(item);
                                }
                            }

                            i = -1;

                            staticPrefix = prefix || '';

                            while (item = seek[++i]) {
                                cursor = i;
                                if (item.uid) {

                                    staticPrefix = prefix;

                                    prefix = ((prefix || '') ? ((prefix || '') + '.') : '') + (item.alias || 'alias');


                                    list({pID: item.uid, active: true}).each(function (item) {


                                        if (item.uid) {
                                            map[item.uid] = {
                                                deep: 1,
                                                prefix: ((prefix || '') ? ((prefix || '') + '.') : '') + (item.alias || 'alias')
                                            };
                                            seek.splice.apply(seek, [cursor + 1, 0].concat(item));
                                        } else {

                                            if (map[item.pID] && map[item.pID].deep) {
                                                prefix = map[item.pID].prefix;
                                            }
                                            transformRequestField(data, item, prefix);
                                        }


                                    });

                                    prefix = staticPrefix;


                                } else {
                                    transformRequestField(data, item);
                                }

                            }

                        };


                    currentSubConfig = APPLY_TO_DESP.REQUEST;


                    if (edm && (list = edm.list) && (list.TAFFY || list.length)) {
                        if (!list.TAFFY) {
                            list = app.taffy(list);
                        }

                        edmCollection = list({active: true}).get();
                        loopTransformProcess(edmCollection);

                    }

                    if (data.length) {
                        dataString = UglifyJS.parse('[]');

                        dataString.body[0].body.elements = data;

                        dataString = getParsedString(dataString);
                    }

                    return getRequestOverviewCode(edm, dataString);
                },
                transformRequestField = function (data, field, prefix) {
                    var astResponseItem, responseItem, validateObj,
                        widgetID,
                        isVar,
                        name, id, expression, value, validateHandler,properties,i,item;

                    currentSubConfig = APPLY_TO_DESP.REQUEST;

                    if (field) {
                        id = field.id;
                        expression = field.expression;
                        name = prefix ? (prefix + '.' + (field.alias || field.name)) : (field.alias || field.name);

                        validateObj = {
                            regex: field.regex || '',
                            errorMsg: field.errorMsg || ''
                        };

                        VALIDATE_PROPS.map(function (elem) {
                            field[elem] && (validateObj[elem] = field[elem]);
                        });

                        responseItem = {
                            desp: field.comment,
                            name: name,
                            validate: validateObj,
                            queryString: (!field.queryString || field.queryString === 'false') ? false : true,
                            urlExternal: !!(field.urlExternal === 'true')
                        };


                        if (id && ((isVar = !!~id.indexOf(OVERVIEW_VARIABLES_PLACEMENT)) || checkHasWidgetID(id))) {
                            if (isVar) {
                                value = getVariableByIdInEDM(id);

                                value = expression ? expression.replace(EXPRESSION_REPLACEMENT, value) : value;

                            } else if (id.indexOf('##') === 0) {
                                id = getID(id.replace(FOREIGN_WIDGET_REDUNDANCY, ''));

                                validateObj.context = '##_$el##';
                                validateObj.id = '#' + id;

                                value = undefined;//'$("#' + id + '",$el)';
                                //value = expression ? expression.replace(EXPRESSION_REPLACEMENT, value) : value;

                                if (field.validateHandler) {
                                    validateHandler = transformForeignKey(transformWidgetKey(field.validateHandler, id));
                                    validateHandler = UglifyJS.parse('({"validateHandler":' + validateHandler + '})');
                                    // validateObj.validateHandler = UglifyJS.parse('({"validateHandler":' +  validateObj.validateHandler + '})');

                                }

                            } else {
                                value = expression ? expression.replace(EXPRESSION_REPLACEMENT, id) : id;

                                if (field.validateHandler) {
                                    widgetID = id.match(FOREIGN_WIDGET_SPILT);
                                    if (widgetID && (widgetID = widgetID[1])) {
                                        validateHandler = transformWidgetKey(field.validateHandler, getID(widgetID));
                                        validateHandler = UglifyJS.parse('({"validateHandler":' + validateHandler + '})');
                                        //  validateObj.validateHandler = UglifyJS.parse('({"validateHandler":' +  validateObj.validateHandler + '})');
                                    } else {
                                        delete validateObj.validateHandler;
                                    }
                                }
                            }
                        } else {
                            value = expression ? expression.replace(EXPRESSION_REPLACEMENT, '') : '';
                        }

                        if (value === undefined) {
                            value = UglifyJS.parse('({"value":undefined})');
                        } else if (hasWidgetID(value || isVar, true)) {
                            value = UglifyJS.parse('({"value":"' + value + '"})');
                        } else {
                            value = transformForeignKey(value || '""').replace(FUNCTION_PREFIX, '');

                            value = UglifyJS.parse('({"value":' + value + '})');
                        }
                        astResponseItem = UglifyJS.parse('(' + JSON.stringify(responseItem) + ')');

                        if (validateHandler) {
                            if(properties=astResponseItem.body[0].body.properties){
                                for(i=-1;item=properties[++i];){
                                    if(item.key==='validate'){
                                        item.value.properties.push(validateHandler.body[0].body.properties[0]);
                                    }
                                }
                            }
                        }

                        astResponseItem.body[0].body.properties.push(value.body[0].body.properties[0]);


                        data.push(astResponseItem.body[0].body);
                    }
                },

                //event
                getSuccessCallback = function (options, noTypeJudgement, successCallback, code) {
                    var str = [],
                        instance = getOverviewInstance(options.foreignID),

                        codeModel,

                        codeHead = [],
                        codeBody = [],
                        startSuccess;


                    successCallback = transformForeignKey(successCallback);


                    if (instance) {
                        getVariables(getVarList(instance), codeHead, OVERVIEW_FUNCTION_TYPE.RESPONSE);

                        if (codeHead.length) {
                            str.push('var ' + codeHead.join(',') + ';');
                        }
                    }

                    str.push('if (response.status) {');

                    codeModel = instance.codeModel;

                    switch (options.handler) {
                        case TYPE.REDIRECT:
                        case TYPE.SELF:

                            code = '';

                        case TYPE.SUB:
                        case TYPE.POPOVER:
                        case TYPE.WINDOW:
                            noTypeJudgement = true;


                            break;
                    }

                    if (noTypeJudgement) {

                        if (codeModel && (startSuccess = codeModel.startSuccess) && startSuccess.length && !$.isEmptyObject(startSuccess[0])) {
                            overviewGetLoop(startSuccess, codeHead, codeBody, code ? successCallback : 'app.open(response);', true, instance.widgetID);

                            str = str.concat(codeBody);
                        } else {
                            str.push(code ? successCallback : 'app.open(response);');
                        }


                    } else {
                        str.push('if (response.type && response.type !== "AJAX") {');

                        str.push('app.open(response);');

                        str.push('} else {');

                        if (codeModel && (startSuccess = codeModel.startSuccess) && startSuccess.length) {

                            overviewGetLoop(startSuccess, codeHead, codeBody, (code ? successCallback : setDataObject(AJAX_RESPONSE_PREFIX, options.responseID) ), true, instance.widgetID);

                            str = str.concat(codeBody);

                        } else {
                            str.push(code ? successCallback : setDataObject(AJAX_RESPONSE_PREFIX, options.responseID));
                        }


                        str.push('}');
                    }

                    str = str.concat([
                        '} else if ( response.errorMsg ) {',
                        'app.alert(response.errorMsg, app.alert.ERROR);',
                        '}'
                    ]);

                    return str.join('');
                },
                getNormalCallback = function (option, normalCallback, code, successCallback) {
                    var instance = getOverviewInstance(option.foreignID),
                        propFrame = UglifyJS.parse('(' + normalCallback + ')'),
                        body = [],

                        codeModel,
                        startCustom,

                        subFrame, str,

                        codeHead = [],
                        codeBody = [];

                    if (instance) {

                        getVariables(getVarList(instance), codeHead, OVERVIEW_FUNCTION_TYPE.CUSTOM);

                        if (codeHead.length) {
                            str = 'var ' + codeHead.join(',') + ';';

                            subFrame = UglifyJS.parse(str);

                            body = body.concat(subFrame.body);
                        }

                        if ((codeModel = instance.codeModel) && (startCustom = codeModel.startCustom) && startCustom.length) {
                            try {
                                str = getParsedString(propFrame.body[0].body.body[0]) || '';
                            } catch (e) {
                                str = '';
                            }

                            overviewGetLoop(startCustom, codeHead, codeBody, str, true, instance.widgetID);

                            str = getPureCodeStr(codeBody);

                            subFrame = UglifyJS.parse('(function(){' + str + '})');

                            body = body.concat(subFrame.body[0].body.body);

                        }

                        propFrame.body[0].body.body = body;
                        str = getParsedString(propFrame);

                        str = str.substr(1, str.length - 3);
                    } else {
                        str = normalCallback;
                    }

                    return str;
                },
                getCallback = function (options) {
                    var handler = options.handler,
                        isAPIFirst = options.isAPIFirst,
                        code = options.code,
                        codeList, subCallbackStr,
                        param,
                        flag,
                        optionConfigKey,
                        successCallback = options.successCallback || code,//v4.2新增，就是加入code为先行调用，则success时调用successCallback，如果code不是先行调用，则successCallback=code
                        ajaxKey = options.ajaxKey,
                        noTypeJudgement = options.noTypeJudgement,
                        hasWrapFunction = options.hasWrapFunction,
                        callback = options.callback,
                        lifecycleCollection, eventCollection,
                        isCurrentInstance = function (widgetID, instanceCode, optionCode) {
                            var id = getID(widgetID);

                            instanceCode = VAR_REPLACEMENT + instanceCode.replace('##_var##', id);

                            return instanceCode === optionCode;
                        },

                        dataObject,

                        callbackStr, propFrame;

                    switch (handler) {
                        case TYPE.AJAX:
                        case TYPE.REDIRECT:
                        case TYPE.SUB:
                        case TYPE.POPOVER:
                        case TYPE.WINDOW:
                            options.deps = TYPE.AJAX;
                            break;
                        case TYPE.CUSTOM:
                            callbackStr = 'function (e){}';
                            break;
                        case TYPE.MODAL:
                            callbackStr = callback;

                            break;
                        default:
                            if (options.deps !== TYPE.AJAX) {
                                if (handler || callback) {
                                    callbackStr = (callback || handler).indexOf(FUNCTION_PREFIX) === 0 ? callback.replace(FUNCTION_PREFIX, '') : callback;
                                } else {
                                    callbackStr = 'function (e){}';
                                }
                            }
                    }

                    if (APPLY_TO_DESP[handler]) {
                        currentSubConfig = APPLY_TO_DESP[handler];
                    }

                    if (options.deps === TYPE.AJAX) {
                        if (options.code === TYPE.AJAX) {
                            code = '';
                        }

                        //AUI2 v4.2新加，使用占位符##_RESPONSE_DATA##代替字符串‘response’，提高代码复用性
                        if (successCallback) {
                            if (successCallback.match(RESPONSE_DATA_REGEXP)) {
                                successCallback = successCallback.replace(RESPONSE_DATA_REGEXP, options.applyTo === APPLY_TO.EVENT ? AJAX_RESPONSE_PREFIX : AJAX_RESPONSE);
                            } else if (successCallback.match(AJAX_OPTION_REGEXP)) {
                                // successCallback = successCallback.replace(AJAX_OPTION_REGEXP, AJAX_OPTION_REPLACEMENT + ajaxKey);
                                code = successCallback;
                            } else if (isAPIFirst) {
                                successCallback = successCallback.replace(/data(\b)/, AJAX_OPTION_REPLACEMENT + ajaxKey);
                                code = successCallback.replace(AJAX_OPTION_REPLACEMENT + ajaxKey, AJAX_OPTION_REGEXP);
                            } else {
                                successCallback = successCallback.replace(/data(\b)/, 'response.content.result$1');
                            }
                        } else {
                            successCallback = '';
                        }

                        //AUI2 v4.2.17.2 修复timeout为空时的bug
                        var overviewIns, codeModel, startSuccess, codeHead, codeBody, codeIns, i, len, item, url,
                            lifecycleInstance, eventInstance;
                        if (overviewIns = getOverviewInstance(options.foreignID)) {
                            if (overviewIns.codeModel && (codeModel = JSON.parse(JSON.stringify(overviewIns.codeModel))) && (startSuccess = codeModel.startSuccess) && startSuccess.length) {
                                for (i = 0, len = startSuccess.length; i < len; i++) {

                                    item = startSuccess[i];

                                    if (item.type === 'function') {

                                        if (!item.params) {//特殊处理逻辑概览的问题
                                            item.params = [{
                                                type: 'object',
                                                value: {}
                                            }];
                                        }

                                        codeIns = item.params[0].value;

                                        if (codeIns) {
                                            if (typeof codeIns === 'string' && item.params[0].name === 'url') {
                                                url = codeIns;
                                            } else {
                                                if (codeIns.url) {
                                                    url = codeIns.url.value;
                                                }
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }

                        if (codeIns) {
                            if (codeIns.data && codeIns.data.type === 'code' && codeIns.data.value === 'undefined') {
                                delete codeIns.data;
                            }
                        }

                        if (options.url && url) {//假设ur没有被替换
                            if (NOT_COMPILER) {

                                lifecycleCollection = global.AUI.data.lifecycle({lifecycleID: options.foreignID});
                                eventCollection = global.AUI.data.event({eventID: options.foreignID});

                                if (lifecycleInstance = lifecycleCollection.first()) {
                                    if (isCurrentInstance(lifecycleInstance.widgetID, lifecycleInstance.code, options.code)) {
                                        options.url = url.replace(/"/g, '');
                                        lifecycleCollection.update({url: options.url});
                                    }
                                }

                                if (eventInstance = eventCollection.first()) {
                                    if ((eventInstance.handler === options.handler) && options.handler !== 'ajax') {
                                        options.url = url.replace(/"/g, '');
                                        eventCollection.update({url: options.url});
                                    }
                                }
                            }

                        }


                        if (isAPIFirst) {

                            dataObject = getDataObject(options.edmID);

                            //特殊处理项目级组件 API First 接口，使用数据传输而不是默认的配置
                            if (codeIns && dataObject.length > 30) {//'var data;\nreturn data;'.length  //return undefined;
                                delete codeIns.data;
                            }

                            codeIns = $.extend(true, {
                                type: {
                                    type: 'code',
                                    value: '"' + AJAX_HANDLER.ajaxType[options.ajaxType] + '"'
                                },
                                url: {
                                    type: 'code',
                                    value: '"' + options.url + '"'
                                },
                                urlDivider: {
                                    type: 'code',
                                    value: options.urlDivider ? '"' + options.urlDivider.toString() + '"' : URL_DIVIDER
                                },
                                timeout: {
                                    type: 'code',
                                    value: options.ajaxTimeout || '"undefined"'
                                },
                                noAgreeBusData: {
                                    type: 'code',
                                    value: options.noAgreeBusData === undefined ? 'true' : (options.noAgreeBusData || 'false')
                                },
                                ajaxProcessData: {
                                    type: 'code',
                                    value: options.ajaxProcessData === undefined ? 'true' : (options.ajaxProcessData || 'false')
                                },
                                ajaxNoBlobData: {
                                    type: 'code',
                                    value: options.ajaxNoBlobData === undefined ? 'true' : (options.ajaxNoBlobData || 'false')
                                },
                                validate: {
                                    type: 'code',
                                    value: AJAX_HANDLER.validate[options.validate]
                                },
                                validateContinue: {
                                    type: 'code',
                                    value: AJAX_HANDLER.validateContinue[options.validateContinue]
                                },
                                validateSuccessCallback: {
                                    type: 'code',
                                    value: 'null'
                                },
                                validateCleanCallback: {
                                    type: 'code',
                                    value: 'null'
                                },
                                validateErrorCallback: {
                                    type: 'code',
                                    value: AJAX_HANDLER.validateErrorCallback[options.validateErrorCallback]
                                },
                                data: {
                                    type: 'code',
                                    value: 'function(){' + dataObject + '}'
                                },
                                shelter: {
                                    type: 'code',
                                    value: '"' + (options.ajaxShelter || AJAX_SHELTER_TEXT) + '"'
                                },
                                success: {
                                    type: 'code',
                                    value: 'function(response){ ' +
                                    '       if (response.status) {' +
                                    '       } else if (response.errorMsg) {\n' +
                                    '            app.alert(response.errorMsg, app.alert.ERROR);\n' +
                                    '       }' +
                                    '}'
                                }
                            }, codeIns);

                            overviewGetLoop([{
                                type: "object",
                                value: codeIns
                            }], codeHead = [], codeBody = [], '', false);


                            propFrame = UglifyJS.parse(transformForeignKey([
                                '({',
                                options.ajaxKey, ':',
                                getPureCodeStr(codeBody),
                                '})'
                            ].join('')));

                        } else {
                            options.ajaxShelter = options.ajaxShelter || AJAX_SHELTER_TEXT;
                            options.ajaxTimeout = options.ajaxTimeout || 'undefined';
                            options.urlDivider = options.urlDivider === undefined ? URL_DIVIDER : ('"' + options.urlDivider + '"');
                            options.ajaxProcessData = options.ajaxProcessData === undefined ? true : options.ajaxProcessData;
                            options.ajaxNoBlobData = options.ajaxNoBlobData === undefined ? true : options.ajaxNoBlobData;
                            options.noAgreeBusData = options.noAgreeBusData === undefined ? true : (options.noAgreeBusData || 'false');


                            propFrame = UglifyJS.parse(transformForeignKey([
                                '({',
                                options.ajaxKey, ':{',
                                'type:"', AJAX_HANDLER.ajaxType[options.ajaxType], '",',
                                'url: "', options.url, '",',
                                (options.urlDivider ? ('urlDivider: ' + options.urlDivider + ',') : ''),
                                'timeout: ' + options.ajaxTimeout + ',',
                                // (options.noAgreeBusData === true ? ('noAgreeBusData: ' + options.noAgreeBusData + ',') : ''),
                                'noAgreeBusData:' + options.noAgreeBusData + ',',
                                'ajaxProcessData: ' + options.ajaxProcessData + ',',
                                'ajaxNoBlobData: ' + options.ajaxNoBlobData + ',',
                                'validate:', AJAX_HANDLER.validate[options.validate], ',',
                                'validateContinue:', AJAX_HANDLER.validateContinue[options.validateContinue], ',',
                                'validateSuccessCallback:null,',
                                'validateCleanCallback:null,',
                                'validateErrorCallback:', AJAX_HANDLER.validateErrorCallback[options.validateErrorCallback], ',',
                                'data: function(){' + getDataObject(options.edmID), '},',
                                ('shelter: "' + options.ajaxShelter + '",'),
                                'success:function(response) {',
                                getSuccessCallback(options, noTypeJudgement, successCallback, code),
                                '}',
                                '}',
                                '})'
                            ].join('')));
                        }


                        propFrame = transformFunction(propFrame);

                        ajaxNode.value.properties.push(propFrame.body[0].body.properties[0]);

                        if (isAPIFirst) {

                            if (code && (!!code.match(AJAX_OPTION_REGEXP) || (!!code.match(URL_REGEXP) && !!code.match(OPTION_REGEXP_END)))) {

                                if (codeModel) {
                                    callbackStr = code.replace(AJAX_OPTION_REGEXP, AJAX_OPTION_REPLACEMENT + ajaxKey);

                                    if (item && (item.value === OVERVIEW_AJAX_METHOD)) {
                                        item.value = callbackStr;
                                        item.type = 'function';
                                    }
                                    getVariables(getVarList(overviewIns), codeHead = [], OVERVIEW_FUNCTION_TYPE.CUSTOM);

                                    //处理extend
                                    if (codeModel.startSuccess && codeModel.startSuccess.length) {

                                        // if (!startSuccess[0].params) {
                                        // startSuccess[0].params = [{
                                        //     type: 'code',
                                        //     value: AJAX_OPTION_REPLACEMENT + ajaxKey
                                        // }];
                                        var cursor = -1,
                                            startSuccessItem;
                                        while ((startSuccessItem = startSuccess[++cursor])) {
                                            if (startSuccessItem.params) {
                                                param = startSuccessItem.params[0];

                                                if (param.name === 'url') {
                                                    param = startSuccessItem.params[1];
                                                    if (!!param.key.match(OPTION_REGEXP_END)) {
                                                        optionConfigKey = param.key.replace(OPTION_REGEXP, PROPS.OPTION + getID(overviewIns.widgetID));
                                                        param.key = 'option';
                                                    }
                                                    flag = true;
                                                }

                                                overviewGetLoop([param], [], codeBody = [], '', true, overviewIns.widgetID);

                                                subCallbackStr = getPureCodeStr(codeBody);

                                                param = {
                                                    type: 'code',
                                                    value: subCallbackStr ? ('$.extend(true,' + subCallbackStr + ',' + AJAX_OPTION_REPLACEMENT + ajaxKey + (optionConfigKey ? (',' + optionConfigKey) : '') + ')') : (AJAX_OPTION_REPLACEMENT + ajaxKey)
                                                };

                                                if (flag) {
                                                    startSuccessItem.params[1] = param;
                                                } else {
                                                    startSuccessItem.params[0] = param;
                                                }
                                            }
                                        }
                                        // } else {
                                        //
                                        // }
                                    }

                                    overviewGetLoop(codeModel.startSuccess, codeHead = [], codeBody = [], '', true, overviewIns.widgetID);

                                    code = (codeHead.length ? ('var ' + codeHead.join(',') + ';') : '') + getPureCodeStr(codeBody);
                                }

                                callbackStr = noTypeJudgement && !hasWrapFunction ? ('(' + code.replace(AJAX_OPTION_REGEXP, AJAX_OPTION_REPLACEMENT + ajaxKey) + '),') : ('function (e){' + code.replace(AJAX_OPTION_REGEXP, AJAX_OPTION_REPLACEMENT + ajaxKey) + '}');


                            } else {
                                if (codeModel) {
                                    overviewGetLoop(codeModel.startSuccess, codeHead = [], codeBody = [], '', true, overviewIns.widgetID);

                                    code = (codeHead.length ? ('var ' + codeHead.join(',') + ';') : '') + getPureCodeStr(codeBody);
                                }
                                //兼容旧版v4.1.1
                                callbackStr = noTypeJudgement && !hasWrapFunction ? ('((function(response){' + (code || '') + '}(' + AJAX_OPTION_REPLACEMENT + ajaxKey + '));}') : ('function (e){(function(data){' + (code || '') + '}(' + AJAX_OPTION_REPLACEMENT + ajaxKey + '));}');
                            }

                        } else {
                            callbackStr = noTypeJudgement && !hasWrapFunction ? ('($.ajax(' + AJAX_OPTION_REPLACEMENT + ajaxKey + '));') : 'function (e){$.ajax(' + AJAX_OPTION_REPLACEMENT + ajaxKey + ');}';
                        }


                        callbackStr = noTypeJudgement ? callbackStr : getParsedString(transformFunction(UglifyJS.parse('(' + cleanUndeclaredPlaceholder(transformForeignKey(callbackStr)) + ')')));

                        callbackStr = callbackStr.indexOf('function') === 0 ? callbackStr : callbackStr.substring(1, callbackStr.length - 2);
                    } else {
                        callbackStr = noTypeJudgement ? callbackStr : getParsedString(transformFunction(UglifyJS.parse('(' + cleanUndeclaredPlaceholder(transformForeignKey(callbackStr)) + ')')));

                        callbackStr = callbackStr.indexOf('function') === 0 ? callbackStr : callbackStr.substring(1, callbackStr.length - 2);

                        callbackStr = getNormalCallback(options, callbackStr, code, successCallback);
                    }

                    return callbackStr;
                },


                eventHandler = function (item) {
                    var id = getID(item.widgetID),
                        namespace = (item.namespace || '').replace(/\s{1,}/g, '.').replace(/\.$/, ''),
                        key,
                        ajaxKey,
                        targetSelector,
                        callback,
                        param, i, p,
                        propString, hasFunction,
                        propFrame,
                        tipsFrame;


                    currentWidgetID = item.widgetID;
                    currentConfigName = item.desp || 'hehe';

                    if ((item.selector && item.type && item.callback) || (item.widgetID === config.uuid)) {
                        key = item.type + (namespace ? ('.' + namespace) : '') + ' ' + (item.selector ? item.selector.replace(ID_REGEXP, id).replace(/\\\"/g, '"') : '');

                        switch (item.handler) {
                            case TYPE.AJAX:
                            case TYPE.REDIRECT:
                            case TYPE.SUB:
                            case TYPE.POPOVER:
                            case TYPE.WINDOW:
                                if (item.selector && item.type) {
                                    ajaxKey =
                                        (item.selector.replace(ID_REGEXP, id) + ' ' + item.type + (namespace ? ('.' + namespace) : ''))
                                            .replace(EVENT_SPILT_REGEXP, EVENT_SPILT_REPLACEMENT);
                                } else {
                                    ajaxKey = 'noNameEvent' + (eventAccumulator++);
                                }
                                targetSelector = item.selector.replace(ID_REGEXP, id);

                                switch (item.handler) {
                                    case TYPE.SUB:
                                        param = {type: 'SUB'};
                                        for (i = MODAL_PARAM_KEY.length; p = MODAL_PARAM_KEY[--i];) {
                                            if (item[p]) {
                                                param[p] = item[p] + (item[p + UNIT] || 'px');
                                            }
                                        }
                                        break;
                                    case TYPE.POPOVER:
                                        param = {
                                            type: 'POPOVER',
                                            $elem: FUNCTION_PREFIX + 'function(){return $("' + targetSelector + '",$el);' + '}'
                                        };


                                        for (i = MODAL_PARAM_KEY.length; p = MODAL_PARAM_KEY[--i];) {
                                            if (item[p]) {
                                                param[p] = item[p] + (item[p + UNIT] || 'px');
                                            }
                                        }
                                        break;

                                    case TYPE.WINDOW:
                                        param = {type: 'WINDOW'};
                                        for (i = WINDOW_PARAM_KEY.length; p = WINDOW_PARAM_KEY[--i];) {

                                            if (item[p] !== undefined) {
                                                param[p] = item[p];
                                            } else {
                                                param[p] = true;
                                            }
                                        }
                                        break;
                                }

                                switch (item.handler) {
                                    case TYPE.SUB:
                                    case TYPE.POPOVER:
                                    case TYPE.WINDOW:
                                        propFrame = UglifyJS.parse('({' + ajaxKey + ':function(response){ var size=' + JSON.stringify(param) + ';$.extend(response,size);app.open(response);}})');

                                        propFrame = transformFunction(propFrame);

                                        eventCallbackNode.value.properties.push(propFrame.body[0].body.properties[0]);

                                        propString = getCallback({
                                            applyTo: APPLY_TO.EVENT,
                                            foreignID: item.eventID,
                                            handler: item.handler,
                                            ajaxType: item.ajaxType,
                                            ajaxShelter: item.ajaxShelter,
                                            ajaxTimeout: item.ajaxTimeout,
                                            noAgreeBusData: item.noAgreeBusData,
                                            ajaxProcessData: item.ajaxProcessData,
                                            ajaxNoBlobData: item.ajaxNoBlobData,
                                            url: transformWidgetKey(item.url || item.callback, id),
                                            urlDivider: item.urlDivider,
                                            edmID: item.edmID,
                                            //responseID:item.responseID,
                                            code: EVENT_CALLBACK_REPLACEMENT + ajaxKey + '(response);',
                                            ajaxKey: ajaxKey,
                                            isAPIFirst: false,
                                            noTypeJudgement: true,
                                            hasWrapFunction: false,
                                            validate: item.validate,
                                            validateContinue: item.validateContinue,
                                            validateErrorCallback: item.validateErrorCallback
                                        });

                                        propString = 'function(){' + propString + ';}';
                                        break;
                                    default:
                                        propFrame = UglifyJS.parse('({' + ajaxKey + ':function(response){' +
                                            (item.responseID ? setDataObject(AJAX_RESPONSE_PREFIX, item.responseID) : '') +
                                            '}})');

                                        eventCallbackNode.value.properties.push(propFrame.body[0].body.properties[0]);

                                        propString = getCallback({
                                            applyTo: APPLY_TO.EVENT,
                                            foreignID: item.eventID,
                                            handler: item.handler,
                                            ajaxType: item.ajaxType,
                                            ajaxShelter: item.ajaxShelter,
                                            ajaxTimeout: item.ajaxTimeout,
                                            noAgreeBusData: item.noAgreeBusData,
                                            ajaxProcessData: item.ajaxProcessData,
                                            ajaxNoBlobData: item.ajaxNoBlobData,
                                            url: transformWidgetKey(item.url || item.callback, id),
                                            urlDivider: item.urlDivider,
                                            responseID: item.handler === TYPE.AJAX ? item.responseID : '',
                                            edmID: item.edmID,
                                            code: EVENT_CALLBACK_REPLACEMENT + ajaxKey + '(response);',
                                            ajaxKey: ajaxKey,
                                            validate: item.validate,
                                            validateContinue: item.validateContinue,
                                            validateErrorCallback: item.validateErrorCallback,
                                            deps: TYPE.AJAX
                                        });
                                        break;
                                }
                                break;
                            case TYPE.MODAL:

                                callback = transformWidgetKey(item.callback, id);
                                param = {};


                                for (i = MODAL_PARAM_KEY.length; p = MODAL_PARAM_KEY[--i];) {
                                    if (item[p]) {
                                        param[p] = item[p] + (item[p + UNIT] || 'px');
                                    }
                                }

                                if (~callback.indexOf(OPTION_REGEXP_END)) {//兼容旧版的弹出框
                                    callback = 'function (e){app.modal(' + callback + ');}';
                                } else {
                                    callback = 'function (e){' + callback + '.show(e,' + JSON.stringify(param) + ');}';
                                }

                                param.applyTo = APPLY_TO.EVENT;
                                param.foreignID = item.eventID;
                                param.handler = item.handler;
                                param.callback = callback.replace(EVENT_HANDLER_REGEXP, 'e');

                                propString = getCallback(param);

                                break;
                            default:
                                if (item.deps === TYPE.AJAX) {
                                    if (item.selector && item.type) {
                                        ajaxKey =
                                            (item.selector.replace(ID_REGEXP, id) + ' ' + item.type + (namespace ? ('.' + namespace) : ''))
                                                .replace(EVENT_SPILT_REGEXP, EVENT_SPILT_REPLACEMENT);
                                    } else {
                                        ajaxKey = 'noNameEvent' + (eventAccumulator++);
                                    }

                                    propFrame = UglifyJS.parse('({' + ajaxKey + ':function(response){}})');

                                    eventCallbackNode.value.properties.push(propFrame.body[0].body.properties[0]);

                                    propString = getCallback({
                                        applyTo: APPLY_TO.EVENT,
                                        foreignID: item.eventID,
                                        handler: item.handler,
                                        ajaxType: item.ajaxType,
                                        ajaxShelter: item.ajaxShelter,
                                        ajaxTimeout: item.ajaxTimeout,
                                        noAgreeBusData: item.noAgreeBusData,
                                        ajaxProcessData: item.ajaxProcessData,
                                        ajaxNoBlobData: item.ajaxNoBlobData,
                                        url: transformWidgetKey(item.url || item.callback, id),
                                        edmID: item.edmID,
                                        //responseID:item.responseID,
                                        code: item.order && item.order !== 'undefined' ? (transformForeignKey(item.handler)) : (EVENT_CALLBACK_REPLACEMENT + ajaxKey + '(response);'),
                                        ajaxKey: ajaxKey,
                                        isAPIFirst: item.order && item.order !== 'undefined',
                                        noTypeJudgement: true,
                                        hasWrapFunction: true,
                                        successCallback: item.handler,
                                        validate: item.validate,
                                        validateContinue: item.validateContinue,
                                        validateErrorCallback: item.validateErrorCallback,
                                        deps: TYPE.AJAX
                                    });

                                } else {
                                    propString = getCallback({
                                        applyTo: APPLY_TO.EVENT,
                                        foreignID: item.eventID,
                                        handler: item.handler,
                                        callback: transformWidgetKey(item.callback, id).replace(EVENT_HANDLER_REGEXP, 'e')
                                    });
                                }

                                break;
                        }

                        if (item.type && item.selector) {
                            hasFunction = !!propString.match(FUNCTION_PREFIX);

                            propString = propString.replace(EVENT_HANDLER_REGEXP, 'e');

                            if (propString.indexOf('function') !== 0) {
                                propString = 'function(e){' + propString + '}';
                            }

                            propString = transformForeignKey(propString);
                            propFrame = UglifyJS.parse('({"' + key + '": ' + propString + '})');

                            hasFunction && (propFrame = transformFunction(propFrame));

                            try {
                                tipsFrame = UglifyJS.parse('(function(){aweb.debug && aweb.stepTo("' + [pageModule, pageName, currentConfig, currentConfigName].join('-').replace(/["']/g, '') + '")})');

                                propFrame.body[0].body.properties[0].value.body.unshift(tipsFrame.body[0].body.body[0]);
                            } catch (e) {
                                errorMsg.push(currentConfig + '-' + currentConfigName + '无法做提示！');
                            }

                            delegateEventsNode.value.properties.push(propFrame.body[0].body.properties[0]);
                        }
                    }
                },

                //lifecycle
                lifecycleHandler = function (item) {
                    var id = getID(item.widgetID),
                        key = [id, item.spaAction, item.pageAction, item.___id.substr(-6)].join('_'),
                        intervalName = [id, parseInt(item.___id.substr(-6), 10)].join(''),
                        spaNode, subCallbackStr,
                        propString, propFrame, funcString,

                        overviewIns, codeModel, startCustom, startSuccess, codeHead, codeBody, codeIns,

                        tips, callbackStr, startIndex;

                    currentWidgetID = item.widgetID;
                    currentConfigName = item.desp || 'hehe';
                    tips = ('aweb.debug && aweb.stepTo("' + [pageModule, pageName, currentConfig, currentConfigName].join('-').replace(/["']/g, '') + '");');

                    if (id && id !== WIDGET_MISSING) {//复制粘贴后 id可能为空


                        if (item.code === TYPE.AJAX) {
                            item.code = '';
                        }

                        if (item.url) {
                            if (item.order === LIFECYCLE_ORDER) {

                                codeIns = UglifyJS.parse('({"func":' + getCallback({
                                        applyTo: APPLY_TO.LIFECYCLE,
                                        foreignID: item.lifecycleID,
                                        handler: TYPE.AJAX,
                                        ajaxType: item.ajaxType,
                                        ajaxShelter: item.ajaxShelter,
                                        ajaxTimeout: item.ajaxTimeout,
                                        noAgreeBusData: item.noAgreeBusData,
                                        ajaxProcessData: item.ajaxProcessData,
                                        ajaxNoBlobData: item.ajaxNoBlobData,
                                        url: item.url,
                                        urlDivider: item.urlDivider,
                                        edmID: item.edmID,
                                        code: transformForeignKey(transformWidgetKey(item.code, id)),
                                        ajaxKey: key,
                                        isAPIFirst: true,
                                        validate: item.validate,
                                        validateContinue: item.validateContinue,
                                        validateErrorCallback: item.validateErrorCallback
                                    }) + '})');

                                propString = getParsedString(codeIns.body[0].body.properties[0].value.body[0]) || '';


                                //针对闭包的问题
                                if (propString && propString.indexOf('function') === 0) {
                                    propString = propString.replace(/;$/, '\n');

                                    propString = '(' + propString + ');';
                                }

                                if (overviewIns = getOverviewInstance(item.lifecycleID)) {
                                    codeHead = [];

                                    if ((codeModel = overviewIns.codeModel) && (startSuccess = codeModel.startSuccess) && startSuccess.length) {

                                        startSuccess = JSON.parse(JSON.stringify(startSuccess));

                                        if (!startSuccess[0].params) {
                                            startSuccess[0].params = [{
                                                type: 'code',
                                                value: AJAX_OPTION_REPLACEMENT + key
                                            }];
                                        }/*else/!* if($.isEmptyObject(startSuccess[0].params[0]))*!/{
                                         startSuccess[0].params[0]={
                                         type: 'code',
                                         value: AJAX_OPTION_REPLACEMENT + key
                                         };
                                         }*/ else {
                                            overviewGetLoop([startSuccess[0].params[0]], [], codeBody = [], propString, true, overviewIns.widgetID);

                                            subCallbackStr = getPureCodeStr(codeBody);

                                            startSuccess[0].params[0] = {
                                                type: 'code',
                                                value: subCallbackStr ? ('$.extend(' + subCallbackStr + ',' + AJAX_OPTION_REPLACEMENT + key + ')') : (AJAX_OPTION_REPLACEMENT + key)
                                            }
                                        }

                                        overviewGetLoop(startSuccess, codeHead, codeBody = [], propString, true, overviewIns.widgetID);

                                        propString = getPureCodeStr(codeBody);

                                    }

                                    getVariables(getVarList(overviewIns), codeHead, OVERVIEW_FUNCTION_TYPE.REQUEST);

                                    if (codeHead.length) {
                                        propString = 'var ' + codeHead.join(',') + ';' + propString;
                                    }
                                }

                                propString =
                                    [
                                        '		func:function(){',
                                        tips,
                                        propString.replace(AJAX_OPTION_REGEXP, AJAX_OPTION_REPLACEMENT + key),
                                        '},'
                                    ].join('');

                                funcString = 'func';
                            } else {
                                codeHead = [];
                                if (!item.code && item.responseID && (overviewIns = getOverviewInstance(item.lifecycleID))) {
                                    getVariables(getVarList(overviewIns), codeHead, OVERVIEW_FUNCTION_TYPE.RESPONSE);
                                }

                                callbackStr = getCallback({
                                    applyTo: APPLY_TO.LIFECYCLE,
                                    foreignID: item.lifecycleID,
                                    handler: TYPE.AJAX,
                                    ajaxType: item.ajaxType,
                                    ajaxShelter: item.ajaxShelter,
                                    ajaxTimeout: item.ajaxTimeout,
                                    noAgreeBusData: item.noAgreeBusData,
                                    ajaxProcessData: item.ajaxProcessData,
                                    ajaxNoBlobData: item.ajaxNoBlobData,
                                    url: item.url,
                                    urlDivider: item.urlDivider,
                                    edmID: item.edmID,
                                    responseID: item.responseID,
                                    code: LIFECYCLE_REPLACEMENT + key + '.func(##_RESPONSE_DATA##);',//将response ---> ##_RESPONSE_DATA##
                                    ajaxKey: key,
                                    validate: item.validate,
                                    validateContinue: item.validateContinue,
                                    validateErrorCallback: item.validateErrorCallback
                                });

                                startIndex = callbackStr.indexOf('{');

                                propString =
                                    [
                                        '       func:function(response){',
                                        '               ', tips,
                                        '               var data=response.content.result;',
                                        (codeHead.length ? ('var ' + codeHead.join(',') + ';') : ''),

                                        //AUI2 v4.2新增 此处使用了edm setter data，提到代码灵活性
                                        item.code ? transformForeignKey(transformWidgetKey(item.code, id)).replace(RESPONSE_DATA_REGEXP, 'data') : (item.responseID ? setDataObject(AJAX_RESPONSE_PREFIX, item.responseID) : ''),
                                        '		},',
                                        '		callback:', (callbackStr.substr(0, startIndex + 1) + tips + callbackStr.substr(startIndex + 1)),
                                        ','
                                    ].join('');

                                funcString = 'callback';
                            }
                        } else {


                            propString = transformForeignKey(transformWidgetKey(item.code === TYPE.ECHO ? setDataObject(PAGE_PARAMS, item.responseID) : item.code, id)) || '';

                            if (overviewIns = getOverviewInstance(item.lifecycleID)) {
                                codeHead = [];

                                if ((codeModel = overviewIns.codeModel) && (startCustom = codeModel[item.code === TYPE.ECHO ? 'startSuccess' : 'startCustom']) && startCustom.length) {
                                    overviewGetLoop(startCustom, codeHead, codeBody = [], propString, true, overviewIns.widgetID);

                                    propString = getPureCodeStr(codeBody);

                                }

                                getVariables(getVarList(overviewIns), codeHead, OVERVIEW_FUNCTION_TYPE.CUSTOM);

                                if (codeHead.length) {
                                    propString = 'var ' + codeHead.join(',') + ';' + propString;
                                }
                            }

                            propString =
                                [
                                    '		func:function(){',
                                    '       ', tips,
                                    propString,
                                    '		},'
                                ].join('');


                            funcString = 'func';
                        }

                        propString = [
                            '{',
                            key,
                            ':{',
                            propString,
                            ('times:' + parseInt(item.times || 0, 10) + ','),
                            ('clock:' + parseInt(item.clock, 10) + ','),
                            ('immediate:' + item.immediate + ','),
                            ('isPause:' + item.isPause),
                            '	     }',
                            '}'].join('');

                        propFrame = UglifyJS.parse("(" + propString + ")");
                        lifecycleNode.value.properties.push(propFrame.body[0].body.properties[0]);

                        switch (item.pageAction) {
                            case PAGE_LIFE.INIT:
                                propFrame = UglifyJS.parse(LIFECYCLE_REPLACEMENT + key + '._func_();'.replace(/_func_/, funcString));
                                break;
                            case PAGE_LIFE.INTERVAL:
                                propFrame = UglifyJS.parse('auiCtx.intervals._name_=handler.setInterval(_key_)'.replace(/_name_/, intervalName).replace(/_key_/g, LIFECYCLE_REPLACEMENT + key));
                                break;
                            case PAGE_LIFE.TIMEOUT:
                                propFrame = UglifyJS.parse('auiCtx.intervals._name_=handler.setTimeout(_key_)'.replace(/_name_/, intervalName).replace(/_key_/g, LIFECYCLE_REPLACEMENT + key));
                                break;
                        }

                        if (item.spaAction === SPA_LIFE.LOAD) {
                            loadLifecycleList.push(propFrame.body[0]);

                            //加入恢复时，重复调用数据进行刷新
                            if (item.isResume === true || item.isResume === 'true') {
                                resumeNode.value.body.push(propFrame.body[0]);
                            }
                        } else {

                            switch (item.spaAction) {

                                case SPA_LIFE.PAUSE:
                                    spaNode = pauseNode;
                                    break;
                                case SPA_LIFE.RESUME:
                                    spaNode = resumeNode;
                                    break;
                                case SPA_LIFE.UNLOAD:
                                    spaNode = unloadNode;
                                    break;
                            }
                            spaNode.value.body.push(propFrame.body[0]);
                        }
                    }
                },

                //overview
                getPureCodeStr = function (codeBody) {
                    return codeBody
                        .join('')
                        .replace(/;[\n\r\t]+/g, ';')
                        .replace(FUNCTION_PREFIX_REPLACEMENT, '')
                        //.replace(AJAX_OPTION_REGEXP,'data')
                        .replace(/;([\n\r\s]+)?,/g, ',')
                        //.replace(/;([\n\r\s]+)?;/g, ';')
                        /*.replace(/for\([^\)]+\)/gi,function(replacement){
                         var match,len=2;

                         if(replacement) {
                         match = replacement.match(/;/g);

                         len = match ? len - match.length : len;

                         replacement=replacement.replace(/\)/,';'.repeat(len)+')')
                         }

                         })*/;
                },
                getOverviewInstance = function (codeID) {
                    var instance;
                    if (overview && overview.code && (instance = overview.code[codeID])) {
                        return instance;
                    } else if (!(instance = codeMap[codeID]) && (instance = code({foreignID: codeID}).first())) {
                        codeMap[codeID] = instance;
                    }
                    return instance;
                },
                getVarList = function (overviewInstance) {
                    var instanceVarList, key, ret = [], item;
                    if (instanceVarList = overviewInstance.varList) {

                        for (key in instanceVarList) {
                            if (instanceVarList.hasOwnProperty(key)) {
                                item = instanceVarList[key];
                                ret.push({
                                    name: item.name,
                                    namespace: 'local',
                                    inFunction: item.inFunction,
                                    value: JSON.parse(JSON.stringify(item.value || ''))
                                });
                            }

                        }

                        if (overview && overview.varList) {
                            for (key in overview.varList) {
                                if (overview.varList.hasOwnProperty(key)) {
                                    ret.push({
                                        name: item.name,
                                        namespace: item.namespace,
                                        value: JSON.parse(JSON.stringify(item.value || ''))
                                    })
                                }
                            }
                        }


                        return ret;
                    } else {
                        return varList([{
                            type: 'var',
                            namespace: 'local',
                            belongTo: overviewInstance.foreignID
                        }, {type: 'var', namespace: 'domain'}, {type: 'var', namespace: 'scope'}])
                            .get().map(function (item) {
                                return {
                                    name: item.name,
                                    namespace: item.namespace,
                                    inFunction: item.inFunction || '',
                                    value: JSON.parse(JSON.stringify(item.value || ''))
                                }
                            });
                    }
                },
                registerOverviewCode = function (item) {
                    var str,
                        name = item.name,
                        namespace = item.namespace;
                    if (!(varMap[namespace][name]) && ((str = getDefineVariable(item, false)) !== name)) {
                        varMap[namespace][name] = true;
                        varArr[namespace].push(str);
                    }
                },
                getDefineVariable = function (item, isBlock) {
                    var str = item.name,
                        value,
                        temp, tempHead, tempBody;

                    if ((value = item.value) && value.value) {

                        overviewGetLoop([value], tempHead = [], tempBody = [], '', isBlock);

                        temp = tempBody.join('').replace(FUNCTION_PREFIX_REPLACEMENT, '');

                        /*if (value.expression) {
                         temp = value.expression.replace(EXPRESSION_REPLACEMENT, temp);
                         }*/

                        str += '=' + temp;
                    }

                    return str + (isBlock ? (item.post || '') : '');
                },
                getVariables = function (varList, codeHead, inFunction) {
                    var item, i;

                    if (varList) {
                        varList = JSON.parse(JSON.stringify(varList));
                        for (i = -1; item = varList[++i];) {

                            item.post = ';';
                            switch (item.namespace) {
                                case 'domain':
                                case 'scope':
                                    registerOverviewCode(item);

                                    break;

                                case 'local':
                                    if (item.inFunction === inFunction) {
                                        codeHead.push(getDefineVariable(item, false));
                                    }
                                    break;
                            }
                        }
                    }
                },
                getVariableByIdInEDM = function (id) {
                    var ret;
                    if (ret = id.match(/##data_OVERVIEW_VAR##/)) {
                        ret = 'data';
                    } else if (ret = id.match(/##response_OVERVIEW_VAR##/)) {
                        ret = 'response';
                    } else if (ret = id.match(/_?([^_]+)_(domain|scope|local)/)) {
                        ret = VAR_MAP[ret[2]] + ret[1].replace(/#/g, '');
                    }

                    if (!ret) {
                        errorMsg.push(['组件"' + structure({widgetID: currentWidgetID}).first().attr.widgetName + '"' + currentConfig + '(' + currentConfigName + ')前端逻辑引擎配置变量有误。']);
                        ret = '""';
                    }

                    return ret;
                },
                overviewGetLoop = function (codeList, codeHead, codeBody, anchorStr, isBlock, widgetID) {
                    var i, j, k, cursor, item, body, tempStr,
                        condition, args, name,
                        subItem, statements, fragments;

                    codeList = JSON.parse(JSON.stringify(codeList || {}));


                    for (i = -1; item = codeList[++i];) {
                        if (item.pre) {
                            codeBody.push(item.pre);
                        }

                        cursor = i;

                        switch (item.type) {

                            case 'code':


                                if (item.value && item.value[item.value.length - 1] === ';') {
                                    item.value = item.value.substring(0, item.value.length - 1);
                                }

                                item.value && codeBody.push('\n\r' + item.value + '\n\r');
                                break;
                            case "variable":
                            case 'var':
                                if (typeof item.value === 'string') {
                                    codeBody.push(VAR_MAP[item.namespace] + item.value);
                                } else if (body = item.value) {

                                    codeBody.push(VAR_MAP[body.namespace] + body.name || body.value);


                                    if ((body = body.value) && body.type) {
                                        codeBody.push('=');

                                        body.post = (isBlock && item.isBlock !== false ? ';' : '') + (item.post || '');
                                        item.post = '';

                                        args = [cursor + 1, 0];
                                        args.push(body);

                                        codeList.splice.apply(codeList, args);

                                        cursor++;
                                    } else if (!item.post && isBlock && item.isBlock !== false) {
                                        codeBody.push(';');
                                    }
                                }

                                break;

                            case 'request':

                                break;

                            case 'response':

                                break;
                            case 'if':

                                if ((item.yesBody && item.yesBody.length || item.noBody && item.noBody.length) && !$.isEmptyObject(item.condition)) {
                                    condition = item.condition;

                                    condition.pre = (condition.pre || '') + '\nif(';
                                    condition.isBlock = false;
                                    condition.post = '){' + (condition.post || '');


                                    args = [cursor + 1, 0];
                                    args.push(condition);

                                    codeList.splice.apply(codeList, args);
                                    cursor++;

                                    if ((body = item.yesBody) && body.length) {
                                        //body[0].pre = (body[0].pre||'')+'{';
                                        body[body.length - 1].post = '}' + (body[body.length - 1].post || '');

                                        codeList.splice.apply(codeList, [cursor + 1, 0].concat(body));
                                        cursor = cursor + body.length;
                                    }

                                    if ((body = item.noBody) && body.length) {
                                        body[0].pre = (body[0].pre || '') + 'else{';
                                        body[body.length - 1].post = '}' + (body[body.length - 1].post || '');

                                        codeList.splice.apply(codeList, [cursor + 1, 0].concat(body));
                                        cursor = cursor + body.length;
                                    }

                                    args = [cursor + 1, 0];
                                    args.push({
                                        type: 'code',
                                        value: item.post
                                    });
                                    item.post = '';

                                    codeList.splice.apply(codeList, args);
                                    cursor++;
                                } else {
                                    errorMsg.push(['组件"' + structure({widgetID: currentWidgetID}).first().attr.widgetName + '"' + currentConfig + '(' + currentConfigName + ')前端逻辑引擎配置if语句有误。']);
                                }
                                break;
                            case 'function':
                                if (item.value === 'app.behavior()') {//特殊处理该方法
                                    item.params && item.params[3] && (item.params[3].type = 'handler');
                                }

                                if (item.expression && !item.expression.match(EXPRESSION_REPLACEMENT)) { //直接是没有占位符的代码
                                    codeBody.push(item.expression);
                                } else {									//if(true){##_VALUE##}else{##_VALUE##}
                                    item.value = transformForeignKey(item.value);

                                    if (item.value.indexOf('(') !== -1) {
                                        name = item.value.substr(0, item.value.indexOf('('));
                                    } else {
                                        name = item.value;
                                    }

                                    if (name === OVERVIEW_AJAX_ANCHOR) {
                                        tempStr = anchorStr ? (anchorStr + (isBlock && item.isBlock !== false ? ';' : '')) : '';
                                        codeBody.push(item.expression ? item.expression.replace(EXPRESSION_REPLACEMENT, tempStr) : tempStr);
                                        //item.post = ';';
                                    } else {
                                        if ((body = item.params) && body.length) {

                                            body[0].pre = (body[0].pre || '') + '(';

                                            for (j = body.length; j > 0;) {
                                                subItem = body[--j];
                                                if (!subItem) {
                                                    body.splice(j, 1);
                                                } else {
                                                    if (!subItem.type) {
                                                        subItem.value = 'undefined';
                                                        subItem.type = 'code';
                                                    }

                                                    if (subItem.value && subItem.value[subItem.value.length - 1] === ';') {
                                                        subItem.value = subItem.value.substring(0, subItem.value.length - 1) + '\n';
                                                    }

                                                    subItem.post = ',' + (subItem.post || '');
                                                }
                                            }

                                            body[body.length - 1].post = ')\n';//+ (isBlock && item.isBlock !== false ? ';' : '');// + (item.post || '');

                                            body = [{
                                                type: 'code',
                                                value: name
                                            }].concat(body);
                                        } else {
                                            body = [{
                                                type: 'code',
                                                value: replaceFunctionPlaceHolder(item.value).replace(/;/gi, '') + (isBlock && item.isBlock !== false ? ';' : '')
                                            }];
                                        }

                                        fragments = item.expression ? item.expression.split(EXPRESSION_REPLACEMENT) : [];
                                        statements = [];

                                        if (fragments.length) {
                                            for (j = -1, args = fragments.length - 1; ++j < args;) {
                                                statements.push({
                                                    type: 'code',
                                                    value: fragments[j]
                                                });
                                                statements = statements.concat(body);
                                            }
                                            statements.push({
                                                type: 'code',
                                                value: fragments[fragments.length - 1]
                                            });
                                        } else {
                                            statements = body;
                                        }

                                        codeList.splice.apply(codeList, [cursor + 1, 0].concat(statements));
                                        cursor = cursor + statements.length;

                                    }

                                    codeList.splice.apply(codeList, [cursor + 1, 0, {
                                        type: 'code',
                                        value: item.post
                                    }]);
                                    item.post = '';
                                }


                                break;
                            case 'handler':

                                //函数作为入参的时候

                                if (item.expression) {
                                    codeBody.push(item.expression.replace(EXPRESSION_REPLACEMENT, transformForeignKey(item.value).replace(/\([^$]+/, '')));
                                } else {
                                    codeBody.push(transformForeignKey(item.value).replace(/\([^$]+/, ''));
                                }

                                break;
                            case 'object':
                                body = [];

                                subItem = item.value;

                                if (subItem) {
                                    //旧版逻辑概览
                                    for (j in subItem) {
                                        if (subItem.hasOwnProperty(j)) {
                                            args = subItem[j];

                                            if (args.type && args.value !== undefined) {
                                                args.pre = j + ':';
                                                args.post = ',';
                                                args.isBlock = false;
                                                body.push(args);
                                            }
                                        }
                                    }
                                }

                                if (body.length > 0) {
                                    body[0].pre = '{' + body[0].pre;

                                    body[body.length - 1].post = '}';
                                } else {
                                    body.push({
                                        pre: '{',
                                        post: '}',
                                        type: 'code',
                                        value: ''
                                    })
                                }

                                //可能extend option
                                if (item.key && item.key.match(OPTION_REGEXP)) {
                                    body[0].pre = /* '$.extend(true, ' + body[0].pre */'';
                                    body[body.length - 1].post = /* body[body.length - 1].post + ',' +  */item.key.replace(OPTION_REGEXP, PROPS.OPTION + getID(widgetID)) + (item.post || '');
                                } else {
                                    body[body.length - 1].post = body[body.length - 1].post + (item.post || '');
                                }

                                args = {
                                    type: 'code',
                                    value: body[body.length - 1].post
                                };
                                body[body.length - 1].post = '';
                                body.push(args);

                                item.post = '';
                                codeList.splice.apply(codeList, [cursor + 1, 0].concat(body));
                                cursor = cursor + body.length;

                                // body = [];
                                // if (value = item.value)
                                //     for (k in value) {
                                //         args = value[k];
                                //         if (args.value !== undefined && args.type) {
                                //             args.pre = k + ':';
                                //             args.post = ',';
                                //             body.push(args);
                                //         }
                                //
                                //     }
                                // if (body.length) {
                                //
                                // } else {
                                //     body.push({
                                //         pre: '{',
                                //         post: '}',
                                //         type: 'code',
                                //         value: ''
                                //     })
                                // }
                                //
                                // body[body.length-1].post='';
                                // body.push({
                                //     type:'code',
                                //     value:'}'
                                // })
                                //
                                // item.post='';
                                // codeList.splice.apply(codeList,[cursor+1,0].concat(body));

                                break;

                            case 'array':
                                if (body = item.value) {
                                    for (j = body.length, args = []; subItem = body[--j];) {
                                        if ((subItem = subItem.value) && (subItem = subItem[0]) && subItem.value) {
                                            args[j] = subItem;
                                        }
                                    }

                                    if (args.length) {
                                        for (j = args.length; j;) {
                                            args[--j].post = ',';
                                        }

                                        args[0].pre = '[';
                                        args[args.length - 1].post = ']' + (item.post || '');
                                        item.post = '';

                                        codeList.splice.apply(codeList, [cursor + 1, 0].concat(args));
                                        cursor = cursor + args.length;
                                    } else {
                                        codeBody.push('[]');
                                    }
                                }
                                break;
                            case 'anchor':
                                switch (item.value) {
                                    case 'requestData':

                                        codeHead.push('data');

                                        anchorStr && codeBody.push('data=' + anchorStr + ';');
                                        break;
                                    case 'returnData':
                                        codeBody.push('\nreturn data;');

                                        break;

                                    case 'app.modal()':
                                    case 'app.open()':
                                        if (anchorStr) {
                                            if ((j = anchorStr.indexOf('{')) !== -1) {//app.modal(e,{height:'',width:''});
                                                codeBody.push(anchorStr.substring(0, j));

                                                if (item.params) {
                                                    args = JSON.parse(anchorStr.substring(j, anchorStr.length - 2).replace(new RegExp('(' + MODAL_PARAM_KEY.join('|') + ')', 'gi'), '"$1"'));
                                                    body = item.params[0].value || {};

                                                    for (k in args) {
                                                        if (args.hasOwnProperty(k)) {
                                                            body[k] = {
                                                                type: 'code',
                                                                value: '"' + args[k] + '"'
                                                            }
                                                        }
                                                    }

                                                    args = item.params.concat([{
                                                        type: 'code',
                                                        value: anchorStr.substring(anchorStr.length - 2) + (item.post || '')
                                                    }]);
                                                    item.post = '';

                                                    codeList.splice.apply(codeList, [cursor + 1, 0].concat(args));

                                                } else {
                                                    codeBody.push(anchorStr.substring(j));
                                                }
                                            } else if ((j = anchorStr.indexOf('(')) !== -1) {//app.modal(e,auiCtx.config.wiidgetID);
                                                codeBody.push(anchorStr.substring(0, j));

                                                if (item.params) {
                                                    codeBody.push('($.extend(true,{},' + anchorStr.substring(j + 1, anchorStr.indexOf(')')) + ',');

                                                    args = item.params.concat([{
                                                        type: 'code',
                                                        value: ')' + anchorStr.substring(anchorStr.length - 2) + (item.post || '')
                                                    }]);
                                                    item.post = '';

                                                    codeList.splice.apply(codeList, [cursor + 1, 0].concat(args));

                                                } else {
                                                    codeBody.push(anchorStr.substring(j));
                                                }
                                            } else {
                                                codeBody.push(anchorStr);
                                            }
                                        }

                                        break;
                                    default:
                                        anchorStr && codeBody.push(anchorStr);

                                        break;
                                }
                                break;
                        }

                        if (item.post) {
                            codeBody.push(item.post);
                        }
                    }
                },
                getRequestOverviewCode = function (edmInstance, dataStr) {
                    var codeInstance,
                        codeModel,
                        startData,

                        codeHead = [],
                        codeBody = [],
                        ret = 'return ' + dataStr;

                    if (edmInstance && (codeInstance = getOverviewInstance(edmInstance.foreignID))) {
                        if (codeInstance) {
                            getVariables(getVarList(codeInstance), codeHead, OVERVIEW_FUNCTION_TYPE.REQUEST);

                            if (codeModel = codeInstance.codeModel) {
                                //for data func
                                if ((startData = codeModel.startData) && startData.length) {
                                    overviewGetLoop(startData, codeHead, codeBody, dataStr, true, codeInstance.widgetID);
                                }
                            }

                            if (codeHead.length) {
                                ret = 'var ' + codeHead.join(',') + ';'
                            }

                            if (codeBody.length) {
                                ret += getPureCodeStr(codeBody);
                            }
                        }
                    }

                    return ret;
                };

            //init
            module.walk(walker);


            if (!codeID) {
                widget({isExternal: true}).each(function (widgetConfig) {
                    var propObject, propFrame;

                    propObject = {};
                    propObject[widgetConfig.href] = {
                        template: widgetConfig && widgetConfig.template || ''
                    };
                    propObject = JSON.stringify(propObject);

                    propFrame = UglifyJS.parse("(" + propObject + ")");
                    externalNode.value.properties.push(propFrame.body[0].body.properties[0]);

                    propFrame = UglifyJS.parse('($AW["' + widgetConfig.href + '"]=$AW.' + widgetConfig.href + ')');

                    loadNode.value.body.push(propFrame.body[0]);
                });

                structure({active: true}).each(function (item) {
                    var key = item.attr.id,
                        type = item.type,
                        href = item.href,
                        propObject, propFrame,
                        hasFunction, nsl,

                        css,
                        widgetConfig,
                        render,
                        edmData, regexConfig,
                        actions, action, len,
                        elems, i, elem;


                    if (href !== WIDGET_HREF.MAIN_PANEL) {
                        widgetConfig = widgetMap[type] || (widgetMap[type] = widget({type: type}).first());


                        if (key && widgetConfig) {
                            structureMap[item.widgetID] = item;
                            keyMap[item.widgetID] = key;


                            //attr
                            propObject = {};
                            propObject[key] = item.attr || '';
                            propObject = JSON.parse(JSON.stringify(propObject));

                            //delete propObject[key].widgetName;


                            propFrame = UglifyJS.parse("(" + JSON.stringify(propObject) + ")");
                            attrNode.value.properties.push(propFrame.body[0].body.properties[0]);

                            //css
                            propObject = {};
                            if ((propObject[key] = delEmptyObj(item.css)) && !$.isEmptyObject(propObject[key])) {
                                propFrame = UglifyJS.parse("(" + JSON.stringify(propObject) + ")");
                                cssNode.value.properties.push(propFrame.body[0].body.properties[0]);
                            }

                            //widgetNSL
                            propObject = {};

                            nsl = item.nsl || [];
                            propObject[key] = nsl.map(function (currentValue) {
                                return {
                                    key: currentValue.key,
                                    value: currentValue.value
                                }
                            });


                            if (propObject && propObject[key].length) {
                                propObject = JSON.stringify(propObject);

                                propFrame = UglifyJS.parse("(" + propObject + ")");
                                widgetNSLNode.value.properties.push(propFrame.body[0].body.properties[0]);
                            }


                            //option
                            propObject = {};
                            propObject[key] = item.option || '';
                            propObject = transformForeignKey(JSON.stringify(propObject));
                            hasFunction = !!propObject.match(FUNCTION_PREFIX);


                            propFrame = UglifyJS.parse("(" + propObject + ")");
                            hasFunction && (propFrame = transformFunction(propFrame));

                            configsNode.value.properties.push(propFrame.body[0].body.properties[0]);


                            //validations
                            if ((edmData = item.edm) && edmData.validateType && edmData.get) {
                                regexConfig = $.extend(true, {}, edmData, {
                                    context: '##_$el##',
                                    id: edmData.validateSelector ? transformWidgetKey(edmData.validateSelector, key) : ('#' + key)
                                });

                                if (regexConfig.validateHandler) {
                                    regexConfig.validateHandler = FUNCTION_PREFIX + 'function(){ return ' + transformWidgetKey(edmData.validateHandler, key) + '.apply($el,arguments);}';
                                } else {
                                    delete regexConfig.validateHandler;
                                }

                                delete regexConfig.get;
                                delete regexConfig.successCallback;
                                delete regexConfig.errorCallback;
                                delete regexConfig.cleanCallback;
                                delete regexConfig.validateSelector;
                                delete regexConfig.validateHandler;

                                regexConfig = {
                                    desp: item.attr.widgetName,
                                    name: item.attr.name || key,
                                    validate: regexConfig
                                };

                                if (edmData.get.indexOf(FUNCTION_PREFIX) !== -1) {
                                    regexConfig.value = transformForeignKey(edmData.get);
                                }


                                propObject = {};
                                propObject[key] = {
                                    data: FUNCTION_PREFIX + 'function(){return [' +
                                    JSON.stringify(regexConfig) +
                                    '];}',
                                    successCallback: edmData.successCallback ? (FUNCTION_PREFIX + 'function(){' + transformWidgetKey(edmData.successCallback, key) + '.apply($el,arguments);}') : null,
                                    errorCallback: edmData.errorCallback ? (FUNCTION_PREFIX + 'function(){' + transformWidgetKey(edmData.errorCallback, key) + '.apply($el,arguments);}') : null,
                                    cleanCallback: edmData.cleanCallback ? (FUNCTION_PREFIX + 'function(){' + transformWidgetKey(edmData.cleanCallback, key) + '.apply($el,arguments);}') : null
                                };
                                propFrame = UglifyJS.parse("(" + JSON.stringify(propObject) + ")");
                                propFrame = transformFunction(propFrame);

                                validationsNode.value.properties.push(propFrame.body[0].body.properties[0]);


                                if (edmData.validateType) {
                                    elems = edmData.validateType.split(',');

                                    for (i = elems.length; elem = elems[--i];) {

                                        propFrame = UglifyJS.parse('({"' + elem + ' ' + regexConfig.validate.id + '":function(){' +
                                            'aweb.debug && aweb.stepTo("' + [pageModule, pageName, APPLY_TO_DESP.EDM, regexConfig.desp].join('-').replace(/["']/g, '') + '");' +
                                            'app.validate(_v_data,_v_successCallback,_v_errorCallback,_v_cleanCallback,true,true)'.replace(/_v_/g, VALIDATIONS_REPLACEMENT + key + '.') +
                                            '}})');
                                        delegateEventsNode.value.properties.push(propFrame.body[0].body.properties[0]);
                                    }
                                }
                            }

                            //init and unload
                            //组件渲染回调 调用$AW.css 时增加一个$el （组件操作对象）参数，请不要再随意替换删掉了 >_<!
                            if (((href = widgetConfig.href) !== WIDGET_HREF.MAIN_PANEL) && widgetConfig.pType !== WIDGET_TYPE.THEME) {
                                render = "##_VAR##=$AW." + href + "($('###_ID##',$el),##_OPTION##, ##_ATTR##, $AW.css('" + href + "',##_CSS##),##_AUICTX##);";

                                propFrame = UglifyJS.parse(transformWidgetKey(render, key).replace(/auiCtx\./g, ''));
                            }


                            if (widgetConfig.pType in WIDGET_TYPE.COMPLEX_WIDGET) {
                                loadBusinessWidgetList.push(propFrame.body[0]);
                            } else if (widgetConfig.pType !== WIDGET_TYPE.PACKAGE) {
                                loadTechWidgetList.push(propFrame.body[0]);
                            }

                            if ((actions = widgetConfig.action) && actions.length) {
                                for (len = actions.length; action = actions[--len];) {
                                    if (action.spaLife && ~action.spaLife.indexOf(SPA_UNLOAD) && $.trim(action.code)) {
                                        if (action.code !== TYPE.AJAX) {
                                            propFrame = UglifyJS.parse(transformForeignKey(transformWidgetKey(action.code, key)));

                                            if (widgetConfig.pType in WIDGET_TYPE.COMPLEX_WIDGET) {
                                                unloadBusinessWidgetList.push(propFrame.body[0]);
                                            } else {
                                                unloadTechWidgetList.push(propFrame.body[0]);
                                            }
                                        }
                                    }
                                }
                            } else if ((actions = widgetConfig.api) && actions.length) {//version 4.4 以上版本
                                for (len = actions.length; action = actions[--len];) {
                                    if (action.lifecycle && ~action.lifecycle.indexOf(SPA_UNLOAD) && $.trim(action.value)) {
                                        if (action.value !== TYPE.AJAX) {
                                            propFrame = UglifyJS.parse(transformForeignKey(transformWidgetKey(action.value, key)));

                                            if (widgetConfig.pType in WIDGET_TYPE.COMPLEX_WIDGET) {
                                                unloadBusinessWidgetList.push(propFrame.body[0]);
                                            } else {
                                                unloadTechWidgetList.push(propFrame.body[0]);
                                            }
                                        }
                                    }
                                }
                            }

                            //widget loaded events
                            propObject = [];
                            url({widgetID: item.widgetID, applyTo: WIDGET}).each(function (urlInstance) {

                                //罪孽深重，这里加了标签页的特殊处理接口open
                                //lijiancheng@agree.com.cn
                                //20180424
                                if (urlInstance.code.match(/##_VAR##\.open/i) && widgetConfig.href === 'layout.tabCtn') {
                                    urlInstance.order = true;
                                    urlInstance.code = urlInstance.code.replace(RESPONSE_DATA_REGEXP, AJAX_OPTION_STR);
                                }

                                propObject.push(
                                    getCallback({
                                        applyTo: APPLY_TO.STRUCTURE,
                                        foreignID: item.widgetID,
                                        handler: TYPE.AJAX,
                                        ajaxType: urlInstance.ajaxType,
                                        ajaxShelter: item.ajaxShelter,
                                        ajaxTimeout: item.ajaxTimeout,
                                        noAgreeBusData: item.noAgreeBusData,
                                        ajaxProcessData: item.ajaxProcessData,
                                        ajaxNoBlobData: item.ajaxNoBlobData,
                                        url: urlInstance.url,
                                        urlDivider: urlInstance.urlDivider,
                                        edmID: urlInstance.edmID,
                                        code: transformWidgetKey(urlInstance.code, key),
                                        ajaxKey: key + '_' + urlInstance.id,
                                        isAPIFirst: urlInstance.order,
                                        successCallback: transformWidgetKey(urlInstance.successCallback, key),
                                        noTypeJudgement: true,
                                        hasWrapFunction: false
                                    })
                                );
                            });


                            url({overviewID: {isUndefined: false}}).each(function (item) {
                            });


                            if (propObject.length) {
                                propFrame = UglifyJS.parse('({"' + key + '": function(){' + propObject.join(';') + '}})');
                                widgetLoadedEvents.value.properties.push(propFrame.body[0].body.properties[0]);


                                propFrame = UglifyJS.parse(WIDGET_LOADED_EVENTS_REPLACEMENT + key + '();');
                                loadWidgetApiList.push(propFrame.body[0]);
                            }
                        } else {
                            if (!href || href.indexOf('fake.')) {//虚拟组件无配置不报错
                                errorMsg.push('组件"' + item.attr.widgetName + '"配置丢失，无法实例化。');
                            }
                        }
                    } else {//pageNSL
                        if (key && (widgetConfig = widget({type: type}).first())) {

                            nsl = item.nsl || [];
                            propObject = JSON.stringify(nsl.map(function (item) {
                                return {
                                    key: item.key,
                                    value: item.value
                                }
                            }));
                            propFrame = UglifyJS.parse("(" + propObject + ")");

                            [].push.apply(pageNSLNode.value.elements, propFrame.body[0].body.elements);

                            //css
                            css = item.css || {};
                            if (css.cssCode && css.cssCode.className) {
                                loadNode.value.body.push(UglifyJS.parse('$el.addClass("' + css.cssCode.className + '")'));
                            }
                        }
                    }
                });

            } else if (codeInstance = getOverviewInstance(codeID)) {
                switch (codeInstance.applyTo) {
                    case 'EVENT':

                        currentConfig = APPLY_TO_DESP.EVENT;

                        events({eventID: codeInstance.foreignID}).each(eventHandler);
                        break;
                    case 'LIFECYCLE':

                        currentConfig = APPLY_TO_DESP.LIFECYCLE;

                        lifecycle({lifecycleID: codeInstance.foreignID}).each(lifecycleHandler);
                        break;
                }
            }

            loadNode.value.body = loadNode.value.body.concat(loadTechWidgetList).concat(loadBusinessWidgetList).concat(loadWidgetApiList);
            unloadNode.value.body = unloadNode.value.body.concat(unloadTechWidgetList).concat(unloadBusinessWidgetList).concat(unloadWidgetApiList);

            if (!codeID) {
                //lifecycle load timeout interval
                currentConfig = APPLY_TO_DESP.LIFECYCLE;
                lifecycle({active: true}).each(lifecycleHandler);

                //delegateEvents
                currentConfig = APPLY_TO_DESP.EVENT;
                events({active: true}).each(eventHandler);
            }

            //insert variables
            if (globalParamDefineArr.length) {
                globalParamDefineArr = GLOBAL_PARAM_PREFIX + globalParamDefineArr.join(';' + GLOBAL_PARAM_PREFIX) + ';'
            }
            if (pageParamDefineArr.length) {
                pageParamDefineArr = PAGE_PARAM_PREFIX + pageParamDefineArr.join(';' + PAGE_PARAM_PREFIX) + ';'
            }
            if (globalParamDefineArr.length + pageParamDefineArr.length) {
                loadNode.value.body = loadNode.value.body.concat(UglifyJS.parse(globalParamDefineArr + pageParamDefineArr).body);
            }

            loadNode.value.body.push.apply(loadNode.value.body, loadLifecycleList);


            if (NOT_COMPILER) {
                loadNode.value.body = loadNode.value.body.map(function (elem) {
                    var tryCatch = UglifyJS.parse('try{}catch(e){auiApp.log(e);}'),
                        body = tryCatch.body[0].body;

                    body.push(elem);


                    return tryCatch.body[0];
                });

                unloadNode.value.body = unloadNode.value.body.map(function (elem) {
                    var tryCatch = UglifyJS.parse('try{}catch(e){auiApp.log(e);}'),
                        body = tryCatch.body[0].body;

                    body.push(elem);


                    return tryCatch.body[0];
                });
            }

            //return
            result = getParsedString(module).replace(FUNCTION_PREFIX_REPLACEMENT, '').replace(PAGE_ELEMENT, '$el').replace(/\\\\\\\\/g, '\\\\')/*.replace(/\/[^\/]+\//g,function(content,cursor,context){

             debugger;
             if(content.match(/\/!*[^\/]+\*\//)){
             return content;
             }else {
             return content.replace(/\\\\/g, '\\');
             }
             })*/;

            if (viewerConfig) {

                deps = compileDeps(widget, structure);


                var level = 1, depsLevel = 0,
                    requireArray = [], viewerCode = 'function(){}',
                    rawViewerCode = UglifyJS.parse(viewerConfig.jsFileContent),
                    walker = new UglifyJS.TreeWalker(function (node) {

                        if (node instanceof UglifyJS.AST_BlockStatement) {
                            if (++depsLevel === 1) {
                                requireArray = JSON.parse(getParsedString(node).match(/\[(.+?)\]/)[0]);
                            }
                        }

                        if (node instanceof UglifyJS.AST_Function) {
                            if (level++ === 3) {
                                viewerCode = getParsedString(node);
                            }
                        }
                    });
                rawViewerCode.walk(walker);

                //添加app接口
                result = [
                    'define("', viewerConfig.href, '",', JSON.stringify(requireArray), ',', viewerCode, ');',
                    'define("awebIndex",["', viewerConfig.href, '"].concat(',
                    '	window.aweb.transformJsConfig(', JSON.stringify(deps.js), ')).concat(window.aweb.transformCssConfig(' + JSON.stringify(deps.css) + ')),',
                    'function(){',
                    '	return ', result.substring(6, result.length).replace(/"IDETAG"/g, ''),
                    '});'
                ].join('');

            } else {

                if (!NOT_COMPILER) {
                    deps = compileDeps(widget, structure);

                    result = [
                        'define([].concat(',
                        'window.aweb.transformJsConfig(', JSON.stringify(deps.js), ')).concat(window.aweb.transformCssConfig(' + JSON.stringify(deps.css) + ')),',
                        'function(){',
                        'return ', result.substring(6, result.length),
                        '});'
                    ].join('');
                }

            }

            if (errorMsg.length) {
                // throw '\n' + errorMsg.join('\n');
                console.log('\n' + errorMsg.join('\n'));
            }

            if(customCode){
                result=  result.replace(/"CUSTOM_CODE"/g,customCode);
            }
            return result;
        };
    });
})();