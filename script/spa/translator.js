
(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", 'index', 'const','config.widget', 'base','config.language','Model.Data','nsl'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, AUI,CONST, WidgetConfig, base,languageConfig,dataModel,nsl) {
        "use strict";
        var



            translator = {
                init: function () {



                    //获取AUI的配置并初始化菜单
                    AUI.getPageConfig(function () {

                        translator.ui();


                        AUI.resumeDataModel($(CONST.PAGE.CONTENT_FRAME.EDITOR_CTN), CONST.WIDGET.PAGE_TYPE, CONST.WIDGET.PAGE_HREF,
                            function(page,translatorConfig){
                                dataModel.set("translatorConfig",translatorConfig);
                                app.router.page.auiConfigureDefFrame.done(function () {
                                    $AW.trigger($AW._STATUS.CONFIGURE_DEF_FRAME.LOAD);
                                })
                            },
                            function (translatorConfig, translatorData) {
                                return translatorData;

                            });

                        //保存数据


                    });

                },
                ui: function () {
                    //AUI.editorLayout=AUI.Layout.Editor();
                }


            };



        AUI.reset= function(){
            external.saveConfigure({}, function (response) {
                response ? app.alert('重置成功', app.alert.SUCCESS) : app.alert('重置失败！', app.alert.ERROR);
                document.location.reload(true);

            });
        };

        AUI.save=function () {
            var data={},i,j,name,key,item,
                saveLang=[],
                checkNameMap={},
                checkKeyMap={},
                newestLangConfigObj= base.getCleanedOption(dataModel.get('langConfigObj'),dataModel.get('langConfigAttr')),
                langConfigOnlyAttrMap = nsl.langConfigOnlyAttrMap,
                newestLangDespSelected=newestLangConfigObj.language.language,
                newestGlobalProperties = newestLangConfigObj.property||[],
                langConfigMap = languageConfig.langConfigMap;



            if (!AUI.savingLock) {
                try {
                    AUI.savingLock = true;

                    //将baseConfig的数据转化成编辑器需要的数据格式
                    for(i=0;i<newestLangDespSelected.length;i++){
                        saveLang.push(langConfigMap[newestLangDespSelected[i]]);
                    }

                    for(j=0;j<newestGlobalProperties.length;j++){
                        item =newestGlobalProperties[j];
                        name = item.name;
                        key = item.key;

                        //检查主键以及需翻译字符串是否重名
                        if(checkNameMap[CONST.NSL.PREFIX.GLOBAL+'.'+name]){
                            app.alert(langConfigOnlyAttrMap.name.desp+name+'重复，只保留第一个',app.alert.ERROR)

                        }else if(checkNameMap[key]){
                            app.alert(langConfigOnlyAttrMap.key.desp+key+'重复，只保留第一个',app.alert.ERROR)

                        } else{//不重名保存到配置文件下
                            item.name = name= CONST.NSL.PREFIX.GLOBAL+'.'+name;
                            item.range = CONST.NSL.RANGE.GLOBAL;
                            checkNameMap[name] = item;
                            checkKeyMap[key]  = item;
                        }
                    }

                    data.lang = saveLang;

                    data.property = newestGlobalProperties;

                    nsl.saveToIndexFile(saveLang);

                    external.saveConfigure(data, function (response) {
                        response ? app.alert('保存成功！', app.alert.SUCCESS) : app.alert('保存失败！', app.alert.ERROR);
                        AUI.savingLock = false;
                    }, function () {
                        AUI.savingLock = false;
                    });

                }catch(e) {
                    AUI.savingLock = false;
                    throw e;
                }
            }else{
                app.alert('页面保存中，请稍候…',app.alert.WARNING);
            }
        };

        return translator;

    });
})();