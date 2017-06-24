'use strict';

/**
 * 线下预约订单列表页面控制器
 */
app.controller('orderAppointListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams) {
    // 初始化方法
    $scope.init = function () {
        $scope.merchants = [];
        $scope.criteria = {
            merchantId: "",
            page: 1,
            count: 10
        };

        // 获取维修工列表
        $scope.promise = autoaskService.getMechanicList({
            page: 1,
            count: 100000
        }, function (resp) {
            $scope.mechanicList = resp.data.result;
        });
    };

    // 列表配置
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 25
    }, {
        total: 0,
        getData: function ($defer, params) {
            $scope.criteria.page = params.page();
            $scope.criteria.count = params.count();
            $scope.loadingPromise = autoaskService.getOffLineList($scope.criteria, function (resp) {
                if (resp.data != null) {
                    $scope.data = resp.data.result === null ? [] : resp.data.result;
                    $scope.total = resp.data.total;
                } else {
                    $scope.total = 0;
                    $scope.data = [];
                }
                params.total($scope.total);
                $defer.resolve($scope.data);
            });
        }
    });

    // 查询
    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    $scope.confirmOfflineAppoint = function (orderId) {
        $scope.loadingPromise = autoaskService.confirmAppoint({
            orderId: orderId
        }, function () {
            swal("确认成功", "", "success");
            $scope.tableParams.reload();
        });
    };

    $scope.init();
});

