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
            define(['jquery', 'index', 'const', 'template', 'edm', 'Model.Data', 'config.event'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, AUI, CONST, artTemplate, edmUtil, dataModel, EVENT_CONFIG) {
        'use strict';
        var base;
        require(['base'], function (_base) {
            base = _base;
        });
        //变量定义
        var
            SWITCHER_CLASS = 'aui-switch-input',
            WIDGET = CONST.WIDGET,
            STRING_INPUT = WIDGET.STRING_INPUT,
            STRING_SELECT = WIDGET.STRING_SELECT,
            EVENT_CONST = {
                TEMPLATE_TYPE: 'eventBlock',
                SELECTOR: 'eventConfigure',
                LIST_SELECTOR: '#collapse_eventConfigure',
                OPTION: [{
                    name: 'desp',
                    type: 'string_input',
                    defaultValue: '_desp_',
                    desp: '名称'
                }, {
                    name: 'selector',
                    type: 'string_select',
                    valueArray: [],
                    despArray: [],
                    desp: '触发范围',
                    spanType: 'list',
                    canSwap: true
                }, {
                    name: 'type',
                    type: 'string_select',
                    valueArray: [],
                    despArray: [],
                    desp: '触发条件'
                }, {
                    name: 'namespace',
                    type: 'string_input',
                    desp: '触发空间',
                    details: '触发事件的命名空间，如果有相同触发范围和条件时，可以用触发空间（命名空间）区别两件事件，请输入英文字符，输入多个命名空间时，使用空格空格隔开',
                    placeholder: '英文字符，输入多个命名空间时，使用空格空格隔开'
                }, {
                    name: 'handler',
                    type: 'string_select',
                    valueArray: ['custom', 'modal', 'sub', 'redirect', 'window', 'popover', 'ajax'],// 'ajax'  //new overview
                    despArray: ['自定义', '弹窗', '打开子页面', '打开新页面', '打开新窗口', '打开气泡页面', '异步请求'],//, '异步加载数据'
                    defaultValue: 'custom',
                    desp: '触发事件'
                }],
                PROP: ['desp', 'selector', 'type', 'namespace', 'handler'],
                HANDLER: CONST.EVENT.HANDLER,
                BLOCK: '.sortable-li',
                SINGLE_BLOCK: '.aui-event-block',
                SUB_BLOCK: {
                    MORE_DETAILS_SELECTOR: ':not(:last)',
                    BASE_SELECTOR: '[data-event-role]',


                    MODAL: '[data-event-role=modalBlock]',
                    MODAL_PAGE: '[data-event-role=subBlock]',

                    WINDOW: '[data-event-role=windowBlock]',

                    VALIDATE_PARAMS: '[data-event-role=ajaxProps]',

                    EDM: '[data-event-role=edmBlock]',
                    EDM_REQUEST: '[data-direction="request"]',
                    EDM_RESPONSE: '[data-direction="response"]',
                    EDM_LIST: '[data-role="edmList"]',
                    ADVANCE: '[data-event-role=advanceBlock]',
                    ADVANCE_CONFIG: '[data-role=advanceConfig]'
                },
                REQUEST_EDM_TEMP: '<div class="aui-event-sub-ctt" data-event-role="edmBlock" data-direction="request">' + artTemplate('edmBlock', {
                    title: CONST.EDM.DIRECTION.requestText,
                    direction: CONST.EDM.DIRECTION.request,
                    isEvent: true
                }) + '</div>',
                RESPONSE_EDM_TEMP: '<div class="aui-event-sub-ctt" data-event-role="edmBlock" data-direction="response">' + artTemplate('edmBlock', {
                    title: CONST.EDM.DIRECTION.responseText,
                    direction: CONST.EDM.DIRECTION.response,
                    isEvent: true
                }) + '</div>',
                ADVANCE_TEMP: CONST.TEMP.EVENT_ADVANCE
            },
            VALIDATE_PARAMS = CONST.EDM.VALIDATE.LIST,

            SUB_PAGE = EVENT_CONST.HANDLER.SUB,
            SUB_PAGE_PARAMS = [{
                "name": "width",
                "desp": "宽度",
                "type": "event_string_input",
                "cssKey": "width",
                "pattern": "[0-9]+",
                "unitGroup": ['px', 'em', 'rem', '%'],
                "unit": "px"
            }, {
                "desp": "高度",
                "type": "event_string_input",
                "cssKey": "height",
                "name": "height",
                "pattern": "[0-9]*(px|em|rem|%)?",
                "unitGroup": ['px', 'em', 'rem', '%'],
                "unit": "px"
            }],
            SUB_PAGE_PARAMS_KEY = ['width', 'height', 'widthUnit', 'heightUnit'],

            //WINDOWS

            WINDOWS = EVENT_CONST.HANDLER.WINDOWS,
            WINDOWS_PARAMS = [{
                name: 'fullscreen',
                type: 'boolean',
                defaultValue: 'true',
                desp: '是否全屏显示'
            }, {
                name: 'displayNav',
                type: 'boolean',
                defaultValue: 'true',
                desp: '是否显示标签导航栏'
            }],
            WINDOWS_PARAMS_KEY = ['fullscreen', 'displayNav'],

            EVENT_TITLE_SELECTOR = '.aui-event-ttl',
            EVENT_CONTENT_SELECTOR = '.aui-event-ctt',

            SUB_BLOCK_SELECTOR = EVENT_CONST.SUB_BLOCK,

            DESCRIPTION = EVENT_CONST.PROP[0],
            SELECTOR = EVENT_CONST.PROP[1],
            TYPE = EVENT_CONST.PROP[2],
            HANDLER = EVENT_CONST.PROP[4],
            AJAX = EVENT_CONST.HANDLER.AJAX,
            API_FIRST = 'api',
            REDIRECT = EVENT_CONST.HANDLER.REDIRECT,
            MODAL = EVENT_CONST.HANDLER.MODAL,
            POPOVER = EVENT_CONST.HANDLER.POPOVER,
            WINDOWS = EVENT_CONST.HANDLER.WINDOWS,

            HANDLER_OPTION = EVENT_CONST.OPTION[4],

            MODAL_TYPE = 'modalCtn',
            URL = 'url',

            EVENT_HANDLER_REPLACEMENT = CONST.REGEX.EVENT_FUNCTION_REPLACEMENT,
            EVENT_HANDLER_REGEX = CONST.REGEX.EVENT_FUNCTION_REGEX,


            EVENT_TYPE_HTML = null,


            APPEND_EVENT = CONST.WIDGET_DELEGATE_EVENT.TYPE.APPEND_EVENT,
            REMOVE_EVENT = CONST.WIDGET_DELEGATE_EVENT.TYPE.REMOVE_EVENT,

            SELECT_OPTION_TEMP = CONST.TEMP.SELECT_TEMP,

            bootstrapSwitchExecuting, selectorHTML, typeHTML, handlerHTML, modalHTML, eventHTMLTemp,
            eventSelectorCache = {},
            selectorToUuidMap = {},

            //方法定义
            //生成事件绑定的代码/
            generateHTML = function () {
                var html = [
                        '<div class="aui-event-block aui-tab-align" data-eid="_eventID_">',
                        // '<div class="aui-event-ttl" title="_desp_"><span class="aui-ttl">_desp_</span></div>',
                        '<div class="aui-event-ctt">'
                    ],
                    option, i, item;

                //event optoin
                option = EVENT_CONST.OPTION;
                for (i = -1, item; item = option[++i];) {
                    item.domSelector = item.name;
                    item.moreDesp = item.desp;
                    item.value = item.defaultValue;
                    html.push(artTemplate(item.type, item));
                }

                //modal option
                html.push('<div class="aui-event-sub-ctt" data-event-role="modalBlock">');
                item = {
                    name: 'modal',
                    type: 'string_select',
                    valueArray: [''],
                    despArray: ['无'],
                    defaultValue: '',
                    desp: '弹窗',
                    moreDesp: '弹窗的内容'
                };
                item.domSelector = item.name;
                item.value = item.defaultValue;

                html.push(artTemplate(item.type, item));
                html.push('</div>');

                // window options
                html.push('<div class="aui-event-sub-ctt" data-event-role="windowBlock">');
                option = WINDOWS_PARAMS;
                for (i = -1; item = option[++i];) {
                    item.domSelector = item.name;
                    item.moreDesp = item.desp;
                    item.value = item.defaultValue;
                    html.push(artTemplate(item.type, item));
                }

                html.push('</div>');

                //sub page params
                html.push('<div class="aui-event-sub-ctt" data-event-role="subBlock">');
                option = SUB_PAGE_PARAMS;
                for (i = -1; item = option[++i];) {
                    item.domSelector = item.name;
                    item.moreDesp = item.desp;
                    item.value = item.defaultValue;
                    html.push(artTemplate(item.type, item));
                }
                html.push('</div>');

                //generateEdmTemp

                // html.push('<div class="aui-event-sub-ctt" data-event-role="ajaxProps">');
                // option = VALIDATE_PARAMS;
                // for (i = -1, item; item = option[++i];) {
                //     item.domSelector = item.name;
                //     item.moreDesp = item.desp;
                //     item.value = item.defaultValue;
                //     html.push(artTemplate(item.type, item));
                // }
                // html.push('</div>');

                html.push(EVENT_CONST.REQUEST_EDM_TEMP);
                html.push(EVENT_CONST.RESPONSE_EDM_TEMP);
                html.push(EVENT_CONST.ADVANCE_TEMP);

                html.push('</div></div>');

                return html.join('');
            },

            generateModalCtnOption = function () {
                modalHTML = [SELECT_OPTION_TEMP];

                dataModel.removeRedundancy(true)([{type: MODAL_TYPE}, {base: MODAL_TYPE}]).each(function (structrue) {
                    modalHTML.push('<option value="' + structrue.widgetID + '">' + structrue.attr.widgetName + '</option>');
                });

                modalHTML = modalHTML.join('');
            },

            generateSelectorOption = function (innerSelectorList, outerSelectorList, type) {
                var i, item, items,
                    selector, valueMap = {};
                selectorHTML=[];
                switch (type) {
                    case STRING_INPUT:
                        selectorHTML = [CONST.TEMP.EVENT_SELECTOR_INPUT.replace('_VALUE_','###_ID##')];
                        break;

                    case STRING_SELECT:
                        selectorHTML = [CONST.TEMP.EVENT_SELECTOR_SELECT, SELECT_OPTION_TEMP];

                        if (innerSelectorList) {
                            for (i = -1, items = innerSelectorList; (item = items[++i]);) {
                                if (!valueMap[item.value]) {
                                    selectorHTML.push('<option value="' + item.value.replace(/"/g, "'") + '">' + item.desp + '</option>');
                                    valueMap[item.value] = true;
                                }
                            }
                        }
                        for (i in outerSelectorList) {
                            if (outerSelectorList.hasOwnProperty(i)) {
                                item = outerSelectorList[i];
                                //旧版以id为准，先使用新版的selector属性
                                selector = '###_ID## ' + (item.selector ? item.selector : ('#' + item.id));
                                if (!valueMap[selector]) {
                                    selectorHTML.push('<option value="' + selector.replace(/"/g, "'") + '">' + item.name + '</option>');
                                }
                            }
                        }
                        break;
                }


                selectorHTML = selectorHTML.join('');
            },

            generateHandlerOption = function (innerEventHandlerList, outerEventHandlerList, valueMap) {
                var items, item, i,
                    outerHTML = [];

                handlerHTML = [SELECT_OPTION_TEMP];
                valueMap = valueMap || {};

                items = HANDLER_OPTION.valueArray;
                for (i = -1; (item = items[++i]);) {
                    handlerHTML.push('<option value="' + item + '">' + HANDLER_OPTION.despArray[i] + '</option>');
                }

                if ((items = innerEventHandlerList) && items.length) {
                    handlerHTML.push('<optgroup label="组件内部接口">');

                    for (i = -1; (item = items[++i]);) {
                        item.value = item.value.replace(/\"/g, "'");
                        valueMap[item.value] = true;
                        handlerHTML.push('<option data-order="' + item.order + '" data-deps="' + item.deps + '" value="' + item.value + '">' + item.desp + '</option>');
                    }
                    handlerHTML.push('</optgroup>');
                }
                //outside Handler
                if ((items = outerEventHandlerList) && items.length) {
                    outerHTML.push('<optgroup label="组件外部接口">');
                    for (i = -1; (item = items[++i]);) {
                        //&& item.deps === AJAX
                        if (item.code && item.order === API_FIRST) {
                            item._value = (item.deps === AJAX ? item.code : EVENT_HANDLER_REPLACEMENT.replace(EVENT_HANDLER_REGEX, item.code)).replace(/\"/g, "'");

                            valueMap[item._value] = true;

                            outerHTML.push('<option data-order="' + item.order + '" data-deps="' + item.deps + '" value="' + item._value + '">' + item.desp + '</option>');

                        }

                    }
                    outerHTML.push('</optgroup>');

                    if (outerHTML.length === 2) {
                        outerHTML = [];
                    }
                }
                handlerHTML = handlerHTML.join('') + outerHTML.join('');
            },

            ajaxPropsBlock = function ($el, widgetID, eventInstance, changeHandler) {
                var html = [], option, i, item;

                html.push('<div class="aui-event-block" data-eid="' + eventInstance.eventID + '"><div class="aui-event-sub-ctt" data-event-role="ajaxProps" id="advanceConfigPopover">');

                option = VALIDATE_PARAMS;
                for (i = -1; item = option[++i];) {
                    item.domSelector = item.name;
                    item.moreDesp = item.desp;
                    item.value = item.defaultValue;
                    html.push(artTemplate(item.type, item));
                }
                html.push('</div>');

                app.popover({
                    $elem: $el,
                    title: '高级配置',
                    content: '',
                    width: '60%',
                    height: '80%',
                    init: function (popInstance) {

                        var $popoverBody = $(this).find('.aweb-popover-body'), i, item;

                        $popoverBody.addClass('aui-config-ctn').empty().append(html.join(''));


                        for (i = VALIDATE_PARAMS.length; item = VALIDATE_PARAMS[--i];) {

                            $('#' + item.name, $popoverBody).val(item.name === URL ? eventInstance.callback : eventInstance[item.name]);
                        }

                        //resume switch
                        $('.' + SWITCHER_CLASS, $popoverBody).each(function () {
                            var $this = $(this);
                            if (!$this.attr('data-wrap')) {
                                AUI.auiSwitch($this, eventInstance[this.id] != false || false, onSwitchChange(eventInstance.eventID, widgetID, '#advanceConfigPopover'));
                            }
                        });

                        $popoverBody
                            .off('.ajaxProp')
                            .on({
                                'change.ajaxProp': function (e, isTrigger) {
                                    changeHandler(e, isTrigger, true);
                                }
                            })


                    },
                    confirmHandler: function () {
                        $AW.trigger($AW.STATUS.PREVIEW_FRESH);
                    }
                })

            },

            generateFuncTemp = function (handler, eventID, foreignWidgetID, deps) {
                var TYPE = EVENT_CONST.HANDLER;
                switch (handler) {
                    case TYPE.AJAX:
                    case TYPE.REDIRECT:
                    case TYPE.SUB:
                    case TYPE.POPOVER:
                    case TYPE.WINDOWS:
                        return '##' + eventID + '_URL##';
                    case TYPE.MODAL:
                        return '##' + foreignWidgetID + '_WID_VAR##';
                    case TYPE.CUSTOM:
                    default:
                        if (deps === TYPE.AJAX) {
                            return '##' + eventID + '_URL##';
                        } else {
                            return AUI.transformForeignKey(handler, foreignWidgetID, eventID);
                        }
                }
            },

            //应用撤销中添加组件到页面中
            removeEventInstance = function () {
                var eventCollection = dataModel.get('event')({eventID: this.eventID}),
                    $eventBlock, eventIns;

                if ((eventIns = eventCollection.first())) {
                    //修改数据模型
                    eventCollection.update({active: false});

                    //修改界面中
                    // AUI.configLock &&
                    if (($eventBlock = $('[data-id=' + this.eventID + ']', this.contextID)).length) {
                        $eventBlock.remove();
                    }

                    $AW.trigger($AW.STATUS.EVENT_DELETE, $AW(eventIns.widgetID), eventIns);


                    return eventIns;
                }
            },

            //应用撤销中移除组件到页面中
            insertEventInstance = function () {
                var eventCollection = dataModel.get('event')({eventID: this.eventID}),
                    eventInstance,
                    $eventBody;

                if (eventInstance = eventCollection.first()) {
                    //修改数据模型
                    eventCollection.update({active: true});

                    //修改界面中
                    //AUI.configLock &&
                    if (($eventBody = $(EVENT_CONST.LIST_SELECTOR, this.contextID)).length) {

                        $eventBody.append(artTemplate(EVENT_CONST.TEMPLATE_TYPE, eventInstance));
                    }
                    $AW.trigger($AW.STATUS.EVENT_APPEND, $AW(eventInstance.widgetID), eventInstance);
                }


            },

            //change handler redo or undo
            changeExecuteHandler = function (eventID, widgetID, contextID, key, value, attr) {
                var eventCollection = dataModel.get('event')({eventID: eventID}),
                    eventInstance,
                    eventData = {},
                    currentValue, instance, widget,
                    api, i, item, result, apiWidgetID,
                    $eventBlock, reg,
                    isDataFlow = false;

                if (eventInstance = eventCollection.first()) {

                    eventData[key] = value;

                    attr = attr || {};
                    eventData.deps = attr.deps;
                    eventData.order = attr.order;

                    if (key === HANDLER) {
                        switch (value) {
                            case REDIRECT:
                            case SUB_PAGE:
                            case WINDOWS:
                            case POPOVER:
                            case AJAX:
                                //兼容v4.2以下版本

                                eventData.deps = attr.deps = AJAX;
                                eventData.callback = eventInstance.url || generateFuncTemp(value, eventID, null, attr && attr.deps);


                                break;
                            case MODAL:
                                delete eventInstance.url;
                                //modal 不做处理
                                break;


                            default:

                                delete eventInstance.url;

                                eventData.callback = generateFuncTemp(value, eventID, null, attr && attr.deps);

                        }

                    } else if (key === MODAL && value) {

                        eventData.callback = generateFuncTemp(key, eventID, value, attr && attr.deps);
                    } else if (key === URL && value) {
                        eventData.callback = value;
                        eventData.deps = AJAX;
                        delete eventData.url;
                    }


                    eventInstance = eventCollection.update(eventData).first();

                    // AUI.change && AUI.change($AW(widgetID));
                    // AUI.configLock &&
                    if (($eventBlock = $('[data-eid=' + eventID + ']', contextID)).length) {
                        resumeEventBlock(widgetID, eventInstance, null, $eventBlock);
                    }
                }
            },
            undoChangeExecuteHandler = function () {
                changeExecuteHandler(this.eventID, this.widgetID, this.contextID, this.key, this.oldValue, this.oldAttr);
            },
            redoChangeExecuteHandler = function () {
                changeExecuteHandler(this.eventID, this.widgetID, this.contextID, this.key, this.newValue, this.newAttr);
            },
            onSwitchChange = function (eventID, widgetID, contextID) {
                return function () {
                    if (bootstrapSwitchExecuting) {
                        bootstrapSwitchExecuting = false;
                    } else {
                        var $this = $(this),
                            key = this.id,
                            newValue = this.checked,
                            widgetInstance = $AW(widgetID)[0].data,
                            eventInstance = dataModel.get('event')({eventID: eventID}).first();

                        if (eventInstance) {
                            changeExecuteHandler(eventID, widgetID, contextID, key, newValue, eventInstance);
                        }
                    }
                }
            },

            //resume the extra select
            resumeEventBlock = function (widgetID, eventInstance, $body, $eventBlock) {
                var $eventContent, $subBlock, $windowBlock,
                    contextID = '#' + ($body || $eventBlock.parent()).attr('id'),
                    handlerText, uuid, widgetInstanceSelector, newValue,
                    listOption = {},
                    i, items, item, prop, widgetIns, api, handlerMatch, $selectorCtn, $list, eventID, listObj,
                    listItemOption;


                if (!($eventBlock && $eventBlock.length)) {

                    $eventBlock = $(eventHTMLTemp.replace(/_eventID_/, eventInstance.eventID));
                    $body.append($eventBlock);
                    //切换selector
                    $selectorCtn = $("#ctn_" + SELECTOR, $body).children(':first');
                    if (($list = $selectorCtn.find(CONST.WIDGET.SWAP_ROLE)).length) {
                        $list.remove();
                    }

                    listOption.obj = eventInstance;
                    listOption.optionItem = {
                        type: eventInstance.selector_type,
                        oldType: eventInstance.selector_oldType,
                        spanType: 'list',
                        canSwap: true,
                        name: SELECTOR
                    };

                    base.list($selectorCtn, listOption, true);

                    $selectorCtn.off('.event').on('listEvent.event', function () {
                        var key, eventConfig, updateObj = {};

                        listObj = listOption.obj;
                        listItemOption = listOption.optionItem;

                        if (listObj && listItemOption && (eventID = listObj.eventID)) {
                            if (listItemOption.name === SELECTOR ) {

                                for (key in listItemOption) {
                                    if (listItemOption.hasOwnProperty(key) && key !== 'name') {
                                        updateObj[SELECTOR + '_' + key] = listItemOption[key];
                                    }
                                }

                                updateObj[listItemOption.name] = listObj[listItemOption.name];

                                dataModel.get('event')({eventID: eventID}).update(updateObj);

                                eventConfig= $AW(widgetID)[0].widget.event;

                                generateSelectorOption((eventConfig && eventConfig.selector), eventSelectorCache[widgetID], updateObj.selector_type);

                                $eventContent.find('#' + SELECTOR).remove();

                                $eventContent.find('#ctn_' + SELECTOR).append(selectorHTML);

                            }

                        }


                    })
                }


                $eventContent = $eventBlock.children(EVENT_CONTENT_SELECTOR);
                $eventContent.children(SUB_BLOCK_SELECTOR.BASE_SELECTOR).addClass('hide');


                //selector
                $eventContent.find('#' + SELECTOR).remove();

                $eventContent.find('#ctn_' + SELECTOR).append(selectorHTML);


                //type
                $eventContent.find('#' + TYPE).empty().append(typeHTML);

                //handler
                $eventContent.find('#' + HANDLER).empty().append(handlerHTML);


                //resume base params
                for (i = -1, items = EVENT_CONST.PROP; item = items[++i];) {

                    if ((item === TYPE || item === SELECTOR) /*&& !eventInstance[item]*/) {
                        prop = {};

                        if (item === SELECTOR && (eventInstance[item] in selectorToUuidMap)) {
                            uuid = selectorToUuidMap[eventInstance[item]];
                            widgetInstanceSelector = eventSelectorCache[widgetID];
                            if (widgetInstanceSelector[uuid]) {
                                newValue = widgetInstanceSelector[uuid].selector;
                                prop[item] = eventInstance[item] = '###_ID## ' + newValue;
                            }


                        } else if (eventInstance && !eventInstance[item]) {
                            prop[item] = eventInstance[item] = $('#' + item, $eventContent).val();
                        }
                        dataModel.get('event')({eventID: eventInstance.eventID}).update(prop);
                    }
                    $('#' + item, $eventContent).val(eventInstance[item]);
                }

                //resume event title
                $eventBlock.children(EVENT_TITLE_SELECTOR).children('span').text(eventInstance[DESCRIPTION]);

                switch (eventInstance[HANDLER]) {
                    case AJAX:
                    case REDIRECT:
                    case SUB_PAGE:
                    case WINDOWS:
                    case POPOVER:
                        //兼容v4.2以下版本
                        if (eventInstance.deps !== AJAX) {
                            eventInstance.deps = AJAX;
                            dataModel.get('event')({eventID: eventInstance.eventID}).update({deps: AJAX});
                        }
                        break;
                    case MODAL:
                        $(SUB_BLOCK_SELECTOR.MODAL, $eventContent)
                            .removeClass('hide')
                            .find('#' + MODAL)
                            .empty().append(modalHTML)
                            .val(eventInstance[MODAL]);

                        $subBlock = $(SUB_BLOCK_SELECTOR.MODAL_PAGE).removeClass('hide');

                        for (i = SUB_PAGE_PARAMS_KEY.length; item = SUB_PAGE_PARAMS_KEY[--i];) {
                            $('#' + item, $subBlock).val(eventInstance[item]);
                        }

                        break;

                }

                //resume switch
                $('.' + SWITCHER_CLASS, $eventContent).each(function () {
                    var $this = $(this);

                    if (!$this.attr('data-wrap')) {
                        AUI.auiSwitch($this, eventInstance[this.id] != false || false, onSwitchChange(eventInstance.eventID, widgetID, contextID));
                    }
                });

                if (eventInstance.deps === AJAX) {

                    //子页面、气泡的高宽
                    if (eventInstance[HANDLER] === SUB_PAGE || eventInstance[HANDLER] === POPOVER) {
                        $subBlock = $(SUB_BLOCK_SELECTOR.MODAL_PAGE, $eventContent).removeClass('hide');

                        //恢复上次的值
                        for (i = SUB_PAGE_PARAMS_KEY.length; item = SUB_PAGE_PARAMS_KEY[--i];) {
                            $('#' + item, $subBlock).val(eventInstance[item]);
                        }
                    } else {
                        $(SUB_BLOCK_SELECTOR.MODAL_PAGE, $eventContent).addClass('hide');
                    }

                    //打开新窗口选项 fullscreen、displayNav
                    if (eventInstance[HANDLER] === WINDOWS) {
                        $windowBlock = $(SUB_BLOCK_SELECTOR.WINDOW, $eventContent).removeClass('hide');
                        //恢复
                        for (i = WINDOWS_PARAMS_KEY.length; item = WINDOWS_PARAMS_KEY[--i];) {
                            $('#' + item, $windowBlock).val(eventInstance[item]);
                        }

                    } else {
                        $windowBlock = $(SUB_BLOCK_SELECTOR.WINDOW, $eventContent).addClass('hide');
                    }

                    $(SUB_BLOCK_SELECTOR.ADVANCE, $eventContent).removeClass('hide');
                    //校验
                    //   $subBlock = $(SUB_BLOCK_SELECTOR.VALIDATE_PARAMS, $eventContent).removeClass('hide');

                    // for (i = VALIDATE_PARAMS.length; item = VALIDATE_PARAMS[--i];) {
                    //  //   ajaxUrl = (item.name === URL && eventInstance[HANDLER] === AJAX);
                    //     $('#' + item.name, $subBlock).val(item.name === URL ? eventInstance.callback : eventInstance[item.name]);
                    // }

                    //resume the edm model list
                    // if (eventInstance.handler === AJAX) {
                    //     $subBlock.addClass('hide');
                    //     $subBlock = $eventContent.children(SUB_BLOCK_SELECTOR.EDM).addClass('hide');
                    // } else { //new overview
                    if (eventInstance.handler === AJAX) {
                        $subBlock = $eventContent.children(SUB_BLOCK_SELECTOR.EDM).removeClass('hide');
                    } else {
                        $subBlock = $eventContent.children(SUB_BLOCK_SELECTOR.EDM_REQUEST).removeClass('hide');
                    }


                    edmUtil.edmUpdateDataModelList({
                        widgetID: widgetID,
                        foreignID: eventInstance.eventID,
                        edmID: eventInstance.edmID,
                        applyTo: CONST.STEP.APPLY_TO.EVENT,
                        $list: $subBlock.find(EVENT_CONST.SUB_BLOCK.EDM_LIST).filter('[data-direction=' + CONST.EDM.DIRECTION.request + ']'),
                        direction: CONST.EDM.DIRECTION.request,
                        callback: function (keys, list, ids, edmID, eventID) {
                            dataModel.get('event')({eventID: eventID}).update({edmID: edmID});
                        }
                    });
                    eventInstance.handler === AJAX && edmUtil.edmUpdateDataModelList({
                        widgetID: widgetID,
                        foreignID: eventInstance.eventID,
                        edmID: eventInstance.responseID,
                        applyTo: CONST.STEP.APPLY_TO.EVENT,
                        $list: $subBlock.find(EVENT_CONST.SUB_BLOCK.EDM_LIST).filter('[data-direction=' + CONST.EDM.DIRECTION.response + ']'),
                        direction: CONST.EDM.DIRECTION.response,
                        callback: function (keys, list, ids, edmID, eventID) {
                            dataModel.get('event')({eventID: eventID}).update({responseID: edmID});
                        }
                    });
                    // }

                }


                handlerText = $('#' + HANDLER, $eventBlock).find('[value="' + eventInstance.handler + '"]').text();


                //兼容4.3
                if (!handlerText) {
                    //console.log(eventInstance);
                    handlerText = (eventInstance.handlerText || CONST.ACTION.TYPE.UNKNOWN);

                    //通过eventInstance.handler找到widgtID，$AW实例化,后找到widget，遍历api找到接口，更新新的deps的值

                    //handler: "##B3B4A072F0A343068AB2-1786_WID_var##.upload(##_AJAX_OPTION##)↵"
                    // debugger;
                    if (eventInstance.handler) {
                        handlerMatch = eventInstance.handler.match(/^(?:##)([^_]+)_WID(.*)/) || eventInstance.handler.match(/(?:##)([a-zA-Z0-9][^_]+)_WID(.*)/);
                        if (handlerMatch && handlerMatch.length) {
                            if ((widgetIns = $AW(handlerMatch[1])) && widgetIns.length) {
                                if ((api = widgetIns[0].widget.api) && api.length) {
                                    for (i = -1; item = api[++i];) {
                                        if (item.newValue && item.newValue.indexOf(handlerMatch[2]) > -1) {
                                            eventInstance.deps = item.deps;
                                            // eventInstance.callback = generateFuncTemp(eventInstance.handler, eventInstance.eventID, handlerMatch[1], eventInstance.deps);
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                    }
                    $('#' + HANDLER, $eventBlock)
                        .append('<optgroup label="兼容模式"><option data-order="' + eventInstance.order + '" data-deps="' + eventInstance.deps + '" value="' + (eventInstance.handler || 'undefined') + '">' + handlerText + '</option></optgroup>')
                        .val(eventInstance.handler || 'undefined');


                }

                if (!eventInstance.handlerText || handlerText !== eventInstance.handlerText) {
                    eventInstance.handlerText = handlerText;
                    dataModel.get('event')({eventID: eventInstance.eventID}).update({handlerText: handlerText});
                }

                return $eventBlock;
            },

            Event = (function () {
                var ev = function (eventIDs) {
                    return new ev.fn.init(eventIDs);
                };

                ev._params = function (eventID) {
                    var params = {
                        eventID: eventID,
                        dataCollection: dataModel.get('event')({eventID: eventID})
                    };

                    params.data = params.dataCollection.first();

                    return params.data ? params : {};
                };

                ev.fn = ev.prototype = {

                    constructor: ev,
                    length: 0,
                    version: 'AUI 4.2',

                    init: function (eventIDs) {
                        var context = this;

                        if (eventIDs && eventIDs.length) {
                            eventIDs.map(function (eventID) {
                                context._push(ev._params(eventID));
                            });
                        }

                        return this;
                    },
                    each: function (callback) {
                        for (var i = -1, item; item = this[++i];) {
                            callback.call(item, i, item);
                        }

                        return this;
                    },

                    _edm: function (direction) {
                        var ids = this._list();

                        if (ids.length) {
                            ids = dataModel.get(direction)({foreignID: ids}).select('edmID');
                        }

                        return ids.length ? edmUtil.Edm(ids) : undefined;
                    },

                    request: function () {
                        return this._edm('request');
                    },
                    response: function () {
                        return this._edm('response');
                    },

                    _list: function () {
                        var ids = [];

                        this._map(function (elem) {
                            elem && elem.eventID && ids.push(elem.eventID);
                        });

                        return ids;
                    },
                    _push: Array.prototype.push,
                    _splice: Array.prototype.splice,
                    _concat: Array.prototype.concat,
                    _map: Array.prototype.map
                };

                ev.fn.init.prototype = ev.fn;

                return ev;
            }()),
            eventConfigure = function ($context, oWidget, setTabVisible) {
                var contextID,
                    elem,
                    widget, widgetID,
                    widgetInstanceSelector,
                    i, item, items,
                    html;

                contextID = '#' + $context.attr('id');

                elem = oWidget[0];

                widget = elem.widget;

                widgetID = elem.widgetID;
                widgetInstanceSelector = eventSelectorCache[widgetID];

                //从widget中读取事件配置
            //    if (widget.event && (widget.event.selector || !$.isEmptyObject(widgetInstanceSelector))/* && widget.event.type*/) {
                    setTabVisible(true);


                    //resume type
                    /* for (i = -1, items = widget.event.type, typeHTML = [SELECT_OPTION_TEMP]; (item = items[++i]);) {
                     typeHTML.push('<option value="' + item.value + '">' + item.desp + '</option>');
                     }
                     typeHTML = typeHTML.join('');*/


                    //恢复弹窗
                    generateModalCtnOption();


                    html = [];
                    html.push('<div class="aui-config-block-body">');

                    html.push(artTemplate('array', {
                        domSelector: EVENT_CONST.SELECTOR,
                        collapse: false
                    }));

                    //恢复以前配置的事件
                    dataModel.get('event')({widgetID: widgetID, active: true}).each(function (eventInstance) {
                        if (!eventInstance.desp) {
                            eventInstance.desp = '“' + oWidget.name() + '”事件' + (dataModel.getEventAccumulator());
                            dataModel.get('event')({eventID: eventInstance.eventID}).update({desp: eventInstance.desp});
                            app.performance.shortDelay(function () {
                                $AW.trigger($AW.STATUS.EVENT_UPDATE, $AW(eventInstance.widgetID), eventInstance);
                            })
                        }

                        html.push(artTemplate(EVENT_CONST.TEMPLATE_TYPE, eventInstance));
                    });

                    html.push('</ul></div></div></div>');

                    $context.empty().append(html.join(''));

                    $context.find('a').off();

                    //一定要以auiConfigure为命名空间，方便关闭的时候解除jQuery的事件绑定 //
                    $(CONST.PAGE.CONFIGURE_FRAME.EVENT.CTN).off('.auiConfigure').on({
                        //添加、删除、编辑事件
                        'click.auiConfigure': function (e) {

                            var $e = $(e.target || window.event.srcElement).closest('[data-event-role]'),
                                role = $e.attr('data-event-role'),
                                eventAccumulator, namespace,
                                eventID, eventInstance,
                                i, item, items;

                            if (role) {
                                switch (role) {
                                    case 'add_block'://添加事件按钮
                                        //初始化option
                                        eventID = app.getUID();
                                        eventAccumulator = dataModel.getEventAccumulator();
                                        namespace = 'event' + eventAccumulator;

                                        $e.prev().children().removeClass('collapsed');
                                        $('#collapse_eventConfigure').addClass('in').css('height', 'auto');

                                        //插入数据模型中
                                        eventInstance = {
                                            id: eventAccumulator,//给IDE提供的id
                                            widgetID: widgetID, eventID: eventID,//联合主键
                                            namespace: namespace,
                                            handler: EVENT_CONST.OPTION[4].defaultValue,
                                            callback: generateFuncTemp(EVENT_CONST.OPTION[4].defaultValue, eventID),
                                            desp: '“' + oWidget.name() + '”事件' + eventAccumulator,
                                            active: true, //是否生效

                                            //validate
                                            ajaxType: VALIDATE_PARAMS[0].defaultValue,
                                            validate: VALIDATE_PARAMS[2].defaultValue,
                                            validateContinue: VALIDATE_PARAMS[3].defaultValue,
                                            validateErrorCallback: VALIDATE_PARAMS[4].defaultValue
                                        };

                                        for (i = -1, items = VALIDATE_PARAMS; item = items[++i];) {
                                            if (!eventInstance[item.name]) {
                                                eventInstance[item.name] = item.defaultValue || '';
                                            }
                                        }

                                        dataModel.get('event').insert(eventInstance);


                                        //生成界面
                                        insertEventInstance.call({
                                            widgetID: widgetID,
                                            eventID: eventID,
                                            contextID: contextID
                                        });

                                        break;
                                    case 'del_block'://移除事件
                                        eventID = $e.closest(EVENT_CONST.BLOCK).attr('data-id');

                                        //修改界面
                                        eventInstance = removeEventInstance.call({
                                            eventID: eventID,
                                            widgetID: widgetID,
                                            contextID: contextID
                                        });

                                        break;

                                    case 'overview':
                                        AUI.openPage(CONST.PAGE.OVERVIEW_FRAME.SELF, function () {
                                            $AW.trigger($AW._STATUS.OVERVIEW_FRAME.SHOW, {
                                                widgetID: widgetID,
                                                foreignID: $e.closest(EVENT_CONST.BLOCK).attr('data-id'),
                                                applyTo: CONST.STEP.APPLY_TO.EVENT
                                            })
                                        });

                                        break;
                                }

                                //for widgetCreator
                                //   AUI.change && AUI.change($AW(widgetID));
                            }
                        }
                    });
                // } else {
                //    // $context.empty().append('<p class="text-info gutter-both">该组件无事件绑定配置。</p>');
                //     setTabVisible(true);
                // }
            },
            eventConfigureSingle = function (widgetID, eventInstance, $body, callback) {
                var oWidget = $AW(widgetID), $eventBlock,
                    eventConfig = oWidget[0].widget,
                    contextID = '#' + $body.attr('id'),
                    _eventInstance = eventInstance,
                    items, i, item, selectorType,
                    changeHandler = function (e, isTrigger, noFresh) {
                        var $e = $(e.target || window.event.srcElement),
                            $eventBlock = $e.closest(EVENT_CONST.SINGLE_BLOCK),
                            $handler, $option,

                            eventCollection, eventInstance,
                            eventID, eventData = {},
                            key, value, $eventItem;

                        if ($eventBlock.length) {

                            eventID = $eventBlock.attr('data-eid');
                            eventCollection = dataModel.get('event')({eventID: eventID});

                            if (eventInstance = eventCollection.first()) {

                                key = $e.attr('id');
                                value = eventData[key] = $e.val();

                                $handler = $('#' + HANDLER, $eventBlock);
                                $option = $handler.find('[value="' + $handler.val() + '"]');
                                eventData.deps = $option.attr('data-deps');
                                eventData.order = $option.attr('data-order');

                                changeExecuteHandler(eventID, widgetID, contextID, key, value, eventData);

                                //修改数据模型
                                eventCollection.update(eventData);

                                callback && callback({
                                    type: key,
                                    isTrigger: isTrigger
                                });
                                if (key === 'desp') {
                                    if ($eventItem = $(EVENT_CONST.LIST_SELECTOR).find('[data-id=' + eventID + ']')) {
                                        $eventItem.attr('title', value);
                                        $eventItem.find('[data-event-role=overview]').text(value);
                                        $AW.trigger($AW._STATUS.OVERVIEW_FRAME.NAME, value);
                                        $AW.trigger($AW.STATUS.EVENT_UPDATE, $AW(eventInstance.widgetID), eventInstance);
                                    }
                                } else if (!noFresh) {
                                    $AW.trigger($AW.STATUS.PREVIEW_FRESH);
                                }

                                _eventInstance = eventCollection.first();

                            }
                        }
                    };

                //恢复触发范围的input 类型
                if (!(selectorType = eventInstance.selector_type)) {
                    eventInstance.selector_type = STRING_SELECT;
                    eventInstance.selector_oldType = STRING_INPUT;
                    eventInstance.selector_spanType = 'list';
                    eventInstance.selector_canSwap = true;

                } else {
                    if (!eventInstance.selector_oldType) {
                        eventInstance.selector_oldType = (selectorType === STRING_SELECT) ? STRING_INPUT : STRING_SELECT;
                    }
                }
                // dataModel.get('event')({eventID: eventInstance.eventID}).update(eventInstance);

                eventConfig = eventConfig && eventConfig.event || {};

                //恢复触发范围
                generateSelectorOption(eventConfig.selector, eventSelectorCache[widgetID], eventInstance.selector_type);


                //恢复触发方法
                generateHandlerOption(eventConfig.handler, dataModel.get('eventHandlerList'));

                if (!EVENT_TYPE_HTML) {
                    typeHTML = [];
                    typeHTML.push('<optgroup label="AWEB 推荐交互类型">');

                    for (i = -1, items = EVENT_CONFIG.type; (item = items[++i]);) {
                        typeHTML.push('<option value="' + item.value + '">' + item.desp + '</option>');
                    }

                    typeHTML.push('</optgroup>');
                    EVENT_TYPE_HTML = typeHTML.join('');
                }

                if (eventConfig.type && eventConfig.type.length) {
                    for (i = -1, items = eventConfig.type, typeHTML = []; (item = items[++i]);) {
                        typeHTML.push('<option value="' + item.value + '">' + item.desp + '</option>');
                    }
                } else {
                    typeHTML = [];
                }
                typeHTML = SELECT_OPTION_TEMP + typeHTML.join('') + EVENT_TYPE_HTML;


                $eventBlock = resumeEventBlock(widgetID, eventInstance, $body, null);


                $body
                    .off('.auiConfigure')
                    .on({
                        //记录每个change事件并记录
                        'change.auiConfigure': function (e, isTrigger) {
                            changeHandler(e, isTrigger);
                        },
                        //添加、删除、编辑事件
                        'click.auiConfigure': function (e) {
                            e.preventDefault();

                            var $e = $(e.target || window.event.srcElement).closest('[data-role]'),
                                role = $e.attr('data-role'),
                                direction,
                                $eventBlock,
                                eventID, eventCollection, eventInstance;

                            if (role) {
                                switch (role) {
                                    case 'edm'://配置字段.
                                        if (direction = $e.attr('data-direction')) {
                                            $eventBlock = $e.closest(EVENT_CONST.SINGLE_BLOCK);

                                            eventID = $eventBlock.attr('data-eid');

                                            eventCollection = dataModel.get('event')({eventID: eventID});
                                            eventInstance = eventCollection.first();

                                            edmUtil.edmConfig({
                                                widgetID: widgetID,
                                                foreignID: eventInstance.eventID,
                                                edmID: eventInstance[direction === CONST.EDM.DIRECTION.response ? 'responseID' : 'edmID'],
                                                applyTo: CONST.STEP.APPLY_TO.EVENT,
                                                $list: $eventBlock.find(EVENT_CONST.SUB_BLOCK.EDM_LIST).filter('[data-direction=' + direction + ']'),
                                                direction: direction,
                                                callback: function (keys, list, ids, edmID, eventID, widgetID) {
                                                    var direction = this.direction,
                                                        obj = {};

                                                    obj[direction === CONST.EDM.DIRECTION.response ? 'responseID' : 'edmID'] = edmID;

                                                    dataModel.get('event')({eventID: eventID}).update(obj);

                                                    callback && callback();
                                                }
                                            });
                                        }
                                        break;
                                    case 'advanceConfig':
                                        ajaxPropsBlock($e, widgetID, _eventInstance, changeHandler);
                                        break;
                                }

                                //for widgetCreator
                                //AUI.change && AUI.change(oWidget);
                            }
                        }
                    });


                $('#handler', $eventBlock).trigger('change', true);
            },
            eventAppend = function (widgetID, config) {
                var oWidget = $AW(widgetID),
                    data = $.extend({
                        handler: EVENT_CONST.OPTION[4].defaultValue,
                        namespace: ''
                    }, config, {
                        id: dataModel.getEventAccumulator(),//给IDE提供的id
                        eventID: app.getUID(), widgetID: widgetID,
                        active: true //是否生效
                    }),
                    i, item, items;

                //deal data
                if (!data.desp) {
                    data.desp = '“' + oWidget.name() + '”事件' + data.id;
                }

                data.callback = generateFuncTemp(data.handler, data.eventID, data.modal, data.deps);


                if (data.responseID) {
                    data.responseID = edmUtil.Edm.copy(data.responseID, widgetID, data.eventID, '', true, CONST.EDM.DIRECTION.response, CONST.STEP.APPLY_TO.EVENT);
                }

                if (data.requestID) {
                    data.edmID = edmUtil.Edm.copy(data.requestID, widgetID, data.eventID, '', true, CONST.EDM.DIRECTION.request, CONST.STEP.APPLY_TO.EVENT);
                    delete data.requestID;
                }

                if (!data.namespace) {
                    data.namespace = 'event' + data.id;
                }

                for (i = -1, items = VALIDATE_PARAMS; item = items[++i];) {
                    if (!data[item.name]) {
                        data[item.name] = item.defaultValue || '';
                    }
                }

                dataModel.get('event').insert(data);


                $AW.trigger($AW.STATUS.EVENT_APPEND, oWidget, data, true);
            },
            //添加事件选择器
            eventSelectorUpdate = function (widgetID, selectorList) {
                var oWidget = $AW(widgetID),
                    currentOverviewEntrance = AUI.currentOverviewEntrance,
                    eventConfig,
                    items, item, i, uuid,
                    widgetInstanceSelector,
                    mode, MODE,
                    eventCollection;

                //写入内容中
                if (oWidget.length && selectorList && selectorList.length) {
                    widgetInstanceSelector = (eventSelectorCache[widgetID] = eventSelectorCache[widgetID] || {});

                    //忽略第0个，避免将模板赋值uuid
                    for (i = 0, items = selectorList; (item = items[++i]);) {
                        if (!(uuid = item.uuid) || $.isNumeric(uuid)) {
                            uuid = item.uuid = app.getUID();
                        }

                        if (item.active !== 'true' && item.active !== true) {
                            delete widgetInstanceSelector[uuid];
                        } else if (item.name) {
                            widgetInstanceSelector[uuid] = {
                                name: item.name,
                                id: item.id,//旧版以id为准
                                selector: item.selector || '#' + item.id
                            };

                            selectorToUuidMap['###_ID## ' + widgetInstanceSelector[uuid].selector] = uuid;
                        }
                    }
                    dataModel.get('event')({widgetID: widgetID}).each(function (item) {
                        var uuid, info, selector;
                        if (item && (selector = item.selector)) {
                            if (selector in selectorToUuidMap) {
                                uuid = selectorToUuidMap[selector];
                                info = widgetInstanceSelector[uuid];
                                info && (item.selector = '###_ID## ' + (info.selector ? info.selector : ('#' + info.id)));
                            }
                        }

                    });
                }

                mode = window.auiApp.mode;
                MODE = CONST.MODE;

                if ((mode === MODE.WIDGET_CREATOR || mode === MODE.WIDGET_BUILDER || mode === MODE.VIEWER) && AUI.currentWidgetID === oWidget.id()) {

                    generateSelectorOption((eventConfig = oWidget[0].widget.event) && eventConfig.selector, widgetInstanceSelector, eventConfig.selector_type);
                }

                if (currentOverviewEntrance && currentOverviewEntrance.applyTo === 'EVENT') {
                    eventCollection = dataModel.get('event')({eventID: currentOverviewEntrance.foreignID});
                    $('#entranceConfigCtn').empty();
                    eventConfigureSingle(widgetID, eventCollection.first(), $('#entranceConfigCtn'));
                }
            };


        //加载数据
        eventHTMLTemp = generateHTML();


        //通过代码插入事件接口
        /*  eventAppend
         *   version AUI2 4.2
         *
         *              @widgetID            String      widgetID
         *              @option              Object      其他数据
         *              {
         *                @desp               String      事件描述
         *                @type               String      触发条件
         *                @selector           String      触发范围
         *                @namespace          String      触发空间，命名空间（多个空间是，使用空格隔开）
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
         *                  //handler===$AW.EVENT_HANDLER.MODAL or code has other WidgetID
         *                 modal       @String      widgetID
         *              }
         *
         * */

        //添加事件选择器
        /*eventSelectorUpdate
         *   version: AUI2 v4.2
         *   log: 新版event selector 新增， 增加除id以外的selector的处理
         *   author:lijiancheng@agree.com.cn
         * */


        return {
            Event: Event,
            eventConfigure: eventConfigure,
            eventConfigureSingle: eventConfigureSingle,
            eventAppend: eventAppend,
            eventSelectorUpdate: eventSelectorUpdate
        }
    });
})();