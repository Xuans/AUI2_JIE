define(["jquery", "base", "const"], function ($, base, CONST) {

    var NAME_SPACE = '.' + CONST.PAGE.CONFIGURE_DEF_FRAME.SELF,
        type = $AW._STATUS.CONFIGURE_DEF_FRAME.LOAD + NAME_SPACE;

    return {
        load: function ($el, handler) {
            var dataModel = handler.dataModel,
                init=function () {
                    switch (auiApp.mode) {


                        case CONST.MODE.TRANSLATOR:

                            require(['nsl'], function (nsl) {

                                var LANGUAGE_CONFIG_PANEL_ID = CONST.PAGE.CONFIGURE_DEF_FRAME.SELF,
                                    langConfig = nsl.renderTranslatorConfig(dataModel.get('translatorConfig'), LANGUAGE_CONFIG_PANEL_ID);
                                dataModel.set('langConfigAttr', langConfig.langConfigAttr);
                                dataModel.set('langConfigObj', langConfig.langConfigObj);
                            });

                            break;
                        default:

                            if($AW(CONST.CREATOR.ID).id()){
                                base.baseConfigure($(CONST.PAGE.CONFIGURE_DEF_FRAME.CTN), $AW(CONST.CREATOR.ID));
                            }

                            break;


                    }
                };

            init();
            $AW.off(type)
                .on(type, function () {
                    init();

                })

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