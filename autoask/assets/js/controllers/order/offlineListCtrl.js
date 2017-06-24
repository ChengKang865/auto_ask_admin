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

        $scope.merchantType = '';

        //弹窗默认是关闭状态
        $scope.displayPromote = false;
        $scope.updateExpressFlag = false;

        // 初始化产品种类与产品
        $scope.loadingPromise = autoaskService.getProductCategoryList({page: 1, count: 100000}, function (resp) {
            $scope.productCategoryList = resp.data.result;
        });
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

    //退款
    $scope.refundOrder = function (orderId) {
        $scope.loadingPromise = autoaskService.refundOrder({orderId: orderId}, function () {
            swal("退款成功", "", "success");
            $scope.tableParams.reload();
        });
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

    $scope.refuseAppoint = function (orderId) {
        $scope.loadingPromise = autoaskService.refuseAppoint({orderId: orderId}, function () {
            swal("取消服务成功", "", "success");
            $scope.tableParams.reload();
        });
    };

    $scope.showUpdateExpress = function (orderId, index) {
        $scope.orderId = orderId;
        $scope.updateExpressCompany = $scope.data[index].orderDelivery.expressCompany;
        $scope.updateExpressSerial = $scope.data[index].orderDelivery.deliverySerial;
        $scope.updateExpressFlag = true;
    };

    $scope.updateExpress = function (orderId, expressCompany, expressSerial) {
        orderId = orderId || '';
        if (orderId === '') {
            swal('订单号不能为空', '', 'error');
            return;
        }
        expressCompany = expressCompany || '';
        if (expressCompany === '') {
            swal('快递公司不能为空', '', 'error');
            return;
        }
        expressSerial = expressSerial || '';
        if (expressSerial === '') {
            swal('快递单号不能为空', '', 'error');
            return;
        }

        $scope.loadingPromise = autoaskService.updateOrderExpress({
            orderId: orderId,
            expressCompany: expressCompany,
            expressSerial: expressSerial
        }, function () {
            $scope.hideUpdateExpress();
            swal("更改快递单号成功", "", "success");
            $scope.tableParams.reload();
        });
    };

    $scope.hideUpdateExpress = function () {
        $scope.orderId = '';
        $scope.updateExpressCompany = '';
        $scope.updateExpressSerial = '';
        $scope.updateExpressFlag = false;
    };

    $scope.init();
});

