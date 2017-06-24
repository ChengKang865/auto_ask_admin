'use strict';


/**
 * 商品列表
 */
app.controller('goodsCtrl', function ($scope, autoaskService, $timeout, ngTableParams, $state) {
    $scope.total = 0;
    $scope.loadingPromise = null;
    $scope.productId = null;
    $scope.products = [];
    $scope.productCategoryId = null;
    $scope.productCategories = [];

    // 初始化产品种类与产品
    $scope.loadingPromise = autoaskService.getProductCategoryList({page: 1, count: 100000}, function (resp) {
        $scope.productCategories = resp.data.result;
    });

    // 加载列表
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 25
    }, {
        total: 0,
        getData: function ($defer, params) {
            $scope.loadingPromise = autoaskService.getGoodsList({
                page: params.page(), count: params.count(),
                productId: $scope.productId
            }, function (resp) {
                $scope.data = resp.data.result;
                params.total(resp.data.total);
                $defer.resolve([$scope.data]);
            });
        }
    });

    // 产品类别变化
    $scope.productCategoryChanged = function () {
        $scope.productId = '';
        $scope.products = null;
        if ($scope.productCategoryId === undefined || $scope.productCategoryId === null || $scope.productCategoryId === '') {
            return;
        }
        $scope.loadingPromise = autoaskService.getProductList({productCategoryId: $scope.productCategoryId}, function (resp) {
            $scope.products = resp.data.result;
        })
    };

    // 查询
    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    // 查看
    $scope.info = function (pid) {
        $state.go('app.product.goodsDetail', {action: 'info', id: pid, status: 'checked'});
    };

    $scope.infoToCheck = function (pid) {
        $state.go('app.product.goodsDetail', {action: 'info', id: pid, status: 'to_check'});
    };

    // 修改
    $scope.edit = function (pid) {
        $state.go('app.product.goodsDetail', {action: 'edit', id: pid, status: 'checked'});
    };

    // 添加
    $scope.add = function () {
        $state.go('app.product.goodsDetail', {action: 'add'});
    };

    // 删除
    $scope.delete = function (pid) {
        autoaskService.deleteGoods({goodsId: pid}, function (resp) {
            swal("操作成功", "", "success");
            $scope.tableParams.reload();
        })
    };

    // 上线
    $scope.online = function (pid) {
        autoaskService.onlineGoods({goodsId: pid}, function (resp) {
            swal("操作成功", "", "success");
            $scope.tableParams.reload();
        })
    };

    // 下线
    $scope.offline = function (pid) {
        autoaskService.offlineGoods({goodsId: pid}, function (resp) {
            swal("操作成功", "", "success");
            $scope.tableParams.reload();
        })
    };

});


/**
 * 商品详情
 */
