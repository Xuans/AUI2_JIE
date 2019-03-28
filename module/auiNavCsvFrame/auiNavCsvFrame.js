define(["jquery", "const"], function ($, CONST) {
    var CSV_CONST = CONST.PAGE.NAV_CSV_FRAME,
        CSV_STATUS = $AW._STATUS.NAV_CSV_FRAME,
        status = CSV_STATUS.FRESH + '.' + CSV_CONST.NAME_SPACE,
        CsvEditor = function () {
            this.editor = window.A.vscode.create(
                $(CSV_CONST.CSV_EDITOR_SELECTOR),
                {
                    value: '',
                    readOnly: true,
                    // language: 'text'
                });
            this.setValue();
        };

    CsvEditor.prototype = {
        constructor: CsvEditor,
        setValue: function () {
            var context = this,
                ret = window.A.getSql(),
                line = [];

            try {
                //title
                line.push(ret.match(/\(([^\)]+)\)/)[1].replace(/['`]/g, '"'));

                //content
                ret.replace(/Values \(([^\)]+)\);/ig, function (match) {
                    line.push(match.replace(/['`]/g, '"').replace(/Values\s{1,}\(/i, '').replace(/\);/, ''));
                    return '';
                });
            } catch (e) {

            }

            context.editor.setValue(
                line
                //使用标准换位符
                    .join('\r\n')
                    //替换逗号 ， 之间的空格，避免导入失败
                    .replace(/(\s+,)|(,\s+)|(\s+,\s+)/g, ','));
        }
    };
    return {
        load: function ($el, handler) {
            var csvEditorIns = new CsvEditor();

            $AW.off(status)
                .on(status, function (type) {
                    csvEditorIns.setValue();
                })
        },
        unload: function ($el, handler) {
            $AW.off(status)
        },
        pause: function ($el, handler) {

        },
        resume: function ($el, handler) {

        }
    };
});