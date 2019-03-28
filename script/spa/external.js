/*!
 * Javascript library v3.0
 *
 * Date: 2016.04.14
 */

/**
 *
 * @param {[undefined]}e
 *            undefined [确保undefined未被重定义]
 * @author quanyongxu@cfischina.com
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        //amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "const", 'socket.io'], factory);
        }
        //global
        else {
            factory();
        }
    })
    (function ($, CONST, SocketIO) {
        "use strict";

        var Bridge,

            MODE = {
                WIDGET: {
                    widgetCreator: true,
                    widgetBuilder: true,
                    viewer: true
                },
                THEME: {
                    theme: true
                }
            },

            io = function (key, data, successCallback, errorCallback, tips, isJSON) {
                try {
                    var request = JSON.stringify({
                        key: key,
                        value: typeof data === 'object' ? JSON.stringify(data) : data
                    });

                    sendMessageToJava({
                        request: request,
                        onSuccess: function (response) {

                            if (isJSON) {
                                try {
                                    response = JSON.parse(response);
                                    successCallback && successCallback(response);
                                } catch (e) {
                                    errorHandler(tips && (tips + e.message), errorCallback);
                                }
                            } else {
                                successCallback && successCallback(response);
                            }
                        },
                        onFailure: function (errorCode, errorMessage) {

                            if (errorCode) {
                                errorHandler(tips && (tips + errorCode + '：' + errorMessage), errorCallback);
                            }else{
                                errorCallback && errorCallback();

                            }


                        }
                    });
                } catch (e) {
                    errorHandler(tips && (tips + e.message), errorCallback);
                }
            },

            errorHandler = function (tips, errorCallback) {
                tips && alert(tips, alert.ERROR);
                errorCallback && errorCallback();
            },
            getParams = function (search, name) {
                search = decodeURIComponent(search);
                var array = search.match(new RegExp('(^|&)' + name + '=([^&]*)(&|$)'));
                if (array) {
                    return array[2].replace(/'|"/g, "");
                }

            },

            external = {
                /*通用配置*/
                alert :function () {
                    var t = window.app;

                    if (t && t.alert) {
                        t.alert.apply(t.alert, arguments);
                    }
                },
                getPageConfig: function (successCallback, errorCallback) {
                    io('getCustomMenu', '', successCallback, errorCallback, '获取页面配置信息');
                },
                savePageConfig: function (data, successCallback, errorCallback) {
                    io('saveCustomMenu', data, successCallback, errorCallback, '保存页面配置');
                },
                //获取依赖库配置
                getDependenceConfig: function (successCallback, errorCallback) {
                    io('getDependenceConfig', '', function (response) {
                        if (response) {
                            response = JSON.parse(response);
                            successCallback(response);
                        }
                    }, errorCallback, '获取依赖库配置');
                },
                getPageFlowStructure: function (successCallback, errorCallback) {
                    io('getPageFlowStructure', '', function (response) {
                        var item, len,
                            cache = [];

                        if (response) {
                            response = JSON.parse(response);

                            for (len = response.length; item = response[--len];) {
                                cache.push({
                                    id: item.id,
                                    name: item.name,
                                    pId: item.pId.substr(item.pId.lastIndexOf('/') + 1),
                                    path: (item.pId + '/' + item.id).replace(/\//g, '#'),
                                    deployPath: item.deployPath,
                                    open: true
                                });
                            }

                            successCallback(cache.reverse());
                        } else {
                            successCallback([]);
                        }
                    }, errorCallback, '获取页面流结构');
                },

                //获取项目名
                /*
                 *       在内容、项目首页布局编辑器、项目主题配置编辑器、项目技术、业务组件中，返回项目名的字符串
                 *
                 *       在平台、银行技术、业务组件中，返回空（''）字符串
                 * */
                getProjectName: function (successCallback, errorCallback) {
                    io('getProjectName', '', successCallback, errorCallback);
                },
                //获取项目主题配置
                /*
                 *       在内容、项目首页布局编辑器、项目主题配置编辑器、项目技术、业务组件中，返回项目中主题配置的配置内容
                 *
                 *       在平台、银行技术、业务组件中，返回空（''）字符串
                 * */
                getProjectTheme: function (successCallback, errorCallback) {
                    io('getProjectTheme', '', function (response) {
                        var theme = {};

                        if (response) {
                            theme = JSON.parse(response);
                        }

                        successCallback(theme);
                    }, errorCallback);
                },

                /*编辑区域*/
                //获取菜单
                getMenu: function (successCallback, errorCallback) {
                    io('getMenu', '', function (response) {
                        var items,
                            menus = [];

                        if (response) {
                            response = JSON.parse(response);

                            ['platform', 'bank', 'app'].map(function (belongTo) {
                                if ((items = response[belongTo]) && items.length) {
                                    items.map(function (elem) {
                                        elem.belongTo = belongTo;

                                        menus.push(elem);
                                    });
                                }
                            });
                        }

                        successCallback(menus);
                    }, function () {
                        successCallback([]);
                    }, '获取菜单');
                },
                copyFile: function (info, successCallback, errorCallback) {
                    /*info:{
                     source: 'E:\workSpaceTest\functionModule\frontTechnologyComponent\platform\jslib\AWEB/fonts/am.eot',
                     target: 'E:\workSpaceTest\test\webRoot\dependence\AWEB\fonts\am.eot'
                     }*/

                    io('copyFile', {
                        source: info.source,
                        target: info.target
                    }, successCallback, errorCallback);

                },

                compileCss: function (info, successCallback, errorCallback) {
                    /**
                     * info={
                     *   source:'/@项目路径/WebRoot/css/aweb.less',
                     *   target:'/@项目路径/WebContent/dependence/AWEB/aweb.css'
                     * }
                     **/
                    io('compileCss', {
                        source: info.source,
                        target: info.target
                    }, successCallback, errorCallback, '编译文件“' + info.source + '”');
                },
                //获取、恢复配置
                getConfigure: function (successCallback, errorCallback) {
                    io('getConfigure', '', function (response) {
                        if ($.trim(response)) {
                            if(!window.auiApp.isHttp){
                                response = response.replace(/##_AUI_PATH##/g, external.webContentPath)
                            }else{
                                response = response
                                        .replace(/##_AUI_PATH##/g, external.staticTargetPath/*.replace(/(\/){1,2}/g,'\\\\')*/)
                                   // .replace(/http:\\{1,2}/g,'http:\\\\\\\\');
                            }


                            response = $.trim(response);

                            if (auiApp.mode in MODE.WIDGET) {
                                if (!Bridge) {
                                    require(['bridge'], function (bridge) {
                                        Bridge = bridge;

                                        response = Bridge('WIDGET', response);

                                        successCallback(response);
                                    });
                                } else {
                                    response = Bridge('WIDGET', response);
                                    successCallback(response);
                                }
                            } else {
                                response = JSON.parse(response);
                                successCallback(response);
                            }


                        } else {
                            successCallback();
                        }
                    }, errorCallback, '恢复配置');
                },
                //保存
                saveConfigure: function (data, successCallback, errorCallback) {
                    var cache = [],
                        callback = function (data) {
                            io('saveConfigure', data, successCallback, errorCallback, '保存配置');
                        };

                    data = JSON.stringify(data, function (key, value) {
                        if (typeof value === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                // Circular reference found, discard key
                                return;
                            }
                            // Store value in our collection
                            cache.push(value);
                        }
                        return value;
                    });

                    if(!window.auiApp.isHttp){
                        data = data.replace(new RegExp(external.webContentPath.replace(/\(/g, '\\(').replace(/\)/g, '\\)'), 'g'), '##_AUI_PATH##');

                    }else{
                        /*const staticTargetPath=external.staticTargetPath.replace(/(\/){1,2}/g,'\\\\');
                        while(data.indexOf(staticTargetPath)!==-1){
                            data= data.replace(staticTargetPath,'##_AUI_PATH##')
                        }*/
                        data= data.replace(new RegExp(external.staticTargetPath,'g'),'##_AUI_PATH##')
                    }


                    data = JSON.parse(data);

                    //防止组件描述丢失
                    data.desp = data.desp || data.name || data.type;

                    delete data.belongTo;

                    if (auiApp.mode in MODE.WIDGET) {
                        delete data.action;
                        delete data.interfaces;
                        delete data.edm;
                        data.event && (delete data.event.handler);


                        if (!Bridge) {
                            require(['bridge'], function (bridge) {
                                Bridge = bridge;

                                if (!data.info) {
                                    Bridge.addInfo(data);
                                }
                                Bridge.reverseInfo(data);
                                //	Bridge.deleteEmptyProperty(data);


                                Bridge.changeWidgetPType(data);

                                callback(data);
                            });
                        } else {
                            //Bridge.deleteEmptyProperty(data);
                            if (!data.info) {
                                Bridge.addInfo(data);
                            }
                            Bridge.reverseInfo(data);

                            Bridge.changeWidgetPType(data);

                            callback(data);
                        }
                    } else {
                        callback(data);
                    }

                },
                //页面模型是否发生改变
                hasUpdateConfigure: function (successCallback) {
                    io('hasUpdateConfigure', '', successCallback, null);
                },

                //获取js代码
                /*
                 *   当href==='index'时，获取到index.js中的代码
                 * */
                getJsCode: function (data, successCallback, errorCallback) {
                    io('getJsCode', {
                        href: data.href
                    }, successCallback, errorCallback, '获取JS代码');
                },
                //保存js代码
                /*
                 *   当href==='index'时，保存到index.js中的代码
                 * */
                saveJsCode: function (data, successCallback, errorCallback) {
                    io('saveJsCode', {
                        href: data.href,
                        code: data.code
                    }, successCallback, errorCallback, '保存JS代码');
                },
                //获取配置
                getWidget: function (href, successCallback, errorCallback) {
                    io('getWidget', href, function (response) {
                        if (response) {
                            response = $.trim(response);

                            if (!Bridge) {
                                require(['bridge'], function (bridge) {
                                    Bridge = bridge;

                                    response = Bridge('WIDGET', response);

                                    successCallback(response);
                                });
                            } else {
                                response = Bridge('WIDGET', response);
                                successCallback(response);
                            }
                        } else {
                            successCallback(response);
                        }
                    }, errorCallback, '获取"' + href + '"组件');
                },

                /*
                 * 数据实体部分
                 * */
                getEDM: function (successCallback, errorCallback) {
                    io('getEDM', '', successCallback, errorCallback, '获取数据实体');
                },
                /*
                 * 获取Agree Bus 服务与场景列表
                 *
                 * */
                getAgreeBusEDM: function (successCallback, errorCallback) {
                    io('getAgreeBusEDM', '', successCallback, errorCallback);
                },
                /*
                 * 获取Agree Bus 场景字段列表
                 *
                 * data:{
                 *   serviceCode @string     服务码
                 *   sceneCode   @string     场景码
                 * }
                 *
                 * ret=[]
                 *
                 * code @string  场景码
                 *
                 * */
                getAgreeBusEDMDetail: function (data, successCallback, errorCallback) {
                    io('getAgreeBusEDMDetail', data, successCallback, errorCallback, '获取 Agree Bus 数据实体');
                },
                //获取正则列表
                getRegex: function (name, successCallback, errorCallback) {
                    /*
                     *
                     *   response=[{
                     *       regex:'正则表达式',
                     *       msg:'错误信息提示'
                     *   },{},…]
                     *
                     * */
                    io('getRegex', name, successCallback, errorCallback, '获取正则列表');
                },
                //添加正则项
                recordRegex: function (data) {
                    /*
                     *
                     *   data={
                     *       name:'',//字段的alias
                     *       regex:'正则表达式',
                     *       msg:'信息'
                     *
                     *   }
                     *
                     * */
                    io('recordRegex', data);

                },
                //删除正则式
                removeRegex: function (regex) {
                    io('removeRegex', regex);
                },


                //获取应用及数据字典列表
                getAppAndDictList: function (successCallback, errorCallback) {
                    /*successCallback([{
                     name:'应用1',
                     value:'app1',
                     dict:[{
                     name:'字典1',
                     value:'dict1'
                     },{
                     name:'字典2',
                     value:'dict2'
                     }]
                     },{
                     name:'应用2',
                     value:'app2',
                     dict:[{
                     name:'字典3',
                     value:'dict3'
                     },{
                     name:'字典4',
                     value:'dict4'
                     }]
                     }]);

                     return;*/
                    io('getAppAndDictList', '', successCallback, errorCallback, '获取应用及数据字典列表');
                },
                //创建自定义字段
                createField: function (data, successCallback, errorCallback) {
                    //data格式见virtualData/customField.js
                    io('getFieldRef', data, successCallback, errorCallback, '创建自定义字段');
                },

                //安全领域
                //获取权限角色列表
                getRole: function (successCallback, errorCallback) {
                    io('getRole', '', successCallback, errorCallback, '获取权限');
                },

                //数据交换
                //获取AUI文件内容`
                getFileContent: function (relativePath, successCallback, errorCallback) {
                    io('getFileContent', relativePath, successCallback, errorCallback, '获取文件内容');
                },
                //获取IDE文件内容
                getFile: function (path, successCallback, errorCallback) {

                    io('getFile', path, successCallback, errorCallback);

                },


                getConfigurePath: function (successCallback, errorCallback) {
                    io('getConfigurePath', '', successCallback, errorCallback, '获取当前文件路径');
                },

                saveFile: function (data, successCallback, errorCallback) {
                    /*
                     *   data={
                     *       fullPath:'',//IDE下的相对路径`/@projectName/webConfig/国际化配置.fbcpt`
                     *       content:''//
                     *   }
                     * */


                    io('saveFile', {
                        fullPath: data.fullPath,
                        content: data.content
                    }, successCallback, errorCallback, '保存“' + data.fullPath + '”中的文件内容');
                },

                //保存内容
                saveFileContent: function (data, successCallback, errorCallback) {
                    /*
                     *   data={
                     *       path:'',//相对路径，eg   ./dependence/AUI/help.json,
                     *       content:'{"a":"2"}'//json格式的内容
                     *   }
                     * */
                    io('saveFileContent', data, successCallback, errorCallback, '保存文件“' + data.path + '”');
                },


                //上传
                //获取上传图片的地址
                getImageUrl: function (dataUrl, successCallback, errorCallback, fileName) {
                    sendMessageToJava({
                        request: JSON.stringify({key: 'getImageUrl', value:dataUrl,fileName:(fileName || app.getUID())}),
                        onSuccess: function (response) {
                            if (response) {
                                successCallback(!window.auiApp.isHttp ? external.webContentPath + response.replace(/\\/g, '/') : response);
                            } else {
                                errorCallback && errorCallback();
                            }
                        },
                        onFailure: function (errorCode, errorMessage) {
                            external.alert('获取图片地址错误' + errorCode + '：' + errorMessage, external.alert.ERROR);
                            errorCallback && errorCallback();
                        }
                    });
                },
                getWebContentPath: function (successCallback, errorCallback) {
                    io('getWebContentPath', '', function (response) {
                        if (response) {
                            successCallback(response.replace(/\\/g, '/'));
                        } else {
                            errorCallback && errorCallback();
                        }
                    }, errorCallback, '获取网站路径错误');
                },

                //复制/剪切/粘贴
                copyWidget: function (data, successCallback, errorCallback) {
                    io('copyWidget', data, successCallback, errorCallback, '复制/剪切组件');
                },
                pasteWidget: function (successCallback, errorCallback) {
                    io('pasteWidget', '', successCallback, errorCallback, '获取剪切板数据');
                },

                //新版HTTP通信才有的接口
                compileCode: function (data, successCallback, errorCallback) {
                    io('compileCode', {
                        html: data.html,
                        js: data.js
                    }, successCallback, errorCallback, '编译代码');
                },
                isExist:function (fullPath,successCallback,errorCallback) {
                    io('isExist', {
                        fullPath:fullPath
                    }, successCallback, errorCallback);
                },
                getProjectType:function (successCallback,errorCallback) {
                    io('getProjectType', '', successCallback, errorCallback);
                },
                getPlugin:function (successCallback,errorCallback) {
                    io('getPlugin', '', successCallback, errorCallback);
                },
                savePlugin:function (data,successCallback,errorCallback) {
                    io('savePlugin', {
                        config: data.config,
                        code: data.code
                    }, successCallback, errorCallback, '保存插件');
                }

            };


        if (!window.sendMessageToJava) {
            if (window.auiApp.isHttp) {
                var search = document.location.search,
                    workspacePath, projectName,port;
                if (search.trim() === '') {
                    try {
                        search = window.parent.location.search;
                    } catch (err) {
                        console.log('跨域', err);
                    }
                }
                search = search.substr(1);
                workspacePath = getParams(search, 'workspacePath');
                projectName = getParams(search, 'projectName');
                port=getParams(search, 'port') || 7350;
                window.sendMessageToJava = function (options) {
                    $.ajax({
                        url: 'http://127.0.0.1:' + port + '/sendMessageToJava',
                        type: 'POST',
                        data: {
                            file: getParams(search, 'file'),
                            workspacePath: workspacePath,
                            projectName: projectName,
                            request: options.request
                        },
                        success: function (data) {
                            if(data.status){
                                options.onSuccess && options.onSuccess(data.content);
                            }else{
                                options.onFailure && options.onFailure(data.content);
                            }

                        },
                        error: function (data) {
                            options.onFailure && options.onFailure(data);
                        }
                    });
                };

                external.staticPath='http://127.0.0.1:'+port+'/projectSources';






            } else if (typeof window.connectToJava === 'function') {
                var queue = [];
                window.sendMessageToJava = function (data) {
                    queue.push(data);
                };
                window.connectToJava({
                    request: '',
                    onSuccess: function (response) {
                        if (typeof response === 'string') {
                            var arr, socket, identifier, sendMessageToJava;

                            arr = response.split(',');
                            socket = SocketIO(arr[0]);
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
                            window.sendMessageToJava = sendMessageToJava;
                        }
                    },
                    onFailure: function () {
                        external.alert('无法连接');
                    }
                });
            }

        }

        if(window.auiApp.RROTOCOL === CONST.PROTOCOL.HTTP){
            external.getProjectType(function (res) {//在vscode上 ,判断新目录还是旧目录

            },function () {

                external.getWebContentPath(function (path) {
                    external.webContentPath = path;
                    external.workSpacePath = path.replace(/\/[^\/]+\/WebContent$/, '\/');

                }, function () {

                    external.webContentPath = '';
                    external.workSpacePath = '';
                });

            });
        }else{
            external.getWebContentPath(function (path) {
                external.webContentPath = path;
                external.workSpacePath = path.replace(/\/[^\/]+\/WebContent$/, '\/');

            }, function () {

                external.webContentPath = '';
                external.workSpacePath = '';
            });
        }


        alert.ERROR = 'pink';

        external.getFileCount = 0;


        return external;
    });
})();