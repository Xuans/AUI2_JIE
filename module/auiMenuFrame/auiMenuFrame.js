define(["jquery", "const", "template", "css", "external", "index"], function ($, CONST, template, css, external, AUI) {

    var MENU_CONST = CONST.PAGE.MENU_FRAME,
        COMMON_CLASS_CONST = CONST.PAGE.COMMON_CLASS,
        STYLE_STATUS = CONST.STYLE_STATUS,
        NAME_SPACE = '.' + MENU_CONST.SELF,
        type = $AW._STATUS.MENU_FRAME.LAYOUT_SELECT_CHANGE + NAME_SPACE,
        $body = $('body'),
        Menu = function ($el, dataModel) {
            this.$el = $el;
            this.dataModel = dataModel;
            this.init();
        };

    Menu.prototype = {
        constructor: Menu,
        constant: {
            TEMP: {
                SEARCH_RESULT: '<div class="aui-widget-menu-group">' +
                '<div class="aui-widget-menu-group-header">' +
                '<span>搜索结果，共_len_个结果</span>' +
                '</div>' +
                '<div class="aui-widget-menu-block" data-type="searchResult">' +
                '<div class="aui-widget-menu-body">_html_</div>' +
                '</div>' +
                '</div>',
                CONTEXT_MENU: '<ul class="aui-move-to-group-ctn ' + MENU_CONST.CUSTOM_MENU_CONTEXT_MENU + '" data-role="contextMenu">' +
                '<li  data-role="addGroup">新建分组</li></ul>',
                CONTEXT_MENU_LIST: '<li data-role="moveToGroup" data-move-target="_type_" class="menu-click-a" href="add_group">_type_</li>',
                LAYOUT_SELECT: '<div id="aui_aside_left_layout_select_label">' +
                '        <select name="" id="aui_aside_left_layout_select">' +
                '        </select>' +
                '</div>',
            }
        },


        init: function () {
            this.renderMenu();
            this.contextMenu();
            this.listener();
        },
        contextMenu: function () {
            $(this.constant.TEMP.CONTEXT_MENU).appendTo($body).hide();
        },

        collectWidget: function (widgetHref, isCollect, sType) {
            var context = this,
                dataModel = this.dataModel,
                widgetCollection = dataModel.configuration.widgetCollection,
                menu = dataModel.get('menu'),
                type = sType || CONST.WIDGET.WIDGET_COLLECTION_DEFAULT,
                $menus = $(MENU_CONST.MENU_CLASS.SELECTOR),
                $customMenu = $menus.filter(MENU_CONST.MENU.WIDGET_COLLECTION).children(MENU_CONST.COLLECTION_INNER_SELECTOR),
                $link = $menus.find('[data-href="' + widgetHref + '"]').children(MENU_CONST.COLLECTION_ROLE),
                $collection = $customMenu.find('li[' + MENU_CONST.COLLECTION_TYPE_ATTR + '="_type_"]'.replace(/_type_/, type)),
                $typeMenu, $block,
                widget, delIndex, key, value, index, types;


            $typeMenu = $body.children('.' + MENU_CONST.CUSTOM_MENU_CONTEXT_MENU);


            if (typeof widgetHref === 'string') {
                widget = menu({href: widgetHref}).first();

                switch (widgetHref) {
                    case MENU_CONST.DEL_COLLECTION_GROUP:
                        //删除分组
                        delIndex = $.inArray(type, widgetCollection.types);
                        widgetCollection.types.splice(delIndex, 1);

                        for (key in widgetCollection.map) {
                            if (widgetCollection.map.hasOwnProperty(key) && (value = widgetCollection.map.key)) {
                                if (value === type) {
                                    context.collectWidget(key, false);
                                }
                            }

                        }

                        window.A.updatePageConfig();
                        break;
                    case MENU_CONST.MODIFY_TITLE:
                        //修改组名
                        widgetCollection.types.splice($.inArray(type.oldTitle, widgetCollection.types), 1, type.newTitle);
                        for (key in widgetCollection.map) {
                            if (widgetCollection.map.hasOwnProperty(key) && (value = widgetCollection.map.key)) {
                                if (value === type.oldTitle) {
                                    context.collectWidget(key, false);
                                    context.collectWidget(key, true, type.newTitle);
                                }
                            }

                        }

                        window.A.updatePageConfig();
                        break;
                }
            }

            if (widget) {

                //界面操作
                if (isCollect) {//添加收藏
                    $link.attr(MENU_CONST.CHOICE.CHOSEN);

                    //修改数据模型
                    widgetCollection.map[widget.href] = type;
                    if (widgetCollection.types.indexOf(type) === -1) {
                        widgetCollection.types.push(type);
                    }


                    //获取block
                    $block = $(MENU_CONST.TEMP.COLLECTION_LIST_TEMP
                        .replace(/_href_/, widget.href)
                        .replace(/_type_/g, widget.type)
                        .replace(/_cType_/, type)
                        .replace(/_accept_/g, widget.accept)
                        .replace(/_name_/g, widget.name)
                        .replace(/_icon_/, widget.icon));

                    //新建分组或分类到新分组
                    if (!$collection.length) {
                        $customMenu.append(MENU_CONST.TEMP.COLLECTION_TEMP.replace(/_type_/g, type));
                        $collection = $customMenu.find('li[' + MENU_CONST.COLLECTION_TYPE_ATTR + '="_type_"]'.replace(/_type_/, type));
                    }
                    $collection.find(MENU_CONST.WIDGET_BODY_CLASS).append($block);

                    $block.draggable(CONST.WIDGET.DRAGGABLE_OPTION);
                    $block.tooltips(CONST.WIDGET.TOOLTIP_OPTION);
                    //保存到后台
                    window.A.updatePageConfig();

                } else {//取消收藏
                    // 修改界面
                    $link.attr(MENU_CONST.CHOICE.NOT_CHOOSE);

                    $block = $customMenu.find('[data-href="' + widgetHref + '"]');

                    $block.draggable('destroy');
                    $block.remove();

                    //修改数据模型
                    delete widgetCollection.map[widgetHref];

                    window.A.updatePageConfig();
                }

                //添加右键菜单的子菜单

                for (index = -1, types = widgetCollection.types; value = types[++index];) {
                    if (!$typeMenu.find('[data-move-target="' + value + '"]').length) {
                        $typeMenu
                            .append(context.constant.TEMP.CONTEXT_MENU_LIST.replace(/_type_/g, value));
                    }
                }

            }
        },
        dropWidget: function (widgetArr, $menus) {
            var MENU = MENU_CONST.MENU,
                len, item, pType,
                $parent,
                $widgetItem;

            if (!$menus) {
                $menus = $(MENU_CONST.MENU_CLASS.SELECTOR);
            }

            if (!$.isArray(widgetArr)) {
                widgetArr = [widgetArr];
            }

            for (len = -1; item = widgetArr[++len];) {
                if (!item.hidden) {
                    pType = item.pType;

                    $parent = $menus
                        .filter(MENU[(item.belongTo || MENU.APP).toUpperCase()])
                        .find('[data-type="' + pType + '"]').children(MENU_CONST.WIDGET_BODY_CLASS);


                    //在业务组件编辑页面下避免重复添加组件到界面中
                    if (!$parent.children('[data-type=' + item.type + ']').length) {
                        $widgetItem = $(template('auiAsideMenuBlock', item));
                        $parent.append($widgetItem);

                        switch (auiApp.mode) {
                            case CONST.MODE.THEME:
                                break;

                            default:
                                $widgetItem.draggable(CONST.WIDGET.DRAGGABLE_OPTION);
                                $widgetItem.tooltips(CONST.WIDGET.TOOLTIP_OPTION);
                                break;
                        }

                    }
                }
            }
        },
        renderMenu: function () {
            var context = this,
                dataModel = context.dataModel,
                $menus = $(MENU_CONST.MENU_CLASS.SELECTOR),
                menuData = [],
                widgets = [], html = [],
                category = dataModel.get('category'),
                widgetCollection = dataModel.getConfigValue('widgetCollection'),
                types = widgetCollection.types,
                _DEFAULT = CONST.WIDGET.WIDGET_COLLECTION_DEFAULT,
                $ctn = $(MENU_CONST.MENU.WIDGET_COLLECTION).children(MENU_CONST.COLLECTION_INNER_SELECTOR),
                menu, len, item,
                k, v;

            dataModel.set('menu', app.taffy([]));
            menu = dataModel.get('menu');


            external.getMenu(function (data) {
                //生成HTML代码并注入

                menu.insert(data);

                menu({pType: CONST.WIDGET.PAGE_TYPE}).order('index').each(function (item) {

                    var children = menu({pType: item.type}),
                        isInside = !(item.type in CONST.WIDGET.OUTSIDE_WIDGET_TYPE),
                        seed = [],
                        menuChildren = [],
                        i = -1,
                        menuItem;

                    if (!item.hidden) {

                        if (children.count()) {
                            children.order('index').each(function (subItem) {
                                seed.push(subItem);
                            });
                        }

                        while (menuItem = seed[++i]) {
                            var subChildren = menu({pType: menuItem.type});

                            if (!menuItem.hidden) {
                                if (subChildren.count()) {
                                    if (menuItem.type in CONST.WIDGET.OUTSIDE_WIDGET_TYPE) {
                                        subChildren.order('index').each(function (subItem) {
                                            seed.push(subItem);
                                        });
                                    } else {
                                        menuChildren.push({
                                            type: menuItem.type,
                                            name: menuItem.name,
                                            icon: menuItem.icon,
                                            angleUp: menuItem.collapse ? COMMON_CLASS_CONST.ANGLE_UP : '',
                                            collapse: menuItem.collapse ? 'none' : 'block'
                                        });

                                        subChildren.order('index').each(function (subItem) {
                                            seed.push(subItem);
                                        });

                                    }

                                    category.valueArray.push(menuItem.type);
                                    category.despArray.push(menuItem.name);
                                } else {
                                    widgets.push(menuItem);
                                }
                            }
                        }
                        isInside && menuData.push({
                            type: item.type,
                            name: item.name,
                            icon: item.icon,
                            angleUp: item.collapse ? COMMON_CLASS_CONST.ANGLE_UP : '',
                            collapse: item.collapse ? 'none' : 'block',
                            children: menuChildren
                        });
                    }
                    category.valueArray.push(item.type);
                    category.despArray.push(item.name);
                });

                $menus.filter(MENU_CONST.MENU.PLATFORM).append(template("auiAsideMenu", {data: menuData}));

                $menus.filter([MENU_CONST.MENU.BANK, MENU_CONST.MENU.APP].join(',')).append(
                    template("auiAsideMenu", {
                            data: [{
                                name: '功能组件',
                                type: 'custom'
                            }]
                        }
                    )
                );
                context.dropWidget(widgets, $menus);
                if ($.inArray(_DEFAULT, types) === -1) {
                    types.push(_DEFAULT);
                    window.A.updatePageConfig();
                }

                //默认收藏组件
                for (html = [], len = -1; item = types[++len];) {
                    html.push(item);
                }
                $ctn.empty().append(template("auiMenuDefaultGroup", {data: html}));

                if (!$.isEmptyObject(widgetCollection.map)) {
                    for (k in widgetCollection.map) {
                        v = widgetCollection.map[k];
                        //将组件选成实心
                        $('a[data-href="' + k + '"]>i', $menus).attr(MENU_CONST.CHOICE.CHOSEN);
                        //将组件的值设为true
                        context.collectWidget(k, true, v);
                    }


                    $(MENU_CONST.CUSTOM_MENU_ANCHOR, MENU_CONST.NAV).trigger('click.ui');
                }

                //收藏菜单的排序功能
                $ctn.sortable({
                    items: 'li[' + MENU_CONST.COLLECTION_TYPE_ATTR + ']',
                    containment: 'parent',
                    cursor: 'move',
                    tolerance: "pointer",
                    update: function (event, ui) {
                        var $item = ui.item,
                            $ul = $item.parent();

                        dataModel.getConfigValue('widgetCollection').types = $ul.sortable('toArray', {attribute: MENU_CONST.COLLECTION_TYPE_ATTR});

                        window.A.updatePageConfig();
                    }
                });

                switch (auiApp.mode) {
                    case CONST.MODE.THEME:
                        context.dropWidget(widgets, $menus);
                        //页面片段
                        context.dropWidget(menu({pType: CONST.WIDGET.TYPE.FRAME}).order('index').get(), $menus.filter(MENU_CONST.MENU.APP));
                        break;
                    case CONST.MODE.VIEWER:

                        if(!auiApp.isNewDir){
                            context.viewerSelectLayout();
                        }


                        break;

                }


            })
        },

        viewerSelectLayout: function () {
            var context = this,
                dataModel = context.dataModel,
                layoutSelectOptions = [],
                $ctn = $(MENU_CONST.CTN),
                isViewerConfig = !!auiApp.io.projectName,

                viewMenu, _i, value, $layoutSelect;

            $ctn.prepend(context.constant.TEMP.LAYOUT_SELECT);
            $layoutSelect = $(MENU_CONST.LAYOUT_SELECT_SELECTOR);

            //判断项目名是否存在，存在则添加下拉
            if (isViewerConfig) {
                viewMenu = dataModel.get('menu')({
                    pType: 'viewer'
                }).get();

                if (viewMenu) {
                    for (_i = -1; value = viewMenu[++_i];) {
                        layoutSelectOptions.push('<option data-href="_href_" data-type="_type_" value="_href_">布局：_name_</option>'.replace(/_href_/g, value.href).replace(/_name_/, value.name).replace(/_type_/, value.type));
                    }
                }
                $layoutSelect.append(layoutSelectOptions.join(''));

                $layoutSelect.val(context.layoutSelectHref);


            } else {
                $layoutSelect.parent().hide();

            }

            context.$el.off('.menuInput').on({

                'change.menuInput': function (e) {
                    var $target = $(e.target || event.srcElement),

                        $layoutSelect, selectedHref;

                    if (('#' + $target.attr('id')) === MENU_CONST.LAYOUT_SELECT_SELECTOR) {

                        $layoutSelect = $target;
                        selectedHref = $layoutSelect.val();

                        if (selectedHref) {
                            external.getWidget(selectedHref, function (selectedLayoutData) {
                                var themeWidget, nslWidget;
                                window.A.saveApiJs($.extend({}, selectedLayoutData, {
                                    load: {
                                        apiConfig: true,
                                        aui: true,
                                        environment: true,
                                        fresher: true,
                                        api: false
                                    }
                                }), true, dataModel, undefined, undefined, function () {
                                    if (selectedLayoutData) {
                                        if (themeWidget = selectedLayoutData.info.theme || CONST.PAGE.THEME_VALUE) {

                                            window.A.saveThemeWidget(themeWidget);

                                        } else if (nslWidget = selectedLayoutData.info.nsl || CONST.PAGE.NSL_VALUE) {

                                            window.A.saveNslWidget(nslWidget);
                                        }
                                        external.saveConfigure(selectedLayoutData, function () {
                                            document.location.reload(true);
                                        });
                                    }
                                });

                            });
                        }
                    }


                }


            });
        },
        listener: function () {
            /*Aside*/
            var context = this,
                $menus = $(MENU_CONST.MENU_CLASS.SELECTOR),
                dataModel = context.dataModel,
                $customContextMenu = $('[data-role=contextMenu]'),
                $currentWidgetBlock,

                oldWidget,
                groupArray = function (arr) {
                    var len = arr.length;
                    if (len >= 2) {
                        var len1 = arr[0].length, len2 = arr[1].length,
                            lenBoth = len1 * len2, items = new Array(lenBoth), index = 0;

                        for (var i = 0; i < len1; i++) {
                            for (var j = 0; j < len2; j++) {
                                items[index] = arr[0][i] + " " + arr[1][j];
                                index++;
                            }
                        }
                        // 将新组合的数组并到原数组中
                        var newArr = new Array(len - 1);
                        for (var i = 2; i < arr.length; i++) {
                            newArr[i - 1] = arr[i];
                        }
                        newArr[0] = items;
                        // 执行回调
                        return groupArray(newArr);
                    } else {
                        return arr[0];
                    }
                },
                transformWidgetInstanceTheme = function (widgetStyleName, singleThemeClass) {

                    var classArray = singleThemeClass.split(" "), data = {}, index, value;

                    if (widgetStyleName) {
                        for (index = -1; value = widgetStyleName[++index];) {
                            data[value] = classArray[index];
                        }
                    }

                    return data;
                },
                hasJustInitPreview = false,
                menuClickCallback = function (e, arg) {
                    //菜单项事件监听

                    var $this = $(e.target || event.srcElement).closest(CONST.PAGE.ATTR_HREF_SELECTOR),
                        $oldWidget = $(oldWidget),
                        href = $this.attr(CONST.PAGE.ATTR_HREF),
                        type = $this.attr("data-type"),
                        accept = $this.attr("data-accept"),
                        acceptArray = accept.split(' '),
                        pType, $pWidget, acceptLine = [], j,
                        appendWidget = function ($pWidget) {
                            var widgetStyleName = [], themeClass = [], allThemeClass = [],
                                themeName = [], allThemeName = [], themeObj = {}, attrTemp, widgetCssCopy, index,
                                value;
                            j--;
                            if (~j) {
                                if (acceptLine[j] === type) {//当递归到达当前菜单选中的那个组件时
                                    $pWidget.append(type, function (cWidget) {
                                        var oldWidgetTheme = $AW.fresher.theme[href],
                                            oldThemeConfig = oldWidgetTheme,
                                            flagNum, cWdigetCss;


                                        cWdigetCss = cWidget[0].widget.css && JSON.parse(JSON.stringify(cWidget[0].widget.css)) || {};
                                        cWidget.config();

                                        cWidget[0].data.attr.widgetName = "默认";
                                        cWidget[0].data.option.name = "默认";
                                        cWidget[0].data.optionCopy.name = "默认";

                                        cWidget[0].data.themeName = "_default";


                                        if (oldThemeConfig && oldThemeConfig.css) {
                                            //4.4版本兼容处理

                                            themeObj = {
                                                css: {
                                                    'theme': $.extend(true, [], cWdigetCss.theme, oldThemeConfig.css.theme),
                                                    'custom': oldThemeConfig.css.custom && oldThemeConfig.css.custom || []
                                                }
                                            };
                                        } else {
                                            themeObj = {
                                                css: {
                                                    'theme': cWdigetCss.theme || {},
                                                    'custom': []
                                                }
                                            };
                                        }

                                        if (oldThemeConfig && oldThemeConfig["_default"]) {
                                            cWidget[0].data.css.style = oldThemeConfig["_default"];  //将theme里面的配置恢复到structure里面，以便呈现
                                            themeObj["_default"] = oldThemeConfig["_default"];
                                        } else {
                                            themeObj["_default"] = "";
                                        }


                                        widgetCssCopy = css.getCssCopy(JSON.parse(JSON.stringify(cWidget[0].data.css || {})), JSON.parse(JSON.stringify(cWidget[0].widget.css || {})));

                                        cWidget.update({
                                            css: css.getCss(widgetCssCopy),
                                            cssCopy: widgetCssCopy
                                        });


                                        //组合排列数据准备

                                        attrTemp = JSON.parse(JSON.stringify(themeObj.css.theme));

                                        for (index = -1; value = attrTemp[++index];) {
                                            widgetStyleName.push(value.name);
                                            allThemeClass.push(value.valueArray.concat([""]));
                                            allThemeName.push(value.despArray.concat([""]));
                                        }

                                        //组合排列
                                        themeClass = groupArray(allThemeClass);
                                        themeName = groupArray(allThemeName);


                                        if (themeClass) {
                                            themeClass.pop();
                                            flagNum = themeClass.length;
                                            //初始化themeobj 的主题
                                            for (index = -1; value = themeClass[++index];) {
                                                (function (value, index) {
                                                    $pWidget.append(type, function (coWidget) {
                                                        var oldWidgetConfig = $AW.fresher.theme[href],
                                                            oldThemeConfig = oldWidgetConfig, coWidgetCssCopy;
                                                        flagNum--;
                                                        coWidget[0].data.attr.widgetName = themeName[index];
                                                        coWidget[0].data.option.name = themeName[index];
                                                        coWidget[0].data.optionCopy.name = themeName[index];


                                                        coWidget[0].data.themeName = value;  //将每一种主题在structure里面唯一标志出来
                                                        //将组合而成的主题转换成组件自身配置的主题格式
                                                        coWidget[0].data.css.theme = transformWidgetInstanceTheme(widgetStyleName, value);


                                                        if (oldThemeConfig && oldThemeConfig[value]) {

                                                            coWidget[0].data.css.style = oldThemeConfig[value];

                                                            themeObj[value] = oldThemeConfig[value];
                                                        } else {
                                                            themeObj[value] = "";
                                                        }
                                                        coWidget.config();
                                                        coWidgetCssCopy = css.getCssCopy(JSON.parse(JSON.stringify(coWidget[0].data.css || {})), JSON.parse(JSON.stringify(coWidget[0].widget.css || {})));

                                                        coWidget.update({
                                                            css: css.getCss(coWidgetCssCopy),
                                                            cssCopy: coWidgetCssCopy
                                                        });


                                                        coWidget.config();

                                                        if (flagNum === 0) {
                                                            app.shelter.hide();

                                                            $AW.fresher.theme[href] = themeObj;
                                                            $AW(dataModel.get('uuid')).find(type).first().config();
                                                        }
                                                    });
                                                }(value, index))
                                            }


                                        } else {
                                            app.shelter.hide();
                                            $AW.fresher.theme[href] = themeObj;
                                            $AW(dataModel.get('uuid')).find(type).first().config();
                                        }

                                    });
                                } else {
                                    $pWidget.append(acceptLine[j], function (cWidget) {
                                        cWidget.config();
                                        appendWidget(cWidget);
                                    });
                                }
                            }
                        };

                    //追踪源容器
                    acceptLine.push(type);
                    while ($.inArray(CONST.WIDGET.PAGE_TYPE, acceptArray) < 0) {
                        pType = acceptArray[0];
                        acceptLine.push(pType);
                        acceptArray = dataModel.get('menu')({type: pType}).first().accept.split(" ");
                    }

                    /*AUI.currentThemeWidgetType = type;*/

                    if ($this.get(0) !== oldWidget || arg === 'themeExchange') {
                        $oldWidget.removeClass('aui-menu-item-selected');
                        oldWidget = $this.get(0);
                        $this.addClass('aui-menu-item-selected');
                        $pWidget = $AW(dataModel.get('uuid'));
                        $pWidget.empty(true, true);
                        j = acceptLine.length;
                        app.shelter.upperZIndex('1061', null, false);
                        app.shelter.show("正在拼命组装中,请稍候...", true);

                        appendWidget($pWidget);

                        AUI.openPage(CONST.PAGE.PREVIEW_FRAME.SELF, function () {
                            $AW.trigger($AW._STATUS.PREVIEW_FRAME.FRESH);
                        });



                    }

                };


            context.$el.off('.menu').on({
                'click.menu': function (e, args) {
                    var MENU_CLASS = MENU_CONST.MENU_CLASS,
                        $target = $(e.target || event.srcElement).closest('[data-role]'),
                        $widgetBlock = $target.closest('.' + MENU_CONST.CUSTOM_MENU_BLOCK),
                        role = $target.attr('data-role'),
                        link, href, collectionType, inputValue,
                        $icon;

                    //收藏
                    switch (role) {
                        //
                        case MENU_CONST.MENU_NAV_LI:
                            if (!$target.hasClass(STYLE_STATUS.ACTIVE)) {
                                link = $target.children().attr(CONST.PAGE.ATTR_HREF);
                                if (link) {
                                    $target.addClass(STYLE_STATUS.ACTIVE);
                                    $target.siblings().removeClass(STYLE_STATUS.ACTIVE);
                                    $menus.not(link).addClass(STYLE_STATUS.HIDE);
                                    $menus.filter(link).removeClass(STYLE_STATUS.HIDE);
                                }
                            }
                            break;


                        //点击收藏
                        case MENU_CONST.COLLECTION:
                            context.collectWidget($target.parent().attr(CONST.PAGE.ATTR_HREF), $target.attr('data-status') !== MENU_CONST.CHOICE.CHOSEN['data-status']);

                            break;

                        //展开折叠
                        case MENU_CONST.ANGLE_UP_TITLE:
                            if (($icon = $target.children(MENU_CLASS.ANGLE_SELECTOR)).length) {

                                if ($icon.hasClass(COMMON_CLASS_CONST.ANGLE_UP)) {
                                    $icon.removeClass(COMMON_CLASS_CONST.ANGLE_UP);
                                    $icon.addClass(COMMON_CLASS_CONST.ANGLE_DOWN);
                                    $target.next().slideDown(200);
                                } else {
                                    $icon.removeClass(COMMON_CLASS_CONST.ANGLE_DOWN);
                                    $icon.addClass(COMMON_CLASS_CONST.ANGLE_UP);
                                    $target.next().slideUp(200);
                                }
                            }
                            break;
                        //删除收藏分组
                        case MENU_CONST.DEL_COLLECTION_GROUP:

                            collectionType = $target.closest(MENU_CONST.WIDGET_BLOCK_CLASS).attr(MENU_CONST.COLLECTION_TYPE_ATTR);
                            context.collectWidget(MENU_CONST.DEL_COLLECTION_GROUP, false, collectionType);

                            $target.closest(MENU_CONST.WIDGET_BLOCK_CLASS).remove();

                            $customContextMenu.find('[data-move-target="' + collectionType + '"]').remove();

                            break;

                        //修改标题
                        case MENU_CONST.MODIFY_TITLE:
                            inputValue = $target.text();
                            collectionType = $target.closest(MENU_CONST.WIDGET_BLOCK_CLASS).attr(MENU_CONST.COLLECTION_TYPE_ATTR);
                            app.popover({
                                $elem: $target,
                                title: '修改分组名',
                                content: '<input type="text" class="span4 aui-popover-input" value="_value_" placeholder="请输入2~64个字符的分组名称"/>'.replace(/_value_/, inputValue),
                                width: '360px',
                                height: '120px',
                                init: function (popInstance) {

                                },
                                confirmHandler: function (popInstance) {
                                    var value = this.$tip.find('input').val();

                                    if (/^(?:\w|[^\x00-\xff]){2,64}$/.test(value)) {

                                        $target.parents('[' + MENU_CONST.COLLECTION_TYPE_ATTR + ']').each(function () {
                                            $(this).attr(MENU_CONST.COLLECTION_TYPE_ATTR, value);
                                        });
                                        $target.text(value);

                                        context.collectWidget(MENU_CONST.MODIFY_TITLE, false, {
                                            oldTitle: collectionType,
                                            newTitle: value
                                        });

                                        return true;
                                    }
                                }
                            });

                            break;

                        //取消分组
                        case MENU_CONST.CANCEL_COLLECTION:
                            if ($widgetBlock.length && ( href = $widgetBlock.attr(CONST.PAGE.ATTR_HREF))) {
                                context.collectWidget(href, false);
                            }
                            break;

                        case MENU_CONST.TAB_CONTENT:

                        case MENU_CONST.SEARCH_ATTR:

                            if (auiApp.mode === CONST.MODE.THEME) {
                                menuClickCallback(e, args)
                            }

                            break;

                        default:

                            break;
                    }


                },
                'keyup.menu': function (e) {
                    var
                        SEARCH_CONST = MENU_CONST.SEARCH_CONST,
                        $target = $(e.target || event.srcElement),
                        $menuTabCtn = $(MENU_CONST.TAB_CTN, $body),
                        widgetCollectionMap = dataModel.getConfigValue('widgetCollection').map,
                        $searchMenu = $menus.filter(MENU_CONST.MENU.SEARCH),
                        $searchMenuCtn = $searchMenu,
                        html = [],
                        menuSearchResult = {},
                        i, len, item, key,
                        searchResultArray;

                    if ($target.attr('id') == MENU_CONST.SEARCH_ID) {

                        if (key = $target.val()) {
                            searchResultArray = dataModel.get('menu')([{
                                name: {
                                    likenocase: key
                                }
                            }, {
                                type: {
                                    likenocase: key
                                }
                            }, {
                                href: {
                                    likenocase: key
                                }
                            }]).order('name desc')
                                .get();

                            $menuTabCtn.addClass('hide');
                            $searchMenu.parent().removeClass('hide');
                            $searchMenuCtn.removeClass('hide');

                            $target[searchResultArray.length ? 'removeClass' : 'addClass'](SEARCH_CONST.EMPTY);

                            for (len = searchResultArray.length; item = searchResultArray[--len];) {
                                if (item.accept) {
                                    item.isCollected = widgetCollectionMap[item.href] ? true : false;
                                    html.push(template('auiAsideMenuBlock', item));
                                }
                            }

                            menuSearchResult = {
                                "version": version,
                                "keyword": key,
                                "num": html.length,
                                "type": 'widget',
                                "href": '',
                                "pageId": ''
                            };

                            /* if (auiApp.mode !== CONST.MODE.THEME) {*/
                            //销毁并清空上次的搜索结果
                            $('.' + MENU_CONST.CUSTOM_MENU_BLOCK, $searchMenu).draggable('destroy');
                            $searchMenu.empty().append(context.constant.TEMP.SEARCH_RESULT
                                .replace(/_len_/, html.length)
                                .replace(/_html_/, html.join(''))
                            );

                            //添加新的搜索结果

                            $('.' + MENU_CONST.CUSTOM_MENU_BLOCK, $searchMenu)
                                .tooltips(CONST.WIDGET.TOOLTIP_OPTION)
                                .draggable(CONST.WIDGET.DRAGGABLE_OPTION);
                            /*}*/
                        } else {
                            $menuTabCtn.removeClass('hide');

                            $searchMenuCtn.addClass('hide');

                            $target.removeClass(SEARCH_CONST.EMPTY);
                        }
                    }

                }

            });

            $body
                .off('.menu')
                .on('click.menu', function (e) {
                    var $target = $(e.target || e.srcElement),
                        $el = $target.closest('[data-role]'),
                        role = $el.attr('data-role'),
                        href = $currentWidgetBlock && $currentWidgetBlock.attr(CONST.PAGE.ATTR_HREF),
                        $widgetCollectionMenu = $menus.filter(MENU_CONST.MENU.WIDGET_COLLECTION);


                    switch (role) {

                        //
                        case MENU_CONST.MOVE_GROUP_LIST:
                            $customContextMenu.css(app.position(e, $widgetCollectionMenu, $el, -5, 75)).show();
                            $currentWidgetBlock = $el.closest('.' + MENU_CONST.CUSTOM_MENU_BLOCK);

                            break;

                        case MENU_CONST.MOVE_TO_GROUP:

                            context.collectWidget(href, false);
                            context.collectWidget(href, true, $el.attr('data-move-target'));
                            $customContextMenu.hide();

                            break;


                        case MENU_CONST.ADD_GROUP:
                            //href =$currentWidgetBlock &&  $currentWidgetBlock.attr('data-href');

                            app.popover({
                                $elem: $el,
                                title: '新建分组',
                                content: '<input type="text" class="span4 aui-popover-input" placeholder="请输入2~64个字符的分组名称"/>',
                                width: '360px',
                                height: '120px',
                                init: function (popInstance) {

                                },
                                confirmHandler: function (popInstance) {

                                    // var $this = $(this);
                                    var value = this.$tip.find('input').val();

                                    if (/^(?:\w|[^\x00-\xff]){2,64}$/.test(value)) {
                                        context.collectWidget(href, false);
                                        context.collectWidget(href, true, value);
                                        return true;
                                    }
                                }
                            });
                            $customContextMenu.hide();

                            break;

                        case MENU_CONST.DELETE:
                            context.collectWidget(href, false);
                            $customContextMenu.hide();
                            break;

                        default:

                            $customContextMenu.hide();
                            break;

                    }
                });

            $AW.off(type)
                .on(type, function (type, href) {
                    context.layoutSelectHref = href;
                });
        }
    };

    return {
        load: function ($el, handler) {

            new Menu($el, handler.dataModel);
        },
        unload: function ($el, handler) {
            $el.off();
            $AW.off(type);
        },
        pause: function ($el, handler) {

        },
        resume: function ($el, handler) {

        }
    };
});
  