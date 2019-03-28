define(["jquery", "const", "componentTree"], function ($, CONST, ComponentTree) {
    var STYLE_STATUS = CONST.STYLE_STATUS,
        STATUS = $AW.STATUS,
        CONTENT_FRAME_STATUS = $AW._STATUS.CONTENT_FRAME,
        NAMESPACE = '.auiContentFrame',
        contentStatusList = [],
        statusList = [],
        CONTENT_CONST = CONST.PAGE.CONTENT_FRAME,
        ContentTree = function ($el, dataModel) {
            this.$el = $el;
            this.dataModel = dataModel;
            this.componentTreeIns = new ComponentTree({
                $view: $(CONTENT_CONST.EDITOR_CTN),
                treeData: [],
                icon: CONTENT_CONST.TREE_ICON
            });
            this.initComponentTree();
            this.listener();
        }, key;

    for (key in CONTENT_FRAME_STATUS) {
        contentStatusList.push(CONTENT_FRAME_STATUS[key] + NAMESPACE);
    }

    for (key in STATUS) {
        statusList.push(STATUS[key] + NAMESPACE);
    }

    ContentTree.prototype = {
        constructor: ContentTree,
        initComponentTree: function () {
            var context = this,
                dataModel = this.dataModel,
                data = dataModel.get('structure')().get(),
                i, item, widget, _i, _item, viewerData, treeData = [],
                widgetData = [], frame;

            if (data && data.length) {
                for (i = -1; item = data[++i];) {
                    widget = dataModel.get('widget')({href: item.href}).first();

                    if (auiApp.mode === CONST.MODE.VIEWER) {
                        viewerData = dataModel.get('widget')({pType: 'viewer'}).first();
                        if ((frame = viewerData.frame) !== true) {
                            widgetData = widgetData.concat(viewerData, frame.widget);
                            for (_i = -1; _item = widgetData[++_i];) {
                                if (_item.href === item.href) {
                                    widget = _item;
                                }
                            }
                        }
                    }

                    if (widget) {
                        treeData.push({
                            ID: item.attr.id,
                            href: item.href,
                            widgetIcon: widget.icon,
                            widgetID: item.widgetID,
                            widgetName: item.href === CONST.WIDGET.PAGE_HREF ? item.attr.desp : item.attr.widgetName,
                            pID: item.pID,
                            children: item.children ? item.children : []
                        });
                    }
                }
            }


            this.componentTreeIns.refresh(treeData);

            app.performance.longDelay(function () {
                for (_i = -1; _item = data[++_i];) {
                    context.dragWidget(_item.widgetID);
                }

            })


        },
        validateContentTreeIconHide: function ($widget) {
            var $children;
            if ($widget && $widget.length) {
                $children = $widget.children('ul');
                $widget.children(CONTENT_CONST.TREE_TOGGLE_ROLE)[$children.length && $children.children().length ? 'removeClass' : 'addClass'](CONST.WIDGET.EVENT_TYPE.HIDE);
            }
        },
        dragWidget: function (widgetID) {

            var $elem,
                $view = $(CONTENT_CONST.EDITOR_CTN),
                context = this,
                dataModel = this.dataModel;
            if (widgetID && ($elem = $('[data-widget-id=' + widgetID + ']', $view)) && $elem.length) {
                $elem.sortable({
                    items: '[' + CONST.WIDGET.DATA_ATTR + ']',
                    distance: CONST.WIDGET.DISTANCE,
                    delay: CONST.WIDGET.DELAY,
                    disabled: false,
                    cursor: "move",
                    scroll: false,
                    zIndex: CONST.WIDGET.Z_INDEX,
                    helper: 'clone',
                    update: function (ev, ui) {

                        var $widget = $(ui.item),
                            widgetID = $widget.attr(CONST.WIDGET.DATA_ATTR),
                            widget = $AW(widgetID),
                            elem = widget[0],
                            pWidget = widget.parent(),
                            $parent = $widget.parent().closest('[' + CONST.WIDGET.DATA_ATTR + ']'),
                            pWidgetId = $parent.attr(CONST.WIDGET.DATA_ATTR),
                            newIndex = $widget.index(),
                            transcript, children,
                            len, i, revokeData;

                        if (elem.data && pWidgetId === pWidget[0].widgetID && pWidget[0].data) {
                            if (newIndex >= 0) {
                                for (children = pWidget[0].data.children, len = children.length, i = -1; ++i < len;) {
                                    if (children[i] === widgetID) {

                                        revokeData = dataModel.get('structure')().get();
                                        transcript = children.join(',').split(',');
                                        children.splice(i, 1);
                                        children.splice(newIndex, 0, widgetID);
                                        pWidget.update({children: children});
                                        $AW.chain.updateChildren(pWidget[0].widgetID, children);

                                        $AW.trigger(CONTENT_FRAME_STATUS.REVOKE, revokeData)
                                            .trigger(STATUS.PREVIEW_FRESH);

                                        break;
                                    }
                                }
                            }
                        } else {
                            return false;
                        }

                    }
                })
                    .droppable({
                        accept: function ($widget) {

                            var widgetConfig = $AW($elem.attr(CONST.WIDGET.DATA_ATTR)),
                                $target = $widget.closest(CONST.PAGE.ATTR_HREF_SELECTOR),
                                href = $target.attr(CONST.PAGE.ATTR_HREF),
                                ret = false,
                                dropWidgetConfig,
                                type,
                                accept, i, item;

                            if (widgetConfig && widgetConfig.length && (widgetConfig = widgetConfig[0].widget)) {


                                dropWidgetConfig = dataModel.get('menu')({href: href}).first();


                                type = widgetConfig.base ? (widgetConfig.type + ' ' + widgetConfig.base) : (widgetConfig.type);

                                type.trim();

                                if (dropWidgetConfig) {

                                    accept = dropWidgetConfig.accept || dropWidgetConfig.type;


                                    type = type.split(/\s{1,}/);

                                    for (i = type.length; item = type[--i];) {

                                        ret = ~accept.indexOf(item) ? true : false;

                                        if (ret) {
                                            break;
                                        }
                                    }

                                }
                            }

                            return ret;
                        },
                        greedy: true,
                        addClasses: false,
                        hoverClass: CONST.WIDGET.DROP_CLASS,
                        tolerance: 'pointer',
                        distance: CONST.WIDGET.DISTANCE,
                        drop: function (_, ui) {
                            var $this = $(this),
                                pId = $this.attr(CONST.WIDGET.DATA_ATTR),
                                $widget = $(ui.draggable),

                                $target = $widget.closest(CONST.PAGE.ATTR_HREF_SELECTOR),
                                href = $target.attr(CONST.PAGE.ATTR_HREF),
                                title = $widget.attr("title"),
                                pWidget = $AW(pId),
                                widgetID, widgetConfig, widget, oldPWidget, children, oldChildren, len, i,
                                revokeData,
                                $ul, $parent;

                            widgetConfig = dataModel.get('menu')({href: href}).first();


                            if (pWidget.droppable() && pWidget.acceptable() && widgetConfig) {

                                revokeData = dataModel.get('structure')().get();
                                if (widgetConfig.frame && widgetConfig.frame !== 'null') {

                                    pWidget.paste(href, undefined, undefined, function () {
                                        $AW.trigger(CONTENT_FRAME_STATUS.REVOKE, revokeData);
                                    });

                                } else {

                                    if (widgetID = $widget.attr(CONST.WIDGET.DATA_ATTR)) {

                                        widget = $AW(widgetID);
                                        oldPWidget = widget.parent();

                                        if (oldPWidget && oldPWidget.length && pWidget[0].widgetID !== oldPWidget[0].widgetID && widget.draggable()) {

                                            setTimeout(function () {

                                                //fix me
                                                for (oldChildren = oldPWidget[0].data.children, len = oldChildren.length, i = -1; ++i < len;) {

                                                    if (oldChildren[i] === widgetID) {
                                                        //old widget

                                                        oldChildren.splice(i, 1);
                                                        oldPWidget.update({children: oldChildren});

                                                        widget.update({pID: pWidget[0].widgetID});

                                                        //new widget

                                                        children = pWidget[0].data.children || [];

                                                        children.splice(children.length, 0, widgetID);

                                                        pWidget.update({children: children});

                                                        $AW.chain.update(pWidget[0].widgetID, widgetID);

                                                        break;
                                                    }
                                                }
                                                $parent = $widget.parent().closest(CONST.WIDGET.DATA_SELECTOR);
                                                $ul = $this.children('ul');
                                                if (!$ul.length) {
                                                    $this.append('<ul class="aui-tree-list" data-role="auiTreeList">');
                                                }

                                                $this.children('ul').append($widget.detach());

                                                context.validateContentTreeIconHide($parent);
                                                context.validateContentTreeIconHide($this);

                                                widget.config();


                                                $AW.trigger(CONTENT_FRAME_STATUS.REVOKE, revokeData);
                                                $AW.trigger($AW.STATUS.PREVIEW_FRESH);
                                            }, 30);

                                        } else {

                                        }


                                    } else {


                                        pWidget.append(href, function (oWidget) {
                                            oWidget.config();
                                            $AW.trigger(CONTENT_FRAME_STATUS.REVOKE, revokeData);
                                        });
                                    }

                                }


                            } else {

                                app.alert(pWidget.name() + '被禁用通过拖拽放置子组件，请通过配置方式拖拽组件！', app.alert.WARNING);

                            }

                            $('[' + CONST.WIDGET.DATA_ATTR + ']').removeClass(CONST.WIDGET.DROP_CLASS);

                            return false;
                        }

                    })
            }

        },
        listener: function () {
            var context = this,
                dataModel = context.dataModel,
                contentTreeRevoke;


            context.$el.off('.auiContentFrame').on({
                'click.auiContentFrame': function (e) {
                    var $target = $(e.target || event.srcElement).closest(CONST.PAGE.ATTR_ROLE_SELECTOR),
                        role = $target.attr(CONST.PAGE.ATTR_ROLE),
                        $widget = $target.closest('[' + CONST.WIDGET.DATA_ATTR + ']'),
                        code = dataModel.get('code')().get(),
                        request = dataModel.get('request')().get(),
                        response = dataModel.get('response')().get(),
                        widgetID = $widget.attr(CONST.WIDGET.DATA_ATTR),
                        widgetIns = $AW(widgetID),
                        revokeData = [],
                        CONTENT_CONST = CONST.PAGE.CONTENT_FRAME,
                        eventLifecycleIcon = {
                            EVENT: '<i class="aui-event-type aui aui-shijian"></i>',
                            LIFECYCLE: '<i class="aui-init-type aui aui-shengmingzhouqichushicaozuo"></i>'
                        },
                        map = {},
                        delData = [],
                        widgetEdmData = [],
                        id, classType,
                        delHtml = '', widgetHtml = '', nodeDataArray,
                        list,
                        i, item, _i, _item, widget, typeData, $li,
                        eventLifecycleValidate = function (item, code) {

                            var result = code.match(/##([^_]+)_WID_VAR##/i),
                                eventLifecycleMap = {},
                                applyTo;

                            if (result && result[1] === widgetID) {
                                applyTo = item.applyTo.toLowerCase();
                                eventLifecycleMap[applyTo + 'ID'] = item.foreignID;
                                if (applyTo === 'widget') {
                                    map[item.foreignID] = {
                                        desp: ($AW(item.widgetID).name && $AW(item.widgetID).name()) || '',
                                        applyTo: item.applyTo
                                    };
                                } else if (typeData = dataModel.get(applyTo)(eventLifecycleMap).first()) {
                                    map[item.foreignID] = {
                                        desp: typeData.desp,
                                        applyTo: item.applyTo
                                    };
                                }
                            }
                        };

                    switch (role) {

                        //config
                        case CONST.PAGE.CONFIGURE_FRAME.NSL.SELF:
                        case CONST.PAGE.CONFIGURE_FRAME.CSS.SELF:
                        case CONST.PAGE.CONFIGURE_FRAME.EDM.SELF:
                            if (widgetIns = $AW(widgetID)) {
                                widgetIns.config();
                            }
                            //  $(CONTENT_CONST.TREE_ITEM_ROLE, $(CONST.PAGE.FRAME.EDITOR_CTN)).removeClass(STYLE_STATUS.ACTIVE);
                            $target.parents(CONTENT_CONST.TREE_ITEM_ROLE).addClass(STYLE_STATUS.ACTIVE);

                            app.performance.longDelay(function () {
                                $li = $('[data-href=' + role + ']', $(CONST.PAGE.CONFIGURE_FRAME.CTT));
                                if (!$li.hasClass(STYLE_STATUS.ACTIVE)) {
                                    $li.addClass(STYLE_STATUS.ACTIVE).siblings().removeClass(STYLE_STATUS.ACTIVE);
                                    $('#' + role, $(CONST.PAGE.CONFIGURE_FRAME.CTT)).removeClass(STYLE_STATUS.HIDE).siblings().addClass(STYLE_STATUS.HIDE);
                                }

                            });


                            break;

                        case CONTENT_CONST.TREE_ITEM:

                            $(CONTENT_CONST.TREE_ITEM_ROLE, $(CONTENT_CONST.EDITOR_CTN)).removeClass(STYLE_STATUS.ACTIVE);
                            $target.addClass(STYLE_STATUS.ACTIVE);
                            if (widgetIns = $AW(widgetID)) {
                                widgetIns.config();

                            }

                            break;

                        //展开折叠
                        case  CONTENT_CONST.TOGGLE_FOLD_UP:

                            $target.toggleClass(STYLE_STATUS.FOLD);
                            classType = $target.hasClass(STYLE_STATUS.FOLD) ? 'addClass' : 'removeClass';
                            $(CONTENT_CONST.TREE_TOGGLE_ROLE, $(CONST.PAGE.CTN))[classType](STYLE_STATUS.FOLD);
                            $(CONTENT_CONST.TREE_LIST_ROLE, $(CONST.PAGE.CTN))[classType](STYLE_STATUS.HIDE);
                            break;

                        case CONTENT_CONST.TREE_REVOKE:

                            if (contentTreeRevoke && contentTreeRevoke.length) {
                                for (i = -1; item = contentTreeRevoke[++i];) {
                                    widget = dataModel.get('widget')({href: item.href}).first();
                                    revokeData.push({
                                        ID: item.attr.id,
                                        href: item.href,
                                        widgetIcon: widget.icon || widget.info.icon,
                                        widgetID: item.widgetID,
                                        widgetName: item.attr.widgetName,
                                        pID: item.pID,
                                        children: item.children ? item.children : []
                                    });
                                }
                                context.componentTreeIns.refresh(revokeData);

                                context.dataModel.set('structure', app.taffy(contentTreeRevoke));


                                for (_i = -1; _item = contentTreeRevoke[++_i];) {
                                    context.dragWidget(_item.widgetID);
                                }
                                contentTreeRevoke = [];
                                $(CONTENT_CONST.TREE_REVOKE_ROLE).addClass(STYLE_STATUS.DISABLED);
                                $AW.trigger($AW.STATUS.PREVIEW_FRESH);
                            }
                            break;

                        //事件跳转逻辑概览
                        case CONTENT_CONST.EVENT_OVERVIEW:
                            id = $target.attr('data-id');
                            widgetID = id && id.split('_event_');

                            if (widgetID && widgetID.length >= 2) {

                                window.A.openPage(CONST.PAGE.OVERVIEW_FRAME.SELF, function () {
                                    $AW.trigger($AW._STATUS.OVERVIEW_FRAME.SHOW, {
                                        widgetID: widgetID[0],
                                        foreignID: widgetID[1],
                                        applyTo: 'EVENT'
                                    })
                                });

                                $AW.trigger($AW._STATUS.CONFIGURE_FRAME.CONFIG, widgetID[0])
                            }

                            break;

                        //生命周期跳转逻辑概览
                        case CONTENT_CONST.LIFECYCLE_OVERVIEW:

                            id = $target.attr('data-id');
                            widgetID = id && id.split('_lifecycle_');
                            if (widgetID && widgetID.length >= 2) {
                                widgetIns = dataModel.get('lifecycle')({lifecycleID: widgetID[1]}).get();

                                if (widgetIns.length && (widgetIns = widgetIns[0])) {
                                    window.A.openPage(CONST.PAGE.OVERVIEW_FRAME.SELF, function () {
                                        $AW.trigger($AW._STATUS.OVERVIEW_FRAME.SHOW, {
                                            widgetID: widgetIns.widgetID,
                                            foreignID: widgetIns.lifecycleID,
                                            applyTo: 'LIFECYCLE',
                                            spaAction: widgetIns.spaAction,
                                            pageAction: widgetIns.pageAction
                                        })
                                    });

                                    $AW.trigger($AW._STATUS.CONFIGURE_FRAME.CONFIG, widgetIns.widgetID)

                                }
                            }
                            break;

                        //剪切
                        case CONTENT_CONST.CUT:


                        case CONTENT_CONST.DEL:

                            if (widgetIns && widgetIns.length) {


                                code = code.filter(function (item) {
                                    return item.widgetID !== widgetID;
                                });

                                if (code.length) {
                                    for (i = -1; item = code[++i];) {
                                        if (item && (nodeDataArray = item.nodeDataArray).length) {
                                            for (_i = -1; _item = nodeDataArray[++_i];) {
                                                if (_item.category === 'widget') {
                                                    eventLifecycleValidate(item, _item.code);
                                                }
                                            }
                                        }
                                    }
                                }


                                request = request.filter(function (item) {
                                    return item.widgetID !== widgetID;
                                });

                                response = response.filter(function (item) {
                                    return item.widgetID !== widgetID;
                                });

                                if (request.length) {
                                    for (i = -1; item = request[++i];) {
                                        if (item && (list = item.list)) {
                                            if (list.TAFFY) {
                                                list = list().get();
                                            }
                                            for (_i = -1; _item = list[++_i];) {
                                                if (_item.id) {
                                                    eventLifecycleValidate(item, _item.id);
                                                }
                                            }

                                        }
                                    }
                                }

                                if (response.length) {
                                    for (i = -1; item = response[++i];) {
                                        if (item && (list = item.list)) {
                                            if (list.TAFFY) {
                                                list = list().get();
                                            }
                                            for (_i = -1; _item = list[++_i];) {
                                                if (_item.id) {
                                                    eventLifecycleValidate(item, _item.id);
                                                }
                                            }
                                        }
                                    }
                                }


                                for (i in map) {
                                    if (map.hasOwnProperty(i) && (item = map[i])) {
                                        if (item.applyTo === 'WIDGET') {
                                            widgetEdmData.push('<div class="modal-type-ctt"><span>' + item.desp + '</span></div>');
                                        } else {
                                            delData.push('<div class="modal-type-ctt">' + eventLifecycleIcon[item.applyTo] + '<span>' + item.desp + '</span></div>')
                                        }
                                    }
                                }

                                delHtml = delData.length ? '<div class="modal-type-ctn"><p>在逻辑概览中引用到当前组件有：</p>' + delData.join('') + '</div>' : '';

                                widgetHtml = widgetEdmData.length ? '<div class="modal-type-ctn"><p>在EDM中引用到当前组件有：</p>' + widgetEdmData.join('') + '</div>' : '';

                                app.modal({
                                    title: "删除组件",
                                    content: '<div class="aui-ide-modal-content">' +
                                    '<i class="aui aui-round_warming"></i><span class="aui-modal-content-title">确定删除当前组件吗?</span>' +
                                    delHtml + widgetHtml +
                                    '<p class="aui-color-danger">确定后，当前组件所有已配置内容将被删除，无法撤销。</p></div>',
                                    btnConfirm: "确定",
                                    btnCancel: "取消",
                                    confirmHandler: function () {
                                        if (role === CONTENT_CONST.CUT) {
                                            widgetIns.cut();
                                        } else {
                                            widgetIns.close();
                                        }

                                        $(CONTENT_CONST.TREE_REVOKE_ROLE, context.$el).addClass(STYLE_STATUS.DISABLED);
                                    },
                                    cancelHandler: function () {
                                    },
                                    isDialog: true,
                                    isLargeModal: false
                                });

                            }
                            break;

                        //复制
                        case CONTENT_CONST.COPY:

                            if (widgetIns && widgetIns.length) {
                                widgetIns.copy();
                            }

                            break;



                        //粘贴
                        case CONTENT_CONST.PASTE:

                            if (widgetIns && widgetIns.length) {
                                widgetIns.paste();
                            }

                            break;


                    }


                }
            });


            $AW.off(statusList.join(','))
                .on(statusList.join(','), function (type, oWidget, lifecycleAndEventObj) {
                    var $view = $(CONTENT_CONST.EDITOR_CTN),
                        args = Array.prototype.slice.call(arguments),
                        widgetEl, children, widgetID, href, pID, widgetName, icon, data, structureData, html, deps,
                        $pWidgetChildren,
                        $parentWidget, $pWidget,
                        $widget, $treeItem, $children;

                    if (oWidget && oWidget.length && (widgetID = oWidget.id())) {
                        switch (type) {
                            case STATUS.WIDGET_INIT:
                            case STATUS.WIDGET_APPEND:
                                if (args[args.length - 1] !== CONST.TAG.NO_LOAD_JS) {
                                    widgetEl = oWidget[0];
                                    structureData = widgetEl.data;
                                    widgetName = oWidget.name();
                                    href = structureData.href;
                                    pID = structureData.pID;
                                    if (!$('[' + CONST.WIDGET.DATA_ATTR + '=' + widgetID + ']', $view).length) {
                                        console.log("adf");
                                        if (!(widgetEl.widget.info && (icon = widgetEl.widget.info.icon))) {
                                            icon = 'fa fa-file';
                                        }


                                        data = {
                                            ID: structureData.attr.id,
                                            href: href,
                                            widgetIcon: icon,
                                            widgetID: widgetID,
                                            widgetName: widgetName,
                                            pID: pID,
                                            children: structureData.children ? ([].concat(structureData.children)) : []
                                        };

                                        $pWidget = $('[' + CONST.WIDGET.DATA_ATTR + '=' + pID + ']', $view);

                                        html = context.componentTreeIns.getChildHtml([data], pID);
                                        if (html) {
                                            if ($pWidget.length) {

                                                $pWidgetChildren = $pWidget.children('ul');

                                                if ($pWidgetChildren.length) {

                                                    $pWidgetChildren.append(html);

                                                } else {
                                                    $pWidget.append('<ul class="aui-tree-list" data-role="auiTreeList">' + html + '</ul>');
                                                }
                                                context.validateContentTreeIconHide($pWidget);

                                            } else {
                                                //view
                                                $view.find("#" + CONTENT_CONST.TREE_CTN).children("ul").append(html);
                                            }

                                        }
                                        context.dragWidget(widgetID);
                                    }

                                    //预览面板不存在 加载js
                                    if ((deps = widgetEl.widget.deps) && !app.router.page.auiPreviewFrame) {
                                        //
                                        deps= JSON.parse(JSON.stringify(deps));
                                        deps.css = [];
                                        window.A.dependence(deps, function () {
                                            $AW.trigger.apply($AW, args.concat(CONST.TAG.NO_LOAD_JS));
                                        })
                                    }

                                }

                                break;
                            case STATUS.WIDGET_DELETE:
                                if (($widget = $('[' + CONST.WIDGET.DATA_ATTR + '=' + widgetID + ']', $view)).length) {

                                    $parentWidget = $widget.parent().closest(CONST.WIDGET.DATA_SELECTOR);
                                    $widget.remove();
                                    context.validateContentTreeIconHide($parentWidget);
                                }

                                break;
                            case STATUS.WIDGET_UPDATE:

                                if (($widget = $('[' + CONST.WIDGET.DATA_ATTR + '=' + widgetID + ']', $view)).length) {
                                    if ($widget.length) {
                                        widgetEl = oWidget[0];
                                        structureData = widgetEl.data;
                                        widgetName = oWidget.name();
                                        if ($widget.attr(CONST.PAGE.ATTR_HREF) === CONST.WIDGET.PAGE_HREF) {
                                            widgetName = structureData.attr.desp;
                                        }

                                        $treeItem = $widget.children(CONTENT_CONST.TREE_ITEM_ROLE);

                                        //修改widgetname
                                        $treeItem.find(CONTENT_CONST.TREE_WIDGET_NAME).text(widgetName);

                                        //修改id
                                        $treeItem.find(CONTENT_CONST.TREE_WIDGET_ID).text('[' + structureData.attr.id + ']');

                                        //校验是否修改过
                                        $treeItem.find(CONTENT_CONST.TREE_VALIDATE_CTT).empty().append(context.componentTreeIns.validateIsUpdate(widgetID));

                                        if (oWidget.acceptable()) {
                                            (children = structureData.children) && children.length &&
                                            children.map(function (widgetID, i) {
                                                var $widget = $('[' + CONST.WIDGET.DATA_ATTR + '=' + widgetID + ']', $view),
                                                    oWidget = $AW(widgetID);
                                                $widget[oWidget.acceptable && oWidget.acceptable() ? 'removeClass' : 'addClass'](CONST.WIDGET.UN_ACCEPTABLE);


                                            });

                                        } else {
                                            $widget.children(CONTENT_CONST.TREE_LIST_ROLE).remove();
                                            context.validateContentTreeIconHide($widget);
                                        }

                                        $widget[oWidget.acceptable() ? 'removeClass' : 'addClass'](CONST.WIDGET.UN_ACCEPTABLE);

                                    }
                                }
                                break;

                            case STATUS.CSS_CODE_UPDATE:
                            case STATUS.CSS_UPDATE:
                                if (($widget = $('[' + CONST.WIDGET.DATA_ATTR + '=' + widgetID + ']', $view)).length) {
                                    $treeItem = $widget.children(CONTENT_CONST.TREE_ITEM_ROLE);
                                    $treeItem.find(CONTENT_CONST.TREE_VALIDATE_CTT).empty().append(context.componentTreeIns.validateIsUpdate(widgetID));
                                }

                                break;

                            case STATUS.LIFECYCLE_APPEND:
                            case STATUS.LIFECYCLE_DELETE:
                            case STATUS.LIFECYCLE_UPDATE:
                            case STATUS.EVENT_APPEND:
                            case STATUS.EVENT_DELETE:
                            case STATUS.EVENT_UPDATE:
                                (function (type, lifecycleAndEventObj) {
                                    var obj = {},
                                        attrType = type.match(/^lifecycle_/) ? 'lifecycle' : 'event',
                                        TYPE_ICON_MAP = CONTENT_CONST.TYPE_ICON_MAP[attrType],
                                        typeConst = attrType + 'ID',
                                        typeID = lifecycleAndEventObj[typeConst],
                                        widgetID = lifecycleAndEventObj.widgetID,
                                        widget, $widget, $children, $lifeWidget;

                                    obj[typeConst] = typeID;

                                    widget = typeID && dataModel.get(attrType)(obj).get();

                                    if (widget && widget.length && (widget = widget[0])) {
                                        if (($widget = $('[' + CONST.WIDGET.DATA_ATTR + '=' + widgetID + ']', $view)) && $widget.length) {

                                            $children = $widget.children(CONTENT_CONST.TREE_ITEM_ROLE);

                                            if (($lifeWidget = $('[data-type-id=' + typeID + ']', $children)) && $lifeWidget.length) {
                                                if (!!widget.active) {
                                                    $lifeWidget.children(':last').text(widget.desp);
                                                } else {
                                                    $lifeWidget.remove();

                                                }
                                            } else {
                                                $(CONTENT_CONST.TYPE_CTN, $children).append(
                                                    CONTENT_CONST.TEMP.TYPE_HTML.replace(/_data__id_/g, widgetID + '_' + attrType + '_' + typeID)
                                                        .replace(/_data__type__id_/g, typeID)
                                                        .replace(/_type__class_/g, attrType)
                                                        .replace(/_type__icon_/, typeof TYPE_ICON_MAP === 'string' ? TYPE_ICON_MAP : TYPE_ICON_MAP[widget.spaAction + '_' + widget.pageAction])
                                                        .replace(/_type__desp_/g, widget.desp)
                                                )
                                            }
                                        }
                                    }
                                }(type, lifecycleAndEventObj));

                                break;


                        }
                    }

                });

            //
            $AW.off(contentStatusList.join(','))
                .on(contentStatusList.join(','), function (type, data, isVirtualzer) {

                    var _i, item,
                        structure, widgetID, $widget, pOffsetTop, offsetTop, scrollTop,
                        $view = $(CONTENT_CONST.EDITOR_CTN),
                        $treeCtn = $("#" + CONTENT_CONST.TREE_CTN, context.$el);
                    switch (type) {
                        case CONTENT_FRAME_STATUS.REVOKE:
                            contentTreeRevoke = data;
                            $(CONTENT_CONST.TREE_REVOKE_ROLE, context.$el)[contentTreeRevoke && contentTreeRevoke.length ? 'removeClass' : 'addClass']('disabled');
                            break;

                        case CONTENT_FRAME_STATUS.DRAG_WIDGET:
                            for (_i = -1, structure = dataModel.get('structure')().get(); item = structure[++_i];) {
                                context.dragWidget(item.widgetID);
                            }
                            break;

                        case CONTENT_FRAME_STATUS.SCROLL:

                            if ((widgetID = data) && isVirtualzer) {
                                if (($widget = $('[' + CONST.WIDGET.DATA_ATTR + '=' + widgetID + ']', $view)).length) {
                                    $(CONTENT_CONST.TREE_ITEM_ROLE, $view).removeClass(STYLE_STATUS.ACTIVE);
                                    $widget.children(CONTENT_CONST.TREE_ITEM_ROLE).addClass(STYLE_STATUS.ACTIVE);
                                    pOffsetTop = $treeCtn.offset().top;
                                    offsetTop = $widget.offset().top - pOffsetTop;
                                    scrollTop = $treeCtn.scrollTop();

                                    if (offsetTop < 0 && offsetTop < scrollTop) {
                                        $treeCtn.scrollTop(scrollTop + offsetTop);
                                    } else if (offsetTop > scrollTop) {
                                        $treeCtn.scrollTop(offsetTop);
                                    }


                                }
                            }
                            break;

                        case CONTENT_FRAME_STATUS.LOAD:
                            console.log("load");
                            context.initComponentTree();
                            break;


                    }
                })
        }
    };


    return {
        load: function ($el, handler) {

            new ContentTree($el, handler.dataModel);

        },
        unload: function ($el, handler) {
            $el.off('.auiContentFrame');
            $AW.off(contentStatusList.concat(statusList).join(','));
        },
        pause: function ($el, handler) {

        },
        resume: function ($el, handler) {

        }
    };
})
;
  