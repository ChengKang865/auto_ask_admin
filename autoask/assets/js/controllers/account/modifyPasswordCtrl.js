app.controller('modifyPasswordCtrl', ['$scope', 'autoaskService', 'md5',function ($scope, autoaskService,md5) {
    $scope.submit = function () {
        if ($scope.password !== $scope.confirmPassword) {
            swal('两次密码不一致', '', 'error');
            return;
        }
        var code = md5.createHash($scope.password);
        $scope.loadingPromise = autoaskService.updatePassword({password: code}, function () {
            swal('更新密码成功', '', 'success');
        })
    };

    // 表单
    $scope.form = {
        submit: function (form) {
            var firstError = null;
            if (form.$invalid) {
                var field = null, firstError = null;
                for (field in form) {
                    if (field[0] != '$') {
                        if (firstError === null && !form[field].$valid) {
                            firstError = form[field].$name;
                        }

                        if (form[field].$pristine) {
                            form[field].$dirty = true;
                        }
                    }
                }
                angular.element('.ng-invalid[name=' + firstError + ']').focus();
                swal("表单中存在错误", "红色标注了错误!", "error");
                return;

            } else {
                $scope.submit();
            }
        }
    };
}]);