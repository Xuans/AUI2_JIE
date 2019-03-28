/**
 * [页面逻辑概览]
 * update log 20161231
 *
 * @param {[undefined]} undefined [undefined]
 * @author lijiancheng@cfischina.com
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";
        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", 'index', 'const', 'go', 'config.widget', 'base', 'Model.Data', 'event', 'lifecycle', 'edm', 'uglifyjs'], factory);
        }
        // global
        else {
            factory();
        }

    })(function ($, AUI, CONST, go, widgetConfig, base, dataModel, eventUtil, lifecycleUtil, edmUtil) {
        "use strict";

        var ADVANCE = CONST.WIDGET.ADVANCE,
            openDespMap = {
                "打开新页面": true,
                "打开子页面": true,
                "打开新窗口": true,
                "打开气泡页面": true
            },

            CODE_LIST = [
                {
                    desp: '遍历（each）',
                    code: '$.each()',
                    option: [
                        {
                            name: 'array',
                            desp: '待遍历数组',
                            type: 'comboTree'
                        },
                        {
                            name: 'func',
                            type: 'string_simpleHtml',
                            language: 'javascript',
                            desp: '回调函数',
                            defaultValue: 'function(index,value){}'
                        }
                    ],
                    type: 'aweb'
                },
                {
                    desp: '原生代码（raw code）',
                    code: '',
                    option: [
                        {
                            name: 'codeValue',
                            type: 'string_simpleHtml',
                            language: 'javascript',
                            desp: '代码'
                        }
                    ],
                    type: 'rawCode'
                }
            ],
            RUN_BTN_SELECTOR = '[data-role=auiRunOverview]',

            gCurrentWidgetID,
            jsTypeCodeList = [
                {
                    desp: '字符串',
                    toAddOptionType: 'string_input'
                },
                {
                    desp: '布尔值',
                    toAddOptionType: 'boolean'
                },
                {
                    desp: '数字',
                    toAddOptionType: 'number'
                },
                {
                    desp: '字符串数组',
                    toAddOptionType: 'tags_input'
                },
                {
                    desp: '自定义代码',
                    toAddOptionType: 'jsEditor',


                }
            ],

            /*global variables*/
            myDiagram, myJsEditor,

            codeListDB = app.taffy([]),
            codeTreeDB = app.taffy([

                {
                    text: '无',
                    id: 'nothing'
                },
                {
                    text: 'Javascript类型',
                    children: []
                },
                {
                    text: 'aweb接口',
                    children: []
                },
                {
                    text: '组件接口',
                    children: []
                }, {
                    text: '变量',
                    children: []
                },
                {
                    text: '常量',
                    children: []
                }
            ]),

            OVERVIEW_CONST = {
                CODE: {
                    AWEB: {
                        /*	SEARCH_SELECTOR: '#auiOverviewAwebCodeSearch',*/
                        CTN_SELECTOR: '#auiOverviewAwebCodeMenu'
                    },
                    WIDGET: {
                        /*		SEARCH_SELECTOR: '#auiOverviewWidgetCodeSearch',*/
                        CTN_SELECTOR: '#auiOverviewWidgetCodeMenu'
                    },
                    VAR: {
                        SEARCH_SELECTOR: '#auiOverviewVarCodeSearch',
                        CTN_SELECTOR: '#auiOverviewVarCodeList'
                    },
                    STATEMENT: {
                        SEARCH_SELECTOR: '#auiOverviewStatementCodeSearch',
                        CTN_SELECTOR: '#auiOverviewStatementCodeList'
                    }
                }
            },

            $contextInspector,
            $body,

            $runBtn,
            $codeFrame,

            /*dom*/


            enableDrag = function () {
                $('[data-code-id]', $codeFrame).draggable({
                    stack: "#myDiagram",
                    revert: true,
                    revertDuration: 0,
                    cursor: 'move',
                    zIndex: 100000,
                    scroll: false,
                    helper: function (e) {
                        var $e = $(e.target).closest('[data-code-id]'),
                            nameStr = $e.children().first().text() || $e.text();

                        return $('<div><h5>' + nameStr + '</h5></div>').get(0);

                    },
                    opacity: 0.5,
                    appendTo: 'body'
                });
            },

            searchTabTree = AUI.tabTreeSearch;

        AUI.resizeOverview = function () {
            myDiagram && myDiagram.requestUpdate();
        };


        var searchTree = AUI.treeSearch,
            getCurrentDesp = function (autoAdd) {
                var type, entrance, urlValue, map = {}, result;
                if (entrance = AUI.currentOverviewEntrance) {
                    type = entrance.applyTo.toLowerCase();
                    map[type + "ID"] = entrance.foreignID;
                    urlValue = dataModel.get(type)(map).first().desp;
                    if (urlValue && autoAdd) {
                        urlValue = urlValue.replace(/([0-9])+$/, '') + dataModel.getEventAccumulator();
                    }
                }

                return urlValue;
            },
            interfaceParamsToOption = function (interfaceParams) {
                var i = -1, param, hasUrl = false;

                if (interfaceParams) {

                    for (; param = interfaceParams[++i];) { //forEach ==>for
                        if (!param.dataType) {//如果已经经过格式转化，则无需重复
                            param.dataType = param.type.toString();

                            if (param.keepType) {
                                switch (param.type) {
                                    case 'string':
                                        param.type = 'string_input';
                                        break;
                                }
                            } else {
                                switch (param.type) {
                                    case 'option':
                                        param.type = 'object';

                                    case 'object':
                                        if (param.children && $.isArray(param.children) && param.children.length > 0) {
                                            param.attr = interfaceParamsToOption(JSON.parse(JSON.stringify(param.children)));
                                        } else {
                                            param.type = 'comboTree';
                                        }
                                        break;

                                    case 'url':
                                        param.type = 'string_input';
                                        param.defaultValue = '##%%_INDEX%%-OVERVIEW_URL##';
                                        param.formatter = 'replace';
                                        hasUrl = true;
                                        break;

                                    default:
                                        param.type = 'comboTree';

                                        delete param.defaultValue;

                                        break;
                                }
                            }
                        }
                    }


                    if (hasUrl) {


                        interfaceParams = interfaceParams.concat([{
                            name: 'id',
                            type: 'string_input',
                            desp: 'ID',
                            keepType: true,
                            hidden: true,
                            defaultValue: '%%_INDEX%%',
                            formatter: 'replace',
                            noCompile: true
                        },
                            {
                                name: 'desp',
                                type: 'string_input',
                                desp: '描述',
                                keepType: true,
                                formatter: 'replace',
                                defaultValue: getCurrentDesp(),
                                noCompile: true
                            }]);
                    }

                    return interfaceParams;
                }
            },

            mergeOption = function (nodeData, codeItemOption) {
                var cache;
                if (Array.isArray(codeItemOption)) {
                    if (Array.isArray(nodeData.option)) {
                        codeItemOption.forEach(function (item, index) {
                            if (cache = nodeData.option[index]) {
                                if (nodeData.structure && nodeData.structure.option) {
                                    if (nodeData.structure.option[cache.name] !== undefined) {
                                        nodeData.structure.option[item.name] = nodeData.structure.option[cache.name];

                                        //恢复其他value
                                        nodeData.structure.option['arguments_' + item.name] = nodeData.structure.option['arguments_' + cache.name];
                                        nodeData.structure.option['jsValue_' + item.name] = nodeData.structure.option['jsValue_' + cache.name];
                                        nodeData.structure.option['expression_' + item.name] = nodeData.structure.option['expression_' + cache.name];
                                        nodeData.structure.option['dataType_' + item.name] = nodeData.structure.option['dataType_' + cache.name];
                                    }
                                }
                            }
                        })
                    }
                    nodeData.option = JSON.parse(JSON.stringify(codeItemOption));
                }
            },

            refreshWidgetCodeList = function (overviewID) {
                var
                    insList = [],
                    caches = [{
                        widget: $AW(dataModel.get('uuid')),
                        data: insList
                    }],
                    $children, children,
                    node, nodeName, nodeID, widgetConfig,
                    i, item, items, api, desp, code, value,
                    cache, len, treeInList,
                    cursor = 0;

                //清除codeListDB里面的widget类型节点
                codeListDB({type: 'widget'}).remove();

                while (cache = caches[cursor]) {

                    nodeID = cache.widget.id();
                    nodeName = cache.widget.name() + '（' + cache.widget[0].data.attr.id + '）';
                    children = [];

                    node = {
                        id: nodeID,
                        desp: nodeName,
                        text: nodeName,
                        children: children
                    };

                    if (cache.widget.length && (widgetConfig = cache.widget[0].widget)) {

                        if ((items = widgetConfig.api) && items.length) {
                            for (i = -1; item = items[++i];) {
                                if ((value = item.newValue || item.oldValue || item.value)) {

                                    if (item.name) {
                                        desp = item.desp + '（' + item.name + '）';


                                            value=value.replace(/_parseFunction_%%_WID_VAR%%/g,'##_var##');

                                        code = AUI.transformIntoForeignKey(AUI.transformForeignKey(value, nodeID, overviewID), nodeID);
                                        if ($.isPlainObject(item.params)) {

                                        }
                                        item.params = interfaceParamsToOption(item.params);


                                        api = {
                                            id: code,
                                            code: code,
                                            type: 'widget',
                                            oldValue: value,
                                            category: 'widget',
                                            desp: desp,
                                            text: desp,
                                            apiType: (item.hasReturn && item.returnValue)? item.returnValue.type: '',
                                            option: item.params
                                        };

                                        children.push(api);

                                        codeListDB.insert(api);
                                    }
                                }
                            }
                        }
                    }

                    if (len = ($children = cache.widget.children(':active')).length) {
                        for (item = -1; ++item < len;) {
                            caches.push({
                                widget: $AW($children[item]),
                                data: node.children
                            });
                        }
                    }

                    cache.data.push(node);

                    ++cursor;
                }
                insList = insList[0].children || [];

                insList.unshift({
                    id: '',
                    desp: ''
                });
                treeInList = AUI.traverseTree(insList);

                dataModel.set('treeInList', treeInList);

                // dataModel.set('', overviewCodeTree);

                searchTabTree($(OVERVIEW_CONST.CODE.WIDGET.CTN_SELECTOR), enableDrag)
                    .refresh('treeInList');


                insList.shift();
                codeTreeDB({text: '组件接口'}).update({children: insList});
            };


        AUI.overviewData = {};
        AUI.overviewData.codeTree = codeTreeDB;
        AUI.overviewData.codeList = codeListDB;

        AUI.getOverviewCodeTree=function () {
            var codeTreeArray = JSON.parse(JSON.stringify(AUI.overviewData.codeTree().get())),
                nothing = codeTreeArray[0],
                tempNode = {},
                overviewCodeTree;
            if (nothing.id === 'nothing' || nothing.id === '') {
                if (nothing.id === '') {
                    nothing.id = 'nothing';
                    nothing.desp = '无';
                }
                if (tempNode.children = []) {
                    tempNode.children.push(nothing);
                    tempNode.desp = '空白选项';
                }
            }
            codeTreeArray[0] = tempNode;
            overviewCodeTree = AUI.traverseTree(codeTreeArray);
            dataModel.set('overviewCodeTree', overviewCodeTree);
        };

        //load
        var Overview = {
            show: function (obj, $el) {
                $body = $('body');


                $runBtn = $(RUN_BTN_SELECTOR, $el);
                $codeFrame = $('#auiOverviewCodeFrame', $el);
                AUI.overviewLock = true;

                gCurrentWidgetID = obj.widgetID;

                $("#overviewTab").children(":first").children().trigger('click');
                diagram(obj, $el);

            },
            hide: function () {
                //模拟编译




                AUI.overviewLock = false;


                gCurrentWidgetID = null;
                myDiagram = null;
            }
        };

        var diagram = (function () {
            var $codeList, $overViewPanel, code, entrance, category, actionRole, entranceInstance, oEntrance,
                ajaxNode,
                entranceConfigSelector = '#entranceConfigCtn',
                $entranceConfigCtn,
                created = false,
                D = go.GraphObject.make, varDB;

            codeListDB({type: 'var'}).each(function (item) {
                item.category = 'var_' + item.namespace;
            });

            function refreshVarCodeList() {
                var varList, localVarChildren, cursor = -1, cache, caches;

                switch (category) {
                    case 'ajaxFirst':
                        localVarChildren = [
                            {
                                desp: '数据传输',
                                isAddButton: true,
                                namespace: 'local',
                                namespaceDesp: '局部变量',
                                inFunctionDesp: '数据传输',
                                inFunction: 'startData',
                                children: [{
                                    desp: 'data',
                                    fixVar: true
                                }]
                                    .concat(varDB({
                                        type: 'var',
                                        namespace: 'local',
                                        belongTo: entrance.foreignID,
                                        inFunction: 'startData'
                                    }).get())
                                /*.concat([{
                                 desp: '添加',
                                 isAddButton: true,
                                 namespace: 'local',
                                 namespaceDesp: '局部变量',
                                 inFunctionDesp: '数据传输',
                                 inFunction: 'startData'
                                 }])*/
                            },
                            {
                                desp: '数据回显',
                                isAddButton: true,
                                namespace: 'local',
                                namespaceDesp: '局部变量',
                                inFunctionDesp: '数据回显',
                                inFunction: 'startSuccess',
                                children: [{
                                    desp: 'response',
                                    fixVar: true
                                }]
                                    .concat(varDB({
                                        type: 'var',
                                        namespace: 'local',
                                        belongTo: entrance.foreignID,
                                        inFunction: 'startSuccess'
                                    }).get())
                                /*		.concat([{
                                 desp: '添加',
                                 isAddButton: true,
                                 namespace: 'local',
                                 namespaceDesp: '局部变量',
                                 inFunctionDesp: '数据回显',
                                 inFunction: 'startSuccess'
                                 }])*/
                            }
                        ];
                        break;

                    case 'apiFirst':
                        localVarChildren = [
                            {
                                desp: '数据传输',
                                isAddButton: true,
                                namespace: 'local',
                                namespaceDesp: '局部变量',
                                inFunctionDesp: '数据传输',
                                inFunction: 'startData',
                                children: [{
                                    desp: 'data',
                                    fixVar: true,
                                    // id:'',
                                    // namespace:'local'
                                }]
                                    .concat(varDB({
                                        type: 'var',
                                        namespace: 'local',
                                        belongTo: entrance.foreignID,
                                        inFunction: 'startData'
                                    }).get())
                                /*.concat([{
                                 desp: '添加',
                                 isAddButton: true,
                                 namespace: 'local',
                                 namespaceDesp: '局部变量',
                                 inFunctionDesp: '数据传输',
                                 inFunction: 'startData'
                                 }])*/
                            }
                        ];
                        break;

                    default:
                        localVarChildren = varDB({
                            type: 'var',
                            namespace: 'local',
                            belongTo: entrance.foreignID
                        }).get().filter(function (item) {
                            return !item.inFunction;
                        });

                        break;
                }

                varList = [{
                    id: '',
                    desp: ''
                },
                    {
                        desp: '全局变量（domain）',
                        isAddButton: true,
                        namespaceDesp: '全局变量',
                        namespace: 'domain',
                        children: varDB({type: 'var', namespace: 'domain'}).get()
                        /*.concat([{ desp: '添加', isAddButton: true, namespace: 'domain', namespaceDesp: '全局变量' }])*/
                    }, {
                        desp: '页面变量（page params）',
                        namespace: 'scope',
                        isAddButton: true,
                        namespaceDesp: '页面变量',
                        children: varDB({type: 'var', namespace: 'scope'}).get()
                        /*.concat([{ desp: '添加', isAddButton: true, namespace: 'scope', namespaceDesp: '页面变量' }])*/
                    }, {
                        desp: '局部变量（var）',
                        namespace: 'local',
                        children: localVarChildren,
                        isAddButton: (localVarChildren[0] && localVarChildren[0].children) ? false : true
                    }];

                searchTree($(OVERVIEW_CONST.CODE.VAR.SEARCH_SELECTOR, $overViewPanel), $(OVERVIEW_CONST.CODE.VAR.CTN_SELECTOR)).refresh(varList, 'varList');

                //refresh code tree
                // varList.shift();

                //删除所有添加按钮
                caches = [{
                    list: varList
                }];
                while (cache = caches[++cursor]) {
                    cache.list.map(function (item, index) {
                        item.text = item.text || item.desp;

                        if (item.fixVar) {
                            item.id = item.text;
                        }

                        if (item.children) {
                            caches.push({
                                list: item.children
                            });
                        } else if (item.isAddButton) {
                            cache.list.splice(index, 1);
                        }
                    });
                }

                codeTreeDB({text: '变量'}).update({children: varList});

                //绑定拖拽事件
                enableDrag();
            }

            function changeEdmVar(oldVal, newVal) {
                var i,
                    updateEdm = function (edmItem) {
                        if (edmItem.id === transVarID(oldVal)) {
                            edmItem.id = transVarID(newVal);
                        }
                    },
                    updateList = function (list) {
                        var i, edmItem;
                        if (list) {
                            if (list.TAFFY) {
                                list().each(updateEdm);
                            } else {
                                for (i = list.length; edmItem = list[--i];) {
                                    updateEdm(edmItem);
                                }
                            }
                        }
                    };

                dataModel.get('request')().each(function (item, index) {
                    updateList(item.list);
                });

                dataModel.get('response')().each(function (item, index) {
                    updateList(item.list);
                })
            }

            function toCodeString(codeValue) {
                switch (typeof codeValue) {
                    case 'string':
                        return codeValue;
                        break;

                    case 'undefined':
                        return '';
                        break;

                    default:
                        return JSON.stringify(codeValue);
                        break;
                }
            }

            function getVarList() {
                return codeListDB([{type: 'var', namespace: 'local', belongTo: entrance.foreignID}, {
                    type: 'var',
                    namespace: 'domain'
                }, {type: 'var', namespace: 'scope'}])
                    .get().map(function (item) {
                        return {
                            name: item.name,
                            namespace: item.namespace,
                            inFunction: item.inFunction || '',
                            value: JSON.parse(JSON.stringify(item.value || ''))
                        }
                    })
            }

            function upperCaseFirstLetter(str) {
                var arr = str.toLowerCase().split(''),
                    firstLetter = arr.shift();

                return firstLetter.toUpperCase() + arr.join('');
            }

            function transVarID(id) {
                return '##' + id + '_OVERVIEW_VAR##';
            }

            function getVarID(foreignID, namespace, name, inFunction) {
                var codeID;
                switch (namespace) {
                    case 'domain':
                        codeID = name + '_' + namespace;
                        break;
                    case 'scope':
                        codeID = dataModel.get('pageModule') + '_' + dataModel.get('pageName') + '_' + name + '_' + namespace;
                        break;
                    case 'local':
                        codeID = foreignID + '_' + name + '_' + namespace + '_' + inFunction;
                        break;
                }
                return codeID;
            }

            function transOptionInstance(option, instance) {
                var name, value, optionNameMap = {};

                option && option.map(function (item, index) {
                    if (item) {

                        name = item.name;
                        optionNameMap[name] = true;
                        value = instance && instance[name];

                        if (item.noCompile) {
                            delete instance[name];
                        } else {
                            switch (item.type) {
                                case 'string_simpleHtml':
                                    instance[name] = {
                                        name: item.name,
                                        type: 'code',
                                        value: value
                                    };
                                    break;

                                case 'comboTree':
                                    instance[name] = optionKeyToObj(instance, name);
                                    break;

                                case 'object':
                                    if (!value) {
                                        instance[name] = value = {};
                                    }
                                    instance[name] = {
                                        type: 'object',
                                        key: name,
                                        value: transOptionInstance(item.attr, value)
                                    };
                                    break;

                                case 'array':
                                    value = value && value.map(function (instanceItem, index) {
                                            transOptionInstance(item.attrInEachElement, instanceItem);
                                            return {
                                                type: 'object',
                                                key: name,
                                                value: instanceItem
                                            }
                                        });
                                    instance[name] = {
                                        type: 'array',
                                        value: value
                                    };
                                    break;

                                default:
                                    instance[name] = {
                                        name: item.name,
                                        type: 'code',
                                        value: JSON.stringify(value)
                                    };
                                    break;
                            }
                        }
                    }
                });

                instance && $.each(instance, function (key) {
                    if (!optionNameMap[key]) {
                        delete instance[key];
                    }
                });

                return instance;
            }

            function optionToParams(option, instance) {
                var params = [];

                transOptionInstance(option, instance);

                params = option && option.map(function (item, index) {
                        return instance[item.name];
                    });

                return params;
            }

            function optionKeyToObj(optionInstance, optionKey) {
                var codeID = optionInstance[optionKey],
                    codeData,
                    result = {};

                if (codeID && codeID.toLowerCase && (codeData = (codeListDB({id: codeID}).first() || codeListDB({id: {likenocase: codeID.replace(';', '')}}).first()))) {

                    switch (codeData.type) {
                        case 'aweb':
                        case 'widget':
                            result = {
                                type: 'function',
                                value: codeData.code || codeData.value,
                                expression: optionInstance['expression_' + optionKey]
                            };

                            if (optionInstance['arguments_' + optionKey]) {
                                result.params = optionToParams($.extend(true, [], codeData.option), $.extend(true, {}, optionInstance['arguments_' + optionKey]))
                            } else if (optionInstance['dataType_' + optionKey] === 'handler') {
                                result.type = 'handler';
                            }
                            break;

                        case 'var':
                            result = {
                                type: 'variable',
                                value: {
                                    name: codeData.name,
                                    namespace: codeData.namespace
                                }
                            };
                            break;

                        case 'const':
                            result = {
                                type: 'code',
                                value: codeData.name
                            };
                            break;

                        case 'jsType':
                            if (optionInstance['jsValue_' + optionKey] !== '') {
                                result.type = 'code';
                                switch (codeData.toAddOptionType) {
                                    case 'jsEditor':
                                        result.value = toCodeString(optionInstance['jsValue_' + optionKey]);
                                        break;

                                    default:
                                        result.value = JSON.stringify(optionInstance['jsValue_' + optionKey]);
                                        break;
                                }
                            }


                            break;
                    }
                } else {
                    switch (codeID) {
                        case 'data':
                        case 'response':

                            result = {
                                type: 'variable',
                                namespace: 'local',
                                value: codeID
                            };

                            break;

                        case 'nothing':
                            result = {
                                type: 'code',
                                value: 'undefined'
                            };
                            break;

                        default:

                            break;
                    }
                }

                return result;
            }

            function getCodeObj(nodeData) {

                var structure = nodeData.structure,
                    optionInstance = structure && structure.option,
                    codeID = nodeData.id, type,
                    codeData,
                    result = {},
                    code = nodeData.code || nodeData.value || '';

                if (nodeData.category === 'if') {
                    result = optionKeyToObj(optionInstance, 'ifValue');
                } else {
                    switch (nodeData.type) {
                        case 'aweb':
                        case 'widget':
                            // codeData = codeListDB({ id: codeID }).first();
                            type = 'function';

                            switch (nodeData.key) {
                                case 'ajaxNode':
                                    if (!nodeData.isNotAjax) {
                                        code = '$.ajax()';
                                    }
                                    break;

                                case 'customAdd':
                                    if (nodeData.code === 'app.modal()') {
                                        type = 'anchor';
                                    }
                                    break;

                                case 'responseData':
                                    if (nodeData.isAnchor) {
                                        type = 'anchor';
                                    }
                                    break;
                            }
                            result = {
                                type: type,
                                value: code,
                                params: optionInstance && optionToParams($.extend(true, [], nodeData.option), $.extend(true, {}, optionInstance))
                                // expression: optionInstance['expression_' + nodeData.name]
                            };
                            break;

                        case 'var':
                            result = {
                                type: 'variable',
                                value: {
                                    name: nodeData.name,
                                    namespace: nodeData.namespace,
                                    value: optionKeyToObj(optionInstance, 'assignValue')
                                }
                            };
                            break;

                        case 'rawCode':
                            result = {
                                type: 'code',
                                value: toCodeString(optionInstance.codeValue) || ''
                            };
                            break;

                        case 'anchor':
                            result = {
                                type: 'anchor',
                                value: nodeData.handler || nodeData.key
                            };
                            break;

                        default:
                            if (nodeData.isAnchor) {
                                if (nodeData.desp in openDespMap) {
                                    result.code = 'app.open()';
                                    result.type = 'anchor';
                                }
                            }
                            break;
                    }
                }

                return result;
            }

            function diagramToCode(diagram) {
                var model = diagram.model,
                    nodedb = app.taffy($.extend(true, [], model.nodeDataArray)),
                    linkdb = app.taffy($.extend(true, [], model.linkDataArray)),
                    result = {}, startNodes = [],
                    endNodeKeys = [], recursiveCount = 0;

                $.each(linkdb().get(), function (index, linkData) {  //最后节点
                    if (linkdb({from: linkData.to}).get().length === 0) {
                        endNodeKeys.push(linkData.to);
                    }
                    if (nodedb({key: linkData.from}).first().category === 'start') {

                        startNodes.push({name: linkData.from, startNodeKey: linkData.to});
                    }
                });

                $.each(startNodes, function (index, startNode) {
                    result[startNode.name] = toCode(startNode.startNodeKey, endNodeKeys);
                });

                function toCode(startNodeKey, endNodeKeys) {
                    var outOfIfNodeLinks,
                        result = [], nLink, yLink, ifNodeKey,
                        startNode = nodedb({key: startNodeKey}).first(),
                        outOfStartNodeLinks = linkdb({from: startNodeKey}).get(),
                        intoStartNodeLinks = linkdb({to: startNodeKey}).get();

                    // try {
                    recursiveCount++;

                    if ($.inArray(startNodeKey, endNodeKeys) !== -1) {
                        //始节点和终节点相同，应该结束递归
                        if (startNode.category !== 'if') {
                            result.push(getCodeObj(startNode));
                        }
                        return result;
                    }

                    if (startNode.category === 'if') {
                        //判断语句节点
                        if (outOfStartNodeLinks.length === 2) {
                            //包含yes和no
                            if ((typeof outOfStartNodeLinks[0].desp === 'undefined') || outOfStartNodeLinks[0].desp === 'Yes') {
                                yLink = outOfStartNodeLinks[0];
                                nLink = outOfStartNodeLinks[1];
                            } else {
                                yLink = outOfStartNodeLinks[1];
                                nLink = outOfStartNodeLinks[0];
                            }

                            if (intoStartNodeLinks.length === 2) {
                                //while循环结构

                                result.push({
                                    type: 'while',
                                    condition: getCodeObj(startNode),
                                    body: toCode(yLink.to, intoStartNodeLinks.map(function (link) {
                                        return link.from
                                    }))
                                });

                                /*result.push('while(' + getCodeObj(startNode) + '){' + toCode(yLink.to, intoStartNodeLinks.map(function (link) {
                                 return link.from
                                 })) + '}');*/

                                result = result.concat(toCode(nLink.to, endNodeKeys));
                            } else if (intoStartNodeLinks.length < 2) {
                                // 分支结构
                                result.push({
                                    type: 'if',
                                    condition: getCodeObj(startNode),
                                    yesBody: toCode(yLink.to, endNodeKeys),
                                    noBody: toCode(nLink.to, endNodeKeys)
                                });

                                /*result.push('if(' + getCodeObj(startNode) + ')');
                                 result.push('{' + toCode(yLink.to, endNodeKeys) + '}');

                                 //else语句体内的代码
                                 result.push('else{' + toCode(nLink.to, endNodeKeys) + '}');*/
                            }
                        } else if (outOfStartNodeLinks.length === 1) {
                            //只包含yes 或 no
                            if ((typeof outOfStartNodeLinks[0].desp === 'undefined') || outOfStartNodeLinks[0].desp === 'Yes') {
                                yLink = outOfStartNodeLinks[0];
                                nLink = undefined;
                            } else {
                                yLink = undefined;
                                nLink = outOfStartNodeLinks[0];
                            }

                            if (intoStartNodeLinks.length === 2) {
                                //while循环结构

                                result.push({
                                    type: 'while',
                                    condition: getCodeObj(startNode),
                                    body: yLink && toCode(yLink.to, intoStartNodeLinks.map(function (link) {
                                        return link.from
                                    }))
                                });

                                /* result.push('while(' + getCodeObj(startNode) + '){' + toCode(yLink.to, intoStartNodeLinks.map(function (link) {
                                 return link.from
                                 })) + '}');*/
                                result = result.concat(toCode(nLink.to, endNodeKeys));
                            } else if (intoStartNodeLinks.length < 2) {
                                // 分支结构

                                result.push({
                                    type: 'if',
                                    condition: getCodeObj(startNode),
                                    yesBody: yLink && toCode(yLink.to, endNodeKeys),
                                    noBody: nLink && toCode(nLink.to, endNodeKeys)
                                });

                                //if语句体内的代码
                                /* result.push('if(' + getCodeObj(startNode) + ')');
                                 result.push('{' + toCode(yLink.to, endNodeKeys) + '}');*/
                            }
                        }
                    } else {
                        //普通语句节点
                        if (intoStartNodeLinks.length === 2 && outOfStartNodeLinks.length === 1) {

                            $.each(intoStartNodeLinks, function (index, linkData) {
                                if (nodedb({key: linkData.from}).first().category === 'if') {
                                    ifNodeKey = linkData.from;
                                }
                            });

                            if (ifNodeKey) {
                                //do...while循环结构
                                outOfIfNodeLinks = linkdb({from: ifNodeKey}).get();

                                if (typeof outOfIfNodeLinks[0].desp === 'undefined') {
                                    yLink = outOfIfNodeLinks[0];
                                    nLink = outOfIfNodeLinks[1];
                                } else {
                                    yLink = outOfIfNodeLinks[1];
                                    nLink = outOfIfNodeLinks[0];
                                }

                                result.push({
                                    type: 'do_while',
                                    condition: getCodeObj(nodedb({key: ifNodeKey}).first()),
                                    body: [getCodeObj(startNode)]
                                        .concat(toCode(outOfStartNodeLinks[0].to, intoStartNodeLinks.map(function (link) {
                                            return link.from
                                        })))
                                });

                                /*result.push('do{' + getCodeObj(startNode,true) + toCode(outOfStartNodeLinks[0].to, intoStartNodeLinks.map(function (link) {
                                 return link.from
                                 }))
                                 + '}while(' + getCodeObj(nodedb({key: ifNodeKey}).first()) + ');');*/

                                result = result.concat(toCode(nLink.to, endNodeKeys));
                            } else {
                                //顺序结构
                                result.push(getCodeObj(startNode));
                                result = result.concat(toCode(outOfStartNodeLinks[0].to, endNodeKeys));
                            }
                        } else if (intoStartNodeLinks.length < 2 && outOfStartNodeLinks.length === 1) {
                            //顺序结构
                            result.push(getCodeObj(startNode));
                            result = result.concat(toCode(outOfStartNodeLinks[0].to, endNodeKeys));
                        }
                    }

                    return result;
                    /*} catch (e) {
                     app.alert('请检查流程图');
                     }*/
                }

                return result;

            }

            function syncToCode(diagram, noUpdate, noChange) {
                var codeItem;
                if (entrance) {
                    if (codeItem = dataModel.get('code')({foreignID: entrance.foreignID}).first()) {
                        // codeItem.dataJSON = diagram.model.toJson();
                        codeItem.codeModel = diagramToCode(diagram);
                        codeItem.nodeDataArray = $.extend(true, [], diagram.model.nodeDataArray);
                        codeItem.linkDataArray = $.extend(true, [], diagram.model.linkDataArray);

                    }
                }
                if (!noUpdate) {
                    $AW.trigger($AW.STATUS.PREVIEW_FRESH);
                }


            }

            function resetData(nodeDataArray, linkDataArray, startNodeKey) {
                var nodeDataDB = app.taffy(nodeDataArray), linkDataDB = app.taffy(linkDataArray),
                    newNodeData = [], newLinkData = [];

                function addToResult(startNodeKeys) {
                    var outOfStartNodesLinks = linkDataDB({from: startNodeKeys}).get();

                    newNodeData = newNodeData.concat(nodeDataDB({key: startNodeKeys}).get());

                    if (outOfStartNodesLinks.length > 0) {
                        newLinkData = newLinkData.concat(outOfStartNodesLinks);
                        addToResult(outOfStartNodesLinks.map(function (linkData) {
                            return linkData.to;
                        }));
                    }
                }

                addToResult([startNodeKey]);

                return {
                    nodeDataArray: newNodeData,
                    linkDataArray: newLinkData
                }
            }

            function getAnchorCodeID(str) {
                var result;

                if (str) {
                    if (result = str.match(/##.{25}_WID_VAR##\.[^(]+/i)) {
                        str = result[0];
                    }
                } else {
                    str = 'undefined';
                }

                return str;
            }

            function updateRightSide(needUpdate) {

                if (!myDiagram) {
                    initRightSide();
                }

                var requestListCache = [], responseListCache = [], cache,
                    handler = oEntrance[0].data.handler || oEntrance[0].data.code,
                    handlerText = oEntrance[0].data.handlerText,
                    openInterfaceList = {
                        sub: true,
                        redirect: true,
                        window: true,
                        popover: true
                    };

                ajaxNode = $.extend(true, {}, codeListDB({id: 'app.ajax()'}).first()) || {desp: '异步请求'};

                ajaxNode.key = 'ajaxNode';
                ajaxNode.desp = handlerText;
                ajaxNode.loc = '350.125 129.16328125';

                requestListCache = oEntrance.request() && oEntrance.request().list();

                responseListCache = oEntrance.response() && oEntrance.response().list();

                function updateOneDiagram() {
                    var initialNodeData = {
                            startData: {
                                desp: '数据传输',
                                category: 'start',
                                key: 'startData',
                                loc: "44.5 12.65"
                            },
                            startSuccess: {
                                desp: '数据回显',
                                category: 'start',
                                key: 'startSuccess',
                                loc: "248 12.65"
                            },
                            startCustom: {
                                desp: '自定义代码',
                                category: 'start',
                                key: 'startCustom'
                            }
                        },
                        startDataAddedNodes = [
                            {
                                desp: '传输字段(data)',
                                type: 'anchor',
                                category: 'request',
                                key: 'requestData',
                                edmType: 'request',
                                items: requestListCache,
                                loc: "-35.875 103.16328125"
                            },
                            {
                                desp: '返回数据',
                                key: 'returnData',
                                type: 'anchor',
                                loc: "-36.25 171.65"
                            }
                        ],
                        startDataAddedLinks = [
                            {
                                from: 'startData',
                                to: 'requestData'
                            },
                            {
                                from: 'requestData',
                                to: 'returnData'
                            }
                        ],
                        startSuccessAddedNodes = [
                            {
                                desp: '数据回显(response.content.result)',
                                category: 'request',
                                key: 'responseData',
                                type: 'anchor',
                                handler: handler,
                                edmType: 'response',
                                items: responseListCache,
                                loc: "350.125 129.16328125"
                            }
                        ],
                        startCustomAddedNodes = [
                            {
                                key: 'customAdd',
                                type: 'anchor',
                                desp: handlerText,
                                handler: handler,
                                id: AUI.transformForeignKey(handler, oEntrance[0].data.widgetID, entrance.foreignID)
                            }
                        ],
                        startCustomAddedLinks = [
                            {
                                from: 'startCustom',
                                to: 'customAdd'
                            }
                        ],
                        startSuccessAddedLinks = [
                            {
                                from: 'startSuccess',
                                to: 'responseData'
                            }
                        ],
                        nodeDataArray = [], linkDataArray = [],
                        transform = true, newDataObj, nodeData,
                        codeItem, tempObj, tempCodeID,
                        i, arrItem, tempArr,
                        requestNode, responseNode, widgetID, widgetIns, api, _i, _item;

                    tempCodeID = AUI.transformIntoForeignKey(AUI.transformForeignKey(handler, entrance.widgetID, entrance.foreignID), entrance.widgetID);
                    tempCodeID = getAnchorCodeID(tempCodeID);
                    tempObj = codeListDB({id: {likenocase: tempCodeID}}).first();

                    if (tempObj) {
                        if ((widgetID = tempObj.id.match(/##(.{25})_WID_VAR##/i)) && widgetID.length) {
                            if ((widgetIns = $AW(widgetID[1])) && widgetIns.length) {
                                api = widgetIns[0].widget.api;
                                for (_i = -1; _item = api[++_i];) {
                                    if (tempObj.oldValue && (tempObj.oldValue.trim() === _item.value.trim())) {
                                        if (_item.deps === 'ajax') {
                                            transform = false;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if (transform) {
                            ajaxNode = JSON.parse(JSON.stringify(ajaxNode));
                            tempObj = JSON.parse(JSON.stringify(tempObj));
                            $.extend(startCustomAddedNodes[0], tempObj);
                            $.extend(ajaxNode, tempObj);
                            //  ajaxNode.isNotAjax = true;
                        } else {
                            startCustomAddedNodes[0].code = tempObj.code;
                            ajaxNode.code = tempObj.code;
                        }
                        ajaxNode.isNotAjax = true;

                    }

                    //判断handler
                    if ((category === 'ajaxFirst' && handler !== 'ajax') || (!(oEntrance[0].data.code in {
                            echo: true,
                            ajax: true
                        }) && oEntrance[0].data.lifecycleID)) {

                        cache = {
                            desp: handlerText,
                            type: 'anchor',
                            key: 'responseData',
                            handler: handler,
                            loc: "350.125 129.16328125"
                        };

                        startSuccessAddedNodes = [
                            cache
                        ];

                        // if (tempObj) {
                        //     $.extend(startSuccessAddedNodes[0], tempObj);
                        // }
                    }

                    if (handler === 'modal') {
                        cache = $.extend(true, {}, codeListDB({id: 'app.modal()'}).first());
                        cache.key = 'customAdd';
                        cache.isAnchor = true;

                        startCustomAddedNodes = [cache];
                    } else if (handler in openInterfaceList) {
                        cache = $.extend(true, {}, codeListDB({id: 'app.open()'}).first());
                        cache.loc = '350.125 129.16328125';
                        cache.key = 'responseData';
                        cache.desp = handlerText;
                        cache.isAnchor = true;
                        startSuccessAddedNodes = [cache];
                    }

                    codeItem = dataModel.get('code')({foreignID: entrance.foreignID}).first();
                    if (!codeItem || (codeItem && !codeItem.nodeDataArray.length)) {
                        dataModel.get('code')({foreignID: entrance.foreignID}).remove();

                        dataModel.get('code').insert({
                            foreignID: entrance.foreignID,
                            widgetID: entrance.widgetID,
                            category: category,
                            applyTo: entrance.applyTo,
                            codeModel: {},
                            dataJSON: '',
                            nodeDataArray: [],
                            linkDataArray: []
                        });
                        switch (category) {
                            case 'ajaxFirst':
                                nodeDataArray = [initialNodeData.startData, initialNodeData.startSuccess]
                                    .concat(startDataAddedNodes)
                                    .concat(startSuccessAddedNodes);

                                linkDataArray = linkDataArray.concat(startDataAddedLinks)
                                    .concat(startSuccessAddedLinks);
                                break;

                            case 'apiFirst':
                                nodeDataArray = [initialNodeData.startData, initialNodeData.startSuccess]
                                    .concat([ajaxNode])
                                    .concat(startDataAddedNodes)
                                /* .concat(startSuccessAddedNodes) */;

                                linkDataArray = linkDataArray
                                    .concat([{from: 'startSuccess', to: 'ajaxNode'}])
                                    .concat(startDataAddedLinks);

                                break;

                            case 'custom':
                                nodeDataArray = [initialNodeData.startCustom];

                                if (handlerText && handlerText !== '自定义') {
                                    nodeDataArray = nodeDataArray.concat(startCustomAddedNodes);
                                    linkDataArray = linkDataArray.concat(startCustomAddedLinks);
                                }
                                break;

                            case 'echo':
                                nodeDataArray = [initialNodeData.startSuccess]
                                    .concat(startSuccessAddedNodes);

                                linkDataArray = linkDataArray
                                    .concat(startSuccessAddedLinks);
                                break;
                        }
                        try{
                            myDiagram.model = D(go.GraphLinksModel, {
                                linkFromPortIdProperty: "fromPort",  // required information:
                                linkToPortIdProperty: "toPort",      // identifies data property names
                                nodeDataArray: nodeDataArray,
                                linkDataArray: linkDataArray
                            });

                        }catch (e){

                        }





                        // app.performance.shortDelay(function () {
                        //
                        // })

                    } else {
                        if (codeItem.category !== category || needUpdate) {
                            switch (category) {
                                case 'ajaxFirst':

                                    switch (codeItem.category) {
                                        case 'apiFirst':
                                        case 'ajaxFirst':

                                            //只保留data传输部分
                                            newDataObj = resetData(codeItem.nodeDataArray, codeItem.linkDataArray, 'startData');

                                            nodeDataArray = newDataObj.nodeDataArray
                                                .concat([initialNodeData.startSuccess])
                                                .concat(startSuccessAddedNodes);

                                            linkDataArray = newDataObj.linkDataArray
                                                .concat(startSuccessAddedLinks);

                                            break;

                                        case 'custom':
                                        case 'echo':
                                            nodeDataArray = [initialNodeData.startData, initialNodeData.startSuccess]
                                                .concat(startDataAddedNodes)
                                                .concat(startSuccessAddedNodes);

                                            linkDataArray = linkDataArray.concat(startDataAddedLinks)
                                                .concat(startSuccessAddedLinks);
                                            break;
                                    }
                                    break;

                                case 'apiFirst':

                                    switch (codeItem.category) {
                                        case 'apiFirst':
                                        case 'ajaxFirst':

                                            //只保留data传输部分
                                            newDataObj = resetData(codeItem.nodeDataArray, codeItem.linkDataArray, 'startData');

                                            nodeDataArray = newDataObj.nodeDataArray
                                                .concat([ajaxNode])
                                                .concat([initialNodeData.startSuccess]);

                                            linkDataArray = newDataObj.linkDataArray
                                                .concat([{from: 'startSuccess', to: 'ajaxNode'}]);
                                            break;

                                        case 'custom':
                                        case 'echo':
                                            nodeDataArray = [initialNodeData.startData]
                                                .concat([ajaxNode])
                                                .concat([initialNodeData.startSuccess])
                                                .concat(startDataAddedNodes);

                                            linkDataArray = startDataAddedLinks
                                                .concat([{from: 'startSuccess', to: 'ajaxNode'}]);
                                            break;
                                    }
                                    break;

                                case 'custom':

                                    nodeDataArray = [initialNodeData.startCustom];
                                    linkDataArray = [];

                                    if (handlerText && handlerText !== '自定义') {
                                        nodeDataArray = nodeDataArray.concat(startCustomAddedNodes);
                                        linkDataArray = linkDataArray.concat(startCustomAddedLinks);
                                    }
                                    break;

                                case 'echo':
                                    switch (codeItem.category) {
                                        case 'ajaxFirst':
                                        case 'apiFirst':
                                        case 'custom':
                                            nodeDataArray = [initialNodeData.startSuccess]
                                                .concat(startSuccessAddedNodes);

                                            linkDataArray = linkDataArray
                                                .concat(startSuccessAddedLinks);
                                            break;

                                    }
                                    break;
                            }

                            // app.performance.shortDelay(function () {
                            //
                            // });

                            // try {
                                myDiagram.model = D(go.GraphLinksModel, {
                                    linkFromPortIdProperty: "fromPort",  // required information:
                                    linkToPortIdProperty: "toPort",      // identifies data property names
                                    nodeDataArray: nodeDataArray,
                                    linkDataArray: linkDataArray
                                });
                            // }catch (e){
                            //
                            // }



                            codeItem.category = category;
                            codeItem.nodeDataArray = nodeDataArray;
                            codeItem.linkDataArray = linkDataArray;

                            dataModel.get('code')({foreignID: entrance.foreignID}).update(codeItem);
                        } else {
                            // myDiagram.model = go.Model.fromJson(codeItem.dataJSON);

                            codeItem.nodeDataArray.forEach(function (obj) {
                                if (obj.type === 'anchor' && obj.key === 'responseData') {
                                    // obj.desp = handlerText;
                                }
                            });

                            // app.performance.shortDelay(function () {
                            //
                            // })
                            try {
                                myDiagram.model = D(go.GraphLinksModel, {
                                    linkFromPortIdProperty: "fromPort",  // required information:
                                    linkToPortIdProperty: "toPort",      // identifies data property names
                                    nodeDataArray: codeItem.nodeDataArray,
                                    linkDataArray: codeItem.linkDataArray
                                });

                            }catch (e){

                            }


                        }

                    }
                    //&& transform
                    if (tempObj) {

                        tempObj = JSON.parse(JSON.stringify(tempObj));

                        nodeData = myDiagram.findNodeForKey('customAdd');
                        if (nodeData && category === 'custom') {
                            if (transform) {
                                tempObj = $.extend(nodeData.data, tempObj);
                            } else {
                                nodeData.data.code = tempObj.code
                            }

                            myDiagram.model.setDataProperty(nodeData, "data", nodeData.data);
                        }

                        nodeData = myDiagram.findNodeForKey('ajaxNode');
                        if (nodeData) {
                            tempObj.isNotAjax = true;
                            if (transform) {
                                tempObj = $.extend(nodeData.data, tempObj);
                            } else {
                                nodeData.data.code = tempObj.code;
                            }
                            nodeData.data.isNotAjax = true;

                            myDiagram.model.setDataProperty(nodeData, "data", nodeData.data);
                        }
                    }

                    nodeData = myDiagram.findNodeForKey('responseData');
                    if (nodeData) {
                        tempObj = $.extend(nodeData.data, cache);
                        myDiagram.model.setDataProperty(nodeData, "data", nodeData.data);
                    }

                    requestNode = myDiagram.model.findNodeDataForKey("requestData");
                    if (requestNode !== null) myDiagram.model.setDataProperty(requestNode, "items", requestListCache);

                    responseNode = myDiagram.model.findNodeDataForKey("responseData");
                    if (responseNode !== null) myDiagram.model.setDataProperty(responseNode, "items", responseListCache);

                    tempArr = myDiagram.model.nodeDataArray;
                    for (i = tempArr.length; arrItem = tempArr[--i];) {
                        nodeData = myDiagram.findNodeForKey(arrItem.key);
                        updateConfig(nodeData, false, true);
                    }


                        app.performance.shortDelay(function () {
                            myDiagram.model = D(go.GraphLinksModel, {
                                linkFromPortIdProperty: "fromPort",  // required information:
                                linkToPortIdProperty: "toPort",      // identifies data property names
                                nodeDataArray: myDiagram.model.nodeDataArray,
                                linkDataArray: myDiagram.model.linkDataArray
                            });
                        });




                    syncToCode(myDiagram, false, true);

                }



                if (entrance) {
                    $overViewPanel.find('a[data-action-role]').hide();
                    $overViewPanel.find('a[data-action-role="' + actionRole + '"]').show().tab('show');

                    // updateOneCode();
                    updateOneDiagram();
                    refreshVarCodeList();

                    $('body').off('click.overview').on({
                        'click.overview': function (e, isTrigger) {

                            var $target = $(e.target || event.srcElement).closest('[data-role]'),
                                role = $target.attr('data-role'),
                                codeModel,
                                codeInstance;

                            if (role === 'auiRunOverview') {
                                if (entrance && (codeInstance = dataModel.get('code')({foreignID: entrance.foreignID}).first())) {
                                    codeModel = diagramToCode(myDiagram);

                                    codeInstance.codeModel = codeModel;
                                    // codeInstance.varList = getVarList();

                                    require(['compile'], function (Compile) {

                                        var compileIns = new Compile(dataModel),
                                            bootstrap;


                                        bootstrap = compileIns.compile(dataModel.getList(), codeInstance.foreignID);
                                        bootstrap = bootstrap.substring(7, bootstrap.length - 2);

                                        // $('a[href=#myEditor]').tab('show');

                                        if (!isTrigger) {
                                            app.popover({
                                                $elem: $target,
                                                title: '编译结果',
                                                content: '',
                                                width: '70%',
                                                height: '90%',
                                                placement: 'auto bottom',
                                                fixClick: true,
                                                init: function () {
                                                    var $popoverBody = $(this).find('.aweb-popover-body').empty();
                                                    var editor = AUI.vscode.create(
                                                        $popoverBody, {
                                                            value: bootstrap,
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

                                                    $(this).on('screenChange', function () {
                                                        editor.layout();
                                                    })

                                                },
                                                confirmHandler: function () {
                                                    // obj[name] = editor.getValue();
                                                },
                                            });
                                        }
                                    });

                                }
                            }

                        }
                    });
                    //绑定run事件

                }

            }

            function changeSelection(myDiagram, newNode) {
                updateConfig(myDiagram.selection.first(), newNode);

                $('a[href=#myInspector]').tab('show');

                syncToCode(myDiagram, true);
            }

            function updateConfig(node, newNode, noChange) {
                var codeID, temp,
                    nodeData, codeItem, option = {}, nodeOption, advancedOptionCopy,optionArray,
                    advancedOption, i, item,name,
                    nothing, overviewCodeTree, tempNode, flag, advanceOption, len,
                    advancedData = [],
                    advancedObj = {},
                    codeTreeArray = JSON.parse(JSON.stringify(AUI.overviewData.codeTree().get())),
                    config = function (option, optionCopy) {
                        if (node) {
                            myDiagram.model.setDataProperty(node.data, "structure", {
                                option: option,
                                optionCopy: optionCopy
                            });
                            syncToCode(myDiagram, false, noChange);
                        }
                    },advancedOptionKeyArr;

                if ((node && node.data.id && node instanceof go.Node) || (node && node.data.desp in openDespMap)) {
                    nodeData = node.data;

                    if (nodeData.desp in openDespMap) {
                        codeID = 'app.open()';
                    } else if (nodeData.type === 'anchor' && nodeData.handler) {
                        temp = nodeData.id.match(/_VAR##\.([^(]+)/i);
                        if (temp) {
                            codeID = temp[1];
                        }
                    } else {
                        codeID = nodeData.id;
                    }
                    codeItem = codeListDB({id: codeID}).first() || codeListDB({id: {likenocase: codeID}}).first();

                    //合并新旧的参数
                    mergeOption(nodeData, codeItem && codeItem.option);

                    if ($.isArray(nodeData.option) && nodeData.option.length) {
                        if (nodeData.structure && !newNode) {
                            option = nodeData.structure.option;
                        }
// "_parseFunction_##2908A81E50D20EE6BCF4-67AF_WID_VAR##"
                       option=JSON.parse(JSON.stringify(option).replace(/_parseFunction_(##.{25,})_WID_VAR/g,'$1_WID_var'));

                        config(option, base.baseConfigInitInstance(option, nodeData.option));


                        if (option.option && $.isPlainObject(option.option) && !node.data.updateDesp) {
                            option.option.desp = getCurrentDesp(node.data.key !== 'ajaxNode');
                        } else {
                            if (!node.data.updateDesp) {
                                option.desp = getCurrentDesp(node.data.key !== 'ajaxNode');
                            }
                        }
                        myDiagram.model.setDataProperty(node.data, "updateDesp", true);

                        AUI.getOverviewCodeTree();
                        // if (!(overviewCodeTree=dataModel.get('overviewCodeTree'))) {
                        // nothing = codeTreeArray[0];
                        // tempNode = {};
                        // if (nothing.id === 'nothing' || nothing.id === '') {
                        //     if (nothing.id === '') {
                        //         nothing.id = 'nothing';
                        //         nothing.desp = '无';
                        //     }
                        //     if (tempNode.children = []) {
                        //         tempNode.children.push(nothing);
                        //         tempNode.desp = '空白选项';
                        //     }
                        // }
                        // codeTreeArray[0] = tempNode;
                        // overviewCodeTree = AUI.traverseTree(codeTreeArray);
                        // dataModel.set('overviewCodeTree', overviewCodeTree);

                        optionArray=JSON.parse(JSON.stringify(nodeData.option));

                        if ((nodeOption = optionArray[0])) {

                            if (nodeOption.type === 'object' && (advancedOption = nodeOption.attr) && (len = advancedOption.length)) {

                                advancedOptionCopy = option[nodeOption.name];
                                advancedOptionKeyArr=Object.keys(advancedOptionCopy);
                                for (i = -1; item = advancedOption[++i];) {
                                    if (!item.necessary) {
                                        name = item.name;
                                        advancedData.push(item);
                                        if (advancedOptionCopy.hasOwnProperty(name)) {
                                            advancedObj[name] = advancedOptionCopy[name];
                                            advancedOptionKeyArr.forEach(function(item,index){
                                                   if(new RegExp('_'+item+'$','g')){
                                                        advancedObj[item]=advancedOptionCopy[item];     
                                                   }                         
                                            })
                                         //   delete advancedOptionCopy[name];
                                        }


                                        advancedOption.splice(i, 1);
                                        i = i - 1;
                                        flag = true;
                                    }
                                }

                                if (flag) {
                                    advancedOption.push({
                                        name: ADVANCE,
                                        desp: '高级配置',
                                        type: ADVANCE,
                                        array: advancedData,
                                        overview: true
                                    });
                                    // advancedOptionCopy[ADVANCE] = advancedObj;
                                } else if ((advanceOption = advancedOption[len - 1]) && advancedOption.name === ADVANCE) {
                                    for (i = -1; item = advanceOption.array[++i];) {
                                        name = item.name;
                                       // if()
                                        advancedObj[name] = (advancedOptionCopy[ADVANCE] && advancedOptionCopy[ADVANCE][name]) || advancedOptionCopy[name];
                                           // advancedOptionKeyArr.forEach(function(item,index){
                                           //         if(new RegExp('_'+item+'$'),g){
                                           //              advancedObj[item]=advancedOptionCopy[item];     
                                           //         }                         
                                           //  })
                                    }
                                    // advancedOptionCopy[ADVANCE] = advancedObj;
                                }
                            }
                        }

                        base.baseConfig('overviewInspector', option, optionArray, function (_args) {
                            var args = _args;
                            if (nodeOption) {

                                if (args.newObj[nodeOption.name].hasOwnProperty(ADVANCE)) {
                                    delete  args.newObj[nodeOption.name][ADVANCE];
                                    delete  args.newObjCopy[nodeOption.name][ADVANCE];
                                }
                            }
                            config(args.newObj, args.newObjCopy);
                        });

                        if (option[nodeOption.name] && option[nodeOption.name].hasOwnProperty(ADVANCE)) {
                            delete option[nodeOption.name][ADVANCE];
                        }

                        $AW.off($AW._STATUS.OVERVIEW_FRAME.ADVANCE + '.overview')
                            .on($AW._STATUS.OVERVIEW_FRAME.ADVANCE + '.overview', function (type, contextID) {
                                if (advancedData.length) {
                                    base.baseConfig(contextID, advancedObj, advancedData, function (args) {
                                        if (nodeOption) {
                                            if (option.hasOwnProperty(nodeOption.name)) {
                                                $.extend(true, option[nodeOption.name], args.newObj);
                                            }
                                        }
                                        config(option, option);
                                    });
                                }
                            })


                    } else {

                        base.baseConfig('overviewInspector', {}, [])
                    }
                } else if (node && node.data.category === "request") {
                    //do nothing
                } else {
                    app.performance.shortDelay(function () {
                        base.baseConfig('overviewInspector', {}, []);
                    })

                }
            }


            function initRightSide() {

                // the template for each attribute in a node's array of item data
                var itemTempl =
                        D(go.Panel, "TableRow",  // this Panel is a row in the containing Table
                            new go.Binding("portId", "name"),  // this Panel is a "port"
                            {
                                background: "#fff"  // so this port's background can be picked by the mouse
                                /*fromSpot: go.Spot.LeftRightSides,  // links only go from the right side to the left side
                                 toSpot: go.Spot.LeftRightSides,
                                 // allow drawing links from or to this port:
                                 fromLinkable: true, toLinkable: true*/
                            },
                            { // allow the user to select items -- the background color indicates whether "selected"
                                //?? maybe this should be more sophisticated than simple toggling of selection
                                click: function (e, item) {
                                    // assume "transparent" means not "selected", for items
                                    var oldskips = item.diagram.skipsUndoManager,
                                        panel = item.panel,
                                        diagram = item.diagram,
                                        edmType = panel.edmType,
                                        node, table, iit, i, listItem, j, subItem, tempArr,
                                        itemID,


                                        varList = codeTreeDB({text: "变量"}).first().children;

                                    // varList = JSON.parse(JSON.stringify(varList).replace(/#{3,}/g, '##'));

                                    for (i = varList.length; listItem = varList[--i];) {
                                        tempArr = listItem.children;

                                        for (j = tempArr.length; subItem = tempArr[--j];) {
                                            itemID = subItem && subItem.id;

                                            if (!itemID || (itemID && itemID.indexOf('OVERVIEW_VAR') === -1)) {
                                                subItem.id = transVarID(subItem.id);
                                            }
                                            subItem.text = subItem.name;
                                        }
                                    }

                                    // codeListDB({type: 'var'}).each(function (item, index) {
                                    //     varList.push({
                                    //         id: transVarID(item.id),
                                    //         text: item.name
                                    //     });
                                    // });

                                    switch (edmType) {
                                        case 'request':
                                            varList = varList.concat([{
                                                id: transVarID('data'),
                                                text: 'data'
                                            }]);

                                            break;

                                        case 'response':
                                            varList = varList.concat([{
                                                id: transVarID('response'),
                                                text: 'response'
                                            }]);
                                            break;
                                    }

                                    diagram.skipsUndoManager = true;

                                    if (node = diagram.findNodeForKey('requestData')) {
                                        table = node.findObject('TABLE');
                                        if (table) {
                                            for (iit = table.elements; iit.next();) {
                                                iit.value.background = "#fff";
                                            }
                                        }
                                    }

                                    if (node = diagram.findNodeForKey('responseData')) {
                                        table = node.findObject('TABLE');
                                        if (table) {
                                            for (iit = table.elements; iit.next();) {
                                                iit.value.background = "#fff";
                                            }
                                        }
                                    }

                                    item.background = "#bfe8f5";

                                    diagram.skipsUndoManager = oldskips;

                                    $('a[href=#myInspector]').tab('show');

                                    edmUtil.edmSingleConfig({
                                        edmID: oEntrance[edmType]().id(),
                                        varList: varList,
                                        index: item.data.index,
                                        $context: $contextInspector.children('div'),
                                        callback: function () {
                                        }
                                    });
                                    e.event.stopPropagation();
                                    e.event.preventDefault();
                                    return false;
                                }
                            },
                            D(go.TextBlock,
                                {
                                    margin: new go.Margin(0, 2),
                                    column: 1,
                                    font: "bold 10.5pt sans-serif",
                                    stroke: "#666666",
                                    // and disallow drawing links from or to this text:
                                    fromLinkable: false,
                                    toLinkable: false
                                },
                                new go.Binding("text", "alias")),
                            D(go.TextBlock,
                                {margin: new go.Margin(0, 2), column: 2, font: "bold 10.5pt sans-serif", stroke: "#666666"},
                                new go.Binding("text", "comment"))
                        ),
                    lightgrad = D(go.Brush, "Linear", {1: "#FFFFFF", 0: "#FFFFFF"});

                // Define a function for creating a "port" that is normally transparent.
                // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
                // and where the port is positioned on the node, and the boolean "output" and "input" arguments
                // control whether the user can draw links from or to the port.
                function makePort(name, spot, output, input) {
                    // the port is basically just a small circle that has a white stroke when it is made visible
                    return D(go.Shape, "Circle",
                        {
                            fill: "transparent",
                            stroke: "transparent",  // this is changed to "white" in the showPorts function
                            desiredSize: new go.Size(8, 8),
                            alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                            portId: name,  // declare this object to be a "port"
                            fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                            fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                            cursor: "pointer" // show a different cursor to indicate potential link point
                        });
                }

                // Make all ports on a node visible when the mouse is over the node
                function showPorts(node, show) {
                    var diagram = node.diagram;
                    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
                    node.ports.each(function (port) {
                        port.stroke = (show ? "#888888" : null);
                        port.fill = (show ? "#fff" : null);
                    });
                }

                // Upon a drop onto a Group, we try to add the selection as members of the Group.
                // Upon a drop onto the background, or onto a top-level Node, make selection top-level.
                // If this is OK, we're done; otherwise we cancel the operation to rollback everything.
                function finishDrop(e, grp) {
                    /*var ok = (grp !== null
                     ? grp.addMembers(grp.diagram.selection, true)
                     : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
                     if (!ok || (grp && grp.part.data.isGroup && e.diagram.selection.first().data.isGroup)) e.diagram.currentTool.doCancel();*/
                }

                // this function is used to highlight a Group that the selection may be dropped into
                function highlightGroup(e, grp, show) {
                    if (!grp) return;
                    e.handled = true;
                    if (show) {
                        // cannot depend on the grp.diagram.selection in the case of external drag-and-drops;
                        // instead depend on the DraggingTool.draggedParts or .copiedParts
                        var tool = grp.diagram.toolManager.draggingTool;
                        var map = tool.draggedParts || tool.copiedParts;  // this is a Map
                        // now we can check to see if the Group will accept membership of the dragged Parts
                        if (grp.canAddMembers(map.toKeySet())) {
                            grp.isHighlighted = true;
                            return;
                        }
                    }
                    grp.isHighlighted = false;
                }

                function groupStyle() {
                    return [{deletable: false},
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        new go.Binding("background", "isHighlighted", function (h) {
                            return h ? "rgba(255,0,0,0.2)" : "transparent";
                        }).ofObject(),
                        {
                            locationSpot: go.Spot.Center,
                            layoutConditions: go.Part.LayoutAdded | go.Part.LayoutRemoved,
                            // If a node from the pallette is dragged over this node, its outline will turn green
                            mouseDragEnter: function (e, grp, prev) {
                                highlightGroup(e, grp, true);
                            },
                            mouseDragLeave: function (e, grp, next) {
                                highlightGroup(e, grp, false);
                            },
                            // computesBoundsAfterDrag: true,
                            // when the selection is dropped into a Group, add the selected Parts into that Group;
                            // if it fails, cancel the tool, rolling back any changes
                            mouseDrop: finishDrop
                        }];
                }

                function nodeStyle() {
                    return [
                        // The Node.location comes from the "loc" property of the node data,
                        // converted by the Point.parse static method.
                        // If the Node.location is changed, it updates the "loc" property of the node data,
                        // converting back using the Point.stringify static method.
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        {
                            // the Node.location is at the center of each node
                            locationSpot: go.Spot.Center,
                            //isShadowed: true,
                            //shadowColor: "#888",
                            // handle mouse enter/leave events to show/hide the ports
                            mouseEnter: function (e, obj) {
                                showPorts(obj.part, true);
                                obj.isHighlighted = true;
                            },
                            mouseLeave: function (e, obj) {
                                showPorts(obj.part, false);
                                obj.isHighlighted = false;
                            },
                            mouseDrop: function (e, obj) {
                                var diagram = e.diagram,
                                    oldnode = obj.part,
                                    newnode = diagram.selection.first(),
                                    tool = diagram.toolManager.linkingTool;

                                // tool.insertLink(oldnode, oldnode.port, newnode, newnode.port );
                            }
                        }
                    ];
                }

                //diagram
                myDiagram =
                    D(go.Diagram, 'myDiagram',
                        {
                            initialContentAlignment: go.Spot.MiddleTop, // center Diagram contents
                            // initialPosition: new go.Point(0, 0),
                            "undoManager.isEnabled": true,// enable Ctrl-Z to undo and Ctrl-Y to redo
                            // allowDrop: true,
                            /*layout:
                             D(go.LayeredDigraphLayout,
                             { direction: 90, layerSpacing: 4}),*/
                            "animationManager.isEnabled": false,
                            grid: D(go.Panel, "Grid",
                                D(go.Shape, "LineH", {stroke: "#f8f8f8", strokeWidth: 1, interval: 10}),
                                D(go.Shape, "LineH", {stroke: "#f8f8f8", strokeWidth: 1}),
                                D(go.Shape, "LineV", {stroke: "#f8f8f8", strokeWidth: 1}),
                                D(go.Shape, "LineV", {stroke: "#f8f8f8", strokeWidth: 1, interval: 10})
                            )
                        });

                $('body').off('mousedown.overview').on('mousedown.overview', function (e) {
                    var $el = $(e.target),
                        editor = myDiagram && myDiagram.toolManager.textEditingTool.currentTextEditor, element;

                    if (!$el.closest('#myDiagram').length) {
                        // myDiagram.clearSelection();
                        // myDiagram.focus();

                        if (editor && (element = editor.mainElement)) {
                            $(element).remove();
                        }

                    }
                });

                D(go.Overview, "myOverviewDiv",  // the HTML DIV element for the Overview
                    {observed: myDiagram, contentAlignment: go.Spot.Center});   // tell it which Diagram to show and pan

                $("#myDiagram").droppable({
                    // activeClass: "ui-state-highlight",
                    drop: function (event, ui) {
                        var elt = ui.draggable.first(),
                            id = elt.attr('data-code-id'),
                            codeItem = codeListDB({id: id}).first(),
                            nodeData, filterObj = {
                                belongTo: true,
                                code: true,
                                desp: true,
                                name: true,
                                text: true,
                                type: true,
                                id: true,
                                category: true
                            },
                            key,
                            diagramDivOffset = $(myDiagram.div).offset(),
                            x = ui.offset.left - diagramDivOffset.left,
                            y = ui.offset.top - diagramDivOffset.top,
                            p = new go.Point(x, y),
                            q = myDiagram.transformViewToDoc(p);

                        if (id) {
                            switch (codeItem.type) {
                                case 'aweb':
                                    nodeData = {};
                                    for (key in filterObj) {
                                        nodeData[key] = codeItem[key];
                                    }
                                    break;

                                default:
                                    nodeData = JSON.parse(JSON.stringify(codeItem));
                                    break;
                            }

                            if (nodeData.type === 'widget') {
                                nodeData.desp = $AW(nodeData.code.match(CONST.REGEX.FOREIGN_WIDGET.FOREIGN_WIDGET_SPILT_PASTE)[1]).name()
                                    + ' ' + nodeData.desp;
                            }

                            nodeData.loc = go.Point.stringify(q);
                            nodeData.key = app.getUID();

                            var model = myDiagram.model;
                            model.startTransaction("drop");
                            model.addNodeData(nodeData);
                            model.commitTransaction("drop");

                            myDiagram.select(myDiagram.findNodeForKey(nodeData.key));
                        }
                    }
                });

                myDiagram.nodeTemplateMap.add('', D(go.Node, "Spot", nodeStyle(), //nodeStyle is defined below
                    {
                        selectionAdorned: true,
                        toolTip: D(go.HTMLInfo, {
                            show: function (obj, diagram) {
                                var nodeData = obj.data;

                                //todo
                            }
                        })
                    },
                    D(go.Panel, "Auto",
                        D(go.Shape, "RoundedRectangle",
                            {fill: "#007ACC", stroke: null},
                            new go.Binding("figure", "figure")),
                        D(go.TextBlock,
                            {
                                font: "normal 10.5pt Arial, sans-serif",
                                stroke: '#fff',
                                margin: 4,
                                wrap: go.TextBlock.WrapFit,
                                editable: true,
                                isMultiline: false
                            },
                            new go.Binding("text", 'desp').makeTwoWay())
                    ),
                    makePort("T", go.Spot.Top, false, true),
                    makePort("L", go.Spot.Left, true, true),
                    makePort("R", go.Spot.Right, true, true),
                    makePort("B", go.Spot.Bottom, true, false)
                ));

                myDiagram.nodeTemplateMap.add('widget', D(go.Node, "Spot", nodeStyle(), //nodeStyle is defined below
                    {
                        selectionAdorned: true,
                        toolTip: D(go.HTMLInfo, {
                            show: function (obj, diagram) {
                                var nodeData = obj.data;

                                //todo
                            }
                        })
                    },
                    D(go.Panel, "Auto",
                        D(go.Shape, "RoundedRectangle",
                            {fill: "#fff", stroke: "#01a2fd", strokeWidth: 2},
                            new go.Binding("figure", "figure")),
                        D(go.TextBlock,
                            {
                                font: "normal 10.5pt Arial, sans-serif",
                                stroke: '#333333',
                                margin: 4,
                                wrap: go.TextBlock.WrapFit,
                                editable: true,
                                isMultiline: false
                            },
                            new go.Binding("text", 'desp').makeTwoWay())
                    ),
                    makePort("T", go.Spot.Top, false, true),
                    makePort("L", go.Spot.Left, true, true),
                    makePort("R", go.Spot.Right, true, true),
                    makePort("B", go.Spot.Bottom, true, false)
                ));

                myDiagram.nodeTemplateMap.add('aweb', D(go.Node, "Spot", nodeStyle(), //nodeStyle is defined below
                    {
                        selectionAdorned: true,
                        toolTip: D(go.HTMLInfo, {
                            show: function (obj, diagram) {
                                var nodeData = obj.data;

                                //todo
                            }
                        })
                    },
                    D(go.Panel, "Auto",
                        D(go.Shape, "RoundedRectangle",
                            {fill: "#fff", stroke: "#0064c8", strokeWidth: 2},
                            new go.Binding("figure", "figure")),
                        D(go.TextBlock,
                            {
                                font: "normal 10.5pt Arial, sans-serif",
                                stroke: '#333',
                                margin: 4,
                                wrap: go.TextBlock.WrapFit,
                                editable: true,
                                isMultiline: false
                            },
                            new go.Binding("text", 'desp').makeTwoWay())
                    ),
                    makePort("T", go.Spot.Top, false, true),
                    makePort("L", go.Spot.Left, true, true),
                    makePort("R", go.Spot.Right, true, true),
                    makePort("B", go.Spot.Bottom, true, false)
                ));

                myDiagram.nodeTemplateMap.add('var_local', D(go.Node, "Spot", nodeStyle(), //nodeStyle is defined below
                    {
                        selectionAdorned: true,
                        toolTip: D(go.HTMLInfo, {
                            show: function (obj, diagram) {
                                var nodeData = obj.data;

                                //todo
                            }
                        })
                    },
                    D(go.Panel, "Auto",
                        D(go.Shape, "RoundedRectangle",
                            {fill: "#ffc800", stroke: null},
                            new go.Binding("figure", "figure")),
                        D(go.TextBlock,
                            {
                                // font: "bold 11pt Helvetica, Arial, sans-serif",
                                stroke: '#fff',
                                margin: 4,
                                wrap: go.TextBlock.WrapFit,
                                editable: true,
                                isMultiline: false
                            },
                            new go.Binding("text", 'desp').makeTwoWay())
                    ),
                    makePort("T", go.Spot.Top, false, true),
                    makePort("L", go.Spot.Left, true, true),
                    makePort("R", go.Spot.Right, true, true),
                    makePort("B", go.Spot.Bottom, true, false)
                ));

                myDiagram.nodeTemplateMap.add('var_domain', D(go.Node, "Spot", nodeStyle(), //nodeStyle is defined below
                    {
                        selectionAdorned: true,
                        toolTip: D(go.HTMLInfo, {
                            show: function (obj, diagram) {
                                var nodeData = obj.data;

                                //todo
                            }
                        })
                    },
                    D(go.Panel, "Auto",
                        D(go.Shape, "RoundedRectangle",
                            {fill: "#ff9100", stroke: null},
                            new go.Binding("figure", "figure")),
                        D(go.TextBlock,
                            {
                                // font: "bold 11pt Helvetica, Arial, sans-serif",
                                stroke: '#fff',
                                margin: 4,
                                wrap: go.TextBlock.WrapFit,
                                editable: true,
                                isMultiline: false
                            },
                            new go.Binding("text", 'desp').makeTwoWay())
                    ),
                    makePort("T", go.Spot.Top, false, true),
                    makePort("L", go.Spot.Left, true, true),
                    makePort("R", go.Spot.Right, true, true),
                    makePort("B", go.Spot.Bottom, true, false)
                ));

                myDiagram.nodeTemplateMap.add('var_scope', D(go.Node, "Spot", nodeStyle(), //nodeStyle is defined below
                    {
                        selectionAdorned: true,
                        toolTip: D(go.HTMLInfo, {
                            show: function (obj, diagram) {
                                var nodeData = obj.data;

                                //todo
                            }
                        })
                    },
                    D(go.Panel, "Auto",
                        D(go.Shape, "RoundedRectangle",
                            {fill: "#ffaf00", stroke: null},
                            new go.Binding("figure", "figure")),
                        D(go.TextBlock,
                            {
                                // font: "bold 11pt Helvetica, Arial, sans-serif",
                                stroke: '#fff',
                                margin: 4,
                                wrap: go.TextBlock.WrapFit,
                                editable: true,
                                isMultiline: false
                            },
                            new go.Binding("text", 'desp').makeTwoWay())
                    ),
                    makePort("T", go.Spot.Top, false, true),
                    makePort("L", go.Spot.Left, true, true),
                    makePort("R", go.Spot.Right, true, true),
                    makePort("B", go.Spot.Bottom, true, false)
                ));

                myDiagram.nodeTemplateMap.add('start', D(go.Node, "Spot", nodeStyle(), //nodeStyle is defined below
                    {selectionAdorned: false},
                    D(go.Panel, "Auto",
                        D(go.Shape, "ellipse",
                            {fill: "#07c09f", stroke: null},
                            new go.Binding("figure", "figure")),
                        D(go.TextBlock,
                            {
                                // font: "bold 11pt Helvetica, Arial, sans-serif",
                                stroke: '#ffffff',
                                margin: 2,
                                wrap: go.TextBlock.WrapFit,
                                isMultiline: false
                            },
                            new go.Binding("text", 'desp').makeTwoWay())
                    ),
                    makePort("B", go.Spot.Bottom, true, false)
                ));

                myDiagram.nodeTemplateMap.add('if', D(go.Node, "Spot", nodeStyle(), //nodeStyle is defined below
                    {selectionAdorned: true},
                    /*makeGo(go.Shape, "Ellipse",
                     new go.Binding("fill", "color")),*/
                    D(go.Panel, "Auto",
                        D(go.Shape, "Diamond",
                            {fill: "#00a0dc", stroke: null},
                            new go.Binding("figure", "figure")),
                        D(go.TextBlock,
                            {
                                // font: "bold 11pt Helvetica, Arial, sans-serif",
                                stroke: '#fff',
                                margin: 2,
                                wrap: go.TextBlock.WrapFit,
                                editable: true,
                                isMultiline: false
                            },
                            new go.Binding("text", 'desp').makeTwoWay())
                    ),
                    makePort("T", go.Spot.Top, false, true),
                    makePort("L", go.Spot.Left, true, true),
                    makePort("R", go.Spot.Right, true, true),
                    makePort("B", go.Spot.Bottom, true, false)
                ));

                myDiagram.nodeTemplateMap.add('request', D(go.Node, "Auto", nodeStyle(), // the whole node panel
                    {
                        selectionAdorned: true,
                        resizable: false,
                        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
                        fromSpot: go.Spot.AllSides,
                        toSpot: go.Spot.AllSides,
                    },
                    new go.Binding("location", "location").makeTwoWay(),
                    // whenever the PanelExpanderButton changes the visible property of the "LIST" panel,
                    // clear out any desiredSize set by the ResizingTool.
                    new go.Binding("desiredSize", "visible", function (v) {
                        return new go.Size(NaN, NaN);
                    }).ofObject("TABLE"),
                    // define the node's outer shape, which will surround the Table
                    D(go.Shape, "RoundedRectangle",
                        {fill: "#fff", stroke: "#ccc", strokeWidth: 0.5}),
                    D(go.Panel, "Vertical",
                        // this is the header for the whole node
                        D(go.Panel, "Auto",
                            {stretch: go.GraphObject.Horizontal},  // as wide as the whole node
                            D(go.Shape,
                                {fill: "#007acc", stroke: null}),
                            D(go.TextBlock,
                                {
                                    alignment: go.Spot.Center,
                                    margin: 4,
                                    font: "normal 10.5pt Arial, sans-serif",
                                    stroke: "#ffffff",
                                    textAlign: "center",
                                    background: "transparent"
                                },
                                new go.Binding("text", "desp"))),
                        // this Panel holds a Panel for each item object in the itemArray;
                        // each item Panel is defined by the itemTemplate to be a TableRow in this Table
                        D(go.Panel, "Table",
                            {
                                name: "TABLE",
                                padding: 2,
                                minSize: new go.Size(100, 10),
                                defaultStretch: go.GraphObject.Horizontal,
                                itemTemplate: itemTempl
                            },
                            new go.Binding("itemArray", "items"),
                            new go.Binding("edmType", "edmType")
                        )  // end Table Panel of items
                    ),  // end Vertical Panel
                    makePort("T", go.Spot.Top, false, true),
                    makePort("B", go.Spot.Bottom, true, false)
                ));

                myDiagram.linkTemplate =
                    D(go.Link,  // the whole link panel
                        {
                            routing: go.Link.AvoidsNodes,
                            curve: go.Link.JumpOver,
                            corner: 5, toShortLength: 4,
                            relinkableFrom: true,
                            relinkableTo: true,
                            reshapable: true,
                            resegmentable: true,
                            // mouse-overs subtly highlight links:
                            mouseEnter: function (e, link) {
                                link.findObject("HIGHLIGHT").stroke = "#808080";
                            },
                            mouseLeave: function (e, link) {
                                link.findObject("HIGHLIGHT").stroke = "transparent";
                            }
                        },
                        new go.Binding("points").makeTwoWay(),
                        D(go.Shape,  // the highlight shape, normally transparent
                            {isPanelMain: true, stroke: "transparent", name: "HIGHLIGHT"}),
                        D(go.Shape,  // the link path shape
                            {isPanelMain: true, stroke: "#808080", strokeWidth: 2}),
                        D(go.Shape,  // the arrowhead
                            {toArrow: "standard", stroke: null, fill: "#808080"}),
                        D(go.Panel, "Auto",  // the link label, normally not visible
                            {visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
                            new go.Binding("visible", "visible").makeTwoWay(),
                            D(go.Shape, "RoundedRectangle",  // the label shape
                                {fill: "#F8F8F8", stroke: null}),
                            D(go.TextBlock, "Yes",  // the label
                                {
                                    textAlign: "center",
                                    font: "normal 10.5pt arial, sans-serif",
                                    stroke: "#333333",
                                    editable: true,
                                    isMultiline: false,
                                    background: '#ffffff'
                                },
                                new go.Binding("text", "desp").makeTwoWay())
                        )
                    );

                myDiagram.groupTemplate = D(go.Group, "Vertical", groupStyle(),
                    D(go.Panel, "Vertical", // title above Placeholder
                        D(go.Panel, "Horizontal",  // button next to TextBlock
                            {stretch: go.GraphObject.Horizontal, background: "#fff"},
                            D("SubGraphExpanderButton",
                                {alignment: go.Spot.Right, margin: 2}),
                            D(go.TextBlock,
                                {
                                    alignment: go.Spot.Left,
                                    editable: false,
                                    isMultiline: false,
                                    margin: 2,
                                    font: "bold 18px sans-serif",
                                    opacity: 0.75,
                                    stroke: "#404040"
                                },
                                new go.Binding("text", "desp"))
                        ),  // end Horizontal Panel
                        D(go.Placeholder,
                            {padding: 5, alignment: go.Spot.TopLeft})
                    )
                );

                myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
                myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

                myDiagram.addDiagramListener("ExternalObjectsDropped", function (e) {
                    var newnode = myDiagram.selection.first();
                    if (newnode.linksConnected.count === 0) {
                        // when the selection is dropped but not hooked up to the rest of the graph, delete it
                        /*myDiagram.commandHandler.deleteSelection();*/
                    }
                });

                myDiagram.addDiagramListener("ClipboardPasted", function (e) {
                    var data = e.diagram.selection.first().data;
                    if (data.type === 'var') {
                        data.belongTo = entrance.foreignID;
                        data.id = getVarID(entrance.foreignID, data.namespace, data.name, data.inFunction);
                        if (!codeListDB({id: data.id}).first()) {
                            varDB.insert(data);
                            codeListDB.insert(data);
                            refreshVarCodeList();
                        }
                    } else {
                        changeSelection(e.diagram, true);
                    }
                });

                myDiagram.addDiagramListener('ChangedSelection', function (e) {
                    changeSelection(myDiagram);
                });
                myDiagram.addDiagramListener('LinkDrawn', function (e) {
                    var label = e.subject.findObject("LABEL"), link = e.subject;
                    if (label !== null) {
                        if (link.fromNode.data.category === "if") {
                            label.visible = true;
                            if (link.fromNode.findLinksOutOf().count > 1) {
                                if (link.fromNode.findLinksOutOf().first().data.desp !== 'No') {
                                    myDiagram.model.setDataProperty(link.data, 'desp', 'No');
                                }

                            }
                        }
                    }
                    syncToCode(myDiagram);
                    if (link.toNode.findLinksInto().count > 2 || link.fromNode.findLinksOutOf().count > 2) {
                        myDiagram.remove(e.subject);
                    }
                    if (link.toNode.data.category === 'start') {
                        myDiagram.remove(e.subject);
                    }
                    if (link.fromNode.data.category === 'start' && link.fromNode.findLinksOutOf().count > 1) {
                        myDiagram.remove(e.subject);
                    }
                });

                myDiagram.addDiagramListener('SelectionDeleted', function (e) {
                    syncToCode(myDiagram);
                });
                myDiagram.addDiagramListener('SelectionMoved', function (e) {
                    syncToCode(myDiagram, true);
                });

                myDiagram.findLayer("Tool").opacity = 0.5;

                //jsEditor

                // $('a[href=#myEditor]').on('shown', function () {
                // 	myJsEditor.layout();
                // });
            }

            function initCodeList() {
                var statementList = [{
                        desp: '判断语句（if）',
                        statementType: 'if',
                        category: 'if',
                        option: [
                            {
                                name: 'ifValue',
                                type: 'comboTree',
                                desp: '判断条件'
                            }
                        ]
                    }].concat(CODE_LIST),
                    appInterfaces = (dataModel.get('awebApi') || widgetConfig).appInterfaces || widgetConfig.appInterfaces,
                    appInterfacesConst = (dataModel.get('awebApi') || widgetConfig).appInterfacesConst || widgetConfig.appInterfacesConst,
                    treeAppInterfaces;

                function addID(codeList, type) {
                    if (!codeList.hasID) {
                        $.each(codeList, function (index, value) {
                            if ((!value.children) && value.desp && !value.isAddButton) {

                                value.type = value.type || type;
                                value.desp = value.name ? (value.desp + '（' + value.name + '）') : value.desp;
                                value.text = value.text || value.desp;


                                switch (value.type) {
                                    case 'aweb':
                                        value.id = value.code;
                                        value.category = 'aweb';
                                        break;

                                    case 'jsType':
                                        value.id = value.toAddOptionType;
                                        break;

                                    case 'rawCode':
                                        value.id = value.type;
                                        value.category = 'aweb';
                                        break;

                                    case 'statement':
                                        value.id = value.statementType;
                                        break;

                                    case 'const':
                                        value.id = value.name;
                                        break;

                                    default:
                                        value.id = app.getUID();
                                        break;
                                }

                                codeListDB.insert(value);
                            } else if (value.children) {
                                addID(value.children, type);
                            }

                        });
                        codeList.hasID = true;
                    }
                }

                appInterfaces && appInterfaces.map(function (item) {
                    var code = ['app'];
                    item.children.map(function (subItem) {
                        code.push(subItem.name);
                        switch (subItem.belongTo) {
                            case 'class':
                                subItem.children = subItem.cInterfaces;
                                subItem.children.map(function (interfaceData) {
                                    interfaceData.code = code.concat([interfaceData.name]).join('.') + '()';
                                    interfaceData.option = (interfaceData.params && interfaceParamsToOption(interfaceData.params));
                                });
                                break;

                            default:
                                subItem.code = code.join('.') + '()';
                                subItem.option = (subItem.params && interfaceParamsToOption(subItem.params));
                                break;
                        }
                        code.pop();
                    });
                });
                appInterfaces.unshift({
                    id: "",
                    desp: ""
                });

                if (!appInterfacesConst.hasID) {
                    appInterfacesConst.map(function (item) {
                        item.desp = item.category;
                        item.children = item.valueArray.map(function (iitem, index) {
                            return {
                                desp: item.despArray[index],
                                name: iitem
                            }
                        });
                    });
                }


                codeListDB.insert(varDB().get());

                addID(appInterfaces, 'aweb');
                addID(statementList, 'statement');

                treeAppInterfaces = AUI.traverseTree(appInterfaces);
                dataModel.set('treeAppInterfaces', treeAppInterfaces);

                new searchTabTree($(OVERVIEW_CONST.CODE.AWEB.CTN_SELECTOR), enableDrag).refresh('treeAppInterfaces');

                searchTree($(OVERVIEW_CONST.CODE.STATEMENT.SEARCH_SELECTOR, $overViewPanel), $(OVERVIEW_CONST.CODE.STATEMENT.CTN_SELECTOR))
                    .refresh(statementList, 'graph');

                addID(jsTypeCodeList, 'jsType');
                addID(appInterfacesConst, 'const');

                //将awebCodeList和varList添加到codeTree
                appInterfaces.shift();


                codeTreeDB({text: 'aweb接口'}).update({children: appInterfaces});
                codeTreeDB({text: 'Javascript类型'}).update({children: jsTypeCodeList});
                codeTreeDB({text: '常量'}).update({children: appInterfacesConst});

                var $customContextMenu = $([
                    '<ul style="z-index:10000" class="aui-dropdown-menu" role="menu" aria-labelledby="dropdownMenu">',
                    '<li><a data-event-role="modify_var" class="menu-click-a" tabindex="-1" href="#">修改变量</a></li>',
                    '<li><a data-event-role="delete_var" class="menu-click-a" tabindex="-1" href="#">删除变量</a></li>',
                    '</ul>'
                ].join(''));

                $customContextMenu.appendTo('body');


                //添加变量事件
                $codeFrame.off('.overview').on({
                    'click.overview': function (e) {
                        var el = e.target || e.srcElement,
                            $el = $(el).closest('[data-event-role]'),
                            namespace = $el.attr('data-var-namespace'),
                            namespaceDesp = $el.attr('data-var-namespace-desp'),
                            inFunction = $el.attr('data-in-function') || '',
                            inFunctionDesp = $el.attr('data-in-function-desp') || '',
                            data = {},
                            option = [{
                                    name: 'desp',
                                    desp: '中文名',
                                    type: 'string_input'
                                },
                                {
                                    name: 'name',
                                    desp: '英文名',
                                    type: 'string_input'
                                },

                                {
                                    name: 'assignValue',
                                    desp: '赋值',
                                    type: 'comboTree'
                                }
                            ],
                            codeID,
                            codeItem,
                            $currentNode;

                        switch ($el.attr('data-event-role')) {
                            case 'add_var':
                                $currentNode = $el.closest('.aui-search-tree-node');

                                app.popover({
                                    $elem: $el,
                                    title: '添加  ' + namespaceDesp + inFunctionDesp,
                                    content: '',
                                    width: '50%',
                                    height: '65%',
                                    placement: 'auto bottom',
                                    init: function () {
                                        var $popoverBody = $(this).find('.aweb-popover-body');

                                        var content = '<div id="inspector"></div>';

                                        $popoverBody.append(content);

                                        base.baseConfig('inspector', data, JSON.parse(JSON.stringify(option)));
                                    },
                                    confirmHandler: function () {
                                        var varOption = base.getCleanedOption(data, option),
                                            codeItem,
                                            codeID;

                                        if (varOption.name){
                                            if(/[^\w\.\/]/ig.test(varOption.name)){
                                                app.alert('必须填写变量英文名！');
                                                return false;
                                            }else{
                                                codeID = getVarID(entrance.foreignID, namespace, varOption.name, inFunction);

                                                if (codeListDB({id: codeID}).first()) {
                                                    app.alert('不能声明两个同名同域变量！');
                                                    return false;
                                                } else {
                                                    varOption.value = optionKeyToObj(varOption, 'assignValue');
                                                    varOption.type = 'var';
                                                    varOption.id = codeID;
                                                    varOption.desp = varOption.desp || varOption.name;
                                                    varOption.text = varOption.desp;
                                                    varOption.namespace = namespace;

                                                    varOption.option = [{
                                                        name: 'assignValue',
                                                        type: 'comboTree',
                                                        desp: '赋值'
                                                    }];
                                                    varOption.belongTo = entrance.foreignID;
                                                    varOption.inFunction = inFunction;
                                                    varOption.category = 'var' + '_' + namespace;

                                                    //update model
                                                    codeListDB.insert(varOption);
                                                    varDB.insert(varOption);

                                                    refreshVarCodeList();

                                                }

                                            }

                                        } else {
                                            // app.alert('必须填写变量英文名！');
                                            return false;
                                        }
                                    }
                                });


                                break;

                            //修改变量
                            case 'auiVarEdit':
                                codeID = $el.parent().prev().attr('data-code-id');
                                codeItem = codeListDB({id: codeID}).first();
                                app.popover({
                                    $elem: $el,
                                    title: '修改变量  ' + codeItem.desp,
                                    content: '',
                                    width: '50%',
                                    height: '65%',
                                    placement: 'auto bottom',
                                    init: function () {
                                        var $popoverBody = $(this).find('.aweb-popover-body'),
                                            content = '<div id="inspector"></div>';

                                        data = JSON.parse(JSON.stringify(codeItem));

                                        $popoverBody.append(content);
                                        base.baseConfig('inspector', data, JSON.parse(JSON.stringify(option)));

                                    },
                                    confirmHandler: function () {
                                        var varOption = base.getCleanedOption(data, option);
                                        if (varOption.name) {
                                            varOption.value = optionKeyToObj(varOption, 'assignValue');
                                            varOption.desp = varOption.desp||varOption.name;
                                            varOption.text = varOption.desp;
                                            varOption.id = getVarID(entrance.foreignID, namespace, varOption.name, inFunction);

                                        //    debugger;
                                            varOption.___id && (delete varOption.___id);
                                            varOption.___s && (delete varOption.___s);

                                            //因为需要更新主键，所以需要这样子做
                                         //   varOption=JSON.parse(JSON.stringify(varOption));
                                            varDB({id: codeID}).update(JSON.parse(JSON.stringify(varOption)));
                                            codeListDB({id: codeID}).update(JSON.parse(JSON.stringify(varOption)));
                                            // varDB({id: codeID}).remove();
                                            // varDB.insert(varOption);
                                            //
                                            // codeListDB({id: codeID}).remove();
                                            // codeListDB.insert(varOption);

                                            changeEdmVar(codeID, varOption.id);

                                            refreshVarCodeList();
                                            //update model
                                            // app.performance.shortDelay(function () {
                                            //
                                            // })



                                        } else {
                                            // app.alert('必须填写变量英文名！');
                                            return false;
                                        }
                                    }
                                });
                                break;

                            //删除变量
                            case 'auiVarDel':
                                codeID = $el.parent().prev().attr('data-code-id');
                                codeItem = codeListDB({id: codeID}).first();

                                app.modal({
                                    title: '删除变量',
                                    content: '确定删除变量？',
                                    confirmHandler: function () {
                                        //update model
                                        codeListDB({id: codeID}).remove();
                                        varDB({id: codeID}).remove();

                                        changeEdmVar(codeID, '');


                                        refreshVarCodeList();
                                    },
                                    isDialog: true,
                                    isLargeModal: false
                                });

                                break;
                        }
                    }
                });
            }

            return function (_entrance, $el) {
                var codeItem, obj;
                $overViewPanel = $el;
                $codeList = $('#auiOverviewCodeList', $overViewPanel);
                $entranceConfigCtn = $(entranceConfigSelector, $overViewPanel);
                $contextInspector = $('#myInspector');
                varDB = dataModel.get("var");

                // code = obj.code;
                // entrance = obj.entrance;
                entrance = _entrance;
                AUI.currentOverviewEntrance = entrance;
                // oEntrance = AUI[upperCaseFirstLetter(entrance.applyTo)]([entrance.foreignID]);

                refreshWidgetCodeList(entrance.foreignID);
                jsTypeCodeList.hasID = false;
                // appInterfaces.hasID=false;
                initCodeList();
                if (!created) {
                    if (!myDiagram) {
                        initRightSide();
                    }
                    $('a[href="#entranceConfigCtn"]').tab('show');
                    created = true;
                }

                varDB().each(function (varItem, index) {
                    var oldID = varItem.id;

                    //更新varID
                    varItem.id = getVarID(varItem.belongTo, varItem.namespace, varItem.name, varItem.inFunction);

                    //更新edm的绑定
                    if (oldID !== varItem.id) {
                        changeEdmVar(oldID, varItem.id);
                    }
                });

                $entranceConfigCtn.empty();

                codeItem = dataModel.get('code')({foreignID: entrance.foreignID}).first();
                if (codeItem) {
                    category = codeItem.category;//
                }

                function updateCategory(obj) {
                    var handlerObj = {}, oldCategory = category;
                    handlerObj[CONST.EVENT.HANDLER.REDIRECT] = true;
                    handlerObj[CONST.EVENT.HANDLER.SUB] = true;
                    handlerObj[CONST.EVENT.HANDLER.AJAX] = true;

                    if (obj.eventID) {
                        if ((obj.deps === 'ajax' && !obj.order) || obj.handler in handlerObj) {
                            category = 'ajaxFirst';
                        } else if (obj.deps === 'ajax' && obj.order === 'api') {
                            category = 'apiFirst';
                        } else if (obj.deps !== 'ajax') {
                            category = 'custom';
                        }
                    } else if (obj.lifecycleID) {
                        if (obj.isEDM === true && !obj.order) {
                            category = 'ajaxFirst';//
                        } else if (obj.isEDM === true && obj.order === 'api') {
                            category = 'apiFirst';
                        } else if (obj.code === 'echo') {
                            category = 'echo';
                        } else if (obj.isEDM !== true) {
                            category = 'custom';
                        }

                    }
                    return !(oldCategory === category);

                }


                if (entrance) {
                    switch (entrance.applyTo) {
                        case CONST.STEP.APPLY_TO.EVENT:
                            actionRole = 'listener';
                            oEntrance = eventUtil[upperCaseFirstLetter(entrance.applyTo)]([entrance.foreignID]);
                            obj = oEntrance[0].data;

                            updateCategory(obj);


                            $('a[href=' + entranceConfigSelector + ']').attr('title', '事件');

                            eventUtil.eventConfigureSingle(entrance.widgetID, obj, $entranceConfigCtn, function (option) {
                                var categoryChanged, option = option || {};

                                oEntrance = eventUtil[upperCaseFirstLetter(entrance.applyTo)]([entrance.foreignID]);
                                categoryChanged = updateCategory(oEntrance[0].data);

                                updateRightSide(((option.isTrigger && categoryChanged) || (!option.isTrigger && !categoryChanged && category in {
                                        custom: true,
                                        ajaxFirst: true,
                                        apiFirst: true
                                    })) && (option && option.type === 'handler'));

                            });
                            break;

                        case CONST.STEP.APPLY_TO.LIFECYCLE:
                            oEntrance = lifecycleUtil[upperCaseFirstLetter(entrance.applyTo)]([entrance.foreignID]);
                            obj = oEntrance[0].data;

                            updateCategory(obj);

                            $('a[href=' + entranceConfigSelector + ']').attr('title', '生命周期');

                            lifecycleUtil.lifecycleConfigSingle(entrance.widgetID, obj, $entranceConfigCtn, function (option) {

                                oEntrance = lifecycleUtil[upperCaseFirstLetter(entrance.applyTo)]([entrance.foreignID]);

                                updateCategory(oEntrance[0].data);
                                updateRightSide();
                            });

                            //得到action role
                            if (obj.spaAction === 'load') {
                                actionRole = obj.pageAction;
                            } else {
                                actionRole = obj.spaAction;
                            }

                            break;
                    }
                    entranceInstance = obj;
                }

                //updateRightSide();

                refreshVarCodeList();

                window.myDiagram = myDiagram;
                window.myJsEditor = myJsEditor;
            }
        })();

        return Overview;
    });
})();

