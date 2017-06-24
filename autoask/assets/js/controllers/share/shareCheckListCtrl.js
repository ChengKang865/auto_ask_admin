'use strict';

/**
 * 订单分成审核列表
 */
app.controller('shareCheckListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams) {
    // 初始化方法
    $scope.init = function () {
        //查询条件初始化
        $scope.criteria = {
            page: 1,
            count: 10
        };
    };

    // 加载列表
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 25
    }, {
        total: 0,
        getData: function ($defer, params) {
            $scope.criteria.page = params.page();
            $scope.criteria.count = params.count();
            $scope.loadingPromise = autoaskService.getShareCheckList($scope.criteria, function (resp) {
                if (resp.data === undefined || resp.data === null) {
                    resp.data = {};
                    resp.data.total = 0;
                    resp.data.result = [];
                }
                $scope.data = resp.data.result === null ? [] : resp.data.result;
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

    $scope.shareOrder = function (orderId) {
        $scope.loadingPromise = autoaskService.shareOrder({
            orderId: orderId,
            shareStatus: 'shared'
        }, function () {
            swal('审核通过', '', 'success');
            $scope.tableParams.reload();
        })
    };

    $scope.init();
});