define(["jquery", 'preview'], function ($, Preview) {


    return {
        load: function ($el, handler) {
            var previewIns = new Preview($el, handler.dataModel);

            previewIns.init();

            $AW.off($AW._STATUS.PREVIEW_FRAME.FRESH+'.preview_fresh')
                .on($AW._STATUS.PREVIEW_FRAME.FRESH+'.preview_fresh',function (type) {
                    previewIns.init();
                })


        },
        unload: function ($el, handler) {
            $AW.off($AW._STATUS.PREVIEW_FRAME.FRESH+'.preview_fresh');
        },
        pause: function ($el, handler) {

        },
        resume: function ($el, handler) {

        }
    };
});
  