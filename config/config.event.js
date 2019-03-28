define(function () {

	var eventConfig = {
			type: [
				{
					"desp": "点击 click",
					"value": "click"
				},
				{
					"desp": "获得焦点 focus",
					"value": "focus"
				},
				{
					"desp": "失去焦点 blur",
					"value": "blur"
				},
				{
					"desp": "改变 change",
					"value": "change"
				},
				{
					"desp": "选择 select",
					"value": "select"
				},
				{
					"desp": "按下键 keydown",
					"value": "keydown"
				},
				{
					"desp": "按键中 keypress",
					"value": "keypress"
				},
				/*{
					"desp": "按键起 keyup",
					"value": "keyup"
				},*/
				{
					"desp": "大小改变 resize",
					"value": "resize"
				},
				/*{
					"desp": "右键 contextmenu",
					"value": "contextmenu"
				},*/
				{
					"desp": "错误 error",
					"value": "error"
				},
				{
					"desp": "鼠标按下 mousedown",
					"value": "mousedown"
				},
				/*{
					"desp": "鼠标移入 mouseenter",
					"value": "mouseenter"
				},

				{
					"desp": "鼠标移除 mouseleave",
					"value": "mouseleave"
				},
				{
					"desp": "鼠标移动 mousemove",
					"value": "mousemove"
				},
				{
					"desp": "鼠标移出 mouseout",
					"value": "mouseout"
				},
				{
					"desp": "鼠标经过 mouseover",
					"value": "mouseover"
				},
				{
					"desp": "鼠标松开 mouseup",
					"value": "mouseup"
				},
				{
					"desp": "鼠标滚动 mousewheel",
					"value": "mousewheel"
				},*/
				{
					"desp": "页面滚动 wheel",
					"value": "wheel"
				},
				{
					"desp": "浏览器关闭前 beforeunload",
					"value": "beforeunload"
				},

				{
					"desp": "离线 offline",
					"value": "offline"
				},
				{
					"desp": "在线 online",
					"value": "online"
				}/*,

				{
					"desp": "animationend",
					"value": "animationend"
				},
				{
					"desp": "animationiteration",
					"value": "animationiteration"
				},
				{
					"desp": "animationstart",
					"value": "animationstart"
				},
				{
					"desp": "dblclick",
					"value": "dblclick"
				},
				{
					"desp": "search",
					"value": "search"
				},
				{
					"desp": "transitionend",
					"value": "transitionend"
				},
				{
					"desp": "webkitanimationend",
					"value": "webkitanimationend"
				},
				{
					"desp": "webkitanimationiteration",
					"value": "webkitanimationiteration"
				},
				{
					"desp": "webkitanimationstart",
					"value": "webkitanimationstart"
				},
				{
					"desp": "webkittransitionend",
					"value": "webkittransitionend"
				},
				{
					"desp": "abort",
					"value": "abort"
				},
				{
					"desp": "cancel",
					"value": "cancel"
				},
				{
					"desp": "canplay",
					"value": "canplay"
				},
				{
					"desp": "canplaythrough",
					"value": "canplaythrough"
				},
				{
					"desp": "close",
					"value": "close"
				},
				{
					"desp": "cuechange",
					"value": "cuechange"
				},
				{
					"desp": "drag",
					"value": "drag"
				},
				{
					"desp": "dragend",
					"value": "dragend"
				},
				{
					"desp": "dragenter",
					"value": "dragenter"
				},
				{
					"desp": "dragleave",
					"value": "dragleave"
				},
				{
					"desp": "dragover",
					"value": "dragover"
				},
				{
					"desp": "dragstart",
					"value": "dragstart"
				},
				{
					"desp": "drop",
					"value": "drop"
				},
				{
					"desp": "durationchange",
					"value": "durationchange"
				},
				{
					"desp": "emptied",
					"value": "emptied"
				},
				{
					"desp": "ended",
					"value": "ended"
				},
				{
					"desp": "input",
					"value": "input"
				},
				{
					"desp": "invalid",
					"value": "invalid"
				},
				{
					"desp": "load",
					"value": "load"
				},
				{
					"desp": "loadeddata",
					"value": "loadeddata"
				},
				{
					"desp": "loadedmetadata",
					"value": "loadedmetadata"
				},
				{
					"desp": "loadstart",
					"value": "loadstart"
				},
				{
					"desp": "pause",
					"value": "pause"
				},
				{
					"desp": "play",
					"value": "play"
				},
				{
					"desp": "playing",
					"value": "playing"
				},
				{
					"desp": "progress",
					"value": "progress"
				},
				{
					"desp": "ratechange",
					"value": "ratechange"
				},
				{
					"desp": "reset",
					"value": "reset"
				},
				{
					"desp": "scroll",
					"value": "scroll"
				},
				{
					"desp": "seeked",
					"value": "seeked"
				},
				{
					"desp": "seeking",
					"value": "seeking"
				},
				{
					"desp": "stalled",
					"value": "stalled"
				},
				{
					"desp": "submit",
					"value": "submit"
				},
				{
					"desp": "suspend",
					"value": "suspend"
				},
				{
					"desp": "timeupdate",
					"value": "timeupdate"
				},
				{
					"desp": "toggle",
					"value": "toggle"
				},
				{
					"desp": "volumechange",
					"value": "volumechange"
				},
				{
					"desp": "waiting",
					"value": "waiting"
				},
				{
					"desp": "auxclick",
					"value": "auxclick"
				},
				{
					"desp": "gotpointercapture",
					"value": "gotpointercapture"
				},
				{
					"desp": "lostpointercapture",
					"value": "lostpointercapture"
				},
				{
					"desp": "pointerdown",
					"value": "pointerdown"
				},
				{
					"desp": "pointermove",
					"value": "pointermove"
				},
				{
					"desp": "pointerup",
					"value": "pointerup"
				},
				{
					"desp": "pointercancel",
					"value": "pointercancel"
				},
				{
					"desp": "pointerover",
					"value": "pointerover"
				},
				{
					"desp": "pointerout",
					"value": "pointerout"
				},
				{
					"desp": "pointerenter",
					"value": "pointerenter"
				},
				{
					"desp": "pointerleave",
					"value": "pointerleave"
				},
				{
					"desp": "afterprint",
					"value": "afterprint"
				},
				{
					"desp": "beforeprint",
					"value": "beforeprint"
				},
				{
					"desp": "hashchange",
					"value": "hashchange"
				},
				{
					"desp": "languagechange",
					"value": "languagechange"
				},
				{
					"desp": "message",
					"value": "message"
				},
				{
					"desp": "messageerror",
					"value": "messageerror"
				},
				{
					"desp": "pagehide",
					"value": "pagehide"
				},
				{
					"desp": "pageshow",
					"value": "pageshow"
				},
				{
					"desp": "popstate",
					"value": "popstate"
				},
				{
					"desp": "rejectionhandled",
					"value": "rejectionhandled"
				},
				{
					"desp": "storage",
					"value": "storage"
				},
				{
					"desp": "unhandledrejection",
					"value": "unhandledrejection"
				},
				{
					"desp": "unload",
					"value": "unload"
				},
				{
					"desp": "appinstalled",
					"value": "appinstalled"
				},
				{
					"desp": "beforeinstallprompt",
					"value": "beforeinstallprompt"
				},
				{
					"desp": "devicemotion",
					"value": "devicemotion"
				},
				{
					"desp": "deviceorientation",
					"value": "deviceorientation"
				},
				{
					"desp": "deviceorientationabsolute",
					"value": "deviceorientationabsolute"
				}*/]
		};

	return eventConfig;
});