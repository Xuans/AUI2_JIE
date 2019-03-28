/*!
 * Javascript library v3.0
 *
 * Date: 2016.05.17
 */

/**
 * @author lijiancheng@cfischina.com
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($) {
        return function (uuid, widget, structure) {
            var AUI_COMPILER='compiler',
                MAIN_PANEL_TYPE='mainPanel',
                ATTR_REMOVE_MAP={
                    widgetName:true,
                    desp:true
                };


            var $domTree=$('<div/>'),
                $page = $('<div/>');

            //定义函数
            function generalHTML(widgetID, $ctn) {
                var widgetCollection, widgetInstance,
                    widgetModel, widgetData,
                    i, item, items,
                    $content,
                    attrObj;

                widgetCollection = structure({widgetID: widgetID});

                if (widgetInstance = widgetCollection.first()) {
                    widgetModel = widget({type: widgetInstance.type});

                    if ((widgetData = widgetModel.first()) && widgetInstance.pID) {
                        $content = $(widgetData.template);
	                    $ctn.append($content);

                        //attr
                        attrObj = widgetInstance.attr;

                        if(window.auiApp.mode!==AUI_COMPILER){
	                        $content
                                .attr(attrObj, attrObj)
                                .attr('data-widget-id',widgetInstance.widgetID);
                        }else{
	                        for (item in attrObj) {
		                        if (attrObj.hasOwnProperty(item) && attrObj[item] && attrObj[item] !== 'false' && !ATTR_REMOVE_MAP[item]) {
			                        $content.attr(item, attrObj[item]);
		                        }
	                        }
                        }

                        //css

                        if($content.length && widgetInstance.css && widgetInstance.css.cssCode && widgetInstance.css.cssCode.className){

                            $content.addClass(widgetInstance.css.cssCode.className);

                        }



                        //next one
                        if ((items = widgetInstance.children) && items.length) {
                            for (i = -1; item = items[++i];) {
                                generalHTML(item, $content);
                            }
                        }

                    } else {//如果找不到对应的组件的话
                        //next one
                        if ((items = widgetInstance.children) && items.length) {
                            for (i = -1; item = items[++i];) {
                                generalHTML(item, $ctn);
                            }
                        }
                    }
                }
            }


            if(!structure({widgetID: uuid}).first()) {
                uuid = structure({type: MAIN_PANEL_TYPE}).first();
                uuid = uuid && uuid.widgetID;
            }


            //获取HTML
            generalHTML(uuid, $page);

            //添加页面结构自定义样式到<style/>
            $domTree.append($page);

	        $page.addClass('aweb3_5-divCtn-default');

            return $domTree.html().replace(/\\/g, '\\\\');
        }
    });
})();