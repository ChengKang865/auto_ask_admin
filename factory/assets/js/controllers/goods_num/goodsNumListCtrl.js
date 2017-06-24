app.controller("goodsNumListCtrl", ["$scope", "ngTableParams", "autoaskService", function ($scope, ngTableParams, autoaskService) {

    $scope.init = function () {
        //查询条件
        $scope.criteria = {};
        //表单数据列表
        $scope.dataList = [];

        //获取所有的产品种类
        $scope.loadingPromise = autoaskService.getProductCategoryList({page: 1, count: 100000}, function (resp) {
            $scope.productCategoryList = resp.data.result;
        });
    };

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

    // 列表初始化
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 25
    }, {
        total: 0,
        getData: function ($defer, params) {
            $scope.criteria.page = params.page();
            $scope.criteria.count = params.count();
            $scope.loadingPromise = autoaskService.getGoodsNumList($scope.criteria, function (resp) {
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

    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    $scope.init();
}]);