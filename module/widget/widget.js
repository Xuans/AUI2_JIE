define(["jquery", "template","docs"/*, "index"*/], function ($, template,docs/*, global*/) {
	//var /*AUI = global.AUI,*/
		// CONST = global.CONST;
	var dataModel=window.parent.M;

	return {
		load: function ($el, scope, handler) {
			var widgets = dataModel.get('widgetMap')[''],
				html = template('widgetIndexTemp', widgets),
				nav=template('widgetIndexNav',widgets),
				$ctn,$oldtarget;

			$('[data-role="wdNavPanel"]', $el).append(nav);
			$ctn = $('#widgetIndexCtn', $el).append(html);
			$ctn = $ctn.parent();

			app.pageSearch($('#auiDocsPageSearch',$el),$('#auiDocsPageSearchList',$el),$('#widgetIndexCtn', $el));

			this.delegateEvents({
				'click #widgetIndexCtn': function (e) {
					var $target = $(e.target || event.srcElement).closest('[data-widget-href]'),
						href = $target.attr('data-widget-href');
                
					if (href) {
						docs.openWidgetDetails(href,$target.attr('title'));
					}
				},
				'click [data-role="wdNavPanel"]':function(e) {
                    var $target = $(e.target || event.srcElement),
                        href;

                    if ($target.is('a')) {
                        if ($target.attr('data-href')!==($oldtarget && $oldtarget.attr('data-href'))) {
                            $target.parent('li').addClass('active');
                            $oldtarget && $oldtarget.parent('li').removeClass('active');
                            $oldtarget = $target;
                         }
                        if (href = $target.attr('data-href')) {
                            app.scrollTop($ctn, $ctn.find('[data-widget-href="' + href + '"]'));
                        }
                    }
                },
				'click #auiDocsPageSearchList':function(e){
					var $target=$(e.target||event.srcElement).closest('[data-search-id]'),
						id;

					if(id=$target.attr('data-search-id')){
						app.scrollTop($ctn, $ctn.find('[data-search-id="' + id + '"]'),undefined,20);
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