'use strict';

/**
 * 产品类别列表
 */
app.controller('productCtrl', ["$scope", "autoaskService", 'ngTableParams', '$state',
    function ($scope, autoaskService, ngTableParams, $state) {
        $scope.total = 0;
        $scope.loadingPromise = null;
        $scope.productCategoryId = null;
        $scope.productCategories = [];

        // 加载列表
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
            total: 0,
            getData: function ($defer, params) {
                $scope.loadingPromise = autoaskService.getProductList({
                    page: params.page(),
                    count: params.count(),
                    productCategoryId: $scope.productCategoryId
                }, function (resp) {
                    $scope.data = resp.data.result;
                    params.total(resp.data.total);
                    $defer.resolve([$scope.data]);
                });
            }
        });

        // 初始化产品种类与产品
        autoaskService.getProductCategoryList({page: 1, count: 100000}, function (resp) {
            $scope.productCategories = resp.data.result;
        });

        // 查询
        $scope.query = function () {
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
        };

        // 查看
        $scope.info = function (pid) {
            $state.go('app.product.productDetail', {action: 'info', id: pid});
        };

        // 修改
        $scope.edit = function (pid) {
            $state.go('app.product.productDetail', {action: 'edit', id: pid});
        };

        // 添加
        $scope.add = function () {
            $state.go('app.product.productDetail', {action: 'add', id: null});
        };

        // 删除
        $scope.delete = function (pid) {
            autoaskService.deleteProduct({id: pid}, function (resp) {
                swal("操作成功", "", "success");
                $scope.tableParams.reload();
            })
        };

    }]);

/**
 * 产品类别详情
 */
