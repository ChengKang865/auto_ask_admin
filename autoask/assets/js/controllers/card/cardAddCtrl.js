app.controller("cardAddCtrl", ["$scope", "autoaskService", "ngTableParams", "$location", 'commonService', function ($scope, autoaskService, ngTableParams, $location, commonService) {
    $scope.init = function () {
        //查询条件
        $scope.criteria = {};
        $scope.data = {};
        //表单数据
        $scope.data.goodsCardTypeList = [];

        // 初始化产品种类与产品
        $scope.loadingPromise = autoaskService.getProductCategoryList({page: 1, count: 100000}, function (resp) {
            $scope.productCategoryList = resp.data.result;
        });
    };

    // 产品类别变化
    $scope.productCategoryChanged = function () {
        $scope.product = '';
        $scope.productList = null;
        if ($scope.productCategory == '') {
            return;
        }
        var productCategory = commonService.str2obj($scope.productCategory);
        $scope.loadingPromise = autoaskService.getProductList({
            productCategoryId: productCategory.productCategoryId
        }, function (resp) {
            $scope.productList = resp.data.result;
        })
    };

    // 产品变化
    $scope.productChanged = function () {
        $scope.goods = '';
        $scope.goodsList = null;
        if ($scope.product == '') {
            return '';
        }
        var product = commonService.str2obj($scope.product);
        $scope.loadingPromise = autoaskService.getGoodsList({
                page: 1,
                count: 100000,
                productId: product.productId
            },
            function (resp) {
                $scope.goodsList = resp.data.result;
            }
        );
    };

    // 添加商品
    $scope.addGoods = function () {
        if ($scope.goods === undefined || $scope.goods === null || $scope.goods === '') {
            swal('请选择商品', '', 'error');
            return;
        }
        $scope.productCategory = commonService.str2obj($scope.productCategory);
        $scope.product = commonService.str2obj($scope.product);
        $scope.goods = commonService.str2obj($scope.goods);

        //判断商品是否重复添加
        for (var index = 0; index < $scope.data.goodsCardTypeList.length; index++) {
            if ($scope.data.goodsCardTypeList[index].goodsId === $scope.goods.goodsId) {
                swal('商品已经存在', '', 'error');
                return;
            }
        }

        $scope.data.goodsCardTypeList.push({
            goodsId: $scope.goods.goodsId,
            productCategoryName: $scope.productCategory.name,
            productName: $scope.product.name,
            goodsName: $scope.goods.name
        })

        //添加后，清空产品类别、产品、商品信息
        $scope.productCategory = '';
        $scope.product = '';
        $scope.products = null;
        $scope.goods = '';
        $scope.goodsList = null;
    };

    //删除商品
    $scope.removeGoods = function (index) {
        $scope.data.goodsCardTypeList.splice(index, 1);
    };

    $scope.save = function () {
        $scope.loadingPromise = autoaskService.addCard($scope.data, function (resp) {
            swal("操作成功", "", "success");
            $location.path('app/card/list');
        });
    };

    $scope.init();
}]);