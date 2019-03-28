define(['jquery', 'index', 'template', 'config.css','css','base','docs','const'], function ($, global, template, cssConfig,cssUtil,base,docs,CONST) {
    var AUI = global,
        /*CONST = global.CONST,*/
        baseConfigInitInstance = base.baseConfigInitInstance,
        getCleanedOption = base.getCleanedOption,
        dataModel=window.parent.M,
        transformPlaceHolder = function (str) {
            return str
                .replace(/%%_NAME%%/ig, '中文名')
                .replace(/%%_INDEX%%/ig, ' +累加器')
                .replace(/%%_WID%%/ig, ' 组件ID')
                .replace(/###_ID##/ig, '#widgetID')
                .replace(/_parseFunction_/ig, '')
                .replace(/##_(OPTION|ATTR|CSS|URL|EVENT|RESULT|INPUT1|INPUT2|CONDITION|RESPONSE_DATA|AJAX_OPTION)##/gi, function () {
                    return $.camelCase(arguments[1].toLowerCase().replace(/_/g, '-'));
                })
                .replace(/(?:##(?:[^_]+(?:_WID)?)?_VAR##)|(?:%%_WID_VAR%%)/ig, 'auiCtx.variables.widgetID')
                .replace(/%%_WID_(OPTION|ATTR|CSS|URL|EVENT|RESULT|INPUT1|INPUT2|CONDITION|RESPONSE_DATA|AJAX_OPTION)%%/gi, function () {
                    return $.camelCase(arguments[1].toLowerCase().replace(/_/g, '-'));
                });
        }, objectToString = function (data) {
            var map = {};
            data && data.length && data.forEach(function (item) {
                if(item.type==='array'){
                    map[item.name]=arrayToString(item.children);
                }else{
                    map[item.name] = item.defaultValue;
                }

            });
            return map;
        },
        arrayToString = function (data) {
            var arr = [];
            data && data.length && data.forEach(function (item) {
                if(item.type==='object'){
                    arr.push( objectToString(item.children));
                }else{
                    arr.push(item.defaultValue);
                }

            });
            return arr;
        };

    return {
        load: function ($el, scope, handler) {

            var widgetHref = handler.id.replace(/-/g, '.'),
                pageId = handler.id,
                context = this,
                api, projectViewer = false;

            if (widgetHref.indexOf('theme.app.') === 0 || widgetHref.indexOf('viewer.app.') === 0) {
                api = 'getProjectFile';
                projectViewer = true;
            } else {
                api = 'getWidget';
            }


            external[api](widgetHref, function (data) {

                var widgetChain = widgetHref.split('.'),
                    widgetChainText = [],

                    methods = {
                        universal: [],

                        getter: [],
                        setter: [],
                        successCallback: [],
                        errorCallback: [],
                        cleanCallback: [],
                        validateHandler: [],

                        event: [],


                        behavior: [],
                        dataFlow: [],


                        app: {}
                    },

                    banner = [],
                    code, configArr,
                    i, items, item,
                    t, c,
                    j, elem, subItems, subItem,


                    theme,
                    cssDB = app.taffy(cssConfig),
                    obj, key, appInterfaces = [],

                    groupArray = function (arr) {
                        var len = arr.length, i, newArr;
                        if (len >= 2) {
                            var len1 = arr[0].length, len2 = arr[1].length,
                                lenBoth = len1 * len2, items = new Array(lenBoth), index = 0;

                            for (i = 0; i < len1; i++) {
                                for (var j = 0; j < len2; j++) {
                                    items[index] = arr[0][i] + " " + arr[1][j];
                                    index++;
                                }
                            }
                            // 将新组合的数组并到原数组中
                            newArr = new Array(len - 1);
                            for (i = 2; i < arr.length; i++) {
                                newArr[i - 1] = arr[i];
                            }
                            newArr[0] = items;
                            // 执行回调
                            return groupArray(newArr);
                        } else {
                            return arr[0];
                        }
                    },
                    delEmptyObj = function (obj) {
                        var item;
                        for (item in obj) {
                            if (!$.isEmptyObject(obj[item])) {
                                for (var i in obj[item]) {
                                    if (obj[item][i] === "") {
                                        delete obj[item][i];
                                    }
                                }
                            }
                            if ($.isEmptyObject(obj[item])) {
                                delete obj[item];
                            }
                        }
                    },
                    $ctn = $el.find('[data-role="wdCttPanel"]'),
                    $nav = $el.find('[data-role="wdNavPanel"]');

                if (projectViewer && widgetHref.indexOf('viewer') === 0) {
                    data.appInterfaces = dataModel.get('awebApi') &&  dataModel.get('awebApi').appInterfaces;
                    data.appInterfacesConst =  dataModel.get('awebApi')&&  dataModel.get('awebApi').appInterfacesConst;
                }

                function interfacesToMap(items) {
                    items.map(function (elem) {
                        var subItems,
                            value,
                            item = elem,
                             paramCode,
                            code,
                            changeValue,
                            result, returnValue, type;

                        if (key = elem.name) {
                            if (elem.type !== 'app') {
                                if (~key.lastIndexOf('.')) {
                                    key = key.substring(key.lastIndexOf('.') + 1);
                                }
                                if(result=key.match(/(?:\.?)[^\(]+/)){
                                    key = '.' + result[0];
                                }

                            }

                            elem.name = key;

                            code = '';

                            //通过迭代将将 入参和出参


                            subItems = elem.params && elem.params.length ? elem.params : [];

                            if (j = elem.returnValue) {
                                if (!j.name) {
                                    delete elem.returnValue;
                                } else {
                                    subItems = subItems.concat([j]);
                                }
                            }

                            if (returnValue = elem.returnValue) {

                                obj = returnValue.val || returnValue.defaultValue;
                                code += (returnValue.name || 'returnValue') + '=';

                                if (returnValue.type === 'object') {
                                    code += JSON.stringify(objectToString(elem.returnValue.children));


                                } else if (returnValue.type === 'array') {
                                    code += JSON.stringify(arrayToString(elem.returnValue.children));

                                } else if ($.isPlainObject(obj) || $.isArray(obj)) {
                                    code += JSON.stringify(obj);
                                } else if (typeof obj === 'string') {

                                    if (elem.returnValue.type === 'string_select') {
                                        code += obj;
                                    } else {
                                        code += "'" + obj.replace(/'/g, '\\\'') + "'";
                                    }

                                } else {
                                    code += obj;
                                }

                                code += ';';
                            }


                            i = -1;

                            while (j = subItems[++i]) {
                                value = j.defaultValue;
                                switch (j.type) {
                                    case 'event':
                                    case 'number':
                                    case 'boolean':
                                    case 'string':
                                    case 'function':

                                        switch (j.type) {
                                            case 'event':
                                                j.defaultValue = value || 'Event Handler';
                                                break;
                                            case 'number':
                                                if ($.isNumeric(value)) {
                                                    j.defaultValue = parseFloat(value);
                                                }

                                                break;
                                            case 'boolean':
                                                if (value === false || value === 'false') {
                                                    value = false;
                                                } else if (value === true || value === 'true') {
                                                    value = true;
                                                } else {
                                                    value = null;
                                                }

                                                j.defaultValue = value;
                                                break;



                                            default:
                                                j.defaultValue = value !== undefined ? value : null;
                                        }

                                        if (j.parent) {
                                            if (j.name) {
                                                j.parent[j.name] = j.defaultValue;
                                            } else {
                                                j.parent.push(j.defaultValue);
                                            }
                                        } else {
                                            j.val = j.defaultValue;
                                        }
                                        break;

                                    case 'array':
                                        j.val = [];

                                        if (j.parent) {
                                            if (j.name) {
                                                j.parent[j.name] = j.val;
                                            } else {
                                                j.parent.push && j.parent.push(j.val);
                                            }
                                        }

                                        if (j.children && j.children.length) {
                                            subItems[i].attrInEachElement = j.children;

                                            j.children.map(function (child) {
                                                child.parent = j.val;
                                            });
                                            subItems = subItems.concat(j.children);
                                        }

                                        break;
                                    case 'option':
                                    case 'handler':
                                    case 'object':
                                    case 'jQuery':

                                        j.val = {};
                                        if (j.type === 'object' && (!j.children || (j.children && !j.children.length)) && j.defaultValue) {
                                            try {
                                                j.val = JSON.parse(j.defaultValue);

                                            } catch (e) {
                                                //console.log(e);
                                            }
                                        }
                                        if (j.parent) {
                                            if (j.name) {
                                                j.parent[j.name] = j.val;
                                            } else {
                                                j.parent.push && j.parent.push(j.val);
                                            }
                                        }

                                        if (j.children && j.children.length) {
                                            subItems[i].attr = j.children;

                                            j.children.map(function (child) {
                                                child.parent = j.val;
                                            });

                                            subItems = subItems.concat(j.children);
                                        }

                                        if (j.type === 'handler' && !j.parent && !j.children) {
                                            j.val = j.defaultValue;
                                        }

                                        break;
                                    default:

                                        if (j.parent) {
                                            if (j.name) {
                                                j.parent[j.name] = value;
                                            } else {
                                                j.parent.push && j.parent.push(value);
                                            }
                                        }
                                        break;
                                }
                            }

                            if (elem.params && elem.params.length) {
                                obj = {};
                                elem.params.map(function (param) {
                                    var value;

                                    switch (param.type) {
                                        case 'boolean':
                                            value = param.val;

                                            if (value === false || value === 'false') {
                                                value = false;
                                            } else if (value === true || value === 'true') {
                                                value = true;
                                            } else {
                                                value = null;
                                            }

                                            break;
                                        case 'number':
                                            if ($.isNumeric(param.val)) {
                                                value = parseFloat(param.val);
                                            } else {
                                                value = param.val;
                                            }
                                            break;

                                        case 'array':

                                            value = arrayToString(param.children);
                                            break;

                                        default:

                                            value = param.val || param.defaultValue;
                                            break;
                                    }


                                    if (param.name) {
                                        obj[param.name] = value;
                                        obj['type'] = param.type

                                    } else {
                                        obj = value;
                                    }
                                });

                                if (!$.isEmptyObject(obj)) {

                                    paramCode = [];

                                    for (key in obj) {
                                        if (key !== 'type') {
                                            if (obj.hasOwnProperty(key)) {
                                                if (obj.type === 'string_select') {
                                                    changeValue = obj[key];
                                                } else {
                                                    changeValue = JSON.stringify(obj[key]);
                                                }

                                                paramCode.push(key + '=' + changeValue + '');

                                            } else {
                                                paramCode.push(key + '=""');
                                            }
                                        }
                                    }
                                    paramCode = '\n\r\n\r' + paramCode.join(';') + ';';

                                } else {
                                    delete elem.paramCode;
                                }
                            }


                            item.jsCode = '' + (paramCode ? paramCode : '') + (code ? code : '');


                            code = ((item.returnValue && item.returnValue.name) ? 'var ' + item.returnValue.name + '=' : '') + (item.type === 'app' ? 'app' : 'auiCtx.variables.widgetID') + item.name;

                            subItems = [];
                            if (item.params && item.params.length) {
                                item.params.map(function (elem) {
                                    elem.name && subItems.push(elem.name);
                                });

                                if (!subItems.length) {
                                    subItems.push('input');
                                }
                            }

                            code = code + '(' + subItems.join(',') + ');';

                            if (item.jsCode) {
                                code += item.jsCode;
                            }


                            code = AUI.getParsedString(UglifyJS.parse(transformPlaceHolder(('(function(){' + code + '})'))));

                            item.jsCode = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));


                            if (item.type === 'app') {
                                methods.app[item.appCategory] = methods.app[item.appCategory] || [];
                                methods.app[item.appCategory].push(item);
                            }
                        }
                    });
                }

                widgetChain.map(function (elem, index) {
                    widgetChainText[index] = dataModel.get('menu')({href: widgetChain.slice(0, index + 1).join('.')}).first().name;
                });

                data.widgetID = 'widgetDetails';
                data.widgetChain = widgetChainText;
                data.belongTo = data.belongTo && CONST.WIDGET.TYPE_TEXT[data.belongTo.toUpperCase()] + '组件';
                data.optionCopyInstance = {};
                data.optionInstance = {};
                data.attrInstance = {};
                data.edmInstance = {};
                data.validate = CONST.EDM.VALIDATE.WIDGET;

                if (!data.acceptName && (typeof data.accept) === 'string') {
                    data.accept = data.accept.split(' ');
                    data.acceptName = [];
                    data.accept.map(function (elem) {
                        var widget;
                        if (!$AW.widget[elem]) {
                            widget = dataModel.get('menu')({type: elem}).first();

                            $AW.widget[elem] = widget ? widget.name : elem;
                        }

                        data.acceptName.push($AW.widget[elem]);
                    });
                }

                if (!data.baseName && (typeof data.base) === 'string') {
                    data.base = data.base.split(' ');
                    data.baseName = [];
                    data.base.map(function (elem) {
                        var widget;
                        if (!$AW.widget[elem]) {
                            widget = dataModel.get('menu')({type: elem}).first();

                            $AW.widget[elem] = widget ? widget.name : elem;
                        }

                        data.baseName.push($AW.widget[elem]);
                    });
                }


                configArr = ['attr', 'option', 'css'];

                //attr
                if (data.attr && data.attr.length) {
                    data.attr.map(function (elem) {
                        switch (elem.name) {
                            case 'widgetName':
                            case 'desp':
                                elem.defaultValue = '中文名称+累加器';
                                break;
                            case 'id':
                                elem.defaultValue = '组件类型+累加器';
                                break;
                        }
                    });
                }
                //edm
                if (data.edm && data.edm.get && data.edm.get.length) {
                    data.edmInstance.id = AUI.transformForeignKey(data.edm.get[0].value, data.widgetID);
                    configArr.push('validate');
                }

                //option and attr
                configArr.map(function (key) {
                    var ins,
                        obj = {},
                        propString,
                        css;

                    if (key === 'css') {
                        data[key] = cssUtil.turnCssConfigToArr(data[key]);
                        css = data[key]
                    }

                    baseConfigInitInstance(obj, data[key], {
                        index: dataModel.get('eventAccumulator'),
                        widgetID: data.widgetID
                    });
                    //ins=obj;
                    ins = getCleanedOption(obj, data[key], true);

                    if (!$.isEmptyObject(ins)) {

                        propString = AUI.getParsedString(UglifyJS.parse('(' + JSON.stringify(ins) + ')'));
                        data[key + 'Code'] = propString.substr(1, propString.length - 3);
                    }
                });

                //css
                if (data.css && data.css.length) {
                    var styleConfig = data.css[1].attr,
                        themeConfig = data.css[0].attr;
                    for (i = -1; item = styleConfig[++i];) {
                        for (j = -1; elem = item.attr[++j];) {
                            switch (elem.type) {
                                case 'css_input_select':
                                case 'color_pick':
                                    elem.type = 'string';
                                    break;
                            }
                        }
                    }
                    for (i = -1; item = themeConfig[++i];) {
                        item.type = 'string';
                    }
                }


                /*
                 *   method
                 * */


                if (data.api && data.api.length) {
                    for (i = -1, items = data.api; (item = items[++i]) && item.type;) {
                        subItems = item.type.split(' ');

                        for (j = -1; subItem = subItems[++j];) {
                            methods[subItem].push(item);
                        }

                        item.name = '.' + item.name;

                    }

                    interfacesToMap(items);
                }

                //app interfaces for viewer component
                if (data.appInterfaces && data.appInterfaces.length) {
                    $.each(data.appInterfaces, function (index, value) {
                        $.each(value.children, function (index, interfaceData) {
                            interfaceData = JSON.parse(JSON.stringify(interfaceData));
                            switch (interfaceData.belongTo) {
                                case 'class':
                                    $.each(interfaceData.cInterfaces, function (index, cInterfaceData) {
                                        cInterfaceData.name = '.' + interfaceData.name + '.' + cInterfaceData.name;
                                        cInterfaceData.type = 'app';
                                        cInterfaceData.appCategory = value.desp;
                                    });
                                    interfacesToMap(interfaceData.cInterfaces);
                                    break;

                                default:
                                    interfaceData.type = 'app';
                                    interfaceData.name = '.' + interfaceData.name;
                                    interfaceData.appCategory = value.desp;
                                    interfacesToMap([interfaceData]);
                                    break;
                            }
                        });
                    });
                }


                //转化app接口格式
                $.each(methods.app, function (key, value) {
                    appInterfaces.push({
                        href: value[0].type + value[0].name + '()',
                        desp: key,
                        children: value
                    });

                });

                if (appInterfaces.length > 0) {
                    methods.app = appInterfaces;
                } else {
                    methods.app = undefined;
                }

                if (methods) {
                    data.methods = methods;
                }

                //应用接口常量
                /*       data.appInterfacesConst = {'appInterfacesConst':data.appInterfacesConst}*/

                //解析data的变量和theme
                data.themeArray = [];

                theme = data.theme;
                if (theme && !$.isEmptyObject(theme)) {
                    for (item in data.theme) {
                        var newObj = {};
                        newObj.desp = dataModel.get('menu')({href: item}).first().name;
                        newObj.type = dataModel.get('menu')({href: item}).first().type;
                        newObj.despArray = [];
                        newObj.cssConfig = [];
                        for (i in theme[item]) {
                            var configNameList = {}, themeNameList = {}, allThemeClass = [], allThemeName = [];


                            if (theme[item]['css'] && theme[item]['css']['style']) {
                                $.each(theme[item]['css']['style'], function (index, obj) {
                                    configNameList[obj.name] = obj.desp;
                                });
                            }
                            if (theme[item]['css'] && theme[item]['css']['custom']) {
                                $.each(theme[item]['css']['custom'], function (index, obj) {
                                    configNameList[obj.name] = obj.desp;
                                });
                            }
                            if (theme[item]['css'] && theme[item]['css']['theme']) {
                                $.each(theme[item]['css']['theme'], function (index, obj) {
                                    allThemeClass.push(obj.valueArray.concat([""]));
                                    allThemeName.push(obj.despArray.concat([""]));
                                });
                                var themeClass = groupArray(allThemeClass),
                                    themeName = groupArray(allThemeName);

                                $.each(themeClass, function (index, value) {
                                    themeNameList[value] = themeName[index];
                                });
                            }

                            if (i !== 'css' && !$.isEmptyObject(theme[item][i])) {
                                var newThemeObj = {};
                                newThemeObj.themeName = (i === '_default') ? '' : i;
                                newThemeObj.themeNameDsp = themeNameList[i] || '默认';
                                newThemeObj.themeNameArray = [];
                                delEmptyObj(theme[item][i]);
                                for (t in  theme[item][i]) {
                                    var newConfigObj = {};
                                    newConfigObj.configName = t;
                                    newConfigObj.configNameDsp = configNameList[t];
                                    newConfigObj.configArray = [];
                                    if (!$.isEmptyObject(theme[item][i][t])) {
                                        for (c in theme[item][i][t]) {
                                            var Config = $.extend(true, {}, cssDB({name: c}).first());
                                            if (Config.type === 'css_input_select' || Config.type === 'color_pick') {
                                                Config.type = 'string';
                                            }

                                            Config.value = theme[item][i][t][c];

                                            newConfigObj.configArray.push(Config);
                                        }
                                    }

                                    newThemeObj.themeNameArray.push(newConfigObj);

                                }
                                newObj.despArray.push(newThemeObj);
                            }
                        }
                        //------------------------------------------------------------------

                        $.each(newObj.despArray, function (index, oneTheme) {
                            if (oneTheme.themeName === '_default') {
                                for (var i = index; i > 0; i--) {
                                    var temp = newObj.despArray[i];
                                    newObj.despArray[i] = newObj.despArray[i - 1];
                                    newObj.despArray[i - 1] = temp;
                                }
                            }
                        });

                        if (theme[item]['css'] && theme[item]['css']['style']) {
                            newObj.cssConfig = theme[item]['css']['style'];
                            $.each(newObj.cssConfig, function (index, value) {
                                var cssAttr;

                                if (value.cssAttrs) {
                                    if (!$.isArray(value.cssAttrs)) {
                                        cssAttr = value.cssAttrs.split(' ');
                                    } else {
                                        cssAttr = value.cssAttrs;
                                    }
                                    newObj.cssConfig[index].cssAttrs = cssDB({name: cssAttr}).get();
                                }
                            });
                        }
                        data.themeArray.push(newObj);
                    }
                }
                if (data.variables && $.isArray(data.variables)) {
                    for (i = -1; item = data.variables[++i];) {
                        var cssAttr, firstAttrStr;
                        if (!$.isArray(item.cssAttrs)) {
                            cssAttr = item.cssAttrs.split(' ');
                        } else {
                            cssAttr = item.cssAttrs;
                        }
                        firstAttrStr = cssAttr[0];
                        data.variables[i].cssAttrs = cssDB({name: cssAttr}).get();
                        if (firstAttrStr) {
                            if (firstAttrStr.match('color')) {
                                data.variables[i].showType = 'color';
                            } else if (firstAttrStr.match('font-size')) {
                                data.variables[i].showType = 'font_size';
                            } else if (firstAttrStr.match('font-weight')) {
                                data.variables[i].showType = 'font_weight';
                            } else if (firstAttrStr.match('border-radius')) {
                                data.variables[i].showType = 'border_radius';
                            } else if (firstAttrStr.match('font-family')) {
                                data.variables[i].showType = 'font_family';
                            } else if (firstAttrStr.match('z-index')) {
                                data.variables[i].showType = 'z-index';
                            } else if (firstAttrStr.match('padding')) {
                                data.variables[i].showType = 'padding';
                            } else if (firstAttrStr.match('margin')) {
                                data.variables[i].showType = 'margin';
                            } else if (firstAttrStr.match('line-height')) {
                                data.variables[i].showType = 'line_height';
                            }
                        }
                    }
                }


                //append html
                $el.children().addClass('ts-details-ctn');
                $ctn.append(transformPlaceHolder(template('widgetDetails', data)));


                $('[data-type="java"]', $ctn).each(function () {
                    var $this = $(this),
                        str,
                        language = 'java',
                        indent = 1;


                    str = $this.text();


                    $this
                        .text('')
                        .css({
                            width: '100%',
                            height: '400px'
                        });

                    var codeEditor = AUI.vscode.create($this, {model: null});

                    setTimeout(function () {
                        codeEditor.done(function (t) {
                            codeEditor.setModel(str, language);
                            // console.log(t)
                            t && t.getAction('editor.action.formatDocument').run();
                        });
                        codeEditor.layout();
                        window.parent.$AW.on('resize', function () {
                            codeEditor.layout();
                        })
                    }, 600)
                });


                //banner
                $('h2[data-href]', $ctn).each(function () {
                    var $this = $(this),
                        subItems = [],
                        item = {
                            href: $this.attr('data-href'),
                            name: $this.text(),
                            subItems: subItems
                        };

                    $this.next().children('[data-href]').each(function () {
                        var $this = $(this),
                            items = [];

                        subItems.push({
                            href: $this.attr('data-href'),
                            name: $this.text(),
                            subItems: items
                        });

                        $this.next().children('[data-href]').each(function () {
                            var $this = $(this);

                            items.push({
                                href: $this.attr('data-href'),
                                name: $this.text()
                            });
                        });
                    });


                    banner.push(item);
                });

                $nav.append(transformPlaceHolder(template('widgetDetailsNav', {subItems: banner})));

                if ((banner = (dataModel.get('docsMap') && dataModel.get('docsMap')[data.href])) && banner.length) {
                    $nav.append('<hr/><h3 class="ts-details-nav-title">相关链接</h3>' + template('widgetDetailsNav', {subItems: banner}));
                }

                app.pageSearch($('#auiDocsPageSearch', $el), $('#auiDocsPageSearchList', $el), $ctn,pageId);

                context.delegateEvents({
                    'click [data-role="wdNavPanel"]': function (e) {
                        var $target = $(e.target || event.srcElement),
                            href;

                        if ($target.is('a')) {
                            if (href = $target.attr('data-href')) {
                                app.scrollTop($ctn, $ctn.find('[data-href="' + href + '"]'));
                            } else if (href = $target.attr('data-file')) {
                                docs.openDocs(href, $target.text());
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
                })

            }, function () {
                $el.empty().append('<div class="alert alert-error">获取组件"' + $('[data-href="' + handler.cacheId + '"]').children('a').text() + '"信息失败。</div>');
            });


        }, unload: function ($el, scope, handler) {
        }, pause: function ($el, scope, handler) {
        }, resume: function ($el, scope, handler) {
        }
    };
});