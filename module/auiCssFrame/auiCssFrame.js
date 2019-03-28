define(["jquery", "codeCompile", "const"], function ($, codeCompiler, CONST) {

    var NAME_SPACE = '.' + CONST.PAGE.CONFIGURE_FRAME.CSS.SELF,
        type = $AW._STATUS.CSS_FRAME.LOAD + NAME_SPACE;

    return {
        load: function ($el, handler) {

            var codeCompile = new codeCompiler(),
                cssData, option, cssData;




            $AW.off(type)
                .on(type, function (type) {
                    if ((option = $AW(CONST.CREATOR.ID).option()) && (cssData = (option.deps && option.deps.css))) {
                        codeCompile.compileCss(cssData, $el);
                    }
                 //   codeCompile.compileCss($AW(CONST.CREATOR.ID).option().deps.css, $el);
                });

            $AW.trigger($AW._STATUS.CSS_FRAME.LOAD);


        },
        unload: function ($el, handler) {
            $AW.off(type);

            console.log('unload', handler.cacheId);
        },
        pause: function ($el, handler) {
            console.log('pause', handler.cacheId);
        },
        resume: function ($el, handler) {

            console.log('resume', handler.cacheId);
        }
    };
});