app.controller("goodsNumRecordListCtrl", ["$scope", "ngTableParams", "autoaskService", function ($scope, ngTableParams, autoaskService) {

    $scope.init = function () {
        //查询条件
        $scope.criteria = {};
        //表单数据列表
        $scope.dataList = [];
        //查询联动 商户列表
        $scope.merchantList = [];
        //查询商户类型
        $scope.criteria.merchantType = '';
        //获取产品种类列表
        $scope.loadingPromise = autoaskService.getProductCategoryList({page: 1, count: 100000}, function (resp) {
            $scope.productCategories = resp.data.result;
        });
        $scope.loadingPromise = autoaskService.getServiceProviderList({page: 1, count: 100000}, function (resp) {
            $scope.serviceProviderList = resp.data.result;
        });
        // 初始化时间插件
        $('#startTime').datetimepicker({
            format: 'Y-m-d H:i:s',
            step: 1
        });
        $('#endTime').datetimepicker({
            format: 'Y-m-d H:i:s',
            step: 1
        });
    };

    // 产品类别变化
    $scope.changeProductCategory = function () {
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

    // 列表初始化
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 25
    }, {
        total: 0,
        getData: function ($defer, params) {
            $scope.criteria.page = params.page();
            $scope.criteria.count = params.count();
            console.log(JSON.stringify($scope.criteria));
            $scope.loadingPromise = autoaskService.goodsNumRecordList($scope.criteria, function (resp) {
                $scope.dataList = resp.data.result;
                $scope.dataList = $scope.dataList == null ? [] : $scope.dataList;
                params.total(resp.data.total);
                $defer.resolve([$scope.dataList]);
            });
        }
    });

    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    $scope.init();
}]);

app.controller("goodsNumRecordChangeCtrl", ["$scope", "autoaskService", '$location', function ($scope, autoaskService, $location) {
    $scope.init = function () {
        //数据
        $scope.data = {};
        // //发货 退货为false
        // $scope.data.addType = true;
        //商品列表以及数量
        $scope.data.goodsInfoList = [];
        //新增的信息
        $scope.newGoodsInfo = {};
        // 初始化时间插件
        $('#recordTime').datetimepicker({
            format: 'Y-m-d H:i:s',
            step: 1
        });
        // 初始化产品种类与产品
        $scope.loadingPromise = autoaskService.getProductCategoryList({page: 1, count: 100000}, function (resp) {
            $scope.productCategories = resp.data.result;
        });

        $scope.loadingPromise = autoaskService.getServiceProviderList({page: 1, count: 100000}, function (resp) {
            $scope.serviceProviderList = resp.data.result;
        });

    };

    // 添加具体的商品
    $scope.addGoodsInfo = function (goodsInfo) {
        if (goodsInfo.goods === undefined || goodsInfo.goods === null || goodsInfo.goods === '') {
            swal('请选择商品', '', 'error');
            return;
        }
        if (isNaN(goodsInfo.num)) {
            swal('请填写正确的数量', '', 'error');
            return;
        }
        if (parseInt(goodsInfo.num) <= 0) {
            swal('商品数量必须大于0', '', 'error');
            return;
        }
        var tmpGoodsInfo = angular.copy(goodsInfo);
        tmpGoodsInfo = {
            productCategoryName: JSON.parse(tmpGoodsInfo.productCategory).name,
            productName: JSON.parse(tmpGoodsInfo.product).name,
            goodsName: JSON.parse(tmpGoodsInfo.goods).name,
            goodsId: JSON.parse(tmpGoodsInfo.goods).goodsId,
            num: tmpGoodsInfo.num
        };

        //检查是否存在已有的商品
        for (var index = 0; index < $scope.data.goodsInfoList.length; index++) {
            if ($scope.data.goodsInfoList[index].goodsId === tmpGoodsInfo.goodsId) {
                swal("该商品已经存在", "", "error");
                return;
            }
        }
        $scope.data.goodsInfoList.push(tmpGoodsInfo);
        $scope.resetNewGoodsInfo(goodsInfo);
    };

    $scope.removeGoods = function (index) {
        $scope.data.goodsInfoList.splice(index, 1);
    };

    $scope.resetNewGoodsInfo = function (goodsInfo) {
        goodsInfo.productCategory = '';
        goodsInfo.product = '';
        goodsInfo.products = null;
        goodsInfo.goods = ''
        goodsInfo.goodsList = null;
        goodsInfo.num = '';
    };

    //删除
    $scope.delGoods = function (index) {
        $scope.data.goodsInfoList.splice(index, 1);
    };

    // 产品类别变化
    $scope.productCategoryChanged = function (goodsInfo) {
        goodsInfo.productList = null;
        goodsInfo.product = '';
        goodsInfo.goodsList = null;
        goodsInfo.goods = '';
        var productCategoryId = JSON.parse(goodsInfo.productCategory).productCategoryId;
        $scope.loadingPromise = autoaskService.getProductList({productCategoryId: productCategoryId}, function (resp) {
            goodsInfo.products = resp.data.result;
        })
    };

    // 产品变化
    $scope.changeProduct = function (goodsInfo) {
        goodsInfo.goodsList = null;
        goodsInfo.goodsId = '';
        var productId = JSON.parse(goodsInfo.product).productId;
        $scope.loadingPromise = autoaskService.getGoodsList({
            page: 1,
            count: 100000,
            productId: productId
        }, function (resp) {
            goodsInfo.goodsList = resp.data.result;
        });
    };


    $scope.form = {
        submit: function (form) {
            if (form.$invalid) {
                var firstError = null;
                for (var field in form) {
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
                $scope.submit();
            }
        },
    };

    // 添加发货/退货订单 发货 退货的区别在页面上初始化 addType true 发货 addType false 退货
    $scope.submit = function () {
        //检查参数
        if ($scope.data.goodsInfoList === undefined || $scope.data.goodsInfoList === null || $scope.data.goodsInfoList.length === 0) {
            swal('商品不能为空', '', 'error');
            return;
        }
        $scope.loadingPromise = autoaskService.addGoodsNumRecord($scope.data, function () {
            swal("操作成功", "", "success");
            //判断 发货/退货
            if ($scope.data.addType) {
                $location.path('app/goodsNum/addList');
            } else {
                $location.path('app/goodsNum/subList');
            }
        });
    };

    $scope.init();
}]);

app.controller("goodsNumRecordDetailCtrl", ["$scope", "autoaskService", '$stateParams', function ($scope, autoaskService, $stateParams) {
    $scope.init = function () {
        $scope.data = {};
        $scope.loadingPromise = autoaskService.getGoodsNumRecord({
                id: $stateParams.id
            },
            function (resp) {
                $scope.data = resp.data;
            }
        );
    };
    $scope.init();
}]);