app.controller('productDetailCtrl', ["$scope", "autoaskService", '$state', '$stateParams', 'commonService',
    function ($scope, autoaskService, $state, $stateParams, commonService) {
        // 判断类型: edit, add, info
        $scope.action = $stateParams.action;
        $scope.id = $stateParams.id;

        // 初始化变量
        $scope.MetaAddingFlag = false;
        $scope.tmpMeta = '';
        $scope.product = {};
        $scope.metaList = [];
        $scope.picUrlList = [];
        $scope.infoUrlList = [];
        $scope.pcBuyUrlList = [];
        $scope.h5BuyUrlList = [];


        // 初始化方法
        $scope.init = function () {
            if ($scope.action == 'info' || $scope.action == 'edit') {
                $scope.loadingPromise = autoaskService.getProduct({id: $scope.id}, function (resp) {
                    $scope.product = resp.data;
                    $scope.picUrlList = $scope.product.productMeta.picUrlList;
                    $scope.infoUrlList = $scope.product.productMeta.infoUrlList;
                    $scope.pcBuyUrlList = $scope.product.productMeta.pcBuyUrlList;
                    $scope.h5BuyUrlList = $scope.product.productMeta.h5BuyUrlList;
                    $scope.metaList = $scope.product.productMeta.metaList;
                });
                if ($scope.action == 'info') {
                    $("input").attr("disabled", true);
                    $("tags-input").attr("disabled", true);
                }
            } else {
                $scope.product = {};
                $scope.productMeta = {};
            }
            initProduct();
            $scope.loadingPromise = autoaskService.getProductCategoryList({page: 1, count: 100000}, function (resp) {
                $scope.productCategories = resp.data.result;
            })
        };

        // 增加meta, 显示meta的增加input
        $scope.addingMeta = function () {
            $scope.MetaAddingFlag = true;
        };

        // 添加元素
        $scope.addMeta = function () {
            if ($scope.tmpMeta == '') {
                swal("错误", "参数名不能为空", "error");
                return;
            }
            if ($scope.metaList === undefined || $scope.metaList === null) {
                $scope.metaList = [];
            }

            $scope.metaList.push({name: $scope.tmpMeta, valueList: []});
            $scope.MetaAddingFlag = false;
        };

        // 删除商品种类 meta 元素
        $scope.removeMeta = function (index) {
            $scope.metaList.splice(index, 1);
        };

        // 初始化 $scope.product的metaList对象
        var initProduct = function () {
            if (commonService.isUndefinedOrNull($scope.product)) {
                $scope.product = {};
            }
            if (commonService.isUndefinedOrNull($scope.product.productMeta)) {
                $scope.product.productMeta = {};
            }
            if (commonService.isUndefinedOrNull($scope.product.productMeta.metaList)) {
                $scope.product.productMeta.metaList = [];
            }
            $scope.metaList = angular.copy($scope.product.productMeta.metaList);
        };

        // 上传图片
        $scope.uploadImage = function (element) {
            var target_list;
            if (element.id == 'uploadFile') {
                if (commonService.isUndefinedOrNull($scope.picUrlList)) {
                    $scope.picUrlList = [];
                }
                target_list = $scope.picUrlList;
            } else if (element.id == 'infoUploadFile') {
                if (commonService.isUndefinedOrNull($scope.infoUrlList)) {
                    $scope.infoUrlList = [];
                }
                target_list = $scope.infoUrlList;
            } else if (element.id === 'uploadPcBuy') {
                if (commonService.isUndefinedOrNull($scope.pcBuyUrlList)) {
                    $scope.pcBuyUrlList = [];
                }
                target_list = $scope.pcBuyUrlList;
            } else if (element.id === 'uploadH5Buy') {
                if (commonService.isUndefinedOrNull($scope.h5BuyUrlList)) {
                    $scope.h5BuyUrlList = [];
                }
                target_list = $scope.h5BuyUrlList;
            }
            if (element.files.length === 0)
                return;
            var file = element.files[0];
            var formData = new FormData();
            formData.append('file', file);
            $scope.loadingPromise = autoaskService.uploadFile(formData, function (resp) {
                target_list.push(resp.data);
            })
        };

        $scope.updateLogo = function (element) {
            if (element.files.length === 0)
                return;
            var file = element.files[0];
            var formData = new FormData();
            formData.append('file', file);
            $scope.loadingPromise = autoaskService.uploadFile(formData, function (resp) {
                if (commonService.isUndefinedOrNull($scope.product)) {
                    $scope.product = {};
                }
                $scope.product.logoUrl = resp.data;
            })
        };

        $scope.updateH5Pic = function (element) {
            if (element.files.length === 0)
                return;
            var file = element.files[0];
            var formData = new FormData();
            formData.append('file', file);
            $scope.loadingPromise = autoaskService.uploadFile(formData, function (resp) {
                if (commonService.isUndefinedOrNull($scope.product)) {
                    $scope.product = {};
                }
                if (commonService.isUndefinedOrNull($scope.product.productMeta)) {
                    $scope.product.productMeta = {};
                }
                $scope.product.productMeta.h5DetailPicture = resp.data;
            });
        };

        // 删除图片
        $scope.deleteImage = function (listType, listIndex) {
            var target_list = $scope[listType];
            target_list.splice(listIndex, 1);
        };

        // 添加
        var add = function () {
            preLoad();
            $scope.loadingPromise = autoaskService.addProduct($scope.product, function (resp) {
                swal("添加成功", "", "success");
                $state.go("app.product.product");
            })
        };

        // 更新
        var update = function () {
            preLoad();
            $scope.loadingPromise = autoaskService.updateProduct($scope.product, function (resp) {
                swal("更新成功", "", "success");
                $state.go("app.product.product");
            })
        };

        // 提交前装载数据
        var preLoad = function () {
            var metaList = [];
            for (var m_i in $scope.metaList) {
                var meta = $scope.metaList[m_i];
                var valueList = [];
                for (var v_i in meta.valueList) {
                    var value = meta.valueList[v_i];
                    valueList.push(value['text'])
                }
                metaList.push({
                    name: meta.name,
                    valueList: valueList
                })
            }
            initProduct();
            $scope.product.productMeta.metaList = metaList;
            $scope.product.productMeta.picUrlList = $scope.picUrlList;
            $scope.product.productMeta.infoUrlList = $scope.infoUrlList;
            $scope.product.productMeta.pcBuyUrlList = $scope.pcBuyUrlList;
            $scope.product.productMeta.h5BuyUrlList = $scope.h5BuyUrlList;
        };

        // 提交表单
        var submit = function () {
            if ($scope.action == 'add') {
                add();
            } else if ($scope.action == 'edit') {
                update();
            }
        };

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
                } else {
                    submit();
                }

            },
            reset: function (form) {

                $scope.myModel = angular.copy($scope.master);
                form.$setPristine(true);

            }
        };

        $scope.init();
    }]);
