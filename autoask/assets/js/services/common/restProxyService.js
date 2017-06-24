'use strict';

/**
 * AuthController
 *
 * @constructor
 */

app.factory('restProxyService', ['$http', function ($http) {

    /**
     * Convert json params to Form params
     */
    function _param (obj) {

        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += _param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '.' + subName;
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += _param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    return {
        /**
         * Send http get request
         */
        sendHttpGet: function (apiPrefix, path, params, options) {
            return $http.get(apiPrefix + encodeURI(path), {params: params}, options);
        },

        /**
         * Send http post request
         */
        sendHttpPost: function (apiPrefix, path, data, options) {
            if (options === undefined) {
                var headers = {'Content-Type': "application/x-www-form-urlencoded"};
                data = _param(data);
            } else {
                var headers = options.headers;
            }
            return $http({
                method: 'POST',
                url: apiPrefix + path,
                data: data,
                options: options,
                headers: headers
            })
        }

    }
}]);