define(['jquery', /*'index',*/ 'template','UI.ImageViewer'], function ($, /*global,*/ template,ImageViewer) {
	var /*AUI = global.AUI,*/
		// CONST = global.CONST,
		// baseConfigInitInstance = base.baseConfigInitInstance,
		// getCleanedOption = base.getCleanedOption,
        dataModel=window.parent.M,

		imageViewer;

	var

		render = function (context,content, $context) {
			var html,
				contentStirng,
				contentID, tocContainerID,
				$content, $tocContainer;

			if (!content.formatTime) {
				content.lastModifiedTime = formatTime(content.lastModifiedTime);
				content.formatTime=true;
			}

			content.uid = app.getUID();

			html = template('tsDetailsContentTemp', content);

			$context.append(html);

			if ((contentStirng = content.content) && contentStirng.length) {
				$content = $context.find('[data-role=content]');
				$tocContainer = $context.find('[data-role=tsDetailsNavPanel]');

				contentID = app.getUID();
				tocContainerID = app.getUID();

				$content.attr('id', contentID);
				$tocContainer.attr('id', tocContainerID);

				contentStirng = contentStirng.replace(/&amp;/gi, '&').replace(/&gt;/ig, '>').replace(/&lt;/ig, '<').replace(/&quot;/ig, '"');


				testEditormdView = editormd.markdownToHTML(contentID, {
					markdown: contentStirng,//+ "\r\n" + $("#append-test").text(),
					htmlDecode: true,       // 开启 HTML 标签解析，为了安全性，默认不开启
					//htmlDecode      : "style,script,iframe",  // you can filter tags decode
					//toc             : false,
					tocm: true,    // Using [TOCM]
					tocContainer: "#" + tocContainerID, // 自定义 ToC 容器层
					//gfm             : false,
					//tocDropdown     : true,
					// markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
					emoji: true,
					taskList: true,
					tex: true,  // 默认不解析
					flowChart: true,  // 默认不解析
					sequenceDiagram: true  // 默认不解析
				});


				$content.find('table').addClass('table table-bordered').css('width','100%');

				imageViewer=new ImageViewer($context[0]);

				app.pageSearch($('[data-id="auiDocsPageSearch"]',$context),$('[data-id="auiDocsPageSearchList"]',$context),$content,content.id);

				context.delegateEvents({
					'click [data-id="auiDocsPageSearchList"]':function(e){
						var $target=$(e.target||event.srcElement).closest('[data-search-id]'),
							id;

						if(id=$target.attr('data-search-id')){
							app.scrollTop($content, $content.find('[data-search-id="' + id + '"]'),undefined,20);
						}
					}
				})
			}
		}, formatTime = function (str) {

			var time = new Date(str * 1000);

			time.setMonth(time.getMonth());

			var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
				value = {
					year: time.getFullYear(),
					month: time.getMonth() + 1,
					date: time.getDate(),
					hour: time.getHours(),
					minute: time.getMinutes(),
					second: time.getSeconds(),
					day: week[time.getDay()]
				};

			['month', 'date', 'hour', 'minute', 'second'].map(function (item) {
				if ((value[item] + '').length === 1) {
					value[item] = '0' + value[item];
				}
			});

			return template('tsTimeFormatTemp', value);
		};

	return {
		load: function ($el, scope, handler) {
			var context = this,
				tsFileName = handler.id,
				content;

			if (dataModel.get('content')&& dataModel.get('content').TAFFY && (content = dataModel.get('content')({file: tsFileName}).first())) {
				render(context,content, $el);
			} else {
				external.getFileContent('./techSupport/file/' + tsFileName + '.json', function (response) {
					content = JSON.parse($.trim(response));

					render(context,content, $el);
				}, function () {
					$el.append('<div class="alert alert-error">获取帮助文档"' + $('[data-href="' + handler.cacheId + '"]').children('a').text() + '"信息失败。</div>');
				});
			}

			$el.addClass('ts-details-ctn');

		}, unload: function ($el, scope, handler) {

		}, pause: function ($el, scope, handler) {
		}, resume: function ($el, scope, handler) {
		}
	};
});