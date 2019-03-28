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
			define(["jquery", "taffy"], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, taffy) {

		return function(widget,structure){
			var widgetMap={},
				result={css:[],js:[]},
				hash={css:{},js:{}},
				list=['css','js'],
				i, item, items, queue, queueHash,j,name;

			structure({active:true}).each(function(structureInstance) {
				if(!widgetMap[structureInstance.href]){
					var widgetInstance = widget({href: structureInstance.href}).first();

					widgetMap[structureInstance.href]=widgetInstance;

					if (widgetInstance && (widgetInstance = widgetInstance.deps)) {
						for (j = list.length; name = list[--j];) {
							if ((items = widgetInstance[name]) && items.length) {
								queue = result[name];
								queueHash = hash[name];
								for (i = -1; item = items[++i];) {
									if (!queueHash[item]) {
										queueHash[item] = true;
										queue.push(item);
									}
								}
							}
						}
					}
				}
			});


			widget({isExternal:true}).each(function(widgetConfig) {
				if(!widgetMap[widgetConfig.href]) {

					widgetMap[widgetConfig.href]=widgetConfig;

					if (widgetConfig && (widgetConfig = widgetConfig.deps)) {
						for (j = list.length; name = list[--j];) {
							if ((items = widgetConfig[name]) && items.length) {
								queue = result[name];
								queueHash = hash[name];
								for (i = -1; item = items[++i];) {
									if (!queueHash[item]) {
										queueHash[item] = true;
										queue.push(item);
									}
								}
							}
						}
					}
				}
			});


			return result;
		}
	});
})();