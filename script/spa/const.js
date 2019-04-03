define(['jquery', 'apiApp', 'template'], function ($, app, artTemplate) {
    var CONST = {
        MODEL_DATA: {
            taffyList: ['menu', 'widget', 'structure', 'event', 'lifecycle', 'edmModel', 'agreeBusEdmModel', 'pageEdm', 'appAndDictList', 'response', 'request', 'role', 'var', 'code', 'docs'],
            stringList: ['name', 'desp', 'pageName', 'pageModule','customCode'],
            arrayList: ['eventHandlerList'],
            list: {
                category: {
                    valueArray: [''],
                    despArray: ['无']
                },

                dependence: {},
                version: 5.2,
                uuid: app.getUID(),
                //props
                accumulator: 0,
                eventAccumulator: 0
            }
        },
        DEFAULT_OPEN: {
            editor: {
                auiMenuFrame: 'module/auiMenuFrame',
                auiContentFrame: 'module/auiContentFrame',
                auiConfigureFrame: 'module/auiConfigureFrame'
            },
            viewer: {
                auiMenuFrame: 'module/auiMenuFrame',
                auiContentFrame: 'module/auiContentFrame',
                auiConfigureFrame: 'module/auiConfigureFrame',
                auiConfigureDefFrame: 'module/auiConfigureDefFrame',
                auiCodeFrame: 'module/auiCodeFrame'
            },
            theme: {
                auiMenuFrame: 'module/auiMenuFrame',
                auiConfigureFrame: 'module/auiConfigureFrame',
                auiConfigureDefFrame: 'module/auiConfigureDefFrame',
                auiPreviewFrame: 'module/auiPreviewFrame'
            },
            widgetCreator: {
                auiConfigureFrame: 'module/auiConfigureFrame',
                auiConfigureDefFrame: 'module/auiConfigureDefFrame',
                auiCodeFrame: 'module/auiCodeFrame',
                auiPreviewFrame: 'module/auiPreviewFrame'
            },
            navigator: {
                auiNavConfigureFrame: 'module/auiNavConfigureFrame',
                auiNavCvsFrame: 'module/auiNavCsvFrame',
                auiNavJsonFrame: 'module/auiNavJsonFrame',
                auiNavMenuTreeFrame: 'module/auiNavMenuTreeFrame',
                auiNavSqlFrame: 'module/auiNavSqlFrame'
            },
            translator: {
                auiConfigureDefFrame: 'module/auiConfigureDefFrame',
                auiDevelopmentFrame: 'module/auiDevelopmentFrame'
            }
        },
        AS_NEEDED_OPNE: {
            auiDevelopmentFrame: 'module/auiDevelopmentFrame',
            auiOverviewFrame: 'module/auiOverviewFrame',
            auiCssFrame: 'module/auiCssFrame',
            auiCodeFrame: 'module/auiCodeFrame',
            auiMenuFrame: 'module/auiMenuFrame',
            auiPreviewFrame: 'module/auiPreviewFrame',
            auiContentFrame: 'module/auiContentFrame',
            auiConfigureFrame: 'module/auiConfigureFrame',
            auiConfigureDefFrame: 'module/auiConfigureDefFrame',
        },
        CONFIGURATION_DATA: {
            webContentPath: '',
            layout: {},
            widgetCollection: {types: ['默认'], map: {}},
            referenceLine: true
        },
        CREATOR: {
            ID: 'widgetCreator',
            TYPE: 'widgetCreatorType',
            HREF: 'fake.widgetCreatorType'
        },
        HEAD: {
            BODY_HIDDEN_SELECTOR: '#bodyHidden'
        },
        STYLE_STATUS: {
            ACTIVE: 'active',
            SHOW: 'show',
            HIDE: 'hide',
            DISABLED: 'disabled',
            FOLD: 'fold'
        },
        PAGE: {
            THEME_VALUE: 'theme.agreeV5',
            NSL_VALUE: 'nsl.translator',
            CTN: '#auiPageCtn',
            CTT: '#auiPageCtt',
            ATTR_CTT: 'auiPageCtt',
            MAIN_CTT: '#auiContentContainer',
            LEFT_BAR: '#auiLeftBar',
            RIGHT_BAR: '#auiRightBar',
            STYLE: '#customClass',
            COMMON_CLASS: {
                ANGLE_UP: 'aui-jiantou-shang',
                ANGLE_DOWN: 'aui-jiantou-xia',
            },
            PANEL_SELECTOR: '#auiPagePanels',
            CTT_SELECTOR: '#auiPageCtt',
            CONFIGURE_DEF_CTN: '#auiConfigureDefCtn',
            ATTR_HREF: 'data-href',
            ATTR_HREF_SELECTOR: '[data-href]',
            ATTR_ROLE: 'data-role',
            ATTR_ROLE_SELECTOR: '[data-role]',
            START_SCREEN_SELECTOR: '#auiStartScreen',
            DATA_CODE_ID_SELECTOR: '[data-code-id]',

            NAV: {
                CTN: '#auiNavBar',
                PAGE_NAV_CTN: '#auiPageNav',
                SEARCH: '#auiNavSearch',
                HELP_BTN: '#auiNavHelpBtn',
                HELP_MODE_BTN: '#auiNavHelpModeBtn',
                REFERENCE_LINE_BTN: '#auiNavReferenceLineBtn',

                UPD_CODE_BTN: '#auiNavSaveCodeBtn',
                RESET_APP_BTN: '#auiNavResetAppBtn',

                SAVE_BTN: '#auiNavSaveBtn',

                RESET_BTN: '#auiNavResetBtn',
                RESET_LAYOUT_BTN: '#auiNavResetLayoutBtn',
                PREVIEW_BTN: '#auiNavPreviewBtn',
                TAB_RIGHT_GROUP: '#auiNavTabsRightGroup',
                REFRESH_BTN: '#auiNavRefreshModeBtn',
                DEBUG_BTN: '#auiDeBugModeBtn',
                RETURN_SQL_SELECTOR: '#auiNavUnterminalBtn',

            },
            EDM_MODAL: {
                CTN: '#auiEdmCtn',
                NAV: '#auiEdmNav',
                CLOSE_BTN: '#auiEdmCloseBtn',
                SEARCH: '#auiEdmSearch',
                SEARCH_FRAME: '#auiEdmSearchFrame',
                SEARCH_EDM_CONTENT: '#auiEdmSearchFrameEdmCtt',
                SEARCH_DICT_CONTENT: '#auiEdmSearchFrameDictCtt',
                SEARCH_PAGE_EDM_CONTENT: '#auiEdmSearchFramePageEdmCtt',
                AGREE_BUS_FRAME: '#auiEdmAgreeBusFrame',
                AGREE_BUS_SV_LIST_CTN: '#auiSvListCtn',
                AGREE_BUS_SV_SELECTED_ENTITY_NAME: '#auiSvSltEntityName',
                AGREE_BUS_SEARCH: '#auiEdmAgreeBusSearch',
                AGREE_BUS_SV_ENTITIES_CTN: '#auiSvEntitiesCtn',
                SELECTED_CTN: '#auiEdmSltCtn',
                DATASOURCE_SELECTOR: '#auiEdmDataSourceSlt',
                SELECTED_TREE: '#auiEdmSltTree',
                CUSTOM_FIELD_FRAME: '#auiEdmCustomFrame',
                CUSTOM_EDM_CONTENT: '#auiEdmCustomEdmContent',
                CUSTOM_PAGE_EDM_CONTENT: '#auiEdmCustomPageEdmContent',
                ADD_BTN: '[data-role="add"]',
                UPDATE_FRAME: '#auiEdmUpdFrame'
            },
            EVENT_LIFECYCLE_PANEL: {
                CTN_SELECTOR: '#auiYuQCtn',
                SEARCH_SELECTOR: '#auiYuQSearch',
                LIST_SELECTOR: '#auiYuQList'
            },
            MENU_FRAME: {
                TAB_CTN: '#asideTabCtn',
                NAV: '#asideNav',
                SELF: 'auiMenuFrame',
                CTN: '#auiMenuFrame',
                MENU: {
                    PLATFORM: '#auiAsidePlatformMenu',
                    BANK: '#auiAsideBankMenu',
                    APP: '#auiAsideAppMenu',
                    WIDGET_COLLECTION: '#auiAsideCollectionMenu',
                    SEARCH: '#auiAsideSearchMenu',
                },
                MENU_CLASS: {
                    SELECTOR: '.aui-aside-menu-ctn',
                    ANGLE_SELECTOR: '.aui-menu-angle',

                    MENU_ITEM: '.aui-widget-menu-item'
                },
                LAYOUT_SELECT_SELECTOR: '#aui_aside_left_layout_select',
                SEARCH_ID: 'auiAsideSearch',
                CUSTOM_MENU_ANCHOR: '[data-href="#auiAsideCollectionMenu"]',
                CHOICE: {
                    NOT_CHOOSE: {
                        'data-status': 'NOT_CHOOSE',
                        'class': 'aui aui-quxiaoshoucang aside-choose',
                        title: '添加收藏'
                    },
                    CHOSEN: {
                        'data-status': 'CHOSEN',
                        'class': 'aui  aui-shoucangzujian aside-choose',
                        title: '取消收藏'
                    }
                },

                COLLECTION_INNER_SELECTOR: '.aui-custom-menu-sortable',
                CUSTOM_MENU_BLOCK: 'aui-widget-menu-item',
                CUSTOM_MENU_CONTEXT_MENU: 'aui-context-menu',
                SEARCH_CONST: {
                    EMPTY: 'aui-search-empty',
                },
                COLLECTION_ROLE: '[data-role=menuCollection]',

                DEL_COLLECTION_GROUP: 'delCollectionGroup',

                MODIFY_TITLE: 'modifyTitle',
                MENU_NAV_LI: 'asideNavLi',
                COLLECTION: 'menuCollection',
                ANGLE_UP_TITLE: 'menuAngleUpTitle',
                CANCEL_COLLECTION: 'cancelCollection',
                TAB_CONTENT: 'auiTabContent',
                SEARCH_ATTR: 'auiAsideSearchMenu',
                COLLECTION_TYPE_ATTR: 'data-collection-type',
                WIDGET_BLOCK_CLASS: '.aui-widget-menu-block',
                WIDGET_BODY_CLASS: '.aui-widget-menu-body',
                MOVE_GROUP_LIST: 'moveGroupList',
                MOVE_TO_GROUP: 'moveToGroup',
                ADD_GROUP: 'addGroup',
                DELETE: 'delete',

                TEMP: {
                    COLLECTION_LIST_TEMP: '<div data-href="_href_" data-type="_type_" data-collect-type="_cType_" data-accept="_accept_" class="aui-widget-menu-item _accept_" >' +
                    '<small class="_icon_"></small><span>_name_</span>' +
                    '<div class="aui-widget-menu-list-icon">' +
                    '<i class="aui  aui-shoucangzujian" title="取消分组" data-role="cancelCollection"></i><i class="aui  aui-yidongfenzu" title="移动分组" data-role="moveGroupList"></i> ' +
                    '</div></div>',
                    COLLECTION_TEMP: '<li data-collection-type="_type_">' +
                    '<div class="aui-widget-menu-block" data-collection-type="_type_">' +
                    '<div class="aui-widget-menu-header">' +
                    '<i class="aui aui-jiantou-xia aui-menu-angle" data-role="collapse" />' +
                    '<span data-role="modifyTitle">_type_</span>' +
                    '<i class="aui aui-shanchu pull-right" data-role="del-collection-group" title="删除分组"></div><div class="aui-widget-menu-body"></div>' +
                    '</div></li>',
                }

            },
            OVERVIEW_FRAME: {
                SELF: 'auiOverviewFrame',
                CTN: '#auiOverviewFrame',
                TITLE_SELECTOR: '[data-role=auiOverviewTitle]'
            },
            CONTENT_FRAME: {
                TEMP: {
                    VALIDATE_TEMP: '<span class="aui-validate-icon aui-validate-_validate__icon_-icon" title="_title_" data-role="_role_"><i class="_icon__class_"></i></span>',
                    TYPE_HTML: '<div data-id="_data__id_" data-role="_type__class_OverView" data-type-id="_data__type__id_" title="_type__desp_"><span class="aui-icon-type"><i class="_type__icon_"></i></span><span >_type__desp_</span></div>'
                },

                SELF: 'auiContenFrame',
                CTN: '#auiContenFrame',
                EDITOR_CTN: '#auiEditFrame',
                COPY: 'copy',
                DEL: 'del',
                CUT: 'cut',
                PASTE: 'paste',
                TRANSLATOR_CONFIG: 'auiTranslatorConfig',
                CSS_CONFIG: 'auiCssConfig',
                EDM_REGEX_CONFIG: 'auiEdmRegexConfig',
                TREE_ITEM: 'treeItem',
                TREE_CTN: 'auiTreeCtt',
                TREE_TOGGLE: 'treeToggle',
                TREE_ITEM_ROLE: '[data-role=treeItem]',
                TREE_TOGGLE_ROLE: '[data-role=treeToggle]',
                TREE_REVOKE_ROLE: '[data-role=contentTreeRevoke]',
                TREE_LIST_ROLE: '[data-role=auiTreeList]',
                TYPE_CTN: '[data-role=eventLifecycleCtn]',
                TREE_WIDGET_NAME: '[data-event-role=treeWidgetName]',
                TREE_WIDGET_ID: '[data-event-role=treeWidgetID]',
                TREE_VALIDATE_CTT: '[data-event-role=treeValidateCtt]',

                TOGGLE_FOLD_UP: 'toggleFoldUp',
                TREE_REVOKE: 'contentTreeRevoke',
                EVENT_OVERVIEW: 'eventOverView',
                LIFECYCLE_OVERVIEW: 'lifecycleOverView',
                TYPE_ICON_MAP: {
                    event: "aui-event-type aui aui-shijian",
                    lifecycle: {
                        load_init: 'aui-init-type aui aui-shengmingzhouqichushicaozuo',//初始
                        load_interval: 'aui-interval-type aui aui-shengmingzhouqidingshicaozuo',//定时
                        pause_init: 'aui-pause-type aui aui-shengmingzhouqiqiechucaozuo',//切出
                        resume_init: 'aui-resume-type aui aui-shengmingzhouqiqierucaozuo',//切入
                        unload_init: 'aui-unload-type aui aui-xiaohuiwenjian'//销毁
                    }
                },
                TREE_ICON: [
                    {
                        role: "copy",
                        class: "aui aui-fuzhi",
                        title: "复制"
                    },
                    {
                        role: "cut",
                        class: "aui aui-jianqie",
                        title: "剪切"
                    },
                    {
                        role: "paste",
                        class: "aui aui-niantie",
                        title: "粘贴"
                    },
                    {
                        role: "del",
                        class: "aui aui-shanchu",
                        title: "删除"
                    }
                ],
                VALIDATE_ICON: {
                    CSS: {
                        icon: 'aui aui-yangshi',
                        title: '修改过样式',
                        role: 'auiConfigureCss'
                    },

                    NSL: {
                        icon: 'aui aui-guojihua',
                        title: '修改过国际化',
                        role: 'auiConfigureNsl'
                    },
                    EDM: {
                        icon: 'aui aui-xiaoyan',
                        title: '修改过校验信息',
                        role: 'auiConfigureEdmRegex'
                    }

                },
            },
            PREVIEW_FRAME: {
                IFRAME_TEMP: '<iframe data-role="iframe" class="aui-preview-iframe" src="virtualizer.html" onload="onIframeJsLoad()"></iframe>',
                SELF: 'auiPreviewFrame',
                CTN: '#auiPreviewFrame',
                CODE_BTN: 'auiPreviewCompile',
            },
            CONFIGURE_FRAME: {
                SELF: 'auiConfigureFrame',
                CTN: '#auiConfigureFrame',
                CTN_ROLE: '[data-role=auiconfigureCtn]',
                CTT: '#auiConfigureCtt',
                TITLE_ROLE: '[data-role=configWidgetName]',
                CSS: {
                    SELF: 'auiConfigureCss',
                    CTN: '#auiConfigureCss',
                    CTT: '#auiConfigureCssCtt',
                    NAME_SPACE: 'css',
                    STATUS_OF_THEME: 'changeTheme'
                },
                EDM: {
                    SELF: 'auiConfigureEdmRegex',
                    CTN: '#auiConfigureEdmRegex',
                    CTT: '#auiConfigureEdmRegexCtt',
                    NAME_SPACE: 'edm',
                },
                EVENT: {
                    SELF: 'auiConfigureEvent',
                    CTN: '#auiConfigureEvent',
                    CTT: '#auiConfigureEventCtt',
                    NAME_SPACE: 'event',
                },
                LIFECYCLE: {
                    SELF: 'auiConfigureLifecycle',
                    CTN: '#auiConfigureLifecycle',
                    CTT: '#auiConfigureLifecycleCtt',
                    NAME_SPACE: 'lifecycle'
                },
                NSL: {
                    SELF: 'auiConfigureNsl',
                    CTN: '#auiConfigureNsl',
                    CTT: '#auiConfigureNslCtt',
                    NAME_SPACE: 'nsl',
                },
                OPTION: {
                    SELF: 'auiConfigureOption',
                    CTN: '#auiConfigureOption',
                    CTT: '#auiConfigureNslCtt',
                    NAME_SPACE: 'option',
                    BASIC_EDITOR: '#auiBasicConfigEditor',
                }
            },
            CONFIGURE_DEF_FRAME: {
                CTN: '#auiConfigureDefFrame',
                SELF: 'auiConfigureDefFrame'
            },
            CODE_FRAME: {
                SELF: 'auiCodeFrame',
                SELECTOR: '#auiWCCtn',
                CODE_EDITOR_SELECTOR: '#auiWCCodeEditor',
            },
            DEVELOPMENT_FRAME: {
                SELF: 'auiDevelopmentFrame',
                TEMP: '<iframe data-role="iframe" class="aui-develop-iframe" src="docs.html" ></iframe>', /*onload="onDevelopIframeLoad()"*/
            },
            NAV_CONFIGURE_FRAME: {
                SELF: 'auiNavConfigureFrame',
                CTN: '#auiNavConfigureFrame',
                NAME_SPACE: 'auiNavConfigureFrame',
                TABLE_NAME_SELECTOR: '#tableName',
                TABLE_NAME_ID: 'tableName',
                DEFAULT_MENU: 'aweb_menu',
                ADD_TAB: 'addTab',
                DELETE_TAB: 'deleteTab',
                TAB_UL_SELECTOR: '#tabMenu',
                TAB_CONTENT_SELECTOR: '#tabContent',
                TAB_LI_SELECTOR: '#tabMenu li',
                MENU_MODELSELECTOR: "widgetInstance['optionCopy']['typeName']",
                //菜单项配置
                OPTION: [
                    {
                        name: 'lang',
                        type: 'string_select',
                        desp: '语言',
                        valueArray: ['', 'zh_cn'],
                        despArray: ['无', '中文'],
                        defaultValue: 'zh_cn'
                    },
                    {
                        name: 'type',
                        type: 'string_input',
                        desp: '渲染位置英文名'
                    },
                    {
                        name: 'typeName',
                        type: 'string_input',
                        desp: '渲染位置中文名'
                    },
                    {
                        name: 'menu',
                        type: 'object',
                        desp: '菜单项',
                        max: 1,
                        attr: [
                            {
                                name: 'id',
                                type: 'string_input',
                                desp: 'ID',
                                hidden: true,
                                defaultValue: ''
                            },
                            {
                                name: 'isParent',
                                type: 'boolean',
                                desp: '父节点',
                                defaultValue: true,
                                hidden: true
                            },
                            {
                                name: 'children',
                                type: 'array',
                                desp: '子菜单',
                                attrInEachElement: [
                                    {
                                        name: 'id',
                                        type: 'string_input',
                                        desp: 'ID',
                                        "formatter": "replace",
                                        "defaultValue": "%%_WID%%%%_INDEX%%"
                                    },
                                    {
                                        name: 'name',
                                        type: 'string_input',
                                        desp: '节点名'
                                    },
                                    {
                                        name: 'state',
                                        type: 'string_select',
                                        desp: '隐藏',
                                        valueArray: ['1', '2'],
                                        despArray: ['可用', '冻结'],
                                        defaultValue: '1'
                                    },
                                    {
                                        name: 'isParent',
                                        type: 'boolean',
                                        desp: '父节点'
                                    },
                                    {
                                        name: 'value',
                                        type: 'pageFlow',
                                        desp: '节点值',
                                        canSwap: true, //是否开启切换
                                        oldType: 'string_input',
                                        require: {
                                            isParent: [false]
                                        }
                                    },
                                    {
                                        name: 'remark',
                                        type: 'string_input',
                                        desp: '备注'
                                    },
                                    {
                                        name: 'icon',
                                        type: 'icon',
                                        desp: '图标'
                                    },
                                    {
                                        name: 'children',
                                        type: 'array',
                                        desp: '子菜单',
                                        attrInEachElement: 'self',
                                        require: {
                                            isParent: [true]
                                        }
                                    }
                                ],
                                require: {
                                    isParent: [true]
                                }
                            }
                        ]
                    }
                ],

            },
            NAV_MENU_TREE_FRAME: {
                SELF: 'auiNavMenuTreeFrame',
                CTN: '#auiNavMenuTreeFrame',
                NAME_SPACE: 'auiNavMenuTreeFrame',
                RIGHT_CONTENT_SELECTOR: '#treeMenu',
                TREE_MENU_SEARCH: '#treeMenuSearch',
            },
            NAV_SQL_FRAME: {
                SELF: 'auiNavSqlFrame',
                CTN: '#auiNavSqlFrame',
                NAME_SPACE: 'auiNavSqlFrame',
                SQL_EDITOR_SELECTOR: '#auiWCCodeEditorSql',

            },
            NAV_JSON_FRAME: {
                SELF: 'auiNavJsonFrame',
                CTN: '#auiNavJsonFrame',
                NAME_SPACE: 'auiNavJsonFrame',
                JSON_EDITOR_SELECTOR: '#auiWCCodeEditorJson'
            },
            NAV_CSV_FRAME: {
                SELF: 'auiNavCsvFrame',
                CTN: '#auiNavJsonFrame',
                NAME_SPACE: 'auiNavJsonFrame',
                CSV_EDITOR_SELECTOR: '#auiWCCodeEditorCsv',
            },
            CUSTOM_CODE_FRAME:{
                SELF: 'auiCustomCodeFrame',
                CTN: '#auiCustomCodeFrame',
                NAME_SPACE: 'auiNavJsonFrame',
                CTT:'#auiCustomCodeContent'
            }

        },
        EVENT: {
            HANDLER: {
                AJAX: 'ajax',
                AJAX_CH: '异步请求',
                CUSTOM: 'custom',
                CUSTOM_CH: '自定义',
                MODAL: 'modal',
                WINDOWS: 'window',
                SUB: 'sub',
                REDIRECT: 'redirect',
                POPOVER: 'popover',
                ajax: 'ajax',
                custom: 'custom',
                modal: 'modal',
                sub: 'sub',
                redirect: 'redirect',
                windows: 'window'
            },
            DEPENDENCE: {
                AJAX: 'ajax',
                NONE: ''
            },
            ORDER: {
                AJAX_FIRST: '',
                API_FIRST: 'api'
            }
        },
        EDM: {
            VALIDATE: {
                LIST: [{
                    name: 'ajaxType',
                    domSelector: 'ajaxType',
                    type: 'string_select',
                    valueArray: ['POST', 'GET'],
                    despArray: ['POST', 'GET'],
                    defaultValue: 'POST',
                    desp: '传参方式'
                },
                    {
                        name: 'url',
                        domSelector: 'url',
                        type: 'string_input',
                        defaultValue: '',
                        desp: 'URL',
                        details: '发起请求时的请求路径'
                    }, {
                        name: 'validate',
                        domSelector: 'validate',
                        type: 'boolean',
                        defaultValue: 'true',
                        desp: '传输数据校验'
                    }, {
                        name: 'validateContinue',
                        domSelector: 'validateContinue',
                        type: 'string_select',
                        valueArray: ['single', ''],
                        despArray: ['逐个校验', '全量校验'],
                        defaultValue: '',
                        desp: '校验模式',
                        details: '当校验失败后是否继续校验'
                    }, {
                        name: 'validateErrorCallback',
                        domSelector: 'validateErrorCallback',
                        type: 'string_select',
                        valueArray: ['', 'custom', 'alert', 'focus', 'focusAndAlert'],
                        despArray: ['默认', '自定义', '提示', '聚焦', '聚焦并提示'],
                        defaultValue: '',
                        desp: '校验错误回调',
                        details: '当校验错误后执行的回调函数'
                    }, {
                        name: 'ajaxTimeout',
                        domSelector: 'ajaxTimeout',
                        type: 'number',
                        defaultValue: '60000',
                        desp: '超时时间（ms）',
                        details: '异步请求超时时间，单位毫秒（ms）'
                    }, {
                        name: 'ajaxShelter',
                        domSelector: 'ajaxShelter',
                        type: 'string_input',
                        defaultValue: '正在加载数据，请稍候…',
                        desp: '遮罩内容',
                        details: '显示遮罩时，显示的提示语句，当值为false时，不显示遮罩'
                    }, {
                        name: 'noAgreeBusData',
                        domSelector: 'noAgreeBusData',
                        type: 'boolean',
                        defaultValue: true,
                        desp: '非AgreeBus传输协议',
                        details: '默认使用通用传输协议，若关闭该项则使用abusParams:序列化字符串'
                    }, {
                        name: 'ajaxProcessData',
                        domSelector: 'ajaxProcessData',
                        type: 'boolean',
                        defaultValue: true,
                        desp: '使用字节流传输数据',
                        details: '默认使用字节流传输数据，如果使用二进制流传输数据，需要上传文件时，应该关闭该项'
                    }, {
                        name: 'ajaxNoBlobData',
                        domSelector: 'ajaxNoBlobData',
                        type: 'boolean',
                        defaultValue: true,
                        desp: '使用字节流返回数据',
                        details: '默认使用字节流返回数据，如果返回为文件流（二进制流），应该关闭该项'
                    }, {
                        name: 'urlDivider',
                        domSelector: 'urlDivider',
                        type: 'string_input',
                        defaultValue: '\/',
                        desp: '传输参数作为请求路径数据时的分隔符',
                        details: '发起请求时，当传输参数作为路径的一部分时的分隔符'
                    }],
                WIDGET: [
                    {
                        name: 'validateHandler',
                        type: 'string_select',
                        desp: '校验方法',
                        despArray: ['使用正则表达式校验'],
                        valueArray: ['']
                    },
                    {
                        name: 'regex',
                        type: 'string_input',
                        desp: '校验正则表达式',
                        defaultValue: ''
                    },
                    {
                        name: 'errorMsg',
                        type: 'string_input',
                        desp: '校验提示',
                        defaultValue: ''
                    },
                    {
                        name: 'require',
                        type: 'string_select',
                        desp: '是否必填',
                        details: '如果必填为否，值为空时，将不做正则校验',
                        despArray: ['是', '否'],
                        valueArray: ['true', 'false'],
                        defaultValue: 'false'
                    }, {
                        name: 'hasChineseCharacter',
                        desp: '校验内容包含汉字',
                        details: '校验内容包含汉字',
                        type: 'string_select',
                        despArray: ['是', '否'],
                        valueArray: ['true', 'false'],
                        defaultValue: 'false'
                    }, {
                        name: 'minLength',
                        desp: '最小长度',
                        details: '最小长度',
                        type: 'number',
                        defaultValue: ''
                    }, {
                        name: 'maxLength',
                        desp: '最大长度',
                        details: '最大长度',
                        type: 'number',
                        defaultValue: ''
                    }
                ],
                TRANSFORM: {
                    require: 'validateRequire'
                }
            },
            DIRECTION: {
                request: 'request',
                response: 'response',
                requestText: '传输字段',
                responseText: '返回字段',
                get: 'get',
                set: 'set',
                getText: '获取',
                setText: '设置'
            },
            TYPE: {
                EDM: 'EDM',
                DICT: 'AUI_DICT',
                FIELD: 'FIELD',
                DICT_TEXT: '字典',
                CUSTOM_TEXT: '自定义字段',
                EDM_TEXT: '实体',
                FIELD_TEXT: '字段',
                PAGE_EDM: 'pageEdm',
                PAGE_EDM_TEXT: '页面变量'
            }
        },
        STEP: {
            APPLY_TO: {
                CTN: 'CTN',
                WIDGET: 'WIDGET',
                REGEX: 'REGEX',
                EVENT: 'EVENT',
                LIFECYCLE: 'LIFECYCLE',
                RESPONSE: 'RESPONSE',
                REQUEST: 'REQUEST'
            },
            ACTION: {
                CREATE: 'CRE',
                DELETE: 'DEL',
                DESTROY: 'destroy',
                UPDATE: 'UPDATE',
                OPTION: 'OPTION',
                ATTRIBUTE: 'ATTR',
                CSS: 'CSS',
                EVENT: 'EVENT',
                REGEX: 'REGEX'
            },
            BACKWARD: 'BACKWARD',
            FORWARD: 'FORWARD'
        },
        WIDGET: {
            DISTANCE: '30',
            DELAY: 100,
            Z_INDEX: 99,
            ADVANCE: 'advance_configure',
            TYPE: {
                PLATFORM: 'platform',
                BANK: 'bank',
                CUSTOM: 'custom',
                PACKAGE: 'package',
                FRAME: 'frame',
                APP: 'app',
                THEME: 'theme',
                VIEWER: 'viewer'
            },
            TYPE_TEXT: {
                PLATFORM: '平台级',
                BANK: '银行级',
                CUSTOM: '技术',
                PACKAGE: '设计灵感',
                WIDGETBUILDER: '业务',
                FRAME: '业务',
                THEME: '主题',
                VIEWER: '布局',
                APP: '项目级'
            },
            OUTSIDE_WIDGET_TYPE: {
                frame: true//,
                //package: true,
                //custom: true
            },
            WIDGET_COLLECTION_DEFAULT: '默认',
            TEXT: {
                CONFIG: '配置',
                CLOSE: '删除',
                COPY: '复制',
                CUT: '剪切',
                PASTE: '粘贴',
                RESUME: '恢复',
                CHANGE: '更改'
            },
            ACTION: {
                CONFIG: 'config',
                CLOSE: 'del',
                COPY: 'copy',
                CUT: 'cut',
                PASTE: 'paste',
                RESUME: 'resume',
                CHANGE: 'change'
            },
            SELECTOR: '.aui-widget',
            CLASSNAME: 'aui-widget',
            ACTIVE_CLASS: 'aui-widget-active',
            DATA_ATTR: 'data-widget-id',
            DATA_SELECTOR: '[data-widget-id]',
            HOVER_CLASS: 'aui-widget-hover',
            DROP_CLASS: 'aui-widget-droppable',
            UN_ACCEPTABLE: 'aui-widget-unacceptable',
            LAYOUT_CLASS: 'aui-layout-widget',
            TEMP_SELECTOR: '[data-widget-type]',
            ICON_SELECTOR: '.aui-widget-template',
            TITLE_SELECTOR: '.aui-widget-title',
            BASE_TYPE: 'page',
            PAGE_HREF: 'page.mainPanel',
            PAGE_TYPE: 'mainPanel',
            DRAGGABLE_OPTION: {
                appendTo: '#auiEditFrame',
                cursor: 'move',
                scroll: false,
                helper: function (e) {
                    var $e = $(e.target).closest('[data-type]'),
                        dataModel = window.M,
                        widget = dataModel.get('menu')({
                            href: $e.attr('data-href')
                        });

                    if (widget = widget.first()) {
                        return $('<div data-href="' + widget.href + '" class="aui-widget-block"><i class="fa aui-widget-block-icon ' + widget.icon + '"></i><div class="aui-widget-block-ttl">' + widget.name + '</div>').get(0);
                    }
                }
            },
            TOOLTIP_OPTION: {
                animation: false,
                html: true,
                placement: function (ui) {
                    var event = window.event,
                        $ui = $(ui);

                    $ui.addClass('hidden');
                    requestAnimationFrame(function () {
                        var $body = $('body');

                        $body.children('.tooltip').not($ui).remove();

                        $ui.css(app.position(event, $body, $ui, -25, -20)).removeClass('hidden');

                    }, 16);

                    return 'bottom';
                },
                title: function () {
                    var href = $(this).attr('data-href'),
                        item, content,
                        dataModel = window.M;


                    if (href && href !== 'undefined' && (item = dataModel.get('menu')({href: href}).first())) {
                        item = $.extend(true, {}, item);

                        item.belongTo = CONST.WIDGET.TYPE_TEXT[item.belongTo.toUpperCase()] + '组件';

                        if (!item.acceptName && item.accept) {
                            item.accept = item.accept.split(' ');
                            item.acceptName = [];
                            item.accept.map(function (elem) {
                                var widget;
                                if (!$AW.widget[elem]) {
                                    widget = dataModel.get('menu')({type: elem}).first();

                                    $AW.widget[elem] = widget ? widget.name : elem;
                                }

                                item.acceptName.push($AW.widget[elem]);
                            });
                            item.acceptName = item.acceptName.join('&nbsp;');
                        }

                        if (!item.baseName && item.base) {
                            item.base = item.base.split(' ');
                            item.baseName = [];
                            item.base.map(function (elem) {
                                var widget;
                                if (!$AW.widget[elem]) {
                                    widget = dataModel.get('menu')({type: elem}).first();

                                    $AW.widget[elem] = widget ? widget.name : elem;
                                }

                                item.baseName.push($AW.widget[elem]);
                            });
                            item.baseName = item.baseName.join('&nbsp;');
                        }

                        if (item.category) {
                            item.category = dataModel.get('menu')({type: item.category}).first().name;
                        }

                        content = artTemplate('auiAsideMenuTooltip', item);
                    } else {
                        content = '';
                    }
                    return content;
                },
                trigger: 'hover',
                container: 'body'
            },
            DEFAULT_ACCEPT: 'mainPanel divCtn modalCtn',
            EVENT_TYPE: {
                CODE_CHANGE: 'codeChange',
                VALUE_CHANGE: 'valueChange',
                SIZE_CHANGE: 'sizeChange',
                SHOW: 'show',
                HIDE: 'hide',
                REMOVE: 'remove',
                DEFAULT: 'default',
                RESUME: 'resume'
            },
            CONFIG_WIDGET_ID: 'widgetCreator',
            INSTANCE_WIDGET_ID: 'newWidget',
            SWAP_ROLE: '[data-role=auiConfigToolBox]',
            STRING_INPUT: 'string_input',
            INPUT_APPEND: 'input_append',
            STRING_SELECT: 'string_select'
        },
        LIFECYCLE: {
            LIFECYCLE_TEXT: {
                SPA: {
                    load_init: '初始操作',
                    load_interval: '定时操作',
                    pause_init: '切出操作',
                    resume_init: '切入操作',
                    unload_init: '销毁操作'
                }
                ,
                ACTION: {
                    CODE: '调用接口',
                    IMMEDIATE: '立即执行',
                    TIMES: '执行次数',
                    ISPAUSE: '切出暂停',
                    ISRESUME: '切入调用',
                    IS_PAUSE: '切出暂停',
                    IS_RESUME: '切入调用',
                    IS_BEFORE_INSTANCE: '组件实例化前调用',
                    CLOCK: '时钟',
                    DESP: '描述',
                    NAME: '名称',
                    ORDER: '执行顺序'
                }
            }
            ,
            CODE: {
                DEFAULT: '',
                ECHO: 'echo',
                AJAX: 'ajax'
            }
            ,
            SPA_ACTION: {
                UNLOAD: 'unload'
            }
        },
        TEMP: {
            // WIDGET_TEMP: '<div class="aui-widget" data-type="_type_" data-widget-id="_id_"><div class="aui-widget-title"><span>_name_</span></div><div class="aui-widget-template hide"><i class="_icon_"></i></div>_template_</div>',
            // WIDGET_DEFAULT_TEMP: '<div class="aui-widget-template"><i class="_icon_"></i></div>',
            EVENT_SELECTOR_SELECT: '<select id="selector" class="col-2">',
            EVENT_SELECTOR_INPUT: '<input id="selector" class="col-2" value="_VALUE_">',
            SELECT_TEMP: '<option value>请选择…</option>',
            EVENT_ADVANCE: '<div class="aui-event-sub-ctt" data-event-role="advanceBlock">' +
            '<div class="aui-config-block">' +
            ' <div class="aui-ttl" title="高级配置">高级配置' +
            '<div title="配置" class="config-modal-btn" data-role="advanceConfig"><i class="aui aui-peizhidingyi"></i>' +
            '</div>' +
            '</div>' +
            '</div>',
            POPOVER_ICON_HEADER: '<div class="aui-iconList-header clearfix">' +
            '<div class="aui-aside-search-bar-ctt"><i class="aui aui-sousuo"></i>' +
            '<input type="text" class="aui-search-query aui-iconList-searcher" placeholder="搜索图标"></div>' +
            '<div class="aui-iconList-sizeToggler"><button id="bigSize" class="toggle-btn ">大</button>' +
            '<button id="mediumSize" class="toggle-btn active">中</button>' +
            '<button id="smallSize" class="toggle-btn  ">小</button></div>' +
            '</div>',
            POPOVER_ICON_LIST: '<li class="icon-wrapper" data-value="_value_" title="_value_"><i class="_namespace_ _value_" aria-hidden="true"></i><span class="icon-name"><span>_name_</span></span></li>',
            DEL_MODLE_HTML: '<div class="aui-ide-modal-content"><i class="aui aui-round_warming"></i><span class="aui-modal-content-title">_title_</span><p>_content_</p></div>',

        },
        REGEX: {
            URL: /##[^#_]+_URL(?:_([^#]+))?##/gi,
            OVERVIEW_URL_SINGLE: /##(\d+)-OVERVIEW_URL##/,
            URL_REDUNDANCY: /(##|_URL(?:_(?:[^#]+))?##)/gi,
            URL_INDEX: /_URL_([^#]+)##$/,
            URL_ID: /^##([^#_]+)_URL/,
            WIDGET: {
                NAME: /%%_NAME%%/gi,
                INDEX: /%%_INDEX%%/gi,
                ID: /%%_WID%%/gi,
                PLACEHOLDER: /##(_(?:ID|ATTR|OPTION|CSS|URL|VAR)+)?##/gi
            }
            ,
            FOREIGN_WIDGET: {
                URL_MATCH: /%%_URL%%/ig,
                FOREIGN_WIDGET_MATCH: /%%_WID(_[^%]+)?%%/ig,
                FOREIGN_WIDGET_REDUNDANCY: /(%%|_WID(?:_[^%]+)?%%)/g,
                FOREIGN_WIDGET_SPILT: /%%_WID(_[^%]+)?%%/,
                FOREIGN_WIDGET_MATCH_PASTE: /##(?:[^#_]+)_WID(?:_[^#]+)?##/ig,
                FOREIGN_WIDGET_SPILT_PASTE: /##([^#_]+)_WID(?:_([^#]+))?##/
            }
            ,
            TYPE: {
                ID: 'id',
                OPTION: 'option',
                ATTR: 'attr',
                CSS: 'css',
                URL: 'url',
                VAR: 'var'
            }
            ,
            EVENT_FUNCTION_REPLACEMENT: '_parseFunction_function (##_EVENT##){_code_}',
            EVENT_FUNCTION_REGEX: /_code_/
        },
        DATA: {
            cannotOverride: {
                menu: true,
                widget: true,
                structure: true,
                event: true,
                lifecycle: true,
                edmModel: true,
                agreeBusEdmModel: true,
                pageEdm: true,
                appAndDictList: true,
                response: true,
                request: true,
                role: true,
                code: true,
                step: true,
                //theme:true,
                css: true,
                accumulator: true,
                eventAccumulator: true,
                dependence: true,
                category: true
            }
            ,

            appNamespaceList: ['creator', 'editor', 'builder', 'viewer'],

            viewerList: ['info', 'name', 'author', 'css', 'pType', 'frame', 'content', 'template', 'edm', 'attr', 'index', 'href', 'action', 'url', 'author', 'version', 'type', 'external', 'src', 'eventAccumulator', 'accumulator', 'jsFileContent'],
            // viewerTaffyList: [ 'event', 'code'],

            themeList: ['author', 'desp', 'details', 'index', 'href', 'icon', 'name', 'type', 'pType', 'theme', 'src', 'variables', 'version'],
            // themeTaffyList: [],

            creatorList: ['info', 'attr', 'index', 'author', 'css', 'deps', 'href', 'name', 'option', 'pType', 'template', 'type', 'action', 'api', 'event', 'version'],
            // creatorTaffyList: ['event'],

            builderList: ['info', 'name', 'author', 'event', 'index', 'template', 'type', 'version', 'edm', 'external', 'attr', 'frame', 'callback', 'action', 'href', 'deps', 'pType', 'css', 'option', 'api'],
            // builderTaffyList: ['event'],

            editorList: ['lastModifiedTime', 'name', 'desp', 'version', 'pageModule', 'accumulator', 'uuid', 'eventAccumulator', 'author', 'url', 'pageName'],
            // editorTaffyList:['event','response', 'request', 'structure', 'lifecycle', 'pageEdm', 'code','widget'],

            navigatorList: ['tableName', 'menus', 'eventAccumulator'],

            saveViewerList: ['url', 'eventAccumulator', 'accumulator', 'theme', 'variables','customCode'],
            saveThemeList: ['theme'],
            saveFresherList: ['theme', 'variables'],

            list: ['name', 'desp', 'pageName', 'pageModule', 'version', 'accumulator', 'uuid', 'eventAccumulator', 'author', 'theme', 'variables'],
            taffyList: ['event', 'response', 'request', 'structure', 'lifecycle', 'pageEdm', 'code', 'var'],


            inspirationList: ['type', 'pType', 'href']
        },
        MODE: {
            EDITOR: 'editor',
            NAVIGATOR: 'navigator',
            WIDGET_BUILDER: 'widgetBuilder',
            PACKAGE: 'package',
            VIEWER: 'viewer',
            THEME: 'theme',
            WIDGET_CREATOR: 'widgetCreator',
            VIRTUALIZER: 'virtualizer',
            COMPILER: 'compiler',
            DOCS: 'docs',
            TRANSLATOR: 'translator',
            INSPIRATION: 'inspiration',
            RECOMBINATION: {
                widgetBuilder: true,
                package: true,
                theme: true,
                frame: true,
                viewer: true
            },
            USE_VIRTUALIZER_PREVIEW: {
                editor: true,
                viewer: true,
                inspiration: true,
                widgetBuilder: true
            }
        },
        ACTION: {
            TYPE: {
                '_DEFAULT': '',
                'EVENT': 'event',
                'EDM': 'edm',
                'BEHAVIOR': 'behavior',
                'UNKNOWN': '未知或兼容模式接口'
            }
        },
        VIRTUAL_WIDGET_ID: {
            INSPECTOR: 'widgetInspector'
        },
        PARAMS_TYPE: {
            "string": "<span class='type type-string' title='字符串'>String</span>",
            "string_input": "<span class='type type-string' title='字符串'>String</span>",
            "string_select": "<span class='type type-enum' title='枚举类型'>Enum</span>",
            "boolean": "<span class='type type-boolean'>Boolean</span>",
            "number": "<span class='type type-number'>Number</span>",
            "string_select_editable": "<span class='type type-enum' title='可扩展枚举类型'>Ext-Enum</span>",
            "edm": '<span class="type type-object" title="数据字段类型">EDM</span>',
            "file": '<span class="type type-object" title="文件类型">File</span>',
            "string_html": "<span class='type type-string' title='富文本类型'>Rich Text</span>",
            "icon": '<span class="type type-icon" title="图标">Icon</span>',
            "object": '<span class="type type-object" title="对象">Object</span>',
            "event": '<span class="type type-object" title="事件句柄">Event</span>',
            "array": '<span class="type type-array" title="对象数组">Array</span>',
            "tags_input": '<span class="type type-array" title="字符串数组">StringArray</span>',
            "edmCollection": '<span class="type type-array" title="数据集合类型">EDM Collection</span>',
            "eventHandler": '<span class="type type-object" title="AWOS事件句柄">Event Handler</span>',
            "$AW": '<span class="type type-object" title="组件操纵对象实例">$AW.fn</span>',
            "jQuery": '<span class="type type-object" title="jQuery对象实例">$.fn</span>',
            "spaObject": '<span class="type type-object" title="AWEB 单页应用对象">auiCtx</span>',
            "function": '<span class="type type-object" title="函数">Function</span>',
            "handler": '<span class="type type-object" title="入参函数">Handler</span>',
            "var": '<span class="type type-object" title="变量">Variables</span>',
            "const": '<span class="type type-enum" title="常量">Const</span>',
            "url": '<span class="type type-string" title="后台服务地址">Url</span>',
            "option": '<span class="type type-object" title="组件实例配置">Option</span>',

            //配置类型
            "event_config": '<span class="type type-object" title="事件">Event</span>',
            "lifecycle_config": '<span class="type type-boolean" title="生命周期">SPA</span>',

            "_default": "<span class='type type-boolean' title='空'>Void</span>"
        },
        INFO_MAP: {
            author: true,
            name: true,
            details: true,
            compatibility: true,
            icon: true,
            category: true,
            accept: true,
            base: true,
            collapse: true,
            hidden: true,
            src: true,
            isLayout: true
        },
        WIDGET_DELEGATE_EVENT: {
            TYPE: {
                APPEND_LIFECYCLE: 'appendLifecycle',
                REMOVE_LIFECYCLE: 'removeLifecycle',
                APPEND_EVENT: 'appendEvent',
                REMOVE_EVENT: 'removeEvent'
            }
        },
        NSL: {
            TEMP_ID: 'langSelect',
            RANGE: {
                GLOBAL: 'global',
                PAGE: 'page',
                WIDGET: 'widget'
            },
            PREFIX: {
                GLOBAL: 'GLOBAL'
            },
            INDEX: 'index',
            LAYOUT: 'layout',
            PLACEHOLDER_NUM_G: /\{(\d{1,})\}/g,
            REPLACEMENT_NUM_G: '(.*)'
        },
        TAG: {
            NO_LOAD_JS: 'noLoadJs'
        },
        AWEB_JS_LOAD: {
            apiConfig: true,
            dependence: true,
            environment: true,
            fresher: true,
            api: false
        },
        PROTOCOL: {
            HTTP: 'http:',
            FILE: 'file:'
        },
        FILE_TYPE: {
            NEW: 'newDir',
            OLD: 'oldDir'
        },
        // STATIC_TARGET_PATH:'http://127.0.0.1:7350/projectSources/target/webapp',
        // STATIC_SRC_PATH:'http://127.0.0.1:7350/projectSources/src/main/webapp',
        USE_VERSION: 'useVersion',

        CONFIG_PATH:{
            newDir:{
                'awebPage':'@projectName/src/main/webapp/dependence/AWEB/css/aweb.page.less',
                'indexLayout':'@projectName/src/main/webapp/module/index.layout',
                'nsl':'@projectName/src/main/webapp/config/国际化配置.fbcpt',
                'theme':'@projectName/src/main/webapp/config/主题配置.fbcpt',
                'awebFresher':'@projectName/src/main/webapp/dependence/AWEB/js/aweb.fresher.js',
                'awebDependence':'@projectName/src/main/webapp/dependence/AWEB/js/aweb.dependence.js',
                'awebApi':'@projectName/src/main/webapp/dependence/AWEB/js/aweb.api.js',
                'awebApiConfig':'@projectName/src/main/webapp/dependence/AWEB/js/aweb.api.config.js',
                'awebEnvironment': '@projectName/src/main/webapp/dependence/AWEB/js/aweb.environment.js',
                'awebDependencePage': '@projectName/src/main/webapp/dependence/css',
                'awebThemeVariable': '@projectName/src/main/webapp/dependence/AWEB/css/aweb.theme.variable.less',
            },
            oldDir:{
                'awebPage':'@projectName/WebRoot/dependence/AWEB/css/aweb.page.less',
                'indexLayout':'@projectName/pageModule/index.layout',
                'nsl':'@projectName/webConfig/国际化配置.fbcpt',
                'theme':'@projectName/webConfig/主题配置.fbcpt',
                'awebFresher':'@projectName/WebRoot/dependence/AWEB/js/aweb.fresher.js',
                'awebDependence':'@projectName/WebRoot/webapp/dependence/AWEB/js/aweb.dependence.js',
                'awebApi':'@projectName/WebRoot/dependence/AWEB/js/aweb.api.js',
                'awebApiConfig':'@projectName/WebRoot/dependence/AWEB/js/aweb.api.config.js',
                'awebEnvironment': '@projectName/WebRoot/dependence/AWEB/js/aweb.environment.js',
                'awebDependencePage': '@projectName/WebRoot/dependence/css',
                'awebThemeVariable': '@projectName/WebRoot/dependence/AWEB/css/aweb.theme.variable.less',
            }
        },
        REPLACE_REX :window.auiApp.isNewDir|| (window.auiApp.isNewDir ===undefined && window.parent.auiApp.isNewDir) ? 'src/main/webapp' : 'WebRoot',
        REPLACE_TAG :window.auiApp.isNewDir||(window.auiApp.isNewDir ===undefined && window.parent.auiApp.isNewDir)? 'target/webapp' : 'WebContent',
        VERSION: "5.2",
        AWOS_APP_UNITED_VERSION: "520000"
    };
    return CONST;
});