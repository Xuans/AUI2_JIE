( /* <global> */ function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(['jquery', 'Model.Data', 'apiApp'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, dataModel, app) {


        /**
         * "jQuery UI Resizable Snap" - Extension to the jQuery UI Resizable plugin for snapping while resizing.
         *
         * @copyright       Copyright 2011, Alexander Polomoshnov
         * @license         MIT license (https://raw.github.com/polomoshnov/jQuery-UI-Resizable-Snap-extension/master/LICENSE.txt)
         * @link            https://github.com/polomoshnov/jQuery-UI-Resizable-Snap-extension
         * @version         1.9.1
         */
        (function ($) {
            $.extend($.ui.resizable.prototype.options, {snapTolerance: 20, snapMode: 'both'});

            $.ui.plugin.add('resizable', 'snap', {
                start: function () {
                    var $this = $(this), inst = $this.data('ui-resizable'), snap = inst.options.snap;
                    inst.ow = inst.helper.outerWidth() - inst.size.width;
                    inst.oh = inst.helper.outerHeight() - inst.size.height;
                    inst.lm = getLm($this);
                    inst.tm = getTm($this);
                    inst.coords = [];

                    $(typeof snap == 'string' ? snap : ':data(ui-resizable)').each(function () {
                        if (this == inst.element[0] || this == inst.helper[0]) return;

                        var $el = $(this), p = $el.position(),
                            l = p.left + getLm($el), t = p.top + getTm($el);

                        inst.coords.push({
                            l: l, t: t,
                            r: l + $el.outerWidth(), b: t + $el.outerHeight()
                        });
                    });
                },
                resize: function () {
                    var ls = [], ts = [], ws = [], hs = [],
                        inst = $(this).data('ui-resizable'),
                        axes = inst.axis.split(''),
                        st = inst.options.snapTolerance,
                        md = inst.options.snapMode,
                        l = inst.position.left + inst.lm, _l = l - st,
                        t = inst.position.top + inst.tm, _t = t - st,
                        r = l + inst.size.width + inst.ow, _r = r + st,
                        b = t + inst.size.height + inst.oh, _b = b + st;

                    $.each(inst.coords, function () {
                        var coords = this,
                            w = Math.min(_r, coords.r) - Math.max(_l, coords.l),
                            h = Math.min(_b, coords.b) - Math.max(_t, coords.t);

                        if (w < 0 || h < 0) return;

                        $.each(axes, function (k, axis) {
                            if (md == 'outer') {
                                switch (axis) {
                                    case 'w':
                                    case 'e':
                                        if (w > st * 2) return;
                                        break;
                                    case 'n':
                                    case 's':
                                        if (h > st * 2) return;
                                }
                            } else if (md == 'inner') {
                                switch (axis) {
                                    case 'w':
                                    case 'e':
                                        if (w < st * 2) return;
                                        break;
                                    case 'n':
                                    case 's':
                                        if (h < st * 2) return;
                                }
                            }

                            switch (axis) {
                                case 'w':
                                    ls.push(getC(l - coords.l, l - coords.r, st));
                                    break;
                                case 'n':
                                    ts.push(getC(t - coords.t, t - coords.b, st));
                                    break;
                                case 'e':
                                    ws.push(getC(r - coords.l, r - coords.r, st));
                                    break;
                                case 's':
                                    hs.push(getC(b - coords.t, b - coords.b, st));
                            }
                        });
                    });

                    if (hs.length) inst.size.height += getN(hs);
                    if (ws.length) inst.size.width += getN(ws);
                    if (ls.length) {
                        var n = getN(ls);
                        inst.position.left += n;
                        inst.size.width -= n;
                    }
                    if (ts.length) {
                        var n = getN(ts);
                        inst.position.top += n;
                        inst.size.height -= n;
                    }
                }
            });

            function getC(lt, rb, st) {
                return Math.abs(lt) < st ? -lt : Math.abs(rb) < st ? -rb : 0;
            }

            function getN(ar) {
                return ar.sort(function (a, b) {
                    return !a ? 1 : !b ? -1 : Math.abs(a) - Math.abs(b)
                })[0];
            }

            function getLm($el) {
                return parseInt($el.css('margin-left'), 10) || 0;
            }

            function getTm($el) {
                return parseInt($el.css('margin-top'), 10) || 0;
            }

            // These are patches to the jQuery resizable plugin.
            // They are needed in order for the snapping to work properly when the ghost or helper option is used.
            function patch(func, afterFunc, beforeFunc) {
                var fn = $.ui.resizable.prototype[func];
                $.ui.resizable.prototype[func] = function () {
                    if (beforeFunc) beforeFunc.apply(this, arguments);
                    fn.apply(this, arguments);
                    if (afterFunc) afterFunc.apply(this, arguments);
                }
            }

            patch('_mouseStop', null, function () {
                if (this._helper) {
                    // 0.1 is a dirty hack to not end up with null if 0 is provided (when snapped to the left or top side of the browser window).
                    this.position = {
                        left: parseInt(this.helper.css('left'), 10) || 0.1,
                        top: parseInt(this.helper.css('top'), 10) || 0.1
                    };
                    this.size = {width: this.helper.outerWidth(), height: this.helper.outerHeight()};
                }
            });

            patch('_mouseStart', function () {
                if (this._helper) {
                    this.size = {
                        width: this.size.width - (this.helper.outerWidth() - this.helper.width()),
                        height: this.size.height - (this.helper.outerHeight() - this.helper.height())
                    };
                    this.originalSize = {width: this.size.width, height: this.size.height};
                }
            });

            patch('_renderProxy', function () {
                if (this._helper) {
                    this.helper.css({
                        left: this.elementOffset.left,
                        top: this.elementOffset.top,
                        width: this.element.outerWidth(),
                        height: this.element.outerHeight()
                    });
                }
            });

            var p = $.ui.resizable.prototype.plugins.resize;
            $.each(p, function (k, v) {
                if (v[0] == 'ghost') {
                    p.splice(k, 1);
                    return false;
                }
            });

            $.each($.ui.resizable.prototype.plugins.start, function (k, v) {
                if (v[0] == 'ghost') {
                    var fn = v[1];
                    v[1] = function () {
                        fn.apply(this, arguments);
                        $(this).data('ui-resizable').ghost.css({width: '100%', height: '100%'});
                    };
                    return false;
                }
            });
        })($);

        var Model = function (model, controller) {
                this.model = model;
                this.controller = controller;
                this.resumeGroupOrder();

            },


            View = function (option, controller) {

                var model, i, j, groupItem, panelName, groups, panels, content, groupMap = {};

                this.$nav = option.$nav;

                this.controller = controller;

                this.$windows = option.$windows;

                // model = this.getModel().model;


                // groups = model.groups;
                // panels = model.panels;

                // for (i = groups.length; groupItem = groups[--i];) {
                //     content = groupItem.content;
                //     groupItem.id = groupItem.id || app.getUID();
                //     groupMap[groupItem.id] = groupItem;
                //     for (j = content.length; panelName = content[--j];) {
                //         panels[panelName].inGroup = groupItem.id;
                //     }
                // }
                //
                // this.groupMap = groupMap;
                // this.panelMap = panels;
                this.uid = new Date().getTime();

            },

            Controller = function (option) {
                this.event = new app.dispatcher(option.timeout || this.timeout);
                this.model = new (option.Model || Model)(option.model, this);
                this.view = new (option.View || View)(option.view, this);
                if (option.on) {
                    this.on(option.on);
                }
                //resume data model into view
                this.render();
            },
            PageModel = function () {
                this.prefix = app.getUID();
            },
            InnerView = function (options) {
                var context = this,
                    _default = this._default;

                $.extend(true, context, _default, options);
                context.$tabs = $(this.tabs, this.$ctn);
                context.$ctt = $(this.ctt, this.$ctn);
            };


        InnerView.prototype = {
            constructor: InnerView,
            _default: {
                tabs: '.aui-nav-tabs',
                ctt: '.aui-tabs-content',
                tabsTemp: '<ul class="aui-nav aui-nav-tabs"></ul>',
                tabsCttTemp: '<div class="aui-tabs-content"></div>',
                cttTemp: '<div id="_id_" class="hide"></div>',
                tabTemp: '<li  data-href="_href_" title="_title_"><a><i class="_icon_"></i></a></li>',
            },
            init: function () {

                this.preRender();
                this.listener();

            },
            preRender(){
                if (!this.$tabs.length) {
                    this.$ctn.append(this.tabsTemp + this.tabsCttTemp);
                    this.$tabs = $(this.tabs, this.$ctn);
                    this.$ctt = $(this.ctt, this.$ctn);
                }
            },
            listener: function () {
                var context = this;

                this.$tabs.off('.innerView').on({
                    'click.innerView': function (e) {
                        var $target = $(e.target || event.srcElement),
                            $el = $target.closest('[data-href]'),
                            href = $el.attr('data-href');

                        if (href) {
                            context.switchView(href);
                        }


                    }
                })
            },
            open: function (options) {
                var context = this,
                    path = options.path,
                    sections = path && path.split('/'),
                    moduleName = sections.length && sections[sections.length - 1],
                    $tabs = this.$tabs,
                    $ctt = this.$ctt,
                    $tab = this.$tabs.children(),
                    dtd = $.Deferred();


                if (!($tab.filter('[data-href="' + options.id + '"]')).length) {
                    $tabs.append(context.tabTemp.replace('_href_', options.id).replace('_title_', options.title || '')
                        .replace('_icon_', options.icon || ''));

                    $ctt.append(context.cttTemp.replace('_id_', options.id));

                    $.ajax({
                        url: path + '/' + moduleName + '.html',
                        success: function (response) {
                            $ctt.children('#' + options.id).append(response || '');
                            dtd.resolve({
                                $el: $('#' + options.id, context.$ctn),
                                moduleName: moduleName
                            })
                        },
                        error: function () {
                            dtd.resolve({
                                $el: $('#' + options.id, context.$ctn),
                                moduleName: moduleName
                            })
                        }
                    });


                }


                return dtd.promise();

            },
            switchView: function (domID) {

                this.$tabs.children()
                    .removeClass('active')
                    .filter('[data-href="' + domID + '"]').addClass('active');

                this.$ctt.children().addClass('hide').filter('#' + domID).removeClass('hide');

            },
            close: function () {

            }
        };

        PageModel.prototype = {
            constructor: PageModel,
            dataModel: dataModel,
            controller: function (option) {
                var controllerIns = new Controller($.extend({}, {
                    View: InnerView,
                    model: {}
                }, option));

                return controllerIns;
            }
        };

        Model.prototype = {
            constructor: Model,
            version: 'AWOS 5.0.1 201801091505',

            groupMap: {},


            getController: function () {
                return this.controller;
            },

            getModel: function () {
                return this.model;
            },

            setGroupPanelMap: function () {

                var model = this.getModel(),
                    groups = model.groups,
                    panels = model.panels,
                    i, j, groupItem, content, panelName;

                for (i = groups.length; groupItem = groups[--i];) {
                    content = groupItem.content;
                    groupItem.id = groupItem.id || app.getUID();
                    this.groupMap[groupItem.id] = groupItem;
                    for (j = content.length; panelName = content[--j];) {
                        panels[panelName].inGroup = groupItem.id;
                    }
                }


            },

            getGroupMap: function () {
                return this.groupMap;
            },

            getGroupList: function () {
                return this.model.groups;
            },
            setGroupList: function (groupList) {
                var i, group;

                if (groupList) {
                    for (i = groupList.length; group = groupList[--i];) {
                        group.content = Array.from(new Set(group.content));

                        group.css.zIndex = group.index = i;
                    }

                    this.model.groups = groupList;
                    this.change();
                    this.setGroupPanelMap();
                }
            },

            getPanelMap: function () {
                return this.model.panels;
            },

            getClassMap: function () {
                return this.model.classes || {};
            },
            resumeGroupOrder: function () {
                var groupList = this.getGroupList(),
                    group, i;

                if (groupList) {
                    for (i = groupList.length; group = groupList[--i];) {
                        group.id = group.id || app.getUID();
                    }

                    this.setGroupList(groupList);
                }

            },
            setActiveGroup: function (id) {
                var groupList = this.getGroupList(),
                    newGroupList = [],
                    group, activeGroup, i;

                for (i = -1; group = groupList[++i];) {
                    if (id === group.id) {
                        activeGroup = group;
                    } else {
                        group.css.zIndex = group.index = newGroupList.length;
                        newGroupList.push(group);
                    }
                }

                if (activeGroup) {
                    activeGroup.css.zIndex = activeGroup.index = newGroupList.length;
                }

                newGroupList.push(activeGroup);


                this.setGroupList(newGroupList);
            },
            setActivePane: function (groupID, paneName) {
                var groupList = this.getGroupList(),
                    item, i, items,
                    group,

                    hasPane = false;


                for (i = -1; item = groupList[++i];) {
                    if (groupID === item.id) {
                        group = item;
                        break;
                    }
                }

                if (group && groupID === group.id) {
                    for (i = -1, items = group.content; item = items[++i];) {
                        if (item === paneName) {
                            hasPane = true;
                            break;
                        }
                    }
                }

                if (hasPane) {
                    this.model.panels[paneName].display='block';

                    group.active = paneName;

                    this.setGroupList(groupList);
                }
            },
            setNonePane:function (paneName) {
                if(this.model.panels &&  this.model.panels.hasOwnProperty(paneName)){
                    this.model.panels[paneName].display='none';
                    this.change();
                }
            },

            getActivePaneByGroup: function (groupID) {
                var groupList = this.getGroupList(),
                    item, i, items,
                    group,

                    hasPane = false;

                for (i = -1; item = groupList[++i];) {
                    if (groupID === item.id) {
                        group = item;
                        break;
                    }
                }

                if (group && groupID === group.id) {
                    return group.active;
                }


            },
            change: function () {
                var controller = this.getController();

                controller.trigger(controller.STATUS.CHANGE);
            },

        };

        View.prototype = {

            constructor: View,
            version: 'AWOS 5.0.1 201801091505',
            opendModule: {},
            panelTemp: '<div class="aui-tabbable"><ul class="aui-nav aui-nav-tabs" data-role="tab"></ul><div class="aui-tab-content" data-role="content"></div><div class="aui-window-group-mask" data-role="mask"></div></div>',
            tabTemp: '<li data-role="tabItem" data-id="_id_"><a href="#_id_" data-toggle="tab"><i style="padding-right: 7px" class="aui _icon_"></i>_desp_</a><div class="aui-panels-btn-list" data-role="panelsBtn">_icon__list_</div></li>',
            btnTemp: '<button type="button" data-role="_role_" title="_desp_" class="aui-btn"><i class="_icon_"></i></button>',
            panelsBtnTemp: '<span data-role="_role_" title="_desp_" class="aui _icon_" data-layout-active="no"></span>',

            panelItemClass: 'aui-tab-pane',
            panelItemActiveClass: 'active',
            panelItemSelector: '#_id_',
            panelItemSelectorReplacement: '_id_',
            panelItemIdAttr: 'data-id',

            groupAttr: 'data-group-id',
            groupsSelector: '[data-group-id]',
            groupSelector: '[data-group-id=_id_]',
            groupSelectorReplacement: '_id_',
            groupSelectedClass: 'aui-window-highlight',


            groupFullClass: 'aui-window-full',
            groupLeftClass: 'aui-window-left',
            groupRightClass: 'aui-window-right',
            groupWindowsClasses: 'aui-window-full aui-window-left aui-window-right',

            groupNavSelector: '[data-role=tab]',
            groupNavItemSelector: '[data-role=tabItem]',
            groupNavItemSelectorByID: '[data-id="_id_"]',
            groupNavItemSelectorByIDReplace: '_id_',

            groupNavLinkItemSelector: 'a',
            groupCttSelector: '[data-role=content]',
            groupBtnSelector: '[data-role=panelsBtn]',
            noGroupActive: '[data-layout-active=no]',


            borderWidth: 0,
            minWidth: 200,
            dragDistance: 30,
            sortDistance: 30,
            minHeight: 300,
            resizeDelayTimeout: 100,
            spaceHeight: 0,
            spaceWidth: 0,

            minScreenHeight: 600,
            navSeek: ["auiMenuFrame", "auiContentFrame", "auiConfigureFrame", "auiConfigureDefFrame", "auiCodeFrame", "auiCssFrame", "auiOverviewFrame", "auiPreviewFrame", "auiNavConfigureFrame", "auiNavSqlFrame", "auiNavJsonFrame", "auiNavMenuTreeFrame", "auiDevelopmentFrame"],

            navscope: 'lijianchengissohandsome',

            init: function () {

                this.listener();
                this.nav();
            },
            open: function (options) {
                var context = this,
                    path = options.path,
                    sections = path && path.split('/'),
                    moduleName = sections.length && sections[sections.length - 1],
                    model = this.getModel(),
                    groupMap = model.getGroupMap(),
                    panelMap = model.getPanelMap(),

                    classes = model.getClassMap(),

                    $windows = this.get$windows(),

                    maxHeight = $windows.height(),
                    maxWith = $windows.width(),
                    muduleSelectID = this.groupNavItemSelectorByID.replace('_id_', moduleName),
                    _i, _item,

                    panel = panelMap[moduleName],
                    inGroup = panel.inGroup,
                    group = groupMap[inGroup],
                    content = group.content,
                    groupID = group.id,
                    btns,
                    $group, $panes, $tab, $tabs, $res,
                    dtd = $.Deferred();


                if (!this.opendModule[moduleName]) {
                    this.opendModule[moduleName] = true;
                }
                if (!($group = $('[' + this.groupAttr + '=' + groupID + ']', $windows)).length) {
                    $group = $(this.panelTemp);
                    $windows.prepend($group);
                    $group
                        .attr(this.groupAttr, groupID)
                        .css(this.formatSize(group.css, maxHeight, maxWith));

                }
                if (content && !~content.indexOf(moduleName)) {
                    content.push(moduleName);
                }

                $panes = $group.children(this.groupCttSelector);
                $tabs = $group.children(this.groupNavSelector);


                if (panel) {

                    btns = [];
                    if (panel.iconList) {

                        for (_i = -1; _item = panel.iconList[++_i];) {

                            btns.push(this.panelsBtnTemp.replace(/_role_/, _item.role).replace(/_icon_/, _item.icon).replace(/_desp_/, _item.desp));
                        }
                    }

                    $tab = $tabs.children(muduleSelectID);

                    if (!$tab.length) {
                        $tab = $(this.tabTemp.replace(/_id_/g, moduleName).replace(/_icon_/, panel.icon).replace(/_desp_/, panel.desp).replace(/_icon__list_/, btns.join('')));
                        $tabs.append($tab);

                        $.ajax({
                            url: path + '/' + moduleName + '.html',
                            success: function (res) {
                                $res = $(res);
                                if (classes[moduleName]) {
                                    $res.addClass(classes[moduleName]);
                                }

                                $res.addClass(context.panelItemClass);

                                $panes.append($res);

                                context.resize();

                                context.drag();

                                context.sort();

                                context.select();

                                $tabs.children(muduleSelectID).addClass(context.panelItemActiveClass).siblings().removeClass(context.panelItemActiveClass);
                                $panes.children("#" + moduleName).addClass(context.panelItemActiveClass).siblings().removeClass(context.panelItemActiveClass);

                                dtd.resolve({
                                    $el: $res,
                                    moduleName: moduleName
                                })
                            },
                            error: function () {

                            }
                        });

                    } else {
                        $res = $("#" + moduleName);

                        dtd.resolve({
                            $el: $res,
                            moduleName: moduleName
                        });

                        $tabs.children(muduleSelectID).addClass(context.panelItemActiveClass).siblings().removeClass(context.panelItemActiveClass);

                        $panes.children("#" + moduleName).addClass(context.panelItemActiveClass).siblings().removeClass(context.panelItemActiveClass);

                    }


                    return dtd.promise();
                }

            },
            render: function () {
                var controller = this.getController(),
                    model = this.getModel(),
                    groups = model.getGroupList(),
                    panels = model.getPanelMap(),
                    classes = model.getClassMap(),

                    group, i, len, groupID,
                    names, name, j,
                    panel, _i, _item,

                    activeName,

                    $windows = this.get$windows(),
                    $panels = this.get$panels(),


                    $group,
                    $tabs, $tab,
                    $panes, $pane,
                    $btns, btns,

                    maxHeight = $windows.height(),
                    maxWith = $windows.width();


                controller.trigger(controller.STATUS.BEFORE_RENDER);

                if (groups && groups.length) {

                    for (len = groups.length, i = 0; i < len; i++) {
                        if ((group = groups[i]) && (names = group.content) && names.length) {
                            activeName = group.active;
                            groupID = group.id;

                            $group = $(this.panelTemp);

                            $windows.prepend($group);

                            $group
                                .attr(this.groupAttr, groupID)
                                .css(this.formatSize(group.css, maxHeight, maxWith));


                            $panes = $group.children(this.groupCttSelector);
                            $tabs = $group.children(this.groupNavSelector);


                            for (j = names.length; j--;) {
                                if ((name = names[j]) && (panel = panels[name])) {
                                    btns = [];
                                    if (panel.iconList) {

                                        for (_i = -1; _item = panel.iconList[++_i];) {

                                            btns.push(this.panelsBtnTemp.replace(/_role_/, _item.role).replace(/_icon_/, _item.icon).replace(/_desp_/, _item.desp));
                                        }
                                    }
                                    $pane = $panels.children(this.panelItemSelector.replace(this.panelItemSelectorReplacement, name)).detach();
                                    $tab = $(this.tabTemp.replace(/_id_/g, name).replace(/_icon_/, panel.icon).replace(/_desp_/, panel.desp).replace(/_icon__list_/, btns.join('')));

                                    $btns = $group.children(this.groupBtnSelector);
                                    if ($pane.length) {
                                        if (name === activeName) {
                                            $pane.addClass(this.panelItemActiveClass);
                                            $tab.addClass(this.panelItemActiveClass);

                                            this.setActivePane(groupID, name, false);
                                        }

                                        if (classes[name]) {
                                            $pane.addClass(classes[name]);
                                        }

                                        $tabs.prepend($tab);
                                        $panes.prepend($pane.addClass(this.panelItemClass));
                                    }
                                }
                            }
                        }
                    }

                    //设置最后一个为active
                    this.setActiveGroup(groups[groups.length - 1].id);
                }

                controller.trigger(controller.STATUS.AFTER_RENDER);
            },
            close: function (pageName) {
                var $tab,
                    $groups,
                    groupID, group,
                    groupMap = this.getModel().getGroupMap(),
                    content,
                    i, item, index;

                if (pageName) {
                    $tab = $(this.groupNavItemSelectorByID.replace(this.groupNavItemSelectorByIDReplace, pageName)).closest(this.groupNavItemSelector);
                    $groups = $tab.closest(this.groupsSelector);
                    groupID = $groups.attr(this.groupAttr);

                    group = groupMap[groupID];
                    content = group.content;


                    if (content.length > 1) {
                        $tab.remove();
                        $("#" + pageName).remove();
                        for (i = -1; item = content[++i];) {
                            if (item === pageName) {
                                content.splice(i, 1);
                                break;
                            }
                        }
                        if (content.length) {
                            if ($("#" + content[0], $groups).length) {
                                this.setActive(content[0]);
                            } else {
                                $groups.remove();//groups 销毁
                            }

                        }
                    } else {
                        $groups.remove();//groups 销毁
                        //delete this.opendGroupMap[groupID]
                    }


                    $('[data-role=' + pageName + ']').removeClass(this.panelItemActiveClass);

                    delete this.opendModule[pageName];
                    this.getModel().setNonePane(pageName);
                    this.getController().close(pageName);

                }
            },

            reRender: function (id, css) {
                var view = this,
                    controller = this.getController(),
                    model = controller.getModel(),
                    groupList = model.getGroupList(),
                    cssMap = {},

                    i, group, activeGroup,

                    $windows = this.get$windows(),
                    maxHeight = $windows.height(),
                    maxWidth = $windows.width();

                for (i = groupList.length; group = groupList[--i];) {
                    if (id === group.id) {
                        activeGroup = group;
                        cssMap[group.id] = group.css = this.formatSize(css, maxHeight, maxWidth);
                    } else {
                        cssMap[group.id] = group.css = this.formatSize(group.css, maxHeight, maxWidth);
                    }
                }


                $windows.children().each(function () {
                    var $group = $(this),
                        id = $group.attr(view.groupAttr);

                    cssMap[id] && $group.css(cssMap[id]);
                });

                model.setGroupList(groupList);

                activeGroup = activeGroup || groupList[groupList.length - 1];

                if (activeGroup) {
                    view.setActivePane(activeGroup.id, activeGroup.active, false);
                }

                controller.trigger(controller.STATUS.RESIZE);
            },
            resize: function (operation, $group) {
                var view = this,
                    $windows = this.get$windows(),
                    $groups = $group ? $group : $windows.children(),
                    resizeDelayHandler = null;

                switch (operation) {
                    case 'destroy':
                        $groups.resizable('destrtoy');

                    case 'disable':
                        if (!$group) {
                            $(window).off('resize.' + this.uid);
                        }

                        $groups.resizable({
                            disable: true
                        });

                        break;

                    default:

                        if (!$group) {
                            $(window).on('resize.' + this.uid, function (e) {
                               var $target=$(e.target||event.srcElement),
                                   $el=$target.closest('[data-group-id]');

                                window.clearTimeout(resizeDelayHandler);

                                resizeDelayHandler = window.setTimeout(function () {
                                    view.reRender($el.find('[data-role=tabItem]').filter('.active').attr('data-id'));
                                }, view.resizeDelayTimeout);
                            });
                        }

                        $groups.resizable({
                            handles: 'n, e, s, w',
                            start: function (event, ui) {
                                var size = ui.size,
                                    position = ui.position;

                                ui.element.css({
                                    top: position.top,
                                    left: position.left,
                                    height: size.height,
                                    width: size.width
                                });


                                ui.element.removeClass(view.groupWindowsClasses);


                                $windows.children().prepend('<div data-role="shelter" style="position:absolute;width:100%;height:100%;z-index:9999999"></div>');


                                //console.log('start');
                            },
                            stop: function (event, ui) {
                                $windows.children().children('[data-role=shelter]').remove();

                                //console.log('end');
                            },
                            snap: '.aui-tabbable,.aui-window-ctn',
                            snapMode: 'outer',
                            resize: function (event, ui) {
                                var size = ui.size,
                                    position = ui.position;

                                window.clearTimeout(resizeDelayHandler);

                                resizeDelayHandler = window.setTimeout(function () {
                                    view.reRender(
                                        ui.element.attr(view.groupAttr), {
                                            top: position.top,
                                            left: position.left,
                                            height: size.height,
                                            width: size.width
                                        });

                                    //console.log('calc');
                                }, view.resizeDelayTimeout);
                            }
                        });
                        break;
                }
            },
            drag: function (operation, $group) {
                var view = this,
                    $windows = this.get$windows(),
                    $groups = $group ? $group : $windows.children();

                switch (operation) {
                    case 'disable':

                        $groups.draggable({disable: true});

                        break;

                    case 'destroy':

                        try {
                            if ($groups.hasClass('ui-draggable')) {
                                $groups.draggable('destroy');
                            }
                        } catch (e) {

                        }

                        break;

                    default:

                        $groups.draggable({
                            delay: view.resizeDelayTimeout,
                            distance: view.dragDistance,
                            handle: $groups.children(view.groupNavSelector),
                            containment: 'parent',
                            iframeFix: true,
                            snap: '.aui-tabbable,.aui-window-ctn',
                            snapMode: 'outer',
                            start: function (event, ui) {
                                var $group = ui.helper,
                                    position = ui.position,
                                    size = ui.size,
                                    id = $group.attr(view.groupAttr);

                                if (id) {
                                    view.setActiveGroup(id);


                                    $group.css({
                                        top: position.top + view.spaceHeight,
                                        left: position.left,
                                        height: $group.height(),
                                        width: $group.width()
                                    });

                                    $group.removeClass(view.groupWindowsClasses);
                                }
                            },
                            stop: function (event, ui) {
                                var $window,
                                    $group = ui.helper,
                                    position = ui.position,

                                    left,

                                    panelWidth,


                                    id = $group.attr(view.groupAttr);


                                if (id) {
                                    left = position.left;
                                    panelWidth = $group.width();

                                    /*if (!left) {
                                     $group.addClass(view.groupLeftClass);
                                     } else if (panelWidth + left >= view.get$windows().width() * .99) {
                                     $group.addClass(view.groupRightClass);
                                     } else {

                                     }*/
                                    view.reRender(id, {
                                        top: position.top,
                                        left: left,
                                        width: panelWidth,
                                        height: $group.height()
                                    });
                                }
                            }
                        });
                        break;
                }
            },
            sort: function (disable, $group) {
                var view = this,
                    uid = view.getUID(),
                    $windows = view.get$windows(),
                    $groups = $group ? $group : $windows.children();

                $groups.children(view.groupNavSelector)
                    .attr('data-window-id', uid)
                    .sortable({
                        connectWith: '[data-window-id=' + uid + ']',
                        distance: view.sortDistance,
                        start: function (event, ui) {

                            var $panel = ui.helper.closest(view.groupsSelector),
                                id = $panel.attr(view.groupAttr);

                            if (id) {
                                view.setActiveGroup(id);
                            }
                        },
                        stop: function (event, ui) {
                            var $tab = ui.item,
                                paneName,
                                model,
                                groupList,
                                i, items, item,

                                $window,

                                $lastGroup, $lastGroupPanes, $lastGroupActivePane,
                                lastGroupID, lastGroup,

                                $newGroup, $newPanes, $newTabs, $newPane,
                                newGroup,

                                position, offset, distance;

                            if ($tab.attr('data-updated')) {
                                $tab.removeAttr('data-updated');
                            } else {
                                //新建标签页
                                position = ui.position;
                                offset = ui.offset;

                                distance = Math.sqrt(Math.pow(position.left - offset.left, 2) + Math.pow(position.top - offset.top, 2));

                                if (distance > view.minWidth) {
                                    $window = view.get$windows();


                                    $lastGroup = $tab.closest(view.groupsSelector);
                                    lastGroupID = $lastGroup.attr(view.groupAttr);

                                    paneName = $tab.attr(view.panelItemIdAttr);


                                    model = view.getModel();

                                    groupList = model.getGroupList();

                                    for (items = groupList, i = items.length; item = items[--i];) {
                                        if (lastGroupID === item.id) {
                                            lastGroup = item;
                                            break;
                                        }
                                    }
                                    $lastGroupPanes = $lastGroup.children(view.groupCttSelector).children();

                                    if (lastGroup && $lastGroupPanes.length > 1) {
                                        newGroup = {
                                            active: paneName,
                                            content: [paneName],
                                            css: {
                                                top: position.top,
                                                left: position.left,
                                                width: lastGroup.css.width,
                                                height: lastGroup.css.height,
                                                zIndex: groupList.length
                                            },
                                            id: app.getUID(),
                                            index: groupList.length
                                        };

                                        $newGroup = $(view.panelTemp);

                                        $window.prepend($newGroup);

                                        $newGroup
                                            .attr(view.groupAttr, newGroup.id)
                                            .css(view.formatSize(newGroup.css, $window.height(), $window.width()));


                                        $newPanes = $newGroup.children(view.groupCttSelector);
                                        $newTabs = $newGroup.children(view.groupNavSelector);

                                        $newPane = $lastGroupPanes.filter(view.panelItemSelector.replace(view.panelItemSelectorReplacement, paneName)).detach();
                                        $tab = $tab.detach();

                                        if ($newPane.length) {
                                            $newPane.addClass(view.panelItemActiveClass);
                                            $tab.addClass(view.panelItemActiveClass);

                                            $newTabs.prepend($tab);
                                            $newPanes.prepend($newPane.addClass(view.panelItemClass));
                                        }

                                        view.resize(false, $newGroup);

                                        view.drag(false, $newGroup);

                                        view.sort(false, $newGroup);


                                        for (items = lastGroup.content, i = items.length; item = items[--i];) {
                                            if (paneName === item) {
                                                items.splice(i, 1);
                                                break;
                                            }
                                        }
                                        if (lastGroup.active === paneName) {
                                            $lastGroupActivePane = $lastGroup.children(view.groupNavSelector);
                                            $lastGroupActivePane.find(view.groupNavLinkItemSelector).first().tab('show');
                                            lastGroup.active = $lastGroupActivePane.children('.' + view.panelItemActiveClass).attr(view.panelItemIdAttr);
                                        }

                                        groupList.push(newGroup);

                                        model.setGroupList(groupList);

                                        view.setActiveGroup(newGroup.id);

                                        view.setActivePane(newGroup.id, newGroup.active, false);
                                        view.setActivePane(lastGroup.id, lastGroup.active, false);
                                    }
                                }
                            }

                        },
                        update: function (event, ui) {
                            var model,

                                groupList,
                                lastGroupID, currentGroupID,
                                lastGroup, currentGroup,
                                paneName,

                                i, group,
                                pane, panes,

                                $lastGroup, $currentGroup,
                                $lastGroupActivePane, $currentGroupActivePane;

                            //跨组移动
                            if (ui.sender) {
                                $currentGroupActivePane = ui.item;
                                paneName = $currentGroupActivePane.attr(view.panelItemIdAttr);

                                $lastGroup = ui.sender.closest(view.groupsSelector);
                                $currentGroup = $currentGroupActivePane.closest(view.groupsSelector);

                                lastGroupID = $lastGroup.attr(view.groupAttr);
                                currentGroupID = $currentGroup.attr(view.groupAttr);

                                if (lastGroupID !== currentGroupID) {
                                    model = view.getModel();

                                    groupList = model.getGroupList();

                                    for (i = groupList.length; group = groupList[--i];) {

                                        switch (group.id) {
                                            case lastGroupID:
                                                lastGroup = group;
                                                break;
                                            case currentGroupID:
                                                currentGroup = group;
                                                break;
                                        }
                                    }

                                    if (lastGroup && currentGroup) {

                                        //view
                                        $currentGroup
                                            .children(view.groupCttSelector)
                                            .append(
                                                $lastGroup
                                                    .children(view.groupCttSelector)
                                                    .children(view.panelItemSelector.replace(view.panelItemSelectorReplacement, paneName))
                                                    .detach()
                                            );


                                        ui.item.removeClass(view.panelItemActiveClass).find(view.groupNavLinkItemSelector).tab('show');


                                        if (!$lastGroup.children(view.groupCttSelector).children().length) {


                                            for (i = groupList.length; group = groupList[--i];) {

                                                if (group.id === lastGroup.id) {
                                                    groupList.splice(lastGroup.index, 1);
                                                    break;
                                                }
                                            }

                                            $lastGroup.off().remove();
                                        } else {

                                            $lastGroupActivePane = $lastGroup.children(view.groupNavSelector);
                                            $lastGroupActivePane.find(view.groupNavLinkItemSelector).first().tab('show');

                                            for (panes = lastGroup.content, i = panes.length; pane = panes[--i];) {
                                                if (pane === paneName) {
                                                    panes.splice(i, 1);
                                                }
                                            }

                                            lastGroup.active = $lastGroupActivePane.children('.' + view.panelItemActiveClass).attr(view.panelItemIdAttr);
                                        }


                                        currentGroup.active = paneName;

                                        currentGroup.content.splice($currentGroupActivePane.index(), 0, paneName);

                                        model.setGroupList(groupList);

                                        view.setActiveGroup(currentGroupID);
                                        view.setActivePane(currentGroup.id, currentGroup.active, false);

                                        if ($lastGroup.parent().length) {
                                            view.setActivePane(lastGroup.id, lastGroup.active, false);
                                        }
                                    }
                                }
                            }

                            //组内位置移动
                            if (lastGroupID === currentGroupID || !currentGroupID) {
                                $currentGroupActivePane = ui.item;
                                paneName = $currentGroupActivePane.attr(view.panelItemIdAttr);

                                $currentGroup = $currentGroupActivePane.closest(view.groupsSelector);

                                currentGroupID = $currentGroup.attr(view.groupAttr);

                                model = view.getModel();

                                groupList = model.getGroupList();

                                for (i = groupList.length; group = groupList[--i];) {

                                    if (group.id === currentGroupID) {
                                        currentGroup = group;
                                        break;
                                    }
                                }

                                if (panes = currentGroup.content) {
                                    for (i = panes.length; pane = panes[--i];) {
                                        if (pane === paneName) {
                                            panes.splice(i, 1);
                                        }
                                    }
                                }


                                currentGroup.content.splice($currentGroupActivePane.index(), 0, paneName);

                                model.setGroupList(groupList);

                                view.setActiveGroup(currentGroupID);
                            }


                            ui.item.attr('data-updated', 'true');
                        }
                    })
                    .disableSelection();

            },
            nav: function () {
                var view = this,
                    $nav = view.get$nav(),
                    uid = view.getUID(),
                    // $windows = view.get$windows(),
                    html = [],
                    panelsArr, index,
                    i, item, name, panel, panels;

                panels = this.getModel().getModel().panels;

                panelsArr = Object.keys(panels);


                for (i = -1; item = this.navSeek[++i];) {
                    if (panels.hasOwnProperty(item) && ~(index = panelsArr.indexOf(item))) {
                        panel = panels[item];
                        html.push(this.btnTemp.replace(/_role_/g, item).replace(/_desp_/g, panel.desp).replace(/_icon_/g, ' aui ' + panel.icon));

                        panelsArr.splice(index, 1);
                    }
                }


                if (panelsArr.length) {
                    for (i = -1; item = panelsArr[++i];) {
                        if (panels.hasOwnProperty(item)) {
                            panel = panels[item];
                            html.push(this.btnTemp.replace(/_role_/g, item).replace(/_desp_/g, panel.desp).replace(/_icon_/g, ' aui ' + panel.icon))
                        }
                    }
                }


                $nav.off().empty().append(html.join(''));

                $nav.off('.' + uid).on('click.' + uid, function (e) {
                    var $btn = $(e.target || event.srcElement).closest('[data-role]'),
                        role = $btn.attr('data-role');

                    if (!app.router.page[role]) {
                        app.router.open({path: 'module/' + role})
                    }
                    view.setActive(role);
                    $btn.addClass(view.panelItemActiveClass);

                });
            },

            select: function () {
                var view = this,
                    uid = view.getUID(),
                    listen = {};


                listen['click.' + uid] = function (e) {
                    var $target = $(e.target || event.srcElement),
                        $group, $tab,
                        groupID, tabID;


                    if ((!e.isTrigger || $target.closest(view.groupNavItemSelector).length) && !$target.closest(view.noGroupActive).length) {

                        $group = $target.closest(view.groupsSelector);

                        if (groupID = $group.attr(view.groupAttr)) {
                            view.setActiveGroup(groupID);

                            $tab = $target.closest(view.groupNavItemSelector);

                            if (tabID = $tab.attr(view.panelItemIdAttr)) {
                                view.setActivePane(groupID, tabID);
                            }
                        }
                    }
                };


                listen['dblclick.' + uid] = function (e) {
                    var $target = $(e.target || event.srcElement),
                        $group, $nav, $tab,
                        groupID, tabID;

                    if (!e.isTrigger && !$target.closest(view.noGroupActive).length) {
                        $nav = $target.closest(view.groupNavSelector);

                        if ($nav.length) {
                            $group = $nav.closest(view.groupsSelector);
                            groupID = $group.attr(view.groupAttr);

                            if (groupID) {
                                $group
                                    .removeClass(view.groupLeftClass + ' ' + view.groupRightClass)
                                    .toggleClass(view.groupFullClass);

                                view.setActiveGroup(groupID);

                                $tab = $nav.children('.' + view.panelItemActiveClass);

                                if (tabID = $tab.attr(view.panelItemIdAttr)) {
                                    view.setActivePane(groupID, tabID);
                                }
                            }
                        }
                    }
                };


                view.get$windows().off('.' + uid).on(listen);
            },
            listener: function () {
                var context = this;
                this.get$windows().off('.layout').on({
                    'click.layout': function (e) {
                        var $target = $(e.target || event.srcElement).closest('[data-role]'),
                            role = $target.attr('data-role'),
                            $frame, domID;
                        switch (role) {
                            case 'auiMinimum':
                                context.setMinPane($target.parents('[data-role=tabItem]').attr("data-id"));
                                break;
                            case 'maximization':
                                context.setMaxPane($target.parents('[data-role=tabItem]').attr("data-id"));
                                break;
                            case 'frameClose':
                                $frame = $target.closest('[data-id]');
                                domID = $frame.attr('data-id');
                                context.close(domID);
                                break;
                        }
                    }
                })
            },

            getUID: function () {
                return this.uid;
            },
            setActive: function (tabID) {
                var groupID,
                    $tab, $group;

                if (tabID) {
                    $tab = $(this.groupNavItemSelectorByID.replace(this.groupNavItemSelectorByIDReplace, tabID)).closest(this.groupNavItemSelector);
                    $group = $tab.closest(this.groupsSelector);

                    if ($tab.hasClass('hide')) {
                        this.setPaneShow(tabID);
                    }

                    if (groupID = $group.attr(this.groupAttr)) {
                        this.setActiveGroup(groupID);
                        this.setActivePane(groupID, tabID);
                        $tab.addClass('active').siblings().removeClass('active');
                        $("#" + tabID).addClass('active').siblings().removeClass('active');
                    }
                }

            },
            setMinPane: function (tabID) {
                var $tab, $siblings;

                if (tabID) {
                    $tab = $(this.groupNavItemSelectorByID.replace(this.groupNavItemSelectorByIDReplace, tabID)).closest(this.groupNavItemSelector);

                    $tab.addClass('hide');

                    if (($siblings = $tab.siblings(':not(.hide)')).length) {
                        this.setActive($siblings.eq(0).attr(this.panelItemIdAttr));
                    } else {
                        $tab.closest(this.groupsSelector).addClass('hide');
                    }

                    $("#" + tabID).removeClass(this.panelItemActiveClass);

                    $('[data-role=' + tabID + ']').removeClass(this.panelItemActiveClass)
                }
            },
            setMaxPane: function (tabID) {

                var view = this,
                    $group, $nav, $tab,
                    groupID;

                if (tabID) {

                    $nav = $(this.groupNavItemSelectorByID.replace(this.groupNavItemSelectorByIDReplace, tabID)).closest(this.groupNavItemSelector);

                    if ($nav.length) {

                        $group = $nav.closest(view.groupsSelector);
                        groupID = $group.attr(view.groupAttr);

                        if (groupID) {
                            $group
                                .removeClass(view.groupLeftClass + ' ' + view.groupRightClass)
                                .toggleClass(view.groupFullClass);

                            view.setActiveGroup(groupID);

                            $tab = $nav.children('.' + view.panelItemActiveClass);

                            if (tabID = $tab.attr(view.panelItemIdAttr)) {
                                view.setActivePane(groupID, tabID);
                            }
                        }
                    }
                }

            },

            setPaneShow: function (tabID) {
                var $tab;

                if (tabID) {
                    $tab = $(this.groupNavItemSelectorByID.replace(this.groupNavItemSelectorByIDReplace, tabID)).closest(this.groupNavItemSelector);
                    $tab.removeClass('hide')
                        .closest(this.groupsSelector).removeClass('hide');

                    $("#" + tabID).addClass(this.panelItemActiveClass);
                }
            },

            setActiveGroup: function (id) {
                var view = this,
                    model = this.getModel(),
                    controller = this.getController(),
                    groupList,
                    groupMap = {},

                    i, group,

                    $group;

                model.setActiveGroup(id);
                groupList = model.getGroupList();

                for (i = groupList.length; group = groupList[--i];) {
                    groupMap[group.id] = group.index;
                }


                this.get$windows().children().each(function () {
                    var _$group = $(this),
                        _id = _$group.attr(view.groupAttr);

                    if (_id === id) {
                        $group = _$group;
                    }

                    _$group
                        [_id === id ? 'addClass' : 'removeClass'](view.groupSelectedClass)
                        .css('z-index', groupMap[_id]);
                });

                if ($group && $group.length) {

                    controller.trigger(
                        controller.STATUS.ACTIVE,
                        $group
                            .children(this.groupCttSelector)
                            .children(this.panelItemSelector.replace(this.panelItemSelectorReplacement, this.getModel().getActivePaneByGroup(id))));
                }
            },
            setActivePane: function (groupID, paneName, toModel) {

                var controller = this.getController(),
                    $activePane;

                $activePane = this.get$windows()
                    .children(this.groupSelector.replace(this.groupSelectorReplacement, groupID))
                    .children(this.groupCttSelector)
                    .children(this.panelItemSelector.replace(this.panelItemSelectorReplacement, paneName));


                if (toModel !== false) {
                    this.getModel().setActivePane(groupID, paneName);
                }

                if ($activePane && $activePane.length) {
                    controller.trigger(controller.STATUS.ACTIVE, $activePane);
                }
            },
            getController: function () {
                return this.controller;
            },

            getModel: function () {
                return this.getController().getModel();
            },
            get$windows: function () {
                return this.$windows;
            },
            get$nav: function () {
                return this.$nav;
            },
            get$panels: function () {
                return this.$panels;
            },

            formatSize: function (css, maxHeight, maxWidth) {
                var num,
                    props = ['top', 'left', 'width', 'height'],
                    realMaxHeight = maxHeight - this.spaceHeight,
                    realMaxWidth = maxWidth - this.spaceWidth,
                    size = {
                        height: 0,
                        width: 0
                    },
                    i, prop;

                if (maxHeight < this.minScreenHeight || maxWidth < this.minScreenHeight) {

                } else {
                    for (i = props.length; prop = props[--i];) {
                        num = css[prop];

                        if (!num) {
                            num = css[prop] = 0;
                        } else {
                            num = parseFloat(num);

                            //check percent
                            if (css[prop].indexOf && css[prop].indexOf('%') !== -1) {
                                num /= 100;
                                switch (prop) {
                                    case'left':
                                    case 'width':
                                        num = num * maxWidth;
                                        break;
                                    case 'top':
                                    case 'height':
                                        num = num * maxHeight;
                                        break;
                                }
                            }


                            switch (prop) {
                                case 'width':
                                case'left':
                                    //check range
                                    num = Math.max(num, prop === 'width' ? this.minWidth : this.borderWidth / 2);

                                    num = Math.min(num, realMaxWidth);

                                    //防止width+left<maxWidth
                                    if (size.width + num <= realMaxWidth) {
                                        size.width += num;
                                    } else {
                                        num = realMaxWidth - size.width;
                                    }

                                    css[prop] = Math.floor(num / maxWidth * 100000) / 1000 + '%';

                                    break;
                                case 'top':
                                case 'height':
                                    num = Math.max(num, prop === 'height' ? this.minHeight : this.borderWidth / 2);
                                    num = Math.min(num, realMaxHeight);


                                    //top+height<maxHeight
                                    if (size.height + num <= realMaxHeight) {
                                        size.height += num;
                                    } else {
                                        num = realMaxHeight - size.height;
                                    }


                                    css[prop] = Math.floor(num / maxHeight * 100000) / 1000 + '%';

                                    break;
                            }
                        }
                    }

                }

                return css;
            }
        };

        Controller.prototype = {
            constructor: Controller,
            version: 'AWOS 5.0.1 201801091505',
            timeout: 100,
            page: {},
            cache: {},
            STATUS: {
                BEFORE_RENDER: 'beforeRender',

                AFTER_RENDER: 'afterRender',

                RESIZE: 'resize',

                CHANGE: 'change',

                ACTIVE: 'active'
            },

            open: function (options) {
                var context = this,
                    path = options.path,
                    pageDone = this.view.open(options),
                    pageModel = new PageModel(),
                    dtd = $.Deferred(),
                    ret = dtd.promise(),
                    controller = this, pCache, subset,
                    CurrentCache, $el,
                    moduleName;

                pageDone.done(function (params) {
                    $el = params.$el;
                    moduleName = params.moduleName;
                    if (params && options.active) {
                        context.view.switchView(options.id);
                    }

                    if ((CurrentCache = controller.cache[moduleName])&& CurrentCache.bootstrap) {
                        CurrentCache.bootstrap.load($el, pageModel);
                        dtd.resolve();
                    } else {
                        controller.cache[moduleName] = {
                            options: options,
                            $el: $el,
                            handler: pageModel
                        };
                        controller.page[moduleName] = ret;
                        if (options.pID && (pCache = controller.cache[options.pID])) {
                            subset = pCache.subset || (pCache.subset = {});
                            subset[moduleName] = moduleName;
                        }

                        require([path + '/' + moduleName + '.js'], function (page) {

                            controller.cache[moduleName].bootstrap = page;
                            page.load($el, pageModel);
                            dtd.resolve();
                        });
                    }
                });


                return ret;
            },
            close: function (pageName) {

                this.removeCachePage(pageName);

            },
            removeCachePage: function (pageName) {
                var item, subset, key, subsetID, subsetItem;
                if (this.page.hasOwnProperty(pageName)) {
                    delete this.page[pageName];
                }
                if (this.cache.hasOwnProperty(pageName) && (item = this.cache[pageName])) {

                    item.bootstrap.unload(item.$el, item.handler);
                    item.$el.off();


                    //若有子页面，则删除
                    if (subset = item.subset) {
                        for (key in subset) {
                            if (subsetID = subset[key]) {

                                subsetItem = this.cache[subsetID];

                                if (subsetItem) {
                                    subsetItem.$el.off();
                                    subsetItem.bootstrap.unload(subsetItem.$el, subsetItem.handler);
                                    delete this.cache[subsetID];
                                }

                                this.page[subsetID] && delete this.page[subsetID];
                            }
                        }
                    }
                    delete this.cache[pageName];
                }
            },

            setActive: function (pageName) {

                this.getView().setActive(pageName);
            },
            render: function () {
                this.getView().init(this.model);
            },
            getModel: function () {
                return this.model;
            },
            getView: function () {
                return this.view;
            },
            getEvent: function () {
                return this.event;
            },

            on: function () {
                var event = this.getEvent();

                event.on.apply(event, arguments);
            },
            off: function () {
                var event = this.getEvent();
                event.off.apply(event, arguments);
            },
            trigger: function (type) {

                var event = this.getEvent(),
                    args = [type, this].concat(Array.prototype.slice.call(arguments, 1));

                event.trigger.apply(event, args);
            }
        };

        Controller.View = View;
        Controller.Model = Model;

        return Controller;

    });
})();