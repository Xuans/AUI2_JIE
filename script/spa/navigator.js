/**
 *
 * @param {[undefined]}
 *            undefined [确保undefined未被重定义]
 * @author zhanghaixian@agree.com
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", 'template', 'index', 'const', 'layout', 'Model.Data', 'uglifyjs'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, template, AUI, CONST, Layout, dataModel) {
        "use strict";

        var NAV_CONST = {
                RUN_SQL_SELECTOR: '#auiNavTerminalBtn',
                VARIABLE_PREFIX: 'MEN_',
                TREE_ITEM: ['id', 'pid', 'name', 'value', 'state', 'remark', 'seq', 'icon', 'lang', 'type'],
                DEFAULT_SQL_VALUE: "('000000', 'TOP', '', NULL, '2', NULL, '19', 'fa-key', 'zh_CN', 'LEFT')"
            },
            pageFlowValueKey = {},
            pageFlowKeyValue = {},

            turnToSqls = function (menuData, pid, tableName, type, lang, sqls, strKey) {
                var index, item, context = this,
                    seed = [{
                        menuData: menuData,
                        pid: pid
                    }], cursor = -1, seedItem;


                while (seedItem = seed[++cursor]) {
                    for (index = -1; item = seedItem.menuData[++index];) {
                        var values = [], idx, value, strValues, sql, id, insertFlag = true;

                        if (item.isParent && item['value']) {
                            item['value'] = "";
                        }
                        for (idx = -1; value = NAV_CONST.TREE_ITEM[++idx];) {
                            switch (value) {
                                case 'type':
                                    item[value] = type;
                                    break;
                                case'lang':
                                    item[value] = lang;
                                    break;
                                case 'id':
                                    id = item[value];
                                    if (id === '') {
                                        insertFlag = false;
                                    }
                                    break;
                                case 'pid':
                                    if (item[value] === '') {
                                        item[value] = '000000';
                                    }
                                    item[value] = seedItem.pid;
                                    break;
                                case 'seq':
                                    item[value] = index;
                                    break;
                                case 'value':

                                    item[value] = pageFlowKeyValue[item[value]] || item[value];
                                default:
                                    //       item[value] = 'test';
                                    break;
                            }

                            if (typeof item[value] === 'undefined') {
                                values.push("''");
                            } else {
                                //需要trim掉空格，避免字段过长
                                values.push("'" + $.trim(item[value]) + "'");
                            }

                        }
                        strValues = values.join(',');
                        sql = "INSERT INTO `" + tableName + "` (" + strKey + ") VALUES (" + strValues + ");";

                        if (insertFlag) {
                            sqls.push(sql);
                        }

                        if (item.children) {
                            seed.push({
                                menuData: item.children,
                                pid: id,
                            })
                            // context.turnToSqls(item.children, id, tableName, type, lang, sqls, strKey);
                        }

                    }
                }

            },
            getSql = function () {
                var menuData = getTransformedMenuData(),
                    addPreTreeItem = [],
                    sqls = [],
                    i, value, strKey, menuArray;

                for (i = -1; value = NAV_CONST.TREE_ITEM[++i];) {
                    addPreTreeItem.push("`" + NAV_CONST.VARIABLE_PREFIX + value.toString() + "`");
                }


                strKey = addPreTreeItem.join(',').toUpperCase();


                sqls.push("INSERT INTO `" + menuData.tableName + "` (" + strKey + ") VALUES " + NAV_CONST.DEFAULT_SQL_VALUE + ";");
                for (i = -1; value = menuData.menus[++i];) {
                    menuArray = [];
                    menuArray.push(value.menu);
                    turnToSqls(menuArray, '', menuData.tableName, value.type, value.lang, sqls, strKey);
                }

                return sqls.join('\n');
            },

            sqlToArray = function (sql) {
                if (sql) {
                    var items = sql.replace(new RegExp(NAV_CONST.VARIABLE_PREFIX, 'gi'), '').replace(/['`]/g, '').split(';'),
                        ret = [];
                    items.map(function (item) {
                        var groups = item.match(/\([^\)]+\)/g),
                            keys, values,
                            map = {},
                            i, key;
                        if (groups && groups.length === 2) {
                            keys = groups[0];
                            keys = keys.substr(1, keys.length - 2).replace(/['||`]/g, '').split(',');

                            values = groups[1];
                            values = values.substr(1, values.length - 2).replace(/['||`]/g, '').split(',');

                            keys.map(function (key, index) {
                                key = $.trim(key.toLowerCase());
                                map[key] = $.trim(values[index]);
                            });

                            ret.push(map);
                        }

                        return item;
                    });
                    $.each(ret, function (index, item) {
                        if (item.value && item.value !== 'null') {
                            item.value = pageFlowValueKey[item.value];
                            item.isParent = false;
                        }
                    });

                    return ret
                }

            },



            getTransformedMenuData = function () {
                var result = {
                        tableName: '',
                        menus: []
                    }, data,
                    navMenu = dataModel.get('navMenu');


                result.tableName = (navMenu && navMenu.tableName);

                data = JSON.parse(JSON.stringify(dataModel.get('structure')().get() || []));
                $.each(data, function (index, value) {
                    result.menus.push(value.option);
                });
                return result;
            };


        AUI.getTransformedMenuData = getTransformedMenuData;
        AUI.getSql = getSql;
        AUI.sqlToArray=sqlToArray;
        AUI.reset = function () {

            external.saveConfigure({}, function (response) {
            });

            document.location.reload(true);

        };

        AUI.save = function () {

            var data = getTransformedMenuData();

            data.eventAccumulator = dataModel.get('eventAccumulator');

            external.saveConfigure(data, function (response) {
                if (response) {
                    app.alert('保存菜单成功', app.alert.SUCCESS);
                }
            });
            app.alert('保存菜单成功', app.alert.SUCCESS);

        };

        var navigator = {
            init: function () {

                AUI.getPageConfig(function () {
                    navigator.ui();

                    AUI.initLayout();
                    external.getConfigure(function (data) {

                        external.getPageFlowStructure(function (pageFlow) {
                            var i, value, key, layoutDeps,
                                auiNavConfigureFrame = app.router.page.auiNavConfigureFrame,
                                callback = function () {
                                    if (window.aweb && window.aweb.deps) {
                                        // layoutDeps =  window.aweb.deps.css;
                                        //
                                        //
                                        // AUI.dependence({
                                        //     css: layoutDeps
                                        // }, function () {
                                        // });
                                    }
                                    dataModel.set("eventAccumulator", (data && data.eventAccumulator) || 0);

                                    dataModel.set('navMenu', data || {tableName:CONST.PAGE.NAV_CONFIGURE_FRAME.DEFAULT_MENU});

                                    auiNavConfigureFrame && auiNavConfigureFrame.done(function () {
                                        $AW.trigger($AW._STATUS.NAV_CONFIGURE_FRAME.LOAD);
                                    })
                                    //   resumeMenu(data);

                                };

                            dataModel.set("pageFlow", pageFlow);

                            for (i = -1; value = pageFlow[++i];) {
                                pageFlowKeyValue[value.path] = value.deployPath && value.deployPath || '';
                                if (value.deployPath) {
                                    key = value.deployPath.toString();
                                    pageFlowValueKey[key] = value.path;
                                }
                            }

                          //  dataModel.set("pageFlowKeyValue", pageFlowKeyValue);


                            AUI.hideWelcomeScreen(function () {
                                callback();
                            });
                        });
                    });
                });

            },
            ui: function () {



                //运行生成sql代码
                $(NAV_CONST.RUN_SQL_SELECTOR).click(function () {
                    $AW.trigger($AW._STATUS.NAV_SQL_FRAME.FRESH);
                    $AW.trigger($AW._STATUS.NAV_JSON_FRAME.FRESH);
                    $AW.trigger($AW._STATUS.NAV_CSV_FRAME.FRESH);
                });

                //反编译生成菜单配置

            }
        };

        return navigator;
    });
})();