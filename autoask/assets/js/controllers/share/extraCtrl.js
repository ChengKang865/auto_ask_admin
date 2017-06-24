'use strict';

/**
 * 提取列表详情页
 */
app.controller('extraListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams) {





    // 加载商户类型所对应的商户
    $scope.merchantTypeChanged = function () {
        switch ($scope.criteria.merchantType) {
            case 'factory': $scope.merchants = $scope.factories; break;
            default: [];
        }
    };



    $scope.init = function () {
        $scope.criteria = {
            merchantType: "",
            merchantId: "",
            page: 1,
            count: 10
        };

        // 加载工厂列表
        autoaskService.getFactoryList({page: 1, count: 10000}, function (resp) {
            $scope.factories = resp.data.result;
        });

        // 加载列表
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
            total: 0,
            getData: function ($defer, params) {
                $scope.criteria.page = params.page();
                $scope.criteria.count = params.count();
                prepareParams($scope.criteria);
                $scope.loadingPromise = autoaskService.getMerchantAssets($scope.criteria, function (resp) {
                    $scope.data = resp.data.result;
                    params.total(resp.data.total);
                    $defer.resolve([$scope.data]);
                });
            }
        });
    };

    // 准备参数
    function prepareParams(params) {
        $scope.criteria.serveTypes = $scope.criteria.serveType;
        $scope.criteria.merchantId = $scope.criteria.merchantId;
        console.log($scope.criteria);

    }

    // 查询
    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    $scope.init();
});
