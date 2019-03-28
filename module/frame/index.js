define(["jquery"], function ($) {
	'use strict';

	var open=function(href,title){
		var uid,i,length;

		if (href && href.length > 65536) {
			uid = 0;

			for (i = -1, length = href.length; ++i < length;) {
				uid += href[i].charCodeAt();
			}
		} else {
			uid = href.replace(/[^\w]/g, '');
		}

		app.open({
			title: title,
			page: 'frame',
			id: uid,
			status: true,
			content:{
				href: href
			}
		});
	};

	return {
		load: function ($el, scope, handler) {
			var href,
				$frame;

			$.extend(true, scope, app.domain.get('page'));

			href = scope.href;

			$el.children().children('[data-role="docsFrame"]')
				.attr('src', href)
				.on('load', function () {
					var frames = window.frames,
						frame, i,
						location, url;

					for (i = 0; frame = frames[i]; ++i) {
						location = frame.location||frame.window&&frame.window.location || frame.document && frame.document.location;

						try{
							if(location && location.host){

								url = location.host + location.pathname;
								if (href.indexOf(url) !== -1) {
									app.router.tab.setTitle(handler.uid, frame.document.title);
									break;
								}

								$(frame.window).on('click','a',function(){
									var $this=$(this);
									open($this.attr('href'),$this.text());
								});


								frame.window.open=open;

							}
						}catch(e){

						}

					}
				});

		},
		unload: function ($el, scope, handler) {
		},
		pause: function ($el, scope, handler) {
		},
		resume: function ($el, scope, handler) {
		}
	};
});