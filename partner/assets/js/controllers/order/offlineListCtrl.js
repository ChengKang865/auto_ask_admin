'use strict';

/**
 * 线下预约订单列表页面控制器
 */
app.controller('offlineListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams) {
    // 初始化方法
    $scope.init = function () {
        //查询条件初始化
        $scope.criteria = {
            page: 1,
            count: 10
        };
        // 初始化产品种类与产品
        $scope.loadingPromise = autoaskService.getProductCategoryList({page: 1, count: 100000}, function (resp) {
            $scope.productCategoryList = resp.data.result;
        });
        // 加载服务店列表
        $scope.loadingPromise = autoaskService.getServiceProviderList({
            page: 1,
            count: 10000,
            partnerId: $scope.partnerId
        }, function (resp) {
            $scope.serviceProviders = resp.data.result;
        })
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
            $scope.loadingPromise = autoaskService.getOffLineList($scope.criteria, function (resp) {
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

    // 产品类别变化
    $scope.productCategoryChanged = function () {
        $scope.criteria.productId = '';
        $scope.productList = null;
        $scope.criteria.goodsId = '';
        $scope.goodsList = null;
        if ($scope.criteria.productCategoryId == '') {
            return;
        }
        $scope.loadingPromise = autoaskService.getProductList({
            productCategoryId: $scope.criteria.productCategoryId
        }, function (resp) {
            $scope.productList = resp.data.result;
        });
    };

    // 产品变化
    $scope.productChanged = function () {
        $scope.criteria.goodsId = '';
        $scope.goodsList = null;
        if ($scope.criteria.productId == '') {
            return '';
        }
        $scope.loadingPromise = autoaskService.getGoodsList({
                page: 1,
                count: 100000,
                productId: $scope.criteria.productId
            },
            function (resp) {
                $scope.goodsList = resp.data.result;
            }
        );
    };

    // 查询
    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    $scope.pendingOfflineOrder = function (orderId) {
        $scope.loadingPromise = autoaskService.pendingOffline({orderId: orderId}, function () {
            swal('提交无货信息成功', '', 'success');
            $scope.tableParams.reload();
        });
    };

    $scope.init();
});

