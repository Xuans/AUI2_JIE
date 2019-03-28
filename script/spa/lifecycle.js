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
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "index", "const", "template", "edm", "Model.Data"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, AUI, CONST, artTemplate, edmUtil, dataModel) {
        "use strict";

        //变量定义

        var LIFECYCLE_TEXT = CONST.LIFECYCLE.LIFECYCLE_TEXT,
            TEMPLATE_TYPE = 'eventBlock',
            LIFE_CYCLE_ITEM_CLASS_SELECTOR = '.sortable-li',
            LIFE_CYCLE_SINGLE_ITEM_CLASS_SELECTOR = '[data-lcid]',
            LIST_SELECTOR = 'ul',

            CODE_SELECTOR = 'code',
            CLOCK_SELECTOR = 'clock',
            IMMEDIATE_SELECTOR = 'immediate',
            IS_PAUSE_SELECTOR = 'isPause',
            IS_RESUME_SELECTOR = 'isResume',
            IS_BEFORE_INSTANCE_SELECTOR = 'isBeforeInstance',
            TIMES_SELECTOR = 'times',
            LOAD_SELECTORS = ['#isResume'].join(','),
            CLOCK_SELECTORS = ['#clock', '#immediate', '#isPause', '#times'].join(','),
            DESP_SELECTOR = 'desp',

            SWITCHER_CLASS = 'aui-switch-input',

            //validate
            EDM_PARAMS = CONST.EDM.VALIDATE.LIST,

            //edm
            REQUEST = CONST.EDM.DIRECTION.request,
            RESPONSE = CONST.EDM.DIRECTION.response,

            EDM_BLOCK_SELECTOR = '[data-role="edmBlock"]',//,[data-role="ajaxProps"]
            EDM_BLOCK_RESPONSE_SELECTOR = '[data-direction="' + RESPONSE + '"]',
            EDM_BLOCK_REQUEST_SELECTOR = '[data-direction="' + REQUEST + '"]',
            EDM_LIST_SELECTOR = '[data-role="edmList"]',
            ADVANCE_SELECTOR = '[data-event-role=advanceBlock]',
            AJAX_PROPS_SELECTOR = '[data-role=ajaxProps]',


            lifecycleBlockTemp = [
                '<div class="aui-config-block aui-event-block" data-lcid="_lifecycleID_">',
                // '<div class="aui-event-ttl" data-role="eventTitle" title="_desp_"><span class="aui-ttl">_desp_</span></div>',
                '<div class="aui-event-ctt">_codeListHTML_</div>',
                '</div>'
            ].join(''),
            PATH_DIVIDER = '_',
            SPA_ECHO = 'echo',
            SPA_AJAX = 'ajax',
            SPA_LOAD = 'load',
            PAGE_INIT = 'init',

            COMMON_PARAMS = [{
                type: 'string_input',
                desp: LIFECYCLE_TEXT.ACTION.DESP,
                details: '操作事件名称',
                name: DESP_SELECTOR,
                domSelector: DESP_SELECTOR
            }, {
                type: 'string_select',
                domSelector: CODE_SELECTOR,
                name: CODE_SELECTOR,
                desp: LIFECYCLE_TEXT.ACTION.CODE,
                details: '执行的代码',
                valueArray: ['', 'echo'],
                despArray: ['自定义', '从缓存回显']
            }, {
                type: 'string_input',
                desp: LIFECYCLE_TEXT.ACTION.CLOCK + '（ms）',
                name: CLOCK_SELECTOR,
                details: '超时时间或轮询时间',
                domSelector: CLOCK_SELECTOR,
                value: 1000
            }, {
                type: 'boolean',
                desp: LIFECYCLE_TEXT.ACTION.IMMEDIATE,
                details: '页面初始化时是否直接执行代码不用等待时钟超时',
                domSelector: IMMEDIATE_SELECTOR,
                name: IMMEDIATE_SELECTOR,
                value: "false"
            }, {
                type: 'boolean',
                desp: LIFECYCLE_TEXT.ACTION.IS_PAUSE,
                details: '切出页面时暂停轮询',
                name: IS_PAUSE_SELECTOR,
                domSelector: IS_PAUSE_SELECTOR,
                value: "true"
            }, {
                type: 'boolean',
                desp: LIFECYCLE_TEXT.ACTION.IS_RESUME,
                details: '切入页面时调用该生命周期配置',
                name: IS_RESUME_SELECTOR,
                domSelector: IS_RESUME_SELECTOR,
                value: false
            },
                {
                    type: 'boolean',
                    desp: LIFECYCLE_TEXT.ACTION.IS_BEFORE_INSTANCE,
                    details: '组件实例化前调用生命周期',
                    name: IS_BEFORE_INSTANCE_SELECTOR,
                    domSelector: IS_BEFORE_INSTANCE_SELECTOR,
                    value: false
                },
                {
                    type: 'string_input',
                    desp: LIFECYCLE_TEXT.ACTION.TIMES,
                    details: '轮询执行次数，当为0时表示页面生命周期内不断执行',
                    placeholder: '当为0时表示页面生命周期内不断执行',
                    name: TIMES_SELECTOR,
                    domSelector: TIMES_SELECTOR,
                    value: 0
                }],
            Lifecycle = (function () {
                var lifecycle = function (lifecycleIDs) {
                    return new lifecycle.fn.init(lifecycleIDs);
                };

                lifecycle._params = function (lifecycleID) {
                    var params = {
                        lifecycleID: lifecycleID,
                        dataCollection: dataModel.get('lifecycle')({lifecycleID: lifecycleID})
                    };

                    params.data = params.dataCollection.first();

                    return params.data ? params : {};
                };

                lifecycle.fn = lifecycle.prototype = {

                    constructor: lifecycle,
                    length: 0,
                    version: 'AUI 4.2',

                    init: function (lifecycleIDs) {
                        var context = this;

                        if (lifecycleIDs && lifecycleIDs.length) {
                            lifecycleIDs.map(function (lifecycleID) {
                                context._push(lifecycle._params(lifecycleID));
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
                            elem && elem.lifecycleID && ids.push(elem.lifecycleID);
                        });

                        return ids;
                    },
                    _push: Array.prototype.push,
                    _splice: Array.prototype.splice,
                    _concat: Array.prototype.concat,
                    _map: Array.prototype.map
                };

                lifecycle.fn.init.prototype = lifecycle.fn;

                return lifecycle;
            }()), lifecycleBlockHTMLTemp;


        //方法定义
        function getLifecycleBlock() {
            var params, i, item,
                html = [];

            for (i = -1, params = COMMON_PARAMS; (item = params[++i]);) {
                html.push(artTemplate(item.type, item));
            }

            //request
            html.push('<div class="aui-event-sub-ctt" data-role="edmBlock" data-direction="' + REQUEST + '">'
                + artTemplate('edmBlock', {
                    title: '传输字段',
                    direction: REQUEST,
                    isEvent: true
                }) + '</div>');

            //response
            html.push('<div class="aui-event-sub-ctt" data-role="edmBlock" data-direction="' + RESPONSE + '">'
                + artTemplate('edmBlock', {
                    title: '返回字段',
                    direction: RESPONSE,
                    isEvent: true
                }) + '</div>');


            html.push(CONST.TEMP.EVENT_ADVANCE);
            // html.push('<div class="aui-event-ctt" data-role="ajaxProps">');
            //
            // params = EDM_PARAMS;
            // for (i = -1; (item = params[++i]);) {
            //     html.push(artTemplate(item.type, item));
            // }
            //
            // html.push('</div>');

            return lifecycleBlockTemp.replace(/_codeListHTML_/,
                html.join(''));
        }

        function ajaxPropsBlock($el, lifecycleInstance) {
            var lifecycleID=lifecycleInstance.lifecycleID,
                html = [], params, i, item;

            html.push('<div class="aui-event-ctt" data-role="ajaxProps">');

            params = EDM_PARAMS;
            for (i = -1; (item = params[++i]);) {
                html.push(artTemplate(item.type, item));
            }

            html.push('</div>');

            app.popover({
                $elem: $el,
                title: '高级配置',
                content: '',
                width: '60%',
                height: '80%',
                // focusable: false,
                init: function () {

                    var $popoverBody = $(this).find('.aweb-popover-body'), i, prop;

                    $popoverBody.addClass('aui-config-ctn').empty().append(html.join(''));
                    //恢复ajax属性上次的值
                    for (i = EDM_PARAMS.length; prop = EDM_PARAMS[--i];) {
                        $('#' + prop.name, $popoverBody).val(lifecycleInstance[prop.name]);
                    }

                    $('.' + SWITCHER_CLASS, $popoverBody).each(function () {
                        var $this = $(this);

                        if (!$this.attr('data-wrap')) {

                            AUI.auiSwitch($(this), lifecycleInstance[this.id] !== false || false, function (event, data) {
                                var newValue = {};

                                newValue[this.id] = data;

                                change(lifecycleID, null, AJAX_PROPS_SELECTOR, null, newValue, this.id,true,true);

                            });
                        }

                        $popoverBody
                            .off('.ajaxProp')
                            .on({
                                'change.ajaxProp': function (e, isTrigger) {
                                    change(lifecycleID, $(e.target || event.srcElement), AJAX_PROPS_SELECTOR,null, '', '', false,true);
                                }
                            })
                    });



                },
                confirmHandler: function () {
                    $AW.trigger($AW.STATUS.PREVIEW_FRESH);
                }
            })

        }
        function getLifecycleApiMap(actions) {
            var i, item,
                map = {};

            for (i = -1; (item = actions[++i]);) {
                item.code = item.code.replace(/\"/g, "'");
                if (!item.code && item.deps === SPA_AJAX) {
                    item.code = SPA_AJAX;
                }
                map[item.code] = item;
            }

            return map;
        }

        function getCodeOption(map, spaAction, pageAction) {
            var html = [], code, action,
                spaRegex = new RegExp('\\b' + spaAction + '\\b'),
                pageRegex = new RegExp('\\b' + pageAction + '\\b');

            if (SPA_LOAD === spaAction) {
                for (code in map) {
                    if (map.hasOwnProperty(code)) {
                        action = map[code];

                        if (spaRegex.test(action.spaLife) && pageRegex.test(action.pageLife)) {
                            html.push('<option value="' + code + '">' + action.desp + '</option>');
                        }
                    }
                }
            } else {
                for (code in map) {
                    if (map.hasOwnProperty(code)) {
                        action = map[code];

                        if (spaRegex.test(action.spaLife)) {
                            html.push('<option value="' + code + '">' + action.desp + '</option>');
                        }
                    }
                }
            }

            return html.length ? ('<optgroup label="组件内部接口">' + html.join('') + '</optgroup>') : '';
        }

        //add method
        function insertLifecycleInstance() {
            var lifecycleCollection = dataModel.get('lifecycle')({lifecycleID: this.lifecycleID}),
                lifecycleInstance,
                selector = '#' + ['collapse', this.spaAction, this.pageAction].join(PATH_DIVIDER);

            if (lifecycleInstance = lifecycleCollection.first()) {
                //修改数据模型
                lifecycleCollection.update({active: true});
                //修改界面中
                $(selector, this.contextID).append(artTemplate(TEMPLATE_TYPE, lifecycleInstance));

                $AW.trigger($AW.STATUS.LIFECYCLE_APPEND, $AW(lifecycleInstance.widgetID), lifecycleInstance);
            }


        }

        function removeLifecycleInstance() {
            var lifecycleIns, lifecycleCollection = dataModel.get('lifecycle')({lifecycleID: this.lifecycleID});

            if (lifecycleIns = lifecycleCollection.first()) {
                //修改数据模型
                lifecycleCollection.update({active: false});

                //修改界面中
                $('[data-id=' + this.lifecycleID + ']', this.contextID).remove();


                $AW.trigger($AW.STATUS.LIFECYCLE_DELETE, $AW(lifecycleIns.widgetID), lifecycleIns);

                return lifecycleIns;
            }
        }

        //change method
        function change(lifecycleID, $target, contextID, callback, newValue, actionID, notInStep,noResume) {
            var lifecycleCollection = dataModel.get('lifecycle')({lifecycleID: lifecycleID}),
                lifecycleInstance,
                oldValue, executeDesp,
                oWidget, map,
                i, item;

            if (!actionID) {
                actionID = $target.attr('id');
                newValue = {};
                newValue[actionID] = $target.val();
            }

            lifecycleInstance = lifecycleCollection.first();

            oldValue = $.extend(true, {}, lifecycleInstance);
            delete oldValue.___id;
            delete oldValue.___s;

            oWidget = $AW(lifecycleInstance.widgetID);
            map = getLifecycleApiMap(oWidget[0].widget.action);


            switch (actionID) {
                case CODE_SELECTOR:
                    executeDesp = LIFECYCLE_TEXT.ACTION.CODE;
                    if (map[newValue.code] && map[newValue.code].deps === SPA_AJAX) {
                        newValue.isEDM = true;//编译时做标记
                        newValue.url = lifecycleInstance.url || AUI.getForeignKey(CONST.REGEX.TYPE.URL, lifecycleInstance.lifecycleID);
                    } else {
                        newValue.isEDM = false;
                        newValue.url = '';
                    }
                    newValue.order = map[newValue.code] && map[newValue.code].order;

                    newValue.handlerText = $target.find('[value="' + newValue.code + '"]').text();

                    break;
                default:
                    if (actionID) {
                        executeDesp = LIFECYCLE_TEXT.ACTION[actionID.toUpperCase()];
                    }
                    break;
            }


            lifecycleCollection.update(newValue);

            if (!notInStep) {
                if (!executeDesp) {
                    for (i = EDM_PARAMS.length; item = EDM_PARAMS[--i];) {
                        if (item.name === actionID) {
                            executeDesp = item.desp;
                            break;
                        }
                    }
                }
            }

            if(!noResume){
                resume(lifecycleCollection.first(), contextID, callback);
            }else{
                $AW.trigger($AW.STATUS.PREVIEW_FRESH)
            }


            // AUI.change && AUI.change(oWidget);


        }

        function resume(lifecycleInstance, contextID, callback) {
            var $item, $edm, $code,
                oWidget = $AW(lifecycleInstance.widgetID),
                map = getLifecycleApiMap(oWidget[0].widget.action),
                action,
                i, prop,
                code, codeText,
                matchCount,
                codeMap = {};

            lifecycleInstance.pageAction = lifecycleInstance.pageAction || PAGE_INIT;


            $item = $(lifecycleBlockHTMLTemp.replace(/_lifecycleID_/, lifecycleInstance.lifecycleID));
            $(contextID).empty().append($item);

            //resume value
            $('#' + DESP_SELECTOR, $item).val(lifecycleInstance.desp);

            code = lifecycleInstance.code = (!lifecycleInstance.code && lifecycleInstance.url ? SPA_AJAX : lifecycleInstance.code || '').trim();//修复异步加载时code为空的情况
            code = code.replace(/;$/, '');
            matchCount = 0;
            codeText = '';

            $code = $('#' + CODE_SELECTOR, $item)
                .append(getCodeOption(map, lifecycleInstance.spaAction, lifecycleInstance.pageAction));

            code && $code.find('option').each(function () {
                var $option = $(this),
                    _value = $option.attr('value'),
                    value = (_value || '').trim();

                if (
                    value &&
                    (value === code ||
                    value.indexOf(code) !== -1 ||
                    code.indexOf(value) !== -1)
                ) {
                    matchCount += 1;
                    code = _value;
                    codeText = $option.text();
                }
            });
            code = matchCount ? code : lifecycleInstance.code;

            $code.val(code);

            if (!lifecycleInstance.handlerText) {
                lifecycleInstance.handlerText = codeText;

                dataModel.get('lifecycle')({lifecycleID: lifecycleInstance.lifecycleID}).update({handlerText: lifecycleInstance.handlerText});
            }

            $edm = $item.find(EDM_BLOCK_SELECTOR);
            if (!((action = map[code]) && action.deps === SPA_AJAX)) {
                $edm.addClass('hide');
                $(ADVANCE_SELECTOR).addClass('hide');

                if (code === SPA_ECHO) {
                    $edm.filter(EDM_BLOCK_RESPONSE_SELECTOR).removeClass('hide');

                    //resume
                    if (lifecycleInstance.responseID) {
                        edmUtil.edmUpdateDataModelList({
                            widgetID: lifecycleInstance.widgetID,
                            foreignID: lifecycleInstance.lifecycleID,
                            edmID: lifecycleInstance.responseID,
                            applyTo: CONST.STEP.APPLY_TO.LIFECYCLE,
                            $list: $edm.filter(EDM_BLOCK_RESPONSE_SELECTOR).find(EDM_LIST_SELECTOR),
                            direction: RESPONSE,
                            callback: function (keys, list, ids, edmID, lifecycleID) {
                                dataModel.get('lifecycle')({lifecycleID: lifecycleID}).update({responseID: edmID});
                            }
                        });
                    }
                }

            } else {

                if (SPA_AJAX !== code) {
                    $edm.filter(EDM_BLOCK_RESPONSE_SELECTOR).addClass('hide');
                }

                //resume
                if (lifecycleInstance.edmID) {
                    edmUtil.edmUpdateDataModelList({
                        widgetID: lifecycleInstance.widgetID,
                        foreignID: lifecycleInstance.lifecycleID,
                        edmID: lifecycleInstance.edmID,
                        applyTo: CONST.STEP.APPLY_TO.LIFECYCLE,
                        $list: $edm.filter(EDM_BLOCK_REQUEST_SELECTOR).find(EDM_LIST_SELECTOR),
                        direction: REQUEST,
                        callback: function (keys, list, ids, edmID, lifecycleID) {
                            dataModel.get('lifecycle')({lifecycleID: lifecycleID}).update({edmID: edmID});
                        }
                    });
                }

                if (lifecycleInstance.responseID) {
                    edmUtil.edmUpdateDataModelList({
                        widgetID: lifecycleInstance.widgetID,
                        foreignID: lifecycleInstance.lifecycleID,
                        edmID: lifecycleInstance.responseID,
                        applyTo: CONST.STEP.APPLY_TO.LIFECYCLE,
                        $list: $edm.filter(EDM_BLOCK_RESPONSE_SELECTOR).find(EDM_LIST_SELECTOR),
                        direction: RESPONSE,
                        callback: function (keys, list, ids, edmID, lifecycleID) {
                            dataModel.get('lifecycle')({lifecycleID: lifecycleID}).update({responseID: edmID});
                        }
                    });
                }
            }

            if (SPA_LOAD !== lifecycleInstance.spaAction || PAGE_INIT !== lifecycleInstance.pageAction) {
                $(LOAD_SELECTORS, $item).parent().addClass('hide');
            }

            if (SPA_LOAD !== lifecycleInstance.spaAction || lifecycleInstance.pageAction === PAGE_INIT) {
                $(CLOCK_SELECTORS, $item).parent().addClass('hide');
            } else {
                $(CLOCK_SELECTORS, $item).each(function () {
                    var $this = $(this);

                    $this.val(lifecycleInstance[this.id] || '');
                });
            }

            //恢复ajax属性上次的值
            for (i = EDM_PARAMS.length; prop = EDM_PARAMS[--i];) {
                $('#' + prop.name, $item).val(lifecycleInstance[prop.name]);
            }


            if (lifecycleInstance.isResume === undefined) {
                lifecycleInstance.isResume = false;
            }
            $('.' + SWITCHER_CLASS, $item).each(function () {
                var $this = $(this);

                if (!$this.attr('data-wrap')) {
                    AUI.auiSwitch($(this), lifecycleInstance[this.id] !== false || false, function (event, data) {
                        var newValue = {};

                        newValue[this.id] = data;

                        change(lifecycleInstance.lifecycleID, null, contextID, callback, newValue, this.id);

                        callback && callback();
                    });
                }
            });
        }

        //初始化
        lifecycleBlockHTMLTemp = getLifecycleBlock();

        //对外事件定义
        //生命周期配置
        // AUI.lifecycleConfig =
        function lifecycleConfig($context, widget, setTabVisible) {
            var actions = widget[0].widget.action,
                contextID, widgetID,
                html = [], map = {},
                SPA = LIFECYCLE_TEXT.SPA, key, value, content;

            setTabVisible(true);


            //resume data
            for (key in SPA) {
                if (SPA.hasOwnProperty(key)) {
                    value = {
                        desp: SPA[key],
                        domSelector: key,
                        collapse: false
                    };


                    value = html[html.length] = map[key] = [artTemplate('array', value)];
                }
            }

            dataModel.get('lifecycle')({widgetID: widget.id(), active: true}).each(function (lifecycleInstance) {
                var key;

                lifecycleInstance.pageAction = lifecycleInstance.pageAction || PAGE_INIT;

                key = lifecycleInstance.spaAction + PATH_DIVIDER + lifecycleInstance.pageAction;

                map[key].push(artTemplate(TEMPLATE_TYPE, lifecycleInstance));

            });

            for (key = -1, content = ''; value = html[++key];) {
                content += value.join('') + '</ul></div></div></div>';
            }

            $context.empty().append(content);
            $context.find('a').off();

            contextID = '#' + $context.attr('id');
            widgetID = widget.id();


            //listener
            $(CONST.PAGE.CONFIGURE_FRAME.LIFECYCLE.CTN).off('.auiConfigure').on({

                //添加点击事件
                'click.auiConfigure': function (e) {
                    var $target = $(e.target || window.event.srcElement).closest('[data-event-role]'),
                        $lcItem,
                        role = $target.attr('data-event-role'),
                        path, desp,
                        eventAccumulator, lifecycleID, lifecycleInstance,
                        spaAction, pageAction,
                        i, item, items;

                    switch (role) {
                        //添加
                        case 'add_block':
                            path = $target.attr('id');

                            $target.prev().children().removeClass('collapsed');
                            $('#collapse_' + path).addClass('in').css('height', 'auto');

                            path = path && path.split(PATH_DIVIDER);
                            spaAction = path[0];
                            pageAction = path[1];


                            lifecycleID = app.getUID();
                            eventAccumulator = dataModel.getEventAccumulator();
                            desp = widget.name() + SPA[spaAction + PATH_DIVIDER + pageAction] + eventAccumulator;

                            //插入数据模型中
                            lifecycleInstance = {
                                id: eventAccumulator,
                                widgetID: widgetID,//fk
                                lifecycleID: lifecycleID,//pk
                                spaAction: spaAction,// load|pause|resume|unload
                                pageAction: pageAction,  //  init|interval|timeout
                                active: true,    // true|false
                                code: '',        // apis
                                url: '',
                                isEDM: false,
                                desp: desp,
                                clock: 1000,         //  unit ms
                                time: 0,
                                order: '',
                                immediate: false,
                                isPause: true,
                                isResume: false,
                                isBeforeInstance: false
                            };
                            for (i = -1, items = EDM_PARAMS; item = items[++i];) {
                                lifecycleInstance[item.name] = item.defaultValue || '';
                            }

                            dataModel.get('lifecycle').insert(lifecycleInstance);

                            insertLifecycleInstance.call({
                                widgetID: widgetID,
                                lifecycleID: lifecycleID,
                                contextID: contextID,
                                spaAction: spaAction,
                                pageAction: pageAction
                            });


                            break;
                        case 'del_block':
                            $lcItem = $target.closest(LIST_SELECTOR);
                            path = $lcItem.attr('id');
                            path = path && path.split(PATH_DIVIDER);
                            spaAction = path[0];
                            pageAction = path[1];


                            lifecycleID = $target.closest(LIFE_CYCLE_ITEM_CLASS_SELECTOR).attr('data-id');

                            //修改界面
                            lifecycleInstance = removeLifecycleInstance.call({
                                widgetID: widgetID,
                                lifecycleID: lifecycleID,
                                contextID: contextID,
                                spaAction: spaAction,
                                pageAction: pageAction
                            });

                            break;
                        case 'overview':
                            $lcItem = $target.closest(LIST_SELECTOR);
                            path = $lcItem.attr('id');
                            path = path && path.split(PATH_DIVIDER);
                            spaAction = path[0];
                            pageAction = path[1];
                            AUI.openPage(CONST.PAGE.OVERVIEW_FRAME.SELF, function () {
                                $AW.trigger($AW._STATUS.OVERVIEW_FRAME.SHOW, {
                                    widgetID: widget.id(),
                                    foreignID: $target.closest(LIFE_CYCLE_ITEM_CLASS_SELECTOR).attr('data-id'),
                                    applyTo: CONST.STEP.APPLY_TO.LIFECYCLE,
                                    spaAction: path[1],
                                    pageAction: path[2]
                                })
                            });

                            break;
                    }
                }
            });
        }

        // AUI.lifecycleConfigSingle =
        function lifecycleConfigSingle(widgetID, lifecycleInstance, $body, callback) {
            var lifecycleID = lifecycleInstance.lifecycleID,
                contextID = '#' + $body.attr('id');

            resume(lifecycleInstance, contextID);


            $body
                .off('.auiConfigure')
                .on({
                    //添加点击事件
                    'click.auiConfigure': function (e) {
                        var $target = $(e.target || event.srcElement).closest('[data-role]'),
                            $edm,
                            $lcItem,
                            role = $target.attr('data-role'),
                            item, direction;

                        switch (role) {
                            //edm配置
                            case 'edm':
                                $lcItem = $target.closest(LIFE_CYCLE_SINGLE_ITEM_CLASS_SELECTOR);

                                item = dataModel.get('lifecycle')({lifecycleID: $lcItem.attr('data-lcid')}).first();

                                if (item) {
                                    $edm = $target.closest(EDM_BLOCK_SELECTOR);
                                    direction = $edm.attr('data-direction');

                                    if (direction) {
                                        edmUtil.edmConfig({
                                            widgetID: widgetID,
                                            foreignID: item.lifecycleID,
                                            edmID: item[direction === REQUEST ? 'edmID' : 'responseID'],
                                            applyTo: CONST.STEP.APPLY_TO.LIFECYCLE,
                                            $list: $edm.find(EDM_LIST_SELECTOR),
                                            direction: direction,
                                            callback: function (keys, list, ids, edmID, lifecycleID) {
                                                var obj = {};

                                                if (this.direction) {
                                                    obj[this.direction === REQUEST ? 'edmID' : 'responseID'] = edmID;

                                                    dataModel.get('lifecycle')({lifecycleID: lifecycleID}).update(obj);

                                                    callback && callback({
                                                        type: direction
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }

                                break;

                            case 'advanceConfig':
                                ajaxPropsBlock($target, dataModel.get('lifecycle')({'lifecycleID':lifecycleID}).first());
                                break;
                        }
                    },
                    //监听api选择更改
                    'change.auiConfigure': function (e) {
                        var $e = $(e.target || event.srcElement),
                            key = $e.attr('id'), $lifecycleItem, value;

                        change(lifecycleID, $e, contextID, callback);

                        if (key === 'desp') {
                            if ($lifecycleItem = $(CONST.PAGE.CONFIGURE_FRAME.LIFECYCLE.CTT).find('[data-id=' + lifecycleID + ']')) {
                                value = $e.val();
                                $lifecycleItem.attr('title', value);
                                $lifecycleItem.find('[data-event-role=overview]').text(value);
                                $AW.trigger($AW._STATUS.OVERVIEW_FRAME.NAME, value);
                                $AW.trigger($AW.STATUS.LIFECYCLE_UPDATE, $AW(lifecycleInstance.widgetID), lifecycleInstance)
                            }
                        }
                        callback && callback({
                            type: key
                        });
                    }
                });

            $('#code', $body).trigger('change', true);

        }

        //添加生命周期
        // AUI.lifecycleAppend =
        function lifecycleAppend(widgetID, config) {
            var oWidget = $AW(widgetID),
                desp = oWidget.name() + LIFECYCLE_TEXT.SPA[config.spaAction + PATH_DIVIDER + config.pageAction],
                data = $.extend({
                    spaAction: SPA_LOAD,// load|pause|resume|unload
                    pageAction: PAGE_INIT,  //  init|interval|timeout
                    code: '',        // apis
                    url: '',
                    isEDM: false,
                    desp: desp,
                    clock: 1000,         //  unit ms
                    time: 0,
                    order: '',
                    immediate: false,
                    isPause: true,
                    isResume: false,
                    //validate
                    //validate
                    validate: EDM_PARAMS[1].defaultValue,
                    validateContinue: EDM_PARAMS[2].defaultValue,
                    validateErrorCallback: EDM_PARAMS[3].defaultValue
                }, config, {
                    id: dataModel.get('eventAccumulator'),//给IDE提供的id
                    lifecycleID: app.getUID(), widgetID: widgetID,
                    active: true //是否生效
                }),
                i, item, items;

            if (data.deps === SPA_AJAX) {
                data.isEDM = true;//编译时做标记

                data.url = AUI.getForeignKey(CONST.REGEX.TYPE.URL, data.lifecycleID);
            }

            if (data.responseID) {
                data.responseID = edmUtil.Edm.copy(data.responseID, widgetID, data.lifecycleID, '', true, CONST.EDM.DIRECTION.response, CONST.STEP.APPLY_TO.LIFECYCLE);
            }

            if (data.requestID) {
                data.edmID = edmUtil.Edm.copy(data.requestID, widgetID, data.lifecycleID, '', true, CONST.EDM.DIRECTION.request, CONST.STEP.APPLY_TO.LIFECYCLE);
                delete data.requestID;
            }

            for (i = -1, items = EDM_PARAMS; item = items[++i];) {
                if (!data[item.name]) {
                    data[item.name] = item.defaultValue || '';
                }
            }

            dataModel.get('lifecycle').insert(data);


            //  $AW.trigger(LIFECYCLE_APPEND_TYPE);
        }

        //生命周期对象


        return {
            Lifecycle: Lifecycle,
            lifecycleConfig: lifecycleConfig,
            lifecycleConfigSingle: lifecycleConfigSingle,
            lifecycleAppend: lifecycleAppend

        }
    });
})();