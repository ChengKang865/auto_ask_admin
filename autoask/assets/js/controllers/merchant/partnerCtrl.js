'use strict';

/**
 * 列表页面控制器
 */
app.controller('partnerListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams, $state, $q) {

    $scope.total = 0;
    $scope.loadingPromise = null;
    $scope.criteria = {};
    $scope.criteria.phone = '';
    $scope.criteria.name = '';

    // 初始化模态弹出框模式
    $scope.displayPromote = false;

    // 加载列表
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10
    }, {
        total: 0,
        getData: function ($defer, params) {
            $scope.criteria.page = params.page();
            $scope.criteria.count = params.count();
            $scope.loadingPromise = autoaskService.getPartnerList($scope.criteria, function (resp) {
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
        $state.go('app.merchant.partnerDetail', {action: 'add'});
    };

    // 查看合作商
    $scope.info = function (pid) {
        $state.go('app.merchant.partnerDetail', {action: 'info', id: pid});
    };

    // 跳转修改
    $scope.edit = function (pid) {
        $state.go('app.merchant.partnerDetail', {action: 'edit', id: pid});
    };

    // 删除合作商
    $scope.delete = function (pid) {
        autoaskService.deletePartner({id: pid}, function (resp) {
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
            merchantType: 'partner',
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
    $scope.filename = "partner";

    $scope.getDataList = function () {
        var deferred = $q.defer();
        var dataList = [];
        var keys = autoaskService.getTableKey();
        var dataTmp = {};

        $scope.criteria.page = 1;
        $scope.criteria.count = 1000000;

        $scope.loadingPromise = autoaskService.getPartnerList($scope.criteria, function (resp) {
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
app.controller('partnerDetailCtrl', function ($scope, $rootScope, autoaskService, areaService, PAY_TYPES, $state, $stateParams) {

    // 当前动作 (add, edit, info)
    var action = $stateParams.action;
    $scope.action = action;

    $scope.partner = {};
    $scope.partner.vatInvoice = {};

    // 地址控制
    $scope.provinces = [];
    $scope.cities = [];
    $scope.regions = [];
    $scope.streets = [];

    $scope.provinceChanged = function (province) {
        $scope.cities = areaService.getCities(province);
        $scope.regions = [];
        $scope.streets = [];
        $scope.partner.address.city = '';
        $scope.partner.address.region = '';
        $scope.partner.address.street = '';
        $scope.partner.address.detail = '';
    };
    $scope.cityChanged = function (province, city) {
        $scope.regions = areaService.getRegions(province, city);
        $scope.partner.address.region = '';
        $scope.partner.address.street = '';
        $scope.partner.address.detail = '';
        $scope.streets = [];
    };
    $scope.regionChanged = function (province, city, region) {
        return areaService.getStreets(province, city, region).success(function (resp) {
            if (!resp.errCode) {
                $scope.streets = resp.data;
                $scope.partner.address.street = '';
                $scope.partner.address.detail = '';
            } else {
                $scope.partner.address.street = '';
                $scope.partner.address.detail = '';
                $scope.streets = [];
            }
        });
    };

    // 提交
    var submit = function () {
        var successHandler = function (resp) {
            swal("操作成功", "", "success");
            $state.go('app.merchant.partner');
        };

        if ($scope.action == 'add') {
            autoaskService.addPartner($scope.partner, successHandler);
        } else if ($scope.action == 'edit') {
            autoaskService.updatePartner($scope.partner, successHandler);
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
            $scope.partner.logoUrl = resp.data;
        })
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
            var partnerId = $stateParams.id;
            autoaskService.getPartner({id: partnerId}, function (resp) {
                $scope.partner = resp.data;
                var address = angular.copy(resp.data.address);
                $scope.provinceChanged(address.province);
                $scope.cityChanged(address.province, address.city);
                $scope.loadingPromise = $scope.regionChanged(address.province, address.city, address.region).success(function () {
                        $scope.partner.address = address;
                    }
                );

                if ($scope.action == 'info') {
                    $('input').attr('readOnly', true).attr('placeholder', '');
                    $('select').attr('disabled', true);
                }
            });
        }
    };

    $scope.init();

});
