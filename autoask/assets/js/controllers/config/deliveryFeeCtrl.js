'use strict';

app.controller('deliveryFeeCtrl', function ($scope, $rootScope, autoaskService, areaService) {

    $scope.init = function () {
        $scope.deliverFreeAmount = 0;
        $scope.loadingPromise = autoaskService.getDeliveryFreeAmount(null, function (resp) {
            $scope.deliveryFreeAmount = resp.data;
        })
    };

    $scope.updateDeliveryFreeAmount = function () {
        var amount = $scope.deliveryFreeAmount;
        var checkList = $scope.list;
        $scope.province = [];
        if (checkList.length > 0) {
            angular.forEach(checkList, function (i) {
                if (i.checked == true) {
                    $scope.province.push(i.name);
                }
            })
        }
        if (isNaN(amount)) {
            swal('额度非法', '', 'error');
            return;
        }
        var realAmount = parseInt(amount);
        if (realAmount < 0) {
            swal('额度不能小于0', '', 'error');
            return;
        }
        $scope.loadingPromise = autoaskService.updateDeliveryFreeAmount({
            amount: amount,
            province: $scope.province.join()
        }, function () {
            swal('更新成功', '', 'success');
        });
    };

    // 表单
    $scope.form = {
        submit: function (form) {
            if (form.$invalid) {
                var firstError = null;
                for (var field in form) {
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
                $scope.updateDeliveryFreeAmount();
            }
        }
    };
    // 初始化
    $scope.init();
    //定义变量
    $scope.m = [];
    $scope.checked = [];
    $scope.checkedName = [];
    //地区(省)checkBox封装
    autoaskService.getProvinceList(null, function (resp) {
        $scope.list = resp.data;
        //初始化添加默认选中的数据
        if (resp.data.length > 0) {
            angular.forEach(resp.data, function (i) {
                if (i.isChoice == true) {
                    console.log(i.isChoice)
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
});