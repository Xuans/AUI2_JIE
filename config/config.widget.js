define('config.widget', [], function () {


//技术组件、业务组件模aui板
      var templateFunc = function (undefined) {

          (function (factory) {
              "use strict";

              // amd module
              if (typeof define === "function" && define.amd) {
                  define(["jquery", "widget" ,"template" /*,其他脚本文件名称请在这里填写，如'echarts'*/], factory);
              }
              // global
              else {
                  factory();
              }

          })
          (function ($, widget ,artTemplate/*,其他脚本文件对外暴露接口请在这里填写，如'charts'*/) {
              "use strict";

              //关于组件配置说明，请见"开发者中心"，搜索"388.组件设计"
              //关于代码调试工具的使用说明，请见"开发者中心"，搜索"397.开发者工具使用文档"
              //以下代码均可以删除，不用的功能，都删掉，减少代码冗余
              var Component = function ($widget, option, attr, css, auiCtx) {
                  var context = this;

                  //Data Model
                  context.$view = $widget;
                  context.option = $.extend(true, {}, this.setting, option);
                  context.attr = attr;
                  context.css = css;
                  context.pageContext = auiCtx;
                  context.template = artTemplate.compile(context.option.template);
                  // context.template = artTemplate.compile(context.option.testTemplate);


                  //View Model
                  context.viewCache = {};

                  //cache
                  //context.cache={};

                  //初始化
                  //context._init();

                  //渲染样式
                  //context._render();

                  //绑定事件
                  //context._listen();
              };


              //在代码中声明的接口，必须在"接口"配置中配置好，详情见各个接口的注释
              //一定要配置某个组件接口，才能在"前端逻辑引擎"和"开发者中心"中，引用或查看该接口
              //**关于组件接口是否配置正确，可以保存组件配置后，打开"开发者中心"-->"组件"-->打开当前组件，查看组件接口是否配置正确**
              //打开调试工具，选择"virtualizer"-->输入"auiCtx.variables.组件实例ID.接口名"，可以调试接口是否可行(397.开发者工具使用文档)
              Component.prototype = Component.fn = {
                  constructor: Component,
                  version: 'AWOS 5.2 XQ',
                  author: 'your name',

                  debug: window.auiApp && window.auiApp.debug,

                  //常量表
                  //constant:{},

                  /*
                  testData是模板示例数据
                  testTemplate是示例模板，
                  */
                  setting: {
                      testData:{list:[{name:'列表一',id:'item1'},{name:'列表二',id:'item2'},{name:'列表三',id:'item3'},{name:'列表四',id:'item4'}]},
                      testTemplate:'<ul>{{each list as item index}}<li data-role="{{item.id}}">{{item.name}}</li>{{/each}}</ul>',
                      template:'<div></div>'
                  },


                  //初始化（私有）
                  _init: function () {
                      var $widget = this.$view,
                          option = this.option,
                          template = this.template;

                      //解析option、attr、css

                      //使用$.fn.off().empty().append(html)可以避免调用$.fn.html(html)时导致的内存泄漏。
                      //template模板语法是template.compile(模板)(数据[object类型]);
                      $widget
                      //使用empty方法释放DOM对象的内存
                          .empty()
                          //安全添加html元素
                          // .append(template(option.testData));
                          .append(template({}));


                      if (this.debug) {
                          //如果在开发阶段，填充假数据
                          this._renderFakeData();
                      }
                  },

                  //事件绑定（私有）
                  _listen: function () {
                      var $widget = this.$view;
                      //绑定事件，推荐使用事件冒泡
                      //这里绑定的事件一定不能与业务逻辑有关的，否则应该在“事件配置”中定义

                      $widget
                      //解绑上次的事件
                          .off('.namespace')
                          //绑定事件
                          .on({
                              'eventType1.namespace': function (e) {
                                  //使用兼容IE8事件兼容的用法
                                  var $target = $(e.target || window.event.srcElement);

                                  //判断$target是什么
                                  if (
                                      //判断target是否为a标签
                                  $target.is('a') ||

                                  //判断target是不是$widget
                                  $target.is($widget) || $target.is(this) ||

                                  //或者target是否有某个样式
                                  $target.hasClass('.dataTables') ||

                                  //触发的元素开始找，父辈是否有a标签
                                  $target.closest('a').length
                                  //其他选择器，请搜索“jQuery选择器”
                                  ) {
                                      //do something
                                  }
                              },
                              'eventType2.namespace': function (e) {

                              },
                              //example,获取点击a标签的id
                              //事件-->触发范围 ###_ID## a，接口-->查看接口getter配置
                              'click.namespace': function (e) {
                                  var $target = $(e.target || event.srcElement);

                                  if ($target.is('a')) {
                                      //例如 a标签的html为 <a data-href="bbb">Hello world</a>
                                      cache.href = $target.attr('[data-href]');
                                  }
                              }
                          });
                  },

                  //渲染主题、样式（私有）
                  _render: function () {
                      var $widget = this.$view,
                          css = this.css,
                          cssCode,
                          className,
                          style;

                      if (css) {
                          //css样式配置渲染
                          if (css.theme) {
                              /**
                               *
                               * 如果组件配置了类名主题，则要同时将类名加到组件相应位置上去
                               * 例如：
                               * if(css.theme['function']){
                               *  $button.removeClass().addClass('btn ' + css.theme['function']);
                               * }
                               *
                               **/
                          }

                          //样式解析机制
                          if (style = css.style) {

                              /**
                               *
                               * 1.直接拿到样式内容和选择器，利用jq的css()渲染配置样式
                               * 2.利用 $AW.cssHover(select,$selector,content,pseudo)方法生成虚拟渲染样式，他将在组件dom结构后面插入内联样式，直接覆盖外联样式表里面的样式。
                               *
                               * 例如：
                               * $AW.cssHover('input.input-group-field',$selector,style.inputActive,':active');
                               *
                               * 说明：
                               * select：样式对应的选择器，如‘input.input-group-field’
                               * $selector:组件操纵对象或组件选择器
                               * content:css样式配置的内容
                               * pseudo:伪类、伪元素,动态类名，如‘:hover\:focus\.btn-hover’.如果只想添加虚拟样式，可以直接传入 ‘’ 空字符串。
                               *
                               * */
                          }


                          //自定义样式
                          if ((cssCode = css.cssCode) && (className = cssCode.className)) {
                              /**
                               *
                               * 如果$selector不是组件最外层的选择器[data-widget-type]元素,
                               * 则要添加自定义样式,例如：
                               * $selector.addClass(className);
                               * 说明：
                               * $selector:组件的任意选择器
                               *
                               **/
                          }
                      }


                  },

                  _renderFakeData: function () {
                  },

                  /*
                   *   @pause 页面切出接口
                   *
                   *   配置：
                   *       接口-->
                   *           中文名：暂停
                   *           英文名：pause
                   *           类型：无参数接口
                   *           详情：当由当前页面切换到其他页面时，组件提供的可调用接口，该接口组件用于停止组件实例某些消耗性能的监听或轮询
                   *           调用接口可以在：切出操作
                   * */
                  //pause:function(){},

                  /*
                   *   @resume 页面切入接口
                   *
                   *   配置：
                   *       组件接口-->
                   *           中文名：恢复
                   *           英文名：resume
                   *           类型：无参数接口
                   *           详情：当由其他页面到当前页面切换时，组件提供的可调用接口，该接口组件用于恢复组件实例某些消耗性能的监听或轮询
                   *           调用接口可以在：切入操作
                   * */
                  //resume:function(){},

                  /*
                   *   @destroy 销毁组件实例
                   *
                   *   配置：
                   *       组件接口-->
                   *           中文名：销毁
                   *           英文名：destroy
                   *           类型：无参数接口
                   *           详情：当关闭当前页面时，组件提供的销毁组件实例接口，一旦在"接口"配置中配置，页面关闭时，将自动调用
                   *           调用接口可以在：销毁操作
                   * */
                  destroy: function () {
                      this.$view.off().empty();
                  },

                  /*
                   *   @getter 获取组件实例的某些数据
                   *
                   *   配置：
                   *       组件接口-->
                   *           中文名：获取XX的XX
                   *           英文名：getValue
                   *           类型：取值器
                   *           详情：当点击组件a标签时，获取当前选中href值
                   *           是否有出参：是
                   *           出参：
                   *              中文名：a标签href值
                   *              英文名：href
                   *              类型：字符串（根据实际情况而定）
                   * */
                  getValue: function () {
                      //return value;
                  },

                  /*
                   *   @setter 赋值器
                   *       @value      Object      输入值
                   *   配置：
                   *       组件接口-->
                   *           中文名：设置组件链接列表
                   *           英文名：setLinkList
                   *           类型：赋值器
                   *           详情：该接口用于设置组件链接列表
                   *           调用接口可能需要发起异步请求：可能需要
                   *           入参：
                   *              中文名：链接列表
                   *              英文名：linkList
                   *              类型：数组（根据实际情况而定）
                   *                  子元素1：
                   *                      中文名：链接项
                   *                      类型：对象
                   *                      子元素1：
                   *                          中文名：链接项名称
                   *                          英文名：name
                   *                          类型：字符串
                   *                          示例值：链接项1
                   *                      子元素2：
                   *                          中文名1：链接项href
                   *                          英文名：href
                   *                          类型：字符串
                   *                          示例值：id1
                   * */
                  setValue: function (linkList) {
                      /*
                       *   linkList=[{
                       *       name:'链接项1',
                       *       href:'id1
                       *   }]
                       * */
                      var
                          //渲染实例
                          template = this.template,
                          //中间变量
                          i, item,

                          $widget = this.$view;

                      //清空上次的内容
                      $widget.empty();

                      if (linkList === 'auiAjaxTest') {
                          //此处为 AWEB IDE 下 异步传输数据测试信号
                      } else if (linkList && linkList.length) {//校验输入数据
                          //填充内容
                          $widget.append(template({linkList:linkList}));
                      }
                  },


                  /*
                   *   @success    校验成功
                   *       @$widget    jQuery Object
                   *   配置：
                   *       组件接口-->
                   *           中文名：校验成功
                   *           英文名：success
                   *           类型：校验成功
                   *           详情：当校验成功时，组件提供的接口
                   *           入参：
                   *              中文名：组件实例输入元素的jQuery
                   *              英文名：$selector
                   *              类型：jQuery对象
                   * */
                  success: function ($selector) {
                  },

                  /*
                   *   @error      校验失败
                   *       @$widget    jQuery Object
                   *       @errorMsg   String          错误提示
                   *   配置：
                   *       组件接口-->
                   *           中文名：校验失败
                   *           英文名：error
                   *           类型：校验失败
                   *           详情：当校验失败时，组件提供的接口
                   *           入参：
                   *              中文名：组件实例输入元素的jQuery
                   *              英文名：$selector
                   *              类型：jQuery对象
                   *
                   *              中文名：错误提示
                   *              英文名：errorMsg
                   *              类型：字符串
                   * */
                  error: function ($selector, errorMsg) {
                  },

                  /*
                   *   @clean      清空校验
                   *       @e      Event Handler   事件句柄
                   *   配置：
                   *       组件接口-->
                   *           中文名：清空校验
                   *           英文名：clean
                   *           类型：清空校验
                   *           详情：当清空校验时，组件提供的接口
                   *           入参：
                   *              中文名：事件句柄
                   *              英文名：e
                   *              类型：事件句柄
                   * */
                  clean: function (e) {
                  },

                  /*
                   *
                   *  @validateHandler    自定义校验方法
                   *  @value              输入值
                   *
                   *  return {
                   *      result: true,        //校验结果
                   *      value: value,        //传输的格式
                   *      errorMsg: ''         //校验失败的结果
                   *  }
                   *   配置：
                   *       组件接口-->
                   *           中文名：自定义校验方法
                   *           英文名：validateHandler
                   *           类型：自定义校验方法
                   *           详情：组件提供的特殊格式的自定义校验方法
                   *           入参：
                   *              中文名：输入值
                   *              英文名：value
                   *              类型：字符串
                   *           是否有出参：是
                   *           出参：
                   *              中文名：返回值
                   *              英文名：ret
                   *              类型：对象
                   *                 子元素1：
                   *                      中文名：校验结果
                   *                      英文名：result
                   *                      类型：布尔值
                   *                 子元素2：
                   *                      中文名：正确的传输格式
                   *                      英文名：value
                   *                      类型：字符串（根据实际情况而定）
                   *                 子元素3：
                   *                      中文名：校验失败的错误提示，校验正确时，该项为空
                   *                      英文名：errorMsg
                   *                      类型：字符串
                   * */
                  validateHandler: function (value) {
                      return {
                          result: true, //校验结果
                          value: value, //传输的格式
                          errorMsg: '' //校验失败的错误提示
                      }
                  },

                  //组件行为部分
                  /*
                   *   @behavior  行为接口，通过比较结果对 $widget 进行操作
                   *       @result     Boolean     比较结果
                   *       @input1     Object      输入值
                   *       @input2     Object      比较值
                   *       @condition  enum        条件
                   *                   lt          小于
                   *                   eq          等于
                   *                   gt          大于
                   *                   not         不等于
                   *                   includes    包含
                   *                   notIncludes 不包含
                   *                   startsWith  以…开始
                   *   配置：
                   *       组件接口-->
                   *           中文名：显示隐藏行为
                   *           英文名：display
                   *           类型：行为接口
                   *           详情：根据结果进行显示或者隐藏
                   *           入参：
                   *              中文名：比较结果
                   *              英文名：result
                   *              类型：布尔值
                   *
                   *              中文名：输入值
                   *              英文名：input1
                   *              类型：字符串（根据实际情况而定）
                   *
                   *              中文名：比较值
                   *              英文名：input2
                   *              类型：字符串（根据实际情况而定）
                   *
                   *              中文名：比较条件
                   *              英文名：condition
                   *              类型：枚举值
                   *
                   * */
                  behavior: function (result, input1, input2, condition) {
                      this[result ? 'hide' : 'show']();
                  },

                  /*
                   *   @show   显示
                   *   配置：
                   *       组件接口-->
                   *           中文名：显示
                   *           英文名：show
                   *           类型：无参数接口
                   * */
                  show: function () {
                      this.$view.removeClass('hide');
                  },

                  /*
                   *   @show   隐藏
                   *   配置：
                   *       组件接口-->
                   *           中文名：隐藏
                   *           英文名：hide
                   *           类型：无参数接口
                   * */
                  hide: function () {
                      this.$view.addClass('hide');
                  },

                  /*使用复制的getter、setter*/
                  getter: function (key) {
                      var ret = this.dataModule[key];

                      return ret && typeof ret === 'object' ? JSON.parse(JSON.stringify(ret)) : ret;
                  },
                  setter: function (key, value) {
                      var inner = value && typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value;

                      this.dataModule[key] = inner;
                  },

                  /*
                   *   设置组件是否可用
                   * */
                  disable: function (flag) {

                  },

                  //使用同一的缓存对象
                  getCacheView: function (key, refresh) {
                      var ret = this.viewCache[key];

                      if (!ret || refresh) {
                          ret = this.viewCache[key] = $('[data-role="' + key + '"]', this.$view);
                      }

                      return ret;
                  }
              };

              //下面的代码，如无必要，无需修改，但需要查看每个入参的意义
              widget._href_ = function ($widget, option, attr, css, auiCtx) {
                  return new Component($widget, option, attr, css, auiCtx);
              };
          });
      };


    return {
        commonOption: [{
            name: "attr",
            type: "array",
            desp: "属性",
            expand: true,
            attrInEachElement: [{
                name: 'desp',
                desp: '中文名',
                type: 'string_input'
            },
                {
                    name: 'name',
                    desp: '英文名',
                    type: 'string_input'
                },
                {
                    name: 'type',
                    desp: '类型',
                    type: 'string_select',
                    valueArray: ['string_input'],
                    despArray: ['输入框']
                },

                {
                    name: 'validate',
                    type: 'object',
                    desp: '校验',

                    require: {
                        type: ['string_input']
                    },
                    attr: [{
                        name: 'type',
                        type: 'string_input',
                        desp: '校验正则'
                    },
                        {
                            name: 'errorMessage',
                            type: 'string_input',
                            desp: '错误提示'
                        }
                    ]
                }
            ],
            append: [{
                name: "widgetName",
                type: "string_input",
                desp: "中文名",
                defaultValue: '中文名'
            },
                {
                    name: "id",
                    type: "string_input",
                    desp: "ID",
                    defaultValue: "widgetID"
                },
                {
                    name: "desp",
                    type: "string_input",
                    desp: "详情",
                    defaultValue: "详情"
                }
            ]
        },
            {
                reserve: true,
                name: 'option',
                desp: '参数',
                type: 'array',
                isTab: true,
                expand: true,
                mustHave: 'name',
                attrInEachElement: [{
                    name: 'desp',
                    desp: '中文名',
                    type: 'string_input'
                },
                    {
                        name: 'name',
                        desp: '英文名',
                        type: 'string_input'
                    },
                    {
                        name: 'type',
                        desp: '类型',
                        type: 'string_select',
                        group: [{
                            label: '单元类型',
                            valueArray: ['string_input', 'string_select', 'boolean', 'number', 'edm', 'file', 'string_html', 'template_html', 'icon'],
                            despArray: ['输入框', '下拉框', '布尔值', '数字', 'edm', '文件', '富文本编辑器', '模板编辑器', '图标']
                        },
                            {
                                label: '复合类型',
                                valueArray: ['object', 'array', 'edmCollection', 'tags_input'],//'tags_input',
                                despArray: ['对象', '对象数组', 'EMD集合', '字符串数组']//'字符串数组',
                            }
                        ]
                    },
                    {
                        name: 'titleKey',
                        desp: '标题键名',
                        type: 'string_input',
                        require: {
                            type: ['array', 'edmCollection']
                        }
                    },
                    {
                        name: 'direction',
                        desp: 'edm类型',
                        type: 'string_select',
                        valueArray: ['', 'request', 'response'],
                        despArray: ['无', '传输字段', '返回字段'],
                        require: {
                            type: ['edm']
                        }
                    },
                    // {
                    // 	name: 'componentType',
                    // 	desp: '类型',
                    // 	type: 'string_select',
                    // 	require: {
                    // 		type: ['string_select']
                    // 	}
                    // },
                    {
                        name: 'appendNumber',
                        desp: '数组默认元素个数',
                        type: 'number',
                        require: {
                            type: ['array']
                        }
                    },
                    {
                        name: "details",
                        type: "string_input",
                        desp: "详情"
                    },
                    {
                        name: 'valueArray',
                        desp: '选项值集合',
                        type: "tags_input",
                        require: {
                            type: ['string_select']
                        }
                    },
                    {
                        name: 'despArray',
                        desp: '选项中文名集合',
                        type: "tags_input",
                        require: {
                            type: ['string_select']
                        }
                    },
                    {
                        name: 'edmKey',
                        type: 'string_input',
                        'desp': 'edm属性的名称',
                        require: {
                            type: ['edmCollection']
                        }
                    },
                    {
                        name: 'defaultValue',
                        desp: '默认值',
                        type: "string_with_placeholder",
                        require: {
                            type: ['string_select', 'boolean', 'string_input', 'number', 'tags_input', 'icon']
                        },
                        valueArray: ['%%_NAME%%', '%%_INDEX%%', '%%_WID%%'],
                        despArray: ['name', 'index', 'id'],
                        template: '比如您配置了一个数组元素名叫“按钮”，那么数组里面元素的 defaultValue 的转换过程是 %%_NAME%%->按钮，对于数组中第 n 个元素，对应的转换过程是 %%_INDEX%%->n',
                        detailsArray: [
                            '表示数组元素的名字，替换占位符 %%_NAME%% ，比如数组元素名为按钮，则name就是按钮',
                            '若占位符类型为数组下标，表示数组元素的索引下标 ，替换占位符 %%_INDEX%% ； <div> 若占位符类型为累加器，表示全局的累加器，替换占位符 %%_INDEX%%</div>',
                            '表示数组元素在DOM结构中的id属性，替换占位符 %%_WID%%，如果数组元素不属于DOM结构就不需要填此项'
                        ]
                    },
                    {
                        name: 'formatter',
                        desp: '占位符类型',
                        type: "string_select",
                        require: {
                            type: ['string_input']
                        },
                        despArray: ['无', '累加器替换', '数组下标替换'],
                        valueArray: ['', 'replace', 'selector']
                    },
                    {
                        name: 'idUniqueSpace',
                        desp: 'id唯一的范围',
                        type: 'string_select',
                        require: {
                            formatter: ['replace']
                        },
                        despArray: ['无', '全局', '组件'],
                        valueArray: ['', 'global', 'widget']
                    },
                    {
                        name: "hasEvent",
                        type: "boolean",
                        desp: "是否能绑定事件",
                        require: {
                            type: ['array', 'edmCollection']
                        },
                        defaultValue: "false"
                    },
                    {
                        name: 'dataList',
                        desp: '可选项',
                        type: "tags_input",
                        require: {
                            type: ['string_select_editable']
                        }
                    },
                    {
                        name: 'placeholder',
                        desp: '提示',
                        type: 'string_input',
                        require: {
                            type: ['string_input']
                        }
                    },
                    {
                        name: 'isAdvanced',
                        desp: '是否为高级配置',
                        type: 'boolean',
                        defaultValue: 'false'
                    },
                    {
                        name: 'hidden',
                        desp: '隐藏',
                        type: 'boolean',
                        defaultValue: 'false'
                    },
                    {
                        name: 'require',
                        type: 'object',
                        attr: [],
                        hidden: "true"
                    },
                    {
                        name: 'append',
                        type: 'array',
                        hidden: 'true',
                        attrInEachElement: []
                    },
                    {
                        name: 'validate',
                        type: 'object',
                        desp: '校验',
                        require: {
                            type: ['string_input']
                        },
                        attr: [{
                            name: 'type',
                            type: 'string_input',
                            desp: '校验正则'
                        },
                            {
                                name: 'errorMessage',
                                type: 'string_input',
                                desp: '错误提示'
                            }
                        ]
                    },
                    {
                        name: 'require',
                        isRequire: true,
                        type: 'object',
                        desp: '级联配置',
                        attr: []
                    },
                    {
                        name: 'attrInEachElement',
                        desp: '数组中每个元素可有的属性',
                        type: 'array',
                        require: {
                            type: ['array', 'edmCollection']
                        },
                        attrInEachElement: 'self',
                        reserve: 'true'
                    },
                    {
                        name: 'attr',
                        desp: '对象中的子属性',
                        type: 'array',
                        require: {
                            type: ['object']
                        },
                        attrInEachElement: 'self'
                    }
                ]
            },
            {
                name: "css",
                type: 'object',
                desp: '样式',
                isTab: true,
                expand: true,
                attr: [{
                    name: 'theme',
                    type: 'array',
                    desp: '类名样式',
                    attrInEachElement: [{
                        name: 'desp',
                        type: "string_input",
                        desp: '中文名'

                    },
                        {
                            name: 'name',
                            type: "string_input",
                            desp: '英文名'
                        },
                        {
                            name: 'template',
                            type: 'string_simpleHtml',
                            desp: 'HTML模板',
                            details: 'HTML模板，在菜单中需要展示出来的模板html，一般要求为整个组件的template，或者能展示整个组件所有元素的html'
                        },

                        {
                            name: 'valueArray',
                            type: "tags_input",
                            desp: '选项值集合',
                            details: '对selector元素进行添加的主题样式名对应的className，主题内容需现在dependence/AUI/css中对应的less文件中设计好，或使用boostrap2.0提供的默认主题'
                        }, {
                            name: 'despArray',
                            type: "tags_input",
                            desp: '选项中文名集合',
                            details: '依次对应valueArray中的值，作为在菜单中选项的显示内容'
                        },
                        {
                            name: 'zoom',
                            type: 'number',
                            desp: '缩放',
                            details: '如果模板太大，可以使用该项调整模板的显示效果',
                            defaultValue: 1
                        }
                    ]
                },
                    {
                        name: 'style',
                        type: 'array',
                        desp: '行内样式',
                        attrInEachElement: [{
                            name: 'desp',
                            type: 'string_input',
                            desp: '中文名'
                        },
                            {
                                name: 'name',
                                type: 'string_input',
                                desp: '英文名'
                            },

                            {
                                name: 'cssAttrs',
                                separator: ' ',
                                type: 'multiple_select',
                                desp: '样式属性'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'event',
                type: 'object',
                desp: '事件',
                isTab: true,
                expand: true,
                attr: [{
                    name: 'selector',
                    type: 'array',
                    desp: '触发范围',
                    attrInEachElement: [{
                        name: 'desp',
                        type: 'string_input',
                        desp: '中文名'
                    },
                        {
                            name: 'value',
                            type: 'string_with_placeholder',
                            desp: '选择器',
                            defaultValue: '###_ID##',
                            valueArray: ['##_ID##'],
                            despArray: ['id'],
                            template: '比如组件元素的id是btn1，那么转换过程就是 ##_ID##->btn1',
                            detailsArray: [
                                '表示对应元素在页面中的id属性，这个属性前加#可以作为jquery选择器来访问'
                            ]
                        }
                    ]
                },
                    {
                        name: 'type',
                        type: 'array',
                        desp: '触发类型',
                        attrInEachElement: [{
                            name: 'desp',
                            type: 'string_input',
                            desp: '中文名'
                        },
                            {
                                name: 'value',
                                type: 'string_input',
                                desp: '触发类型'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'api',
                type: 'array',
                isTab: true,
                desp: '接口',
                expand: true,
                attrInEachElement: [{
                    name: 'desp',
                    type: 'string_input',
                    desp: '中文名'
                },

                    {
                        name: 'name',
                        type: 'string_input',
                        desp: '接口名'
                    },

                    {
                        name: "type",
                        desp: "类型",
                        type: 'string_select',
                        separator: ' ',
                        despArray: ['无参数接口', '取值器', '赋值器', '校验成功', '校验失败', '清除校验', '自定义校验方法', '事件接口', '行为接口（弃用，请改用"显示、隐藏"）', '上传接口（弃用，请改用"赋值器"）'],
                        valueArray: ["universal", "getter", "setter", "successCallback", "errorCallback", "cleanCallback", "validateHandler", "event", "behavior", "dataFlow"]
                    },
                    {
                        name: 'details',
                        desp: '详情',
                        type: 'string_input'
                    },
                    {
                        name: 'deps',
                        type: 'string_select',
                        desp: '调用接口可能需要发起异步请求',
                        valueArray: ['', 'ajax'],
                        despArray: ['不需要', '可能需要'],
                        defaultValue: '',
                        reserve: true
                    },
                    {
                        name: 'order',
                        type: 'string_select',
                        desp: '发起异步请求顺序',
                        valueArray: ['', 'api'],
                        despArray: ['在成功回调中调用接口', '接口处理参数后再主动发起请求'],
                        require: {
                            deps: ['ajax']
                        },
                        reserve: 'true'
                    },
                    {
                        name: 'lifecycle',
                        type: 'multiple_select',
                        desp: '调用接口可以在',
                        valueArray: ['load', 'pause', 'resume', 'unload'],
                        despArray: ['初始或轮询操作', '切出操作', '切入操作', '销毁操作'],
                        separator: ','
                    },
                    {
                        name: 'hasReturn',
                        desp: '是否有出参',
                        type: 'boolean',
                        defaultValue: 'false'
                    },
                    {
                        name: 'params',
                        desp: '入参',
                        type: 'array',
                        require: {
                            type: ['setter', 'successCallback', 'errorCallback', "validateHandler", "event", "successCallback", "errorCallback", "cleanCallback", "validateHandler", "behavior", "dataFlow"]
                        },
                        attrInEachElement: [{
                            name: 'desp',
                            desp: '中文名',
                            type: 'string_input'
                        },
                            {
                                name: 'name',
                                desp: '英文名',
                                type: 'string_input'
                            },
                            {
                                name: 'details',
                                desp: '详情',
                                type: 'string_input'
                            },
                            {
                                name: 'formatter',
                                desp: '占位符类型',
                                type: "string_select",
                                require: {
                                    type: ['string']
                                },
                                despArray: ['无', '累加器替换', '数组下标替换'],
                                valueArray: ['', 'replace', 'selector']
                            },
                            {
                                desp: '在逻辑概览中保留类型',
                                name: 'keepType',
                                type: 'boolean',
                                defaultValue: false
                            },
                            // {
                            //     desp: '在逻辑概览中的默认配置类型',
                            //     name: 'overviewType',
                            //     type: 'string_select',
                            //     valueArray: ['value', 'interface', 'request', 'response'],
                            //     despArray: ['默认', '接口', '传输数据', '返回数据']
                            // },
                            {
                                name: 'type',
                                desp: '类型',
                                type: 'string_select',
                                group: [{
                                    label: '原子类型',
                                    valueArray: ['string', 'number', 'boolean', 'string_select', 'url', 'option'],
                                    despArray: ['字符串', '数字', '布尔值', '枚举值', '后台服务地址', '组件实例配置']
                                },
                                    {
                                        label: '复合类型',
                                        valueArray: ['object', 'array', 'jQuery', 'function', 'handler', 'event', 'tags_input'],
                                        despArray: ['对象', '数组', 'jQuery对象', '函数', '入参函数', '事件句柄', '字符串数组']
                                    }
                                ]
                            },
                            {
                                name: 'necessary',
                                desp: '是否必填',
                                type: 'boolean',
                                defaultValue: 'true'
                            },
                            {
                                name: 'defaultValue',
                                desp: '示例值',
                                type: 'string_input',
                                require: {
                                    type: ['string', 'number', 'boolean', 'tags_input', 'string_select', 'jQuery', 'function', 'handler', 'event', 'tags_input']
                                }
                            },

                            {
                                name: 'children',
                                desp: '子参数',
                                type: 'array',
                                attrInEachElement: 'self',
                                require: {
                                    type: ['object', 'array', 'option']
                                }
                            }
                        ]
                    },
                    {
                        name: 'returnValue',
                        desp: '出参',
                        type: 'object',
                        require: {
                            hasReturn: [true]
                        },
                        attr: [{
                            name: 'desp',
                            desp: '中文名',
                            type: 'string_input'
                        },
                            {
                                name: 'name',
                                desp: '英文名',
                                type: 'string_input'
                            },
                            {
                                name: 'details',
                                desp: '详情',
                                type: 'string_input'
                            },
                            {
                                name: 'type',
                                desp: '类型',
                                type: 'string_select',
                                group: [{
                                    label: '原子类型',
                                    valueArray: ['void', 'string', 'number', 'boolean', 'string_select', 'url', 'option'],
                                    despArray: ['无', '字符串', '数字', '布尔值', '枚举值', '后台服务地址', '组件实例配置']
                                },
                                    {
                                        label: '复合类型',
                                        valueArray: ['object', 'array', 'jQuery', 'function', 'handler', 'event', 'tags_input'],
                                        despArray: ['对象', '数组', 'jQuery对象', '函数', '入参函数', '事件句柄', '字符串数组']
                                    }
                                ]
                            },
                            {
                                name: 'defaultValue',
                                desp: '示例值',
                                type: 'string_input',
                                require: {
                                    type: ['string', 'number', 'boolean', 'tags_input', 'string_select']
                                }
                            },
                            {
                                name: 'children',
                                desp: '子元素',
                                type: 'array',
                                attrInEachElement: 'self',
                                require: {
                                    type: ['object', 'array', 'option']
                                }
                            }
                        ]
                    },

                    {
                        name: 'code',
                        type: 'string_simpleHtml',
                        language: 'java',
                        desp: 'Java示例代码',
                        require: {
                            deps: ['ajax']
                        }
                    }
                ]
            }
        ],

        templateFunc: templateFunc,

        paramType: {
            name: 'type',
            desp: '类型',
            type: 'string_select',
            group: [{
                label: '原子类型',
                valueArray: ['string', 'number', 'boolean', 'string_select', 'url', 'option'],
                despArray: ['字符串', '数字', '布尔值', '枚举值', '后台服务地址', '组件实例配置']
            },
                {
                    label: '复合类型',
                    valueArray: ['object', 'array', 'jQuery', 'function', 'handler', 'event'],
                    despArray: ['对象', '数组', 'jQuery对象', '函数', '入参函数', '事件句柄']
                }
            ]
        },

        apiDefaultList: {
            universal: {

                //无参数接口
                desp: '', //中文名
                name: '', //接口名
                type: 'universal', //类型
                details: '', //详情
                deps: '', //是否需要异步请求
                lifecycle: '', //可在哪里调用
                hasReturn: false, //是否有出参
                params: [] //入参
            },

            getter: {
                //取值器
                type: 'getter', //类型
                hasReturn: true,
                params: [],
                returnValue: {
                    type: 'string',
                    name: 'data',
                    desp: '返回数据'
                }
            },

            setter: {
                type: 'setter',
                deps: 'ajax',
                order: '',
                lifecycle: 'init,resume',
                hasReturn: false,
                params: [{
                    type: 'string',
                    name: 'data',
                    desp: '传入数据'
                }],
                code: '//后台代码'
            },

            successCallback: {
                type: 'successCallback',
                hasReturn: false,
                params: [{
                    type: 'jQuery',
                    name: '$input',
                    desp: '表单元素的jQuery对象'
                }]
            },

            errorCallback: {
                type: 'errorCallback',
                hasReturn: false,
                params: [{
                    type: 'jQuery',
                    name: '$input',
                    desp: '表单元素的jQuery对象'
                }, {
                    type: 'string',
                    name: 'errorMsg',
                    desp: '错误信息'
                }]
            },

            cleanCallback: {
                //清除校验
                type: 'cleanCallback',
                hasReturn: false,
                params: [{
                    type: 'event',
                    name: 'e',
                    desp: '事件句柄'
                }]
            },

            validateHandler: {
                //自定义校验方法
                type: 'validateHandler',
                hasReturn: true,
                params: [{
                    type: 'string',
                    name: 'value',
                    desp: '校验值'
                }],
                returnValue: {
                    type: 'object',
                    name: 'ret',
                    desp: '校验结果对象',
                    children: [{
                        type: 'string',
                        name: 'value',
                        desp: '完成校验值'
                    }, {
                        type: 'boolean',
                        name: 'result',
                        desp: '校验结果'
                    }, {
                        type: 'string',
                        name: 'errorMsg',
                        desp: '校验错误信息，如果校验结果为true，则无需返回该值'
                    }]
                }
            },

            event: {
                //事件接口
                type: 'event',
                hasReturn: false,
                params: [{
                    type: 'event',
                    name: 'e',
                    desp: '事件句柄'
                }]
            },

            behavior: {
                type: 'behavior',
                hasReturn: false,
                params: [{
                    type: 'boolean',
                    desp: '比较结果',
                    name: 'result'
                }, {
                    type: 'string',
                    desp: '比较值1',
                    name: 'input1'
                }, {
                    type: 'string',
                    desp: '比较值2',
                    name: 'input2'
                }, {
                    type: 'handler',
                    desp: '比较条件',
                    name: 'condition'
                }]
            },

            dataFlow: {
                //上传接口（数据流接口）
                type: 'dataFlow',
                hasReturn: false,
                params: [{
                    type: 'url',
                    desp: '后台服务地址',
                    name: 'url'
                }, {
                    type: 'option',
                    desp: '组件实例配置',
                    name: '##_OPTION##.配置项的名称'
                }]
            }
        },
        appInterfacesSources: {
            'universal': '通用',
            'mobile': '移动端',
            'agreeBus': 'Agree Bus',
            'aibs': '智慧网点'
        },
        templateFuncInViewer: templateFunc,
        templateCustom: [' spaLifecycle= {',
            '     	load: function (_$el, _scope, _handler) {',
            '               auiCtx.pageParams = $.extend(true, _scope, app.domain.get("page"));',
            '               auiCtx.context = this;',
            '               $el=_$el,handler=_handler,scope=_scope;',
            '               /*覆盖页面加载时的属性或方法*/',
            '               /*覆盖auiCtx属性或方法 */',
            '               auiCtx.auiCtxLoad.call(this, auiCtx,_$el, _scope, _handler);',
            '               /*事件绑定*/',
            '               this.delegateEvents.call(this,auiCtx.delegateEvents);',
            '     	},',
            '     	resume: function ($el, scope, handler) {',
            '              /*覆盖页面恢复时的属性或方法*/',
            '     	   auiCtx.auiCtxResume.call(this, auiCtx,$el, scope, handler);',
            '     	},',
            '     	pause: function ($el, scope, handler) {',
            '              /*覆盖页面切出时的属性或方法*/',
            '     	   auiCtx.auiCtxPause.call(this, auiCtx,$el, scope, handler);',
            '     	},',
            '     	unload: function ($el, scope, handler) {',
            '              /*覆盖页面销毁时的属性或方法*/',
            '     	   auiCtx.auiCtxUnload.call(this, auiCtx,$el, scope, handler);',
            '     	}',
            '     };'].join('')
    }

});