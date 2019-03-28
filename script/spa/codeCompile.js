(function (undefined) {
    (function (factory) {
        'use strict';

        // amd module
        if (typeof define === 'function' && define.amd) {
            define(['jquery', 'const', 'index'], factory);
        }
        // global
        else {
            factory();
        }

    })(function ($, CONST, AUI) {
        "use strict";

            //window.auiApp.isNewDir !== undefined 兼容vscode 不能用window.parent获取数据，导致跨域
        var isNewDir = window.auiApp.isNewDir !== undefined ? window.auiApp.isNewDir : (window.parent && window.parent.auiApp.isNewDir),
             isHttp=window.auiApp.isHttp !== undefined ? window.auiApp.isHttp : (window.parent && window.parent.auiApp.isHttp),
            CodeCompile = function (dataModel) {

                this.projectName = (auiApp.io && auiApp.io.projectName)||'';
                this.cache = {};
                this.cssDeps = [];
                this.dataModel = dataModel || window.M;
                this._init();

            };

        CodeCompile.prototype = {
            constructor: CodeCompile,
            constant: {
                TEMP: {
                    TAB: '<div data-role="tabTitle" data-href-id="_href__id_" title="_name_">_name_</div>',
                    TAB_CTN: '<div data-role="TabCtn" data-href="_href__id_">' +
                    '<div class="aui-css-tab">_titleContent_ <span class="aui-save-compile-css aui aui-baocun" title="保存样式" data-role="saveCompileCss"></span></div>' +
                    '<div data-role="subTabCtn" class="aui-css-tab-ctn">_content_</div>' +
                    '</div>',
                    SUB_TAB: '<div data-href-id="_href__id_" data-role="cssItem" title="_name_">_name_</div>',
                    SUB_TAB_CTN: '<div class="css-code-ctn" id="_id_"></div>',
                    ALERT: '<div style="word-break: break-all; font-size: 14px;padding: 10px 10px 0;line-height: 32px;" ><div>手动把路径为"_source_"</div><div>的字体图标或图片资源拷贝到"_target_"</div></div>'
                },
                WEBCONTENT_PATH: '/WebContent/dependence/',
                WEBROOT_PATH: '/WebRoot/dependence/',
                WEBSRC_PATH: '/src/main/webapp/dependence/',
                WEBTAG_PATH: '/target/webapp/dependence/',
                DEPENDENCE_PATH: external.staticTargetPath + '/dependence/',
                PLATFORM_PATH: 'functionModule/frontTechnologyComponent/platform/jslib/',
                CTN: 'auiCssFrame',
                CSS_ITEM: 'cssItem',
                SAVE_COMPILE_CSS: 'saveCompileCss',
                ACTIVE_CLASS: 'active',
                TAB_TITLE: 'tabTitle',
                SELECTOR: {
                    UL: '#auiCssTabUl',
                    CTN: "#auiCssFrame",
                    TAB_CTN: "#auiCssTabCtn",
                    DEP_CSS_OP: "#depCssOp",
                    PAGE_CTN: "#auiPageCtn",
                    BODY: "body"
                },
                DATA_ROLE: {
                    DEP_CSS: "[data-role=depCss]",
                    CSS_ITEM: "[data-role=cssItem]",
                    TAB_TITLE: "[data-role=tabTitle]",
                    LEFT_CTN: "[data-role=leftCtn]",
                    TAB_CTN: "[data-role=tabCtn]",
                    SUB_TAB_UL: "[data-role=subTabUl]",
                    SUB_TAB_CTN: "[data-role=subTabCtn]",
                    RIGHT_CTN: "[data-role=rightCtn]"

                }

            },

            _init: function () {
                var context = this;
                if (!context.projectName) {
                    external.getProjectName(function (response) {
                        context.projectName = response;
                    });
                }


            },
            compileCss: function (cssDeps, $el) {
                var context = this,

                    constant = context.constant,
                    SELECTOR = constant.SELECTOR;

                // app.shelter.show('正在加载样式,请稍候...');
                context.cssDeps = cssDeps || [];

                if (context.projectName) {

                    AUI.getDependenceConfig(function (response) {
                        context.$el = $el;
                        context.dependence = response;
                        context.emptyNode();
                        context.resetCache();
                        context.initCss();
                        context.cssTabListen(context.$el);
                    })
                } else {
                    $('[data-id=' + constant.CTN + ']').remove();
                    $('[data-role=' + constant.CTN + ']').remove();
                    $(SELECTOR.CTN).remove();
                }
            },

            initCss: function () {
                var context = this, cssDeps, len, seekFullPath;
                if ((cssDeps = context.cssDeps) && (len = cssDeps.length)) {
                    cssDeps.forEach(function (name, i) {
                        var fullPath, index, path, lessPath, isPlatform, getFileAUI,
                            webFullPath, webLessPath;
                        if (isNewDir) {
                            if (fullPath = context.dependence[name]) {

                                path = fullPath.replace(context.constant.DEPENDENCE_PATH, '');

                                context.getRealPath(path).then(function (path) {
                                    if (path) {
                                        lessPath = path.replace(/\.css$/, '.less');
                                        external.getFile(lessPath, function (res) {
                                            context.cacheAndLayout(lessPath, name, res, true, false);
                                        }, function () {
                                            external.getFile(path, function (res) {
                                                context.cacheAndLayout(path, name, res, false, false);
                                            })
                                        })
                                    }

                                })


                            }
                        } else {
                            if ((fullPath = context.dataModel.get('dependence')[name]) && (seekFullPath = context.dependence[name])) {
                                fullPath = fullPath.replace(/\\/g, '\/');
                                index = fullPath.indexOf('functionModule');
                                index = index !== -1 ? index : fullPath.indexOf(context.projectName + '/WebRoot');

                                webFullPath = context.getWebRootPath(name);
                                path = fullPath.slice(index);
                                lessPath = path.replace(/\.css$/, '.less');
                                isPlatform = seekFullPath.indexOf('functionModule\\frontTechnologyComponent\\platform') !== -1 || seekFullPath.indexOf('functionModule/frontTechnologyComponent/platform') !== -1? true : false;
                                getFileAUI = function () {
                                    external.getFile(lessPath, function (res) {
                                        context.cacheAndLayout(lessPath, name, res, true, isPlatform);
                                    }, function () {
                                        external.getFile(path, function (res) {
                                            context.cacheAndLayout(path, name, res, false, isPlatform);
                                        })
                                    })
                                };


                                if (isPlatform) {
                                    webLessPath = webFullPath.replace(/\.css$/, '.less');

                                    external.getFile(webLessPath, function (res) {// webRoot less
                                        context.cacheAndLayout(webLessPath, name, res, true, isPlatform);


                                    }, function () {

                                        external.getFile(webFullPath, function (res) { //webRoot css

                                            context.cacheAndLayout(webFullPath, name, res, false, isPlatform);

                                        }, function () {
                                            var dependence = context.dataModel.get('dependence');

                                            dependence[name] = context.dependence[name];
                                            context.dataModel.set('dependence', dependence);


                                            getFileAUI();

                                        })
                                    })

                                } else {
                                    getFileAUI();
                                }
                            }

                        }


                    })//for each end
                }
            },

            cacheAndLayout: function (path, name, response, isLess, isPlatform) {
                //name  is  .css
                var context = this,
                    cssMode = isLess ? 'less' : 'css',
                    cacheName = name.slice(0, name.lastIndexOf('/') + 1),
                    importRegx = /@import\s{1,}"([^"]+\.\w+)"/g,
                    id = app.getUID(),
                    parentCache,
                    importFile,
                    importFileLen;

                parentCache = (context.cache[id] = {
                    path: path,
                    name: name,
                    isLess: isLess,
                    pId: "",
                    subId: [],
                    isPlatform: isPlatform,
                    value: response,
                    language: cssMode
                });

                importFile = response.match(importRegx);

                if (importFile && (importFile = importFile.join(',').replace(importRegx, '$1').split(','))) {
                    if (importFileLen = importFile.length) {
                        importFile.forEach(function (item, index) {
                            var subId = app.getUID(), subPath;
                            if (item.match(/^[-a-zA-Z0-9_]/)) {
                                item = './' + item;
                            }
                            subPath = path.slice(0, path.lastIndexOf('/') + 1) + item;


                            context.copyFile(parentCache.name.slice(0, parentCache.name.lastIndexOf('/') + 1) + item);

                            external.getFile(subPath, function (res) {
                                context.cache[subId] = {
                                    isLess: isLess,
                                    isPlatform: isPlatform,
                                    path: subPath,
                                    name: cacheName + item,
                                    pId: id,
                                    value: res,
                                    language: cssMode
                                };

                                parentCache.subId.push(subId);

                                context.saveUrlFile(subId);

                                if (index === importFileLen - 1) {
                                    context.setLayout(id);
                                    // context.requireCss(name);
                                }

                            }, function () {

                            })


                        })
                    }
                } else {

                    context.setLayout(id);
                    context.saveUrlFile(id);
                    // context.requireCss(name);
                }


            },

            setLayout: function (id) {
                var context = this,
                    constant = context.constant,
                    TEMP = constant.TEMP,
                    $leftCtn = $(constant.DATA_ROLE.LEFT_CTN),
                    $rightCtn = $(constant.DATA_ROLE.RIGHT_CTN),
                    itemCache = context.cache[id],
                    subTitleHtml = [],
                    subCtnHtml = [],
                    $activeLayout,
                    name, cacheName, fileName, j, _itemId, subId, subItem;

                if (!$.isEmptyObject(itemCache)) {

                    name = itemCache.name;
                    cacheName = itemCache.isLess ? name.replace(/\.css$/, '.less') : name;
                    fileName = context.getFileName(cacheName);
                    if (!itemCache.pId) {

                        subTitleHtml.push(TEMP.SUB_TAB.replace(/_name_/g, fileName).replace('_href__id_', id));
                        subCtnHtml.push(TEMP.SUB_TAB_CTN.replace('_id_', id));

                        if (subId = itemCache.subId) {
                            for (j = subId.length; _itemId = subId[--j];) {
                                subItem = context.cache[_itemId];
                                if (subItem && !$.isEmptyObject(subItem)) {
                                    subTitleHtml.push(TEMP.SUB_TAB.replace(/_name_/g, context.getFileName(subItem.name)).replace('_href__id_', _itemId));
                                    subCtnHtml.push(TEMP.SUB_TAB_CTN.replace('_id_', _itemId));

                                }
                            }
                        }

                        $leftCtn.append(TEMP.TAB.replace(/_name_/g, fileName)
                            .replace('_href__id_', id)
                        );

                        $rightCtn.append(TEMP.TAB_CTN.replace('_href__id_', id)
                            .replace('_titleContent_', subTitleHtml.join(' '))
                            .replace('_content_', subCtnHtml.join(' '))
                        );
                    }
                    context.vsCodeLayout(id);


                    $leftCtn.children(":first").addClass('active');
                    $rightCtn.children(":first").addClass('active');
                    $activeLayout = $(constant.DATA_ROLE.CSS_ITEM).eq(0);
                    $("#" + $activeLayout.attr("data-href-id"), $rightCtn.children(":first")).addClass('active');

                    $activeLayout.addClass('active');

                    setTimeout(function () {
                        var cacheItem = context.vsCodeCache[$activeLayout.attr("data-href-id")];

                        cacheItem && cacheItem.layout && cacheItem.layout();
                    }, 100)

                }

            },


            saveUrlFile: function (id) {
                if (isNewDir) return;

                var context = this,
                    reg = /(url\(['"]{0,1})([\.]{1,2}[\/]{1,}[^#|\?|'|"|\)]{1,})/g,
                    itemCache = context.cache[id],
                    value = itemCache.value,
                    name = !itemCache.pId ? itemCache.name : context.cache[itemCache.pId].name,
                    cacheName = name.slice(0, name.lastIndexOf('/') + 1),
                    urlPath = [],
                    lastPath;

                if (itemCache.isPlatform) {
                    value.replace(reg, function (str, $1, $2) {
                        lastPath = $2.match(/^[-a-zA-Z0-9_]/) ? './' + $2 : $2;
                        urlPath.push(cacheName + lastPath);
                        return str;
                    });

                    if (urlPath.length) {
                        urlPath.forEach(function (item, i) {
                            context.copyFile(item);
                        })
                    }
                }


            },
            copyFile: function (name) {

                if (isNewDir) return;

                var context = this,
                    regx = /(\/){1,2}/g,
                    workSpace = context.getWorkSpace(),
                    preSource = workSpace + context.constant.PLATFORM_PATH,
                    webRoot = workSpace + context.projectName + context.constant.WEBROOT_PATH,
                    webContent = webRoot.replace('WebRoot', 'WebContent'),
                    source = (preSource + name).replace(regx, '\\'),
                    webRootTarget = (webRoot + name).replace(regx, '\\'),
                    webContentTarget = (webContent + name).replace(regx, '\\');


                external.getFile(context.getWebRootPath(name), function () {


                }, function () {
                    external.copyFile({
                        source: source,
                        target: webRootTarget
                    });
                })


            },
            setWorkSpace: function (workSpace) {
                this.workSpace = workSpace;
            },

            getWorkSpace: function () {

                // var path = external.webContentPath && external.webContentPath.split('/');
                // path.pop();
                // path.pop();
               //console.log(external.workSpacePath);
                return external.workSpacePath;
            },

            getFileName: function (name) {
                return name.slice(name.lastIndexOf('/') + 1);
            },

            requireCss: function (name) {

                var context = this,
                    fullPath,
                    relativePath,
                    currentHref;


                if (name && (fullPath = context.dataModel.get('dependence')[name])) {
                    relativePath = new RegExp(name.replace(/\//g, '(?:\\\\|\/)') + '$');
                    if (name.match(/\.(css|less|scss)$/) && fullPath.match(/\.css(?:version=[^$]+)?$/)) {


                        currentHref = fullPath + '?cleverLijiancheng=' + new Date().getTime();

                        require(['requireCss!' + currentHref], function () {
                            var i,
                                href,
                                link = document.getElementsByTagName('link'),
                                cssLink;

                            for (i = link.length; cssLink = link[--i];) {
                                href = cssLink.getAttribute('href') || '';
                                if ((href.match(relativePath) || href.indexOf(fullPath) !== -1) && href !== currentHref) {
                                    $(cssLink).remove();
                                }
                            }
                        });

                    }
                }

            },

            getRealPath: function (path) {
                var context = this,
                    projectName = context.projectName,
                    dtd = $.Deferred(),
                    fullPath = projectName + '/node_modules/@aweb-components/' + path;

                external.isExist(fullPath, function () {
                    //在aweb-components
                    dtd.resolve(fullPath);

                }, function () {
                    fullPath = projectName + '/node_modules/@aweb-lib/' + path;
                    external.isExist(fullPath, function () {
                        //在aweb-lib
                        dtd.resolve(fullPath);
                    }, function () {
                        fullPath = projectName + '/src/main/webapp/dependence/' + path;

                        external.isExist(fullPath, function () {
                            dtd.resolve(fullPath);
                        }, function () {
                            dtd.resolve();
                            app.alert(app.alert.ERROR, "找不到该文件路径！");
                        })
                    })
                });
                return dtd.promise();
            },
            saveCss: function (key, cssItem) {

                var context = this,
                    cache = context.cache,
                    value = context.vsCodeCache[key].getValue(),
                    name = cssItem.name,
                    isPlatform = cssItem.isPlatform,
                    cacheName = cssItem.isLess ? name.replace(/\.css$/i, '.less') : name,
                    webContentPath = context.getWebContentPath(cacheName),
                    webRootPath = context.getWebRootPath(cacheName),
                    subId = [],
                    fullPath, cssItemParent,
                    item, i,
                    subItem, sourcePath,
                    saveFile = function (fullPath, value, successCallback) {
                        external.saveFile({
                            fullPath: fullPath,
                            content: value
                        }, function (res) {
                            successCallback && successCallback();
                        });

                        if (isPlatform) {
                            external.saveFile({
                                fullPath: fullPath.replace('WebRoot', 'WebContent'),
                                content: value
                            }, function (res) {

                            })
                        }


                    },
                    lessSave = function (i) {
                        if (!i) {
                            saveFile(fullPath, value, function () {
                                external.compileCss({//编译css
                                    source: fullPath,
                                    target: webContentPath
                                }, function (res) {
                                    if (res) {
                                        $AW.trigger($AW._STATUS.PREVIEW_FRAME.FRESH);
                                        app.alert('组件样式已经同步到 WebContent \n到浏览器刷新页面即可看到效果 \n请将“WebRoot”下的 less 或 css 文件提交到版本库', app.alert.SUCCESS);
                                    }
                                })
                            });
                        } else {
                            saveFile(fullPath, value); //save import
                        }
                    },
                    cssSave = function () {
                        saveFile(fullPath, value, function () {

                            $AW.trigger($AW._STATUS.PREVIEW_FRAME.FRESH);

                            saveFile(webContentPath, value, function () {
                                app.alert('组件样式已经同步到 WebContent \n到浏览器刷新页面即可看到效果 \n请将“WebRoot”下的 less 或 css 文件提交到版本库', app.alert.SUCCESS);
                            })
                        })
                    };

                context.saveUrlFile(key);

                if (cssItem.isLess) {//less
                    if (cssItem.pId) {
                        cssItemParent = cache[cssItem.pId];
                        subId = cssItemParent.subId.concat(cssItem.pId);

                    } else {
                        subId.push(key)
                    }

                    subId.reverse();

                    if (subId && subId.length) {
                        for (i = subId.length; subItem = subId[--i];) {

                            item = cache[subItem];
                            name = item.name;
                            value = context.vsCodeCache[subItem].getValue();
                            webContentPath = context.getWebContentPath(name);
                            webRootPath = context.getWebRootPath(name);

                            sourcePath = context.dependence[name];
                            if (!isNewDir) {
                                if (isPlatform) {
                                    fullPath = webRootPath.replace(/\.css/i, '.less');
                                } else {
                                    fullPath = sourcePath.slice(sourcePath.indexOf('functionModule'))
                                        .replace(/\.css/i, '.less')
                                        .replace(/\\/g, '/');
                                }
                                lessSave(i);
                            } else {
                                sourcePath = sourcePath.replace(context.constant.DEPENDENCE_PATH, '');

                                (function (i) {
                                    context.getRealPath(sourcePath).then(function (path) {
                                        fullPath = path.replace(/\.css/i, '.less');
                                        lessSave(i);
                                    })
                                })(i)

                            }

                        }
                    }

                } else {//css

                    sourcePath = context.dependence[name];

                    if (!isNewDir) {
                        if (isPlatform) {
                            fullPath = webRootPath;
                        } else {
                            fullPath = sourcePath.slice(sourcePath.indexOf('functionModule'))
                                .replace(/\\/g, '/');
                        }
                        cssSave();
                    } else {

                        sourcePath = sourcePath.replace(context.constant.DEPENDENCE_PATH, '');

                        context.getRealPath(sourcePath).then(function (_fullPath) {
                            fullPath = _fullPath;
                            cssSave();
                        })
                    }


                }


            },

            resetCacheStyle: function () {
                this.cacheStyle = {};
            },

            resetCache: function () {
                this.cache = {};
                this.vsCodeCache = {};
            },

            emptyNode: function () {
                var constant = this.constant,
                    SELECTOR = constant.SELECTOR,
                    $ul = $(SELECTOR.UL),
                    $tab_ctn = $(SELECTOR.TAB_CTN),
                    $leftCtn = $(constant.DATA_ROLE.LEFT_CTN),
                    $rightCtn = $(constant.DATA_ROLE.RIGHT_CTN);

                $ul.empty();
                $rightCtn.empty();
                $tab_ctn.empty();
                $leftCtn.empty();
            },

            compileJs: function (fullPath, value) {
                var context = this;
                if (context.projectName) {
                    external.saveFile({
                        fullPath: context.projectName + context.constant.WEBCONTENT_PATH + fullPath,
                        content: value
                    }, function (response) {
                        // app.alert('组件JS代码已同步到WebContent', app.alert.SUCCESS);
                    });

                }
            },

            cssTabListen: function ($el) {

                var context = this,
                    constant = context.constant;

                $el.off('.codeCompile')
                    .on({
                        "click.codeCompile": function (e) {
                            var $target = $(e.target || event.srcElement).closest('[data-role]'),
                                role = $target.attr('data-role'),
                                id, pId, name, cache;
                            switch (role) {
                                case constant.CSS_ITEM:
                                    id = $target.attr('data-href-id');
                                    $target.addClass(constant.ACTIVE_CLASS).siblings().removeClass(constant.ACTIVE_CLASS);
                                    $("#" + id).addClass(constant.ACTIVE_CLASS).siblings().removeClass(constant.ACTIVE_CLASS);

                                    context.vsCodeCache[id].layout();
                                    break;

                                case constant.TAB_TITLE:

                                    id = $target.attr('data-href-id');

                                    $target.addClass(constant.ACTIVE_CLASS).siblings().removeClass(constant.ACTIVE_CLASS);

                                    $('[data-href=' + id + ']', constant.DATA_ROLE.RIGHT_CTN).addClass(constant.ACTIVE_CLASS).siblings().removeClass(constant.ACTIVE_CLASS);


                                    $('[data-href-id]', constant.DATA_ROLE.RIGHT_CTN).removeClass(constant.ACTIVE_CLASS);
                                    $('[data-href-id=' + id + ']', constant.DATA_ROLE.RIGHT_CTN).addClass(constant.ACTIVE_CLASS);


                                    $(constant.DATA_ROLE.SUB_TAB_CTN).children().removeClass(constant.ACTIVE_CLASS);
                                    $('#' + id).addClass(constant.ACTIVE_CLASS);

                                    context.vsCodeCache[id].layout();

                                    break;

                                case constant.SAVE_COMPILE_CSS:


                                    id = $(constant.DATA_ROLE.SUB_TAB_CTN).children('.active').attr("id");

                                    context.saveCss(id, context.cache[id]);
                                    break;
                            }

                        }
                    })


            },
            vsCodeLayout: function (id) {
                var context = this, result = context.cache[id], subId, i, len, subItem, _item;

                if (result) {
                    if ((subId = result.subId) && (len = subId.length)) {
                        for (i = len; _item = subId[--i];) {
                            subItem = context.cache[_item];
                            this.vsCodeCache[_item] = AUI.vscode.create(
                                $('#' + _item), {
                                    value: subItem.value,
                                    language: subItem.language,
                                    readOnly: false
                                })
                        }
                    }

                    this.vsCodeCache[id] = AUI.vscode.create(
                        $('#' + id), {
                            value: result.value,
                            language: result.language,
                            readOnly: false
                        })

                }

            },

            getWebRootPath: function (path) {
                var constant = this.constant;
                return this.projectName + (isNewDir ? constant.WEBTAG_PATH : constant.WEBROOT_PATH) + path;
            },
            getPlatFormPath: function (path) {
                return this.constant.PLATFORM_PATH + path;
            },
            getWebContentPath: function (path) {
                var constant = this.constant;
                return this.projectName + (isNewDir ? constant.WEBTAG_PATH : constant.WEBCONTENT_PATH) + path;
            },
            validateCss: function (name, data, sucessCallback) {

                var context = this,
                    data = data || context.dataModel.get('dependence'),
                    fullPath = data[name],
                    webPath = context.getWebRootPath(name),
                    workSpace,
                    webFullPath;

                if (isNewDir) {
                    sucessCallback && sucessCallback();
                } else {
                    if (fullPath) {

                        workSpace = context.getWorkSpace();



                        external.getFile(webPath, function (res) { //webRoot css

                            if(isHttp){
                                webFullPath=external.staticPath+'/'+webPath;
                            }else {
                                webFullPath = (workSpace + webPath).replace(/\//g, '\\');
                            }


                            data[name] = webFullPath;
                            context.dataModel.set('dependence', data);

                            sucessCallback && sucessCallback();

                        }, function () {

                            sucessCallback && sucessCallback();

                        })
                    }
                }


            }

        };
        return CodeCompile;
    })
})();

