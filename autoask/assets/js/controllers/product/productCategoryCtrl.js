'use strict';

/**
 * 产品类别列表
 */
app.controller('productCategoryCtrl', ["$scope", "autoaskService", 'ngTableParams', '$state',
    function ($scope, autoaskService, ngTableParams, $state) {
        $scope.total = 0;
        $scope.loadingPromise = null;
        
        // 加载列表
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
            total: 0,
            getData: function ($defer, params) {
                $scope.loadingPromise = autoaskService.getProductCategoryList({page: params.page(), count: params.count()}, function (resp) {
                    $scope.data = resp.data.result;
                    params.total(resp.data.total);
                    $defer.resolve([$scope.data]);
                });
            }
        });

        // 查看
        $scope.info = function (pid) {
            $state.go('app.product.productCategoryDetail', {action: 'info', id: pid});
        };

        // 修改
        $scope.edit = function (pid) {
            $state.go('app.product.productCategoryDetail', {action: 'edit', id: pid});
        };

        // 添加
        $scope.add = function () {
            $state.go('app.product.productCategoryDetail', {action: 'add', id: null});
        };

        // 删除
        $scope.delete = function (pid) {
            autoaskService.deleteProductCategory({id: pid}, function (resp) {
                swal("操作成功", "", "success");
                $scope.tableParams.reload();
            })
        };

    }]);

/**
 * 产品类别详情
 */
app.controller('productCategoryDetailCtrl', ["$scope", "autoaskService", '$state', '$stateParams', 'commonService',
    function ($scope, autoaskService, $state, $stateParams, commonService) {
        // 判断类型: edit, add, info
        $scope.action = $stateParams.action;
        $scope.id = $stateParams.id;

        // 初始化变量
        $scope.MetaAddingFlag = false;
        $scope.tmpMeta = '';
        $scope.productCategory = {};
        $scope.metaList = [];

        // 初始化方法
        $scope.init = function () {
            if ($scope.action == 'info' || $scope.action == 'edit') {
                autoaskService.getProductCategory({id: $scope.id}, function (resp) {
                    $scope.productCategory = resp.data;
                    initProductCategory();
                });
                if ($scope.action == 'info' ) {
                    $("input").attr("disabled", true);
                    $("tags-input").attr("disabled", true);
                }
            } else {
                initProductCategory();
            }
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

            $scope.metaList.push({name: $scope.tmpMeta, valueList: []});
            $scope.MetaAddingFlag = false;
        };

        // 删除商品种类 meta 元素
        $scope.removeMeta = function (index) {
            $scope.metaList.splice(index, 1);
        };

        // 初始化 $scope.productCategory的metaList对象
        var initProductCategory = function () {
            if (commonService.isUndefinedOrNull($scope.productCategory)) {
                $scope.productCategory = {};
            }
            if (commonService.isUndefinedOrNull($scope.productCategory.productCategoryMeta)) {
                $scope.productCategory.productCategoryMeta = {};
            }
            if (commonService.isUndefinedOrNull($scope.productCategory.productCategoryMeta.metaList)) {
                $scope.productCategory.productCategoryMeta.metaList = [];
            }
            $scope.metaList = angular.copy($scope.productCategory.productCategoryMeta.metaList);
        };

        // 添加
        var add = function () {
            formatProductCategory();
            autoaskService.addProductCategory($scope.productCategory, function (resp) {
                swal("添加成功", "", "success");
                $state.go("app.product.productCategory");
            })
        };

        // 更新
        var update = function () {
            formatProductCategory();
            autoaskService.updateProductCategory($scope.productCategory, function (resp) {
                swal("更新成功", "", "success");
                $state.go("app.product.productCategory");
            })
        };

        // 格式化metaList并追加
        var formatProductCategory = function () {
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
            $scope.productCategory.productCategoryMeta.metaList = metaList;
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
