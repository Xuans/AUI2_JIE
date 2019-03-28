(function (scope) {

	var files = scope.inServer ? {
		jquery: 'jquery-1.9.1',
		taffy: 'taffy',
		uglifyjs: 'uglifyjs',
		template: 'template',
		compileHTML: 'compileHTML',
		compileJS: 'compileJS',
		compileDeps: 'compileDeps',
		'socket.io':'socket.io'
	} : {
		jquery: 'script/lib/jquery-1.9.1',
		taffy: 'script/lib/taffy',
		uglifyjs: 'script/lib/uglifyjs',
		template: 'script/lib/template',
		compileHTML: 'script/compile/html',
		compileJS: 'script/compile/js',
		compileDeps: 'script/compile/deps',
		'socket.io':'script/lib/socket.io'
	};


	scope.auiApp = {
		mode: 'compiler',
		version: 'AWOS 4.4.3.0_201801071200',
		debug: true
	};

	require.config({
		//依赖定义
		shim: {
			uglifyjs: {},
			jquery: {
				exports: '$'
			},
			compileHTML: {
				deps: ['jquery', 'taffy']
			},
			compileJS: {
				deps: ['uglifyjs']
			}
		},

		//文件路径定义
		paths: files,

		waitSeconds: 30
	});


	require(['jquery', 'socket.io', 'template', 'taffy', 'compileHTML', 'compileJS', 'compileDeps'], function ($, io, artTemplate, Taffy, html, js, deps) {
		var CONST = {
				HEAD: {
					BODY_HIDDEN_SELECTOR: '#bodyHidden'
				},
				PAGE: {
					START_SCREEN_SELECTOR: '#auiStartScreen',
					NAV_SELECTOR: '#auiCplNav',


					CONSOLE_CLEAN_BTN_SELECTOR: '#clean',
					CONSOLE_LIST_SELECTOR: '[data-role=auiCplConsoleList]',


					EXECUTE_BTN_SELECTOR: '#execute',
					CONSOLE_AREA_SELECTOR: '#console',
					RESULT_AREA_SELECTOR: '#result',
					DEBUG_CLEAN_INPUT_SELECTOR: '#auiCplDebugCleanInputBtn',
					DEBUG_CLEAN_OUTPUT_SELECTOR: '#auiCplDebugCleanOutputBtn'
				},
				TEMP: {
					ERROR: 'auiErrorTemp',
					START: '<div class="aui-cpl-console-item start">开始编译##_PAGEMODULE##-##_PAGENAME##…</div>',
					SUCCESS: '<div class="aui-cpl-console-item success">成功编译##_PAGEMODULE##-##_PAGENAME##！</div>',
					VIEWER: 'auiViewerTemp'
				},
				COMPILE_TYPE: {
					PAGE_MODULE: '',
					VIEWER: 'viewer'
				},
				INDEX_LAYOUT: {
					PAGE_MODULE: '首页布局',
					PAGE_NAME: 'index.layout'
				},
				ERROR: {
					ID_EMPTY: 'AWEB 编译器0x001错误：编译ID为空。',
					CONTENT_EMPTY: 'AWEB 编译器0x002错误：编译内容为空。',
					JS_FORMAT: 'AWEB 编译器0x003错误：编译JS失败。',
					COMPILE: 'AWEB 编译器0x004错误：编译错误。'
				},
				DATA_MODEL: {
					STATIC: ['name', 'desp', 'pageName', 'pageModule', 'version', 'accumulator', 'uuid', 'css', 'eventAccumulator', 'url','customCode'],
					TAFFY: ['widget', 'event', 'response', 'request', 'structure', 'lifecycle', 'pageEdm', 'code', 'var']
				},
				REGEX: {
					AUI_PATH: /##_AUI_PATH##/g,
					AUI_PATH_REPLACEMENT: '.',

					VIEWER_TITLE: /##_AWEB_TITLE_##/g,
					VIEWER_CONTENT: /##_AWEB_CONTENT_##/g,

					PAGE_MODULE: /##_PAGEMODULE##/g,
					PAGE_NAME: /##_PAGENAME##/g
				}
			},
			Compiler = function (app, taffy, UglifyJS) {
				//override
				this.override(app, taffy, UglifyJS);

				//ui
				this.ui();


				//ready
				this.ready();
			},
			compiler,
			taffy = Taffy.taffy;


		if (!scope.sendMessageToJava && typeof scope.connectToJava === 'function') {
			var queue = [];
			scope.sendMessageToJava = function(data) {
				queue.push(data);
			};
			scope.connectToJava({
				request: '',
				onSuccess: function (response) {
					if (typeof response === 'string') {
						var arr, socket, identifier, sendMessageToJava;

						arr = response.split(',');
						socket = io(arr[0]);
						identifier = arr[1];

						sendMessageToJava = function (data) {
							var request, ack;

							data = data || {};
							request = {
								identify: identifier,
								request: data.request
							};
							ack = function (sign) {
								var args = [].slice.call(arguments, 1);

								if (sign && $.isFunction(data.onSuccess)) {
									data.onSuccess.apply(data, args);
								} else if (!sign && $.isFunction(data.onFailure)) {
									data.onFailure.apply(data, args);
								}
							};

							socket.emit('java_message', request, ack);
						};
						queue.forEach(function (req) {
							sendMessageToJava(req);
						});
						scope.sendMessageToJava = sendMessageToJava;
					}
				},
				onFailure: function () {
					external.alert('无法连接');
				}
			});
		}



		Compiler.fn = Compiler.prototype = {
			Constructor: Compiler,

			hasRemoveWelcomePage: false,
			viewerTemp: $('#' + CONST.TEMP.VIEWER).html().replace('\\/', '/'),

			id: '',
			pageName: '',
			pageModule: '',

			widgetList: [],
			widgetMap: {},

			edmList: [],
			edmMap: {},

			mode: 'compiler',
			version: 'AWOS 4.4.3.0_201801071200',
			debug: false,

			override: function (app, taffy, UglifyJS) {
				var context = this;

				app.taffy = taffy;
				app.getUID = function () {
					var sId = "",
						i = 24;
					for (; i--;) {
						sId += Math.floor(Math.random() * 16.0).toString(16).toUpperCase();
						if (i === 4) {
							sId += "-";
						}
					}
					return sId;
				};

				UglifyJS.parse = (function (parse) {
					return function (str) {
						var result;
						try {
							result = parse.apply(parse, arguments);
						} catch (e) {
							e.stack = str + '\n' + e.stack;
							context.error(CONST.ERROR.JS_FORMAT + '\n' + e.message, e.filename, e.line, e.post, e);
						}

						return result;
					}
				}(UglifyJS.parse));

				scope.internal = {
					compile: function () {
						context.compile.apply(context, arguments);
					},
					update: function () {
						context.update.apply(context, arguments);
					}
				};
			},

			compile: function (config, id) {
				var result;

				this.setID(id);

				if (config && id) {

					try {
						switch (config.pType) {
							case CONST.COMPILE_TYPE.VIEWER:


								result = this.compileIndexLayout(config);
								break;
							default:
								result = this.compilePageModule(config);
								break;
						}

						this.success(JSON.stringify(result).replace(CONST.REGEX.AUI_PATH, CONST.REGEX.AUI_PATH_REPLACEMENT));

					} catch (e) {
						if (typeof e === 'string') {
							this.error(CONST.ERROR.COMPILE + '\n' + e);
						} else {
							this.error(CONST.ERROR.COMPILE + '\n' + e.message, e.filename, e.line, e.post, e);
						}
					}

				} else if (!id) {
					this.error(CONST.ERROR.ID_EMPTY);
				} else if (!config) {
					this.error(CONST.ERROR.CONTENT_EMPTY);
				}

				return result;
			},
			compilePageModule: function (config) {
				var data;

				this.setPageModule(config.pageModule);
				this.setPageName(config.pageName + '（' + config.desp + '）');

				this.start();


				config.widget = this.combineWidget(config.widget);

				data = this.resumeDataModel(config);

				return {
					id: this.getID(),
					html: html(data.uuid, data.widget, data.structure),
					js: js(data, this.getWidgetList().length),
					deps: deps(data.widget, data.structure)
				};

			},
			compileIndexLayout: function (viewerConfig) {
				var config, data;

				this.setPageModule(CONST.INDEX_LAYOUT.PAGE_MODULE);
				this.setPageName(CONST.INDEX_LAYOUT.PAGE_NAME);

				this.start();

				config = viewerConfig.frame;
				config.uuid = config.structure[0].widgetID;
				config.url = viewerConfig.url;
				config.code = viewerConfig.code || config.code;
                config.customCode=viewerConfig.customCode;

				config.pageModule = CONST.INDEX_LAYOUT.PAGE_MODULE;
				config.pageName = CONST.INDEX_LAYOUT.PAGE_NAME;

				/*config.widget.push(viewerConfig);*/

				config.widget = this.combineWidget(config.widget.concat(viewerConfig));


				data = this.resumeDataModel(config);

				return {
					id: this.getID(),
					html: (viewerConfig.content || this.viewerTemp)
						.replace(CONST.REGEX.VIEWER_TITLE, (viewerConfig.name || viewerConfig.desp))
						.replace(CONST.REGEX.VIEWER_CONTENT, html(config.root[0], data.widget, data.structure)),
					js: js(data, this.getWidgetList().length, viewerConfig),
					deps: deps(data.widget, data.structure)
				};
			},

			ui: function () {
				var context = this,
					$execute = $(CONST.PAGE.EXECUTE_BTN_SELECTOR),
					$console = $(CONST.PAGE.CONSOLE_AREA_SELECTOR),
					$result = $(CONST.PAGE.RESULT_AREA_SELECTOR);

				scope.onerror = function () {
					context.error.apply(context, arguments);
				};
				scope.oncontextmenu = function () {
					return false;
				};

				this.$bodyHiddenStyle = $(CONST.HEAD.BODY_HIDDEN_SELECTOR, 'head');
				this.$welcomePage = $(CONST.PAGE.START_SCREEN_SELECTOR);
				this.$consoleList = $(CONST.PAGE.CONSOLE_LIST_SELECTOR);

				$(CONST.PAGE.NAV_SELECTOR).on('click.ui', function (e) {
					var $target = $(e.target),
						$this = $(this),
						activeClass = 'active';

					if ($target.is('li') && !$target.hasClass(activeClass)) {
						$target.siblings().removeClass(activeClass);
						$target.addClass(activeClass);

						$this.next()
							.children().removeClass(activeClass)
							.eq($target.index()).addClass(activeClass);
					}
				});

				$(CONST.PAGE.CONSOLE_CLEAN_BTN_SELECTOR).on({
					'click.ui': function () {
						context.$consoleList.empty();
					}
				});

				$(CONST.PAGE.DEBUG_CLEAN_INPUT_SELECTOR).on({
					'click.ui': function () {
						$console.val('');
					}
				});

				$(CONST.PAGE.DEBUG_CLEAN_OUTPUT_SELECTOR).on({
					'click.ui': function () {
						$result.val('');
					}
				});


				$execute.click(function () {
					var str = $console.val(),
						result;

					if (str) {
						result = context.compile(JSON.parse(str), app.getUID());

						if (result) {
							$result.val(JSON.stringify(result));
						}
					}
				});
			},

			setPageName: function (pageName) {
				this.pageName = pageName;
			},
			getPageName: function () {
				return this.pageName;
			},

			setPageModule: function (pageModule) {
				this.pageModule = pageModule;
			},
			getPageModule: function () {
				return this.pageModule;
			},

			setID: function (id) {
				this.id = id;
			},
			getID: function () {
				return this.id;
			},

			setEdmList: function (edmList) {
				this.edmList = edmList;
			},
			update: function (widgetArr, edmArr) {
				var i, item,
					href, index,
					widgetList = this.widgetList,
					widgetMap = this.widgetMap;

				if (widgetArr && widgetArr.length) {
					for (i = widgetArr.length; item = widgetArr[--i];) {
						if ((href = item.href) && href.indexOf('viewer')) {
							index = widgetMap[href];

							if (index >= 0) {
								widgetList[index] = item;
							} else {
								widgetMap[href] = widgetList.length;
								widgetList.push(item);
							}
						}
					}
				}

				if (edmArr && edmArr.length) {
					this.setEdmList(edmArr);
				}
			},


			combineWidget: function (widgetList) {
				var ret = [].concat(this.getWidgetList()),

					widgetMap = this.getWidgetMap(),
					len, i, item;

				widgetList = widgetList || [];

				for (i = -1; item = widgetList[++i];) {
					if (widgetMap[item.href] === undefined) {
						ret.push(item);
					}
				}

				return ret;
			},
			getWidgetList: function () {
				return this.widgetList;
			},
			getWidgetMap: function () {
				return this.widgetMap;
			},

			resumeDataModel: function (config) {
				var staticList = CONST.DATA_MODEL.STATIC,
					taffyList = CONST.DATA_MODEL.TAFFY,
					i, prop,
					ret = {};

				for (i = staticList.length; prop = staticList[--i];) {
					config[prop] && (ret[prop] = config[prop]);
				}

				for (i = taffyList.length; prop = taffyList[--i];) {
					config[prop] && (ret[prop] = taffy(config[prop]));
				}

				return ret;
			},

			sendMessage: function (obj) {
				scope.sendMessageToJava({
					request: JSON.stringify({
						key: 'response',
						value: obj
					})
				})
			},
			ready: function () {
				scope.sendMessageToJava({
					request: JSON.stringify({
						key: 'ready',
						value: 'true'
					})
				});

				if (!this.hasRemoveWelcomePage && this.$bodyHiddenStyle && this.$welcomePage) {
					this.$bodyHiddenStyle.remove();
					this.$welcomePage.remove();
					this.hasRemoveWelcomePage = true;
				}
			},
			start: function () {
				var $list = this.$consoleList;

				$list.prepend(
					CONST.TEMP.START
						.replace(CONST.REGEX.PAGE_MODULE, this.getPageModule())
						.replace(CONST.REGEX.PAGE_NAME, this.getPageName())
				);

			},
			success: function (result) {
				var $list = this.$consoleList;

				$list.prepend(
					CONST.TEMP.SUCCESS
						.replace(CONST.REGEX.PAGE_MODULE, this.getPageModule())
						.replace(CONST.REGEX.PAGE_NAME, this.getPageName())
				);

				this.sendMessage(result);
			},
			error: function (errorMsg, scriptURI, lineNumber, columnNumber, errorObj) {
				var $list = this.$consoleList,
					str, obj;

				this.ready();

				this.sendMessage({
					id: this.getID(),
					errorMsg: ['页面模型', this.getPageModule(), this.getPageName()].join('   ') + '配置有误。'
				});
				//console.log(errorObj && errorObj.stack || errorMsg);

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
					errorObj: errorObj,
					pageModule: this.getPageModule(),
					pageName: this.getPageName()
				};

				$list.prepend(artTemplate(CONST.TEMP.ERROR, obj));

			}
		};

		scope.auiApp = compiler = new Compiler(scope.app || (scope.app = {}), taffy, scope.UglifyJS);
	});
})(this);