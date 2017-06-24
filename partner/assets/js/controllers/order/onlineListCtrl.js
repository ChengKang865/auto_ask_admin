'use strict';

/**
 * 线下预约订单列表页面控制器
 */
app.controller('onlineListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams) {
    // 初始化方法
    $scope.init = function () {
        //查询条件初始化
        $scope.criteria = {
            page: 1,
            count: 10
        };
        //弹窗默认是关闭状态
        $scope.displayPromote = false;
        $scope.confirmationDeliveryData = {};
        // 初始化产品种类与产品
        $scope.loadingPromise = autoaskService.getProductCategoryList({page: 1, count: 100000}, function (resp) {
            $scope.productCategoryList = resp.data.result;
        });
    };

    // 加载列表
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10
    }, {
        total: 0,
        getData: function ($defer, params) {
            $scope.criteria.page = params.page();
            $scope.criteria.count = params.count();
            $scope.loadingPromise = autoaskService.getOnLineList($scope.criteria, function (resp) {
                $scope.data = resp.data.result;
                if ($scope.data != null) {
                    $scope.data = $scope.data;
                } else {
                    $scope.data = [];
                }
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


    // 点击发货物流信息弹窗
    $scope.displayDelivery = function (orderId) {
        $scope.confirmationDeliveryData = {
            orderId: orderId
        };
        $scope.displayPromote = true;
    };

    //隐藏窗口
    $scope.hidePromote = function () {
        $scope.displayPromote = false;
        $scope.expressCompany = null;
        $scope.deliverySerial = null;
        $scope.orderId = null;
    };

    //展示窗口
    $scope.showPromote = function (orderId) {
        $scope.orderId = orderId;
        $scope.displayPromote = true;
    };

    //提交快递公司/快递单号
    $scope.confirmOnline = function () {
        if ($scope.expressCompany === undefined || $scope.expressCompany === null || $scope.expressCompany === '') {
            swal("快递公司不能为空", "", "error");
            return;
        }
        if ($scope.deliverySerial === undefined || $scope.deliverySerial === null || $scope.deliverySerial === '') {
            swal("快递单号不能为空", "", "error");
            return;
        }
        if ($scope.orderId === undefined || $scope.orderId === null || $scope.orderId === '') {
            swal("订单号不能为空 ", "", "error");
            return;
        }
        $scope.loadingPromise = autoaskService.confirmOnline({
            orderId: $scope.orderId,
            expressCompany: $scope.expressCompany,
            deliverySerial: $scope.deliverySerial
        }, function () {
            swal("确认发货成功", "", "success");
            $scope.tableParams.reload();
        });

        $scope.hidePromote();
    };

    $scope.pendingOnline = function (orderId) {
        $scope.loadingPromise = autoaskService.pendingOnline({orderId: orderId}, function (resp) {
            swal('发送无货信息成功', '', 'success');
            $scope.tableParams.reload();
        });
    };

    $scope.init();
});

