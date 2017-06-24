'use strict';

/**
 * AuthController
 *
 * @constructor
 */

app.factory('authService', ['$window', function ($window) {

    var user = undefined;
    var isDefined = false;
    isDefined = function (str) {
        return (str && (str !== 'undefined'));
    };

    return {
        getUser: function () {
            var retVal = undefined;
            if (user) {
                retVal = user;
            } else if (isDefined($window.localStorage.user)) {
                retVal = JSON.parse($window.localStorage.user);
            } else if (isDefined($window.sessionStorage.user)) {
                retVal = JSON.parse($window.sessionStorage.user);
            }
            return retVal;
        },
        setUser: function (aUser) {
            user = aUser;
            if (!user) {
                $window.localStorage.user = undefined;
                $window.sessionStorage.user = undefined;
            } else {
                if (aUser.rememberFlag === true)
                    $window.localStorage.user = (user ? JSON.stringify(user) : '');
                else
                    $window.sessionStorage.user = (user ? JSON.stringify(user) : '');
            }
        },
        isAllow: function (allowRoles,nowUser) {
            if (!nowUser) {
                return false
            } else {
                for (var i = 0; i < allowRoles.length; i++) {
                    var role = allowRoles[i];
                    if (role == nowUser.role)
                        return true;
                }
            }
            return false
        }
    }
}]);