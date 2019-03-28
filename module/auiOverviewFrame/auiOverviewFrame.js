define(["jquery", "overview", "const"], function ($, overview, CONST) {

    var OVERIVER_STUTUS = $AW._STATUS.OVERVIEW_FRAME,
        NAMESPACE = '.overview',
        _status_type = [OVERIVER_STUTUS.SHOW, OVERIVER_STUTUS.NAME].join(NAMESPACE + ',') + NAMESPACE;

    return {
        load: function ($el, handler) {
            var dataModel = handler.dataModel,
                setTitle = function (name) {
                    $(CONST.PAGE.OVERVIEW_FRAME.TITLE_SELECTOR, $el).text(name);
                };

            $AW.off(_status_type)
                .on(_status_type, function (type, options) {
                    var map = {},
                        key, instance,
                        name;
                    switch (type) {
                        case OVERIVER_STUTUS.SHOW:
                            if (options) {
                                overview.show(options,$el);
                                key = options.applyTo.toLowerCase();
                                map[key + 'ID'] = options.foreignID;
                                if (instance = dataModel.get(key)(map).first()) {
                                    setTitle(instance.desp || '');
                                }
                            }
                            break;

                        case OVERIVER_STUTUS.NAME:
                            name = options;
                            setTitle(name);
                            break;
                    }

                })


        },
        unload: function ($el, handler) {
            $el.off();
            $AW.off(_status_type);
            overview.hide();
        },
        pause: function ($el, handler) {

        },
        resume: function ($el, handler) {

        }
    };
});