define(function () {
	var REGEX_CONFIG = [{
		"child": [{
			"regex": "/[\\u4e00-\\u9fa5]/gm",
			"msg": "匹配中文字符"
		}, {
			"regex": "/[^\\x00-\\xff]/igm",
			"msg": "匹配双字节字符"
		}, {"regex": "/(^\\s*)|(\\s*$)/", "msg": "匹配行尾行首空白"}, {
			"regex": "/^\\d+$/",
			"msg": "只能输入数字"
		}, {"regex": "/^\\d{n}$/", "msg": "只能输入n个数字"}, {
			"regex": "/^\\d{n,}$/",
			"msg": "至少输入n个以上的数字"
		}, {"regex": "/^\\d{m,n}$/", "msg": "只能输入m到n个数字"}, {
			"regex": "/^[a-z]+$/i",
			"msg": "只能由英文字母组成"
		}, {"regex": "/^[A-Z]+$/", "msg": "只能由大写英文字母组成"}, {
			"regex": "/^[a-z0-9]+$/i",
			"msg": "只能由英文和数字组成"
		}, {"regex": "/^\\w+$/", "msg": "只能由英文、数字、下划线组成"}], "desp": "常用字符"
	}, {
		"child": [{
			"regex": "/\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*/",
			"msg": "匹配Email地址"
		}, {
			"regex": "/^https?:\\/\\/(([a-zA-Z0-9_-])+(\\.)?)*(:\\d+)?(\\/((\\.)?(\\?)?=?&?[a-zA-Z0-9_-](\\?)?)*)*$/i",
			"msg": "匹配URL地址"
		}, {
			"regex": "/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/",
			"msg": "匹配手机号码"
		}, {
			"regex": "/^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$/",
			"msg": "匹配身份证号"
		}, {
			"regex": "/^[1-9]\\d{5}(?!\\d)$/",
			"msg": "匹配邮编号"
		}, {"regex": "/^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/", "msg": "匹配日期(yyyy-MM-dd)"}],
		"desp": "常用表单"
	}, {
		"child": [{"regex": "/msie (\\d+\\.\\d+)/i", "msg": "从UA判断是否为IE浏览器"}, {
			"regex": "/webkit/i",
			"msg": "从UA判断是否为webkit内核"
		}, {"regex": "/chrome\\/(\\d+\\.\\d+)/i", "msg": "从UA判断是否为chrome浏览器"}, {
			"regex": "/firefox\\/(\\d+\\.\\d+)/i",
			"msg": "从UA判断是否为firefox浏览器"
		}, {
			"regex": "/opera(\\/| )(\\d+(\\.\\d+)?)(.+?(version\\/(\\d+(\\.\\d+)?)))?/i",
			"msg": "从UA判断是否为opera浏览器"
		}, {
			"regex": "/(\\d+\\.\\d)?(?:\\.\\d)?\\s+safari\\/?(\\d+\\.\\d+)?/i",
			"msg": "从UA判断是否为Safari浏览器"
		}, {"regex": "/android/i", "msg": "从UA中判断是否为Android系统"}, {
			"regex": "/ipad/i",
			"msg": "从UA中判断是否为iPad"
		}, {"regex": "/iphone/i", "msg": "从UA中判断是否为iPhone"}, {
			"regex": "/macintosh/i",
			"msg": "从UA判断是否为Mac OS平台"
		}, {
			"regex": "/windows/i",
			"msg": "从UA中判断是否为Windows平台"
		}, {
			"regex": "/(nokia|iphone|android|ipad|motorola|^mot\\-|softbank|foma|docomo|kddi|up\\.browser|up\\.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam\\-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte\\-|longcos|pantech|gionee|^sie\\-|portalmmm|jig\\s browser|hiptop|^ucweb|^benq|haier|^lct|opera\\s*mobi|opera\\*mini|320x320|240x320|176x220)/i",
			"msg": "从UA中判断是否为移动终端"
		}], "desp": "浏览器navigator.userAgent"
	}, {
		"child": [{
			"regex": "/\\<link\\s(.*?)\\s*(([^&]>)|(\\/\\>)|(\\<\\/link\\>))/gi",
			"msg": "匹配link标签"
		}, {
			"regex": "/<(\\S*?) [^>]*>.*?</\\1>|<.*?/>/gm",
			"msg": "匹配HTML标签"
		}, {
			"regex": "/^[^<>`~!/@\\#}$%:;)(_^{&*=|'+]+$/",
			"msg": "匹配非HTML标签"
		}, {
			"regex": "/<script[^>]*>[\\s\\S]*?<\\/[^>]*script>/gi",
			"msg": "匹配script标签"
		}, {"regex": "/<!--[\\s\\S]*?--\\>/g", "msg": "匹配HTML注释"}, {
			"regex": "/\\[\\s*if\\s+[^\\]][\\s\\w]*\\]/i",
			"msg": "匹配HTML条件注释"
		}, {
			"regex": "/^\\[if\\s+(!IE|false)\\]>.*<!\\[endif\\]$/i",
			"msg": "匹配非IE的条件注释"
		}, {"regex": "/expression[\\s\\r\\n ]?\\(/gi", "msg": "匹配CSS expression"}, {
			"regex": "/<\\W+>/gi",
			"msg": "匹配不合法的HTML标签"
		}, {"regex": "/<textarea[^>]*>[\\s\\S]*?<\\/[^>]*textarea>/gi", "msg": "匹配textarea标签"}], "desp": "HTML相关"
	}];


	return REGEX_CONFIG;
});