define(["jquery", "const", "template"], function ($, CONST, template) {
    var MENE_TREE_CONST = CONST.PAGE.NAV_MENU_TREE_FRAME,
        MENE_TREE_STATUS = $AW._STATUS.NAV_MENU_TREE_FRAME,
        status = MENE_TREE_STATUS.FRESH + '.' + MENE_TREE_CONST.NAME_SPACE,
        searchTree = function ($input, $ctn) {
            return searchTree.fn.init($input, $ctn);
        };


    searchTree.fn = searchTree.prototype = {
        constructor: searchTree,

        init: function ($input, $ctn) {
            this.$input = $input;
            this.$ctn = $ctn;


            this.$input.on({
                'keyup.tree': function () {
                    var str = this.value;

                    var nodes = $ctn.find('.aui-search-tree-node'),
                        len = nodes.length,
                        node,
                        $showNodes = $(),
                        $hideNodes = $();

                    while (node = nodes[--len]) {
                        (~node.textContent.trim().indexOf(str) ? $showNodes : $hideNodes).push(node);
                    }

                    $hideNodes.hide();
                    $showNodes.show();
                    //父级显示
                    $showNodes.parents('ul').prev('.aui-search-tree-node').show();
                    //子集显示
                    $('.aui-search-tree-node', $showNodes.next()).show();
                }
            });


            return this;
        },

        refresh: function (data) {

            this.$ctn.empty().append(template('tree_menu', {
                children: data
            }));
        }
    };

    searchTree.fn.init.prototype = searchTree.fn;

    return {
        load: function ($el, handler) {
            var refreshTreeMenu = function (widgetID) {
                var treeData = $AW(widgetID).option(),
                    menu = treeData.menu && !$.isEmptyObject(treeData.menu) ? treeData.menu : {
                        id: '',
                        name: ''
                    },
                    $menuUl = $(MENE_TREE_CONST.RIGHT_CONTENT_SELECTOR),
                    $menuSearch = $(MENE_TREE_CONST.TREE_MENU_SEARCH);
                //console.log(menu);
                searchTree($menuSearch, $menuUl).refresh([
                    menu
                ]);
            };

            $AW.off(status)
                .on(status, function (type, widgetID) {
                    if (widgetID) {
                        refreshTreeMenu(widgetID);
                    }
                })
        },
        unload: function ($el, handler) {
            $AW.off(status);
        },
        pause: function ($el, handler) {

        },
        resume: function ($el, handler) {

        }
    };
});