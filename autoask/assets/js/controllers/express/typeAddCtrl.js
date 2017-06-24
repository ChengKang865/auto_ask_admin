app.controller("expressTypeAddCtrl", ["$scope", "autoaskService", "ngTableParams", "$location", function ($scope, autoaskService, ngTableParams, $location) {
    $scope.init = function () {
        $scope.express = {};
        //表单数据
    };

    var submit = function () {
        $scope.loadingPromise = autoaskService.insertExpressType($scope.express, function () {
            swal('创建快递类型成功', '', 'success');
            $location.path('app/express/typeList');
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