'use strict';

/**
 * 列表页面控制器
 */
app.controller('factoryListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams, $state, $q) {

    $scope.total = 0;
    $scope.phone = '';
    $scope.name = '';
    $scope.loadingPromise = null;

    // 加载列表
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10
    }, {
        total: 0,
        getData: function ($defer, params) {
            $scope.loadingPromise = autoaskService.getFactoryList({
                page: params.page(),
                count: params.count(),
                phone: $scope.phone,
                name: $scope.name,
                partnerId: $scope.partnerId
            }, function (resp) {
                $scope.data = resp.data.result;
                params.total(resp.data.total);
                $defer.resolve([$scope.data]);
            });
        }
    });

    // 查询
    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    // 跳转增加
    $scope.add = function () {
        $state.go('app.merchant.factoryDetail', {action: 'add'});
    };

    // 查看服务店
    $scope.info = function (pid) {
        $state.go('app.merchant.factoryDetail', {action: 'info', id: pid});
    };

    // 跳转修改
    $scope.edit = function (pid) {
        $state.go('app.merchant.factoryDetail', {action: 'edit', id: pid});
    };

    // 删除工厂
    $scope.delete = function (pid) {
        autoaskService.deleteFactory({id: pid}, function (resp) {
            swal("操作成功", "", "success");
            $scope.tableParams.reload();
        })
    };

    // 显示绑定二维码模态输入
    $scope.displayQRCode = function (id) {
        $scope.qrMerchantId = id;
        $scope.qrShowFlag = true;
    };

    // 绑定二维码
    $scope.bindQRCode = function () {
        if ($scope.qrCode === undefined || $scope.qrCode === null || $scope.qrCode === '') {
            swal('请输入合法的二维码', '', 'error');
        }
        $scope.loadingPromise = autoaskService.bindQRCode({
            merchantType: 'factory',
            merchantId: $scope.qrMerchantId,
            code: $scope.qrCode
        }, function () {
            swal('绑定成功', '', 'success');
        });
        $scope.hideQRCode();
    };

    // 隐藏模态输入框
    $scope.hideQRCode = function () {
        $scope.qrCode = null;
        $scope.qrMerchantId = null;
        $scope.qrShowFlag = false;
    };


    // 导出cvs
    $scope.filename = "factory";

    $scope.getDataList = function() {
        var deferred = $q.defer();
        var dataList = [];
        var keys = autoaskService.getTableKey();
        var dataTmp = {};

        $scope.loadingPromise = autoaskService.getFactoryList({
            page: 1,
            count: 10,
            phone: $scope.phone,
            partnerId: $scope.partnerId
        }, function (resp) {
            resp.data.result.forEach(function (data) {
                dataTmp = {};

                keys.forEach(function (key) {
                    dataTmp[key] = data[key];
                });

                dataList.push(dataTmp);
            });
            deferred.resolve(dataList);
        });

        return deferred.promise;
    };

    $scope.getHeader = function () {
        return autoaskService.getTableHeader();
    };
});

/**
 * 详情页面控制器
 */
app.controller('factoryDetailCtrl', function ($scope, autoaskService, areaService, $state, $stateParams) {

    // 当前动作 (add, edit, info)
    var action = $stateParams.action;
    $scope.action = action == undefined ? 'add' : action;

    $scope.factory = {};

    // 地址控制
    $scope.provinces = [];
    $scope.cities = [];
    $scope.regions = [];
    $scope.streets = [];

    $scope.provinceChanged = function (province) {
        return autoaskService.getCities(province, function (cities) {
            $scope.cities = cities;
            $scope.regions = [];
            $scope.streets = [];
            $scope.factory.address.city = '';
            $scope.factory.address.region = '';
            $scope.factory.address.street = '';
            $scope.factory.address.detail = '';
        })
    };
    $scope.cityChanged = function (province, city) {
        return autoaskService.getRegions(province, city, function (regions) {
            $scope.regions = regions;
            $scope.streets = [];
            $scope.factory.address.region = '';
            $scope.factory.address.street = '';
            $scope.factory.address.detail = '';
        })
    };
    $scope.regionChanged = function (province, city, region) {
        return autoaskService.getStreets(province, city, region, function (streets) {
            $scope.streets = streets;
            $scope.factory.address.detail = '';
        })
    };

    // 提交
    var submit = function () {
        var successHandler = function (resp) {
            swal("操作成功", "", "success");
            $state.go('app.merchant.factory');
        };

        if ($scope.action == 'add') {

            autoaskService.addFactory($scope.factory, successHandler);
        } else if ($scope.action == 'edit') {
            autoaskService.updateFactory($scope.factory, successHandler);
        } else {
            swal("操作不合法", "您不能进行当前的操作, 请联系管理员", "error")
        }
    };

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
            } else {
                submit();
            }

        },
        reset: function (form) {

            $scope.myModel = angular.copy($scope.master);
            form.$setPristine(true);

        }
    };

    // 上传图片
    $scope.uploadImage = function (element) {
        if (element.files.length === 0)
            return;
        var file = element.files[0];
        var formData = new FormData();
        formData.append('file', file);
        $scope.loadingPromise = autoaskService.uploadFile(formData, function (resp) {
            $scope.factory.logoUrl = resp.data;
        })
    };

    // 初始化
    $scope.init = function () {

        //加载省份列表
        $scope.loadingPromise = areaService.loadRegion().then(function () {
            $scope.provinces = areaService.getProvinces();
        });

        // 确定操作类型
        if ($scope.action == 'add') {
            // 什么都不做
        } else {
            // 查看详情与更改都要获取信息
            var factoryId = $stateParams.id;
            autoaskService.getFactory({id: factoryId}, function (resp) {
                $scope.factory = resp.data;
                var address = angular.copy($scope.factory.address);
                $scope.provinceChanged(address.province);
                $scope.cityChanged(address.province, address.city);
                $scope.regionChanged(address.province, address.city, address.region).then(function () {
                        $scope.factory.address = address;
                    }
                );
            });
        }
        if ($scope.action == 'info') {
            $('input').attr('disabled', true).attr('placeholder', '');
            $('select').attr('disabled', true);
        }
    };

    $scope.init();

});
