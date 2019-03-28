define(["jquery", "const", "css"], function ($, CONST, cssUtil) {

    var STATUS = $AW._STATUS.CONFIGURE_FRAME.CONFIG,
        NAME_SPACE = '.'+CONST.PAGE.CONFIGURE_FRAME.CSS.NAME_SPACE,
        type = STATUS+NAME_SPACE;

    return {
        load: function ($el, handler, widgetID) {

            $AW.off(type).on(type,function(type, widgetID){
                cssUtil.cssConfigure($(CONST.PAGE.CONFIGURE_FRAME.CSS.CTT, $el), $AW(widgetID), function (visible) {
                    window.A.setConfigureTabVisible($el,visible);
                })
            });

            // css.cc($el, $AW(widgetID));
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
  