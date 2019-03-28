/*!
 * AUI2 1.0
 *
 * Date: 2016.05.13
 */

/**
 * @author lijiancheng@cfischina.com
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "index","const", "template", 'componentTree', 'Model.Data','config.event'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, AUI,CONST, artTemplate, ComponentTree, dataModel,EVENT_CONFIG) {


        "use strict";

        if (window.auiApp.mode === 'virtualizer') {

        } else {
            //定义EDM类
            var Edm = (function ($) {
                    var edm = function (option) {
                        return new edm.fn.init(option);
                    };

                    $.extend(edm, {
                        data: {},
                        _params: function (option) {
                            var params = {};

                            if (option.direction in EDM.DIRECTION) {
                                if (!option.edmID) {
                                    option.edmID = app.getUID();
                                    params.dataCollection =dataModel.get(option.direction).insert({
                                        direction: option.direction,
                                        widgetID: option.widgetID,
                                        foreignID: option.foreignID,
                                        edmID: option.edmID,
                                        list: [],
                                        applyTo: option.applyTo,
                                        active: true
                                    });

                                    params.isNew = true;
                                } else {
                                    params.dataCollection = dataModel.get(option.direction)({edmID: option.edmID});
                                }

                                params.widgetID = option.widgetID;
                                params.foreignID = option.foreignID;
                                params.edmID = option.edmID;
                                params.direction = option.direction;
                                params.$list = option.$list;//此处的$list赋值，避免下面option.$list为undefined
                                params.applyTo = option.applyTo;//此处的applyTo赋值，避免下面option.applyTo为undefined

                                params.data = params.dataCollection.first();

                                //修复$list不存在的bug
                                if (params.data === false && params.edmID && option.direction) {

                                    params.dataCollection = dataModel.get(option.direction).insert({
                                        direction: option.direction,
                                        widgetID: option.widgetID,
                                        foreignID: option.foreignID,
                                        edmID: option.edmID,
                                        list: [],
                                        applyTo: option.applyTo,
                                        active: true
                                    });

                                    params.data = params.dataCollection.first();
                                }

                                params.data.direction = params.direction;
                                params.callback = option.callback;
                            }

                            return params.data ? params : {};
                        },
                        copy: function (fromEdmID, toWidgetID, toForeignID, toEdmID, toReplace, toDirection, toApply) {
                            var newID = toEdmID,
                                fromEdmCache,
                                toEdmCache,
                                list;


                            if (fromEdmCache = dataModel.get('request')({edmID: fromEdmID}).first()) {
                                toEdmCache = dataModel.get('request')({edmID: toEdmID}).first();
                            } else {
                                fromEdmCache = dataModel.get('response')({edmID: fromEdmID}).first();
                                toEdmCache = dataModel.get('response')({edmID: toEdmID}).first();
                            }


                            if (!toEdmCache || fromEdmCache.eTag !== toEdmCache.eTag && toReplace) {
                                if (list = fromEdmCache.list) {
                                    if (list.TAFFY) {
                                        list = JSON.parse(JSON.stringify(list().get()));
                                    } else {
                                        list = list ? JSON.parse(JSON.stringify(list)) : [];
                                    }
                                } else {
                                    list = [];
                                }
                                list.map(function (elem) {
                                    elem.___id && (delete elem.___id);
                                    elem.___s && (delete elem.___s);
                                });

                                if (!toEdmCache || !toEdmID) {
                                    toEdmCache = JSON.parse(JSON.stringify(fromEdmCache));
                                    toEdmCache.___id && (delete toEdmCache.___id);
                                    toEdmCache.___s && (delete toEdmCache.___s);
                                    toEdmCache.widgetID = toWidgetID;
                                    toEdmCache.foreignID = toForeignID || toWidgetID;
                                    toEdmCache.edmID = newID = app.getUID();
                                } else {
                                    newID = toEdmCache.edmID || toEdmID;
                                }

                                toEdmCache.list = list;
                                toEdmCache.referenceID = fromEdmCache.edmID;
                                toEdmCache.applyTo = toApply || toEdmCache.applyTo;

                                if (!toEdmID) {//如果是第一次插入时，则不需要同步引用数据源
                                    toEdmCache.dataCollection = dataModel.get(toDirection || fromEdmCache.direction).insert(toEdmCache);
                                } else {//如果不是第一次插入，则需要同步数据源，将引用数据源都同步一次
                                    Edm(toEdmID).update(toEdmCache);
                                }
                            } else {
                                newID = toEdmCache.edmID;
                            }

                            return newID;
                        }
                    });

                    edm.fn = edm.prototype = {
                        //basic info
                        constructor: edm,
                        length: 0,
                        version: '510000',

                        /*
                         *   version AUI2 v4.2,
                         *   log     重写init方法，以适应更多的使用场景
                         *   author  lijiancheng@agree.com.cn
                         *
                         * */
                        init: function (option) {
                            if (option && option.version) {
                                return option;
                            } else {
                                var edms = $.isArray(option) ? option : [option],
                                    context = this,
                                    ret, params, item,
                                    APPLY_TO = CONST.STEP.APPLY_TO;

                                edms.map(function (option) {
                                    var elem;

                                    if (typeof option === 'string') {   //edmID
                                        //v4.2新增 针对没有缓存就调用的问题
                                        if (!(elem = edm.data[option])) {
                                            if (elem = dataModel.get('request')({edmID: option}).first()) {
                                                elem.direction = EDM.DIRECTION.request;
                                                elem = edm._params(elem);
                                            } else if (elem = dataModel.get('response')({edmID: option}).first()) {
                                                elem.direction = EDM.DIRECTION.response;
                                                elem = edm._params(elem);
                                            }
                                            edm.data[option] = elem;
                                        }
                                    } else if (option && option.direction) {
                                        if (!option.edmID) {
                                            elem = edm._params(option);
                                            edm.data[elem.edmID] = elem;
                                        } else {
                                            elem = edm.data[option.edmID] ? edm.data[option.edmID] : (edm.data[option.edmID] = edm._params(option));
                                        }

                                        if (option.$list) {
                                            edm.data[elem.edmID].$list = elem.$list = option.$list;
                                        }
                                        if (option.callback) {
                                            edm.data[elem.edmID].callback = elem.callback = option.callback;
                                        }
                                    }

                                    if (elem) {
                                        context._push(elem);

                                        if (!elem.name) {
                                            switch (elem.applyTo) {
                                                case APPLY_TO.WIDGET:
                                                    elem.name = $AW(elem.widgetID).name();
                                                    break;
                                                case APPLY_TO.EVENT:
                                                    elem.name = dataModel.get('event')({eventID: elem.foreignID}).first().desp;
                                                    break;
                                                case APPLY_TO.LIFECYCLE:
                                                    item = dataModel.get('lifecycle')({lifecycleID: elem.foreignID}).first();
                                                    elem.name = CONST.LIFECYCLE.LIFECYCLE_TEXT.SPA[item.spaAction + '_' + item.pageAction];
                                                    break;
                                            }
                                            elem.text = CONST.EDM.DIRECTION[elem.direction + 'Text'];
                                        }

                                        if (elem.data && !(elem.data.list && elem.data.list.TAFFY)) {
                                            elem.data.list = app.taffy(elem.data.list || []);
                                        }

                                        if (elem.isNew) {
                                            elem.isNew = false;
                                            edmUpdateDataModelList(ret);
                                        }
                                    }
                                });
                            }

                            return this;
                        },

                        update: function (data) {

                            if (this.length) {
                                var editingEdmID = g_edm && g_edm.id();

                                this._map(function (elem) {
                                    var currentEdmID = elem.edmID,
                                        updateData, list,

                                        updateReferenceData = function (item) {
                                            var edm;

                                            if (item.edmID !== currentEdmID) {
                                                edm = Edm(item.edmID);

                                                edm.update({
                                                    list: JSON.parse(JSON.stringify(list))
                                                });

                                                if (item.edmID === editingEdmID) {
                                                    updateSltTreeView(edm);
                                                }

                                                if (item.widgetID === AUI.currentWidgetID) {
                                                    edmUpdateDataModelList(edm);
                                                }
                                            }
                                        };

                                    if (elem) {
                                        updateData = data ? $.extend(true, {}, data) : elem.data;
                                        updateData.eTag = Date.now();

                                        //同步引用的数据源
                                        if (list = updateData.list) {

                                            list = JSON.parse(JSON.stringify(list.TAFFY ? list().get() : list));

                                            list.map(function (elem) {
                                                //引用数据源不包括getter和setter
                                                delete elem.___s;
                                                delete elem.___id;
                                            });

                                            dataModel.get('response')({referenceID: elem.edmID}).each(updateReferenceData);
                                            dataModel.get('request')({referenceID: elem.edmID}).each(updateReferenceData);
                                        }

                                        if (updateData.list && !updateData.list.TAFFY) {
                                            updateData.list = app.taffy(updateData.list);
                                        }

                                        elem.dataCollection.update(updateData);
                                        updateData = elem.dataCollection.first();

                                        if (!updateData) {
                                            elem.dataCollection = dataModel.get(elem.direction)({edmID: elem.edmID});
                                            updateData = elem.dataCollection.first();
                                        }
                                        elem.data = updateData;
                                    }
                                });
                            }

                            return this;
                        },

                        get: function (index) {
                            return this[index] ? this[index] : {};
                        },
                        id: function () {
                            return this.length ? this[0].data.edmID : undefined;
                        },
                        direction: function () {
                            return this[0] && this[0].direction;
                        },
                        each: function (callback) {
                            for (var i = -1, item; item = this[++i];) {
                                callback.call(item, i, item);
                            }

                            return this;
                        },

                        /*
                         *   @boolean raw    是否为原生的list
                         *
                         * */
                        list: function (raw) {
                            var list, ret = [],
                                notActiveEntityMap = {};

                            if (this.length) {
                                list = this[0].data.list;
                                list = list.TAFFY ? list().get() : list;
                            } else {
                                list = [];
                            }

                            if (raw) {
                                ret = JSON.parse(JSON.stringify(list));

                                ret.map(function (elem) {
                                    delete elem.___s;
                                    delete elem.___id;
                                });
                            } else {
                                list.map(function (elem) {
                                    if (elem.uid) {
                                        if (elem.active === false) {
                                            notActiveEntityMap[elem.uid] = true;
                                        }
                                    } else if (elem.active && !notActiveEntityMap[elem.pID]) {
                                        ret.push(elem);
                                    }
                                });

                                ret = ret.sort(function (a, b) {
                                    var ret, aItem = a, bItem = b;

                                    a = a.index;
                                    b = b.index;

                                    if (!a && !b) {
                                        ret = 0;
                                    } else if (!a) {
                                        ret = -1;
                                    } else if (!b) {
                                        ret = 1;
                                    } else {
                                        ret = parseInt(a, 10) - parseInt(b, 10);
                                    }

                                    if (!ret) {
                                        ret = 0;
                                    }

                                    return ret;
                                });
                            }


                            return ret;
                        },


                        /*
                         *   version AUI2 4.2
                         *   log     数据绑定
                         *   date    201703301019
                         *   author  lijiancheng@agree.com.cn
                         *   params  @string     fieldRef    字段ref值
                         *           @string     getterCode/setterCode   getter或setter代码
                         *           @string     widgetID                getter或setter对应的组件ID
                         * */
                        dataBind: function (fieldRef, code, widgetID) {

                            if (this.length && fieldRef && code && widgetID) {

                                code = AUI.transformForeignKey(code, widgetID);

                                this._map(function (elem) {
                                    var edm = Edm(elem.edmID),
                                        list, fieldCollection;

                                    if (elem.data && (list = elem.data.list)) {
                                        if (!list.TAFFY) {
                                            list = app.taffy(list);
                                        }

                                        fieldCollection = list({ref: fieldRef});
                                        if (fieldCollection.first()) {
                                            fieldCollection.update({id: code});
                                            edm.update({
                                                list: list,
                                                referenceID: edm.id()
                                            });
                                        }


                                    }
                                });
                            }

                            return this;
                        },

                        //internal use
                        //act like a Array
                        _push: Array.prototype.push,
                        _splice: Array.prototype.splice,
                        _map: Array.prototype.map
                    };

                    edm.fn.init.prototype = edm.fn;

                    return edm;
                })($),

                //变量定义
                EDM_MODAL = CONST.PAGE.EDM_MODAL,
                EDM = CONST.EDM,
                VALIDATE_TRANSFORM = EDM.VALIDATE.TRANSFORM,
                VALIDATE_PARAMS = CONST.EDM.VALIDATE.WIDGET,

                VALIDATE_HANDLER_PROP = VALIDATE_PARAMS[0],
                VALIDATE_HANDLER_CASCADE_ELEMENT = '#ctn_regex,#ctn_errorMsg',

                CODE_TYPE_BEHAVIOR = CONST.ACTION.TYPE.BEHAVIOR,

                NO_RECORD = {
                    EDM: '找不到对应关键字的数据' + EDM.TYPE.EDM_TEXT + '。',
                    DICT: '找不到对应关键字的数据' + EDM.TYPE.DICT_TEXT + '。',
                    PAGE_EDM: '找不到对应关键字的' + EDM.TYPE.PAGE_EDM_TEXT + '。',
                    AGREE_BUS_EDM: '该服务下没有数据' + EDM.TYPE.EDM_TEXT + '。'
                },

                customPageEdmParams = [{
                    domSelector: 'alias',
                    name: 'alias',
                    type: 'string_input',
                    desp: '变量名（英文）',
                    details: '变量名，英文名',
                    "validate": JSON.stringify({
                        "type": "account",
                        "errorMessage": "字段英文名只能包括英文数字和下划线"
                    })
                }, {
                    domSelector: 'comment',
                    name: 'comment',
                    type: 'string_input',
                    desp: '变量名（中文）',
                    details: '中文描述'
                }], customEdmParams = [{
                    domSelector: 'app',
                    name: 'app',
                    type: 'string_select',
                    desp: '所属应用',
                    details: '新建字段属于项目中的哪个应用'
                }, {
                    domSelector: 'dict',
                    name: 'dict',
                    type: 'string_select',
                    desp: '所属字典',
                    details: '新建字段属于项目中的哪个应用下的哪个数据字典'
                }, {
                    domSelector: 'name',
                    name: 'name',
                    type: 'string_input',
                    desp: '字段英文名',
                    details: '变量名，英文名，供后台使用',
                    "validate": JSON.stringify({
                        "type": "account",
                        "errorMessage": "字段英文名只能包括英文数字和下划线"
                    })
                }, {
                    domSelector: 'comment',
                    name: 'comment',
                    type: 'string_input',
                    desp: '字段描述',
                    details: '中文描述'
                }, {
                    domSelector: 'type',
                    name: 'type',
                    type: 'string_select',
                    desp: '字段类型',
                    valueArray: ['String', 'int', 'double', 'bool'],
                    despArray: ['字符串', '整型', '浮点', '布尔值'],
                    'defaultValue': 'String'
                }, {
                    domSelector: 'regex',
                    name: 'regex',
                    type: 'string_input',
                    desp: '校验',
                    details: '正则表达式'
                }, {
                    domSelector: 'errorMsg',
                    name: 'errorMsg',
                    type: 'string_input',
                    desp: '提示',
                    details: '校验失败提示'
                }],
                customPageEdmParamKey = {
                    alias: true,
                    comment: true
                },
                customEdmParamKey = {
                    APP_SELECTOR: '#app',
                    DICT_SELECTOR: '#dict'
                },
                editParams = [{
                    desp: '变量信息',
                    type: 'object',
                    collapse: false,
                    domSelector: 'fieldInfo',
                    name: 'fieldInfo',
                    list: [{
                        domSelector: 'alias',
                        name: 'alias',
                        type: 'string_input',
                        desp: '变量名',
                        details: '变量名，英文名，供后台使用'
                    }, {
                        domSelector: 'comment',
                        name: 'comment',
                        type: 'string_input',
                        desp: '字段名',
                        details: '中文描述'
                    }, {
                        domSelector: 'source',
                        name: 'source',
                        type: 'string_input',
                        desp: '来源',
                        details: '来源',
                        readonly: true
                    }, {
                        domSelector: 'edmName',
                        name: 'edmName',
                        type: 'string_input',
                        desp: '实体类名',
                        details: '实体类名',
                        readonly: true
                    }]
                }, {
                    desp: '数据绑定及校验',
                    type: 'object',
                    collapse: false,
                    domSelector: 'fieldBindAndRegex',
                    name: 'fieldBindAndRegex',
                    list: [{
                        domSelector: 'id',
                        name: 'id',
                        type: 'string_input',
                        desp: '绑定接口',
                        details: '绑定接口'
                    }, {
                        domSelector: 'expression',
                        name: 'expression',
                        type: 'string_input_html',
                        desp: '表达式',
                        details: '计算表达式',
                        value: '##_VALUE##'
                    }, {
                        domSelector: 'queryString',
                        name: 'queryString',
                        type: 'string_select',
                        desp: '是否通过QueryString方式额外传参',
                        despArray: ['是', '否'],
                        valueArray: ['true', 'false'],
                        value: 'false'
                    }, {
                        domSelector: 'urlExternal',
                        name: 'urlExternal',
                        type: 'string_select',
                        desp: '是否作为请求路径的一部分',
                        despArray: ['是', '否'],
                        valueArray: ['true', 'false'],
                        value: 'false'
                    }].concat(VALIDATE_PARAMS).concat([{
	                    name: 'successCallback',
	                    type: 'string_select',
	                    valueArray: [''],
	                    despArray: ['使用统一的处理方式'],
	                    desp: '校验成功事件'
                    }, {
	                    name: 'errorCallback',
	                    type: 'string_select',
	                    valueArray: [''],
	                    despArray: ['使用统一的处理方式'],
	                    desp: '校验失败事件'
                    }, {
	                    name: 'cleanCallback',
	                    type: 'string_select',
	                    valueArray: [''],
	                    despArray: ['使用统一的处理方式'],
	                    desp: '清除校验提示事件'
                    }])
                }, {
                    desp: '数据操作行为',
                    type: 'object',
                    collapse: false,
                    domSelector: 'fieldBehavior',
                    name: 'fieldBehavior',
                    list: [{
                        desp: '比较值',
                        name: 'fieldBehaviorFormula',
                        value: '',
                        details: '比较类型：\n小于、大于时：数字；\n等于、不等于时：字符串、数字、对象、数组、null；\n包含、不包含时：字符串、数组、对象；\n其中数组的格式为[1,2,3,"a","b","c"]，对象格式为{"a":1,"b":[],"c":"abc"}',
                        type: 'string_input'
                    }, {
                        desp: '比较条件',
                        name: 'fieldBehaviorFormulaUnit',
                        value: '',
                        details: '比较字段值和输入值返回结果。例如：\n小于：字段值0，比较值1，返回true；\n等于：字段值0，比较值1，返回false；\n不等于：字段值：1，比较值2，返回true；\n包含：字段值"abc"，比较值"startabc"，返回true；\n字段值"a"，比较值[1,2,]，返回true；\n开头：字段值"abc"，比较值"abcd"，返回true；',
                        despArray: ['无', '小于', '等于', '大于', '不等于', '包含', '不包含', '开头'],
                        valueArray: ['', 'lt', 'eq', 'gt', 'not', 'includes', 'notIncludes', 'startsWith'],
                        type: 'string_select'
                    }, {
                        'desp': '结果调用方法',
                        'details': '通过比较字段值和比较值后，得出的结果以传入参数传入给该方法',
                        'type': 'string_select',
                        domSelector: 'fieldBehaviorCode',
                        name: 'fieldBehaviorCode',
                        despArray: ['无'],
                        valueArray: [''],
                        value: ''
                    }]
                }],
                editParamKey = {
                    CTN: 'fieldBindAndRegex',
                    ID: 'id',
                    EXPRESSION: 'expression',
                    REGEX: 'regex',
                    ERROR_MSG: 'errorMsg',
                    BEHAVIOR_CODE: 'fieldBehaviorCode'
                }, editParamKeyValidate = {
                    name: {
                        "type": "account",
                        "errorMessage": "变量名只能包括英文数字和下划线"
                    },
                    alias: {
                        "type": "account",
                        "errorMessage": "变量名只能包括英文数字和下划线"
                    }
                }, editParamValue = {
                    expression: '##_VALUE##'
                },
                updFrameID,
                curScenarioId,

                //jquery object
                $ctn = $(EDM_MODAL.CTN),
                $searchFrameLink = $('[href="' + EDM_MODAL.SEARCH_FRAME + '"]', $ctn),
                $agreeBusFrameLink = $('[href="' + EDM_MODAL.AGREE_BUS_FRAME + '"]', $ctn),
                $updFrameLi = $('[href="' + EDM_MODAL.UPDATE_FRAME + '"]', $ctn).parent(),
                $search = $(EDM_MODAL.SEARCH, $ctn),
                $searchCtt = $([EDM_MODAL.SEARCH_EDM_CONTENT, EDM_MODAL.SEARCH_DICT_CONTENT, EDM_MODAL.SEARCH_PAGE_EDM_CONTENT].join(','), $ctn),
                $searchEdmCtt = $searchCtt.eq(1).children('.aui-edm-inner-content'),
                $searchDictCtt = $searchCtt.eq(0).children('.aui-edm-inner-content'),
                $agreeBusSvListCtn = $(EDM_MODAL.AGREE_BUS_SV_LIST_CTN, $ctn),
                $agreeBusSvSltEntityName = $(EDM_MODAL.AGREE_BUS_SV_SELECTED_ENTITY_NAME, $ctn),
                $agreeBusSearcher = $(EDM_MODAL.AGREE_BUS_SEARCH, $ctn),
                $agreeBusSvEntitiesCtn = $(EDM_MODAL.AGREE_BUS_SV_ENTITIES_CTN, $ctn),
                /*	$searchPageEdmCtt = $searchCtt.eq(0).children('.aui-edm-inner-content'),*/
                //$customFrame = $(EDM_MODAL.CUSTOM_FIELD_FRAME, $ctn),
                $sltCtn = $(EDM_MODAL.SELECTED_CTN, $ctn),
                $dataSourceSlt = $(EDM_MODAL.DATASOURCE_SELECTOR, $sltCtn),
                $sltTree = $(EDM_MODAL.SELECTED_TREE, $sltCtn),
                // $sltTb = $(EDM_MODAL.SELECTED_TABLE, $sltCtn),
                $updFrame = $(EDM_MODAL.UPDATE_FRAME, $ctn),
                $fieldBindAndRegex,
                $fieldBehavior,

                //treeIns
                sltTreeIns,
                agreeBusSvListTreeIns,

                //
                edmSingleHTMLTemp,
                regexPopInstance,

	            /*** 成功、失败清空回调 20190122 Start***/
	            VALIDATE_CALLBACK_MAP= {
		            successCallback:undefined,
		            errorCallback:undefined,
		            cleanCallback:undefined,
	            },

	            resumeValidateCallbackOptionAndSelect=function(oWidget,$ctx,data){
		            try{
			            var edmValue=oWidget.edm(),
				            edmParams=oWidget[0].widget.edm,
				            validateParams=edmParams && edmParams.validate;

			            Object.keys(VALIDATE_CALLBACK_MAP).forEach(key=>{
				            var $elem=$(`#${key}`,$ctx);
				            var params=validateParams[key];

				            $elem.children(':gt(0)').remove();

				            if(params && params.valueArray && params.valueArray.length){
					            $elem
						            .append(
							            params.valueArray
								            .map((value,index)=>`<option value="${value && value.trim()||''}">${params.despArray[index]}</option>`)
								            .join('')
						            );
				            }

				            if(data[key]===undefined){
					            data[key]=edmValue[key];
				            }
				            if(data[key]){
                                data[key]=data[key].trim();
                            }


				            $elem.val(data[key]);
			            });
		            }catch (e){
			            app.alert(e.message,app.alert.ERROR);
			            //throw e;
			            console.log(e);
		            }

		            return data;
	            },
	            resetValidateCallbackOptionAndSelect=function(oWidget,$ctn,data){
		            Object.keys(VALIDATE_CALLBACK_MAP).forEach(key=>{
			            data && (delete data[key]);
		            });

		            return resumeValidateCallbackOptionAndSelect(oWidget,$ctn,data);
	            },
	            clearValidateCallbackOption=function($ctx,data){
		            Object.keys(VALIDATE_CALLBACK_MAP).map(key=>{
			            $(`#${key}`,$ctx).val('').find('option').filter(':gt(0)').remove();
			            data && (delete data[key]);
		            });

		            return data;
	            },
	            /*** 成功、失败清空回调 20190122 End***/

                //view
                initView = function () {
                    var html, i, item, j, subItem,
                        $customFieldFrame = $(EDM_MODAL.CUSTOM_FIELD_FRAME, $ctn);

                    //custom field
                    //page edm
                    for (html = [], i = -1; item = customPageEdmParams[++i];) {
                        html.push(artTemplate(item.type, item));
                    }
                    $(EDM_MODAL.CUSTOM_PAGE_EDM_CONTENT, $customFieldFrame).append(html.join(''));

                    //edm
                    for (html = [], i = -1; item = customEdmParams[++i];) {
                        html.push(artTemplate(item.type, item));
                    }
                    $(EDM_MODAL.CUSTOM_EDM_CONTENT, $customFieldFrame).append(html.join(''));


                    //获取应用及数据字典列表
                    external.getAppAndDictList(function (data) {
                        var html, items, i, item;

                        data = data || [];

                        dataModel.set('appAndDictList', app.taffy(data));

                        items =dataModel.get('appAndDictList')().get();
                        html = ['<option value="" selected>默认</option>'];
                        for (i = -1; item = items[++i];) {
                            html.push('<option value="' + item.value + '">' + (item.name || item.value) + '</option>');
                        }

                        $(customEdmParamKey.APP_SELECTOR, $customFieldFrame)
                            .empty().append(html.join(''))
                            .on('change.auiEdm', function () {
                                var items, item,
                                    i,
                                    html = ['<option value="" selected>默认</option>'];

                                items =dataModel.get('appAndDictList')({value: $(this).val()}).first();

                                if (items && items.dict && items.dict.length) {
                                    items = items.dict;
                                    html = [];
                                    for (i = -1; item = items[++i];) {
                                        html.push('<option value="' + item.value + '">' + (item.name || item.value) + '</option>');
                                    }
                                }

                                $(customEdmParamKey.DICT_SELECTOR, $customFieldFrame).empty().append(html.join(''));
                            });
                    });

                    //获取agreeBus服务列表

                    //初始化服务列表，监听agreeBus 在退出agreeBus 界面 的时候销毁？


                    $agreeBusFrameLink.off('.auiAgreeBusEd').on('click.auiAgreeBusEdm', function (e) {

                        //延迟加载 服务列表树


                        agreeBusSvListTreeIns = new ComponentTree({
                            $view: $agreeBusSvListCtn,
                            AUI: AUI,
                            mode: 'edm',
                            treeData: [],
                            icon: [
                                {
                                    role: "del",
                                    class: "aui aui-shanchu",
                                    title: "删除"
                                }
                            ]
                        });

                        initServiceListView();
                        $agreeBusSvEntitiesCtn.empty();

                        $searchFrameLink.off('.auiEdm').on('click.auiEdm', function (e) {

                            agreeBusSvListTreeIns = null;

                            //解绑事件、dom保存着
                            $agreeBusSvListCtn.off();


                            $searchFrameLink.off('.auiEdm');

                        });


                    });


                    //update frame
                    for (html = [], i = -1; item = editParams[++i];) {
                        html.push(artTemplate(item.type, item));

                        for (j = -1, item = item.list; subItem = item[++j];) {
                            //init validation default value
                            subItem.domSelector = subItem.domSelector || subItem.name;
                            editParamValue[subItem.domSelector] = subItem.value || subItem.defaultValue || '';

                            html.push(artTemplate(subItem.type, subItem));
                        }
                        html.push('</ul></div>');
                    }

                    edmSingleHTMLTemp = html.join('');

                    $updFrame.children().append(edmSingleHTMLTemp);

                    $fieldBindAndRegex = $('#ctn_' + editParams[1].domSelector, $updFrame);
                    $fieldBehavior = $('#ctn_' + editParams[2].domSelector, $updFrame);


                    //延迟加载 选择树

                    app.performance.longDelay(function () {
                        sltTreeIns = new ComponentTree({
                            $view: $sltTree,
                            AUI: AUI,
                            mode: 'edm',
                            treeData: [],
                            icon: [
                                {
                                    role: "del",
                                    class: "aui aui-shanchu",
                                    title: "删除"
                                }
                            ]


                        });


                        //编辑事件、删除事件

                        $sltTree.off('.auiEdm').on('click.auiEdm', function (e) {
                            var $target = $(e.target || event.srcElement).closest('[data-role]'),
                                role = $target.attr('data-role');

                            switch (role) {
                                case 'treeItem':
                                    (function () {
                                        app.popover({
                                            $elem: $target.closest('[data-role="treeItem"]'),
                                            title: '配置数据实体及字典',
                                            content: '',
                                            width: '60%',
                                            height: '100%',
                                            init: function (popInstance) {

                                                $(this).find('.aweb-popover-body').append($updFrame);

                                                $updFrame.off('.auiEdm').on({
                                                    'change.auiEdm': updateFrameHandler,
                                                    'click.auiEdm': updateCode
                                                });

                                                resumeUpdateFrame($target.closest('.aui-tree-node').data('href'));

                                            },
                                            confirmHandler: function () {
                                                $updFrame.off('.auiEdm');
                                                $AW.trigger($AW.STATUS.WIDGET_UPDATE);
                                            }
                                        });
                                    })();

                                    break;
                                case 'del':
                                    del(g_edm, [$target.closest('.aui-tree-node').data('href')]);
                                    break;
                            }

                        })


                    });

                    updFrameID = AUI.treeSelectV2($('#' + editParamKey.ID, $updFrame), {
                        onlyTreeNode: true
                    });

                },

                initServiceListView = function () {
                    var svTreeData, treeTemp, agreeBusEntitiesCollection,
                        initData = dataModel.get('agreeBusEdmModel')().count() && dataModel.get('agreeBusEdmModel')().get(0).originData,


                        handleSvTreeData = function (data) {

                            var treeData = [];

                            var seek = [],
                                map = {},
                                i, item, deep = 0,
                                j, tempData, otherCursor, childCursor = 0,
                                cursor, dataCursor = 0, hasScenario;

                            for (i = -1; item = data[++i];) {
                                seek.push(item);
                            }

                            i = -1;

                            while (item = seek[++i]) {
                                cursor = i;

                                // AUI.data.agreeBusEdmModel({pID: item.id});
                                if (item.id) {
                                    if (item.subGroup && !(item.pID)) {

                                        dataCursor++;
                                        map[item.id] = {cursor: dataCursor, deep: deep, childCursor: childCursor};

                                        treeData.push({
                                            children: [],
                                            widgetID: item.id,
                                            pID: '',
                                            widgetName: item.name,
                                            ID: item.des || item.name,
                                            widgetIcon: 'aui aui-fuwu aui-tree-node-type',
                                            href: 'has-scenario'
                                        });

                                    }
                                }


                                item.services && item.services.length && $.each(item.services, function (index, item) {

                                    if (item.id) {

                                        if (map[item.pID]) {

                                            map[item.pID].childCursor++;

                                            dataCursor = map[item.pID].cursor;
                                            otherCursor = (map[item.pID].index && map[item.pID].index[0]) || map[item.pID].childCursor;
                                            j = map[item.pID].deep;

                                            tempData = treeData[dataCursor - 1] && treeData[dataCursor - 1].children;

                                            while (j > 0) {
                                                otherCursor = map[item.pID].index[j - 1];

                                                tempData = tempData[otherCursor - 1] && tempData[otherCursor - 1].children;

                                                j--;
                                            }

                                        } else {
                                            map[item.id] = {cursor: dataCursor, deep: deep};
                                            tempData = treeData;
                                        }

                                        tempData && tempData.push({
                                            children: [],
                                            widgetID: item.id,
                                            pID: data.id || '',
                                            widgetName: item.name,
                                            ID: item.des || item.name,
                                            widgetIcon: 'aui aui-fuwu aui-tree-node-type',
                                            href: (item.scenarios && item.scenarios.length) ? 'has-scenario' : 'no-scenario'
                                        });

                                        seek.splice.apply(seek, [cursor + 1, 0].concat(item));
                                    }


                                });


                                item.subGroup && item.subGroup.length && $.each(item.subGroup, function (index, item) {

                                    //标注有数据实体的场景
                                    hasScenario = false;

                                    if (item.services && item.services.length) {
                                        $.each(item.services, function (index, item) {
                                            hasScenario = hasScenario ? hasScenario : ((item.scenarios && item.scenarios.length) ? true : false);
                                        });
                                    } else {

                                    }

                                    if (item.id) {

                                        if (map[item.pID]) {

                                            map[item.pID].childCursor++;

                                            map[item.id] = {
                                                cursor: dataCursor,
                                                deep: map[item.pID].deep + 1,
                                                childCursor: childCursor,
                                                index: map[item.pID].index ? [].concat([map[item.pID].childCursor]).concat(map[item.pID].index) : [].concat([map[item.pID].childCursor])
                                            };

                                            dataCursor = map[item.id].cursor;
                                            otherCursor = (map[item.pID].index && map[item.pID].index[0]) || map[item.pID].childCursor;

                                            j = map[item.pID].deep;

                                            tempData = treeData[dataCursor - 1] && treeData[dataCursor - 1].children;

                                            while (j > 0) {
                                                otherCursor = map[item.pID].index[j - 1];
                                                tempData = tempData[otherCursor - 1] && tempData[otherCursor - 1].children;

                                                j--;
                                            }


                                        } else {

                                            dataCursor++;
                                            map[item.id] = {cursor: dataCursor, deep: deep, childCursor: childCursor};
                                            tempData = treeData;

                                        }


                                        tempData.push({
                                            children: [],
                                            widgetID: item.id,
                                            pID: data.id || '',
                                            widgetName: item.name,
                                            ID: item.des || item.name,
                                            widgetIcon: 'aui aui-fuwu aui-tree-node-type',
                                            href: hasScenario ? 'has-scenario' : 'no-scenario'
                                        });

                                        seek.splice.apply(seek, [cursor + 1, 0].concat(item));
                                    }


                                });


                            }
                            return treeData;
                        };

                    treeTemp = agreeBusSvListTreeIns.getChildHtml(handleSvTreeData(initData), initData.id);

                    $agreeBusSvListCtn.find('.aui-tree-ctn .aui-tree-list').append(treeTemp);


                    //搜索模块 $agreeBusSearcher（非全局）

                    $agreeBusSearcher.on('keyup.auiEdm', function () {

                        var key = $(this).val(),
                            searchAgreeBusCollection;

                        $agreeBusSvEntitiesCtn.empty().off('.auiEdm').on('click.auiEdm', function (e) {

                            var $target = $(e.target || event.srcElement).closest('[data-role]'),
                                role = $target.attr('data-role');

                            switch (role) {
                                case 'treeItem':
                                    var $field = $target.closest('.aui-tree-node'),
                                        $edm, field, edm;
                                    if (field = $field.attr('data-widget-id')) {
                                        $edm = $field.closest('.aui-tree-list').closest('.aui-tree-node');
                                        $edm.length && (edm = $edm.attr('data-widget-id'));

                                        edm = edm || field;

                                        if (edm && field) {
                                            add(g_edm, edm, field, $field.attr('data-page-edm'), true);
                                        }

                                    }

                                    break;
                            }

                        });

                        if (agreeBusEntitiesCollection) {
                            var searchDB = app.taffy(agreeBusEntitiesCollection.get());
                            searchAgreeBusCollection = searchDB([{name: {likenocase: key}}, {comment: {likenocase: key}}]);
                        }

                        if (searchAgreeBusCollection && searchAgreeBusCollection.count()) {
                            searchAgreeBusCollection.order('name').each(function (item) {
                                initServiceEntitiesView(item);

                            });

                        } else {
                            //增加NO_RECORD 提示
                            $agreeBusSvEntitiesCtn.empty().append('<span style="margin-left: 10px">' + NO_RECORD.EDM + '</span>');

                        }


                    });


                    //点击事件
                    $agreeBusSvListCtn.off('.auiEdm').on('click.auiEdm', function (e) {
                        var $target = $(e.target || event.srcElement).closest('[data-role]'),
                            role = $target.attr('data-role');


                        if (role === 'treeItem') {

                            var $serviceItem = $target.closest('.aui-tree-node'),
                                serviceID = $serviceItem.attr('data-widget-id');
                            agreeBusEntitiesCollection = dataModel.get('agreeBusEdmModel')({pID: serviceID});

                            // 更新对应服务的名称 $agreeBusSvSltEntityName
                            $agreeBusSvSltEntityName.find('h4').text($target.attr('title'));

                            if (agreeBusEntitiesCollection.first()) {

                                $agreeBusSvEntitiesCtn.empty().off('.auiEdm').on('click.auiEdm', function (e) {

                                    var $target = $(e.target || event.srcElement).closest('.aui-sv-entity-header');

                                    switch (role) {
                                        case 'treeItem':

                                            var $field = $target.closest('.aui-sv-entity-container'),
                                                $edm, field, edm;

                                            if (field = $field.attr('data-entity-id')) {

                                                if (field) {
                                                    edm = field;
                                                    add(g_edm, edm, field, $field.attr('data-page-edm'), true);
                                                }

                                            }

                                            break;
                                    }

                                });

                                agreeBusEntitiesCollection.order('name').each(function (item) {
                                    initServiceEntitiesView(item);
                                });

                            } else {
                                $agreeBusSvEntitiesCtn.empty().append('<span style="margin-left: 10px">' + NO_RECORD.AGREE_BUS_EDM + '</span>');
                            }


                        }
                    })
                },

                initServiceEntitiesView = function (data) {

                    var $entityCtt, treeTemp, entityTreeIns, entityTreeData,
                        loadTree = function (data) {
                            var treeData = [],

                                loadChildData = function (data) {
                                    var childData = [], seek = [], map = {},
                                        i, j, item, cursor, tempData, otherCursor,
                                        childCursor = 0, dataCursor = 0, deep = 0,
                                        edmDirection = g_edm.direction();


                                    for (i = -1; item = data[++i];) {
                                        seek.push(item);
                                    }

                                    i = -1;

                                    while (item = seek[++i]) {
                                        cursor = i;

                                        item.fields && item.fields.length && $.each(item.fields, function (index, item) {

                                            if ((edmDirection === EDM.DIRECTION.request && item.type === '1') || (edmDirection === EDM.DIRECTION.response && item.type === '0')) {
                                                return true;
                                            }

                                            if (!map[item.pID]) {

                                                dataCursor++;

                                                if (item.subField && item.subField.length) {
                                                    map[item.id] = {
                                                        cursor: dataCursor,
                                                        deep: deep,
                                                        childCursor: childCursor,
                                                        index: [].concat([childCursor])
                                                    };
                                                }

                                            }

                                            childData.push({
                                                children: [],
                                                widgetID: item.id,
                                                pID: item.pID || '',
                                                widgetName: item.enName,
                                                ID: item.cnName,
                                                widgetIcon: item.subField && item.subField.length ? 'aui aui-shiti aui-tree-node-type' : 'aui aui-ziduan aui-tree-node-type'
                                            });

                                            seek.splice.apply(seek, [cursor + 1, 0].concat(item));

                                        });


                                        childCursor = 0;

                                        item.subField && item.subField.length && $.each(item.subField, function (index, item) {

                                            if ((edmDirection === EDM.DIRECTION.request && item.type === '1') || (edmDirection === EDM.DIRECTION.response && item.type === '0')) {
                                                return true;
                                            }

                                            childCursor++;

                                            if (map[item.pID]) {

                                                map[item.pID].childCursor++;

                                                if (item.subField && item.subField.length) {
                                                    map[item.id] = {
                                                        cursor: map[item.pID].cursor,
                                                        deep: map[item.pID].deep + 1,
                                                        childCursor: childCursor,
                                                        index: map[item.pID].index ? [].concat([childCursor]).concat(map[item.pID].index) : [].concat([childCursor])
                                                    };
                                                }

                                                dataCursor = map[item.pID].cursor;
                                                otherCursor = map[item.pID].childCursor;

                                                j = map[item.pID].deep;
                                                tempData = childData[dataCursor - 1] && childData[dataCursor - 1].children;

                                                while (j > 0) {
                                                    otherCursor = map[item.pID].index[j - 1];
                                                    tempData = tempData[otherCursor - 1] && tempData[otherCursor - 1].children;

                                                    j--;
                                                }


                                            }

                                            tempData.push({
                                                children: [],
                                                widgetID: item.id,
                                                pID: item.pID || '',
                                                widgetName: item.enName,
                                                ID: item.cnName,
                                                widgetIcon: item.subField && item.subField.length ? 'aui aui-shiti aui-tree-node-type' : 'aui aui-ziduan aui-tree-node-type'
                                            });

                                            seek.splice.apply(seek, [cursor + 1, 0].concat(item));

                                        });

                                    }


                                    return childData;
                                };


                            treeData = loadChildData([data]);

                            if (treeData.length) {
                                $.each(treeData, function (index, item) {
                                    if (!item.pID) {
                                        item.pID = data.id;
                                    }
                                })
                            }
                            return treeData;

                        };

                    // 渲染数据实体模块 $agreeBusSvEntitiesCtn

                    entityTreeData = loadTree(data);

                    if (entityTreeData && entityTreeData.length) {
                        $agreeBusSvEntitiesCtn.append('<div class="aui-sv-entity-container" data-entity-id=' + data.id + '><div class="aui-sv-entity-header"><h5>' + data.name + '</h5></div><div class="aui-sv-entity-content"></div></div>');

                        $entityCtt = $agreeBusSvEntitiesCtn.find('[data-entity-id="' + data.id + '"] .aui-sv-entity-content');

                        entityTreeIns = new ComponentTree({
                            $view: $entityCtt,
                            AUI: AUI,
                            mode: 'edm',
                            treeData: [],
                            icon: [
                                {
                                    role: "del",
                                    class: "aui aui-shanchu",
                                    title: "删除"
                                }
                            ]
                        });

                        treeTemp = entityTreeIns.getChildHtml(entityTreeData, data.id);
                        $entityCtt.find('.aui-tree-ctn .aui-tree-list').append(treeTemp);
                    }

                },

                updateDataSourceSlt = function (edm) {
                    var html,
                        edmCache = edm[0].data,
                        edmID = edmCache.edmID,
                        option = [''],
                        requireOption = [],
                        responseOption = [],
                        direction,
                        APPLY_TO = CONST.STEP.APPLY_TO,
                        loop = function (item) {
                            var name;

                            switch (item.applyTo) {
                                case  APPLY_TO.WIDGET:
                                    name = '组件"' + $AW(item.widgetID).name() + '"的' + EDM.DIRECTION[direction + 'Text'];
                                    break;
                                case APPLY_TO.EVENT:
                                    name = '事件"' + dataModel.get('event')({eventID: item.foreignID}).first().desp + '"的' + EDM.DIRECTION[direction + 'Text'];
                                    break;
                                case APPLY_TO.LIFECYCLE:
                                    name = '生命周期"' + dataModel.get('lifecycle')({lifecycleID: item.foreignID}).first().desp + '"的' + EDM.DIRECTION[direction + 'Text'];
                                    break;
                            }

                            if (item.edmID === edmID) {
                                option[0] = '<option value="' + item.edmID + '">' + name + '</option>'
                            } else {
                                html.push('<option value="' + item.edmID + '">' + '引用' + name + '</option>');
                            }
                        };


                    html = responseOption;
                    direction = EDM.DIRECTION.response;

                    html.push('<optgroup label="' + EDM.DIRECTION.responseText + '">');
                    dataModel.get('response')({active: true}).each(loop);
                    html.push('</optgroup>');

                    if (html.length > 2) {
                        option = option.concat(html);
                    }


                    html = requireOption;
                    direction = EDM.DIRECTION.request;

                    html.push('<optgroup label="' + EDM.DIRECTION.requestText + '">');
                    dataModel.get('request')({active: true}).each(loop);
                    html.push('</optgroup>');

                    if (html.length > 2) {
                        option = option.concat(html);
                    }

                    $dataSourceSlt.empty().append(option.join('')).val(edmCache.referenceID || edmCache.edmID);
                },

                updateSltTreeView = function (edm) {

                    if (AUI.edmLock && AUI.currentEdmID === edm[0].edmID) {
                        var list = edm[0].data.list,
                            data = [], i, item, id, cursor = 0, childCursor = 0, deep = 0, map = {}, dataCursor,
                            otherCursor,
                            tempData,
                            isEdm, uid, temp = '', childTemp = '', childMap = {},
                            isAgreeBusEdm = true,
                            $pEntity, treeCtn = $sltTree.find('.aui-tree-ctn'),
                            getEdmIcon = function (type) {
                                switch (type) {
                                    case '实体':
                                        return 'aui aui-shiti aui-tree-node-type';
                                        break;
                                    case '字典':
                                        return 'aui aui-zidian aui-tree-node-type';
                                        break;
                                    case '服务':
                                        return 'aui aui-fuwu aui-tree-node-type';
                                        break;
                                    case '字段':
                                        return 'aui aui-ziduan aui-tree-node-type';
                                        break;
                                }
                            };

                        if (!list.TAFFY) {
                            list = app.taffy(list);
                            edm.update({list: list});
                        }

                        list({active: true}).each(function (item) {
                            if (!item.pID || item.uid) {
                                uid = item.uid;
                                isEdm = !!uid;

                                if (!item.pID) {

                                    cursor++;

                                    if (isEdm) {

                                        map[item.uid] = {cursor: cursor, deep: deep};

                                        data.push({
                                            widgetID: item.uid,
                                            widgetName: item.alias || item.name || item.cnName,
                                            widgetIcon: getEdmIcon(item.source),
                                            ID: item.comment || item.enName,
                                            href: [item.ref || item.id, item.index].join('.'),
                                            children: []
                                        });

                                    } else {
                                        data.push({
                                            widgetID: item.uid,
                                            widgetName: item.comment || item.cnName,
                                            widgetIcon: getEdmIcon(item.source),
                                            ID: item.alias || item.name || item.enName,
                                            href: [item.ref || item.id, item.index].join('.'),
                                            children: []
                                        })
                                    }
                                }


                                if (isEdm) {
                                    childCursor = 0;


                                    list({pID: item.uid, active: true}).each(function (item) {

                                        childCursor++;


                                        if (!item.uid) {
                                            if (map[item.pID]) {
                                                dataCursor = map[item.pID].cursor;
                                                otherCursor = map[item.pID].childCursor;
                                                tempData = data[dataCursor - 1] && data[dataCursor - 1].children;

                                                i = map[item.pID].deep;

                                                while (i > 0) {
                                                    tempData = tempData[otherCursor - 1] && tempData[otherCursor - 1].children;
                                                    i--;
                                                }

                                                tempData && tempData.push({
                                                    widgetID: '',
                                                    widgetName: item.comment || item.cnName,
                                                    widgetIcon: getEdmIcon(item.source),
                                                    ID: item.alias || item.name || item.enName,
                                                    href: [item.ref || item.id, item.index].join('.'),
                                                    children: []
                                                });
                                            }


                                        } else {

                                            // 增加 deep
                                            map[item.uid] = {cursor: cursor, deep: deep, childCursor: childCursor};
                                            map[item.uid].deep++;
                                            dataCursor = map[item.uid].cursor;
                                            tempData = data[dataCursor - 1] && data[dataCursor - 1].children;

                                            tempData && tempData.push({
                                                widgetID: item.uid,
                                                widgetName: item.alias || item.name || item.cnName,
                                                widgetIcon: getEdmIcon(item.source),
                                                ID: item.comment || item.enName,
                                                href: [item.ref || item.id, item.index].join('.'),
                                                children: []
                                            });


                                        }
                                    })
                                }

                            }
                        });

                        if (sltTreeIns) {
                            temp = sltTreeIns.getChildHtml(data, null);
                            treeCtn.find('.aui-tree-list').empty().append(temp);
                        }

                        //update dataSource value
                        $dataSourceSlt.val(edm[0].data.referenceID);

                    }

                },

                updateFrameHandler = function (e) {

                    var $input = $(e.target || event.srcElement),
                        elem = g_edm[0],
                        list = elem.data.list,
                        listCollection = list({index: AUI.currentEdmUpdatingIndex}),
                        data = listCollection.first(),

                        oldDataSource = {
                            referenceID: elem.data.referenceID + '',
                            list: JSON.stringify(list.TAFFY ? list().get() : list)
                        }, newDataSource = {
                            referenceID: elem.data.edmID + ''
                        },

                        key = $input.attr('id'),
                        oldValue = data[key] + '',
                        newValue = $.trim($input.val()),
                        widgetID, oWidget, obj,
                        validateResult = true,
                        i, item, prop, edmParams,

                        //validateHandler
                        validateHandlerHTML = [], validateHandler, values, desps;

                    if (oldValue !== newValue) {

                        //校验
                        if (editParamKeyValidate[key]) {
                            validateResult = AUI.validateInput(newValue, editParamKeyValidate[key], null);
                        }

                        if (validateResult) {
                            data[key] = newValue;

                            //如果选择是组件ID，则检查该组件有没有配置EDM，如果有则将值付给EDM配置
                            if (key === editParamKey.ID) {

                                //update validate handler option
                                validateHandlerHTML = ['<option value="' + VALIDATE_HANDLER_PROP.valueArray[0] + '" >' + VALIDATE_HANDLER_PROP.despArray[0] + '</option>'];


                                if ((widgetID = newValue.match(CONST.REGEX.FOREIGN_WIDGET.FOREIGN_WIDGET_SPILT_PASTE)) && (widgetID = widgetID[1])) {
                                    oWidget = $AW(widgetID);

                                    if ((validateHandler = oWidget[0].widget.edm)
                                        && (validateHandler = validateHandler.validate)
                                        && (validateHandler = validateHandler.validateHandler)) {

                                        if (values = validateHandler.valueArray) {
                                            desps = validateHandler.despArray;
                                            values.map(function (elem, index) {
                                                validateHandlerHTML.push('<option value="' + elem + '" >' + desps[index] + '</option>');
                                            });
                                        }
                                    }

                                    $('#' + VALIDATE_HANDLER_PROP.name, $fieldBindAndRegex)
                                        .empty()
                                        .append(validateHandlerHTML.join(''));

                                    edmParams = oWidget.edm();

                                    for (i = VALIDATE_PARAMS.length; item = VALIDATE_PARAMS[--i];) {
                                        prop = item.domSelector || item.name;

                                        if (edmParams[prop] !== undefined) {
                                            data[prop] = edmParams[prop];
                                            $('#' + prop, $fieldBindAndRegex).val(data[prop]);
                                        }
                                    }

	                                data=resetValidateCallbackOptionAndSelect(oWidget,$fieldBindAndRegex,data);
                                }
                                else {
                                    $('#' + VALIDATE_HANDLER_PROP.name, $fieldBindAndRegex)
                                        .empty()
                                        .append(validateHandlerHTML.join(''))
                                        .val(VALIDATE_HANDLER_PROP.valueArray[0]);

                                    data[VALIDATE_HANDLER_PROP.name] = VALIDATE_HANDLER_PROP.valueArray[0];

	                                //清空自定义提示
	                                data=clearValidateCallbackOption($fieldBindAndRegex,data);
                                }
                            }


                            if (g_edm.direction() === EDM.DIRECTION.request && data[VALIDATE_HANDLER_PROP.name] !== undefined) {
                                $fieldBindAndRegex.find(VALIDATE_HANDLER_CASCADE_ELEMENT)[
                                    data[VALIDATE_HANDLER_PROP.name] ? 'addClass' : 'removeClass']('hide');
                            }

                            //如果修改页面变量同步改变到页面变量中
                            if (data.isCustom === EDM.TYPE.PAGE_EDM && key in customPageEdmParamKey) {
                                obj = {};
                                obj[key] = data[key];
                                dataModel.get('pageEdm')({ref: data.ref}).update(obj);
                            }

                            //update data model
                            listCollection.update(data);
                            g_edm.update({
                                list: list,
                                referenceID: newDataSource.referenceID
                            });
                            newDataSource.list = JSON.stringify(list().get());

                            //update view
                            updateSltTreeView(g_edm);
                            edmUpdateDataModelList(g_edm);

                        } else {
                            $input.val(oldValue);
                        }
                    }
                },
                updateCode = function (e) {

                    var $target = $(e.target || event.srcElement),
                        $el = $target.closest('[data-role]'),
                        $parent = $el.closest('ul'),
                        $prev = $el.prev(),
                        role = $el.attr('data-role'),
                        editor,
                        title,
                        val, splitResult, replaceStr, str;

                    switch (role) {
                        case 'edmCode':

                            val = $("#id", $parent).val();
                            if (val.indexOf('OVERVIEW_VAR') > -1) {
                                splitResult = val.split('_');
                                switch (splitResult[splitResult.length - 3]) {
                                    case 'scope':
                                        str = 'pageParams.'; //页面
                                        break;
                                    case'domain':
                                        str = 'g_globalParams.';
                                        break;
                                }
                                replaceStr = (str || '') + $("#id", $parent).next().val();
                            } else {
                                replaceStr = val;
                            }
                            title = '占位符"##_VALUE##"表示"' + (replaceStr)
                                    .replace(/_parseFunction_/, '')
                                    .replace(/##([^_]+)_WID_VAR##/i, function (match, widgetID) {
                                        return 'auiCtx.variables.' + $AW(widgetID).attr().id;
                                    })
                                    .replace(/\([^\(]*\)/i, '') + '"';

                            app.popover({
                                $elem: $el,
                                title: '表达式(' + title + ')',
                                content: '',
                                width: '60%',
                                height: '100%',
                                init: function (popInstance) {
                                    var $popoverBody = $(this).find('.aweb-popover-body');
                                    $popoverBody.css({'padding': '0'});
                                    editor = AUI.vscode.create(
                                        $popoverBody, {
                                            value:  $prev.attr('data-value'),
                                            language: 'javascript'
                                        });

                                    $(this).on('screenChange', function () {
                                        editor.layout();
                                    })
                                },
                                confirmHandler: function (popInstance) {
                                    var value = editor.getValue();

                                    $prev.attr({'data-value': value, 'value': value, 'title': value});

                                    $prev.trigger('change');
                                    $AW.trigger($AW.STATUS.PREVIEW_FRESH);
                                }

                            });
                            break;
                    }


                },

                updateUpdateFrameOptions = function (edm, updFrameID, $updFrame, varList) {
                    var widgetList = [],
                        insList = [],
                        edmMap = {},
                        html = ['<option selected="selected" value="">无</option>'],
                        widgetDirection = edm[0].direction === EDM.DIRECTION.request ? EDM.DIRECTION.get : EDM.DIRECTION.set,
                        widgetDirectionText = EDM.DIRECTION[widgetDirection + 'Text'],
                        items, len, item,
                        NAME_REGEX = CONST.REGEX.WIDGET.NAME,edmTreeInList;

                    //refresh databindID

                    dataModel.get('widget')({edm: {isObject: true}}).each(function (widget) {
                        var edm = widget.edm[widgetDirection];

                        if (edm && edm.length) {
                            widgetList.push(widget.type);
                            edmMap[widget.type] = edm;
                        }
                    });

                    var caches = [{
                            widget: $AW(dataModel.get('uuid')),
                            data: insList
                        }],
                        $children, children,
                        temp, name, id,
                        i = 0, j;

                    while (item = caches[i]) {
                        temp = {
                            id: item.widget.id(),
                            text: item.widget.name()
                        };

                        if (items = edmMap[item.widget.type()]) {
                            children = [];
                            id = temp.id;
                            name = temp.text;

                            for (len = items.length; j = items[--len];) {
                                children.push({
                                    id: AUI.transformForeignKey(j.value.replace(NAME_REGEX, name), id),
                                    text: widgetDirectionText + j.desp.replace(NAME_REGEX, name),
                                    type: j.dataType
                                });
                            }

                            temp.children = children;
                        }

                        if (len = ($children = item.widget.children(':active')).length) {
                            temp.children = temp.children || [];
                            for (j = -1; ++j < len;) {
                                caches.push({
                                    widget: $AW($children[j]),
                                    data: temp.children
                                });
                            }
                        }

                        item.data.push(temp);

                        ++i;
                    }


                    insList = insList[0].children || [];

                    insList.unshift({
                        id: '',
                        text: '无'
                    });

                    if (varList) {
                        insList.push({
                            id: 'variables',
                            text: '变量',
                            children: varList
                        });
                    }

                    edmTreeInList = AUI.traverseTree(insList);

                    dataModel.set('edmTreeInList',edmTreeInList);
                    updFrameID.refresh('edmTreeInList');

                    //refresh data behavior code
                    html = ['<option value="">无</option>'];
                    dataModel.get('eventHandlerList').map(function (elem) {
                        if (elem.type === CODE_TYPE_BEHAVIOR) {
                            html.push('<option value="' + elem.code + '">' + elem.desp + '</option>');
                        }
                    });
                    $('#' + editParamKey.BEHAVIOR_CODE, $updFrame).empty().append(html.join(''));
                },
                resumeUpdateFrame = function (id) {
                    var props, index,
                        data,
                        isField,
                        getterOrSetter,
                        widgetID, oWidget,

                        //validateHandler
                        validateHandlerHTML = [], validateHandler, values, desps;

                    if (g_edm && id && (props = id.split('.')).length === 2) {
                        //get index
                        index = parseInt(props[1], 10);

                        if (data = g_edm[0].data.list({index: index}).first()) {
                            AUI.blur();

                            //log the index
                            AUI.currentEdmUpdatingIndex = index;

                            //update validate handler option
                            validateHandlerHTML = ['<option value="' + VALIDATE_HANDLER_PROP.valueArray[0] + '" >' + VALIDATE_HANDLER_PROP.despArray[0] + '</option>'];

                            if (getterOrSetter = (data[editParamKey.ID] || editParamValue[editParamKey.ID] || '')) {
                                if ((widgetID = getterOrSetter.match(CONST.REGEX.FOREIGN_WIDGET.FOREIGN_WIDGET_SPILT_PASTE)) && (widgetID = widgetID[1])) {
                                    oWidget = $AW(widgetID);


                                    if ((validateHandler = oWidget[0].widget.edm)
                                        && (validateHandler = validateHandler.validate)
                                        && (validateHandler = validateHandler.validateHandler)) {

                                        if (values = validateHandler.valueArray) {
                                            desps = validateHandler.despArray;
                                            values.map(function (elem, index) {
                                                validateHandlerHTML.push('<option value="' + elem + '" >' + desps[index] + '</option>');
                                            });
                                        }
                                    }

                                    $('#' + VALIDATE_HANDLER_PROP.name, $fieldBindAndRegex)
                                        .empty()
                                        .append(validateHandlerHTML.join(''));

	                                data=resumeValidateCallbackOptionAndSelect(oWidget,$fieldBindAndRegex,data);
                                } else {
                                    $('#' + VALIDATE_HANDLER_PROP.name, $fieldBindAndRegex)
                                        .empty()
                                        .append(validateHandlerHTML.join(''))
                                        .val(VALIDATE_HANDLER_PROP.valueArray[0]);

	                                data=clearValidateCallbackOption($fieldBindAndRegex,data);
                                }
                            }

                            updFrameID.setSelectValue([getterOrSetter]);


                            //resume data
                            $updFrame.find(':input').each(function () {
                                var id = this.id;
                                if (id) {
                                    if (data[id] !== undefined) {
                                        this.value = data[id];
                                    } else {
                                        this.value = editParamValue[id] || '';
                                    }
                                }
                            });

                            if (g_edm.direction() === EDM.DIRECTION.request && data[VALIDATE_HANDLER_PROP.name] !== undefined) {
                                $fieldBindAndRegex.find(VALIDATE_HANDLER_CASCADE_ELEMENT)[
                                    data[VALIDATE_HANDLER_PROP.name] ? 'addClass' : 'removeClass']('hide');
                            }

                            //alias cannot be edited on field in emd;
                            isField = !data.uid;
                            //$updFrame.find('#alias')[isField ? 'attr' : 'removeAttr']('readonly', 'readonly');

                            $updFrame.find('#collapse_' + editParamKey.CTN).parent()[isField ? 'removeClass' : 'addClass']('hide');


                            //show view
                            $updFrameLi.children('a').trigger('click');//不能加命名空间；
                        }
                    }
                },
                //show
                show = function () {
                    app.shelter.upperZIndex(null, null, false);
                    //show
                    //$mask.removeClass('hide');
                    AUI.zoomIn($ctn);
                },
                close = function () {
                    app.shelter.lowerZIndex();

                    //$mask.addClass('hide');
                    AUI.zoomOut($ctn);

                    AUI.edmLock = false;
                    AUI.currentEdmID = null;

                    //refresh the data model list in basic configuration or event configuration
                    edmUpdateDataModelList(g_edm);

                    g_edm = null;
                    $AW.trigger($AW.STATUS.WIDGET_UPDATE);
                },

                //control
                dealData = function (data) {
                    var i, item, items = editParams[1].list;

                    for (i = items.length; item = items[--i];) {
                        if (!data[item.domSelector]) {//防止覆盖默认值
                            data[item.domSelector] = item.value || '';
                        }
                    }

                    for (i in VALIDATE_TRANSFORM) {
                        data[VALIDATE_TRANSFORM[i]] = data[i];
                        delete data[i];
                    }


                    data.comment = data.comment && data.comment !== 'null' ? data.comment : data.name;
                    data.code && (delete data.code);
                    data.cnName && (delete data.cnName);
                    data.enName && (delete data.enName);

                    data.___id && (delete data.___id);
                    data.___s && (delete data.___s);

                    return data;
                },
                _add = function (oEdm, edmData, fields, isAgreeBusEdm) {
                    var elem = oEdm[0],
                        list = elem.data.list,
                        oldDataSource = {
                            referenceID: elem.data.referenceID + '',
                            list: JSON.stringify(list.TAFFY ? list().get() : list)
                        },
                        newDataSource = {
                            referenceID: elem.data.edmID + ''
                        },
                        comment,
                        isEdm, typeName, pID, pEdmName, cur_uid, cur_alias,
                        cacheID,
                        i, item, index, len, uid, j, subItem,
                        data, oEdmCollection,
                        loopTreeData = function (data) {

                            var seek = [],
                                i, item,
                                cacheID,
                                cursor, map = {},
                                edmDirection = g_edm.direction();

                            for (i = -1; item = data[++i];) {
                                seek.push(item);
                            }

                            i = -1;

                            while (item = seek[++i]) {
                                cursor = i;

                                if ((edmDirection === EDM.DIRECTION.request && item.type === '0') || (edmDirection === EDM.DIRECTION.response && item.type === '1') || (!isAgreeBusEdm)) {

                                    if (item.subField && item.subField.length) {
                                        typeName = EDM.TYPE.EDM_TEXT;
                                        cur_uid = app.getUID();

                                        cacheID = item.id;
                                        item.id && delete item.id;
                                        // item.pID && delete item.pID;


                                        item = $.extend(true, {
                                            source: EDM.TYPE.EDM_TEXT,
                                            edmName: pEdmName ? (pEdmName + '.' + item.enName) : item.enName,
                                            alias: item.enName,
                                            comment: item.cnName || '',
                                            active: true,
                                            // pID: item.firstChild ? '' : pID,
                                            id: '',
                                            ref: cacheID,
                                            name: item.enName,
                                            index: ++len,
                                            uid: cur_uid
                                        }, item);

                                        item.firstChild && delete item.firstChild;

                                        cur_alias = item.edmName;

                                        $.each(item.subField, function (index, item) {
                                            item.pID = cur_uid;
                                            item.edmName = cur_alias;
                                            // item.prefix = cur_alias;
                                        });

                                        seek.splice.apply(seek, [cursor + 1, 0].concat(item.subField));

                                        item.subField && delete item.subField;
                                        list.insert(dealData(item));

                                    } else {

                                        cacheID = item.id;
                                        item.id && delete item.id;

                                        data = $.extend(true, {
                                            source: isAgreeBusEdm ? EDM.TYPE.FIELD_TEXT : EDM.TYPE.DICT_TEXT,
                                            edmName: pEdmName,
                                            alias: isAgreeBusEdm ? item.enName : item.name,
                                            comment: item.cnName || '',
                                            active: true,
                                            pID: item.firstChild ? '' : uid,
                                            id: '',
                                            ref: cacheID,
                                            name: item.enName,
                                            index: ++len
                                        }, item);

                                        data.firstChild && delete data.firstChild;

                                        list.insert(dealData(data));
                                    }
                                }


                            }
                        },
                        checkScenarios = function (collection) {

                            var selectedId,
                                scenarioCollection = dataModel.get('agreeBusEdmModel')([{fields: {isArray: true}}]);

                            scenarioCollection.each(function (item) {
                                var scenarioId = item.id;

                                item.fields.length && $.each(item.fields, function (index, item) {

                                    var fieldId = item.id;

                                    collection.each(function (item) {

                                        if (item.pID) {
                                            return false;
                                        }

                                        if (item.ref === fieldId && selectedId === undefined) {
                                            selectedId = scenarioId;
                                        }

                                    });

                                });

                            });

                            curScenarioId = selectedId;

                        },
                        updateEdmData = function (edmData, fields) {
                            if (isEdm = $.isArray(fields)) {
                                typeName = EDM.TYPE.EDM_TEXT;
                                //edm
                                if (isAgreeBusEdm) {
                                    index = len = list().count() - 1;
                                } else {
                                    index = len = list().count();
                                }

                                uid = app.getUID();
                                pID = uid;


                                comment = edmData.comment && edmData.comment !== 'null' ? edmData.comment : edmData.enName || edmData.alias;

                                cacheID = edmData.id;


                                edmData.id && delete edmData.id;
                                edmData.pID && delete edmData.pID;

                                edmData = $.extend(true, {
                                    source: EDM.TYPE.EDM_TEXT,
                                    edmName: isAgreeBusEdm ? (edmData.code || edmData.enName) : edmData.name,
                                    alias: edmData.code || edmData.enName,
                                    active: true,
                                    pID: '',
                                    id: '',
                                    ref: cacheID,
                                    index: index,
                                    uid: uid
                                }, edmData);

                                pEdmName = edmData.alias;

                                edmData.fields && delete edmData.fields;
                                edmData.subField && delete edmData.subField;

                                if (!isAgreeBusEdm) {
                                    list.insert(dealData(edmData));
                                } else {
                                    // len = -1;
                                    pEdmName = '';
                                }

                                if (isAgreeBusEdm) {
                                    $.each(fields, function (index, item) {
                                        item.firstChild = true;
                                    });
                                }

                                loopTreeData(fields);

                            } else {
                                //dict or pageEdm
                                data = fields;
                                switch (data.isCustom) {
                                    case EDM.TYPE.PAGE_EDM:
                                        typeName = EDM.TYPE.PAGE_EDM_TEXT;

                                        //page edm cannot repeat
                                        if ((item = list({ref: data.ref})) && item.count()) {
                                            index = item.first().index;
                                            item.update({active: true});
                                            app.alert('已添加该' + typeName, app.alert.WARNING);
                                        }

                                        break;

                                    case true:
                                        typeName = EDM.TYPE.CUSTOM_TEXT;
                                        break;
                                    default:
                                        isAgreeBusEdm ? typeName = EDM.TYPE.FIELD_TEXT : typeName = EDM.TYPE.DICT_TEXT;
                                }

                                comment = data.comment;

                                if (index === undefined) {
                                    index = list().count();


                                    data = $.extend(true, {
                                        source: typeName,
                                        alias: isAgreeBusEdm ? data.enName : data.name,
                                        comment: data.cnName || '',
                                        active: true,
                                        pID: '',
                                        index: index
                                    }, data);

                                    list.insert(dealData(data));
                                }
                            }

                            //execute step
                            newDataSource.list = JSON.stringify(list().get());

                            //update data
                            oEdm.update({list: list});

                            //update view
                            updateSltTreeView(oEdm);

                            return index;
                        };


                    edmData = JSON.parse(JSON.stringify(edmData));
                    fields = JSON.parse(JSON.stringify(fields));

                    //在agreeBus服务下选择数据实体和字段
                    if (isAgreeBusEdm) {
                        //checkScenarios 校验所选 agreeBus实体或字段是否在同一场景下

                        oEdmCollection = list({active: true});

                        checkScenarios(oEdmCollection);

                        //为初始化时 agreeBus 作校验
                        if (curScenarioId) {

                            if (curScenarioId === edmData.id) {//点选相同场景

                                app.modal({
                                    title: "agreeBus 校验约束",
                                    content: "已添加该场景的数据实体或字段，是否覆盖？",
                                    btnConfirm: "是",
                                    btnCancel: "否",
                                    confirmHandler: function () {
                                        curScenarioId = edmData.id;
                                        //删除数据实体和字段
                                        oEdmCollection.each(function (item) {
                                            item.active = false;
                                        });

                                        index = updateEdmData(edmData, fields);
                                    },
                                    cancelHandler: function () {
                                    },
                                    isDialog: true,
                                    isLargeModal: false
                                });
                            } else {// 点选不同场景

                                app.modal({
                                    title: "agreeBus 校验约束",
                                    content: "是否覆盖其他场景下的数据实体或字段？",
                                    btnConfirm: "是",
                                    btnCancel: "否",
                                    confirmHandler: function () {
                                        curScenarioId = edmData.id;
                                        //删除数据实体和字段
                                        oEdmCollection.each(function (item) {
                                            item.active = false;
                                        });

                                        index = updateEdmData(edmData, fields);
                                    },
                                    cancelHandler: function () {
                                    },
                                    isDialog: true,
                                    isLargeModal: false
                                });
                            }

                        } else {
                            curScenarioId = edmData.id;
                            index = updateEdmData(edmData, fields);
                        }

                    } else {
                        index = updateEdmData(edmData, fields);
                    }

                    //agreeBus校验约束下，更新数据事件是异步，index 无法正常返回
                    return index;
                },
                add = function (oEdm, edm, field, formPageEdm, isAgreeBusEdm) {
                    var edmInstance, index;

                    if (oEdm.length) {
                        if (formPageEdm) {//page edm
                            edmInstance = dataModel.get('pageEdm')({ref: field}).first();

                            if (edmInstance) {
                                index = _add(oEdm, field, edmInstance, isAgreeBusEdm);
                            }
                        } else if (edm === field) {//dict or edm
                            if (isAgreeBusEdm) {
                                edmInstance = dataModel.get('agreeBusEdmModel')({id: edm}).first();
                            } else {
                                edmInstance =dataModel.get('edmModel')({ref: edm}).first();
                            }

                            if (edmInstance) {
                                if (edmInstance.fields) {
                                    //edm
                                    index = _add(oEdm, edmInstance, edmInstance.fields, isAgreeBusEdm);
                                } else {
                                    //dict
                                    index = _add(oEdm, field, edmInstance, isAgreeBusEdm);
                                }
                            }
                        } else {
                            //field in edm
                            //regard as field in dict
                            if (isAgreeBusEdm) {
                                edmInstance = dataModel.get('agreeBusEdmModel')({id: field}).first();
                            } else {
                                edmInstance = dataModel.get('edmModel')({ref: field}).first();
                            }

                            if (edmInstance) {
                                if (edmInstance.subField && edmInstance.subField.length) {
                                    //edm
                                    index = _add(oEdm, edmInstance, edmInstance.subField, isAgreeBusEdm);
                                } else {
                                    //dict
                                    index = _add(oEdm, field, edmInstance, isAgreeBusEdm);
                                }
                            }
                        }
                    }

                    return index;
                },
                del = function (oEdm, idList) {
                    var elem, list,
                        execute,
                        newDataSource, oldDataSource,
                        i, item, indexList = [];

                    if (oEdm.length) {
                        elem = oEdm[0];
                        list = elem.data.list;
                        list = JSON.stringify(list.TAFFY ? list().get() : list);

                        oldDataSource = {
                            referenceID: elem.data.referenceID + '',
                            list: list
                        };

                        newDataSource = {
                            referenceID: elem.data.edmID + '',
                            list: list
                        };

                        if ($.isArray(idList)) {
                            for (i = -1; (item = idList[++i]);) {
                                if (item && ((item = item.split('.')).length === 2)) {
                                    indexList.push(parseInt(item[1], 10));
                                }
                            }
                            //update view and data model
                            execute = {
                                edmID: elem.edmID,
                                index: indexList,
                                callback: addExecute(false, newDataSource)
                            };

                            execute.callback.call(execute);
                        }
                    }
                },
                changeDataSource = function (dataSource) {
                    var edm,
                        referenceID,
                        referenceEdm,
                        elem,
                        list,
                        oldDataSource, newDataSource,
                        desp;

                    if (this.edmID) {//execute
                        edm = Edm(this.edmID);
                        referenceEdm = Edm(dataSource.referenceID);

                        elem = edm[0].data;

                        if (this.edmID !== dataSource.referenceID) {
                            list = referenceEdm.list(true);
                        } else {
                            list = JSON.parse(dataSource.list);
                        }
                        list = app.taffy(list);

                        //update data
                        edm.update({
                            referenceID: dataSource.referenceID,
                            list: list
                        });

                        //update view
                        updateSltTreeView(edm);
                    } else {//change event
                        referenceID = this.value;
                        elem = g_edm[0].data;
                        list = elem.list;
                        oldDataSource = {
                            referenceID: elem.referenceID,
                            list: JSON.stringify(list.TAFFY ? list().get() : list)
                        };
                        newDataSource = {
                            referenceID: referenceID
                        };

                        //update data
                        if (referenceID && referenceID !== elem.edmID && ((referenceEdm = Edm(referenceID)).length)) {
                            list = referenceEdm.list(true);

                            if (list.TAFFY) {
                                list = JSON.parse(JSON.stringify(list().get()));
                            } else {
                                list = list ? JSON.parse(JSON.stringify(list)) : [];
                            }

                            newDataSource.list = JSON.stringify(list);

                            g_edm.update({
                                referenceID: referenceID,
                                list: list
                            });

                            desp = $(this).children('[value="' + this.value + '"]').text();
                        } else {
                            newDataSource.list = oldDataSource.list + '';

                            g_edm.update({
                                referenceID: referenceID
                            });

                            desp = $(this).children(':eq(0)').text() + '断开引用数据源';
                        }

                        //update view
                        updateSltTreeView(g_edm);
                    }
                },

                //execute step
                addDataModelExecute = function (flag) {
                    return function () {
                        var edm = Edm(this.edmID);

                        if (edm.length) {
                            edm.update({active: flag});

                            edmUpdateDataModelList(edm);
                        }
                    }
                },
                /*
                 *   version 4.2
                 *   author lijiancheng@agree.com.cn
                 *   desp 添加dataSource属性
                 *   data：20170313
                 *   params
                 *       @boolean flag
                 *       @object dataSource={
                 *           referenceID:数据源引用ID
                 *           list：null 直接从数据源处复制
                 *       }
                 *
                 * */
                addExecute = function (flag, dataSource) {
                    return function () {
                        var edm = Edm(this.edmID),
                            referenceEdm,
                            list, items,
                            seek = [], i, item, cursor,
                            // 深层字段删去
                            deleteDeepField = function (data) {
                                for (i = -1; item = data[++i];) {
                                    seek.push(item);
                                }

                                i = -1;

                                while (item = seek[++i]) {
                                    cursor = i;
                                    if (item.uid) {
                                        list({pID: item.uid}).update({active: flag}).each(function (item) {
                                            seek.splice.apply(seek, [cursor + 1, 0].concat(item));
                                        });
                                    }

                                }
                            };

                        if (edm.length) {
                            if (!dataSource.referenceID || dataSource.referenceID === this.edmID || !(referenceEdm = Edm(dataSource.referenceID)).length) {
                                if (dataSource.list) {
                                    list = dataSource.list;

                                    if (typeof list === 'string') {
                                        list = JSON.parse(list);
                                    }

                                    list = app.taffy(list);

                                } else {
                                    list = edm[0].data.list;
                                }

                                //这样更新为了避免___id重复的情况
                                list({index: this.index}).update({active: flag});

                                items = list({index: this.index}).get();


                                deleteDeepField(items);


                            } else {
                                list = referenceEdm.list(true);
                                list = app.taffy(list);
                            }

                            edm.update({
                                list: list,
                                referenceID: dataSource.referenceID
                            });

                            if (AUI.edmLock && AUI.currentEdmID === this.edmID) {
                                updateSltTreeView(edm);
                            }

                            //update the config
                            edmUpdateDataModelList(edm);
                        }
                    }
                },
                updExecute = function (value, dataSource) {

                    return function () {
                        var edm = Edm(this.edmID),
                            referenceEdm,
                            widgetID, oWidget,
                            list, data = {}, pageEdmData,
                            $updateFrame,
                            i, item, prop, edmParams,
                            isEditing,

                            _updFrameID,

                            //validateHandler
                            validateHandlerHTML = [], validateHandler, values, desps;

                        if (edm.length) {
                            isEditing = (AUI.edmLock && AUI.currentEdmID === this.edmID && AUI.currentEdmUpdatingIndex === this.index);
                            data[this.key] = value;


                            //如果选择是组件ID，则检查该组件有没有配置EDM，如果有则将值付给EDM配置
                            if (this.key === editParamKey.ID) {
                                _updFrameID = this.updFrameID || updFrameID;

                                _updFrameID.setSelectValue([value]);

                                //update validate handler option
                                validateHandlerHTML = ['<option value="' + VALIDATE_HANDLER_PROP.valueArray[0] + '" >' + VALIDATE_HANDLER_PROP.despArray[0] + '</option>'];

                                if ((widgetID = value.match(CONST.REGEX.FOREIGN_WIDGET.FOREIGN_WIDGET_SPILT_PASTE)) && (widgetID = widgetID[1])) {
                                    oWidget = $AW(widgetID);

                                    if ((validateHandler = oWidget[0].widget.edm)
                                        && (validateHandler = validateHandler.validate)
                                        && (validateHandler = validateHandler.validateHandler)) {

                                        if (values = validateHandler.valueArray) {
                                            desps = validateHandler.despArray;
                                            values.map(function (elem, index) {
                                                validateHandlerHTML.push('<option value="' + elem + '" >' + desps[index] + '</option>');
                                            });
                                        }
                                    }

                                    $('#' + VALIDATE_HANDLER_PROP.name, $fieldBindAndRegex)
                                        .empty()
                                        .append(validateHandlerHTML.join(''));

                                    edmParams = oWidget.edm();
                                    for (i = VALIDATE_PARAMS.length; item = VALIDATE_PARAMS[--i];) {
                                        prop = item.domSelector || item.name;

                                        if (edmParams[prop] !== undefined) {
                                            data[prop] = edmParams[prop];

                                            isEditing && $('#' + prop, $fieldBindAndRegex).val(data[prop]);
                                        }
                                    }

	                                data=resetValidateCallbackOptionAndSelect(oWidget,$fieldBindAndRegex,data);
                                }
                                else {
                                    $('#' + VALIDATE_HANDLER_PROP.name, $fieldBindAndRegex)
                                        .empty()
                                        .append(validateHandlerHTML.join(''))
                                        .val(VALIDATE_HANDLER_PROP.valueArray[0]);
                                    data[VALIDATE_HANDLER_PROP.name] = VALIDATE_HANDLER_PROP.valueArray[0];

	                                data=clearValidateCallbackOption($fieldBindAndRegex,data);
                                }
                            }


                            if (edm.direction() === EDM.DIRECTION.request && data[VALIDATE_HANDLER_PROP.name] !== undefined) {
                                $fieldBindAndRegex.find(VALIDATE_HANDLER_CASCADE_ELEMENT)[
                                    data[VALIDATE_HANDLER_PROP.name] ? 'addClass' : 'removeClass']('hide');
                            }

                            //如果修改页面变量同步改变到页面变量中
                            if (data.isCustom === EDM.TYPE.PAGE_EDM && key in customPageEdmParamKey) {
                                pageEdmData = {};
                                pageEdmData[key] = data[key];
                                dataModel.get('pageEdm')({ref: data.ref}).update(pageEdmData);
                            }

                            //update data model
                            if (!dataSource.referenceID || dataSource.referenceID === this.edmID || !(referenceEdm = Edm(dataSource.referenceID)).length) {
                                if (dataSource.list) {
                                    list = dataSource.list;

                                    if (typeof list === 'string') {
                                        list = JSON.parse(list);
                                    }

                                    list = app.taffy(list);

                                } else {
                                    list = edm[0].data.list;
                                }

                                //这样更新为了避免___id重复的情况
                                list({index: this.index}).update(data);
                            } else {
                                list = referenceEdm.list(true);
                                list = app.taffy(list);
                            }

                            edm.update({
                                list: list,
                                referenceID: dataSource.referenceID
                            });

                            //update view
                            if (isEditing) {
                                $updateFrame = this.contextID ? $(this.contextID) : $(CONST.PAGE.EDM_MODAL.UPDATE_FRAME, CONST.PAGE.EDM_MODAL.CTN);
                                $('#' + this.key, $updateFrame).val(value);
                            }

                            //update the config
                            !this.contextID && updateSltTreeView(edm);
                            edmUpdateDataModelList(edm);
                        }
                    }
                },
                restoreIndexExecute = function (newList) {
                    return function () {
                        var edm = Edm(this.edmID),
                            list;

                        if (edm.length) {
                            list = edm[0].data.list;

                            list().each(function (item, i) {
                                item.index = newList[i];
                            });

                            edm.update({list: list});

                            edmUpdateDataModelList(edm);
                        }
                    }
                },
                //export api
                /*
                 * option={
                 *   widgetID,
                 *   foreignID,
                 *   edmID,
                 *   applyTo enum:CONST.STEP.APPLY_TO.WIDGET|EVENT|LIFECYCLE
                 *   $list
                 *   direction: enum:CONST.EDM.DIRECTION.request|response|field,
                 *   callback:function(keys,field,ids,edmID,foreignID){}
                 * }
                 *
                 * */
                // AUI.edmConfig =

                edmConfig = function (option) {
                    var edm;

                    if (option && (edm = Edm(option)).length) {
                        AUI.edmLock = true;
                        AUI.currentEdmID = edm[0].edmID;

                        g_edm = edm;

                        //reset search frame
                        app.reset($ctn);
                        $searchFrameLink.trigger('click');
                        $search.trigger('keyup.auiEdm');


                        //resume dataSource
                        updateDataSourceSlt(edm);


                        //resume selected list
                        updateSltTreeView(edm);

                        //resume databind list
                        updateUpdateFrameOptions(edm, updFrameID, $updFrame);


                        //show or hide regex and errorMsg

                        if (edm.direction() === EDM.DIRECTION.response) {

                            //	$fieldBindAndRegex.find(':input:not(#' + editParamKey.ID + ',#' + editParamKey.EXPRESSION + ')').parent(':not(.tree-select-ctn)').addClass('hide');
                            //$customFrame.find('[href=' + EDM_MODAL.CUSTOM_PAGE_EDM_CONTENT + ']').parent().removeClass('hide').next().click();
                            $fieldBehavior.removeClass('hide');
                        } else {
                            //	$fieldBindAndRegex.find(':input:not(#' + editParamKey.ID + ',#' + editParamKey.EXPRESSION + ')').parent().removeClass('hide');
                            //$customFrame.find('[href=' + EDM_MODAL.CUSTOM_PAGE_EDM_CONTENT + ']').parent().addClass('hide').next().click();
                            $fieldBehavior.addClass('hide');
                        }

                        show();

                    } else {
                        app.alert('EDMx001-找不到组件或事件实例！', app.alert.ERROR);
                    }
                },

                /*
                 * option={
                 *   widgetID,
                 *   foreignID,
                 *   edmID,
                 *   applyTo enum:CONST.STEP.APPLY_TO
                 *   $list
                 *   direction: enum:CONST.EDM.DIRECTION.request|response,
                 *   callback:function(keys,field,ids,edmID,foreignID){}
                 * }
                 * */
                // AUI.edmUpdateDataModelList =
                edmUpdateDataModelList = function (option) {
                    var edm, elem,
                        dataModel,
                        list,
                        $edmList, edmCollection,
                        prefix,
                        items = [], fields = [], ids = [], keys = [],
                        loopEdmItem = function (data) {
                            var seek = [],
                                i, item,
                                cursor, map = {};

                            for (i = -1; item = data[++i];) {
                                if (!item.pID) {
                                    seek.push(item);
                                }
                            }

                            i = -1;

                            while (item = seek[++i]) {
                                cursor = i;

                                if (item.uid) {

                                    prefix = item.alias;

                                    list({pID: item.uid, active: true}).order('index').each(function (item) {

                                        if (item.uid) {
                                            seek.splice.apply(seek, [cursor + 1, 0].concat(item));
                                        } else {
                                            items.push(item);
                                        }

                                    });


                                } else {
                                    items.push(item);
                                }


                            }
                        };

                    if (option ) {
                        edm = Edm(option);


                        if (edm.length) {
                            elem = edm[0];

                            dataModel = elem.data;
                            list = dataModel.list;
                            $edmList = elem.$list;

                            edmCollection = list({active: true}).order('index').get();
                            loopEdmItem(edmCollection);


                            items = app.taffy(items)().order('index').each(function (item) {
                                fields.push(item.comment || item.name || item.alias);
                                ids.push([item.ref, item.index].join('.'));
                                keys.push(item.prefix ? (item.prefix + "." + item.name) : (item.alias || item.name));
                            }).get();

                            if (elem.widgetID === AUI.currentWidgetID || AUI.overviewLock) {
                                //sortable
                                if ($edmList && $edmList.length && elem.direction === CONST.EDM.DIRECTION.response) {
                                    $edmList.attr('data-edm-id', elem.edmID);

                                    $edmList.sortable({
                                        items: '.aui-row',
                                        containment: $edmList,
                                        cursor: "move",
                                        update: function (_, ui) {
                                            var $field = $(ui.item);

                                            $field.attr('style', '');

                                            AUI.edmUpdateOrder(
                                                $(this).attr('data-edm-id'),
                                                'test.' + $field.attr('data-field-index'),
                                                'test.' + $field[$field.prev().length ? 'prev' : 'next']().attr('data-field-index'),
                                                $field.index(),
                                                $field.index() ? 'test.' + $field.next().attr('data-field-index') : ''
                                            );
                                        }
                                    });
                                }

                                $edmList && $edmList.length && $edmList.empty().append(artTemplate('edmItem', {list: items}));
                            }

                            elem.callback && elem.callback.call(elem, keys, fields, ids, elem.edmID, elem.foreignID, elem.widgetID);

                        }
                    }
                },

                // AUI.edmUpdateOrder =
                edmUpdateOrder = function (edmID, id, siblingIndex, selfIndexInDom, nextSiblingIndex) {
                    var innerEDM, elem,
                        dataModel, list,
                        oldOrderList = [], newOrderList = [],
                        fields = [], ids = [],
                        filter = {}, order, temp, lastTemp,
                        oldIndex;

                    if (id && (oldIndex = id.split('.')[1])) {
                        oldIndex = parseInt(oldIndex, 10);

                        innerEDM = Edm(edmID);
                        elem = innerEDM[0];

                        siblingIndex = parseInt(siblingIndex.split('.')[1], 10);


                        if (oldIndex !== siblingIndex) {
                            dataModel = elem.data;
                            list = dataModel.list;

                            list().each(function (item) {
                                oldOrderList.push(item.index);
                            });


                            //update data model
                            if (siblingIndex < oldIndex) {
                                if (selfIndexInDom) {
                                    siblingIndex = parseInt(nextSiblingIndex.split('.')[1], 10);
                                }

                                filter = {lt: oldIndex, gte: siblingIndex};
                                order = 'index desc';
                            } else {
                                filter = {lte: siblingIndex, gt: oldIndex};
                                order = 'index';
                            }

                            list({index: oldIndex}).update({index: -1});
                            temp = oldIndex;

                            list({index: filter}).order(order).each(function (item) {
                                lastTemp = item.index;
                                item.index = temp;
                                temp = lastTemp;
                            });

                            list({index: -1}).update({index: temp});

                            dataModel.list = list;

                            list().order('index').each(function (item) {
                                newOrderList.push(item.index);

                                fields.push(item.comment || item.name || item.alias);
                                ids.push([item.ref, item.index].join('.'));
                            });

                            innerEDM.update(dataModel);

                            edmUpdateDataModelList(elem.edmID);
                        }
                    }

                    return {
                        fields: fields,
                        ids: ids
                    };
                },

                // AUI.edmUpdateOrderNew =
                edmUpdateOrderNew = function (edmObj) {

                    var

                        params, i,

                        elements, element,

                        edm, dataModel, list,


                        lastIndexList = [], currentIndexList = [], newIndexMap = {},

                        fields = [], ids = [];


                    if (edmObj && edmObj.edmID && (elements = edmObj.elements) && elements.length) {

                        for (i = -1; element = elements[++i];) {
                            if (element.edmItemId) {
                                params = element.edmItemId.split('.');

                                lastIndexList[i] = parseInt(params[1], 10);
                            }
                        }

                        currentIndexList = ([].concat(lastIndexList)).sort(function (a, b) {
                            return a - b;
                        });


                        for (i = currentIndexList.length; i--;) {
                            newIndexMap[lastIndexList[i]] = currentIndexList[i];
                        }

                        edm = Edm(edmObj.edmID);
                        dataModel = edm.get(0).data;
                        list = dataModel.list;

                        list().each(function (item) {
                            if (newIndexMap[item.index]) {
                                item.index = newIndexMap[item.index];
                            }
                        });


                        list().order('index').each(function (item) {

                            if (!item.uid) {
                                fields.push(item.comment || item.name || item.alias);
                                ids.push([item.ref, item.index].join('.'));
                            }

                        });

                        edm.update(dataModel);

                        edmUpdateDataModelList(edmObj.edmID);
                    }


                    return {
                        fields: fields,
                        ids: ids
                    };
                },

                // AUI.edmDelete =

                edmDelete = function (edmID, id) {
                    var edm = Edm(edmID);

                    del(edm, [id]);

                    edmUpdateDataModelList(edm);
                },

                /*
                 *   log:新增EDM配置窗口
                 *   version v4.2
                 *   author:lijiancheng@agree.com.cn
                 *   date:20170310 2210
                 * */
                // AUI.edmRegexConfig =

                edmRegexConfig = function ($context, widgetObj, setTabVisible) {
                    var widgetID = widgetObj.id(),
                        widgetConfig = widgetObj[0].widget,
                        edmConfig = widgetConfig.edm,
                        getterConfig, validateConfig,
                        validateProps,

                        //jquery object
                        $body;

                    $g_context = $context;

                    if (edmConfig && (getterConfig = edmConfig.get) && getterConfig && getterConfig.length && (validateConfig = edmConfig.validate)) {
                        /*数据加载*/
                        validateProps = widgetObj.edm();

                        $context.empty().append(EDM_CONFIG.CONFIG_CTN.CONFIG_BTN_TEMP);

                        $body = $context.children(EDM_CONFIG.CONFIG_CTN.CTT_SELECTOR);
                        $body.append(getHTMLAndResumeEdmConfig(widgetObj, validateConfig, edmConfig.get, validateProps));


                        validateProps.validateHandler && $body.find(VALIDATE_HANDLER_CASCADE_ELEMENT).addClass('hide');

                        $context.off('.auiConfigure').on({
                            //点击配置按钮
                            'click.auiConfigure': function (e) {
                                var $target = $(e.target || event.srcElement);

                                switch ($target.attr('data-role')) {
                                    case 'config':

                                        // changeRegexInfo({
                                        //     widgetID: widgetID
                                        // });
                                        g_regexInfoOption = {
                                            widgetID: widgetID
                                        };
                                        app.popover({
                                            $elem: $target,
                                            title: '数据字典与数据实体',
                                            content: '',
                                            width: '60%',
                                            height: '80%',
                                            init: function (popInstance) {

                                                var $popoverBody = $(this).find('.aweb-popover-body');

                                                regexPopInstance = popInstance;

                                                $popoverBody.append($regexInfoCtn.removeClass('hide').detach());
                                            },
                                            confirmHandler: function (popInstance) {

                                            }
                                        });
                                        $regexInfoSearch.val('').trigger('keyup');
                                        break;
                                }
                            },
                            'change.auiConfigure': function (e) {
                                var $target = $(e.target || event.srcElement),
                                    obj = {};

                                obj[$target.attr('id')] = $target.val();

                                changeRegexConfigHandler.call({
                                    widgetID: widgetID
                                }, obj, $target.attr('data-desp'));

                                $AW.trigger($AW.STATUS.WIDGET_UPDATE, $AW(widgetID))
                            }
                        });

                        setTabVisible(true);
                    } else {
                        setTabVisible(false);
                    }
                },

                // AUI.Edm = Edm;


                /*overview*/
                // AUI.edmSingleConfig =
                edmSingleConfig = function (option) {
                    var widgetID,
                        edmID = option.edmID,
                        index = option.index,

                        $context = option.$context,
                        $fieldBindAndRegex,

                        varList = option.varList,

                        widgetIns,
                        edmIns = Edm(edmID),
                        fieldIns,

                        getterOrSetter,
                        validateHandlerHTML = [], validateHandler, values, desps,

                        updFrameIDIns,

                        contextID = $context.attr('id'),

                        value;


                    $context
                        .off()
                        .empty()
                        .append(edmSingleHTMLTemp)
                        .on({
                            'change.auiSingleEdm': function (e) {
                                var $input = $(e.target || event.srcElement),
                                    elem = edmIns[0],
                                    list = elem.data.list;

                                if ($.isFunction(list)) {
                                    var
                                        listCollection = list({index: AUI.currentEdmUpdatingIndex}),
                                        data = listCollection.first(),

                                        oldDataSource = {
                                            referenceID: elem.data.referenceID + '',
                                            list: JSON.stringify(list.TAFFY ? list().get() : list)
                                        }, newDataSource = {
                                            referenceID: elem.data.edmID + ''
                                        },

                                        key = $input.attr('id'),
                                        oldValue = data[key] + '',
                                        newValue =key===editParamKey.EXPRESSION?$input.attr('data-value'):$input.val(),
                                        widgetID, oWidget, obj,
                                        validateResult = true,
                                        i, item, prop, edmParams,

                                        //validateHandler
                                        validateHandlerHTML = [], validateHandler, values, desps;

                                    if (oldValue !== newValue) {

                                        //校验
                                        if (editParamKeyValidate[key]) {
                                            validateResult = AUI.validateInput(newValue, editParamKeyValidate[key], null);
                                        }

                                        if (validateResult) {
                                            data[key] = newValue;

                                            //如果选择是组件ID，则检查该组件有没有配置EDM，如果有则将值付给EDM配置
                                            if (key === editParamKey.ID) {

                                                //update validate handler option
                                                validateHandlerHTML = ['<option value="' + VALIDATE_HANDLER_PROP.valueArray[0] + '" >' + VALIDATE_HANDLER_PROP.despArray[0] + '</option>'];


                                                if ((widgetID = newValue.match(CONST.REGEX.FOREIGN_WIDGET.FOREIGN_WIDGET_SPILT_PASTE)) && (widgetID = widgetID[1])) {
                                                    oWidget = $AW(widgetID);

                                                    if ((validateHandler = oWidget[0].widget.edm)
                                                        && (validateHandler = validateHandler.validate)
                                                        && (validateHandler = validateHandler.validateHandler)) {

                                                        if (values = validateHandler.valueArray) {
                                                            desps = validateHandler.despArray;
                                                            values.map(function (elem, index) {
                                                                validateHandlerHTML.push('<option value="' + elem + '" >' + desps[index] + '</option>');
                                                            });
                                                        }
                                                    }

                                                    $('#' + VALIDATE_HANDLER_PROP.name, $context)
                                                        .empty()
                                                        .append(validateHandlerHTML.join(''));

                                                    edmParams = oWidget.edm();

                                                    for (i = VALIDATE_PARAMS.length; item = VALIDATE_PARAMS[--i];) {
                                                        prop = item.domSelector || item.name;

                                                        if (edmParams[prop] !== undefined) {
                                                            data[prop] = edmParams[prop];
                                                            $('#' + prop, $fieldBindAndRegex).val(data[prop]);
                                                        }
                                                    }

	                                                data=resetValidateCallbackOptionAndSelect(oWidget,$fieldBindAndRegex,data);
                                                }
                                                else {
                                                    $('#' + VALIDATE_HANDLER_PROP.name, $context)
                                                        .empty()
                                                        .append(validateHandlerHTML.join(''))
                                                        .val(VALIDATE_HANDLER_PROP.valueArray[0]);

                                                    data[VALIDATE_HANDLER_PROP.name] = VALIDATE_HANDLER_PROP.valueArray[0];

	                                                data=clearValidateCallbackOption($context,data);
                                                }
                                            }


                                            if (edmIns.direction() === EDM.DIRECTION.request && fieldIns[VALIDATE_HANDLER_PROP.name] !== undefined) {
                                                $context.find(VALIDATE_HANDLER_CASCADE_ELEMENT)[
                                                    data[VALIDATE_HANDLER_PROP.name] ? 'addClass' : 'removeClass']('hide');
                                            }


                                            //如果修改页面变量同步改变到页面变量中
                                            if (data.isCustom === EDM.TYPE.PAGE_EDM && key in customPageEdmParamKey) {
                                                obj = {};
                                                obj[key] = data[key];
                                                dataModel.get("pageEdm")({ref: data.ref}).update(obj);
                                            }

                                            //update data model
                                            listCollection.update(data);
                                            edmIns.update({
                                                list: list,
                                                referenceID: newDataSource.referenceID
                                            });
                                            newDataSource.list = JSON.stringify(list().get());

                                            edmIns[0].callback = null;
                                            edmUpdateDataModelList(edmIns);

                                        } else {
                                            $input.val(oldValue);
                                        }
                                    }

                                    $AW.trigger($AW.STATUS.PREVIEW_FRESH);
                                }
                            },
                            'click.auiSingleEdm': updateCode
                        });

                    $fieldBindAndRegex = $('#ctn_' + editParams[1].domSelector, $context);
                    $fieldBehavior = $('#ctn_' + editParams[2].domSelector, $context);

                    if (edmIns.direction() === EDM.DIRECTION.response) {
                        ///$fieldBindAndRegex.find(':input:not(#' + editParamKey.ID + ',#' + editParamKey.EXPRESSION + ')').parent(':not(.tree-select-ctn)').addClass('hide');
                        $fieldBehavior.removeClass('hide');
                    } else {
                        //$fieldBindAndRegex.find(':input:not(#' + editParamKey.ID + ',#' + editParamKey.EXPRESSION + ')').parent().removeClass('hide');
                        $fieldBehavior.addClass('hide');
                    }

                    updFrameIDIns = AUI.treeSelectV2($('#' + editParamKey.ID, $context), {
                        onlyTreeNode: true
                    });

                    updateUpdateFrameOptions(edmIns, updFrameIDIns, $context, varList);

                    if (edmIns.length) {
                        if (fieldIns = edmIns[0].data.list({index: index}).first()) {
                            AUI.currentEdmUpdatingIndex = fieldIns.index;


                            //update validate handler option
                            validateHandlerHTML = ['<option value="' + VALIDATE_HANDLER_PROP.valueArray[0] + '" >' + VALIDATE_HANDLER_PROP.despArray[0] + '</option>'];

                            if (getterOrSetter = (fieldIns[editParamKey.ID] || editParamValue[editParamKey.ID] || '')) {
                                if ((widgetID = getterOrSetter.match(CONST.REGEX.FOREIGN_WIDGET.FOREIGN_WIDGET_SPILT_PASTE)) && (widgetID = widgetID[1])) {
                                    widgetIns = $AW(widgetID);
                                    if (getterOrSetter.indexOf('_parseFunction_') === -1) {
                                        getterOrSetter = '_parseFunction_##' + widgetID + "_WID_VAR##";
                                    }
                                    if (!getterOrSetter.match(/\([^\(]*\)/i)) {
                                        getterOrSetter += '()';
                                    }
                                    if ((validateHandler = widgetIns[0].widget.edm)
                                        && (validateHandler = validateHandler.validate)
                                        && (validateHandler = validateHandler.validateHandler)) {

                                        if (values = validateHandler.valueArray) {
                                            desps = validateHandler.despArray;
                                            values.map(function (elem, index) {
                                                validateHandlerHTML.push('<option value="' + elem + '" >' + desps[index] + '</option>');
                                            });
                                        }
                                    }

                                    $('#' + VALIDATE_HANDLER_PROP.name, $context)
                                        .empty()
                                        .append(validateHandlerHTML.join(''));

	                                fieldIns=resumeValidateCallbackOptionAndSelect(widgetIns,$context,fieldIns);
                                } else {
                                    $('#' + VALIDATE_HANDLER_PROP.name, $context)
                                        .empty()
                                        .append(validateHandlerHTML.join(''))
                                        .val(VALIDATE_HANDLER_PROP.valueArray[0]);

	                                fieldIns=clearValidateCallbackOption($context,fieldIns);
                                }
                            }

                            updFrameIDIns.setSelectValue([getterOrSetter]);


                            //resume data
                            //resume data
                            $context.find(':input').each(function () {
                                var id = this.id;
                                if (id) {
                                    if (fieldIns[id] !== undefined) {
                                        this.value = fieldIns[id];
                                        $(this).attr("data-value",fieldIns[id]);
                                    } else {
                                        this.value = editParamValue[id] || '';
                                        $(this).attr("data-value",editParamValue[id] || '')
                                    }
                                }
                            });

                            if (edmIns.direction() === EDM.DIRECTION.request && fieldIns[VALIDATE_HANDLER_PROP.name] !== undefined) {
                                $fieldBindAndRegex.find(VALIDATE_HANDLER_CASCADE_ELEMENT)[
                                    fieldIns[VALIDATE_HANDLER_PROP.name] ? 'addClass' : 'removeClass']('hide');
                            }

                            $updFrame.find('#collapse_' + editParamKey.CTN).parent()[!fieldIns.uid ? 'removeClass' : 'addClass']('hide');
                        }
                    }
                },
                //global variables
                g_edm;


            //init
            initView();


            /*delegate events*/
            //close modal
            $(EDM_MODAL.CLOSE_BTN, $ctn).off('.auiEdm').on('click.auiEdm', close);

            //nav
            $(EDM_MODAL.NAV, $ctn).off('.auiEdm').on('click.auiEdm', function (e) {
                var $e = $(e.target || window.event.srcElement),
                    $link, link;

                $link = $e.is('a') ? $e : $e.find('a');

                if ($link.length) {
                    if (link = $link.attr('href')) {
                        if (!~link.indexOf(EDM_MODAL.UPDATE_FRAME)) {
                            $updFrameLi.addClass('hide');

                            if (!e.isTrigger) {
                                $searchFrameLink.trigger('click');
                            }

                        } else {
                            $updFrameLi.removeClass('hide');
                        }
                    }
                }

            });

            //search
            $search.on('keyup.auiEdm', function () {
                var key = $(this).val(),
                    edmHTML = [], dictHTML = [],
                    initials = '';

                //EDM
                dataModel.get('edmModel')([{name: {likenocase: key}}, {comment: {likenocase: key}}]).order('name').each(function (item) {
                    var str;

                    if (item.fields) {
                        str = ['<div class="block clearfix" data-ref="', item.ref, '"><p class="header" data-ref="', item.ref, '">', item.comment, '（', item.name, '）', '</p><div class="content edm-content">'];

                        for (var i = -1, field, fields = item.fields; field = fields[++i];) {
                            str.push('<div data-ref="', field.ref, '">', (field.comment || field.alias || field.name), '（', field.name, '）', '</div>');
                        }

                        str.push('</div></div>');

                        edmHTML.push(str.join(''));
                    } else {
                        if (item.name[0] && initials !== item.name[0].toUpperCase()) {
                            initials = item.name[0].toUpperCase();
                            dictHTML.push('</div></div>', '<div class="block clearfix"><p class="header"><span>', initials, '</span></p><div class="content">');
                        }

                        dictHTML.push('<div data-ref="', item.ref, '">', (item.comment || item.alias || item.name), '（', item.name, '）', '</div>');
                    }

                });

                $searchEdmCtt.empty().append(edmHTML.length ? edmHTML.join('') : NO_RECORD.EDM);


                if (dictHTML.length) {
                    dictHTML.push(dictHTML.shift());
                }
                $searchDictCtt.empty().append(dictHTML.length ? dictHTML.join('') : NO_RECORD.DICT);


                //Page EDM

                /*			dictHTML = [];

                 if (g_edm.direction() === EDM.DIRECTION.response) {

                 initials = '';

                 AUI.data.pageEdm([{alias: {likenocase: key}}, {comment: {likenocase: key}}]).order('name').each(function (item) {
                 if (item.alias[0] && initials !== item.alias[0].toUpperCase()) {
                 initials = item.alias[0].toUpperCase();
                 dictHTML.push('</div></div>', '<div class="block clearfix"><p class="header"><span>', initials, '</span></p><div class="content">');
                 }

                 dictHTML.push('<div data-ref="', item.ref, '" data-page-edm="true" >', (item.comment || item.alias), '（', item.alias, '）', '</div>');
                 });
                 if (dictHTML.length) {
                 dictHTML.push(dictHTML.shift());
                 }
                 }
                 $searchPageEdmCtt.empty().append(dictHTML.length ? dictHTML.join('') : NO_RECORD.PAGE_EDM);*/

            });

            // //add
            // $(EDM_MODAL.ADD_BTN, $customFrame).on('click.auiEdm', function (e) {
            // 	var data = {}, validateResult = true,
            // 		$form = $customFrame.find('.tab-pane.active'),
            // 		ref;
            //
            // 	$form.find(':input').each(function () {
            // 		if (validateResult) {
            //
            // 			var $this = $(this),
            // 				value = $.trim($this.val()),
            // 				validate = $this.attr('data-validate');
            //
            // 			if (validate) {
            // 				validate = JSON.parse(validate);
            //
            // 				validateResult = AUI.validateInput(value, validate, null);
            // 			}
            //
            // 			data[$this.attr('id')] = value;
            // 		}
            // 	});
            //
            // 	if (validateResult) {
            // 		if ('#' + $form.attr('id') === EDM_MODAL.CUSTOM_PAGE_EDM_CONTENT) {
            // 			data.isCustom = EDM.TYPE.PAGE_EDM;
            // 			data.active = true;
            // 			ref = data.ref = app.getUID();
            // 			AUI.data.pageEdm.insert(data);
            //
            // 			//添加到表格中
            // 			add(g_edm, ref, ref, true);
            //
            // 			//重置表单
            // 			app.reset($form);
            //
            // 		} else {
            // 			data.isCustom = true;
            //
            // 			external.createField(data, function (ref) {
            // 				if (ref) {
            // 					//加入数据模型中
            // 					data.ref = ref;
            // 					AUI.data.edmModel.insert(data);
            //
            // 					//添加到表格中
            // 					add(g_edm, ref, ref);
            //
            // 					//重置表单
            // 					app.reset($form);
            // 				} else {
            // 					app.alert('获取自定义字段ref错误！', app.alert.ERROR);
            // 				}
            // 			});
            // 		}
            // 	}
            // });

            $searchCtt.off('.auiEdm').on({
                'click.auiEdm': function (e) {
                    var $field = $(e.target || event.srcElement),
                        $edm,
                        field, edm;

                    if (field = $field.attr('data-ref')) {
                        $edm = $field.closest('.block');

                        $edm.length && (edm = $edm.attr('data-ref'));

                        edm = edm || field;

                        if (edm && field) {
                            add(g_edm, edm, field, $field.attr('data-page-edm'));
                        }
                    }
                }
            });

            /*
             *   desp:绑定数据源
             *   version:v4.2
             *   date:201703091048
             *   author:lijiancheng@agree.com.cn
             * */
            //dataSource change
            $dataSourceSlt.on('change.auiEdm', changeDataSource);


            /*
             *   regex config 校验配置
             *   lijiancheng@agree.com.cn
             *   2017-02-08 16:56:24
             *   AUI 4.0.1.1
             * */
            //const
            var EDM_CONFIG = {
                    CONFIG_CTN: {
                        CONFIG_BTN_TEMP: '<div class="aui-event-header"><button data-role="config" class="btn btn-block aui-add-event-btn aui-btn" type="button">配置</button></div><div class="aui-event-body"></div>',
                        CTT_SELECTOR: '.aui-event-body'
                    },

                    REGEX_INFO: {
                        CTN_SELECTOR: '#auiEdmRegexCtn',
                        SEARCH_SELECTOR: '#auiEdmRegexSearch',
                        SEARCH_FRAME_SELECTOR: '#auiEdmRegexSearchFrame',
                        SEARCH_FRAME_EDM_CTT_SELECTOR: '#auiEdmRegexSearchFrameEdmCtt',
                        SEARCH_FRAME_EDM_CTT_CLASS_SELECTOR: '.aui-edm-inner-content',
                        SEARCH_FRAME_DICT_CTT_SELECTOR: '#auiEdmRegexSearchFrameDictCtt',
                        SEARCH_FRAME_DICT_CTT_CLASS_SELECTOR: '.aui-edm-inner-content'

                    },
                    PROP_LIST: [{
                        name: 'validateSelector',
                        type: 'string_select',
                        valueArray: [''],
                        despArray: ['默认值'],
                        desp: '触发范围 *',
                        value: ''
                    }, {
                        name: 'validateType',
                        type: 'string_select',
                        valueArray: [''],
                        despArray: ['无'],
                        desp: '触发条件 *'
                    }, {
                        name: 'get',
                        type: 'string_select',
                        valueArray: [''],
                        despArray: ['无'],
                        desp: '取值方法 *'
                    }, {
                        name: 'successCallback',
                        type: 'string_select',
                        valueArray: [''],
                        despArray: ['无'],
                        desp: '校验成功事件'
                    }, {
                        name: 'errorCallback',
                        type: 'string_select',
                        valueArray: [''],
                        despArray: ['无'],
                        desp: '校验失败事件 *'
                    }, {
                        name: 'cleanCallback',
                        type: 'string_select',
                        valueArray: [''],
                        despArray: ['无'],
                        desp: '清除校验提示事件'
                    }].concat(VALIDATE_PARAMS)
                },

                //methods
                getHTMLAndResumeEdmConfig = function (widgetObj, option, getList, widgetConfig) {
                    var NAME_REGEX = CONST.REGEX.WIDGET.NAME,
                        name = widgetObj.name(),
                        widgetID = widgetObj.id(),
                        list = JSON.parse(JSON.stringify(EDM_CONFIG.PROP_LIST)),
                        html = [],
                        i, item, prop,
                        j, getItem,
                        values = widgetConfig || {},
                        value,
                        valueItem,
                        count = 0;

                    for (i = -1, item; item = list[++i];) {
                        prop = option[item.name] || {};

                        item.domSelector = item.name;
                        item.moreDesp = item.desp;
                        item.value = item.defaultValue = values[item.name] !== undefined ? values[item.name] : (prop.defaultValue || prop.value || item.defaultValue || item.value || '');

                        if (item.name === 'get') {//特殊处理getter
                            for (j = -1; getItem = getList[++j];) {
                                item.despArray.push(getItem.desp.replace(NAME_REGEX, name));
                                item.valueArray.push(AUI.transformForeignKey(getItem.value, widgetID).trim());
                            }
                        } else if (prop.despArray && prop.valueArray) {
                            item.despArray = item.despArray.concat(prop.despArray);
                            item.valueArray = item.valueArray.concat(prop.valueArray);
                        }


                        if (values[item.name] !== item.value) {
                            ++count;
                            values[item.name] = item.value;
                        }

                        item.valueArray && item.valueArray.length && (item.valueArray = item.valueArray.map(function (item, index) {
                            return item.trim();
                        }));
                        if (item.name === "validateType") {
                            item['group'] = [{
                                label: 'AWEB 推荐交互类型',
                                valueArray: EVENT_CONFIG.type
                            }];
                        }

                        html.push(artTemplate(item.type, item));

                    }

                    if (count) {
                        widgetObj.edm(values);
                    }

                    return [
                        '<div class="aui-event-block aui-tab-align">',
                        '<div class="aui-event-ctt"><ul>',
                        html.join(''),
                        '</ul></div>',
                        '</div>'
                    ].join('');
                },
                changeRegexConfigHandler = function (regexConfig, singleValueDesp, notInStep) {
                    var widgetID = this.widgetID,
                        widgetObj = $AW(widgetID),
                        edmConfig,
                        p,
                        newValues = {},
                        oldValues = {},
                        count = 0;

                    if (widgetObj.length) {
                        edmConfig = widgetObj.edm();

                        //compare
                        for (p in edmConfig) {
                            if (regexConfig[p] !== undefined && edmConfig[p] !== regexConfig[p]) {
                                newValues[p] = regexConfig[p];
                                oldValues[p] = edmConfig[p];
                                ++count;
                            }
                        }


                        if (count) {
                            //修改界面
                            if (AUI.currentWidgetID === widgetID || AUI.overviewLock) {
                                for (p in newValues) {
                                    $g_context.find('#' + p).val(newValues[p]);
                                }

                                $g_context.find(VALIDATE_HANDLER_CASCADE_ELEMENT)[
                                    ('validateHandler' in newValues ? newValues : edmConfig).validateHandler ? 'addClass' : 'removeClass']('hide');
                            }

                            //修改数据结构
                            widgetObj.edm(newValues);
                        }
                    }
                },
                /*
                 *   @params object={
                 *      widgetID:
                 *   }
                 *
                 *
                 * */
                changeRegexInfo = function (option) {
                    g_regexInfoOption = option;

                    /// $regexInfoCtn.removeClass('hide');
                    //
                    // $regexInfoCtn.modal({
                    //     isLargeModal: true,
                    //     height: '80%',
                    //     width: '80%',
                    //     backdrop: 'static',
                    //     keyboard: false,
                    //     show: true,
                    //     noFooter: false,
                    //     noHeader: false
                    // });

                    //$regexInfoCtn.modal('show');

                    // $regexInfoSearch.val('').trigger('keyup');
                },

                //variables
                $regexInfoCtn = $(EDM_CONFIG.REGEX_INFO.CTN_SELECTOR),
                $regexInfoSearch = $(EDM_CONFIG.REGEX_INFO.SEARCH_SELECTOR, $regexInfoCtn),
                $auiEdmRegexSearchFrame = $(EDM_CONFIG.REGEX_INFO.SEARCH_FRAME_SELECTOR, $regexInfoCtn),
                $searchRegexInfoEdmCtt = $(EDM_CONFIG.REGEX_INFO.SEARCH_FRAME_EDM_CTT_SELECTOR, $regexInfoCtn).children(EDM_CONFIG.REGEX_INFO.SEARCH_FRAME_EDM_CTT_CLASS_SELECTOR),
                $searchRegexInfoDictCtt = $(EDM_CONFIG.REGEX_INFO.SEARCH_FRAME_DICT_CTT_SELECTOR, $regexInfoCtn).children(EDM_CONFIG.REGEX_INFO.SEARCH_FRAME_DICT_CTT_CLASS_SELECTOR),

                $g_context,
                g_regexInfoOption;


            $regexInfoSearch.on('keyup.auiEdm', function () {
                var key = $(this).val(),
                    edmCollection = dataModel.get('edmModel')([{name: {likenocase: key}}, {comment: {likenocase: key}}]).order('name'),
                    edmHTML = [], dictHTML = [],
                    initials = '';

                edmCollection.each(function (item) {
                    var str;

                    if (item.fields) {
                        str = ['<div class="block clearfix" data-ref="', item.ref, '"><p class="header" data-ref="', item.ref, '">', item.comment, '（', item.name, '）', '</p><div class="content">'];

                        for (var i = -1, field, fields = item.fields; field = fields[++i];) {
                            str.push('<div data-ref="', field.ref, '">', (field.comment || field.alias || field.name), '（', field.name, '）', '</div>');
                        }

                        str.push('</div></div>');

                        edmHTML.push(str.join(''));
                    } else {
                        if (item.name[0] && initials !== item.name[0].toUpperCase()) {
                            initials = item.name[0].toUpperCase();
                            dictHTML.push('</div></div>', '<div class="block clearfix"><p class="header"><span>', initials, '</span></p><div class="content">');
                        }

                        dictHTML.push('<div data-ref="', item.ref, '">', (item.comment || item.alias || item.name), '（', item.name, '）', '</div>');
                    }

                });

                $searchRegexInfoEdmCtt.empty().append(edmHTML.length ? edmHTML.join('') : NO_RECORD.EDM);


                if (dictHTML.length) {
                    dictHTML.push(dictHTML.shift());
                }
                $searchRegexInfoDictCtt.empty().append(dictHTML.length ? dictHTML.join('') : NO_RECORD.DICT);
            });

            $auiEdmRegexSearchFrame.off('.auiEdm').on({
                'click.auiEdm': function (e) {
                    var $field = $(e.target || event.srcElement),
                        $edm,
                        field, edm,
                        edmInstance,
                        i, item, fields;

                    if (field = $field.attr('data-ref')) {
                        $edm = $field.closest('.block');

                        $edm.length && (edm = $edm.attr('data-ref'));

                        if (edm) {
                            edmInstance = dataModel.get('edmModel')({ref: edm}).first();

                            for (i = -1, fields = edmInstance.fields; item = fields[++i];) {
                                if (item.ref === field) {
                                    edmInstance = item;
                                    break;
                                }
                            }
                        } else {
                            edmInstance = dataModel.get('edmModel')({ref: field}).first();
                        }

                        changeRegexConfigHandler.call(g_regexInfoOption, edmInstance);
                        regexPopInstance.close();

                        // $regexInfoCtn.addClass('hide');

                    }
                }
            });


            return {
                Edm: Edm,
                edmRegexConfig: edmRegexConfig,
                edmSingleConfig: edmSingleConfig,
                edmDelete: edmDelete,
                edmUpdateOrderNew: edmUpdateOrderNew,
                edmUpdateOrder: edmUpdateOrder,
                edmConfig: edmConfig,
                edmUpdateDataModelList: edmUpdateDataModelList
            };
        }
    });
})();