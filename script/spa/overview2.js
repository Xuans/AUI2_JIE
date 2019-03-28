(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", 'index', 'base', 'template', 'vue'], factory);
        }
        // global
        else {
            factory();
        }
    })(function ($, global, base, artTemplate, Vue) {
        "use strict";

        var
            widgetAttrIDMap = {},
            CONST = global.CONST,
            AUI = global.AUI,
            globalTree,
            currentOverview,
            golbalPreviewWindow,
            validateList = CONST.EDM.VALIDATE.LIST,
            localConst = {
                selector: {
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
                    },
                    JSTYPE: {
                        SEARCH_SELECTOR: '#auiOverviewJsTypeCodeSearch',
                        CTN_SELECTOR: '#auiOverviewJsTypeCodeList'
                    },
                    INTERFACECONST: {
                        SEARCH_SELECTOR: '#auiOverviewConstCodeSearch',
                        CTN_SELECTOR: '#auiOverviewConstCodeMenu'
                    }
                }
            },

            getVarID = function (AUI, name, params, foreignID) {
                var ret = [];
                if (params) {
                    switch (params.namespace) {
                        case 'domain':
                            ret = [name, params.namespace];
                            break;

                        case 'scope':
                            ret = [AUI.data.pageModule, AUI.data.pageName, name, params.namespace];
                            break;

                        case 'local':
                            ret = [foreignID, name, params.namespace, params.inFunction || ''];
                            break;
                    }
                }

                return ret.join('_');
            },

            transformWidgetKey = function (str, widgetID) {
                var id = 'auiCtx.variables.'+ getID(widgetID);

                str = str || '';
                return str.replace('##_var##',  id)
                    .replace('##' + widgetID + '_WID_var##', id)
                    .replace('_parseFunction_%%_WID_VAR%%',  id);
            },

            getID = function (widgetID, checkOnly) {
                var id = '';

                if (!(id = widgetAttrIDMap[widgetID]) && (widgetID = AUI.data.structure({
                        widgetID: widgetID
                    }).first())) {
                    widgetAttrIDMap[widgetID] = id = widgetID.attr.id;
                }

                return id;
            },

            overviewBridge = function () {
                var toCodeString = function (codeValue) {
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
                    },

                   
                    upperCaseFirstLetter = function (str) {
                        var arr = str.toLowerCase().split(''),
                            firstLetter = arr.shift();

                        return firstLetter.toUpperCase() + arr.join('');
                    },

                    getInterfaceID = function (value) {
                        var temp, bracketIndex;

                        temp = value.indexOf(';');
                        if (temp !== -1) {
                            value = value.substring(0, temp);
                        }

                        bracketIndex = value.indexOf('(');
                        if (bracketIndex !== -1) {
                            value = value.substr(0, bracketIndex);
                             value = value + '()';
                        }

                        return value.trim();
                    },

                    getNodeItem = function (nodesMap, codeItem, isVertialTree, foreignID) {
                        var nodeItem = {
                                nodeType: 'blank',
                                expression: codeItem.expression
                            },
                            nodeID, valueNodeID, key, tailID, tempItem;

                        if (codeItem) {
                            switch (codeItem.type) {
                                case 'function':
                                    nodeItem.nodeType = 'interface';
                                    nodeItem.interfaceID = getInterfaceID(codeItem.value);

                                    if (codeItem.params) {
                                        nodeItem.params = [];
                                        codeItem.params.map(function (param) {
                                            var nodeID = app.getUID(),
                                                valueNodeID = app.getUID();

                                            nodeItem.params.push(nodeID);

                                            nodesMap[nodeID] = {
                                                nodeType: 'var',
                                                tail: valueNodeID
                                            };

                                            nodesMap[valueNodeID] = getNodeItem(nodesMap, param, false, foreignID);
                                        });
                                    }
                                    break;

                                case 'anchor':
                                    nodeItem.nodeType = 'interface';

                                    switch (codeItem.value) {
                                        case 'sub':
                                        case 'window':
                                        case 'redirect':
                                        case 'popover':
                                            nodeItem.interfaceID = 'app.open()';
                                            break;

                                        case 'ajax':
                                            nodeItem.interfaceID = 'app.ajax()';
                                            break;

                                        default:
                                            nodeItem.interfaceID = codeItem.value;
                                    }
                                    break;

                                case 'variable':
                                    nodeItem.nodeType = 'var';
                                    nodeItem.varID = getVarID(AUI, codeItem.value.name, codeItem.value, foreignID);

                                    valueNodeID = app.getUID();
                                    nodeItem.tail = valueNodeID;

                                    nodesMap[valueNodeID] = getNodeItem(nodesMap, codeItem.value.value, false, foreignID);
                                    break;

                                case 'if':
                                    nodeItem.nodeType = 'if';

                                    nodeItem.conditions = [];

                                    nodeID = app.getUID();
                                    nodeItem.conditions.push(nodeID);

                                    tempItem = {
                                        nodeType: 'condition'
                                    };
                                    tempItem.body = getRootNodeID(nodesMap, codeItem.yesBody, false, foreignID, {fromCondition: nodeID});
                                    nodesMap[nodeID] = tempItem;

                                    nodeID = app.getUID();
                                    tempItem.condition = nodeID;
                                    nodesMap[nodeID] = getNodeItem(nodesMap, codeItem.condition, false, foreignID);

                                    nodeID = app.getUID();
                                    nodeItem.conditions.push(nodeID);

                                    tempItem = {
                                        nodeType: 'condition'
                                    };
                                    tempItem.body = getRootNodeID(nodesMap, codeItem.noBody, false, foreignID, {fromCondition: nodeID});                                                            
                                    nodesMap[nodeID] = tempItem;

                                    nodeID = app.getUID();
                                    tempItem.condition = nodeID;
                                    nodesMap[nodeID] = {
                                        nodeType: 'blank',
                                        hasNext: false
                                    };
                                    break;

                                case 'code':
                                    if (isVertialTree) {
                                        nodeItem.nodeType = 'code';
                                    } else {
                                        nodeItem.nodeType = 'value';
                                        nodeItem.paramObj = {
                                            type: 'code',
                                            desp: '原生代码'
                                        }
                                    }

                                    try {
                                        nodeItem.value = JSON.parse(codeItem.value);
                                        if (typeof nodeItem.value === 'object') {
                                            throw 'error';
                                        }
                                    } catch (e) {
                                        nodeItem.value = codeItem.value;
                                    }
                                    break;

                                case 'object':
                                    nodeItem.nodeType = 'value';
                                    nodeItem.params = [];
                                    if (codeItem.value) {
                                        for (key in codeItem.value) {
                                            if (codeItem.value[key].type) {
                                                nodeID = app.getUID();
                                                tailID = app.getUID();

                                                nodesMap[nodeID] = {
                                                    nodeType: 'var',
                                                    paramName: key,
                                                    tail: tailID
                                                };

                                                nodeItem.params.push(nodeID);
                                                nodesMap[tailID] = getNodeItem(nodesMap, codeItem.value[key], false, foreignID);
                                            }
                                        }
                                    }
                                    break;
                            }
                        }

                        return nodeItem;
                    },

                    getRootNodeID = function (nodesMap, codeArr, noAddPrev, foreignID, option) {
                        var nodeID, startNodeID = app.getUID();

                        if (codeArr && codeArr.length) {
                            codeArr.map(function (codeItem, index) {
                                var nodeItem;
                                if (index === 0) {
                                    nodeID = app.getUID();
                                    nodesMap[startNodeID] = getNodeItem(nodesMap, codeItem, true, foreignID);
                                    nodesMap[startNodeID].hasNext = true;
                                    if (codeArr[index + 1]) {
                                        nodesMap[startNodeID].next = nodeID;
                                    }
                                } else {
                                    nodesMap[nodeID] = getNodeItem(nodesMap, codeItem, true, foreignID);
                                    nodeItem = nodesMap[nodeID];
                                    nodeItem.hasNext = true;
                                    nodeItem.prev = nodeID;
                                    if (codeArr[index + 1]) {
                                        nodeID = app.getUID();
                                        nodeItem.next = nodeID;
                                    }
                                }
                            });
                        } else {
                            nodesMap[startNodeID] = {
                                nodeType: 'blank',
                                hasNext: true
                            }
                        }

                        $.extend(nodesMap[startNodeID], option);

                        if (noAddPrev) {
                            return startNodeID
                        } else {
                            nodeID = app.getUID();
                            nodesMap[startNodeID].prev = nodeID;
                            nodesMap[nodeID] = {
                                nodeType: 'blank',
                                next: startNodeID,
                                hasNext: true
                            };
                            return nodeID;
                        }
                    },

                    getEndNodeID = function (nodesMap, rootNodeID) {
                        var next = rootNodeID,
                            prevID, nodeItem;

                        while (next) {
                            if (nodeItem = nodesMap[next]) {
                                prevID = next;
                                next = nodeItem.next;
                            }
                        }

                        return prevID;
                    },

                    getIndex = function (array, filter) {

                        var i, length, key, index = -1,
                            hasDiff = false;
                        if (array) {
                            length = array.length;
                            for (i = 0; i < length; i++) {
                                for (key in filter) {
                                    if (array[i][key] !== filter[key]) {
                                        hasDiff = true;
                                    }
                                }
                                if (!hasDiff) {
                                    return i;
                                }
                            }

                        }

                        return index;

                    },

                    bridge = function () {
                        var code = {},
                            codeTaffy = AUI.data.code,
                            varList = {},
                            varTaffy = AUI.data.var;

                        codeTaffy && codeTaffy().each(function (codeObj) {
                            var codeModel = codeObj.codeModel,
                                foreignID = codeObj.foreignID,
                                oInstanceData,
                                params,
                                paramID,
                                nodeID,
                                tailID,
                                endNodeID,
                                dataIndex,
                                successIndex,
                                startDataArray,
                                startSuccessArray,
                                nodesMap = {},
                                startNodeID, varList = {};

                            if (foreignID === 'DBB5C8E046BA68306598-AFAF') debugger;

                            if (codeModel) {
                                switch (codeObj.category) {
                                    case 'custom':
                                        startNodeID = getRootNodeID(nodesMap, codeModel.startCustom, false, foreignID);
                                        break;

                                    case 'ajaxFirst':
                                    case 'apiFirst':
                                        startDataArray = codeModel.startData;
                                        startSuccessArray = codeModel.startSuccess;

                                        dataIndex = getIndex(startDataArray, {
                                            type: 'anchor',
                                            value: 'requestData'
                                        });
                                        successIndex = getIndex(startSuccessArray, {
                                            type: 'anchor',
                                            value: 'responseData'
                                        });

                                        startNodeID = getRootNodeID(nodesMap, [{
                                            type: 'function',
                                            value: 'app.ajax()'
                                        }], false, foreignID);

                                        oInstanceData = AUI[upperCaseFirstLetter(codeObj.applyTo)]([codeObj.foreignID])[0].data || {};

                                        //为ajax node添加params
                                        nodeID = nodesMap[startNodeID].next;
                                        nodesMap[nodeID].params = params = [];

                                        nodeID = app.getUID();
                                        params.push(nodeID);

                                        tailID = app.getUID();
                                        nodesMap[nodeID] = {
                                            nodeType: 'var',
                                            tail: tailID
                                        };
                                        params = [];
                                        nodesMap[tailID] = {
                                            nodeType: 'value',
                                            params: params,
                                        };

                                        paramID = app.getUID();
                                        params.push(paramID);

                                        each(validateList, function (item) {
                                            var paramName = item.name,
                                                value = oInstanceData[paramName],
                                                paramID = app.getUID(),
                                                tailID = app.getUID();

                                            switch (item.name) {
                                                case 'ajaxTimeout':
                                                    paramName = 'timeout';
                                                    break;
                                                case 'ajaxType':
                                                    paramName = 'type';
                                                    break;
                                                case 'ajaxShelter':
                                                    paramName = 'shelter';
                                                    break;
                                            }

                                            params.push(paramID);

                                            nodesMap[paramID] = {
                                                nodeType: 'var',
                                                paramName: paramName,
                                                tailType: 'value',
                                                tail: tailID
                                            };

                                            nodesMap[tailID] = {
                                                nodeType: 'value',
                                                value: value
                                            };
                                            nodesMap[tailID].head = paramID;

                                        });

                                        if (startDataArray && startSuccessArray) {
                                            tailID = getRootNodeID(nodesMap, startDataArray.slice(0, dataIndex), true, foreignID);
                                            nodesMap[paramID] = {
                                                nodeType: 'var',
                                                paramName: 'data',
                                                tailType: 'request',
                                                tail: tailID
                                            };

                                            nodesMap[tailID].head = paramID;
                                            nodesMap[tailID].fromVar = paramID;
                                            endNodeID = getEndNodeID(nodesMap, tailID);

                                            nodeID = app.getUID();
                                            nodesMap[endNodeID].next = nodeID;
                                            nodesMap[nodeID] = {
                                                nodeType: 'request',
                                                hasNext: true,
                                                edmID: oInstanceData.requestID || oInstanceData.edmID,
                                                next: getRootNodeID(nodesMap, startDataArray.slice(dataIndex + 1, startDataArray.length - 1), true, foreignID)
                                            };
                                            paramID = app.getUID();
                                            params.push(paramID);

                                            tailID = getRootNodeID(nodesMap, startSuccessArray.slice(0, successIndex === -1 ? 0 : successIndex), true, foreignID);
                                            nodesMap[paramID] = {
                                                nodeType: 'var',
                                                paramName: 'success',
                                                tailType: 'response',
                                                tail: tailID
                                            };
                                            nodesMap[tailID].head = paramID;
                                            nodesMap[tailID].fromVar = paramID;
                                            endNodeID = getEndNodeID(nodesMap, tailID);

                                            nodeID = app.getUID();
                                            nodesMap[endNodeID].next = nodeID;
                                            nodesMap[nodeID] = {
                                                nodeType: 'response',
                                                hasNext: true,
                                                edmID: oInstanceData.responseID,
                                                next: getRootNodeID(nodesMap, startSuccessArray.slice(successIndex + 1), true, foreignID)
                                            };
                                        }


                                        break;

                                    case 'echo':

                                        break;
                                }
                            }

                            code[codeObj.foreignID] = {
                                nodesMap: nodesMap,
                                startNodeID: startNodeID,
                                varList: varList,
                                codeModel: codeModel,
                                oldCodeModel: codeModel,
                                applyTo: codeObj.applyTo,
                                category: codeObj.category,
                                foreignID: codeObj.foreignID
                            }
                        });

                        varTaffy && varTaffy().each(function (varObj) {
                            var codeTree;
                            switch (varObj.namespace) {
                                case 'local':
                                    codeTree = code[varObj.belongTo];
                                    if (codeTree) {
                                        if (!codeTree.varList) {
                                            codeTree.varList = {};
                                        }
                                        codeTree.varList[varObj.id] = {
                                            name: varObj.name,
                                            value: varObj.value,
                                            inFunction: varObj.inFunciton
                                        }
                                    }
                                    break;

                                case 'domain':
                                case 'scope':
                                    varList[varObj.id] = {
                                        name: varObj.name,
                                        value: varObj.value,
                                        namespace: varObj.namespace
                                    };
                                    break;
                            }
                        });

                        return {
                            code: code,
                            varList: varList
                        };
                    };

                return bridge();
            },

            each = function (arr, callback) {
                var i, len, item;

                if (Array.isArray(arr)) {
                    for (i = arr.length; item = arr[--i];) {
                        callback(item, i);
                    }
                }
            },

            upperCaseFirstLetter = function (str) {
                var arr = str.toLowerCase().split(''),
                    firstLetter = arr.shift();

                return firstLetter.toUpperCase() + arr.join('');
            },

            toCodeString = function (codeValue) {
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
            },

            //option = {foreignID: ''}
            Overview = function (option) {
                var $body = $('body');

                this.AUI = global.AUI;
                this.$panel = $(CONST.PAGE.OVERVIEW.CTN, $body);
                // this.$mask = $('.aui-overview-mask', $body);
                // this.$runBtn = $('#auiOverviewRunBtn', this.$panel);
                // this.$closeBtn = $('#auiOverviewCloseBtn', this.$panel);

                this.option = option;
                this.bridge();

                this.appendSwitchMenu();

                //为overview实例赋值codeTree和varList
                this.data(option.foreignID);

                this.updateCategory();

                this.singleConfigure(option);

                this.refreshInterface();

                this.refreshConst();

                this.refreshVar();

                this.refreshStatement();

                this.renderCodeTree();

                this.refreshJsType();

                this.listener();


                this.showPreviewWindow();

                this.enableDrag();
            };

        Overview.prototype = {
            constructor: Overview,

            showPreviewWindow: function () {
                var $div = $('#myOverviewDiv');

                if (!golbalPreviewWindow) {
                    golbalPreviewWindow = global.AUI.vscode.create($div, {
                        value: '',
                        language: 'javascript',
                        readOnly: true
                    });
                }
            },

            bridge: function () {
                var data = global.AUI.data;

                //逻辑概览兼容
                if (!data.overview && data.code && data.code.TAFFY && (data.code().get().length !== 0)) {
                    data.overview = overviewBridge();
                    data.code = app.taffy([]);
                    data.var = app.taffy([]);
                }
            },

            setPreviewCode: function (code) {
                golbalPreviewWindow.setValue(code);
            },

            updateCategory: function () {
                var handlerObj = {},
                    category,

                    obj = this.AUI[upperCaseFirstLetter(this.option.applyTo)]([this.option.foreignID]);

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
                        category = 'ajaxFirst';
                    } else if (obj.isEDM === true && obj.order === 'api') {
                        category = 'apiFirst';
                    } else if (obj.code === 'echo') {
                        category = 'echo';
                    } else if (obj.isEDM !== true) {
                        category = 'custom';
                    }
                }

                this.category = category;
            },

            appendSwitchMenu: function () {
                var $switchMenu = $(
                    '<ul style="z-index:10000" class="aui-dropdown-menu aui-overview-switch-menu" aria-labelledby="dropdownMenu">' +
                    '<li><a data-event-role="interface" class="menu-click-a" tabindex="-1" href="#">接口</a></li>' +
                    '<li><a data-event-role="default" class="menu-click-a" tabindex="-1" href="#">默认配置</a></li>' +
                    '<li><a data-event-role="request" class="menu-click-a" tabindex="-1" href="#">传输字段</a></li>' +
                    '<li><a data-event-role="response" class="menu-click-a" tabindex="-1" href="#">返回字段</a></li>' +
                    // '<li><a data-event-role="rawCode" class="menu-click-a" tabindex="-1" href="#">原生代码</a></li>' +
                    '</ul>'
                );

                $('body').append($switchMenu);
                $switchMenu.hide();

                this.$switchMenu = $switchMenu;
            },

            saveToDataModel: function () {
                var context = this,
                    overviewData = context.AUI.data.overview,
                    startNodeID = context.startNodeID,
                    codeModel,
                    codeTree = context.getCodeTree(startNodeID),
                    codeItem,
                    codeParams,
                    i, len,
                    nodesMap = context.getNodesMap(true);

                if (!nodesMap[startNodeID]) {
                    startNodeID = undefined;
                }

                if ( /* codeTree && codeTree.length && codeTree[0].code === 'app.ajax()' */ false) {
                    // codeModel = {};
                    // codeItem = codeTree[0];
                    // codeParams = codeItem.params[0].value.params;

                    // for (i=0,len=codeParams.length; i<len;i++) {
                    //   codeItem = codeParams[i];
                    //   if (codeItem.paramName === 'data') {
                    //     codeModel.startData = codeItem.value;
                    //   }

                    //   if (codeItem.paramName === 'success') {
                    //     codeModel.startSuccess = codeItem.value;
                    //   }
                    // }
                } else {
                    codeModel = {
                        startCustom: codeTree
                    };
                }

                if (!codeTree || (codeTree && !codeTree.length)) {
                    codeModel = overviewData.code[context.option.foreignID] && overviewData.code[context.option.foreignID].oldCodeModel;
                }

                overviewData.code[context.option.foreignID] = {
                    codeModel: codeModel,

                    foreignID: context.option.foreignID,

                    applyTo: context.option.applyTo,

                    category: context.category,

                    nodesMap: nodesMap,

                    startNodeID: startNodeID,

                    varList: context.varListMap
                };

                //console.log(overviewData.code[context.option.foreignID]);

                overviewData.varList = context.globalVarListMap;
            },

            getNodesMap: function (cleanVersion) {
                var ret = {},
                    nodesMap = JSON.parse(JSON.stringify(this.nodesMap)),
                    key, nodeItem, startNodeID = this.startNodeID;

                if (cleanVersion) {
                    this.iterateNodes(startNodeID, nodesMap, function (nodeItem, nodeID) {
                        if (nodeItem.active !== false) {
                            delete nodeItem.edmConfig;
                            delete nodeItem.paramObj;
                        }
                        ret[nodeID] = nodeItem;
                    });
                    return ret;
                } else {
                    return nodesMap;
                }

            },

            getNode: function (nodeID) {
                var nodeItem = this.nodesMap[nodeID];
                if (nodeItem) {
                    this.lastGetNode = JSON.parse(JSON.stringify(nodeItem));
                    return this.lastGetNode;
                } else {
                    return false;
                }
            },

            nextNode: function () {
                var nodeItem, nodeID, nodesMap = this.nodesMap;

                if (nodeItem = this.lastGetNode) {
                    if (nodeID = nodeItem.next) {
                        if (nodeItem = nodesMap[nodeID]) {
                            this.lastGetNode = JSON.parse(JSON.stringify(nodeItem));
                            return this.lastGetNode;
                        }
                    }
                }

                return false;
            },

            prevNode: function () {
                var nodeItem, nodeID, nodesMap = this.nodesMap;

                if (nodeItem = this.lastGetNode) {
                    if (nodeID = nodeItem.prev) {
                        if (nodeItem = nodesMap[nodeID]) {
                            this.lastGetNode = JSON.parse(JSON.stringify(nodeItem));
                            return this.lastGetNode;
                        }
                    }
                }

                return false;
            },

            singleConfigure: function (option) {
                var instance, AUI = this.AUI,
                    entranceConfigSelector = '#entranceConfigCtn',
                    $entranceConfigTab = $('a[href=' + entranceConfigSelector + ']'),
                    $entranceConfigCtn = $(entranceConfigSelector, this.$panel);

                $entranceConfigCtn.empty();

                switch (option.applyTo) {
                    case CONST.STEP.APPLY_TO.EVENT:
                        instance = AUI.Event([option.foreignID]);

                        $entranceConfigTab.text('事件');

                        AUI.eventConfigureSingle(option.widgetID, instance[0].data, $entranceConfigCtn);
                        break;

                    case CONST.STEP.APPLY_TO.LIFECYCLE:
                        instance = AUI.Lifecycle([option.foreignID]);

                        $entranceConfigTab.text('生命周期');

                        AUI.lifecycleConfigSingle(option.widgetID, instance[0].data, $entranceConfigCtn);
                        break;
                }
            },

            data: function (foreignID) {
                var AUI = this.AUI,
                    overviewData = AUI.data.overview,
                    codeData, option = this.option;

                if (!overviewData) {
                    overviewData = AUI.data.overview = {
                        code: {},
                        varList: {}
                    };
                    // overviewData = AUI.data.overview = bridge(AUI);
                    this.varListMap = {};
                }
                if (codeData = overviewData.code[foreignID]) {
                    this.varListMap = codeData.varList;
                    this.nodesMap = JSON.parse(JSON.stringify(codeData.nodesMap));
                    this.startNodeID = codeData.startNodeID;
                } else {
                    this.varListMap = {};
                }

                //debug
                window.codeListMap = this.codeListMap = {};
                window.varListMap = this.varListMap;
                window.codeComboTree = this.codeComboTree = {};
                this.varListArr = [];
                this.globalVarListArr = [];
                this.globalVarListMap = overviewData.varList;

                this.executeStack = [];
            },

            show: function () {
                // var AUI = this.AUI,
                //     $mask = this.$mask,
                //     $overViewPanel = this.$panel;

                // $mask.removeClass('hide');
                //  AUI.zoomIn($overViewPanel);
                //app.shelter.upperZIndex(1054, 1050, false);
            },

            hide: function () {
                // var AUI = this.AUI,
                //     $mask = this.$mask,
                //     $overViewPanel = this.$panel;

                // AUI.zoomOut($overViewPanel);
                // app.shelter.lowerZIndex();
                //$mask.addClass('hide');
            },

            getCodeObj: function (nodeID) {
                var codeObj = {},
                    tail, nodeParams, varItem, nodesMap = this.nodesMap,
                    context = this,
                    codeListMap = this.codeListMap,
                    varID,
                    nodeItem = nodesMap[nodeID],
                    codeItem, interfaceID,
                    conditions = [],
                    conditionItem,
                    condition,
                    tempObj,
                    tempType, paramObj,
                    and, or,
                    varListMap = this.varListMap,
                    globalVarListMap = this.globalVarListMap;

                nodeItem = JSON.parse(JSON.stringify(nodeItem));

                if (nodeItem && nodeItem.active === false) {
                    return false;
                } else if (nodeItem) {
                    codeObj.expression = nodeItem.expression;
                    switch (nodeItem.nodeType) {
                        case 'interface':
                            codeObj.type = 'function';

                            if (interfaceID = nodeItem.interfaceID) {
                                if (codeItem = codeListMap[interfaceID]) {
                                    codeObj.value = codeItem.code;
                                } else {
                                    codeObj.value = interfaceID;
                                }
                            }

                            if (tail = nodeItem.tail) {
                                codeObj.params = [context.getCodeObj(tail)];
                            }

                            if (nodeParams = nodeItem.params) {
                                codeObj.params = nodeParams.map(function (nodeID) {
                                    var codeObj = context.getCodeObj(nodeID);
                                    return $.extend(codeObj.value, {expression: codeObj.expression});
                                });
                            }
                            break;

                        case 'var':
                            codeObj.type = 'var';
                            codeObj.paramName = nodeItem.paramName;

                            if (varID = nodeItem.varID) {
                                codeObj.type = 'variable';
                                codeObj.value = {};
                                if (varItem = varListMap[varID]) {
                                    codeObj.value.name = varItem.name;
                                    codeObj.value.namespace = 'local';
                                } else if (varItem = globalVarListMap[varID]) {
                                    codeObj.value.name = varItem.name;
                                    codeObj.value.namespace = varItem.namespace;
                                }
                            }

                            if (tail = nodeItem.tail) {
                                if (nodeItem.tailType in {
                                        request: true,
                                        response: true
                                    }) {
                                    if (tempObj = codeObj.value) {
                                        //do nothing
                                    } else {
                                        tempObj = codeObj;
                                    }
                                    tempObj.value = {
                                        edmType: nodeItem.tailType,
                                        foreignID: context.option.foreignID,
                                        type: 'codeTree',
                                        edmID: nodeItem.edmID,
                                        body: context.getCodeTree(tail)
                                    };
                                } else {
                                    if (codeObj.value) {
                                        codeObj.value.value = context.getCodeObj(tail);
                                    } else {
                                        codeObj.value = context.getCodeObj(tail);
                                    }
                                }
                            }
                            break;

                        case 'if':
                            codeObj.type = 'if';
                            if (nodeItem.conditions) {
                                conditions = nodeItem.conditions.map(function (conditionID) {
                                    return context.getCodeObj(conditionID)
                                });
                            }
                            codeObj.conditions = conditions;
                            break;

                        case 'condition':
                            codeObj.type = 'condition';
                            if (nodeItem.condition) {
                                codeObj.condition = [context.getCodeObj(nodeItem.condition)];

                                if (conditionItem = nodesMap[nodeItem.condition]) {
                                    and = conditionItem.and;
                                    while (and && nodesMap[and] && nodesMap[and].nodeType !== 'blank') {
                                        codeObj.condition.push($.extend(context.getCodeObj(and), {
                                            prefix: 'and'
                                        }));
                                        and = nodesMap[and].and;
                                    }

                                    or = conditionItem.or;
                                    while (or && nodesMap[or] && nodesMap[or].nodeType !== 'blank') {

                                        codeObj.condition.push($.extend(context.getCodeObj(or), {
                                            prefix: 'or'
                                        }));

                                        and = nodesMap[or].and;
                                        while (and && nodesMap[and] && nodesMap[and].nodeType !== 'blank') {
                                            //且条件
                                            codeObj.condition.push($.extend(context.getCodeObj(and), {
                                                prefix: 'and'
                                            }));
                                            and = nodesMap[and].and;
                                        }

                                        or = nodesMap[or].or;
                                    }
                                }
                            }

                            if (nodeItem.body) {
                                codeObj.body = context.getCodeTree(nodeItem.body);
                            }
                            break;

                        case 'for':
                            codeObj.type = 'for';

                            if (condition = nodeItem.s1) {
                                codeObj.s1 = [context.getCodeObj(condition)];
                                conditionItem = nodesMap[condition];

                                and = conditionItem.and;
                                while (and && nodesMap[and] && nodesMap[and].nodeType !== 'blank') {
                                    codeObj.s1.push($.extend(context.getCodeObj(and), {
                                        prefix: ','
                                    }));
                                    and = nodesMap[and].and;
                                }

                            }

                            if (nodeItem.s2) {
                                codeObj.s2 = context.getCodeObj(nodeItem.s2);
                            }

                            if (nodeItem.s3) {
                                codeObj.s3 = context.getCodeObj(nodeItem.s3);
                            }

                            if (nodeItem.body) {
                                codeObj.body = context.getCodeTree(nodeItem.body);
                            }
                            break;

                        case 'switch':
                            codeObj.type = 'switch';

                            if (nodeItem.switch) {
                                codeObj.condition = context.getCodeObj(nodeItem.switch);
                            }

                            if (nodeItem.conditions) {
                                codeObj.conditions = nodeItem.conditions.map(function (conditionID) {
                                    return context.getCodeObj(conditionID);
                                });
                            }
                            break;

                        case 'request':
                        case 'response':
                            codeObj.type = nodeItem.nodeType;
                            codeObj.edmID = nodeItem.edmID;
                            break;

                        case 'blank':
                            return false;
                            break;

                        case 'code':
                            codeObj.type = 'code';
                            codeObj.value = nodeItem.value;
                            if (codeObj.value === undefined) {
                                return false;
                            }
                            break;

                        case 'statement':
                            codeObj.type = 'code';
                            codeObj.value = nodeItem.desp;
                            break;

                        case 'const':
                            codeObj.type = 'code';
                            codeObj.value = nodeItem.constID;
                            break;

                        case 'value':
                            codeObj.type = 'code';
                            if (paramObj = nodeItem.paramObj) {
                                tempType = paramObj.type;
                                switch (tempType) {
                                    case 'object':
                                    case 'array':
                                        codeObj.type = tempType;
                                        if (nodeParams = nodeItem.params) {
                                            codeObj.params = nodeParams.map(function (nodeID) {
                                                var codeObj = context.getCodeObj(nodeID),
                                                    codeValue;
                                                if (codeValue = codeObj.value) {
                                                    if (codeValue.type === 'code' && codeValue.value === 'undefined') {
                                                        return false;
                                                    } else {
                                                        return $.extend(codeValue, {
                                                            paramName: codeObj.paramName,
                                                            expression: codeObj.expression
                                                        });
                                                    }
                                                } else {
                                                    return codeValue
                                                }
                                            });
                                        } else {
                                            codeObj.type = 'code';
                                            codeObj.value = 'undefined';
                                        }
                                        break;

                                    case 'function':
                                    case 'code':
                                    case 'handler':
                                        codeObj.value = nodeItem.value;
                                        break;

                                    default:
                                        codeObj.value = JSON.stringify(nodeItem.value);
                                        if (codeObj.value === undefined) {
                                            return false;
                                        }
                                        break;
                                }
                            }
                            break;
                    }
                }

                return codeObj;
            },

            getCodeTree: function (startNodeID, single) {
                var startNodeID = startNodeID || this.startNodeID,
                    nodesMap = this.nodesMap,
                    startNode = nodesMap[startNodeID],
                    codeTree = [],
                    nextNodeID, nextNode, codeItem;

                if (startNode) {
                    if (!single) {
                        nextNodeID = startNode.next;
                        startNode = nodesMap[nextNodeID];
                    } else {
                        nextNodeID = startNodeID;
                    }

                    while (nextNodeID) {
                        if (codeItem = this.getCodeObj(nextNodeID)) {
                            codeTree.push(codeItem);
                        }
                        nextNodeID = nodesMap[nextNodeID].next;
                    }
                }

                if (!startNode || startNode.nodeType === 'blank') {
                    return false;
                }

                return codeTree;
            },

            removeNode: function (nodeID, nodesMap) {
                var nodeItem = nodesMap[nodeID],
                    keys = {
                        next: true,
                        tail: true,
                        body: true,
                        condition: true,
                        s1: true,
                        s2: true,
                        s3: true,
                        and: true,
                        or: true,
                        switch: true
                    },
                    key;

                for (key in keys) {
                    if (nodeItem && nodeItem[key]) {
                        this.removeNode(nodeItem[key], nodesMap);
                    }
                }

                if (nodeItem && nodeItem.params) {
                    this.deleteParams(nodeItem);
                }

                Vue.delete(nodesMap, nodeID);
            },

            hasBlankCondition: function (nodesMap, nodeItemID) {
                var nodeItem = nodesMap[nodeItemID],
                    lastCondition, conditions = nodeItem.conditions,
                    conditionItem;

                if (!conditions || !conditions.length) {
                    return false;
                } else {
                    lastCondition = conditions[conditions.length - 1];
                    if (conditionItem = nodesMap[lastCondition]) {
                        conditionItem = conditionItem.condition;

                        if (conditionItem = nodesMap[conditionItem]) {
                            if (conditionItem.nodeType === 'blank') {
                                return true;
                            }
                        }
                    } else {
                        conditions.pop();
                        return false;
                    }
                }
            },

            updateForStatement: function (nodesMap, nodeItemID) {
                var nodeItem = nodesMap[nodeItemID],
                    s1, s2, s3, body, context = this;

                if (!context.hasNode(nodesMap, 's1', nodeItem)) {
                    context.addRootNode('s1', nodeItem, false, false, {
                        isForInit: true
                    });
                }

                if (!context.hasNode(nodesMap, 's2', nodeItem)) {
                    context.addRootNode('s2', nodeItem, false, false);
                }

                if (!context.hasNode(nodesMap, 's3', nodeItem)) {
                    context.addRootNode('s3', nodeItem, false, false);
                }

                if (!context.hasNode(nodesMap, 'body', nodeItem)) {
                    context.addRootNode('body', nodeItem, true, false, {
                        fromCondition: nodeItemID
                    });
                }
            },

            addCondition: function (nodesMap, nodeItemID, nodeItem, nodeID) {
                var conditionID, bodyID, nodeID, isCondition = false,
                    nodeItem = nodesMap[nodeItemID],
                    nodeType = nodeItem.nodeType;

                if (nodeType === 'if') {
                    isCondition = true;
                }

                if (!nodeItem.conditions) {
                    Vue.set(nodeItem, 'conditions', []);
                }

                if (!this.hasBlankCondition(nodesMap, nodeItemID)) {
                    conditionID = app.getUID();
                    bodyID = app.getUID();
                    nodeID = app.getUID();

                    nodeItem.conditions.push(nodeID);

                    Vue.set(nodesMap, nodeID, {
                        nodeType: 'condition',
                        condition: conditionID,
                        body: bodyID
                    });

                    Vue.set(nodesMap, conditionID, {
                        nodeType: 'blank',
                        hasNext: false,
                        isCondition: isCondition,
                        fromStatement: nodeItemID,
                    });

                    Vue.set(nodesMap, bodyID, {
                        nodeType: 'blank',
                        hasNext: true,
                        next: false,
                        fromCondition: nodeID
                    });
                }
            },

            addParam: function (nodesMap, paramObj, nodeItem, paramID, visible) {
                var active = true;
                if (visible) {
                    //do nothing
                } else {
                    // active = false;
                }

                if (paramObj) {
                    var hasParam = paramID;
                    paramID = paramID || app.getUID();

                    Vue.set(nodesMap, paramID, {
                        nodeType: 'var',
                        hasNext: false,
                        next: false,
                        active: active,
                        paramObj: JSON.parse(JSON.stringify(paramObj)),
                        paramName: paramObj.name
                    });

                    this.updateNodeItem(nodesMap[paramID], nodesMap, undefined, paramID, active);

                    if (!hasParam) {
                        if (!nodeItem.params) {
                            Vue.set(nodeItem, 'params', []);
                        }

                        nodeItem.params.push(paramID);
                    }

                    return paramID;
                } else {
                    Vue.set(nodeItem, 'params', []);
                }
            },

            addTail: function (nodesMap, tailType, nodeItem, nodeID) {
                var tail = app.getUID(),
                    hasNext = false,
                    fromVar,
                    tailItem, context = this,
                    next, params, prev;

                switch (tailType) {
                    case 'request':
                    case 'response':
                        hasNext = true;
                        fromVar = nodeID;
                        break;

                    default:
                        hasNext = false;
                }

                if ((nodeItem.tail && !nodesMap[nodeItem.tail]) || !nodeItem.tail) {
                    Vue.set(nodeItem, 'tail', JSON.parse(JSON.stringify(tail)));
                    Vue.set(nodesMap, tail, {
                        nodeType: tailType,
                        hasNext: hasNext,
                        next: false,
                        fromVar: fromVar,
                        head: nodeID,
                    });
                    tailItem = nodesMap[tail];
                } else {
                    tailItem = nodesMap[nodeItem.tail];
                    tailItem.nodeType = tailType;
                    tailItem.hasNext = tailItem.hasNext || hasNext;
                    if (!tailItem.hasNext) {
                        tailItem.next = false;
                    }
                    tailItem.head = nodeID;
                    tailItem.fromVar = fromVar;
                }
                context.updateNodeItem(tailItem, nodesMap, undefined, nodeItem.tail);
            },

            addBlank: function (nodesMap, nodeID, hasNext, option) {
                Vue.set(nodesMap, nodeID, $.extend({
                    nodeType: 'blank',
                    next: false,
                    hasNext: hasNext
                }, option || {}));

                return nodesMap[nodeID];
            },

            beforeRenderVue: function (varList) {
                var codeListMap = this.codeListMap,
                    context = this,
                    nodesMap = this.nodesMap,
                    codeComboTree = this.codeComboTree,

                    toggleNext = function(nodeItem, hideBlank) {
                        var next, nextItem;
                        if (next = nodeItem.next) {
                            if ((nextItem = nodesMap[next]) && (nextItem.nodeType === 'blank')) {
                                if (context.canHideBlank(nodesMap, next, nextItem)/* next !== context.startNodeID && context.hasNode(nodesMap, 'next', nextItem) */) {
                                    // console.log(JSON.parse(JSON.stringify(nextItem)));
                                    Vue.set(nextItem, 'hideBlank', hideBlank);
                                    return next;
                                }
                            }
                        }
                    },

                    enableHover = function(nodeItem, $el){
                        if (nodeItem.hasNext) {
                            $el.droppable({
                                over: function(){
                                    toggleNext(nodeItem, false);
                                },
                                out: function(){
                                    toggleNext(nodeItem, true);
                                },
                                drop: function(event, ui){
                                    var blankNodeID;

                                    blankNodeID = toggleNext(nodeItem, true);

                                    if (blankNodeID) {
                                        drop(event, ui, blankNodeID);
                                    }
                                }
                            });
                        }
                    },

                    drop = function (event, ui, blankNodeID) {
                            var
                                nodeObj = {},
                                draggableUI = ui.draggable,
                                nodeID = draggableUI.attr('data-code-id'),
                                nodeType = draggableUI.attr('data-node-type') || 'interface';

                            //动态修改nodeType
                            //根据情况有if,var,interface
                            nodeObj.nodeType = nodeType;
                            // Vue.set(nodeItem, 'nodeType', nodeType);

                            switch (nodeType) {
                                case 'statement':
                                    nodeObj.desp = draggableUI.attr('data-desp');
                                    break;

                                case 'number':
                                case 'string':
                                case 'boolean':
                                case 'code':
                                    nodeObj.desp = draggableUI.attr('data-desp');
                                    nodeObj.nodeType = 'value',
                                        nodeObj.paramObj = {
                                            type: nodeType,
                                            desp: nodeObj.desp
                                        };
                                    break;

                                case 'const':
                                    nodeObj.constID = nodeID;
                                    break;
                            }

                            //有interfaceID, varID
                            if (codeListMap[nodeID]) {
                                // Vue.set(nodeItem, 'interfaceID', nodeID);
                                nodeObj.interfaceID = nodeID;
                            } else if (context.varListMap[nodeID] || context.globalVarListMap[nodeID]) {
                                // Vue.set(nodeItem, 'varID', nodeID);
                                nodeObj.varID = nodeID;
                            }

                            context.addNode(blankNodeID, nodeObj, varList);
                    };

                //注册指令
                Vue.directive('overviewBlank', function (el, binding) {
                    var $el = $(el),
                        bindingValue = binding.value;

                    $el.droppable({
                        hoverClass: 'aui-overview-node-blank-droppable',
                        tolerance: 'pointer',
                        drop: function (event, ui) {
                            drop(event, ui, bindingValue.nodeID);
                        }
                    })
                });

                Vue.directive('overviewInterface', function (el, binding) {
                    var $el = $(el),
                        bindingValue = binding.value,
                        nodeItem = bindingValue.nodeItem,
                        varID, constID,
                        name = bindingValue.name,
                        codeItem, paramObj,
                        varItem, codeParams,
                        templateObj = {};

                    switch (nodeItem.nodeType) {
                        case 'interface':
                            codeItem = codeListMap[nodeItem.interfaceID];
                            templateObj = {
                                dataType: (codeItem && codeItem.dataType) || '',
                                desp: (codeItem && codeItem.desp) || nodeItem.interfaceID,
                                code: codeItem && codeItem.code
                            };

                            if (codeItem && codeItem.widgetID) {
                                debugger;
                                templateObj.code = transformWidgetKey(templateObj.code, codeItem.widgetID);
                            }                    
                            break;

                        case 'var':
                            if (varID = nodeItem.varID) {
                                varItem = context.varListMap[varID] || context.globalVarListMap[varID];

                                if (varItem) {
                                    templateObj = {
                                        dataType: false,
                                        desp: varItem.name
                                    }
                                }

                            } else {
                                paramObj = nodeItem.paramObj;
                                templateObj = {
                                    dataType: paramObj && paramObj.type,
                                    desp: paramObj && paramObj.desp
                                }
                            }
                            break;

                        case 'const':
                            if (constID = nodeItem.constID) {
                                if (constID in context.constListMap) {
                                    templateObj = {
                                        dataType: 'const',
                                        desp: context.constListMap[constID].desp
                                    }
                                }
                            }
                            break;
                    }

                    switch (templateObj.dataType) {
                        case 'handler':
                        case 'function':

                            if (!nodeItem.expression) {
                                Vue.set(nodeItem, 'expression', '##_VALUE##');
                            }
                        break;
                    }

                    if (!templateObj.desp) {
                        $el.empty();
                    } else {
                        $el.empty().append(artTemplate('overviewInterfaceTemplate', templateObj));
                    }

                    enableHover(nodeItem, $el);
                });

                Vue.directive('overviewEdm', function (el, binding) {
                    var $el = $(el),
                        bindingValue = binding.value,
                        nodeItem = bindingValue.nodeItem;

                    switch (nodeItem.nodeType) {
                        case 'request':

                            break;

                        case 'response':

                            break;
                    }

                    $el.append(nodeItem.nodeType + 'directive');
                });

                Vue.directive('overviewPrefix', function (el, binding) {
                    var $el = $(el),
                        bindingValue = binding.value,
                        nodeItem = bindingValue.nodeItem;

                    $el.text(nodeItem.prefix);
                });

                Vue.directive('input', {
                    inserted: function (el, binding) {
                        var $input = $(el),
                            editor, cache,
                            bindingValue = binding.value,

                            optionItem = bindingValue.option,
                            itemValue = bindingValue.value,
                            obj = bindingValue.obj,
                            array = bindingValue.array,
                            name = bindingValue.name,
                            objSelector = bindingValue.objSelector
                        /* ,

                         outerInstanceObj = baseObj */
                        ;

                        switch (optionItem.inputType) {
                            case 'comboTree':
                                (function (obj, array, value) {
                                    var treeObj, oldValue = value,
                                        i,
                                        getAttr = function (array) {
                                            var arr = $.extend([], array),
                                                i = 0,
                                                param;

                                            while (param = arr[i]) {
                                                param.dataType = param.type.toString();
                                                switch (param.type) {
                                                    case 'object':
                                                        if (param.children && $.isArray(param.children) && param.children.length > 0) {
                                                            param.attr = param.children;
                                                            arr = arr.concat(param.children);
                                                        } else {
                                                            param.type = 'comboTree';
                                                        }
                                                        break;
                                                    default:
                                                        param.type = 'comboTree';

                                                        delete param.defaultValue;
                                                        break;
                                                }
                                                i++;
                                            }
                                            return array;
                                        };

                                    $input.parent().children(':first').append(CONST.PARAMS_TYPE[optionItem.dataType] || CONST.PARAMS_TYPE._default);

                                    treeObj = context.AUI.treeSelectV2($input, {
                                        type: optionItem.dataType
                                    });

                                    $input.on('change.overview', function (e, triggerType) {
                                        var el = e.target || e.srcElement,
                                            $input = $(el),
                                            inputName = optionItem.name,
                                            desp = optionItem.desp,
                                            codeID = $input.val().replace(';', ''),
                                            toPushOptionArray = JSON.parse(JSON.stringify(array)),
                                            instanceObj = JSON.parse(JSON.stringify(obj)),
                                            toPushIndex,
                                            codeDataModel,
                                            argsWidgetConfig, expressionConfig,
                                            i, _i, item;

                                        for (i = toPushOptionArray.length - 1; i > -1; i--) {
                                            switch (toPushOptionArray[i].name) {
                                                case 'arguments_' + inputName:
                                                case 'jsValue_' + inputName:
                                                case 'expression_' + inputName:
                                                    toPushOptionArray.splice(i, 1);
                                                    break;
                                            }
                                        }

                                        if (codeDataModel = codeListMap[codeID]) {
                                            if ($.isArray(codeDataModel.params) && optionItem.dataType !== 'handler') {
                                                //更新widget，配置项包括函数传参属性
                                                argsWidgetConfig = {
                                                    name: 'arguments_' + inputName,
                                                    type: 'object',
                                                    desp: codeDataModel.desp + ' 函数传参',
                                                    attr: getAttr(JSON.parse(JSON.stringify(codeDataModel.params)))
                                                };
                                            }
                                            expressionConfig = {
                                                name: 'expression_' + inputName,
                                                type: 'string_simpleHtml',
                                                language: 'javascript',
                                                desp: '表达式' + '(' + desp + ')',
                                                defaultValue: '##_VALUE##',
                                                info: '占位符"##_VALUE##"表示"' + (codeDataModel.code || '')
                                                    .replace(/_parseFunction_/, '')
                                                    .replace(/##([^_]+)_WID_VAR##/i, function (match, widgetID) {
                                                        return 'auiCtx.variables.' + $AW(widgetID).attr().id;
                                                    })
                                                    .replace(/\([^\(]*\)/i, '') + '"'
                                            };
                                        } else {
                                            switch (codeID) {
                                                case 'string':
                                                case 'number':
                                                case 'code':
                                                case 'boolean':
                                                    argsWidgetConfig = {
                                                        name: 'jsValue_' + inputName,
                                                        type: codeID,
                                                        desp: '赋值内容' + '(' + desp + ')'
                                                    };

                                                    switch (codeID) {
                                                        case 'code':

                                                            argsWidgetConfig.type = 'string_simpleHtml';
                                                            argsWidgetConfig.language = 'javascript';
                                                            break;

                                                        case 'string':
                                                            argsWidgetConfig.type = 'string_select';
                                                            break;
                                                    }
                                                    break;
                                            }
                                        }

                                        if (argsWidgetConfig || expressionConfig) {
                                            $.each(toPushOptionArray, function (index, value) {
                                                if (value.name === inputName) {
                                                    toPushIndex = index + 1;
                                                }
                                            });

                                            if (argsWidgetConfig && expressionConfig) {
                                                toPushOptionArray.splice(toPushIndex, 0, expressionConfig, argsWidgetConfig);
                                            } else if (argsWidgetConfig) {
                                                toPushOptionArray.splice(toPushIndex, 0, argsWidgetConfig);
                                            } else if (expressionConfig) {
                                                toPushOptionArray.splice(toPushIndex, 0, expressionConfig);
                                            }
                                        }

                                        base.initWidget(toPushOptionArray);

                                        instanceObj = base.baseConfigInitInstance(instanceObj || {}, toPushOptionArray);

                                        instanceObj['dataType_' + inputName] = optionItem.dataType;
                                        for (i in instanceObj) {
                                            if (instanceObj[i] !== undefined) {
                                                Vue.set(obj, i, JSON.parse(JSON.stringify(instanceObj[i])));
                                                // base.updateObj(outerInstanceObj, objSelector + '---' + i, JSON.parse(JSON.stringify(instanceObj[i])));
                                            }
                                        }

                                        array.splice(0, array.length);
                                        for (_i = -1; item = toPushOptionArray[++_i];) {
                                            array.push(JSON.parse(JSON.stringify(item)));
                                        }


                                        if (triggerType !== 'initChange') {
                                            obj[name] = codeID;
                                        }
                                    });

                                    treeObj.refresh([{
                                            text: '无',
                                            id: 'nothing'
                                        },
                                        {
                                            text: 'javascript类型',
                                            children: codeComboTree.jsTypeTree
                                        },
                                        {
                                            text: '应用接口',
                                            children: codeComboTree.appInterfacesTree
                                        },
                                        {
                                            text: '组件接口',
                                            children: codeComboTree.widgetInterfacesTree
                                        },
                                        {
                                            text: '常量',
                                            children: codeComboTree.constTree
                                        }
                                    ]);
                                    treeObj.setSelectValue([oldValue]);
                                    // $input.trigger('change', 'initChange');
                                })(obj, array, itemValue);
                                break;

                            case 'tags_input':

                                break;
                        }
                    },

                    update: function (el, binding) {
                        var $input = $(el),
                            editor, cache,
                            bindingValue = binding.value,

                            option = bindingValue.option,
                            obj = bindingValue.obj,
                            value = bindingValue.value,
                            name = bindingValue.name,
                            modelSelector = bindingValue.modelSelector;

                        switch (option.inputType) {
                            case 'comboTree':

                                break;

                            case 'tags_input':

                                break;
                        }
                    }
                });
                
                Vue.directive('overviewHover', function(el, binding) {
                    var $el = $(el),
                        bindingValue = binding.value,
                        nodeItem = bindingValue.nodeItem;
                    
                     enableHover(nodeItem, $el);                    
                });
            },

            redo: function () {
                var executeStack = this.executeStack,
                    commandPointer = this.commandPointer,
                    command;

                if (command = executeStack[commandPointer + 1]) {
                    command.redo.apply(command);

                    this.commandPointer = commandPointer + 1;
                }
            },

            undo: function () {
                var executeStack = this.executeStack,
                    commandPointer = this.commandPointer,
                    command;

                if (command = executeStack[commandPointer]) {
                    //调用当前命令的undo
                    command.undo.apply(command);

                    this.commandPointer = commandPointer - 1;
                }
            },

            execute: function (option) {
                var executeStack = this.executeStack,
                    commandPointer = this.commandPointer;

                if (executeStack[commandPointer + 1]) {
                    executeStack.splice(commandPointer + 1);
                }

                executeStack.push(option);

                this.commandPointer = executeStack.length - 1;
            },

            hideNodes: function (rootNode, nodesMap) {
                this.showNodes(rootNode, nodesMap, true);
            },

            showNodes: function (rootNode, nodesMap, noShow) {
                // this.iterateNodes(rootNode, nodesMap, function (nodeItem, nodeID) {
                //     if (nodeID !== rootNode) {
                //         Vue.set(nodeItem, 'active', !noShow);
                //     }
                // })
            },

            iterateNodes: function (rootNodeID, nodesMap, callback) {
                var context = this,
                    next = rootNodeID,
                    conditions, i, len, loopItem,
                    body, conditionItem, and, or,
                    tail, nextItem, tailItem;

                while (next) {
                    if (nextItem = nodesMap[next]) {
                        switch (nextItem.nodeType) {
                            case 'if':
                                if (conditions = nextItem.conditions) {
                                    for (i = conditions.length; loopItem = conditions[--i];) {
                                        context.iterateNodes(loopItem, nodesMap, callback);
                                    }
                                }
                                break;

                            case 'switch':
                                context.iterateNodes(nextItem.switch, nodesMap, callback);

                                if (conditions = nextItem.conditions) {
                                    for (i = conditions.length; loopItem = conditions[--i];) {
                                        context.iterateNodes(loopItem, nodesMap, callback);
                                    }
                                }
                                break;

                            case 'for':
                                context.iterateNodes(nextItem.s1, nodesMap, callback);
                                context.iterateNodes(nextItem.s2, nodesMap, callback);
                                context.iterateNodes(nextItem.s3, nodesMap, callback);

                                if (body = nextItem.body) {
                                    context.iterateNodes(body, nodesMap, callback);
                                }

                                break;

                            case 'condition':

                                if (conditionItem = nodesMap[nextItem.condition]) {
                                    context.iterateNodes(nextItem.condition, nodesMap, callback);

                                    and = conditionItem.and;
                                    while (and && nodesMap[and] && nodesMap[and].nodeType !== 'blank') {
                                        context.iterateNodes(and, nodesMap, callback);
                                        and = nodesMap[and].and;
                                    }

                                    or = conditionItem.or;
                                    while (or && nodesMap[or] && nodesMap[or].nodeType !== 'blank') {
                                        context.iterateNodes(or, nodesMap, callback);

                                        and = nodesMap[or].and;
                                        while (and && nodesMap[and] && nodesMap[and].nodeType !== 'blank') {
                                            //且条件
                                            context.iterateNodes(and, nodesMap, callback);
                                            and = nodesMap[and].and;
                                        }

                                        or = nodesMap[or].or;
                                    }
                                }

                                if (body = nextItem.body) {
                                    context.iterateNodes(body, nodesMap, callback);
                                }
                                break;

                            default:
                                tail = nextItem.tail;
                                context.iterateNodes(tail, nodesMap, callback);
                                break;
                        }
                        if (nextItem.params) {
                            nextItem.params.map(function (paramID) {
                                context.iterateNodes(paramID, nodesMap, callback);
                            })
                        }
                        callback(nextItem, next);
                        next = nextItem.next;
                    }
                }
            },

            canDelete: function (nodeID) {
                var nodeItem;

                if (nodeID && (nodeItem = this.nodesMap[nodeID])) {
                    if (nodeItem.nodeType !== 'blank') {
                        if (nodeItem.nodeType === 'var' && !nodeItem.varID) {
                            return false;
                        } else if (nodeItem.active !== false) {
                            return true;
                        }
                    }
                }
            },

            deleteNode: function (nodeID) {
                var context = this,
                    nodesMap = context.nodesMap,
                    nodeItem, tail, next, oldNodeType;

                if (context.canDelete(nodeID)) {
                    nodeItem = nodesMap[nodeID];
                    oldNodeType = nodeItem.nodeType;

                    nodeItem.nodeType = 'blank';
                    context.hideNodes(nodeID, nodesMap);
                    context.updateNodeItem(nodeItem, nodesMap, undefined, nodeID);

                    context.execute({
                        oldNodeType: oldNodeType,
                        nodeItem: nodeItem,
                        context: context,
                        nodeID: nodeID,

                        undo: function () {
                            var oldNodeType = this.oldNodeType,
                                nodeItem = this.nodeItem,
                                nodeID = this.nodeID;

                            nodeItem.nodeType = oldNodeType;

                            this.context.updateNodeItem(nodeItem, this.context.nodesMap, undefined, nodeID);

                            this.context.showNodes(nodeID, this.context.nodesMap);
                        },

                        redo: function () {
                            var oldNodeType = this.oldNodeType,
                                nodeItem = this.nodeItem,
                                nodeID = this.nodeID;

                            nodeItem.nodeType = 'blank';
                            this.context.updateNodeItem(nodeItem, this.context.nodesMap, undefined, nodeID);

                            this.context.hideNodes(nodeID, this.context.nodesMap);
                        }
                    });
                }
            },

            addNode: function (blankNodeID, nodeObj, varList) {
                //nodeObj必须有nodeType
                var context = this,
                    nodesMap = context.nodesMap,
                    uid,
                    key,
                    oldNodeObj = {},
                    newTailType,
                    blankNode;

                if ((blankNode = nodesMap[blankNodeID]) && nodeObj.nodeType) {

                    for (key in nodeObj) {
                        oldNodeObj[key] = blankNode[key];
                        Vue.set(blankNode, key, nodeObj[key]);
                    }

                    context.updateNodeItem(blankNode, nodesMap, newTailType, blankNodeID, true, varList);

                    //添加下一个空节点
                    // if (nodeObj.hasNext) {
                    //   uid = app.getUID();
                    //   context.addBlank(nodesMap, uid, true);
                    //   Vue.set(nextNode, 'next', JSON.parse(JSON.stringify(uid)));
                    // }

                    context.execute({
                        newNodeType: nodeObj.nodeType,
                        nodeItem: blankNode,
                        context: context,
                        blankNodeID: blankNodeID,
                        nodesMap: nodesMap,
                        oldNodeObj: oldNodeObj,
                        newNodeObj: nodeObj,
                        newTailType: newTailType,

                        undo: function () {
                            var nodeItem = this.nodeItem,
                                nodeObj = this.oldNodeObj;

                            for (key in nodeObj) {
                                Vue.set(nodeItem, key, nodeObj[key]);
                            }

                            this.context.updateNodeItem(nodeItem, this.nodesMap, false, this.blankNodeID);
                        },

                        redo: function () {
                            var newNodeType = this.newNodeType,
                                nodeItem = this.nodeItem,
                                nodeObj = this.newNodeObj;
                            for (key in nodeObj) {
                                Vue.set(nodeItem, key, nodeObj[key]);
                            }
                            this.context.updateNodeItem(nodeItem, this.nodesMap, this.newTailType, this.blankNodeID);
                        }
                    });

                }
            },

            getEdmConfig: function (edmID, direction, AUI) {
                var names = [],
                    comments = [],
                    edmObj, edmList,
                    eachCallback = function (edm) {
                        if (!edm.uid) {
                            names.push(edm.alias);
                            comments.push(edm.comment);
                        }
                    };

                if (edmObj = AUI.data[direction]({
                        edmID: edmID
                    }).first()) {
                    if (edmList = edmObj.list) {
                        if (Array.isArray(edmList)) {
                            edmList.map(eachCallback);
                        } else {
                            edmList().each(eachCallback);
                        }


                        return {
                            names: names,
                            comments: comments
                        };
                    }
                }
            },

            tailChanged: function (nodesMap, nodeItem, tailType) {
                var tailItem, ret;
                if (!nodeItem.tail) {
                    ret = true;
                } else {
                    tailItem = nodesMap[nodeItem.tail];
                    if (!tailItem) {
                        ret = true;
                    } else {
                        if (tailItem.nodeType !== tailType || nodeItem.tailType !== tailType) {
                            ret = true;
                        }
                    }
                }

                if (ret) {
                    return tailType;
                }
            },

            getParams: function (nodeItem, nodesMap) {
                var tail = nodeItem.tail,
                    tailItem;
                if (nodeItem.nodeType === 'interface') {
                    return nodeItem.params;
                } else {
                    if (tail && (tailItem = nodesMap[tail])) {
                        if (tailItem.nodeType === 'value') {
                            Vue.set(tailItem, 'active', true);
                            return tailItem.params;
                        }
                    }
                }
            },

            renderCodeTree: function () {
                var codeListMap = this.codeListMap,
                    varListMap = this.varListMap,
                    context = this,
                    AUI = this.AUI,
                    startNodeID = this.startNodeID || app.getUID(),
                    nodesMap = this.nodesMap || {},
                    $switchMenu = this.$switchMenu,
                    varList = {};

                if (!this.startNodeID) {
                    nodesMap[startNodeID] = {
                        nodeType: 'blank',
                        next: false,
                        hasNext: true
                    };
                }

                this.startNodeID = this.lastGetNode = startNodeID;
                this.nodesMap = nodesMap;

                this.beforeRenderVue(varList);

                //添加节点以渲染dom
                $('#myDiagram', this.$panel).empty().append('<div id="codeTreeCtn"></div>');

                this.vueIns = new Vue({
                    el: '#codeTreeCtn',

                    template: '<overview :startNodeID="startNodeID" :nodesMap="nodesMap" :handler="handler"></overview>',

                    data: function () {
                        return {
                            startNodeID: startNodeID,

                            nodesMap: nodesMap,

                            varList: varList,

                            handler: {

                                toggleArrow: function ($event, nodeItem) {
                                    var target = $event.target,
                                        $el = $(target),
                                        params,
                                        $content = $el.parent().find('.aui-overview-collapse-content');

                                    $el.toggleClass('aui-jiantou-shang');
                                    $el.toggleClass('aui-jiantou-xia');

                                    $content.toggleClass('hide');

                                    //重新设置参数可见性，根据已配属性
                                    // if (params = context.getParams(nodeItem, nodesMap)) {
                                    //     params.map(function (paramID) {
                                    //         var paramItem = nodesMap[paramID],
                                    //             paramType, tail, tailItem;
                                    //         if (paramItem && (paramType = paramItem.paramObj.type)) {
                                    //             switch (paramType) {
                                    //                 case 'array':
                                    //                 case 'object':

                                    //                     break;

                                    //                 default:
                                    //                     if (tail = paramItem.tail) {
                                    //                         if ((tailItem = nodesMap[tail]) && (tailItem.nodeType === 'value')) {
                                    //                             if (tailItem.value || tailItem.value === false || tailItem.value === 0) {
                                    //                                 Vue.set(paramItem, 'active', true);
                                    //                             } else {
                                    //                                 Vue.set(paramItem, 'active', false);
                                    //                             }
                                    //                         } else {
                                    //                             Vue.set(paramItem, 'active', true);
                                    //                         }
                                    //                     }
                                    //                     break;
                                    //             }
                                    //         }
                                    //     })
                                    // }
                                },

                                updateNodeItem: function (nodeItem, nodesMap, nodeID) {
                                    context.updateNodeItem(nodeItem, nodesMap, undefined, nodeID, false, varList);
                                },

                                clickEdmSingle: function ($event, name, index, nodeItem) {
                                    var target = $event.target,
                                        $el = $(target);

                                    app.popover({
                                        $elem: $el,
                                        title: '配置edm',
                                        content: '',
                                        width: '50%',
                                        height: '65%',
                                        placement: 'auto bottom',
                                        init: function () {
                                            var $popoverBody = $(this).find('.aweb-popover-body'),
                                                $div = $('<div class="aui-config-ctn"></div>');

                                            $popoverBody.append($div);

                                            AUI.edmSingleConfig({
                                                edmID: nodeItem.edmID,
                                                varList: [],
                                                index: index,
                                                $context: $div,
                                                callback: function () {

                                                }
                                            });

                                        },
                                        confirmHandler: function () {}
                                    });

                                },

                                changeTailType: function ($event, option) {
                                    var nodeItem = option.nodeItem,
                                        oldTailType = context.getTailType(nodeItem, nodesMap),
                                        nodeID = option.nodeID,
                                        target = $event.target,
                                        $el = $(target),
                                        $body = $('body');

                                    $switchMenu.css(app.position($event, $el.closest('.aui-overview-node'), $el, -30, -20)).show();

                              
                                    $switchMenu.find('a[data-event-role]').removeClass('highlight');
                                    $switchMenu.find('a[data-event-role=' + nodeItem.highlightType + ']').addClass('highlight');

                                    $switchMenu.off('click.overview').on('click.overview', function (e) {
                                        var $el = $(e.target).closest('[data-event-role]'),
                                            eventRole = $el.attr('data-event-role'),
                                            tailType = eventRole;

                                        nodeItem.highlightType = tailType;

                                        switch (eventRole) {
                                            case 'interface':
                                                tailType = 'blank';
                                                break;
                                        }

                                        if (nodeItem.nodeType === 'var' && eventRole === 'default') {
                                            tailType = 'value';
                                        }

                                        if (tailType = context.tailChanged(nodesMap, nodeItem, tailType)) {
                                            if (nodeItem.tail) {
                                                context.removeNode(nodeItem.tail, nodesMap);
                                                delete nodeItem.tail;
                                            }

                                            nodeItem.tailType = tailType;
                                            context.updateNodeItem(nodeItem, nodesMap, tailType, nodeID, true);

                                            context.execute({
                                                newTailType: tailType,
                                                oldTailType: oldTailType,

                                                nodeItem: nodeItem,
                                                nodeID: nodeID,
                                                context: context,

                                                undo: function () {
                                                    var context = this.context;
                                                    context.updateNodeItem(this.nodeItem, context.nodesMap, this.oldTailType, this.nodeID, true);
                                                },

                                                redo: function () {
                                                    var context = this.context;
                                                    context.updateNodeItem(this.nodeItem, context.nodesMap, this.newTailType, this.nodeID, true);
                                                }
                                            });
                                        }

                                        $switchMenu.hide();
                                    });
                                },

                                editParam: function (option) {
                                    var nodeItem = option.nodeItem,
                                        params, editMode;

                                    if (params = context.getParams(nodeItem, nodesMap)) {
                                        editMode = (nodeItem.editMode === undefined ? true : nodeItem.editMode);
                                        params.map(function (paramID) {
                                            var paramItem = nodesMap[paramID],
                                                tail, tailItem, paramType;
                                            if (paramItem) {
                                                if (!editMode) {
                                                    //非编辑模式到编辑模式
                                                    Vue.set(paramItem, 'active', true);
                                                } else {
                                                    //编辑模式到非编辑模式
                                                    if (paramType = paramItem.paramObj && paramItem.paramObj.type) {
                                                        switch (paramType) {
                                                            case 'array':
                                                            case 'object':

                                                                break;

                                                            default:
                                                                if (tail = paramItem.tail) {
                                                                    if ((tailItem = nodesMap[tail]) && (tailItem.nodeType === 'value')) {
                                                                        if (tailItem.value === '' || tailItem.value === undefined) {
                                                                            Vue.set(paramItem, 'active', false);
                                                                        }
                                                                    }
                                                                }
                                                                break;
                                                        }
                                                        }
                                                }
                                            }
                                        });
                                        nodeItem.editMode = !editMode;
                                    }
                                },

                                edmConfig: function (event, option) {
                                    var $el = $(event.target),
                                        nodeItem = option.nodeItem,
                                        overviewOption = context.option,
                                        direction = nodeItem.nodeType;

                                    AUI.edmConfig({
                                        widgetID: overviewOption.widgetID,
                                        foreignID: overviewOption.foreignID,
                                        edmID: nodeItem.edmID,
                                        applyTo: overviewOption.applyTo,
                                        direction: direction,
                                        callback: function (keys, list, ids, edmID, eventID, widgetID) {
                                            var varItem;

                                            Vue.set(nodeItem, 'edmID', edmID);

                                            if (nodeItem.fromVar) {
                                                if (varItem = nodesMap[nodeItem.fromVar]) {
                                                    Vue.set(varItem, 'edmID', edmID);
                                                }
                                            }

                                            Vue.set(nodeItem, 'edmConfig', context.getEdmConfig(edmID, direction, AUI));
                                        }
                                    });
                                },

                                setCode: function (event, option) {
                                    var $el = $(event.target),
                                        nodeItem = option.nodeItem,
                                        editor;
                                    app.popover({
                                        $elem: $el,
                                        title: option.desp || JSON.parse(JSON.stringify((nodeItem.paramObj && nodeItem.paramObj.desp) || '')),
                                        content: '',
                                        width: '50%',
                                        height: '100%',
                                        init: function () {
                                            var $popoverBody = $(this).find('.aweb-popover-body'),
                                                value = nodeItem.value;

                                            if (option.isExpression) {
                                                value = nodeItem.expression || '##_VALUE##';
                                            }

                                            $popoverBody.css({
                                                'padding': '0'
                                            });
                                            editor = AUI.vscode.create(
                                                $popoverBody, {
                                                    value: value,
                                                    language: 'javascript'
                                                });

                                            $(this).on('screenChange', function () {
                                                editor.layout();
                                            })

                                        },
                                        confirmHandler: function () {
                                            if (!option.isExpression) {
                                                nodeItem.value = editor.getValue();
                                            } else {
                                                nodeItem.expression = editor.getValue();
                                            }
                                        }
                                    });
                                },

                                addParam: function (option) {
                                    var nodeItem = option.nodeItem,
                                        paramObj = nodeItem.paramObj;

                                    if (paramObj) {
                                        // paramObj.type为array
                                        paramObj = JSON.parse(JSON.stringify(paramObj));

                                        //对象数组
                                        paramObj.type = 'object';
                                        paramObj.desp = paramObj.desp + ((nodeItem.params && nodeItem.params.length) || '');

                                        context.addParam(nodesMap, paramObj, nodeItem);
                                    }
                                }
                            }
                        }
                    }
                })
            },

            getTailType: function (nodeItem, nodesMap) {
                var tail = nodeItem.tail,
                    tailItem = tail && nodesMap[tail],
                    tailType, temp;
                switch (nodeItem.nodeType) {
                    case 'interface':
                        if (nodeItem.params) {
                            tailType = 'default';
                        } else if ((tail && !tailItem) || !tail) {
                            if (temp = this.codeListMap[nodeItem.interfaceID]) {
                                tailType = temp.overviewType || 'default';
                            } else {
                                tailType = 'default';
                            }
                        } else if (tailItem) {
                            tailType = tailItem.nodeType;
                        }
                        break;

                    case 'var':
                        if (!nodeItem.varID) {
                            if (!tailItem) {
                                tailType = (nodeItem.paramObj && nodeItem.paramObj.overviewType) || 'value';
                            } else {
                                tailType = tailItem.nodeType;
                            }
                        }
                        break;
                }

                return tailType;
            },

            addRootNode: function (bodyKey, nodeItem, hasNext, forceAdd, option) {
                var nodeID = nodeItem[bodyKey],
                    nodesMap = this.nodesMap;

                if (!nodeID || (nodeID && !nodesMap[nodeID]) || forceAdd) {
                    nodeID = app.getUID();
                    Vue.set(nodeItem, bodyKey, nodeID);
                    this.addBlank(nodesMap, nodeID, hasNext, option);
                }

                return nodeID;
            },

            deleteParams: function (nodeItem) {
                var context = this,
                    nodeParams;

                if (nodeParams = nodeItem.params) {
                    nodeParams = JSON.parse(JSON.stringify(nodeParams));
                    nodeParams.map(function (nodeID) {
                        context.removeNode(nodeID, context.nodesMap);
                    });

                    Vue.delete(nodeItem, 'params');
                }
            },

            hideCondition: function (nodeItem, nodesMap) {
                var context = this;
                if (context.hasNode(nodesMap, 'and', nodeItem)) {
                    Vue.set(nodesMap[nodeItem.and], 'active', false);
                }

                if (context.hasNode(nodesMap, 'or', nodeItem) && !nodeItem.isAnd) {
                    Vue.set(nodesMap[nodeItem.or], 'active', false);
                }
            },

            setValue: function (nodeItem, paramObj) {
                var name = paramObj.name,
                    obj;

                switch (paramObj.type) {

                    case 'object':
                    case 'array':
                        //do nothing
                        break;

                    case 'handler':
                    case 'function':
                        paramObj.defaultValue = paramObj.defaultValue || 'function(){}';
                        if (paramObj.defaultValue === 'NULL') {
                            paramObj.defaultValue = 'null';
                        }
                        if (!nodeItem.value) {
                            nodeItem.value = paramObj.defaultValue;
                        }

                    default:
                        obj = base.baseConfigInitInstance({}, [paramObj], {});

                        if (nodeItem.value === undefined) {
                            Vue.set(nodeItem, 'value', obj[name]);
                        }
                        break;
                }

            },

            updateNodeItem: function (nodeItem, nodesMap, tailType, nodeItemID, allvisible, varList) {
                var codeListMap = this.codeListMap,
                    tailIsCode, nextID, nodeID,
                    AUI = this.AUI,
                    active, tempItem,
                    nodeItemNext, nodeItemPrev, nodeItemHead, nodeItemfromCondition = nodeItem.fromCondition,
                    paramObj, paramNodeItem, codeItem, codeParams, nodeParams, context = this,
                    tail, paramsMap = {};

                //  tailType = tailType || (nodeItem.tail && nodesMap[nodeItem.tail] && nodesMap[nodeItem.tail].nodeType);
                tailType = tailType || context.getTailType(nodeItem, nodesMap);

                if (!nodeItem.highlightType) {
                    nodeItem.highlightType = tailType;
                }

                if (tailType) {
                    switch (nodeItem.nodeType) {
                        case 'interface':
                            codeItem = codeListMap[nodeItem.interfaceID];

                            if (tailType === 'default') {
                                //删除tail
                                if (tail = nodeItem.tail) {
                                    this.removeNode(tail, nodesMap);
                                    nodeItem.tail = false;
                                }

                                //处理params
                                if (nodeParams = nodeItem.params) {
                                    //有params，判断添加nodesMap的paramObj
                                    if (codeParams = (codeItem && codeItem.params)) {
                                        codeParams.map(function (param, index) {
                                            var nodeID;
                                            if (nodeID = nodeParams[index]) {
                                                if (nodesMap[nodeID]) {
                                                    if (!nodesMap[nodeID].paramObj) {
                                                        Vue.set(nodesMap[nodeID], 'paramObj', param);
                                                    }
                                                } else {
                                                    context.addParam(nodesMap, param, nodeItem, nodeID, allvisible);
                                                }
                                            } else {
                                                context.addParam(nodesMap, param, nodeItem, undefined, allvisible);
                                            }
                                        })
                                    }
                                } else {
                                    //没有params，添加params
                                    if (codeParams = (codeItem && codeItem.params)) {
                                        codeParams.map(function (param, index) {
                                            context.addParam(nodesMap, param, nodeItem, undefined, allvisible);
                                        });
                                    } else {
                                        context.addParam(nodesMap, undefined, nodeItem, undefined, allvisible);
                                    }
                                }
                            } else {
                                //必定要有tail

                                //删除params
                                context.deleteParams(nodeItem);

                                context.addTail(nodesMap, tailType, nodeItem, nodeItemID);
                            }
                            break;

                        case 'var':

                            context.addTail(nodesMap, tailType, nodeItem, nodeItemID);

                            if (nodeItem.varID) {
                                //TODO:为自定义变量，paramObj不在nodeItem获取，而是保持引用varListMap中的paramObj
                                Vue.set(nodeItem, 'paramObj', false);

                            } else if (nodeItem.paramObj) {
                                paramObj = JSON.parse(JSON.stringify(nodeItem.paramObj));
                                active = nodeItem.active;

                                if (tailType === 'value') {
                                    nodeItem.highlightType = 'default';
                                }

                                //对value节点进行操作
                                nodeItem = nodesMap[nodeItem.tail];

                                if (tailType === 'value') {
                                    Vue.set(nodeItem, 'paramObj', paramObj);
                                    context.setValue(nodeItem, paramObj);

                                    switch (paramObj.type) {
                                        case 'object':
                                            if (nodeParams = nodeItem.params) {
                                                nodeParams = JSON.parse(JSON.stringify(nodeParams));

                                                nodeParams.map(function (nodeID) {
                                                    var nodeItem = nodesMap[nodeID];
                                                    paramsMap[nodeItem.paramName] = nodeItem;
                                                });
                                            }

                                            if (codeParams = paramObj.children) {
                                                codeParams = JSON.parse(JSON.stringify(codeParams));

                                                codeParams.map(function (paramObj) {
                                                    if (paramNodeItem = paramsMap[paramObj.name]) {
                                                        Vue.set(paramNodeItem, 'paramObj', JSON.parse(JSON.stringify(paramObj)));
                                                    } else {
                                                        context.addParam(nodesMap, paramObj, nodeItem, undefined, allvisible);
                                                    }
                                                });
                                            }
                                            break;

                                        case 'array':
                                            if (nodeParams = nodeItem.params) {
                                                nodeParams = JSON.parse(JSON.stringify(nodeParams));

                                                if (codeParams = paramObj.children) {
                                                    codeParams = JSON.parse(JSON.stringify(codeParams));

                                                    nodeParams.map(function (nodeID) {
                                                        var paramNodeItem = nodesMap[nodeID];
                                                        // paramNodeItem.paramObj.type = 'object';
                                                        Vue.set(paramNodeItem.paramObj, 'children', codeParams);
                                                    })
                                                }
                                            }
                                            break;

                                        default:
                                            context.deleteParams(nodeItem);
                                            break;
                                    }
                                } else {
                                    context.deleteParams(nodeItem);
                                }
                            }
                            break;
                    }
                }

                if (nodeItem.hasNext) {
                    nodeItemNext = nodeItem.next;
                    nodeItemPrev = nodeItem.prev;
                    nodeItemHead = nodeItem.head;
                    nodeItemfromCondition = nodeItem.fromCondition;
                    if (nodeItem.nodeType !== 'blank') {
                        // 头和尾各添加一个blank node
                        if (!context.hasNode(nodesMap, 'next', nodeItem) || nodesMap[nodeItem.next].nodeType !== 'blank') {
                            nodeID = context.addRootNode('next', nodeItem, true, true, {hideBlank: true});
                            nodesMap[nodeID].prev = nodeItemID;
                            nodesMap[nodeID].next = nodeItemNext;
                            if (nodeItemNext && nodesMap[nodeItemNext]) {
                                nodesMap[nodeItemNext].prev = nodeID;
                            }
                        }

                        if (!context.hasNode(nodesMap, 'prev', nodeItem) || nodesMap[nodeItem.prev].nodeType !== 'blank') {

                            nodeID = context.addRootNode('prev', nodeItem, true, true, {hideBlank: true});
                            if (nodeItemID === context.startNodeID) {
                                context.setStartNodeID(nodeID);
                                nodesMap[nodeID].hideBlank = false;
                            }

                            nodesMap[nodeID].next = nodeItemID;
                            nodesMap[nodeID].prev = nodeItemPrev;
                            if (nodeItemPrev && nodesMap[nodeItemPrev]) {
                                nodesMap[nodeItemPrev].next = nodeID;
                            }
                        }else {
                            nodeID = nodeItem.prev;
                        }

                        if (context.hasNode(nodesMap, 'head', nodeItem)) {
                            nodesMap[nodeItemHead].tail = nodeID;
                            nodeItem.head = false;
                            nodesMap[nodeID].head = nodeItemHead;
                            Vue.set(nodesMap[nodeID], 'hideBlank', false);
                        } 
                        
                        if (context.hasNode(nodesMap, 'fromCondition', nodeItem)) {
                            nodesMap[nodeItemfromCondition].body = nodeID;
                            nodeItem.fromCondition = false;
                            nodesMap[nodeID].fromCondition = nodeItemfromCondition;
                            Vue.set(nodesMap[nodeID], 'hideBlank', false);                            
                        }
                    } else {

                        if (context.canHideBlank(nodesMap, nodeItemID, nodeItem)) {
                            Vue.set(nodeItem, 'hideBlank', true);
                        } else {
                            Vue.set(nodeItem, 'hideBlank', false);                           
                        }

                        //删除头尾的blank node
                        if (context.hasNode(nodesMap, 'next', nodeItem) && nodesMap[nodeItemNext].nodeType === 'blank') {
                            nodeItem.next = nodesMap[nodeItemNext].next;
                            if (nodesMap[nodeItem.next]) {
                                nodesMap[nodeItem.next].prev = nodeItemID;
                            }
                            // Vue.delete(nodesMap, nodeItemNext);
                        }

                        if (context.hasNode(nodesMap, 'prev', nodeItem) && nodesMap[nodeItemPrev].nodeType === 'blank') {
                            if (nodeItemPrev === context.startNodeID) {
                                context.setStartNodeID(nodeItemID);
                                 Vue.set(nodeItem, 'hideBlank', false);
                                
                            }
                            if (context.hasNode(nodesMap, 'head', nodesMap[nodeItemPrev])) {
                                nodeItem.head = nodesMap[nodeItemPrev].head;
                                if (nodesMap[nodeItem.head]) {
                                    nodesMap[nodeItem.head].tail = nodeItemID;
                                }
                                Vue.set(nodeItem, 'hideBlank', false);
                                
                            } else if (context.hasNode(nodesMap, 'fromCondition', nodesMap[nodeItemPrev])) {
                                nodeItem.fromCondition = nodesMap[nodeItemPrev].fromCondition;
                                if (nodesMap[nodeItem.fromCondition]) {
                                    nodesMap[nodeItem.fromCondition].body = nodeItemID;
                                }
                                 Vue.set(nodeItem, 'hideBlank', false);                                
                            }


                            nodeItem.prev = nodesMap[nodeItemPrev].prev;
                            if (nodesMap[nodeItem.prev]) {
                                nodesMap[nodeItem.prev].next = nodeItemID;
                            }
                            // Vue.delete(nodesMap, nodeItemPrev);
                        }
                    }
                } else {
                    if (nodeItem.isCondition) {
                        if (nodeItem.nodeType !== 'blank') {
                            context.showCondition(nodeItem, nodesMap);
                        } else {
                            context.hideCondition(nodeItem, nodesMap);
                        }
                    }

                    if (nodeItem.isForInit) {
                        if (nodeItem.nodeType !== 'blank') {
                            if (context.hasNode(nodesMap, 'and', nodeItem)) {
                                Vue.set(nodesMap[nodeItem.and], 'active', true);
                            } else {
                                context.addRootNode('and', nodeItem, false, false, {
                                    isForInit: true,
                                    prefix: ','
                                });
                            }
                        } else {
                            if (context.hasNode(nodesMap, 'and', nodeItem)) {
                                Vue.set(nodesMap[nodeItem.and], 'active', false);
                            }
                        }
                    }

                    if (nodeItem.fromStatement) {
                        context.addCondition(nodesMap, nodeItem.fromStatement, nodeItem, nodeItemID);
                   
                    }
                }

                switch (nodeItem.nodeType) {
                    case 'switch':
                        if (!nodeItem.switch) {
                            context.addRootNode('switch', nodeItem, false, false, {});
                        }
                        //no break
                    case 'if':
                        context.addCondition(nodesMap, nodeItemID, nodeItem, nodeItemID);
                        break;

                    case 'var':
                        if (nodeItem.varID && varList) {
                            tempItem = varList[nodeItem.varID];
                            if (!tempItem) {
                                tempItem = {};
                                Vue.set(varList, nodeItem.varID, tempItem);
                            }
                            tempItem[nodeItemID] = true;
                        }

                        break;

                    case 'for':
                        context.updateForStatement(nodesMap, nodeItemID);
                        break;

                    case 'request':
                    case 'response':
                        //FIXME:通过edmID更新edmConfig
                        Vue.set(nodeItem, 'edmConfig', context.getEdmConfig(nodeItem.edmID, nodeItem.nodeType, AUI));
                        break;
                }
            },

            setStartNodeID: function (nodeID) {
                this.vueIns.startNodeID = nodeID;
                this.startNodeID = nodeID;
            },

            showCondition: function (nodeItem, nodesMap) {
                var context = this;
                if (!context.hasNode(nodesMap, 'and', nodeItem)) {
                    context.addRootNode('and', nodeItem, false, false, {
                        isCondition: true,
                        isAnd: true
                    });
                } else {
                    nodesMap[nodeItem.and].active = true;
                }

                if (!context.hasNode(nodesMap, 'or', nodeItem) && !nodeItem.isAnd) {
                    context.addRootNode('or', nodeItem, false, false, {
                        isCondition: true,
                        isOr: true
                    });
                } else {
                    nodesMap[nodeItem.or] && (nodesMap[nodeItem.or].active = true);
                }
            },

            hasNode: function (nodesMap, key, nodeItem) {
                if (!nodeItem[key]) {
                    return false;
                } else {
                    if (!nodesMap[nodeItem[key]]) {
                        return false;
                    } else {
                        return true;
                    }
                }
            },

            canHideBlank: function(nodesMap, nodeItemID, nodeItem) {
                var context = this;
                return context.startNodeID !== nodeItemID 
                        && context.hasNode(nodesMap, 'next', nodeItem)
                        && !context.hasNode(nodesMap, 'head', nodeItem)
            }, 

            transOptionInstance: function (option, instance) {
                var name, value, optionNameMap = {},
                    context = this;

                each(option, function (item, index) {

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
                                    instance[name] = context.optionKeyToObj(instance, name);
                                    break;

                                case 'object':
                                    instance[name] = {
                                        type: 'object',
                                        value: context.transOptionInstance(item.attr, value)
                                    };
                                    break;

                                case 'array':
                                    value = value && value.map(function (instanceItem, index) {
                                        context.transOptionInstance(item.attrInEachElement, instanceItem);
                                        return {
                                            type: 'object',
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
            },

            optionToParams: function (option, instance) {
                var params = [];

                this.transOptionInstance(option, instance);

                params = option && option.map(function (item, index) {
                    return instance[item.name];
                });

                return params;
            },

            optionKeyToObj: function (optionInstance, optionKey) {
                var codeID = optionInstance[optionKey],
                    codeData,
                    result = {},
                    context = this,
                    codeListMap = context.codeListMap,
                    varListMap = context.varListMap,
                    globalVarListMap = context.globalVarListMap;

                if (codeID in codeListMap) {
                    codeData = codeListMap[codeID];
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
                } else if (codeID in varListMap) {
                    codeData = varListMap[codeID];
                    result = {
                        type: 'variable',
                        value: {
                            name: codeData.name,
                            namespace: 'local'
                        }
                    };
                } else if (codeID in globalVarListMap) {
                    codeData = globalVarListMap[codeID];
                    result = {
                        type: 'variable',
                        value: {
                            name: codeData.name,
                            namespace: codeData.namespace
                        }
                    };
                } else if (true) {

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
            },

            addVar: function (varStructureOption, params) {
                var varID = getVarID(this.AUI, varStructureOption.name, params, this.option.foreignID);

                if (varID in this.varListMap || (varID in this.globalVarListMap)) {
                    app.alert('不能声明两个同名同域变量！');
                    return false;
                } else {
                    if (varStructureOption.name) {
                        switch (params.namespace) {
                            case 'domain':
                            case 'scope':

                                this.globalVarListArr.push(varID);

                                varStructureOption.namespace = params.namespace;
                                this.globalVarListMap[varID] = varStructureOption;

                                break;

                            case 'local':

                                this.varListArr.push(varID);

                                varStructureOption.inFunction = params.inFunction;
                                this.varListMap[varID] = varStructureOption;

                                break;
                        }
                        debugger;
                        varStructureOption.value = this.optionKeyToObj(varStructureOption, 'value');
                    } else {
                        return true;
                    }
                }

                this.refreshVar();
            },

            removeElement: function (array, str) {
                var length = array.length,
                    i;

                for (i = length; i >= 0; --i) {
                    if (array[i] === str) {
                        array.splice(i, 1);
                    }
                }
            },

            deleteVar: function (varID) {
                if (this.varListMap[varID]) {
                    delete this.varListMap[varID];
                    this.removeElement(this.varListArr, varID);
                    this.refreshVar();
                    return true;
                } else if (this.globalVarListMap[varID]) {
                    delete this.globalVarListMap[varID];
                    this.removeElement(this.globalVarListArr, varID);
                    this.refreshVar();
                    return true
                } else {
                    return false;
                }
            },

            changeVar: function (varID, newVal) {
                var oldName, nodesMap = this.nodesMap,
                    context = this,
                    refreshVar = function (newName, oldName) {
                        var temp, key;
                        if (newName !== oldName) {
                            context.refreshVar();

                            newVal.value = context.optionKeyToObj(newVal, 'value');

                            if (temp = context.vueIns.varList[varID]) {
                                for (key in temp) {
                                    if (nodesMap[key]) {
                                        Vue.set(nodesMap[key], 'name', newName);
                                    }
                                }
                            }
                        }
                    };

                if (newVal.name) {
                    if (this.varListMap[varID]) {
                        oldName = this.varListMap[varID].name;

                        this.varListMap[varID] = newVal;

                        refreshVar(newVal.name, oldName);

                        return true;
                    } else if (this.globalVarListMap[varID]) {
                        oldName = this.globalVarListMap[varID].name;

                        this.globalVarListMap[varID] = newVal;

                        refreshVar(newVal.name, oldName);
                        return true
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },

            listener: function () {
                var context = this,
                    data = {},
                    varOption = [{
                            name: 'name',
                            desp: '英文名',
                            type: 'string_input'
                        },
                        {
                            name: 'value',
                            desp: '初始值',
                            type: 'comboTree'
                        }
                    ];

                $(window).off('.overview').on({
                    'keydown.overview': function (e) {
                        var key = window.event.keyCode,
                            currentNodeID;

                        e = window.event;

                        if (e.ctrlKey) {
                            switch (key) {
                                case 90:
                                    //undo
                                    context.undo();
                                    break;

                                case 89:
                                    //redo
                                    context.redo();
                                    break;
                            }
                        } else if (key === 46 && (currentNodeID = context.currentClickNodeID)) {
                            //delete
                            context.deleteNode(currentNodeID);
                        }
                    },
                    'click.overview': function (e, isTrigger) {
                        var $el = $(e.target).closest('[data-role]'),
                            role = $el.attr('data-role');

                        switch (role) {
                            case 'auiRunOverview':
                                require(['compileJS'], function (js) {
                                    var bootstrap;

                                    context.saveToDataModel();
                                    // try{
                                    bootstrap = js(context.AUI.data, false, false, context.option.foreignID);

                                    bootstrap = bootstrap.substring(7, bootstrap.length - 2);

                                    //console.log(context.getBeautyCodeTreeString());

                                    if (!isTrigger) {
                                        app.popover({
                                            $elem: $el,
                                            title: '编译结果',
                                            content: '',
                                            width: '70%',
                                            height: '90%',
                                            placement: 'auto bottom',
                                            fixClick: true,
                                            init: function () {
                                                var $popoverBody = $(this).find('.aweb-popover-body').empty();
                                                var editor = context.AUI.vscode.create(
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
                                                });


                                            },
                                            confirmHandler: function () {
                                                // obj[name] = editor.getValue();
                                            },
                                        });
                                    }
                                });
                                break;
                        }

                    }
                });

                context.$panel.off('.overview').on({
                    'click.overview': function (e, isTrigger) {
                        var $el = $(e.target).closest('[data-event-role]'),
                            varID, varItem,
                            eventRole = $el.attr('data-event-role'),
                            eventParams = $el.attr('data-event-params');

                        eventParams = eventParams && JSON.parse(eventParams);

                        switch (eventRole) {
                            case 'close_overview':
                                context.hide();

                                context.saveToDataModel();
                                break;


                            case 'add_var':
                                app.popover({
                                    $elem: $el,
                                    title: '添加' + eventParams.desp,
                                    content: '',
                                    width: '400px',
                                    height: '65%',
                                    placement: 'bottom',

                                    init: function () {
                                        var $popoverBody = $(this).find('.aweb-popover-body'),
                                            $content = $('<div id="inspector"></div>');

                                        data = {};

                                        $popoverBody.append($content);

                                        base.baseConfig('inspector', data, JSON.parse(JSON.stringify(varOption)));
                                    },

                                    confirmHandler: function () {
                                        var varStructureOption = base.getCleanedOption(data, varOption);

                                        return context.addVar(varStructureOption, eventParams);
                                    }
                                });
                                break;

                            case 'auiVarEdit':
                                varID = $el.parent().attr('data-code-id');
                                varItem = context.globalVarListMap[varID] || context.varListMap[varID];

                                app.popover({
                                    $elem: $el,
                                    title: '修改变量  ' + varItem.name,
                                    content: '',
                                    width: '400px',
                                    height: '65%',
                                    placement: 'auto bottom',
                                    init: function () {
                                        var $popoverBody = $(this).find('.aweb-popover-body'),
                                            $content = $('<div id="inspector"></div>');

                                        data = JSON.parse(JSON.stringify(varItem));

                                        $popoverBody.append($content);
                                        base.baseConfig('inspector', data, JSON.parse(JSON.stringify(varOption)));

                                    },
                                    confirmHandler: function () {
                                        var varStructureOption = base.getCleanedOption(data, varOption);

                                        return context.changeVar(varID, varStructureOption);
                                    }
                                });

                                break;

                            case 'auiVarDel':
                                varID = $el.parent().attr('data-code-id');
                                app.modal({
                                    title: '删除变量',
                                    content: '确定删除变量？',
                                    confirmHandler: function () {
                                        context.deleteVar(varID);
                                    },
                                    isDialog: true,
                                    isLargeModal: false
                                });

                                break;
                        }
                    },

                    'mousedown.overview': function (e) {
                        var $el = $(e.target),
                            nodeItem, tail, value, valueItem, paramObj, arr,
                            nodeEl;

                        if (!$el.closest('.aui-overview-switch-menu').length) {
                            //在switch menu 外面，隐藏switch menu
                            context.$switchMenu.hide();

                            if (context.currentClickNodeID) {
                                context.$panel.find('#' + context.currentClickNodeID).removeClass('aui-overview-clicked-node');
                            }

                            nodeEl = $el.closest('.aui-overview-node');
                            if (nodeEl.length) {

                                nodeEl.addClass('aui-overview-clicked-node');

                                context.currentClickNodeID = nodeEl.attr('id');

                                if (nodeItem = context.nodesMap[context.currentClickNodeID]) {

                                    if (nodeItem.hasNext) {
                                        arr = context.getCodeTree(context.currentClickNodeID, true);
                                    } else {
                                        if (nodeItem.nodeType === 'var') {
                                            arr = context.getCodeTree(context.currentClickNodeID, true);
                                        }
                                    }

                                    if (arr) {
                                        require(['compileJS'], function (js) {
                                            var bootstrap = '',
                                                codeBody = [];

                                            try {
                                                js(context.AUI.data, false, false, context.option.foreignID, {
                                                    codeBody: codeBody,
                                                    codeList: arr
                                                });

                                                bootstrap = context.AUI.getParsedString(UglifyJS.parse(codeBody.join('')));

                                                context.setPreviewCode(bootstrap);
                                            } catch (e) {}
                                        });
                                    }
                                }
                            } else {
                                context.currentClickNodeID = false;
                            }
                        }
                    }
                })
            },

            getBeautyCodeTreeString: function () {
                var str = JSON.stringify(this.getCodeTree()),
                    AUI = this.AUI;

                return AUI.getParsedString(UglifyJS.parse('(' + str + ')'));
            },

            refreshVar: function () {
                var AUI = this.AUI,
                    varListMap = this.varListMap,
                    key, globalVarListMap = this.globalVarListMap,
                    varTree = [{
                        id: '',
                        desp: ''
                    }],
                    varItem,
                    temp,
                    inFunctionMap,
                    localChildren = [],
                    varTreeChildrenMap = {
                        domain: [],
                        scope: []
                    };


                if (!this.varListArr.length) {
                    for (key in varListMap) {
                        this.varListArr.push(key);
                    }
                }

                if (!this.globalVarListArr.length) {
                    for (key in globalVarListMap) {
                        this.globalVarListArr.push(key);
                    }
                }

                //恢复全局和页面变量
                this.globalVarListArr.map(function (key) {
                    varItem = globalVarListMap[key];
                    varItem.id = key;
                    varTreeChildrenMap[varItem.namespace].push(varItem);
                });

                //恢复局部变量
                this.varListArr.map(function (key) {
                    varItem = varListMap[key];
                    varItem.id = key;
                    if (varItem.inFunction) {
                        inFunctionMap = inFunctionMap || {};
                        if (temp = inFunctionMap[varItem.inFunction]) {
                            temp.push(varItem);
                        } else {
                            inFunctionMap[varItem.inFunction] = [];
                        }
                    } else {
                        localChildren.push(varItem);
                    }
                });

                //将所有变量并入树结构
                varTree.push({
                    desp: '全局变量',
                    isAddButton: true,
                    eventParams: JSON.stringify({
                        namespace: 'domain',
                        desp: '全局变量'
                    }),
                    namespace: 'domain',
                    children: varTreeChildrenMap.domain
                });

                varTree.push({
                    desp: '页面变量',
                    isAddButton: true,
                    eventParams: JSON.stringify({
                        namespace: 'scope',
                        desp: '页面变量'
                    }),
                    namespace: 'scope',
                    children: varTreeChildrenMap.scope
                });

                if (inFunctionMap) {
                    for (key in inFunctionMap) {
                        localChildren.unshift({
                            desp: key,
                            children: inFunctionMap[key],
                            isAddButton: true,
                            eventParams: JSON.stringify({
                                inFunction: key
                            }),
                        });
                    }
                }
                varTree.push({
                    desp: '局部变量',
                    namespace: 'local',
                    children: localChildren,
                    isAddButton: true,
                    eventParams: JSON.stringify({
                        namespace: 'local',
                        desp: '局部变量'
                    }),
                });

                this.codeComboTree.varTree = varTree;
                AUI.treeSearch($(localConst.selector.VAR.SEARCH_SELECTOR, this.$panel), $(localConst.selector.VAR.CTN_SELECTOR)).refresh(varTree, 'varList');
                this.enableDrag();
            },

            refreshAppInterface: function (appInterfaces) {
                var AUI = this.AUI,
                    codeListMap = this.codeListMap,
                    tree = [{
                        id: '',
                        desp: ''
                    }],
                    enableDrag = this.enableDrag,
                    codeComboTree = this.codeComboTree;

                //为每个接口添加标识
                appInterfaces.map(function (item) {
                    var code = ['app'],
                        itemChildren = [];

                    tree.push({
                        text: item.desp,
                        children: itemChildren
                    });

                    item.children.map(function (subItem) {
                        var subItemChildren = [],
                            temp = {
                                text: subItem.desp,
                                children: subItemChildren
                            };

                        code.push(subItem.name);

                        itemChildren.push(temp);

                        switch (subItem.belongTo) {
                            case 'class':
                                // subItem.children = subItem.cInterfaces;
                                subItem.cInterfaces.map(function (interfaceData) {
                                    interfaceData.code = code.concat([interfaceData.name]).join('.') + '()';

                                    interfaceData.dataType = (interfaceData.returnValue && interfaceData.returnValue.type) || '';

                                    if (!interfaceData.hasReturn) {
                                        interfaceData.dataType = '';
                                    }

                                    subItemChildren.push({
                                        id: interfaceData.code,
                                        text: interfaceData.desp,
                                        returnValue: interfaceData.returnValue,
                                        dataType: interfaceData.dataType,
                                        hasReturn: interfaceData.hasReturn
                                    });

                                    codeListMap[interfaceData.code] = interfaceData;
                                });
                                break;

                            default:
                                subItem.code = code.join('.') + '()';

                                temp.id = subItem.code;
                                temp.returnValue = subItem.returnValue;

                                subItem.dataType = (subItem.returnValue && subItem.returnValue.type) || '';

                                if (!subItem.hasReturn) {
                                    subItem.dataType = '';
                                }
                                temp.dataType = subItem.dataType;
                                temp.hasReturn = subItem.hasReturn;

                                delete temp.children;

                                codeListMap[subItem.code] = subItem;
                                break;
                        }
                        code.pop();
                    });
                });

                codeComboTree.appInterfacesTree = tree;
                new AUI.tabTreeSearch($(localConst.selector.AWEB.CTN_SELECTOR), enableDrag).refresh(tree);
            },

            refreshWidgetInterface: function (AUI) {
                var
                    insList = [{
                        id: '',
                        desp: ''
                    }],
                    codeListMap = this.codeListMap,
                    caches = [{
                        widget: $AW(AUI.data.uuid),
                        data: insList
                    }],
                    $children, children,
                    node, nodeName, nodeID, widgetConfig,
                    i, item, items, api, desp, code, value,
                    widget, dataType,bracketIndex,
                    cache, len,
                    cursor = 0;

                while (cache = caches[cursor]) {
                    widget = cache.widget;
                    nodeID = widget.id();
                    nodeName = widget.name() + '（' + widget[0].data.attr.id + '）';
                    children = [];

                    node = {
                        // id: nodeID,
                        text: nodeName,
                        children: children
                    };

                    if (widget.length && (widgetConfig = widget[0].widget)) {

                        if ((items = widgetConfig.api) && items.length) {
                            for (i = -1; item = items[++i];) {
                                if ((value = item.newValue || item.oldValue || item.value)) {
                                    if (item.name) {

                                        desp = item.desp + '（' + item.name + '）';
                                        code = AUI.transformIntoForeignKey(AUI.transformForeignKey(value, nodeID, this.option.foreignID), nodeID);
                                        code = code.trim();
                                        bracketIndex = code.indexOf('(');
                                        

                                        if (bracketIndex !== -1) {
                                            code = code.substr(0,bracketIndex);
                                        }

                                        code = code + '()';
                                        value = value + '()';

                                        item.dataType = (item.returnValue && item.returnValue.type) || '';

                                        if (!item.hasReturn) {
                                            item.dataType = '';
                                        }

                                        api = {
                                            id: code,
                                            code: code,
                                            text: desp,
                                            params: item.params,
                                            returnValue: item.returnValue,
                                            dataType: item.dataType,
                                            hasReturn: item.hasReturn,
                                            widgetID: nodeID,
                                            codeName: value
                                        };

                                        children.push(api);

                                        codeListMap[code] = api;
                                    }
                                }
                            }
                        }
                    }

                    if (len = ($children = widget.children(':active')).length) {
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
                // insList = insList[0].children || [];

                codeComboTree.widgetInterfacesTree = insList;
                new AUI.tabTreeSearch($(localConst.selector.WIDGET.CTN_SELECTOR), this.enableDrag).refresh(insList);
            },

            enableDrag: function () {
                var $codeFrame = $('.aui-overview-code-frame', CONST.PAGE.OVERVIEW.CTN);

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

            refreshInterface: function () {
                this.refreshAppInterface(JSON.parse(JSON.stringify(this.AUI.data.viewer.appInterfaces)));

                this.refreshWidgetInterface(this.AUI);
            },

            refreshConst: function () {
                var
                    constListMap = {},
                    arr = this.AUI.data.viewer.appInterfacesConst.map(function (item) {
                        item.desp = item.category;
                        item.children = item.valueArray.map(function (iitem, index) {
                            constListMap[iitem] = {
                                desp: item.despArray[index],
                                name: iitem,
                                id: iitem,
                                type: 'const'
                            };
                            return constListMap[iitem];
                        });
                        return item;
                    });

                this.constListMap = constListMap;
                codeComboTree.constTree = arr;
                new this.AUI.tabTreeSearch($(localConst.selector.INTERFACECONST.CTN_SELECTOR), this.enableDrag).refresh(arr);
            },

            refreshJsType: function () {
                var codeComboTree = this.codeComboTree,
                    arr = [
                        {
                            type: 'code',
                            desp: '原生代码',
                            id: 'code'
                        },
                        {
                            type: 'string',
                            desp: '字符串',
                            id: 'string'
                        },
                        {
                            type: 'boolean',
                            desp: '布尔值',
                            id: 'boolean'
                        },
                        {
                            type: 'number',
                            desp: '数字',
                            id: 'number'
                        }
                    ],
                    options = [{
                        desp: "类型",
                        children: arr
                    }];

                codeComboTree.jsTypeTree = arr;
                //
                // new this.AUI.treeSearch(undefined, $(localConst.selector.JSTYPE.CTN_SELECTOR))
                //     .refresh(arr, 'graph');
                $(localConst.selector.JSTYPE.CTN_SELECTOR).empty().append(artTemplate('overviewStatementList', options));
                this.enableDrag();
            },

            refreshStatement: function () {
                var
                    //   arr = [{
                    //     type: 'if',
                    //     desp: 'if',
                    //     id: 'if',
                    //   },
                    //   {
                    //     type: 'switch',
                    //     desp: 'switch',
                    //     id: 'switch'
                    //   },
                    //   {
                    //     type: 'for',
                    //     desp: 'for',
                    //     id: 'for'
                    //   },
                    //   {
                    //     type: 'statement',
                    //     desp: 'debugger',
                    //     id: 'debugger'
                    //   },
                    //   {
                    //     type: 'statement',
                    //     desp: 'break',
                    //     id: 'break'
                    //   },
                    //   {
                    //     type: 'statement',
                    //     desp: 'continue',
                    //     id: 'continue'
                    //   },
                    //   {
                    //     type: 'statement',
                    //     desp: 'return',
                    //     id: 'return'
                    //   },
                    //   /* {
                    //     desp: '语句',
                    //     children: [
                    //       {
                    //         desp: '调试',
                    //         children: [
                    //
                    //         ]
                    //       },
                    //       {
                    //         desp: '循环',
                    //         children: [
                    //
                    //         ]
                    //       },
                    //       {
                    //         desp: '判断',
                    //         children: [
                    //
                    //         ]
                    //       }
                    //     ]
                    //   } */
                    // ],
                    eachStatement = {
                        desp: '遍历',
                        type: 'interface',
                        id: '$.each()',
                        code: '$.each()',
                        params: [{
                                name: 'array',
                                desp: '待遍历数组',
                                type: 'array',
                            },
                            {
                                name: 'func',
                                type: 'handler',
                                desp: '回调函数',
                                defaultValue: 'function(index,value){}'
                            }
                        ]
                    },
                    options = [{
                            desp: "调试",
                            children: [{
                                    type: 'statement',
                                    desp: 'debugger',
                                    id: 'debugger'
                                },
                                {
                                    type: 'statement',
                                    desp: 'break',
                                    id: 'break'
                                },
                                {
                                    type: 'statement',
                                    desp: 'continue',
                                    id: 'continue'
                                },
                                {
                                    type: 'statement',
                                    desp: 'return',
                                    id: 'return'
                                }
                            ]
                        },
                        {
                            desp: "循环",
                            children: [
                                eachStatement,
                                {
                                    type: 'for',
                                    desp: 'for',
                                    id: 'for'
                                }
                            ]
                        },
                        {
                            desp: "判断",
                            children: [{
                                    type: 'if',
                                    desp: 'if',
                                    id: 'if',
                                },
                                {
                                    type: 'switch',
                                    desp: 'switch',
                                    id: 'switch'
                                }
                            ]
                        }

                    ];

                // arr.unshift(eachStatement);

                this.codeListMap[eachStatement.id] = eachStatement;

                $(localConst.selector.STATEMENT.CTN_SELECTOR).empty().append(artTemplate('overviewStatementList', options));

                // new this.AUI.treeSearch(undefined, $(localConst.selector.STATEMENT.CTN_SELECTOR))
                // .refresh(arr, 'graph');

                this.enableDrag();
            }
        };

        // window.bridge = bridge;

        return {
            show: function (option) {
                var key, map = {},
                    data;

                global.AUI.editorLayout.view.setActive(CONST.PAGE.OVERVIEW.ATTR_CTN);

                if (currentOverview) {
                    currentOverview.saveToDataModel();
                }

                currentOverview = window.overview = new Overview(option);
                currentOverview.show();
                key = option.applyTo.toLowerCase();

                map[key + 'ID'] = option.foreignID;
                if ((data = global.AUI.data[key](map).get()) && data.length) {
                    global.AUI.setOverviewTitle(data[0].desp);
                }

            },

            hide: function () {
                currentOverview.hide();
            }
        }
    })
})();