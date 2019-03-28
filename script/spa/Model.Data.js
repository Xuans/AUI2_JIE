(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(['jquery', 'const'], factory);
        }
        // global
        else {
            factory();
        }
    })(function ($, CONST) {
        app.taffy = app.taffy || window.parent.app.taffy;

        var DATA_CONST = CONST.MODEL_DATA,
            taffyList = {},
            stringList = {},
            dataModelIns = null;
        Data = function () {
            var i, item, key, list;
            //  this.data = {};
            for (list = DATA_CONST.taffyList, i = list.length; item = list[--i];) {
                this.data[item] = app.taffy([]);
                taffyList[item] = true;
            }

            for (list = DATA_CONST.stringList, i = list.length; item = list[--i];) {
                this.data[item] = '';
                stringList[item] = true;
            }

            for (list = DATA_CONST.arrayList, i = list.length; item = list[--i];) {
                this.data[item] = [];
                stringList[item] = true;
            }

            list = DATA_CONST.list;
            for (key in list) {
                this.data[key] = list[key];
            }

            //configure

            for (key in (list = CONST.CONFIGURATION_DATA)) {
                this.configuration[key] = list[key];
            }

        };

        Data.prototype = {
            constructor: Data,
            data: {},
            configuration: {},

            get: function (key) {
                var ret;

                if (this.data.hasOwnProperty(key)) {
                    if (taffyList.hasOwnProperty(key)) {
                        ret = this.data[key];
                    } else {
                        ret = JSON.parse(JSON.stringify(this.data[key]));
                    }
                }
                return ret;

            },

            getEventAccumulator: function () {
                if (this.data.hasOwnProperty('eventAccumulator')) {
                    return ++this.data.eventAccumulator;
                }
            },
            getAccumulator: function () {
                if (this.data.hasOwnProperty('accumulator')) {
                    return ++this.data.accumulator;
                }
            },
            getCopy: function (key) {
                var context = this,
                    ret;
                if (this.data.hasOwnProperty(key)) {
                    if (taffyList.hasOwnProperty(key)) {
                        ret = JSON.parse(context.stringify(this.data[key]().get()));
                    } else {
                        ret = JSON.parse(JSON.stringify(this.data[key]));
                    }
                }
                return ret;

            },
            getData: function () {
                return this.data;
            },
            getList: function () {
                var data = this.data,
                    key, ret = {};
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (taffyList.hasOwnProperty(key)) {
                            ret[key] = data[key]().get()
                        } else {
                            ret[key] = data[key];
                        }
                    }

                }
                return ret;
            },

            set: function (key, newValue) {
                var value;

                if (taffyList.hasOwnProperty(key)) {
                    value = newValue.TAFFY ? newValue : app.taffy(newValue);
                } else {
                    if (newValue !== 'undefined') {
                        if (newValue.TAFFY) {
                            taffyList[key] = true;
                        }
                        value = newValue;
                    }
                }
                this.data[key] = value;

            },
            resetData: function (data) {
                this.data = data;
            },
            stringify: function (data) {
                var cache = [],
                    ret = JSON.stringify(data, function (key, value) {

                        if (typeof value === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                // Circular reference found, discard key
                                return;
                            }
                            // Store value in our collection
                            cache.push(value);
                        }
                        return value;
                    });
                cache = null;
                return ret;

            },

            removeRedundancy: function (structureOnly) {
                var data = this.data,
                    hashMap = {},
                    sMap = {}, sArr = [], eArr = [], lArr = [], ioArr = [],
                    result = {},

                    WIDGET_SPLIT = CONST.REGEX.FOREIGN_WIDGET.FOREIGN_WIDGET_SPILT_PASTE;

                //remove page structure
                result.structure = app.taffy($.extend(true, [], this.get('structure')().get()));
                result.structure().each(function (instance) {
                    if (instance.active !== true || hashMap[instance.pID]) {
                        hashMap[instance.widgetID] = true;
                        sArr.push(instance.widgetID);

                        //removeChild,防止恢复后sortable，index跟children中的index对不上
                        if (!instance.active && !hashMap[instance.pID]) {
                            var collection = result.structure({widgetID: instance.pID}),
                                parent = collection.first(),
                                children,
                                i, item,
                                wID = instance.widgetID;

                            if (parent) {
                                for (children = parent.children, i = children.length; item = children[--i];) {
                                    if (wID === item) {
                                        children.splice(i, 1);

                                        collection.update({children: children});
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        //没有被删掉的组件实例
                        sMap[instance.widgetID] = true;
                    }
                });
                result.structure({widgetID: sArr}).remove();

                if (structureOnly) {
                    return result.structure;
                } else {
                    //remove lifecycle
                    result.lifecycle = app.taffy($.extend(true, [], data.lifecycle().get()));
                    lArr = result.lifecycle({active: false}).select('lifecycleID');
                    result.lifecycle([{widgetID: sArr}, {active: false}]).remove();
                    ioArr = ioArr.concat(lArr);

                    //remove event
                    result.event = app.taffy($.extend(true, [], data.event().get()));
                    eArr = result.event({active: false}).select('eventID');
                    result.event([{widgetID: sArr}, {active: false}]).remove();
                    ioArr = ioArr.concat(eArr);

                    //remove pageEDM
                    result.pageEdm = app.taffy(data.pageEdm({active: true}).get());

                    //remove code
                    result.code = app.taffy(JSON.parse(this.stringify(data.code().get())));
                    result.code({foreignID: ioArr}).remove();

                    result.var = app.taffy(JSON.parse(this.stringify(data.var().get())));


                    //remove i/o
                    $([CONST.EDM.DIRECTION.request, CONST.EDM.DIRECTION.response]).each(function (index, direction) {
                        var edmIO = app.taffy($.extend(true, [], data[direction]().get()));

                        edmIO([{active: false}, {widgetID: sArr}, {foreignID: ioArr}]).remove();

                        edmIO().each(function (item) {
                            var list, iArr = [], uArr = [];

                            if (list = item.list) {

                                if (list.TAFFY) {
                                    list = list().get();
                                }

                                list = $.extend(true, [], list);
                            }

                            list = app.taffy(list);

                            list({active: false})
                                .each(function (item) {
                                    item.uid && uArr.push(item.uid);
                                }).remove();

                            list({pID: uArr}).remove();

                            list().order('index').each(function (item, index) {
                                var updateData = {
                                    index: index
                                }, widgetID;

                                /*
                                 *  version      4.3
                                 *  update log   在保存中，将id找不到的元素解绑require/response
                                 *  author       lijiancheng@agree.com.cn
                                 * */
                                if (item.id && !sMap[item.id] && (widgetID = item.id.match(WIDGET_SPLIT)) && (!sMap[widgetID[1]])) {
                                    updateData.id = '';
                                }

                                list({___id: item.___id}).update(updateData);
                            });

                            edmIO({edmID: item.edmID}).update({list: list().get()});
                        });

                        result[direction] = edmIO;
                    });

                    //remove widget
                    result.widget = data.widget().get();

                    return result;
                }
            },

            preSave: function (isTaffy) {
                var data = this.data,
                    context=this,
                    config = {
                        url: [],
                        lastModifiedTime: new Date().getTime()
                    },
                    url = config.url, urlMap = {},
                    regex = CONST.REGEX, urlRegex = regex.URL, urlRedundancy = regex.URL_REDUNDANCY,
                    urlIndex = regex.URL_INDEX, urlID = regex.URL_ID,
                    result = this.removeRedundancy(),
                    list = CONST.DATA.list,
                    taffyList = CONST.DATA.taffyList,
                    handlerType, HANDLER_TYPE = CONST.EVENT.HANDLER,
                    i, j, item, items, subItem, jsonString, widgetIDs, id, table, tuple,
                    overviewURLMap = {}, overviewList, pushedUrlMap = {},
                    widgetReferenceMap = {},
                    deepSearchEDM = function (option, widgetIDs, url) {
                        var i,
                            seed = [{option: option, widgetIDs: widgetIDs, url: url}],
                            cursor = -1, seedItem;

                        while (seedItem = seed[++cursor]) {
                            option = seedItem.option;
                            widgetIDs = seedItem.widgetIDs;
                            url = seedItem.url;
                            if (option && widgetIDs.length) {
                                if ($.isArray(option)) {
                                    for (i = -1; subItem = option[++i];) {
                                        seed.push({
                                            option: subItem,
                                            widgetIDs: widgetIDs,
                                            url: url
                                        })
                                        //   deepSearchEDM(subItem, widgetIDs, url);
                                    }
                                } else if ($.isPlainObject(option)) {
                                    if (option.url && widgetIDs[option.url]) {
                                        if (option.active && !urlMap[option.url] && !pushedUrlMap[option.id]) {
                                            url.push({
                                                id: option.id,
                                                edmID: option.edmID,
                                                code: option.code,
                                                successCallback: option.successCallback,
                                                widgetID: widgetIDs[option.url].widgetID,
                                                desp: option.name,
                                                url: option.url,
                                                order: option.order,
                                                isEvent: false,
                                                applyTo: CONST.STEP.APPLY_TO.WIDGET
                                            });
                                            urlMap[option.url] = true;
                                            pushedUrlMap[option.id] = true;
                                        }

                                        delete widgetIDs[option.url];
                                        --widgetIDs.length;
                                    } else {
                                        for (i in option) {
                                            if (option.hasOwnProperty(i)) {
                                                seed.push({
                                                    option: option[i],
                                                    widgetIDs: widgetIDs,
                                                    url: url
                                                })
                                                // deepSearchEDM(option[i], item, url);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };

                window.pushedUrlMap = pushedUrlMap;

                for (i = list.length; item = list[--i];) {
                    config[item] = data[item];
                }
                for (i = taffyList.length; item = taffyList[--i];) {
                    config[item] = result[item]().get();
                }

                //生成url map
                result.lifecycle({isEDM: true}).each(function (tuple) {
                    if (tuple.url.match(urlRegex) && !pushedUrlMap[tuple.id]) {
                        url.push({
                            id: tuple.id,
                            widgetID: tuple.widgetID,
                            lifecycleID: tuple.lifecycleID,
                            edmID: tuple.edmID,
                            desp: tuple.desp,
                            url: tuple.url,
                            isEvent: false,
                            type: HANDLER_TYPE.AJAX
                        });
                        urlMap[tuple.url] = true;
                        pushedUrlMap[tuple.id] = true;
                    }
                });

                if (jsonString = JSON.stringify(config.event)) {
                    if (items = jsonString.match(urlRegex)) {
                        table = result.event;
                        for (i = items.length; item = items[--i];) {
                            if (!urlMap[item]) {
                                if ((id = item.replace(urlRedundancy, '')) && id.length) {
                                    if (tuple = (table({eventID: id}).first() || table({url: item}).first())) {

                                        if (tuple.url) {
                                            item = tuple.url;
                                        }

                                        if (tuple.handler && (tuple.handler.toUpperCase() in HANDLER_TYPE)) {
                                            handlerType = tuple.handler;
                                        } else {
                                            handlerType = HANDLER_TYPE.AJAX;
                                        }

                                        // if (tuple.eventID === '2CA8F8C6E5B3850D5B37-F758') debugger;
                                        if (!pushedUrlMap[tuple.id]) {
                                            url.push({
                                                id: tuple.id,
                                                widgetID: tuple.widgetID,
                                                eventID: tuple.eventID,
                                                desp: tuple.desp,
                                                emdID:(context.get('request')({eventID:tuple.eventID})||{}).edmID,
                                                url: item,
                                                isEvent: true,
                                                type: handlerType
                                            });
                                            urlMap[item] = true;
                                            pushedUrlMap[tuple.id] = true;
                                        }

                                    }
                                }
                            }
                        }
                    }
                }

                if ((jsonString = JSON.stringify(config.structure)) && (items = jsonString.match(urlRegex))) {

                    widgetIDs = {};
                    table = result.structure;

                    items.map(function (elem) {
                        if (elem && (item = elem.match(urlID)) && (item = item[1]) && (elem.match(urlIndex))) {

                            !widgetIDs[item] && (widgetIDs[item] = {length: 0});

                            if (!widgetIDs[item][elem]) {
                                widgetIDs[item][elem] = {
                                    url: elem,
                                    id: elem.match(urlIndex)[1],
                                    widgetID: item
                                };

                                widgetIDs[item].length++;
                            }

                        }
                    });

                    for (item in widgetIDs) {
                        if (widgetIDs.hasOwnProperty(item)) {
                            if (tuple = table({widgetID: item}).first()) {
                                //递归找ID
                                deepSearchEDM(tuple.option, widgetIDs[item], url);
                            }
                        }
                    }
                }

                if ((overviewList = config.code) && overviewList.length) {
                    items = [];
                    for (i = -1; item = overviewList[++i];) {
                        if ((item = item.nodeDataArray) && item.length) {
                            items.push.apply(items, item);
                        }
                    }
                    if (items.length) {

                        if ((jsonString = this.stringify(items)) && (items = jsonString.match(urlRegex))) {
                            for (i = items.length; item = items[--i];) {
                                overviewURLMap[item] = {};
                            }

                            overviewList = JSON.parse(jsonString);


                            for (i = -1; i < overviewList.length;) {
                                if (item = overviewList[++i]) {
                                    switch (typeof item) {
                                        case 'object':
                                            if (item instanceof Array) {
                                                overviewList.push.apply(overviewList, item);
                                            } else {
                                                for (j in item) {
                                                    if (item.hasOwnProperty(j) && (subItem = item[j])) {
                                                        switch (typeof subItem) {
                                                            case 'object':
                                                                if (j !== 'optionCopy' && j !== 'dataJSON') {
                                                                    if (subItem instanceof Array) {
                                                                        overviewList.push.apply(overviewList, subItem);
                                                                    } else {
                                                                        overviewList.push(subItem);
                                                                    }
                                                                }
                                                                break;
                                                            default:
                                                                if ((tuple = overviewURLMap[subItem]) && !tuple.hasProp) {
                                                                    if (item.desp) {
                                                                        tuple.desp = item.desp;
                                                                        tuple.id = Number(item.id);
                                                                        tuple.url = subItem;
                                                                        tuple.hasProp = true;
                                                                    }


                                                                }
                                                                break;
                                                        }
                                                    }
                                                }
                                            }


                                            break;
                                    }
                                }
                            }

                            for (i in overviewURLMap) {
                                if ((tuple = overviewURLMap[i]) && tuple.id && !urlMap[tuple.url] && !pushedUrlMap[tuple.id]) {
                                    url.push(tuple);
                                    urlMap[tuple.url] = true;
                                    pushedUrlMap[tuple.id] = true;
                                }
                            }
                        }
                    }

                    overviewList = null;
                }

                config.structure.map(function (elem) {
                    var href = elem.href;

                    if (widgetReferenceMap[href]) {
                        widgetReferenceMap[href]++;
                    } else {
                        widgetReferenceMap[href] = 1;
                    }
                });
              //  config.widget = app.taffy($.extend(true, [], result.widget));

                config.widget = app.taffy(JSON.parse(JSON.stringify(result.widget)));
                config.widget().each(function (elem) {
                    elem.count = widgetReferenceMap[elem.href] || 0;
                    elem.isNewest = false;
                    if (elem.isExternal) {
                        ++elem.count;
                    }
                });

                if (!isTaffy) {
                    config.widget = config.widget({count: {gt: 0}}).get();
                } else {

                    for (i = taffyList.length; item = taffyList[--i];) {
                        config[item] = result[item];
                    }
                }

                config.customCode=data.customCode;

                /*
                 *   version     4.3
                 *   desp        将版本更新到做断层处理
                 *   author      lijiancheng@agree.com.cn
                 * */
                config.version = CONST.AWOS_APP_UNITED_VERSION;

                return config;
            },
            getConfigValue: function (key) {
                var ret;

                if (this.configuration.hasOwnProperty(key)) {
                    ret = JSON.parse(JSON.stringify(this.configuration[key]));
                }

                return ret;
            },
            setConfigValue: function (key, newValue) {
                this.configuration[key] = newValue;
            },
            getConfig: function () {
                return this.configuration;
            },
            setConfig: function (configuration) {
                this.configuration = configuration;
            },
            getCopyConfig: function () {
                return JSON.parse(JSON.stringify(this.configuration));
            }

        };

        if (!dataModelIns) {
            dataModelIns = new Data();
        }
        return dataModelIns;
    })
})();