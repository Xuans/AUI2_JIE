(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "const", "uglifyjs"], factory);
        }
        // global
        else {
            factory();
        }
    })(function ($, CONST) {
        //window.auiApp.isNewDir !== undefined 兼容vscode 不能用window.parent获取数据，导致跨域

        var
            isNewDir = window.auiApp.isNewDir !== undefined ? window.auiApp.isNewDir : (window.parent && window.parent.auiApp.isNewDir),
            isHttp = window.auiApp.isHttp !== undefined ? window.auiApp.isHttp : (window.parent && window.parent.auiApp.isHttp),
            getCode = function (code, api) {
                  switch (typeof code) {
                                case 'function':
                                    code = code.toString();

                                    if (code.indexOf('app.') !== 0) {
                                        code = 'app.' + api.name + '=' + code;
                                    }
                                    if ((api.belongTo === 'class' || api.belongTo === 'closure') && code.substr(-2, 2) !== '()' && code.substr(-3, 3) !== '();') {
                                        code = code + '()';
                                    }
                                    return code;

                                case 'string':
                                    return code;
                            }

               // return code;


            },
            interfacesToCode = function (interfaces, forEval) {
                var i, sort,
                    j, api,
                    code,
                    key,
                    edition,
                    childrenHasAppJsCode,
                    depJsStr,
                    codeStr,
                    requireStr = '',
                    depJsArr,

                    pushCode = function (codeArr, code, forEval, api) {
                        if (forEval) {
                            codeArr.push(code);
                        } else {
                            //codeArr.push('\/*' + api.name + '_START*\/' + code + '\/*' + api.name + '_END*\/');
                            if(api.depJsArr&&typeof(api.depJsArr)==='string'){
                                depJsArr = api.depJsArr&&JSON.parse(api.depJsArr);
                                depJsStr = (depJsArr&&depJsArr.length)?"'"+depJsArr.join("','")+"'":'';
                                                           
                            }else{
                                depJsStr = (api.depJsArr&&api.depJsArr.length)?"'"+api.depJsArr.join("','")+"'":'';
                            }
                            codeStr = "define('app."+api.name+"',["+depJsStr+"],function () {"+code+"})";
                            codeArr.push('\/*' + api.name + '_START*\/' + codeStr + '\/*' + api.name + '_END*\/');
                            requireStr +="'app."+api.name+"',";

                        }
                    },

                    codeArr = [];

                interfaces = interfaces || appInterfaces;

                for (i=-1; sort = interfaces[++i];) {
                    childrenHasAppJsCode = false;
                    sort = sort.children || [];
                    for (j = -1; api = sort[++j];) {
                        if (code = api.appJsCode) {
                            api.appJsCode = getCode(code, api);
                            pushCode(codeArr, api.appJsCode, forEval, api);
                        }

                        if (edition = api.edition) {
                            for (key in edition) {
                                edition[key] = getCode(edition[key], api);
                                if (key !== 'universal') {
                                    //do nothing

                                } else {
                                    if (!api.appJsCode) {
                                        api.appJsCode = edition[key];
                                        pushCode(codeArr, api.appJsCode, forEval, api);
                                    }
                                }
                            }
                        } else {
                            api.edition = {};
                        }

                        api.edition.universal = api.appJsCode;

                        if (!api.appJsCode) {
                            //没有appJsCode则不保存，此时codeArr没有这个接口
                        } else {
                            childrenHasAppJsCode = true;
                        }
                    }

                    if (!childrenHasAppJsCode) {
                        //没有children有appJsCode，则删除整个分类
                        interfaces.splice(i, 1);
                    }
                }


                return codeArr.join(';')+";require(["+requireStr.slice(0,-1)+"])";

            },

            saveConfigJs = function (option) {
                var projectName = option.projectName,
                    dependencePath = option.dependencePath,
                    fileContent = option.fileContent,
                    savedCallback = option.savedCallback,
                    returnValue = option.returnValue,
                    external = option.external,
                    configWebRootPath = isNewDir ? projectName + '/src/main/webapp' + dependencePath : projectName + '/WebRoot' + dependencePath,
                    configWebContentPath = isNewDir ? projectName + '/target/webapp' + dependencePath : projectName + '/WebContent' + dependencePath,

                    fullContent = 'define(["jquery"],function($){'
                        + (fileContent || '')
                        + '; return ' + ((returnValue && JSON.stringify(returnValue)) || '') + ';})',
                    save = function () {
                        if (auiApp.mode !== CONST.MODE.NAVIGATOR) {
                            external.saveFile({
                                fullPath: configWebRootPath,
                                content: fullContent
                            }, function () {
                                external.saveFile({
                                    fullPath: configWebContentPath,
                                    content: fullContent
                                }, function () {
                                    savedCallback && savedCallback();
                                }, function () {
                                    savedCallback && savedCallback();
                                });

                            }, function () {
                                savedCallback && savedCallback();
                            });
                        } else {
                            savedCallback && savedCallback();
                        }

                    },
                    ast = UglifyJS.parse(fullContent),
                    stream = UglifyJS.OutputStream({beautify: false});


                if (dependencePath.indexOf('aweb.api.js') === -1) {

                    ast.print(stream);
                    fullContent = stream.toString();
                }


                if (option.forceSave) {
                    save()
                } else if (option.noSave) {
                    savedCallback && savedCallback();
                } else {
                    external.getFile(configWebRootPath, function (res) {
                        fullContent = res;
                        save();
                    }, function () {
                        save();
                    })
                }


            },

            saveApiJs = function (widgetData, forceSave, dataModel, dtd, innerExternal, requiredCallback, noSave) {
                var external = innerExternal || window.external,
                    projectName = auiApp.io.projectName,
                    saveData = $.extend(true, {}, widgetData.save);

                // external.getProjectName(function (projectName) {
                var awebDependencePath = '/dependence/AWEB/js/aweb.dependence.js',
                    awebEnvironmentPath = '/dependence/AWEB/js/aweb.environment.js',
                    awebApiPath = '/dependence/AWEB/js/aweb.api.js',
                    awebApiConfigPath = '/dependence/AWEB/js/aweb.api.config.js',
                    awebFresherPath = '/dependence/AWEB/js/aweb.fresher.js',
                    apiConfigList = {
                        appInterfaces: true,
                        appInterfacesConst: true,
                    },

                    key,
                    savedCallback = function () {
                        var resolveParam,
                            webRootPath = external.webContentPath ? external.webContentPath.replace('WebContent', 'WebRoot') : '.',
                            webRootPath = (isHttp && external.staticSrcPath) || webRootPath,
                            webRootPath=(!projectName && '.')||webRootPath,
                            requireList = {
                                apiConfig: webRootPath + awebApiConfigPath,
                                dependence: webRootPath + awebDependencePath,
                                environment: webRootPath + awebEnvironmentPath,
                                fresher: webRootPath + awebFresherPath,
                                api: webRootPath + awebApiPath
                            }, loadList, requireArr = [], key, keyArr = [], i, item;
                        loadList = widgetData.load || requireList;


                        for (key in loadList) {
                            if (loadList[key]) {
                                requireArr.push(requireList[key]);
                                keyArr.push(key);
                            }
                        }

                        for (i = -1; item = requireArr[++i];) {
                            removeJS(item);
                            requireArr[i] = item + '?cleverLijiancheng=' + new Date().getTime();
                        }



                        require(requireArr, function () {

                            var argsArr = [].slice.call(arguments), argsList = {}, awebApi, environment, dependence,
                                iconArr;

                            keyArr.forEach(function (key, index) {
                                argsList[key] = argsArr[index];
                            });

                            if (dataModel) {
                                //   AUI.data.viewer = AUI.data.viewer || {};
                                awebApi = dataModel.get('awebApi') || {};

                                if (argsList.apiConfig) {
                                    for (key in apiConfigList) {
                                        awebApi[key] = argsList.apiConfig[key];
                                    }
                                }
                                dataModel.set("awebApi", awebApi);
                            }

                            environment = argsList.environment;
                            dependence = argsList.dependence;


                            if (dependence) {
                                iconArr = dependence.iconArr;
                                if (!iconArr || (iconArr && !iconArr.length)) {
                                    dependence.iconArr = aweb.iconArr || window.parent.aweb.iconArr;
                                }

                            }
                            if (typeof requiredCallback === 'function') {

                                resolveParam = $.extend({}, argsList.apiConfig, dependence, {
                                    environment: environment,
                                    fresher: argsList.fresher
                                });

                                requiredCallback(resolveParam);
                            }


                            dependence && $.extend(window.aweb || window.parent.aweb, dependence);
                            environment && $.extend(window.aweb || window.parent.aweb, environment);


                            dtd && dtd.resolve();
                        })


                    },
                    queue = [],
                    next = function () {
                        var next = queue.shift();
                        if (next) {
                            next();
                        } else {
                            savedCallback();
                        }
                    },
                    saveMap = {
                        api: function () {

                            var api = saveData.api;

                            saveConfigJs({
                                projectName: projectName,
                                dependencePath: awebApiConfigPath,
                                returnValue: api,
                                forceSave: forceSave,
                                noSave: noSave,
                                external: external,
                                savedCallback: saveConfigJs({
                                    projectName: projectName,
                                    dependencePath: awebApiPath,
                                    noSave: noSave,
                                    fileContent: interfacesToCode(api.appInterfaces),
                                    forceSave: forceSave,
                                    external: external,
                                    savedCallback: function () {
                                        next();
                                    }
                                })
                            })


                        },
                        fresher: function () {
                            saveConfigJs({
                                projectName: projectName,
                                dependencePath: awebFresherPath,
                                noSave: noSave,
                                forceSave: forceSave,
                                returnValue: widgetData['fresher'] || {
                                    theme: {},
                                    variables: []
                                },
                                external: external,
                                savedCallback: function () {
                                    next();
                                }
                            })
                        },
                        environment: function () {
                            saveConfigJs({
                                projectName: projectName,
                                dependencePath: awebEnvironmentPath,
                                returnValue: saveData.environment,
                                forceSave: forceSave,
                                noSave: noSave,
                                external: external,
                                savedCallback: function () {
                                    next();
                                }
                            })
                        },
                        dependence: function () {
                            // var auiJsRet = widgetData['dependence'];

                            saveConfigJs({
                                projectName: projectName,
                                dependencePath: awebDependencePath,
                                returnValue: saveData.dependence,
                                noSave: noSave,
                                forceSave: forceSave,
                                external: external,
                                savedCallback: function () {
                                    next();
                                }
                            })
                        }

                    },
                    save = function () {

                        for (key in saveData) {
                            if (saveMap.hasOwnProperty(key)) {
                                queue.push(saveMap[key])
                            }
                        }
                        if (queue.length) {
                            next();
                        } else {
                            savedCallback();
                        }
                    };
                if (auiApp.io.projectName) {
                    // if (auiApp) {
                    //     if (!auiApp.io) {
                    //         auiApp.io = {};
                    //     }
                    //     auiApp.io.projectName = projectName;
                    // }
                    save();
                } else {
                    //平台组件
                    savedCallback();
                }
                //     },
                //     function () {
                //         dtd && dtd.resolve();
                //     }
                // );
            },

            loadIcon = function (iconArr, dependence) {
                iconArr.map(function (item) {
                    var href = dependence[item.file];
                    if (item.active === false) {
                        removeCss(item.file);
                    } else {
                        requireCss(href);
                    }

                });
            },
            requireCss = function (fullPath) {

                var currentHref;

                if (fullPath) {

                    if (fullPath.match(/\.css(?:version=[^$]+)?$/)) {

                        currentHref = fullPath + '?cleverLijiancheng=' + new Date().getTime();

                        window.require(['requireCss!' + currentHref], function () {
                            var i,
                                href,
                                link = document.getElementsByTagName('link'),
                                cssLink;

                            for (i = link.length; cssLink = link[--i];) {
                                href = cssLink.getAttribute('href') || '';
                                if ((href.indexOf(fullPath) !== -1) && href !== currentHref) {
                                    $(cssLink).remove();
                                }
                            }
                        });

                    }
                }

            },

            removeCss = function (fullPath) {
                var i,
                    href,
                    link = document.getElementsByTagName('link'),
                    cssLink;

                if (fullPath && (fullPath = fullPath.replace(/\//g, '\\'))) {
                    for (i = link.length; cssLink = link[--i];) {
                        href = cssLink.getAttribute('href') || '';
                        if ((href.indexOf(fullPath) !== -1)) {
                            $(cssLink).remove();
                        }
                    }
                }

            },

            removeJS = function (fullPath) {
                var i,
                    href,
                    link = document.getElementsByTagName('script'),
                    jsLink;

                for (i = link.length; jsLink = link[--i];) {
                    href = jsLink.getAttribute('src') || '';
                    if ((href.indexOf(fullPath) !== -1)) {
                        $(jsLink).remove();
                    }
                }
            },
            getIconCode = function (name, callback, errorCallback) {
                var classNameArrToJSON = function (arr) {
                        var i, len, result = [];

                        if (arr && arr.length) {
                            arr = Array.from(new Set(arr));

                            for (i = 0, len = arr.length; i < len; i++) {
                                result.push({
                                    name: arr[i].substring(1),
                                    value: arr[i].substring(1)
                                });
                            }
                        }

                        return result;
                    },
                    filePath,
                    platfromIndex,
                    index;

                if (name) {

                    if (!isNewDir) {
                        filePath = window.M.get('dependence')[name];
                        platfromIndex = filePath.indexOf('functionModule');
                        index = (platfromIndex !== -1) ? platfromIndex : filePath.indexOf('WebRoot');
                        filePath = filePath.substring(index);
                        filePath = (platfromIndex !== -1) ? filePath : auiApp.io.projectName + '\\' + filePath;
                    } else {
                        filePath = auiApp.io.projectName + '/target/webapp/dependence/' + name;
                    }


                    external.getFile(filePath, function (content) {
                        var regex = new RegExp('\\.[a-zA-z](?:[A-Za-z0-9]+-)+[A-Za-z0-9]+', 'gi'),
                            code = window.A.getParsedString(UglifyJS.parse('(' + JSON.stringify(classNameArrToJSON(content.match(regex))) + ')'));
                        callback && callback(code);
                    }, function () {
                        errorCallback && errorCallback();
                    });
                } else {
                    callback && callback();
                }

            },
            waitLoadIcon = function (iconFile) {
                var deferred = $.Deferred(),
                    i, item,
                    resolve = function (i) {
                        if (i === iconFile.length - 1) {
                            deferred.resolve();
                        }
                    };

                if (iconFile) {
                    for (i = -1; item = iconFile[++i];) {

                        (function (i, name) {

                            if (!item.code && name) {
                                getIconCode(name, function (code) {

                                    iconFile[i].code = code;
                                    resolve(i);
                                }, function () {
                                    resolve(i)
                                });
                            } else {
                                resolve(i)
                            }

                        }(i, item.file))

                    }
                    loadIcon(iconFile, window.M.get('dependence'));
                } else {
                    deferred.resolve();
                }


                return deferred.promise();
            };

        return {
            saveConfigJs: saveConfigJs,
            saveApiJs: saveApiJs,
            interfacesToCode: interfacesToCode,
            getCode: getCode,
            loadIcon: loadIcon,
            waitLoadIcon: waitLoadIcon,
            getIconCode: getIconCode,
            removeJS: removeJS,
            requireCss: requireCss
        }
    })
})
();