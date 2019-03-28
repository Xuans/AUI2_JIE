define(["jquery", "const"], function ($, CONST) {
    var SQL_CONST = CONST.PAGE.NAV_SQL_FRAME,
        SQL_STATUS = $AW._STATUS.NAV_SQL_FRAME,
        status = SQL_STATUS.FRESH + '.' + SQL_CONST.NAME_SPACE,
        SQL = function ($el, dataModel) {
            this.$el = $el;
            this.dataModel = dataModel;
            this.init();
            this.listener();
        };

    SQL.prototype = {
        constructor: 'SQL',
        init: function () {
            this.editor = window.A.vscode.create(
                $(SQL_CONST.SQL_EDITOR_SELECTOR),
                {
                    value: '',
                    readOnly: false,
                    language: 'sql'
                });

            this.success();

        },
        setValue: function () {
            this.editor.setValue(window.A.getSql());
        },
        success: function () {
            var context = this;
            context.editor.layout();
            context.setValue();
        },
        turnTree: function (data) {

            var DEFAULT_TYPE = 'left_catalog',
                treeMap = {}, treeMapCopy, i, len, menu_type, menuData = [],
                type, lang, menu, typeName,
                sortBy = function (a, b) {
                    var ret, aItem = a, bItem = b;
                    ret = parseInt(aItem.seq, 10) - parseInt(bItem.seq, 10);
                    return ret;
                },
                fa = function (parentid) {
                    var _array = [];
                    type = treeMap[i][1].type;
                    lang = treeMap[i][1].lang;
                    typeName = treeMap[i][1].typeName;
                    $.each(treeMap[i], function (index, item) {
                        if (item.pid === parentid) {
                            item.children = fa(item.id);
                            _array.push(item);
                        }
                    });
                    return _array;
                };

            if (data && data.length) {
                if (data[1]) {
                    menu_type = data[1].type || DEFAULT_TYPE;
                    treeMap[menu_type] = [{id: "", pid: "000000"}];
                    treeMap[menu_type].push(data[1]);
                }


                for (i = 2, len = data.length; i < len; i++) { //按type 分类形成 n 棵树 一一对应存在treeMap中
                    menu_type = data[i].type || DEFAULT_TYPE;
                    if (typeof treeMap[menu_type] === 'undefined') {
                        treeMap[menu_type] = [{id: "", pid: "000000"}];
                    }
                    treeMap[menu_type].push(data[i]);
                }
                treeMapCopy = $.extend(true, {}, treeMap);
                for (i in treeMapCopy) {
                    treeMapCopy[i].splice(0, 1);
                }
                /*   //同步json

                 jsonEditor.setValue(UglifyJS.parse('(' + JSON.stringify(treeMapCopy) + ')').print_to_string({
                 beautify: true,
                 comments: true
                 }));

                 */
                //扁平化 数组转树形结构数组

                for (i in treeMap) {

                    treeMap[i].sort(sortBy);

                    menu = fa('000000');

                    menuData.push({type: type, lang: lang, typeName: typeName, menu: menu[0]});
                }


            }
            return menuData;
        },
        listener: function () {
            var context = this;
            $(CONST.PAGE.NAV.RETURN_SQL_SELECTOR)
                .off('.SQL')
                .on('click.SQL', function (e) {
                    var sqlString = context.editor.getValue(),
                        tableName,
                        sqlArray, menuDatas, menuData;

                    if (sqlString) {
                        tableName = sqlString.match(/INTO (\S*) \(/i)[1].replace(/'/g, '').replace(/`/g, '');
                        sqlArray = window.A.sqlToArray(sqlString);

                        menuDatas = context.turnTree(sqlArray);

                        $AW.trigger($AW._STATUS.NAV_CONFIGURE_FRAME.CLEAR);


                        context.dataModel.set('navMenu', {
                            tableName: tableName,
                            menus: menuDatas
                        });

                        $AW.trigger($AW._STATUS.NAV_CONFIGURE_FRAME.LOAD);

                    }

                })
        }
    };
    return {
        load: function ($el, handler) {
            var sqlIns = new SQL($el, handler.dataModel);

            $AW.off(status)
                .on(status, function () {
                    sqlIns.setValue();
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