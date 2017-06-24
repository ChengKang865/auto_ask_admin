'use strict';

/**
 * 列表页面控制器
 */
app.controller('serviceProviderListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams, $state) {

    $scope.total = 0;
    $scope.phone = '';
    $scope.partnerId = '';
    $scope.loadingPromise = null;


    // 初始化模态弹出框模式
    $scope.displayPromote = false;

    // 加载列表
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10
    }, {
        total: 0,
        getData: function ($defer, params) {
            $scope.loadingPromise = autoaskService.getServiceProviderList({
                page: params.page(),
                count: params.count(),
                phone: $scope.phone,
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
        $state.go('app.merchant.serviceProviderDetail', {action: 'add'});
    };

    // 查看服务店
    $scope.info = function (pid) {
        $state.go('app.merchant.serviceProviderDetail', {action: 'info', id: pid});
    };

    // 跳转修改
    $scope.edit = function (pid) {
        $state.go('app.merchant.serviceProviderDetail', {action: 'edit', id: pid});
    };

    // 删除服务店
    $scope.delete = function (pid) {
        autoaskService.deleteServiceProvider({id: pid}, function (resp) {
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
            merchantType: 'service_provider',
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

});

/**
 * 详情页面控制器
 */
app.controller('serviceProviderDetailCtrl', function ($rootScope, $scope, areaService, autoaskService, commonService, $state, $stateParams) {

    // 当前动作 (add, edit, info)
    var action = $stateParams.action;
    $scope.action = action == undefined ? 'add' : action;

    $scope.serviceProvider = {};

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
            $scope.serviceProvider.address.city = '';
            $scope.serviceProvider.address.region = '';
            $scope.serviceProvider.address.street = '';
            $scope.serviceProvider.address.detail = '';
        })
    };
    $scope.cityChanged = function (province, city) {
        return autoaskService.getRegions(province, city, function (regions) {
            $scope.regions = regions;
            $scope.streets = [];
            $scope.serviceProvider.address.region = '';
            $scope.serviceProvider.address.street = '';
            $scope.serviceProvider.address.detail = '';
        })
    };
    $scope.regionChanged = function (province, city, region) {
        return autoaskService.getStreets(province, city, region, function (streets) {
            $scope.streets = streets;
            $scope.serviceProvider.address.street = '';
            $scope.serviceProvider.address.detail = '';
        })
    };

    // 提交
    var submit = function () {
        var successHandler = function (resp) {
            swal("操作成功", "", "success");
            $state.go('app.merchant.serviceProvider');
        };

        if ($scope.action == 'add') {
            autoaskService.addServiceProvider($scope.serviceProvider, successHandler);
        } else if ($scope.action == 'edit') {
            autoaskService.updateServiceProvider($scope.serviceProvider, successHandler);
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

        if (element.id == 'uploadLogo') {
            $scope.loadingPromise = autoaskService.uploadFile(formData, function (resp) {
                $scope.serviceProvider.logoUrl = resp.data;
            })
        } else {
            if (commonService.isUndefinedOrNull($scope.serviceProvider.picUrlList)) {
                $scope.serviceProvider.picUrlList = [];
            }
            $scope.loadingPromise = autoaskService.uploadFile(formData, function (resp) {
                $scope.serviceProvider.picUrlList.push(resp.data);
            })
        }


    };

    // 初始化
    $scope.init = function () {

        //加载省份列表
        $rootScope.loadingPromise = areaService.loadRegion().then(function () {
            $scope.provinces = areaService.getProvinces();
        });

        // 确定操作类型
        if ($scope.action == 'add') {
            // 什么都不做
        } else {
            // 查看详情与更改都要获取信息
            var serviceProviderId = $stateParams.id;
            autoaskService.getServiceProvider({id: serviceProviderId}, function (resp) {
                $scope.serviceProvider = resp.data;
                var address = angular.copy($scope.serviceProvider.address);
                $scope.provinceChanged(address.province);
                $scope.cityChanged(address.province, address.city);
                $scope.regionChanged(address.province, address.city, address.region).then(function () {
                        $scope.serviceProvider.address = address;
                    }
                );
            });
        }
        if ($scope.action == 'info') {
            $('input').attr('disabled', true).attr('placeholder', '');
            $('select').attr('disabled', true);
        }
    };

    // 删除图片
    $scope.deleteImage = function (picArr, listIndex) {
        picArr.splice(listIndex, 1);
    };

    $scope.init();

});
