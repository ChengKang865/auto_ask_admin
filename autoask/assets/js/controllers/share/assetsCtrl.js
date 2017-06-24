'use strict';

/**
 * 商户资产列表
 */
app.controller('assetsListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams) {
    $scope.init = function () {
        $scope.criteria = {
            page: 1,
            count: 25
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
            $scope.loadingPromise = autoaskService.getMerchantAssets($scope.criteria, function (resp) {
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

    $scope.init();
});