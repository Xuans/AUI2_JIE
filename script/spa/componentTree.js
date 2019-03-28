( /* <global> */function (undefined) {
    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "Model.Data", "const"], factory);
        }
        // global
        else {
            factory();
        }

    })(function ($, dataModel, CONST) {

        var CF_CONST = CONST.PAGE.CONTENT_FRAME,
            CT_CONST = {
                TEMP: {
                    SEARCH_CTN: '<div class="aui-tree-search-ctn">' +
                    '<div class="aui-tree-search-ctt">' +
                    '<i class="aui-search-left-icon aui aui-sousuo"></i>' +
                    '<input  placeholder="请搜索" data-role="searchCtt"/>' +
                    '<i class="aui-search-close hide aui aui-an-clear" data-role="searchClear"></i>' +
                    '</div>' +
                    '<div class="aui-search-icon-ctn">' +
                    '<span title="上一个" data-role="searchPre" class="aui-search-result-icon disabled">' +
                    '<i class="aui aui-an-arrowup"></i>' +
                    '</span>' +
                    '<span title="下一个" data-role="searchNext" class="aui-search-result-icon disabled">' +
                    '<i class="aui aui-an-arrowdown"> </i>' +
                    '</span>' +
                    ' </div>' +
                    '<div data-role="searchResult" class="aui-search-result-ctn"></div>' +
                    '</div>',
                    TREE_START: '<div class="aui-tree-ctn"><div class="aui-tree-ctt" id="auiTreeCtt"><ul class="aui-tree-list">',
                    TREE_END: '</ul></div></div>',
                    TREE_CTN_START: '<ul class="aui-tree-list" data-role="auiTreeList">',
                    TREE_CTN_END: '</ul>',
                    TREE_NODE_START: '<li data-widget-id="_data__widget__id_" data-href="_data__href_" class="aui-tree-node _acceptable_">' +
                    '<div class="aui-tree-block" data-role="treeItem" title="_widget__name_">' +
                    '<div class="aui-tree-block-title">' +
                    '<i class="_widget__icon_"></i> <span class="aui-tree-widget-name" data-event-role="treeWidgetName">_widget__name_</span><span class="aui-tree-widget-id" data-event-role="treeWidgetID">[_widget__id_]</span>' +
                    '<span class="aui-validate-ctt" data-event-role="treeValidateCtt">_validate__content_</span>' +
                    '<div class="aui-config-operation-ctn">_operation__edit_' +
                    '</div>' +
                    '</div>' +
                    '<div data-role="eventLifecycleCtn" class="aui-tree-block-ctt">_event__lifecycle_</div>' +
                    '</div>' +
                    '<div class="aui-tree-toggle _hide_" data-role="treeToggle"><i class="aui aui-jiantou-xia"></i></div>',
                    TREE_NODE_END: '</li>',
                    SEARCH_RESULT: '第<em data-role="resultIndex">_index_</em>结果,共<em>_result_</em>结果',
                    EDIT_CONTENT_TEMP: '<i data-role="copy" class="aui aui-fuzhi" title="复制"></i>' +
                    ' <i data-role="cut" class="aui aui-jianqie" title="剪切"></i>' +
                    '<i data-role="paste" class="aui aui-niantie" title="粘贴"></i>' +
                    '<i data-role="del" class="aui aui-shanchu" title="删除"></i>',
                    EDIT_EDM_TEMP: '<i data-role="del" class="aui aui-shanchu" title="删除"></i>',
                    OPERATE_ICON: '<i data-role="_role_" class="_class_" title="_title_"></i>',

                },
                LIST: ['children', 'widgetID', 'widgetName', 'pID', 'href'],
                EVENT_LIFECYCLE_LIST: ['event', 'lifecycle'],

                EDM: {
                    validateSelector: true,
                    validateType: true,
                    validateHandler: true,
                    require: true,
                    successCallback: true,
                    errorCallback: true,
                    cleanCallback: true,
                    hasChineseCharacter: true,
                    id: true
                },
                ROLE: {
                    SEARCH_CTT: 'searchCtt',
                    SEARCH_CLEAR: 'searchClear',
                    SEARCH_CANCEL: 'searchCancel',
                    SEARCH_PRE: 'searchPre',
                    SEARCH_NEXT: 'searchNext',
                    SEARCH_RESULT_ITEM: 'searchResultItem',
                    TOGGLE_FOLD_UP: 'toggleFoldUp',
                    TREE_LIST: 'auiTreeList',
                    WIDGET_NAME: 'configWidgetName',
                    SEARCH_RESULT: 'searchResult',
                    RESULT_INDEX: 'resultIndex'
                },

            };

        var TEMP = CT_CONST.TEMP,
            ROLE = CT_CONST.ROLE;

        function ComponentTree(option) {

            this.map = {};
            this.$view = option.$view;
            this.treeData = option.treeData || [];
            this.AUI = option.AUI;
            this.icon = option.icon;
            this.init();

            this.listen();


        }

        ComponentTree.prototype = {
            constructor: ComponentTree,
            init: function () {
                var context = this,
                    treeData = context.treeData,
                    $view = context.$view,
                    html = '';
                treeData && treeData.length && (html = context.getChildHtml(treeData));
                $view.empty().append(TEMP.SEARCH_CTN + TEMP.TREE_START + html + TEMP.TREE_END);

            },
            refresh: function (data) {
                this.treeData = data;
                this.init();
            },
            getDroppableChildren: function () {
                return this.$view.find("li");
            },
            getIconHtml: function () {
                var i, item, icon, ret = '';

                if (icon = this.icon) {
                    for (i = -1; item = icon[++i];) {
                        ret += CT_CONST.TEMP.OPERATE_ICON.replace(/_role_/, item.role || '')
                            .replace(/_class_/, item.class || '')
                            .replace(/_title_/, item.title || '');
                    }
                }
                return ret;
            },
            addChildren: function (data, pID) {
                var context = this,
                    treeData = context.treeData,
                    childrenData,
                    children,
                    ret,
                    id, i, elment, item, j;

                if (data && data.length) {
                    childrenData = data.concat([]);
                    for (i = -1; elment = childrenData[++i];) { // foreach==> for
                        if (!elment.pID) {
                            elment.pID = pID;
                            id = elment.widgetID;
                        }
                    }


                    for (j = -1; item = treeData[++j];) {  // foreach==> for
                        if (item.widgetID === pID) {
                            (children = item.chlidren || []) && children.push(id);
                            context.treeData = treeData.concat(childrenData);
                        }
                    }

                }

                // return ret;
            },
            removeChild: function (id) {
            },
            getChildHtml: function (treeData, pID) {
                var _this = this,
                    seek = [],
                    html = [],
                    propHtml = [],
                    map = {},
                    cursor,
                    i,
                    item,
                    _i,
                    cacheItem;


                if (treeData && treeData.length) {
                    for (_i = -1; cacheItem = treeData[++_i];) {  //foreach--- for
                        if (cacheItem.widgetID !== 'widgetCreator') {
                            if (pID) {
                                if (cacheItem.pID === pID) {
                                    seek.push(cacheItem);
                                }
                            } else {
                                if (!cacheItem.pID) {
                                    seek.push(cacheItem);
                                }
                            }
                            map[cacheItem.widgetID] = cacheItem;
                        }

                    }

                    i = -1;

                    while (item = seek[++i]) {
                        cursor = i;
                        propHtml = [];
                        if (item.type === 'html') {
                            html.push(item.content);
                        } else {
                            if (typeof item === 'string') {
                                item = map[item];
                            }

                            if (item) {
                                html.push(TEMP.TREE_NODE_START
                                    .replace(/_data__widget__id_/, item.widgetID)
                                    .replace(/_acceptable_/, $AW(item.widgetID) && (!$AW(item.widgetID).length || $AW(item.widgetID).acceptable()) ? '' : CONST.WIDGET.UN_ACCEPTABLE)
                                    .replace(/_widget__icon_/, item.widgetIcon)
                                    .replace(/_widget__id_/, item.ID)
                                    .replace(/_widget__name_/g, item.widgetName)
                                    .replace(/_data__href_/g, item.href)
                                    .replace(/_event__lifecycle_/g, _this.getEventLifecycle(item.widgetID))
                                    .replace(/_validate__content_/, _this.validateIsUpdate(item.widgetID))
                                    .replace(/_hide_/g, item.children && item.children.length ? '' : CONST.STYLE_STATUS.HIDE)
                                    .replace(/_operation__edit_/g, _this.getIconHtml())
                                );

                                if (item.children && item.children.length) {

                                    seek.splice.apply(seek, [cursor + 1, 0].concat([{
                                        type: 'html',
                                        content: TEMP.TREE_CTN_START
                                    }]).concat(item.children).concat([{
                                        type: 'html',
                                        content: TEMP.TREE_CTN_END + TEMP.TREE_NODE_END
                                    }]));
                                } else {
                                    html.push(TEMP.TREE_NODE_END);
                                }
                            }
                        }
                    }

                    return html.join('');
                }
            },
            getEventLifecycle: function (widgetID) {
                var context = this,
                    LIST = CT_CONST.EVENT_LIFECYCLE_LIST,
                    item, eventLifecycleData, i, j, eventItem, ret = [];
                if (widgetID) {
                    for (i = -1; item = LIST[++i];) {
                        eventLifecycleData = dataModel.get(item)({
                            widgetID: widgetID,
                            active: true
                        }).get();

                        if (eventLifecycleData && eventLifecycleData.length) {
                            for (j = -1; eventItem = eventLifecycleData[++j];) {

                                ret.push(CF_CONST.TEMP.TYPE_HTML.replace(/_data__id_/g, widgetID + '_' + item + '_' + eventItem[item + 'ID'])
                                    .replace(/_data__type__id_/, eventItem[item + 'ID'])
                                    .replace(/_type__class_/g, item)
                                    .replace(/_type__desp_/g, eventItem.desp)
                                    .replace(/_type__icon_/, typeof CF_CONST.TYPE_ICON_MAP[item] === 'string' ? CF_CONST.TYPE_ICON_MAP[item] : CF_CONST.TYPE_ICON_MAP[item][eventItem.spaAction + '_' + eventItem.pageAction])
                                )

                            }
                        }
                    }
                }
                return ret.join('');
            },
            validateIsUpdate: function (widgetID) {
                var flag = false,
                    ret = [],
                    data,
                    key, style, edm,
                    css, forFn, nsl,
                    nslFlag=false,
                    valueKey, item, i, _i = 0, value,
                    arr = [],
                    un_nsl = ['active', 'value'],
                    edmObj = {
                        validateSelector: true,
                        validateType: true,
                        validateHandler: true,
                        require: true,
                        successCallback: true,
                        errorCallback: true,
                        cleanCallback: true,
                        hasChineseCharacter: true,
                        id: true

                    },
                    temp = function (key) {
                        var item = CF_CONST.VALIDATE_ICON[key.toUpperCase()];

                        return CF_CONST.TEMP.VALIDATE_TEMP.replace(/_validate__icon_/, key)
                            .replace(/_title_/, item.title)
                            .replace(/_icon__class_/, item.icon)
                            .replace(/_role_/, item.role)
                    };

                if (widgetID) {
                    data = dataModel.get('structure')({widgetID: widgetID}).get();
                    if (data && data.length && (data = data[0])) {


                        if ((nsl = data.nsl) && nsl.length ) {

                            for (i = -1; item = nsl[++i];) {  //foreach ==> for
                                if(nslFlag) break;
                                for (key in item) {
                                    if (item.hasOwnProperty(key) && item[key]) {

                                        if (!~un_nsl.indexOf(key)) {
                                            ret.push(temp('nsl'));
                                            nslFlag=true;
                                            break;
                                        }

                                        for (valueKey in (value = item[key].value)) {
                                            if (value.hasOwnProperty(valueKey) && value[valueKey]) {
                                                ret.push(temp('nsl'));
                                                nslFlag=true;
                                                break;
                                            }
                                        }


                                    }
                                }
                            }
                        }

                        if ((css = data.css)) {
                            if (css.cssCode) {
                                ret.push(temp('css'));

                            } else if (css.theme && data.cssCopy && data.cssCopy.defaultTheme && JSON.stringify(data.css.theme) !== JSON.stringify(data.cssCopy.defaultTheme)) {

                                ret.push(temp('css'));

                            } else if ((style = css.style)) {

                                forFn = function (style) {
                                    for (key in style) {
                                        if (style.hasOwnProperty(key)) {
                                            arr.push(style[key]);
                                        }

                                    }

                                    while (typeof arr[_i] === 'string' || typeof arr[_i] === 'object') {
                                        item = arr[_i];
                                        if (item && typeof item === 'string') {
                                            flag = true;
                                            break;
                                        } else if (typeof item === 'object') {
                                            for (key in item) {
                                                if (item.hasOwnProperty(key)) {
                                                    arr.push(item[key])
                                                }
                                            }

                                        }
                                        _i++;
                                    }
                                };

                                forFn(style);

                                if (flag) {
                                    ret.push(temp('css'));
                                }
                            }
                        }


                        if ((edm = data.edm) && !$.isEmptyObject(edm)) {
                            for (key in edm) {
                                if (edm.hasOwnProperty(key) && !!edm[key] && !(key in edmObj)) {
                                    ret.push(temp('edm'));
                                    break;
                                }
                            }
                        }
                    }
                }
                return ret.join('');
            },

            getContext: function () {
                return this.$view;
            }

            ,
            getTreeData: function () {
                return this.treeData;
            }
            ,


            clearIconShow: function (isShow) {
                $('[data-role=' + ROLE.SEARCH_CLEAR + ']', this.$view)[!!isShow ? 'removeClass' : 'addClass'](CONST.STYLE_STATUS.HIDE);
            }
            ,
            getValue: function () {
                return this.value;
            }
            ,
            getCurrentSearchIndex: function () {
                return this.currentSearchIndex;
            }
            ,
            setCurrentSearchIndex: function (index) {

                this.currentSearchIndex = index;

            }
            ,
            searchResult: function () {
                var value = this.getValue(),
                    $ctn = $("#" + CF_CONST.TREE_CTN, this.$view),
                    $searchResultCtn = $("[data-role=" + ROLE.SEARCH_RESULT + "]", this.$view),
                    globalRegex,
                    $searchResult,
                    text,
                    classType,
                    i = 0;

                this.setCurrentSearchIndex(1);
                this.clearIconShow(!!value ? true : false);

                if (value && (value = value.trim())) {

                    value = value.toLowerCase();

                    if (~value.indexOf('\\')) {
                        value = '\\\\';
                    }

                    globalRegex = new RegExp('(' + value + ')', 'gi');
                    $ctn.html($ctn.html().replace(/<em data-event-role="searchResultItem"[^>]*>([^<]+)<\/em>/g, '$1'));
                    Array.prototype.forEach.call($ctn.find('*'), function (elem, index) {

                        if (!elem.children.length && (text = elem.innerText) && text.match(globalRegex)) {
                            i++;
                            elem.innerHTML = text.replace(globalRegex, '<em data-event-role="searchResultItem">$1</em>');
                        }
                    });

                    $searchResult = $('[data-event-role=' + ROLE.SEARCH_RESULT_ITEM + ']', this.$view);

                    $searchResultCtn.empty().append(
                        TEMP.SEARCH_RESULT.replace('_index_', $searchResult.length ? 1 : 0)
                            .replace('_result_', $searchResult.length)
                    );


                    $('[data-event-role=' + ROLE.SEARCH_RESULT_ITEM + ']', this.$view).eq(0).addClass(CONST.STYLE_STATUS.ACTIVE);

                } else {
                    $ctn.html($ctn.html().replace(/<em data-event-role="searchResultItem"[^>]*>([^<]+)<\/em>/g, '$1'));
                    $searchResultCtn.empty();
                }

                classType = ($searchResult && $searchResult.length) ? 'removeClass' : 'addClass';

                $('[data-role=' + ROLE.SEARCH_PRE + ']')[classType](CONST.STYLE_STATUS.DISABLED);
                $('[data-role=' + ROLE.SEARCH_NEXT + ']')[classType](CONST.STYLE_STATUS.DISABLED);

                $AW.trigger($AW._STATUS.CONTENT_FRAME.DRAG_WIDGET);


            }
            ,
            validateTreeIconHide: function ($widget) {
                var $children;

                if ($widget && $widget.length) {
                    $children = $widget.children('ul');
                    $widget.children('[data-role=treeToggle]')[$children.length && $children.children().length ? 'removeClass' : 'addClass'](CONST.STYLE_STATUS.HIDE);
                }

            }
            ,
            foldUp: function ($target) {
                $target.removeClass(CONST.STYLE_STATUS.FOLD);
                $target.nextAll().removeClass(CONST.STYLE_STATUS.HIDE);
            }
            ,
            listen: function () {
                var context = this;

                this.$view.off('.componentTree').on({
                    'click.componentTree': function (e) {
                        var $target = $(e.target || event.srcElement).closest('[data-role]'),
                            role = $target.attr('data-role'),
                            index = context.getCurrentSearchIndex(),
                            $searchResult = $('[data-event-role=' + ROLE.SEARCH_RESULT_ITEM + ']', this.$view),
                            classType,
                            length;
                        // arr = ['treeToggle','toggleFoldUp','searchClear','searchPre','searchNext'];
                        // if ((context.mode && ~arr.indexOf(role)) || !context.mode) {
                        switch (role) {
                            //展开折叠
                            case CF_CONST.TREE_TOGGLE:
                                $target.toggleClass(CONST.STYLE_STATUS.FOLD);
                                $target.nextAll().toggleClass(CONST.STYLE_STATUS.HIDE);
                                break;

                            //清除搜索
                            case ROLE.SEARCH_CLEAR:
                                context.value = '';
                                $('[data-role=' + ROLE.SEARCH_CTT + ']', context.$view).val(context.getValue());
                                context.searchResult();

                                break;

                            //搜索下一个
                            case ROLE.SEARCH_NEXT:

                                if ($searchResult && (length = $searchResult.length)) {
                                    index = index < length ? index + 1 : 1;
                                    context.setCurrentSearchIndex(index);
                                    $target = $searchResult.eq(index - 1);
                                    $searchResult.removeClass(CONST.STYLE_STATUS.ACTIVE);
                                    $target.addClass(CONST.STYLE_STATUS.ACTIVE);
                                    $('[data-role=' + ROLE.RESULT_INDEX + ']', context.$view).text(index);
                                    context.foldUp($target.parents('ul').prev());
                                    app.scrollTop($('#' + CF_CONST.TREE_CTN, context.$view), $target, 200, 15);

                                }
                                break;

                            //搜索上一个
                            case ROLE.SEARCH_PRE:
                                if ($searchResult && (length = $searchResult.length)) {

                                    index = index > 1 ? index - 1 : length;
                                    context.setCurrentSearchIndex(index);
                                    $target = $searchResult.eq(index - 1);
                                    $searchResult.removeClass(CONST.STYLE_STATUS.ACTIVE);
                                    $target.addClass(CONST.STYLE_STATUS.ACTIVE);
                                    $('[data-role=' + ROLE.RESULT_INDEX + ']', context.$view).text(index);
                                    context.foldUp($target.parents('ul').prev());
                                    app.scrollTop($('#' + CF_CONST.TREE_CTN, context.$view), $target, 200, 15);
                                }
                                break;

                            //全部展开/折叠
                            case  ROLE.TOGGLE_FOLD_UP:

                                $target.toggleClass(CONST.STYLE_STATUS.FOLD);
                                classType = $target.hasClass(CONST.STYLE_STATUS.FOLD) ? 'addClass' : 'removeClass';
                                $('[data-role=' + ROLE.TREE_TOGGLE + ']', context.$view)[classType](CONST.STYLE_STATUS.FOLD);
                                $('[data-role=' + ROLE.TREE_LIST + ']', context.$view)[classType](CONST.STYLE_STATUS.HIDE);
                                break;


                        }


                    },
                    'keyup.componentTree': function (e) {
                        var $target = $(e.target || event.srcElement).closest("[data-role]"),
                            role = $target.attr('data-role');

                        switch (role) {
                            case ROLE.SEARCH_CTT:
                                app.performance.longDelay(function () {
                                    context.value = $target.val();
                                    context.searchResult();
                                });

                                break;
                        }
                    }
                });
            }
        };

        return ComponentTree;
    })
})
();