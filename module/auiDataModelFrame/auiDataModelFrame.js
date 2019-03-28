define([
    "jquery",
    "const",
    'template',

    'requireCss!./auiDataModelFrame.css'
], function ($, CONST,template) {

    var STATUS = $AW.STATUS.PREVIEW_FRESH,
        NAME_SPACE = '.'+CONST.PAGE.DATA_MODEL_OVERVIEW.NAME_SPACE,
        COMMON_CLASS_CONST = CONST.PAGE.COMMON_CLASS,
        type = STATUS+NAME_SPACE,
        
        MENU_CONST=CONST.PAGE.MENU_FRAME;


    var Aside=function($el){
        this.$el=$el;
    };


    Aside.prototype={
        constructor:Aside,

        setData:function(data){
            this.cache=data;


            $el.empty().append(`
                <div  class="aui-widget-set">
                    <div class="aui-widget-set-body">
                        <div class="aui-widget-menu-group">
                            <div class="aui-widget-menu-group-header" data-role="menuAngleUpTitle">
                                <i class="aui aui-menu-angle aui-jiantou-xia"></i><span>页面变量</span>
                            </div>
                            <div class="aui-widget-menu-inner" style="overflow: hidden; display: block;">
                                ${data.pageParams.map(p=>`
                                    <div class="aui-widget-menu-body" style="display:block" title>
                                        <div data-id="${p.id}" data-taffy-id="${p.___id}" class="aui-widget-menu-item">
                                            <small class="iconfont icon-line-normalBtn"></small>
                                            <span>${p.desp}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="aui-widget-set-body">
                        <div class="aui-widget-menu-group">
                            <div class="aui-widget-menu-group-header" data-role="menuAngleUpTitle">
                                <i class="aui aui-menu-angle aui-jiantou-xia"></i><span>组件变量</span>
                            </div>
                            <div class="aui-widget-menu-inner" style="overflow: hidden; display: block;">
                                <div class="aui-widget-menu-block" data-type="${type.name}">
                                    ${type.children.map(v=>`
                                    `).join('')}
                                    <div class="aui-widget-menu-group-header" data-role="menuAngleUpTitle">
                                        <i class="aui aui-jiantou-xia aui-menu-angle "></i><span>按钮</span>
                                    </div>
                                    <div class="aui-widget-menu-body" style="display:block">
                                        <div data-href="component.btn.normalBtn" data-type="normalBtn" data-accept="divCtn formCtn modalCtn foundationRowCtn"
                                            class="aui-widget-menu-item divCtn formCtn modalCtn foundationRowCtn   ui-draggable ui-draggable-handle"
                                            data-original-title="" title="">
                                            <small class="iconfont icon-line-normalBtn"></small>
                                            <span>普通按钮</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`);
            return this;
        }
    };




    

    return {
        load: function ($el, handler) {
            var dataModel=handler.dataModel;
            var pageDataModel=dataModel.data;

            $el.on({
                'click aside':function(e){
                    var $target = $(e.target || event.srcElement).closest('[data-role]'),
                        $icon,
                        role = $target.attr('data-role');

                        switch(role){
                            case MENU_CONST.ANGLE_UP_TITLE:
                            if (($icon = $target.children(MENU_CONST.MENU_CLASS.ANGLE_SELECTOR)).length) {

                                if ($icon.hasClass(COMMON_CLASS_CONST.ANGLE_UP)) {
                                    $icon.removeClass(COMMON_CLASS_CONST.ANGLE_UP);
                                    $icon.addClass(COMMON_CLASS_CONST.ANGLE_DOWN);
                                    $target.next().slideDown(200);
                                } else {
                                    $icon.removeClass(COMMON_CLASS_CONST.ANGLE_DOWN);
                                    $icon.addClass(COMMON_CLASS_CONST.ANGLE_UP);
                                    $target.next().slideUp(200);
                                }
                            }
                        }

                    
                }
            })

            $AW.off(type).on(type,function(type, widgetID){
            });
        },
        unload: function ($el, handler) {
            $el.off();
            $AW.off(type);
        },
        pause: function ($el, handler) {

        },
        resume: function ($el, handler) {

        }
    };
});
  