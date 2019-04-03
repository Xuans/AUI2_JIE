define(['jquery', 'widget', 'template', 'apiApp'], function ($, $AW, artTemplate, app) {
    var CodeCheck = function () {
        this.errorList = [];
        this.showErrorDetailModalLock = false;
        this.content = {};

        this.$body = $('body');

        this.init();

        this.listen();

    };


    CodeCheck.prototype = {
        constructor: CodeCheck,

        hasLoadTemplate: false,

        constant: {
            //模板
            TEMPLATE_PATH: 'text!./config/Module.CodeCheck.html',
            TEMPLATE_SELECTOR: 'Module_CodeCheck',

            //按钮
            BTN_SELECTOR: '#auiNavCodeCheckBtn',

            //计数器
            COUNTER: '<span style="position: absolute;font-size: .7em;background: _color_;display: block;height: 1em;width: 1em;border-radius: 1em;color: white;line-height: 1;text-align: center;border: 1px solid _color_;top: 0;margin-left: .9em;">_length_</span>',


            //占位符
            PAGE_CONTEXT: '$el',
            WIDGET_CONTEXT: 'this.$view'
        },
        MESSAGE: {
            EQUAL_ILLEGAL: '请使用 === 和 !==，这样可以避免转换，出现潜在的风险。',
            LOSE_CONTEXT: '在 AWEB SPA 中，为了避免在多个页面中存在相同的选择器，建议加上页面上下文 "$el" 和 组件ID选择器(在组件中是 this.$view)。',

            HTML_WARNING_REGEXP: /([\$\w]+).html\(([^\)]+)\)/,
            HTML_WARNING_REPLACEMENT: '不推荐使用 jQuery 的 .html 接口，建议改为 $1.empty().append($2)，避免内存泄露',

            CONSTRUCTOR_ILLEGAL: '对象和数组使用直接量，不要用构造器方法定义。',


            TITLE_REDUNDANCY: '推荐使用 AWEB API "app.title"。',
            UA_REDUNDANCY: '推荐使用 AWEB API "app.getUA"。'
        },

        WIDGET_EDITOR: {
            widgetCreator: true
        },

        STYLE: {
            NORMAL: 'aui aui-daima alert-info',
            WARNING: 'aui aui-round_warming alert-warning',
            ERROR: 'aui aui-alert alert-error'
        },
        RANGE: {
            ERROR: 0,
            WARNING: 9
        },
        LEVEL: {
            NORMAL: 'alert-info',
            WARNING: 'alert-warning',
            DANGER: 'alert-danger'
        },


        init: function () {
            var context = this,
                PREVIEW_CODE_STATUS,
                analysisDelayHandler = function () {
                    delete context.errorList;

                    context.errorList = context.analysisCode(context.js);

                    context.render();
                };

            if (auiApp.mode in context.WIDGET_EDITOR) {
                $AW.on($AW._STATUS.WIDGET_CODE, function (type, js) {
                    context.js = js;

                    app.performance.longDelay(analysisDelayHandler);
                });
                this.$CONTEXT = this.constant.WIDGET_CONTEXT;
            } else {
                PREVIEW_CODE_STATUS = $AW._STATUS.PREVIEW_FRAME.PREVIEW_CODE + '.codeCheck';
                $AW.off(PREVIEW_CODE_STATUS)
                    .on(PREVIEW_CODE_STATUS, function (type, content) {
                        context.js = content.js;

                        app.performance.longDelay(analysisDelayHandler);
                    });
                this.$CONTEXT = this.constant.PAGE_CONTEXT;
            }


            //FIXME 底部导航栏应该释放按钮添加接口
        },

        listen: function () {
            var context = this;

            context.$body.on('click.codeCheck', context.constant.BTN_SELECTOR, function (e) {

                if (!context.$btn || !context.$btn.length) {
                    context.$btn = $(e.target);
                }

                context.showErrorDetail();
            });
        },

        render: function () {
            var context = this,
                length = context.errorList.length,
                classes,
                $icon;

            if (!context.$btn || !context.$btn.length) {
                context.$btn = $(context.constant.BTN_SELECTOR);
            }

            if (length > context.RANGE.ERROR) {
                classes = context.STYLE.ERROR;
            } else if (length > context.RANGE.WARNING) {
                classes = context.STYLE.WARNING;
            } else {
                classes = context.STYLE.INFO;
            }

            $icon = context.$btn.is('i') ? context.$btn : context.$btn.children();

            $icon
                .attr('class', classes)
                .empty()
                .append(context.constant.COUNTER.replace(/_length_/, length > 10 ? '9+' : length).replace(/_color_/g, $icon.css('color')));

            context = null;
            length = null;
            classes = null;
            $icon = null;


        },

        analysisCode: function (js, level) {
            var MESSAGE = this.MESSAGE,
                LEVEL = this.LEVEL,
                lines,
                line, cursor,
                errorList = [],

                match, i, item,
                errorMsg,


                subMatch;

            lines = js && js.replace(/'<'/g, '&lt;').replace(/>/, '&gt;').split('\n') || [];

            cursor = -1;

            while (line = lines[++cursor]) {

                //===  !==
                if (/[^=!](?:==|!=)(?!=)/.test(line)) {
                    errorList.push({
                        line: cursor,
                        errorMsg: MESSAGE.EQUAL_ILLEGAL,
                        code: line.replace(/([^=|!])(==|!=)(?!=)/g, '$1<em>$2</em>'),
                        type: LEVEL.WARNING
                    });
                }

                //$('#…',$el)
                match = line.match(/\$(\([^\)]+\))/g);
                if (match && match.length) {
                    i = -1;
                    errorMsg = [];
                    while (item = match[++i]) {
                        if (item.indexOf('$("#') !== -1 && item.indexOf('$("body")') === -1) {
                            errorMsg.push('"' + item + '"建议改为："' + item.replace(/"\)/, '",_context_)') + '"');
                        } else if (item.indexOf("$('#") !== -1 && item.indexOf("$('body')") === -1) {
                            errorMsg.push("'" + item + "'建议改为：'" + item.replace(/'\)/, "',_context_)") + "'");
                        } else if (item.indexOf('$("body")') !== -1 || item.indexOf("$('body')") !== -1 || item.indexOf('$(window)') !== -1 || item.indexOf('$(document)') !== -1) {
                            //body 、 document 、 window
                            errorMsg.push('"' + item + '"建议尽量少用，针对可复用代码可以封装成应用接口或将其使用变量缓存起来');
                        }
                    }

                    if (errorMsg.length) {
                        errorList.push({
                            line: cursor,
                            errorMsg: MESSAGE.LOSE_CONTEXT + '<br/>' + errorMsg.join('；<br/>').replace(/_context_/g, this.$CONTEXT) + '。',
                            code: line.replace(/(\$\([^\)]+\))/g, '<em>$1</em>'),
                            type: LEVEL.DANGER
                        });
                    }
                }

                //.append、prepend、css、attr、prop、html、text
                //match=line.match(/$()/)
                match = line.match(/[\$\w]+.html\([^\)]+\)/g);
                if (match && match.length) {
                    i = -1;
                    errorMsg = [];
                    while (item = match[++i]) {
                        errorMsg.push(item.replace(MESSAGE.HTML_WARNING_REGEXP, MESSAGE.HTML_WARNING_REPLACEMENT));
                    }

                    if (errorMsg.length) {
                        errorList.push({
                            line: cursor,
                            errorMsg: errorMsg.join(';<br/>'),
                            code: line.replace(/([\$\w]+.html\([^\)]+\))/g, '<em>$1</em>'),
                            type: LEVEL.WARNING
                        });
                    }
                }

                //.css()、多个css合并

                //.off().on() & namespace
                // $(document)、$(window)、$('body')
                match = line.match(/[\$\w]+.on\([^\)]+\)/g);
                if (match && match.length) {
                    i = -1;
                    errorMsg = [];
                    while (item = match[++i]) {
                        errorMsg.push(item.replace(MESSAGE.HTML_WARNING_REGEXP, MESSAGE.HTML_WARNING_REPLACEMENT));
                    }

                    if (errorMsg.length) {
                        errorList.push({
                            line: cursor,
                            errorMsg: errorMsg.join(';<br/>'),
                            code: line.replace(/([\$\w]+.html\([^\)]+\))/g, '<em>$1</em>'),
                            type: LEVEL.WARNING
                        });
                    }
                }


                //.trigger + namespace

                //.html()，改用text（）或append（）
                //innerHTML

                //window-->pageParams、globalParams、scope  或app.getData、app.setData

                //setTimeout、setInterval--->改用handler.setTimeout或app.performance.shortDelay、longDelay


                //new Array 、 new Number、new String、RegExp、Object、Funciton
                match = line.match(/new\s{1,}(?:Array|Number|String|RegExp|Object|Function)/g);
                if (match && match.length) {
                    i = -1;
                    errorMsg = [];
                    while (item = match[++i]) {

                        switch (item.replace(/new\s+/, '')) {
                            case 'Array':
                                errorMsg.push('"' + item + '"建议改为："[]"');
                                break;
                            case 'Number':
                                errorMsg.push('"' + item + '"建议改为：直接写数字即可');
                                break;
                            case 'String':
                                errorMsg.push('"' + item + '"建议改为：直接写字符串即可');
                                break;
                            case 'RegExp':
                                errorMsg.push('"' + item + '"建议改为：/正则表达式/');
                                break;
                            case 'Object':
                                errorMsg.push('"' + item + '"建议改为：{}');
                                break;
                            case 'Function':
                                errorMsg.push('"' + item + '"建议改为：function(){}');
                        }
                    }

                    errorList.push({
                        line: cursor,
                        errorMsg: MESSAGE.CONSTRUCTOR_ILLEGAL + '<br/>' + errorMsg.join(';<br/>') + '。',
                        code: line.replace(/(new\s(?:Array|Number|String|RegExp|Object|Function))/g, '<em>$1</em>'),
                        type: LEVEL.NORMAL
                    });
                }


                //document.getE

                //document.addListener

                //document.body.offsetWidth


                // document.title 使用app.title
                if (line.match(/document\.title/) !== null) {
                    errorList.push({
                        line: cursor,
                        errorMsg: MESSAGE.TITLE_REDUNDANCY,
                        code: line.replace(/(document\.title)/g, '<em>$1</em>'),
                        type: LEVEL.NORMAL
                    });
                }

                //navigator.userAgent  使用getUA
                if (line.match(/navigator\.userAgent/) !== null) {
                    errorList.push({
                        line: cursor,
                        errorMsg: MESSAGE.UA_REDUNDANCY,
                        code: line.replace(/(navigator\.userAgent)/g, '<em>$1</em>'),
                        type: LEVEL.NORMAL
                    });
                }

                //多个return


                //多个var


                //for in 循环 hasOwnProperty


                // 开头定义function

                // 使用eval


                //vvv["dsd"] = 改用点阵


                //[''][''] 二维数组直接访问校验

                // 未结尾的逗号 ,
            }


            lines = null;
            line = null;
            cursor = null;
            match = null;
            i = null;
            item = null;
            errorMsg = null;
            subMatch = null;

            return errorList;
        },

        showErrorDetail: function () {
            var context = this;

            if (!context.showErrorDetailModalLock) {

                if (!context.hasLoadTemplate) {
                    require([context.constant.TEMPLATE_PATH], function (template) {
                        context.hasLoadTemplate = true;
                        context.$body.append(template);
                        context.showErrorDetail();
                    });
                } else {
                    context.showErrorDetailModalLock = true;

                    app.popover({
                        $elem: context.$btn,
                        focusable:false,
                        title: "代码检查",
                        content: artTemplate(context.constant.TEMPLATE_SELECTOR, {line: context.errorList}),
                        hasHeader: false,
                        confirmHandler: function () {
                            context.showErrorDetailModalLock = false;
                        },
                        args: [],
                        height: "80%",
                        width: "80%",
                        placement: "auto",
                        focusable: false
                    });
                }
            }
        },

        /*
         *   list=[{
         *       line:1234,
         *       msg:'测试',
         *       type:'error|warning',
         *   }]
         *
         *
         *   level===
         *       component   组件级别
         *       api         接口级别
         *       page        页面级别
         * */
        analysis: function (js, level) {
            return this.analysisCode(js, level);
        }
    };


    //FIXME 在逻辑概览菜单栏，调用预览代码时，代用analysis接口，返回错误信息列表，在vscodeEditor中对应行号报错标红并用hover显示errorMsg


    return new CodeCheck();
});