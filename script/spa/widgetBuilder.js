/**
 *
 * @param {[undefined]}
 *            undefined [确保undefined未被重定义]
 * @author lijiancheng@cfischina.com
 */
( /* <global> */ function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", 'template', 'index', 'widgetConfig', 'base'], factory);
		}
		// global
		else {
			factory();
		}

	})
		(function ($, artTemplate, global, WidgetConfig, base) {
			"use strict";

			var AUI = global.AUI,
				CONST = global.CONST,
				WB_CONST = {
					PAGE: {
						BANNER: {
							SELECTOR: '#auiNavBar',
							SAVE_BTN: 'auiNavSaveBtn',
							RESET_BTN: 'auiNavResetBtn',
							STEP_BTN: 'auiNavStepBtn'
						},
						FRAME: {
							CONFIG_FRAME_SELECTOR: '#auiFrameCtn',
							PREVIEW_FRAME: {
								SELECTOR: '#auiWCCtn',
								CODE_CTN_SELECTOR: '#auiWCCodeCtt',
								CODE_EDITOR_SELECTOR: '#auiWCCodeEditor',
								VIEW_SELECTOR: '#auiWCViewCtt',
								CONFIG_VIEW_SELECTOR: '#auiEditFrame',
								PREVIEW_VIEW_SELECTOR: '#auiPreviewFrame'
							}
						},
						CTN_SELECTOR: '#auiPageCtn',
						PANEL_SELECTOR: '#auiPagePanels',
						CTT_SELECTOR: '#auiPageCtt'
					},
					CREATOR: {
						ID: 'widgetCreator',
						TYPE: 'widgetCreatorType',
						HREF: 'fake.widgetCreatorType'
					}

				},

				auiJSEditor = AUI.vscode.create(
					$(WB_CONST.PAGE.FRAME.PREVIEW_FRAME.CODE_EDITOR_SELECTOR), {
						value: [
							'function x() {',
							'\tconsole.log("Hello world!");',
							'}'
						].join('\n'),

						language: 'javascript'
					}),

				callbackLock = false,
				isResume = false,
				frameInstanceId;

			AUI.data.builder = AUI.data.builder || {};

			var funStr = WidgetConfig.templateFunc.toString();

			AUI.reset = function () {
				var data = AUI.data;

				external.saveJsCode({
					href: data.href,
					code: ''
				});

				external.saveConfigure({
					"belongTo": data.belongTo || 'custom',
					"icon": "fa fa-file",
					"index": data.index || 0,
					"frame": true,
					"name": data.type,
					"type": data.type,
					"desp": data.desp,
					"href": data.href,
					"pType": data.pType,
					"version": AUI.awosAppUnitedVersion
				}, function () {
					document.location.reload(true);
				});
			};
			AUI.save = function () {
				$AW(AUI.data.uuid).frame();
			};

		/* $AW[WB_CONST.CREATOR.HREF] =
			AUI. */var widgetCreatorConfigCallbackHandler = function (oWidgetCreator, event) {
				var apiIndex, apiObj;

				if (callbackLock) {
					var frameInstanceId = AUI.data.structure({
						'type': AUI.data.type
					}).first().widgetID,
						frameInstance = $AW(frameInstanceId),
						creatorOption = oWidgetCreator.option(),
						external;

					if (event.modelSelector in {
						"widgetInstance['info']['accept']": true,
						"widgetInstance['info']['base']": true,
						"widgetInstance['info']['author']": true
					}) {
						creatorOption.accept = creatorOption.info.accept;
						creatorOption.base = creatorOption.info.base;
						creatorOption.author = creatorOption.info.author;

						oWidgetCreator.option(creatorOption, true);
					}

					if (event.modelSelector.match(/^widgetInstance\['api'\]\['[0-9]+'\]\['type'\]$/)) {
						apiIndex = event.modelSelector.match(/(\d+)/)[0];
						apiObj = WidgetConfig.apiDefaultList[newWidgetData.api[apiIndex - 1].type];

						base.updateResponsiveData({
							contextID: 'auiConfigureDefCtnOption',
							dataType: 'obj',
							selector: '.api[' + apiIndex + ']',
							keys: ['hasReturn', 'params', 'returnValue'],
							arraySelector: "['0']['tabPanes']['7']['attrInEachElement']",
							values: [apiObj.hasReturn, apiObj.params, apiObj.returnValue || {}]
						});
					}

					if (event.modelSelector === "widgetInstance['optionCopy']['external']['widget']") {
						$AW.loadChildrenWidget(frameInstance[0].href);
					}

					// frameInstance.update({
					// 	option: {},
					// 	optionCopy: {}
					// });

					frameInstance.updateWidget(creatorOption);
					// frameInstance.update({option: AUI.getCleanedOption(frameInstance[0].data.optionCopy, frameInstance[0].widget.option)});

					AUI.resumeBaseConfig(frameInstance, undefined, event);
					frameInstance.config();

					AUI.currentWidgetID = WB_CONST.CREATOR.ID;
				}

			};

			$AW.on($AW.STATUS.WIDGET_UPDATE, function (eventName, oWidget, event) {
				if (oWidget.id() === WB_CONST.CREATOR.ID) {
					widgetCreatorConfigCallbackHandler(oWidget, event);
				}
			});

			AUI.resumeWidgetBuilder = function (href, notInStep) {
				external.getDependenceConfig(function (depsData) {
					external.getWidget(href, function (data) {

						var resumeWidgetCreator = function () {
							var oWidgetCreator, oWidgetFrame,
								creatorWidget,
								$contextCreator,
								frameWidgetData,
								creatorOption, jsConfigArray = [],
								cssConfigArray = [];

							$.each(depsData, function (key, value) {
								if (value.name) {
									jsConfigArray.push(value.name);
								} else {
									cssConfigArray.push(key);
								}
							});

							//insert: 虚拟组件
							AUI.data.widget.insert({
								name: 'creator',
								desp: 'creator',
								icon: 'fa fa-files',
								type: WB_CONST.CREATOR.TYPE,
								pType: '',
								href: WB_CONST.CREATOR.HREF,
								belongTo: 'creator',
								version: AUI.awosAppUnitedVersion,
								index: 0,
								option: [

									{
										type: 'tab',
										tabPanes: [{
											name: 'info',
											type: 'object',
											desp: '信息',
											attr: [{
												name: 'author',
												desp: '作者',
												type: 'string_input',
												placeholder: '请填入邮箱地址'
											},
											{
												name: 'name',
												desp: '中文名',
												type: 'string_input'
											},
											{
												name: "details",
												desp: "详情",
												type: 'string_input'
											},
											{
												name: "compatibility",
												desp: '兼容性',
												type: 'string_select',
												valueArray: ['modernBrowser', 'ie8', 'ie9', 'ie10'],
												despArray: ['现代浏览器', 'IE8', 'IE9', 'IE10']
											},
											{
												name: 'icon',
												desp: '图标',
												type: 'icon'
											},
											{
												name: 'category',
												desp: '分类',
												type: 'string_select',
												valueArray: AUI.data.category.valueArray,
												despArray: AUI.data.category.despArray
											},
											{
												name: "accept",
												desp: "可放置于",
												type: 'multiple_select',
												separator: ' ',
												defaultValue: 'mainPanel',
												despArray: AUI.data.builder.accept.despArray,
												valueArray: AUI.data.builder.accept.valueArray
											},
											{
												name: 'isLayout',
												desp: '布局容器类组件',
												type: 'boolean',
												defaultValue: true
											},
											{
												name: "base",
												desp: "布局模式继承于",
												type: 'multiple_select',
												separator: ' ',
												defaultValue: 'divCtn',
												despArray: AUI.data.builder.accept.despArray,
												valueArray: AUI.data.builder.accept.valueArray,
												require: {
													isLayout: 'true'
												}
											},
											{
												name: 'collapse',
												desp: '在组件菜单中收起该组件类型',
												type: 'boolean',
												defaultValue: false
											},
											{
												name: 'hidden',
												desp: '在组件菜单中隐藏该组件',
												type: 'boolean',
												defaultValue: false
											}
											]
										},
										{
											"name": "deps",
											"type": "object",
											"desp": "依赖",
											"isTab": true,
											"attr": [{
												"name": "js",
												"type": "multiple_select",
												"desp": "脚本文件",
												"valueArray": jsConfigArray,
												"despArray": jsConfigArray
											},
											{
												"name": "css",
												"type": "multiple_select",
												"desp": "样式文件",
												"valueArray": cssConfigArray,
												"despArray": cssConfigArray
											}
											]
										}
										].concat(WidgetConfig.commonOption)
									}
								],
								attr: []
							});
							AUI.data.structure.insert({
								widgetID: WB_CONST.CREATOR.ID, //primary key
								type: WB_CONST.CREATOR.TYPE, //foreign key
								href: WB_CONST.CREATOR.HREF,
								active: true, //是否生效，撤销之后不生效
								option: {},
								optionCopy: {},
								attr: {
									widgetName: data.name || '业务组件creator'
								},
								css: {},
								children: []
							});

							frameInstanceId = AUI.data.structure({
								'type': AUI.data.type
							}).first().widgetID;

							//初始化：虚拟组件对象和context
							oWidgetCreator = $AW(WB_CONST.CREATOR.ID);
							creatorWidget = oWidgetCreator[0].widget;


							$contextCreator = $('#auiConfigureDefFrame');

							//初始化：业务组件在structure中的结构
							// AUI.resumeBaseConfig(oWidgetFrame);

							/*  //初始化creator在structure中的结构，此时creator在structure中的option是技术组件的默认值
																	AUI.resumeBaseConfig(oWidgetCreator, undefined, {
																			type: CONST.WIDGET.EVENT_TYPE.RESUME
																	});
	
																	//合并技术组件的值
																	creatorOption = $.extend(true, oWidgetCreator.option(), widgetData); */

							creatorOption = base.baseConfigInitInstance(JSON.parse(JSON.stringify(data)), oWidgetCreator[0].widget.option, {
								widgetID: oWidgetCreator[0].widgetID
							});

							//利用新的option更新widget
							// AUI.resumeWidget(creatorOption, creatorWidget.option);
							// oWidgetCreator.updateWidget(creatorWidget);

							//更新structure
							oWidgetCreator.update({
								option: data,
								optionCopy: creatorOption
							});
							callbackLock = true;

							AUI.currentWidgetID = WB_CONST.CREATOR.ID;
							//初始化业务组件编辑主页面
							base.baseConfigure($contextCreator, oWidgetCreator);

							//初始化：业务组件
							oWidgetFrame = $AW(frameInstanceId);

							//初始化：业务组件的widget值
							// $AW[data.href] = AUI.widgetInstanceDefaultCallback;
							oWidgetFrame.config();

							// AUI.currentWidgetID = 'widgetCreator';
							$AW(frameInstanceId).config();

							AUI.hideWelcomeScreen();

							AUI.configLock = true;
						};

						var getAcceptTagsItems = function (db) {
							var valueArray = [],
								despArray = [];
							db([{
								pType: 'ctn'
							}, {
								pType: 'layout'
							}, {
								type: 'mainPanel'
							}, {
								base: {
									isString: true
								}
							}]).each(function (record) {
								valueArray.push(record.type);
								despArray.push(record.name + '(' + record.type + ')');
							});
							return {
								valueArray: valueArray,
								despArray: despArray
							};
						};

						var context = $AW(AUI.data.uuid),
							href = data.href,
							frameName = data.name;

						AUI.data.builder.accept = getAcceptTagsItems(AUI.data.menu);

						// $AW[data.href] = AUI.widgetInstanceDefaultCallback;

						//恢复界面
						if (!AUI.data.widget({
							href: href
						}).first()) {

							//新建业务组件
							data = $.extend(true, {
								template: '<div data-widget-type="' + data.type + '"></div>',
								accept: '',
								base: '',
								attr: [],
								option: [],
								css: {},
								event: {},
								edm: {},
								action: [],
								deps: {
									js: [data.href]
								}
							}, data);
							data.isNewest = true;

							AUI.data.widget.insert(data);
						}

						AUI.data.widget({
							href: data.href
						}).update({
							callback: {
								"render": "##_var## = $AW." + data.href + "($('###_ID##',$el),##_OPTION##, ##_ATTR##, ##_CSS##,##_auiCtx##);",
								"config": function (widget, event) {
									// AUI.widgetInstanceDefaultCallback && AUI.widgetInstanceDefaultCallback(widget, event);
								}
							}
						});


						if (data.frame === true) {
							isResume = true;
							$AW(AUI.data.uuid).append(data.href, function (cWidget) {
								resumeWidgetCreator();
							});
						} else {

							if (AUI.data.structure().get({
								href: href
							})[0].children.length === 0) {
								isResume = true;
							}

							$AW._paste(context, data.frame, frameName, notInStep, resumeWidgetCreator);
						}

						auiJSEditor.done(function (auiJSEditor) {
							//获取js代码
							external.getJsCode({
								href: data.href
							}, function (codeString) {

								auiJSEditor.layout();

								var callback = function () {
									try {

										var i = 1,
											j = 0,
											requireArray,
											topLevel = UglifyJS.parse(auiJSEditor.getValue());
										var walker = new UglifyJS.TreeWalker(function (node) {

											if (node instanceof UglifyJS.AST_BlockStatement) {
												if (++j === 1) {
													requireArray = JSON.parse(AUI.getParsedString(node).match(/\[(.+?)\]/)[0]);
												}
											}

											if (node instanceof UglifyJS.AST_Function) {
												if (i++ === 3) {

													(function (AUI) {
														var func,
															path = 'widget.' + data.href,
															str = AUI.getParsedString(node);

														eval('func=' + str);

														try {
															require(requireArray, function () {
																// $AW[data.href] = AUI.widgetInstanceDefaultCallback;

																func.apply(AUI, arguments);

																// callbackLock && AUI.widgetInstanceDefaultCallback && AUI.widgetInstanceDefaultCallback($AW(frameInstanceId), {
																//     type: isResume ? CONST.WIDGET.EVENT_TYPE.RESUME : CONST.WIDGET.EVENT_TYPE.SIZE_CHANGE
																// });
																isResume = false;
															});
														} catch (e) {
															console.warn(e);
														}
													})(AUI);
												}
											}
										});
										topLevel.walk(walker);
									} catch (e) {
										app.alert('代码格式有问题，请检查！！');
									}
								};

								//添加代码框

								if (codeString) {
									auiJSEditor.setValue(codeString);

								} else {
									auiJSEditor.setValue('(' + funStr.replace(/_href_/, data.href) + ')();');
									external.saveJsCode({
										href: data.href,
										code: auiJSEditor.getValue()
									}, callback, callback);
								}

								callback();

								auiJSEditor.onDidBlurEditorText(function () {
									var str = auiJSEditor.getValue();
									external.saveJsCode({
										href: data.href,
										code: str
									}, callback, callback);
								});


								$(CONST.PAGE.NAV.UPD_CODE_BTN).on('click.ui', function () {
									var str = auiJSEditor.getValue();
									external.saveJsCode({
										href: data.href,
										code: str
									}, function () {
										app.alert('保存更新代码成功！', app.alert.SUCCESS);
										callback();
									}, callback);
								});
							});
						})

					});
				})

			};


			var WB = {
				init: function () {
					var AUI = global.AUI,
						CONST = global.CONST;

					//初始化权限角色
					external.getRole(function (data) {
						AUI.data.role.insert(data);
					});

					//初始化数据实体列表
					external.getEDM(function (data) {
						AUI.data.edmModel = app.taffy(data);
					});

					//获取页面路径
					external.getWebContentPath(function (path) {
						AUI.configuration.webContentPath = path;
					});

					//获取AUI的配置并初始化菜单
					AUI.getPageConfig(function () {
						WB.ui();
						AUI.renderMenu();

						AUI.resumeDataModel($(CONST.PAGE.FRAME.EDITOR_CTN), CONST.WIDGET.PAGE_TYPE, CONST.WIDGET.PAGE_HREF, function () {
							AUI.resumeWidgetBuilder(AUI.data.href, true);
						}, function (config, data, $auiFrame) {
							var frameList = CONST.DATA.builderList,
								cannotOverride = CONST.DATA.cannotOverride,
								i, item;

							for (i = frameList.length; item = frameList[--i];) {
								!cannotOverride[item] && config[item] && (data[item] = config[item]);
							}

							data.uuid = app.getUID();

							if (config.frame.root) {
								delete config.___id;
								delete config.___s;

								data.menu.insert(config);
								data.widget.insert(config);
							}

							return data;
						});



					});

				},
				ui: function () {
					AUI.editorLayout = AUI.Layout.Editor();

					$('a[data-role="configDef"]', WB_CONST.PAGE.CTN_SELECTOR).on('click.wb', function () {

						$AW(frameInstanceId).config();

						AUI.currentWidgetID = WB_CONST.CREATOR.ID;
					});

					$('a[data-role="page"]', WB_CONST.PAGE.CTN_SELECTOR).on('shown', function () {

						$AW(frameInstanceId).config();
					});

				}
			};

			return WB;
		});
})();