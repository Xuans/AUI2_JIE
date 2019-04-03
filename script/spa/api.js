(function (undefined) {
    (function (factory) {
        if (typeof define === "function" && define.amd) {
            define(['jquery', 'const', 'vue', 'aweb.api', 'toolset', 'base', 'index', 'Model.Data', 'config.widget', 'vs/loader', 'vs/editor/editor.main'], factory);
        } else {
            factory()
        }
    })
    (function ($, CONST, Vue, awebApiConfig, toolset, base, AUI, dataModel, WidgetConfig) {


        var PROJECT = 'project',
            PLATFORM = 'platform',
            UNIVERSAL = 'universal',
            endIcons = [{
                name: 'edition',
                class: 'aui aui-danger_fill',
                show: false,
                title: '多版本'
            }, {
                name: 'update',
                class: 'aui aui-fanbianyi',
                show: false,
                title: '更新'
            }, {
                name: 'add',
                class: 'aui aui-xinzeng',
                show: false,
                title: '新增'
            }, {
                name: 'delete',
                class: 'aui aui-shanchu',
                show: false,
                title: '删除'
            }, {
                name: 'edit',
                class: 'aui aui-bianji',
                show: false,
                title: '修改'
            }],

            sourcesMap = JSON.parse(JSON.stringify(WidgetConfig.appInterfacesSources)),

            config = {
                'const': [{
                    name: 'category',
                    type: 'string_input',
                    desp: '类型'
                },
                    {
                        name: 'valueArray',
                        // type: 'string_simpleHtml',
                        // desp: '选项值集合',
                        // language: 'javascript'
                    },
                    {
                        name: 'despArray',
                        // type: 'string_simpleHtml',
                        // desp: '选项中文名集合',
                        // language: 'javascript'
                    }
                ],
                'interface': [{
                    name: 'desp',
                    type: 'string_input',
                    desp: '中文名'
                }, {
                    name: 'name',
                    type: 'string_input',
                    desp: '接口名'
                },
                {
                    name: 'depJsArr',
                    type: 'string_input',
                    desp: '依赖',
                    defaultValue:'[]'
                },
                    // {
                    //     name: 'details',
                    //     type: 'string_input',
                    //     desp: '详情'
                    // },
                    {
                        name: 'belongTo',
                        type: 'string_select',
                        desp: '类型',
                        valueArray: ['function', 'class', 'closure'],
                        despArray: ['方法', '类', '闭包']
                    },
                    {
                        name: 'params',
                        desp: '入参',
                        type: 'array',
                        attrInEachElement: [{
                            name: 'name',
                            desp: '英文名',
                            type: 'string_input'
                        },
                            {
                                name: 'desp',
                                desp: '描述',
                                type: 'string_input'
                            },
                            WidgetConfig.paramType,
                            {
                                name: 'necessary',
                                desp: '是否必填',
                                type: 'boolean',
                                defaultValue: true
                            },
                            {
                                name: 'defaultValue',
                                type: 'string_simpleHtml',
                                desp: '默认值',

                            },
                            {
                                name: 'children',
                                desp: '子参数',
                                type: 'array',
                                attrInEachElement: 'self',
                                require: {
                                    type: ['object', 'array']
                                }
                            }
                        ],
                        require: {
                            belongTo: ['function', 'closure']
                        }
                    }, {
                        name: 'hasReturn',
                        desp: '是否有出参',
                        type: 'boolean',
                        defaultValue: false,
                        require: {
                            belongTo: ['function', 'closure']
                        }
                    },
                    {
                        name: 'returnValue',
                        desp: '出参',
                        type: 'object',
                        attr: [{
                            name: 'name',
                            desp: '英文名',
                            type: 'string_input'
                        },
                            {
                                name: 'desp',
                                desp: '描述',
                                type: 'string_input'
                            }, {
                                name: 'details',
                                desp: '详情',
                                type: 'string_input'
                            },
                            WidgetConfig.paramType,
                            {
                                name: 'children',
                                desp: '子元素',
                                type: 'array',
                                attrInEachElement: 'self',
                                require: {
                                    type: ['object', 'array']
                                }
                            },
                            {
                                name: 'defaultValue',
                                type: 'string_simpleHtml',
                                desp: '默认值',
                            }

                        ],
                        require: {
                            hasReturn: [true]
                        }
                    },
                    {
                        name: 'cInterfaces',
                        type: 'array',
                        desp: '子方法',
                        attrInEachElement: [{
                            name: 'desp',
                            type: 'string_input',
                            desp: '中文名'
                        }, {
                            name: 'name',
                            type: 'string_input',
                            desp: '接口名'
                        },

                            {
                                name: 'details',
                                type: 'string_input',
                                desp: '详情'
                            },
                            {
                                name: 'params',
                                desp: '入参',
                                type: 'array',
                                attrInEachElement: [{
                                    name: 'name',
                                    desp: '名称',
                                    type: 'string_input'
                                },
                                    {
                                        name: 'desp',
                                        desp: '描述',
                                        type: 'string_input'
                                    },
                                    {
                                        desp: '在逻辑概览中的默认配置类型',
                                        name: 'overviewType',
                                        type: 'string_select',
                                        valueArray: ['default', 'interface', 'request', 'response'],
                                        despArray: ['默认', '接口', '传输数据', '返回数据']
                                    },
                                    WidgetConfig.paramType,
                                    {
                                        name: 'defaultValue',
                                        desp: '默认值',
                                        type: 'string_input',
                                        require: {
                                            type: ['string', 'number', 'boolean']
                                        }
                                    },
                                    {
                                        name: 'children',
                                        desp: '子参数',
                                        type: 'array',
                                        attrInEachElement: 'self',
                                        require: {
                                            type: ['object', 'array', 'handler']
                                        }
                                    }
                                ]
                            }, {
                                name: 'hasReturn',
                                desp: '是否有出参',
                                type: 'boolean',
                                defaultValue: true
                            },
                            {
                                name: 'returnValue',
                                desp: '出参',
                                type: 'object',
                                attr: [{
                                    name: 'name',
                                    desp: '名称',
                                    type: 'string_input'
                                },
                                    {
                                        name: 'desp',
                                        desp: '描述',
                                        type: 'string_input'
                                    },
                                    WidgetConfig.paramType,
                                    {
                                        name: 'defaultValue',
                                        desp: '默认值',
                                        type: 'string_input',
                                        require: {
                                            type: ['string', 'number', 'boolean']
                                        }
                                    },
                                    {
                                        name: 'children',
                                        desp: '子元素',
                                        type: 'array',
                                        attrInEachElement: 'self',
                                        require: {
                                            type: ['object', 'array']
                                        }
                                    }
                                ],
                                require: {
                                    hasReturn: [true]
                                }
                            }
                        ],
                        require: {
                            belongTo: ['class']
                        },

                    },
                    // {
                    //     name: 'defaultValue',
                    //     type: 'string_simpleHtml',
                    //     desp: '默认值'
                    // }
                ],
            },


            API = function (sources) {

                this.platformInterfaces = $.extend(true, {}, awebApiConfig.appInterfaces);
                this.platformInterfacesConst = $.extend(true, {}, awebApiConfig.appInterfacesConst);
                this.projectInterfaces = $.extend(true, {}, dataModel.get('awebApi').appInterfaces);
                this.projectInterfacesConst = $.extend(true, {}, dataModel.get('awebApi').appInterfacesConst);

                this.sources = sources;
                this.platformInterfaceMap = {};
                this.projectInterfaceMap = {};
                this.projectCategoryMap = {};
                this.platformConstMap = {};
                this.projectConstMap = {};
                this.currentConfig = {};
                this.treeNode = [];

                this.init();
                this.listener();


            };


        API.prototype = {

            constructor: API,
            SET_CONFIG_ITEM_ID: 'apiConfigItem',
            $mask: $('.aui-overview-mask', 'body'),
            $interfaceResetPanel: $('#auiInterfaceReset'),
            elementForVue: '<div id="auiApiResetCtn"></div>',
            init: function () {

                var context = this;

                context.$mask.removeClass('hide');
                AUI.zoomIn(context.$interfaceResetPanel);
                app.shelter.upperZIndex(15000, 15001, false);

                context.$interfaceResetPanelBody = $('.aui-overview-panel-body', context.$interfaceResetPanel);
                context.$interfaceResetPanelBody.empty().append(context.elementForVue);
                context.initMap();
                context.initTreeNode();

                context.vueInstance = new Vue({
                    el: '#auiApiResetCtn',

                    template: [
                        '<div class="aui-api-container">' +
                        '<div class="aui-overview-clean-tool-panel">' +
                        '<div v-show="showRight" class="aui-overview-clean-api-title">{{currentTitle}}{{diffTip}}</div>' +
                        '<div class="aui-btn-ctn">' +
                        // '<button v-show="showRevert" class="aui-btn"><i title="回撤" class="aui aui-fanbianyi"></i></button>' +
                        '<button v-show="showRight"  class="aui-btn" @click.stop="saveJs"><i title="保存" class="aui aui-baocun" ></i></button>' +
                        '</div>' +
                        '</div>' +

                        '<div class="aui-api-main">' +

                        '<div class="aui-api-tree">' +
                        '<Tree show-checkbox @selected="apiSelected" @on-check-change="checkChange" @on-click-end-icon="clickEndIcon" :data="treeData" ref="tree"></Tree>' +
                        '</div>' +

                        '<div class="aui-api-content"  v-show="showRight">' +
                        '<div class="aui-api-config">' +
                        '<div data-role="wrapper">' +
                        '<div class="aui-api-content-title">配置</div>' +
                        '<div id=' + context.SET_CONFIG_ITEM_ID + '></div>' +
                        '</div>' +
                        '</div>' +

                        '<div class="aui-api-code" style="height:100%;width:100%">' +
                        '<div class="aui-api-content-title">接口代码</div>' +
                        '<div class="aui-overview-merge-platform">' +
                        '<label>平台</label>' +
                        '<i-select  v-model="version" v-if="showVersion"><i-option v-for="item in versionSources" :value="item">{{sourcesMap[item]}}</i-option></i-select>' +
                        '</div>' +
                        '<div class="aui-overview-merge-custom"><label>项目</label></div>' +
                        '<div style="width: 100%; height: 100%" v-code=""></div>' +
                        '</div>' +

                        '</div>' +

                        '</div>' +
                        '</div>'
                    ].join(''),

                    created: function () {

                    },


                    mounted: function () {

                        this.showRight = false;
                    },

                    directives: {
                        code: {
                            inserted: function (el) {
                                context.diffEditorInstance = monaco.editor.createDiffEditor(el, {
                                    enableSplitViewResizing: false
                                });

                                context.diffEditorInstance.setModel({
                                    original: monaco.editor.createModel('', 'text/javascript'),
                                    modified: monaco.editor.createModel('', 'text/javascript')
                                });

                            },

                            update: function (el, binding) {
                                // diffEditorInstance.setValue(binding.value.value);
                            }
                        }
                    },

                    data: function () {

                        return {
                            sourcesMap: sourcesMap,
                            treeData: context.treeNode,
                            showRight: true,
                            currentTitle: '',
                            currentSelectName: '',
                            diffTip: '',
                            showVersion: false,
                            version: UNIVERSAL,
                            sources: context.sources,
                            versionSources: [],
                            currentType: 'interface',
                            showRevert: false,
                            currentNode: null

                        }

                    },

                    watch: {
                        version: function (newVal) {
                            this.setCode(newVal);

                        }
                        // versionSources:function (newVal) {
                        //
                        //     if(newVal.length===1){
                        //         this.version=newVal[0];
                        //     }
                        //
                        //
                        // },
                        // currentNode:function (newVal) {
                        //     if(newVal){
                        //         this.version=newVal.compareVer;
                        //         this.showRight=true;
                        //     }
                        // }


                    },

                    methods: {
                        setCode: function (version) {
                            var diffEditorInstance = context.diffEditorInstance,
                                originalEditor = diffEditorInstance.getOriginalEditor(),
                                modifiedEditor = diffEditorInstance.getModifiedEditor(),
                                currentPlatform = this.getCodeConfig(PLATFORM),
                                currentProject = this.getCodeConfig(PROJECT),
                                platformCode,
                                projectCode;

                            platformCode = (currentPlatform && currentPlatform.edition[version]) || '';

                            projectCode = currentProject ? (currentProject.edition[version] || '') : currentPlatform.edition[version] || '';

                            originalEditor.setValue(platformCode);
                            modifiedEditor.setValue(projectCode);

                        },
                        getCodeConfig: function (flag) {
                            var currentSelectName = this.currentSelectName,
                                codeConfig = {
                                    'platform': {
                                        'const': context.platformConstMap[currentSelectName],
                                        'interface': context.platformInterfaceMap[currentSelectName]
                                    },
                                    'project': {
                                        'const': context.projectConstMap[currentSelectName],
                                        'interface': context.projectInterfaceMap[currentSelectName]
                                    }

                                };
                            return codeConfig[flag][this.currentType];
                        },

                        apiSelected: function (nodeData) {
                            var currentApi, name, i, item, editionSources, versionSources = [];

                            this.currentNode = null;
                            this.showRight = false;
                            this.showVersion = false;

                            // setTimeout(()=>{
                            if (nodeData.isLeaf) {
                                this.showRight = true;


                                this.version = nodeData.compareVer;
                                this.currentNode = nodeData;
                                if (!nodeData.compareVer) {
                                    nodeData.compareVer = UNIVERSAL;
                                }
                                name = nodeData.name;


                                if (this.sources && this.sources.length) {

                                    currentApi = context.getPlatformMap(nodeData.currentType)[name];
                                    if (currentApi && currentApi.edition) {
                                        editionSources = Object.keys(currentApi.edition);
                                        for (i = -1; item = this.sources[++i];) {
                                            if (~editionSources.indexOf(item)) {
                                                versionSources.push(item);
                                            }
                                        }
                                        this.versionSources = versionSources;
                                        if (versionSources.length === 1) {
                                            this.version = versionSources[0];

                                        }
                                    }

                                }


                                this.currentType = nodeData.currentType;

                                this.currentTitle = nodeData.title + ',app.' + name;
                                this.currentSelectName = name;


                                this.setCode(this.version);

                                this.setConfig();
                                this.setDiff();
                                setTimeout(() => {
                                    this.showVersion = true;
                                }, 200)


                            } else {
                                this.showRight = false;
                            }
                            // },200)


                        },

                        setDiff: function (version) {

                            var platform = this.getCodeConfig(PLATFORM),
                                project = this.getCodeConfig(PROJECT),
                                version = version || this.version,
                                diffText = '',
                                projectCode,
                                platformCode,
                                configDiff,
                                codeDiff;

                            if (project && platform) {
                                projectCode = (project.edition && project.edition[version]) || project.appJsCode || platform.edition[version];
                                platformCode = platform.edition[version];
                                if (configDiff = context.isConfigDiff(project, platform)) {
                                    diffText += '(配置项不一致)';

                                }
                                if (codeDiff = context.isCodeDiff(projectCode, platformCode)) {
                                    diffText += '(代码不一致)';
                                }
                            }

                            this.diffTip = diffText;

                            return {
                                configDiff: configDiff,
                                codeDiff: codeDiff
                            }


                        },


                        checkChange: function () {

                        },

                        setConfig: function () {
                            var cleanConfig;

                            context.currentConfig = this.getCodeConfig(PROJECT) || this.getCodeConfig(PLATFORM);

                            base.baseConfig(context.SET_CONFIG_ITEM_ID, context.currentConfig, config[this.currentType]);


                            cleanConfig=base.getCleanedOption(context.currentConfig, config[this.currentType]);
                            if(this.getCodeConfig(PROJECT)){

                                context.getProjectMap(this.currentType)[this.currentSelectName]= cleanConfig;

                            }else{
                                 context.getPlatformMap(this.currentType)[this.currentSelectName]= cleanConfig;
                            }



                        },

                        checkShowUpdateIcon: function (tag) {
                            var nodeData = this.treeData[tag],
                                seed = nodeData.children,
                                allChecked = false,
                                itemCheck = false,
                                i, item, _item, _i, children;

                            for (i = -1; item = seed[++i];) {

                                if (children = item.children) {
                                    for (_i = -1; _item = children[++_i];) {
                                        if (_item.endIcons[1].show) {
                                            itemCheck = true;
                                            break;
                                        }
                                    }
                                    item.endIcons[1].show = itemCheck;
                                }

                                if (itemCheck) {
                                    allChecked = true;
                                    break;
                                }
                            }
                            nodeData.endIcons[1].show = allChecked;

                        },
                        clickEndIcon: function (option) {
                            var nodeData = option.nodeData,
                                iconItem = option.iconItem,
                                index = option.index;

                            switch (iconItem.name) {
                                case 'update':
                                    this.update(nodeData, iconItem);

                                    break;
                                case 'delete':
                                    this.del(nodeData, index);

                                    break;
                                case 'add':

                                    this.add(nodeData);
                                    break;

                            }

                        },


                        update: function (nodeData, iconItem) {
                            var vueThis = this,
                                updateInterfaces = [],
                                i, item, _i, _item, platformItem, projectItem, result, currentType, name;
                            if (nodeData.isLeaf) {
                                result = vueThis.setDiff(nodeData.compareVer);

                                currentType = nodeData.currentType;
                                name = nodeData.name;

                                projectItem = context.getProjectMap(currentType)[name];
                                platformItem = $.extend(true, {}, context.getPlatformMap(currentType)[name]);

                                if (projectItem && platformItem) {
                                    if (result.codeDiff && result.configDiff) { //是叶子 配置和代码都存在异同
                                        app.modal({
                                            title: "更新平台接口与常量",
                                            content: '<div id="updateApiCtn"><input name="updateApi" type="radio" value="1"/> 更新配置  <input name="updateApi" type="radio" value="2" /> 更新代码 <input name="updateApi" type="radio" value="3" checked/> 更新配置和代码</div>',

                                            confirmHandler: function () {
                                                var val = $("#updateApiCtn", $(this)).children().filter("[type=radio][checked]").val(),
                                                    temp;

                                                switch (val) {
                                                    case "1": //更新配置

                                                        temp = projectItem;
                                                        projectItem = context.getProjectMap(currentType)[name] = platformItem;

                                                        projectItem.edition = temp.edition;
                                                        projectItem.appJsCode = temp.appJsCode;
                                                        projectItem.compareVer = temp.compareVer;
                                                        break;

                                                    case "2": //更新代码

                                                        projectItem.edition = platformItem.edition;
                                                        projectItem.appJsCode = platformItem.appJsCode;

                                                        break;

                                                    case "3"://更新配置和代码

                                                        context.getProjectMap(currentType)[name] = platformItem;
                                                        iconItem.show = false;

                                                        break;

                                                }

                                                if (vueThis.currentNode) {
                                                    vueThis.apiSelected(vueThis.currentNode);
                                                }
                                                vueThis.checkShowUpdateIcon(currentType === 'const' ? 1 : 0);


                                            },
                                            isLargeModal: false
                                        })
                                    } else {

                                        context.getProjectMap(currentType)[name] = platformItem;
                                        iconItem.show = false;

                                        if (vueThis.currentNode) {
                                            vueThis.apiSelected(vueThis.currentNode);
                                        }

                                        vueThis.checkShowUpdateIcon(currentType === 'const' ? 1 : 0);


                                    }

                                }


                            } else {
                                //不是leaf有两种情况：全部和分类

                                app.modal({
                                    title: '更新平台接口与常量',
                                    content: CONST.TEMP.DEL_MODLE_HTML.replace('_title_', '确定更新平台接口吗?')
                                        .replace('_content_', '确定后，该选项只会更新项目没有修改过的接口，若需重置项目修改过的接口，需点击该接口更新。'),
                                    confirmHandler: function () {

                                        if (nodeData.title === '全部接口') {
                                            for (i = -1; item = nodeData.children[++i];) {
                                                updateInterfaces = updateInterfaces.concat(item.children);
                                            }

                                        } else {
                                            updateInterfaces = updateInterfaces.concat(nodeData.children);
                                        }

                                        for (_i = -1; _item = updateInterfaces[++_i];) {
                                            projectItem = context.getProjectMap(_item.currentType)[_item.name];
                                            platformItem = context.getPlatformMap(_item.currentType)[_item.name];

                                            if (projectItem && !projectItem.isModify && platformItem) {
                                                context.getProjectMap(_item.currentType)[_item.name] = platformItem;
                                                _item.endIcons[1].show = false;
                                            }
                                        }
                                        vueThis.checkShowUpdateIcon(nodeData.currentType === 'const' ? 1 : 0);

                                        if (vueThis.currentNode) {

                                            vueThis.apiSelected(vueThis.currentNode);
                                        }
                                    },
                                    isDialog: true,
                                    isLargeModal: false
                                });


                            }
                        },
                        add: function (nodeData) {
                            var Icons = JSON.parse(JSON.stringify(endIcons)),
                                typeHtmlMap = {
                                    'const': '<div data-role="apiName" class="api-ipt-ctt">常量名:<input type="text"> </div>',
                                    'interface': '<div data-role="apiName" class="api-ipt-ctt">接口名:<input type="text"></div><div data-role="apiDesp" class="api-ipt-ctt">中文名:<input type="text"> </div>',
                                    'category': '<div data-role="apiDesp" class="api-ipt-ctt">分类名:<input type="text"> </div>'

                                };

                            Icons[3].show = true;


                            if (nodeData.title === '全部接口') {
                                app.modal({
                                    title: '添加接口分类',
                                    content: typeHtmlMap.category,
                                    isLargeModal: false,
                                    confirmHandler: function () {
                                        var apiDesp = $("[data-role=apiDesp]", $(this)).children('input').val();
                                        if (!apiDesp) {
                                            app.alert("分类名不能为空!");

                                        } else if (context.projectCategoryMap.hasOwnProperty(apiDesp)) {
                                            app.alert("分类名已经存在!");

                                        } else {
                                            Icons[2].show = true;
                                            nodeData.children.push({
                                                checked: true,
                                                currentType: nodeData.currentType,
                                                endIcons: Icons,
                                                expand: true,
                                                isLeaf: false,
                                                parent: nodeData.title,
                                                title: apiDesp,
                                                visible: true,
                                                children: []
                                            });
                                            context.projectCategoryMap[apiDesp] = {deps: apiDesp, children: []}
                                        }

                                    }


                                })

                            } else {

                                app.modal({
                                    title: "添加接口或常量",
                                    content: typeHtmlMap[nodeData.currentType],
                                    isLargeModal: false,
                                    confirmHandler: function () {
                                        var apiName = $("[data-role=apiName]", $(this)).children('input').val(),
                                            apiDesp = $("[data-role=apiDesp]", $(this)).children('input').val(),
                                            isConst = nodeData.currentType === 'const';

                                        if (!apiName) {
                                            app.alert("接口名或常量名不能为空!");

                                        } else if (context.getProjectMap(nodeData.currentType).hasOwnProperty(apiName)) {
                                            app.alert("接口或常量已经存在!");

                                        } else {
                                            nodeData.children.push({
                                                checked: true,
                                                compareVer: UNIVERSAL,
                                                currentType: nodeData.currentType,
                                                endIcons: Icons,
                                                expand: false,
                                                isLeaf: true,
                                                name: apiName,
                                                parent: nodeData.title,
                                                title: isConst ? apiName : apiDesp,
                                                visible: true
                                            });
                                            if (nodeData.currentType === 'const') {
                                                context.projectConstMap[apiName] = {
                                                    category: apiName,
                                                    edition: {
                                                        universal: "({valueArray:[],despArray:[]});"
                                                    },
                                                    desp: apiName
                                                };
                                            } else {

                                                context.projectInterfaceMap[apiName] = {
                                                    name: apiName,
                                                    desp: apiDesp,
                                                    edition: {
                                                        universal: "app." + apiName + "=function(){}"
                                                    }
                                                }
                                            }
                                        }


                                    }

                                })

                            }
                        },
                        del: function (nodeData, index) {
                            var interfaces = this.treeData[0],
                                constant = this.treeData[1],
                                content = CONST.TEMP.DEL_MODLE_HTML,
                                isLeaf = nodeData.isLeaf,
                                i, item;

                            if (isLeaf) {
                                content = content.replace('_title_', '确定删除' + nodeData.name + '?')
                                    .replace('_content_', '确定后，该接口或常量将无法恢复。');
                            } else {
                                content = content.replace('_title_', '确定删除' + nodeData.title + '分类?').replace('_content_', '确定后，该分类下的接口将被删除，无法恢复。');


                            }
                            app.modal({
                                title: '删除接口和常量',
                                content: content,
                                isLargeModal: false,
                                confirmHandler: function () {
                                    var children;
                                    if (isLeaf) {
                                        if (nodeData.currentType === 'const') {//常量
                                            constant.children.splice(index, 1);
                                            if (context.projectConstMap.hasOwnProperty(nodeData.name)) {
                                                delete context.projectConstMap[nodeData.name];
                                            }
                                        } else {//接口
                                            for (i = -1; item = interfaces.children[++i];) {
                                                if ((children = item.children[index]) && (children.name === nodeData.name)) {
                                                    item.children.splice(index, 1);
                                                }

                                            }

                                        }


                                    } else {

                                        //只有接口有分类
                                        //删除该分类的接口
                                        for (i = -1; item = nodeData.children[++i];) {
                                            if (context.projectInterfaceMap.hasOwnProperty(item.name)) {
                                                delete context.projectInterfaceMap[item.name];
                                            }
                                        }

                                        //删除该分类
                                        interfaces.children.splice(index, 1);

                                        if (context.projectCategoryMap.hasOwnProperty(nodeData.title)) {
                                            delete  context.projectCategoryMap[nodeData.title];
                                        }
                                    }
                                }

                            })
                        },
                        saveJs: function () {
                            var diffEditorInstance = context.diffEditorInstance,
                                originalEditor = diffEditorInstance.getOriginalEditor(),
                                modifiedEditor = diffEditorInstance.getModifiedEditor(),
                                projectCode = this.getCodeConfig(PROJECT),
                                platformCode = this.getCodeConfig(PLATFORM),
                                seed = [],
                                cursor, item,
                                projectOrigin, code,
                                currentConfigAndCode,
                                parentItem, constCode,
                                map = {},
                                currentTypeConfig = config[this.currentType],
                                platformConfigAndCode;


                            currentConfigAndCode = base.getCleanedOption(context.currentConfig, currentTypeConfig);

                            if (platformCode) { //项目添加的不比较
                                //第一次保存 若没有isModify字段 获取编辑器的代码 与 project原始的代码比较 如果不一样，则项目修改过 isModify=true
                                projectOrigin = (currentConfigAndCode.edition && currentConfigAndCode.edition[this.version]) || currentConfigAndCode.appJsCode || platformCode.appJsCode;
                                if (context.isCodeDiff(projectOrigin, modifiedEditor.getValue()) && !currentConfigAndCode.isModify) {
                                    currentConfigAndCode.isModify = true;
                                }
                            }

                            code = currentConfigAndCode.appJsCode = modifiedEditor.getValue();

                            if (!currentConfigAndCode.edition) {
                                currentConfigAndCode.edition = {}
                            }

                            currentConfigAndCode.edition[this.version] = code;

                            currentConfigAndCode.compareVer = this.version;
                            this.currentNode.compareVer = this.version;

                            context.getProjectMap(this.currentType)[this.currentSelectName] = currentConfigAndCode;

                            if (this.currentType === 'const') {
                                constCode = eval(code);
                                currentConfigAndCode.valueArray = constCode.valueArray;
                                currentConfigAndCode.despArray = constCode.despArray;
                            }
                            if (platformCode) { //项目添加的不比较
                                seed.push(this.currentType === 'interface' ? this.treeData[0] : this.treeData[1]);

                                cursor = -1;
                                while (item = seed[++cursor]) {
                                    map[item.title] = cursor;
                                    if (item.isLeaf && item.name === this.currentSelectName) {
                                        this.setDiff();
                                        if (this.diffTip) {

                                            item.endIcons[1].show = true;
                                            if ((parentItem = seed[0]) && !parentItem.endIcons[1].show) {
                                                parentItem.endIcons[1].show = true;
                                            }

                                            if (map.hasOwnProperty(item.parent)) {
                                                if ((parentItem = seed[map[item.parent]]) && !parentItem.endIcons[1].show) {
                                                    parentItem.endIcons[1].show = true;
                                                }
                                            }


                                        }
                                    } else if (item.children && item.children.length) {
                                        seed = seed.concat(item.children);
                                    }
                                }

                            }


                            app.alert('修改接口成功', app.alert.SUCCESS);

                        },


                    }
                });

            },
            listener: function () {
                var context = this;
                context.$interfaceResetPanel.off('click.api').on('click.api', function (e) {
                    var $target = $(e.target || event.srcElement).closest('[data-role]'),
                        role = $target.attr('data-role');
                    switch (role) {
                        case 'close':
                            context.destory();
                            break;

                        default:
                            break;

                    }
                })
            },
            mapGenerator: function (interfaces, map, isConst, isPlatform) {

                var i, item, j, _interface, name, code, edition,
                    key, appJsCode, constItem, newObj, category, editionArry, compareVer;

                if (isConst) {
                    for (i = -1; constItem = interfaces[++i];) {

                        category = constItem.category;
                        newObj = {
                            valueArray: typeof constItem.valueArray === 'string' ? JSON.parse(constItem.valueArray) : constItem.valueArray,
                            despArray: typeof constItem.despArray === 'string' ? JSON.parse(constItem.despArray) : constItem.despArray
                        };

                        if (edition = constItem.edition) {
                            // for (key in edition) {
                            //     edition[key] = AUI.getParsedString(UglifyJS.parse('(' + JSON.stringify(edition[key]) + ')'));
                            // }
                        } else {
                            edition = {};
                        }

                        appJsCode = AUI.getParsedString(UglifyJS.parse('(' + JSON.stringify(newObj) + ')'));
                        edition.universal = appJsCode;

                        map[category] = {
                            category: category,
                            appJsCode: appJsCode,
                            edition: edition,
                            desp: category,
                            valueArray: constItem.valueArray,
                            despArray: constItem.despArray
                        };

                    }
                } else {

                    for (i = -1; item = interfaces[++i];) {

                        if (item.desp && !isPlatform) this.projectCategoryMap[item.desp] = item;


                        if (item.children.length) {
                            for (j = -1; _interface = item.children[++j];) {
                                if ((name = _interface.name) && !map[name]) {

                                    _interface._belongTo = item.desp;


                                    if (isPlatform) {
                                        if (edition = _interface.edition) {
                                            for (key in edition) {
                                                edition[key] = toolset.getCode(edition[key], _interface);
                                            }
                                        } else {
                                            edition = _interface.edition = {};
                                        }

                                        editionArry = Object.keys(edition);
                                        compareVer = _interface.compareVer = item.compareVer || (edition.hasOwnProperty(UNIVERSAL) && UNIVERSAL) || (editionArry && editionArry[0]);

                                        if (code = (_interface.appJsCode)) {
                                            _interface.appJsCode = toolset.getCode(code, _interface);
                                        } else {
                                            _interface.appJsCode = toolset.getCode(edition[compareVer], _interface)
                                        }

                                        code && (_interface.edition.universal = _interface.appJsCode);


                                     }



                                    map[name] = _interface;
                                }
                            }
                        }
                    }
                }

            },
            initMap: function () {
                var context = this;


                context.mapGenerator(context.platformInterfaces, context.platformInterfaceMap, false, true);

                context.mapGenerator(context.projectInterfaces, context.projectInterfaceMap);

                context.mapGenerator(context.platformInterfacesConst, context.platformConstMap, true);
                context.mapGenerator(context.projectInterfacesConst, context.projectConstMap, true);


            },
            isConfigDiff: function (project, platform) {
                var key,
                    result = false,
                    seed = [{platform: platform, project: project}],
                    cursor = -1,
                    project, platform,
                    noCompareAttrMap = {
                        appJsCode: true,
                        edition: true,
                        _belongTo: true,
                        compareVer: true,
                        isModify: true,
                        parent: true
                    },
                    defaultValue={

                        false:false,
                        true:true
                    },
                    projectItem, platformItem,
                    item,hasInProject={};

                while ((item = seed[++cursor])) {
                    project = item.project;
                    platform = item.platform;
                    hasInProject={};
                    if (typeof project !== 'object' || typeof platform!=='object') {
                        return true;
                    } else {
                        for (key in project) { //
                            projectItem = project[key];
                            platformItem = platform[key];
                            hasInProject[key]=true;
                            if (!(key in noCompareAttrMap)) {
                                if (!(key in platform) ) {
                                    if(platformItem===undefined){

                                    }else{
                                        console.log('平台', key, platformItem);
                                        console.log('项目', key, projectItem);
                                        return true;
                                    }

                                } else if (projectItem !== platformItem) {

                                  if (typeof projectItem === 'object') {
                                      if (JSON.stringify(projectItem) === JSON.stringify(platformItem)) {
                                         //   break;
                                        } else {
                                          //深度比较
                                          if (Array.isArray(projectItem)) {
                                              if (projectItem.length !== platformItem.length) {
                                                  console.log('平台', key, platformItem);
                                                  console.log('项目', key, projectItem);
                                                  return true;
                                              }
                                              projectItem.forEach(function (item, index) {
                                                  if(item.name){
                                                      seed.push({
                                                          project: item,
                                                          platform: platformItem[index]
                                                      });
                                                  }

                                              });
                                          } else{
                                              if(projectItem.name){
                                                  seed.push({
                                                      project: projectItem,
                                                      platform: platformItem
                                                  })
                                              }

                                          }
                                        }


                                    } else {
                                        if(key==='defaultValue'){
                                            if(defaultValue.hasOwnProperty(platformItem) && defaultValue.hasOwnProperty(projectItem)){
                                                if(defaultValue[projectItem]!==defaultValue[platformItem]){
                                                    console.log('平台', key, platformItem);
                                                    console.log('项目', key, projectItem);
                                                    return true;
                                                }
                                            }else{
                                                if(projectItem!=platformItem){
                                                    console.log('平台', key, platformItem);
                                                    console.log('项目', key, projectItem);
                                                    return true;
                                                }
                                            }
                                        }else{
                                            if(platformItem==projectItem){

                                            }else {
                                                console.log('平台', key, platformItem);
                                                console.log('项目', key, projectItem);
                                                return true;
                                            }

                                        }
                                    }

                                }
                            }
                        }

                        $.extend(hasInProject,noCompareAttrMap);
                        for(key in platform){
                            if(!(key in hasInProject)){
                                console.log('平台不存在', key, platform[key]);
                                return true;
                            }
                        }
                    }
                }

                return result;
            },
            isCodeDiff: function (str1, str2) {
                str1 = str1 && str1.replace(/[\n\r\t]/g, '').replace(/\s{4}/g, '');
                str2 = str2 && str2.replace(/[\n\r\t]/g, '').replace(/\s{4}/g, '');
                return str1 !== str2;
            },
            initInterfacesTree: function () {
                var context = this,
                    i, item, j, _interface, treeStick, treeLeaf, key,
                    category,
                    children,
                    editionNum = 0,
                    uncheckedNum = 0,
                    unVisibleNum = 0,
                    defaultConfig = {
                        visible: true,
                        checked: true,
                        expand: true,
                        endIcons: endIcons,
                        currentType: 'interface'
                    },
                    visible = false,
                    platformInterfacesCategoryMap = {},

                    allInterfaces = JSON.parse(JSON.stringify(defaultConfig)),
                    projectInterfaceItem, platformInterfaceItem, codeDiff, configDiff;

                allInterfaces.title = '全部接口';
                allInterfaces.endIcons[2].show = true;
                allInterfaces.children = [];

                for (i = -1; item = context.platformInterfaces[++i];) {

                    if (item.desp && (children = item.children)) {
                        unVisibleNum = 0;
                        uncheckedNum = 0;
                        fromOtherNum=0;
                        platformInterfacesCategoryMap[item.desp] = {
                            order: i
                        };

                        treeStick = JSON.parse(JSON.stringify(defaultConfig));

                        treeStick.title = item.desp;
                        treeStick.endIcons[2].show = true;
                        treeStick.children = [];
                        treeStick.parent = allInterfaces.title;


                        for (j = -1; _interface = children[++j];) {
                            editionNum = 0;
                            treeLeaf = JSON.parse(JSON.stringify(defaultConfig));
                            treeLeaf.expand = false;

                            treeLeaf.isLeaf = true;

                            treeLeaf.title = _interface.desp;
                            treeLeaf.name = _interface.name;

                            treeLeaf.compareVer = _interface.compareVer || UNIVERSAL;
                            treeLeaf.parent = treeStick.title;


                            if (projectInterfaceItem = context.projectInterfaceMap[_interface.name]) {

                                treeLeaf.compareVer = projectInterfaceItem.compareVer || UNIVERSAL;
                                treeLeaf.title = projectInterfaceItem.desp;
                                treeLeaf.name = projectInterfaceItem.name;

                                platformInterfaceItem = context.platformInterfaceMap[_interface.name];

                                // 判断是否有更新
                                codeDiff = context.isCodeDiff(projectInterfaceItem.appJsCode, platformInterfaceItem.appJsCode);
                                configDiff = context.isConfigDiff(projectInterfaceItem, platformInterfaceItem);

                                if (codeDiff || configDiff) {
                                    treeLeaf.endIcons[1].show = true;
                                    treeStick.endIcons[1].show = true;
                                    allInterfaces.endIcons[1].show = true;
                                }


                            } else {  //判断是否选中
                                treeLeaf.checked = false;
                                uncheckedNum += 1;
                            }


                            //判断多版本
                            if (!$.isEmptyObject(_interface.edition)) {
                                for (key in _interface.edition) {

                                    if (~context.sources.indexOf(key)) {

                                        editionNum += 1
                                    }
                                }

                            } else if (_interface.fromOtherInterface) {

                                visible = true;
                                fromOtherNum+=1;
                            }


                            if (editionNum > 1) {
                                treeLeaf.endIcons[0].show = true;

                            } else if ((editionNum === 0&& fromOtherNum===0)) {
                                treeLeaf.visible = false;
                                unVisibleNum += 1
                            }

                            treeStick.children.push(treeLeaf);

                        }

                        if (unVisibleNum === children.length) {
                            treeStick.visible = false;
                        }

                        if (uncheckedNum && uncheckedNum <= children.length) {
                            treeStick.checked = false;
                            if (!unVisibleNum) {
                                allInterfaces.checked = false;
                            }

                        }


                        allInterfaces.children.push(treeStick)
                    }

                }

                for (i = -1; item = context.projectInterfaces[++i];) {

                    if (item.desp && item.children) {

                        if (category = platformInterfacesCategoryMap[item.desp]) {

                            for (j = -1; _interface = item.children[++j];) {

                                if (!context.platformInterfaceMap[_interface.name]) {

                                    treeStick = allInterfaces.children[category.order];

                                    treeLeaf = JSON.parse(JSON.stringify(defaultConfig));
                                    treeLeaf.expand = false;
                                    treeLeaf.title = _interface.desp;
                                    treeLeaf.name = _interface.name;
                                    treeLeaf.compareVer = _interface.compareVer || UNIVERSAL;
                                    treeLeaf.isLeaf = true;
                                    // treeLeaf.endIcons[2].show = true;
                                    treeLeaf.endIcons[3].show = true;//删除
                                    //  treeLeaf.endIcons[4].show = true;
                                    treeLeaf.parent = treeStick.title;
                                    treeStick.children.push(treeLeaf);

                                }
                            }
                        } else {

                            treeStick = JSON.parse(JSON.stringify(defaultConfig));

                            treeStick.title = item.desp;

                            treeStick.endIcons[2].show = true;
                            treeStick.endIcons[3].show = true;
                            //treeStick.endIcons[4].show = true;
                            treeStick.parent = allInterfaces.title;
                            treeStick.children = [];

                            for (j = -1; _interface = item.children[++j];) {

                                treeLeaf = JSON.parse(JSON.stringify(defaultConfig));
                                treeLeaf.expand = false;
                                treeLeaf.title = _interface.desp;
                                treeLeaf.name = _interface.name;
                                treeLeaf.isLeaf = true;
                                //  treeLeaf.endIcons[2].show = true;
                                treeLeaf.endIcons[3].show = true;//删除
                                //  treeLeaf.endIcons[4].show = true;
                                treeLeaf.parent = treeStick.title;
                                treeLeaf.compareVer = _interface.compareVer || UNIVERSAL;

                                treeStick.children.push(treeLeaf);
                            }

                            allInterfaces.children[allInterfaces.children.length] = treeStick;

                        }

                    }
                }


                return allInterfaces
            },
            initConstTree: function () {

                var context = this,
                    i, item, treeLeaf,
                    defaultConfig = {
                        visible: true,
                        checked: false,
                        expand: false,
                        endIcons: endIcons,
                        currentType: 'const'
                    },
                    allInterfacesConst = JSON.parse(JSON.stringify(defaultConfig));
                allInterfacesConst.expand = true;
                allInterfacesConst.title = "全部常量";
                allInterfacesConst.children = [];
                allInterfacesConst.endIcons[2].show = true;

                for (i = -1; item = context.platformInterfacesConst[++i];) {

                    treeLeaf = JSON.parse(JSON.stringify(defaultConfig));
                    treeLeaf.title = treeLeaf.name = item.category;

                    treeLeaf.isLeaf = true;
                    treeLeaf.parent = allInterfacesConst.title;

                    if (context.projectConstMap[item.category]) {
                        treeLeaf.checked = true;
                        if (context.platformConstMap[item.category].appJsCode !== context.projectConstMap[item.category].appJsCode) {
                            treeLeaf.endIcons[1].show = true;
                            allInterfacesConst.endIcons[1].show = true;
                        }
                    } else {
                        treeLeaf.checked = false;
                        allInterfacesConst.checked = false;
                    }


                    allInterfacesConst.children.push(treeLeaf);

                }

                for (i = -1; item = context.projectInterfacesConst[++i];) {

                    if (!context.platformConstMap[item.category]) {
                        treeLeaf = JSON.parse(JSON.stringify(defaultConfig));
                        treeLeaf.title = treeLeaf.name = item.category;
                        treeLeaf.checked = true;
                        treeLeaf.isLeaf = true;
                        treeLeaf.parent = allInterfacesConst.title;
                        treeLeaf.endIcons[3].show = true;
                        allInterfacesConst.children.push(treeLeaf);
                    }
                }

                return allInterfacesConst;
            },
            initTreeNode: function () {
                var context = this;
                context.treeNode.push(context.initInterfacesTree());
                context.treeNode.push(context.initConstTree());
            },
            getProjectMap: function (type) {
                return this[PROJECT + AUI.capitalize(type) + 'Map']
            },
            getPlatformMap: function (type) {
                return this[PLATFORM + AUI.capitalize(type) + 'Map'];
            },

            treeToInterface: function () {
                var context = this,
                    treeNode = context.treeNode,
                    interfaces = {
                        appInterfaces: [],
                        appInterfacesConst: []
                    },
                    seed,
                    i, item, temp, _i, _item, projectItem, platfromItem, constItem;

                seed = treeNode[0].children;
                for (i = -1; item = seed[++i];) {

                    temp = {
                        desp: item.title,
                        children: []
                    };
                    if (item.visible && item.children) {
                        for (_i = -1; _item = item.children[++_i];) {

                             projectItem=context.projectInterfaceMap[_item.name];
                             platfromItem = context.platformInterfaceMap[_item.name];
                            if (_item.checked && _item.visible) {
                                temp.children.push((!$.isEmptyObject(projectItem) && projectItem) || platfromItem);
                            }
                        }
                    }
                    interfaces.appInterfaces.push(temp);


                }

                seed = treeNode[1].children;
                for (i = -1; item = seed[++i];) {

                    if (item.visible) {
                        if (constItem = (context.projectConstMap[item.name] || context.platformConstMap[item.name])) {
                            constItem.valueArray = typeof constItem.valueArray === 'string' ? JSON.parse(constItem.valueArray) : constItem.valueArray;
                            constItem.despArray = typeof constItem.despArray === 'string' ? JSON.parse(constItem.despArray) : constItem.despArray;

                        }
                        interfaces.appInterfacesConst.push(context.projectConstMap[item.name] || context.platformConstMap[item.name]);
                    }


                }

                return interfaces;
            },
            destory: function () {

                var context = this,
                    interface = context.treeToInterface();

                app.shelter.show('正在保存应用接口,请稍候...', true);


                toolset.saveApiJs({
                    save: {
                        api: {
                            appInterfaces: interface.appInterfaces,
                            appInterfacesConst: interface.appInterfacesConst
                        }
                    },
                    load: CONST.AWEB_JS_LOAD
                }, true, dataModel, undefined, external, function (response) {
                    $AW.trigger($AW.STATUS.PREVIEW_FRESH);
                    context.$interfaceResetPanelBody.empty();
                    AUI.zoomOut(context.$interfaceResetPanel);

                    context.$mask.addClass('hide');

                    app.shelter.lowerZIndex();

                    context.$interfaceResetPanel.off('click.api');

                    app.shelter.hide();

                })


            }


        };


        return API

    })
})();