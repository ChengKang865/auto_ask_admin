app.controller("expressTemplateModifyCtrl", ["$scope", "autoaskService", "ngTableParams", "$location", '$stateParams', function ($scope, autoaskService, ngTableParams, $location, $stateParams) {
    $scope.init = function () {
        $scope.express = {};
        $scope.loadingPromise = autoaskService.getExpressTemplate({id: $stateParams.id}, function (resp) {
            $scope.express = resp.data;
        });
    };

    var submit = function () {
        $scope.loadingPromise = autoaskService.updateExpressTemplate($scope.express, function () {
            swal('修改快递模板成功', '', 'success');
            $location.path('app/express/templateList');
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
                //获取当前选择的check省
                $scope.province = [];
                var checkList = $scope.list;
                if (checkList.length > 0) {
                    angular.forEach(checkList, function (i) {
                        if (i.checked == true) {
                            $scope.province.push(i.name);
                        }
                    })
                }
                if( $scope.province.length <= 0){
                    swal("表单中存在错误", "至少选择一条地区", "error");
                    return;
                }
                $scope.express.range = $scope.province.join();
                submit();
            }
        }
    };

    $scope.init();

    //没有分页参数的快递类型list
    autoaskService.notPageList(null, function (resp) {
        $scope.notPageExpressTypeList = resp.data.result;
    });

    //定义变量
    $scope.m = [];
    $scope.checked = [];
    $scope.checkedName = [];
    //地区(省)checkBox封装
    autoaskService.getTemplateProvinceList({id:$stateParams.id}, function (resp) {
        $scope.list = resp.data;
        //初始化添加默认选中的数据
        if (resp.data.length > 0) {
            angular.forEach(resp.data, function (i) {
                if (i.isChoice == true) {
                    i.checked = true;
                    $scope.checked.push(i.id);
                }
            })
        }

        $scope.selectAll = function () {
            if ($scope.select_all) {
                $scope.checked = [];
                angular.forEach(resp.data, function (i) {
                    i.checked = true;
                    $scope.checked.push(i.id);
                })
            } else {
                angular.forEach(resp.data, function (i) {
                    i.checked = false;
                    $scope.checked = [];
                })
            }
        };
        $scope.selectOne = function () {
            angular.forEach(resp.data, function (i) {
                var index = $scope.checked.indexOf(i.id);
                if (i.checked && index === -1) {
                    $scope.checked.push(i.id);
                } else if (!i.checked && index !== -1) {
                    $scope.checked.splice(index, 1);
                }
                ;
            })
            if (resp.data.length === $scope.checked.length) {
                $scope.select_all = true;
            } else {
                $scope.select_all = false;
            }
        }
    });
}]);