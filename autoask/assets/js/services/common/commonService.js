'use strict';

/**
 * AuthController
 *
 * @constructor
 */

app.factory('commonService', [function () {

    var globalTmpParams = {};

    return {
        // 获取全局临时参数
        getGlobalTmpParams: function () {
            return globalTmpParams;
        },
        // 设置全局临时参数
        setGlobalTmpParams: function (params) {
            globalTmpParams = params;
        },
        // 判断类型是 undefined 或者 null
        isUndefinedOrNull: function (data) {
            return (data === undefined || data === null);
        },
        // 判断 List 是否为空
        isArrayEmpty: function (arr) {
            if (typeof(arr) == "object" && arr.length == 0) {
                return true;
            }
        },
        // 获取对象的所有属性名
        getAttrNames: function (object) {
            var attrNames = [];
            for (var name in object) {
                attrNames.push(name);
            }
            return attrNames;
        },
        // 获取当前时间的时间戳
        currentTimestamp: function () {
            return new Date().date.getTime();
        },
        // 获取当前时间: yyyy-MM-dd HH:mm:ss
        timNow: function () {
            return $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
        },
        // 解析时间.输出格式为 yyyy-MM-dd HH:mm:ss;
        timestampToDateTime: function (time) {
            console.log(time === null);
            if (time === undefined) {
                return "undefined";
            } else if (time === null) {
                return "null";
            } else {
                var constructorStr = time.constructor.toString();
                console.log(constructorStr);
                if (constructorStr.indexOf("Number") != -1) {
                    return $filter('date')(new Date(time), 'yyyy-MM-dd HH:mm:ss');
                }
                if (constructorStr.indexOf("Date") != -1) {
                    return $filter('date')(time, 'yyyy-MM-dd HH:mm:ss');
                }
            }
        },
        // 判断 object {} 是否为空
        dictEmpty: function isEmptyObject(obj) {
            return JSON.stringify(obj) == '{}';
        },
        str2obj: function (str) {
            if (typeof(str) === 'string') {
                str = JSON.parse(str);
            }
            return str;
        }
    }
}]);