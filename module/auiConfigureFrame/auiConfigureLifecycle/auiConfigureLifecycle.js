define(["jquery", "const", "lifecycle"], function ($, CONST, lifecycleUtil) {

    var STATUS = $AW._STATUS.CONFIGURE_FRAME.CONFIG,
        NAME_SPACE = '.'+CONST.PAGE.CONFIGURE_FRAME.LIFECYCLE.NAME_SPACE,
        type = STATUS+NAME_SPACE;

    return {
        load: function ($el, handler) {
            $AW.off(type)
                .on(type, function (type, widgetID) {
                    lifecycleUtil.lifecycleConfig($(CONST.PAGE.CONFIGURE_FRAME.LIFECYCLE.CTT, $el), $AW(widgetID), function (visible) {
                        window.A.setConfigureTabVisible($el,visible);
                    });
                }
            );


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
  