app.controller('goodsDetailCtrl', function ($scope, autoaskService, $timeout, commonService, $stateParams, $state) {
    // 判断类型: edit, add, info
    $scope.action = $stateParams.action;
    $scope.id = $stateParams.id;
    $scope.status = $stateParams.status;

    // 初始化goods参数
    $scope.goods = {};
    $scope.goods.goodsSnapshotInfoList = [];
    $scope.productCategoryId = null;
    $scope.products = [];
    $scope.factories = [];
    $scope.tmpMeta = "";
    $scope.picUrlList = [];
    $scope.metaList = [];
    $scope.metas = {};

    $scope.factoryFee = 0;
    $scope.agencyFee = 0;
    $scope.adFee = 0;
    $scope.serviceFee = 0;
    $scope.handleFee = 0;
    $scope.promoteFee = 0;
    $scope.personalPromoteFee = 0;

    // 初始化方法
    $scope.init = function () {
        if ($scope.action == 'info') {
            $("input").attr("disabled", true);
            $("tags-input").attr("disabled", true);
            $("select").attr('disabled', true);
        }
        alwaysInit();
        if ($scope.action == 'info' || $scope.action == 'edit') {
            autoaskService.getGoods({id: $scope.id, status: $scope.status}, function (resp) {
                $scope.goods = resp.data;
                cleanGoods();

                // 初始化meta
                if ($scope.goods.product.productMeta !== undefined) {
                    if ($scope.goods.product.productMeta.metaList != null)
                        $scope.metaList = $scope.metaList.concat($scope.goods.product.productMeta.metaList);
                    if ($scope.goods.product.productCategory.metaList != null)
                        $scope.metaList = $scope.metaList.concat($scope.goods.product.productCategory.metaList);
                    $.each($scope.goods.goodsSnapshotInfoList, function (i, ele) {
                        $scope.metas[ele.keyName] = ele.value;
                    })
                }

                // 初始化图片列表
                $scope.picUrlList = $scope.goods.goodsSnapshotMeta.picUrlList;

                $scope.productCategoryId = $scope.goods.product.productCategoryId;

                //初始化 product
                $scope.loadingPromise = autoaskService.getProductList({productCategoryId: $scope.productCategoryId}, function (resp) {
                    $scope.products = resp.data.result;
                });
            })
        }
    };

    var alwaysInit = function () {
        // 初始化对象中不可为undefined的属性
        cleanGoods();

        // 初始化产品种类与产品
        $scope.loadingPromise = autoaskService.getProductCategoryList({page: 1, count: 100000}, function (resp) {
            $scope.productCategories = resp.data.result;
            if (commonService.isUndefinedOrNull($scope.goods.product.productCategoryId)) return;
            $scope.productCategoryId = $scope.goods.product.productCategoryId;
            autoaskService.getProductList({
                productCategoryId: $scope.goods.product.productCategoryId,
                page: 1,
                count: 10000
            }, function (resp) {
                $scope.products = resp.data.result;
            })
        });

        // 初始化工厂列表
        $scope.loadingPromise = autoaskService.getFactoryList({page: 1, count: 10000}, function (resp) {
            $scope.factories = resp.data.result;
        })
    };

    // 初始化goods
    var cleanGoods = function () {
        if (commonService.isUndefinedOrNull($scope.goods)) {
            $scope.goods = {};
        }
        if (commonService.isUndefinedOrNull($scope.goods.product)) {
            $scope.goods.product = {};
        }
        if (commonService.isUndefinedOrNull($scope.goods.goodsSnapshotMeta)) {
            $scope.goods.goodsSnapshotMeta = {};
        }
        if (commonService.isUndefinedOrNull($scope.goods.goodsSnapshotInfo)) {
            $scope.goods.goodsSnapshotInfo = [];
        }
        if (commonService.isUndefinedOrNull($scope.goods.goodsSnapshotMeta.picUrlList)) {
            $scope.goods.goodsSnapshotMeta.picUrlList = []
        }
    };

    // 提交前的准备工作
    var preLoad = function () {
        var factoryId = $scope.goods.factoryId;
        if ($scope.goods.defaultShipper !== undefined && $scope.goods.defaultShipper !== null) {
            if ($scope.goods.defaultShipper == "factory") {
                if (!factoryId || typeof(factoryId) == "null") {
                    swal("添加失败", "默认发货方为代理工厂,需要指定代理工厂id号", "error");
                    return;
                }
            }
        }
        if ($scope.goods.onlinePrice === undefined || parseFloat($scope.goods.onlinePrice) === 0.0) {
            swal("添加失败", "线上价格为空", "error");
            return;
        }

        // 加载meta
        var metaList = [];
        $.each($scope.metas, function (k, v) {
            metaList.push({
                keyName: k,
                value: v
            })
        });
        $scope.goods.goodsSnapshotInfoList = metaList;

        // 加载图片列表
        $scope.goods.goodsSnapshotMeta = {
            picUrlList: $scope.picUrlList
        }
    };

    // 添加商品
    var add = function () {
        preLoad();
        autoaskService.addGoods($scope.goods, function (resp) {
            swal("操作成功", "", "success");
            $state.go("app.product.goods");
        });
    };

    // 更新商品
    var update = function () {
        preLoad();
        autoaskService.updateGoods($scope.goods, function (resp) {
            swal("操作成功", "", "success");
            $state.go("app.product.goods");
        });
    };

    // 提交表单
    var submit = function () {
        if ($scope.action == 'add') {
            add();
        } else if ($scope.action == 'edit') {
            update();
        }
    };

    // 表单
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
                swal("表单中存在错误", "红色标注了错误!", "error");
                return;

            } else {
                submit();
            }
        },
        reset: function (form) {
            $scope.myModel = angular.copy($scope.master);
            form.$setPristine(true);
        }
    };

    // 审核通过
    $scope.confirm = function (status) {
        autoaskService.confirmGoods({goodsSnapshotId: $scope.goods.goodsSnapshotId, status: status}, function (resp) {
            swal("操作成功", "", "success");
            $state.go("app.product.goods");
        })
    };

    // 产品类别变化
    $scope.productCategoryChanged = function () {
        autoaskService.getProductList({productCategoryId: $scope.productCategoryId}, function (resp) {
            $scope.goods.productId = '';
            $scope.products = resp.data.result;
        })
    };

    // 产品变化
    $scope.productChanged = function () {
        autoaskService.getProduct({id: $scope.goods.productId}, function (resp) {
            var product = resp.data;
            $scope.goods.product = product;
            autoaskService.getProductCategory({id: product.productCategoryId}, function (resp) {
                var productCategory = resp.data;
                $scope.metaList = productCategory.productCategoryMeta == null ? [] : productCategory.productCategoryMeta.metaList;
                if (product.productMeta != null) {
                    $scope.metaList = $scope.metaList.concat(product.productMeta.metaList);
                }
                $scope.metas = {};
            });
        })
    };

    // 上传图片
    $scope.uploadImage = function (element) {
        if (element.files.length === 0)
            return;
        var file = element.files[0];
        var formData = new FormData();
        formData.append('file', file);
        autoaskService.uploadFile(formData, function (resp) {
            $scope.picUrlList.push(resp.data);
        })
    };

    // 删除图片
    $scope.deleteImage = function (listType, listIndex) {
        var target_list = $scope[listType];
        target_list.splice(listIndex, 1);
    };

    $scope.init();
});