define(["jquery", "const", "edm"], function ($, CONST, edmUtil) {

    var STATUS = $AW._STATUS.CONFIGURE_FRAME.CONFIG,
        NAME_SPACE = '.'+CONST.PAGE.CONFIGURE_FRAME.EDM.NAME_SPACE,
        type = STATUS+NAME_SPACE;

    return {
        load: function ($el, handler) {

            $AW.off(type)
                .on(type,function(type, widgetID){
                    edmUtil.edmRegexConfig($(CONST.PAGE.CONFIGURE_FRAME.EDM.CTT, $el), $AW(widgetID), function (visible) {
                        window.A.setConfigureTabVisible($el,visible);
                    })
                });


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
  