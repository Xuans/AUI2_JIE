define(["jquery", "const", "base"], function ($, CONST, base) {

    var NAV_CONFIGURE_CONST = CONST.PAGE.NAV_CONFIGURE_FRAME,
        NAV_STATUS = $AW._STATUS.NAV_CONFIGURE_FRAME,
        status = [],
        NavConfigure = function ($el, dataModel) {
            this.$el = $el;
            this.dataModel = dataModel;
            this.listener();
        }, key;

    NavConfigure.prototype = {
        constructor: 'NavConfigure',
        menuIdMap: {},
        listener: function () {
            var context = this,
                dataModel = this.dataModel;

            this.$el.off('.navigator')
                .on({
                    'click.navigator': function (e, menuData) {
                        var el = (e.target || e.srcElement),
                            $el = $(el).closest('[data-event-role]'),
                            eventRole = $el.attr('data-event-role'),
                            contentId,
                            $li, $asideLi;
                        switch (eventRole) {
                            case NAV_CONFIGURE_CONST.ADD_TAB:
                                context.addTab();
                                break;
                            case NAV_CONFIGURE_CONST.DELETE_TAB:
                                $li = $el.parent('li');
                                if ($li.hasClass('active')) {
                                    $asideLi = $li.siblings(':visible').first();
                                    $asideLi.addClass('active');
                                    $($asideLi.children('a').attr('href')).show();
                                }

                                if (contentId = $li.children('a').attr('href')) {

                                    $li.add($(contentId)).remove();
                                    contentId = contentId.split('#')[1];

                                    dataModel.get('structure')({widgetID: contentId}).remove();
                                } else {
                                    $li.remove();
                                }

                                break;
                        }

                    },
                    'change.navigator': function (e) {
                        var $e = $(e.target || window.event.srcElement),
                            navMenu = dataModel.get('navMenu');

                        if ($e.attr('id') === NAV_CONFIGURE_CONST.TABLE_NAME_ID) {
                            navMenu.tableName = $e.val() || NAV_CONFIGURE_CONST.DEFAULT_MENU;
                            dataModel.set('navMenu', navMenu);
                        }

                    }
                });
        },
        addMenu: function (id, $content, menuData) {
            var context = this,
                dataModel = context.dataModel,
                oWidgetCreator,
                option = menuData || {},
                optionCopy = base.baseConfigInitInstance($.extend(true, {}, option), NAV_CONFIGURE_CONST.OPTION);

            //body中添加widget入口
            //  $body.append('<div data-widget-id="' + id + '"></div>');

            //data model 添加widget
            dataModel.get('widget').insert({
                name: 'creator',
                desp: 'creator',
                icon: 'fa fa-files',
                type: CONST.CREATOR.TYPE,
                pType: '',
                href: CONST.CREATOR.HREF,
                belongTo: 'creator',
                version: CONST.AWOS_APP_UNITED_VERSION,
                index: 0,
                option: NAV_CONFIGURE_CONST.OPTION,
                attr: []
            });
            dataModel.get('structure').insert({
                widgetID: id,//primary key
                type: CONST.CREATOR.TYPE,//foreign key
                href: CONST.CREATOR.HREF,//foreign key
                active: true,//是否生效，撤销之后不生效
                option: option,
                optionCopy: optionCopy,
                attr: {
                    widgetName: 'CREATOR'
                },
                css: {},
                children: []
            });

            /*      $AW[NAV_CONST.CREATOR.HREF]=refreshTreeMenu;*/

            $AW.on($AW.STATUS.WIDGET_UPDATE, function (eventName, oWidget, event) {

                if (oWidget.id() === context.menuIdMap[oWidget.id()]) {
                    context.refreshTreeMenu(oWidget, event);
                }
            });

            //初始化oWidgetCreator
            oWidgetCreator = $AW(id);

            //初始化: creator在structure中的结构，此时creator在structure中的option是defaultValue的集合
            base.resumeBaseConfig(oWidgetCreator);

            //  AUI.currentWidgetID = id;
            //     AUI.configLock = true;

            //初始化菜单编辑主页面
            base.baseConfigure($content, oWidgetCreator);

            context.refreshTreeMenu(oWidgetCreator);
        },
        addTab: function (menuData, index) {
            var context = this,
                dataModel = context.dataModel,
                id, $li,
                length = $(NAV_CONFIGURE_CONST.TAB_UL_SELECTOR).children().length,
                $content;

            if (index !== undefined) {
                id = 'menu' + index;
            } else {
                id = 'menu' + length + 1;
            }
            context.menuIdMap[id] = id;
            $content = $('<div class="aui-row tab-pane" id="_id_"></div>'.replace('_id_', id));

            $li = $('<li><a href= "#_id_" data-toggle="tab" data-event-role="clickTab">菜单_num_</a><i class="aui aui-guanbi aui-icon " data-event-role="deleteTab" title="删除"></i></li>'.replace('_id_', id).replace('_num_', dataModel.getEventAccumulator()));
            $(NAV_CONFIGURE_CONST.TAB_UL_SELECTOR).append($li);
            $(NAV_CONFIGURE_CONST.TAB_CONTENT_SELECTOR).append($content);
//新增的时候
            $(NAV_CONFIGURE_CONST.TAB_LI_SELECTOR).removeClass('active');
            $li.addClass('active');
            $(NAV_CONFIGURE_CONST.TAB_CONTENT_SELECTOR).children().hide();
            $('#' + id).show();


            $li.off('.navigator').on('click.navigator', function () {
                var $this = $(this), $tabContent, Wid = $this.children('a').attr('href'),
                    sid,
                    oWidgetCreator,
                    owidget;


                if (Wid) {
                    sid = Wid.split("#")[1];
                    oWidgetCreator = dataModel.get('structure')({widgetID: sid}).first();
                    $(NAV_CONFIGURE_CONST.TAB_LI_SELECTOR).removeClass('active');
                    $(NAV_CONFIGURE_CONST.TAB_CONTENT_SELECTOR).children().hide();
                    $this.addClass('active');
                    $tabContent = $(Wid);
                    $tabContent.show();
                    if (oWidgetCreator) {
                        // AUI.currentWidgetID = oWidgetCreator.widgetID;
                        owidget = $AW(oWidgetCreator.widgetID);
                        context.refreshTreeMenu(owidget);
                    }
                }


            });


            this.addMenu(id, $content, menuData);
        },


        refreshTreeMenu: function (oWidget, event) {
            var widgetID = oWidget[0].widgetID,
                menuType = oWidget[0].data.option && oWidget[0].data.option.typeName || oWidget[0].data.option.type,
                $tabName = $(NAV_CONFIGURE_CONST.TAB_UL_SELECTOR).find('a[href=#' + widgetID + ']'),
                modelSelector = event && event.modelSelector;


            if (modelSelector === NAV_CONFIGURE_CONST.MENU_MODELSELECTOR) {
                $tabName.html(eval(modelSelector));
            } else if (menuType) {
                $tabName.html(menuType);
            }

            $AW.trigger($AW._STATUS.NAV_MENU_TREE_FRAME.FRESH, widgetID);


        },
        resumeMenu: function () {
            var context = this,
                menuData = context.dataModel.get('navMenu'), i, menuItem;

            if (menuData.menus) {

                $(NAV_CONFIGURE_CONST.TABLE_NAME_SELECTOR).val(menuData.tableName);

                for (i = -1; menuItem = menuData.menus[++i];) {
                    this.addTab(menuItem, i);
                }

                //      this.setSqlAndJSON();

            } else {

                this.addTab();
                //   $('a[href="#auiCodeCtnSql"]').tab('show');
                //   sqlEditor.layout();
            }
            $(NAV_CONFIGURE_CONST.TABLE_NAME_SELECTOR).val(menuData.tableName);
            $AW.trigger($AW._STATUS.NAV_SQL_FRAME.FRESH);
            $AW.trigger($AW._STATUS.NAV_JSON_FRAME.FRESH);
            $AW.trigger($AW._STATUS.NAV_CSV_FRAME.FRESH);
        },
        cleanMenu: function () {
            var context = this,
                dataModel = this.dataModel;

            $.each($.extend(true, [], dataModel.get('structure')().get()), function (index, widgetData) {
                $('a[href=#' + widgetData.widgetID + ']', context.$el).remove();
                $('#' + widgetData.widgetID).remove();
                $AW(widgetData.widgetID).destroy();
            });
            dataModel.get('structure')().remove();
            dataModel.setConfigValue('navigator_data', {});
            window.A.updatePageConfig();
            dataModel.get('widget')().remove();
        }
    };

    for (key in NAV_STATUS) {
        status.push(NAV_STATUS[key] + '.' + NAV_CONFIGURE_CONST.NAME_SPACE);
    }
    return {
        load: function ($el, handler) {
            var dataModel = handler.dataModel,
                navConfigure = new NavConfigure($el, dataModel);


            $AW.off(status.join(','))
                .on(status.join(','), function (type) {
                    switch (type) {
                        case NAV_STATUS.LOAD:
                            navConfigure.resumeMenu();
                            break;
                        case NAV_STATUS.CLEAR:
                            navConfigure.cleanMenu();
                            break;
                    }
                })

        },
        unload: function ($el, handler) {
            $AW.off(status.join(','));
        },
        pause: function ($el, handler) {

        },
        resume: function ($el, handler) {

        }
    };
});