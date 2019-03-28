( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define([], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function () {
        "use strict";
        var Event = function (timeout) {
            this.timeout = timeout || 100;
            this.cache={};
            this.delayHandler={};
        };

        Event.prototype = {
            constructor: Event,
            //事件监听
            // cache: {},
            // delayHandler: {},
            //timeout:100,
            // $AW.on({
            //  'type1.namespace1.namespace2':callback1,
            //  'type2.namespace1.namespace2':callback2,
            // });
            // $AW.on('type1.namespace1.namespace2,type2.namespace1.namespace2',callback);
            // $AW.on('type1','namespace',callback);
            on: (function () {

                var context,
                    method = {
                        '1': function (obj) {
                            var k, v, p;

                            for (k in obj) {
                                if (obj.hasOwnProperty(k)) {
                                    v = obj[k];
                                    p = k.split('.');

                                    method['3'](p[0], p.slice(1, p.length).join('.'), v);
                                }
                            }
                        },
                        '2': function (type, callback) {
                            var types = type.split(','),
                                i, p;

                            for (i = types.length; type = types[--i];) {

                                p = type.split('.');

                                method['3'](p[0], p.slice(1, p.length).join('.'), callback);
                            }
                        },
                        '3': function (type, namespace, callback) {
                            var event;

                            event = (context.cache[type] || (context.cache[type] = []));
                            namespace = namespace || '';

                            if ($.isFunction(callback)) {
                                event.push({
                                    callback: callback,
                                    namespace: namespace || ''
                                });
                            }
                        }
                    };

                return function () {
                    context = this;

                    method[arguments.length].apply(this, arguments);
                };
            }()),
            //$AW.off('type1.namespace1.namespace2,type2.namespace1.namespace2,');
            off: function (type) {

                var types,
                    p, i, namespace,
                    events,
                    j, event;


                if (type) {
                    types = type.split(',');

                    for (i = types.length; type = types[--i];) {
                        p = type.split('.');

                        namespace = p.slice(1, p.length).join('.') || '';
                        type = p[0];


                        if (namespace) {
                            events = this.cache[type];

                            for (j = events.length; event = events[--j];) {
                                if (event.namespace.indexOf(namespace) !== -1) {
                                    events.splice(j, 1);
                                    break;
                                }
                            }
                        } else {
                            delete  this.cache[type];
                        }
                    }
                } else {
                    this.cache = {};
                }
            },
            dispatchEvent: function (type) {
                var types, i,
                    props,
                    namespaces, namespace, k, matchNamespace,
                    events, event, j,
                    args = arguments;

                if (type) {
                    types = type.split(',');

                    for (i = types.length; type = types[--i];) {
                        props = type.split('.');

                        namespaces = props.slice(1, props.length) || [];
                        type = props[0];
                        events = this.cache[type] || [];

                        if (namespaces.length) {

                            for (j = events.length; event = events[--j];) {
                                matchNamespace = true;

                                for (k = namespaces.length; namespace = namespaces[--k];) {
                                    if (event.namespace.indexOf(namespaces) === -1) {
                                        matchNamespace = false;
                                        break;
                                    }
                                }

                                if (matchNamespace) {
                                    event.callback.apply(event, args);
                                }
                            }
                        } else {
                            for (j = events.length; event = events[--j];) {
                                event.callback.apply(event, args);
                            }
                        }
                    }
                }
            },
            //$AW.trigger('type1.namespace1.namespace2,type2.namespace1.namespace2,');
            trigger: function (type) {
                var context = this,
                    args = arguments;

                window.clearTimeout(this.delayHandler[type]);

                this.delayHandler[type] = window.setTimeout(function () {
                    context.dispatchEvent.apply(context, args);
                }, this.timeout);
            }
        };

        return Event;
    });
})();



