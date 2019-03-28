/*!
 * Javascript library v3.0
 *
 * Date: 2017.09.01 重写
 */

/**
 * @author quanyongxu@cfischina.com
 */
( /* <global> */ function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "index", "const", "template", 'config.css', 'Model.Data', 'bundle', 'vue', 'edm', 'event', 'uglifyjs'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, AUI, CONST, artTemplate, cssConfig, dataModel, bundle, Vue, edmUtil, eventUtil) {
        "use strict";

        var worker = new Worker("worker.js");
        //

        var vueManage = {},
            domManage = {},
            requirePanelList = [],
            eventAccumulatorMap = {},
            cssdb = app.taffy(cssConfig),
            auiJSEditor,
            BASE_CONST = {
                CONFIG_BLOCK: 'aui-config-block',
                TEXT_TAG_ITEM: 'text-tag-item',
                EDM_LIST: 'ul[data-role="edmList"]',
                EDM_TEMPLATE: CONST.EDM.VALIDATE.WIDGET,
                REAL_REGULAR: /^[-+]?\d+(\.\d+)?/g
            },
            ADVANCE = CONST.WIDGET.ADVANCE,
            //  ADVANCE=ADVANCE+'_value',
            baseVueHandler = {
                swapComponent: function () {

                },

                objAdd: function () {

                }
            },

            getJsEditor = function () {
                if (!auiJSEditor) {
                    auiJSEditor = AUI.vscode.create(
                        $(CONST.PAGE.CONFIGURE_FRAME.OPTION.BASIC_EDITOR, CONST.PAGE.CONFIGURE_FRAME.OPTION.CTN), {
                            value: '',
                            language: 'javascript',
                            readOnly: true
                        });
                }

                return auiJSEditor;
            },
            css;

        bundle.install(Vue);


        window.vueManage = vueManage;
        window.domManage = domManage;
        window.requirePanelList = requirePanelList;


        Vue.directive('div', {
            inserted: function (el, binding) {
                var el = el,
                    binding = binding,
                    $div = $(el),
                    editor, cache,
                    bindingValue = binding.value,
                    optionItem = bindingValue.option,
                    itemValue = bindingValue.value,
                    instanceObj = bindingValue.obj,
                    optionName = bindingValue.name,
                    modelSelector = bindingValue.modelSelector;

                switch (optionItem.divType) {
                    case 'string_simpleHtml':

                    case 'string_html':
                    case 'template_html':
                        $div.text('');
                        break;

                    default:
                        require(['css'], function (css) {
                            css[optionItem.divType](el, binding);
                        });

                        break;
                }
            },

            update: function (el, binding) {
                var $div = $(el),
                    editor, cache,
                    bindingValue = binding.value,

                    optionItem = bindingValue.option,
                    instanceObj = bindingValue.obj,
                    itemValue = bindingValue.value,
                    optionName = bindingValue.name,
                    modelSelector = bindingValue.modelSelector;
                switch (optionItem.divType) {
                    case 'string_simpleHtml':

                    case 'string_html':
                    case 'template_html':
                        $div.text('');
                        // domManage[modelSelector].$txt.html(itemValue);
                        break;

                }
            }
        });

        Vue.directive('span', function (el, binding) {
            var $span = $(el),
                editor, cache,
                bindingValue = binding.value,

                optionItem = bindingValue.option || bindingValue.optionItem,
                itemValue = bindingValue.value,
                instanceObj = bindingValue.obj,
                optionName = bindingValue.name,
                modelSelector = bindingValue.modelSelector;

            switch (optionItem.spanType) {
                case 'icon':
                    if ($span.attr('data-role') !== 'showValue') {
                        $span.empty();
                        new Toolbox(el, {
                            "className": "aui aui-neirongqingkong",
                            "desp": "清除",
                            "callback": function () {
                                instanceObj[optionItem.name] = '';
                            }
                        })
                    } else {
                        $span.html('<i class="fa ' + itemValue + '"></i>');
                    }

                    break;
                case 'pageFlow':
                    if ($span.attr('data-role') !== 'showValue') {
                        $span.empty();
                        new Toolbox(el, {
                            "className": "aui aui-qiehuan",
                            "desp": "切换",
                            "callback": function () {
                                var typeTemp;
                                if (optionItem.oldType !== optionItem.type) {
                                    typeTemp = optionItem.oldType;
                                    optionItem.oldType = optionItem.type;
                                    optionItem.type = typeTemp;
                                }
                            }
                        })
                    } else {
                        if (cache = app.taffy(dataModel.get('pageFlow'))({
                                path: itemValue
                            }).first()) {
                            $span.text(cache.name);
                        }
                    }

                    break;
                case 'list':
                    $span.empty();
                    list(el, bindingValue);
                    break;

                case 'file':
                    if ($span.attr('data-role') !== 'showValue') {
                        $span.empty();
                        new Toolbox(el, {
                            "className": "aui aui-neirongqingkong",
                            "desp": "清除",
                            "callback": function () {
                                instanceObj[optionItem.name] = '';
                            }
                        })
                    } else {
                        $span.text(itemValue);
                    }
                    break;


                case ADVANCE:
                    $span.text('');
                    // if(!optionItem.display){
                    //     $span.text('');
                    // }else{
                    //     $span.text(itemValue);
                    // }

                    break;
                // case 'string_simpleHtml':
                // case 'string_html':
                // case 'template_html':
                default:
                    $span.text(itemValue);
                    break;
            }

        });

        Vue.directive('tooltip', function (el, binding) {
            var bindingValue = binding.value;
            if (bindingValue && bindingValue.name) {
                $(el).tooltips({

                    animation: false,
                    html: true,
                    placement: function (ui) {
                        var event = window.event,
                            $ui = $(ui);

                        $ui.addClass('hidden');
                        requestAnimationFrame(function () {
                            var $body = $('body');

                            $body.children('.tooltip').not($ui).remove();

                            $ui.css(app.position(event, $body, $ui, -10, -20)).removeClass('hidden');

                        }, 16);

                        return 'bottom';
                    },
                    title: function () {
                        return artTemplate('baseTooltip', binding.value);
                    },
                    trigger: 'hover',
                    container: 'body',
                    size: 'small'
                })
            }
        });

        Vue.directive('tab', function (el, binding) {

            var data = binding.value,
                uid = 'tabContent' + app.getUID();
            $(el).attr("id", uid);

            // <!--<base-config fromTabPanes :array="[tabItem]" :arraySelector="arraySelector + '-&#45;&#45;tabPanes-&#45;&#45;' + index " :objSelector="objSelector" :handler="handler" :obj="obj"></base-config>
            new Vue({
                el: "#" + uid,
                data: function () {
                    return {
                        data: data
                    }
                },
                template: [

                    '<base-config fromTabPanes :array="data.array" :arraySelector="data.arraySelector " :objSelector="data.objSelector" :handler="data.handler" :obj="data.obj"></base-config>'

                ].join(''),
            })
        });

        function Toolbox(el, configs) {
            this.$el = $(el);
            this.configs = [];
            this.configs.push.apply(this.configs, arguments);
            this.map = {};

            this.init = function () {
                var i, item,
                    that = this,
                    $el = this.$el, $ul;

                $el.append(artTemplate("css_tools_select", {})).css('height', 'auto');
                that.$ul = $el.find('.aui-config-tools-box ul');
                $ul = that.$ul;

                for (i = 0; item = that.configs[++i];) {
                    that.map[item.desp] = item.callback;
                    that.addTool(item);
                }

                $ul.off('.toolConfig').on('click.toolConfig', function (e) {
                    var $li = $(e.target || e.srcElement).closest('[data-event-role]'), eventRole, callback;
                    eventRole = $li.attr('data-event-role');
                    callback = that.map[eventRole];
                    $li.addClass('current');
                    $ul.removeClass('block').addClass('none');
                    callback && callback()
                });
                $el.find('.aui-config-tools-box .aui-config-tools-title')
                    .off('.toolDropDown')
                    .on({
                        'click.toolDropDown': function (e) {
                            var position, $target = $(e.target), len;

                            len = $ul.children('li').length;

                            $(CONST.WIDGET.SWAP_ROLE).find('ul').removeClass('block').addClass('none');

                            if ($ul.hasClass('block')) {
                                $ul.removeClass('block').addClass('none');
                            } else {
                                $ul.removeClass('none').addClass('block');
                                position = app.position(e, $el, $ul);
                                position.left = position.left + 80;
                                position.top = position.top + 20 * len;
                                $ul.css(position);
                                $(document).off('.toolDropDown').on('click.toolDropDown', function (e) {
                                    if (!$(e.target).closest('ul').hasClass('aui-config-tools-ul') && !$(e.target).closest('span').hasClass('aui-config-tools-title')) {
                                        $ul.removeClass('block').addClass('none');
                                    }
                                })
                            }
                        }
                    });


            };
            this.init();

        }

        Toolbox.prototype.addTool = function (config) {
            var li, $li;

            if (!this.map[config.desp]) {
                this.map[config.desp] = config.callback;
            }

            li = "<li data-event-role='_desp_'><i class='_icon_'></i>_desp_</li>"
                .replace('_desp_', config.desp)
                .replace('_icon_', config.className)
                .replace('_desp_', config.desp);

            $li = $(li);
            this.$ul.append($li);
        };

        function list(el, option, isTrigger) {
            var tools, swapObj, turnValueObj, cleanObj,
                optionItem = option.optionItem,
                instance = option.obj,
                swapCallback = function () {
                    // optionItem.oldType = optionItem.oldType ;//|| optionItem.type
                    var type = optionItem.type;


                    if (optionItem.oldType !== type) {
                        optionItem.type = optionItem.oldType;
                        optionItem.oldType = type;
                    } else {
                        instance[optionItem.name] = "";
                        optionItem.type = 'string_select';
                    }
                    setTimeout(function () {
                        if (optionItem.type === 'input_append') {
                            instance[optionItem.name] = {
                                inputValue: '',
                                selectValue: ''
                            };

                        } else {
                            instance[optionItem.name] = "";
                        }
                        if (isTrigger) {
                            $(el).trigger('listEvent');
                        }
                    }, 0);


                },
                turnValueCallback = function () {
                    var value = instance[optionItem.name];
                    if (value.inputValue && value.selectValue === 'px') {
                        instance[optionItem.name].inputValue = (parseInt(value.inputValue) / 24).toString();
                        instance[optionItem.name].selectValue = 'rem';
                    }

                    if (isTrigger) {
                        $(el).trigger('listEvent');
                    }
                },
                cleanValueCallback = function () {


                    setTimeout(function () {

                        if (optionItem.type === 'input_append' || optionItem.oldType === 'input_append') {
                            instance[optionItem.name].inputValue = '';
                            instance[optionItem.name].selectValue = '';
                        } else {
                            instance[optionItem.name] = '';
                        }
                        if (isTrigger) {
                            $(el).trigger('listEvent');
                        }
                    }, 0)
                };

            swapObj = {
                "className": "aui aui-qiehuan",
                "desp": "切换",
                "callback": swapCallback
            };
            turnValueObj = {
                "className": "aui aui-px-remzhuanhuan",
                "desp": "px->rem",
                "callback": turnValueCallback
            };
            cleanObj = {
                "className": "aui aui-neirongqingkong",
                "desp": "清空",
                "callback": cleanValueCallback
            };

            if (optionItem.canSwap === true) {
                tools = new Toolbox(el, swapObj);
                tools.addTool(cleanObj);
                if (optionItem.type === 'input_append' || optionItem.oldType === 'input_append') {
                    tools.addTool(turnValueObj);
                }
            } else {
                if (optionItem.type === 'input_append' || optionItem.oldType === 'input_append') {
                    tools = new Toolbox(el, turnValueObj);
                    tools.addTool(cleanObj);
                }
            }
            if (optionItem.type === 'file') {
                tools ? new Toolbox(el, cleanObj) : tools.addTool(cleanObj);
            }

        }

        function isResponseData(item) {
            if (item.name === 'responseData' && item.direction === 'response') {
                return true;
            }
        }

        function formatOptionCopy(optionCopy, array) {
            var name, i, cursor = -1,
                cache, objCache, objArrayCache, index, item,
                caches = [{
                    obj: optionCopy,
                    objArray: array
                }];

            while (cache = caches[++cursor]) {
                objCache = cache.obj;
                objArrayCache = cache.objArray;

                if (objArrayCache) {
                    for (index = -1; item = objArrayCache[++index];) {
                        name = item.name;
                        switch (item.type) {
                            case 'tab':
                                caches.push({
                                    obj: objCache,
                                    objArray: item.tabPanes
                                });
                                break;

                            case 'object':
                                objCache[name] && caches.push({
                                    obj: objCache[name],
                                    objArray: item.attr
                                });
                                break;

                            case 'array':

                                if (item.attrInEachElement === 'self') {
                                    item.attrInEachElement = JSON.parse(JSON.stringify(objArrayCache));
                                }

                                if (objCache[name]) {
                                    for (i = objCache[name].length; i > 0;) {
                                        caches.push({
                                            obj: objCache[name][--i],
                                            objArray: item.attrInEachElement
                                        });
                                    }
                                }
                                break;

                            case 'edmCollection':
                                if (objCache[name]) {
                                    for (i = objCache[name].elements.length; i > 0;) {
                                        caches.push({
                                            obj: objCache[name].elements[--i],
                                            objArray: item.attrInEachElement
                                        });
                                    }
                                }
                                break;

                            case 'number':
                            case 'boolean':
                                if (typeof objCache[name] === 'string' && item.type === 'boolean') {
                                    objCache[name] = true;
                                }

                                if (objCache[name] !== '') {
                                    objCache[name] = (objCache[name] !== undefined) && (objCache[name] !== '') && JSON.parse(objCache[name]);
                                }
                                break;
                        }
                    }

                }
            }
        }

        function getRequireAttrFormVueArgs(args) {
            var contextID,
                modelSelectorArr,
                vueArrSelector,
                currentItemName,
                vueItemSelector;

            modelSelectorArr = args.modelSelector.split('---');
            // widgetSelectorArr = args.arraySelector.split('---');
            contextID = modelSelectorArr.shift();

            modelSelectorArr.unshift('obj');
            modelSelectorArr.pop();
            modelSelectorArr = modelSelectorArr.map(function (item, index) {
                return "['" + item + "']";
            });
            vueItemSelector = 'vueManage.' + contextID + modelSelectorArr.join('');
            currentItemName = eval(vueItemSelector).name;

            modelSelectorArr.pop();
            vueArrSelector = 'vueManage.' + contextID + modelSelectorArr.join('');


            return getRequireAttr(JSON.parse(JSON.stringify(eval(vueArrSelector))), eval(vueItemSelector), currentItemName);
        }

        function getRequireAttr(arr, item, currentItemName) {
            var result = [],
                requireObj = item.require,

                i, len, cache;

            if (arr) {
                for (i = 0, len = arr.length; i < len; i++) {
                    if (cache = requireObj[arr[i].name]) {
                        requireObj[arr[i].name] = cache;
                    }
                    if (arr[i].desp && (arr[i].name !== currentItemName)) {
                        switch (arr[i].type) {
                            case 'string_select':
                                arr[i].despArray = arr[i].despArray || [];
                                arr[i].valueArray = arr[i].valueArray || [];
                                result.push({
                                    name: arr[i].name,
                                    desp: arr[i].desp,
                                    type: 'multiple_select',
                                    despArray: (typeof arr[i].despArray === 'string' ? JSON.parse(arr[i].despArray) : arr[i].despArray),
                                    valueArray: (typeof arr[i].valueArray === 'string' ? JSON.parse(arr[i].valueArray) : arr[i].valueArray)
                                });
                                break;

                            case 'boolean':
                                result.push({
                                    name: arr[i].name,
                                    desp: arr[i].desp,
                                    type: 'string_select',
                                    despArray: ['无', '是', '否'],
                                    valueArray: ['', 'true', 'false']
                                });
                                break;
                        }

                    }
                }
            }
            return result;
        }

        function updateConfigPage(contextID, obj) {
            /* var key;
             if (vueManage[contextID]){
             for (key in obj){
             Vue.set(vueManage[contextID].obj, key, obj[key]);
             }
             } */
        }

        //selector 实际的值是一个对象
        //dataType: obj或array
        function updateResponsiveData(arg) {
            var i, len,

                arraySelector = 'vueManage.' + arg.contextID + '.array' + arg.arraySelector,
                arrayTarget = eval(arraySelector),


                target = eval('vueManage.' + arg.contextID + '.' + arg.dataType + arg.selector),
                targetCopy = JSON.parse(JSON.stringify(target));

            arg.values = $.extend(true, [], arg.values);

            for (i = 0, len = arg.keys.length; i < len; i++) {
                targetCopy[arg.keys[i]] = arg.values[i] || '';
            }

            if (arg.arraySelector) {
                baseConfigInitInstance(targetCopy, arrayTarget, {});
            }

            for (i = 0, len = arg.keys.length; i < len; i++) {
                if (!arg.values[i] && arg.values[i] !== false) {
                    targetCopy[arg.keys[i]] = '';
                } else {
                    targetCopy[arg.keys[i]] = arg.values[i];
                }
                Vue.set(target, arg.keys[i], targetCopy[arg.keys[i]]);
            }
        }


        function getDefaultValue(instance, item) {
            var defaultValue = item.defaultValue;
            if (typeof instance[item.name] === 'number') {
                return instance[item.name];
            } else {
                if (defaultValue) {
                    if (typeof defaultValue === 'object') {
                        return JSON.stringify(defaultValue);
                    } else {
                        return defaultValue.toString();
                    }
                } else {
                    return '';
                }
            }
        }

        function removeUndefined(array) {
            var i, item, result = [];

            for (i = -1; item = array[++i];) {
                result.push(item);
            }

            return result;
        }

        function refreshWidget(oWidget, modelSelector, widgetSelector, valueChangeKey, newValue) {

            if (modelSelector) {
                modelSelector = modelSelector.replace(/instanceObj/, 'widgetInstance');
                widgetSelector = widgetSelector && widgetSelector.replace(/array/, 'widget');

                var event = {
                    type: CONST.WIDGET.EVENT_TYPE.VALUE_CHANGE,
                    target: 'option',
                    modelSelector: modelSelector,
                    widgetSelector: widgetSelector,
                    valueChangeKey: valueChangeKey,
                    newVal: newValue
                };

                $AW.trigger($AW.STATUS.WIDGET_UPDATE, oWidget, event);

                // oWidget.refresh(true, undefined, undefined, event);
            }
        }

        function normalizeObjV2(obj, objArray, withTemplate) {
            var name, i, cursor = -1,
                cache, objCache, objArrayCache,
                caches = [{
                    obj: obj,
                    objArray: objArray
                }];

            while (cache = caches[++cursor]) {
                objCache = cache.obj;
                objArrayCache = cache.objArray;

                if (objCache && objCache.active) {
                    delete objCache.active;
                }
                if (objArrayCache && objCache) {
                    $.each(objArrayCache, function (index, item) {
                        var temp;
                        name = item.name;
                        if (!name && item.type !== 'tab') {

                            delete objCache[name];
                        } else {
                            switch (item.type) {
                                case 'tab':
                                    caches.push({
                                        obj: objCache,
                                        objArray: item.tabPanes
                                    });
                                    break;

                                case ADVANCE:

                                    caches.push({
                                        obj: objCache[ADVANCE],
                                        objArray: item.array
                                    });

                                    break;
                                case 'object':
                              //  || (name==='returnValue' && objCache[name].hasOwnProperty(name) && !objCache[name].name)
                                    if (($.isEmptyObject(objCache[name]) && !item.reserve) ) {
                                        delete objCache[name];
                                    } else {
                                        objCache[name] && caches.push({
                                            obj: objCache[name],
                                            objArray: item.attr
                                        });
                                    }
                                    break;

                                case 'array':

                                    if ($.isArray(objCache[name])) {
                                        !withTemplate && objCache[name].shift();
                                        if (objCache[name].length === 0 && !item.reserve) {
                                            !withTemplate && (delete objCache[name]);
                                        } else {

                                            if (item.attrInEachElement === 'self') {
                                                item.attrInEachElement = JSON.parse(JSON.stringify(objArrayCache));
                                            }

                                            for (i = objCache[name].length; i > 0;) {
                                                temp = objCache[name][--i];
                                                if ((temp && temp.active === false) || (item.mustHave && !temp[item.mustHave])) {
                                                    objCache[name].splice(i, 1);
                                                    if (objCache[name].length === 0 && !item.reserve) {

                                                        delete objCache[name];
                                                    }
                                                } else {
                                                    caches.push({
                                                        obj: objCache[name][i],
                                                        objArray: item.attrInEachElement
                                                    });
                                                }
                                            }
                                        }
                                    }
                                    break;

                                case 'edmCollection':
                                    !withTemplate && objCache[name].elements.shift();
                                    if (objCache[name].elements.length === 0 && !item.reserve) {
                                        !withTemplate && (delete objCache[name].elements);
                                    } else {
                                        for (i = objCache[name].elements.length; i > 0;) {
                                            temp = objCache[name].elements[--i];
                                            if ((temp && temp.active === false) || (item.mustHave && !temp[item.mustHave])) {
                                                objCache[name].elements.splice(i, 1);
                                                if (objCache[name].elements.length === 0 && !item.reserve) {
                                                    delete objCache[name].elements;
                                                }
                                            } else {
                                                caches.push({
                                                    obj: objCache[name].elements[i],
                                                    objArray: item.attrInEachElement
                                                });
                                            }
                                        }
                                    }
                                    objCache[name] = {
                                        edmID: objCache[name].edmID,
                                        edmKey: objCache[name].edmKey,
                                        elements: objCache[name].elements,
                                        fields: objCache[name].fields,
                                        keys: objCache[name].keys
                                    };
                                    break;

                                case 'multiple_select':
                                    if (item.separator) {
                                        objCache[name] = objCache[name].join(item.separator);
                                    }
                                    break;

                                case 'tags_input':
                                    try {
                                        objCache[name] = JSON.parse(objCache[name].replace(/\'/g, "\""));
                                    } catch (e) {

                                    }

                                    break;

                                default:
                                    if (objCache && objCache[name]) {
                                        if (typeof objCache[name] === 'undefined' && typeof item.reserve === 'undefined') {
                                            delete objCache[name];
                                        }
                                    }


                                    break;
                            }
                        }
                    });
                }
            }

            return obj;
        }

        //instance可以是normalize处理过的或未处理过的，返回的肯定是optionCopy形式的option
        function baseConfigInitInstance(instance, array, extras, notSendEdm,noReplaceData) {
            var cache, instanceCache, arrayCache, extrasCache, cursor = -1,
                noReplaceData=noReplaceData,
                eventAccumulator = dataModel.get('eventAccumulator'), _i, _item,
                key,
                children, childrenMap,
                defaultValue,
                caches = [{
                    instance: instance,
                    array: array,
                    extras: extras
                }];

            if (extras && AUI) {
                extras.widgetID = extras.widgetID || AUI.currentWidgetID;
            }

            while (cache = caches[++cursor]) {
                instanceCache = cache.instance;
                arrayCache = cache.array;
                extrasCache = cache.extras;


                if ($.isArray(arrayCache)) {

                    $.each(arrayCache, function (i, item) {
                        var name = item.name,
                            stringifyTemp,
                            temp;

                        switch (item.type) {
                            case 'tab':
                                caches.push({
                                    instance: instanceCache,
                                    array: item.tabPanes,
                                    extras: extrasCache
                                });
                                break;

                            case 'object':

                                if (item.isRequire && extrasCache && extrasCache.instanceParentArr) {
                                    //set attr manually
                                    //at this situation, name is equal to string require
                                    item.attr = getRequireAttr(extrasCache.instanceParentArr, instanceCache);
                                } else {
                                    if (item.attr) {
                                        if (children = item.children) {
                                            childrenMap = {};
                                            for (_i = -1; _item = children[++_i];) {
                                                // if ((defaultValue = _item.defaultValue) && !(/null/i.test(defaultValue))) {
                                                //
                                                // }
                                                childrenMap[_item.name] = _item;
                                            }

                                            for (_i = -1; _item = item.attr[++_i];) {
                                                if (childrenMap.hasOwnProperty(_item.name) && (defaultValue = childrenMap[_item.name].defaultValue) && !(/null/i.test(defaultValue))) {
                                                    _item.defaultValue = defaultValue;
                                                }
                                            }
                                            // for (key in children) {
                                            //     if (children.hasOwnProperty(key) && (defaultValue = children[key].defaultValue) && !(/null/i.test(defaultValue))) {
                                            //         item.attr[key].defaultValue = defaultValue;
                                            //     }
                                            //
                                            // }
                                        }

                                        if (typeof instanceCache[name] !== 'object') {
                                            instanceCache[name] = {};
                                        }
                                        caches.push({
                                            instance: instanceCache[name],
                                            array: item['attr'],
                                            extras: extrasCache
                                        });
                                    } else {
                                        instanceCache[name] = {};
                                    }
                                }
                                break;

                            case 'array':
                                if (item['attrInEachElement']) {
                                    if ((!instanceCache[name] || ($.isArray(instanceCache[name]) && instanceCache[name].length === 0)) && item['attrInEachElement'] !== 'self') {
                                        instanceCache[name] = [];
                                        instanceCache[name].push(baseConfigInitInstance({
                                            active: 'true'
                                        }, item['attrInEachElement'], {
                                            noreplace: true,
                                            name: item.desp,
                                            widgetID: extrasCache && extrasCache.widgetID
                                        }, notSendEdm,noReplaceData));

                                        if (item.append || item.appendNumber) {
                                            if (item.appendNumber && !item.append) {
                                                for (i = 0; i < item.appendNumber; i++) {
                                                    item.append = item.append || [];
                                                    item.append.push({});
                                                }
                                            }
                                            $.each(JSON.parse(JSON.stringify(item.append)), function (index, value) {
                                                value.active = true;
                                                instanceCache[name].push(baseConfigInitInstance(value, item['attrInEachElement'], {
                                                    name: item.desp,
                                                    widgetID: extrasCache && extrasCache.widgetID,
                                                    order: index + 1,
                                                    instanceParentArr: instanceCache[name]
                                                },notSendEdm,noReplaceData));
                                            });
                                        }

                                    } else if ($.isArray(instanceCache[name]) && instanceCache[name].length > 0) {

                                        if (item['attrInEachElement'] === 'self') {
                                            item['attrInEachElement'] = JSON.parse(JSON.stringify(arrayCache));
                                        }

                                        if (!instanceCache[name][0].active) {
                                            //第一个元素的active不存在，说明已做过normalize处理
                                            instanceCache[name].unshift(baseConfigInitInstance({
                                                active: true
                                            }, item['attrInEachElement'], {
                                                noreplace: true,
                                                name: item.desp,
                                                widgetID: extrasCache && extrasCache.widgetID
                                            },notSendEdm,noReplaceData));
                                        }

                                        //对数组的每个元素进行init处理
                                        $.each(instanceCache[name], function (index, value) {
                                            value.active = (typeof value.active === 'string') ? JSON.parse(value.active) : value.active;
                                            if (value.active === undefined) {
                                                value.active = true;
                                            }
                                            if (index > 0) {

                                                baseConfigInitInstance(value, item['attrInEachElement'], {
                                                    name: item.desp,
                                                    widgetID: extrasCache && extrasCache.widgetID,
                                                    order: index,
                                                    instanceParentArr: instanceCache[name],
                                                    arrayValue: value
                                                },notSendEdm,noReplaceData);
                                            }
                                        })
                                    }
                                } else {
                                    instanceCache[name] = instanceCache[name] || [];
                                }
                                if (item.hasEvent && !noReplaceData) {
                                    if (extrasCache) {
                                        eventUtil.eventSelectorUpdate(extrasCache.widgetID, instanceCache[name]);
                                    } else {
                                        eventUtil.eventSelectorUpdate(AUI.currentWidgetID, instanceCache[name]);
                                    }
                                }
                                break;

                            case 'edmCollection':

                                if (item['attrInEachElement']) {
                                    instanceCache[name] = instanceCache[name] || {};
                                    if (!instanceCache[name].elements || instanceCache[name].elements.length === 0) {
                                        instanceCache[name].elements = [];
                                        instanceCache[name].elements.push(baseConfigInitInstance({
                                            active: true
                                        }, item['attrInEachElement'], {
                                            name: item.desp,
                                            widgetID: extrasCache && extrasCache.widgetID
                                        }, notSendEdm,noReplaceData));

                                        if (item.append) {
                                            if (item.appendNumber) {
                                                for (i = 0; i < item.appendNumber; i++) {
                                                    item.append = item.append || [];
                                                    item.append.push({});
                                                }
                                            }
                                            $.each(item.append, function (index, value) {
                                                value.active = true;
                                                instanceCache[name].elements.push($.extend(
                                                    true, {},
                                                    baseConfigInitInstance({}, item['attrInEachElement'], {
                                                        name: item.desp,
                                                        widgetID: extrasCache && extrasCache.widgetID,
                                                        order: index + 1
                                                    }, notSendEdm,noReplaceData),
                                                    value));
                                            });
                                        }

                                    } else {
                                        if (!instanceCache[name].elements[0].active) {
                                            //第一个元素的active不存在，说明已做过normalize处理
                                            instanceCache[name].elements.unshift(baseConfigInitInstance({
                                                active: true
                                            }, item['attrInEachElement'], {
                                                noreplace: true,
                                                name: item.desp,
                                                widgetID: extrasCache && extrasCache.widgetID
                                            }, notSendEdm,noReplaceData));
                                        }
                                        //对数组的每个元素进行init处理
                                        $.each(instanceCache[name].elements, function (index, value) {
                                            value.active = (typeof value.active === 'string') ? JSON.parse(value.active) : value.active;
                                            if (value.active === undefined) {
                                                value.active = true;
                                            }
                                            if (index > 0) {

                                                caches.push({
                                                    instance: value,
                                                    array: item['attrInEachElement'],
                                                    extras: {
                                                        name: item.desp,
                                                        widgetID: extrasCache && extrasCache.widgetID,
                                                        order: index
                                                    }
                                                });

                                            }
                                        });
                                    }
                                } else {
                                    instanceCache[name] = {};
                                    instanceCache[name].elements = [];
                                }

                                if (item.hasEvent && !noReplaceData) {
                                    if (extrasCache) {
                                        eventUtil.eventSelectorUpdate(extrasCache.widgetID, instanceCache[name].elements);
                                    } else {
                                        eventUtil.eventSelectorUpdate(AUI.currentWidgetID, instanceCache[name].elements);
                                    }
                                }
                                instanceCache[name].edmKey = item['edmKey'];

                                //同步edm数据
                                if (!notSendEdm && extrasCache && extrasCache.widgetID && !(auiApp.mode === CONST.MODE.WIDGET_BUILDER && AUI.currentWidgetID === CONST.WIDGET.CONFIG_WIDGET_ID)) {

                                    edmUtil.edmUpdateDataModelList({
                                        widgetID: extrasCache.widgetID,
                                        foreignID: extrasCache.widgetID,
                                        edmID: instanceCache[name].edmID,
                                        applyTo: CONST.STEP.APPLY_TO.WIDGET,
                                        direction: CONST.EDM.DIRECTION.response,
                                        callback: function (obj) {
                                            return function (keys, fields, ids, edmID, foreignID, widgetID) {
                                                obj.edmID = edmID;
                                                obj.fields = fields;
                                                obj.ids = ids;
                                                obj.keys = keys;

                                                $.each(obj.elements, function (index, value) {
                                                    if (value.active === true && index !== 0) {
                                                        value.edmKey = fields[index - 1];
                                                        value.edmItemId = ids[index - 1];
                                                    }
                                                });

                                            };
                                        }(instanceCache[name])
                                    });
                                }
                                break;

                            case 'string_select':
                                stringifyTemp = instanceCache[name] && instanceCache[name].toString();

                                if (item.group) {
                                    temp = item.group[0].valueArray ? item.group[0].valueArray[0] : '';
                                } else {
                                    temp = item.valueArray ? item.valueArray[0] : '';
                                }

                                if (typeof stringifyTemp !== 'undefined') {
                                    instanceCache[name] = stringifyTemp
                                } else {
                                    instanceCache[name] = ((typeof item.defaultValue !== 'undefined') && item.defaultValue.toString()) || temp;
                                }

                                if (name === 'data-authority') {
                                    instanceCache[name] = instanceCache[name] || '10';
                                }
                                break;

                            case 'number':
                                if (typeof instanceCache[name] !== 'number') {
                                    if (instanceCache[name] === undefined) {
                                        switch (typeof item.defaultValue) {
                                            case 'undefined':
                                                item.defaultValue = '';
                                                break;

                                            case 'string':
                                                if (item.defaultValue !== '') {
                                                    item.defaultValue = Number(item.defaultValue);
                                                }
                                                break;
                                        }
                                        instanceCache[name] = item.defaultValue;
                                    } else {
                                        if (instanceCache[name] !== '') {
                                            instanceCache[name] = (instanceCache[name] !== undefined) && (instanceCache[name] !== '') && JSON.parse(instanceCache[name]);
                                        }
                                    }
                                }
                                break;

                            case 'boolean':
                                instanceCache[name] = ((typeof instanceCache[name] !== 'undefined') && instanceCache[name].toString()) || ((typeof item.defaultValue !== 'undefined') && item.defaultValue.toString()) || 'true';
                                if (typeof instanceCache[name] !== 'boolean') {
                                    instanceCache[name] = (instanceCache[name] !== undefined) && JSON.parse(instanceCache[name]);
                                }
                                break;

                            case 'tags_input':
                                instanceCache[name] = instanceCache[name] || item.defaultValue || '';

                                if (typeof instanceCache[name] !== 'string') {
                                    instanceCache[name] = JSON.stringify(instanceCache[name]);
                                }
                                break;

                            case 'multiple_select':
                                //转化成数组

                                instanceCache[name] = instanceCache[name] || item.defaultValue;
                                if (!$.isArray(instanceCache[name])) {
                                    instanceCache[name] = (instanceCache[name] && instanceCache[name].split(item.separator || ' ')) || [];
                                }
                                break;
                            case 'comboTree':

                                if ((item.dataType === 'handler' || item.dataType === 'function') && item.defaultValue && !(/null/i.test(item.defaultValue))) {
                                    instanceCache['jsValue_' + name] = instanceCache['jsValue_' + name] || item.defaultValue || 'function(){}';
                                    instanceCache[name] = (instanceCache[name] === '') ? '' : (instanceCache[name] || 'jsEditor');
                                }
                                break;
                            default:
                                if (item.direction === 'request' || isResponseData(item)) {
                                    instanceCache[name] = instanceCache[name] || {};
                                    instanceCache[name].id = instanceCache[name].id || dataModel.getEventAccumulator();
                                    instanceCache[name].name = instanceCache[name].name || ('传输字段' + ( dataModel.getEventAccumulator()));
                                    instanceCache[name].url = instanceCache[name].url || (extrasCache && '##' + extrasCache.widgetID + '_URL_' + instanceCache[name].id + '##');
                                } else {
                                    if (!item['switch']) {

                                        switch (item.formatter) {
                                            case 'replace':

                                                // ++AUI.data.eventAccumulator;
                                                //;
                                                if ((extrasCache && !extrasCache.noreplace) || !extrasCache) {
                                                    if (instanceCache[name] !== undefined) {
                                                        switch (item.idUniqueSpace) {
                                                            case 'widget':
                                                                if (extrasCache && extrasCache.widgetID) {
                                                                    eventAccumulatorMap[extrasCache.widgetID][instanceCache[name]] = true;
                                                                    eventAccumulatorMap[instanceCache[name]] = true;
                                                                }
                                                                break;

                                                            default:
                                                                eventAccumulatorMap[instanceCache[name]] = true;
                                                                break;
                                                        }
                                                        instanceCache[name] = instanceCache[name];
                                                        if (typeof instanceCache[name] === 'string') {
                                                            if (instanceCache[name].indexOf(item.desp) !== -1) {
                                                                extrasCache && extrasCache.arrayValue && (extrasCache.arrayValue.active = false);
                                                            }
                                                        }
                                                    } else {

                                                        switch (item.idUniqueSpace) {

                                                            case 'widget':
                                                                if (extrasCache && extrasCache.widgetID) {
                                                                    while (eventAccumulator in eventAccumulatorMap[extrasCache.widgetID]) {
                                                                        eventAccumulator++;
                                                                    }
                                                                }
                                                                break;

                                                            default:
                                                                while (eventAccumulator in eventAccumulatorMap) {
                                                                    eventAccumulator++;
                                                                }
                                                                break;
                                                        }

                                                        if(!noReplaceData){
                                                            instanceCache[name] = item.defaultValue
                                                                .replace(CONST.REGEX.WIDGET.NAME, item.desp)
                                                                .replace(CONST.REGEX.WIDGET.INDEX, eventAccumulator + 1)
                                                                .replace(CONST.REGEX.FOREIGN_WIDGET.FOREIGN_WIDGET_SPILT, item.name);
                                                        }else{
                                                            instanceCache[name]=item.defaultValue;
                                                        }

                                                        dataModel.set('eventAccumulator', eventAccumulator + 2);

                                                    }


                                                } else {
                                                    instanceCache[name] = instanceCache[name] || '';
                                                }

                                                break;

                                            case 'replaceWithFunction':
                                                instanceCache[name] = instanceCache[name] || AUI.transformForeignKey(item.defaultValue, extrasCache.widgetID);
                                                break;

                                            case 'selector':

                                                if (extrasCache) {
                                                    if(!noReplaceData){
                                                        instanceCache[name] = item.defaultValue
                                                            .replace(CONST.REGEX.WIDGET.NAME, extrasCache.name)
                                                            .replace(CONST.REGEX.WIDGET.INDEX, extrasCache.order || '');
                                                    }else{
                                                        instanceCache[name]=item.defaultValue;
                                                    }


                                                } else {
                                                    instanceCache[name] = '';
                                                }
                                                break;

                                            default:
                                                if (name === 'appJsCode') {
                                                    //对appJsCode进行特殊处理
                                                    instanceCache[name] = instanceCache[name] && instanceCache[name].toString();
                                                    if (instanceCache[name]) {
                                                        if (instanceCache[name].indexOf('app.') !== 0) {
                                                            instanceCache[name] = 'app.' + instanceCache.name + '=' + instanceCache[name];
                                                        }

                                                        if ((instanceCache.belongTo === 'class' || instanceCache.belongTo === 'closure')
                                                            && instanceCache[name].substr(-2, 2) !== '()' && instanceCache[name].substr(-3, 3) !== '();') {
                                                            instanceCache[name] = instanceCache[name] + '()';
                                                        }
                                                    }
                                                } else {
                                                    if (!(typeof instanceCache[name] in {
                                                            'undefined': true,
                                                            'string': true
                                                        }) && !item.keepFormat) {
                                                        temp = JSON.stringify(instanceCache[name]);
                                                    } else {
                                                        temp = instanceCache[name] || getDefaultValue(instanceCache, item);
                                                    }
                                                    instanceCache[name] = (instanceCache[name] === '' ? '' : temp);


                                                }

                                                break;
                                        }


                                    }
                                }

                                if (typeof instanceCache[name] === 'string') {
                                    instanceCache[name] = instanceCache[name].replace(CONST.REGEX.WIDGET.ID, instanceCache.id || '');
                                }
                                break;
                        }
                    });
                }
            }

            return instance;
        } //end initInstance
        // AUI.baseConfigInitInstance = baseConfigInitInstance;


        function initWidget(objArray) {
            var cache, cursor = -1,
                item, valueArrayCache = [],
                despArrayCache = [],
                caches = $.extend([], objArray),
                ifCache, name, type, desp,
                i, len,
                //handler 专用变量
                validateList,
                validateListRequire = {
                    code: [CONST.EVENT.HANDLER.AJAX]
                },
                responseDataRequire = {
                    code: [CONST.EVENT.HANDLER.AJAX]
                },
                getOptionsFromRoleDB = function (db) {
                    var valueArray = [],
                        despArray = [];
                    db().each(function (obj, index) {
                        valueArray.push(obj["data-authority"]);
                        despArray.push(obj.name);
                    });
                    return {
                        valueArray: valueArray,
                        despArray: despArray
                    };
                },
                getCodeGroup = function () {
                    var group = [{
                        label: '组件内部接口',
                        valueArray: [],
                        despArray: []
                    }, {
                        label: '组件外部接口',
                        valueArray: [],
                        despArray: []
                    }];

                    $.each(dataModel.get('eventHandlerList'), function (index, value) {
                        if (value.code) {
                            if (value.widgetID === AUI.currentWidgetID) {
                                group[0].despArray.push(value.desp);
                                group[0].valueArray.push(value.code);
                            } else {
                                group[1].despArray.push(value.desp);
                                group[1].valueArray.push(value.code);
                            }
                        }

                        if (value.code && value.deps === 'ajax') {
                            validateListRequire.code.push(value.code);
                        }

                        if (value.code && value.code === CONST.EVENT.HANDLER.AJAX) {
                            responseDataRequire.code.push(value.code);
                        }
                    });
                    return group;
                };

            while (cache = caches[++cursor]) {
                item = cache;

                // item.name = item.name && item.name.replace(/#/g, '');

                name = item.name;
                type = item.type;
                desp = item.desp;

                switch (type) {
                    case 'tab':
                        caches = caches.concat(item.tabPanes);
                        break;

                    case 'object':
                        if ($.isArray(item.attr)) {
                            caches = caches.concat(item.attr);
                        }

                        if (item.isHandler) {
                            item.attr[0] = {
                                name: 'code',
                                type: 'string_select',
                                desp: '触发函数',
                                defaultValue: item.defaultValue,
                                valueArray: [CONST.EVENT.HANDLER.CUSTOM, CONST.EVENT.HANDLER.AJAX],
                                despArray: [CONST.EVENT.HANDLER.CUSTOM_CH, CONST.EVENT.HANDLER.AJAX_CH],
                                group: getCodeGroup()
                            }
                        }
                        break;

                    case 'array':
                    case 'edmCollection':
                        if ($.isArray(item.attrInEachElement)) {
                            caches = caches.concat(item.attrInEachElement);
                        }
                        break;

                    case 'handler':
                        validateList = JSON.parse(JSON.stringify(CONST.EDM.VALIDATE.LIST));

                        validateList.push({
                            name: 'requestData',
                            desp: '传输字段',
                            type: 'edm',
                            direction: 'request'
                        });

                        $.each(validateList, function (index, value) {
                            value.require = validateListRequire;
                        });

                        validateList.push({
                            name: 'responseData',
                            desp: '返回字段',
                            type: 'edm',
                            direction: 'response',
                            require: responseDataRequire
                        });

                        item.type = 'object';
                        item.isHandler = true;
                        item.attr = [];
                        item.attr.push({
                            name: 'code',
                            type: 'string_select',
                            desp: '触发函数',
                            defaultValue: item.defaultValue,
                            valueArray: [CONST.EVENT.HANDLER.CUSTOM, CONST.EVENT.HANDLER.AJAX],
                            despArray: [CONST.EVENT.HANDLER.CUSTOM_CH, CONST.EVENT.HANDLER.AJAX_CH],
                            group: getCodeGroup()
                        });

                        item.attr = item.attr.concat(validateList);
                        break;

                    case 'string_select_editable':
                    case 'tags_input':
                        item.type = 'string_input';
                        break;

                    case 'string_select':
                        item.defaultValue = item.defaultValue && item.defaultValue.toString();
                        if (item.valueArray) {
                            for (i = 0, len = item.valueArray.length; i < len; i++) {
                                item.valueArray[i] = item.valueArray[i] !== undefined && item.valueArray[i].toString();
                            }
                        }
                        if (item.despArray) {
                            for (i = 0, len = item.despArray.length; i < len; i++) {
                                item.despArray[i] = item.despArray[i] !== undefined && item.despArray[i].toString();
                            }
                        }

                        break;

                    case 'pageFlow':
                    case 'icon':
                    case 'string_with_placeholder':
                    case 'string_simpleHtml':
                    case 'string_html':
                    case 'template_html':
                    case ADVANCE:

                        item.type = 'configure_modal';
                        item.spanType = type;

                        break;

                    case 'configure_modal':
                        if (!item.spanType) {//第二次配置时，类型被覆盖
                            item.spanType = 'modalType';
                        }

                        break;
                    case 'file':
                        item.spanType = type;
                        break;

                    // case 'string_simpleHtml':
                    case 'string_html':
                    case 'template_html':
                        item.type = 'directive_div';
                        item.divType = type;
                        break;

                    case 'comboTree':
                        item.type = 'directive_input';
                        item.inputType = type;

                        break;

                    default:

                        if (name === 'data-authority') {
                            item.valueArray = getOptionsFromRoleDB(dataModel.get('role')).valueArray;
                            item.despArray = getOptionsFromRoleDB(dataModel.get('role')).despArray;
                        }

                        if (item.showComponentHref) {
                            dataModel.get('menu')().each(function (value, index) {
                                valueArrayCache.push(value.href);
                                despArrayCache.push(value.name + '(' + value.href + ')');
                            });

                            item.valueArray = valueArrayCache;
                            item.despArray = despArrayCache;
                        }

                        if (item.componentType) {
                            $.each(dataModel.get('menu')([{
                                category: item.componentType
                            }, {
                                pType: item.componentType
                            }]).get(), function (index, value) {
                                valueArrayCache.push(value.type);
                                despArrayCache.push(value.name);
                            });

                            item.valueArray = valueArrayCache;
                            item.despArray = despArrayCache;
                        }

                        if (item.getInterface) {
                            (function () {
                                var group = [],
                                    oWidget = $AW(AUI.currentWidgetID),
                                    widget = oWidget.option();

                                function getStandardCode(code) {
                                    return code.match(/([^.]+)$/)[0];
                                }

                                function addGroup(type) {
                                    var temp = {
                                        label: '',
                                        valueArray: [],
                                        despArray: []
                                    };


                                    switch (type) {
                                        case 'action':
                                            if ($.isArray(widget.action)) {
                                                temp.label = '生命周期';
                                                $.each(widget.action, function (index, value) {
                                                    temp.valueArray.push(getStandardCode(value.code));
                                                    temp.despArray.push(value.desp);
                                                });
                                            }
                                            break;

                                        case 'handler':
                                            if (widget.event && $.isArray(widget.event.handler)) {
                                                temp.label = '事件句柄';
                                                $.each(widget.event.handler, function (index, value) {
                                                    temp.valueArray.push(value.value);
                                                    temp.despArray.push(value.desp);
                                                });
                                            }
                                            break;

                                        case 'getter':
                                            if (widget.edm && $.isArray(widget.edm.get)) {
                                                temp.label = 'getter';
                                                $.each(widget.edm.get, function (index, value) {
                                                    temp.valueArray.push(getStandardCode(value.value));
                                                    temp.despArray.push(value.desp);
                                                });
                                            }
                                            break;

                                        case 'setter':
                                            if (widget.edm && $.isArray(widget.edm.set)) {
                                                temp.label = 'setter';
                                                $.each(widget.edm.set, function (index, value) {
                                                    temp.valueArray.push(getStandardCode(value.value));
                                                    temp.despArray.push(value.desp);
                                                });
                                            }
                                            break;

                                        case 'callback':
                                            if (widget.callback) {
                                                temp.label = '组件接口';
                                                /*if (widget.callback.config) {
                                                 temp.valueArray.push(widget.callback.config.toString());
                                                 temp.despArray.push('组件编辑阶段接口');
                                                 }*/
                                                if (widget.callback.render) {
                                                    temp.valueArray.push(widget.callback.render.toString());
                                                    temp.despArray.push('组件预览阶段接口');
                                                }
                                            }
                                            break;
                                    }
                                    temp.valueArray.length > 0 && group.push(temp);
                                }

                                addGroup('action');
                                addGroup('handler');
                                addGroup('getter');
                                addGroup('setter');
                                addGroup('callback');

                                item.group = group;

                                item.valueArray = [''];
                                item.despArray = ['无'];
                            })()
                        }

                        if (name === 'cssAttrs' && item.type === 'multiple_select') {
                            item.despArray = cssdb().get().map(function (item) {
                                return item.desp;
                            });

                            item.valueArray = cssdb().get().map(function (item) {
                                return item.name;
                            });
                        }
                        break;
                }

            }
            return objArray;
        }

        function updateWidgetOption(oWidget, widgetInstance, newOption, modelSelector, widgetSelector, valueChangeKey, newValue) {

            oWidget.update({
                optionCopy: widgetInstance.optionCopy,
                option: newOption
            });

            refreshWidget(oWidget, modelSelector, widgetSelector, valueChangeKey, newValue);

            if (oWidget[0].widget.jsEditor === 'option') {
                getJsEditor().setValue(AUI.getParsedString(UglifyJS.parse('(' + JSON.stringify(oWidget.option()) + ')')));
            }


        }


        function updateObj(instanceObj, modelSelector, newValue, updateCallback, baseArray) {
            var modelSelectorArr = modelSelector.split('---'),
                widgetSelectorArr, widgetSelector,
                key = modelSelectorArr[modelSelectorArr.length - 1];

            modelSelectorArr[0] = 'instanceObj';


            modelSelectorArr = modelSelectorArr.map(function (item, index) {
                return (index === 0) ? item : "['" + item + "']";
            });

            if (typeof newValue === 'string') {
                newValue = newValue.trim();
            }

            if (typeof baseArray === 'string') {
                //baseArray is widgetSelector

                widgetSelector = baseArray;
                widgetSelectorArr = widgetSelector.split('---');
                widgetSelectorArr[0] = 'array';
                widgetSelectorArr = widgetSelectorArr.map(function (item, index) {
                    return (index === 0) ? item : "['" + item + "']";
                });
            }

            eval(modelSelectorArr.join('') + '=newValue');


            updateCallback && updateCallback({
                newObjCopy: instanceObj,
                newObj: getCleanedOption(instanceObj, (updateCallback && updateCallback.baseArray) || baseArray),
                key: key,
                newValue: newValue,
                oldValue: updateCallback.oldValue,
                modelSelector: modelSelectorArr.join(''),
                widgetSelector: widgetSelectorArr && widgetSelectorArr.join('')
            });
            //
            // try{
            //
            // }catch(e){
            //     updateCallback && updateCallback({
            //         newObjCopy: instanceObj,
            //         newObj: getCleanedOption(instanceObj, (updateCallback && updateCallback.baseArray) || baseArray),
            //         key: key,
            //         newValue: newValue,
            //         oldValue: updateCallback.oldValue,
            //         modelSelector: modelSelectorArr.join(''),
            //         widgetSelector: widgetSelectorArr && widgetSelectorArr.join('')
            //     });
            // }


        }

        function baseConfig(contextID, baseObj, baseArray, updateCallback, isCopy) {
            var contextMainID = contextID + 'Main';

            baseArray = baseArray || [];

            //add another div to avoid unexpected dom render failure
            $('#' + contextID).empty().append('<div id="' + contextMainID + '"></div>');

            //destroy previous exisisting vue instance
            vueManage[contextID] && vueManage[contextID].$destroy();

            //pre processing array and obj
            !isCopy && baseConfigInitInstance(baseObj, baseArray);

            //attach baseArray in updateCallback
            updateCallback && (updateCallback.baseArray = JSON.parse(JSON.stringify(baseArray)));

            //call updateCallback to initialize newObj and return to the caller
            // updateCallback && updateCallback({
            // 	newObjCopy: baseObj,
            // 	newObj: getCleanedOption(baseObj, baseArray)
            // });

            initWidget(baseArray);


            //register input directive
            Vue.directive('input', {
                inserted: function (el, binding) {
                    var $input = $(el),
                        treeObj,
                        bindingValue = binding.value,

                        optionItem = bindingValue.option,
                        itemValue = bindingValue.value,
                        obj = bindingValue.obj,
                        array = bindingValue.array,
                        name = bindingValue.name,
                        objSelector = bindingValue.objSelector,

                        outerInstanceObj = baseObj;


                    switch (optionItem.inputType) {
                        case 'comboTree':
                            (function (obj, array, value) {
                                var oldValue = value,
                                    overviewCodeTree,

                                    codeListDB = AUI.overviewData.codeList;

                                $input.parent().children(':first').append(CONST.PARAMS_TYPE[optionItem.dataType] || CONST.PARAMS_TYPE._default);
                                AUI.getOverviewCodeTree &&AUI.getOverviewCodeTree();
                                treeObj = AUI.treeSelectV2($input, {
                                    type: optionItem.dataType
                                });


                                treeObj.refresh('overviewCodeTree');


                                $input.off('.auiConfigure')
                                    .on('change.auiConfigure', function (e, triggerType) {
                                        var el = e.target || e.srcElement,
                                            $input = $(el),
                                            inputName = optionItem.name,
                                            desp = optionItem.desp,
                                            codeID = $input.val(),
                                            toPushOptionArray = JSON.parse(JSON.stringify(array)),
                                            instanceObj = JSON.parse(JSON.stringify(obj)),
                                            toPushIndex,
                                            codeDataModel = JSON.parse(JSON.stringify(codeListDB({
                                                id: {
                                                    likenocase: codeID.replace(';', '')
                                                }
                                            }).first())),
                                            argsWidgetConfig, expressionConfig,
                                            i, item, namespace, str;

                                        for (i = toPushOptionArray.length - 1; i > -1; i--) {
                                            switch (toPushOptionArray[i].name) {
                                                case 'arguments_' + inputName:
                                                case 'jsValue_' + inputName:
                                                case 'expression_' + inputName:
                                                    toPushOptionArray.splice(i, 1);
                                                    break;
                                            }
                                        }


                                        if (codeDataModel && codeID) {
                                            switch (codeDataModel.type) {
                                                case 'widget':
                                                case 'aweb':

                                                    if ($.isArray(codeDataModel.option) && optionItem.dataType !== 'handler') {
                                                        //更新widget，配置项包括函数传参属性
                                                        argsWidgetConfig = {
                                                            name: 'arguments_' + inputName,
                                                            type: 'object',
                                                            desp: codeDataModel.text + ' 函数传参',
                                                            attr: codeDataModel.option
                                                        };
                                                    }
                                                    expressionConfig = {
                                                        name: 'expression_' + inputName,
                                                        type: 'string_simpleHtml',
                                                        language: 'javascript',
                                                        display:true,
                                                        desp: '表达式' + '(' + desp + ')',
                                                        defaultValue: '##_VALUE##',
                                                        info: '占位符"##_VALUE##"表示"' + (codeDataModel.code || '')
                                                            .replace(/_parseFunction_/, '')
                                                            .replace(/##([^_]+)_WID_VAR##/i, function (match, widgetID) {
                                                                return 'auiCtx.variables.' + $AW(widgetID).attr().id;
                                                            })
                                                            .replace(/\([^\(]*\)/i, '') + '"'
                                                    };
                                                    break;


                                                case 'var':
                                                    if (namespace = codeDataModel.namespace) {
                                                        switch (namespace) {


                                                            case'domain':
                                                                str = 'g_globalParams.';
                                                                break;
                                                            case 'scope': //页面变量
                                                                str = 'pageParams.'; //页面;
                                                                break;

                                                            case 'local':
                                                                str = 'localParams.'; //局部;
                                                                break;
                                                        }
                                                    }

                                                    expressionConfig = {
                                                        display:true,
                                                        name: 'expression_' + inputName,
                                                        type: 'string_simpleHtml',
                                                        language: 'javascript',
                                                        desp: '表达式' + '(' + desp + ')',
                                                        defaultValue: '##_VALUE##',
                                                        info: '占位符"##_VALUE##"表示"' + ((str + codeDataModel.name) || '')
                                                    };
                                                    break;

                                                case 'jsType':
                                                    argsWidgetConfig = {
                                                        name: 'jsValue_' + inputName,
                                                        type: codeDataModel.toAddOptionType,
                                                        desp: '赋值内容' + '(' + desp + ')'
                                                    };

                                                    if (argsWidgetConfig.type === 'jsEditor') {
                                                        argsWidgetConfig.type = 'string_simpleHtml';
                                                        argsWidgetConfig.language = 'javascript';
                                                    }
                                                    break;
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
                                        }

                                        initWidget(toPushOptionArray);

                                        instanceObj = baseConfigInitInstance(instanceObj || {}, toPushOptionArray);

                                        for (i in instanceObj) {
                                            if (instanceObj[i] !== undefined && new RegExp(inputName).test(i)) {
                                                item = JSON.parse(JSON.stringify(instanceObj[i]));
                                                Vue.set(obj, i, item);
                                                updateObj(outerInstanceObj, objSelector + '---' + i, item);
                                            }
                                        }

                                        // for (i in instanceObj) {
                                        //     if (instanceObj[i] !== undefined) {
                                        //         item = JSON.parse(JSON.stringify(instanceObj[i]));
                                        //         //     Vue.set(obj, i, item);
                                        //         updateObj(outerInstanceObj, objSelector + '---' + i, item);
                                        //     }
                                        // }

                                        array.splice(0, array.length);
                                        toPushOptionArray.forEach(function (item) {
                                            array.push(JSON.parse(JSON.stringify(item)));
                                        });

                                        if (triggerType !== 'initChange') {
                                            obj[name] = codeID;
                                        }
                                    });


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

            //console.log(baseArray);
            //create a vue instance
            vueManage[contextID] = new Vue({
                el: '#' + contextMainID,
                template: [
                    '<div>',
                    // '<spin fix v-if="spinShow"></spin>',
                    '<base-config  v-if="showOption" class="aui-config-ctn" :arraySelector="arraySelector" :objSelector="objSelector" :handler="handler" :array="array" :obj="obj"></base-config>',
                    '</div>'
                ].join(''),

                //hook
                mounted: function () {
                    this.showOption = true;
                },

                data: function () {
                    return {
                        //model responsive data
                        array: JSON.parse(JSON.stringify(baseArray)),
                        obj: JSON.parse(JSON.stringify(baseObj)),

                        //model selector
                        objSelector: contextID,
                        arraySelector: 'array',

                        //model display control
                        spinShow: true,
                        showOption: false,

                        //handlers
                        handler: {
                            showNextLevel: false,

                            handleValidate: function ($event, item) {
                                var validateObj = item.validate,
                                    $el = $($event.target);
                                if (validateObj.errorMessage) {
                                    $el.tooltips({

                                        animation: false,
                                        html: true,
                                        placement: function (ui) {
                                            var event = window.event,
                                                $ui = $(ui);

                                            $ui.addClass('hidden');
                                            requestAnimationFrame(function () {
                                                var $body = $('body');
                                                //console.log($ui);
                                                $body.children('.tooltip').not($ui).remove();
                                                $ui.css(app.position(event, $body, $ui, -10, -20)).removeClass('hidden');

                                            }, 16);

                                            return 'bottom';
                                        },
                                        title: function () {
                                            return '<p style="color:red;padding-left:8px;margin-top:6px;">错误提示:' + validateObj.errorMessage + '</p>';
                                        },
                                        trigger: 'hover',
                                        container: 'body',
                                        size: 'small'
                                    })
                                }

                            },

                            validate: function (context) {
                                if (context.currentValue && context.validateObj && context.validateObj.type) {

                                    AUI.validateInput(context.currentValue, {
                                        type: context.validateObj.type,
                                        errorMessage: context.validateObj.errorMessage
                                    }, function () {
                                        context.validateDanger = true;
                                    }, function () {
                                        context.validateDanger = false;
                                    });
                                }
                            },

                            getHeaderValue: function (value) {
                                if (typeof value === 'string') {
                                    return value;
                                } else {
                                    return false;
                                }
                            },

                            getHeader: function (item, instanceItem, index, emdObj) {
                                var getHeaderValue = vueManage[contextID].handler.getHeaderValue,
                                    keys, name = '';

                                if (emdObj && (keys = emdObj.keys)) {
                                    name = keys[index - 1] ? '(' + keys[index - 1] + ')' : '';
                                }


                                return ((item.edmKey && instanceItem[item.edmKey]) ||
                                    (item.titleKey && instanceItem[item.titleKey]) || getHeaderValue(instanceItem.desp)
                                    || getHeaderValue(instanceItem.name)
                                    || getHeaderValue(instanceItem[item.attrInEachElement[0].name])
                                    || getHeaderValue(item.desp + index) ) + name;
                            },

                            tabClicked: function (name, id) {

                            },

                            panelCreated: function (panelInstance, optionItem) {
                                if (optionItem && optionItem.expand) {
                                    Vue.set(vueManage[contextID].handler, panelInstance.name, true);
                                } else {
                                    Vue.set(vueManage[contextID].handler, panelInstance.name, false);
                                    // vueManage[contextID].handler[name] = false;

                                    if (optionItem && optionItem.isRequire) {
                                        requirePanelList.push(panelInstance);
                                    }
                                }
                            },

                            swapComponent: baseVueHandler.swapComponent,

                            objAdd: baseVueHandler.objAdd,

                            objDel: baseVueHandler.objDel,

                            delItem: baseVueHandler.delItem,

                            panelChange: function () {

                            },

                            handleChange: function (args) {
                                var item = args.item,
                                    obj = args.obj,
                                    val = args.val,
                                    oldVal = args.oldVal;

                                switch (args.type) {
                                    /* 	case 'edm':

                                     break; */

                                    default:
                                        if (item && item.formatter === 'replace') {
                                            switch (item.idUniqueSpace) {
                                                case 'widget':
                                                    if (AUI && AUI.currentWidgetID) {
                                                        eventAccumulatorMap[AUI.currentWidgetID][oldVal] = false;
                                                        eventAccumulatorMap[oldVal] = false;

                                                        eventAccumulatorMap[AUI.currentWidgetID][val] = true;
                                                        eventAccumulatorMap[val] = true;
                                                    }

                                                    break;

                                                default:
                                                    eventAccumulatorMap[oldVal] = false;
                                                    eventAccumulatorMap[val] = true;

                                                    break;
                                            }
                                        }

                                        updateCallback && (updateCallback.oldValue = oldVal);
                                        updateObj(baseObj, args.modelSelector, (val === undefined ? val : JSON.parse(JSON.stringify(val))), updateCallback, args.arraySelector);

                                        //处理可以配置事件的配置项
                                        if (args.arraySelector) {
                                            (function () {
                                                var arraySelector = args.arraySelector.split('---'),
                                                    fatherConfig,
                                                    modelSelector = args.modelSelector.split('---');

                                                try {
                                                    arraySelector.pop();
                                                    arraySelector.pop();

                                                    arraySelector = arraySelector.map(function (item) {
                                                        return '["' + item + '"]';
                                                    });

                                                    fatherConfig = eval('vueManage[contextID]' + arraySelector.join(''));

                                                    if (fatherConfig.hasEvent && !noReplaceData) {
                                                        modelSelector.pop();
                                                        modelSelector.pop();
                                                        modelSelector.shift();

                                                        modelSelector = modelSelector.map(function (item) {
                                                            return '["' + item + '"]';
                                                        });

                                                        eventUtil.eventSelectorUpdate(AUI.currentWidgetID, JSON.parse(JSON.stringify(eval('vueManage[contextID].obj' + modelSelector.join('')))));
                                                    }

                                                } catch (e) {

                                                }
                                            })();
                                        }
                                        break;
                                }
                            },

                            handleFileChange: function (event, args) {
                                var el = event.target,
                                    file = el.files[0],
                                    reader = new FileReader();

                                reader.onload = function (event) {
                                    external.getImageUrl(event.target.result, function (url) {

                                        args.obj[args.name] = url;
                                    });
                                };
                                try {
                                    reader.readAsDataURL(file);
                                } catch (e) {
                                }
                            },

                            edmSorted: function (edmObj, modelSelector) {
                                var obj = JSON.parse(JSON.stringify(edmObj));
                                obj.elements.shift();

                                edmUtil.edmUpdateOrderNew(obj);

                            },

                            panelOpen: function (event, args) {
                                var args = args || {},
                                    keys = event.keys,
                                    panelInstance = event.panelInstance,
                                    optionItem = args.optionItem,
                                    i, len,
                                    newRequireAttr,
                                    newRequireObj,
                                    newItemValue;

                                Vue.set(vueManage[contextID].handler, keys[0], true);
                                //add require attr
                                if (optionItem && optionItem.isRequire) {
                                    //toggle all require panel instance
                                    for (i = 0, len = requirePanelList.length; i < len; i++) {
                                        if (requirePanelList[i].name !== keys[0]) {
                                            if (requirePanelList[i].isActive) {
                                                requirePanelList[i].close();
                                            }
                                        }
                                    }

                                    //add require attr
                                    newRequireAttr = getRequireAttrFormVueArgs(args);
                                    newRequireObj = baseConfigInitInstance(JSON.parse(JSON.stringify(args.obj.require)), newRequireAttr, {});

                                    for (i in newRequireObj) {
                                        if (Array.isArray(args.obj.require[i]) &&
                                            Array.isArray(newRequireObj[i]) &&
                                            !args.obj.require[i].length &&
                                            !newRequireObj[i].length
                                        ) {

                                        } else {
                                            args.obj.require[i] = newRequireObj[i];
                                        }
                                    }
                                    // args.obj.require = newRequireObj;
                                    // console.log(optionItem)
                                    setTimeout(function () {
                                        Vue.set(optionItem, 'attr', newRequireAttr);
                                    }, 0)
                                }
                            },

                            addBlock: function (event, args) {
                                var array = args.array,
                                    obj = args.obj,
                                    item = args.item,
                                    instanceArr = args.instanceArr,
                                    instanceArrCopy,
                                    arrLength;

                                if (item.attrInEachElement === 'self') {
                                    item.attrInEachElement = JSON.parse(JSON.stringify(array));
                                }

                                if (($.isArray(instanceArr) && !instanceArr.length) || !instanceArr) {
                                    // obj[item.name] = [{}];
                                    instanceArr = [{active: true}];
                                    instanceArr = [{
                                        active: true
                                    }];
                                    vueManage[contextID].$set(obj, item.name, instanceArr);
                                    updateObj(baseObj, args.modelSelector, [{
                                        active: true
                                    }], updateCallback);
                                }

                                instanceArr.push(baseConfigInitInstance({
                                    active: true
                                }, JSON.parse(JSON.stringify(item.attrInEachElement || [])), {
                                    name: instanceArr[0].name,
                                    order: instanceArr.length
                                }));

                                if (item.hasEvent) {
                                    instanceArr[instanceArr.length - 1].uuid = app.getUID();
                                    eventUtil.eventSelectorUpdate(AUI.currentWidgetID, JSON.parse(JSON.stringify(instanceArr)));
                                    updateObj(baseObj, args.modelSelector, JSON.parse(JSON.stringify(instanceArr)), updateCallback);
                                } else {
                                    arrLength = instanceArr.length;
                                    updateObj(baseObj, args.modelSelector + '---' + (arrLength - 1), JSON.parse(JSON.stringify(instanceArr[arrLength - 1])), updateCallback);
                                }
                            },

                            delBlock: function (event, item, modelSelector, edmCollectionObj) {
                                item.active = false;
                                updateObj(baseObj, modelSelector + '---active', false, updateCallback);
                                if (edmCollectionObj) {
                                    edmUtil.edmDelete(edmCollectionObj.edmID, item.edmItemId);
                                }


                            },

                            openEdmDialog: baseVueHandler.openEdmDialog,

                            showModal: function (event, args) {
                                var $el = $(event.target || event.srcElement),
                                    obj = args.obj,
                                    option = JSON.parse(JSON.stringify(args.option)),
                                    name = args.name,

                                    newValue, iconList = [];
                                switch (option.spanType) {
                                    case 'icon':
                                        app.popover({
                                            $elem: $el,
                                            title: '配置' + option.desp,
                                            content: '',
                                            width: '60%',
                                            height: '80%',
                                            init: function (popInstance) {

                                                var $popoverBody = $(this).find('.aweb-popover-body'),
                                                    i, item, index, iconItem, namespace, iconItemArr,
                                                    iconArr = window.aweb.iconArr,
                                                    result = [CONST.TEMP.POPOVER_ICON_HEADER, '<div class="aui-iconList-icons-wrapper"><ul class="aui-iconList-icon-list md clearfix">'];

                                                if (iconArr && iconArr.length) {
                                                    for (i = -1; item = iconArr[++i];) {
                                                        iconList.push({
                                                            namespace: item.namespace,
                                                            iconArr: item.code && JSON.parse(item.code.replace(/\b(name|value)\b/g, '"$1"').replace(';', ''))
                                                        })
                                                    }
                                                }


                                                for (index = -1; iconItem = iconList[++index];) {
                                                    namespace = iconItem.namespace;
                                                    iconItemArr = iconItem.iconArr;
                                                    if (iconArr) {
                                                        for (i = -1; item = iconItemArr[++i];) {
                                                            result.push(CONST.TEMP.POPOVER_ICON_LIST.replace(/_value_/g, item.value)
                                                                .replace(/_name_/g, item.name)
                                                                .replace(/_namespace_/g, namespace)
                                                            );
                                                        }

                                                    }
                                                }
                                                result.push('</ul></div>');

                                                $popoverBody.addClass('aui-iconList-ctn')
                                                    .append(result.join(''));

                                                $popoverBody.off('.auiConfigure').on({
                                                    'click.auiConfigure': function (e) {
                                                        var el = e.target || e.srcElement,
                                                            $el = $(el),
                                                            $iconWrapper = $el.closest('.icon-wrapper'),
                                                            $sizeToggler, $iconList;

                                                        if (($sizeToggler = $el.closest('.toggle-btn')) && $sizeToggler.length) {
                                                            $iconList = $popoverBody.find('.aui-iconList-icon-list');
                                                            $sizeToggler.addClass('active').siblings().removeClass('active');
                                                            switch ($sizeToggler.attr('id')) {
                                                                case 'smallSize':
                                                                    $iconList.addClass('sm').removeClass('md');
                                                                    break;
                                                                case 'mediumSize':
                                                                    $iconList.addClass('md').removeClass('sm');
                                                                    break;
                                                                default:
                                                                    $iconList.removeClass('md').removeClass('sm');
                                                            }
                                                        } else {
                                                            if ($iconWrapper.length) {
                                                                newValue = $iconWrapper.find('[aria-hidden="true"]').attr('class');
                                                                popInstance.close();
                                                            }
                                                        }


                                                    },
                                                    'keyup.auiConfigure': function (e) {
                                                        var el = e.target || e.srcElement,
                                                            $el = $(el).closest('.aui-iconList-searcher'),
                                                            value = $el.val();

                                                        $popoverBody.find('.icon-wrapper').each(function () {
                                                            var $this = $(this);

                                                            if ($this.attr('data-value').toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                                                                $this.show();
                                                            } else {
                                                                $this.hide();
                                                            }
                                                        });
                                                    }
                                                });

                                            },
                                            confirmHandler: function (popInstance) {
                                                if (newValue) {
                                                    obj[name] = newValue;
                                                }
                                            }
                                        });

                                        break;

                                    case 'pageFlow':
                                        (function () {
                                            var $tree = $('<div><ul class="ztree" id="tree"><li>ABC</li></ul></div>'),
                                                treeObj,
                                                newValue;

                                            require(['zTree'], function () {
                                                app.popover({
                                                    $elem: $el,
                                                    title: '配置' + option.desp,
                                                    content: $tree.html(),
                                                    width: '60%',
                                                    height: '80%',
                                                    init: function (popInstance) {
                                                        treeObj = $.fn.zTree.init(
                                                            $(this).find('#tree'), {
                                                                check: {
                                                                    enable: true,
                                                                    radioType: 'all',
                                                                    chkStyle: 'radio'
                                                                },
                                                                callback: {
                                                                    onCheck: function () {
                                                                        popInstance.close()
                                                                    }
                                                                },
                                                                data: {
                                                                    simpleData: {
                                                                        enable: true
                                                                    }
                                                                }
                                                            }, dataModel.get("pageFlow"));


                                                    },
                                                    confirmHandler: function (popInstance) {
                                                        if (treeObj && treeObj.getCheckedNodes().length) {
                                                            newValue = treeObj.getCheckedNodes()[0].path;
                                                            obj[name] = newValue;
                                                        }
                                                    }
                                                });
                                            })
                                        })();
                                        break;

                                    case 'string_with_placeholder':
                                        (function () {
                                            var newValue, oldValue, $input;
                                            app.popover({
                                                $elem: $el,
                                                title: '配置' + option.desp,
                                                content: '',
                                                init: function () {
                                                    var $popoverBody = $(this).find('.aweb-popover-body');
                                                    $popoverBody.css({'padding': '5px'});
                                                    option.value = obj[name];


                                                    $popoverBody.append(artTemplate('string_with_placeholder', option));

                                                    $input = $popoverBody.find('input');
                                                    $popoverBody.off('click.auiConfigure').on({
                                                        'click.auiConfigure': function (e) {
                                                            var el = e.target || e.srcElement,
                                                                $el = $(el);

                                                            if ($el.hasClass(BASE_CONST.TEXT_TAG_ITEM)) {
                                                                $input.val($input.val() + $el.attr('data-tag-value'));
                                                            }
                                                        }
                                                    });

                                                    $input.on({
                                                        'keyup.auiConfigure': function (e) {
                                                            var el = e.target || e.srcElement,
                                                                $el = $(el),
                                                                value = $el.val();

                                                            $input.append(AUI.transformForeignKey())
                                                        }
                                                    })
                                                },
                                                confirmHandler: function () {
                                                    newValue = $input.val();

                                                    if (newValue !== oldValue) {
                                                        obj[name] = newValue;
                                                    }
                                                },
                                                height: '80%',
                                                width: '50%'
                                            });
                                        })();
                                        break;
                                    case 'string_simpleHtml':

                                        (function () {
                                            var editor,
                                                name = args.name,
                                                popoverOption = {
                                                    $elem: $el,
                                                    title: option.desp + (option.info ? '(' + option.info + ')' : ''),
                                                    content: '',
                                                    width: '50%',
                                                    height: '100%',
                                                    focusable: (typeof option.focusable !== 'undefined') ? option.focusable : 'true',
                                                    init: function () {
                                                        var $popoverBody = $(this).find('.aweb-popover-body').empty();
                                                        $popoverBody.css({'padding': '0'});

                                                        editor = AUI.vscode.create(
                                                            $popoverBody, {
                                                                value: typeof obj[name] === 'object' || typeof obj[name] === 'number' ? JSON.stringify(obj[name]) : obj[name],
                                                                language: option.language || 'html'
                                                            });

                                                        $(this).on('screenChange', function () {
                                                            editor.layout();
                                                        })

                                                    },
                                                    confirmHandler: function () {
                                                        var value = editor.getValue();
                                                        if (value !== undefined) {
                                                            obj[name] = value;

                                                        }

                                                    }
                                                };

                                            if (name === 'cssCode') {
                                                popoverOption['on'] = {
                                                    preview: {
                                                        btnName: 'preview',
                                                        icon: 'aui aui-yunhang',
                                                        title: '预览',
                                                        callback: function (e, context) {
                                                            obj[name] = editor.getValue();

                                                            $AW.trigger($AW.STATUS.CSS_CODE_UPDATE);

                                                        }
                                                    }
                                                };
                                            }

                                            app.popover(popoverOption);
                                        })();
                                        break;
                                    case 'string_html':

                                        (function () {
                                            var editor,
                                                name = args.name;

                                            app.popover({
                                                $elem: $el,
                                                title: option.desp,
                                                content: '',
                                                width: '50%',
                                                height: '80%',
                                                init: function (popInstance) {
                                                    var $popoverBody, $div, that = this;

                                                    popInstance.options.focusable = false;

                                                    $(document).off('.wangEditorInPop')
                                                        .on('click.wangEditorInPop', function (e) {
                                                            if ($(e.target).closest('.aweb-popover').length === 0) {
                                                                if (!$(e.target).is($el)) {
                                                                    popInstance.close();
                                                                }
                                                            }
                                                        });

                                                    $popoverBody = $(this).find('.aweb-popover-content').append('<div id="popover4wangEditor"></div>'),
                                                        $div = $popoverBody.find('#popover4wangEditor');

                                                    app.shelter.show('正在加载,请稍候...', true);

                                                    require(['wangEditor', 'requireCss'], function (wang, requireCss) {
                                                        require(['requireCss!./dependence/wangEditor/css/wangEditor.css']);
                                                        var popoverContainer, editorMaxHeight, editorMinHeight,
                                                            editorCss, editorTextHeight;

                                                        editor = new wangEditor($div);
                                                        // 移除『全屏』fullscreen 菜单项：
                                                        editor.config.menus = $.map(wangEditor.config.menus, function (item, key) {

                                                            if (item === 'fullscreen') {
                                                                return null;
                                                            }
                                                            return item;
                                                        });

                                                        editor.create();
                                                        $('#popover4wangEditor', $popoverBody).attr('style', 'height:100%;');

                                                        function _fixEditorHeight() {

                                                            popoverContainer = editor.$parent.parent();
                                                            editorMaxHeight = popoverContainer.css('maxHeight');
                                                            editorMinHeight = popoverContainer.css('minHeight');

                                                            editorCss = {
                                                                maxHeight: editorMaxHeight,
                                                                minHeight: editorMinHeight,
                                                                borderColor: 'transparent'
                                                            };

                                                            $('.wangEditor-container', $popoverBody).css(editorCss);
                                                        }

                                                        function _fixEditorTextHeight() {
                                                            editorTextHeight = (parseFloat(editorMaxHeight) - $('.wangEditor-menu-container', $popoverBody).height() - 7);

                                                            $('.wangEditor-txt', $popoverBody).css({'height': editorTextHeight + "px"});
                                                        }

                                                        _fixEditorHeight();

                                                        editor.$txt.html(obj[name]);
                                                        app.shelter.hide();

                                                        _fixEditorTextHeight();

                                                        // 监听 screenChange 事件，让全屏的时候尺寸自动变化。
                                                        // screenChange 事件需要解绑
                                                        $(that).on('screenChange', function () {
                                                            _fixEditorHeight();
                                                            _fixEditorTextHeight();
                                                        })

                                                    });


                                                },
                                                confirmHandler: function () {
                                                    $(document).off('click.wangEditorInPop');
                                                    if (editor && editor.$txt) {
                                                        obj[name] = editor.$txt.html();
                                                    }

                                                    // app.alert('保存文本成功',app.alert.SUCCESS);
                                                },

                                            });
                                        })();

                                        break;

                                    case 'template_html':
                                        (function () {
                                            var editor,
                                                name = args.name;

                                            app.popover({
                                                $elem: $el,
                                                title: option.desp,
                                                content: '',
                                                width: '50%',
                                                height: '80%',
                                                init: function (popInstance) {
                                                    var $popoverBody = $(this).find('.aweb-popover-body').empty();


                                                    editor = AUI.vscode.create(
                                                        $popoverBody, {
                                                            value: obj[name],
                                                            language: 'html'
                                                        });

                                                    $(this).on('screenChange', function () {
                                                        editor.layout();
                                                    })


                                                },
                                                confirmHandler: function () {
                                                    var value = editor.getValue();
                                                    if (value !== undefined) {
                                                        obj[name] = value;
                                                    }
                                                }

                                            });
                                        })();

                                        break;

                                    case ADVANCE:
                                        (function () {


                                            app.popover({
                                                $elem: $el,
                                                title: option.desp,
                                                content: '',
                                                width: '50%',
                                                height: '80%',
                                                init: function (popInstance) {
                                                    var $popoverBody = $(this).find('.aweb-popover-body').empty(),
                                                        oWidget = $AW(AUI.currentWidgetID),
                                                        element = oWidget[0],
                                                        widgetInstance = element.data,
                                                        widget = element.widget,
                                                        contextID = ADVANCE + 'Option';

                                                    $popoverBody.attr('id', contextID);

                                                    if (option.overview) {
                                                        $AW.trigger($AW._STATUS.OVERVIEW_FRAME.ADVANCE, contextID);
                                                    } else {
                                                        baseConfigInitConfigPage($popoverBody, widgetInstance, widget, false, false, true);
                                                    }

                                                },
                                                confirmHandler: function () {

                                                }

                                            });
                                        })();
                                        break;
                                }
                            } //end show modal/popover
                        } // end handler definition
                    };
                },
                destroyed: function () {
                    console.log("destroy")
                }
            });

            return vueManage[contextID];

        }

        function baseConfigInitConfigPage($context, widgetInstance, widget, setTabVisible, noRefresh, isAdvance) {
            var contextID = $context.attr('id'),
                widgetID = widgetInstance.widgetID,
                oWidget = $AW(widgetID),
                widget = oWidget[0].widget,
                attrID = contextID + 'Attr',
                optionID = contextID + 'Option',
                attrVueInstance,
                optionCopy, option, name,
                advancedObj = {},
                $attr = $('<div id="' + attrID + '"></div>'),
                $option = $('<div id="' + optionID + '"></div>'),
                i, item, advancedData = [], flag, len, advanceOption;

            //vue 的依赖上下文相关因子
            baseVueHandler.openEdmDialog = function (event, args) {
                var $el = $(event.target || event.srcElement),
                    direction = args.option.direction,
                    edmKey,
                    edmID, edmCollectionObj = args.edmCollectionObj || args.value,
                    bIsResponseData = isResponseData(args.option);

                edmID = edmCollectionObj.edmID;
                if (direction === CONST.EDM.DIRECTION.request || bIsResponseData) {
                    edmCollectionObj.id = edmCollectionObj.id || dataModel.getEventAccumulator();
                    edmCollectionObj.url = edmCollectionObj.url || '##' + widgetID + '_' + edmCollectionObj.id + '_URL##';
                }
                edmUtil.edmConfig({
                    widgetID: widgetID,
                    foreignID: direction === CONST.EDM.DIRECTION.request ? edmCollectionObj.url : widgetID,
                    edmID: edmID,
                    edmCollectionModelSelector: edmCollectionObj,
                    contextID: contextID,
                    applyTo: CONST.STEP.APPLY_TO.WIDGET,
                    $list: (direction === 'request' ? $el.closest('.' + BASE_CONST.CONFIG_BLOCK).find(BASE_CONST.EDM_LIST) : undefined),
                    direction: direction || 'response',
                    callback: function (edmCollectionObj, contextID) {

                        return function (keys, fields, ids, edmID, foreignID, widgetID) {
                            var oWidget = $AW(widgetID),
                                $context = $('#' + contextID),
                                model,
                                fieldsCopy = JSON.parse(JSON.stringify(fields)),
                                elem = oWidget[0],
                                elementsCopy,
                                widget = elem.widget,
                                widgetInstance = elem.data,
                                modelSelectorArr = args.modelSelector.split('---'),
                                copyModelSelectorArr=[].concat(modelSelectorArr),
                                i, item, value, temp,name,
                                noReplaceData,copyModelSelector,len;

                            if (direction === CONST.EDM.DIRECTION.request || bIsResponseData) {
                                edmCollectionObj.edmID = edmID;
                                //update owidget
                            } else {
                                edmKey = edmCollectionObj.edmKey;
                                edmCollectionObj.fields = fields;
                                edmCollectionObj.ids = ids;
                                edmCollectionObj.keys = keys;
                                edmCollectionObj.edmID = edmID;

                                //复制原来的model来进行操作elements
                                model = JSON.parse(JSON.stringify(edmCollectionObj));

                                noReplaceData= $AW(widgetID)[0] && $AW(widgetID)[0].data.noReplaceData;
                                copyModelSelectorArr[0]='noReplaceData';
                                copyModelSelectorArr[copyModelSelectorArr.length-1]='0';
                                copyModelSelectorArr = copyModelSelectorArr.map(function (item, index) {
                                    return (index === 0) ? item : "['" + item + "']";
                                });

                                try {
                                    copyModelSelector=eval(copyModelSelectorArr.join(''));
                                }catch (e){

                                }


                                // elementsCopy = JSON.parse(JSON.stringify(model.elements));
                                //
                                // for (i = -1; item = elementsCopy[++i];) { //foreach===>for
                                //     item.active = false;
                                //     item.edmItemId = ids[i];
                                // }


                                for (i = -1; item = model.elements[++i];) { //foreach===>for

                                    if (item.active === true && i !== 0) {

                                        if (fieldsCopy.length !== 0) {
                                            name=item[edmKey] = fieldsCopy.shift();
                                            name && (item.name=name);

                                        } else {
                                            delete model.elements[i];
                                        }

                                    }
                                }


                                model.elements = removeUndefined(model.elements);
                                len= model.elements.length;

                                for (i = -1; value = fieldsCopy[++i];) { //foreach===>for

                                    temp = JSON.parse(JSON.stringify(model.elements[0]));
                                    if(copyModelSelector && temp.selector){
                                        temp.selector=copyModelSelector.selector.replace(CONST.REGEX.WIDGET.INDEX,i+len);
                                    }
                                    temp[edmKey] = value;
                                    temp.name=value;
                                    temp.uuid=app.getUID();
                                    model.elements.push(temp);
                                }


                                modelSelectorArr.pop();
                                modelSelectorArr.pop();
                                edmCollectionObj.elements = JSON.parse(JSON.stringify(model.elements));

                                if(model.elements.length>1){
                                    eventUtil.eventSelectorUpdate(widgetID, model.elements);
                                }


                                if (edmCollectionObj.elements[1]) {
                                    $.each(edmCollectionObj.elements, function (index, value) {
                                        if (value.active === true && index !== 0) {
                                            value.edmKey = fields[index - 1];
                                            value.edmItemId = ids[index - 1];
                                        }
                                    });
                                }

                                updateObj(widgetInstance.optionCopy, modelSelectorArr.join('---'), JSON.parse(JSON.stringify(edmCollectionObj)), function (args) {
                                    updateWidgetOption(oWidget, widgetInstance, args.newObj, 'first');

                                }, widget.option);

                               // eventUtil.eventSelectorUpdate(widgetID, model.elements);
                                //update oWidget
                            }
                        };
                    }(edmCollectionObj, contextID)
                }); //end AUI.edmConfig
            };
            Vue.directive('edm', {
                inserted: function (el, binding) {
                    var $list = $(el),
                        editor,
                        bindingValue = binding.value,

                        optionItem = bindingValue.option,
                        itemValue = bindingValue.value,
                        instanceObj = bindingValue.obj,
                        optionName = bindingValue.name,
                        modelSelector = bindingValue.modelSelector;
                    if (optionItem.direction === 'request' || isResponseData(binding.value.option)) {

                        edmUtil.edmUpdateDataModelList({
                            widgetID: widgetID,
                            foreignID: itemValue.url, //widgetID,
                            edmID: instanceObj[optionName].edmID,
                            contextID: $context.attr('id'),
                            applyTo: CONST.STEP.APPLY_TO.WIDGET,
                            $list: $list,
                            direction: optionItem.direction,
                            callback: function (modelSelector) {
                                return function (keys, fields, ids, edmID, foreignID, widgetID) {
                                    instanceObj.data.edmID = edmID;

                                    //udpate oWidget
                                    updateObj(widgetInstance.optionCopy, modelSelector + '---' + 'edmID', edmID, function (args) {
                                        updateWidgetOption(oWidget, widgetInstance, args.newObj);
                                    }, widget.option);

                                }
                            }(modelSelector)
                        });
                    }
                }
            });

            if (!isAdvance) {
                $context.children(':not(' + CONST.PAGE.CONFIGURE_FRAME.OPTION.BASIC_EDITOR + ')').remove();

                $context.prepend($option).prepend($attr);

                if (widget.jsEditor !== 'option') {
                    $(CONST.PAGE.CONFIGURE_FRAME.OPTION.BASIC_EDITOR, $context).addClass('hide');
                } else {
                    $(CONST.PAGE.CONFIGURE_FRAME.OPTION.BASIC_EDITOR, $context).removeClass('hide');

                    getJsEditor().layout();

                    getJsEditor().setValue(AUI.getParsedString(UglifyJS.parse('(' + JSON.stringify(oWidget.option()) + ')')));

                    setTimeout(function () {
                        getJsEditor().setValue(AUI.getParsedString(UglifyJS.parse('(' + JSON.stringify(oWidget.option()) + ')')));
                    }, 1000)
                }
                // refreshWidget(oWidget);
                setTabVisible && setTabVisible(true);
                if (widget.attr && widget.attr.length) {
                    attrVueInstance = baseConfig(attrID, widgetInstance.attr, widget.attr, function (args) {
                        oWidget.update({
                            attr: widgetInstance.attr
                        });
                        switch (args.key) {
                            case 'widgetName':

                                oWidget.attr('widgetName', args.newValue);

                                break;
                            case 'id':
                                if (!$AW.updateDomID(args.oldValue, args.newValue, widgetID)) {
                                    app.alert('输入的ID发现冲突！请输入正确的ID！');
                                    // // console.log(args.oldValue)
                                    setTimeout(function () {
                                        attrVueInstance.obj.id = args.oldValue;
                                    }, 0)
                                }
                                break;
                        }

                        $AW.trigger($AW.STATUS.WIDGET_UPDATE, oWidget);
                        $AW.trigger($AW._STATUS.CONFIGURE_FRAME.NAME, oWidget.id())

                    });
                }
                if ((option = widget.option) && (len = option.length)) {

                    optionCopy = widgetInstance.optionCopy;

                    //高级配置特殊处理
                    for (i = -1; item = option[++i];) {
                        if (item.isAdvanced) {
                            advancedData.push(item);
                            name = item.name;
                            if (optionCopy.hasOwnProperty(name)) {
                                advancedObj[name] = optionCopy[name];
                                delete optionCopy[name];
                            }
                            option.splice(i, 1);
                            i = i - 1;
                            flag = true;
                        }
                    }

                    if (flag) {
                        option.push({
                            name: ADVANCE,
                            desp: '高级配置',
                            type: ADVANCE,
                            array: advancedData
                        });
                        optionCopy[ADVANCE] = advancedObj;
                    } else if ((advanceOption = option[len - 1]) && advanceOption.name === ADVANCE) {
                        for (i = -1; item = advanceOption.array[++i];) {
                            name = item.name;
                            advancedObj[name] = (optionCopy[ADVANCE] && optionCopy[ADVANCE][name]) || optionCopy[name];
                            delete optionCopy[name];
                        }
                        optionCopy[ADVANCE] = advancedObj;
                    }

                    baseConfig(optionID, optionCopy, option, function (args) {
                        var newObj, advanceObj;
                        if (!noRefresh) {
                            // 高级配置特殊处理
                            if (newObj = args.newObj) {
                                if (newObj.hasOwnProperty(ADVANCE)) {
                                    advanceObj = newObj[ADVANCE];
                                    delete args.newObj[ADVANCE];
                                    $.extend(newObj, advanceObj);
                                }
                            }
                            updateWidgetOption(oWidget, widgetInstance, args.newObj, args.modelSelector || 'first', args.widgetSelector, args.key, args.newValue);
                        }
                    }, true);
                }
            } else {
                //高级配置option
                $context.prepend($option);
                if ((option = widget.option) && (len = option.length)) {
                    optionCopy = widgetInstance.optionCopy;
                    if ((advanceOption = option[len - 1]) && advanceOption.name === ADVANCE) {
                        baseConfig(optionID, optionCopy[ADVANCE], advanceOption.array, function (args) {
                            var newObj = $.extend(true, widgetInstance.option, args.newObj);
                            if (!noRefresh) {
                                updateWidgetOption(oWidget, widgetInstance, newObj, args.modelSelector || 'first', args.widgetSelector, args.key, args.newValue);
                            }
                        }, true);
                    }

                }

            }


        } //end init page

        //将JSON对象转化为JavaScript的合法对象
        function parseJSObject(obj) {
            var name, value, cache, cursor = -1,
                caches = [obj];

            while (cache = caches[++cursor]) {
                for (name in cache) {
                    if (typeof (cache[name]) === 'string') {
                        if (cache[name].indexOf('_parseObject_') === 0) {
                            cache[name] = JSON.parse(cache[name].replace(/_parseObject_/, ''));
                        } else {
                            try {
                                value = cache[name].replace(/'/g, '"');
                                // value = cache[name];
                                value = JSON.parse(value);

                                if (typeof value !== 'string') {
                                    cache[name] = value;
                                }
                            } catch (e) {/*
                             } catch (e) {
                             /*
                             if (e.message === "Unexpected token '") {

                             value=cache[name];

                             if(value.startsWith("'{") &&  value.endsWith("}'")){
                             value=value.substr(1,value.length-2);
                             }else{
                             value = value.replace(/'/g, '"');
                             }


                             value = JSON.parse(value);

                             if (typeof value !== 'string') {
                             cache[name] = value;
                             }
                             } */

                            }
                        }
                    } else if (typeof (cache[name]) === 'object') {
                        caches.push(cache[name]);
                    }
                }
            }
            return obj;
        }

        //将option的无用信息清除，返回真实可用的option
        /*
         *   @withTemplate   是否把数组中的模板留下
         * */
        function getCleanedOption(option, objArray, withTemplate) {
            var optionCopy = $.extend(true, {}, option);
            normalizeObjV2(optionCopy, objArray, withTemplate);
            parseJSObject(optionCopy);
            return optionCopy;
        }

        // AUI.getCleanedOption = getCleanedOption;

        //将attr属性添加到html中
        function initAttrInWidget(widget) {
            // var $el = widget[0].$widget.children(CONST.WIDGET.TEMP_SELECTOR),
            // 	attrObj = widget.attr();
            //
            // for (var item in attrObj) {
            // 	if (attrObj.hasOwnProperty(item)) {
            // 		if (attrObj[item] === 'false' || attrObj[item] === '') {
            // 			$el.removeAttr(item);
            // 		} else if (item !== 'id' && item !== 'widgetName' && item !== 'desp') {
            // 			$el.attr(item, attrObj[item]);
            // 		}
            // 	}
            // }
        }

        //显示配置页面

        function baseConfigure($context, oWidget, setTabVisible, noRefresh) {
            var elem = oWidget[0],
                widget = elem.widget,
                widgetInstance = elem.data;

            baseConfigInitConfigPage($context, widgetInstance, widget, setTabVisible, noRefresh);

        }

        //将widget中attrInEachElement为self的属性恢复回来 且 将type为handler的属性恢复回来，obj表示structure中的option，objArray为widget中的option
        function resumeWidget(obj, objArray, eventHandlerList) {

        }


        //AUI 4.2修改了接口，将isResume删除，改成eventHandler

        function resumeBaseConfig(oWidget, again, resumeCssConfig) {
            var
                elem = oWidget[0],
                data = elem && elem.data,
                widgetConfig = elem && elem.widget;
            if (elem) {
                if (!again || $.isEmptyObject(data.optionCopy)) {
                    // data.option = data.option || {};

                    delete data.optionCopy;

                    if ($.isEmptyObject(data.optionCopy) || typeof data.optionCopy === 'undefined') {
                        data.noReplaceData= baseConfigInitInstance(JSON.parse(JSON.stringify(data.option || {})), JSON.parse(JSON.stringify(widgetConfig.option)), {
                            widgetID: data.widgetID
                        },false,true);
                        data.optionCopy = baseConfigInitInstance(JSON.parse(JSON.stringify(data.option || {})), widgetConfig.option, {
                            widgetID: data.widgetID
                        });
                    } else {
                        formatOptionCopy(data.optionCopy, widgetConfig.option);
                        // data.option = getCleanedOption(data.optionCopy, widgetConfig.option);
                    }

                    baseConfigInitInstance(data.optionCopy, widgetConfig.option, {
                        widgetID: data.widgetID
                    });

                    baseConfigInitInstance(data.attr, widgetConfig.attr, {
                        widgetID: data.widgetID
                    });

                    if (widgetConfig.edm && widgetConfig.edm.get && widgetConfig.edm.get.length) {
                        data.edm = data.edm || {};
                        data.edm.id = AUI.transformForeignKey(widgetConfig.edm.get[0].value, data.widgetID);
                        baseConfigInitInstance(data.edm, BASE_CONST.EDM_TEMPLATE, {
                            widgetID: data.widgetID
                        });
                    }

                    // if ($.isEmptyObject(data.option) || typeof data.option === 'undefined') {
                    data.option = getCleanedOption(data.optionCopy, widgetConfig.option);
                    // }

                    oWidget.update({
                        option: data.option,
                        optionCopy: data.optionCopy,
                        edm: data.edm
                    });
                }
                //添加属性到页面结构中
                initAttrInWidget(oWidget);

                if ((auiApp.mode !== CONST.MODE.WIDGET_CREATOR) && (auiApp.mode !== CONST.MODE.NAVIGATOR)) {
                    resumeCssConfig && resumeCssConfig(oWidget);
                }


                /* if (!(func = $AW[widgetConfig.href])) {
                 sorts = widgetConfig.href.split('.');

                 func = $AW;

                 for (i = -1;
                 (sort = sorts[++i]) && func;) {
                 func = func[sort];
                 }
                 }
                 try {
                 func && func(oWidget, eventHandler);
                 } catch (e) {
                 app.alert(e.message, app.alert.ERROR);
                 console.error(e);
                 } */
            }
        }

        return {
            baseConfig: baseConfig,
            baseConfigInitConfigPage: baseConfigInitConfigPage,
            baseConfigInitInstance: baseConfigInitInstance,
            initWidget: initWidget,
            updateObj: updateObj,
            getCleanedOption: getCleanedOption,
            updateConfigPage: updateConfigPage,
            updateResponsiveData: updateResponsiveData,
            baseConfigure: baseConfigure,
            getRequireAttr: getRequireAttr,
            resumeWidget: resumeWidget,
            resumeBaseConfig: resumeBaseConfig,
            Toolbox: Toolbox,
            list: list
        }
    });
})();