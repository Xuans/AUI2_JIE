/**
 * @author zhnghaixian@agree.com.cn
 * @date    20180612
 * @desp    报告用户搜索字段信息模块js
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "index"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, AUI) {
        "use strict";
        var


            report = function (result) {
                if (result && window.navigator.onLine) {
                    $.ajax({
                        type: "POST",
                        url: "https://www.awebide.com/IDESearchController/saveSearchKeyword.do",
                        urlDivider: "/",
                        ajaxProcessData: true,
                        ajaxNoBlobData: true,
                        validate: true,
                        validateContinue: true,
                        data: result,
                        success: function (response) {
                            if (response.status) {
                                //console.log('报告成功')
                            } else if (response.errorMsg) {
                                //console.log('报告失败')
                            }
                        }
                    });
                }

            };


        AUI.report = report;


    });
})();