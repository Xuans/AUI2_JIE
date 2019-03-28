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
        function Chain() {
            this.cache = {};
        }

        Chain.prototype = {
            constructor: Chain,
            add: function (pID, id) {
                var _this = this,
                    pChain, cChain, item, pItem, parent, i;

                pChain = this.cache[pID] || (this.cache[pID] = {
                        parent: '',
                        parents: [],
                        self: pID,
                        subset: []
                    });
                cChain = this.cache[id] = {
                    parent: pID,
                    parents: [pID],
                    self: id,
                    subset: []
                };
                while (pChain) {
                    pChain.subset.push(id);
                    for (i = -1; item = pChain.subset[++i];) {
                        pItem = _this.cache[item];
                        if (pItem) {
                            parent = pItem.parent;
                            !cChain.parents.some(function (pid) {
                                return pid === parent;
                            }) && cChain.parents.push(parent);
                        }
                    }
                    pChain = this.cache[pChain.parent];
                }
            },
            find: function (id) {
                var _this = this,
                    item,
                    ret = [];
                if (typeof id === 'string') {
                    ret = (item = this.cache[id]) && item.subset;
                } else {
                    ret = id.map(function (idx) {
                        return ((item = _this.cache[idx]) && item.subset).join(',');
                    });
                }
                return ret;
            },
            parents: function (id) {
                var _this = this,
                    item,
                    ret = [];
                if (typeof id === 'string') {
                    ret = (item = this.cache[id]) && item.parents;
                } else {
                    ret = id.map(function (idx) {
                        return ((item = _this.cache[idx]) && item.parents).join(',');
                    });
                }

                return ret;
            },
            parent: function (id) {
                var item,
                    ret = '';
                if (item = this.cache[id]) {
                    ret = item.parent;
                }

                return ret;
            },
            update: function (pID, id) {
                var i, item, context = this,
                    subset = this.find(id),
                    stack = [{
                        self: id,
                        parent: pID
                    }];
                if (id) {
                    if (subset && subset.length) {  //foreach ==>for
                        for (i = -1; item = subset[++i];) {
                            stack.push(context.cache[item]);
                        }
                    }
                }
                for (i = -1; item = stack[++i];) {
                    context.remove(item.self);
                    this.add(item.parent, item.self);
                }


            },
            updateChildren: function (pID, children) {
                this.cache[pID] && children && (this.cache[pID].children = children);
            },
            remove: function (id) {
                var chainReplacementTemp = '(?:,"_widgetID_":{[^}]+})|(?:"_widgetID_":{[^}]+},)|(?:"_widgetID_",)|(?:"_widgetID_")|(?:,"_widgetID_")|(?:,"[^"]+":{"parent":"_widgetID_"[^}]+})|(?:"[^"]+":{"parent":"_widgetID_"[^}]+},)';

                this.cache = JSON.parse(JSON.stringify(this.cache).replace(new RegExp(chainReplacementTemp.replace(/_widgetID_/g, id), 'gi'), ''));

            },
            destroy: function () {
                var item;
                for (item in this.cache) {
                    delete this.cache[item];
                }
            }
        };

        return Chain;
    });
})();



