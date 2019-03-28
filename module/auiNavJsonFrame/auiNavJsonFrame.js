define(["jquery", "const"], function ($, CONST) {
    var JSON_CONST = CONST.PAGE.NAV_JSON_FRAME,
        JSON_STATUS=$AW._STATUS.NAV_JSON_FRAME,
        status=JSON_STATUS.FRESH+'.'+JSON_CONST.NAME_SPACE,
        JsonEditor = function () {
            this.editor = window.A.vscode.create(
                $(JSON_CONST.JSON_EDITOR_SELECTOR),
                {
                    value: '',
                    readOnly: true,
                    language: 'javascript'
                });
            this.setValue();
        };
    JsonEditor.prototype = {
        constructor: 'JsonEditor',
        setValue: function () {
            var context = this,
                data = window.A.sqlToArray(window.A.getSql()),
                treeMap = {}, treeMapCopy = {}, i, l;
            if (data && data.length > 1) {
                treeMap[data[1].type] = [{id: "", pid: "000000"}];
                treeMap[data[1].type].push(data[1]);

                for (i = 2, l = data.length; i < l; i++) { //按type 分类形成 n 棵树 一一对应存在treeMap中
                    if (typeof treeMap[data[i].type] === 'undefined') {
                        treeMap[data[i].type] = [{id: "", pid: "000000"}];
                    }
                    treeMap[data[i].type].push(data[i]);
                }

                treeMapCopy = $.extend(true, {}, treeMap);
                for (i in treeMapCopy) {
                    treeMapCopy[i].splice(0, 1);
                }
                //同步json
                context.editor.setValue(window.A.getParsedString(UglifyJS.parse('(' + JSON.stringify(treeMapCopy) + ')')));
            }
        }
    };

    return {
        load: function ($el, handler) {
            var jsonEditorIns=new JsonEditor();

            $AW.off(status)
                .on(status,function (type) {
                    jsonEditorIns.setValue();
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