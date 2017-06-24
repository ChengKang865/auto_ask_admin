app.controller("cardListCtrl", ["$scope", "autoaskService", "ngTableParams", '$q', function ($scope, autoaskService, ngTableParams, $q) {
    $scope.init = function () {
        //查询条件
        $scope.criteria = {};

        //表单数据列表
        $scope.cardTypeList = [];

        // 初始化产品种类与产品
        $scope.loadingPromise = autoaskService.getProductCategoryList({page: 1, count: 100000}, function (resp) {
            $scope.productCategories = resp.data.result;
        });
    };

    // 产品类别变化
    $scope.productCategoryChanged = function () {
        $scope.products = null;
        $scope.criteria.productId = '';
        $scope.goods = null;
        $scope.criteria.goodsId = '';
        if ($scope.criteria.productCategoryId == '') {
            return;
        }
        $scope.loadingPromise = autoaskService.getProductList({
            page: 1,
            count: 100000,
            productCategoryId: $scope.criteria.productCategoryId
        }, function (resp) {
            $scope.criteria.productId = '';
            $scope.products = resp.data.result;
        })
    };

    // 产品变化
    $scope.changeProduct = function () {
        $scope.goodsList = null;
        $scope.criteria.goodsId = '';
        if ($scope.criteria.productId == '') {
            return;
        }
        $scope.loadingPromise = autoaskService.getGoodsList({
            page: 1,
            count: 100000,
            productId: $scope.criteria.productId
        }, function (resp) {
            $scope.goodsList = resp.data.result;
        });
    };

    $scope.activeCardType = function (cardTypeId) {
        $scope.loadingPromise = autoaskService.activeCardType({cardTypeId: cardTypeId}, function (resp) {
            swal("激活成功", "", "success");
            $scope.tableParams.reload();
        });
    };

    $scope.deleteCardType = function (cardTypeId) {
        $scope.loadingPromise = autoaskService.deleteCardType({cardTypeId: cardTypeId}, function (resp) {
            swal("作废成功", "", "success");
            $scope.tableParams.reload();
        });
    };

    // 加载列表
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 50
    }, {
        total: 0,
        getData: function ($defer, params) {
            $scope.criteria.page = params.page();
            $scope.criteria.count = params.count();
            $scope.criteria;
            $scope.loadingPromise = autoaskService.getCardList($scope.criteria, function (resp) {
                $scope.cardTypeList = resp.data.result;
                params.total(resp.data.total);
                $defer.resolve([$scope.cardTypeList]);
            });
        }
    });

    // 查询
    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    $scope.exportCardIdsCSV = function (cardTypeId) {
        var deferred = $q.defer();
        $scope.loadingPromise = autoaskService.exportCardIds({cardTypeId: cardTypeId}, function (resp) {
            if (resp.data != undefined && resp.data != null) {
                var csv_arr = [];
                for (var index in resp.data) {
                    csv_arr[index] = [parseInt(index) + 1, resp.data[index]];
                }
                deferred.resolve(csv_arr);
            } else {
                deferred.resolve([]);
            }
        });
        return deferred.promise;
    };

    $scope.activeList = function () {

    };

    $scope.init();
}]);