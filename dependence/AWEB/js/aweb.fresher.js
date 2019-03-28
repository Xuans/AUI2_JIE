define(function () {
    return {
        "theme": {
            "ctn.foundationRowCtn": {
                "_default": {
                    "title": {
                        "color": "@sFontcolor",
                        "font-weight": "@fontWeight"
                    }, "content": {"border-width": "1px", "opacity": 1}
                }
            },
            "component.dataTables": {
                "_default": {
                    "btnHover": {"background-color": "@sBtnHoverColor"},
                    "radio": {"background-color": "@sBlockColor", "border-color": "@sLineColor"},
                    "btnFocus": {"background-color": "@sDefBtnColor"},
                    "checkbox": {"background-color": "@sBlockColor", "border-color": "@sLineColor"},
                    "header": {"font-weight": "@fontWeight"},
                    "btn": {"background-color": "@sDefBtnColor"},
                    "btnActive": {"background-color": "@sDefBtnColor"}
                }
            },
            "component.foundationForm.foundationWangEditor": {
                "_default": {
                    "border": {"border-color": "@sFormBorderColor"},
                    "item": {"font-size": "@sFontSize"},
                    "itemHover": {"background-color": "@sLowColor"},
                    "title": {"color": "@sFontcolor", "font-weight": "@fontWeight", "font-size": "@sFontSize"},
                    "itemActive": {"color": "@sBlockColor"}
                }
            },
            "ctn.divCtn": {
                "_default": {
                    "title": {"color": "@sFontcolor", "font-weight": "@fontWeight"},
                    "content": {"border-radius": "@sRadius", "border-width": "1px", "opacity": 1}
                }
            },
            "component.foundationForm.foundationInput": {
                "_default": {
                    "input": {
                        "border-radius": "@borderRadius",
                        "border-color": "@sFormBorderColor",
                        "border-width": "1px"
                    },
                    "title": {"color": "@sFontcolor", "font-weight": "@fontWeight", "font-size": "@sFontSize"},
                    "inputIconHover": {"color": "@sBlockColor"}
                }
            },
            "ctn.foundationFormCtn": {
                "_default": {
                    "title": {"color": "@sFontcolor", "font-weight": "@fontWeight"},
                    "content": {"border-width": "1px", "opacity": 1}
                }
            },
            "component.foundationForm.foundationPassword": {
                "_default": {
                    "input": {
                        "border-color": "@sFormBorderColor",
                        "border-radius": "@borderRadius",
                        "border-width": "1px"
                    },
                    "title": {"color": "@sFontcolor", "font-weight": "@fontWeight", "font-size": "@sFontSize"},
                    "inputIconHover": {"color": "@sBlockColor"},
                    "inputActive": {"border-color": "@sFormBorderHoverColor"}
                }
            },
            "ctn.loginCtn": {
                "_default": {
                    "iconBlock": {"background-color": "@sBlockColor"},
                    "title": {"color": "#a6a6a6", "font-size": "28px", "text-align": "center"},
                    "content": {"border-radius": "8px", "background-color": "#ffffff"}
                }
            },
            "component.foundationForm.foundationSingleUpload": {
                "_default": {
                    "input": {
                        "border-radius": "px",
                        "border-color": "@sDisableColor",
                        "border-width": "1px",
                        "border-style": "solid"
                    },
                    "inputIconHover": {"color": "@sBlockColor"},
                    "inputActive": {"border-color": "@sFormBorderHoverColor"}
                }
            },
            "component.foundationForm.foundationVerifyInput": {
                "_default": {
                    "input": {
                        "border-radius": "@borderRadius",
                        "border-color": "@sFormBorderColor"
                    },
                    "title": {"color": "@sFontcolor", "font-weight": "@fontWeight", "font-size": "@sFontSize"},
                    "inputIconHover": {"color": "@sBlockColor"}
                }
            },
            "component.foundationForm.foundationCheckboxGroup": {
                "_default": {
                    "inputHover": {"border-color": "@sBlockColor"},
                    "inputChecked": {"background-color": "@sBlockColor", "border-color": "@sBlockColor"},
                    "checkbox": {"border-radius": "@borderRadius"},
                    "label": {"color": "@sFontcolor", "font-weight": "@fontWeight", "font-size": "@sFontSize"},
                    "font": {"font-size": "@sFontSize"}
                }
            },
            "component.leftCatalog": {
                "_default": {
                    "selectedMenu": {"background-color": "@sBlockColor"},
                    "menuHover": {"color": "#fff"},
                    "showMenu": {"color": "#fff"},
                    "menu": {"background-color": "@sLv1MenuBgColor"}
                }
            },
            "component.other.multipleChoiceListBox": {
                "_default": {
                    "button": {
                        "border-radius": "@borderRadius",
                        "border-width": "1px"
                    },
                    "search": {"border-radius": "@borderRadius", "border-width": "1px"},
                    "menuList": {"color": "@sFontcolor", "font-size": "@sFontSize"},
                    "menuListHover": {"background-color": "@sLowColor"},
                    "checkBox": {"background-color": "@sBlockColor", "border-color": "@sBlockColor"},
                    "active": {"background-color": "@sBlockColor"},
                    "title": {"color": "@sFontcolor", "font-weight": "@fontWeight", "font-size": "@sFontSize"}
                }
            },
            "layout.tabCtn": {
                "_default": {
                    "tabName": {"background-color": "#ffffff", "color": "@sUndefinedColor"},
                    "tabNameActive": {"color": "@sHighColor"},
                    "tabNameHover": {"color": "@sBlockColor"},
                    "ctn": {"overflow": "visible", "position": "static"}
                }
            },
            "component.btn.normalBtn": {
                "css": {
                    "theme": [{
                        "template": "<button class='btn'></button>",
                        "desp": "功能",
                        "name": "function",
                        "zoom": 0.8,
                        "valueArray": ["btn-focus", "btn-normal", "btn-textBtn", "btn-danger", "btn-custom"],
                        "despArray": ["焦点", "普通", "文字", "警告", "自定义"]
                    }]
                },
                "btn-focus": {
                    "border": {"border-radius": "@borderRadius"},
                    "hover": {"background-color": "@sBtnHoverColor"},
                    "backgroundColor": {"background-color": "@sDefBtnColor"},
                    "font": {"color": "#ffffff"}
                },
                "btn-normal": {
                    "border": {
                        "border-radius": "@borderRadius",
                        "border-color": "@sDefBtnColor",
                        "border-width": "1px",
                        "border-style": "solid"
                    },
                    "hover": {
                        "background-color": "rgba(0,0,0,0.02)",
                        "color": "@sBtnHoverColor",
                        "border-color": "@sBtnHoverColor",
                        "border-width": "1px"
                    },
                    "backgroundColor": {"background-color": "rgba(0,0,0,0)"},
                    "icon": {"color": "@sDefBtnColor"},
                    "font": {"color": "@sDefBtnColor"}
                },
                "btn-textBtn": {
                    "hover": {"background-color": "rgba(0,0,0,0)"},
                    "backgroundColor": {"background-color": "rgba(0,0,0,0)"},
                    "font": {"color": "@sBlockColor"}
                },
                "btn-danger": {
                    "hover": {
                        "background-color": "@sWarngBtnHoverColor",
                        "border-color": "@sWarngBtnHoverColor"
                    }, "backgroundColor": {"background-color": "@sWarningColor"}, "font": {"color": "#ffffff"}
                },
                "btn-custom": {
                    "hover": {"background-color": "@sDisableBtnColor"},
                    "backgroundColor": {"background-color": "@sDisableBtnColor"},
                    "icon": {"color": "@sSecondaryInfo"},
                    "font": {"color": "@sDisableColor"}
                }
            },
            "component.foundationForm.foundationSelect": {
                "_default": {
                    "input": {
                        "border-radius": "@borderRadius",
                        "border-color": "@sFormBorderColor"
                    },
                    "search": {"border-radius": "@borderRadius"},
                    "menuList": {"font-size": "@sFontSize"},
                    "downMenuColor": {"background-color": "@sLowColor"},
                    "title": {"color": "@sFontcolor", "font-weight": "@fontWeight", "font-size": "@sFontSize"},
                    "downMenu": {"border-radius": "@borderRadius"}
                }
            },
            "ctn.modalCtn": {
                "_default": {
                    "cancelBtn": {"color": "@sDefBtnColor", "border-color": "@sDefBtnColor"},
                    "line": {"border-width": "1px"},
                    "icon": {"font-weight": 200},
                    "confirmBtn": {"background-color": "@sDefBtnColor"},
                    "title": {"background-color": "#fafafa", "color": "@sFontcolor", "font-weight": "@fontWeight"},
                    "ignoreBtn": {"background-color": "@sDisableBtnColor", "color": "@sDisableColor"},
                    "content": {"border-width": "1px", "opacity": 1}
                }
            },
            "component.foundationForm.foundationDatepicker": {
                "_default": {
                    "input": {
                        "border-radius": "@borderRadius",
                        "border-color": "@sFormBorderColor"
                    },
                    "inputHover": {"border-color": "@sFormBorderHoverColor"},
                    "mainColor": {"background-color": "@sLowColor", "color": "@sBlockColor"},
                    "inputIcon": {"color": "@sDisableColor"},
                    "title": {"color": "@sFontcolor", "font-weight": "@fontWeight", "font-size": "@sFontSize"},
                    "inputIconHover": {"color": "@sBlockColor"}
                }
            },
            "component.foundationForm.foundationText": {
                "_default": {
                    "title": {
                        "color": "@sFontcolor",
                        "font-weight": "@fontWeight",
                        "font-size": "@sFontSize"
                    }, "content": {"font-size": "@sFontSize", "line-height": 1}
                }
            },
            "component.foundationForm.foundationUploadButton": {
                "_default": {
                    "uploadFile": {
                        "background-color": "@sDefBtnColor",
                        "color": "#ffffff"
                    },
                    "uploadDiv": {"border-radius": "@borderRadius"},
                    "selectFile": {
                        "background-color": "rgba(0,0,0,0)",
                        "color": "@sDefBtnColor",
                        "border-color": "@sDefBtnColor"
                    }
                }
            },
            "component.foundationForm.foundationTreeSelect": {
                "_default": {
                    "arrowIcon": {"font-size": "@sFontSize"},
                    "input": {"border-radius": "@borderRadius", "border-color": "@sFormBorderColor"},
                    "search": {"border-radius": "@borderRadius"},
                    "menuList": {"font-size": "@sFontSize"},
                    "menuListHover": {"background-color": "@sLowColor"},
                    "checkBox": {"color": "@sBlockColor", "font-size": "@sFontSize"},
                    "title": {"color": "@sFontcolor", "font-weight": "@fontWeight", "font-size": "@sFontSize"},
                    "downMenu": {"border-radius": "@borderRadius"}
                }
            },
            "component.zTree": {
                "_default": {
                    "checkbox": {"border-radius": "@sRadius", "color": "@sBlockColor"},
                    "fontHover": {"background-color": "@sLowColor"}
                }
            },
            "component.foundationForm.foundationTextArea": {
                "_default": {
                    "title": {
                        "color": "@sFontcolor",
                        "font-weight": "@fontWeight",
                        "font-size": "@sFontSize"
                    },
                    "textArea": {
                        "border-radius": "@borderRadius",
                        "line-height": 1,
                        "border-color": "@sFormBorderColor",
                        "border-width": "1px"
                    }
                }
            },
            "component.foundationForm.foundationSwitch": {
                "_default": {
                    "disabled": {
                        "background-color": "@sDisableColor",
                        "color": "@sFontcolor",
                        "font-size": "@sFontSize"
                    },
                    "title": {"color": "@sFontcolor", "font-weight": "@fontWeight", "font-size": "@sFontSize"},
                    "close": {
                        "background-color": "@sDisableColor",
                        "font-size": "@sFontSize",
                        "border-color": "@sDisableColor"
                    },
                    "open": {
                        "background-color": "@sBlockColor",
                        "font-size": "@sFontSize",
                        "border-color": "@sBlockColor"
                    }
                }
            },
            "component.topNav": {
                "_default": {
                    "rmbtnhover": {"background-color": "@sBlockColor"},
                    "rbtniconhover": {"background-color": "@sBlockColor", "color": "#fff"},
                    "rbtnhover": {"color": "@sBlockColor"},
                    "lbtn1hover": {"color": "@sBlockColor"}
                }
            },
            "component.btn.dropdownBtn": {
                "css": {
                    "theme": [{
                        "template": "<button class=\"btn dropdowns\"></button>",
                        "desp": "功能",
                        "name": "function",
                        "zoom": 0.8,
                        "valueArray": ["btn-focus", "btn-normal", "btn-textBtn", "btn-danger", "btn-custom"],
                        "despArray": ["焦点", "普通", "文字", "警告", "自定义"]
                    }]
                },
                "_default": {"hover": {"background-color": "@sBtnHoverColor"}},
                "btn-focus": {
                    "border": {"border-radius": "@borderRadius"},
                    "hover": {"background-color": "@sBtnHoverColor"},
                    "backgroundColor": {"background-color": "@sDefBtnColor"},
                    "font": {"color": "#ffffff"}
                },
                "btn-normal": {
                    "border": {
                        "border-radius": "@borderRadius",
                        "border-color": "@sDefBtnColor",
                        "border-width": "1px",
                        "border-style": "solid"
                    }, "backgroundColor": {"background-color": "rgba(0,0,0,0)"}
                },
                "btn-textBtn": {
                    "backgroundColor": {"background-color": "rgba(0,0,0,0)"},
                    "font": {"color": "@sBlockColor"}
                },
                "btn-danger": {
                    "border": {"border-radius": "@borderRadius"},
                    "hover": {"background-color": "@sWarngBtnHoverColor"},
                    "backgroundColor": {"background-color": "@sWarningColor"},
                    "font": {"color": "#ffffff"}
                },
                "btn-custom": {
                    "hover": {"background-color": "@sDisableBtnColor"},
                    "backgroundColor": {"background-color": "@sDisableBtnColor"}
                }
            },
            "component.foundationForm.foundationRadioGroup": {
                "_default": {
                    "inputHover": {"border-color": "@sBlockColor"},
                    "inputChecked": {
                        "background-color": "@sBlockColor",
                        "color": "@sBlockColor",
                        "font-size": "@sFontSize",
                        "border-color": "@sBlockColor"
                    },
                    "label": {"color": "@sFontcolor", "font-weight": "@fontWeight", "font-size": "@sFontSize"},
                    "font": {"font-size": "@sFontSize"}
                }
            },
            "component.foundationForm.foundationDigitInput": {
                "_default": {
                    "input": {"border-color": "@sFormBorderColor"},
                    "buttonHover": {"color": "@sBlockColor"},
                    "title": {"color": "@sFontcolor", "font-weight": "@fontWeight", "font-size": "@sFontSize"}
                }
            }
        },
        "variables": [{
            "desp": "系统块状主色，图形主色",
            "defaultValue": "#04bebd",
            "cssAttrs": ["color", "icon-color", "background-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color"],
            "name": "sBlockColor"
        }, {
            "desp": "系统主色浅一度",
            "defaultValue": "rgba(4,190,189,0.1)",
            "cssAttrs": ["color", "icon-color", "background-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color"],
            "name": "sLowColor"
        }, {
            "desp": "系统主色深一度",
            "defaultValue": "#00a4af",
            "cssAttrs": ["background-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "color", "icon-color"],
            "name": "sHighColor"
        }, {
            "desp": "系统默认按钮色",
            "defaultValue": "#4a5659",
            "cssAttrs": ["color", "background-color", "border-color"],
            "name": "sDefBtnColor"
        }, {
            "desp": "系统默认按钮hover色",
            "defaultValue": "#546063",
            "cssAttrs": ["color", "background-color", "border-color"],
            "name": "sBtnHoverColor"
        }, {
            "desp": "系统文字和线框主色",
            "defaultValue": "#a6a6a6",
            "cssAttrs": ["color", "icon-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color"],
            "name": "sLineColor"
        }, {
            "desp": "系统表单线框主色",
            "defaultValue": "#cccccc",
            "cssAttrs": ["icon-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color"],
            "name": "sFormBorderColor"
        }, {
            "desp": "系统表单线框hover色",
            "defaultValue": "#888888",
            "cssAttrs": ["color", "icon-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color"],
            "name": "sFormBorderHoverColor"
        }, {
            "desp": "成功状态配色",
            "defaultValue": "#23AD44",
            "cssAttrs": ["color", "icon-color", "background-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color"],
            "name": "sSuccessColor"
        }, {
            "desp": "危险状态配色",
            "defaultValue": "#f05050",
            "cssAttrs": ["color", "icon-color", "background-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color"],
            "name": "sWarningColor"
        }, {
            "desp": "危险状态hover色",
            "defaultValue": "#fa5a5a",
            "cssAttrs": ["color", "background-color", "border-color"],
            "name": "sWarngBtnHoverColor"
        }, {
            "desp": "主info色配色",
            "defaultValue": "#3DB9FF",
            "cssAttrs": ["color", "icon-color", "background-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color"],
            "name": "sMainInfo"
        }, {
            "desp": "次Info配色",
            "defaultValue": "#7266ba",
            "cssAttrs": ["color", "icon-color", "background-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color"],
            "name": "sSecondaryInfo"
        }, {
            "desp": "未定义状态配色",
            "defaultValue": "#a6a6a6",
            "cssAttrs": ["color", "icon-color", "background-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color"],
            "name": "sUndefinedColor"
        }, {
            "desp": "失效状态背景色",
            "defaultValue": "#f2f2f2",
            "cssAttrs": ["background-color"],
            "name": "sDisableBtnColor"
        }, {
            "desp": "失效状态文字线框颜色",
            "defaultValue": "#CCCCCC",
            "cssAttrs": ["color", "icon-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color"],
            "name": "sDisableColor"
        }, {
            "desp": "系统字体颜色",
            "defaultValue": "#333333",
            "cssAttrs": ["color", "icon-color"],
            "name": "sFontcolor"
        }, {
            "desp": "系统标准字体大小",
            "defaultValue": "12px",
            "cssAttrs": ["font-size"],
            "name": "sFontSize"
        }, {
            "desp": "系统中文字体",
            "defaultValue": "sans-serif",
            "cssAttrs": ["font-family"],
            "name": "sChfontFamily"
        }, {
            "desp": "系统边角弧度",
            "defaultValue": "4px",
            "cssAttrs": ["border-radius", "border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius", "border-color"],
            "name": "borderRadius"
        }, {"desp": "系统字体粗细", "defaultValue": 400, "cssAttrs": ["font-weight"], "name": "fontWeight"}, {
            "desp": "警告状态色",
            "defaultValue": "#FFBA00",
            "cssAttrs": ["background-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "color", "icon-color"],
            "name": "sWarnDangerColor"
        }, {
            "desp": "左渐变背景",
            "defaultValue": "linear-gradient(to left, #35b5c2, #69E9C2)",
            "cssAttrs": ["background-image"],
            "name": "leftBgImg"
        }, {
            "desp": "右渐变背景",
            "defaultValue": "linear-gradient(to right, #35b5c2, #69E9C2)",
            "cssAttrs": ["background-image"],
            "name": "rightBgImg"
        }, {
            "desp": "向底渐变",
            "defaultValue": "linear-gradient(to bottom, #35b5c2, #69E9C2)",
            "cssAttrs": ["background-image"],
            "name": "bottomBgImg"
        }, {
            "desp": "向上渐变背景",
            "defaultValue": "linear-gradient(to top, #35b5c2, #69E9C2)",
            "cssAttrs": ["background-image"],
            "name": "topBgImg"
        }]
    };
});