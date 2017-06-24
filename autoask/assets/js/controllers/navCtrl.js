/**
 * Created by hyy on 2016/12/27.
 */
'use strict';
/**
 * controller for angular-ladda
 * An angular directive wrapper for Ladda buttons.
 */
app.controller('navCtrl', function ($rootScope, $scope, $localStorage, $state, autoaskService, authService) {

    $scope.hasPermission = function (role) {
        var user = authService.getUser();
        if (user === undefined) {
            return false;
        }
        if (user.role === undefined || user.role === null) {
            return false;
        }
        if (user.role === 'root') {
            return true;
        }
        if (role === user.role) {
            return true;
        }
        return false;
    };
});