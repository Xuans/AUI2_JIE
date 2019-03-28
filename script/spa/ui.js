/*!
 * Javascript library v3.0
 *
 * Date: 2015.07.30
 */

/**
 * [导航栏]
 *
 * @param {[undefined]} undefined [undefined]
 * @author lijiancheng@cfischina.com
 */
(/* <global> */ function (undefined) {

    (function (factory) {
        "use strict";
        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", 'index', 'const', 'template', 'base', 'css', 'Model.Data', 'uglifyjs',], factory);
        }
        // global
        else {
            factory();

        }
    })(function ($, AUI, CONST, artTemplate, base, cssUtil, dataModel) {
        "use strict";

        /*变量定义*/
        var
            NAV_CONST = CONST.PAGE.NAV,

            STATUS = $AW.STATUS,
            PARAMS_TYPE = CONST.PARAMS_TYPE,
            widgetStatusList = [STATUS.WIDGET_INIT, STATUS.WIDGET_APPEND, STATUS.WIDGET_DELETE],

            $body = $('body'),
            $nav = $(NAV_CONST.CTN, $body),

            //lost focusa
            lostFocus = function () {
                // $menuSearchInput.focus().trigger('blur.ui');
            },
            //组件内部接口
            outerEventHandleApi = function () {

                var PAGE_TYPE = CONST.WIDGET.PAGE_TYPE,
                    structure,
                    widgetList = [],
                    widgetList2 = [],
                    apiMap = {},
                    items, item, i, len,
                    subList = [];

                structure = dataModel.removeRedundancy(true);

                /*code block module*/
                //api
                dataModel.get('widget')({
                    api: {
                        isArray: true
                    }
                }).each(function (widget) {
                    if (widget.api.length) {
                        widgetList.push(widget.type);
                        apiMap[widget.type] = {
                            name: widget.name,
                            api: widget.api
                        };
                    }
                });

                //删除页面组件的接口
                widgetList.map(function (elem) {
                    if (elem !== PAGE_TYPE) {
                        widgetList2.push(elem);
                    }
                });


                dataModel.get('structure')({
                    type: widgetList2
                }).each(function (instance) {
                    var desp,
                        id = instance.widgetID,
                        widgetConfig;

                    widgetConfig = apiMap[instance.type];

                    desp = widgetConfig.name + '"' + instance.attr.widgetName + '"的';


                    for (len = -1, items = widgetConfig.api; item = items[++len];) {
                        subList.push({
                            widgetID: id,
                            type: item.type,
                            code: AUI.transformIntoForeignKey(item.newValue || item.oldValue || item.value, id),
                            desp: desp + item.desp,
                            deps: item.deps,
                            order: item.order,
                            spaLife: item.lifecycle,
                            pageLife: 'init,interval'
                        });
                    }
                });

                dataModel.set('eventHandlerList', subList);
            },
            outerEventHandleApiStatus;

        // String.prototype.firstUpperCase = function(){
        //     return this.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
        //         return $1.toUpperCase() + $2.toLowerCase();
        //     });
        // }

        //tab
        !function ($) {

            "use strict"; // jshint ;_;


            /* TAB CLASS DEFINITION
             * ==================== */

            var Tab = function (element) {
                this.element = $(element)
            };

            Tab.prototype = {

                constructor: Tab,
                show: function () {
                    var $this = this.element
                        , $ul = $this.closest('ul:not(.dropdown-menu)')
                        , selector = $this.attr('data-target')
                        , previous
                        , $target
                        , e;

                    if (!selector) {
                        selector = $this.attr('href');
                        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
                    }

                    if ($this.parent('li').hasClass('active')) return;

                    previous = $ul.find('.active:last a')[0];

                    e = $.Event('show', {
                        relatedTarget: previous
                    });

                    $this.trigger(e);

                    if (e.isDefaultPrevented()) return;

                    /**
                     * lijiancheng@cfischina.com
                     * 修复nav-tabs在id相同的情况下无法正确指向对应容器的bug
                     * */
                    if ($ul.hasClass('nav-tabs')) {
                        $target = $(selector, $ul.parent())
                    } else {
                        $target = $(selector)
                    }

                    this.activate($this.parent('li'), $ul);
                    this.activate($target, $target.parent(), function () {
                        $this.trigger({
                            type: 'shown'
                            , relatedTarget: previous
                        })
                    })
                }

                , activate: function (element, container, callback) {
                    var $active = container.find('> .active')
                        , transition = callback
                        && $.support.transition
                        && $active.hasClass('fade');

                    function next() {
                        $active
                            .removeClass('active')
                            .find('> .dropdown-menu > .active')
                            .removeClass('active');

                        element.addClass('active');

                        if (transition) {
                            element[0].offsetWidth; // reflow for transition
                            element.addClass('in')
                        } else {
                            element.removeClass('fade')
                        }

                        if (element.parent('.dropdown-menu')) {
                            element.closest('li.dropdown').addClass('active')
                        }

                        callback && callback()
                    }

                    transition ?
                        $active.one($.support.transition.end, next) :
                        next();

                    $active.removeClass('in')
                }
            };


            /* TAB PLUGIN DEFINITION
             * ===================== */

            var old = $.fn.tab;

            $.fn.tab = function (option) {

                return this.each(function () {
                    var $this = $(this)
                        , data = $this.data('tab');
                    if (!data) $this.data('tab', (data = new Tab(this)));
                    if (typeof option == 'string') data[option]()
                })
            };

            $.fn.tab.Constructor = Tab;


            /* TAB NO CONFLICT
             * =============== */

            $.fn.tab.noConflict = function () {
                $.fn.tab = old;
                return this
            };


            /* TAB DATA-API
             * ============ */

            $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
                e.preventDefault();
                $(this).tab('show')
            })

        }(window.jQuery);

        !function ($) {

            "use strict"; // jshint ;_;


            /* TOOLTIP PUBLIC CLASS DEFINITION
             * =============================== */

            var Tooltip = function (element, options) {
                this.init('tooltips', element, options)
            };

            Tooltip.prototype = {

                constructor: Tooltip

                ,
                init: function (type, element, options) {
                    var eventIn, eventOut, triggers, trigger, i;

                    this.type = type;
                    this.$element = $(element);
                    this.options = this.getOptions(options);
                    this.enabled = true;

                    triggers = this.options.trigger.split(' ');

                    for (i = triggers.length; i--;) {
                        trigger = triggers[i];
                        if (trigger == 'click') {
                            this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
                        } else if (trigger != 'manual') {
                            eventIn = trigger == 'hover' ? 'mouseenter' : 'focus';
                            eventOut = trigger == 'hover' ? 'mouseleave' : 'blur';
                            this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
                            this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
                        }
                    }

                    this.options.selector ?
                        (this._options = $.extend({}, this.options, {
                            trigger: 'manual',
                            selector: ''
                        })) :
                        this.fixTitle();
                    this.setSize();
                }

                ,
                getOptions: function (options) {
                    options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);

                    if (options.delay && typeof options.delay == 'number') {
                        options.delay = {
                            show: options.delay,
                            hide: options.delay
                        }
                    }

                    return options
                }

                ,
                enter: function (e) {
                    var defaults = $.fn[this.type].defaults,
                        options = {},
                        self,
                        option = this._options || this.options,
                        key, value;


                    for (key in option) {
                        if (option.hasOwnProperty(key)) {
                            value = option[key];
                            if (value && defaults[key] != value) options[key] = value;

                        }

                    }
                    // (this._options || this.options) && $.each((this._options || this.options), function (key, value) {
                    //     if (defaults[key] != value) options[key] = value
                    // }, this);

                    self = $(e.currentTarget)[this.type](options).data(this.type);

                    if (!self.options.delay || !self.options.delay.show) return self.show();

                    clearTimeout(this.timeout);
                    self.hoverState = 'in';
                    this.timeout = setTimeout(function () {
                        if (self.hoverState == 'in') self.show()
                    }, self.options.delay.show)
                }

                ,
                leave: function (e) {
                    var self = $(e.currentTarget)[this.type](this._options).data(this.type);

                    if (this.timeout) clearTimeout(this.timeout);
                    if (!self.options.delay || !self.options.delay.hide) return self.hide();

                    self.hoverState = 'out';
                    this.timeout = setTimeout(function () {
                        if (self.hoverState == 'out') self.hide()
                    }, self.options.delay.hide)
                }

                ,
                show: function () {
                    var $tip, pos, actualWidth, actualHeight, placement, tp, e = $.Event('show');

                    if (this.hasContent() && this.enabled) {
                        this.$element.trigger(e);
                        if (e.isDefaultPrevented()) return;
                        $tip = this.tip();
                        this.setContent();

                        if (this.options.animation) {
                            $tip.addClass('fade')
                        }

                        placement = typeof this.options.placement == 'function' ?
                            this.options.placement.call(this, $tip[0], this.$element[0]) :
                            this.options.placement;

                        $tip
                            .detach()
                            .css({
                                top: 0,
                                left: 0,
                                display: 'block'
                            });

                        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);

                        pos = this.getPosition();

                        actualWidth = $tip[0].offsetWidth;
                        actualHeight = $tip[0].offsetHeight;

                        switch (placement) {
                            case 'bottom':
                                tp = {
                                    top: pos.top + pos.height,
                                    left: pos.left + pos.width / 2 - actualWidth / 2
                                };
                                break;
                            case 'top':
                                tp = {
                                    top: pos.top - actualHeight,
                                    left: pos.left + pos.width / 2 - actualWidth / 2
                                };
                                break;
                            case 'left':
                                tp = {
                                    top: pos.top + pos.height / 2 - actualHeight / 2,
                                    left: pos.left - actualWidth
                                };
                                break;
                            case 'right':
                                tp = {
                                    top: pos.top + pos.height / 2 - actualHeight / 2,
                                    left: pos.left + pos.width
                                };
                                break
                        }

                        this.applyPlacement(tp, placement);
                        this.$element.trigger('shown')
                    }
                }

                ,
                applyPlacement: function (offset, placement) {
                    var $tip = this.tip(),
                        width = $tip[0].offsetWidth,
                        height = $tip[0].offsetHeight,
                        actualWidth, actualHeight, delta, replace;

                    $tip
                        .offset(offset)
                        .addClass(placement)
                        .addClass('in');

                    actualWidth = $tip[0].offsetWidth;
                    actualHeight = $tip[0].offsetHeight;

                    if (placement == 'top' && actualHeight != height) {
                        offset.top = offset.top + height - actualHeight;
                        replace = true
                    }

                    if (placement == 'bottom' || placement == 'top') {
                        delta = 0;

                        if (offset.left < 0) {
                            delta = offset.left * -2;
                            offset.left = 0;
                            $tip.offset(offset);
                            actualWidth = $tip[0].offsetWidth;
                            actualHeight = $tip[0].offsetHeight
                        }

                        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
                    } else {
                        this.replaceArrow(actualHeight - height, actualHeight, 'top')
                    }

                    if (replace) $tip.offset(offset)
                }

                ,
                replaceArrow: function (delta, dimension, position) {
                    this
                        .arrow()
                        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
                }

                ,
                setContent: function () {
                    var $tip = this.tip(),
                        title = this.getTitle();

                    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
                    $tip.removeClass('fade in top bottom left right')
                }

                ,
                hide: function () {
                    var that = this,
                        $tip = this.tip(),
                        e = $.Event('hide');

                    this.$element.trigger(e);
                    if (e.isDefaultPrevented()) return;

                    $tip.removeClass('in');

                    function removeWithAnimation() {
                        var timeout = setTimeout(function () {
                            $tip.off($.support.transition.end).detach()
                        }, 500);

                        $tip.one($.support.transition.end, function () {
                            clearTimeout(timeout);
                            $tip.detach()
                        })
                    }

                    $.support.transition && this.$tip.hasClass('fade') ?
                        removeWithAnimation() :
                        $tip.detach();

                    this.$element.trigger('hidden');

                    return this
                }

                ,
                fixTitle: function () {
                    var $e = this.$element;
                    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
                        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
                    }
                }

                ,
                hasContent: function () {
                    return this.getTitle()
                }

                ,
                getPosition: function () {
                    var el = this.$element[0];
                    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
                        width: el.offsetWidth,
                        height: el.offsetHeight
                    }, this.$element.offset())
                }

                ,
                getTitle: function () {
                    var title, $e = this.$element,
                        o = this.options;

                    title = $e.attr('data-original-title') ||
                        (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

                    return title
                },

                //设置小尺寸 tooltip
                setSize: function () {
                    var $tip = this.tip();
                    if (this.options.size === 'small') {
                        $tip.addClass('tooltip-sm');
                    }
                }

                ,
                tip: function () {
                    return this.$tip = this.$tip || $(this.options.template)
                }

                ,
                arrow: function () {
                    return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
                }

                ,
                validate: function () {
                    if (!this.$element[0].parentNode) {
                        this.hide();
                        this.$element = null;
                        this.options = null
                    }
                }

                ,
                enable: function () {
                    this.enabled = true
                }

                ,
                disable: function () {
                    this.enabled = false
                }

                ,
                toggleEnabled: function () {
                    this.enabled = !this.enabled
                }

                ,
                toggle: function (e) {
                    var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this;
                    self.tip().hasClass('in') ? self.hide() : self.show()
                }

                ,
                destroy: function () {
                    this.hide().$element.off('.' + this.type).removeData(this.type)
                }

            };


            /* TOOLTIP PLUGIN DEFINITION
             * ========================= */


            $.fn.tooltips = function (option) {
                return this.each(function () {
                    var $this = $(this),
                        data = $this.data('tooltips'),
                        options = typeof option == 'object' && option;
                    if (!data) $this.data('tooltips', (data = new Tooltip(this, options)));
                    if (typeof option == 'string') data[option]()
                })
            };

            $.fn.tooltips.Constructor = Tooltip;

            $.fn.tooltips.defaults = {
                animation: true,
                placement: 'top',
                selector: false,
                template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                trigger: 'hover focus',
                title: '',
                delay: 0,
                html: false,
                container: false
            };


            /* TOOLTIP NO CONFLICT
             * =================== */

            $.fn.tooltips.noConflict = function () {
                $.fn.tooltips = old;
                return this
            }

        }(window.jQuery);


        AUI.addLanguageSelect = function () {

            var ctnSelector = CONST.PAGE.NAV.CTN,
                id = CONST.PAGE.NAV.TAB_RIGHT_GROUP,
                tempID = CONST.NSL.TEMP_ID,
                TEMP = '<div class="lang-select" id="' + tempID + '"></div>',
                nslLanguage = dataModel.get('nslLanguage'),
                despArray = [], valueArray = [],
                defaultLanguage = $AW.getLanguage(), isDeleted = true,
                langSelectAttr,
                length, i, $ctt;

            $ctt = $(id, ctnSelector);

            $ctt.prepend(TEMP);
            length = nslLanguage.length;

            for (i = 0; i < length; i++) {
                (defaultLanguage === nslLanguage[i].name) && (isDeleted = false);
                despArray.push(nslLanguage[i].desp);
                valueArray.push(nslLanguage[i].name);
            }

            isDeleted && (defaultLanguage = nslLanguage.length ? nslLanguage[0].name : '');
            // langSelect = defaultLanguage;

            langSelectAttr = [{
                name: 'langSelect',
                desp: '国际化语言',
                type: 'string_select',
                readonly: false,
                despArray: despArray,
                valueArray: valueArray,
                defaultValue: defaultLanguage
            }];

            if ($ctt.length) {
                base.baseConfig(tempID, {langSelect: defaultLanguage}, langSelectAttr, function (args) {
                    var newValue = args.newValue;
                    if (newValue) {
                        $AW.setLanguage(newValue, true)
                    }
                });
            }

        };

        AUI.removeLanguageSelect = function () {
            $("#" + CONST.NSL.TEMP_ID, CONST.PAGE.NAV.CTN).remove();
        };

        AUI.blur = lostFocus;

        //animation
        AUI.zoomIn = function ($elem, callback) {
            $elem.removeClass('hide');
            $elem.removeAttr('style');
            callback && callback();
        };
        AUI.zoomOut = function ($elem, callback) {
            $elem.addClass('hide').removeAttr('style');
            callback && callback();
        };

        AUI.hideWelcomeScreen = function (callback) {
            setTimeout(function () {
                $(CONST.HEAD.BODY_HIDDEN_SELECTOR, 'head').remove();
                AUI.zoomOut($(CONST.PAGE.START_SCREEN_SELECTOR));

                callback && callback();
            }, 200);
        };

        //data handler
        AUI.validateInput = function () {
            var setting = {
                TYPE: {
                    /*必须*/
                    require: /^[^$]{1,}$/,
                    /* 整数 */
                    integer: /^-?\d+$/,
                    /* 浮点数 */
                    float: /^(?:-?\d+\.)(?:\d+)?$/,
                    /* 全数字 */
                    number: /^\d+?$/,
                    /* 全字母 */
                    letter: /^[a-zA-Z]+$/,
                    /* 全大写字母 */
                    uppercaseLetter: /^[A-Z]+$/,
                    /* 全小写字母 */
                    lowercaseLetter: /^[a-z]+$/,
                    /* 字母数字下划线，且由字母开头 */
                    account: /^[a-zA-Z]+(?:[a-zA-Z0-9_]+)?$/,
                    /*不能是全数字*/
                    id: /^(?!\d+$)[\da-zA-Z_0-9]*$/,
                    /* 邮箱格式 */
                    email: /^(?:[\w-]+(?:\.[\w-]+)*)@[\w-]+(?:\.[\w-]+)+$/,
                    /* 邮编格式 */
                    zipCode: /^[1-9]\d{5}$/,
                    /* 手机格式 */
                    mobile: /^(?:(?:\(?:\d{2,3}\))|(?:\d{3}\-))?1\d{10}$/,
                    /* 端口格式 */
                    port: /^(?:[0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
                    /* 主机格式*/
                    host: /^(?:(?:(?:2(?:5[0-5]|[0-4][0-9]))|(?:1[0-9]{2})|(?:[1-9][0-9])|[0-9])\.){3}(?:(?:2(?:5[0-5]|[0-4][0-9]))|(?:1[0-9]{2})|(?:[1-9][0-9])|[0-9])$/

                },
                MESSAGE: {
                    id: "请输入正确的id",

                    require: '请输入内容',
                    integer: '请输入整型',
                    float: '请输入浮点数',
                    number: '请输入数字',
                    letter: '请输入字母',
                    uppercaseLetter: '请输入大写字母',
                    lowercaseLetter: '请输入小写字母',
                    account: '请输入正确的账号格式',
                    email: '请输入正确的邮件格式',
                    zipCode: '请输入正确的邮编',
                    mobile: '请输入正确的手机格式',
                    port: '请输入正确的端口格式',
                    host: '请输入正确的主机格式',
                    _default: '请输入正确格式'
                },
                SUCCESS_CALLBACK: function (value) {
                },
                ERROR_CALLBACK: function (value, msg) {
                    app.alert(msg || value, app.alert.ERROR);
                }
            };

            var _type = setting.TYPE,
                _message = setting.MESSAGE,
                _success = setting.SUCCESS_CALLBACK,
                _error = setting.ERROR_CALLBACK;

            var validate = function (value, validateData, successCallback, errorCallback) {
                var exp, result, msg;

                successCallback = $.isFunction(successCallback) ? successCallback : _success;
                errorCallback = $.isFunction(errorCallback) ? errorCallback : _error;

                if (validateData && validateData.type) {
                    try {
                        exp = _type[validateData.type] || new RegExp(validateData.type);
                        msg = msg ? msg : _message[validateData.type];
                        result = $.isFunction(exp) ? exp(value) : exp.test(value);

                    } catch (e) {
                        msg = e.message;

                        result = false;
                    }
                } else {
                    result = true;
                }

                if (result) {
                    successCallback();
                } else {
                    errorCallback(validateData.errorMessage);
                }

                return result;
            };

            return validate;
        }();


        //and template helper
        artTemplate.helper('transformType', function (str) {
            return PARAMS_TYPE[str] || PARAMS_TYPE._default;
        });
        artTemplate.helper('transformThemeTemp', function (template, className, zoom) {
            var artTemplateObj = $(template);
            artTemplateObj.css('zoom', zoom)
                .addClass(className);
            template = artTemplateObj[0].outerHTML;
            return template || '未知类型';
        });


        if (!console.error.version) {
            console.error.version = AUI.awosAppUnitedVersion;

            window.onerror = function (errorMsg, scriptURI, lineNumber, columnNumber, errorObj) {
                var obj, str;

                if (dataModel.getConfigValue('debug') !== false) {


                    //针对dataTable的报错
                    if (errorMsg && !errorMsg.replace && columnNumber) {
                        errorMsg = columnNumber;
                        columnNumber = '';
                    }

                    if (errorObj && (str = errorObj.stack)) {
                        str = str.toString();

                        str = '<div>' + str.replace(/\(([^)]+)\)/g, '<span>$1</span>').replace(/\n/g, '</div><div>').replace(/\<\/?anonymous\>/g, '') + '</div>';

                        errorObj.stack = str;
                    }

                    obj = {
                        errorMsg: errorMsg.replace(/[\n\r]/g, '<br/>'),
                        scriptURI: scriptURI,
                        lineNumber: lineNumber,
                        columnNumber: columnNumber,
                        errorObj: errorObj
                    };

                    app.alert(artTemplate('auiErrorTemp', obj), app.alert.WARNING);
                }
            };

            UglifyJS.parse = (function (parse) {
                return function (str) {
                    var result;
                    try {
                        result = parse.apply(parse, arguments);
                    } catch (e) {

                        e.stack = str + '\n' + e.stack;
                        throw e;
                        window.onerror(e.message, e.filename, e.line, e.post, e);
                    }

                    return result;
                }
            }(UglifyJS.parse));
        }

        if (auiApp.mode !== CONST.MODE.VIRTUALIZER || auiApp.mode !== 'plugins') {
            /*Global*/
            //全局监听
            $(window).on({
                //禁用右键Context Menu
                'contextmenu.auiGlobal': function () {
                    return false;
                },
                'wheel.auiContextMenu': function () {
                    return !AUI.mouseWheelLock;
                },
                'keydown.auiGlobal': function (e) {
                    var key = e.which || window.event.keyCode,
                        $el = $(e.target || event.srcElement),
                        selectedWidget,
                        result = true;

                    e = e || window.event;

                    if (!($el.is(':input:not(button,a)') || $el.attr('contenteditable') || $el.is('body')) && (selectedWidget = $AW(AUI.currentWidgetID)).length && !AUI.overviewLock) {
                        if (e.ctrlKey) {
                            switch (key) {
                                case 67://ctrl+c
                                    //复制组件
                                    selectedWidget && selectedWidget.copy();
                                    result = false;
                                    break;
                                case 68://ctrl+d
                                    if (selectedWidget) {
                                        selectedWidget.close();
                                        selectedWidget = null;
                                    }
                                    result = false;
                                    break;
                                case 86://ctrl+v
                                    //粘贴组件
                                    selectedWidget && selectedWidget.paste();
                                    result = false;
                                    break;
                                case 88://ctrl+x
                                    //剪切组件
                                    selectedWidget && selectedWidget.cut();
                                    selectedWidget = null;
                                    result = false;
                                    break;


                            }
                        } else if (key === 46 && selectedWidget) {//delete
                            selectedWidget.close();
                            selectedWidget = null;
                            result = false;
                        }
                    }


                    if (e.ctrlKey) {
                        switch (key) {

                            case 83://ctrl+s
                                //让页面上的输入框都失去焦点
                                // lostFocus();
                                if (result) {
                                    AUI.save();
                                    result = false;
                                }

                                break;
                        }
                    }

                    return result;
                },

            });

            $body
                .off('.ui')
                .on('click.ui', function (e) {
                    var $target = $(e.target || e.srcElement).closest('[data-role]'),
                        role = $target.attr('data-role'),
                        href, $api, dataCodeId, projectName, widgetId, title, has;


                    switch (role) {
                        case 'auiConfigureDevelopment':
                            href = $target.prev().attr('data-href');
                            if (/^viewer\./.test(href)) {
                                href = 'viewer.app.' + auiApp.io.projectName + 'Viewer';
                            }
                            break;

                        case 'auiOverviewDevelopment':
                            $api = $target.parent();

                            if (dataCodeId = $api.attr('data-code-id')) {
                                if (dataCodeId.indexOf('app.') !== -1) {//应用接口
                                    projectName = auiApp.io.projectName;
                                    href = 'viewer.app.' + projectName + 'Viewer';
                                    has = dataCodeId;

                                } else { //实例接口
                                    widgetId = dataCodeId.split('##')[1].split('_')[0];
                                    href = dataModel.get('structure')({widgetID: widgetId}).first().href;
                                    has = dataCodeId.match(/\.[^(]+/g);
                                }
                            }


                            break;

                        case 'auiMenuDevelopment':
                            href = $target.parent().attr('data-href');
                            title = $target.parent().children('span').text();
                            break;


                    }
                    if (href) {
                        AUI.developmentOpen(href, title, has);
                    }


                });


            /*nav*/
            $nav.off('.uiForAllApp').on('click.uiForAllApp', function (e) {
                var $target = $(e.target || event.srcElement).closest('button'),
                    debug;

                switch ('#' + $target.attr('id')) {

                    //预览
                    case NAV_CONST.PREVIEW_BTN:
                        var MODE = {
                            'false': ['aui aui-dingbuyulan', '预览模式'],
                            'true': ['aui aui-shilipeizhi', '配置模式']
                        };

                        break;
                    case NAV_CONST.HELP_MODE_BTN:
                        debug = dataModel.getConfigValue('debug');
                        dataModel.setConfigValue('debug', debug !== false ? false : true);
                        $target.attr('title', debug !== false ? '开启帮助模式' : '关闭帮助模式');
                        $target.children().attr('class', debug !== false ? 'aui aui-kaiguan-guan' : 'aui aui-kaiguan-kai');

                        AUI.updatePageConfig();

                        //  AUI[!debug?'addLanguageSelect':'removeLanguageSelect']();


                        break;
                    //重置页面布局
                    case NAV_CONST.RESET_LAYOUT_BTN:
                        app.modal({
                            title: '重置AWEB IDE前端编辑器面板布局',
                            content: '<div class="aui-ide-modal-content"><i class="aui aui-round_warming"></i><span class="aui-modal-content-title">确定重置页面布局吗?</span><p>确定后，当前组件编辑器面板布局将回归初始状态，只改变编辑器面板布局，不影响组件的配置区内容和代码区内容。</p></div>',
                            confirmHandler: function () {
                                dataModel.setConfigValue(auiApp.mode, undefined);
                                AUI.updatePageConfig();
                                document.location.reload(true);
                            },
                            isDialog: true,
                            isLargeModal: false
                        });
                        break;
                    //重置
                    case NAV_CONST.RESET_BTN:

                        app.modal({
                            title: '清除内容',
                            content: '<div class="aui-ide-modal-content"><i class="aui aui-danger_fill"></i><span class="aui-modal-content-title">确定清除内容吗？</span><p>确定后，当前组件所有已配置内容将被清空，包括代码区的内容和配置定义里的内容，效果等同于新建组件的初始化状态。</p></div>',
                            confirmHandler: function () {
                                var noClean = {theme: true, navigator: true};
                                if (!noClean[auiApp.mode]) {
                                    cssUtil.cleanCssCode();
                                }

                                AUI.reset && AUI.reset();
                                $AW.trigger($AW._STATUS.SAVE);
                            },
                            isDialog: true,
                            isLargeModal: false
                        });
                        break;
                    //保存
                    case NAV_CONST.SAVE_BTN:

                        AUI.save && AUI.save();
                        break;

                    case NAV_CONST.REFRESH_BTN:
                        document.location.reload(true);
                        break;
                    case NAV_CONST.DEBUG_BTN:
                        // external.openDevTool
                        break;
                }

            });


        }


        outerEventHandleApiStatus = widgetStatusList.join('.outerEventHandleApi,') + '.outerEventHandleApi';

        $AW.off(outerEventHandleApiStatus)
            .on(outerEventHandleApiStatus, function (type, oWidget) {

                switch (type) {


                    case STATUS.WIDGET_INIT:
                    case STATUS.WIDGET_APPEND:
                    case STATUS.WIDGET_DELETE:
                        outerEventHandleApi();

                        break;

                }


            });

        if(auiApp.isNewDir){
            $AW.off($AW._STATUS.PAGE_CODE + '.pageCode')
                .on($AW._STATUS.PAGE_CODE + '.pageCode', function () {
                    if(auiApp.isNewDir)
                        require(['compile'], function (Compile) {
                            var compileIns = new Compile(),
                                data = dataModel.preSave(),
                                result, viewerConfig,
                                mode = auiApp.mode;

                            data.pType = mode;

                            if (mode === CONST.MODE.VIEWER) {
                                viewerConfig = JSON.parse(JSON.stringify(dataModel.get('widget')({pType: 'viewer'}).first()));
                                viewerConfig.frame = data;
                            }

                            result = compileIns.compile(mode === CONST.MODE.VIEWER ? viewerConfig : data, app.getUID());
                            if (result && !result.errorMsg && (result = JSON.parse(result))) {
                                external.compileCode({
                                    js:result.js,
                                    html:result.html
                                },function () {
                                    app.alert('JS,HTML代码已同步到 target ,\n到浏览器刷新页面即可看到效果！', app.alert.SUCCESS);
                                })
                            }else{
                                app.alert(result.errorMsg,app.alert.ERROR);
                            }
                        })
                })
        }


        // $(window).on('beforeunload', function (e) {
        //
        //     if (!!tick) {
        //         return '还没有保存,是否要离开当前页面?';
        //     }
        //
        //     return document.location.reload(true);
        // })


    });
})();