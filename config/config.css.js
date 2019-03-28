define('config.css', [], function () {
    var
        cssTypeMap = {
            css_input_select: {
                'top': '距离顶部（top）',
                'right': '距离右边（right）',
                'bottom': '距离底部（bottom）',
                'left': '距离左边（left）',
                'width': '宽度（width）',
                'height': '高度（height）',
                'min-width': '最小宽度（min-width）',
                'max-width': '最大宽度（max-width）',
                'min-height': '最小高度（min-height）',
                'max-height': '最大高度（max-height）',
                'margin-top': '外顶补白（margin-top）',
                'margin-right': '外右补白（margin-right）',
                'margin-bottom': '外底补白（margin-bottom）',
                'margin-left': '外左补白（margin-left）',
                'padding-top': '内顶补白（padding-top）',
                'padding-right': '内右补白（padding-right）',
                'padding-bottom': '内底补白（padding-bottom）',
                'padding-left': '内左补白（padding-left）',
                'font-size': '字体大小（font-size）',
                'border-width': '边框粗细（border-width）',
                'border-top-width': '顶部边框粗细（border-top-width）',
                'border-right-width': '右边框粗细（border-right-width）',
                'border-bottom-width': '底部边框粗细（border-bottom-width）',
                'border-left-width': '左边框粗细（border-left-width）',
                'border-radius': '边角弧度（border-radius）',
                'border-top-left-radius': '左顶角弧度（border-top-left-radius）',
                'border-top-right-radius': '右顶角弧度（border-top-right-radius）',
                'border-bottom-right-radius': '右底角弧度（border-bottom-right-radius）',
                'border-bottom-left-radius': '左底角弧度（border-bottom-left-radius）'
            },
            css_string_input: {
                'background-size': '背景大小（background-size）',
                'background-position': '背景位置（background-position）',
                'display': '显示（display）',
                'background': '背景（background）',
                'font-weight': '字体粗细（font-weight）',
                'font-family': '字体（font-family）',
                'box-shadow': '阴影(box-shadow)',
                'margin': '外边距（margin）',
                'padding': '内边距（padding）',
                'border': '边框（border）',
                'border-top':'顶部边框（border-top）',
                'border-right':'右边框（border-right）',
                'border-bottom':'底部边框（border-bottom）',
                'border-left':'左边框（border-left）',
                'transition': '过渡(transition)',
                'transform':'转换(transform)',
                'animation':'动画(animation)',
                'text-overflow': '文本溢出(text-overflow)',
                'line-height': '行高（line-height）',
                'opacity': '透明度（opacity）',
                'z-index': '层级序号（z-index）',
                'outline': '轮廓（outline）',
                'text-shadow':'文本阴影(text-shadow)',
                'touch-action':'指定区域允许用户操作（touch-action）'
            },
            css_img_url:{
                'background-image': '背景图片(background-image)'
            },
            string_select: {
                'background-repeat': '背景重复（background-repeat）',
                'float': '浮动（float）',
                'clear': '清除浮动（clear）',
                'position': '定位（position）',
                'overflow': '超出（overflow）',
                'overflow-x': 'x轴超出（overflow-x）',
                'overflow-y': 'y轴超出（overflow-y）',
                'font-style': '字体样式（font-style）',
                'font-variant': '字母大小写（font-variant）',
                'text-align': '文本位置（text-align）',
                'border-style': '边框样式（border-style）',
                'border-top-style': '顶部边框样式（border-top-style）',
                'border-right-style': '右边框样式（border-right-style）',
                'border-bottom-style': '底部边框样式（border-bottom-style）',
                'border-left-style': '左边框样式（border-left-style）',
                'border-collapse': '边框折叠样式（border-collapse）',
                'cursor': '鼠标样式（cursor）',
                'vertical-align':'垂直居中（vertical-align)',
                'resize': '调节（resize）',
                'user-select':'文本选择（user-select）',
                'word-break':'文本换行（word-break）',
                'text-decoration':'文本修饰（text-decoration）',
                'white-space':'元素内空白（white-space）'
            },
            number: {},
            color_pick: {
                'color': '字体颜色（color）',
                'icon-color': 'icon颜色（icon-color）',//自定义类型，主要区分字体颜色和图标颜色
                'background-color': '背景颜色（background-color）',

                'border-color': '边框颜色（border-color）',
                'border-top-color': '顶部边框颜色（border-top-color）',
                'border-right-color': '右边框颜色（border-right-color）',
                'border-bottom-color': '底部边框颜色（border-bottom-color）',
                'border-left-color': '左边框颜色（border-left-color）'
            }
        },
        cssTypeList = [
            //带后缀选择输入框
            'css_input_select',
            //输入框
            'css_string_input',
            //调色板
            'color_pick',

            'css_img_url'
        ],
        cssPropOrderList = [
            //外部定位
            'position',
            'top',
            'right',
            'bottom',
            'left',
            'display',
            'float',
            'clear',
            'zoom',
            'overflow',
            'overflow-y',
            'overflow-x',
            'visibility',
            'z-index',
            'box-sizing',
            //对齐
            'vertical-align',
            'text-align',
            'text-layout',
            'word-break',
            'align-content',
            'align-content',
            'align-items',
            'align-self',
            'algin-baseline',
            'text-overflow',
            'column-count',
            //背景
            'background',
            'background-color',
            'background-image',
            'background-position',
            'background-size',
            'background-repeat',
            'background-attachment',
            'background-origin',
            'background-clip',
            'opacity',
            //内外边距、边框
            'margin',
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
            'border',
            'border-collapse',
            'border-width',
            'border-top',
            'border-right',
            'border-bottom',
            'border-left',
            'border-top-width',
            'border-right-width',
            'border-bottom-width',
            'border-left-width',
            'border-style',
            'border-top-style',
            'border-right-style',
            'border-bottom-style',
            'border-left-style',
            'border-color',
            'border-top-color',
            'border-right-color',
            'border-bottom-color',
            'border-left-color',
            'border-radius',
            'border-bottom-top-radius',
            'border-bottom-right-radius',
            'border-bottom-bottom-radius',
            'border-bottom-left-radius',
            'outline',
            'padding',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
            'box-shadow',
            //大小
            'height',
            'width',
            'max-height',
            'max-width',
            'min-height',
            'min-width',
            //字体
            'line-height',
            'font',
            'font-variant',
            'font-family',
            'font-size',
            'font-weight',
            'font-style',
            'color',
            'icon-color',
            //内容
            'writing-mode',
            'word-wrap',
            'work-spacing',
            'work-break',
            'white-space',
            'text-indent',
            'text-orientation',
            'text-overflow',
            'text-size-adjust',
            'text-shadow',
            'text-underline-position',
            'text-rendering',
            'text-decoration',
            'src',
            //动画/3D
            'animation',
            'animation-delay',
            'animation-direction',
            'animation-duration',
            'transition',
            'delay',
            'duration',
            'property',
            'timing-function',
            'transform',
            'origin',
            'style',
            'text-transform',
            //其他/交互行为
            'resize',
            'cursor',
            'user-select',
            'touch-action'
        ],

        cssPropMap = {},
        cssPropList = [],

        i, type, map, key, value,
        valueArray, despArray, defaultValue;


    for (i = -1; type = cssTypeList[++i];) {
        map = cssTypeMap[type];

        for (key in map) {
            if (map.hasOwnProperty(key)) {
                value = map[key];

                cssPropMap[key] = {
                    name: key,
                    desp: value,
                    type: type
                };
            }
        }
    }

    map = cssTypeMap.string_select;
    for (key in map) {
        if (map.hasOwnProperty(key)) {
            value = map[key];

            switch (key) {
                case 'background-repeat':
                    valueArray = ["", "repeat-x", "repeat-y", "repeat", "no-repeat"];
                    despArray = ["默认", "x轴重复", "y轴重复", "重复", "不重复"];
                    break;
                case   'background-attachment':
                    valueArray = ["", "fixed", "scroll", "local"];
                    despArray = ["默认", "固定", "滚动", "相对"];
                    break;
                case   'float':
                    valueArray = ["", "none", "left", "right"];
                    despArray = ["默认", "无", "左浮", "右浮"];
                    break;
                case    'clear':
                    valueArray = ["", "none", "left", "right", "both"];
                    despArray = ["默认", "无", "清除左浮", "清除右浮", "不清除左浮"];
                    break;
                case    'position':
                    valueArray = ["", "static", "relative", "absolute", "fixed"];
                    despArray = ["默认", "静态", "相对", "绝对", "固定"];
                    break;
                case   'overflow':
                    valueArray = ["", "visible", "hidden", "scroll", "auto"];
                    despArray = ["默认", "显示", "隐藏", "滚动", "自动"];
                    break;
                case    'overflow-x':
                    valueArray = ["", "visible", "hidden", "scroll", "auto"];
                    despArray = ["默认", "显示", "隐藏", "滚动", "自动"];
                    break;
                case    'overflow-y':
                    valueArray = ["", "visible", "hidden", "scroll", "auto"];
                    despArray = ["默认", "显示", "隐藏", "滚动", "自动"];
                    break;
                case    'font-style':
                    valueArray = ["", "normal", "italic", "oblique"];
                    despArray = ["默认", "正常", "斜体", "倾斜"];
                    break;
                case    'font-variant':
                    valueArray = ["", "normal", "small-caps"];
                    despArray = ["默认", "小写", "大写"];
                    break;
                case    'text-align':
                    valueArray = ["", "left", "center", "right"];
                    despArray = ["默认", "居左", "居中", "居右"];
                    break;
                case    'border-style':
                case    'border-top-style':
                case    'border-right-style':
                case    'border-bottom-style':
                case    'border-left-style':
                    valueArray = ["", "solid", "dotted", "double", "dashed"];
                    despArray = ["默认", "实线", "点状", "双线", "虚线"];
                    break;
                case 'border-collapse':
                    valueArray = ["", "collapse", "inherit", "initial", "separate", "unset"];
                    despArray = ["默认", "折叠", "继承", "自身", "分隔", "不设置"];
                    break;
                case 'cursor':
                    despArray = ["无", "默认", "自动", "光标呈现为十字线", "链接指针", "移动", "向右（东）移动", "向上及向右移动（北/东）", "向上及向左移动（北/西）", "向上（北）移动", "向下及向右移动（南/东）", "向下及向左移动（南/西）", "向下移动（南）", "向左移动（西）", "文本", "忙碌", "帮助"];
                    valueArray = ["", "default", "auto", "crosshair", "pointer", "move", "e-resize", "ne-resize", "nw-resize", "n-resize", "se-resize", "sw-resize", "s-resize", "w-resize", "text", "wait", "help"];
                    break;
                case 'vertical-align':
                    valueArray = ["","baseline", "sub", "super", "top", "text-top", "middle","bottom","text-bottom","inherit"];
                    despArray = ["无","默认", "下标对齐", "上标对齐", "顶端与行中最高元素顶端对齐", "顶端与父元素字体顶端对齐", "父元素中线对齐", "顶端与行中最低元素顶端对齐", "父元素文字底部对齐","继承"];
                    break;
                case 'resize':
                    valueArray = ["","none", "both", "horizontal", "vertical"];
                    despArray = ["无","默认（不允许调整）", "可调宽高", "可调宽度", "可调高度"];
                    break;
                case 'user-select':
                    valueArray = ["","none", "text", "all", "element"];
                    despArray = ["无","默认（文本不能选）", "可选", "所有内容作为整体可选", "受元素边界约束的可选"];
                    break;
                case 'word-break':
                    valueArray = ["","normal", "keep-all", "break-all"];
                    despArray = ["无","（亚洲文字）允许换行", "不允许断字", "所有文字换行"];
                    break;
                case 'white-space':
                    valueArray = ["","normal", "pre", "nowrap","pre-wrap","pre-line","inherit"];
                    despArray = ["无","忽略", "保留", "文本不换行","保留空白符序列", "合并空白符序列", "继承"];
                    break;
                case 'text-decoration':
                    valueArray = ["","none","underline", "overline", "line-through", "blink"];
                    despArray = ["无","无装饰文字","带下划线文字", "带上划线文字", "带贯穿线文字","带闪烁文字"];
                    break;
                default:

                    valueArray = [];
                    despArray = [];
                    break;

            }
            cssPropMap[key] = {
                name: key,
                desp: value,
                type: 'string_select',
                valueArray: valueArray,
                despArray: despArray
            };
        }
    }

	/* //数值输入框
	 map = cssTypeMap.number;
	 for (key in map) {
	 if (map.hasOwnProperty(key)) {
	 value = map[key];

	 switch (key) {
	 case 'opacity':
	 defaultValue = 1;
	 break;
	 default:
	 defaultValue = 0;
	 break;

	 }
	 cssPropMap[key] = {
	 name: key,
	 desp: value,
	 type: 'number',
	 defaultValue: defaultValue
	 };
	 }
	 }
	 */
    i = cssPropOrderList.length;
    while (key = cssPropOrderList[--i]) {
        if (key = cssPropMap[key]) {
            key.index = i;
            cssPropList.push(key);
        }
    }

    return cssPropList.reverse();
});