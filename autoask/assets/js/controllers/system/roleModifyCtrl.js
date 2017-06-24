app.controller("roleModifyCtrl", ["$scope", "autoaskService", "ngTableParams", "$location", '$stateParams', function ($scope, autoaskService, ngTableParams, $location, $stateParams) {
    $scope.init = function () {
        $scope.staff = {};
        $scope.loadingPromise = autoaskService.getStaff({id: $stateParams.id}, function (resp) {
            $scope.staff = resp.data;
        });
    };

    var submit = function () {
        $scope.loadingPromise = autoaskService.updateStaff($scope.staff, function () {
            swal('修改员工成功', '', 'success');
            $location.path('app/system/roleList');
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
                submit();
            }
        }
    };

    $scope.init();
}]);