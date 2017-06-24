'use strict';

/**
 * 列表页面控制器
 */
app.controller('mechanicListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams, $state, ACTIVE_URL) {

    $scope.activeUrl = ACTIVE_URL;

    $scope.total = 0;
    $scope.phone = '';
    $scope.loadingPromise = null;
    $scope.partnerId = '';
    $scope.serviceProviderId = '';
    $scope.serviceProviders = [];

    // 加载列表
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10
    }, {
        total: 10,
        getData: function ($defer, params) {
            $scope.loadingPromise = autoaskService.getMechanicList({
                page: params.page(),
                count: params.count(),
                phone: $scope.phone,
                serviceProviderId: $scope.serviceProviderId
            }, function (resp) {
                $scope.data = resp.data.result;
                params.total(resp.data.total);
                $defer.resolve([$scope.data]);
            });
        }
    });


    // 查询
    $scope.query = function () {
        if ($scope.serviceProviderId == '' && $scope.partnerId != '') {
            swal("请选择服务店", "", "warning");
            return;
        }
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    // 跳转增加
    $scope.add = function () {
        $state.go('app.merchant.mechanicDetail', {action: 'add'});
    };

    // 查看
    $scope.info = function (pid) {
        $state.go('app.merchant.mechanicDetail', {action: 'info', id: pid});
    };

    // 跳转修改
    $scope.edit = function (pid) {
        $state.go('app.merchant.mechanicDetail', {action: 'edit', id: pid});
    };

    // 删除
    $scope.delete = function (pid) {
        autoaskService.deleteMechanic({id: pid}, function (resp) {
            swal("操作成功", "", "success");
            $scope.tableParams.reload();
        })
    };

    $scope.displayActiveCode = function () {
        $('#qr-code-moal').modal()
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
            merchantType: 'mechanic',
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
app.controller('mechanicDetailCtrl', function ($scope, autoaskService, PAY_TYPES, $state, $stateParams) {

    // 当前动作 (add, edit, info)
    var action = $stateParams.action;
    $scope.action = action == undefined ? 'add' : action;

    $scope.mechanic = {};

    // 支付方式控制
    $scope.payTypes = PAY_TYPES;


    // 提交
    var submit = function () {
        var successHandler = function (resp) {
            swal("操作成功", "", "success");
            $state.go('app.merchant.mechanic');
        };

        if ($scope.action == 'add') {
            autoaskService.addMechanic($scope.mechanic, successHandler);
        } else if ($scope.action == 'edit') {
            autoaskService.updateMechanic($scope.mechanic, successHandler);
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

    // 初始化
    $scope.init = function () {

        // 确定操作类型
        if ($scope.action == 'add') {
            // 什么都不做
        } else {
            // 查看详情与更改都要获取信息
            var mechanicId = $stateParams.id;
            autoaskService.getMechanic({id: mechanicId}, function (resp) {
                $scope.mechanic = resp.data;
            });
        }
        if ($scope.action == 'info') {
            $('input').attr('disabled', true).attr('placeholder', '');
            $('select').attr('disabled', true);
        }
    };

    $scope.init();

});
