define(["jquery", "const"], function ($, CONST) {
    return {
        load: function ($el, handler) {

            $el.empty().append(CONST.PAGE.DEVELOPMENT_FRAME.TEMP);

        },
        unload: function ($el, handler) {
            console.log('unload', handler.cacheId);
        },
        pause: function ($el,  handler) {
            console.log('pause', handler.cacheId);
        },
        resume: function ($el,  handler) {
            console.log('resume', handler.cacheId);
        }
    };
});