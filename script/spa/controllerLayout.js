(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(['jquery', 'const', 'Model.Data', 'layout'], factory);
        }
        // global
        else {
            factory();
        }
    })(function ($, CONST, dataModel, Layout) {

        var
            dispatcher = app.dispatcher(),

            PageModel = function () {
                this.prefix = app.getUID();
            },
            OutView = function () {
                this.layout = new Layout({
                    view: {
                        $nav: $('#auiNavBar>.aui-tabs-left-group'),
                        $windows: $('#auiPageCtn')
                    },
                    model: window.auiApp.layout
                });
            },
            OuterController = function (option) {

                this.cache = {};
                this.option = option || {};
                this.view = new (this.option.View || OuterController.View)(option);
            },
            InnerController = function (option) {
                var controller = new OuterController($.extend({}, {
                    View: InnerView
                }, option));
                for (var p in controller) {
                    InnerController.prototype[p] = controller[p];
                }
            },
            InnerView = function (options) {
                var _default = this._default,
                    context = this;

                $.extend(true, context, _default, options);

                context.$tabs = $(this.tabs, this.$ctn);
                context.$ctt = $(this.ctt, this.$ctn);

                this.init();
                this.listener();
            };

        PageModel.prototype = dataModel;

        PageModel.prototype.constructor = PageModel;

        PageModel.prototype.on = function (type, callback) {
            type += '.' + this.prefix;

            dispatcher.on(type, callback);
        };
        PageModel.prototype.off = function (type) {
            dispatcher.off(type);
        };
        PageModel.prototype.destroy = function () {
            dispatcher.off('.' + this.prefix);
        };

        OuterController.prototype = {
            constructor: OuterController,

            open: function (options) {
                var
                    path = options.path,
                    params = this.view.open(options),
                    $el = params.$el,
                    moduleName = params.moduleName,
                    model = new PageModel(),
                    dtd = $.Deferred(),
                    controller = this;



                if (params && options.active) {
                    this.view.switchView(options.id);
                }

                controller.cache[path] = {
                    $el: $el,
                    model: model
                };

                this.currentModule = path;

                require([path + '/' + moduleName + '.js'], function (page) {


                    controller.cache[path].page = page;
                    page.load($el, model);

                    dtd.resolve();


                });

                return dtd.promise();
            },
            close: function () {
                this.cache[this.currentModule].model.destroy();
            }
        };

        OutView.prototype = {
            constructor: OutView,
            open: function (options) {
                return this.layout.getView().open(options.path);
            },

        };

        InnerView.prototype = {
            constructor: InnerView,
            _default: {
                tabs: '.aui-nav-tabs',
                ctt: '.aui-tabs-content',
                tabsTemp: '<ul class="aui-nav aui-nav-tabs "></ul>',
                tabsCttTemp: '<div class="aui-tabs-content"></div>',
                cttTemp: '<div id="_id_" class="hide">_content_</div>',
                tabTemp: '<li  data-href="_href_" title="_title_"><a><i class="_icon_"></i></a></li>',
            },
            init: function () {

                if (!this.$tabs.length) {
                    this.$ctn.append(this.tabsTemp + this.tabsCttTemp);
                    this.$tabs = $(this.tabs, this.$ctn);
                    this.$ctt = $(this.ctt, this.$ctn);
                }
            },
            listener: function () {
                var context = this;

                this.$tabs.off('.innerView').on({
                    'click.innerView': function (e) {
                        var $target = $(e.target || event.srcElement),
                            $el = $target.closest('[data-href]'),
                            href = $el.attr('data-href');


                        context.switchView(href);

                    }
                })
            },
            open: function (options) {

                var path = options.path,
                    sections = path && path.split('/'),
                    moduleName = sections.length && sections[sections.length - 1],
                    $tabs = this.$tabs,
                    $ctt = this.$ctt,
                    $tab = this.$tabs.children(),
                    xhr;
                //     //append template
                //     xhr = $.ajax({
                //         url: 'module/' + moduleName + '/template.html',
                //         async: false
                //     });
                //
                // $('body').append(xhr.responseText);


                if (!($tab.filter('[data-href="' + options.id + '"]')).length) {

                    xhr = $.ajax({
                        url: path + '/' + moduleName + '.html',
                        async: false
                    });
                    $tabs.append(this.tabTemp.replace('_href_', options.id).replace('_title_', options.title || '')
                        .replace('_icon_', options.icon || ''));
                    $ctt.append(this.cttTemp.replace('_id_', options.id).replace('_content_', xhr.responseText ? xhr.responseText : ''));
                }


                return {
                    $el: $('#' + options.id, this.$ctn),
                    moduleName: moduleName
                }
            },
            switchView: function (domID) {

                this.$tabs.children()
                    .removeClass('active')
                    .filter('[data-href="' + domID + '"]').addClass('active');

                this.$ctt.children().addClass('hide').filter('#' + domID).removeClass('hide');

            },
            close:function () {

            }
        };

        PageModel.prototype.Controller = InnerController;

        OuterController.Model = PageModel;
        OuterController.View = OutView;

        // var page = define('Module.Configure.option', ['System.Base'], function () {

        //     return {
        //         load: function ($el, handler) {
        //             handler.on({
        //                 'open': function (type, option) {
        //                     handler.trigger('resume', {});

        //                     handler
        //                         .getWidgetByHref('custom.mo')
        //                         .done(function (widget) {
        //                             alert('dd');
        //                         });


        //                     var router = new handler.Controller();

        //                     router.open()
        //                 }
        //             });
        //         },
        //         unload: function ($el, handler) {},
        //         router: function () {
        //             switch (arguments.length) {
        //                 case 1:
        //                     //打开组件
        //                     break;
        //                 case 2:
        //                     //打开组件接口
        //             }
        //         },
        //         widget: function () {},
        //         api: function () {}
        //     }
        // });


        // //index
        // var router = new OuterController();

        // router.open('Module.Menu');

        // router.open('Module.Configure');

        // router.open('/Module/Developer/widget/component.dataTables');
        // router.open('/Module/Developer/api/component.dataTables/refresh');

        // router.open('/Module/Overview/v1/show/var/aa');

        // router.open('/Module/Overview/v2/delete/var/aa');


        return OuterController;

    })
})();