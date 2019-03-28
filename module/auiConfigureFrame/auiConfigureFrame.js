define(["jquery", "const"], function ($, CONST) {

    var CONFIGURE_FRAME_STATUS = $AW._STATUS.CONFIGURE_FRAME,
        STATUS_STACK = [],
        CONFIGURE_FRAME_CONST = CONST.PAGE.CONFIGURE_FRAME,
        parentModule = CONFIGURE_FRAME_CONST.SELF,
        NAME_SPACE = '.' + parentModule,
        basePath = 'module/' + parentModule + '/',
        k, type,
        configure = {
            OPEN_PAGE: [
                {
                    title: '参数',
                    icon: 'aui aui-shuxingyucanshu',
                    path: basePath + CONFIGURE_FRAME_CONST.OPTION.SELF,
                    id: CONFIGURE_FRAME_CONST.OPTION.SELF,
                    active: true
                },
                {
                    title: '校验配置',
                    icon: 'aui aui-xiaoyan',
                    path: basePath + CONFIGURE_FRAME_CONST.EDM.SELF,
                    id: CONFIGURE_FRAME_CONST.EDM.SELF
                },
                {
                    title: '事件绑定',
                    icon: 'aui aui-shijian',
                    path: basePath + CONFIGURE_FRAME_CONST.EVENT.SELF,
                    id: CONFIGURE_FRAME_CONST.EVENT.SELF
                }, {
                    title: '生命周期',
                    icon: 'aui aui-shengmingzhouqi',
                    path: basePath + CONFIGURE_FRAME_CONST.LIFECYCLE.SELF,
                    id: CONFIGURE_FRAME_CONST.LIFECYCLE.SELF
                },
                {
                    title: '样式',
                    icon: 'aui aui-yangshi',
                    path: basePath + CONFIGURE_FRAME_CONST.CSS.SELF,
                    id: CONFIGURE_FRAME_CONST.CSS.SELF
                },
                {
                    title: '国际化',
                    icon: 'aui aui-guojihua',
                    path: basePath + CONFIGURE_FRAME_CONST.NSL.SELF,
                    id: CONFIGURE_FRAME_CONST.NSL.SELF
                }
            ],
            setTitle: function (widgetID) {
                var oWidget, data, name, categoryName;

                if (oWidget = $AW(widgetID).get(0)) {
                    if (data = oWidget.data) {
                        name = data.attr.widgetName;
                        if (data.href === CONST.WIDGET.PAGE_HREF) {
                            name = data.attr.desp;
                        }

                        categoryName = oWidget.widget.name;
                        $(CONFIGURE_FRAME_CONST.TITLE_ROLE).text(name + '[' + categoryName + ']').attr({
                            'title': categoryName,
                            'data-href': data.href
                        });
                    }
                }
            }
        };

    for (k in CONFIGURE_FRAME_STATUS) {
        STATUS_STACK.push(CONFIGURE_FRAME_STATUS[k] + NAME_SPACE);
    }

    type = STATUS_STACK.join(',');

    return {
        load: function ($el, handler) {
            var router = handler.controller({
                    view: {
                        $ctn: $(CONFIGURE_FRAME_CONST.CTT, $el)
                    }
                }),
                i = -1, item;
            while (item = configure.OPEN_PAGE[++i]) {
                item['pID'] = parentModule;
                router.open(item);
            }

            $AW.off(type)
                .on(type, function (type, widgetID) {
                    switch (type) {
                        case CONFIGURE_FRAME_STATUS.CONFIG:
                            configure.setTitle(widgetID);
                            break;

                        case CONFIGURE_FRAME_STATUS.NAME:
                            configure.setTitle(widgetID);
                            break;

                        case CONFIGURE_FRAME_STATUS.OPTION_LOAD:
	                        (app.router.page.auiConfigureOption)  && app.router.page.auiConfigureOption.done(function () {
		                        $AW(widgetID).config()
	                        });

                            break;

                        default:
                            break;

                    }
                });



            // switch
        },
        unload: function ($el, handler) {

            $AW.off(type)

        },
        pause: function ($el, handler) {

        },
        resume: function ($el, handler) {

        }
    };
});
  