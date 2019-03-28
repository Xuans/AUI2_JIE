define([ "jquery","template",'docs'/*"index"*/], function($, template,docs/* global*/) {
   /* var AUI=global.AUI;*/

    return {
        load : function($el, scope, handler) {

            this.delegateEvents({
                'keyup.docUI #auiDocsSearch':function(e) {
                    app.globalSearch($(this))
                },
                'blur.docUI #auiDocsSearch': function () {
                    app.globalSearch($(this),true);
                },
                'click.result #auiDocsSearchPanel':function(e) {
                    var $e = $(e.target || window.event.srcElement),
                        href, title;


                    if (($e = $e.closest('.docs-search-ctn')).length) {
                        title = $e.attr('data-name');

                        if (href = $e.attr('data-href')) {
                            docs.openWidgetDetails(href, title);
                        } else if (href = $e.attr('data-file')) {
                            docs.openDocs(href, title);
                        }

                    }
                },
                'click.history [data-role="historyList"]':function (e) {
                    var $e = $(e.target || window.event.srcElement),
                        href, title;


                    if (($e = $e.closest('.docs-history-item')).length) {
                        title = $e.attr('data-name');

                        if (href = $e.attr('data-href')) {
                            docs.openWidgetDetails(href, title);
                        } else if (href = $e.attr('data-file')) {
                            docs.openDocs(href, title);
                        }

                    }
                }
            });

        },
	    unload : function($el,scope,handler) {
		    console.log('unload',handler.cacheId);
        },
        pause : function($el, scope, handler) {
	        console.log('pause',handler.cacheId);
        },
        resume : function($el, scope, handler) {
            var history = app.getData('history',false),title,file,
                historys=[],$hisCtn = $('[data-role="historyList"] ul',$el);
            if(history){
                history =  JSON.parse(history);
                for(title in history){
                    if(history[title].indexOf('_FILE')!==-1){
                        file = history[title].replace('_FILE','');
                        historys.push('<li class="docs-history-item" data-file = "'+ file +'" data-name = "'+title+'">'+title+'</li>')
                    }else{
                        historys.push('<li class="docs-history-item" data-href = "'+ history[title] +'" data-name = "'+title+'">'+title+'</li>')
                    }

                }
                $hisCtn.empty().append(historys.reverse().join(''));
            }
        }
    };
});