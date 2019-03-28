(function (undefined) {
    (function (factory) {

        if (typeof define === "function" && define.amd) {
            define([], factory);
        } else {
            return factory();

        }
    })
    (function () {
        var app={
            ajax_AgreeBus:function () {
    var _ajax = $.ajax;

    $.ajax = window.auiApp ? function (option) {
        var validateResult,
            queryString = {},
            data = {},
            formData, i, item, items;

        option = $.extend(true, {
            type: "post",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "json",
            traditional: true,
            shelter: false,
            success: function () {
            },
            validate: true,
            validateSuccessCallback: function ($elem) {
                $elem.closest('.control-group').removeClass('danger');
            },
            validateErrorCallback: function ($elem, errMsg) {
                $elem.closest('.control-group').addClass('danger');
            },
            validateCleanCallback: function (foucusEvent) {
                $(this).closest('.control-group').removeClass('danger');
            }
        }, option);

        //get value and validate
        validateResult = app.validate(option.data, option.validateSuccessCallback, option.validateErrorCallback, option.validateCleanCallback, option.validateContinue, option.validate);


        option.data = validateResult.data;

        if ($.isArray(option.data)) {
            for (items = option.data, i = items.length; item = items[--i];) {
                if (item.queryString) {
                    queryString[item.name] = item.value;
                } else {
                    data[item.name] = item.value;
                }
            }

            option.data = data;

            if (!$.isEmptyObject(queryString)) {
                option.url += '?' + $.param(queryString);
            }
        }

        if (option.ajaxProcessData === false) {
            try {
                data = option.data;
                formData = new FormData();

                for (i in data) {
                    if (data.hasOwnProperty(i)) {
                        formData.append(i, data[i]);
                    }
                }

                option.data = formData;
                option.processData = false;
                option.contentType = false;
            } catch (e) {
                if (window.aweb.error) {
                    app.alert('系统错误 0x03：网络请求失败！', app.alert.ERROR, '0x03');
                }
                if (window.aweb.log) {
                    console.error(e);
                }
            }

        } else if (option.contentType.indexOf('application/json') !== -1) {
            option.data = JSON.stringify(option.data);
        }


        //exec ajax

        if (validateResult.result) {
            console && console.log(validateResult.result);
        } else {
            console.table(validateResult.data);
        }

        if (option.ajaxNoBlobData === false) {
            app.alert('模拟下载文件…', app.alert.SUCCESS);
        } else {
            option.success({
                status: true,
                content: {
                    result: 'auiAjaxTest',

                    aaaa: 'success'
                }
            });
        }
    } : function (option) {
        var validateResult, url,
            _complete, _error, _success,

            queryString = {},
            urlExternal = [],
            urlDivider,

            data = {},
            formData,

            i, item, items,
            html,

            $iframe, $form,

            ctoken;


        if (!(option && (url = option.url) && !!~url.indexOf('##'))) {
            option = $.extend(true, {
                type: "post",
                contentType: "application/x-www-form-urlencoded;charset=utf-8",
                dataType: "json",
                traditional: true,
                shelter: false,
                urlDivider: '\/',
                validateSuccessCallback: function ($elem) {
                    $elem.closest('.control-group').removeClass('danger');
                },
                validateErrorCallback: function ($elem, errMsg) {
                    $elem.closest('.control-group').addClass('danger');
                },
                validateCleanCallback: function (foucusEvent) {
                    $(this).closest('.control-group').removeClass('danger');
                }
            }, option);

            urlDivider = option.urlDivider;

            //get value and validate
            validateResult = app.validate(option.data, option.validateSuccessCallback, option.validateErrorCallback, option.validateCleanCallback, option.validateContinue, option.validate);

            if (validateResult.result) {
                option.data = validateResult.data;

                //自定义属性
                //shelter
                option.timeout = $.isNumeric(option.timeout) ? option.timeout : 30000;
                if (option.shelter !== false && option.shelter !== 'false') {
                    app.shelter.show(option.shelter === true ? null : option.shelter, option.timeout);
                }

                //process data
                if ($.isArray(option.data)) {
                    for (items = option.data, i = items.length; item = items[--i];) {
                        if (item.queryString) {
                            queryString[item.name] = item.value;
                        } else if (item.urlExternal) {
                            urlExternal.push(item.value);
                        } else {
                            data[item.name] = item.value;
                        }
                    }
                    option.data = data;
                }

                //添加token
                //添加token
                ctoken = app.getData('ctoken') || window.ctoken;
                if (ctoken) {
                    option.data = (option.data || {});
                    option.data.ctoken = ctoken;
                }

                if (option.ajaxProcessData === false) {
                    try {
                        data = option.data;
                        formData = new FormData();

                        for (i in data) {
                            if (data.hasOwnProperty(i)) {
                                formData.append(i, data[i]);
                            }
                        }

                        option.data = formData;
                        option.processData = false;
                        option.contentType = false;
                    } catch (e) {
                        if (window.aweb.error) {
                            app.alert('系统错误 0x03：请求数据格式有误！', '0x03');
                        }
                        if (window.aweb.log) {
                            console.error(e);
                        }
                    }
                } else if (option.contentType.indexOf('application/json') !== -1) {
                    option.data = JSON.stringify(option.data);
                }


                //deal url
                if (urlExternal.length) {
                    urlExternal = urlDivider + urlExternal.join(urlDivider);
                    if (url[url.length - 1] === '?') {
                        url[url.length - 1] = '\/';
                    }

                    url += urlExternal;
                }

                if (!$.isEmptyObject(queryString)) {
                    url += (url.indexOf('?') !== -1 ? '' : '?') + $.param(queryString);
                }

                option.url = url;


                if (option.ajaxNoBlobData === false) {
                    if (option.ajaxProcessData !== false) {

                        var iframeName = app.getUID();

                        $iframe = $('<iframe src="about:blank" name="' + iframeName + '" style="display: none"/>');
                        $form = $('<form/>');
                        html = [];
                        data = option.data;

                        $form.attr({
                            method: option.type,
                            action: option.url,
                            target: iframeName
                        });

                        for (i in data) {
                            if (data.hasOwnProperty(i)) {
                                if ($.isArray(data[i])) {
                                    for (items = data[i], i = items.length; item = items[--i];) {
                                        html.push('<input  name="' + i + '" value="' + item + '"/>');
                                    }
                                } else {
                                    html.push('<input  name="' + i + '" value="' + data[i] + '"/>');
                                }
                            }
                        }

                        $form.append(html.join(''));
                        $iframe.appendTo('body');
                        $form.appendTo($iframe);

                        $form.submit();


                        $iframe.on('load', function (e) {
                            var response;

                            try {
                                response = e.currentTarget.contentWindow.document.body.innerText;

                                response = JSON.parse(response);
                            } catch (e) {
                                response = {
                                    status: false,
                                    errorMsg: e.message,
                                    content: null
                                };
                            }

                            option.success(response);

                            $iframe && $iframe.remove();
                        });

                        option.shelter && app.shelter.hide();
                    } else {
                        app.alert('系统错误 0x09：不能同时使用传输返回数据文件流！', app.alert.ERROR, '0x09');
                    }

                } else {

                    //success and error
                    //_complete = option.complete;
                    _error = option.error;
                    _success = option.success;

                    option.success = function (response) {
                        var header, body, statusCode, status;


                        option.shelter && app.shelter.hide();

                        if (response) {
                            if (response.status) {
                                if (response.content && (typeof (result = response.content.result) === 'string')) {
                                    header = result.substr(0, 200);
                                    body = result.substr(200);

                                    try {
                                        body = JSON.parse(body);

                                        response.content.result = body;
                                        response.header = header;

                                        statusCode = header.substr(128, 10);
                                        statusCode = $.trim(statusCode || '');

                                        status = response.status &&
                                            statusCode === 'SUCCESS';

                                        response.errorCode = statusCode;

                                    } catch (e) {

                                    } finally {

                                    }
                                }


                                _success(response);
                            } else {
                                switch (response.errorCode) {
                                    case '100001':

                                        if (!window.relogin) {
                                            app.modal({
                                                title: '提示框',
                                                content: "会话超时，请重新登录",
                                                isLargeModal: false,
                                                confirmHandler: function () {
                                                    window.relogin = true;
                                                    window.location.reload();
                                                },
                                                cancelHandler: function () {
                                                    window.relogin = true;
                                                    window.location.reload();
                                                }
                                            });
                                        }

                                        break;
                                    case '100002':
                                        app.alert('系统错误 0x06：' + response.errorMsg || '字段校验失败！', app.alert.ERROR, '0x06');

                                        if (aweb && aweb.error) {
                                            console.log(response.errorMsg);
                                        }
                                        break;
                                    default:
                                        _success(response);
                                }
                            }
                        } else {
                            app.alert('系统错误 0x08：后台服务报错！', app.alert.ERROR, '0x08');
                        }
                    };
                    option.error = function (XMLHttpRequest, textStatus, errorThrown) {
                        var oErr;
                        option.shelter && app.shelter.hide();

                        if (option.ajaxNoBlobData !== false && !option.preventError) {
                            oErr = XMLHttpRequest.response || XMLHttpRequest.responseText;
                            try {
                                oErr = eval('(' + oErr + ')');
                            } catch (e) {
                                oErr = {
                                    errorMsg: e.message
                                }
                            } finally {
                                app.alert('系统错误 0x08：后台服务报错！', app.alert.ERROR, '0x08');
                                _error && _error(XMLHttpRequest, textStatus, errorThrown);

                                console.error(oErr);
                            }
                        }
                    };

                    //exec ajax
                    //exec ajax
                    if (option.noAgreeBusData === false) {
                        option.data = {
                            abusParams: JSON.stringify(option.data)
                        };
                    }
                    return _ajax(option);
                }
            }
        }
    };
    return $.ajax;
},
Controller_AIBS:function () {
    'use strict';
    var View = function (options, controller) {
            var _default = this._default,
                context = this,
                $left, $right,
                $contextMenu,
                $tabCtn,

                queryString, windowId, windowOptions;

            $.extend(true, context, _default, options);

            context.controller = controller;

            context.$ctn = $(context.ctn).addClass('hidden');
            context.$contextMenu = $contextMenu = $(context.contextMenuTemp);
            context.$ctn.prepend($contextMenu);

            context.$tabs = $(context.tabs, context.$ctn);
            context.$left = $left = $(context.leftBtnTemp);
            context.$right = $right = $(context.rightBtnTemp);

            context.$moveBtns = context.$left.add(context.$right);

            context.pagePopInstance = {};

            context.$tabs.wrap(context.tabCtnTemp);


            context.$tabCtn = $tabCtn = context.$tabs.parent();
            $tabCtn.prepend($left);
            $tabCtn.append($right);

            context.$ctt = $(context.ctt, context.$ctn);


            context.$tabs.on({
                'click.view': function (e) {
                    var $target = $(e.target || window.event.srcElement),
                        $item = $target.closest('[data-dom-id]'),
                        domID = $item.attr('data-dom-id');

                    if (domID) {
                        if ($target.attr('data-role') === 'close') {
                            context.close(domID);
                        } else {
                            context.switchView(domID);
                        }


                        return false;
                    }

                }
            });
            if (context.contextMenuOption) {
                context.$tabs.on({
                    'contextmenu.view': function (e) {
                        var $li = $(e.target || event.srcElement).closest('[data-dom-id]'),
                            $tabs = $li.parent(),
                            $contextMenu = context.$contextMenu,

                            contextMenuOption = context.contextMenuOption,
                            contextMenuCallback = context.contextMenuCallback,
                            html = '',
                            lineTemp,
                            index, menuList, menu, length;

                        if ($li.length) {
                            length = $tabs.children().length;
                            lineTemp = contextMenuOption.lineTemp;
                            index = $li.index();

                            if ($li.hasClass('active')) {
                                switch(length){
                                    case 1:
                                        menuList = contextMenuOption.ONLY;
                                        break;

                                    default:
                                        menuList = contextMenuOption.CURRENT;
                                }
                            } else {
                                switch (index) {
                                    case 0:
                                        menuList = contextMenuOption.FIRST;
                                        break;
                                    case length - 1:
                                        menuList = contextMenuOption.LAST;
                                        break;
                                    default:
                                        menuList = contextMenuOption._DEFAULT;
                                }

                            }
                            menuList = ([].concat(menuList)).reverse();

                            for (length = menuList.length;
                                 (menu = contextMenuOption[menuList[--length]]);) {
                                html += lineTemp
                                    .replace('_action_', menu.action)
                                    .replace('_filter_', menu.filter)
                                    .replace('_name_', menu.name);
                            }

                            $contextMenu
                                .empty().append(html.replace(/_index_/g, index))
                                .css(app.position(e, $(window), $contextMenu), -15, 0).removeClass('hide')
                                .off('.viewContextMenu')
                                .one({
                                    'click.viewContextMenu': function (e) {
                                        var $target = $(e.target || event.srcElement),
                                            action = $target.attr('data-action');

                                        if (action && action !== "undefined") {
                                            contextMenuCallback.doAction.call(context, $li, action);
                                        } else {
                                            contextMenuCallback.closeTab.call(context, $target.attr('data-filter'));
                                        }

                                        $contextMenu.addClass('hide');
                                    },
                                    'mouseleave.viewContextMenu': function () {
                                        $contextMenu.addClass('hide');
                                    }
                                });

                            $tabs.off('.viewContextMenu').one('mouseleave.viewContextMenu', function (e) {
                                if (!$(e.relatedTarget).closest('ul').hasClass('aweb-tab-content-menu')) {
                                    $contextMenu.addClass('hide');
                                }
                            });
                        }

                        return false;
                    }
                });
            }
            context.$moveBtns.on({
                'click.view': function () {
                    context.focusTab(undefined, $(this));
                }
            });

            app.screen.addResizeHandler({
                uid: app.getUID(),
                isGlobal: options.isGlobal,
                timeout: 500,
                callback: function () {
                    context.focusTab(context.$tabs.children('.active'));
                }
            });

            queryString = app.getQueryStringMap();

            if ((windowId = queryString[this.windowKey]) && (windowOptions = app.getData(windowId))) {
                windowOptions = JSON.parse(windowOptions);
                windowOptions.type = this.TYPE.BLANK;

                this.controller.open(windowOptions);
            }
        },

        Model = function (options, controller) {

            $.extend(true, this, options, {
                currentStep: -1,
                intervals: {},
                timeouts: {},
                _data: {
                    scope: {}
                }
            });

            this.controller = controller || options.constructor;

            this.uid = this.pageId = this.cacheId = this.domID;
        },

        Controller = function (options) {
            var context = this,
                _default = this._default,
                eventController;

            $.extend(true, this, _default, options);

            options.view.controller = this;

            this.context = this;
            this.event = app.dispatcher();
            this.Model = this.Model || Model;
            this.tab = new (options.View || View)(options.view, this);
            this.pages = {};

        };

    View.prototype = {
        version: 'AWOS 4.4_20171127',
        constructor: View,

        _default: {
            ctn: '[data-role=container]',

            tabs: '#tabs',

            ctt: '#spa-page-main',

            count: {},
            stack: [],

            contextMenuTemp: '<ul class="aweb-tab-content-menu hide"></ul>',
            tabCtnTemp: '<div class="aweb-tabs-container"></div>',
            tabTemp: '<li class="active" data-dom-id="_domID_" data-tab-id="_id_" data-href="_href_" title="_title_"><a>_title_</a>_button_</li>',
            leftBtnTemp: '<button type="button" title="左移标签" class="btn aweb-tabs-left hidden" data-role="left"><i class="fa fa-chevron-left"></i>',
            rightBtnTemp: '<button type="button" title="右移标签" class="btn aweb-tabs-right hidden" data-role="right"><i class="fa fa-chevron-right"></i></button>',
            closeButtonTemp: '<button type="button" data-role="close" class="close">&times;</button>',
            untitled: '未定义',

            cttTemp: '<div id="_domID_" />',

            ctnFullClassName: 'aweb-spa-ctn-full',
            cttFullClassName: 'aweb-spa-ctt-full',

            hideNavClass: 'hide',

            pathKeyInURL: 'page',
            fullscreenKeyInURL: 'fullscreen',
            displayNavKeyInURL: 'displayNav',

            windowKey: 'windowId',

            toUpdateTitle: true
        },

        TYPE: {
            BLANK: 'BLANK',
            SUB: 'SUB',
            SELF: 'SELF',
            WINDOW: 'WINDOW',
            POPOVER: 'POPOVER'
        },
        popOption: {
            popSwitch: false
        },

        open: function (options) {
            var TYPE = this.TYPE,


                ret = false,
                title = options.title || this.untitled,
                id = options.id,
                fixed = options.fixed,
                domID,
                href = $.camelCase(options.sections.join('-')),

                handler,context,

                $tabs = this.$tabs.children(),
                $tab, $renderTo;


            if (!this.stack.length && options.type === TYPE.SELF) {
                options.type = TYPE.BLANK;
            }


            if (!options.type || options.type === TYPE.BLANK) {
                $tab = id ? $tabs.filter('[data-tab-id="' + id + '"][data-href="' + href + '"]') : $tabs.filter('[data-href="' + href + '"]');

                if ($tab.length) {
                    domID = $tab.attr('data-dom-id');

                    this.switchView(domID, !$tab.length);
                } else {
                    if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.SUB || handler.type === TYPE.POPOVER)) {

                        switch (handler.type) {
                            case TYPE.SUB:
                                app.alert('系统错误 0x01：子页面下不能打开新页面！', app.alert.ERROR, '0x01');
                                break;
                            case TYPE.POPOVER:
                                app.alert('系统错误 0x01：气泡页面下不能打开新页面！', app.alert.ERROR, '0x01');
                                break;
                        }
                    } else {
                        domID = this.getUID(id || href);

                        this.$tabs.append(this.tabTemp.replace(/_domID_/, domID).replace(/_id_/, id).replace(/_href_/, href)
                            .replace(/_title_/g, title)
                            .replace(/_button_/, fixed ? '' : this.closeButtonTemp)
                        );

                        $renderTo = $(this.cttTemp.replace(/_domID_/, domID));
                        this.$ctt.append($renderTo);

                        ret = {
                            domID: domID,
                            $renderTo: $renderTo,
                            type: TYPE.BLANK
                        };
                    }
                }
            } else {
                switch (options.type) {
                    case TYPE.SELF:
                        //暂时阻止气泡页面下自身打开页面
                        if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.POPOVER)) {
                            app.alert('系统错误 0x01：气泡页面下不能打开自身页面！', app.alert.ERROR, '0x01');
                        } else {
                            handler = this.controller.getCurrentHandler();

                            this.controller.unload(handler.domID, true);

                            domID = this.getUID(id || href);

                            $renderTo = handler.$renderTo = this.updateTitleAndID(handler.type, handler.domID, domID, title, id, href, handler.$renderTo);

                            ret = {
                                $renderTo: handler.$renderTo,
                                domID: domID,
                                type: handler.type
                            };
                        }


                        break;
                    case TYPE.SUB:

                        if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.POPOVER)) {
                            app.alert('系统错误 0x01：气泡页面下不能打开子页面！', app.alert.ERROR, '0x01');
                        } else {
                            domID = this.getUID(id || href);

                            $renderTo = $(this.cttTemp.replace(/_domID_/, domID));

                            ret = {
                                $renderTo: $renderTo,
                                domID: domID,
                                type: TYPE.SUB
                            };

                            app.modal({
                                title: title,
                                content: '',
                                btnConfirm: options.btnConfirm || '关闭',
                                btnCancel: options.btnCancel || '取消',
                                init: function (controller) {
                                    var $body = $(this),
                                        $close = $('<button title="关闭子页面" type="button" class="close iconfont icon-topbar-close"></button>');

                                    $body.prev().prepend($close);
                                    $body.append($renderTo);

                                    $close.one('click', function () {
                                        controller.unload();

                                        $(this).closest('.modal').modal('hide');

                                        controller.tab.resumeView();
                                    });
                                },
                                confirmHandler: function (controller) {
                                    controller.unload();

                                    $(this).closest('.modal').modal('hide');

                                    controller.tab.resumeView();
                                },
                                cancelHandler: function (controller) {
                                    controller.unload();

                                    $(this).closest('.modal').modal('hide');

                                    controller.tab.resumeView();

                                },
                                width: options.width,
                                height: options.height,
                                args: [this.controller],
                                isLargeModal: true,
                                isDialog: true,
                                backdrop: 'static',
                                noFooter: !options.hasFooter,
                                noHeader: !options.title
                            });
                        }

                        break;
                    case TYPE.POPOVER:

                        if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.POPOVER)) {
                            app.alert('系统错误 0x01：气泡页面下不能打开新气泡页面！', app.alert.ERROR, '0x01');

                        } else {
                            domID = this.getUID(id || href);

                            $renderTo = $(this.cttTemp.replace(/_domID_/, domID));

                            ret = {
                                $renderTo: $renderTo,
                                domID: domID,
                                type: TYPE.POPOVER
                            };

                            context = this;
                            /*  //需要阻止第二次点击的时候仍然进行 popover 动作
                             if (this.popOption.popSwitch) {
                             this.popOption.popSwitch = !this.popOption.popSwitch;

                             } else {*/
                            app.popover({
                                $elem: options.$elem,
                                title: title,
                                content: '',
                                placement: 'auto left',
                                init: function (popIns, controller) {
                                    var $body = $(this).find('.aweb-popover-content');

                                    $body.append($renderTo);
                                    context.pagePopInstance = popIns;


                                },
                                confirmHandler: function (popIns, controller, popOption) {

                                    if (!popIns.popInstance.inState.click) {
                                        popOption.popSwitch = !popOption.popSwitch;
                                    }

                                    controller.unload();
                                    controller.tab.resumeView();

                                },

                                width: options.width,
                                height: options.height,
                                args: [this.controller, this.popOption]
                            });
                            /*  }*/
                        }

                        break;
                }
            }

            if (typeof options.fullscreen === 'boolean') {
                this.fullscreen(options.fullscreen);
            }

            if (typeof options.displayNav === 'boolean') {
                this.displayNav(options.displayNav);
            }

            return ret;
        },
        openWindow: function (options) {
            var optionStr = JSON.stringify(options || {}),
                windowId = app.getUID(),
                location = window.location || document.location,
                url = (location.origin || '') + location.pathname,
                a = document.createElement("a");

            app.setData(windowId, optionStr);

            window.open(url + '?' + app.getNewQueryStringURL({
                    windowId: windowId
                }));
        },
        close: function (domID, _doNotResume) {
            var handler,
                controller = this.controller,
                currentViewID = this.getCurrentView();

            handler = controller.getCacheHandler(domID) || controller.getCurrentHandler();
            domID = domID || currentViewID;

            if (handler) {

                if (handler.type === this.TYPE.SUB) {

                    controller.unload(domID, true);

                    handler.$renderTo.closest('.modal').modal('hide');



                } else {

                    if(/MSIE|Trident\/7\.0/i.test(navigator.userAgent)&& handler.type === this.TYPE.POPOVER){
                        this.pagePopInstance.close && this.pagePopInstance.close();
                    }

                    controller.unload(domID);

                    this.$tabs.children('[data-dom-id="' + domID + '"]').remove();
                    this.$ctt.children('#' + domID).remove();


                }

                if (!_doNotResume && domID === currentViewID) {
                    this.resumeView();
                }

            }
            return this;
        },

        getUID: function (domID) {

            if (this.count[domID]) {
                domID += (++this.count[domID]);
            } else {
                this.count[domID] = 1;
            }
            return domID;
        },
        updateTitleAndID: function (type, oldID, newID, title, id, href, $renderTo) {
            var TYPE = this.TYPE;

            title = title || this.untitled;

            switch (type) {
                case TYPE.SUB:
                    $renderTo.closest('.modal').children('.modal-header').children(':not(button)').text(title);
                    break;
                case TYPE.POPOVER:
                    $renderTo.closest('.aweb-popover').children('.aweb-popover-header').children('.aweb-popover-title').text(title);
                    break;
                default:
                    this.$tabs
                        .children('[data-dom-id="' + oldID + '"]')
                        .attr({
                            title: title,
                            'data-dom-id': newID,
                            'data-tab-id': id,
                            'data-href': href
                        })
                        .children('a').text(title);
                    break;
            }

            return $renderTo.attr('id', newID);
        },
        setTitle: function (uid, newTitle) {
            var TYPE = this.TYPE,
                model = this.controller.getCacheHandler(uid),
                $view;

            if (model && ($view = model.$renderTo)) {
                newTitle = newTitle || this.untitled;

                switch (model.type) {
                    case TYPE.SUB:
                        $view.closest('.modal').children('.modal-header').children(':not(button)').text(newTitle);
                        break;
                    default:
                        this.$tabs
                            .children('[data-dom-id="' + uid + '"]')
                            .attr({
                                title: newTitle
                            })
                            .children('a').text(newTitle);
                        break;
                }
            }
        },

        setCurrentView: function (domID) {
            if (domID) {
                var stack = [],
                    _stack = this.stack,
                    i, id;

                for (i = _stack.length; id = _stack[--i];) {
                    if (domID !== id) {
                        stack.push(id);
                    }
                }
                this.stack = stack.reverse();
                this.stack.push(domID);

                this.$ctn.removeClass('hidden');
            }
        },
        getCurrentView: function () {
            //字符串化
            return this.stack[this.stack.length - 1] + '';
        },
        removeView: function (domID) {
            if (domID) {
                var stack = [],
                    _stack = this.stack,
                    i, id;

                for (i = _stack.length; id = _stack[--i];) {
                    if (domID !== id) {
                        stack.push(id);
                    }
                }
                this.stack = stack.reverse();

                if (!stack.length) {
                    this.$ctn.addClass('hidden');
                    this.fullscreen(false);
                    this.displayNav(true);
                }
            }
        },


        switchView: function (domID, isLoad) {
            var

                lastDomID = this.getCurrentView(),
                $tab, $ctt, $page,
                model;

            if (isLoad || lastDomID !== domID) {


                model = this.controller.getCacheHandler(domID);

                if (model) {
                    this.controller.pause();

                    if ((model.type !== this.TYPE.SUB) && (model.type !== this.TYPE.POPOVER)) {
                        $tab = this.$tabs.children()
                            .removeClass('active')
                            .filter('[data-dom-id="' + domID + '"]').addClass('active');

                        $ctt = this.$ctt;

                        $page = $ctt.children('#' + lastDomID);
                        $page.attr('data-scroll-top', $page.parent().scrollTop()).addClass('hide');


                        $page = $ctt.children('#' + domID);
                        $page.removeClass('hide');
                        $page.parent().scrollTop($page.attr('data-scroll-top') || 0);

                        //因为弹窗和气泡已经trigger了
                        $(window).trigger('resize');
                    } else {
                        $ctt = this.$ctt;
                        $page = $ctt.children('#' + lastDomID);
                        $page.attr('data-scroll-top', $page.parent().scrollTop());

                        $page = model.$renderTo;
                        $page.removeClass('hide');
                    }


                    !isLoad && this.controller.resume(domID);

                    this.setCurrentView(domID);

                    this.focusTab($tab);
                }


            }
        },
        resumeView: function () {
            var TYPE = this.TYPE,
                lastDomID = this.getCurrentView(),
                handler = this.controller.getCurrentHandler(),
                domID,
                $tab, $ctt, $page, model;

            if (handler) {
                domID = handler.domID;
                model = this.controller.getCacheHandler(domID);

                if ((model.type !== this.TYPE.SUB) && (model.type !== this.TYPE.POPOVER)) {
                    $tab = this.$tabs.children()
                        .removeClass('active')
                        .filter('[data-dom-id="' + domID + '"]').addClass('active');

                    $ctt = this.$ctt;


                    $page = $ctt.children('#' + lastDomID);
                    $page.attr('data-scroll-top', $page.parent().scrollTop()).addClass('hide');

                    $page = $ctt.children('#' + domID);
                    $page.removeClass('hide');
                    $page.parent().scrollTop($page.attr('data-scroll-top') || 0);

                    //因为弹窗和气泡已经trigger了
                    $(window).trigger('resize');
                }
                this.controller.resume(domID);

                this.focusTab($tab);
            }
        },
        focusTab: (function () {
            var _focusTab = function ($tab, $btn) {
                    var widths = 0,
                        totalWidths = 0,

                        $tabCtn = this.$tabCtn,
                        $tabs = this.$tabs,
                        $lis = $tabs.children($tab ? ':lt(' + ($tab.index() + 1) + ')' : undefined),
                        $tabBtn = $btn || this.$left,
                        marginLeft,

                        tabsContainerWidth = $tabCtn.innerWidth() - $tabBtn.outerWidth() * 4.2,
                        tabsOffsetLeft = parseInt($tabs.css('left'), 10);


                    $lis.each(function (index, elem) {
                        widths += $(elem).outerWidth();
                    });

                    if (!$tab) {
                        totalWidths = widths;
                    } else {
                        $tabs.children().each(function (index, elem) {
                            totalWidths += $(elem).outerWidth();
                        });
                    }

                    this.$moveBtns[totalWidths < tabsContainerWidth ? 'addClass' : 'removeClass']('hidden');


                    if ($btn) {
                        if ($btn.attr('data-role') === 'left') {
                            tabsOffsetLeft += tabsContainerWidth;
                        } else {
                            tabsOffsetLeft -= tabsContainerWidth;
                        }
                    } else {
                        tabsOffsetLeft = tabsContainerWidth - widths;
                    }

                    if (tabsContainerWidth - widths > tabsOffsetLeft) {

                        tabsOffsetLeft = tabsContainerWidth - widths;
                    } else if (tabsOffsetLeft > 0) {
                        marginLeft = totalWidths < tabsContainerWidth ? 0 : $tabBtn.outerWidth();

                        tabsOffsetLeft = tabsOffsetLeft > marginLeft ? marginLeft : tabsOffsetLeft;
                    }

                    $tabs.animate({
                        'left': tabsOffsetLeft + 'px'
                    }, 500);
                },
                focusTabHandler = null;

            return function ($tab, $btn) {
                var context = this;
                if (focusTabHandler) {
                    clearTimeout(focusTabHandler);
                    focusTabHandler = null;
                }

                focusTabHandler = setTimeout(function () {
                    _focusTab.call(context, $tab, $btn);
                }, 200);
            }
        }()),

        fullscreen: function (fullscreen) {
            this.$ctn[fullscreen ? 'addClass' : 'removeClass'](this.ctnFullClassName);

            app.shelter[fullscreen ? 'upperZIndex' : 'lowerZIndex']();

            this.focusTab();
        },
        isFullScreen: function () {
            return this.$ctn.hasClass(this.ctnFullClassName);
        },
        displayNav: function (show) {
            this.$tabCtn[show ? 'removeClass' : 'addClass'](this.hideNavClass);
            this.$ctt[show ? 'removeClass' : 'addClass'](this.cttFullClassName);

            this.focusTab();
        },
        isDisplayNav: function () {
            return !this.$tabCtn.hasClass(this.hideNavClass);
        }
    };

    Model.prototype = {
        version: 'AWOS 4.4_20171127',
        constructor: Model,

        load: function () {
            return this.stepTo(0);
        },
        pause: function () {
            var data = this._data;

            try {
                if (data && data.bootstrap && data.bootstrap.pause) {

                    this.controller.trigger(this.controller.STATUS.BEFORE_PAUSE, this);

                    data.bootstrap.pause.call(this, data.$el, data.scope, this);

                    this.controller.trigger(this.controller.STATUS.AFTER_PAUSE, this);
                }
            } catch (e) {
                if (window.aweb.error) {
                    app.alert(e.message, app.alert.ERROR);
                }
                if (window.aweb.log) {
                    console.error(e);
                }
            }

            this.stopAsyncEvent();

            return this;
        },
        resume: function () {
            var data = this._data;

            try {
                if (data && data.bootstrap && data.bootstrap.resume) {
                    this.controller.trigger(this.controller.STATUS.BEFORE_RESUME, this);

                    data.bootstrap.resume.call(this, data.$el, data.scope, this);

                    this.controller.trigger(this.controller.STATUS.AFTER_RESUME, this);
                }
            } catch (e) {

                if (window.aweb.error) {
                    app.alert(e.message, app.alert.ERROR);
                }
                if (window.aweb.log) {
                    console.error(e);
                }
            }

            this.startAsyncEvent();

            return this;
        },
        unload: function (keepDom) {
            if (this.currentStep !== -1) {
                var data = this._data;

                try {
                    if (data && data.bootstrap && data.bootstrap.unload) {
                        this.controller.trigger(this.controller.STATUS.BEFORE_UNLOAD, this);

                        data.bootstrap.unload.call(this, data.$el, data.scope, this);

                        this.controller.trigger(this.controller.STATUS.AFTER_UNLOAD, this);
                    }
                } catch (e) {
                    if (window.aweb.error) {
                        app.alert(e.message, app.alert.ERROR);
                    }
                    if (window.aweb.log) {
                        console.error(e);
                    }
                } finally {
                    this.undelegateEvents();
                    this.stopAsyncEvent(true);

                    if (!keepDom) {
                        data.$el.remove();
                        delete this._data.$el;

                        if (window.$AW) {
                            delete window.$AW._css[this.domID];
                        }
                    } else {
                        data.$el.empty();
                    }

                    delete this.timeouts;
                    delete this.intervals;


                    this.timeouts = {};
                    this.intervals = {};
                }
            }

            return this;
        },

        stepTo: function (step) {
            var
                handler = this,
                cache = handler._data && handler._data.scope,
                module = handler.conf,
                modulePath = handler.path,
                oFlow = module.flows[step],
                oView = module.views[oFlow.id],
                dtd = $.Deferred();

            //防止刷新时，pageParams不一致
            if (cache && !$.isEmptyObject(cache)) {
                app.domain.exports('page', cache);
            }

            this.unload(true);

            require([this.getTextURL(modulePath + oView.template, handler.server), this.getJavascriptURL(modulePath + oView.js, handler.server)],
                function (template, bootstrap) {
                    var data = handler._data,
                        $div = $('<div/>'),
                        $el;


                    handler.$renderTo.empty().append($div);
                    template && $div.append(template);
                    $el = data.$el = handler.$renderTo;

                    if($.isFunction(bootstrap)){
                        bootstrap=bootstrap();
                    }
                    if($.isFunction(bootstrap)){
                        bootstrap=bootstrap();
                    }

                    data.bootstrap = bootstrap;

                    try {
                        if (data && data.bootstrap && data.bootstrap.load) {
                            bootstrap.load.call(handler, $el, data.scope, handler);
                        }

                        handler.currentStep = step;

                        handler.controller.trigger(handler.controller.STATUS.AFTER_LOAD, handler);

                        /* 获取选中的菜单的ID*/
                        var menuId = app.domain.get("menuId", "key1");
                        app.domain.clearScope("menuId");
                        $.ajax({
                            url: './authority.do',
                            data: {
                                path: handler.path,//'module/pagename/aa'
                                menuId: menuId
                            },
                            success: function (response) {
                                /*response={
                                 status:true,
                                 content:{
                                 result:[{
                                 type:'component',
                                 selector:'ttt'
                                 },{
                                 type:'selector',
                                 selector:'#tb #id'
                                 }]
                                 }
                                 }*/

                                var result, i, item,
                                    variables,
                                    component;

                                if (response.status) {
                                    if ((result = response.content.result) && result.length) {
                                        variables = handler.auiCtx && handler.auiCtx.variables;
                                        for (var i = 0; i < result.length; i++) {
                                            var item = result[i];
                                            switch (item.type) {
                                                case 'component':
                                                    if (variables && (component = variables[item.selector])) {
                                                        if (component && component.hide) {
                                                            component.hide();
                                                        }
                                                    }
                                                    break;
                                                case'selector':

                                                    $(item.selector, $el).remove();

                                                    break;
                                            }
                                        }
                                    }
                                }
                            },
                            complete: function () {
                                dtd.resolve();
                            }
                        });


                        app.domain.clearScope("page");

                        handler.currentStep = step;

                        if (window.aweb.log) {
                            console.log(new Date().toTimeString() + '：加载' + handler.path + '完毕，唯一ID（domID）：' + handler.domID + '，页面ID（id）：' + handler.id + '，当前步数（currentStep）：' + step + '');
                        }
                    } catch (e) {
                        if (window.aweb.error) {
                            app.alert(e.message, app.alert.ERROR);
                        }
                        if (window.aweb.log) {
                            console.error(e);
                        }
                    } finally {
                        dtd.resolve();
                    }
                });

            return dtd.promise();
        },

        setTimeout: function (option) {
            var handler = this;

            if (option.immediate) {
                option.callback ? option.callback() : option.func();
            }

            option.clock = option.clock || 0;
            option.uniqueId = option.uniqueId || app.getUID();
            option.windowId = window.setTimeout(function () {
                option.callback ? option.callback() : option.func();

                handler.removeAsyncEvent(handler.timeouts, option.uniqueId);
            }, option.clock);

            handler.timeouts[option.uniqueId] = option;

            return option.uniqueId;
        },
        clearTimeout: function (uniqueId) {
            var e = this.timeouts[uniqueId];

            if (e) {
                window.clearTimeout(e.windowId);
                this.removeAsyncEvent(this.timeouts, e.uniqueId);
            }
        },
        setInterval: function (option) {
            var handler = this;

            if (option.immediate) {
                option.callback ? option.callback() : option.func();
            }

            option.clock = option.clock || 0;
            option.uniqueId = option.uniqueId || app.getUID();
            option.windowId = window.setInterval(option.times ? function () {
                if (option.times) {
                    option.times--;
                    option.callback ? option.callback() : option.func();
                } else {
                    handler.removeAsyncEvent(handler.timeouts, option.uniqueId);
                }
            } : (option.callback || option.func), option.clock);

            handler.intervals[option.uniqueId] = option;

            return option.uniqueId;
        },
        clearInterval: function (uniqueId) {
            var e = this.intervals[uniqueId];

            if (e) {
                window.clearInterval(e.windowId);
                this.removeAsyncEvent(this.intervals, e.uniqueId);
            }
        },
        updateInterval: function (uniqueId, option) {
            var handler = this,
                e = handler.intervals[uniqueId];

            if (e) {
                this.clearInterval(e.uniqueId);

                return this.setInterval($.extend(true, e, option));
            }
        },
        startAsyncEvent: function () {
            var i, map, item,
                handler = this;

            map = this.intervals;
            for (i in map) {
                if ((item = map[i]) && item.isPause) {

                    item.windowId = window.setInterval(item.times ? (function (item, handler) {
                        return function () {
                            if (item.times) {
                                item.times--;
                                item.callback ? item.callback() : item.func();
                            } else {
                                handler.removeAsyncEvent(handler.timeouts, item.uniqueId);
                            }
                        };
                    }(item, handler)) : (item.callback || item.func), item.clock);
                }
            }

            map = this.timeouts;
            for (i in map) {
                if ((item = map[i]) && item.isPause) {
                    item.windowId = window.setTimeout((function (item, handler) {
                        return function () {
                            item.callback ? item.callback() : item.func();

                            handler.removeAsyncEvent(handler.timeouts, item.uniqueId);
                        }
                    }(item, handler)), item.clock);
                }
            }

            i = null, item = null, map = null;
        },
        stopAsyncEvent: function (isUnload) {
            var i, map, item;

            map = this.intervals;
            for (i in map) {
                if ((item = map[i]) && (isUnload || item.isPause)) {
                    window.clearInterval(map[i].windowId);
                }
            }

            map = this.timeouts;
            for (i in map) {
                if ((item = map[i]) && (isUnload || item.isPause)) {
                    window.clearTimeout(map[i].windowId);
                }
            }
        },
        removeAsyncEvent: function (arr, uniqueId) {
            if (arr[uniqueId]) {
                arr[uniqueId] = null;
                delete arr[uniqueId];
            }
        },


        delegateEvents: function (events) {
            var context = this,
                $el = context._data.$el || context.$renderTo,
                method, match, eventName, selector, $selector, key, touchName,
                map = {},
                intercept,
                $ = jQuery;

            this.undelegateEvents();
            for (key in events) {
                if (events.hasOwnProperty(key)) {
                    method = events[key];

                    if (!this.isFunction(method)) method = this[events[key]];

                    if (!method) continue;

                    match = key.match(this.delegateEventSplitter);

                    eventName = match[1];
                    selector = match[2];

                    eventName += '.previewEvents';
                    if (selector === '') {
                        $el.on(eventName, method);
                    } else {
                        $selector = $(selector, $el);


                        if ($selector.length) {
                            // (touchName = eventName.split(".")[0]) && touchType[touchName] && $selector.addClass("waves-effect");
                            $selector
                                .on(eventName, method)
                                .attr('data-aweb-event', true);
                        }

                        if (!map[eventName]) {
                            map[eventName] = {};
                            $el.on(eventName, {
                                eventName: eventName
                            }, function (e) {
                                var $e = $(e.target || window.event.srcElement),
                                    $selector,
                                    selector, items = map[e.data.eventName];

                                for (selector in items) {
                                    if (items.hasOwnProperty(selector)) {
                                        $selector = $e.closest($(selector, $el));

                                        if ($selector.attr('data-aweb-event')) {
                                            break;
                                        } else if ($selector.length) {
                                            return items[selector].apply($e[0], arguments);
                                        }
                                    }
                                }
                            });
                        }

                        map[eventName][selector] = method;
                    }
                }
            }


            if (window.aweb && window.aweb.headless && window.aweb.headless.on) {
                intercept = function (e) {
                    var $target = $(e.target || event.srcElement);

                    console.log(new Date().toString() + ':' + context.path + '触发了' + e.type + '，元素是:' + $target);
                };
                $el.on({
                    'click.debug': intercept,
                    'focus.debug': intercept,
                    'keydown.debug': intercept
                });
            }
        },
        undelegateEvents: function () {
            this._data.$el && this._data.$el.off();
        },
        isFunction: function (obj) {
            return ((typeof obj === 'function') || false);
        },
        delegateEventSplitter: /^(\S+)\s*(.*)$/,

        getController: function () {
            return this.controller;
        },



        getTextURL : function (mvvmConfPath, server) {
            return "text!./" + (server || '') + mvvmConfPath + (aweb.debug?("?timestamp=" + new Date().getTime()):'');
        },
        getJavascriptURL : function (mvvmConfPath, server) {
            return (server || '') + mvvmConfPath + "?timestamp=" + (aweb.debug?("?timestamp=" + new Date().getTime()):'');
        },
        validateModule : function (module) {
            var error = [],
                flows = module.flows,
                views = module.views,
                i, flow;

            if (!views) {
                error.push("views必需定义！");
            }

            if (flows && flows.length) {
                for (i = -1; flow = flows[++i];) {
                    if (!flow.id) {
                        error.push("flows中位置为" + i + "的流程需包含关联view的id！");
                    } else {
                        if (views && !views[flow.id]) {
                            error.push("flows中位置为" + i + "的流程id关联的view未在views中定义！");
                        }
                    }
                }
            } else {
                error.push("flows必需为长度大于0的数组！");
            }

            return error;
        }
    };

    Controller.prototype = {
        version: 'AWOS 4.4_20171127',
        constructor: Controller,
        _default: {
            conf: {},
            cache: {},
            modulesPath: "module",
            separator: "/",
            mvvmConfName: "mvvm.json",
            modulePath404: "module/error/404/"
        },

        STATUS: {
            AFTER_LOAD: 'afterLoad',
            BEFORE_PAUSE: 'beforePause',
            AFTER_PAUSE: 'afterPause',
            BEFORE_RESUME: 'beforeResume',
            AFTER_RESUME: 'afterResume',
            BEFORE_UNLOAD: 'beforeUnload',
            AFTER_UNLOAD: 'afterUnload'
        },

        getDefaultModulesPath: function () {
            return this.modulesPath;
        },
        getDefaultMVVMConfName: function () {
            return this.mvvmConfName;
        },
        getDefaultSeparator: function () {
            return this.separator;
        },
        getCurrentHandler: function () {
            return this.cache[this.tab.getCurrentView()];
        },

        getMVVM404: function () {
            return {
                path: this.modulePath404,
                conf: this.conf[this.modulePath404]
            };
        },

        getCacheHandler: function (domID) {
            return this.cache[domID];
        },
        addCacheHandler: function (handler) {
            this.cache[handler.domID] = handler;
        },
        removeCacheHandler: function (domID) {
            if (this.cache[domID]) {
                delete this.cache[domID];

                this.tab.removeView(domID);
            }
        },

        load: function (options) {
            var modulePath = this.getDefaultModulesPath() + this.getDefaultSeparator(),
                $renderTo,
                id, domID,
                result, type,
                handler,
                context = this,
                sections = [];

            if (options.sections instanceof Array) {
                sections = sections.concat(options.sections);
            }

            if (sections.length) {
                modulePath += (sections.join(this.getDefaultSeparator()) + this.getDefaultSeparator());
                id = options.id;

                if (options.type !== View.prototype.TYPE.WINDOW) {
                    app.shelter.show('正在加载页面，请稍候…');
                    require([context.Model.prototype.getTextURL(modulePath + this.getDefaultMVVMConfName(), options.server)], function (mvvmConf) {
                        try {
                            var error;

                            if (!mvvmConf) {
                                app.alert('系统错误 0x05：获取页面失败！', app.alert.ERROR, '0x05');
                            } else {
                                mvvmConf = JSON.parse(mvvmConf);

                                if ((error = context.Model.prototype.validateModule(mvvmConf)).length) {
                                    app.alert(error, app.alert.ERROR);
                                } else {
                                    if (result = context.tab.open(options)) {

                                        domID = result.domID;
                                        $renderTo = result.$renderTo;
                                        type = result.type;
                                        context.pages[domID] = options;
                                        try {
                                            handler = new context.Model({
                                                conf: mvvmConf,
                                                path: modulePath,
                                                $renderTo: $renderTo,
                                                id: id,
                                                domID: domID,
                                                controller: context,
                                                type: type,
                                                server: options.server,
                                                option: options
                                            }, context);
                                        } catch (e) {
                                            error = context.getMVVM404();

                                            handler = new context.Model({
                                                conf: error.conf,
                                                path: error.path,
                                                $renderTo: $renderTo,
                                                id: id,
                                                domID: domID,
                                                controller: context,
                                                type: type,
                                                errorMsg: e.message,
                                                server: options.server,
                                                option: options
                                            }, context);
                                        } finally {
                                            context.addCacheHandler(handler);

                                            //如果是SELF的时候，handler指的是上一次的type，而不是这一次的type
                                            if (options.type === context.tab.TYPE.SELF) {
                                                context.tab.setCurrentView(handler.domID);
                                            } else {
                                                context.tab.switchView(handler.domID, true);
                                            }

                                            $.when(handler.load()).done(function () {
                                                app.shelter.hide();
                                            });
                                        }
                                    } else {
                                        app.shelter.hide();
                                    }
                                }
                            }

                        } catch (e) {
                            if (window.aweb.log) {
                                console.error(e);
                            }

                            if (window.aweb.error) {
                                app.alert('系统错误 0x04：内容运行报错，详情见控制台！', app.alert.ERROR, '0x04');
                            }

                            app.shelter.hide();
                        }
                    });
                } else {
                    this.tab.openWindow(options);
                }

            } else {
                if (window.aweb.error) {
                    app.alert('系统错误 0x01：页面路径为空！', app.alert.ERROR, '0x01');
                }

            }
        },
        pause: function () {
            var handler = this.getCurrentHandler();

            if (handler) {
                handler.pause();
            }
        },
        resume: function (domID) {

            if (!domID) {
                debugger;
            }
            var
                handler = this.getCacheHandler(domID);

            if (handler) {
                handler.resume();
            }
        },
        unload: function (domID, keepDom) {

            var handler = domID ? this.getCacheHandler(domID) : this.getCurrentHandler();

            if (handler) {
                handler.unload(keepDom);

                this.removeCacheHandler(handler.domID);
            }
        },

        open: function (options) {
            if (options.status) {

                app.domain.exports('page', options.content);

                options.sections = options.page.split("#");

                this.load(options);

            } else if (options.errorMsg) {
                app.alert(options.errorMsg, app.alert.ERROR);
            }
        },

        getView: function () {
            return this.tab;
        },


        on: function () {
            this.event.on.apply(this.event, arguments);
        },
        off: function () {
            this.event.off.apply(this.event, arguments);
        },
        trigger: function () {
            this.event.trigger.apply(this.event, arguments);
        }
    };

    Controller.View = View;
    Controller.Model = Model;

    return Controller;
},
ajax:function () {
        var _ajax = $.ajax;

        // $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        // $.support.cors=true;

        $.ajax = window.auiApp ? function (option) {
            var validateResult,
                queryString = {},
                data = {},
                formData, i, item, items;

            option = $.extend(true, {
                type: "post",
                contentType: "application/x-www-form-urlencoded;charset=utf-8",
                dataType: "json",
                traditional: true,
                shelter: false,
                success: function () {
                },
                validate: true
            }, option);

            //get value and validate
            validateResult = app.validate(option.data, option.validateSuccessCallback, option.validateErrorCallback, option.validateCleanCallback, option.validateContinue, option.validate);


            option.data = validateResult.data;

            if ($.isArray(option.data)) {
                for (items = option.data, i = items.length; item = items[--i];) {
                    if (item.queryString) {
                        queryString[item.name] = item.value;
                    } else {
                        data[item.name] = item.value;
                    }
                }

                option.data = data;

                if (!$.isEmptyObject(queryString)) {
                    option.url += '?' + $.param(queryString);
                }
            }

            if (option.ajaxProcessData === false) {
                try {
                    data = option.data;
                    formData = new FormData();

                    for (i in data) {
                        if (data.hasOwnProperty(i)) {
                            formData.append(i, data[i]);
                        }
                    }

                    option.data = formData;
                    option.processData = false;
                    option.contentType = false;
                } catch (e) {
                    if (window.aweb.error) {
                        app.alert('系统错误 0x03：网络请求失败！', app.alert.ERROR, '0x03');
                    }
                    if (window.aweb.log) {
                        console.error(e);
                    }
                }

            } else if (option.contentType.indexOf('application/json') !== -1) {
                option.data = JSON.stringify(option.data);
            }


            //exec ajax

            if (validateResult.result) {
                console && console.log(validateResult.result);
            } else {
                console.table(validateResult.data);
            }

            if (option.ajaxNoBlobData === false) {
                app.alert('模拟下载文件…', app.alert.SUCCESS);
            } else {
                requestAnimationFrame(function () {
                    option.success({
                        status: true,
                        content: {
                            result: 'auiAjaxTest'
                        }
                    });

                    if ($.isFunction(option.complete)) {
                        option.complete({}, '', '', '');
                    }
                });
            }
        } : function (option) {
            var validateResult, url,
                _error, _success,

                queryString = {},
                urlExternal = [],
                urlDivider,

                data = {},
                formData,

                i, item, items,$input,k,
                html,

                $iframe, $form,

                ctoken, handler, server;


            if (!(option && (url = option.url) && !!~url.indexOf('##'))) {
                option = $.extend(true, {
                    type: "post",
                    contentType: "application/x-www-form-urlencoded;charset=utf-8",
                    dataType: "json",
                    traditional: true,
                    shelter: false,
                    urlDivider: '\/',
                    success: function () {
                    }
                }, option);

                urlDivider = option.urlDivider;

                //get value and validate
                validateResult = app.validate(option.data, option.validateSuccessCallback, option.validateErrorCallback, option.validateCleanCallback, option.validateContinue, option.validate);

                if (validateResult.result) {
                    option.data = validateResult.data;

                    //自定义属性
                    //shelter
                    option.timeout = $.isNumeric(option.timeout) ? option.timeout : 30000;
                    if (option.shelter !== false && option.shelter !== 'false') {
                        app.shelter.show(option.shelter === true ? null : option.shelter, option.timeout);
                    }

                    //process data
                    if ($.isArray(option.data)) {
                        for (items = option.data, i = items.length; item = items[--i];) {
                            if (item.queryString) {
                                queryString[item.name] = item.value;
                            } else if (item.urlExternal) {
                                urlExternal.push(item.value);
                            } else {
                                data[item.name] = item.value;
                            }
                        }
                        option.data = data;
                    }

                    //添加token
                    ctoken = app.getData('ctoken') || window.ctoken;
                    if (ctoken) {
                        option.data = (option.data || {});
                        option.data.ctoken = ctoken;
                    }

                    if (option.ajaxProcessData === false) {
                        try {
                            data = option.data;
                            formData = new FormData();

                            for (i in data) {
                                if (data.hasOwnProperty(i)) {
                                    formData.append(i, data[i]);
                                }
                            }

                            option.data = formData;
                            option.processData = false;
                            option.contentType = false;
                        } catch (e) {
                            if (window.aweb.error) {
                                app.alert('系统错误 0x03：请求数据格式有误！', '0x03');
                            }
                            if (window.aweb.log) {
                                console.error(e);
                            }
                        }
                    } else if (option.contentType.indexOf('application/json') !== -1) {
                        option.data = JSON.stringify(option.data);
                    }


                    //deal url
                    if (urlExternal.length) {
                        urlExternal = urlDivider + urlExternal.join(urlDivider);
                        if (url[url.length - 1] === '?') {
                            url[url.length - 1] = '\/';
                        }

                        url += urlExternal;
                    }

                    if (!$.isEmptyObject(queryString)) {
                        url += (url.indexOf('?') !== -1 ? '' : '?') + $.param(queryString);
                    }

                    if (!option.server) {
                        handler = app.router && app.router.getCurrentHandler();
                        server = handler && handler.server;

                        if (server) {
                            option.server = server;
                            option.url = server + url;
                        } else {
                            option.url = url;
                        }
                    } else {
                        option.url = url;
                    }

                    if (option.ajaxNoBlobData === false) {
                        if (option.ajaxProcessData !== false) {

                            var iframeName = app.getUID();

                            $iframe = $('<iframe src="about:blank" name="' + iframeName + '" style="display: none"/>');
                            $form = $('<form/>');
                            html = [];
                            data = option.data;

                            $form.attr({
                                method: option.type,
                                action: option.url,
                                target: iframeName
                            });

                            for (i in data) {
                                if (data.hasOwnProperty(i)) {
                                    if ($.isArray(data[i])) {
                                        for (items = data[i], k = items.length; item = items[--k];) {
                                            $input = $('<input name="'+i+'"/>');
                                            $input.val(item);

                                            $form.append($input);
                                        }
                                    } else {
                                        $input = $('<input name="'+i+'"/>');
                                        $input.val(data[i]);

                                        $form.append($input);
                                    }
                                }
                            }

                            $input=null;


                            $iframe.appendTo('body');
                            $form.appendTo($iframe);

                            $form.submit();


                            $iframe.on('load', function (e) {
                                var response;

                                try {
                                    response = e.currentTarget.contentWindow.document.body.innerText;

                                    response = JSON.parse(response);
                                } catch (e) {
                                    response = {
                                        status: false,
                                        errorMsg: e.message,
                                        content: null
                                    };
                                }

                                option.success(response);

                                $iframe && $iframe.remove();
                                option.shelter && app.shelter.hide();
                            });


                        } else {
                            app.alert('系统错误 0x09：不能同时使用传输返回数据文件流！', app.alert.ERROR, '0x09');

                            option.shelter && app.shelter.hide();
                        }

                    } else {

                        //success and error
                        //_complete = option.complete;
                        _error = option.error;
                        _success = option.success;

                        option.success = function (response) {
                            if (option.shelter !== false && option.shelter !== 'false') {
                                app.shelter.hide();
                            }

                            if (response) {
                                if (response.status) {
                                    _success(response);
                                } else {
                                    switch (response.errorCode) {
                                        case '100001':
                                            app.modal({
                                                title: '提示框',
                                                content: "会话超时，请重新登录",
                                                isLargeModal: false,
                                                confirmHandler: function () {
                                                    window.location.reload();
                                                },
                                                cancelHandler: function () {
                                                    window.location.reload();
                                                }
                                            });
                                            break;
                                        case '100002':
                                            app.alert('系统错误 0x06：' + response.errorMsg || '字段校验失败！', app.alert.ERROR, '0x06');

                                            if (aweb && aweb.error) {
                                                console.log(response.errorMsg);
                                            }
                                            break;
                                        default:
                                            _success(response);
                                    }
                                }
                            } else {
                                app.alert('系统错误 0x08：后台服务报错！', app.alert.ERROR, '0x08');
                            }
                        };
                        option.error = function (XMLHttpRequest, textStatus, errorThrown) {
                            var oErr;

                            if (option.shelter !== false && option.shelter !== 'false') {
                                app.shelter.hide();
                            }

                            if (option.ajaxNoBlobData !== false && !option.preventError) {
                                oErr = XMLHttpRequest.response || XMLHttpRequest.responseText;
                                try {
                                    oErr = eval('(' + oErr + ')');
                                } catch (e) {
                                    oErr = {
                                        errorMsg: e.message
                                    }
                                } finally {
                                    app.alert('系统错误 0x08：后台服务报错！', app.alert.ERROR, '0x08');
                                    _error && _error(XMLHttpRequest, textStatus, errorThrown);

                                    console.error(oErr);
                                }
                            }
                        };

                        return _ajax(option);
                    }
                }
            }
        };


        return $.ajax;
    },
alert:function(){
                var SHOW_TYPE = {
                        SUCCESS: 'success',
                        success: 'fa fa-check-circle alert-success ',
                        _DEFAULT: 'info',
                        info: 'fa fa-info-circle alert-info',
                        ERROR: 'error',
                        error: 'fa fa-warning alert-pink',
                        WARNING: 'warning',
                        warning: 'fa fa-info-circle alert-warning',
                        PINK: 'pink',
                        pink: 'alert-pink',
                        MESSAGE: 'message'
                    },

                    alertCtnTemp = '<ul id="alertList" data-role="alertList" class="alert-list unstyled" style="z-index: 8;"></ul>',
                    alertCttTemp = '<li data-alert-id="_id_"><i class="iconfont icon-topbar-close alert-btn" title="关闭" data-role="close"></i><i class="fa fa-angle-down alert-btn" data-role="more" title="更多"></i><i class="alert-icon _showType_"></i><div class="alert-content" title="_title_">_content_</div></li>',


                    alertQueueLength = Math.max(Math.ceil($(window).height() / 100), 3),
                    alertQueue = [],
                    alertList = [],
                    type, event,
                    stopClose = false,

                    $alert = $('#alertList'),


                    messageDialog = function () {
                        var queue = [],
                            clickHandler = function () {
                                var msg, result = true;
                                queue.shift();

                                if (queue.length) {
                                    msg = queue[0];
                                    while (queue.length && !msg) {
                                        queue.shift();
                                        msg = queue[0];
                                    }
                                    if (msg) {
                                        $(this).find('[data-role=message]').empty().append(msg.toString().replace(/\n/g, '<br/>'));
                                        result = false;
                                    }
                                }
                                return result;
                            };

                        return function (msg) {
                            var modal;

                            queue.push(msg);

                            if (queue.length === 1 && (msg = queue[0])) {

                                modal = app.modal || window.app && window.app.modal || function (option) {
                                    app.alert(option.content);
                                    clickHandler();
                                };

                                modal({
                                    title: '信息提示',
                                    btnCancel: '关闭',
                                    btnConfirm:false,
                                    confirmHandler: clickHandler,
                                    cancelHandler: clickHandler,
                                    content: '<div class="aui-ide-modal-content"><i class="iconfont icon-round_warming"></i><p data-role="message">' + msg.toString().replace(/\n/g, '<br/>') + '</p></div>',
                                    isDialog: true,
                                    isLargeModal: false,
                                    init: function () {
                                        var $body = $(this);
                                        setTimeout(function () {
                                            $body.prev().find('.close').off().remove();
                                        }, 100);
                                    }
                                });

                            }
                        }
                    }(),

                    addToQueue = function (args) {
                        var i, item, id,
                            result = false;

                        if (id = args[2]) {
                            for (i = -1; item = alertQueue[++i];) {
                                if (result = (item[2] === id)) {
                                    break;
                                }
                            }
                        }

                        if (!result) {
                            alertQueue.push(args);
                        }
                    },
                    delFormQueue = function () {
                        return alertQueue.shift();
                    },
                    execAlert = function (msg, type, id) {
                        var $item = null,
                            args;

                        //校验样式在_showType中
                        type = type || SHOW_TYPE._DEFAULT;

                        if (type === SHOW_TYPE.MESSAGE) {
                            messageDialog(msg + '');
                            console.info(msg);
                        } else {


                            msg += '';


                            if ($alert.children().length < alertQueueLength) {

                                if (!id || !$alert.children('[data-alert-id="' + id + '"]').length) {

                                    //使获取提示框列表时,1键的类型不会被替换成样式名
                                    args = JSON.parse(JSON.stringify(arguments));
                                    //使获取提示框列表时，即使2键的值为undefined，也不会被忽略
                                    if (!args[2]) {
                                        args[2] = 'undefined';
                                    }
                                    alertList.push(args);

                                    type = SHOW_TYPE[type] || SHOW_TYPE.info;

                                    $item = $alert
                                        .prepend(alertCttTemp.replace(/_id_/, id).replace(/_showType_/, type).replace(/_content_/, msg).replace(/_title_/, msg))
                                        .children(':first');

                                    //IE8下触发重绘
                                    $alert.css('visibility','inherit').css('visibility','visible');

                                    $item.attr('title', $item.text());

                                    // //出现
                                    setTimeout(function () {
                                        $item.addClass('out');
                                    }, 50 + Math.random() * 50);
                                    // //隐藏

                                    setTimeout(function () {
                                        if (!stopClose) {
                                            $item.removeClass('out');
                                            execNextAlert($item);
                                        }
                                    }, 10000 + Math.random() * 1000);
                                }
                            } else {
                                addToQueue(arguments);
                            }
                        }
                    },
                    execNextAlert = function ($lastElem) {
                        setTimeout(function () {
                            if ($lastElem) {
                                $lastElem.remove();
                                $lastElem = null;
                                alertList.shift();
                            }
                            if (alertQueue.length) {
                                execAlert.apply(this, delFormQueue());
                            }
                        }, 500);
                    },
                    alertFunc = function (msg, showType, id) {
                        event && event.trigger('alert', arguments);
                        if (msg instanceof Array) {
                            for (var i = -1, alt; alt = msg[++i];) {
                                if (alt instanceof Array) {
                                    execAlert(alt[0], alt[1], alt[2]);

                                } else {
                                    execAlert(alt, showType, id);
                                }
                            }
                        } else {
                            execAlert(msg, showType, id);
                        }
                    };


                //初始化数据
                if (!$alert.length) {
                    $alert = $(alertCtnTemp);
                    $alert.appendTo('body');
                }

                for (type in SHOW_TYPE) {
                    if (SHOW_TYPE.hasOwnProperty(type)) {
                        alertFunc[type] = SHOW_TYPE[type];
                    }
                }


                alertFunc.closeAll = function () {
                    alertQueue = [];
                    alertList = [];
                    $alert.empty();
                };

                alertFunc.close = function (option) {
                    var id, item, len;
                    if (!(option instanceof Object)) {
                        console.error('入参必须为对象');
                        return
                    }

                    id = option.id;

                    if (id) {
                        for (len = alertQueue.length; item = alertQueue[--len];) {
                            if ((item.length && ~Array.prototype.indexOf.call(item, id)) || item) {
                                alertQueue.splice(len, 1);
                                break;
                            }
                        }
                        if ($alert.children('[data-alert-id=' + id + ']').length) {
                            $('[data-alert-id=' + id + ']', $alert).remove();

                        }
                    } else {
                        console.error("id的值不能为'undefined'");
                    }
                };

                alertFunc.getAlertList = function () {
                    return alertList.concat(alertQueue);
                };

                alertFunc.listener = function (callback,nameSpace) {

                    !event && (event = app.dispatcher());

                    event.on('alert'+ nameSpace?nameSpace:'', function () {

                        callback && callback(arguments[1])

                    })
                };

                alertFunc.offListener = function(nameSpace){

                    event.off('alert'+ nameSpace?nameSpace:'')

                };




                //override alert
                window.alert = messageDialog;

                /*监听绑定*/
                //关闭按钮
                $alert.off().on('click', function (e) {
                    var $e = $(e.target || window.event.srcElement),
                        $ctt,$alertList,alertTop,
                        role = $e.attr('data-role'),
                        winHeight = $(window).height();

                    switch (role) {
                        case 'close':
                            $e.parent().removeClass('out');

                            execNextAlert($e.parent());

                            stopClose = false;
                            break;
                        case 'more':
                            $ctt = $e.siblings('.alert-content');
                            $alertList = $ctt.parent().parent();
                            alertTop = $alertList.css('top');

                            if ($e.hasClass('more')) {
                                stopClose = false;
                                $ctt.removeClass('more');
                                $ctt.css({'height': ''});
                            } else {
                                stopClose = true;
                                $ctt.addClass('more');
                                if($ctt.height() > winHeight) {
                                    $ctt.css({'height': winHeight - 52 - ( 2 * Number.parseFloat(alertTop))});
                                }

                            }
                            $e.toggleClass('more');

                            break;
                    }
                });

                /*详情请见api部分*/
                return alertFunc;
            },
alertAction:function(){

    var alertAction = {
            close: app.alert.close,
            closeAll: app.alert.closeAll,
            getAlertList: app.alert.getAlertList,
            listener: app.alert.listener
        };

    return alertAction;

},
behavior:function () {
    var _b = function (input1, input2, condition, callback) {
        var _input2, result;

        input2 = decodeURIComponent(input2);
        _input2 = input2;
        try {
            input2 = JSON.parse(input2);
        } catch (e) {
            input2 = _input2;
        }

        switch (condition) {
            case 'lt':
                result = (input1 < input2);
                break;
            case 'eq':
                result = (input1 === input2);
                break;
            case 'gt':
                result = (input1 > input2);
                break;
            case 'not':
                result = (input1 !== input2);
                break;
            case 'includes':
            case 'notIncludes':
                if (input2 instanceof Array) {
                    result = ($.inArray(input1, input2) !== -1);
                } else if (input2 instanceof Object) {
                    result = (input1 in input2);
                } else {
                    result = input2 && (input2.toString().indexOf(input1) !== -1);
                }

                if (condition === 'notIncludes') {
                    result = !result;
                }
                break;
            case 'startsWith':
                result = input2 && (input2.toString().indexOf(input1) === 0);
                break;
        }

        callback && callback(result, input1, input2, condition);
    };

    _b.LESS_THAN = 'lt';
    _b.EQUAL = 'eq';
    _b.GREAT_THAN = 'gt';
    _b.NOT = 'not';
    _b.INCLUDES = 'inclues';
    _b.NOT_INCLUDES = 'notInclues';
    _b.STARTS_WITH = 'startsWith';

    return _b;
},
collapse:function () {
    if (!($ && $.fn && $.fn.collapse)) {
        !function ($) {

            "use strict"; // jshint ;_;


            /* COLLAPSE PUBLIC CLASS DEFINITION
             * ================================ */

            var Collapse = function (element, options) {
                this.$element = $(element);
                this.options = $.extend({}, $.fn.collapse.defaults, options);

                if (this.options.parent) {
                    this.$parent = $(this.options.parent)
                } else {
                    var parentID = this.$element.attr('data-parent');

                    if (parentID) {
                        this.$parent = this.$element.closest(parentID);

                        if (!this.$parent.length) {
                            this.$parent = undefined;
                        }
                    }
                }

                this.options.toggle && this.toggle()
            };

            Collapse.prototype = {

                constructor: Collapse

                ,
                dimension: function () {
                    var hasWidth = this.$element.hasClass('width');
                    return hasWidth ? 'width' : 'height'
                }

                ,
                show: function () {
                    var dimension, scroll, actives, hasData;

                    if (this.transitioning || this.$element.hasClass('in')) return;

                    dimension = this.dimension();
                    scroll = $.camelCase(['scroll', dimension].join('-'));

                    //lijiancheng@cfischina.com
                    //2015/08/11 9:54
                    //如果是asideMenu则不会自动收起
                    if (this.$parent && !this.$parent.hasClass('aui-aside-menu-ctn')) {
                        actives = this.$parent && this.$parent.find('.aui-accordion-group > .in');
                        if (actives && actives.length) {
                            hasData = actives.data('collapse');
                            if (hasData && hasData.transitioning) return;
                            actives.collapse('hide');
                            actives.prev().children('a').addClass('collapsed');
                            hasData || actives.data('collapse', null)
                        }
                    }


                    this.$element[dimension](0);
                    this.transition('addClass', $.Event('show'), 'shown');
                    $.support.transition && this.$element[dimension](this.$element[0][scroll])
                }

                ,
                hide: function () {
                    var dimension;
                    if (this.transitioning || !this.$element.hasClass('in')) return;
                    dimension = this.dimension();
                    this.reset(this.$element[dimension]());
                    this.transition('removeClass', $.Event('hide'), 'hidden');
                    this.$element[dimension](0)
                }

                ,
                reset: function (size) {
                    var dimension = this.dimension();

                    this.$element
                        .removeClass('collapse')[dimension](size || 'auto')[0].offsetWidth;

                    this.$element[size !== null ? 'addClass' : 'removeClass']('collapse');

                    // lijiancheng@cfischina.com
                    // 2015/08/03 16:29
                    // 展开手风琴时滚动到当前部位
                    var $aside;
                    if (($aside = this.$element.closest('#auiAside')).length) {
                        $aside = $aside.find('.aside-menu:first');
                        app && app.scrollTop($aside, this.$element, 500, this.$element.prev().height());
                    }

                    return this
                }

                ,
                transition: function (method, startEvent, completeEvent) {
                    var that = this,
                        complete = function () {
                            if (startEvent.type == 'show') that.reset();
                            that.transitioning = 0;
                            that.$element.trigger(completeEvent)
                        };

                    this.$element.trigger(startEvent);

                    if (startEvent.isDefaultPrevented()) return;

                    this.transitioning = 1;

                    this.$element[method]('in');

                    $.support.transition && this.$element.hasClass('collapse') ?
                        this.$element.one($.support.transition.end, complete) :
                        complete()
                }

                ,
                toggle: function () {
                    this[this.$element.hasClass('in') ? 'hide' : 'show']()
                }

            };


            /* COLLAPSE PLUGIN DEFINITION
             * ========================== */

            var old = $.fn.collapse;

            $.fn.collapse = function (option) {
                return this.each(function () {
                    var $this = $(this),
                        data = $this.data('collapse'),
                        options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option);
                    if (!data) $this.data('collapse', (data = new Collapse(this, options)));
                    if (typeof option == 'string') data[option]()
                })
            };

            $.fn.collapse.defaults = {
                toggle: true
            };

            $.fn.collapse.Constructor = Collapse;


            /* COLLAPSE NO CONFLICT
             * ==================== */

            $.fn.collapse.noConflict = function () {
                $.fn.collapse = old;
                return this
            };


            /* COLLAPSE DATA-API
             * ================= */

            $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
                var $this = $(this),
                    href, target = $this.attr('data-target') ||
                        e.preventDefault() ||
                        (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
                    ,
                    option = $(target).data('collapse') ? 'toggle' : $this.data();
                $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed');
                $(target).collapse(option)
            })

        }(window.jQuery);
    }
},
Controller:function () {
    'use strict';

    var View = function (options, controller) {
            var _default = this._default,
                context = this,
                $left, $right,
                $contextMenu,
                $tabCtn,

                queryString, windowId, windowOptions;

            $.extend(true, context, _default, options);

            context.controller = controller;

            context.$ctn = $(context.ctn).addClass('hidden');
            context.$contextMenu = $contextMenu = $(context.contextMenuTemp);
            context.$ctn.prepend($contextMenu);

            context.$tabs = $(context.tabs, context.$ctn);
            context.$left = $left = $(context.leftBtnTemp);
            context.$right = $right = $(context.rightBtnTemp);

            context.$moveBtns = context.$left.add(context.$right);

            context.pagePopInstance = {};

            context.$tabs.wrap(context.tabCtnTemp);


            context.$tabCtn = $tabCtn = context.$tabs.parent();
            $tabCtn.prepend($left);
            $tabCtn.append($right);

            context.$ctt = $(context.ctt, context.$ctn);


            context.$tabs.on({
                'click.view': function (e) {
                    var $target = $(e.target || window.event.srcElement),
                        $item = $target.closest('[data-dom-id]'),
                        domID = $item.attr('data-dom-id');

                    if (domID) {
                        if ($target.attr('data-role') === 'close') {
                            context.close(domID);
                        } else {
                            context.switchView(domID);
                        }

                        return false;
                    }

                }
            });
            if (context.contextMenuOption) {
                context.$tabs.on({
                    'contextmenu.view': function (e) {
                        var $li = $(e.target || event.srcElement).closest('[data-dom-id]'),
                            $tabs = $li.parent(),
                            $contextMenu = context.$contextMenu,

                            contextMenuOption = context.contextMenuOption,
                            contextMenuCallback = context.contextMenuCallback,
                            html = '',
                            lineTemp,
                            index, menuList, menu, length;

                        if ($li.length) {
                            length = $tabs.children().length;
                            lineTemp = contextMenuOption.lineTemp;
                            index = $li.index();

                            if ($li.hasClass('active')) {
                                switch(length){
                                    case 1:
                                        menuList = contextMenuOption.ONLY;
                                        break;

                                    default:
                                        menuList = contextMenuOption.CURRENT;
                                }
                            } else {
                                switch (index) {
                                    case 0:
                                        menuList = contextMenuOption.FIRST;
                                        break;
                                    case length - 1:
                                        menuList = contextMenuOption.LAST;
                                        break;
                                    default:
                                        menuList = contextMenuOption._DEFAULT;
                                }

                            }
                            menuList = ([].concat(menuList)).reverse();

                            for (length = menuList.length;
                                 (menu = contextMenuOption[menuList[--length]]);) {
                                html += lineTemp
                                    .replace('_action_', menu.action)
                                    .replace('_filter_', menu.filter)
                                    .replace('_name_', menu.name);
                            }

                            $contextMenu
                                .empty().append(html.replace(/_index_/g, index))
                                .css(app.position(e, $(window), $contextMenu), -15, 0).removeClass('hide')
                                .off('.viewContextMenu')
                                .one({
                                    'click.viewContextMenu': function (e) {
                                        var $target = $(e.target || event.srcElement),
                                            action = $target.attr('data-action');

                                        if (action && action !== "undefined") {
                                            contextMenuCallback.doAction.call(context, $li, action);
                                        } else {
                                            contextMenuCallback.closeTab.call(context, $target.attr('data-filter'));
                                        }

                                        $contextMenu.addClass('hide');
                                    },
                                    'mouseleave.viewContextMenu': function () {
                                        $contextMenu.addClass('hide');
                                    }
                                });

                            $tabs.off('.viewContextMenu').one('mouseleave.viewContextMenu', function (e) {
                                if (!$(e.relatedTarget).closest('ul').hasClass('aweb-tab-content-menu')) {
                                    $contextMenu.addClass('hide');
                                }
                            });
                        }

                        return false;
                    }
                });
            }
            context.$moveBtns.on({
                'click.view': function () {
                    context.focusTab(undefined, $(this));
                }
            });

            app.screen.addResizeHandler({
                uid: app.getUID(),
                isGlobal: options.isGlobal,
                timeout: 500,
                callback: function () {
                    context.focusTab(context.$tabs.children('.active'));
                }
            });

            queryString = app.getQueryStringMap();

            if ((windowId = queryString[this.windowKey]) && (windowOptions = app.getData(windowId))) {
                windowOptions = JSON.parse(windowOptions);
                windowOptions.type = this.TYPE.BLANK;

                this.controller.open(windowOptions);
            }
        },

        Model = function (options, controller) {

            $.extend(true, this, options, {
                currentStep: -1,
                intervals: {},
                timeouts: {},
                _data: {
                    scope: {}
                }
            });

            this.controller = controller;

            this.uid = this.pageId = this.cacheId = this.domID;
        },

        Controller = function (options) {
            var context = this,
                _default = this._default,
                eventController;

            $.extend(true, this, _default, options);

            options.view.controller = this;

            this.context = this;
            this.event = app.dispatcher();
            this.Model = this.Model || Model;
            this.tab = new (options.View || View)(options.view, this);
            this.pages = {};

        };

    View.prototype = {
        version: 'AWOS 4.4_20171127',
        constructor: View,

        _default: {
            ctn: '[data-role=container]',

            tabs: '#tabs',

            ctt: '#spa-page-main',

            count: {},
            stack: [],

            contextMenuTemp: '<ul class="aweb-tab-content-menu hide"></ul>',
            tabCtnTemp: '<div class="aweb-tabs-container"></div>',
            tabTemp: '<li class="active" data-dom-id="_domID_" data-tab-id="_id_" data-href="_href_" title="_title_"><a>_title_</a>_button_</li>',
            leftBtnTemp: '<button type="button" title="左移标签" class="btn aweb-tabs-left hidden" data-role="left"><i class="fa fa-chevron-left"></i>',
            rightBtnTemp: '<button type="button" title="右移标签" class="btn aweb-tabs-right hidden" data-role="right"><i class="fa fa-chevron-right"></i></button>',
            closeButtonTemp: '<button type="button" data-role="close" class="close">&times;</button>',
            untitled: '未定义',

            cttTemp: '<div id="_domID_" />',

            ctnFullClassName: 'aweb-spa-ctn-full',
            cttFullClassName: 'aweb-spa-ctt-full',

            hideNavClass: 'hide',

            pathKeyInURL: 'page',
            fullscreenKeyInURL: 'fullscreen',
            displayNavKeyInURL: 'displayNav',

            windowKey: 'windowId',

            toUpdateTitle: true
        },

        TYPE: {
            BLANK: 'BLANK',
            SUB: 'SUB',
            SELF: 'SELF',
            WINDOW: 'WINDOW',
            POPOVER: 'POPOVER'
        },
        popOption: {
            popSwitch: false
        },

        open: function (options) {
            var TYPE = this.TYPE,


                ret = false,
                title = options.title || this.untitled,
                id = options.id,
                fixed = options.fixed,
                domID,
                href = $.camelCase(options.sections.join('-')),

                handler,context,

                $tabs = this.$tabs.children(),
                $tab, $renderTo;


            if (!this.stack.length && options.type === TYPE.SELF) {
                options.type = TYPE.BLANK;
            }


            if (!options.type || options.type === TYPE.BLANK) {
                $tab = id ? $tabs.filter('[data-tab-id="' + id + '"][data-href="' + href + '"]') : $tabs.filter('[data-href="' + href + '"]');

                if ($tab.length) {
                    domID = $tab.attr('data-dom-id');

                    this.switchView(domID, !$tab.length);
                } else {
                    if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.SUB || handler.type === TYPE.POPOVER)) {

                        switch (handler.type) {
                            case TYPE.SUB:
                                app.alert('系统错误 0x01：子页面下不能打开新页面！', app.alert.ERROR, '0x01');
                                break;
                            case TYPE.POPOVER:
                                app.alert('系统错误 0x01：气泡页面下不能打开新页面！', app.alert.ERROR, '0x01');
                                break;
                        }
                    } else {
                        domID = this.getUID(id || href);

                        this.$tabs.append(this.tabTemp.replace(/_domID_/, domID).replace(/_id_/, id).replace(/_href_/, href)
                            .replace(/_title_/g, title)
                            .replace(/_button_/, fixed ? '' : this.closeButtonTemp)
                        );

                        $renderTo = $(this.cttTemp.replace(/_domID_/, domID));
                        this.$ctt.append($renderTo);

                        ret = {
                            domID: domID,
                            $renderTo: $renderTo,
                            type: TYPE.BLANK
                        };
                    }
                }
            } else {
                switch (options.type) {
                    case TYPE.SELF:
                        //暂时阻止气泡页面下自身打开页面
                        if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.POPOVER)) {
                            app.alert('系统错误 0x01：气泡页面下不能打开自身页面！', app.alert.ERROR, '0x01');
                        } else {
                            handler = this.controller.getCurrentHandler();

                            this.controller.unload(handler.domID, true);

                            domID = this.getUID(id || href);

                            $renderTo = handler.$renderTo = this.updateTitleAndID(handler.type, handler.domID, domID, title, id, href, handler.$renderTo);

                            ret = {
                                $renderTo: handler.$renderTo,
                                domID: domID,
                                type: handler.type
                            };
                        }


                        break;
                    case TYPE.SUB:

                        if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.POPOVER)) {
                            app.alert('系统错误 0x01：气泡页面下不能打开子页面！', app.alert.ERROR, '0x01');
                        } else {
                            domID = this.getUID(id || href);

                            $renderTo = $(this.cttTemp.replace(/_domID_/, domID));

                            ret = {
                                $renderTo: $renderTo,
                                domID: domID,
                                type: TYPE.SUB
                            };

                            app.modal({
                                title: title,
                                content: '',
                                btnConfirm: options.btnConfirm || '关闭',
                                btnCancel: options.btnCancel || '取消',
                                init: function (controller) {
                                    var $body = $(this),
                                        $close = $('<button title="关闭子页面" type="button" class="close iconfont icon-topbar-close"></button>');

                                    $body.prev().prepend($close);
                                    $body.append($renderTo);

                                    $close.one('click', function () {
                                        controller.unload();

                                        $(this).closest('.modal').modal('hide');

                                        controller.tab.resumeView();
                                    });
                                },
                                confirmHandler: function (controller) {
                                    controller.unload();

                                    $(this).closest('.modal').modal('hide');

                                    controller.tab.resumeView();
                                },
                                cancelHandler: function (controller) {
                                    controller.unload();

                                    $(this).closest('.modal').modal('hide');

                                    controller.tab.resumeView();

                                },
                                width: options.width,
                                height: options.height,
                                args: [this.controller],
                                isLargeModal: true,
                                isDialog: true,
                                backdrop: 'static',
                                noFooter: !options.hasFooter,
                                noHeader: !options.title
                            });
                        }

                        break;
                    case TYPE.POPOVER:

                        if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.POPOVER)) {
                            app.alert('系统错误 0x01：气泡页面下不能打开新气泡页面！', app.alert.ERROR, '0x01');

                        } else {
                            domID = this.getUID(id || href);

                            $renderTo = $(this.cttTemp.replace(/_domID_/, domID));

                            ret = {
                                $renderTo: $renderTo,
                                domID: domID,
                                type: TYPE.POPOVER
                            };

                            context = this;
                            /*  //需要阻止第二次点击的时候仍然进行 popover 动作
                             if (this.popOption.popSwitch) {
                             this.popOption.popSwitch = !this.popOption.popSwitch;

                             } else {*/
                            app.popover({
                                $elem: options.$elem,
                                title: title,
                                content: '',
                                placement: 'auto left',
                                init: function (popIns, controller) {
                                    var $body = $(this).find('.aweb-popover-content');

                                    $body.append($renderTo);
                                    context.pagePopInstance = popIns;


                                },
                                confirmHandler: function (popIns, controller, popOption) {

                                    if (!popIns.popInstance.inState.click) {
                                        popOption.popSwitch = !popOption.popSwitch;
                                    }

                                    controller.unload();
                                    controller.tab.resumeView();

                                },

                                width: options.width,
                                height: options.height,
                                args: [this.controller, this.popOption]
                            });
                            /*  }*/
                        }

                        break;
                }
            }

            if (typeof options.fullscreen === 'boolean') {
                this.fullscreen(options.fullscreen);
            }

            if (typeof options.displayNav === 'boolean') {
                this.displayNav(options.displayNav);
            }

            return ret;
        },
        openWindow: function (options) {
            var optionStr = JSON.stringify(options || {}),
                windowId = app.getUID(),
                location = window.location || document.location,
                url = (location.origin || '') + location.pathname,
                a = document.createElement("a");

            app.setData(windowId, optionStr);

            window.open(url + '?' + app.getNewQueryStringURL({
                    windowId: windowId
                }));
        },
        close: function (domID, _doNotResume) {
            var handler,
                controller = this.controller,
                currentViewID = this.getCurrentView();

            handler = controller.getCacheHandler(domID) || controller.getCurrentHandler();
            domID = domID || currentViewID;

            if (handler) {

                if (handler.type === this.TYPE.SUB) {

                    controller.unload(domID, true);

                    handler.$renderTo.closest('.modal').modal('hide');



                } else {

                    if(/MSIE|Trident\/7\.0/i.test(navigator.userAgent)&& handler.type === this.TYPE.POPOVER){
                        this.pagePopInstance.close && this.pagePopInstance.close();
                    }

                    controller.unload(domID);

                    this.$tabs.children('[data-dom-id="' + domID + '"]').remove();
                    this.$ctt.children('#' + domID).remove();


                }

                if (!_doNotResume && domID === currentViewID) {
                    this.resumeView();
                }

            }
            return this;
        },

        getUID: function (domID) {

            if (this.count[domID]) {
                domID += (++this.count[domID]);
            } else {
                this.count[domID] = 1;
            }
            return domID;
        },
        updateTitleAndID: function (type, oldID, newID, title, id, href, $renderTo) {
            var TYPE = this.TYPE;

            title = title || this.untitled;

            switch (type) {
                case TYPE.SUB:
                    $renderTo.closest('.modal').children('.modal-header').children(':not(button)').text(title);
                    break;
                case TYPE.POPOVER:
                    $renderTo.closest('.aweb-popover').children('.aweb-popover-header').children('.aweb-popover-title').text(title);
                    break;
                default:
                    this.$tabs
                        .children('[data-dom-id="' + oldID + '"]')
                        .attr({
                            title: title,
                            'data-dom-id': newID,
                            'data-tab-id': id,
                            'data-href': href
                        })
                        .children('a').text(title);
                    break;
            }

            return $renderTo.attr('id', newID);
        },
        setTitle: function (uid, newTitle) {
            var TYPE = this.TYPE,
                model = this.controller.getCacheHandler(uid),
                $view;

            if (model && ($view = model.$renderTo)) {
                newTitle = newTitle || this.untitled;

                switch (model.type) {
                    case TYPE.SUB:
                        $view.closest('.modal').children('.modal-header').children(':not(button)').text(newTitle);
                        break;
                    default:
                        this.$tabs
                            .children('[data-dom-id="' + uid + '"]')
                            .attr({
                                title: newTitle
                            })
                            .children('a').text(newTitle);
                        break;
                }
            }
        },

        setCurrentView: function (domID) {
            if (domID) {
                var stack = [],
                    _stack = this.stack,
                    i, id;

                for (i = _stack.length; id = _stack[--i];) {
                    if (domID !== id) {
                        stack.push(id);
                    }
                }
                this.stack = stack.reverse();
                this.stack.push(domID);

                this.$ctn.removeClass('hidden');
            }
        },
        getCurrentView: function () {
            //字符串化
            return this.stack[this.stack.length - 1] + '';
        },
        removeView: function (domID) {
            if (domID) {
                var stack = [],
                    _stack = this.stack,
                    i, id;

                for (i = _stack.length; id = _stack[--i];) {
                    if (domID !== id) {
                        stack.push(id);
                    }
                }
                this.stack = stack.reverse();

                if (!stack.length) {
                    this.$ctn.addClass('hidden');
                    this.fullscreen(false);
                    this.displayNav(true);
                }
            }
        },


        switchView: function (domID, isLoad) {
            var

                lastDomID = this.getCurrentView(),
                $tab, $ctt, $page,
                model;

            if (isLoad || lastDomID !== domID) {


                model = this.controller.getCacheHandler(domID);

                if (model) {
                    this.controller.pause();

                    if ((model.type !== this.TYPE.SUB) && (model.type !== this.TYPE.POPOVER)) {
                        $tab = this.$tabs.children()
                            .removeClass('active')
                            .filter('[data-dom-id="' + domID + '"]').addClass('active');

                        $ctt = this.$ctt;

                        $page = $ctt.children('#' + lastDomID);
                        $page.attr('data-scroll-top', $page.parent().scrollTop()).addClass('hide');


                        $page = $ctt.children('#' + domID);
                        $page.removeClass('hide');
                        $page.parent().scrollTop($page.attr('data-scroll-top') || 0);

                        //因为弹窗和气泡已经trigger了
                        $(window).trigger('resize');
                    } else {
                        $ctt = this.$ctt;
                        $page = $ctt.children('#' + lastDomID);
                        $page.attr('data-scroll-top', $page.parent().scrollTop());

                        $page = model.$renderTo;
                        $page.removeClass('hide');
                    }


                    !isLoad && this.controller.resume(domID);

                    this.setCurrentView(domID);

                    this.focusTab($tab);
                }


            }
        },
        resumeView: function () {
            var TYPE = this.TYPE,
                lastDomID = this.getCurrentView(),
                handler = this.controller.getCurrentHandler(),
                domID,
                $tab, $ctt, $page, model;

            if (handler) {
                domID = handler.domID;
                model = this.controller.getCacheHandler(domID);

                if ((model.type !== this.TYPE.SUB) && (model.type !== this.TYPE.POPOVER)) {
                    $tab = this.$tabs.children()
                        .removeClass('active')
                        .filter('[data-dom-id="' + domID + '"]').addClass('active');

                    $ctt = this.$ctt;


                    $page = $ctt.children('#' + lastDomID);
                    $page.attr('data-scroll-top', $page.parent().scrollTop()).addClass('hide');

                    $page = $ctt.children('#' + domID);
                    $page.removeClass('hide');
                    $page.parent().scrollTop($page.attr('data-scroll-top') || 0);

                    //因为弹窗和气泡已经trigger了
                    $(window).trigger('resize');
                }
                this.controller.resume(domID);

                this.focusTab($tab);
            }
        },
        focusTab: (function () {
            var _focusTab = function ($tab, $btn) {
                    var widths = 0,
                        totalWidths = 0,

                        $tabCtn = this.$tabCtn,
                        $tabs = this.$tabs,
                        $lis = $tabs.children($tab ? ':lt(' + ($tab.index() + 1) + ')' : undefined),
                        $tabBtn = $btn || this.$left,
                        marginLeft,

                        tabsContainerWidth = $tabCtn.innerWidth() - $tabBtn.outerWidth() * 4.2,
                        tabsOffsetLeft = parseInt($tabs.css('left'), 10);


                    $lis.each(function (index, elem) {
                        widths += $(elem).outerWidth();
                    });

                    if (!$tab) {
                        totalWidths = widths;
                    } else {
                        $tabs.children().each(function (index, elem) {
                            totalWidths += $(elem).outerWidth();
                        });
                    }

                    this.$moveBtns[totalWidths < tabsContainerWidth ? 'addClass' : 'removeClass']('hidden');


                    if ($btn) {
                        if ($btn.attr('data-role') === 'left') {
                            tabsOffsetLeft += tabsContainerWidth;
                        } else {
                            tabsOffsetLeft -= tabsContainerWidth;
                        }
                    } else {
                        tabsOffsetLeft = tabsContainerWidth - widths;
                    }

                    if (tabsContainerWidth - widths > tabsOffsetLeft) {

                        tabsOffsetLeft = tabsContainerWidth - widths;
                    } else if (tabsOffsetLeft > 0) {
                        marginLeft = totalWidths < tabsContainerWidth ? 0 : $tabBtn.outerWidth();

                        tabsOffsetLeft = tabsOffsetLeft > marginLeft ? marginLeft : tabsOffsetLeft;
                    }

                    $tabs.animate({
                        'left': tabsOffsetLeft + 'px'
                    }, 500);
                },
                focusTabHandler = null;

            return function ($tab, $btn) {
                var context = this;
                if (focusTabHandler) {
                    clearTimeout(focusTabHandler);
                    focusTabHandler = null;
                }

                focusTabHandler = setTimeout(function () {
                    _focusTab.call(context, $tab, $btn);
                }, 200);
            }
        }()),

        fullscreen: function (fullscreen) {
            this.$ctn[fullscreen ? 'addClass' : 'removeClass'](this.ctnFullClassName);

            app.shelter[fullscreen ? 'upperZIndex' : 'lowerZIndex']();

            this.focusTab();
        },
        isFullScreen: function () {
            return this.$ctn.hasClass(this.ctnFullClassName);
        },
        displayNav: function (show) {
            this.$tabCtn[show ? 'removeClass' : 'addClass'](this.hideNavClass);
            this.$ctt[show ? 'removeClass' : 'addClass'](this.cttFullClassName);

            this.focusTab();
        },
        isDisplayNav: function () {
            return !this.$tabCtn.hasClass(this.hideNavClass);
        }
    };

    Model.prototype = {
        version: 'AWOS 4.4_20171127',
        constructor: Model,

        load: function () {
            return this.stepTo(0);
        },
        pause: function () {
            var data = this._data;

            try {
                if (data && data.bootstrap && data.bootstrap.pause) {

                    this.controller.trigger(this.controller.STATUS.BEFORE_PAUSE, this);

                    data.bootstrap.pause.call(this, data.$el, data.scope, this);

                    this.controller.trigger(this.controller.STATUS.AFTER_PAUSE, this);
                }
            } catch (e) {
                if (window.aweb.error) {
                    app.alert(e.message, app.alert.ERROR);
                }
                if (window.aweb.log) {
                    console.error(e);
                }
            }

            this.stopAsyncEvent();

            return this;
        },
        resume: function () {
            var data = this._data;

            try {
                if (data && data.bootstrap && data.bootstrap.resume) {
                    this.controller.trigger(this.controller.STATUS.BEFORE_RESUME, this);

                    data.bootstrap.resume.call(this, data.$el, data.scope, this);

                    this.controller.trigger(this.controller.STATUS.AFTER_RESUME, this);
                }
            } catch (e) {

                if (window.aweb.error) {
                    app.alert(e.message, app.alert.ERROR);
                }
                if (window.aweb.log) {
                    console.error(e);
                }
            }

            this.startAsyncEvent();

            return this;
        },
        unload: function (keepDom) {
            if (this.currentStep !== -1) {
                var data = this._data;

                try {
                    if (data && data.bootstrap && data.bootstrap.unload) {
                        this.controller.trigger(this.controller.STATUS.BEFORE_UNLOAD, this);

                        data.bootstrap.unload.call(this, data.$el, data.scope, this);

                        this.controller.trigger(this.controller.STATUS.AFTER_UNLOAD, this);
                    }
                } catch (e) {
                    if (window.aweb.error) {
                        app.alert(e.message, app.alert.ERROR);
                    }
                    if (window.aweb.log) {
                        console.error(e);
                    }
                } finally {
                    this.undelegateEvents();
                    this.stopAsyncEvent(true);

                    if (!keepDom) {
                        data.$el.remove();
                        delete this._data.$el;

                        if (window.$AW) {
                            delete window.$AW._css[this.domID];
                        }
                    } else {
                        data.$el.empty();
                    }

                    delete this.timeouts;
                    delete this.intervals;


                    this.timeouts = {};
                    this.intervals = {};
                }
            }

            return this;
        },

        stepTo: function (step) {
            var
                handler = this,
                cache = handler._data && handler._data.scope,
                module = handler.conf,
                modulePath = handler.path,
                oFlow = module.flows[step],
                oView = module.views[oFlow.id],
                dtd = $.Deferred();

            //防止刷新时，pageParams不一致
            if (cache && !$.isEmptyObject(cache)) {
                app.domain.exports('page', cache);
            }

            this.unload(true);

            require([this.getTextURL(modulePath + oView.template, handler.server), this.getJavascriptURL(modulePath + oView.js, handler.server)],
                function (template, bootstrap) {
                    var data = handler._data,
                        $div = $('<div/>'),
                        $el;


                    handler.$renderTo.empty().append($div);
                    template && $div.append(template);
                    $el = data.$el = handler.$renderTo;

                    if($.isFunction(bootstrap)){
                        bootstrap=bootstrap();
                    }
                    if($.isFunction(bootstrap)){
                        bootstrap=bootstrap();
                    }

                    data.bootstrap = bootstrap;

                    try {
                        if (data && data.bootstrap && data.bootstrap.load) {
                            bootstrap.load.call(handler, $el, data.scope, handler);
                        }

                        handler.currentStep = step;

                        handler.controller.trigger(handler.controller.STATUS.AFTER_LOAD, handler);

                        if (window.aweb.log) {
                            console.log(new Date().toTimeString() + '：加载' + handler.path + '完毕，唯一ID（domID）：' + handler.domID + '，页面ID（id）：' + handler.id + '，当前步数（currentStep）：' + step + '');
                        }
                    } catch (e) {
                        if (window.aweb.error) {
                            app.alert(e.message, app.alert.ERROR);
                        }
                        if (window.aweb.log) {
                            console.error(e);
                        }
                    } finally {
                        dtd.resolve();
                    }
                });

            return dtd.promise();
        },

        setTimeout: function (option) {
            var handler = this;

            if (option.immediate) {
                option.callback ? option.callback() : option.func();
            }

            option.clock = option.clock || 0;
            option.uniqueId = option.uniqueId || app.getUID();
            option.windowId = window.setTimeout(function () {
                option.callback ? option.callback() : option.func();

                handler.removeAsyncEvent(handler.timeouts, option.uniqueId);
            }, option.clock);

            handler.timeouts[option.uniqueId] = option;

            return option.uniqueId;
        },
        clearTimeout: function (uniqueId) {
            var e = this.timeouts[uniqueId];

            if (e) {
                window.clearTimeout(e.windowId);
                this.removeAsyncEvent(this.timeouts, e.uniqueId);
            }
        },
        setInterval: function (option) {
            var handler = this;

            if (option.immediate) {
                option.callback ? option.callback() : option.func();
            }

            option.clock = option.clock || 0;
            option.uniqueId = option.uniqueId || app.getUID();
            option.windowId = window.setInterval(option.times ? function () {
                if (option.times) {

                    option.times--;
                    option.callback ? option.callback() : option.func();
                } else {
                    handler.removeAsyncEvent(handler.timeouts, option.uniqueId);
                }
            } : (option.callback || option.func), option.clock);

            handler.intervals[option.uniqueId] = option;

            return option.uniqueId;
        },
        clearInterval: function (uniqueId) {
            var e = this.intervals[uniqueId];

            if (e) {
                window.clearInterval(e.windowId);
                this.removeAsyncEvent(this.intervals, e.uniqueId);
            }
        },
        updateInterval: function (uniqueId, option) {
            var handler = this,
                e = handler.intervals[uniqueId];

            if (e) {
                this.clearInterval(e.uniqueId);

                return this.setInterval($.extend(true, e, option));
            }
        },
        startAsyncEvent: function () {
            var i, map, item,
                handler = this;

            map = this.intervals;
            for (i in map) {
                if ((item = map[i]) && item.isPause) {

                    item.windowId = window.setInterval(item.times ? (function (item, handler) {
                        return function () {
                            if (item.times) {
                                item.times--;
                                item.callback ? item.callback() : item.func();
                            } else {
                                handler.removeAsyncEvent(handler.timeouts, item.uniqueId);
                            }
                        };
                    }(item, handler)) : (item.callback || item.func), item.clock);
                }
            }

            map = this.timeouts;
            for (i in map) {
                if ((item = map[i]) && item.isPause) {
                    item.windowId = window.setTimeout((function (item, handler) {
                        return function () {
                            item.callback ? item.callback() : item.func();

                            handler.removeAsyncEvent(handler.timeouts, item.uniqueId);
                        }
                    }(item, handler)), item.clock);
                }
            }

            i = null, item = null, map = null;
        },
        stopAsyncEvent: function (isUnload) {
            var i, map, item;

            map = this.intervals;
            for (i in map) {
                if ((item = map[i]) && (isUnload || item.isPause)) {
                    window.clearInterval(map[i].windowId);
                }
            }

            map = this.timeouts;
            for (i in map) {
                if ((item = map[i]) && (isUnload || item.isPause)) {
                    window.clearTimeout(map[i].windowId);
                }
            }
        },
        removeAsyncEvent: function (arr, uniqueId) {
            if (arr[uniqueId]) {
                arr[uniqueId] = null;
                delete arr[uniqueId];
            }
        },


        delegateEvents: function (events) {
            var context = this,
                $el = context._data.$el || context.$renderTo,
                method, match, eventName, selector, $selector, key, touchName,
                map = {},
                intercept,
                $ = jQuery;

            this.undelegateEvents();
            for (key in events) {
                if (events.hasOwnProperty(key)) {
                    method = events[key];

                    if (!this.isFunction(method)) method = this[events[key]];

                    if (!method) continue;

                    match = key.match(this.delegateEventSplitter);

                    eventName = match[1];
                    selector = match[2];

                    eventName += '.previewEvents';
                    if (selector === '') {
                        $el.on(eventName, method);
                    } else {
                        $selector = $(selector, $el);


                        if ($selector.length) {
                            // (touchName = eventName.split(".")[0]) && touchType[touchName] && $selector.addClass("waves-effect");
                            $selector
                                .on(eventName, method)
                                .attr('data-aweb-event', true);
                        }

                        if (!map[eventName]) {
                            map[eventName] = {};
                            $el.on(eventName, {
                                eventName: eventName
                            }, function (e) {
                                var $e = $(e.target || window.event.srcElement),
                                    $selector,
                                    selector, items = map[e.data.eventName];

                                for (selector in items) {
                                    if (items.hasOwnProperty(selector)) {
                                        $selector = $e.closest($(selector, $el));

                                        if ($selector.attr('data-aweb-event')) {
                                            break;
                                        } else if ($selector.length) {
                                            return items[selector].apply($e[0], arguments);
                                        }
                                    }
                                }
                            });
                        }

                        map[eventName][selector] = method;
                    }
                }
            }


            if (window.aweb && window.aweb.headless && window.aweb.headless.on) {
                intercept = function (e) {
                    var $target = $(e.target || event.srcElement);

                    console.log(new Date().toString() + ':' + context.path + '触发了' + e.type + '，元素是:' + $target);
                };
                $el.on({
                    'click.debug': intercept,
                    'focus.debug': intercept,
                    'keydown.debug': intercept
                });
            }
        },
        undelegateEvents: function () {
            this._data.$el && this._data.$el.off();
        },
        isFunction: function (obj) {
            return ((typeof obj === 'function') || false);
        },
        delegateEventSplitter: /^(\S+)\s*(.*)$/,

        getController: function () {
            return this.controller;
        },



        getTextURL : function (mvvmConfPath, server) {
            return "text!./" + (server || '') + mvvmConfPath + (aweb.debug?("?timestamp=" + new Date().getTime()):'');
        },
        getJavascriptURL : function (mvvmConfPath, server) {
            return (server || '') + mvvmConfPath + "?timestamp=" + (aweb.debug?("?timestamp=" + new Date().getTime()):'');
        },
        validateModule : function (module) {
            var error = [],
                flows = module.flows,
                views = module.views,
                i, flow;

            if (!views) {
                error.push("views必需定义！");
            }

            if (flows && flows.length) {
                for (i = -1; flow = flows[++i];) {
                    if (!flow.id) {
                        error.push("flows中位置为" + i + "的流程需包含关联view的id！");
                    } else {
                        if (views && !views[flow.id]) {
                            error.push("flows中位置为" + i + "的流程id关联的view未在views中定义！");
                        }
                    }
                }
            } else {
                error.push("flows必需为长度大于0的数组！");
            }

            return error;
        }
    };

    Controller.prototype = {
        version: 'AWOS 4.4_20171127',
        constructor: Controller,
        _default: {
            conf: {},
            cache: {},
            modulesPath: "module",
            separator: "/",
            mvvmConfName: "mvvm.json",
            modulePath404: "module/error/404/"
        },

        STATUS: {
            AFTER_LOAD: 'afterLoad',
            BEFORE_PAUSE: 'beforePause',
            AFTER_PAUSE: 'afterPause',
            BEFORE_RESUME: 'beforeResume',
            AFTER_RESUME: 'afterResume',
            BEFORE_UNLOAD: 'beforeUnload',
            AFTER_UNLOAD: 'afterUnload'
        },

        getDefaultModulesPath: function () {
            return this.modulesPath;
        },
        getDefaultMVVMConfName: function () {
            return this.mvvmConfName;
        },
        getDefaultSeparator: function () {
            return this.separator;
        },
        getCurrentHandler: function () {
            return this.cache[this.tab.getCurrentView()];
        },

        getMVVM404: function () {
            return {
                path: this.modulePath404,
                conf: this.conf[this.modulePath404]
            };
        },

        getCacheHandler: function (domID) {
            return this.cache[domID];
        },
        addCacheHandler: function (handler) {
            this.cache[handler.domID] = handler;
        },
        removeCacheHandler: function (domID) {
            if (this.cache[domID]) {
                delete this.cache[domID];

                this.tab.removeView(domID);
            }
        },

        load: function (options) {
            var modulePath = this.getDefaultModulesPath() + this.getDefaultSeparator(),
                $renderTo,
                id, domID,
                result, type,
                handler,
                context = this,
                sections = [];

            if (options.sections instanceof Array) {
                sections = sections.concat(options.sections);
            }

            if (sections.length) {
                modulePath += (sections.join(this.getDefaultSeparator()) + this.getDefaultSeparator());
                id = options.id;

                if (options.type !== View.prototype.TYPE.WINDOW) {
                    app.shelter.show('正在加载页面，请稍候…');
                    require([context.Model.prototype.getTextURL(modulePath + this.getDefaultMVVMConfName(), options.server)], function (mvvmConf) {
                        try {
                            var error;

                            if (!mvvmConf) {
                                app.alert('系统错误 0x05：获取页面失败！', app.alert.ERROR, '0x05');
                            } else {
                                mvvmConf = JSON.parse(mvvmConf);

                                if ((error = context.Model.prototype.validateModule(mvvmConf)).length) {
                                    app.alert(error, app.alert.ERROR);
                                } else {
                                    if (result = context.tab.open(options)) {

                                        domID = result.domID;
                                        $renderTo = result.$renderTo;
                                        type = result.type;
                                        context.pages[domID] = options;
                                        try {
                                            handler = new context.Model({
                                                conf: mvvmConf,
                                                path: modulePath,
                                                $renderTo: $renderTo,
                                                id: id,
                                                domID: domID,
                                                controller: context,
                                                type: type,
                                                server: options.server,
                                                option: options
                                            }, context);
                                        } catch (e) {
                                            error = context.getMVVM404();

                                            handler = new context.Model({
                                                conf: error.conf,
                                                path: error.path,
                                                $renderTo: $renderTo,
                                                id: id,
                                                domID: domID,
                                                controller: context,
                                                type: type,
                                                errorMsg: e.message,
                                                server: options.server,
                                                option: options
                                            }, context);
                                        } finally {
                                            context.addCacheHandler(handler);

                                            //如果是SELF的时候，handler指的是上一次的type，而不是这一次的type
                                            if (options.type === context.tab.TYPE.SELF) {
                                                context.tab.setCurrentView(handler.domID);
                                            } else {
                                                context.tab.switchView(handler.domID, true);
                                            }

                                            $.when(handler.load()).done(function () {
                                                app.shelter.hide();
                                            });
                                        }
                                    } else {
                                        app.shelter.hide();
                                    }
                                }
                            }

                        } catch (e) {
                            if (window.aweb.log) {
                                console.error(e);
                            }

                            if (window.aweb.error) {
                                app.alert('系统错误 0x04：内容运行报错，详情见控制台！', app.alert.ERROR, '0x04');
                            }

                            app.shelter.hide();
                        }
                    });
                } else {
                    this.tab.openWindow(options);
                }

            } else {
                if (window.aweb.error) {
                    app.alert('系统错误 0x01：页面路径为空！', app.alert.ERROR, '0x01');
                }

            }
        },
        pause: function () {
            var handler = this.getCurrentHandler();

            if (handler) {
                handler.pause();
            }
        },
        resume: function (domID) {

            if (!domID) {
                debugger;
            }
            var
                handler = this.getCacheHandler(domID);

            if (handler) {
                handler.resume();
            }
        },
        unload: function (domID, keepDom) {

            var handler = domID ? this.getCacheHandler(domID) : this.getCurrentHandler();

            if (handler) {
                handler.unload(keepDom);

                this.removeCacheHandler(handler.domID);
            }
        },

        open: function (options) {
            if (options.status) {

                app.domain.exports('page', options.content);

                options.sections = options.page.split("#");

                this.load(options);

            } else if (options.errorMsg) {
                app.alert(options.errorMsg, app.alert.ERROR);
            }
        },

        getView: function () {
            return this.tab;
        },


        on: function () {
            this.event.on.apply(this.event, arguments);
        },
        off: function () {
            this.event.off.apply(this.event, arguments);
        },
        trigger: function () {
            this.event.trigger.apply(this.event, arguments);
        }
    };

    Controller.View = View;
    Controller.Model = Model;

    return Controller;
},
deepClone:function (obj) {
        function _clone(obj) {
            var newObj;
            if (typeof obj === 'string') {
                //字符串
                newObj = '' + obj;
            } else if ($.isArray(obj)) {
                //数组
                newObj = $.map(obj, function (elem) {
                    return _clone(elem);
                });
            } else if (typeof obj === 'object') {
                //对象
                newObj = {};
                for (var name in obj) {
                    if (obj[name] instanceof Function) {
                        newObj[name] = obj[name];
                    } else {
                        newObj[name] = _clone(obj[name]);
                    }
                }
            } else {
                newObj = obj;
            }

            return newObj;
        }

        return _clone(obj);
    },
dispatcher:function () {
    var Event = function (timeout) {

        this.timeout = timeout;
        this.cache = {};
        this.delayHandler = {};
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
        off: (function () {
            var removeCallbackByNamespace = function (events, namespace) {
                var j, event;

                for (j = events.length; event = events[--j];) {
                    if (event.namespace.indexOf(namespace) !== -1) {
                        events.splice(j, 1);
                        break;
                    }
                }
            };

            return function (type) {
                var types, key,
                    p, i, namespace;

                if (type) {
                    types = type.split(',');

                    for (i = types.length; type = types[--i];) {
                        p = type.split('.');

                        namespace = p.slice(1, p.length).join('.') || '';
                        type = p[0];

                        if (!type) {
                            for (key in this.cache) {
                                if (this.cache.hasOwnProperty(key)) {
                                    if (namespace) {
                                        removeCallbackByNamespace(this.cache[key] || [], namespace);
                                    } else {
                                        delete this.cache[key];
                                    }
                                }
                            }
                        } else {
                            if (namespace) {
                                removeCallbackByNamespace(this.cache[type] || [], namespace);
                            } else {
                                delete this.cache[type];
                            }
                        }
                    }
                } else {
                    this.cache = {};
                }
            }
        }()),
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
                                if (event.namespace.indexOf(namespace) === -1) {
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

            if (this.timeout) {
                window.clearTimeout(this.delayHandler[type]);
                this.delayHandler[type] = window.setTimeout(function () {
                    context.dispatchEvent.apply(context, args);
                }, this.timeout);
            } else {
                context.dispatchEvent.apply(context, args);
            }
        }
    };

    return function (timeout) {
        return new Event(timeout);
    };
},
domain:function () {
    var domain = {
        /**
         * [session 初始化session存储字段]
         * @type {Object}
         */
        session: {},

        /**
         * [scope 页面间数据交互存储域]
         * @type {Object}
         */
        scope: {},

        /**
         * [exports 导出数据到全局共享域]
         * @param  {[type]} namespace        [命名空间]
         * @param  {[type]} data        [字段json]
         */
        exports: function (namespace, data) {
            var cache;

            if (aweb.debug) {
                var handler = app.router && app.router.getCurrentHandler();

                if (data && handler) {
                    console.log(['页面模型：', handler.path, ' 设置跨页缓存，命名空间为:', namespace, '，数据为'].join(''));
                    console.log(data);
                }
            }

            domain.clearScope(namespace);

            if (!domain.scope[namespace]) {
                domain.scope[namespace] = {};
            }
            cache = domain.scope[namespace];

            if (data) {
                for (var name in data) {
                    //清除缓存数据时，可能清除原先数据的bug
                    if (typeof data[name] === 'string') {
                        //字符串
                        cache[name] = '' + data[name];
                    } else if ($.isArray(data[name])) {
                        //数组
                        cache[name] = [].concat(data[name]);
                    } else if (typeof data[name] === 'object') {
                        //对象
                        if (data[name] === null) {
                            cache[name] = null;
                        } else {
                            cache[name] = $.extend(true, {}, data[name]);
                        }
                    } else {
                        //函数
                        cache[name] = data[name];
                    }
                }
            }
        },

        /**
         * [clearScope 根据id清除全局共享域中的数据]
         * @param  {[type]} namespace [命名空间]
         */
        clearScope: function (namespace) {
            if (domain.scope[namespace]) {

                if (aweb.debug) {
                    var handler = app.router && app.router.getCurrentHandler();

                    if (handler) {
                        console.log(['页面模型：', handler.path, ' 清除跨页缓存，命名空间为:', namespace].join(''));
                    }
                }

                delete domain.scope[namespace];
            }
        },

        /**
         * [get 获取共享域中数据]
         * @param  {[type]} namespace  [命名空间]
         * @param  {[type]} name       [字段名]
         */
        get: function (namespace, name) {
            var cache;

            if (domain.scope[namespace]) {
                cache = (name === undefined ? domain.scope[namespace] : domain.scope[namespace][name]);

                if (aweb.debug) {
                    var handler = app.router && app.router.getCurrentHandler();

                    if (handler) {
                        console.log(['页面模型：', handler.path, ' 获取跨页缓存，命名空间为:', namespace, '，数据为'].join(''));
                        console.log(cache);
                    }
                }

                return cache;
            }
        }
    };

    return domain;
},
eval:function (str) {

                    var func;

                    eval('func=' + str.replace('_parseFunction_', ''));

                    return func;
                },
getData:function (name, fromCookie) {
    function getCookie(name) {
        var value = document.cookie.match(new RegExp(name + '=([^;]+)'));

        return value && value.length ? value[1] : '';
    }

    var value,
        decoder = window.decodeURI || window.decodeURIComponent || window.unescape;

    if (fromCookie) {
        value = getCookie(name);
    } else {
        try {
            value = window.localStorage.getItem(name);

            if (!value) value = getCookie(name); //如果是保存在Cookie那里
        } catch (e) { //如果禁用localStorage将会抛出异常
            value = getCookie(name);
        }
    }
    return decoder(value);
},
getFormatData:function () {
    var TYPE = {
            MONEY: "money",
            BANDCARD: "bandcard"
        },
        transFun = function (num, type) {
            var arr = [], str = "";
            switch (type) {
                case "money":
                    num = num.toFixed(2);
                    num = parseFloat(num);
                    num = num.toLocaleString();
                    if (num.indexOf(".") === -1) {
                        num = num + ".00"
                    }
                    return num;
                    break;
                case "bandcard":
                    num = num.toString();
                    if (num.length !== 16) {
                        return
                    }
                    arr = num.split("");
                    arr.splice(4, 0, " ");
                    arr.splice(9, 0, " ");
                    arr.splice(14, 0, " ");
                    str = arr.join("");
                    return str;
                    break;

                default:
                    break;
            }
        };

    transFun.TYPE = TYPE;
    return transFun;
},
getNewQueryStringURL:function (params) {
        var map = $.extend(this.getQueryStringMap(), params),
            encoder = window.encodeURI || window.encodeURIComponent,
            prop,
            ret = [];

        for (prop in map) {
            if (map.hasOwnProperty(prop)) {
                ret.push(prop + '=' + encoder(map[prop]));
            }
        }

        return ret.join('&');
    },
getQueryStringMap:function () {
    var hash = window.location.hash || document.location.hash,
        search = window.location.search || document.location.search || '',
        decoder = window.decodeURI || window.decodeURIComponent,
        matcher,
        i, length, params,
        result = {};

    if (hash && !search) {

        search = '?' + hash.split('?')[1];

    }
    matcher = search.match(/[\?\&][^\?\&]+=[^\?\&]+/g);
    if (matcher) {
        for (i = 0, length = matcher.length; i < length; i++) {
            params = (matcher[i] || '').substring(1).split('=');
            result[params[0]] = decoder(params[1]);
        }
    }

    return result;
},
getServerUrl:function () {
    return window.serverUrl || '';
},
getUA:function () {
    var TYPE = {
            WEIXIN_IPAD: 'weixin iPad',
            WEIXIN_IPHONE: 'weixin iPhone',
            WEIXIN_ANDROID_PHONE: 'weixin androidPhone',
            WEIXIN_ANDROID_PAD: 'weixin androidPad',

            ALIPAY_IPAD: 'Alipay iPad',
            ALIPAY_IPHONE: 'Alipay iPhone',
            ALIPAY_ANDROID_PHONE: 'Alipay androidPhone',
            ALIPAY_ANDROID_PAD: 'Alipay androidPad',

            //手机网页
            IPHONE: 'iPhone',
            IPAD: 'iPad',
            ANDROID_PHONE: 'androidPhone',
            ANDROID_PAD: 'androidPad',

            //PC浏览器
            MSIE: 'IE6~10' || 'Ionic IE6~10',//考虑在本地IE浏览器运行时的情况
            IE11: 'IE11' || 'Ionic IE11', //考虑在本地IE11浏览器运行时的情况
            MICROSOFT_EDGE: 'Edge' || 'Ionic Edge',//考虑在本地Edge浏览器运行时的情况
            PC_NOT_IE: 'PC' || 'Ionic',//考虑在本地浏览器运行时的情况


            //类似于Ionic在本地搭建服务器的APP
            IONIC_IPAD: 'Ionic iPad',
            IONIC_IPHONE: 'Ionic iPhone',
            IONIC_ANDROID_PHONE: 'Ionic androidPhone',
            IONIC_ANDROID_PAD: 'Ionic androidPad',

            //类似于cordova的本地APP
            CORDOVA_IPAD: 'Cordova iPad',
            CORDOVA_IPHONE: 'Cordova iPhone',
            CORDOVA_ANDROID_PHONE: 'Cordova androidPhone',
            CORDOVA_ANDROID_PAD: 'Cordova androidPad'

        },
        config = [
            /* {  name: 'android',
             reg: /android/i
             },
             {
             name: 'ios',
             reg: /\(i[^;]+;( U;)? CPU.+Mac OS X/i
             },*/
            //环境
            {
                name: 'Cordova',
                reg: /^file/i
            },
            {
                name: 'Ionic',
                reg: /^http:\/\/localhost:8080/i
            },
            {
                name: 'weixin',
                reg: /MicroMessenger/i
            },
            {
                name: 'Alipay',
                reg: /Alipay/i
            },
            /*{
             name:'MQQBrower',
             reg:/MQQBROWSER/i
             },
             {
             name:'UC Browser',
             reg:/UCWEB/i
             },*/

            //设备
            {
                name: 'androidPhone',
                reg: /^(?=.*(Android))(?=.*(Mobile)).+$/i
            },
            {
                name: 'androidPad',
                reg: /^(?=.*(Android))(?!.*(Mobile)).+$/i
            },
            {
                name: 'iPad',
                reg: /iPad/i
            },
            {
                name: 'iPhone',
                reg: /iPhone/i
            },
            //浏览器
            {
                name: 'IE6~10',
                reg: /MSIE/i
            },
            {
                name: 'IE11',
                reg: /Trident\/7\.0/i
            },
            {
                name: 'Edge',
                reg: /Edge/i
            }

        ],

        len = config.length,


        getUAFunc = function () {
            var
                UA = navigator.userAgent,
                url = document.URL,
                result = [],
                item, reg, k;

            if (UA && url) {

                for (k = 0; k < len; k++) {
                    if ((item = config[k]) && (reg = item.reg) && reg.test(UA)) {
                        result.push(item.name);
                    }
                }
            }
            result = (result.length ? result.join(' ') : TYPE.PC_NOT_IE);
            return result
        };
    getUAFunc.TYPE = TYPE;


    return getUAFunc
},
getUID:function () {
    var sId = "",
        i = 24;
    for (; i--;) {
        sId += Math.floor(Math.random() * 16.0).toString(16).toUpperCase();
        if (i == 4) {
            sId += "-";
        }
    }
    return sId;
},
hsla:function () {
    var css = function (opt, random) {
        var $elem = $('<div>'),
            targetCSS = 'background-color',
            css;

        opt = $.extend(opt, this.defaltOptions);

        $elem.css(targetCSS, 'hsl(' + [(random ? Math.floor(Math.random() * 361) : opt.h), opt.s, opt.l].join(',') + ')');

        try {
            css = $elem.css(targetCSS).toString();
        } catch (e) {
            //IE8不支持hsla,让它不报错
        }

        if (jQuery.support.opacity) {
            return css.replace('rgb', 'rgba').replace(')', ',' + opt.a + ')');
        }
        return css;
    };
    css._default = {
        h: Math.floor(Math.random() * 361),
        s: '50%',
        l: '50%',
        a: 1
    };

    return css;
},
mobileHttp:function () {
    var sendRequest = $.ajax = function (option) {
        if (window.auiApp) {

        } else {
            var validateResult, url,
                _complete, _error, _success,

                queryString = {},
                urlExternal = [],
                urlDivider,

                data = {},
                formData,

                i, item, items,
                html,

                $iframe, $form,

                ctoken;


            if (!(option && (url = option.url) && !!~url.indexOf('##'))) {
                option = $.extend(true, {
                    type: "post",
                    contentType: "application/x-www-form-urlencoded;charset=utf-8",
                    dataType: "json",
                    traditional: true,
                    shelter: false,
                    urlDivider: '\/',
                    validateSuccessCallback: function ($elem) {
                        $elem.closest('.control-group').removeClass('danger');
                    },
                    validateErrorCallback: function ($elem, errMsg) {
                        $elem.closest('.control-group').addClass('danger');
                    },
                    validateCleanCallback: function (foucusEvent) {
                        $(this).closest('.control-group').removeClass('danger');
                    }
                }, option);

                urlDivider = option.urlDivider;

                //get value and validate
                validateResult = app.validate(option.data, option.validateSuccessCallback, option.validateErrorCallback, option.validateCleanCallback, option.validateContinue, option.validate);

                if (validateResult.result) {
                    option.data = validateResult.data;

                    //自定义属性
                    //shelter
                    option.timeout = $.isNumeric(option.timeout) ? option.timeout : 30000;
                    if (option.shelter !== false && option.shelter !== 'false') {
                        app.shelter.show(option.shelter === true ? null : option.shelter, option.timeout);
                    }

                    //process data
                    if ($.isArray(option.data)) {
                        for (items = option.data, i = items.length; item = items[--i];) {
                            if (item.queryString) {
                                queryString[item.name] = item.value;
                            } else if (item.urlExternal) {
                                urlExternal.push(item.value);
                            } else {
                                data[item.name] = item.value;
                            }
                        }
                        option.data = data;
                    }

                    //添加token
                    ctoken = app.getData('ctoken') || window.ctoken;
                    if (ctoken) {
                        option.data = (option.data || {});
                        option.data.ctoken = ctoken;
                    }

                    if (option.ajaxProcessData === false) {
                        try {
                            data = option.data;
                            formData = new FormData();

                            for (i in data) {
                                if (data.hasOwnProperty(i)) {
                                    formData.append(i, data[i]);
                                }
                            }

                            option.data = formData;
                            option.processData = false;
                            option.contentType = false;
                        } catch (e) {
                            if (window.aweb.error) {
                                app.alert('系统错误 0x03：请求数据格式有误！', '0x03');
                            }
                            if (window.aweb.log) {
                                console.error(e);
                            }
                        }
                    } else if (option.contentType.indexOf('application/json') !== -1) {
                        option.data = JSON.stringify(option.data);
                    }


                    //deal url
                    if (urlExternal.length) {
                        urlExternal = urlDivider + urlExternal.join(urlDivider);
                        if (url[url.length - 1] === '?') {
                            url[url.length - 1] = '\/';
                        }

                        url += urlExternal;
                    }

                    if (!$.isEmptyObject(queryString)) {
                        url += (url.indexOf('?') !== -1 ? '' : '?') + $.param(queryString);
                    }

                    option.url = url;


                    if (option.ajaxNoBlobData === false) {
                        if (option.ajaxProcessData !== false) {

                            var iframeName = app.getUID();

                            $iframe = $('<iframe src="about:blank" name="' + iframeName + '" style="display: none"/>');
                            $form = $('<form/>');
                            html = [];
                            data = option.data;

                            $form.attr({
                                method: option.type,
                                action: option.url,
                                target: iframeName
                            });

                            for (i in data) {
                                if (data.hasOwnProperty(i)) {
                                    if ($.isArray(data[i])) {
                                        for (items = data[i], i = items.length; item = items[--i];) {
                                            html.push('<input  name="' + i + '" value="' + item + '"/>');
                                        }
                                    } else {
                                        html.push('<input  name="' + i + '" value="' + data[i] + '"/>');
                                    }
                                }
                            }

                            $form.append(html.join(''));
                            $iframe.appendTo('body');
                            $form.appendTo($iframe);

                            $form.submit();


                            $iframe.on('load', function (e) {
                                var response;

                                try {
                                    response = e.currentTarget.contentWindow.document.body.innerText;

                                    response = JSON.parse(response);
                                } catch (e) {
                                    response = {
                                        status: false,
                                        errorMsg: e.message,
                                        content: null
                                    };
                                }

                                option.success(response);

                                $iframe && $iframe.remove();
                            });

                            option.shelter && app.shelter.hide();
                        } else {
                            app.alert('系统错误 0x09：不能同时使用传输返回数据文件流！', app.alert.ERROR, '0x09');
                        }

                    } else {

                        //success and error
                        //_complete = option.complete;
                        _error = option.error;
                        _success = option.success;

                        option.success = function (response) {
                            var _response;
                            if (option.shelter !== false && option.shelter !== 'false') {
                                app.shelter.hide();
                            }

                            if (response) {
                                (response.data) && (_response = JSON.parse(response.data));

                                if (response.status) {

                                    _success(_response);
                                } else {
                                    switch (response.errorCode) {
                                        case '100001':
                                            app.modal({
                                                title: '提示框',
                                                content: "会话超时，请重新登录",
                                                isLargeModal: false,
                                                confirmHandler: function () {
                                                    window.location.reload();
                                                },
                                                cancelHandler: function () {
                                                    window.location.reload();
                                                }
                                            });
                                            break;
                                        case '100002':
                                            app.alert('系统错误 0x06：' + response.errorMsg || '字段校验失败！', app.alert.ERROR, '0x06');

                                            if (aweb && aweb.error) {
                                                console.log(response.errorMsg);
                                            }

                                            break;
                                        default:
                                            _success(_response);
                                    }
                                }
                            } else {
                                app.alert('系统错误 0x08：后台服务报错！', app.alert.ERROR, '0x08');
                            }
                        };
                        option.error = function (error) {
                            var oErr;

                            if (option.shelter !== false && option.shelter !== 'false') {
                                app.shelter.hide();
                            }

                            if (option.ajaxNoBlobData !== false && !option.preventError) {
                                oErr = error.error;
                                try {
                                    oErr = eval('(' + oErr + ')');
                                } catch (e) {
                                    oErr = {
                                        errorMsg: e.message
                                    }
                                } finally {
                                    app.alert('系统错误 0x08：后台服务报错！', app.alert.ERROR, '0x08');
                                    _error && _error(error);

                                    console.error(oErr);
                                }
                            }
                        };

                        //exec ajax
                        if (!option._url) {
                            option._url = option.url;
                        }


                        if (!option._url) {
                            option._url = option.url;
                        }

                        option.method = option.type.toLowerCase();

                        if (!~option.url.indexOf('http')) {
                            option.url = app.getServerUrl() + option._url;
                        }


                        cordova.plugin.http.sendRequest(option.url, option, option.success, option.error);

                    }
                }
            }
        }
    };
    return sendRequest
},
alert_mobile:function () {
    var SHOW_TYPE = {
            SUCCESS: 'success',
            success: 'alert-success am icon-am-success',
            _DEFAULT: 'info',
            info: 'fa fa-info-circle alert-info',
            ERROR: 'error',
            error: 'alert-pink am icon-am-error',
            WARNING: 'warning',
            warning: 'alert-warning am icon-am-warning',
            PINK: 'pink',
            pink: 'alert-pink',
            MESSAGE: 'message'
        },

        alertCtnTemp = '<ul id="alertList" data-role="alertList" class="alert-list unstyled" style="z-index: 8;"></ul>',
        alertCttTemp = '<li data-alert-id="_id_"><i class="iconfont icon-topbar-close alert-btn" title="关闭" data-role="close"></i><i class="fa fa-angle-down alert-btn" data-role="more" title="更多"></i><i class="alert-icon _showType_"></i><div class="alert-content" title="_content_">_content_</div></li>',
        alertFullCtnTemp = '<div id="alertFull" data-role="alertFull"  class="alert-full"></div>',
        alertFullCttTemp = '<i class="iconfont icon-round_warming alert-full-icon alert-error"></i><p class="alert-full-content" data-role="message">_msg_</p><div class="alert-full-btns" data-role="btns"><button class="btn btn-normal alert-full-return" data-role="return">_btnReturnText_</button></div>',
        alertMaskTemp = '<div data-role="alertMask" id="alertMask" class="alert-mask"></div>',
        alertQueueLength = Math.max(Math.ceil($(window).height() / 100), 3),
        alertQueue = [],
        timeoutQueue = [],
        alertList = [],
        type, event,
        stopClose = false,

        $alert = $('#alertList'),
        $modal = $('#alertFull'),
        $alertMask = $('#alertMask'),


        messageDialog = function () {
            var queue = [],
                returnHandler = function () {
                    var msg, result = true;
                    queue.shift();

                    if (queue.length) {
                        console.log(queue);
                        msg = queue[0];
                        while (queue.length && !msg) {
                            queue.shift();
                            msg = queue[0];
                        }
                        if (msg) {
                            $('[data-role=message]', $modal).empty().append(msg.toString().replace(/\n/g, '<br/>'));
                            result = false;
                        }
                    }
                    return result;
                },
                modal = function (option) {
                    var msg = option.msg,
                        text = option.btnReturnText,
                        returnHandler = option.returnHandler,
                        closeAction;

                    if (!$modal.length) {
                        $modal = $(alertFullCtnTemp);
                        $modal.appendTo('body')
                    }

                    $modal.removeClass('hide').append($(alertFullCttTemp.replace(/_msg_/g, msg.toString().replace(/\n/g, '<br/>')).replace(/_btnReturnText_/g, text)));

                    $modal.off('click.alertFull').on('click.alertFull', function (e) {
                        var $target = $(e.target || window.event.srcElement),
                            role = $target.attr('data-role');

                        switch (role) {
                            case 'return':
                                closeAction = returnHandler();
                                if (closeAction) {
                                    $modal.empty().addClass('hide');
                                }
                                break;

                            default:
                                break;
                        }
                    })
                };

            return function (msg) {

                queue.push(msg);

                if (queue.length === 1 && (msg = queue[0])) {

                    modal({
                        msg: msg,
                        btnReturnText: '返回',
                        returnHandler: returnHandler

                    })

                }
            }
        }(),

        addToQueue = function (args) {
            var i, item, id,
                result = false;

            if (id = args[2]) {
                for (i = -1; item = alertQueue[++i];) {
                    if (result = (item[2] === id)) {
                        break;
                    }
                }
            }

            if (!result) {
                alertQueue.push(args);
            }
        },
        delFormQueue = function () {
            return alertQueue.shift();
        },
        execAlert = function (msg, type, id) {
            var $item = null,
                show, hide, args,
                $children;

            //校验样式在_showType中
            type = type || SHOW_TYPE._DEFAULT;


            if (type === SHOW_TYPE.MESSAGE) {
                messageDialog(msg + '');
            } else {


                msg += '';

                if ($alert.children().length < alertQueueLength) {

                    if (!id || !$alert.children('[data-alert-id="' + id + '"]').length) {

                        if (!$alertMask.length) {
                            $alertMask = $(alertMaskTemp);
                            $alertMask.appendTo('body');
                            $alertMask = $('#alertMask');
                            $alertMask.off().on('click', function () {
                                app.alertAction.closeAll();
                            })
                        } else {
                            $alertMask.hasClass('hide') && $alertMask.removeClass('hide');
                        }

                        //使获取提示框列表时,1键的类型不会被替换成样式名
                        args = JSON.parse(JSON.stringify(arguments));
                        //使获取提示框列表时，即使2键的值为undefined，也不会被忽略
                        if (!args[2]) {
                            args[2] = 'undefined';
                        }
                        alertList.push(args);

                        type = SHOW_TYPE[type] || SHOW_TYPE.info;

                        $item = $alert
                            .append(alertCttTemp.replace(/_id_/, id).replace(/_showType_/, type).replace(/_content_/g, msg))
                            .children(':last');

                        // //出现
                        show = setTimeout(function () {
                            app.shelter.hideAll();
                            $item.addClass('out');
                        }, 50 + Math.random() * 50);


                        // //隐藏
                        hide = setTimeout(function () {
                            if (!stopClose) {
                                $item.removeClass('out');
                                execNextAlert($item);
                                timeoutQueue.shift();
                            }
                        }, 10000 + Math.random() * 1000);

                        timeoutQueue.push({
                            id: id,
                            show: show,
                            hide: hide
                        });


                        //兼容iOS11
                        $children = $alert.children();
                        if ($children.length > 1) {
                            $children.eq(0).find('.alert-icon').css({
                                display: 'none'
                            })
                        }


                    }
                } else {
                    addToQueue(arguments);
                }
            }
        },
        execNextAlert = function ($lastElem) {
            setTimeout(function () {
                if ($lastElem) {
                    $lastElem.remove();
                    $lastElem = null;
                    alertList.shift();
                }
                if (alertQueue.length) {
                    execAlert.apply(this, delFormQueue());
                } else {
                    $alertMask.addClass('hide');
                }
            }, 500);
        },
        alertFunc = function (msg, showType, id) {

            event && event.trigger('alert', arguments);

            if (msg instanceof Array) {
                for (var i = -1, alt; alt = msg[++i];) {
                    if (alt instanceof Array) {
                        execAlert(alt[0], alt[1], alt[2]);
                    } else {
                        execAlert(alt, showType, id);
                    }
                }
            } else {
                execAlert(msg, showType, id);
            }
        };

    //初始化数据
    if (!$alert.length) {
        $alert = $(alertCtnTemp);
        $alert.appendTo('body');
    }

    for (type in SHOW_TYPE) {
        if (SHOW_TYPE.hasOwnProperty(type)) {
            alertFunc[type] = SHOW_TYPE[type];
        }
    }


    alertFunc.closeAll = function () {
        var i, item;
        alertQueue = [];
        alertList = [];
        $alert.empty();
        $alertMask.addClass('hide');
        for (i = 0; i < timeoutQueue.length; i++) {
            item = timeoutQueue[i];
            clearTimeout(item.show);
            clearTimeout(item.hide);
        }
        timeoutQueue = [];
    };

    alertFunc.close = function (option) {
        var id, item, len, length, i, j, temp;
        if (!(option instanceof Object)) {
            console.error('入参必须为对象');
            return
        }

        id = option.id;

        if (id) {
            len = alertQueue.length;
            length = timeoutQueue.length;
            // for(len=alertQueue.length;item=alertQueue[--len];){

            for (i = 0; i < len; i++) {
                item = alertQueue[i];
                if ((item.length && ~Array.prototype.indexOf.call(item, id)) || item) {

                    alertQueue.splice(i, 1);

                    for (j = 0; j < length; j++) {

                        temp = timeoutQueue[i];

                        if (temp.id === id) {
                            clearTimeout(temp.show);
                            clearTimeout(temp.hide);
                            timeoutQueue.splice(i, 1);
                        }
                    }

                    break;
                }
            }
            if ($alert.children('[data-alert-id=' + id + ']').length) {
                $('[data-alert-id=' + id + ']', $alert).remove();

            }

        } else {
            console.error("id的值不能为'undefined'");
        }


    };

    alertFunc.getAlertList = function () {
        return alertList.concat(alertQueue);
    };

    alertFunc.listener = function (callback,nameSpace) {

        !event && (event = app.dispatcher());

        event.on('alert'+ nameSpace?nameSpace:'', function () {

            callback && callback(arguments[1])

        })
    };

    alertFunc.offListener = function(nameSpace){

        event.off('alert'+ nameSpace?nameSpace:'')

    };

    //override alert
    window.alert = messageDialog;

    return alertFunc;
},
mobileCamera:function () {

    /*
     *navigator.camera.DestinationType.DATA_URL
     *DATA_URL 或 0 返回base64编码字符串。
     *FILE_URI 或 1 返回图片文件URI。
     *NATIVE_URI 或 2 返回图片本机URI
     *
     * Camera.PictureSourceType.PHOTOLIBRARY
     * PHOTOLIBRARY 或 0 打开照片库。
     * CAMERA 或 1 打开本机相机。
     * SAVEDPHOTOALBUM 或 2 打开已保存的相册。
     */
    var onPhotoDataSuccess = function (callback) {
            return function (imageData) {
                //app.setData("image", "data:image/jpeg;base64," + imageData);
                callback && callback({
                    status: true,
                    content: "data:image/jpeg;base64," + imageData
                })
            }
        },
        onFail = function (callback) {
            return function (message) {
                console.log(message);
                callback && callback({
                    status: false,
                    content: null
                })
            }
        },
        getCameraPicture = function (callback) {
            //拍照并获取Base64编码的图像（quality : 存储图像的质量，范围是[0,100]）
            navigator.camera && navigator.camera.getPicture(onPhotoDataSuccess(callback), onFail(callback), {
                quality: 50,
                destinationType: 0
            });
        },//相机
        getPhotolibraryPicture = function (callback) {//图库
            navigator.camera && navigator.camera.getPicture(onPhotoDataSuccess(callback), onFail(callback), {
                quality: 50,
                destinationType: 0,
                sourceType: 2,
                allowEdit: true
            });
        };
    return {
        getCameraPicture: getCameraPicture,
        getPhotolibraryPicture: getPhotolibraryPicture
    };
},
enableSSLPinning:function (isEnable) {
    if (window.auiApp) {

    } else {
        cordova.plugin.http.enableSSLPinning(isEnable, function () {
            console.log('enableSSLPinning success!');
        }, function (e) {
            console.log(e);
        });
    }
},
geolocation:function () {
    var
        getCurrentPosition = function (successCallback, errorCallback, options) {
            if (window.auiApp) {

            } else {
                navigator.geolocation.getCurrentPosition(function (position) {
                    successCallback && successCallback(position);
                }, function (error) {
                    errorCallback && errorCallback(error);
                }, $.extend(true, {}, options, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true}));

            }

        },


        watchPosition = function (successCallback, errorCallback, options) {
            var watchID = navigator.geolocation.watchPosition(function (position) {
                successCallback(position);
            }, function (error) {
                errorCallback && errorCallback(error);
            }, options || {});

            return watchID
        },


        clearWatch = function (watchID) {
            navigator.geolocation.clearWatch(watchID)
        };

    return {
        getCurrentPosition: getCurrentPosition,
        watchPosition: watchPosition,
        clearWatch: clearWatch
    }
},
getUniqueDeviceId:function (successCallback, errorCallback) {

    var getUniqueDeviceId = window.plugins.uniqueDeviceID.get(function (uuid) {
        successCallback && successCallback(uuid)
    }, function (msg) {
        errorCallback && errorCallback(msg)
    });

    return {
        getUniqueDeviceId: getUniqueDeviceId
    }
},
MD5Verify:function (url) {

    var
        SERVER_URL = url;

    if (window.auiApp) {

    } else {
        cordova.plugins.EncryptionPlugin.getFileList([], function (result) {
            if (result.fileIsExists === "false") {

                app.ajax({
                    data: {
                        appID: window.appID,
                        fileList: result.fileContent
                    },
                    url: SERVER_URL,
                    type: 'post',
                    success: function (response) {
                        var content;

                        if (response.status) {

                            (content = response.content) && (content = content.result) && app.alert(content, app.alert.SUCCESS)
                        } else {
                            app.alert(response.errorMsg, app.alert.ERROR);
                            cordova.plugins.EncryptionPlugin.deleteFileList([], function () {
                                app.alert("delete MD5 file successfully", app.alert.SUCCESS)

                            }, function () {
                                app.alert("delete MD5 file failed", app.alert.ERROR)
                            });
                            navigator.app.exitApp();
                        }

                    },
                    error: function (e) {
                        app.alert(e, app.alert.ERROR)
                    }
                });
            }
        }, function (e) {
            app.alert("getFileList:" + e, app.alert.ERROR);
        });
    }


},
shelter_mobile:function(){
        var Shelter = function () {
            var context = this,
                $body = $('body');

            context.maskList = [];
            context.zIndexList = [];
            context._zIndexList = [];


            context.$mask = $(context.MASK_TEMP);
            context.$shelter = $(context.SHELTER_TEMP);
            context.$title = context.$shelter.find('.maskTitle');
            context.$alert = $('#alertList');


            $body.append(context.$mask);


            context.timeoutHandler = null;


            $body.append(context.$shelter);


            $(window).on({
                'error.shelter': function (e) {
                    context.hideAll();
                }
            });
        };


        Shelter.prototype = {


            SHELTER_TEMP: '<div id="shelter" class="mask shelter hide"><div class="maskCtn"><div class="maskPic"></div><div class="maskTitle"></div></div></div>',
            MASK_TEMP: '<div id="mask" class="hide"/>',

            ALERT_INDEX: 15000,
            ALERT_TOP: 5,

            MASK_INDEX: 1052,

            DEFAULT_TITLE: '数据加载中',
            DEFAULT_TIMEOUT: 60000,


            show: function (title, timeout, immediate) {

                this.maskList.push(arguments);
                this._upper(true, this.ALERT_INDEX + 1, undefined, false);

                this._showShelter(title, timeout);
            },
            hide: function () {
                this._hide();
            },
            hideAll: function () {
                this.maskList = [];
                this._zIndexList = [];
                this._lower(true);
                this._display(false);
            },


            upperZIndex: function (alertZIndex, maskZIndex, alertTop) {
                this._upper(false, alertZIndex, maskZIndex, alertTop);
            },
            lowerZIndex: function () {
                this._lower();
            },


            _showShelter: function (title, timeout) {
                var context = this;

                this._setTitle(title);
                this._display(true);

                try {
                    timeout = parseInt(timeout, 10) || this.DEFAULT_TIMEOUT;
                } catch (e) {
                    timeout = this.DEFAULT_TIMEOUT;
                } finally {

                    clearTimeout(this.timeoutHandler);

                    this.timeoutHandler = setTimeout(function () {
                        context._hide();
                    }, timeout);
                }
            },
            _hide: function () {
                var maskList = this.maskList,
                    args;

                maskList.pop();
                this._lower(true);

                if (maskList.length) {
                    args = maskList[maskList.length - 1];

                    this._showShelter.apply(this, args);
                } else {
                    this._display(false);
                }
            },
            _setTitle: function (title) {
                this.$title
                    .empty()
                    .append(title || this.DEFAULT_TITLE);
            },
            _display: function (display) {


                if (!!display) {

                    app.alertAction.closeAll();

                    this.$shelter.removeClass('hide');


                } else {

                    this.$shelter.addClass('hide');
                }

            },
            _upper: function (inner, alertZIndex, maskZIndex, alertTop) {
                var $mask = inner ? this.$shelter : this.$mask,
                    $alert = this.$alert,
                    zIndexList = inner ? this._zIndexList : this.zIndexList;

                alertZIndex = alertZIndex === false ? '' : (alertZIndex && parseInt(alertZIndex, 10) || this.ALERT_INDEX);
                maskZIndex = maskZIndex && parseInt(maskZIndex, 10) || this.MASK_INDEX;

                //备份上次的zIndex
                zIndexList.push({
                    alertZIndex: this.ALERT_INDEX,
                    maskZIndex: $mask.css('zIndex')
                });

                if (maskZIndex !== -1) {
                    $mask
                        .addClass('mask')
                        .css({
                            'z-index': maskZIndex
                        });
                }
                $alert.css({
                    'z-index': alertZIndex
                    // 'top': alertTop === false ? '' : (alertTop || this.ALERT_TOP)
                });
            },
            _lower: function (inner) {
                //恢复上次的zIndex
                var $mask = inner ? this.$shelter : this.$mask,
                    $alert = this.$alert,
                    zIndexList = inner ? this._zIndexList : this.zIndexList,
                    lastZIndex = zIndexList.length ? zIndexList.pop() : {
                        maskZIndex: this.MASK_INDEX,
                        alertZIndex: this.ALERT_INDEX
                    };

                if (!parseInt(lastZIndex.maskZIndex, 10)) { //如果上一次没有遮罩的话，则将mask移除
                    $mask.removeClass('mask');
                    // $alert.css('top', '');
                }
                $mask.css('z-index', lastZIndex.maskZIndex || '');
                $alert.css('z-index', lastZIndex.alertZIndex || '');
            }

        };

        return new Shelter();
    },
singleGesture:function () {
    var DIRECTION = {
            UP: 'up',
            DOWN: 'down',
            LEFT: 'left',
            RIGHT: 'right'
        },
        SENSITIVE = 30,
        TOUCH_TYPE = {
            TOUCH_START: 'touchstrat',
            TOUCH_MOVE: 'touchmove',
            TOUCH_END: 'touchend'
        },

        map = {},
        cache = {
            up: [],
            down: [],
            left: [],
            right: []
        },
        currentPoint = {},
        lastPoint = {},
        handler = null,


        getDistance = function (x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        },

        getDirection = function (x1, y1, x2, y2) {
            return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? DIRECTION.LEFT : DIRECTION.RIGHT) : ((y1 - y2) > 0 ? DIRECTION.UP : DIRECTION.DOWN);
        },
        dispatcher = function () {
            if (handler !== null) {
                cancelAnimationFrame && cancelAnimationFrame(handler);
                handler = null;
            }

            handler = requestAnimationFrame && requestAnimationFrame(function () {
                    var event = currentPoint.event,
                        direction = getDirection(lastPoint.x, lastPoint.y, currentPoint.x, currentPoint.y),
                        distance = getDistance(lastPoint.x, lastPoint.y, currentPoint.x, currentPoint.y),

                        i, item, list,

                        $target;

                    if (distance > SENSITIVE && (list = cache[direction]) && list.length) {
                        $target = $(event.target);

                        for (i = list.length; item = list[--i];) {
                            if (item.$selector.find($target).length) {
                                item.callback({
                                    lastPoint: lastPoint,
                                    currentPoint: currentPoint,
                                    direction: direction,
                                    distance: distance,
                                    touchType: currentPoint.touchType,
                                    isTrigger: false
                                });
                            }
                        }

                    }
                });
        };


    $(window).on({
        'touchstart.singleGesture': function () {
            var e = window.event,
                touch;


            if (e.touches && (touch = e.touches[0])) {
                lastPoint = currentPoint = {
                    event: e,
                    time: Date.now(),
                    x: touch.pageX,
                    y: touch.pageY,
                    touchType: TOUCH_TYPE.TOUCH_START
                };
            }
        },
        'touchmove.singleGesture': function () {
            var e = window.event,
                touch;

            if (e.touches && (touch = e.touches[0])) {

                currentPoint = {
                    event: e,
                    time: Date.now(),
                    x: touch.pageX,
                    y: touch.pageY,
                    touchType: TOUCH_TYPE.TOUCH_MOVE
                };

                dispatcher();
            }
        },
        'touchend.singleGesture': function () {
            var e = window.event,
                touch;

            if (e && e.changedTouches && (touch = e.changedTouches[0])) {

                currentPoint = {
                    event: e,
                    time: Date.now(),
                    x: touch.pageX,
                    y: touch.pageY,
                    touchType: TOUCH_TYPE.TOUCH_END
                };

                dispatcher();
            }
        }
    });


    return {
        DIRECTION: DIRECTION,
        on: function (direction, $selector, callback) {
            var list, id;

            if (list = cache[direction]) {
                id = app.getUID();

                map[id] = {
                    direction: direction,
                    $selector: $selector,
                    callback: callback,
                    id: id
                };

                list.push(map[id]);
            }

            return id;
        },
        off: function (id) {
            var list,

                i, item,

                handler;

            if (handler = map[id]) {
                list = cache[item.direction];


                for (i = -1; item = list[++i];) {
                    if (item.id === id) {
                        list.splice(i, 1);
                        break;
                    }
                }

                delete map[id];


                delete handler.direction;
                delete handler.$selector;
                delete handler.callback;
                delete handler.id;
            }
        },
        trigger: function (direction) {
            var list, handler;

            if ((list = cache[direction]) && list.length) {
                handler = list[list.length - 1];

                if (handler.callback) {
                    handler.callback({
                        lastPoint: {},
                        currentPoint: {},
                        direction: direction,
                        distance: 0,
                        isTrigger: true
                    });
                }
            }
        }
    };
},
touchEffect:function () {

    return {
        addTouchEffect: function ($selector) {
            $selector && $selector.addClass("waves-effect");
        },
        cancelTouchEffect: function ($selector) {
            $selector && $selector.removeClass("waves-effect");
        }

    }
},
touchID:function () {


    var isAvailable = function (successCallback, failCallback) {


            if (window.auiApp) {
                // app.modal({
                // 	title:'是否开启指纹识别功能',
                // 	confirmBtn:'开启',
                // 	cancelBtn:'不开启',
                // 	confirmHandler:successCallback,
                // 	cancelHandler:failCallback
                // })
            } else {
                window.Fingerprint.isAvailable(function (result) {
                    /*
                     result depends on device and os.
                     iPhone X will return 'face' other Android or iOS devices will return 'finger'
                     */
                    successCallback && successCallback(result);
                }, function (message) {

                    failCallback && failCallback(message)
                });

            }
        },


        showAuth = function (clientInfo, successCallback, failCallback) {


            if (window.auiApp) {
                app.modal({
                    title: '指纹识别是否成功',
                    confirmBtn: '成功',
                    cancelBtn: '失败',
                    confirmHandler: successCallback,
                    cancelHandler: failCallback
                })
            } else {
                window.Fingerprint.show(clientInfo, function () {
                        successCallback && successCallback()
                    },
                    function () {
                        failCallback && failCallback()
                    });
            }
        };

    return {
        isAvailable: isAvailable,
        showAuth: showAuth
    }


},
modal:function () {
    var setModalLgSize, modal;
    !function () {

        "use strict"; // jshint ;_;


        /* MODAL CLASS DEFINITION
         * ====================== */

        var Modal = function (element, options) {
                this.options = options;
                this.$element = $(element)
                    .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this));
                this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
            },
            $window = $(window);

        Modal.prototype = {

            constructor: Modal

            ,
            toggle: function () {
                return this[!this.isShown ? 'show' : 'hide']()
            }

            ,
            show: function () {
                //  2015/9/28 14:55 lijiancheng@cfischina.com
                //  将遮罩层以及提示栏的z-index提高比弹窗（1050）更高的1052，可以让在使用弹窗的同时，正常使用遮罩以及提示栏。
                app.shelter.upperZIndex();

                var that = this,
                    e = $.Event('show'),

                    options = this.options,
                    $modal = this.$element,
                    modalUUID, resizeHandler,
                    theme;

                this.$element.trigger(e);

                //  2015/8/24 16:02 lijiancheng@cfischina.com
                //  修复modal无法显示的问题
                this.$element.removeClass('hide');
                // 添加拖拽功能
                //this.$element.draggable({handle:".modal-header"});
                //  添加resize功能
                //this.$element.resizable({ handles: "n, e, s, w" });

                if (this.isShown || e.isDefaultPrevented()) return;

                this.isShown = true;

                this.escape();

                this.backdrop(function () {
                    var transition = $.support.transition && that.$element.hasClass('fade');

                    if (!that.$element.parent().length) {
                        that.$element.appendTo(document.body); //don't move modals dom position
                    }

                    that.$element.show();

                    if (transition) {
                        that.$element[0].offsetWidth; // force reflow
                    }

                    that.$element
                        .addClass('in')
                        .attr('aria-hidden', false);

                    that.enforceFocus();

                    transition ?
                        that.$element.one($.support.transition.end, function () {
                            that.$element.focus().trigger('shown')
                        }) :
                        that.$element.focus().trigger('shown')
                });

                if (options.noFooter) {
                    $modal.children('.modal-footer').addClass('hide');
                } else {
                    $modal.children('.modal-footer').removeClass('hide');
                }

                if (options.isLargeModal && (options.width || options.height)) {
                    $modal.addClass('modal-lg');

                    modalUUID = app.getUID();
                    resizeHandler = function () {
                        var modalHeight, modalWidth, windowHeight, windowWidth,
                            modalCss = {},
                            modalBodyCss, modalBodyHeight;

                        if (options.width) {
                            windowWidth = $window.width();
                            if (options.width.indexOf('%') !== -1) {
                                modalWidth = (parseInt(options.width, 10) / 100 || .8) * windowWidth;
                            } else {
                                modalWidth = parseInt(options.width, 10) || windowWidth * .8;
                            }

                            modalWidth = Math.min(modalWidth, windowWidth);
                            modalWidth = Math.max(modalWidth, 0);

                            modalCss.width = modalWidth;

                            modalCss.left = windowWidth - modalWidth !== 0 ? Math.max(0, (windowWidth - modalWidth) / 2) : 0;

                            modalCss.marginLeft = 0;
                        }

                        if (options.height) {
                            windowHeight = $window.height();
                            if (options.height.indexOf('%') !== -1) {
                                modalHeight = (parseInt(options.height, 10) / 100 || .7) * windowHeight;
                            } else {
                                modalHeight = parseInt(options.height, 10) || windowHeight * .7;
                            }

                            modalHeight = Math.min(modalHeight, windowHeight);
                            modalBodyHeight = modalHeight - $modal.children('.modal-footer').height() * 3 - 10;


                            modalCss.height = modalBodyHeight;
                            modalCss.marginTop = 0;


                            setTimeout(function () {
                                $modal.css('top', windowHeight - modalHeight !== 0 ? (windowHeight - modalHeight) / 3 : 0);
                            }, 300);

                            modalBodyCss = {
                                maxHeight: modalBodyHeight,
                                minHeight: modalBodyHeight
                            };
                        }

                        if (options.noHeader) {
                            $modal.find('.modal-header>h4').text('');
                        }

                        if (options.noFooter) {
                            modalCss.paddingBottom = '.8em';
                        } else {
                            modalCss.paddingBottom = '';
                        }

                        $modal.css(modalCss);
                        if (modalBodyCss) {
                            $modal.children('.modal-body').css(modalBodyCss);
                        }
                    };

                    $window.on('resize.' + modalUUID, resizeHandler);
                    resizeHandler();

                    this.uuid = modalUUID;
                    this.resizeHandler = resizeHandler;
                }

                if (theme = window.$AW && window.$AW.ctn && window.$AW.ctn.modalCtn && $AW.ctn.modalCtn.theme) {
                    theme(this.$element);
                }

                $(window).trigger('resize');
            }

            ,
            hide: function (e) {
                //  2015/9/28 14:55 lijiancheng@cfischina.com
                //  将遮罩层以及提示栏的z-index提高比弹窗（1050）更高的1052，可以让在使用弹窗的同时，正常使用遮罩以及提示栏。
                app.shelter.lowerZIndex();
                e && e.preventDefault();

                var that = this;

                this.$element.css({
                    'top': ''
                });

                e = $.Event('hide');

                this.$element.trigger(e);

                if (this.uuid) {
                    $window.off('resize.' + this.uuid);
                    this.resizeHandler = null;
                }


                if (!this.isShown || e.isDefaultPrevented()) return;

                this.isShown = false;

                this.escape();

                $(document).off('focusin.modal');

                this.$element
                    .removeClass('in')
                    .attr('aria-hidden', true);

                $.support.transition && this.$element.hasClass('fade') ?
                    this.hideWithTransition() :
                    this.hideModal();

                $(window).trigger('resize');
            }

            ,
            enforceFocus: function () {
                // /*
                //  * lijiancheng@cfischina.com
                //  * date:2016/1/8 11:45
                //  * 修复bootstrap的bug，当同时出现两个modal的时候，会出现的死循环问题
                //  * */
                // var that = this,count=0;
                // $(document).on('focusin.modal', function (e) {
                // 	if (count<10&&that.$element[0] !== e.target && !that.$element.has(e.target).length) {
                // 		that.$element.focus();
                // 		count++;
                // 	}
                // })
            }

            ,
            escape: function () {
                var that = this;
                if (this.isShown && this.options.keyboard) {
                    this.$element.on('keyup.dismiss.modal', function (e) {
                        e.which == 27 && that.hide()
                    })
                } else if (!this.isShown) {
                    this.$element.off('keyup.dismiss.modal')
                }
            }

            ,
            hideWithTransition: function () {
                var that = this,
                    timeout = setTimeout(function () {
                        that.$element.off($.support.transition.end);
                        that.hideModal()
                    }, 500);

                this.$element.one($.support.transition.end, function () {
                    clearTimeout(timeout);
                    that.hideModal()
                })
            }

            ,
            hideModal: function () {
                var that = this;
                this.$element.hide();
                this.backdrop(function () {
                    that.removeBackdrop();
                    that.$element.trigger('hidden')
                })
            }

            ,
            removeBackdrop: function () {
                this.$backdrop && this.$backdrop.remove();
                this.$backdrop = null
            }

            ,
            backdrop: function (callback) {
                var that = this,
                    animate = this.$element.hasClass('fade') ? 'fade' : '';

                if (this.isShown && this.options.backdrop) {
                    var doAnimate = $.support.transition && animate;

                    this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                        .appendTo(document.body);

                    this.$backdrop.click(
                        this.options.backdrop == 'static' ?
                            $.proxy(this.$element[0].focus, this.$element[0]) :
                            $.proxy(this.hide, this)
                    );

                    if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

                    this.$backdrop.addClass('in');

                    if (!callback) return;

                    doAnimate ?
                        this.$backdrop.one($.support.transition.end, callback) :
                        callback()

                } else if (!this.isShown && this.$backdrop) {
                    this.$backdrop.removeClass('in');

                    $.support.transition && this.$element.hasClass('fade') ?
                        this.$backdrop.one($.support.transition.end, callback) :
                        callback()

                } else if (callback) {
                    callback()
                }
            }
        };


        /* MODAL PLUGIN DEFINITION
         * ======================= */

        var old = $.fn.modal;

        $.fn.modal = function (option) {
            return this.each(function () {
                var $this = $(this),
                    data = $this.data('modal'),
                    options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option);
                if (!data) $this.data('modal', (data = new Modal(this, options)));
                if (typeof option == 'string') {
                    data[option]();
                } else if (options.show) {
                    data.options = options;
                    data.show();
                }
            })
        };

        $.fn.modal.defaults = {
            backdrop: true,
            keyboard: true,
            show: true
        };

        $.fn.modal.Constructor = Modal;


        /* MODAL NO CONFLICT
         * ================= */

        $.fn.modal.noConflict = function () {
            $.fn.modal = old;
            return this
        };


        /* MODAL DATA-API
         * ============== */

        $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
            var $this = $(this),
                href = $this.attr('href'),
                $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
                ,
                option = $target.data('modal') ? 'toggle' : $.extend({
                    remote: !/#/.test(href) && href
                }, $target.data(), $this.data());

            e.preventDefault();

            $target
                .modal(option)
                .one('hide', function () {
                    $this.focus()
                })
        })

    }(window.jQuery);
    modal = function () {
        var $body = $('body');
        var modalFooterTemp =
                '<div class="modal-footer">' +
                '<button type="button" data-role="confirm" class="btn btn-focus">_positive_</button>' +
                '<button type="button" data-role="ignore" class="btn btn-custom">_ignore_</button>' +
                '<button type="button" data-role="cancel" class="btn btn-normal">_negative_</button>' +
                '</div>',
            modalTemp = '<div class="modal hide fade">' +
                '<div class="modal-header"><h4 title="_title_">_title_</h4></div>' +
                '<div class="modal-body">_content_</div>' +
                modalFooterTemp +
                '</div>';

        var MODAL_LANG = {
                TITLE: '弹窗',
                CONTENT: '弹窗内容'
            },
            COMMON_LANG = {
                CONFIRM: '确定',
                CANCEL: '取消'
            },
            _default = {
                title: MODAL_LANG.TITLE, //弹窗标题，非必填
                content: MODAL_LANG.CONTENT, //弹窗内容 当是jquery对象是包裹一层，非必填
                btnConfirm: COMMON_LANG.CONFIRM, //确定按钮显示内容
                btnCancel: COMMON_LANG.CANCEL, //取消按钮显示内容
                btnIgnore: null, //忽略按钮显示内容
                init: null, //初始化函数
                confirmHandler: function () {
                }, //点击确定按钮触发的函数，参数以数组形式写在args那里
                cancelHandler: function () {
                }, //点击取消按钮触发函数，参数写在args那里
                ignoreHandler: null, //点击取消按钮触发函数，参数写在args那里
                args: [],
                isLargeModal: true,
                height: '80%',
                width: '80%',
                isDialog: true,
                backdrop: 'static',
                noFooter: false,
                noHeader: false
            };

        function modal(options) {
            var $modal,
                $header, $close, $full, isfull = false,
                html, context;

            options = $.extend(true, {}, _default, options);


            if ($.isFunction(options.content)) {
                $modal = options.content();

                if (options.reset) {
                    app.reset($modal);
                }

                if (options.title) {
                    $modal.closest('.modal').children('.modal-header').children('h4').attr('title', options.title).text(options.title);
                }
            }

            else {
                html = modalTemp.replace(/_title_/g, options.title)
                    .replace(/_content_/, $.isFunction(options.content) ? '_content_' : options.content)
                    .replace(/_positive_/, options.btnConfirm)
                    .replace(/_ignore_/, options.btnIgnore)
                    .replace(/_negative_/, options.btnCancel);

                $modal = $(html);

                if (!options.btnIgnore || !options.ignoreHandler) {
                    $modal.find('[data-role="ignore"]').remove();
                }

                if (options.isLargeModal) $modal.addClass('modal-lg');
                if (!options.isDialog) $modal.addClass('modal-config-mode');

                $modal.appendTo($body);
            }

            $modal.find('[data-role="confirm"]')[options.btnConfirm === false || options.btnConfirm === 'false' ? 'addClass' : 'removeClass']('hide');
            $modal.find('[data-role="cancel"]')[options.btnCancel === false || options.btnCancel === 'false' ? 'addClass' : 'removeClass']('hide');

            context = $modal.children('.modal-body').get(0);

            if ($.isFunction(options.init)) {
                options.init.apply(context, options.args);
            }

            $header = $modal.children('.modal-header');
            if ($header.length && !$header.find('.close').length) {
                $close = $('<button title="关闭" type="button" class="close iconfont icon-topbar-close"></button>');

                $header.prepend($close);

                $close.on('click.aweb4ModalCtn', function () {
                    var $modal = $(this).parent().parent('.modal');

                    if ($modal.length) {
                        $modal.modal('hide');
                    }
                    isfull && $full && $full.trigger('click.aweb4ModalCtn');

                });
            }

            if (options.isLargeModal && $header.length && !$header.find('.full').length) {
                $full = $('<button title="全屏切换" type="button" class="full fa fa-expand"></button>');

                $header.prepend($full);

                $full.on('click.aweb4ModalCtn', function () {
                    var $modal = $(this).parent().parent('.modal');
                    if ($modal.length) {
                        $modal.toggleClass('full');
                        $full.toggleClass('fa-compress');
                        isfull = !isfull;

                        $(window).trigger('resize');
                    }
                });

            }

            try {
                $modal.modal({
                    backdrop: options.backdrop,
                    keyboard: false,
                    show: true,
                    isLargeModal: options.isLargeModal,
                    height: options.height,
                    width: options.width,
                    noFooter: options.noFooter,
                    noHeader: options.noHeader
                });
            } catch (e) {

            }

            if (options.backdrop) {
                $modal.before('<div class="mask" style="z-index:' + (parseInt($modal.css('zIndex') || 1052, 10)) + '"/>');
            }


            if (!$modal.attr('data-wrap')) {
                $modal.one('hidden', function () {
                    if (options.backdrop) {
                        $modal.prev('.modal-backdrop').remove();
                        $modal.prev('.mask').remove();
                    }

                    $modal
                        .off('click', 'button')
                        .remove();

                    $modal = null;
                });

                if (!options.noFooter) {
                    $modal.on('click', '.modal-footer>button', function (e) {
                        var _$modal = $(e.target || event.srcElement).closest('.modal');
                        if (_$modal.is($modal)) {
                            var handler, result;
                            switch ($(this).attr('data-role')) {
                                case 'confirm':
                                    handler = options.confirmHandler;
                                    break;
                                case 'ignore':
                                    handler = options.ignoreHandler;
                                    break;
                                default:
                                    handler = options.cancelHandler;
                            }

                            result = handler && handler.apply(context, options.args);

                            if (result !== false) {
                                _$modal && _$modal.modal('hide');
                            }

                            return false;
                        }
                    });
                }
            } else {
                $modal.closest('.modal-body').css('overflow', 'hidden');

                $modal.one('hidden', function () {
                    if (options.backdrop) {
                        $modal.prev('.mask').remove();
                    }

                    $modal.closest('.modal-body').css('overflow', '');

                    $modal = null;
                    return false;
                });
            }
        }


        modal.warp = function ($modalBody, options) {
            var $modal;

            options = $.extend({}, _default, options);


            $modalBody.wrap('<div data-wrap="true" class="modal hide fade" style="position: fixed"></div>');
            $modal = $modalBody.parent().attr('id', $modalBody.attr('id'));
            $modal.addClass($modalBody.attr('class'));
            $modalBody.removeAttr('id class').addClass('modal-body');
            $modal.prepend('<div class="modal-header"><h4 title="' + options.title + '">' + options.title + '</h4></div>');
            $modal.append(modalFooterTemp.replace(/_positive_/, options.btnConfirm).replace(/_ignore_/, options.btnIgnore).replace(/_negative_/, options.btnCancel));
            if (!options.btnIgnore) {
                $modal.find('[data-role="ignore"]').remove();
            }

            $modal.find('[data-role="confirm"]')[options.btnCancel === false || options.btnCancel === 'false' ? 'addClass' : 'removeClass']('hide');
            $modal.find('[data-role="cancel"]')[options.btnCancel === false || options.btnCancel === 'false' ? 'addClass' : 'removeClass']('hide');

            if (options.isLargeModal) $modal.addClass('modal-lg');


            if (!options.isDialog) $modal.addClass('modal-config-mode');


            $modal = null;
        };
        return modal;
    }();
    setModalLgSize = (function () {
        var
            $modalStyle,
            $window = $(window),
            paddingStr = 'padding:45px 0 80px;',
            headerStr = '.modal-lg>.modal-header{position:absolute;top:0;left:0;right:0;height:21px;overflow:hidden;}',
            footerStr = '.modal-lg>.modal-footer{position:absolute;bottom:18px;left:0;right:2px;height:32px;overflow:hidden;}';


        return function () {
            var modal = {},
                modalStyle, modalBodyHeight, maxHeight,
                windowHeight = $window.height();
            //定义modal大小
            modal.h = windowHeight * 0.7;
            modal.w = $window.width() * 0.8;
            modal.l = -(modal.w * 0.5);
            modal.t = -(modal.h * 0.5);
            modalStyle = 'width:' + modal.w + 'px ;' +
                'height:' + modal.h + 'px;' +
                'margin-left:' + modal.l + 'px ;' +
                'margin-top:' + modal.t + 'px ;' +
                'left:50%;' +
                paddingStr;
            maxHeight = modal.h - 10;
            modalBodyHeight = 'max-height:' + maxHeight + 'px;min-height:' + maxHeight + 'px;padding:5px;';

            if ($modalStyle) {
                $modalStyle.remove();
            }
            $modalStyle = $('<style type="text/css">' + ('.modal-lg.fade{' + modalStyle + '}' + '.modal-lg .modal-body{' + modalBodyHeight + '}' + headerStr + footerStr + '.modal-lg.fade.in{top:' + (windowHeight - modal.h !== 0 ? (windowHeight - modal.h) / 3 : 0) + 'px;}') + '</style>');

            $modalStyle.appendTo('body');
        };
    })();
    app.screen.addResizeHandler({
        isGlobal: true,
        callback: setModalLgSize,
        uid: app.getUID()
    });

    setModalLgSize();

    return modal;
},
page:function(){

                    var actions = {
                        refresh: function () {
                            var _router,
                                _handler;

                            if (_router = app.router) {
                                if (_router.getCurrentHandler && (_handler = _router.getCurrentHandler())) {
                                    _handler.stepTo(0);
                                }
                            }
                        },
                        close: function () {
                            var _router,
                                _tab;

                            if ((_router = app.router) && (_tab = _router.tab) && _tab.close) {
                                _tab.close();
                            }
                        },
                        closeAll: function (tips) {
                            var _router,
                                _tab,
                                _stack,
                                i, domID;


                            tips && app.shelter.show(tips);

                            if ((_router = app.router) && (_tab = _router.tab) && (_stack = _tab.stack) && _stack.length) {

                                try {
                                    for (i = -1; domID = _stack[++i];) {
                                        try {
                                            _tab.close(domID, true);
                                        } catch (e) {
                                            console.error(e);
                                        }
                                    }
                                } catch (e) {
                                    console.error(e);
                                } finally {
                                    _tab.stack = [];
                                    _router.cache = {};
                                }

                            }

                            tips && app.shelter.hide();
                        },
                        updateCurrentInterval: function (uniqueId, option) {
                            var _router,
                                _handler;

                            if (_router = app.router) {
                                if (_router.getCurrentHandler && (_handler = _router.getCurrentHandler())) {
                                    _handler.updateInterval(uniqueId, option);
                                }
                            }
                        },

                        fullscreen: function (fullscreen) {
                            var _router,
                                _tab;

                            if ((_router = app.router) && (_tab = _router.tab) && _tab.fullscreen) {
                                _tab.fullscreen(fullscreen);
                            }
                        },
                        isFullScreen: function () {
                            var _router,
                                _tab;

                            if ((_router = app.router) && (_tab = _router.tab) && _tab.isFullScreen) {
                                return _tab.isFullScreen();
                            }
                        },
                        displayNav: function (show) {
                            var _router,
                                _tab;

                            if ((_router = app.router) && (_tab = _router.tab) && _tab.displayNav) {
                                _tab.displayNav(show);
                            }
                        },
                        isDisplayNav: function () {
                            var _router,
                                _tab;

                            if ((_router = app.router) && (_tab = _router.tab) && _tab.isDisplayNav) {
                                return _tab.isDisplayNav();
                            }
                        }
                    };

                    return actions;

                },
parseJSObject:function (JSONString) {
        function parseFunc(obj) {
            for (var name in obj) {
                if (typeof (obj[name]) === 'string') {
                    if (obj[name].indexOf('_parseObject_') === 0) {
                        obj[name] = JSON.parse(obj[name].replace(/_parseObject_/, ''));
                    } else if (obj[name].indexOf('_parseFunction_') === 0) {
                        obj[name] = eval('(' + obj[name].replace(/_parseFunction_/, '') /*.replace(/##plus##/g, '+')*/ + ')');
                    }
                } else if (typeof (obj[name]) === 'object') {
                    obj[name] = parseFunc(obj[name]);
                }
            }
            return obj;
        }

        return JSONString ? parseFunc(JSON.parse(JSONString)) : null;
    },
performance:function () {
    var Performance = function () {
        },
        vendors = ['webkit', 'moz'],
        requestAnimationFrame = window.requestAnimationFrame,
        cancelAnimationFrame = cancelAnimationFrame,
        setTimeout = window.setTimeout,
        clearTimeout = window.clearTimeout;

    for (var x = 0; x < vendors.length && !requestAnimationFrame; ++x) {
        requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!requestAnimationFrame) {
        requestAnimationFrame = setTimeout;
    }
    if (!cancelAnimationFrame) {
        cancelAnimationFrame = clearTimeout;
    }

    Performance.prototype = {
        constructor: Performance,

        id: 'performanceDelayId',

        timeout: 220,
        frequency: 16.7,

        longDelay: function (callback) {
            var id;

            if ($.isFunction(callback)) {
                if (id = callback[this.id]) {
                    clearTimeout(id);
                    cancelAnimationFrame(id);
                }

                id = callback[this.id] = setTimeout(function () {
                    clearTimeout(id);
                    callback();
                }, this.timeout);
            }


        },
        shortDelay: function (callback) {
            var id;

            if ($.isFunction(callback)) {
                if (id = callback[this.id]) {
                    clearTimeout(id);
                    cancelAnimationFrame(id);
                }

                id = callback[this.id] = requestAnimationFrame(function () {
                    cancelAnimationFrame(id);

                    callback();

                }, this.frequency);
            }
        },
        setTimeout: function (timeout) {
            this.timeout = timeout;
        },
        getTimeout: function () {
            return this.timeout;
        },
        setFrequency: function (frequency) {
            this.frequency = frequency;
        },
        getFrequency: function () {
            return this.frequency;
        }
    };

    return new Performance();
},
popover:function(){
                    var popover;
                    //tooltip

                    +function () {

                        'use strict';

                        // TOOLTIP PUBLIC CLASS DEFINITION
                        // ===============================

                        var Tooltip = function (element, options) {
                            this.type = null;
                            this.options = null;
                            this.enabled = null;
                            this.timeout = null;
                            this.hoverState = null;
                            this.$element = null;
                            this.inState = null;

                            this.init('tooltip', element, options)
                        };

                        var $window = $(window);

                        Tooltip.VERSION = '3.3.7';

                        Tooltip.TRANSITION_DURATION = 150;

                        Tooltip.DEFAULTS = {
                            animation: true,
                            placement: 'top',
                            selector: false,
                            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                            trigger: 'hover focus',
                            title: '',
                            delay: 0,
                            html: false,
                            container: false,
                            viewport: {
                                selector: 'body',
                                padding: 0
                            }
                        };

                        Tooltip.prototype.init = function (type, element, options) {
                            this.enabled = true;
                            this.type = type;
                            this.$element = $(element);
                            this.options = this.getOptions(options);
                            this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport));
                            this.inState = {click: false, hover: false, focus: false};

                            if (this.$element[0] instanceof document.constructor && !this.options.selector) {
                                throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
                            }

                            var triggers = this.options.trigger.split(' ');

                            for (var i = triggers.length; i--;) {
                                var trigger = triggers[i];

                                if (trigger == 'click') {
                                    this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
                                } else if (trigger != 'manual') {
                                    var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
                                    var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

                                    this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
                                    this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
                                }
                            }

                            this.options.selector ?
                                (this._options = $.extend({}, this.options, {trigger: 'manual', selector: ''})) :
                                this.fixTitle()
                        };

                        Tooltip.prototype.getDefaults = function () {
                            return Tooltip.DEFAULTS
                        };

                        Tooltip.prototype.getOptions = function (options) {
                            options = $.extend({}, this.getDefaults(), this.$element.data(), options);

                            if (options.delay && typeof options.delay == 'number') {
                                options.delay = {
                                    show: options.delay,
                                    hide: options.delay
                                }
                            }

                            return options
                        };

                        Tooltip.prototype.getDelegateOptions = function () {
                            var options = {};
                            var defaults = this.getDefaults();

                            this._options && $.each(this._options, function (key, value) {
                                if (defaults[key] != value) options[key] = value
                            });

                            return options
                        };

                        Tooltip.prototype.enter = function (obj) {
                            var self = obj instanceof this.constructor ?
                                obj : $(obj.currentTarget).data('bs.' + this.type);

                            if (!self) {
                                self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
                                $(obj.currentTarget).data('bs.' + this.type, self)
                            }

                            if (obj instanceof $.Event) {
                                self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
                            }

                            if (self.tip().hasClass('in') || self.hoverState == 'in') {
                                self.hoverState = 'in';
                                return
                            }

                            clearTimeout(self.timeout);

                            self.hoverState = 'in';

                            if (!self.options.delay || !self.options.delay.show) return self.show();

                            self.timeout = setTimeout(function () {
                                if (self.hoverState == 'in') self.show()
                            }, self.options.delay.show)
                        };

                        Tooltip.prototype.isInStateTrue = function () {
                            for (var key in this.inState) {
                                if (this.inState[key]) return true
                            }

                            return false
                        };

                        Tooltip.prototype.leave = function (obj) {
                            var self = obj instanceof this.constructor ?
                                obj : $(obj.currentTarget).data('bs.' + this.type);

                            if (!self) {
                                self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
                                $(obj.currentTarget).data('bs.' + this.type, self)
                            }

                            if (obj instanceof $.Event) {
                                self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
                            }

                            if (self.isInStateTrue()) return;

                            clearTimeout(self.timeout);

                            self.hoverState = 'out';

                            if (!self.options.delay || !self.options.delay.hide) return self.hide();

                            self.timeout = setTimeout(function () {
                                if (self.hoverState == 'out') self.hide()
                            }, self.options.delay.hide)
                        };

                        Tooltip.prototype.show = function () {

                            //  将遮罩层以及提示栏的z-index提高比弹出框（1051）更高的1052，可以让在使用弹出框（popover)的同时，正常使用遮罩以及提示栏。
                            app.shelter.upperZIndex();

                            var e = $.Event('show.bs.' + this.type);

                            if (this.hasContent() && this.enabled) {
                                //add
                                this.$element.trigger(e);

                                var $tooltip = this.$element,
                                    tooltipUUID, resizeHandler,
                                    optionWidth = this.options.width,
                                    optionHeight = this.options.height;

                                var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
                                if (e.isDefaultPrevented() || !inDom) return;
                                var that = this;

                                var $tip = this.tip();

                                var tipId = this.getUID(this.type);

                                this.setContent();
                                $tip.attr('id', tipId);
                                this.$element.attr('aria-describedby', tipId);

                                if (this.options.animation) $tip.addClass('fade');

                                var placement = typeof this.options.placement == 'function' ?
                                    this.options.placement.call(this, $tip[0], this.$element[0]) :
                                    this.options.placement;

                                var autoToken = /\s?auto?\s?/i;
                                var autoPlace = autoToken.test(placement);
                                if (autoPlace) placement = placement.replace(autoToken, '') || 'top';


                                $tip
                                    .detach()
                                    .css({display: 'block'})
                                    // .css({ top: 0, left: 0, display: 'block' })
                                    .addClass(placement)
                                    .data('bs.' + this.type, this);

                                this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);

                                // xieyirong@agree.com.cn
                                // 2018-03-15
                                // resizeHandler 初始化气泡尺寸以及监听窗口变化重置气泡尺寸
                                if ((optionWidth || optionHeight)) {

                                    tooltipUUID = app.getUID();
                                    resizeHandler = function () {
                                        var tooltipHeight, tooltipWidth, windowHeight, windowWidth,
                                            tooltipCss = {},
                                            tooltipBodyCss, tooltipBodyHeight,
                                            placement, pos, actualWidth, actualHeight, calculatedOffset;


                                        if (optionWidth) {
                                            windowWidth = $window.width();

                                            if (optionWidth.indexOf('%') !== -1) {
                                                tooltipWidth = (parseInt(optionWidth, 10) / 100 || .8) * windowWidth;
                                            } else {
                                                tooltipWidth = parseInt(optionWidth, 10) || windowWidth * .8;
                                            }

                                            tooltipWidth = Math.min(tooltipWidth, windowWidth);
                                            tooltipWidth = Math.max(tooltipWidth, 0);
                                            tooltipCss.width = tooltipWidth;
                                            tooltipCss.marginLeft = 0;
                                        }

                                        if (optionHeight) {
                                            windowHeight = $window.height();

                                            if (optionHeight.indexOf('%') !== -1) {
                                                tooltipHeight = (parseInt(optionHeight, 10) / 100 || .7) * windowHeight;
                                            } else {
                                                tooltipHeight = parseInt(optionHeight, 10) || windowHeight * .7;
                                            }

                                            tooltipHeight = Math.min(tooltipHeight, windowHeight);

                                            tooltipBodyHeight = tooltipHeight - $tip.children('.aweb-popover-header').height();

                                            tooltipCss.height = tooltipHeight;
                                            tooltipCss.marginTop = 0;

                                            tooltipBodyCss = {
                                                maxHeight: tooltipBodyHeight,
                                                minHeight: tooltipBodyHeight
                                            };
                                        }


                                        $tip.css(tooltipCss);
                                        if (tooltipBodyCss) {
                                            $tip.children('.aweb-popover-body').css(tooltipBodyCss);
                                        }

                                        // resize 中更新 气泡位置

                                        placement = that.options.placement;
                                        pos = that.getPosition();
                                        actualWidth = $tip[0].offsetWidth;
                                        actualHeight = $tip[0].offsetHeight;
                                        calculatedOffset = that.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
                                        that.applyPlacement(calculatedOffset, placement);

                                    };

                                    $window.on('resize.' + tooltipUUID, resizeHandler);
                                    resizeHandler();

                                    this.uuid = tooltipUUID;
                                    this.resizeHandler = resizeHandler;
                                }

                                this.$element.trigger('inserted.bs.' + this.type);

                                var pos = this.getPosition(),
                                    actualWidth = $tip[0].offsetWidth,
                                    actualHeight = $tip[0].offsetHeight,
                                    calculatedOffset, fixWidth, fixHeight, originFixWidth, originFixHeight, popoverHeaderHeight,
                                    popoverBodyHeight;

                                if (autoPlace) {
                                    var orgPlacement = placement;
                                    var viewportDim = this.getPosition(this.$viewport);

                                    placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' :
                                        placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' :
                                            placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' :
                                                placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' :
                                                    placement;

                                    calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

                                    //对调整后方位为 left、top情况做处理，将原本的修改尺寸和调整后的修改尺寸作比较
                                    if (orgPlacement !== placement) {
                                        switch (placement) {
                                            case 'left':
                                                originFixWidth = viewportDim.width - pos.right;
                                                if (calculatedOffset.left < 0) {
                                                    fixWidth = actualWidth + calculatedOffset.left;
                                                    if (fixWidth < originFixWidth) {
                                                        fixWidth = originFixWidth;
                                                        placement = orgPlacement;
                                                        $tip.css({'width': fixWidth + 'px'});
                                                    }
                                                }
                                                break;
                                            case 'top':
                                                originFixHeight = viewportDim.height - pos.bottom;
                                                if (calculatedOffset.top < 0) {
                                                    fixHeight = actualHeight + calculatedOffset.top;
                                                    if (fixHeight < originFixHeight) {
                                                        fixHeight = originFixHeight - 10;
                                                        placement = orgPlacement;
                                                        popoverHeaderHeight = $tip.children('.aweb-popover-header').height();
                                                        popoverBodyHeight = fixHeight - popoverHeaderHeight;
                                                        $tip.css({'height': fixHeight + 'px'});
                                                        $tip.find('.aweb-popover-body').css({
                                                            'min-height': popoverBodyHeight + 'px',
                                                            'max-height': popoverBodyHeight + 'px'
                                                        });
                                                    }
                                                }
                                                break;
                                        }

                                    }

                                    $tip
                                        .removeClass(orgPlacement)
                                        .addClass(placement)
                                }

                                calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

                                //阻止气泡溢出
                                switch (placement) {
                                    case 'left':
                                    case 'right':
                                        if (calculatedOffset.left < 0) {
                                            fixWidth = actualWidth + calculatedOffset.left;
                                            $tip.css({'width': fixWidth + 'px'});
                                            calculatedOffset.left = 0;
                                        }
                                        break;
                                    case 'top':
                                    case 'bottm':
                                        if (calculatedOffset.top < 0) {
                                            fixHeight = actualHeight + calculatedOffset.top;
                                            popoverHeaderHeight = $tip.children('.aweb-popover-header').height();
                                            popoverBodyHeight = fixHeight - popoverHeaderHeight;
                                            $tip.css({'height': fixHeight + 'px'});
                                            $tip.find('.aweb-popover-body').css({
                                                'min-height': popoverBodyHeight + 'px',
                                                'max-height': popoverBodyHeight + 'px'
                                            });
                                            calculatedOffset.top = 0;
                                        }
                                        break;
                                }

                                this.applyPlacement(calculatedOffset, placement);

                                var complete = function () {
                                    var prevHoverState = that.hoverState;
                                    that.$element.trigger('shown.bs.' + that.type);
                                    that.hoverState = null;

                                    if (prevHoverState == 'out') that.leave(that)
                                };

                                $.support.transition && this.$tip.hasClass('fade') ?
                                    $tip
                                        .one('bsTransitionEnd', complete)
                                        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                                    complete()
                            }
                        };

                        Tooltip.prototype.applyPlacement = function (offset, placement) {
                            var $tip = this.tip();
                            var width = $tip[0].offsetWidth;
                            var height = $tip[0].offsetHeight;

                            // manually read margins because getBoundingClientRect includes difference
                            var marginTop = parseInt($tip.css('margin-top'), 10);
                            var marginLeft = parseInt($tip.css('margin-left'), 10);

                            // we must check for NaN for ie 8/9
                            if (isNaN(marginTop)) marginTop = 0;
                            if (isNaN(marginLeft)) marginLeft = 0;

                            offset.top += marginTop;
                            offset.left += marginLeft;

                            // $.fn.offset doesn't round pixel values
                            // so we use setOffset directly with our own function B-0
                            $.offset.setOffset($tip[0], $.extend({
                                using: function (props) {
                                    $tip.css({
                                        top: Math.round(props.top),
                                        left: Math.round(props.left)
                                    })
                                }
                            }, offset), 0);

                            $tip.addClass('in');

                            // check to see if placing tip in new offset caused the tip to resize itself
                            var actualWidth = $tip[0].offsetWidth;
                            var actualHeight = $tip[0].offsetHeight;

                            if (placement == 'top' && actualHeight != height) {
                                offset.top = offset.top + height - actualHeight
                            }

                            var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

                            if (delta.left) offset.left += delta.left;
                            else offset.top += delta.top;

                            var isVertical = /top|bottom/.test(placement);
                            var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
                            var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

                            $tip.offset(offset);

                            this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
                        };

                        Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
                            this.arrow()
                                .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
                                .css(isVertical ? 'top' : 'left', '')
                        };

                        Tooltip.prototype.setContent = function () {
                            var $tip = this.tip();
                            var title = this.getTitle();

                            $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
                            $tip.removeClass('fade in top bottom left right')
                        };

                        Tooltip.prototype.hide = function (callback) {
                            //  将遮罩层以及提示栏的z-index还原
                            app.shelter.lowerZIndex();

                            var that = this;
                            var $tip = $(this.$tip);
                            var e = $.Event('hide.bs.' + this.type);

                            function complete() {
                                if (that.hoverState != 'in') $tip.detach();
                                if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
                                    that.$element
                                        .removeAttr('aria-describedby')
                                        .trigger('hidden.bs.' + that.type)
                                }
                                callback && callback()
                            }

                            this.$element.trigger(e);

                            // null resizeHandler
                            if (this.uuid) {
                                $window.off('resize.' + this.uuid);
                                this.resizeHandler = null;
                            }

                            if (e.isDefaultPrevented()) return;

                            $tip.removeClass('in');

                            $.support.transition && $tip.hasClass('fade') ?
                                $tip
                                    .one('bsTransitionEnd', complete)
                                    .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                                complete();

                            this.hoverState = null;

                            return this
                        };

                        Tooltip.prototype.fixTitle = function () {
                            var $e = this.$element;
                            if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
                                $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
                            }
                        };

                        Tooltip.prototype.hasContent = function () {
                            return this.getTitle()
                        };

                        Tooltip.prototype.getPosition = function ($element) {
                            $element = $element || this.$element;

                            var el = $element[0];
                            var isBody = el.tagName == 'BODY';

                            var elRect = el.getBoundingClientRect();
                            if (elRect.width == null) {
                                // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
                                elRect = $.extend({}, elRect, {
                                    width: elRect.right - elRect.left,
                                    height: elRect.bottom - elRect.top
                                })
                            }
                            var isSvg = window.SVGElement && el instanceof window.SVGElement;
                            // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
                            // See https://github.com/twbs/bootstrap/issues/20280
                            var elOffset = isBody ? {top: 0, left: 0} : (isSvg ? null : $element.offset());
                            var scroll = {scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop()};
                            var outerDims = isBody ? {width: $(window).width(), height: $(window).height()} : null;

                            return $.extend({}, elRect, scroll, outerDims, elOffset)
                        };

                        Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
                            return placement == 'bottom' ? {
                                    top: pos.top + pos.height,
                                    left: pos.left + pos.width / 2 - actualWidth / 2
                                } :
                                placement == 'top' ? {
                                        top: pos.top - actualHeight,
                                        left: pos.left + pos.width / 2 - actualWidth / 2
                                    } :
                                    placement == 'left' ? {
                                            top: pos.top + pos.height / 2 - actualHeight / 2,
                                            left: pos.left - actualWidth
                                        } :
                                        /* placement == 'right' */
                                        {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}

                        };

                        Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
                            var delta = {top: 0, left: 0};
                            if (!this.$viewport) return delta;

                            var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
                            var viewportDimensions = this.getPosition(this.$viewport);

                            if (/right|left/.test(placement)) {
                                var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
                                var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
                                if (topEdgeOffset < viewportDimensions.top) { // top overflow
                                    delta.top = viewportDimensions.top - topEdgeOffset
                                } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                                    delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
                                }
                            } else {
                                var leftEdgeOffset = pos.left - viewportPadding;
                                var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
                                if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                                    delta.left = viewportDimensions.left - leftEdgeOffset
                                } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
                                    delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
                                }
                            }

                            return delta
                        };

                        Tooltip.prototype.getTitle = function () {
                            var title;
                            var $e = this.$element;
                            var o = this.options;

                            title = (typeof o.title == 'function' ? o.title.call($e[0]) : o.title) || $e.attr('data-original-title');

                            return title
                        };

                        Tooltip.prototype.getUID = function (prefix) {
                            do prefix += ~~(Math.random() * 1000000);
                            while (document.getElementById(prefix));
                            return prefix
                        };

                        Tooltip.prototype.tip = function () {
                            if (!this.$tip) {
                                this.$tip = $(this.options.template);
                                if (this.$tip.length != 1) {
                                    throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
                                }
                            }
                            return this.$tip
                        };

                        Tooltip.prototype.arrow = function () {
                            return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
                        };

                        Tooltip.prototype.enable = function () {
                            this.enabled = true
                        };

                        Tooltip.prototype.disable = function () {
                            this.enabled = false
                        };

                        Tooltip.prototype.toggleEnabled = function () {
                            this.enabled = !this.enabled
                        };

                        Tooltip.prototype.toggle = function (e) {
                            var self = this;
                            if (e) {
                                self = $(e.currentTarget).data('bs.' + this.type);
                                if (!self) {
                                    self = new this.constructor(e.currentTarget, this.getDelegateOptions());
                                    $(e.currentTarget).data('bs.' + this.type, self)
                                }
                            }

                            if (e) {
                                self.inState.click = !self.inState.click;
                                if (self.isInStateTrue()) self.enter(self);
                                else self.leave(self)
                            } else {
                                self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
                            }
                        };

                        Tooltip.prototype.destroy = function () {
                            var that = this;
                            clearTimeout(this.timeout);
                            this.hide(function () {
                                that.$element.off('.' + that.type).removeData('bs.' + that.type);
                                if (that.$tip) {
                                    that.$tip.detach()
                                }
                                that.$tip = null;
                                that.$arrow = null;
                                that.$viewport = null;
                                that.$element = null
                            })
                        };


                        // TOOLTIP PLUGIN DEFINITION
                        // =========================

                        function Plugin(option) {
                            return this.each(function () {
                                var $this = $(this);
                                var data = $this.data('bs.tooltip');
                                var options = typeof option == 'object' && option;

                                if (!data && /destroy|hide/.test(option)) return;
                                if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)));
                                if (typeof option == 'string') data[option]()
                            })
                        }

                        var old = $.fn.tooltip;

                        $.fn.tooltip = Plugin;
                        $.fn.tooltip.Constructor = Tooltip;


                        // TOOLTIP NO CONFLICT
                        // ===================

                        $.fn.tooltip.noConflict = function () {
                            $.fn.tooltip = old;
                            return this
                        }

                    }(jQuery);


                    //popover

                    +function () {
                        'use strict';

                        // POPOVER PUBLIC CLASS DEFINITION
                        // ===============================

                        var Popover = function (element, options) {
                            this.init('popover', element, options)
                        };

                        if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');

                        Popover.VERSION = '3.3.7';

                        Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
                            placement: 'right',
                            trigger: 'click',
                            content: '',
                            template: '<div class="aweb-popover" role="tooltip"><div class="arrow"></div><h3 class="aweb-popover-title"></h3><div class="aweb-popover-content"></div></div>'
                        });


                        // NOTE: POPOVER EXTENDS tooltip.js
                        // ================================

                        Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

                        Popover.prototype.constructor = Popover;

                        Popover.prototype.getDefaults = function () {
                            return Popover.DEFAULTS
                        };

                        Popover.prototype.setContent = function () {
                            var $tip = this.tip();
                            var title = this.getTitle();
                            var content = this.getContent();

                            $tip.find('.aweb-popover-title')[this.options.html ? 'html' : 'text'](title);
                            $tip.find('.aweb-popover-content').children().detach().end()[ // we use append for html objects to maintain js events
                                this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
                                ](content);

                            $tip.removeClass('fade top bottom left right in');

                            // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
                            // this manually by checking the contents.
                            if (!$tip.find('.aweb-popover-title').html()) $tip.find('.aweb-popover-title').hide()
                        };

                        Popover.prototype.hasContent = function () {
                            return this.getTitle() || this.getContent()
                        };

                        Popover.prototype.getContent = function () {
                            var $e = this.$element;
                            var o = this.options;

                            return $e.attr('data-content') ||
                                (typeof o.content == 'function' ?
                                    o.content.call($e[0]) :
                                    o.content)
                        };

                        Popover.prototype.arrow = function () {
                            return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
                        };


                        // POPOVER PLUGIN DEFINITION
                        // =========================

                        function Plugin(option) {
                            return this.each(function () {
                                var $this = $(this);
                                var data = $this.data('bs.popover');
                                var options = typeof option == 'object' && option;

                                if (!data && /destroy|hide/.test(option)) return;
                                if (!data) $this.data('bs.popover', (data = new Popover(this, options)));
                                if (typeof option == 'string') data[option]()
                            })
                        }

                        var old = $.fn.popover;

                        $.fn.popover = Plugin;
                        $.fn.popover.Constructor = Popover;


                        // POPOVER NO CONFLICT
                        // ===================

                        $.fn.popover.noConflict = function () {
                            $.fn.popover = old;
                            return this
                        }

                    }(jQuery);

                    popover = function () {


                        function popover(options) {

                            // var $popover = $(options.$elem).closest('button') !== 0 ? $(options.$elem).closest('button') : $(options.$elem);

                            // if ($popover && $popover.data("bs.popover")) {
                            //     return false;
                            // }

                            var CONST = {
                                    POPOVER_LANG: {
                                        TITLE: '气泡',
                                        CONTENT: '气泡内容',
                                        DEFAULT_BTN: '<button title="全屏切换" type="button" data-role="toggleSize"><i class="aweb-popover-header-icon aui aui-quanping fa fa-expand"></i></button><button title="关闭" type="button" data-role="close"><i class="aweb-popover-header-icon aui aui-guanbi iconfont icon-topbar-close"></i></button>'
                                    },
                                    POPOVER_NAMESPACE: '.pop'
                                },
                                _default = {
                                    title: CONST.POPOVER_LANG.TITLE, //弹出框标题，非必填
                                    content: CONST.POPOVER_LANG.CONTENT, //弹出框内容
                                    init: null, //初始化函数
                                    confirmHandler: function () {
                                    }, //点击确定按钮触发的函数，参数以数组形式写在args那里
                                    args: [],
                                    html: true,
                                    container: 'body',
                                    height: '50%',
                                    width: '80%',
                                    placement: 'auto right',
                                    hasHeader: true,
                                    template: '<div class="aweb-popover"  tabindex="0" role="tooltip"><div class="arrow"></div><div class="aweb-popover-header"><h4 class="aweb-popover-title"></h4><div class="btn-group">' +
                                    CONST.POPOVER_LANG.DEFAULT_BTN +
                                    '</div></div><div class="aweb-popover-body"><div class="aweb-popover-content"></div></div></div>'
                                };

                            var Pop = function (options) {
                                this.options = $.extend({}, _default, options);
                                this.init();
                                this.on(this.events);
                            };

                            Pop.fn = Pop.prototype = {
                                Constructor: Pop,
                                events: {
                                    toggleSize: function (e, context) {
                                        var popoverBodyHeight, popoverBodyCss;

                                        // 设置窗口大小
                                        context.$tip.toggleClass('popover-lg');

                                        //调整 popover-body 高度
                                        popoverBodyHeight = context.$tip.height() - context.$tip.children('.aweb-popover-header').height();

                                        popoverBodyCss = {
                                            maxHeight: popoverBodyHeight,
                                            minHeight: popoverBodyHeight
                                        };

                                        if (popoverBodyCss) {
                                            context.$tip.children('.aweb-popover-body').css(popoverBodyCss);
                                        }

                                        context.trigger('screenChange');

                                    },

                                    close: function (e, context) {
                                        context.$element && context.$element.popover('destroy');
                                        if (context.isShow) {
                                            var handler = context.options.confirmHandler;
                                            $.isFunction(handler) && handler.apply(context, context.options.args);
                                            context.isShow = false;
                                            context.popInstance.destroy();
                                        }
                                    }
                                },

                                init: function () {

                                    var listen = {},
                                        i, k,j, item, $newBtn,temp={},
                                        that = this,
                                        onList = this.options.on,
                                        $buttons, $button, btnClass, iconNamespace;


                                    this.isShow = true;
                                    this.options.args = [this].concat(this.options.args);

                                    if (!this.options.hasHeader) {
                                        this.options.template = '<div class="aweb-popover"  tabindex="0" role="tooltip"><div class="arrow"></div><div class="aweb-popover-body"><div class="aweb-popover-content"></div></div></div>';
                                    }

                                    //事件散列处理
                                    for (i in onList) {

                                        if (onList[i].btnName && onList[i].callback) {
                                            listen[onList[i].btnName] = onList[i].callback;
                                        }

                                    }

                                    this.events = $.extend({}, this.events, listen);


                                    for (k in this.events) {

                                        //引入temp对象，避免在IE8上的属性无限循环
                                        temp[k + CONST.POPOVER_NAMESPACE] = this.events[k];
                                        // this.events[k + CONST.POPOVER_NAMESPACE] = this.events[k];
                                        delete this.events[k];

                                    }

                                    for(j in temp){

                                        this.events[j] =temp[j];

                                    }

                                    temp = null;

                                    if ($.isFunction(this.options.$elem)) {
                                        this.options.$elem = this.options.$elem();
                                    }

                                    this.$element = $(this.options.$elem).closest('button').length !== 0 ? $(this.options.$elem).closest('button') : $(this.options.$elem).closest('span').length !== 0 ? $(this.options.$elem).closest('span') : $(this.options.$elem);

                                    if ($.isFunction(this.options.content)) {
                                        this.options.content = this.options.content();
                                    }

                                    this.$element.popover({
                                        title: this.options.title,
                                        content: this.options.content,
                                        html: this.options.html,
                                        container: this.options.container,
                                        height: this.options.height,
                                        width: this.options.width,
                                        placement: this.options.placement,
                                        template: this.options.template,
                                        animation: false
                                    }).popover('show');

                                    // 初始化模拟鼠标点击
                                    if (this.options.fixClick) {
                                        this.$element.data('bs.popover').inState.click = true;
                                    }

                                    this.popInstance = this.$element.data('bs.popover');

                                    //保存气泡弹出框的索引
                                    this.$tip = this.$element.data('bs.popover').tip();

                                    this.$btnCtn = this.$tip.find('.aweb-popover-header > .btn-group').html(CONST.POPOVER_LANG.DEFAULT_BTN);

                                    $buttons = this.$btnCtn.find('button i');

                                    // 绑定 options.init 中的 this 为 this.$tip 对象，将 this <Pop实例> 作为第一个参数传入

                                    if ($.isFunction(this.options.init)) {
                                        this.options.init.apply(this.$tip, this.options.args);
                                    }

                                    // 处理 aui 与 aweb 图标关系

                                    if (window.auiApp && window.auiApp.mode !== 'virtualizer') {
                                        $buttons.each(function (index, item) {
                                            $button = $(item);
                                            btnClass = item.className.split(' ');

                                            $.each(btnClass, function (index, item) {
                                                if (item !== 'aweb-popover-header-icon' && item.indexOf('aui') < 0) {
                                                    $button.removeClass(item);
                                                }
                                            });
                                        });
                                    } else {

                                        $buttons.each(function (index, item) {
                                            $(item).removeClass('aui');
                                        });
                                    }

                                    //合成按钮组（默认 关闭和全屏，并监听对应按钮的点击事件，并 trigger 对应注册的事件）

                                    for (i in onList) {
                                        //正则处理图标前缀
                                        if (onList[i].btnName && onList[i].icon && onList[i].title) {
                                            iconNamespace = onList[i].icon.match(/([a-z]+)-([a-z]+)/)[1];
                                            $newBtn = '<button title="' + onList[i].title + '" type="button" data-role="' + onList[i].btnName + '"><i class="aweb-popover-header-icon ' + iconNamespace + " " + onList[i].icon + '"></i></button>';
                                            this.$btnCtn.prepend($newBtn);
                                        }

                                    }

                                    this.$tip.on('click' + CONST.POPOVER_NAMESPACE, '.aweb-popover-header button', function (e) {
                                        that.$tip.trigger($(this).attr('data-role') + CONST.POPOVER_NAMESPACE, that);
                                    });

                                    this.$tip.focus();

                                    //focusout
                                    this.$tip.on('focusout' + CONST.POPOVER_NAMESPACE, function (e) {

                                        // relatedTarget 是 aweb-popover 中的元素
                                        if ($(e.relatedTarget).closest('.aweb-popover').is(that.$tip)) {
                                            return false;
                                        }

                                        if (that.isShow) {
                                            if ((that.$tip.is($(e.target)) || that.$tip.is($(e.target).closest('.aweb-popover'))) && (e.relatedTarget === null || ( e.relatedTarget !== undefined && $(e.relatedTarget).closest('.aweb-popover').length === 0))) {

                                                // 点击 popover 之外的区域造成的失焦
                                                if (that.options.focusable !== false) {
                                                    that.close();
                                                }

                                            } else {
                                                return false;
                                            }
                                        }
                                        //其他提前触发 close 的失焦行为都调用 Pop 实例的 close() 方法

                                    });

                                    // 监听popover 的 hide 事件，并执行 confirmHandler

                                    this.$element.one('hide.bs.popover', function () {
                                        that.isShow = false;
                                        var handler = that.options.confirmHandler;
                                        $.isFunction(handler) && handler.apply(that, that.options.args);
                                    });

                                    // 监听popover 的 hidden 事件，并销毁 popover 实例、Pop实例
                                    this.$element.one('hidden.bs.popover', function () {
                                        that.destroy();
                                    });

                                },

                                on: function () {
                                    this.$tip.on.apply(this.$tip, arguments);
                                },

                                off: function () {
                                    this.$tip.off.apply(this.$tip, arguments);
                                },

                                trigger: function () {
                                    this.$tip.trigger.apply(this.$tip, arguments);
                                },

                                destroy: function () {
                                    this.off();
                                    this.$element = null;
                                    this.$btnCtn = null;
                                    this.$tip = null;
                                    this.options = null;
                                },

                                close: function () {
                                    this.$tip && this.$tip.trigger('close', this);
                                },

                                toggleSize: function () {
                                    this.$tip && this.$tip.trigger('toggleSize', this);
                                },

                                setCache: function (key, value) {
                                    if (!this.cache) {
                                        this.cache = {}
                                    }
                                    this.cache[key] = value;
                                },

                                getCache: function (key) {
                                    if (this.cache) {
                                        return this.cache[key];
                                    }
                                }

                            };

                            return new Pop(options);

                        }

                        return popover;
                    }();

                    return popover;
                },
position:function (event, $container, $content, fixTop, fixLeft) {
    return {
        top: Math.max((($container.height() > $content.height() + event.clientY) ? event.clientY : (event.clientY - $content.height())) - (fixTop || 0), 0),
        left: Math.max((($container.width() > $content.width() + event.clientX) ? event.clientX : (event.clientX - $content.width())) - (fixLeft || 0), 0)
    };
},
queryString:function (key) {

        var
            hash = window.location.hash || document.location.hash,
            search = window.location.search || document.location.search || '',
            decoder = window.decodeURI || window.decodeURIComponent,
            rKey = new RegExp('\\b' + key + '=([^__app__]+)'),
            value;

        if (hash && !search) {
            search = hash.split('?')[1]
        }


        value = search.match(rKey);
        value = value && value[1];

        return value ? decoder(value) : '';
    },
removeData:function (name, fromCookie) {
    var result = true;

    if (fromCookie) {
        result = app.setData(name, '', true, -1);
    } else {
        try {
            window.localStorage.removeItem(name);
        } catch (e) {
            result = app.setData(name, '', true, -1);
        }
    }
    return result;
},
reset:function ($form, auiCtx) {
        var $inputs = $("[id]", $form),
            i, item, domId, ins,
            variables = auiCtx && auiCtx.variables,
            $item, $checkedItem, $inputItem;

        if (variables && (i = $inputs.length)) {
            for (; item = $inputs[--i];) {
                ins = variables[item.id];
                if (ins && $.isFunction(ins.resetValue)) {
                    ins.resetValue();
                }
            }
        } else if ($inputs.length) {
            for (i = -1; item = $inputs[++i];) {
                $item = $(':input,img,.text-div,.wangEditor-txt', item).not(':button, :submit, :reset,:disabled');
                $inputItem = $(':input', item).not(':radio,:checkbox');
                $checkedItem = $(':checked', item).not(':disabled');

                $inputItem.length && $inputItem.val('').removeAttr('selected');
                $checkedItem.length && $checkedItem.removeAttr('checked');

            }
        }

    },
screen:function () {
    var full = {},
        resizeHandlerList = {},
        globalResizeHandlerList = {},
        resizeTimeout;

    function resize() {
        window.clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(function () {
            var uid,
                _app = window.app || app;
            for (uid in globalResizeHandlerList) {
                if (globalResizeHandlerList[uid].timeout) {
                    window.setTimeout(globalResizeHandlerList[uid].callback, globalResizeHandlerList[uid].timeout);
                } else {
                    globalResizeHandlerList[uid].callback && globalResizeHandlerList[uid].callback();
                }
            }


            _app.router && _app.router.getCurrentHandler && (uid = _app.router.getCurrentHandler()) && (uid = uid.uid);

            if (uid && (uid = resizeHandlerList[uid])) {
                if (uid.timeout) {
                    window.setTimeout(uid.callback);
                } else {
                    uid.callback && uid.callback();
                }
            }
            uid = null;
        }, 100);
    }

    full.addResizeHandler = function (options) {

        if (options && options.uid && options.callback) {
            if (options.isGlobal) {
                globalResizeHandlerList[options.uid] = {
                    callback: options.callback,
                    timeout: options.timeout || 0
                };
            } else {
                resizeHandlerList[options.uid] = {
                    callback: options.callback,
                    timeout: options.timeout || 0
                };
            }
        }
    };
    full.removeResizeHandler = function (uid, isGlobal) {
        if (uid) {
            if (isGlobal) {
                globalResizeHandlerList[uid] = null;
                delete globalResizeHandlerList[uid];
            } else {
                resizeHandlerList[uid] = null;
                delete resizeHandlerList[uid];
            }
        }
    };
    full.triggerResizeHandler = function (uid, isGlobal) {
        if (uid) {
            if (isGlobal) {
                if (uid = globalResizeHandlerList[uid]) {
                    uid.callback && uid.callback();
                }
            } else if (uid = resizeHandlerList[uid]) {
                uid.callback && uid.callback();
            }
        }
    };

    $(window).resize(resize);


    return full;
},
scrollTop:function ($container, $content, speed, marginTop) {
        var cttOffset = $content.offset(),
            ctnOffset = $container.offset();
        if (ctnOffset && cttOffset) {
            marginTop = marginTop ? parseInt(marginTop) : 0;
            $container.animate({
                scrollTop: cttOffset.top + $container.scrollTop() - ctnOffset.top - marginTop
            }, speed || 200);
        }
    },
select:function (options, undefined) {
                    var _default = $.extend(true, {
                            context: undefined,
                            button: undefined,
                            container: undefined,
                            checkbox: 'checkbox',
                            isDataTable: false,
                            isSelectChildren: false, //true,//要配置data-prefix  例如父级的data-prefix=12,那么data-prefix需要等于12[^$]{1,}
                            operationButtons: null
                            /*{
                     list: '#insStartBtn,#insRestartBtn,#insStopBtn,#insDelBtn',
                     status: {
                     'Running': ['#insRestartBtn,#insStopBtn', '#insDelBtn'],//前面单选，后面多选
                     'Stopped': ['#insStartBtn', '#insDelBtn'],
                     '_default': ['', '#insDelBtn']
                     }
                     }*/
                            ,
                            setNodeMethod: function (list, elem) {
                                list[elem.id] = {
                                    node: elem,
                                    status: $(elem).attr('data-status')
                                };
                                return list;
                            },
                            getIdMethod: function (elem) {
                                return elem.id;
                            },
                            getStatusMethod: null

                        }, options),
                        //私有变量
                        __list = {},
                        __checkboxSelector = _default.checkbox,
                        __isDataTable = _default.isDataTable,
                        __isBCheckState = _default.bCheckState,
                        __isSelectChildren = _default.isSelectChildren,
                        __operationButtons = _default.operationButtons,

                        __allCheck = '',
                        __allData = _default.allData,
                        //私有jQuery变量
                        __$context = $(_default.context),
                        __$ctn = $(_default.container, __$context),
                        __$btn = $(_default.button, __$context),


                        //私有方法
                        _setNode = _default.setNodeMethod,
                        _getId = _default.getIdMethod,
                        _getStatus = _default.getStatusMethod,

                        _removeNode = function (list, elem) {
                            var id = _getId(elem);

                            list[id] = null;
                            delete list[id];
                        },

                        _selectChangeFunc = function () {
                            // var checked = __$btn[0].checked;

                            if (__allCheck === 'allcheck') {

                                $.each(__list, function (index, item) {
                                    // $("#"+$(item.node).attr('id'),__$ctn).attr('checked','checked');
                                    $('#' + index, __$ctn).prop('checked', true);
                                })
                            } else if (__allCheck === 'unAllcheck') {
                                _clear();
                            } else {
                                $.each(__list, function (index, item) {
                                    // $("#"+$(item.node).attr('id'),__$ctn).attr('checked','checked');
                                    $('#' + index, __$ctn).prop('checked', true);
                                })
                            }


                        },
                        _searchChangeFunc = function () {
                            var i;
                            if (__allCheck === 'allcheck') {
                                if (__allData[0]) {
                                    for (i = 0; i < __allData.length; i++) {
                                        _setNode(__list, $(__allData[i][0]).children(0)[0])
                                    }
                                }
                            }
                            $.each(__list, function (index, item) {
                                // $("#"+$(item.node).attr('id'),__$ctn).attr('checked','checked');
                                $('#' + index, __$ctn).prop('checked', true);
                            });
                        },
                        _updateStyle = function () {
                            var $checkbox = $(__checkboxSelector, __$ctn),
                                checkedLength = $checkbox.filter(':checked').length,
                                enableButton, checkLen = 0;

                            //更新全选按钮的样式
                            switch (checkedLength) {
                                case 0:
                                    __$btn.prop('indeterminate', false).removeAttr('checked').removeClass('tables-indeterminate');
                                    break;
                                case $checkbox.length:
                                    __$btn.prop('indeterminate', false).attr('checked', 'checked').removeClass('tables-indeterminate');
                                    break;
                                default:
                                    __$btn.prop('indeterminate', true).removeAttr('checked').addClass('tables-indeterminate');
                            }


                            //更新操作按钮的样式
                            if (__operationButtons && __operationButtons.list && __operationButtons.status) {
                                $(__operationButtons.list, __$context).attr('disabled', 'disabled');

                                if (checkedLength) {
                                    if (enableButton = __operationButtons.status[_getStatus(__list, _default)]) {
                                        enableButton = enableButton[checkedLength === 1 ? 0 : 1];
                                        if (enableButton) {
                                            $(enableButton, __$context).removeAttr('disabled');
                                        }
                                    }
                                }
                            }
                        },
                        _children = function (elem, checked) {
                            var $elem = $(elem),
                                execMethod = checked ? 'attr' : 'removeAttr';

                            if (!checked) $elem.removeAttr('checked');

                            $('[data-prefix^="' + $elem.attr('data-prefix') + '"]', __$ctn).not($elem)[execMethod]('disabled', 'disabled')[execMethod]('checked', 'checked');
                        },
                        _clear = function () {
                            __$btn.removeAttr('checked');
                            $(__checkboxSelector, __$context).removeAttr('checked');

                            for (var p in __list) {
                                __list[p] = null;
                                delete __list[p];
                            }
                            __allCheck = 'unAllcheck';
                            __list = {};
                            _updateStyle();
                        };


                    //默认禁用所有按钮
                    if (__operationButtons && __operationButtons.list) {
                        $(__operationButtons.list, __$context).attr('disabled', 'disabled');
                    }

                    //监听绑定
                    //多选按钮的更改事件
                    __$btn.off('.appSelect').on('click.appSelect', function () {
                        var checked = this.checked,
                            checkedMethod = !checked ? 'removeAttr' : 'attr',
                            execMethod = checked ? _setNode : _removeNode,
                            i;

                        if (__$btn.is(':checkbox') || (__$btn.is(':radio') && !checked)) {
                            //需要选择子集的
                            if (__isSelectChildren) {
                                $(__checkboxSelector, __$ctn)[checkedMethod]('checked', 'checked').each(function () {
                                    execMethod(__list, this);
                                    _children(this, checked);
                                });

                            } else { //不需要选择子集的

                                if (__isBCheckState) {
                                    if (__allCheck === 'allcheck') {
                                        __allCheck = 'unAllcheck';

                                        $.each(__list, function (index, item) {
                                            // $("#"+$(item.node).attr('id'),__$ctn).removeAttr('checked');
                                            $('#' + index, __$ctn).prop('checked', true);
                                        });
                                        _clear();


                                    } else {
                                        __allCheck = 'allcheck';

                                        //数据加载

                                        if (__allData[0]) {
                                            for (i = 0; i < __allData.length; i++) {
                                                _setNode(__list, $(__allData[i][0]).children(0)[0])
                                            }
                                        }
                                        $.each(__list, function (index, item) {
                                            // $("#"+$(item.node).attr('id'),__$ctn).attr('checked','checked');
                                            $('#' + index, __$ctn).prop('checked', true);
                                        });

                                    }
                                } else {
                                    $(__checkboxSelector, __$ctn)[checkedMethod]('checked', 'checked').each(function () {
                                        execMethod(__list, this);
                                    });
                                }


                            }
                        }

                        _updateStyle();
                    });

                    //表格更改事件
                    __$ctn.off('.appSelect').on('click.appSelect', function (ev) {
                        var e = ev.target || window.event.srcElement,
                            $e = $(e), checkLen = 0, timer = null;

                        if (($e.is(_default.checkbox) && !ev.isTrigger)) {

                            if ($e.is(':radio')) {
                                _clear();
                                $e.attr('checked', true);
                                _setNode(__list, e);
                            } else {


                                e.checked ? _setNode(__list, e) : _removeNode(__list, e);


                                if (__isBCheckState) {

                                    $.each(__list, function (index, item) {
                                        checkLen++;
                                        // $("#"+$(item.node).attr('id'),__$ctn).attr('checked','checked');
                                        $('#' + index, __$ctn).prop('checked', true);
                                    });
                                    if ($.isEmptyObject(__list)) {
                                        __allCheck = 'unAllcheck'
                                    } else if (checkLen === __allData.length) {
                                        __allCheck = 'allcheck';
                                    } else {
                                        __allCheck = 'indeterminate';
                                    }
                                }
                            }

                            if (__isSelectChildren) {
                                _children(e, e.checked);
                            }

                            _updateStyle();
                        }
                    });

                    //如果是dataTable
                    if (__isDataTable) {
                        //翻页事件重新统计选中实例按钮的样式
                        $('.dataTables_paginate', __$context).off('.appSelect').on('click.appSelect',function (e) {

                            var $e = $(e.target || window.event.srcElement), checked, checkedMethod, item;
                            if (__$btn[0]) {
                                checked = __$btn[0].checked;
                            }
                            checkedMethod = !checked ? 'removeAttr' : 'attr';


                            $(".paginate_button.current").attr("data-dt-idx");
                            if ($e.hasClass('paginate_button') || $e.parent().hasClass('paginate_button')) {
                                if (!__isBCheckState) {
                                    _clear();
                                }

                                if (__allCheck === "allcheck") {

                                    $(__checkboxSelector, __$ctn)[checkedMethod]('checked', 'checked').each(function () {
                                        _setNode(__list, this);
                                    });
                                    $.each(__list, function (index, item) {
                                        // $("#"+$(item.node).attr('id'),__$ctn).attr('checked','checked');
                                        $('#' + index, __$ctn).prop('checked', true);
                                    });

                                } else if (__allCheck === "unAllcheck") {
                                    for (item in __list) {

                                        $("#" + item, __$ctn).removeAttr('checked');
                                    }
                                    _clear();
                                } else {
                                    for (item in __list) {
                                        // id = $(item.node).attr('id');

                                        $("#" + item, __$ctn).attr('checked', 'checked').prop('checked', true);
                                    }
                                    // $.each(__list,function (index,item) {
                                    //     id = $(item.node).attr('id');
                                    //
                                    //     if($("#"+id,__$context).length) {
                                    //         $("#" + id, __$context).prop('checked', 'checked');
                                    //     }
                                    // });


                                }
                                _updateStyle();

                            }
                        });

                        if (!__isBCheckState) {
                            $('.dataTables_filter', __$context).find(':input').keyup(_clear);
                            $('.dataTables_length', __$context).find('select').change(_clear);
                        } else {
                            $('.dataTables_filter', __$context).find(':input').keyup(_searchChangeFunc);
                            $('.dataTables_length', __$context).find('select').change(_selectChangeFunc);
                        }

                    }


                    //返回组件方法
                    return {
                        //返回节列表的副本
                        nodes: function () {
                            return $.extend(true, {}, __list);
                        },
                        //选中一些checkbox,传入id组成的list
                        check: function (list) {
                            var $e, e, $input, firstPage = 0;

                            _clear();
                            __allCheck = '';
                            $.each(list, function (index, value) {

                                $e = $('#' + value, __$ctn);

                                firstPage++;

                                if ($e.length && $e.is(_default.checkbox)) {
                                    e = $e[0];

                                    e.checked = true;

                                    //必需找到指定的元素或者保存分页的情况下找
                                    if (!$('.dataTables_length', __$context).length || firstPage <= parseInt($('.dataTables_length', __$context).find('select').val(),10)||__isBCheckState) {
                                        _setNode(__list, e);

                                        if (__isSelectChildren) {
                                            _children(e, e.checked);
                                        }
                                    }

                                } else {
                                    $input=$('<input id="'+ value+'"/>');
                                    _setNode(__list, $input[0]);
                                    if (__isSelectChildren) {
                                        _children(e, e.checked);
                                    }
                                }
                            });

                            _updateStyle();
                        },
                        //返回节点ID数组
                        list: function (empty) {

                            var list = [],
                                p;

                            for (p in __list) {
                                list.push(p);
                            }

                            if(empty!==false) {
                                _clear();
                            }

                            return list;
                        },
                        //清除select的状态
                        clear: _clear,
                        size: function () {
                            var size = 0,
                                p;

                            for (p in __list) size++;

                            return size;
                        },
                        dispose: function () {
                            this.list(true);
                            for (var p in _default) {
                                _default[p] = null;
                                delete _default[p];
                            }

                            if (__isDataTable) {
                                $('.dataTables_paginate', __$context).off();
                                $('.dataTables_filter', __$context).find(':input').off();
                                $('.dataTables_length', __$context).find('select').off();
                            }

                            __$btn.off(), __$btn = null;
                            __$ctn.off(), __$ctn = null;
                            __$context = null;
                        }
                    };
                },
setData:function (name, value, toCookie, expireDays) {
        function setCookie(name, value, expireDays) {
            var temp = '_name_=_value_;path=' + document.location.hostname + ';expires=_expireDays_;max-age=_maxAge_',
                expireDate = new Date();

            expireDays = expireDays ? expireDays : 100;
            expireDate.setDate(expireDate.getDate() + expireDays);
            document.cookie = temp.replace(/_name_/, name).replace(/_value_/, value).replace(/_expireDays_/, expireDate.toUTCString()).replace(/_maxAge__/, 3600 * 24 * expireDays);

            return document.cookie; //判断是否禁用cookie
        }

        var encoder = window.encodeURI || window.encodeURIComponent || window.escape,
            result = true;

        if (value || !~expireDays) {
            if (typeof value !== 'string') {
                value = app.stringify(value);
            }
            value = encoder(value);

            if (toCookie) {
                result = !!setCookie(name, value, expireDays);
            } else {
                try {
                    window.localStorage.setItem(name, value);
                } catch (e) { //如果禁用localStorage将会抛出异常
                    result = !!setCookie(name, value, expireDays);
                }
            }
        } else {
            result = false;
        }

        return result;
    },
shelter:function(){
        var Shelter = function () {
            var context = this,
                $body = $('body');

            context.maskList = [];
            context.zIndexList = [];
            context._zIndexList = [];


            context.$mask = $(context.MASK_TEMP);
            context.$shelter = $(context.SHELTER_TEMP);
            context.$title = context.$shelter.find('.maskTitle');
            context.$alert = $('#alertList');


            $body.append(context.$mask);


            context.timeoutHandler = null;

            //兼容IE8~IE10背景为透明时遮罩不生效
            if (/MSIE|Trident/.test(navigator.userAgent)) {
                context.isIE = true;
                context.$shelterPolyfill = $(context.SHELTER_POLYFILL_TEMP);
                $body.append(context.$shelterPolyfill)
            }

            $body.append(context.$shelter);

            //绑定监听，为了兼容IE8，用document不用window
            $(document).on({
                'keydown.shelter': function (e) {
                    var key = e.which || window.event.keyCode,
                        url, bgStyle;
                    //如果key为27 遮罩消失
                    if (key === 27) {
                        //IE环境按esc键会使所有gif动画暂停，需重新请求gif
                        if (context.isIE) {
                            //使路径包含项目名
                            url = window.location.href.split('#')[0];
                            bgStyle = 'url(' + url + 'dependence/AWEB/img/loading.gif?timestamp=' + app.getUID() + ') no-repeat';
                            $('#maskPic').css('background', bgStyle);
                        }

                        context.hideAll();

                        //兼容IE8gif重新请求后不显示问题，阻止冒泡
                        return false;
                    }
                },
                'error.shelter': function (e) {
                    context.hideAll();
                }
            });
        };


        Shelter.prototype = {


            SHELTER_POLYFILL_TEMP: '<div id="shelterPolyfill" class="mask shelterPolyfill hide"></div>',
            SHELTER_TEMP: '<div id="shelter" class="mask shelter hide"><div class="maskCtn maskCtt"><div class="maskCtt"><div id="maskPic" class="maskPic"></div><div class="maskTitle"></div></div><div class="maskHelper"></div></div><div class="maskHelper"></div></div>',
            MASK_TEMP: '<div id="mask" class="hide"/>',

            ALERT_INDEX: 15000,
            ALERT_TOP: 5,

            MASK_INDEX: 1052,

            DEFAULT_TITLE: '请稍候…',
            DEFAULT_TIMEOUT: 60000,


            show: function (title, timeout, immediate, $context) {
                var modal, $el;
                this.maskList.push(arguments);
                this._upper(true, this.ALERT_INDEX + 1, undefined, false);

                if ($context) {
                    this._setShelter($context);
                } else {
                    app.router && app.router.getCurrentHandler && (modal = app.router.getCurrentHandler());
                    modal && ($el = modal.$renderTo);
                    $el && this._setShelter($el.parent());
                }

                this._showShelter(title, timeout);
            },
            hide: function () {
                this._hide();
            },
            hideAll: function () {
                this.maskList = [];
                this._zIndexList = [];
                this._lower(true);
                this._resetShelter();
                this._display(false);
            },


            upperZIndex: function (alertZIndex, maskZIndex, alertTop) {
                this._upper(false, alertZIndex, maskZIndex, alertTop);
            },
            lowerZIndex: function () {
                this._lower();
            },

            //使遮罩相对于$context垂直水平居中
            _setShelter: function ($context) {
                var el = $context.get(0),
                    position = el.getBoundingClientRect(),
                    $body = $('body'),
                    top = position.top,
                    right = $body.width() - position.right,
                    bottom = $body.height() - position.bottom,
                    left = position.left;


                this.$shelterPolyfill && this.$shelterPolyfill.css({
                    top: top + 'px',
                    right: right + 'px',
                    bottom: bottom + 'px',
                    left: left + 'px'
                });


                this.$shelter.css({
                    top: top + 'px',
                    right: right + 'px',
                    bottom: bottom + 'px',
                    left: left + 'px'
                })

            },
            _resetShelter: function () {

                this.$shelterPolyfill && this.$shelterPolyfill.css({
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                });

                this.$shelter.css({
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                })
            },

            _showShelter: function (title, timeout) {
                var context = this;

                this._setTitle(title);
                this._display(true);

                try {
                    timeout = parseInt(timeout, 10) || this.DEFAULT_TIMEOUT;
                } catch (e) {
                    timeout = this.DEFAULT_TIMEOUT;
                } finally {

                    clearTimeout(this.timeoutHandler);

                    this.timeoutHandler = setTimeout(function () {
                        context._hide();
                    }, timeout);
                }
            },
            _hide: function () {
                var maskList = this.maskList,
                    args;

                maskList.pop();
                this._lower(true);
                this._resetShelter();

                if (maskList.length) {
                    args = maskList[maskList.length - 1];

                    this._showShelter.apply(this, args);
                } else {
                    this._display(false);
                }
            },
            _setTitle: function (title) {
                this.$title
                    .empty()
                    .append(title || this.DEFAULT_TITLE);
            },
            _display: function (display) {


                if (!!display) {
                    this.$shelterPolyfill && this.$shelterPolyfill.removeClass('hide');
                    this.$shelter.removeClass('hide');


                } else {
                    this.$shelterPolyfill && this.$shelterPolyfill.addClass('hide');
                    this.$shelter.addClass('hide');
                }

            },
            _upper: function (inner, alertZIndex, maskZIndex, alertTop) {
                var $mask = inner ? this.$shelter : this.$mask,
                    $alert = this.$alert,
                    zIndexList = inner ? this._zIndexList : this.zIndexList;

                alertZIndex = alertZIndex === false ? '' : (alertZIndex && parseInt(alertZIndex, 10) || this.ALERT_INDEX);
                maskZIndex = maskZIndex && parseInt(maskZIndex, 10) || this.MASK_INDEX;

                //备份上次的zIndex
                zIndexList.push({
                    alertZIndex: this.ALERT_INDEX,
                    maskZIndex: $mask.css('zIndex')
                });

                if (maskZIndex !== -1) {
                    $mask
                        .addClass('mask')
                        .css({
                            'z-index': maskZIndex
                        });
                }
                $alert.css({
                    'z-index': alertZIndex,
                    'top': alertTop === false ? '' : (alertTop || this.ALERT_TOP)
                });
            },
            _lower: function (inner) {
                //恢复上次的zIndex
                var $mask = inner ? this.$shelter : this.$mask,
                    $alert = this.$alert,
                    zIndexList = inner ? this._zIndexList : this.zIndexList,
                    lastZIndex = zIndexList.length ? zIndexList.pop() : {
                        maskZIndex: this.MASK_INDEX,
                        alertZIndex: this.ALERT_INDEX
                    };

                if (!parseInt(lastZIndex.maskZIndex, 10)) { //如果上一次没有遮罩的话，则将mask移除
                    $mask.removeClass('mask');
                    $alert.css('top', '');
                }
                $mask.css('z-index', lastZIndex.maskZIndex || '');
                $alert.css('z-index', lastZIndex.alertZIndex || '');
            }

        };

        return new Shelter();
    },
stringify:function (config) {
        function functionStringify(obj) {
            if (obj !== undefined && typeof (obj) === "object") {
                var newObj = (obj instanceof Array) ? [] : {},
                    i = 0;

                for (var name in obj) {
                    i++;
                    if (obj[name] instanceof Function) {
                        newObj[name] = '_parseFunction_' + obj[name].toString()
                            .replace(/(\/\/[^\n\r]+)/g, '') //将行注释都抹掉
                            .replace(/[\n\r\t]/g, '').replace(/(\s)+/g, ' ')
                            .replace(/\\([ntrs\-\_])/g, '\\\\$1')
                            .replace(/(?:\/{2,}.*?[\r\n])|(?:\/\*.*?\*\/)/g, '');
                        //.replace(/\+/g, '##plus##');
                    } else {
                        newObj[name] = obj[name] && functionStringify(obj[name]);
                    }
                }
                if (!i) {
                    newObj = obj;
                }
                return newObj;
            } else {
                return obj;
            }
        }

        return config ? JSON.stringify(functionStringify(config)) : '';
    },
title:function (title) {
        var doc = window.top && window.top.document || document;

        if (typeof title === 'string') {
            doc.title = title;
        }

        return doc.title;
    },
validate:function () {
                    var setting = {
                        TYPE: {
                            /*必需*/
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
                            id: /^(?!\d+$)[\da-zA-Z]*$/,
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
                        SUCCESS_CALLBACK: function ($elem) {
                        },
                        ERROR_CALLBACK: function ($elem, msg) {

                            app.alert(msg, app.alert.ERROR);
                        },
                        CLEAN_CALLBACK: function (focusEvent) {
                        }
                    };
                    var _type = setting.TYPE,
                        _message = setting.MESSAGE,
                        _success = setting.SUCCESS_CALLBACK,
                        _error = setting.ERROR_CALLBACK,
                        _clean = setting.CLEAN_CALLBACK;

                    var validate = function (data, success, error, clean, isContinue, isValidate) {
                        var list = [],
                            result = true,
                            singleResult,
                            i, item,
                            info, $elem, value, exp, msg,
	                        successCallback,errorCallback,cleanCallback;

                        success = $.isFunction(success) ? success : _success;
                        error = $.isFunction(error) ? error : _error;
                        clean = $.isFunction(clean) ? clean : _clean;

                        if ($.isFunction(data)) {
                            data = data();
                        }

                        if ($.isArray(data)) {
                            for (i = -1;
                                 (item = data[++i]);) {
                                singleResult = true;
                                info = item.validate || {};
                                msg = info.errorMsg;

                                //get Element
	                            $elem = $(info.id?info.id:('#'+info.widgetID + ' :input'), info.context);

	                            //get value
                                value = item.value !== undefined ? item.value : ($elem.length ? $elem.val() : '');

                                //array handler
                                if($.isArray(value)){
                                    if(!value.length){
                                        value='';
                                    }else{
                                        value=JSON.stringify(value);
                                    }
                                }

                                if (isValidate) {
                                    //校验信息
                                    try {
                                        if (info.require === 'true' && (value === undefined || value === ''||value===null)) {
                                            singleResult = false;
                                            msg = item.desp + '必填';
                                        } else  { //require===true or default
                                            if (value){
                                                if (info.maxLength) {
                                                    if ((info.hasChineseCharacter === 'true' && value.replace(/[^\x00-\xff]/g, '**').length > parseInt(info.maxLength, 10)) ||
                                                        (value.length > parseInt(info.maxLength, 10))) {
                                                        singleResult = false;
                                                        msg = item.desp + '的最大长度不能大于' + info.maxLength;
                                                    }
                                                }

                                                if (singleResult && info.minLength) {
                                                    if ((info.hasChineseCharacter === 'true' && value.replace(/[^\x00-\xff]/g, '**').length < parseInt(info.minLength, 10)) ||
                                                        (value.length < parseInt(info.minLength, 10))) {
                                                        singleResult = false;
                                                        msg = item.desp + '的最小长度不能小于' + info.minLength;
                                                    }
                                                }
                                            }


                                            if (singleResult) {
                                                /*
                                         *   version 4.3
                                         *   desp    自定义校验功能
                                         *   author  lijiancheng@agree.com.cn
                                         * */
                                                if ($.isFunction(info.validateHandler)) {
                                                    singleResult = info.validateHandler(value);

                                                    if ($.isPlainObject(singleResult)) {
                                                        msg = singleResult.errorMsg;
                                                        value = singleResult.value;
                                                        singleResult = singleResult.result;
                                                    } else {
                                                        singleResult = true;
                                                    }

                                                } else if (info.regex) {
                                                    exp = _type[info.regex] || new RegExp(info.regex.replace(/\\\\/g, '\\'));

                                                    singleResult = $.isFunction(exp) ? exp(value) : exp.test(value);

                                                    msg = msg ? msg : _message[info.regex];
                                                }
                                            }
                                        }
                                    } catch (e) {
                                        msg = e.message;

                                        singleResult = false;
                                    }
                                }

	                            successCallback=info.successCallback||success;
	                            errorCallback=info.errorCallback||error;
	                            cleanCallback=info.cleanCallback||clean;

	                            if($.isArray(item.value)){
		                            value=item.value;
	                            }

                                if (singleResult) {
                                    list.push({
                                        name: item.name,
                                        value: value,
                                        queryString: item.queryString,
                                        urlExternal: item.urlExternal
                                    });

                                    successCallback($elem);

                                } else {
									if(info.pageContext){
                                    msg=$AW.nsl(msg,info.widgetID,info.pageContext);
									}
                                    list.push({
                                        name: item.name,
                                        value: value,
                                        queryString: item.queryString,
                                        urlExternal: item.urlExternal,
                                        errorMsg: msg
                                    });

	                                errorCallback($elem, msg);
	                                $elem.one('focus.validate', cleanCallback);

                                    result = result && singleResult;

                                    if (!isContinue) break;
                                }
                            }
                        } else {
                            list = data;
                        }

                        return {
                            data: list,
                            result: result
                        }
                    };

                    $.extend(validate, setting);

                    return validate;
                }
        },
        appInterfaces=[
    {
        "desp": "通信拦截层",
        "children": [
            {
                "name": "ajax",
                "desp": "异步请求",
                "belongTo": "closure",
                "hasReturn": true,
                "appJsCode": app.ajax,
                "returnValue": {
                    "desp": "",
                    "defaultValue": "",
                    "name": "ajax",
                    "details": "",
                    "type": "object"
                },
                "params": [
                    {
                        "name": "option",
                        "type": "object",
                        "desp": "参数对象",
                        "children": [
                            {
                                "name": "id",
                                "type": "string",
                                "desp": "ID",
                                "keepType": true,
                                "noCompile": true,
                                "hidden": true,
                                "defaultValue": "%%_INDEX%%",
                                "formatter": "replace",
                                "necessary": false
                            },
                            {
                                "name": "desp",
                                "type": "string",
                                "desp": "描述",
                                "noCompile": true,
                                "keepType": true,
                                "formatter": "replace",
                                "defaultValue": "自定义事件%%_INDEX%%",
                                "necessary": false
                            },
                            {
                                "name": "async",
                                "type": "boolean",
                                "desp": "异步调用",
                                "defaultValue": true,
                                "necessary": false
                            },
                            {
                                "name": "cache",
                                "type": "boolean",
                                "desp": "使用数据缓存",
                                "defaultValue": true,
                                "necessary": false
                            },
                            {
                                "name": "url",
                                "type": "string",
                                "desp": "URL",
                                "formatter": "replace",
                                "defaultValue": "##%%_INDEX%%-OVERVIEW_URL##",
                                "keepType": true,
                                "details": "字符串，必需，提交到后台的地址",
                                "necessary": true
                            },
                            {
                                "name": "type",
                                "type": "string",
                                "desp": "传参方式",
                                "defaultValue": "POST",
                                "keepType": true,
                                "details": "字符串，必需，传参方式",
                                "necessary": false
                            },
                            {
                                "name": "contentType",
                                "type": "string",
                                "desp": "传输内容类型",
                                "defaultValue": "application/x-www-form-urlencoded;charset=utf-8",
                                "necessary": false
                            },
                            {
                                "name": "dataType",
                                "type": "string",
                                "desp": "返回内容类型",
                                "defaultValue": "json",
                                "necessary": false
                            },
                            {
                                "name": "traditional",
                                "type": "boolean",
                                "desp": "使用传统的方式来序列化数据",
                                "defaultValue": "true",
                                "necessary": false
                            },
                            {
                                "name": "data",
                                "type": "array",
                                "desp": "传输数据",
                                "details": "传输数据，非必需，提交到后台的数据",
                                "necessary": false
                            },
                            {
                                "name": "jsonp",
                                "type": "string",
                                "desp": "jsonp请求回调函数名",
                                "necessary": false
                            },
                            {
                                "name": "jsonpCallback",
                                "type": "handler",
                                "desp": "jsonp请求回调函数",
                                "necessary": false
                            },
                            {
                                "name": "traditional",
                                "type": "boolean",
                                "desp": "使用传统方式传输数据",
                                "defaultValue": true,
                                "necessary": false
                            },
                            {
                                "name": "username",
                                "type": "string",
                                "desp": "HTTP 访问认证请求的用户名",
                                "necessary": false
                            },
                            {
                                "name": "password",
                                "type": "string",
                                "desp": "HTTP 访问认证请求的密码",
                                "necessary": false
                            },
                            {
                                "name": "shelter",
                                "type": "string",
                                "desp": "遮罩",
                                "details": "布尔型或字符串，非必需，当值为false | undefined | null时，不显示遮罩；当为true时，显示遮罩；当为字符串时，显示遮罩和该字符串",
                                "necessary": false
                            },
                            {
                                "name": "validate",
                                "type": "boolean",
                                "desp": "是否校验",
                                "details": "布尔型，非必需，表示是否需要校验",
                                "necessary": false
                            },
                            {
                                "name": "validateSuccessCallback",
                                "type": "handler",
                                "desp": "校验成功函数",
                                "details": "函数，非必需，说明见app.validate的successCallback部分",
                                "necessary": false
                            },
                            {
                                "name": "validateErrorCallback",
                                "type": "handler",
                                "desp": "校验失败函数",
                                "details": "函数，非必需，说明见app.validate的errorCallback部分",
                                "necessary": false
                            },
                            {
                                "name": "validateCleanCallback",
                                "type": "handler",
                                "desp": "清理错误回调函数",
                                "details": "函数，非必需，说明见app.validate的cleanCallback部分",
                                "necessary": false
                            },
                            {
                                "name": "validateContinue",
                                "desp": "校验失败后是否继续校验",
                                "type": "boolean",
                                "defaultValue": true,
                                "details": "布尔型，非必需，说明见app.validate的isContitnue部分",
                                "necessary": false
                            },
                            {
                                "name": "timeout",
                                "domSelector": "ajaxTimeout",
                                "type": "number",
                                "defaultValue": "60000",
                                "desp": "超时时间（ms）",
                                "details": "异步请求超时时间，单位毫秒（ms）",
                                "necessary": false
                            },
                            {
                                "name": "noAgreeBusData",
                                "domSelector": "noAgreeBusData",
                                "type": "boolean",
                                "defaultValue": true,
                                "desp": "非AgreeBus传输协议",
                                "details": "默认使用通用传输协议，若关闭该项则使用abusParams:序列化字符串",
                                "necessary": false
                            },
                            {
                                "name": "ajaxProcessData",
                                "domSelector": "ajaxProcessData",
                                "type": "boolean",
                                "defaultValue": true,
                                "desp": "使用字节流传输数据",
                                "details": "默认使用字节流传输数据，如果使用二进制流传输数据，需要上传文件时，应该关闭该项",
                                "necessary": false
                            },
                            {
                                "name": "ajaxNoBlobData",
                                "domSelector": "ajaxNoBlobData",
                                "type": "boolean",
                                "defaultValue": true,
                                "desp": "使用字节流返回数据",
                                "details": "默认使用字节流返回数据，如果返回为文件流（二进制流），应该关闭该项",
                                "necessary": false
                            },
                            {
                                "name": "urlDivider",
                                "domSelector": "urlDivider",
                                "type": "string",
                                "defaultValue": "/",
                                "desp": "传输参数作为请求路径数据时的分隔符",
                                "details": "发起请求时，当传输参数作为路径的一部分时的分隔符",
                                "necessary": false
                            },
                            {
                                "name": "beforeSend",
                                "type": "handler",
                                "desp": "发送请求前回调",
                                "defaultValue": "function(XHR){}",
                                "details": "函数，非必需",
                                "params": [
                                    {
                                        "name": "XHR",
                                        "type": "object",
                                        "desp": "XMLHttpRequest 对象"
                                    }
                                ],
                                "necessary": false
                            },
                            {
                                "name": "success",
                                "type": "function",
                                "desp": "成功回调",
                                "defaultValue": "function(response){\n \t if (response.status) {} \n \telse if (response.errorMsg) {\n \tapp.alert(response.errorMsg, app.alert.ERROR);\n \t}\n}",
                                "params": [
                                    {
                                        "name": "response",
                                        "type": "object",
                                        "desp": "返回对象"
                                    }
                                ],
                                "necessary": true
                            },
                            {
                                "name": "error",
                                "type": "function",
                                "desp": "失败回调",
                                "defaultValue": "function(XHR, textStatus, errorThrown){}",
                                "params": [
                                    {
                                        "name": "XHR",
                                        "type": "object",
                                        "desp": "XMLHttpRequest 对象"
                                    },
                                    {
                                        "name": "textStatus",
                                        "type": "string",
                                        "desp": "状态"
                                    },
                                    {
                                        "name": "errorThrown",
                                        "type": "object",
                                        "desp": "错误对象"
                                    }
                                ],
                                "necessary": false
                            },
                            {
                                "name": "complete",
                                "type": "function",
                                "desp": "完成回调",
                                "defaultValue": "function(XHR, textStatus){}",
                                "params": [
                                    {
                                        "name": "XHR",
                                        "type": "object",
                                        "desp": "XMLHttpRequest 对象"
                                    },
                                    {
                                        "name": "textStatus",
                                        "type": "string",
                                        "desp": "状态"
                                    }
                                ],
                                "necessary": false
                            }
                        ]
                    }
                ],
                "edition": {
                    "mobile": app.mobileHttp,
                    "agreeBus": app.ajax_AgreeBus
                },
                "compatibility": "ie8",
                "depJsArr": "[\"app.validate\",\"app.getUID\",\"app.modal\",\"app.getData\"]"
            }
        ]
    },
    {
        "desp": "AWEB 核心框架",
        "children": [
            {
                "name": "Controller",
                "desp": "AWEB核心SPA框架",
                "belongTo": "closure",
                "params": [
                    {
                        "name": "option",
                        "type": "object",
                        "desp": "参数",
                        "children": [
                            {
                                "name": "View",
                                "type": "object",
                                "desp": "SPA框架视图实现对象",
                                "defaultValue": "app.Controller.View",
                                "details": "非必需，SPA框架视图实现对象，至少需要实现open、close、setCurrentView、getCurrentView、removeView、switchView、resumeView这些方法，可以根据实际情况另外实现该方法",
                                "necessary": false
                            },
                            {
                                "name": "Model",
                                "type": "object",
                                "desp": "SPA框架数据模型实现对象",
                                "defaultValue": "app.Controller.Model",
                                "details": "非必需，SPA框架数据模型实现对象，需要实现load、pause、resume、unload、stepTo、setTimeout、clearTimeout、setInterval、clearInterval、delegateEvents、undelegateEvents，可以根据实际情况另外实现该方法",
                                "necessary": false
                            },
                            {
                                "name": "modulesPath",
                                "type": "string",
                                "desp": "模块路径",
                                "defaultValue": "module",
                                "details": "非必需，模块相对于WebContent的路径",
                                "necessary": false
                            },
                            {
                                "name": "separator",
                                "desp": "分割线",
                                "type": "string",
                                "defaultValue": "/",
                                "details": "非必需，模块地址的分割线，加入后台传过来的是error#404，将会被转移成\"./module/error/404/\"",
                                "necessary": false
                            },
                            {
                                "name": "mvvmConfName",
                                "type": "string",
                                "desp": "配置文件的名词",
                                "defaultValue": "mvvm.json",
                                "details": "非必需，在每个模块下都有此名的配置文件，用于记录该模块下单页页面js、html资源的路径",
                                "necessary": false
                            },
                            {
                                "name": "modulePath404",
                                "type": "string",
                                "desp": "404页面路径",
                                "defaultValue": "module/error/404/",
                                "details": "非必需，找不到页面的提示页面路径",
                                "necessary": false
                            },
                            {
                                "name": "validateCleanCallback",
                                "type": "handler",
                                "desp": "清理错误回调函数",
                                "details": "函数，非必需，说明见app.validate的cleanCallback部分",
                                "necessary": false
                            },
                            {
                                "name": "view",
                                "desp": "SPA框架视图配置",
                                "type": "object",
                                "necessary": true,
                                "children": [
                                    {
                                        "name": "isGlobal",
                                        "type": "boolean",
                                        "desp": "是否全局使用",
                                        "defaultValue": false,
                                        "details": "如果是全局的话，将会使用app.screen.addResizeHandler监听屏幕resize事件，另导航栏可以重置大小",
                                        "necessary": false
                                    },
                                    {
                                        "name": "ctn",
                                        "type": "string",
                                        "desp": "容器的jQuery选择器",
                                        "details": "必需，表示多标页的容器，建议传入jQuery对象",
                                        "necessary": true
                                    },
                                    {
                                        "name": "tabs",
                                        "type": "string",
                                        "desp": "多标签导航栏的jQuery选择器",
                                        "details": "必需，表示多标签导航栏的容器，建议传入jQuery对象",
                                        "necessary": true
                                    },
                                    {
                                        "name": "ctt",
                                        "type": "string",
                                        "desp": "页面内容的jQuery选择器",
                                        "details": "必需，表示页面内容的容器，建议传入jQuery对象",
                                        "necessary": true
                                    },
                                    {
                                        "name": "contextMenuOption",
                                        "type": "object",
                                        "desp": "多标签导航栏的右键配置",
                                        "details": "非必需,如果为false，则表示没有右键事件；具体例子，请见：app.router.tab.contextMenuOption",
                                        "necessary": false
                                    },
                                    {
                                        "name": "contextMenuCallback",
                                        "type": "object",
                                        "desp": "多标签导航栏的右键点击回调函数",
                                        "details": "如果contextMenuOption不为false，则必需，具体例子，请见：app.router.tab.contextMenuCallback",
                                        "necessary": false
                                    },
                                    {
                                        "name": "untitled",
                                        "type": "string",
                                        "desp": "默认标题",
                                        "details": "如果传入的标题没有的时候，默认标题",
                                        "necessary": false
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "returnValue": {
                    "name": "router",
                    "type": "object",
                    "desp": "路由",
                    "children": [
                        {
                            "name": "open",
                            "type": "object",
                            "desp": "打开标签页",
                            "details": "该方法挂载到app.open下，底层是调用router.tab.open方法",
                            "children": [
                                {
                                    "name": "option",
                                    "desp": "配置",
                                    "type": "object",
                                    "children": [
                                        {
                                            "name": "status",
                                            "type": "boolean",
                                            "desp": "状态是否正常",
                                            "defaultValue": false,
                                            "details": "必需"
                                        },
                                        {
                                            "name": "fixed",
                                            "type": "boolean",
                                            "desp": "标签页是否固定",
                                            "defaultValue": false,
                                            "details": "非必需，表示打开的标签页是否固定，该参数只在打开BLANK(新标签页)、WINDOW(新窗口)类型标签页时生效"
                                        },
                                        {
                                            "name": "content",
                                            "type": "object",
                                            "desp": "页面数据",
                                            "details": "在单页页面中，可以通过auiCtx.pageParams获取页面数据"
                                        },
                                        {
                                            "name": "page",
                                            "type": "string",
                                            "desp": "模块路径",
                                            "defaultValue": "error#404",
                                            "details": "使用井号#将文件夹进行分割"
                                        },
                                        {
                                            "name": "title",
                                            "type": "string",
                                            "desp": "标题",
                                            "details": "可以在初始化Controller时，设置option.view.untitled属性。如果是通过自子页面标题打开，title=undefined，则不会显示标题"
                                        },
                                        {
                                            "name": "type",
                                            "type": "string",
                                            "desp": "页面类型",
                                            "defaultValue": "BLANK",
                                            "details": "可选值有新标签页BLANK、子标签页SUB、当前标签页SELF、新窗口WINDOW"
                                        },
                                        {
                                            "name": "id",
                                            "type": "string",
                                            "desp": "页面的ID标识",
                                            "defaultValue": "BLANK",
                                            "details": "此ID与单页页面中的handler.id相同"
                                        },
                                        {
                                            "name": "hasFooter",
                                            "type": "boolean",
                                            "desp": "是否由底部按钮",
                                            "defaultValue": true,
                                            "details": "如果是通过子页面打开，可以设置子页面是否由底部footer按钮"
                                        },
                                        {
                                            "name": "height",
                                            "type": "string",
                                            "desp": "子页面高度",
                                            "defaultValue": "80%",
                                            "details": "如果是通过子页面打开，可以设置子页面的高度"
                                        },
                                        {
                                            "name": "width",
                                            "type": "string",
                                            "desp": "子页面宽度",
                                            "defaultValue": "80%",
                                            "details": "如果是通过子页面打开，可以设置子页面的宽度"
                                        },
                                        {
                                            "name": "fullscreen",
                                            "type": "boolean",
                                            "desp": "是否全屏",
                                            "defaultValue": "false",
                                            "details": "是否使用全屏打开"
                                        },
                                        {
                                            "name": "displayNav",
                                            "type": "boolean",
                                            "desp": "显示标签导航栏",
                                            "defaultValue": "true",
                                            "details": "是否显示标签导航栏"
                                        },
                                        {
                                            "desp": "项目地址",
                                            "defaultValue": "",
                                            "necessary": false,
                                            "details": "如果打开多个项目时，需要配置",
                                            "name": "server",
                                            "type": "string"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "tab",
                            "type": "object",
                            "desp": "视图实例",
                            "children": [
                                {
                                    "name": "close",
                                    "desp": "关闭标签页",
                                    "details": "该方法挂载到app.close下,底层是调用app.router.tab.close方法",
                                    "hasReturn": false,
                                    "params": [
                                        {
                                            "name": "domID",
                                            "type": "string",
                                            "desp": "页面数据模型的唯一ID",
                                            "defaultValue": "app.router.getCurrentHandler().domID",
                                            "details": "非必需，可以在单页页面中通过handler.domID获取，默认值为当前标签页"
                                        },
                                        {
                                            "name": "_doNotResume",
                                            "type": "boolean",
                                            "desp": "不调用上个页面的恢复动作",
                                            "defaultValue": "false",
                                            "details": "非必需，需要关闭多个页面的时候，可以将这个配置项加了优化性能，但可能会导致页面混乱，慎用"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                "hasReturn": true,
                "compatibility": "ie8",
                "appJsCode": app.Controller,
                "edition": {
                    "aibs": app.Controller_AIBS
                },
                "depJsArr": "[\"app.position\",\"app.getUID\",\"app.screen\",\"app.getQueryStringMap\",\"app.getData\",\"app.dispatcher\",\"app.modal\",\"app.popover\",\"app.setData\",\"app.getNewQueryStringURL\",\"app.domain\"]"
            }
        ]
    },
    {
        "desp": "便携操作",
        "children": [
            {
                "name": "alert",
                "desp": "提示框",
                "belongTo": "closure",
                "params": [
                    {
                        "name": "message",
                        "type": "string",
                        "desp": "提示语句",
                        "details": "可以使HTML代码，消息内容，必需",
                        "necessary": true
                    },
                    {
                        "name": "alertType",
                        "type": "string_select",
                        "desp": "提示类型",
                        "details": "有“_DEFAULT\"(默认),\"SUCCESS\"(成功),\"ERROR\"(错误),\"WARNING\"(警告),\"MESSAGE\"(信息)五种类型，使用时许引用app.alert.showType",
                        "necessary": true
                    },
                    {
                        "name": "alertID",
                        "type": "string",
                        "desp": "提示语句ID",
                        "details": "提示语句ID，假如在消息队列中存在相同的ID，则不再重复提示",
                        "necessary": false
                    }
                ],
                "appJsCode": app.alert,
                "edition": {
                    "mobile": app.alert_mobile
                },
                "hasReturn": false,
                "compatibility": "ie8",
                "depJsArr": "[\"app.dispatcher\"]"
            },
            {
                "name": "alertAction",
                "desp": "提示框操作",
                "belongTo": "class",
                "appJsCode": app.alertAction,
                "cInterfaces": [
                    {
                        "name": "close",
                        "desp": "关闭提示框",
                        "params": [
                            {
                                "name": "option",
                                "type": "object",
                                "children": [
                                    {
                                        "name": "id",
                                        "desp": "需要关闭的提示框id",
                                        "type": "string",
                                        "necessary": true
                                    }
                                ]
                            }
                        ],
                        "details": "当调用app.alert有传入id时，输入该id可以关闭",
                        "defaultValue": "app.alertAction.close(\"1\")"
                    },
                    {
                        "name": "closeAll",
                        "desp": "关闭所有提示框",
                        "details": "关闭所有提示框"
                    },
                    {
                        "name": "getAlertList",
                        "desp": "获取所有正在执行的提示框列表",
                        "details": "获取所有正在执行的提示框列表信息，包括在界面上显示的提示框和在队列中的提示框，它将返回一个数组，里面每一个索引对应一个对象，包含每一个提示框的信息，0键对应提示框内容，1键对应提示框类型，2键对应提示框id",
                        "hasReturn": true,
                        "returnValue": {
                            "name": "alertList",
                            "type": "array",
                            "desp": "正在执行的所有提示框列表",
                            "defaultValue": "[{\"0\":\"msgContent1\",\"1\":\"error\",\"2\":\"id1\"},{\"0\":\"msgContent2\",\"1\":\"success\",\"2\":\"id2\"},{\"0\":\"msgContent3\",\"1\":\"warning\",\"2\":\"id3\"}]"
                        }
                    },
                    {
                        "name": "listener",
                        "desp": "监听alert事件",
                        "details": "监听alert事件",
                        "params": [
                            {
                                "name": "callback",
                                "desp": "回调函数",
                                "type": "handler",
                                "details": "回调函数，底层返回提示框参数作为入参",
                                "children": [
                                    {
                                        "name": "itemMsg",
                                        "desp": "提示框参数",
                                        "type": "object",
                                        "details": "提示框参数，包括当前提示框的信息、类型、id",
                                        "children": [
                                            {
                                                "name": "1",
                                                "type": "string",
                                                "desp": "当前提示框信息"
                                            },
                                            {
                                                "name": "2",
                                                "type": "string",
                                                "desp": "当前提示框类型"
                                            },
                                            {
                                                "name": "3",
                                                "type": "string",
                                                "desp": "当前提示框的id"
                                            }
                                        ]
                                    }
                                ],
                                "necessary": true
                            }
                        ]
                    }
                ],
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "behavior",
                "desp": "行为接口",
                "belongTo": "closure",
                "appJsCode": app.behavior,
                "params": [
                    {
                        "name": "input1",
                        "desp": "输入值",
                        "details": "输入值一般从组件中获取,比较类型：小于、大于时：数字；等于、不等于时：字符串、数字、对象、数组、null；包含、不包含时：字符串、数组、对象；其中数组的格式为[1,2,3,\"a\",\"b\",\"c\"]，对象格式为{\"a\":1,\"b\":[],\"c\":\"abc\"}",
                        "type": "string",
                        "necessary": true
                    },
                    {
                        "name": "input2",
                        "desp": "比较值",
                        "details": "比较类型：小于、大于时：数字；等于、不等于时：字符串、数字、对象、数组、null；包含、不包含时：字符串、数组、对象；其中数组的格式为[1,2,3,\"a\",\"b\",\"c\"]，对象格式为{\"a\":1,\"b\":[],\"c\":\"abc\"}",
                        "type": "string",
                        "necessary": true
                    },
                    {
                        "desp": "比较条件",
                        "name": "condition",
                        "details": "比较字段值和输入值返回结果。例如：\n小于：字段值0，比较值1，返回true；\n等于：字段值0，比较值1，返回false；\n不等于：字段值：1，比较值2，返回true；\n包含：字段值\"abc\"，比较值\"startabc\"，返回true；\n字段值\"a\"，比较值[1,2,]，返回true；\n开头：字段值\"abc\"，比较值\"abcd\"，返回true；",
                        "type": "string",
                        "necessary": true
                    },
                    {
                        "desp": "回调函数",
                        "name": "callback",
                        "defaultValue": "function(result,input1,input2,condition){}",
                        "details": "将比较结果（result）、输入值（input1）、比较值（input2）、比较条件（condition）传个回调函数，进行处理",
                        "type": "handler",
                        "necessary": true
                    }
                ],
                "hasReturn": false,
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "require": true,
                "name": "collapse",
                "desp": "折叠菜单功能",
                "belongTo": "closure",
                "appJsCode": app.collapse,
                "hasReturn": false,
                "depJsArr": "[]"
            },
            {
                "name": "deepClone",
                "desp": "深克隆",
                "params": [
                    {
                        "name": "object",
                        "desp": "待克隆对象",
                        "type": "object",
                        "necessary": true
                    }
                ],
                "hasReturn": true,
                "appJsCode": app.deepClone,
                "returnValue": {
                    "name": "deepClonedObject",
                    "type": "object",
                    "desp": "深克隆对象"
                },
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "dispatcher",
                "desp": "事件分发",
                "details": "实现自定义事件",
                "belongTo": "closure",
                "appJsCode": app.dispatcher,
                "params": [
                    {
                        "name": "timeout",
                        "desp": "时间(毫秒)",
                        "details": "分发事件的时间",
                        "type": "number",
                        "necessary": false
                    }
                ],
                "returnValue": {
                    "desp": "事件实例",
                    "name": "eventInstance",
                    "details": "",
                    "type": "object",
                    "children": [
                        {
                            "name": "on",
                            "desp": "定义事件",
                            "details": "$AW.on({\"type1.namespace1.namespace2\":callback1,\"type2.namespace1.namespace2\":callback2});$AW.on(\"type1.namespace1.namespace2,type2.namespace1.namespace2\",callback);$AW.on(\"type1\",\"namespace\",callback);",
                            "type": "function"
                        },
                        {
                            "name": "off",
                            "desp": "解绑事件",
                            "type": "function",
                            "details": "$AW.off(\"type1.namespace1.namespace2,type2.namespace1.namespace2,\")"
                        },
                        {
                            "name": "trigger",
                            "desp": "触发事件",
                            "type": "function",
                            "details": "$AW.trigger(\"type1.namespace1.namespace2,type2.namespace1.namespace2,\")"
                        }
                    ]
                },
                "hasReturn": true,
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "eval",
                "desp": "将函数字符串转化成可执行函数，并将代码的作用域限定在闭包中",
                "hasReturn": true,
                "appJsCode": app.eval,
                "params": [
                    {
                        "name": "functionString",
                        "defaultValue": "function(key){console.log(key);}",
                        "desp": "JavaScript函数字符串",
                        "type": "string",
                        "necessary": true
                    }
                ],
                "returnValue": {
                    "name": "func",
                    "type": "function",
                    "desp": "转义后的代码"
                },
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "getUA",
                "desp": "获取设备终端信息",
                "belongTo": "closure",
                "hasReturn": true,
                "appJsCode": app.getUA,
                "ReturnValue": {
                    "name": "result",
                    "type": "string",
                    "desp": "设备终端信息,包含浏览器环境（weixin\"微信\"、Alipay\"支付宝\"、Cordova类似于cordova环境、Ionic类似于Ionic环境）、设备类型（PC(非IE内核）、IE、iPad、iPhone、androidPhone、androidPad)",
                    "defaultValue": "weixin iPhone"
                },
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "getUID",
                "desp": "获取唯一的ID",
                "hasReturn": true,
                "appJsCode": app.getUID,
                "returnValue": {
                    "name": "uid",
                    "type": "string",
                    "desp": "唯一的ID",
                    "defaultValue": "87C0D1E26342B2A334DB-FC8D"
                },
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "require": true,
                "name": "hsla",
                "desp": "生成随机颜色（不支持IE8）",
                "compatibility": "modernBrowser",
                "belongTo": "closure",
                "appJsCode": app.hsla,
                "params": [
                    {
                        "name": "option",
                        "type": "object",
                        "desp": "选项",
                        "children": [
                            {
                                "name": "h",
                                "type": "number",
                                "desp": "颜色值",
                                "details": "整型，非必需，表示需要生成颜色的值，范围为[0,360),如果isRandom=true,则h不需要填，填了也不会生效"
                            },
                            {
                                "name": "s",
                                "type": "string",
                                "desp": "颜色对比度",
                                "details": "百分比，字符串型，必需，表示需要生成颜色的对比度，范围为[0,100%)"
                            },
                            {
                                "name": "l",
                                "type": "string",
                                "desp": "颜色亮度",
                                "details": "百分比，字符串型，必需，表示需要生成颜色的亮度，范围为[0,100%)"
                            },
                            {
                                "name": "a",
                                "type": "number",
                                "desp": "颜色透明度",
                                "details": "数值型，必需，表示需要生成颜色的透明度，范围为[0,1]"
                            }
                        ]
                    },
                    {
                        "name": "isRandom",
                        "type": "boolean",
                        "desp": "需要随机生成颜色的值",
                        "details": "布尔型，option.h存在则非必需，否则必需。表示需要随机生成颜色的值"
                    }
                ],
                "hasReturn": true,
                "returnValue": {
                    "name": "color",
                    "type": "string",
                    "desp": "返回颜色",
                    "details": "在现代浏览器下，返回rgba(red,green.blur,alpha)格式的颜色；在IE8或以下，则返回rgb(red,green,blue)"
                },
                "depJsArr": "[]"
            },
            {
                "name": "shelter",
                "desp": "遮罩",
                "details": "实现遮罩的显示和隐藏,用于禁止在获取后台数据或加载数据等短时间内用户的操作",
                "belongTo": "class",
                "appJsCode": app.shelter,
                "cInterfaces": [
                    {
                        "name": "show",
                        "desp": "显示遮罩",
                        "details": "显示遮罩，显示超时时间为60秒",
                        "hasReturn": false,
                        "params": [
                            {
                                "name": "tips",
                                "type": "string",
                                "desp": "提示语句",
                                "details": "遮罩显示的内容，非必需",
                                "necessary": false
                            },
                            {
                                "name": "timeout",
                                "type": "number",
                                "desp": "超时时间",
                                "details": "遮罩超时时间，缺省值60000ms，即60s。遮罩超过60s则报错超时错误并隐藏遮罩。非必需",
                                "defaultValue": 60000,
                                "necessary": false
                            },
                            {
                                "name": "immediate",
                                "type": "boolean",
                                "desp": "是否立刻执行",
                                "details": "是否立即显示遮罩，缺省值220ms后显示。非必需",
                                "necessary": false
                            },
                            {
                                "name": "$context",
                                "type": "jQuery选择器",
                                "desp": "遮罩显示范围的jQuery选择器",
                                "details": "参数为undefined时，默认当前页面模型的父容器，当接口为移动端版本时，该参数无效",
                                "necessary": false
                            }
                        ]
                    },
                    {
                        "name": "hide",
                        "desp": "隐藏最顶部的遮罩",
                        "hasReturn": false
                    },
                    {
                        "name": "hideAll",
                        "desp": "隐藏所有遮罩，不推荐使用",
                        "hasReturn": false
                    },
                    {
                        "name": "lowerZIndex",
                        "desp": "恢复遮罩层z-index",
                        "hasReturn": false
                    },
                    {
                        "name": "upperZIndex",
                        "desp": "提升遮罩层z-index",
                        "hasReturn": false,
                        "params": [
                            {
                                "name": "alertZIndex",
                                "desp": "提示栏z-index",
                                "type": "string",
                                "details": "提升提示栏的z-index，缺省值1052。为false时，表示不设置",
                                "defaultValue": "1052",
                                "necessary": false
                            },
                            {
                                "name": "maskZIndex",
                                "desp": "遮罩层的z-index",
                                "type": "string",
                                "details": "提升遮罩层的z-index，缺省值4。右侧边栏的z-index为1062",
                                "defaultValue": "4",
                                "necessary": false
                            },
                            {
                                "name": "alertTop",
                                "desp": "提示栏的top",
                                "type": "string",
                                "details": "设置提示栏的top，缺省值auto。为false时，表示不设置",
                                "defaultValue": "auto",
                                "necessary": false
                            }
                        ]
                    }
                ],
                "compatibility": "ie8",
                "edition": {
                    "mobile": app.shelter_mobile
                },
                "depJsArr": "[\"app.getUID\"]"
            },
            {
                "name": "modal",
                "desp": "弹窗",
                "belongTo": "closure",
                "appJsCode": app.modal,
                "params": [
                    {
                        "name": "option",
                        "desp": "配置",
                        "type": "object",
                        "children": [
                            {
                                "name": "title",
                                "type": "string",
                                "desp": "标题",
                                "defaultValue": "弹窗",
                                "details": "弹窗标题，非必填",
                                "necessary": false
                            },
                            {
                                "name": "content",
                                "type": "string",
                                "desp": "弹窗内容",
                                "defaultValue": "弹窗内容",
                                "details": "可以是html字符串；或函数，返回内容的jQuery对象",
                                "necessary": true
                            },
                            {
                                "name": "btnConfirm",
                                "type": "string",
                                "desp": "确定按钮显示的内容",
                                "defaultValue": "确定",
                                "details": "如果填写false，则不会显示确定按钮",
                                "necessary": false
                            },
                            {
                                "name": "btnCancel",
                                "type": "string",
                                "desp": "取消按钮显示的内容",
                                "defaultValue": "取消",
                                "details": "如果填写false，则不会显示取消按钮",
                                "necessary": false
                            },
                            {
                                "name": "btnIgnore",
                                "type": "string",
                                "desp": "忽略按钮显示的内容",
                                "details": "如果没有填写忽略按钮的内容，则不会显示忽略按钮",
                                "necessary": false
                            },
                            {
                                "name": "init",
                                "type": "handler",
                                "desp": "初始化函数",
                                "defaultValue": "function(){}",
                                "details": "打开弹窗时，加载的方法，其中入参为agrs的参数，this指向内容的DOM对象",
                                "necessary": false
                            },
                            {
                                "name": "confirmHandler",
                                "type": "handler",
                                "desp": "确定按钮点击事件",
                                "defaultValue": "function(){}",
                                "details": "确定按钮点击事件，其中入参为agrs的参数，this指向按钮的DOM对象，当return false时，将不隐藏弹窗",
                                "necessary": true
                            },
                            {
                                "name": "cancelHandler",
                                "type": "handler",
                                "desp": "取消按钮点击事件",
                                "defaultValue": "function(){}",
                                "details": "取消按钮点击事件，其中入参为agrs的参数，this指向按钮的DOM对象，当return false时，将不隐藏弹窗",
                                "necessary": false
                            },
                            {
                                "name": "ignoreHandler",
                                "type": "handler",
                                "desp": "忽略按钮点击事件",
                                "defaultValue": "function(){}",
                                "details": "忽略按钮点击事件，其中入参为agrs的参数，this指向按钮的DOM对象，当return false时，将不隐藏弹窗",
                                "necessary": false
                            },
                            {
                                "name": "args",
                                "type": "array",
                                "desp": "入参",
                                "defaultValue": [],
                                "necessary": false
                            },
                            {
                                "name": "isLargeModal",
                                "type": "boolean",
                                "desp": "是否为大的弹窗",
                                "defaultValue": true,
                                "necessary": false
                            },
                            {
                                "name": "isDialog",
                                "type": "boolean",
                                "desp": "是否为对话框",
                                "defaultValue": true,
                                "necessary": false
                            },
                            {
                                "name": "backdrop",
                                "type": "string",
                                "desp": "遮罩配置",
                                "defaultValue": "static",
                                "details": "遮罩可选项为true|false|\"static\"",
                                "necessary": false
                            },
                            {
                                "name": "height",
                                "type": "string",
                                "desp": "高度",
                                "defaultValue": "80%",
                                "details": "当isLargeModal=true,isDialog=false时，可配置高度",
                                "necessary": false
                            },
                            {
                                "name": "width",
                                "type": "string",
                                "desp": "宽度",
                                "defaultValue": "80%",
                                "details": "当isLargeModal=true,isDialog=false时，可配置宽度",
                                "necessary": false
                            },
                            {
                                "name": "noHeader",
                                "type": "boolean",
                                "desp": "取消顶部标题",
                                "defaultValue": false,
                                "necessary": false
                            },
                            {
                                "name": "noFooter",
                                "type": "boolean",
                                "desp": "取消底部按钮",
                                "defaultValue": false,
                                "necessary": false
                            }
                        ],
                        "necessary": true
                    }
                ],
                "hasReturn": true,
                "returnValue": {
                    "name": "warp",
                    "type": "object",
                    "desp": "包裹成弹窗",
                    "details": "将普通容器包括成弹窗",
                    "children": [
                        {
                            "name": "$modalBody",
                            "type": "object",
                            "desp": "需要被包括的内容的jQuery对象"
                        },
                        {
                            "name": "option",
                            "desp": "详细配置",
                            "type": "object",
                            "details": "详细配置与app.modal入参一致"
                        }
                    ]
                },
                "compatibility": "ie8",
                "depJsArr": "[\"app.getUID\",\"app.reset\",\"app.screen\"]"
            },
            {
                "name": "parseJSObject",
                "desp": "将对象字符串转化成JavaScript对象",
                "params": [
                    {
                        "name": "objectString",
                        "desp": "JavaScript函数字符串",
                        "type": "string",
                        "defaultValue": "'{\"key1\":\"value1\",\"key2\":true,\"key3\":[],\"key4\":{}}'",
                        "necessary": true
                    }
                ],
                "hasReturn": true,
                "appJsCode": app.parseJSObject,
                "returnValue": {
                    "name": "result",
                    "type": "object",
                    "desp": "将JavaScript对象序列化后的结果",
                    "children": [
                        {
                            "name": "key1",
                            "desp": "键名1",
                            "type": "string",
                            "defaultValue": "value1"
                        },
                        {
                            "name": "key2",
                            "desp": "键名2",
                            "type": "boolean",
                            "defaultValue": true
                        },
                        {
                            "name": "key3",
                            "desp": "键名3",
                            "type": "array",
                            "defaultValue": []
                        },
                        {
                            "name": "key4",
                            "desp": "键名4",
                            "type": "object",
                            "defaultValue": {}
                        }
                    ]
                },
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "popover",
                "desp": "气泡",
                "belongTo": "closure",
                "appJsCode": app.popover,
                "params": [
                    {
                        "name": "option",
                        "desp": "配置",
                        "type": "object",
                        "children": [
                            {
                                "name": "$elem",
                                "type": "jQuery",
                                "desp": "气泡的触发元素",
                                "defaultValue": "$el",
                                "details": "表示气泡触发元素的jQuery对象",
                                "necessary": true
                            },
                            {
                                "name": "title",
                                "type": "string",
                                "desp": "标题",
                                "defaultValue": "气泡",
                                "details": "气泡标题，非必填",
                                "necessary": false
                            },
                            {
                                "name": "content",
                                "type": "string",
                                "desp": "气泡内容",
                                "defaultValue": "气泡内容",
                                "details": "可以是html字符串；或函数，返回内容的jQuery对象",
                                "necessary": true
                            },
                            {
                                "name": "hasHeader",
                                "type": "boolean",
                                "desp": "是否显示气泡顶部(标题、按钮)",
                                "defaultValue": "true",
                                "details": "配置是否显示气泡顶部",
                                "necessary": false
                            },
                            {
                                "name": "init",
                                "type": "handler",
                                "desp": "初始化函数",
                                "defaultValue": "function(){}",
                                "details": "打开气泡时，加载内容的方法，其中入参为agrs的参数，第一个参数为 Pop 气泡实例对象，this指向气泡的 jQuery 对象",
                                "necessary": false
                            },
                            {
                                "name": "confirmHandler",
                                "type": "handler",
                                "desp": "关闭确认事件",
                                "defaultValue": "function(){}",
                                "details": "确定按钮点击事件，其中入参为agrs的参数，第一个参数为 Pop 气泡实例对象，this 指向 Pop 气泡实例对象，this.$tip 指向气泡的 jQuery 对象",
                                "necessary": false
                            },
                            {
                                "name": "args",
                                "type": "array",
                                "desp": "入参",
                                "defaultValue": [],
                                "necessary": false
                            },
                            {
                                "name": "on",
                                "type": "object",
                                "desp": "新增按钮配置",
                                "details": "为气泡窗口新增按钮组的按钮，并配置相关参数",
                                "children": [
                                    {
                                        "name": "iconBtn",
                                        "type": "object",
                                        "desp": "按钮配置",
                                        "details": "配置一个新的按钮",
                                        "children": [
                                            {
                                                "name": "btnName",
                                                "type": "string",
                                                "desp": "按钮名称",
                                                "defaultValue": "",
                                                "details": "必需，配置按钮功能的英文名称，填入按钮的功能名，如\"preview\"",
                                                "necessary": true
                                            },
                                            {
                                                "name": "icon",
                                                "type": "string",
                                                "desp": "按钮图标",
                                                "defaultValue": "",
                                                "details": "必需，配置按钮的图标，填入icon的CSS类名，如\"aui-guanbi\"",
                                                "necessary": true
                                            },
                                            {
                                                "name": "title",
                                                "type": "string",
                                                "desp": "按钮描述",
                                                "defaultValue": "",
                                                "details": "必需，配置按钮的描述，如\"关闭\"",
                                                "necessary": true
                                            },
                                            {
                                                "name": "callback",
                                                "type": "handler",
                                                "desp": "按钮事件",
                                                "defaultValue": "function(){}",
                                                "details": "必需，新增按钮事件，其中入参为 e 事件对象和 context Pop气泡实例（上下文），this指向气泡的 DOM 对象",
                                                "necessary": true
                                            }
                                        ]
                                    }
                                ],
                                "necessary": false
                            },
                            {
                                "name": "height",
                                "type": "string",
                                "desp": "高度",
                                "defaultValue": "80%",
                                "details": "可配置气泡高度",
                                "necessary": false
                            },
                            {
                                "name": "width",
                                "type": "string",
                                "desp": "宽度",
                                "defaultValue": "80%",
                                "details": "可配置气泡宽度",
                                "necessary": false
                            },
                            {
                                "name": "placement",
                                "type": "string",
                                "desp": "显示位置",
                                "defaultValue": "right auto",
                                "details": "可配置 (top | bottom | left | right | auto)，如果使用\"auto\"，将会再次调整，比如声明\"right auto\" 弹出框将尽量显示在右边，实在不行才显示在左边 ",
                                "necessary": false
                            },
                            {
                                "name": "focusable",
                                "type": "boolean",
                                "desp": "可否失焦触发气泡消失",
                                "defaultValue": true,
                                "details": "默认可通过失焦触发气泡消失，代码气泡不通过失焦触发气泡消失，需要设置 false",
                                "necessary": false
                            }
                        ],
                        "necessary": true
                    }
                ],
                "hasReturn": false,
                "compatibility": "ie8",
                "depJsArr": "[\"app.getUID\"]"
            },
            {
                "require": true,
                "name": "position",
                "desp": "获取鼠标事件的定位",
                "appJsCode": app.position,
                "params": [
                    {
                        "name": "event",
                        "type": "object",
                        "desp": "事件对象",
                        "details": "事件对象，鼠标监听事件的参数，必需",
                        "necessary": true
                    },
                    {
                        "name": "$container",
                        "type": "jQuery",
                        "desp": "鼠标容器的JQuery对象",
                        "details": "鼠标容器的JQuery对象，必需",
                        "necessary": true
                    },
                    {
                        "name": "$content",
                        "type": "jQuery",
                        "desp": "鼠标点击的直接容器的jQuery对象",
                        "details": "鼠标点击的直接容器的jQuery对象，必需",
                        "necessary": true
                    },
                    {
                        "name": "fixTop",
                        "type": "number",
                        "desp": "向上修正的数值",
                        "details": "数值型，向上修正的数值，缺省值0，非必需",
                        "defaultValue": 0,
                        "necessary": false
                    },
                    {
                        "name": "fixLeft",
                        "type": "number",
                        "desp": "向左修正的数值",
                        "details": "数值型，向左修正的数值，缺省值0，非必需",
                        "defaultValue": 0,
                        "necessary": false
                    }
                ],
                "hasReturn": true,
                "returnValue": {
                    "name": "pointer",
                    "type": "object",
                    "desp": "坐标",
                    "children": [
                        {
                            "name": "top",
                            "type": "number",
                            "desp": "$content相对于$container顶部的位置"
                        },
                        {
                            "name": "left",
                            "type": "number",
                            "desp": "$content相对于$container左侧的位置"
                        }
                    ]
                },
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "reset",
                "desp": "重置表单",
                "details": "将表单内的表单元素的值设置为空或清除选中。弃用接口，不建议使用",
                "hasReturn": false,
                "appJsCode": app.reset,
                "params": [
                    {
                        "name": "$form",
                        "type": "jQuery",
                        "desp": "表单容器的jQuery对象",
                        "details": "必需，表示表单容器的jQuery对象",
                        "necessary": true
                    },
                    {
                        "name": "auiCtx",
                        "type": "object",
                        "desp": "页面上下文",
                        "details": "必需，就填auiCtx这个对象，表示页面的上下文",
                        "necessary": true
                    }
                ],
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "require": true,
                "name": "screen",
                "desp": "视图监听类",
                "belongTo": "class",
                "appJsCode": app.screen,
                "cInterfaces": [
                    {
                        "name": "addResizeHandler",
                        "desp": "添加窗口大小变化监听事件",
                        "hasReturn": false,
                        "params": [
                            {
                                "name": "options",
                                "desp": "选项",
                                "type": "object",
                                "children": [
                                    {
                                        "name": "uid",
                                        "desp": "唯一的id",
                                        "type": "string",
                                        "details": "如果可以isGlobal=true，uid可以通过app.getUID()获取，否则则等于某个页面内的handler.domID，必需",
                                        "necessary": true
                                    },
                                    {
                                        "name": "isGlobal",
                                        "type": "boolean",
                                        "desp": "整个页面框架起作用",
                                        "details": "布尔型，是否是整个页面框架起作用，如果在某个页面起作用的话，则为false，必需",
                                        "necessary": true
                                    },
                                    {
                                        "name": "timeout",
                                        "desp": "延迟",
                                        "type": "number",
                                        "defaultValue": 0,
                                        "details": "数字型，窗口大小改变之后，延迟多少毫秒执行，缺省值0，即一旦窗口大小改变立即执行，非必需",
                                        "necessary": false
                                    },
                                    {
                                        "name": "callback",
                                        "desp": "回调函数",
                                        "type": "handler",
                                        "details": "函数，窗口大小改变后执行，必需",
                                        "necessary": true
                                    }
                                ],
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "triggerResizeHandler",
                        "desp": "模拟触发触发窗口大小变化事件",
                        "hasReturn": false,
                        "params": [
                            {
                                "name": "uid",
                                "desp": "唯一的id",
                                "type": "string",
                                "details": "如果可以isGlobal=true，uid可以通过app.getUID()获取，否则则等于某个页面内的handler.domID，必需",
                                "necessary": true
                            },
                            {
                                "name": "isGlobal",
                                "type": "boolean",
                                "desp": "整个页面框架起作用",
                                "details": "布尔型，是否是整个页面框架起作用，如果在某个页面起作用的话，则为false，必需",
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "removeResizeHandler",
                        "desp": "移除窗口大小变化回调",
                        "hasReturn": false,
                        "params": [
                            {
                                "name": "uid",
                                "desp": "唯一的id",
                                "type": "string",
                                "details": "如果可以isGlobal=true，uid可以通过app.getUID()获取，否则则等于某个页面内的handler.domID，必需",
                                "necessary": true
                            },
                            {
                                "name": "isGlobal",
                                "type": "boolean",
                                "desp": "整个页面框架起作用",
                                "details": "布尔型，是否是整个页面框架起作用，如果在某个页面起作用的话，则为false，必需",
                                "necessary": true
                            }
                        ]
                    }
                ],
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "require": true,
                "name": "scrollTop",
                "desp": "滚动至父容器顶部",
                "hasReturn": false,
                "appJsCode": app.scrollTop,
                "params": [
                    {
                        "name": "$container",
                        "type": "jQuery",
                        "desp": "可滚动的容器jQuery对象",
                        "details": "可滚动的容器jQuery对象，必需",
                        "necessary": true
                    },
                    {
                        "name": "$content",
                        "type": "jQuery",
                        "desp": "需要滚动到顶部的jQuery对象",
                        "details": "需要滚动到顶部的jQuery对象，必需；其中$content必需在$container内",
                        "necessary": true
                    },
                    {
                        "name": "speed",
                        "type": "number",
                        "desp": "滚动速度",
                        "details": "滚动速度，单位毫秒，缺省值200，非必需",
                        "defaultValue": 200,
                        "necessary": false
                    },
                    {
                        "name": "marginTop",
                        "type": "number",
                        "desp": "在滚动上还需要移动的高度",
                        "details": "数值型，必需大于0，在滚动上，还需要移动的高度，缺省值0，非必需",
                        "defaultValue": 0,
                        "necessary": false
                    }
                ],
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "select",
                "desp": "选择",
                "hidden": true,
                "hasReturn": true,
                "appJsCode": app.select,
                "details": "该方法用于表格单选、多选",
                "compatibility": "ie8",
                "belongTo": "function",
                "params": [
                    {
                        "name": "options",
                        "type": "object",
                        "desp": "JavaScript对象数据",
                        "details": "必需",
                        "necessary": true,
                        "children": [
                            {
                                "name": "context",
                                "desp": "容器，是一个jquery对象或者元素选择器",
                                "type": "string",
                                "defaultValue": "$tableWrapper",
                                "necessary": true
                            },
                            {
                                "name": "button",
                                "desp": "全选按纽，是一个jquery对象或者元素选择器",
                                "type": "string",
                                "defaultValue": "#tableSelAllBtn",
                                "necessary": true
                            },
                            {
                                "name": "container",
                                "desp": "按钮容器，是一个jquery对象或者元素选择器",
                                "type": "string",
                                "defaultValue": "$(tbody,$table)",
                                "necessary": true
                            },
                            {
                                "name": "checkbox",
                                "desp": "按钮选择器类型",
                                "type": "string",
                                "defaultValue": "checkbox",
                                "necessary": true
                            },
                            {
                                "name": "isDataTable",
                                "desp": "是否是表格",
                                "type": "boolean",
                                "defaultValue": false,
                                "necessary": true
                            },
                            {
                                "name": "bCheckState",
                                "desp": "按钮状态",
                                "type": "boolean",
                                "necessary": true
                            },
                            {
                                "name": "isSelectChildren",
                                "desp": "是否选择子元素",
                                "type": "boolean",
                                "defaultValue": false,
                                "necessary": true
                            },
                            {
                                "name": "allDataLength",
                                "desp": "数据长度",
                                "type": "integer",
                                "necessary": true
                            },
                            {
                                "name": "allData",
                                "desp": "数据",
                                "type": "array",
                                "necessary": true,
                                "defaultValue": []
                            },
                            {
                                "name": "operationButtons",
                                "desp": "按钮操作情况",
                                "type": "object",
                                "defaultValue": null,
                                "children": [
                                    {
                                        "name": "list",
                                        "desp": "所有按钮选择器列表",
                                        "type": "string",
                                        "defaultValue": "#radioBtn,#checkboxBtn"
                                    },
                                    {
                                        "name": "status",
                                        "desp": "各种状态",
                                        "type": "object",
                                        "children": [
                                            {
                                                "name": "Running",
                                                "desp": "激活状态",
                                                "type": "array",
                                                "defaultValue": "[#radioBtn,#checkboxBtn]"
                                            },
                                            {
                                                "name": "Stopped",
                                                "desp": "停止状态",
                                                "type": "array",
                                                "defaultValue": "[#radioBtn,#checkboxBtn]"
                                            },
                                            {
                                                "name": "_default",
                                                "desp": "默认状态",
                                                "type": "array",
                                                "defaultValue": "[#radioBtn,#checkboxBtn]"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "setNodeMethod",
                                "desp": "设置节点方法",
                                "type": "handler",
                                "defaultValue": "function(){}",
                                "details": "设置节点方法，其中参数有list,elem。list为列表数据，elem为选择的数据对象"
                            },
                            {
                                "name": "getIdMethod",
                                "desp": "获取节点Id的方法",
                                "type": "handler",
                                "defaultValue": "function(){}",
                                "details": "获取节点Id的方法,参数elem为选择的数据对象"
                            },
                            {
                                "name": "getStatusMethod",
                                "desp": "获取各种选择情况下的状态",
                                "type": "handler",
                                "defaultValue": null
                            }
                        ]
                    }
                ],
                "returnValue": {
                    "name": "result",
                    "type": "object",
                    "desp": "包含组件方法的对象",
                    "children": [
                        {
                            "name": "nodes",
                            "type": "handler",
                            "desp": "返回节点列表的副本，返回值是一个对象",
                            "defaultValue": "function(){}"
                        },
                        {
                            "name": "list",
                            "type": "handler",
                            "desp": "返回节点ID副本，返回值是一个数组",
                            "defaultValue": "function(){}"
                        },
                        {
                            "name": "clear",
                            "type": "handler",
                            "desp": "清除选中状态",
                            "defaultValue": "function(){}"
                        },
                        {
                            "name": "size",
                            "type": "handler",
                            "desp": "获取选中项总数量，返回数据长度",
                            "defaultValue": "function(){}"
                        },
                        {
                            "name": "dispose",
                            "type": "handler",
                            "desp": "销毁app.select接口",
                            "defaultValue": "function(){}"
                        },
                        {
                            "name": "check",
                            "type": "handler",
                            "desp": "设置选中行，参数为行id组成的数组，如['a','b']",
                            "defaultValue": "function(){}"
                        }
                    ]
                },
                "depJsArr": "[]"
            },
            {
                "name": "stringify",
                "desp": "将JavaScript对象转化成字符串，并将函数、对象序列化",
                "params": [
                    {
                        "name": "object",
                        "desp": "必需，JavaScript对象",
                        "type": "object",
                        "children": [
                            {
                                "name": "key1",
                                "desp": "键名1",
                                "type": "string",
                                "defaultValue": "value1",
                                "necessary": true
                            },
                            {
                                "name": "key2",
                                "desp": "键名2",
                                "type": "boolean",
                                "defaultValue": true,
                                "necessary": true
                            },
                            {
                                "name": "key3",
                                "desp": "键名3",
                                "type": "array",
                                "defaultValue": [],
                                "necessary": true
                            },
                            {
                                "name": "key4",
                                "desp": "键名4",
                                "type": "object",
                                "defaultValue": {},
                                "necessary": true
                            }
                        ],
                        "necessary": true
                    }
                ],
                "hasReturn": true,
                "appJsCode": app.stringify,
                "returnValue": {
                    "name": "result",
                    "type": "string",
                    "desp": "将JavaScript对象序列化后的结果",
                    "defaultValue": "'{\"key1\":\"value1\",\"key2\":true,\"key3\":[],\"key4\":{}}'"
                },
                "compatibility": "ie8",
                "depJsArr": "[]"
            }
        ]
    },
    {
        "desp": "数据操作",
        "children": [
            {
                "name": "domain",
                "desp": "公共数据缓存池",
                "belongTo": "class",
                "appJsCode": app.domain,
                "cInterfaces": [
                    {
                        "name": "exports",
                        "desp": "将数据写入公共数据缓存池",
                        "params": [
                            {
                                "name": "namespace",
                                "type": "string",
                                "desp": "命名空间",
                                "defaultValue": "page",
                                "details": "必需，字符串类型，储存数据的命名空间；",
                                "necessary": true
                            },
                            {
                                "name": "data",
                                "type": "object",
                                "desp": "JavaScript对象数据",
                                "details": "必需，json数据，需要跨页储存的数据；",
                                "necessary": true,
                                "children": [
                                    {
                                        "name": "key1",
                                        "desp": "键名1",
                                        "type": "string",
                                        "defaultValue": "value1",
                                        "necessary": true
                                    },
                                    {
                                        "name": "key2",
                                        "desp": "键名2",
                                        "type": "boolean",
                                        "defaultValue": true,
                                        "necessary": false
                                    },
                                    {
                                        "name": "key3",
                                        "desp": "键名3",
                                        "type": "array",
                                        "defaultValue": [],
                                        "necessary": false
                                    },
                                    {
                                        "name": "key4",
                                        "desp": "键名4",
                                        "type": "object",
                                        "defaultValue": {},
                                        "necessary": false
                                    }
                                ]
                            }
                        ],
                        "hasReturn": false
                    },
                    {
                        "name": "get",
                        "desp": "获取公共数据缓存池的数据",
                        "params": [
                            {
                                "name": "namespace",
                                "type": "string",
                                "desp": "命名空间",
                                "defaultValue": "page",
                                "details": "必需，字符串类型，储存数据的命名空间；",
                                "necessary": true
                            },
                            {
                                "name": "key",
                                "type": "string",
                                "desp": "存取数据的键",
                                "defaultValue": "key4",
                                "details": "非必需，字符串类型，储存数据的键",
                                "necessary": false
                            }
                        ],
                        "hasReturn": true,
                        "returnValue": {
                            "name": "data",
                            "type": "object",
                            "defaultValue": {},
                            "desp": "当键（key）没有声明的情况下，将返回命名空间下所有的数据副本 ；否则将返回该命名空间下该键中的数据副本"
                        }
                    },
                    {
                        "name": "clearScope",
                        "desp": "清除公共数据缓存池某个命名空间下的数据",
                        "params": [
                            {
                                "name": "namespace",
                                "type": "string",
                                "desp": "命名空间",
                                "details": "必需，字符串类型，储存数据的命名空间",
                                "necessary": true
                            }
                        ],
                        "hasReturn": false
                    }
                ],
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "getData",
                "desp": "从浏览器缓存中获取数据",
                "params": [
                    {
                        "name": "name",
                        "type": "string",
                        "desp": "存储的数据名称",
                        "details": "字符串，存储的数据名称，必需",
                        "necessary": true
                    },
                    {
                        "name": "fromCookie",
                        "type": "boolean",
                        "desp": "是否从cookie中获取数据",
                        "defaultValue": false,
                        "details": "布尔型，是否从cookie中获取数据，缺省值false，即默认从localStorage获取，若失败则从cookie获取，非必需",
                        "necessary": false
                    }
                ],
                "appJsCode": app.getData,
                "hasReturn": true,
                "returnValue": {
                    "name": "data",
                    "type": "string",
                    "details": "字符串，获取成功，返回JSON格式的字符串，获取失败则返回空字符串。可以使用app.parseJSObject转化为javaScript对象",
                    "desp": "JSON格式字符串"
                },
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "getFormatData",
                "desp": "数字格式转换",
                "belongTo": "closure",
                "params": [
                    {
                        "name": "num",
                        "desp": "需要处理的数字",
                        "type": "number",
                        "necessary": true
                    }
                ],
                "hasReturn": true,
                "appJsCode": app.getFormatData,
                "returnValue": {
                    "name": "translatedNum",
                    "type": "number",
                    "desp": "处理完的数字"
                },
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "getNewQueryStringURL",
                "desp": "获取更新后的页面内查询字符串",
                "hasReturn": true,
                "appJsCode": app.getNewQueryStringURL,
                "params": [
                    {
                        "name": "newParams",
                        "type": "object",
                        "desp": "新加入的参数",
                        "details": "fullscreen=true为例",
                        "necessary": true,
                        "children": [
                            {
                                "name": "fullscreen",
                                "type": "string",
                                "desp": "键值对",
                                "defaultValue": "true",
                                "necessary": true
                            }
                        ]
                    }
                ],
                "returnValue": {
                    "name": "newQueryString",
                    "type": "string",
                    "desp": "页面内查询字符串列表",
                    "details": "以http://localhost:8080/index.html?timeStamp=12465为例",
                    "defaultValue": "timeStamp=12346&fullscreen=true"
                },
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "getQueryStringMap",
                "desp": "获取页面内查询字符串映射表",
                "hasReturn": true,
                "appJsCode": app.getQueryStringMap,
                "returnValue": {
                    "name": "queryStringMap",
                    "type": "object",
                    "desp": "页面内查询字符串列表",
                    "details": "以http://localhost:8080/index.html?timeStamp=12465为例",
                    "children": [
                        {
                            "name": "timeStamp",
                            "type": "string",
                            "desp": "键值对",
                            "defaultValue": "12465"
                        }
                    ]
                },
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "getServerUrl",
                "desp": "获取服务器域名",
                "details": "获取服务器域名，如https:awebide.com:8443/kk",
                "hasReturn": true,
                "returnValue": {
                    "name": "serverUrl",
                    "desp": "服务器域名",
                    "type": "string"
                },
                "edition": {
                    "mobile": app.getServerUrl
                },
                "depJsArr": []
            },
            {
                "name": "queryString",
                "desp": "获取页面内查询字符串",
                "params": [
                    {
                        "name": "key",
                        "type": "string",
                        "desp": "queryString的键名",
                        "details": "以http://localhost:8080/index.html?timeStamp=12465为例",
                        "defaultValue": "timeStamp",
                        "necessary": true
                    }
                ],
                "hasReturn": true,
                "appJsCode": app.queryString,
                "returnValue": {
                    "name": "value",
                    "type": "string",
                    "desp": "queryString对应键名的值",
                    "details": "字符串，返回queryString对应键名的值，若queryString不存在该键名的值，则返回空字符串",
                    "defaultValue": "12465"
                },
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "removeData",
                "desp": "删除浏览器数据",
                "params": [
                    {
                        "name": "name",
                        "type": "string",
                        "desp": "存储的数据名称",
                        "details": "字符串，删除数据的名称，必需",
                        "necessary": true
                    },
                    {
                        "name": "fromCookie",
                        "type": "boolean",
                        "desp": "是否从cookie中获取数据",
                        "defaultValue": false,
                        "details": "布尔型，是否从cookie中删除数据，默认情况先尝试从localStorage中删除，如果失败，则尝试从cookie删除，非必需",
                        "necessary": false
                    }
                ],
                "appJsCode": app.removeData,
                "hasReturn": true,
                "returnValue": {
                    "name": "result",
                    "type": "boolean",
                    "desp": "删除结果",
                    "details": "布尔型，是否删除数据成功"
                },
                "compatibility": "ie8",
                "depJsArr": "[\"app.setData\"]"
            },
            {
                "name": "setData",
                "desp": "将数据缓存到浏览器",
                "params": [
                    {
                        "name": "name",
                        "type": "string",
                        "desp": "存储的数据名称",
                        "details": "字符串，存储的数据名称，必需",
                        "necessary": true
                    },
                    {
                        "name": "data",
                        "type": "object",
                        "details": "任意类型，存储的数据，必需。非字符串类型，会通过app.stringify将其转化为字符串再存储",
                        "desp": "存储的数据",
                        "necessary": true
                    },
                    {
                        "name": "toCookie",
                        "type": "boolean",
                        "details": "布尔型，是否存储到cookie中，默认情况先尝试存储到localStorage，如果失败，则尝试储存到cookie中，非必需",
                        "desp": "是否存储到cookie中",
                        "defaultValue": false,
                        "necessary": false
                    },
                    {
                        "name": "expireDays",
                        "type": "number",
                        "details": "正整数，如果存储到cookie，过期天数，默认值为100天，非必需",
                        "desp": "过期天数",
                        "defaultValue": 100,
                        "necessary": false
                    }
                ],
                "hasReturn": true,
                "appJsCode": app.setData,
                "returnValue": {
                    "name": "result",
                    "type": "boolean",
                    "desp": "保存结果",
                    "details": "布尔型，是否存储数据成功"
                },
                "compatibility": "ie8",
                "depJsArr": "[\"app.stringify\"]"
            },
            {
                "name": "title",
                "desp": "获取或设置网页标题",
                "params": [
                    {
                        "name": "title",
                        "type": "string",
                        "desp": "标题",
                        "details": "设置网页需要显示的标题",
                        "defaultValue": "AWEB 5.0",
                        "necessary": true
                    }
                ],
                "hasReturn": true,
                "appJsCode": app.title,
                "returnValue": {
                    "name": "title",
                    "type": "string",
                    "desp": "标题",
                    "details": "返回当前网页显示的标题",
                    "defaultValue": "AWEB 5.0"
                },
                "compatibility": "ie8",
                "depJsArr": "[]"
            },
            {
                "name": "validate",
                "desp": "表单校验",
                "belongTo": "closure",
                "params": [
                    {
                        "name": "data",
                        "desp": "校验的元素",
                        "type": "array",
                        "children": [
                            {
                                "name": "name",
                                "type": "string",
                                "details": "必需，表示需要传输到后台的名称，在AWEB中，name由别名和名称组成（alias+name）",
                                "desp": "字段名称",
                                "necessary": true
                            },
                            {
                                "name": "value",
                                "type": "string",
                                "desp": "值",
                                "details": "非必需，表示需要传输到后台的值",
                                "necessary": true
                            },
                            {
                                "name": "validate",
                                "type": "object",
                                "desp": "校验的信息",
                                "details": "必需，表示需要校验的信息",
                                "children": [
                                    {
                                        "name": " context",
                                        "desp": "jQuery对象或者选择器",
                                        "type": "jQuery",
                                        "details": "表示输入元素DOM对象的上下文"
                                    },
                                    {
                                        "name": "id",
                                        "desp": "输入元素的jQuery选择器",
                                        "type": "string",
                                        "details": "如果data[i].value为空，则从此处获取元素的值"
                                    },
                                    {
                                        "name": "regex",
                                        "desp": "校验类型或正则表达式",
                                        "type": "string",
                                        "details": "如果为false、undefined、null，则表示无需校验。校验类型，可以通过app.validate.TYPE获取"
                                    },
                                    {
                                        "name": "errorMsg",
                                        "details": "需要校验时必需，校验错误是记录或显示的提示语句",
                                        "type": "string",
                                        "desp": "校验类型或者正则"
                                    }
                                ],
                                "necessary": true
                            }
                        ],
                        "necessary": true
                    },
                    {
                        "name": "successCallback",
                        "type": "handler",
                        "desp": "校验正确后执行的函数",
                        "details": "函数，非必需，表示校验正确后执行的函数。$elem，jQuery对象，表示被校验的元素，由$(data.id,data.context)获取",
                        "necessary": false
                    },
                    {
                        "name": "errorCallback",
                        "type": "handler",
                        "desp": "校验失败后执行的函数",
                        "details": "数，非必需，表示校验错误后执行的函数。$elem，jQuery对象，表示被校验的元素，由$(data.id,data.context)获取，errorMsg，字符串，表示错误校验失败的提示语句",
                        "necessary": false
                    },
                    {
                        "name": "cleanCallback",
                        "type": "handler",
                        "desp": "清理错误提示回调函数",
                        "details": "函数，非必需，表示清理错误提示回调函数。其中函数中的this指向被校验的DOM元素",
                        "necessary": false
                    },
                    {
                        "name": "isContinue",
                        "type": "boolean",
                        "desp": "校验错误后是否继续校验data余下部分",
                        "details": "布尔值，非必需，表示校验错误后是否继续校验data余下部分",
                        "necessary": false
                    },
                    {
                        "name": "isValidate",
                        "type": "boolean",
                        "desp": "是否进行校验",
                        "details": "布尔值，非必需，如果等于false，则直接返回data部分的实际数据",
                        "defaultValue": true,
                        "necessary": false
                    }
                ],
                "hasReturn": true,
                "appJsCode": app.validate,
                "returnValue": {
                    "name": "validateResult",
                    "type": "object",
                    "desp": "校验结果对象",
                    "children": [
                        {
                            "name": "result",
                            "type": "boolean",
                            "desp": "是否校验正确",
                            "details": "布尔值，表示是否校验正确，当data中的所有元素都校验成功时，就返回true，否则返回false"
                        },
                        {
                            "name": "data",
                            "type": "array",
                            "desp": "校验元素的信息",
                            "details": "数组对象，记录校验元素的信息",
                            "children": [
                                {
                                    "name": "name",
                                    "desp": "校验字段的名称",
                                    "type": "string",
                                    "details": "字符串，校验字段的名称，与data[i].name相同"
                                },
                                {
                                    "name": "value",
                                    "details": "字符串，校验字段的值，与data[i].value||$(data.id,data.context).val()相同",
                                    "type": "string",
                                    "desp": "校验字段的值"
                                },
                                {
                                    "name": "errorMsg",
                                    "details": "字符串，校验失败时，出现的错误提示",
                                    "type": "string",
                                    "desp": "错误提示"
                                }
                            ]
                        }
                    ]
                },
                "compatibility": "ie8",
                "depJsArr": "[]"
            }
        ]
    },
    {
        "desp": "移动端",
        "children": [
            {
                "name": "mobileCamera",
                "desp": "相机",
                "details": "拍摄照片或使用图像库中的照片",
                "belongTo": "class",
                "cInterfaces": [
                    {
                        "name": "getCameraPicture",
                        "desp": "拍摄照片",
                        "details": "拍摄照片",
                        "params": [
                            {
                                "name": "callback",
                                "desp": "回调函数",
                                "details": "底层返回一个imageInfo的对象作为入参",
                                "type": "function",
                                "children": [
                                    {
                                        "name": "imageInfo",
                                        "desp": "拍摄的图片信息",
                                        "details": "当用户调用相机后，返回的图片获取状态和图片内容",
                                        "type": "object",
                                        "children": [
                                            {
                                                "name": "status",
                                                "type": "boolean",
                                                "desp": "获取照片状态",
                                                "details": "为true时，获取成功；为false时，获取失败"
                                            },
                                            {
                                                "name": "content",
                                                "type": "string",
                                                "desp": "获取的图片内容"
                                            }
                                        ]
                                    }
                                ],
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "getPhotolibraryPicture",
                        "desp": "从手机图库选择照片",
                        "params": [
                            {
                                "name": "callback",
                                "desp": "回调函数",
                                "details": "底层返回一个imageInfo的对象作为入参",
                                "type": "function",
                                "children": [
                                    {
                                        "name": "imageInfo",
                                        "desp": "拍摄的图片信息",
                                        "details": "当用户调用相机后，返回的图片获取状态和图片内容",
                                        "type": "object",
                                        "children": [
                                            {
                                                "name": "status",
                                                "type": "boolean",
                                                "desp": "获取照片状态",
                                                "details": "为true时，获取成功；为false时，获取失败"
                                            },
                                            {
                                                "name": "content",
                                                "type": "string",
                                                "desp": "获取的图片内容",
                                                "details": "获取的图片内容"
                                            }
                                        ]
                                    }
                                ],
                                "necessary": true
                            }
                        ]
                    }
                ],
                "edition": {
                    "mobile": app.mobileCamera
                },
                "compatibility": "modernBrowser",
                "depJsArr": "[]"
            },
            {
                "name": "enableSSLPinning",
                "desp": "使用SSL Pinning协议",
                "details": "SSL证书绑定",
                "compatibility": "modernBrowser",
                "params": [
                    {
                        "name": "isEnable",
                        "desp": "是否绑定SSL证书",
                        "type": "boolean",
                        "necessary": true
                    }
                ],
                "edition": {
                    "mobile": app.enableSSLPinning
                },
                "depJsArr": "[]"
            },
            {
                "name": "geolocation",
                "desp": "地理定位",
                "details": "可获取当前设备地理位置信息",
                "belongTo": "class",
                "compatibility": "modernBrowser",
                "cInterfaces": [
                    {
                        "name": "getCurrentPosition",
                        "desp": "获取当前位置",
                        "details": "",
                        "params": [
                            {
                                "name": "successCallback",
                                "desp": "成功回调",
                                "type": "handler",
                                "details": "必需，获得位置成功时的回调，底层返回一个position的对象作为入参",
                                "children": [
                                    {
                                        "name": "position",
                                        "desp": "设备当前位置信息",
                                        "type": "object",
                                        "children": [
                                            {
                                                "name": "latitude",
                                                "desp": "纬度",
                                                "type": "number",
                                                "details": "纬度"
                                            },
                                            {
                                                "name": "longitude",
                                                "desp": "经度",
                                                "type": "number",
                                                "details": "经度"
                                            },
                                            {
                                                "name": "altitude",
                                                "desp": "海拔",
                                                "type": "number",
                                                "details": "海拔"
                                            },
                                            {
                                                "name": "accuracy",
                                                "desp": "水平精度",
                                                "type": "number",
                                                "details": "在水平面内的误差，单位为米"
                                            },
                                            {
                                                "name": "altitudeAccuracy",
                                                "desp": "垂直精度",
                                                "type": "number",
                                                "details": "在垂直面内的误差，单位为米,安卓此属性为null"
                                            },
                                            {
                                                "name": "heading",
                                                "desp": "方向",
                                                "type": "number",
                                                "details": "顺时针方向相对于正北方向的计数方向"
                                            },
                                            {
                                                "name": "speed",
                                                "desp": "速度",
                                                "type": "number",
                                                "details": "相对于地面速度，单位为秒"
                                            }
                                        ]
                                    }
                                ],
                                "necessary": true
                            },
                            {
                                "name": "errorCallback",
                                "desp": "失败回调",
                                "type": "handler",
                                "details": "可选，获取位置失败时的回调，底层返回一个errMsg的对象作为入参",
                                "children": [
                                    {
                                        "name": "errMsg",
                                        "desp": "错误信息",
                                        "type": "object",
                                        "children": [
                                            {
                                                "name": "code",
                                                "desp": "错误信息代码",
                                                "type": "number",
                                                "details": "code有三种预设的情况，分别为\"error.PERMISSION_DENIED(没有权限,值为1）\"、\"error.POSITION_UNAVAILABLE(无法获取定位，值为2)\"以及\"error.TIMEOUT(超时，值为3）\""
                                            },
                                            {
                                                "name": "message",
                                                "desp": "错误描述信息",
                                                "type": "string",
                                                "details": "对出错信息进行具体描述"
                                            }
                                        ]
                                    }
                                ],
                                "necessary": false
                            },
                            {
                                "name": "options",
                                "desp": "其他选项",
                                "type": "object",
                                "details": "可选，其他选项，可设置如下属性，以key-value的键值对表示",
                                "children": [
                                    {
                                        "name": "maximumAge",
                                        "desp": "最大缓存时间",
                                        "type": "number",
                                        "details": "position对象缓存的最大时间长度"
                                    },
                                    {
                                        "name": "timeout",
                                        "desp": "成功回调函数执行的最长时间间隔",
                                        "type": "number",
                                        "details": "允许getCurrentPosition或watchPosition函数执行相应的successCallback的最长时间,超时将执行errorCallback。"
                                    },
                                    {
                                        "name": "enableHighAccuracy",
                                        "desp": "是否获取精确定位",
                                        "type": "boolean",
                                        "details": "是否获取精确定位"
                                    }
                                ],
                                "necessary": false
                            }
                        ]
                    },
                    {
                        "name": "watchPosition",
                        "desp": "实时监测位置变化",
                        "details": "当检测到位置变化时返回设备当前位置。",
                        "params": [
                            {
                                "name": "successCallback",
                                "desp": "成功回调",
                                "type": "handler",
                                "details": "必需，获得位置成功时的回调，底层返回一个position的对象作为入参",
                                "children": [
                                    {
                                        "name": "position",
                                        "desp": "设备当前位置信息",
                                        "type": "object",
                                        "children": [
                                            {
                                                "name": "latitude",
                                                "desp": "纬度",
                                                "type": "number",
                                                "details": "纬度"
                                            },
                                            {
                                                "name": "longitude",
                                                "desp": "经度",
                                                "type": "number",
                                                "details": "经度"
                                            },
                                            {
                                                "name": "altitude",
                                                "desp": "海拔",
                                                "type": "number",
                                                "details": "海拔"
                                            },
                                            {
                                                "name": "accuracy",
                                                "desp": "水平精度",
                                                "type": "number",
                                                "details": "在水平面内的误差，单位为米"
                                            },
                                            {
                                                "name": "altitudeAccuracy",
                                                "desp": "垂直精度",
                                                "type": "number",
                                                "details": "在垂直面内的误差，单位为米,安卓此属性为null"
                                            },
                                            {
                                                "name": "heading",
                                                "desp": "方向",
                                                "type": "number",
                                                "details": "顺时针方向相对于正北方向的计数方向"
                                            },
                                            {
                                                "name": "speed",
                                                "desp": "速度",
                                                "type": "number",
                                                "details": "相对于地面速度，单位为秒"
                                            }
                                        ]
                                    }
                                ],
                                "necessary": true
                            },
                            {
                                "name": "errorCallback",
                                "desp": "失败回调",
                                "type": "handler",
                                "details": "可选，获取位置失败时的回调，底层返回一个error的信息对象",
                                "children": [
                                    {
                                        "name": "error",
                                        "desp": "错误信息",
                                        "type": "object",
                                        "children": [
                                            {
                                                "name": "code",
                                                "desp": "错误信息代码",
                                                "type": "number",
                                                "details": "code有三种预设的情况，分别为\"error.PERMISSION_DENIED(没有权限,值为1）\"、\"error.POSITION_UNAVAILABLE(无法获取定位，值为2)\"以及\"error.TIMEOUT(超时，值为3）\""
                                            },
                                            {
                                                "name": "message",
                                                "desp": "错误描述信息",
                                                "type": "string",
                                                "details": "对出错信息进行具体描述"
                                            }
                                        ]
                                    }
                                ],
                                "necessary": false
                            },
                            {
                                "name": "options",
                                "desp": "其他选项",
                                "type": "object",
                                "details": "可选，其他选项，可设置如下属性，以key-value的键值对表示",
                                "children": [
                                    {
                                        "name": "maximumAge",
                                        "desp": "最大缓存时间",
                                        "type": "number",
                                        "details": "position对象缓存的最大时间长度"
                                    },
                                    {
                                        "name": "timeout",
                                        "desp": "成功回调函数执行的最长时间间隔",
                                        "type": "number",
                                        "details": "允许getCurrentPosition或watchPosition函数执行相应的successCallback的最长时间,超时将执行errorCallback。"
                                    },
                                    {
                                        "name": "enableHighAccuracy",
                                        "desp": "是否获取精确定位",
                                        "type": "boolean",
                                        "details": "是否获取精确定位"
                                    }
                                ],
                                "necessary": false
                            }
                        ],
                        "hasReturn": true,
                        "returnValue": {
                            "name": "watchID",
                            "type": "string",
                            "desp": "id",
                            "details": "字符串，调用该函数时生成的唯一标识"
                        }
                    },
                    {
                        "name": "clearWatch",
                        "desp": "停止对设备的位置的变化的监测",
                        "details": "停止对设备的位置的变化的监测",
                        "params": [
                            {
                                "name": "watchID",
                                "desp": "调用watchPosition函数时返回的ID",
                                "type": "string",
                                "necessary": true
                            }
                        ]
                    }
                ],
                "edition": {
                    "mobile": app.geolocation
                },
                "depJsArr": "[]"
            },
            {
                "name": "getUniqueDeviceId",
                "desp": "获取设备唯一标识",
                "details": "获取当前设备唯一标识",
                "compatibility": "modernBrowser",
                "params": [
                    {
                        "name": "successCallback",
                        "desp": "成功回调，底层返回一个uuid的字符串作为入参",
                        "type": "handler",
                        "children": [
                            {
                                "name": "uuid",
                                "desp": "设备唯一标识",
                                "type": "string"
                            }
                        ],
                        "necessary": true
                    },
                    {
                        "name": "errorCallback",
                        "desp": "错误回调，底层返回一个errMsg的字符串作为入参",
                        "type": "handler",
                        "children": [
                            {
                                "name": "message",
                                "desp": "出错信息",
                                "type": "string"
                            }
                        ],
                        "necessary": false
                    }
                ],
                "edition": {
                    "mobile": app.getUniqueDeviceId
                },
                "depJsArr": "[]"
            },
            {
                "name": "MD5Verify",
                "desp": "MD5应用校验",
                "compatibility": "modernBrowser",
                "params": [
                    {
                        "name": "url",
                        "desp": "MD5校验路径",
                        "type": "string",
                        "necessary": true
                    }
                ],
                "details": "用于初次安装应用时的MD5校验，如果成功，应用正常启动,失败则退出应用",
                "edition": {
                    "mobile": app.MD5Verify
                },
                "depJsArr": "[]"
            },
            {
                "name": "singleGesture",
                "desp": "手势接口",
                "details": "移动手势事件",
                "belongTo": "class",
                "compatibility": "modernBrowser",
                "cInterfaces": [
                    {
                        "name": "on",
                        "desp": "监听手势事件",
                        "details": "监听手势事件",
                        "params": [
                            {
                                "name": "direction",
                                "desp": "需要监听的手势方向",
                                "details": "需要监听的手势方向",
                                "type": "string",
                                "necessary": true
                            },
                            {
                                "name": "$selector",
                                "desp": "元素选择器",
                                "details": "元素选择器",
                                "type": "object",
                                "necessary": true
                            },
                            {
                                "name": "callback",
                                "desp": "回调函数",
                                "details": "回调函数",
                                "type": "handler",
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "off",
                        "desp": "需要解绑的手势事件",
                        "details": "需要解绑的手势事件",
                        "params": [
                            {
                                "name": "id",
                                "desp": "回调函数",
                                "details": "回调函数",
                                "type": "string",
                                "necessary": false
                            }
                        ]
                    },
                    {
                        "name": "trigger",
                        "desp": "触发手势事件",
                        "details": "触发手势事件",
                        "params": [
                            {
                                "name": "direction",
                                "desp": "手势方向",
                                "details": "手势方向",
                                "type": "string",
                                "necessary": true
                            }
                        ]
                    }
                ],
                "edition": {
                    "mobile": app.singleGesture
                },
                "depJsArr": "[\"app.getUID\"]"
            },
            {
                "name": "touchEffect",
                "desp": "点击效果",
                "details": "",
                "belongTo": "class",
                "compatibility": "modernBrowser",
                "cInterfaces": [
                    {
                        "name": "addTouchEffect",
                        "desp": "添加点击效果",
                        "details": "添加点击效果",
                        "params": [
                            {
                                "name": "$selector",
                                "desp": "选择器",
                                "details": "选择器",
                                "type": "jQuery",
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "cancelTouchEffect",
                        "desp": "取消点击效果",
                        "details": "取消点击效果",
                        "params": [
                            {
                                "name": "$selector",
                                "desp": "选择器",
                                "details": "选择器",
                                "type": "jQuery",
                                "necessary": true
                            }
                        ]
                    }
                ],
                "edition": {
                    "mobile": app.touchEffect
                },
                "depJsArr": "[]"
            },
            {
                "name": "touchID",
                "desp": "生物识别",
                "details": "指纹/人脸识别",
                "belongTo": "class",
                "cInterfaces": [
                    {
                        "name": "isAvailable",
                        "desp": "检测生物识别功能是否存在",
                        "details": "检测生物识别功能是否存在",
                        "params": [
                            {
                                "name": "successCallback",
                                "desp": "成功回调",
                                "details": "必需，生物识别功能存在时的回调,入参为底层返回的result，如果支持人脸识别，result为\"face\"；如果支持指纹识别，result为\"finger\"",
                                "type": "handler",
                                "necessary": true
                            },
                            {
                                "name": "errorCallback",
                                "desp": "失败回调",
                                "details": "必需，生物识别功能不存在时的回调，底层返回一个errMsg的字符串作为入参",
                                "type": "handler"
                            }
                        ]
                    },
                    {
                        "name": "showAuth",
                        "desp": "验证生物识别",
                        "details": "验证生物识别",
                        "params": [
                            {
                                "name": "clientInfo",
                                "type": "object",
                                "desp": "验证框信息",
                                "children": [
                                    {
                                        "name": "clientId",
                                        "type": "string",
                                        "desp": "验证框提示信息",
                                        "details": "必需",
                                        "necessary": true
                                    },
                                    {
                                        "name": "clientSecret",
                                        "type": "string",
                                        "desp": "客户端密钥信息",
                                        "details": "安卓系统必需",
                                        "necessary": true
                                    }
                                ],
                                "necessary": true
                            },
                            {
                                "name": "successCallback",
                                "type": "handler",
                                "desp": "成功回调",
                                "detail": "必需，验证成功回调函数",
                                "necessary": true
                            },
                            {
                                "name": "errorCallback",
                                "type": "handler",
                                "desp": "失败回调",
                                "detail": "必需，验证失败回调函数",
                                "necessary": true
                            }
                        ]
                    }
                ],
                "compatibility": "modernBrowser",
                "edition": {
                    "mobile": app.touchID
                },
                "depJsArr": "[\"app.modal\"]"
            }
        ]
    },
    {
        "desp": "标签页",
        "children": [
            {
                "name": "page",
                "desp": "标签页操作",
                "belongTo": "class",
                "appJsCode": app.page,
                "cInterfaces": [
                    {
                        "name": "refresh",
                        "desp": "刷新当前标签页",
                        "hasReturn": false
                    },
                    {
                        "name": "close",
                        "desp": "关闭当前标签页",
                        "hasReturn": false
                    },
                    {
                        "name": "closeAll",
                        "desp": "关闭所有页面",
                        "hasReturn": false,
                        "params": [
                            {
                                "name": "tips",
                                "type": "string",
                                "details": "关闭窗口时的提示，如果为空，则不显示遮罩",
                                "desp": "关闭窗口遮罩提示",
                                "necessary": false
                            }
                        ]
                    },
                    {
                        "name": "updateCurrentInterval",
                        "desp": "更新当前页面轮询配置",
                        "params": [
                            {
                                "type": "string",
                                "desp": "轮询操作唯一标识",
                                "name": "uniqueId",
                                "defaultValue": "auiCtx.intervals.轮询ID",
                                "necessary": true
                            },
                            {
                                "type": "object",
                                "desp": "轮询参数",
                                "name": "option",
                                "children": [
                                    {
                                        "type": "number",
                                        "desp": "时钟（ms）",
                                        "details": "超时时间或轮询时间",
                                        "name": "clock",
                                        "defaultValue": "1000"
                                    },
                                    {
                                        "type": "boolean",
                                        "desp": "立即执行",
                                        "details": "页面初始化时是否直接执行代码不用等待时钟超时",
                                        "name": "immediate",
                                        "defaultValue": "false"
                                    },
                                    {
                                        "type": "boolean",
                                        "desp": "切出暂停",
                                        "details": "切出页面时暂停轮询",
                                        "name": "isPause",
                                        "defaultValue": "true"
                                    },
                                    {
                                        "type": "number",
                                        "desp": "执行次数",
                                        "details": "轮询执行次数，当为0时表示页面生命周期内不断执行",
                                        "placeholder": "当为0时表示页面生命周期内不断执行",
                                        "name": "times",
                                        "defaultValue": "0"
                                    }
                                ],
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "fullscreen",
                        "desp": "全屏",
                        "params": [
                            {
                                "type": "boolean",
                                "desp": "是否全屏",
                                "name": "fullscreen",
                                "defaultValue": "true",
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "isFullScreen",
                        "desp": "是否全屏中",
                        "hasReturn": true,
                        "returnValue": {
                            "name": "screenIsFull",
                            "type": "boolean",
                            "desp": "是否全屏中",
                            "defaultValue": "true"
                        }
                    },
                    {
                        "name": "displayNav",
                        "desp": "显示或隐藏导航",
                        "params": [
                            {
                                "type": "boolean",
                                "desp": "是否显示导航",
                                "name": "show",
                                "defaultValue": "true",
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "isDisplayNav",
                        "desp": "是否显示导航栏中",
                        "hasReturn": true,
                        "returnValue": {
                            "name": "NavIsDisplay",
                            "type": "boolean",
                            "desp": "是否显示导航栏中",
                            "defaultValue": "true"
                        }
                    }
                ],
                "compatibility": "ie8",
                "depJsArr": "[]"
            }
        ]
    },
    {
        "desp": "伪异步、多线程操作",
        "children": [
            {
                "name": "performance",
                "desp": "伪异步、多线程操作",
                "belongTo": "class",
                "appJsCode": app.performance,
                "cInterfaces": [
                    {
                        "name": "longDelay",
                        "desp": "长延时操作",
                        "details": "用于长延时操作，用于数据处理量大或即时渲染要求低的处理的延时调用",
                        "hasReturn": false,
                        "params": [
                            {
                                "type": "handler",
                                "desp": "操作内容",
                                "name": "callback",
                                "defaultValue": "function(){}",
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "shortDelay",
                        "desp": "短延时操作",
                        "details": "用于短延时操作，用于数据处理量小或即时渲染要求低的处理的延时调用",
                        "hasReturn": false,
                        "params": [
                            {
                                "type": "handler",
                                "desp": "操作内容",
                                "name": "callback",
                                "defaultValue": "function(){}",
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "require": true,
                        "name": "sleep",
                        "desp": "浏览器休眠",
                        "details": "用于模拟浏览器休眠，用于暂停一段时间后执行代码",
                        "hasReturn": false,
                        "params": [
                            {
                                "type": "number",
                                "desp": "休眠时间",
                                "name": "timeout",
                                "necessary": true
                            }
                        ]
                    }
                ],
                "compatibility": "ie8",
                "depJsArr": "[]"
            }
        ]
    }
],
   
        appInterfacesConst=[
    {
        "category": "标签页类型",
        "valueArray": [
            "app.router.tab.TYPE.BLANK",
            "app.router.tab.TYPE.SUB",
            "app.router.tab.TYPE.SELF",
            "app.router.tab.TYPE.WINDOW",
            "app.router.tab.TYPE.POPOVER"
        ],
        "despArray": [
            "新标签",
            "子标签",
            "自身标签",
            "窗口标签",
            "气泡标签"
        ]
    },
    {
        "category": "标签页状态类型",
        "valueArray": [
            "app.router.STATUS.AFTER_LOAD",
            "app.router.STATUS.BEFORE_PAUSE",
            "app.router.STATUS.AFTER_PAUSE",
            "app.router.STATUS.BEFORE_RESUME",
            "app.router.STATUS.AFTER_RESUME",
            "app.router.STATUS.BEFORE_UNLOAD",
            "app.router.STATUS.AFTER_UNLOAD"
        ],
        "despArray": [
            "标签页加载完毕后",
            "标签页切出前",
            "标签页切出后",
            "标签页切入前",
            "标签页切入后",
            "标签页销毁前",
            "标签页销毁后"
        ]
    },
    {
        "category": "路由",
        "valueArray": [
            "app.router.getCurrentHandler()"
        ],
        "despArray": [
            "获取当前标签页实例"
        ]
    },
    {
        "category": "提示语句",
        "valueArray": [
            "app.alert.ERROR",
            "app.alert.SUCCESS",
            "app.alert.WARNING",
            "app.alert.MESSAGE",
            "app.alert._DEFAULT"
        ],
        "despArray": [
            "提示错误类型",
            "提示成功类型",
            "提示警告类型",
            "日志信息类型",
            "默认类型"
        ]
    },
    {
        "category": "行为接口比较条件",
        "valueArray": [
            "app.behavior.LESS_THAN",
            "app.behavior.EQUAL",
            "app.behavior.GREAT_THAN",
            "app.behavior.NOT",
            "app.behavior.INCLUDES",
            "app.behavior.NOT_INCLUDES",
            "app.behavior.STARTS_WITH"
        ],
        "despArray": [
            "小于",
            "等于",
            "大于",
            "不等于",
            "包含",
            "不包含",
            "以…开头"
        ]
    },
    {
        "category": "数据格式转换",
        "valueArray": [
            "app.getFormatData.TYPE.MONEY",
            "app.getFormatData.TYPE.BANDCARD"
        ],
        "despArray": [
            "转换金额格式",
            "转换银行卡格式"
        ]
    },
    {
        "category": "设备终端类型",
        "valueArray": [
            "app.getUA.TYPE.WEIXIN_IPAD",
            "app.getUA.TYPE.WEIXIN_IPHONE",
            "app.getUA.TYPE.WEIXIN_ANDROID_PHONE",
            "app.getUA.TYPE.WEIXIN_ANDROID_PAD",
            "app.getUA.TYPE.ALIPAY_IPAD",
            "app.getUA.TYPE.ALIPAY_IPHONE",
            "app.getUA.TYPE.ALIPAY_ANDROID_PHONE",
            "app.getUA.TYPE.ALIPAY_ANDROID_PAD",
            "app.getUA.TYPE.IPHONE",
            "app.getUA.TYPE.IPAD",
            "app.getUA.TYPE.ANDROID_PHONE",
            "app.getUA.TYPE.ANDROID_PAD",
            "app.getUA.TYPE.MSIE",
            "app.getUA.TYPE.IE11",
            "app.getUA.TYPE.MICROSOFT_EDGE",
            "app.getUA.TYPE.PC_NOT_IE",
            "app.getUA.TYPE.IONIC_IPAD",
            "app.getUA.TYPE.IONIC_IPHONE",
            "app.getUA.TYPE.IONIC_ANDROID_PHONE",
            "app.getUA.TYPE.IONIC_ANDROID_PAD",
            "app.getUA.TYPE.CORDOVA_IPAD",
            "app.getUA.TYPE.CORDOVA_IPHONE",
            "app.getUA.TYPE.CORDOVA_ANDROID_PHONE",
            "app.getUA.TYPE.CORDOVA_ANDROID_PAD"
        ],
        "despArray": [
            "iPad版微信",
            "iPhone版微信",
            "安卓手机版微信",
            "安卓平板版微信",
            "iPad版支付宝",
            "iPhone版支付宝",
            "安卓手机版支付宝",
            "安卓平板版支付宝",
            "iPhone版网页",
            "iPad版网页",
            "安卓手机版网页",
            "安卓平板版网页",
            "IE6~10",
            "IE11+",
            "Edge浏览器",
            "其他PC浏览器",
            "iPad版Ionic App",
            "iPhone版Ionic App",
            "安卓手机版Ionic App",
            "安卓手机版Ionic App",
            "iPad版cordova App",
            "iPhone版cordova App",
            "安卓手机版Cordova App",
            "安卓平板版Cordova App"
        ]
    }
];
        
         return{
           appInterfaces:appInterfaces,
           appInterfacesConst:appInterfacesConst
         }
    })
})();