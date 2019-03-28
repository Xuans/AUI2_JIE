/**
 /**
 * @author lijiancheng@agree.com.cn
 * @date    20170504
 * @desp    文档模块js
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "index", "const", "template", "report", 'htmlclean'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, AUI, CONST, template, report) {
        "use strict";

        var
            DOC_MAIN_PAGE_SELECTOR = '#spa-page-main',
            GLOBAL_SEARCH_SELECTOR = '#auiDocsSearch',
            SEARCH_PANEL_SELECTOR = '#auiDocsSearchPanel',
            WID_API_NAME = ' 组件ID',

            COMPATIBILITY_TYPE = {
                modernBrowser: '现代浏览器',
                ie8: 'IE8+',
                ie9: 'IE9+',
                ie10: 'IE10+'
            },

            LIFECYCLE_STATUS = {
                load: '<span class="type dev-docs-color1">初始或轮询操作</span>',
                pause: '<span class="type dev-docs-color4">切出操作</span>',
                resume: '<span class="type dev-docs-color7">切入操作</span>',
                unload: '<span class="type dev-docs-color11">销毁操作</span>'
            },

            SEARCH_LENGTH = 100,
            SHOW_DOC_PATH_REGEX = /http:\/\/192\.168\.0\.14\/showdoc\/index\.php\/26\?page_id=(\d+)/,
            SHOW_DOC_PATH_REGEX_2 = /http:\/\/www.awebide.com\:48000\/showdoc\/index\.php\/26\?page_id=(\d+)/,
            currentPage = {},
            firstPreLoad = true,
            //init app map
            temp, pageSearchResult, globalSearchResult,
            transformChar = function (str) {
                return str
                    .toLowerCase()
                    .replace(/\(/g, '&lang;')
                    .replace(/\)/g, '&rang;');
            },
            openPJThemeAndViewerPage = function (href, title) {
                var pageId = href.replace(/\./g, '-');

                app.open({
                    status: true,
                    title: title,
                    page: 'widget#widgetDetails',
                    id: pageId,
                    fixed: true
                });
                currentPage.pageId = pageId;
            },
            openDocsPage = function () {
                app.open({
                    id: 'docs',
                    page: 'docs',
                    title: '文档',
                    status: true,
                    fixed: true
                });
            },
            openSearchPage,
            dataModel = window.parent.M,
            projectName = window.parent.auiApp.io.projectName,
            Docs = {
                init: function () {

                    //override
                    /* AUI.openDocs = function (id, title) {
                     var data = app.getData('history', false), pageId;
                     data = data ? JSON.parse(data) : {};
                     pageId = id;
                     app.open({
                     title: title,
                     page: 'docs#docsDetails',
                     id: pageId,
                     status: true
                     });

                     if (!data[title]) {
                     data[title] = id + '_FILE';
                     }
                     app.setData('history', data, false, 2);
                     currentPage.pageId = pageId;
                     app.performance.longDelay(function () {
                     report && report.docPageListener(pageId);
                     });
                     };
                     AUI.openWidgetDetails = function (href, title) {
                     var data = app.getData('history', false), pageId;

                     data = data ? JSON.parse(data) : {};
                     pageId = href.replace(/\./g, '-');

                     app.open({
                     status: true,
                     title: title,
                     page: 'widget#widgetDetails',
                     id: pageId
                     });

                     if (!data[title]) {
                     data[title] = href;
                     }
                     app.setData('history', data, false, 2);
                     currentPage.pageId = pageId;

                     app.performance.longDelay(function () {
                     report && report.docPageListener(pageId);
                     });
                     };
                     AUI.scrollTo = function (domID, has) {
                     var $ctn = $(DOC_MAIN_PAGE_SELECTOR),
                     $page = $ctn.children('#' + domID).find('[data-role="wdCttPanel"]');

                     if (has[0].indexOf('_WID##') !== -1) {
                     has = 'methods_.' + WID_API_NAME;
                     } else if (has.indexOf('app.') === -1) {
                     has = 'methods_' + has;
                     }
                     if ($page.length) {
                     app.scrollTop($page, $page.find('[data-href="' + has + '"]'));
                     }
                     };*/

                    //listener
                    $(window).on({
                        'contextmenu.ui': function () {
                            return false;
                        },
                        'click.ui': function (e) {
                            var $target = $(e.target || event.srcElement),
                                href,
                                id, doc,
                                uid, i, letter, length;

                            if ($target.is('a') && (href = $target.attr('href')) && !href.match(/^#/)) {
                                if ((id = href.match(SHOW_DOC_PATH_REGEX)) || (id = href.match(SHOW_DOC_PATH_REGEX_2))) {
                                    doc = dataModel.get('docs')({id: parseInt(id[1], 10)}).first();
                                }

                                if (doc) {
                                    Document.openDocs(doc.id, doc.id + '.' + doc.title);
                                } else {
                                    if (href.length > 65536) {
                                        uid = 0;

                                        for (i = -1, length = href.length; ++i < length;) {
                                            uid += href[i].charCodeAt();
                                        }
                                    } else {
                                        uid = href.replace(/[^\w]/g, '');
                                    }

                                    app.domain.exports('page', {
                                        href: href
                                    });
                                    app.open({
                                        title: $target.text(),
                                        page: 'frame',
                                        id: uid,
                                        status: true
                                    });
                                }

                                return false;

                            } else {

                                return true;
                            }
                        }
                    });

                    AUI.hideWelcomeScreen();


                },
                openDocs: function (id, title) {
                    var data = app.getData('history', false), pageId;
                    data = data ? JSON.parse(data) : {};
                    pageId = id;
                    app.open({
                        title: title,
                        page: 'docs#docsDetails',
                        id: pageId,
                        status: true
                    });

                    if (!data[title]) {
                        data[title] = id + '_FILE';
                    }
                    app.setData('history', data, false, 2);
                    currentPage.pageId = pageId;
                    app.performance.longDelay(function () {
                        report && report.docPageListener(pageId);
                    });
                },
                openWidgetDetails: function (href, title) {
                    var data = app.getData('history', false), pageId;

                    data = data ? JSON.parse(data) : {};
                    pageId = href.replace(/\./g, '-');

                    app.open({
                        status: true,
                        title: title,
                        page: 'widget#widgetDetails',
                        id: pageId
                    });

                    if (!data[title]) {
                        data[title] = href;
                    }
                    app.setData('history', data, false, 2);
                    currentPage.pageId = pageId;

                    app.performance.longDelay(function () {
                        report && report.docPageListener(pageId);
                    });
                },
                scrollTo: function (domID, has) {
                    var $ctn = $(DOC_MAIN_PAGE_SELECTOR),
                        $page = $ctn.children('#' + domID).find('[data-role="wdCttPanel"]');

                    if (has[0].indexOf('_WID##') !== -1) {
                        has = 'methods_.' + WID_API_NAME;
                    } else if (has.indexOf('app.') === -1) {
                        has = 'methods_' + has;
                    }
                    if ($page.length) {
                        app.scrollTop($page, $page.find('[data-href="' + has + '"]'));
                    }
                },
                openDocsTab: function (href, title, has) {
                    var context = this,
                        frames = window.frames, frame, i, docWindow, name, data, domID;
                    if (href) {
                        frames = $("iframe");
                        for (i = -1; frame = frames[++i];) {
                            if (frame && ~frame.src.indexOf(CONST.MODE.DOCS)) {
                                docWindow = frame.contentWindow;
                            }
                        }

                        if ((data = dataModel.get('menu')({href: href}).get()) && data.length) {
                            name = data[0].name;
                        }
                        name = title || name || '无标题页面';

                        this.openWidgetDetails(href, name);

                        if (has) {
                            app.performance.longDelay(function () {
                                domID = href.replace(/\./g, '-');
                                context.scrollTo(domID, has);
                            });
                        }

                        // AUI.editorLayout.view.setActive(CONST.PAGE.SIDEBAR.CONFIGURE.DEVELOP_DOC_CTN);
                    }
                }

            },
            preLoadDocMenu,
            preLoadWidgets;


        temp = CONST.PAGE.NAV;
        temp.DOCS_BTN = 'auiNavDocsBtn';
        temp.WIDGET_BTN = 'auiNavWidgetBtn';
        temp.BACK_TO_APP_BTN = 'auiNavBackToAppBtn';
        temp.SEARCH = 'auiDocsSearch';

        CONST.PAGE.SEARCH_PANEL_SELECTOR = '#auiDocsSearchPanel';

        CONST.MODE.APP = 'app';

        /* AUI.data.docs = app.taffy([]);
         AUI.data.author = app.taffy([]);
         AUI.data.menu = app.taffy([]);*/

        dataModel.set('author',app.taffy([]));

        openSearchPage = function (dtd) {
            app.open({
                id: 'search',
                page: 'search',
                title: '搜索',
                status: true,
                fixed: true
            });

            app.performance.longDelay(dtd.resolve());

            return dtd.promise()
        };
        preLoadDocMenu = function (dtd) {

            external.getFileContent('./techSupport/techSupportMenu.json', function (response) {
                var index = JSON.parse(response.trim()),
                    docs = [],
                    docsMap = {},
                    i, item, children,
                    j, child,
                    sortLevel1 = function (a, b) {

                        a.level = b.level = 1;

                        return a.order - b.order;
                    }, sortLevel2 = function (a, b) {
                        a.level = b.level = 2;

                        return a.order - b.order;
                    };


                index = index.sort(sortLevel1);

                i = -1;
                while (item = index[++i]) {
                    if ((children = item.children) && children.length) {
                        docs = docs.concat(item.children = children.sort(sortLevel2));
                    }
                }

                i = -1;
                while (item = docs[++i]) {
                    if ((children = item.tags) && children.length) {
                        j = -1;
                        while (child = children[++j]) {
                            if (!docsMap[child]) {
                                docsMap[child] = [];
                            }

                            docsMap[child].push(item);
                        }
                    }
                }


                /*AUI.data.docsNav=index;
                 AUI.data.docs = app.taffy(docs);
                 AUI.data.docsMap = docsMap;*/

                dataModel.set('docsNav', index);
                dataModel.set('docs', app.taffy(docs));
                dataModel.set('docsMap', docsMap);

                app.performance.longDelay(function () {
                    dtd.resolve();
                })
            });
            openDocsPage();
            return dtd.promise();
        };
        preLoadWidgets = function (dtd) {

            if (dataModel.get('menu')().get().length) {
                var menuMap = {},
                    menu = dataModel.get('menu'),
                    menuArr;

             //   menu.insert(dataModel.getCopy('menu'));
                menuArr = menu().get().sort(function (a, b) {

                    if (a.index && b.index) {
                        return a.index - b.index;
                    } else if (a.index) {
                        return 1;
                    } else {
                        return -1;
                    }

                });

                menuArr.map(function (widget) {
                    var item, parentHref, level, parent;

                    if (widget && widget.href) {
                        parentHref = widget.href.split('.');
                        level = parentHref.length;

                        parentHref = parentHref.length ? parentHref.splice(0, parentHref.length - 1).join('.') : '';

                        if (!(item = menuMap[widget.href])) {
                            item = menuMap[widget.href] = widget;
                            item.cWidgets = [];
                        } else if (!item.name) {
                            item = menuMap[widget.href] = $.extend(true, item, widget);
                        }

                        if (!(parent = menuMap[parentHref])) {
                            parent = menuMap[parentHref] = {};
                            parent.cWidgets = [];
                        }
                        item.level = level;
                        parent.cWidgets.push(item);
                        menu({href: widget.href}).update({content: transformChar(JSON.stringify(widget))});
                    }
                });

                if (window.parent.auiApp.io && window.parent.auiApp.io.projectName) {
                    var appt, cWidgets = [], projectName = window.parent.auiApp.io.projectName;
                    dataModel.set('projectName', projectName);


                    dataModel.set('projectViewerPath', CONST.CONFIG_PATH[window.parent.auiApp.FILE_TYPE].indexLayout.replace('@projectName',projectName).replace(/@projectName/, projectName));

                    /* AUI.data.projectName = projectName;
                     AUI.data.projectViewerPath = '/@projectName/pageModule/index.layout'.replace(/@projectName/, projectName);*/

                    cWidgets = [];
                    appt = {
                        "version": 51000,
                        "belongTo": "platform",
                        "type": "app",
                        "pType": "",
                        "href": "app",
                        "name": "项目“" + projectName + "”配置",
                        "index": -1,
                        cWidgets: cWidgets,
                        level: 1
                    };

                    menuMap[appt.pType] = menuMap[appt.pType] || (menuMap[appt.pType] = {cWidgets: []});
                    menuMap[appt.pType].cWidgets.unshift(appt);
                    /*    cWidgets.push(response);

                     menu.insert(response);
                     menu.insert({
                     href:'theme.app',
                     name:'项目'
                     });*/
                    //内容、项目技术组件、项目业务组件


                    external.getFile(dataModel.get('projectViewerPath'), function (vresponse) {
                       // var WA = window.parent.A;
                        vresponse = JSON.parse(vresponse);
                        vresponse.cWidgets = [];
                        vresponse.pType = "app";
                        vresponse.type = projectName + 'Viewer';
                        vresponse.href = 'viewer.app.' + vresponse.type;
                        vresponse.name = '项目首页布局';
                        vresponse.appInterfaces = dataModel.get('awebApi') && dataModel.get('awebApi').appInterfaces;
                        vresponse.appInterfacesConst = dataModel.get('awebApi') && dataModel.get('awebApi').appInterfacesConst;
                        vresponse.content = transformChar(JSON.stringify(vresponse));
                        vresponse.theme = dataModel.get('fresher').theme;
                        vresponse.variables = dataModel.get('fresher').variables;
                        cWidgets.push(vresponse);

                        if(!menu({href:vresponse.href}).first()){
                            menu.insert(vresponse);
                        }else{
                            var t = JSON.parse(JSON.stringify(vresponse));
                            delete t.___id;
                            delete t.___s;
                            delete t.href;

                            menu({href:vresponse.href}).update(t);
                        }

                        if(!menu({href:'viewer.app'}).first()){
                            menu.insert({
                                href: 'viewer.app',
                                name: '项目'
                            });

                        }




                        openPJThemeAndViewerPage(vresponse.href, vresponse.name);

                        app.performance.longDelay(function () {
                            dtd.resolve();
                        });
                    });
                } else {
                    dataModel.set('projectName', '');
                    /* AUI.data.projectName = '';*/
                }

                dataModel.set('widgetMap', menuMap);

                /*AUI.data.widgetMap = menuMap;*/
            }
            return dtd.promise();
        };

        var dtd = $.Deferred();
        $.when(openSearchPage(dtd))
            .done(preLoadDocMenu(dtd))
            .done(function () {
                app.performance.longDelay(preLoadWidgets(dtd))
            });

        //init data model
        external.getFileContent('./techSupport/author.json', function (response) {


            dataModel.get('author').insert(response);
            /* AUI.data.author.insert(response);*/
        });

        external.getProjectFile = function (path, successCallback) {

            /*var data = AUI.data.menu({href: path}).first();*/
            var data;
            external.getFile(dataModel.get('projectViewerPath'), function (vresponse) {
                // var WA = window.parent.A;
                vresponse = JSON.parse(vresponse);
                vresponse.cWidgets = [];
                vresponse.pType = "app";
                vresponse.type = projectName + 'Viewer';
                vresponse.href = 'viewer.app.' + vresponse.type;
                vresponse.name = '项目首页布局';
                vresponse.appInterfaces = dataModel.get('awebApi') && dataModel.get('awebApi').appInterfaces;
                vresponse.appInterfacesConst = dataModel.get('awebApi') && dataModel.get('awebApi').appInterfacesConst;
                vresponse.content = transformChar(JSON.stringify(vresponse));
                vresponse.theme = dataModel.get('fresher').theme;
                vresponse.variables = dataModel.get('fresher').variables;

               // var data = dataModel.get('menu')({href: path}).first();

                if (vresponse) {
                    data = JSON.parse(JSON.stringify(vresponse));

                    successCallback(data);
                }

            })


        };

        app.pageSearch = function ($search, $list, $ctn, pageId) {
            var searchHandler, time;

            $search.off('blur.pageSearch').on({
                'keyup.pageSearch': function () {
                    var val = this.value,
                        globalRegex, regex,
                        text,
                        obj,
                        result = [];

                    if (val && (val = val.trim())) {

                        app.performance.longDelay(function () {

                            time = new Date();
                            val = val && val.trim().toLowerCase();
                            regex = new RegExp('(' + val + ')', 'i');
                            globalRegex = new RegExp(val, 'gi');

                            $ctn.html($ctn.html().replace(/<em data-search-id="[^"]+">([^<]+)<\/em>/g, '$1'));

                            Array.prototype.forEach.call($ctn.find('*'), function (elem, index) {
                                if (!elem.children.length && (text = elem.innerText) && text.match(globalRegex)) {
                                    elem.innerHTML = text.replace(globalRegex, function (matchStr, offset, text) {

                                        obj = {
                                            uid: [index, offset].join('_'),
                                            title: text.substring(Math.max(0, offset - 25), 50)
                                        };
                                        obj.text = obj.title.replace(regex, '<b>$1</b>');
                                        result.push(obj);

                                        return '<em data-search-id="' + obj.uid + '">' + matchStr + '</em>';
                                    });
                                }
                            });

                            pageSearchResult = {
                                "version": version,
                                "keyword": val,
                                "num": result.length,
                                "type": 'developmentDetail',
                                "href": window.location.hash,
                                "pageId": pageId
                            };


                            $list.empty().append(template('searchPageTemp', {
                                result: result,
                                time: new Date() - time
                            }));
                        })


                    } else {
                        $ctn.html($ctn.html().replace(/<em data-search-id="[^"]+">([^<]+)<\/em>/g, '$1'));
                        $list.empty();
                    }
                },
                'blur.pageSearch': function (e) {
                    window.parent.A.report && window.parent.A.report(pageSearchResult);
                }
            });

        };

        app.globalSearch = function ($this, isBlur, pageId) {
            var val = $this.val(),
                result = {
                    widgets: [],
                    docs: []
                },
                widgets = result.widgets,
                docs = result.docs,
                time = new Date(),
                keys,
                i, key,
                searchHandler,
                $searchPanel = $(SEARCH_PANEL_SELECTOR),
                transformSearchStr = function (str) {
                    var range = 200,
                        index = str.indexOf('</em>', range) + 5;

                    index = Math.max(index, range);

                    return str
                        .substring(index - range, index + range);
                };

            searchHandler && window.clearTimeout(searchHandler);
            searchHandler = null;
            if (val) {
                keys = val.toLowerCase().split(' ');

                if (!keys[keys.length - 1]) {
                    keys.splice(keys.length - 1, 1);
                }

                if (keys.length) {

                    searchHandler = window.setTimeout(function () {

                        for (i = keys.length; ~--i;) {
                            if (key = keys[i]) {
                                keys[i] = new RegExp('(' + key + ')', 'ig');
                            } else {
                                keys.splice(i, 1);
                            }

                        }

                        /*AUI.data.menu()*/
                        dataModel.get('menu')().each(function (widget) {
                            var matchTimes = 0,
                                index,
                                isViewer = false,
                                str = widget.name + widget.details + widget.type,
                                contentStr = widget.content;

                            if (widget.href && widget.href.indexOf('viewer') >= 0) {
                                isViewer = true;
                                str = widget.content;
                            }
                            if (str) {
                                for (i = keys.length; ~--i;) {
                                    if (str.match(key = keys[i])) {
                                        ++matchTimes;

                                        if (!isViewer) {
                                            str += contentStr;
                                        }

                                        str = str.replace(key, '##em##$1##/em##');
                                    }
                                }

                                if (matchTimes === keys.length) {
                                    widgets.push(widget);
                                    if (isViewer) {
                                        //重新定位并只显示对应的内容
                                        index = str.indexOf('##em##');
                                        str = str.substr(index - 20, index + 100);
                                    }
                                    widget.searchResult = transformSearchStr(str);
                                }
                            }

                        });

                        /*AUI.data.docs()*/
                        dataModel.get('docs')().each(function (doc) {
                            var matchTimes = 0,
                                str = doc.id + ' ' + doc.title;


                            if (str) {
                                for (i = keys.length; ~--i;) {
                                    if (str.match(key = keys[i])) {

                                        ++matchTimes;

                                        str = str.replace(key, '##em##$1##/em##');
                                    }
                                }

                                if (matchTimes === keys.length) {
                                    docs.push(doc);
                                    doc.searchResult = transformSearchStr(str);
                                }
                            }
                        });


                        result.length = result.widgets.length + result.docs.length;
                        result.time = new Date() - time;

                        if (widgets.length > 100) {
                            widgets.splice(0, widgets.length - 100);
                        }

                        result.widgets = JSON.parse(JSON.stringify(widgets).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/##em##/g, '<em>').replace(/##\/em##/g, '</em>'));


                        /*if (docs.length > SEARCH_LENGTH) {
                         docs.splice(0, docs.length - SEARCH_LENGTH);
                         }*/
                        result.docs = JSON.parse(JSON.stringify(docs).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/##em##/g, '<em>').replace(/##\/em##/g, '</em>'));

                        globalSearchResult = {
                            "version": version,
                            "keyword": val,
                            "num": result.length,
                            "type": 'developmentGlobal',

                            "href": '',
                            "pageId": ''
                        };
                        if (isBlur) {
                            window.parent.A.report && window.parent.A.report(globalSearchResult);
                        }

                        $searchPanel.empty().append($.htmlClean(template('searchTemp', result).replace(/\\/g, '\\\\'), {
                            format: false
                        }).replace(/<\/?xxx>/g, ''));
                    }, 800);

                } else {
                    $searchPanel.empty();
                }
            } else {
                $searchPanel.empty();
            }
        };

        //init template helper
        template.helper('transformAuthor', function (email, short) {


            /*var author = AUI.data.author([{email: email}, {name: email}]).first();*/

            var author = dataModel.get('author')([{email: email}, {name: email}]).first();

            return author ? (short ? (author.desp) : author.desp + '&nbsp;&nbsp;' + author.email) : '';
        });
        template.helper('transformRequire', function (parent, child) {
            var html = [],
                rq = child.require,
                k, f, value,
                map = {};


            for (k in rq) {
                if (rq.hasOwnProperty(k)) {
                    map[k] = rq[k];
                }
            }

            parent.map(function (prop) {
                if (prop.name in map) {

                    f = map[prop.name];

                    if (!(f instanceof Array)) {
                        switch (typeof f) {
                            case'string':
                                f = f.split(/[\s,]/g);
                                break;
                            case 'boolean':
                                f = [f];
                                break;
                            default:
                                f = [f];
                        }
                    }


                    switch (prop.type) {
                        case 'string_select':
                            value = [];
                            f.map(function (filter) {
                                prop.valueArray.map(function (val, index) {
                                    if (filter === val) {
                                        value.push(prop.despArray[index]);
                                    }
                                });
                            });
                            break;
                        case 'boolean':
                            value = [];
                            f.map(function (filter) {
                                if (filter === true || filter === 'true') {
                                    value.push('是');
                                } else {
                                    value.push('否');
                                }
                            });
                            break;
                        case 'string_input':
                        default:
                            value = f;
                    }


                    html.push(prop.desp + '=' + value.join('&nbsp;或&nbsp;'));
                }
            });

            return html.join(',');
        });
        template.helper('transformCompatibility', function (compatibility) {
            return COMPATIBILITY_TYPE[compatibility] || COMPATIBILITY_TYPE.modernBrowser;
        });
        template.helper('transformMethodLifecycle', function (lifecycle) {
            var items = lifecycle.split(','),
                i, item,
                html = [];

            for (i = -1; item = items[++i];) {
                html.push(LIFECYCLE_STATUS[item]);
            }

            return html.join('&nbsp;');

        });
        template.helper('transformVariablesTemp', function (showType, defaultValue) {
            var variableTemp;
            switch (showType) {
                case "color":
                    variableTemp = "<span style='background-color:" + defaultValue + "'></span>";
                    break;
                case "font_size":
                    variableTemp = "<i class='iconfont icon-font-size'></i>";
                    break;
                case "font_weight":
                    variableTemp = "<i class='iconfont icon-font-weight'></i>";
                    break;
                case "border_radius":
                    variableTemp = "<i class='iconfont icon-border-radius1'></i>";
                    break;
                case "font_family":
                    variableTemp = "<span class='font-size-weight-temp' style='font-family:" + defaultValue + "'><span>字</span></span>";
                    break;
                case "z-index":
                    variableTemp = "<i class='iconfont icon-z-index'></i>";
                    break;
                case "padding":
                    variableTemp = "<i class='iconfont icon-padding1'></i>";
                    break;
                case "margin":
                    variableTemp = "<i class='iconfont icon-margin1'></i>";
                    break;
                case "line_height":
                    variableTemp = "<i class='iconfont icon-font-height'></i>";
                    break;
            }
            return variableTemp || '未知类型';
        });

        return Docs;
    });
})();