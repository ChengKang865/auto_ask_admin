'use strict';
/**
 * controller for angular-ladda
 * An angular directive wrapper for Ladda buttons.
 */
app.controller('loginCtrl', function ($rootScope, $scope, $localStorage, $state, autoaskService, authService, md5) {

    $scope.login = function () {
        var code = $scope.code;
        if ($scope.code.length > 4) {
            code = md5.createHash(code);
        }
        var params = {
            phone: $scope.phone,
            code: code,
            rememberFlag: $scope.rememberFlag,
            loginType: 'partner'
        };
        $rootScope.loadingPromise = autoaskService.login(params).success(function (resp) {
            if (resp.errCode === 0) {
                //登录成功
                $localStorage.partner_session_id = resp.data.partner_session_id;
                var name = resp.data.name;
                var logoUrl = resp.data.logoUrl === null ? '../common/images/avatar-1.jpg' : resp.data.logoUrl;
                var role = resp.data.role;
                var user = {role: role, rememberFlag: $scope.rememberFlag, picture: logoUrl, name: name};
                $rootScope.user = user;
                authService.setUser(user);
                $state.go('app.face');
            } else {
                swal("登录失败", resp.errMsg, "error");
            }
        });
    };

    $scope.sendMsg = function () {
        if ($scope.phone === undefined || $scope.phone === null || $scope.phone === '') {
            swal('请输入正确的手机号码', '', 'error');
            return;
        }
        if (!(/^1[34578]\d{9}$/.test($scope.phone))) {
            swal('请输入正确的手机号码', '', 'error');
            return;
        }
        $scope.loadingPromise = autoaskService.sendMsg({phone: $scope.phone}, function (resp) {
            swal('发送短信成功', '', '');
        });
    };
});
