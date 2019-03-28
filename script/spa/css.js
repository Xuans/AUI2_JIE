/*!
 * Javascript library v3.0
 *
 * Date: 2017.09.01 重写
 */

/**
 * @author zhanghaixian@agree.com
 */
( /* <global> */ function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "index", "const", "template", 'config.css', 'base', 'Model.Data', 'uglifyjs'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, AUI, CONST, template, cssConfig, base, dataModel) {
        "use strict";

        var $CONTENT = $(CONST.PAGE.CONFIGURE_FRAME.CSS.CTN, CONST.PAGE.CONFIGURE_FRAME.CTN),
            CSS_CONFIG_SEARCH_ID = '#auiCssConfigSearch',
            THEME_VAR_START = '/*PROJECT-THEME-VAR_START*/\n',
            THEME_VAR_END = '\n/*PROJECT-THEME-VAR_END*/',
            REAL_REGULAR = /^[-+]?\d+(\.\d+)?/g,
            CURRENT_WIDGET_DATA,
            cssCodeCach = {},
            pageLessCach = '',
            cssCurrentWidgetID,
            hasResumedCode = false,
            hasResumed = false,
            copyResumeCode = false,
            refreshWidgetLock = false,
            cssdb = app.taffy(cssConfig),
            replaceRex = window.auiApp.isNewDir ? 'src/main/webapp' : 'WebRoot',
            replaceTag = window.auiApp.isNewDir ? 'target/webapp' : 'WebContent',
            awebPagePath = CONST.CONFIG_PATH[window.auiApp.FILE_TYPE].awebPage,
            dependencPagePath = CONST.CONFIG_PATH[window.auiApp.FILE_TYPE].awebDependencePage,
            themeVariablesPath = CONST.CONFIG_PATH[window.auiApp.FILE_TYPE].awebThemeVariable,
            themeVariablesCode = THEME_VAR_START + '\n@import "../AWEB/css/aweb.theme.variable.less";\n' + THEME_VAR_END,
            ret;

        // require(['base'], function (_base) {
        //     base = _base;
        // });

        function styleIsUpdate(style) {
            var key, item, ret = false, arr = [], i = 0;
            for (key in style) {
                if (style.hasOwnProperty(key)) {
                    arr.push(style[key]);
                }

            }

            while (typeof arr[i] === 'string' || typeof arr[i] === 'object' || typeof arr[i] === 'number') {
                item = arr[i];
                if (item && (typeof item === 'string' || typeof arr[i] === 'number')) {
                    ret = true;

                    break;
                } else if (typeof item === 'object') {
                    for (key in item) {
                        if (item.hasOwnProperty(key)) {
                            arr.push(item[key])
                        }
                    }
                }
                i++;
            }


            return ret;
        }

        function cssThemeUpdate(oWidget) {
            var css, cssCopy;
            if (oWidget && oWidget.length) {
                app.performance.longDelay(function () {
                    css = oWidget[0].data.css;
                    cssCopy = oWidget[0].data.cssCopy;
                    css && $(".auiConfigureCssCtt-cssCode-cssCode").children(":first-child")[css.cssCode ? 'addClass' : 'removeClass']('isUpdate');
                    css && cssCopy && $(".auiConfigureCssCtt-theme-function .ivu-panel-header")[css.theme && JSON.stringify(css.theme) !== JSON.stringify(cssCopy.defaultTheme) ? 'addClass' : 'removeClass']('isUpdate');
                })


            }
        }

        function getThemeVariablesString() {
            var i, item, variables = [],
                themeVariables = $AW.fresher && $AW.fresher.variables;
            
            if (themeVariables && themeVariables.length) {
                for (i = -1; item = themeVariables[++i];) {
                    if (item.name && item.defaultValue) {
                        variables.push('@' + item.name.replace(/[(\@)(\#)(\$)(\%)(\&)]+/g, '') + ':\t' + item.defaultValue + ';\t//' + item.desp + '');
                    }
                }
                return THEME_VAR_START + variables.join('\n') + THEME_VAR_END;
            } else {
                return '';
            }

        }

        function findStyleObject(elem) {
            return elem.name = 'style';
        }

        function findThemeObject(elem) {
            return elem.name = 'theme';
        }

        function transformCssobjThemeConfig(cssObj) {

            var cssObjCopy = JSON.parse(JSON.stringify(cssObj)),
                cssTheme = cssObjCopy.theme, objTheme, i;

            if (!$.isEmptyObject(cssTheme)) {
                for (i in cssTheme) {
                    objTheme = {};
                    objTheme[i] = cssTheme[i];
                    cssTheme[i] = objTheme;
                }
            }

            return cssObjCopy
        }

        function getCleanedCssConfig(cssCopyObj, cssArr) {
            var name, index, item, cursor = -1,
                cssCopyObjCopy = $.extend(true, {}, cssCopyObj),
                cache, objCache, objArrayCache, cssCopy,
                caches = [{
                    obj: cssCopyObjCopy,
                    objArray: cssArr
                }], theme, key;

            base.getCleanedOption(cssCopyObjCopy, cssArr);

            while (cache = caches[++cursor]) {
                objCache = cache.obj;
                objArrayCache = cache.objArray;


                if (objArrayCache) {
                    for (index = -1; item = objArrayCache[++index];) {
                        name = item.name;
                        switch (item.type) {
                            case 'object':
                                if ($.isEmptyObject(objCache[name]) && !item.reserve) {
                                    delete objCache[name];
                                } else {
                                    objCache[name] && caches.push({
                                        obj: objCache[name],
                                        objArray: item.attr
                                    });
                                }
                                break;
                            case 'input_append':
                            case 'css_input_select':
                            case 'string_select':

                                if (typeof objCache[name] === 'object') {
                                    if (objCache[name].selectValue === 'auto') {
                                        objCache[name].selectValue = ' auto';
                                    }
                                    objCache[name] = (objCache[name].inputValue || objCache[name].inputValue === 0 || objCache[name].inputValue === '0') ? objCache[name].inputValue + objCache[name].selectValue : '';
                                }
                                break;

                            case 'file':
                                if (objCache[name]) {
                                    objCache[name] = 'url("' + objCache[name] + '")';
                                }
                                break;


                        }
                    }
                    // $.each(objArrayCache, function (index, item) {
                    //
                    // });
                }
            }


            if (cssCopyObjCopy && !$.isEmptyObject(cssCopyObjCopy.theme)) {
                theme = cssCopyObjCopy.theme;
                for (key in theme) {
                    if (typeof theme[key] !== 'string') {
                        theme[key] = theme[key][key];
                    }
                }
            }

            return cssCopyObjCopy;
        }

        function turnCssConfigToArr(cssConfig) {
            var themeObj = {
                    expand: true,
                    name: 'theme',
                    type: 'object',
                    attr: [],
                    desp: '类名样式'
                },
                cssCodeObj = {
                    expand: true,
                    name: 'cssCode',
                    type: 'object',
                    attr: [
                        {

                            name: 'className',
                            desp: '类名',
                            type: 'string_input',
                            className: 'true'
                        },
                        {

                            name: 'cssCode',
                            desp: '代码',
                            type: "string_simpleHtml",
                            language: 'less',
                            focusable: false
                        }
                    ],
                    desp: '自定义样式'
                },
                styleObj = {
                    expand: true,
                    name: 'style',
                    type: 'object',
                    desp: '样式',
                    attr: []
                }, style, index, value, attrArray, allAttr, result = [];

            if (cssConfig) {
                if (style = cssConfig.style) {
                    for (index = -1; value = style[++index];) {
                        if (auiApp.mode !== CONST.MODE.DOCS) {

                            attrArray = JSON.parse(JSON.stringify(cssdb({
                                name: (typeof value.cssAttrs === 'string') && value.cssAttrs.split(' ')
                            }).get()))
                                .concat([
                                    {
                                        name: 'moreCss',
                                        divType: 'moreCss',
                                        type: 'directive_div',
                                        desp: 'moreCss',
                                        noAlert: true
                                    }
                                ]);
                            //转换配置项类型
                        } else {
                            attrArray = JSON.parse(JSON.stringify(cssdb({
                                name: (typeof value.cssAttrs === 'string') && value.cssAttrs.split(' ')
                            }).get()));
                        }
                        styleObj.attr.push({
                            name: value.name,
                            desp: value.desp,
                            type: 'object',
                            attr: attrArray
                        });
                    }
                }

                //添加一个自定义项，用于存储全量的css配置项
                if (auiApp.mode !== CONST.MODE.DOCS) {
                    allAttr = JSON.parse(JSON.stringify(cssdb({name: getAllCssAttrString().split(' ')}).get()));
                    styleObj.attr.push({
                        name: 'allAttr',
                        type: 'object',
                        attr: allAttr
                    });
                }

                if (CURRENT_WIDGET_DATA) {
                    CURRENT_WIDGET_DATA['allAttrMap'] = {};
                    allAttr.forEach(function (elem) {
                        CURRENT_WIDGET_DATA['allAttrMap'][elem.name] = elem;
                    })
                }
                if ($.isArray(cssConfig.theme)) {
                    cssConfig.theme.map(function (x) {
                        x.type = "css_theme_select";
                        x.style = 'height: auto'
                    });
                    themeObj.attr = cssConfig.theme;
                }

                if (auiApp.mode === CONST.MODE.THEME) {
                    themeObj.hidden = true;

                } else if (!themeObj.attr || !themeObj.attr.length) {
                    themeObj.hidden = true;
                }

                if (!styleObj.attr || !styleObj.attr.length) {
                    styleObj.hidden = true;
                }

                if ((auiApp.mode === CONST.MODE.THEME) || (auiApp.mode === CONST.MODE.DOCS)) {
                    result = [themeObj, styleObj];
                } else if (!aweb.fresher) {
                    result = [themeObj, cssCodeObj];
                } else {
                    result = [themeObj, cssCodeObj, styleObj];
                }

            }

            return result;
        }

        function turnForOldVersion(cssObj, cssArr) {
            var styleConfigAttr = cssArr.find(findStyleObject).attr,
                cstyle = cssObj.style, sConfigAttrMap = {}, i,
                z, cAttrMap={}, styleObj, cAttr,
                allAttrMap = CURRENT_WIDGET_DATA['allAttrMap'];

            styleConfigAttr.forEach(function (elem) {
                sConfigAttrMap[elem.name] = elem;
            });

            if (styleConfigAttr.length > Object.keys(cstyle).length) {
                styleConfigAttr.forEach(function (elem) {
                    cAttr = elem.attr;
                    styleObj = cstyle[elem.name];

                    cAttr.forEach(function (item) {
                        cAttrMap[item.name] = item;
                    });

                    if (!styleObj) {
                        cstyle[elem.name] = {};
                    } else {
                        for (i in styleObj) {
                            if (!cAttrMap[i]) {

                                cAttr.push(allAttrMap[i])
                            }
                        }

                    }

                })
            } else if (styleConfigAttr.length < Object.keys(cstyle).length) {

                for (z in cstyle) {
                    if (!sConfigAttrMap[z]) {
                        delete cstyle.z;
                    } else {
                        cAttr = sConfigAttrMap[z].attr;
                        styleObj = cstyle[z];
                        cAttr.forEach(function (item) {
                            cAttrMap[item.name] = item;
                        });

                        for (i in styleObj) {
                            if (!cAttrMap[i]) {

                                cAttr.push(allAttrMap[i])
                            }
                        }


                    }
                }
            }
            console.log('af', cssObj);
            console.log('af', cssArr)
        }


        function getAllCssAttrString() {
            var allCssAttrArray = cssdb().get(),
                allCssAttrString, len, i, tempArray = [];

            for (i = 0, len = allCssAttrArray.length; i < len; i++) {
                tempArray.push(allCssAttrArray[i].name);
            }

            allCssAttrString = tempArray.join(' ');

            return allCssAttrString;

        }

        function deleteAllAttr(cssCopy, cssArr) {

            var i, item, j, value;

            cssCopy['style'] && delete cssCopy['style']['allAttr'];

            for (i = -1; item = cssArr[++i];) {
                if (item.name === 'style') {
                    for (j = -1; value = item.attr[++j];) {
                        if (item.name === 'allAttr') {
                            item.attr.splice(i, 1);
                        }
                    }
                }
            }

        }

        //经过此方法，cssobj = struct里面的csscopy，而cssArr = 符合新版base的配置项类型
        function cssConfigInitInstance(cssObj, cssArr, isResumed) {

            var cache, cursor = -1, temp,
                itemCopy, point, forLength,
                instanceCache, arrayCache,
                i, item,
                name, type, variablesName,
                index, value, itemType,
                defaultTheme = {}, defaultThemeObj,
                variables = $AW.fresher && $AW.fresher.variablesCopy,
                caches = [{
                    cssObj: cssObj || {},
                    cssArray: cssArr
                }];

            while (cache = caches[++cursor]) {
                instanceCache = cache.cssObj;
                arrayCache = cache.cssArray;

                if (instanceCache && $.isArray(arrayCache)) {
                    for (i = -1; item = arrayCache[++i];) {

                        name = item.name;
                        type = item.type;


                        switch (type) {
                            case 'object':
                                if ($.isArray(item.attr)) {

                                    if (instanceCache && typeof instanceCache[name] !== 'object') {
                                        instanceCache[name] = {};
                                    }

                                    caches.push({
                                        cssObj: instanceCache[name] || {},
                                        cssArray: item.attr
                                    });

                                    if (name !== 'cssCode' && !isResumed) {

                                        if (!CURRENT_WIDGET_DATA) {
                                            CURRENT_WIDGET_DATA = {
                                                cssArr: {}
                                            };
                                        }

                                        CURRENT_WIDGET_DATA['cssArr'][name] = {
                                            name: item.name,
                                            desp: item.desp,
                                            closable: item.closable || false,
                                            attr: item.attr
                                        };
                                    }
                                }
                                break;

                            case 'css_input_select':
                            case 'input_append':
                                item.type = 'input_append';
                                item.appendOption = ['px', 'em', 'rem', '%', 'auto', 'ex','ch','vw','vh','vmin','vmax','cm','mm','in','pc','pt',''];
                                item.appendOptionDesp = ['px', 'em', 'rem', '%', 'auto','ex','ch','vw','vh','vmin','vmax','厘米','毫米','英寸','pc','pt','空'];

                                item.spanType = 'list';
                                item.selectNum = 1;
                                item.keepFormat = true;

                                if ((typeof instanceCache[name] === 'string' && instanceCache[name] !== '') && !instanceCache[name].match(/^@.*/)) {
                                
                                    instanceCache[name] = instanceCache[name].replace(/\s/g, '');
                                    for (point = 0, forLength = item.appendOption.length; point < forLength; point++) {
                                        if (instanceCache[name].indexOf(item.appendOption[point]) !== -1 && instanceCache[name].substr(0, instanceCache[name].indexOf(item.appendOption[point])).replace(REAL_REGULAR, '') === '') {
                                            temp = item.appendOption[point];
                                            break;
                                        }
                                    }
                                    instanceCache[name] = {
                                        inputValue: temp && instanceCache[name].substr(0, instanceCache[name].length - temp.length) || '',
                                        selectValue: temp || item.appendOption[5]
                                    };

                                } else {
                                    instanceCache[name] = instanceCache[name] || {
                                            inputValue: '',
                                            selectValue: ''
                                        };
                                }

                                break;

                            case 'css_string_input':
                                item.type = 'string_input';
                                if (instanceCache[name] === 0 || instanceCache[name] === '0') {
                                    instanceCache[name] = instanceCache[name]
                                } else {
                                    instanceCache[name] = instanceCache[name] || '';
                                }

                                break;

                            case 'string_input':

                                if (item.className) {
                                    if (isResumed) {

                                        instanceCache[name] = instanceCache[name] || '';
                                    } else {
                                        instanceCache[name] = instanceCache[name] || CURRENT_WIDGET_DATA.widgetClass;
                                    }

                                } else {

                                    if (instanceCache[name] === 0 || instanceCache[name] === '0') {
                                        instanceCache[name] = instanceCache[name];
                                    } else {
                                        instanceCache[name] = instanceCache[name] || '';
                                    }
                                }
                                break;

                            case 'string_simpleHtml':

                                if (isResumed) {
                                    instanceCache[name] = cssCodeCach[CURRENT_WIDGET_DATA.widgetID] || instanceCache[name] || '';
                                } else {
                                    instanceCache[name] = cssCodeCach[CURRENT_WIDGET_DATA.widgetID] || instanceCache[name] || (CURRENT_WIDGET_DATA.widgetClass ? '\t.' + CURRENT_WIDGET_DATA.widgetClass + '{\n\n\t\t\n\n\t}' : '');
                                }

                                break;
                            case 'css_img_url':
                                item.type = 'file';
                                instanceCache[name] = instanceCache[name] || '';

                                break;

                            case 'color_pick':
                                item.type = 'colorPicker';
                                instanceCache[name] = instanceCache[name] || '';
                                break;

                            case 'css_theme_select':
                                itemCopy = JSON.parse(JSON.stringify(item));
                                itemCopy.type = 'directive_div';
                                itemCopy.noAlert = true;
                                itemCopy.divType = item.type;

                                item.type = 'object';
                                item.expand = true;
                                item.attr = [itemCopy];

                                defaultTheme[item.name] = item.valueArray[0];

                                if (!isResumed) {
                                    defaultThemeObj = CURRENT_WIDGET_DATA['defaultTheme'];
                                    if (!defaultThemeObj[item.name]) {
                                        defaultThemeObj[item.name] = defaultTheme[item.name]
                                    }
                                }

                                if (!instanceCache[name] || !instanceCache[name][name]) {

                                    instanceCache[name] = defaultTheme;


                                } else {

                                    instanceCache[name] = instanceCache[name]

                                }


                                break;

                        }


                        if (variables && variables.hasOwnProperty(item.name)) {


                            if ((itemType = item.type) !== 'string_select') {
                                item.canSwap = true; //是否开启切换
                                item.spanType = 'list';
                                item.selectNum = 1;
                                item.valueArray = [''];
                                item.despArray = ['默认'];

                                if ((!instanceCache[name]) && instanceCache[name] !== 0 && instanceCache[name] !== '0') {
                                    if (!item.oldType) {
                                        item.type = 'string_select';
                                        item.oldType = itemType;
                                    }
                                } else if (typeof instanceCache[name] === 'object' && !instanceCache[name].inputValue && !instanceCache[name].selectValue) {
                                    if (!item.oldType) {
                                        item.type = 'string_select';
                                        item.oldType = itemType;
                                        instanceCache[name] = '';
                                    }
                                }
                            }
                            variablesName = variables[item.name];
                            if (variablesName) {
                                for (index = -1; value = variablesName[++index];) {
                                    item.valueArray.push(value.name);
                                    item.despArray.push(value.desp);
                                }
                            }
                        }


                        if ((typeof instanceCache[name] === 'string') && instanceCache[name].match(/^@.*/)) {
                            if (item.type !== 'string_select') {

                                if (!item.oldType) {
                                    item.canSwap = true;
                                    item.spanType = 'list';
                                    item.oldType = item.type;
                                    item.type = 'string_select';
                                }
                            }
                        } else if (item.name !== 'className') {
                            if (item.type !== 'string_select' && !item.oldType) {
                                item.canSwap = true;
                                item.spanType = 'list';
                                item.oldType = 'string_select';
                            }
                        }


                    }

                }

            }


            return cssObj;

        }

        function showCssConfigPanel($context, oWidget, cssCopy, cssConfig) {
            var cssArrCopy = JSON.parse(JSON.stringify(cssConfig)),
                cssObjCopy = JSON.parse(JSON.stringify(cssCopy)),
                modelselector, i, item, vueInstance;


            if (Object.keys(cssObjCopy.style).length > 1) {
                for (i = -1; item = cssArrCopy[++i];) {
                    if (item.name === 'style') {
                        item.attr = [{
                            name: 'configPanel',
                            divType: 'configPanel',
                            type: 'directive_div',
                            desp: 'configPanel',
                            noAlert: true
                        }]
                    }
                }
                cssObjCopy.style = {configPanel: ""}
            } else {
                if (cssArrCopy.length === 3 && cssArrCopy[2].attr.length < 2) {
                    cssArrCopy.splice(2, 1);
                    cssObjCopy.style = {};
                } else if (cssArrCopy.length === 2 && cssArrCopy[1].attr.length < 2) {
                    cssArrCopy.splice(1, 1);
                    cssObjCopy.style = {};
                }
            }


            vueInstance = base.baseConfig($context.attr('id'), cssObjCopy, cssArrCopy, function (arg) {


                var cssCode, uid = oWidget && oWidget[0].widgetID;

                CURRENT_WIDGET_DATA['widgetID'] = uid;

                CURRENT_WIDGET_DATA['cssCopyObj'].theme = arg.newObjCopy.theme;
                CURRENT_WIDGET_DATA['cssCopyObj'].cssCode = arg.newObjCopy.cssCode;

                if (arg.newObjCopy.cssCode && arg.newObjCopy.cssCode.className) {

                    CURRENT_WIDGET_DATA.widgetClass = arg.newObjCopy.cssCode.className;

                    cssCode = arg.newObjCopy.cssCode.cssCode;


                    cssCode = cssCode.replace(/^[\n\t]*(?=\.)(.+)$/m, '$1').replace(/^\.[^{]+/g, '\t.' + CURRENT_WIDGET_DATA.widgetClass);

                    if (cssCode.substring(cssCode.lastIndexOf('}') - 1, cssCode.lastIndexOf('}')) !== '\t') {  //如果用户写的代码里最后一个‘}’没有缩进，就给他加上缩进

                        cssCode = cssCode.substr(0, cssCode.lastIndexOf('}') - 1) + '\t}';
                    }

                    vueInstance.obj.cssCode.cssCode = cssCode;
                    CURRENT_WIDGET_DATA['cssCopyObj'].cssCode.cssCode = cssCode;

                    cssCodeCach[uid] = cssCode;

                    saveCssCode(oWidget);

                    $AW.updateDomCustomClass(CURRENT_WIDGET_DATA.widgetClass, oWidget[0].widgetID);

                }
                if (arg.modelSelector) {
                    modelselector = arg.modelSelector;
                    modelselector = modelselector.substring(0, modelselector.lastIndexOf("["));
                    arg.modelSelector = modelselector.replace('instanceObj', "widgetInstance['css']");
                }
                refreshWidget(oWidget, arg);

                cssThemeUpdate(oWidget);

            });

            cssThemeUpdate(oWidget);


        }

        function saveCssCode(oWidget) {
            var path, i, data,
                projectName = auiApp.io.projectName,
                uid = CURRENT_WIDGET_DATA['widgetID'],
                cssCode = cssCodeCach[uid] || '',//新的css代码
                pre = '/*' + uid + '_START*/',
                nex = '/*' + uid + '_END*/',
                nexLen = nex.length,
                start = '\t/*' + uid + '_START*/\n',
                end = '\n\t/*' + uid + '_END*/\n\n';

            if (!cssCode.substring(cssCode.indexOf('{') + 1, cssCode.lastIndexOf('}')).replace(/[\r\n\t]/g, '').length > 0) {
                cssCode = '';
            }

            if (projectName) {
                // path = projectName + '/WebRoot/dependence/AWEB/css/aweb.page.less';
                if (oWidget) {
                    if (pageLessCach.indexOf(pre) >= 0 && pageLessCach.indexOf(nex) >= 0) {
//替换

                        //老的css代码
                        data = pageLessCach.substring(pageLessCach.indexOf(pre), pageLessCach.indexOf(nex) + nexLen);

                        if (cssCode) {
                            pageLessCach = pageLessCach.replace(data, pre + '\n' + cssCode + '\n\t' + nex);
                        } else {
                            pageLessCach = pageLessCach.replace(data, '');
                        }


                    } else {
                        //新加
                        if (pageLessCach.indexOf('.default-theme') >= 0) {
                            if (cssCode) {
                                pageLessCach = pageLessCach.substr(0, pageLessCach.lastIndexOf('}')) + start + cssCode + end + '}';
                            }
                        } else if (!pageLessCach) {

                            pageLessCach = '.default-theme{\n' + start + cssCode + end + '}';
                        }

                    }
                }
                saveAndCompileLess(pageLessCach, function () {
                    if (oWidget) {
                        $AW.trigger($AW.STATUS.CSS_CODE_UPDATE, oWidget);
                    }
                })


                //     external.saveFile({
                //         fullPath: awebPagePath,
                //         content: pageLessCach
                //     }, function () {
                //         // external.saveFile({  //同时保存到webContent里面
                //         //     fullPath: path.replace(/WebRoot/, 'WebContent'),
                //         //     content: pageLessCach
                //         // });
                //         external.compileCss({
                //             source: path,
                //             target: path.replace(/less/, 'css').replace(/WebRoot/, 'WebContent')
                //         }, function () {
                //             if (oWidget) {
                //                 $AW.trigger($AW.STATUS.CSS_CODE_UPDATE, oWidget);
                //             }
                //         })
                //     })
                // }


            }
        }

        function resumeCssCode() {

            var projectName = auiApp.io.projectName, path, webPath,
                updateCodeCach = function (LessCach) {
                    var data, start, startLen, end, pre, next, oldData,
                        allWidget, cssCodeData, codeStr, i, item, endLen,
                        varsStr, newVarsStr;

                    allWidget = dataModel.get('structure')().get();

                    codeStr = LessCach && LessCach.substring(LessCach.indexOf('{') + 1, LessCach.lastIndexOf('}')); //如果内容里面有default-theme 全部清空
                    if (!LessCach) {
                        saveThemeVariablesLess(getThemeVariablesString());
                        LessCach = themeVariablesCode + "\n\n\n\n.default-theme{\n\n}";
                    }
                    if (codeStr && codeStr.indexOf('.default-theme') >= 0) {
                        LessCach = LessCach.replace(codeStr, '\n\n');
                    }
                    if (LessCach.indexOf(THEME_VAR_START) === -1 && LessCach.indexOf(THEME_VAR_END) === -1) {
                        LessCach = themeVariablesCode+ '\n\n\n\n' + LessCach;
                    } else {
                        //varsStr = LessCach.substring(LessCach.indexOf(THEME_VAR_START), LessCach.indexOf(THEME_VAR_END) + THEME_VAR_END.length);
                        // newVarsStr = getThemeVariablesString();
                        // LessCach = LessCach.replace(varsStr, newVarsStr);
                        saveThemeVariablesLess(getThemeVariablesString())
                    }

                    for (i = -1; item = allWidget[++i];) {
                        start = '/*' + item.widgetID + '_START*/';
                        end = '/*' + item.widgetID + '_END*/';
                        pre = '\t/*' + item.widgetID + '_START*/\n';
                        startLen = start.length;
                        endLen = end.length;
                        next = '\n\t/*' + item.widgetID + '_END*/\n\n';

                        if (!item.css || !item.css.cssCode || !item.css.cssCode.className) { //只要该组件的structure里面没有cssCode的东西，但是如果less里面有，那就要删除掉，以免出现冗余less代码。

                            if (LessCach.indexOf(start) >= 0 && LessCach.indexOf(end) >= 0) {
                                data = LessCach.substring(LessCach.indexOf(start) + startLen, LessCach.indexOf(end));
                                LessCach = LessCach.replace(start + data + end, '');
                            }

                        }

                        if (item.css && item.css.cssCode) {

                            if (item.cssCopy.cssCode && (codeStr = item.cssCopy.cssCode.cssCode)) { // copy里面有
                                if (codeStr.indexOf('.default-theme') >= 0 || codeStr.indexOf(start) >= 0 || codeStr.indexOf(end) >= 0) { //如果less代码是错乱的，不做恢复处理
                                    delete item.cssCopy.cssCode;
                                    delete item.css.cssCode;
                                } else {

                                    if (LessCach && (LessCach.indexOf(start) === -1 && LessCach.indexOf(end) === -1)) {  //如果less里面没有，那就回填
                                        cssCodeData = pre + codeStr + next;
                                        LessCach = LessCach.substr(0, LessCach.lastIndexOf('}')) + cssCodeData + '}';
                                    } else {  //copy里面有 less里面也有  同步首页布局改的代码

                                        data = LessCach.substring(LessCach.indexOf(start) + startLen, LessCach.indexOf(end));

                                        if (data.substring(data.indexOf('.') + 1, data.indexOf('{')) !== item.css.cssCode.className) {  //对于那种改了类名又忘记保存的情况
                                            data = data.replace(/^[\n\t]*(?=\.)(.+)$/m, '$1').replace(/^\.[^{]+/g, '\t.' + item.css.cssCode.className);
                                            oldData = LessCach.substring(LessCach.indexOf(start), LessCach.indexOf(end) + endLen);
                                            LessCach = LessCach.replace(oldData, start + '\n' + data + '\n\t' + end);
                                        }

                                        if (data !== codeStr) {
                                            codeStr = data;
                                        }
                                    }
                                    cssCodeCach[item.widgetID] = codeStr; //用于恢复css
                                }

                            } else { // copy里面没有，如果less里面有，那就恢复到structure里面来

                                if (LessCach.indexOf(start) > 0 && LessCach.indexOf(end) > 0) {
                                    codeStr = LessCach.substring(LessCach.indexOf(start) + startLen, LessCach.indexOf(end));
                                    if (codeStr) {
                                        if (codeStr.indexOf('.default-theme') >= 0 || codeStr.indexOf(start) >= 0 || codeStr.indexOf(end) >= 0 || codeStr.indexOf('undefined') >= 0) { //如果less代码是错乱的，不做恢复处理
                                            delete item.cssCopy.cssCode;
                                            delete item.css.cssCode;
                                            LessCach.replace(start + codeStr + end, '');
                                        } else {
                                            if (item.cssCopy && item.cssCopy.cssCode && !item.cssCopy.cssCode.cssCode) { //兼容没有保存code的老版
                                                // console.log('兼容老版');
                                                item.cssCopy.cssCode.cssCode = codeStr;
                                            }
                                            cssCodeCach[item.widgetID] = codeStr; //用于恢复css
                                        }
                                    }

                                }

                            }

                        }
                    }

                    return LessCach;

                }, reUpdateMainPanelCssCode = function () {
                    var mpWidget, mpWidgetData, newCopy;
                    mpWidgetData = dataModel.get('structure')({type: CONST.WIDGET.PAGE_TYPE}).first();
                    if (mpWidgetData.css && mpWidgetData.css.cssCode) {
                        newCopy = JSON.parse(JSON.stringify(mpWidgetData.cssCopy));
                        newCopy.cssCode.cssCode = cssCodeCach[mpWidgetData.widgetID];
                        mpWidget = $AW(mpWidgetData.widgetID);
                        mpWidget.update({
                            cssCopy: newCopy
                        });
                        cssConfigure($CONTENT, mpWidget)
                    }
                };
            if (projectName) {

                if (dataModel.get('pageModule') && dataModel.get('pageName')) {
                     path = dependencPagePath.replace('@projectName', auiApp.io.projectName) + '/' + dataModel.get('pageModule') + '-' + dataModel.get('pageName') + '_' + dataModel.get('uuid') + '.less'
                } else {
                     path = dependencPagePath.replace('@projectName', auiApp.io.projectName) + '/index.layout.less'

                }

                if (!hasResumedCode || copyResumeCode) {
                    external.getFile(path, function (respons) {

                        pageLessCach = updateCodeCach(respons);

                        reUpdateMainPanelCssCode();

                        //在初始加载页面时,无论webContent有没有aweb.page.css or less文件，在对less文件去除冗余代码后都保存重新编译一次。

                        saveAndCompileLess(pageLessCach);
                        // external.saveFile({
                        //     fullPath: path,
                        //     content: pageLessCach
                        // }, function () {
                        //     external.compileCss({
                        //         source: path,
                        //         target: path.replace(/\.less$/, '.css').replace(new RegExp(replaceRex), replaceTag)
                        //     });
                        // });

                        // if (!window.auiApp.isNewDir) {
                        //     webPath = path.replace(/WebRoot/, 'WebContent');
                        //     external.saveFile({  //同时保存到webContent里面
                        //         fullPath: webPath,
                        //         content: pageLessCach
                        //     });
                        // }


                    }, function () {

                            pageLessCach = updateCodeCach(themeVariablesCode+"\n\n\n\n.default-theme{\n\n}");

                        saveCssCode(undefined)
                    });

                    hasResumedCode = true;
                    copyResumeCode = false;
                }
            }

        }

        function cleanCssCode(oWidget) {
            var widgetDatas, widgetIns,
                i, item, start, end, endLen, data,
                replaceUnableCode = function (widgetData) {
                    var start = '/*' + widgetData.widgetID + '_START*/';
                    end = '/*' + widgetData.widgetID + '_END*/';
                    endLen = end.length;
                    if (pageLessCach) {
                        if (widgetData.css && widgetData.css.cssCode && widgetData.css.cssCode.className) {
                            if (pageLessCach.indexOf(start) >= 0 && pageLessCach.indexOf(end) >= 0) {
                                data = pageLessCach.substring(pageLessCach.indexOf(start), pageLessCach.indexOf(end) + endLen);
                                pageLessCach = pageLessCach.replace(data, '');
                            }
                        }
                    }
                };

            if (!oWidget) {
                widgetDatas = dataModel.get('structure')().get();
                for (i = -1; item = widgetDatas[++i];) {
                    replaceUnableCode(item);
                }
            } else if (oWidget === CONST.PAGE.CONFIGURE_FRAME.CSS.STATUS_OF_THEME) { //首页布局切换主题
                saveThemeVariablesLess(getThemeVariablesString());
                pageLessCach = themeVariablesCode+"\n\n\n\n.default-theme{\n\n}"
            } else {
                widgetIns = oWidget[0].data;
                replaceUnableCode(widgetIns);
            }

            saveCssCode(undefined);
        }

        function refreshWidget(oWidget, arg) {
            var
                cssCopy = JSON.parse(JSON.stringify(CURRENT_WIDGET_DATA['cssCopyObj'])),
                cssConfigArr = JSON.parse(JSON.stringify(CURRENT_WIDGET_DATA['cssConfigArr'])),
                defaultTheme = JSON.parse(JSON.stringify(CURRENT_WIDGET_DATA['defaultTheme'])),
                css, cssCode, className;

            //去掉AllAttr
            deleteAllAttr(cssCopy, cssConfigArr);

            css = getCleanedCssConfig(cssCopy, cssConfigArr); //cssCopy->css

            if (!$.isEmptyObject(defaultTheme) && cssCopy.theme) {
                cssCopy.defaultTheme = defaultTheme;
            }
            if (css.defaultTheme) {
                delete css.defaultTheme;
            }

            if (cssCopy.cssCode) {
                cssCode = cssCopy.cssCode.cssCode;
                if (!cssCode) {
                    delete css.cssCode;
                    delete cssCopy.cssCode;
                } else if (!(cssCode.substring(cssCode.indexOf('{') + 1, cssCode.lastIndexOf('}')).replace(/[\r\n\t]/g, '').length > 0)) {
                    delete css.cssCode;
                    delete cssCopy.cssCode;
                } else {
                    delete css.cssCode.cssCode;
                }
            }

            oWidget.update({
                cssCopy: cssCopy,
                css: css  //cssCopy->css
            });

            if (arg.key !== 'cssCode') {
                $AW.trigger($AW.STATUS.CSS_UPDATE, oWidget);
            }


            if (arg && arg.modelSelector) {
                oWidget.refresh(true, undefined, undefined, {
                    type: CONST.WIDGET.EVENT_TYPE.VALUE_CHANGE,
                    target: 'css',
                    modelSelector: arg.modelSelector
                });
            }
        }


        function getUpdatedCssConfig(cssCopy, cssConfigArr, isResumed, needCheck) {
            var cssCopyStyle,
                i, item, selectItem, mCssCopy, key, j, value, temp, curDataCssArr,
                cssStyleMap = {}, mCssArr, cssArrMap, tempArr, allAttr;


            cssCopyStyle = cssCopy.style;

            //数据准备
            for (i = -1; item = cssConfigArr[++i];) {
                if (item.name === 'style') {
                    for (j = -1; value = item.attr[++j];) {
                        cssStyleMap[value.name] = value.attr;
                    }
                }
            }

            for (selectItem in cssCopyStyle) {
                cssArrMap = {};
                if (selectItem && cssStyleMap.hasOwnProperty(selectItem)) {
                    mCssCopy = cssCopyStyle[selectItem];
                    mCssArr = cssStyleMap[selectItem] || [];
                    allAttr = cssStyleMap["allAttr"];
                    //必要的提前展示的配置项
                    for (i = -1; item = mCssArr[++i];) {
                        cssArrMap[item.name] = item;
                    }
                    tempArr = [].concat(mCssArr);

                    //如果更多里面有值则一起存到temArr中
                    for (key in mCssCopy) {

                        if (mCssCopy.hasOwnProperty(key)) {
                            if (typeof mCssCopy[key] === 'object') { //input_append 类型
                                if (mCssCopy[key].selectValue || mCssCopy[key].inputValue) {
                                    for (i = -1; item = allAttr[++i];) {
                                        if (item.name === key && !cssArrMap[key]) {
                                            tempArr.unshift(item);
                                            break;
                                        }
                                    }
                                } else if (!cssArrMap[key]) {
                                    //删除组件csscopy里面的空白配置项
                                    delete mCssCopy[key];
                                }
                            } else if (typeof mCssCopy[key] !== 'object' && (mCssCopy[key] || mCssCopy[key] === 0 || mCssCopy[key] === '0')) {  //其他 类型

                                for (i = -1; item = allAttr[++i];) {
                                    item = JSON.parse(JSON.stringify(item));
                                    if (cssArrMap[key] && cssArrMap[key].valueArray && cssArrMap[key].valueArray.length) {
                                        if ((!mCssCopy[key].toString().match(/^@.*/) && cssArrMap[key].oldType !== 'string_select') || ((mCssCopy[key].toString().match(/^@.*/) && cssArrMap[key].oldType === 'string_select'))) {
                                            temp = cssArrMap[key].oldType;
                                            cssArrMap[key].oldType = cssArrMap[key].type;
                                            cssArrMap[key].type = temp;
                                        }

                                    }
                                    if (item.name === key && !cssArrMap[key]) {
                                        if ((item.valueArray && item.valueArray.length && !mCssCopy[key].toString().match(/^@.*/) && item.oldType !== 'string_select' ) || (mCssCopy[key].toString().match(/^@.*/) && item.oldType === 'string_select')) {
                                            temp = item.oldType;
                                            item.oldType = item.type;
                                            item.type = temp;
                                        }
                                        tempArr.unshift(item);
                                        break;
                                    }

                                }
                            } else if (!cssArrMap[key]) {
                                delete mCssCopy[key];
                            }

                        } else if (!cssArrMap[key]) {

                            //删除组件csscopy里面的空白配置项
                            delete mCssCopy[key];
                        }
                    }

                    mCssArr = tempArr;

                    if (!isResumed) {

                        CURRENT_WIDGET_DATA['cssArr'][selectItem] && (CURRENT_WIDGET_DATA['cssArr'][selectItem].attr = JSON.parse(JSON.stringify(mCssArr)));
                    }

                    //最后根据最终的CssConfigArr更新全局数据缓存里面的 cssConfigArr，以便等一下updatewidget的时候达到对象和数组数据同步
                    for (i = -1; item = cssConfigArr[++i];) {
                        if (item.name === 'style') {
                            for (j = -1; value = item.attr[++j];) {
                                if (value.name === selectItem) {

                                    value.attr = mCssArr;
                                }
                            }
                        }
                    }
                }
            }

            return cssConfigArr;

        }

        function resumeCssConfig(oWidget, resumeCode) {

            var elem = oWidget[0], css,
                widgetID = elem.widgetID,
                widgetInstance = elem.data, cssConfig,
                cssConfigArr, themeObject,
                cssObj = widgetInstance.css || {}, cssCopy, defaultTheme,
                styleObject;

            CURRENT_WIDGET_DATA = CURRENT_WIDGET_DATA || {};

            CURRENT_WIDGET_DATA['defaultTheme'] = CURRENT_WIDGET_DATA['defaultTheme'] || {};
            CURRENT_WIDGET_DATA.widgetID = widgetID || '';
            CURRENT_WIDGET_DATA.widgetClass = '';


            copyResumeCode = resumeCode;

            if (!hasResumedCode || copyResumeCode) {

                resumeCssCode();
            }
            hasResumed = true;

            if ((cssConfig = elem.widget.css)) {

                cssConfig = JSON.parse(JSON.stringify((cssConfig)));
                if (!$.isArray(cssConfig)) {
                    cssConfigArr = turnCssConfigToArr(cssConfig);
                }

                if (widgetInstance.cssCopy && widgetInstance.cssCopy.cssCode && (!cssObj.cssCode || !cssObj.cssCode.className)) {
                    delete widgetInstance.cssCopy.cssCode;
                }

                if (widgetInstance.cssCopy) {


                    cssConfigInitInstance(widgetInstance.cssCopy, cssConfigArr, true);


                    cssConfigArr = getUpdatedCssConfig(widgetInstance.cssCopy, cssConfigArr, true);


                } else {
                    if (!$.isEmptyObject(cssObj) && cssObj.style) {

                        turnForOldVersion(cssObj, cssConfigArr)

                    }
                    //如果css配置里面的theme有内容，先将theme配置转成对象。主要兼容老版
                    if (!$.isEmptyObject(cssObj)) {
                        cssObj = transformCssobjThemeConfig(cssObj);
                    }


                    widgetInstance.cssCopy = cssConfigInitInstance(JSON.parse(JSON.stringify(cssObj)), cssConfigArr, true);
                }

                cssCopy = widgetInstance.cssCopy;

                //去掉AllAttr
                deleteAllAttr(cssCopy, cssConfigArr);


                css = getCleanedCssConfig(cssCopy, cssConfigArr);

                defaultTheme = CURRENT_WIDGET_DATA['defaultTheme'];

                if (!$.isEmptyObject(defaultTheme) && css.theme) {
                    cssCopy.defaultTheme = defaultTheme;
                }


                if (css.defaultTheme) {
                    delete css.defaultTheme;
                }
                if ((!cssCopy.cssCode || !cssCopy.cssCode.cssCode) && css.cssCode) {
                    delete css.cssCode;
                }

                if (css.cssCode && css.cssCode.cssCode) { //兼容没有保存code的老版
                    delete css.cssCode.cssCode;
                }

                oWidget.update({
                    css: css,  //cssCopy->css
                    cssCopy: cssCopy
                });


            } else if (cssObj) {

                delete widgetInstance.css;

            }


        }

        function cssConfigure($context, oWidget, setTabVisible) {

            var elem = oWidget[0],
                cssConfig, i, len, item,
                widgetID = elem.widgetID,


                cssConfigArr, widgetInstance,
                cssObj, styleObject, themeObject;


            if (hasResumed) {
                refreshWidgetLock = true;
            } else {
                hasResumed = true;
                resumeCssCode();
            }


            CURRENT_WIDGET_DATA = {};
            CURRENT_WIDGET_DATA.widgetID = widgetID || '';
            CURRENT_WIDGET_DATA.widgetClass = '';
            CURRENT_WIDGET_DATA.cssArr = {};
            CURRENT_WIDGET_DATA.defaultTheme = {};
            //清空缓存


            cssCurrentWidgetID = widgetID;


            if (elem.widget.type === CONST.WIDGET.PAGE_TYPE) {
                elem.widget.css = {cssCode: {className: ''}}
            }

            if ((cssConfig = elem.widget.css)) {

                cssConfig = JSON.parse(JSON.stringify((cssConfig)));

                if (!$.isArray(cssConfig)) {
                    cssConfigArr = turnCssConfigToArr(cssConfig);
                }


                widgetInstance = elem.data;

                cssObj = widgetInstance.css || {};


                CURRENT_WIDGET_DATA.widgetClass = (cssObj.cssCode && cssObj.cssCode.className) || 'aw-' + (dataModel.get('pageModule') || 'viewer') + '-' + (dataModel.get('pageName') || 'index') + '-' + (dataModel.getEventAccumulator());


                if (widgetInstance.cssCopy) {

                    cssConfigInitInstance(widgetInstance.cssCopy, cssConfigArr, false);


                    cssConfigArr = getUpdatedCssConfig(widgetInstance.cssCopy, cssConfigArr, false);


                } else {

                    if (cssObj && (styleObject = cssConfigArr.find(findStyleObject)) && cssObj.style && styleObject.attr.length !== Object.keys(cssObj.style).length) {
                        delete widgetInstance.css.style;
                        delete cssObj.style;
                        if ((themeObject = cssConfigArr.find(findThemeObject)) && themeObject.attr.length && cssObj.theme) {
                            delete widgetInstance.css.theme;
                            cssObj = {};
                        }
                    }
                    //如果css配置里面的theme有内容，先将theme配置转成对象。主要兼容老版
                    if (cssObj) {
                        cssObj = transformCssobjThemeConfig(cssObj);
                    }

                    widgetInstance.cssCopy = cssConfigInitInstance(JSON.parse(JSON.stringify(cssObj)), cssConfigArr, false);

                }


                CURRENT_WIDGET_DATA['cssCopyObj'] = JSON.parse(JSON.stringify(widgetInstance.cssCopy));


                CURRENT_WIDGET_DATA['cssConfigArr'] = cssConfigArr;


                if (cssConfigArr && cssConfigArr.length) {

                    if (cssConfigArr[0].attr && cssConfigArr[0].attr.length || cssConfigArr[1].attr && cssConfigArr[1].attr.length >= 2) {

                        setTabVisible && setTabVisible(true);


                        showCssConfigPanel($context, oWidget, widgetInstance.cssCopy, cssConfigArr);


                    } else {
                        setTabVisible && setTabVisible(false);
                    }
                }

            } else {
                if ((widgetInstance = elem.data) && widgetInstance.css) {
                    delete widgetInstance.css;
                }
                setTabVisible && setTabVisible(false);
            }


        }

        function css_theme_select(el, option) {
            var $div = $(el),
                bindingValue = option.value,
                optionItem = bindingValue.option,
                instanceObj = bindingValue.obj,
                optionName = bindingValue.name,
                optionItemCopy = JSON.parse(JSON.stringify(optionItem)),
                point, forLength, temp, el, $temp, oldTheme, newTheme, themeObj = {
                    name: optionItemCopy.name,
                    desp: optionItemCopy.desp,
                    templateArray: []
                };
            //主题数据解析处理
            /*      if(!instanceObj[optionName]){
             instanceObj[optionName] =optionItemCopy.valueArray[0]; //如果没有选择任何主题，默认帮组件选上第一个主题类名。
             }*/

            for (point = 0, forLength = optionItemCopy.valueArray.length; point < forLength; point++) {
                temp = {};
                temp.desp = optionItemCopy.despArray[point];
                temp.value = optionItemCopy.valueArray[point];
                temp.zoom = optionItemCopy.zoom;
                temp.template = optionItemCopy.template;

                if (instanceObj[optionName] === temp.value) {
                    temp.selected = true;
                    oldTheme = temp.value;
                } else {
                    temp.selected = false;
                }
                themeObj.templateArray.push(temp);
            }


            $div.append(template('css_theme_select', themeObj));
            //添加事件监听
            $div.off('.selectTheme').on('click.selectTheme', function (e) {

                el = e.target || e.srcElement;
                $temp = $(el).closest('.aui-css-template');
                if ($temp.length > 0) {
                    newTheme = $temp.attr('data-value');
                    if ($temp.hasClass('aui-theme-select-borderColor')) {
                        newTheme = ' ';
                        $temp.removeClass('aui-theme-select-borderColor');
                    } else {
                        $('[data-value=' + oldTheme + ']').removeClass('aui-theme-select-borderColor');
                        $temp.addClass('aui-theme-select-borderColor');
                    }
                    oldTheme = newTheme;

                    setTimeout(function () {
                        instanceObj[optionName] = newTheme;
                    }, 0);
                    refreshWidgetLock = false;

                }
                e.stopPropagation();
            });
        }

        function moreCss(el, option) {
            var $div = $(el),
                i, len, oWidget, widgetIns,

                bindingValue = option.value,
                modelSelector = bindingValue.modelSelector,
                widgetCss, modelName, allAttr, styleAttrArray,
                widgetID, styleMap = {}, modelNameID;


            $div.append(template('css_attribute_select', {})).css({
                height: 'auto'
            });


            $div.find('.aui-more-attr-link')
                .off('.selectMore')
                .on('click.selectMore',
                    function () {
                        var mCsscopy, mCssConfigArr, allCssCopy,
                            allCssConfigArr, item, cssConfigArr,
                            j, value, widgetInstance, flag;

                        oWidget = $AW(cssCurrentWidgetID);
                        modelName = modelSelector.replace('moreCss', '').replace('_CSSID', '');
                        modelNameID = modelSelector.replace('moreCss', '');


                        mCssConfigArr = CURRENT_WIDGET_DATA['cssArr']['allAttr']['attr'];
                        mCsscopy = CURRENT_WIDGET_DATA['cssCopyObj']['style'][modelName];
                        allCssConfigArr = JSON.parse(JSON.stringify(mCssConfigArr));


                        allCssCopy = JSON.parse(JSON.stringify(CURRENT_WIDGET_DATA['cssCopyObj']['style']['allAttr'] || {}));


                        cssConfigArr = CURRENT_WIDGET_DATA['cssConfigArr'];


                        for (item in mCsscopy) {
                            if (mCsscopy.hasOwnProperty(item)) {
                                if (mCsscopy[item] || mCsscopy[item] === 0 || mCsscopy[item] === '0') {
                                    allCssCopy[item] = mCsscopy[item];
                                }
                            }
                        }

                        allCssConfigArr = getUpdatedAllAttr(JSON.parse(JSON.stringify(allCssConfigArr)), allCssCopy);
                        //更新组件cssCopy
                        CURRENT_WIDGET_DATA['cssCopyObj']['style'][modelName] = JSON.parse(JSON.stringify(allCssCopy));
                        //更新组件cssConfigArr
                        for (i = -1; item = cssConfigArr[++i];) {
                            if (item.name === 'style') {
                                for (j = -1; value = item.attr[++j];) {
                                    if (value.name === modelName) {
                                        value.attr = allCssConfigArr;
                                    }
                                }
                            }
                        }
                        CURRENT_WIDGET_DATA['AllCssConfigArr'] = allCssConfigArr;

                        base.baseConfig(modelNameID, allCssCopy, allCssConfigArr, function (arg) {

                            if (arg.modelSelector) {

                                arg.modelSelector = arg.modelSelector && arg.modelSelector.replace('instanceObj', "widgetInstance['css']['style']['" + modelName + "']");

                                CURRENT_WIDGET_DATA['cssCopyObj']['style'][modelName] = arg.newObj;
                                flag = styleIsUpdate(arg.newObj);



                                //是否修改过样式
                                $('[data-value=' + modelName + ']')[flag ? 'addClass' : 'removeClass']('isUpdate');

                                var styleID=modelName+'_CSSID';
                                $('.'+styleID+'-'+arg.key,'#'+styleID).children(":first")[arg.newObj[arg.key] ? 'addClass' : 'removeClass']('isUpdate');

                            }

                            refreshWidget(oWidget, arg);

                        }, true);


                        app.performance.longDelay(isSingleStyleUpdate(modelNameID,allCssCopy));
                    });
        }

        function isSingleStyleUpdate(modelNameID,allCssCopy) {
            var t=function () {
                var styleData=[],styleKeysData,cursor,item,i,styleMap;

                styleMap=allCssCopy;
                styleKeysData=Object.keys(allCssCopy);

                for(i=-1;item=styleKeysData[++i];){
                    if(styleMap.hasOwnProperty(item)){
                        styleData.push({key:item,value:styleMap[item]});
                    }
                }
                cursor=-1;

                while (item=styleData[++cursor]){
                    if(typeof item.value==='object'){
                        styleData.push({key:item.key,value:item['inputValue']||item['selectValue']})
                    }else if(item.value){
                        $('.'+modelNameID+'-'+item.key,'#'+modelNameID).children(":first").addClass('isUpdate')
                    }
                }
            };
            return t;

        }
        function configPanel(el, option) {
            var $div = $(el),
                item,
                style,
                key,
                flag,
                cssArrData,
                nameList = [],
                newSelect,
                oldSelect,
                styleID,styleMap,styleKeysData,styleData=[],
                $CssConfigSearchInput,
                i,cursor,
                widgetIns = $AW(cssCurrentWidgetID);


            cssArrData = CURRENT_WIDGET_DATA['cssArr'];


            for (item in cssArrData) {
                if (cssArrData.hasOwnProperty(item) && (item !== 'style' && item !== 'theme' && item !== 'allAttr')) {
                    nameList.push(
                        {
                            value: cssArrData[item].name,
                            desp: cssArrData[item].desp,
                            closable: cssArrData[item].closable || false
                        }
                    )
                }
            }
            $div.append(template('css_config_panel', {'nameArr': nameList})).css('height', 'auto');

            $CssConfigSearchInput = $(CSS_CONFIG_SEARCH_ID, $div);

            if (CURRENT_WIDGET_DATA.cssCopyObj && (style = CURRENT_WIDGET_DATA.cssCopyObj.style)) {
                for (key in style) {
                    if (style.hasOwnProperty(key) && style[key]) {

                        flag = styleIsUpdate(style[key]);

                        $('[data-value=' + key + ']')[flag ? 'addClass' : 'removeClass']('isUpdate');

                    }
                }

            }


            //添加事件监听
            $div.find('.aui-css-config-panel')
                .off('.selectStyle')
                .on('click.selectStyle', function (e) {
                    var el = e.target || e.srcElement,
                        value, $target, $el = $(el),
                        mCssCopy, mCssArr,
                        oWidget, newSelectId,
                        updatedCssConfigArr,
                        eventRole = $el.attr('data-event-role') || $el.closest('data-event-role').attr('data-event-role');
                    switch (eventRole) {
                        case 'select-style':
                            $target = $el || $el.closest('data-event-role');
                            newSelect = $target.attr('data-value');
                            newSelectId = newSelect + "_CSSID";
                            oWidget = $AW(cssCurrentWidgetID);


                            if (!$target.hasClass('active')) {
                                $('[data-value=' + oldSelect + ']').removeClass('active');

                                $div.find('.aui-css-style-config-list').empty().append('<div id=' + newSelectId + '></div>');

                                mCssCopy = CURRENT_WIDGET_DATA['cssCopyObj']['style'][newSelect]||{};


                                //更新css配置到CURRENT_WIDGET_DATA['cssArr']
                                updatedCssConfigArr = getUpdatedCssConfig(JSON.parse(JSON.stringify(CURRENT_WIDGET_DATA['cssCopyObj'])), CURRENT_WIDGET_DATA['cssConfigArr']);

                                mCssArr = CURRENT_WIDGET_DATA['cssArr'][newSelect].attr;



                                // CURRENT_WIDGET_DATA['cssConfigArr'] = updatedCssConfigArr;
                                base.baseConfig(newSelectId, mCssCopy, mCssArr, function (arg) {
                                    var flag;
                                    arg.modelSelector = arg.modelSelector && arg.modelSelector.replace('instanceObj', "widgetInstance['css']['style']['" + newSelect + "']");

                                    CURRENT_WIDGET_DATA['cssCopyObj']['style'][newSelect] = arg.newObj;

                                    refreshWidget(oWidget, arg);


                                    flag = styleIsUpdate(arg.newObj);

                                    //是否修改过样式
                                    $('[data-value=' + oldSelect + ']')[flag ? 'addClass' : 'removeClass']('isUpdate');
                                    var styleID=oldSelect+'_CSSID';
                                    $('.'+styleID+'-'+arg.key,'#'+styleID).children(":first")[arg.newObj[arg.key] ? 'addClass' : 'removeClass']('isUpdate');


                                });

                                $target.addClass('active');


                                app.performance.longDelay(isSingleStyleUpdate(newSelectId,mCssCopy));



                            }
                            oldSelect = newSelect;




                            break;
                        case 'delete-style':

                            break;
                    }


                });
            $('[data-value]', $div).eq(0).trigger('click');
            //搜索组件

            $CssConfigSearchInput.off('.uiSearch').on({
                'keyup.uiSearch': function () {
                    var $this = $(this),
                        key = $this.val(),
                        i, len, item,
                        $moreLink,
                        currentDOMArray;
                    currentDOMArray = $div.find('.aui-row');

                    if (key) {
                        if(($moreLink=$div.find('.aui-more-attr-link')).length){
                            $moreLink.trigger('click');
                        }
                        $.grep(currentDOMArray, function (n) {
                            if (n.innerText.indexOf(key) < 0) {
                                $(n).closest('.aui-base-config-component').addClass('hide');
                            } else {
                                $(n).closest('.aui-base-config-component').removeClass('hide');
                            }
                        });

                    } else {
                        for (len = currentDOMArray.length; currentDOMArray[--len];) {

                            $(currentDOMArray[len]).closest('.aui-base-config-component').removeClass('hide');

                        }
                    }
                }
            });
        }

        function getUpdatedAllAttr(allCssConfigArr, allCssCopy) {
            var cursor = -1, item, value, type;

            while (item = allCssConfigArr[++cursor]) {
                type = item.type;
                if (allCssCopy.hasOwnProperty(item.name) && (value = allCssCopy[item.name])) {
                    if (typeof value === 'string' && value.match(/^@.*/)) {
                        if (type !== 'string_select') {
                            item.type = 'string_select';
                            item.oldType = type;
                        }
                    } else if (typeof value === 'object' && (value.hasOwnProperty('inputValue') || value.hasOwnProperty('selectValue'))) {
                        if (type !== "input_append") {
                            item.type = "input_append";
                            item.oldType = type;
                        }
                    } else {
                        if (type === 'string_select' && value.toString && !value.toString().match(/^@.*/)) { //是tring_select 但是又不是变量
                            item.type = item.oldType;
                            item.oldType = type;
                        }
                    }

                }

            }
            return allCssConfigArr;
        }

        function saveAndCompileLess(content, callback) {
          //  var path = awebPagePath.replace('@projectName', auiApp.io.projectName);
            if (dataModel.get('pageModule') && dataModel.get('pageName')) {
                var path = dependencPagePath.replace('@projectName', auiApp.io.projectName) + '/' + dataModel.get('pageModule') + '-' + dataModel.get('pageName')+'_'+dataModel.get('uuid') + '.less'
            } else {
                var path = dependencPagePath.replace('@projectName', auiApp.io.projectName) + '/index.layout.less'

            }
           
            external.saveFile({
                fullPath: path,
                content: content
            }, function () {
                external.compileCss({
                    source: path,
                    target: path.replace(/\.less$/, '.css').replace(new RegExp(replaceRex), replaceTag)
                }, function () {
                    callback && callback();
                });
            });

            // external.saveFile({  //同时保存到webContent里面
            //     fullPath: path.replace(new RegExp(replaceRex), replaceTag),
            //     content: content
            // });
        }
        function saveThemeVariablesLess(content, callback) {
  
            var path = themeVariablesPath.replace('@projectName', auiApp.io.projectName);

            external.saveFile({
                fullPath: path,
                content: content
            }, function () {
                    callback && callback();
            });
        }
        ret = {

            //dom operation
            css_theme_select: css_theme_select,

            moreCss: moreCss,


            configPanel: configPanel,

            //主题里恢复组件样式配置接口
            getCssCopy: function (cssObj, cssConfig) {
                var cssConfigArr, copy, i, item, cssArr, cssAllArr,
                    styleArr, j, value, newCssConfigArr, cssObjCopy, cssTheme, objTheme,
                    retCssCopy, oldConfigArr;
                if (!$.isEmptyObject(cssObj)) {
                    if (!$.isArray(cssConfig)) {
                        cssConfigArr = turnCssConfigToArr(cssConfig);
                    }

                    cssAllArr = JSON.parse(JSON.stringify(CURRENT_WIDGET_DATA['cssArr']['allAttr']['attr']));

                    for (i = -1; item = cssConfigArr[++i];) {
                        if (item.name === 'style') {
                            styleArr = item.attr;
                            for (j = -1; value = styleArr[++j];) {
                                if (value.name !== 'allAttr') {
                                    value.attr = cssAllArr;
                                }
                            }
                        }
                    }

                    //如果css配置里面的theme有内容，先将theme配置转成对象。主要兼容老版
                    if (cssObj) {
                        cssObj = transformCssobjThemeConfig(cssObj);
                    }
                    //由于主题里面只保存struct里面的css数据，并没有cssCopy，当用户点击“更多”动态添加属性的时候，
                    // 主题便没办法根据widget里面的css配置恢复自定义添加的属性，
                    // 所以这里就默认都用一个全量的css配置去先恢复cssCopy，
                    copy = cssConfigInitInstance(JSON.parse(JSON.stringify(cssObj)), cssConfigArr);


                    oldConfigArr = CURRENT_WIDGET_DATA['cssConfigArr'];
                    //然后再通过csCopy 去拿到组件最新的css配置
                    newCssConfigArr = getUpdatedCssConfig(copy, oldConfigArr);

                    //全局更新当前组件cssCopy配置和css配置
                    CURRENT_WIDGET_DATA['cssCopyObj'] = copy;
                    CURRENT_WIDGET_DATA['cssConfigArr'] = newCssConfigArr;

                    retCssCopy = JSON.parse(JSON.stringify(copy));

                    deleteAllAttr(retCssCopy, newCssConfigArr);

                    return retCssCopy;
                } else {
                    return {};
                }

            },
            getCss: function (cssCopy) {

                var cssConfigArr;
                if (!$.isEmptyObject(cssCopy)) {

                    cssConfigArr = JSON.parse(JSON.stringify(CURRENT_WIDGET_DATA['cssConfigArr']));

                    return getCleanedCssConfig(JSON.parse(JSON.stringify(cssCopy)), cssConfigArr);

                } else {
                    return {};
                }
            },
            cssConfigure: cssConfigure,
            turnCssConfigToArr: turnCssConfigToArr,
            resumeCssConfig: resumeCssConfig,
            cleanCssCode: cleanCssCode
        };


        return ret;
    });

})();