/**
 *
 * @param {[undefined]}
 *            undefined [确保undefined未被重定义]
 * @author zhanghaixian@agree.com.cn
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", 'template', 'index', 'const','config.widget', 'config.css', 'base', 'css','Model.Data'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, artTemplate, AUI,CONST, WidgetConfig, cssConfig, base, css,dataModel) {
        "use strict";

        var

            themeHref,
            callbackLock = false,
            themeInstanceID,

            widgetCreatorConfigCallbackHandler = function (oWidget) {
                var frameInstanceId = dataModel.get('structure')({'type':dataModel.get('type')}).first(),
                    frameInstance, frameConfig, data, variables;

                if (callbackLock && frameInstanceId) {
                    frameInstanceId = frameInstanceId.widgetID;
                    frameInstance = $AW(frameInstanceId);
                    frameConfig = frameInstance[0].widget;

                    frameInstance.updateWidget($AW(CONST.CREATOR.ID).option());
                    frameInstance.updateWidget({callback: undefined});

                    $AW.fresher = $AW.fresher || {};
                    $AW.fresher.theme = JSON.parse(JSON.stringify(frameInstance[0].widget.theme || {}));

                    refreshVariables(frameInstance);

                    AUI.currentWidgetID = CONST.CREATOR.ID;
                }

            },
            refreshTheme = function (oWidget) {
                var widgetInstance, key, content, css;
                //
                // if (oWidget.version) {
                    widgetInstance = oWidget[0].data;
                    if ((key = widgetInstance.themeName) && (css = oWidget[0].data.css)) {
                        content = $AW.fresher.theme[widgetInstance.href] || ($AW.fresher.theme[widgetInstance.href] = {});
                        content[key] = css.style;
                    }
                // }
            },

            refreshVariables = function (themeInstance) {

                $AW.fresher.variables = {};
                $AW.fresher.variables =  themeInstance[0].widget.variables;
                $AW.fresher.variablesCopy = {};
                $AW.fresher.variablesCopy = AUI.transformThemeVariables(themeInstance[0].widget.variables);

            };








        AUI.reset = function () {
           /* var data = AUI.data;*/

            external.saveConfigure({
                "belongTo": dataModel.get('belongTo'),
                "icon": "fa fa-file",
                "index": dataModel.get('index') || 0,
                "frame": true,
                "name": dataModel.get('name') || dataModel.get('type'),
                "type": dataModel.get('type'),
                "desp": dataModel.get('desp'),
                "href": dataModel.get('href'),
                "pType": dataModel.get('pType'),
                "version": AUI.awosAppUnitedVersion
            }, function () {
                document.location.reload(true);
            });
        };



        AUI.save = function () {
            // $AW(AUI.data.uuid).frame();

            if (!AUI.savingLock) {
                try {
                    var data = {}, item, i,
                        list = CONST.DATA.themeList,
                        widgetData = $AW(CONST.CREATOR.ID).option();

                    AUI.savingLock = true;
                    widgetData.css = [];

                    for (i = -1; item = list[++i];) {
                        widgetData[item] && (data[item] = widgetData[item]);
                    }
                    data.theme = $AW.fresher.theme;
                    data[CONST.USE_VERSION]=version;
                    external.saveConfigure(data, function () {

                        AUI.saveFresherFile();
                        $AW.trigger($AW._STATUS.SAVE);
                        app.alert('保存' + CONST.WIDGET.TYPE_TEXT[auiApp.mode.toUpperCase()] + '“' + data.name + '”成功 \n到浏览器刷新页面即可看到效果 \n主题已经保存到“WebRoot”下，请将“WebRoot\\dependence\\js”下的文件提交到版本库', app.alert.SUCCESS);

                        AUI.savingLock = false;

                    }, function () {
                        AUI.savingLock = false;
                    });

                } catch (e) {
                    AUI.savingLock = false;
                    throw e;
                }
            } else {
                app.alert('页面保存中，请稍候…', app.alert.WARNING);
            }

        };

        $AW.on($AW.STATUS.CSS_UPDATE, function (eventName, oWidget) {

            if (oWidget) {
                refreshTheme(oWidget);
            }

        });

        $AW.on($AW.STATUS.WIDGET_UPDATE, function (eventName, oWidget, event) {

            var id;
            if (oWidget && (id = oWidget.id())) {
                if (id === CONST.CREATOR.ID) {
                    widgetCreatorConfigCallbackHandler(oWidget, event)
                }
            }

        });


        var Theme = {
            init: function () {


                //初始化权限角色
                external.getRole(function (data) {
                    dataModel.get('role').insert(data);
                });

                //初始化数据实体列表
                external.getEDM(function (data) {
                    dataModel.set('edmModel',app.taffy(data))
                });

                //获取页面路径
                external.getWebContentPath(function (path) {
                    dataModel.setConfigValue('webContentPath', path);
                });


                //获取AUI的配置并初始化菜单
                AUI.getPageConfig(function () {

                    // Theme.ui();

                    AUI.resumeDataModel($(CONST.PAGE.CONTENT_FRAME.EDITOR_CTN), CONST.WIDGET.PAGE_TYPE, CONST.WIDGET.PAGE_HREF,
                        function (pageWidget, themeConfig, themeData) {//数据展示
                            var oWidgetCreator;

                            //insert: 虚拟组件
                            dataModel.get('widget').insert({
                                name: 'creator',
                                desp: 'creator',
                                icon: 'fa fa-files',
                                type: CONST.CREATOR.TYPE,
                                pType: '',
                                href: CONST.CREATOR.HREF,
                                belongTo: 'creator',
                                version: AUI.awosAppUnitedVersion,
                                index: 0,
                                callback: {
                                    "config": widgetCreatorConfigCallbackHandler
                                },
                                option: [
                                    {
                                        name: 'author',
                                        desp: '组件作者',
                                        type: 'string_input',
                                        placeholder: '请填入邮箱地址'
                                    },
                                    {
                                        name: 'name',
                                        desp: '组件中文名',
                                        type: 'string_input'
                                    },
                                    {
                                        name: 'desp',
                                        desp: '描述',
                                        type: 'string_input'
                                    },
                                    {
                                        name: "details",
                                        desp: "详情",
                                        type: 'string_input'
                                    },
                                    {
                                        name: 'icon',
                                        desp: '图标',
                                        type: 'icon'
                                    },
                                    {
                                        name: 'src',
                                        desp: '主题缩略图',
                                        type: 'string_input',
                                        defaultValue: './img/theme.png'
                                    }, {
                                        name: 'variables',
                                        expand: true,
                                        desp: '变量配置',
                                        type: 'array',
                                        attrInEachElement: [
                                            {
                                                desp: "英文名(不要包含特殊字符，如#,@,&,建议用'foo-bar'形式)",
                                                name: "name",
                                                type: "string_input"
                                            }, {
                                                desp: "中文名",
                                                name: "desp",
                                                type: "string_input"
                                            }, {
                                                desp: "适用范围",
                                                name: "cssAttrs",
                                                type: "multiple_select"
                                            }, {
                                                desp: "默认值",
                                                name: "defaultValue",
                                                type: "string_input"
                                            }
                                        ]
                                    }],
                                attr: []
                            });

                            dataModel.get('structure').insert({
                                widgetID: CONST.CREATOR.ID,//primary key
                                type: CONST.CREATOR.TYPE,//foreign key
                                href: CONST.CREATOR.HREF,
                                active: true,//是否生效，撤销之后不生效
                                option: {},
                                optionCopy: {},
                                attr: {
                                    widgetName: themeConfig.name || '主题组件theme'
                                },
                                css: {},
                                children: [],
                                isTemplate: false,
                                changeTimes: 0
                            });

                            oWidgetCreator = $AW(CONST.CREATOR.ID);
                            oWidgetCreator.append(themeHref, function (themeWidget) {
                                var themeWidgetConfig,
                                    creatorOption;

                                themeInstanceID = themeWidget.id();

                                themeConfig.variables = themeData.variables || WidgetConfig.themeVariables;

                                themeConfig.theme = themeData.theme || {};

                                creatorOption = base.baseConfigInitInstance(JSON.parse(JSON.stringify(themeConfig)), oWidgetCreator[0].widget.option, {widgetID: oWidgetCreator[0].widgetID});

                                //更新structure
                                oWidgetCreator.update({
                                    option: themeConfig,
                                    optionCopy: creatorOption
                                });
                                callbackLock = true;

                                app.router.page.auiConfigureDefFrame && app.router.page.auiConfigureDefFrame.done(function(){
                                    $AW.trigger('configure_def_frame_load')
                                });



                                //初始化主题组件编辑主页面
                                /*base.baseConfigure($(TE_CONST.PAGE.DEFINE_CTN_SELECTOR), oWidgetCreator);*/


                                //初始化：主题组件的widget值
                                themeWidgetConfig = oWidgetCreator.option();

                                themeWidgetConfig.pType = CONST.WIDGET.TYPE.THEME;


                                themeWidget.updateWidget(themeWidgetConfig);


                                themeWidget.config();

                                AUI.configLock = true;
                            });
                            /*AUI.renderMenu(renderMenuCallback);*/
                        },
                        function (themeConfig, themeData) {//数据处理和恢复
                            var themeList = CONST.DATA.themeList,
                                i, item,variablesArr;

                            for (i = themeList.length; item = themeList[--i];) {
                                themeConfig[item] && (themeData[item] = themeConfig[item]);
                            }

                            themeData.theme = themeConfig.theme || {};

                            themeData.variables = themeConfig.variables;

                            $AW.fresher = $AW.fresher || {};
                            $AW.fresher.theme = JSON.parse(JSON.stringify(themeData.theme));

                            $AW.fresher.variables = {};
                            $AW.fresher.variables = themeData.variables;
                            $AW.fresher.variablesCopy = {};
                            $AW.fresher.variablesCopy = AUI.transformThemeVariables(themeData.variables);


                            themeHref = themeConfig.href;


                            if (!dataModel.get('widget')({href: themeHref}).first()) {
                                //新建业务组件
                                themeConfig = $.extend(true, {
                                    pType: CONST.WIDGET.TYPE.THEME,
                                    template: '<div data-widget-type="' + themeConfig.type + '"></div>',
                                    accept: CONST.CREATOR.TYPE,
                                    attr: [],
                                    option: [],
                                    variables: [],
                                    theme: {},
                                    css: {}
                                }, themeConfig);

                                themeConfig.isNewest = true;

                                dataModel.get('widget').insert(themeConfig);

                            } else {
                                dataModel.get('widget')({href: themeHref}).update({accept: CONST.CREATOR.TYPE});
                            }
                            return themeData;
                        });




                });

            },
            ui: function () {



            }
        };

        return Theme;
    });
})();