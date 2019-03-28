(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery"], factory);
        }
        // global
        else {
            factory();
        }
    })(function ($) {

        var cache = {},
            stack = [],
            ready = true,
            key, value, afterfix, i, item, result, queue, defer, requireMap, requireArr, result, path, temp,
            changeStack = function () {
                if (stack.length) {
                    load(stack.shift());
                } else {
                    ready = true;
                }
            },

            load = function (item) {
                var itemC = item,
                    data = item.data,
                    successCallback = function (result) {
                        itemC.successCallback && itemC.successCallback.apply(null, (result instanceof Array) ? result : [result]);
                        changeStack();
                    },
                    errorCallback = function () {
                        itemC.errorCallback && itemC.errorCallback();
                        changeStack();
                    };

                ready = false;

                if (typeof data !== 'string') {
                    key = data.key;
                    value = data.value;
                    path = data.path;
                } else {
                    key = data;
                }

                if (key === 'require') {
                    if (Array.isArray(value)) {
                        requireMap = {};
                        requireArr = [];
                        result = [];
                        for (i = value.length; item = value[--i];) {
                            if (cache[item]) {
                                requireMap[i] = cache[item];
                                result.unshift(cache[item]);
                                // console.log(item + '没有重复require')
                            } else {
                                requireMap[item] = i;
                                requireArr.push(item);
                                // console.log(item + ' require')
                            }
                        }

                        if (requireArr.length) {

                            require(requireArr, function () {
                                var i, item, result = [];
                                for (i = requireArr.length; item = requireArr[--i];) {
                                    requireMap[requireMap[item]] = cache[item] = (arguments[i] || 'undefined');
                                }

                                for (i = value.length - 1; i >= 0; i--) {
                                    result.unshift(requireMap[i]);
                                }

                                successCallback(result);


                            }, function () {
                                errorCallback();
                            });
                        } else {

                            successCallback(result);
                            // console.log(result);
                        }
                    }
                } else if (key === 'saveFile') {
                    if ((typeof value === 'string') && path) {
                        if ((cache[path] && cache[path] !== value) || !cache[path]) {

                            external.saveFile({
                                fullPath: path,
                                content: value
                            }, function () {
                                cache[path] = value;
                                successCallback(value);
                            }, errorCallback)
                        } else {
                            console.log('saved');
                            successCallback(value);
                        }
                    }
                } else {
                    afterfix = key.match(/\.[^\\.\/]+/i);
                    afterfix = afterfix && afterfix[0];


                    switch (afterfix) {
                        case '.css':
                            if (cache[key]) {
                                successCallback();

                            } else {
                                require('requireCss!' + key, function () {
                                    successCallback();

                                }, function () {
                                    errorCallback();
                                })
                            }
                            break;

                        case '.js':
                            if (cache[key]) {
                                successCallback(cache[key]);

                            } else {
                                require([key], function (res) {
                                    cache[key] = res;
                                    changeStack();
                                }, function () {
                                    errorCallback();
                                });
                            }
                            break;

                        default:

                            if (value && cache[value]) {
                                // console.log('缓存中获取' + value);
                                successCallback(cache[value]);

                            } else if (cache[key] && !value) {
                                // console.log('缓存中获取' + key);
                                successCallback(cache[key]);

                            } else {
                                switch (key) {

                                    case 'projectName':
                                        external.getProjectName(function (res) {
                                            cache[key] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'pageConfig':
                                        external.getPageConfig(function (res) {
                                            cache[key] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'dependenceConfig':
                                        external.getDependenceConfig(function (res) {
                                            cache[key] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'pageFlowStructure':
                                        external.getPageFlowStructure(function (res) {
                                            cache[key] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'projectTheme':
                                        external.getProjectTheme(function (res) {
                                            cache[key] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'menu':
                                        external.getMenu(function (res) {

                                            cache[key] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'configure':
                                        external.getConfigure(function (res) {
                                            cache[key] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'jsCode':
                                        external.getJsCode({
                                            href: value
                                        }, function (res) {
                                            cache[value] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'widget':
                                        external.getWidget(value, function (res) {
                                            cache[value] = res;
                                            successCallback(res);

                                        });
                                        break;

                                    case 'edm':
                                        external.getEdm(function (res) {
                                            cache[key] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'agreeBusEdm':
                                        external.getAgreeBusEDM(function (res) {
                                            cache[key] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'regex':
                                        external.getRegex(function (res) {
                                            cache[key] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'appAndDictList':
                                        external.getAppAndDictList(function (res) {
                                            cache[key] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'role':
                                        external.getRole(function (res) {
                                            cache[key] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'fileContent':
                                        external.getFileContent(value, function (res) {
                                            cache[value] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'file':
                                        // console.log(value);
                                        external.getFile(value, function (res) {
                                            cache[value] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'configurePath':
                                        external.getConfigurePath(function (res) {
                                            cache[key] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'imageUrl':
                                        external.getImageUrl(value, function (res) {
                                            cache[value] = res;
                                            successCallback(res);

                                        }, errorCallback);
                                        break;

                                    case 'webContentPath':
                                        external.getWebContentPath(function (res) {
                                            cache[key] = res;
                                            successCallback(res);

                                        });
                                        break;
                                    default:
                                        changeStack();
                                        break;
                                }
                            }
                            break;
                    }
                }
            };

        return function (data, successCallback, errorCallback) {

            stack.push({
                data: data,
                successCallback: successCallback,
                errorCallback: errorCallback
            });


            if (stack.length && ready) {
                load(stack.shift());
            }

        }

    })
})();