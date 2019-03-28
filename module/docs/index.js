define(["jquery", "template", "docs"/*"index"*/], function ($, template, doc /*global*/) {
    /* var AUI=global.AUI;*/
    var dataModel = window.parent.M;
    return {
        load: function ($el, scope, handler) {

            var docs = {
                    children: dataModel.get('docsNav')
                },
                html = template('docsIndexTemp', docs),
                nav = template('docsIndexNav', docs),

                $nav,
                $ctn;


            $nav = $('#auiDocsIndexNav', $el);
            $nav.append(nav);

            $ctn = $('#docsIndexCtn', $el).append(html);
            $ctn = $ctn.parent();


            app.pageSearch($('#auiDocsPageSearch', $el), $('#auiDocsPageSearchList', $el), $ctn, handler.id);

            this.delegateEvents({
                'click': function (e) {
                    var $target = $(e.target || event.srcElement),
                        href = $target.attr('data-file');

                    href && doc.openDocs(href, $target.text());
                },
                'click #auiDocsIndexNav': function (e) {
                    var $target = $(e.target || event.srcElement),
                        href;

                    if ($target.is('a')) {
                        if (href = $target.attr('data-href')) {
                            app.scrollTop($ctn, $ctn.find('[data-href="' + href + '"]'));
                        }
                    }
                },
                'click #auiDocsPageSearchList': function (e) {
                    var $target = $(e.target || event.srcElement).closest('[data-search-id]'),
                        id;

                    if (id = $target.attr('data-search-id')) {
                        app.scrollTop($ctn, $ctn.find('[data-search-id="' + id + '"]'), undefined, 20);
                    }
                }
            });

            //console.log('load',handler.cacheId);
        },
        unload: function ($el, scope, handler) {
            //console.log('unload',handler.cacheId);
        },
        pause: function ($el, scope, handler) {
            //console.log('pause',handler.cacheId);
        },
        resume: function ($el, scope, handler) {
            //console.log('resume',handler.cacheId);
        }
    };
});