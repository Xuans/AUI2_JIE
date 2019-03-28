define(["jquery", "base","const"], function ($, base,CONST) {

    var STATUS = $AW._STATUS.CONFIGURE_FRAME.CONFIG,
        NAME_SPACE = '.'+CONST.PAGE.CONFIGURE_FRAME.OPTION.NAME_SPACE,
        type = STATUS+NAME_SPACE;

    return {
        load: function ($el, handler) {


            $AW.off(type)
                .on(type,function(type,widgetID){
                    // if(auiApp.mode!==CONST.MODE.WIDGET_CREATOR){
                    //     $AW(handler.dataModel.get('uuid')).config();
                    // }
                    base.baseConfigure($el, $AW(widgetID), function ( visible) {
                        window.A.setConfigureTabVisible($el,visible);
                    });
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
  