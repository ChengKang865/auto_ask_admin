'use strict';
/**
 * controller face page.
 */
app.controller('faceCtrl', function ($scope, autoaskService, $state, $location, ngTableParams) {

    $scope.init = function () {
        $scope.displayPromote = false;
        $scope.newOrderNum = 0;
        $scope.criteria = {
            page: 1,
            count: 25
        };
        $scope.info = {};
        $scope.loadingPromise = autoaskService.getServiceProviderStatistics(null, function (resp) {
            $scope.info = resp.data;
        });

    };

    $scope.showPromote = function () {
        $scope.displayPromote = true;
    };

    $scope.hidePromote = function () {
        $scope.displayPromote = false;
    };

    $scope.validateCode = function (code) {
        if (code === undefined || code === null || code === '') {
            swal("请输入合法的验证码", "", "error");
        }
        $scope.loadingPromise = autoaskService.validateAppoint({code: code}, function (resp) {
            var orderId = resp.data;
            $scope.hidePromote();
            $location.path('app/order/detail/' + orderId);
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
            $scope.loadingPromise = autoaskService.getServiceProviderNewOrderList($scope.criteria, function (resp) {
                if (resp.data === undefined || resp.data === null) {
                    resp.data = {};
                    resp.data.total = 0;
                    resp.data.result = [];
                }
                $scope.data = resp.data.result === null ? [] : resp.data.result;
                $scope.newOrderNum = resp.data.total;
                params.total(resp.data.total);
                $defer.resolve([$scope.data]);
            });
        }
    });

    $scope.init();
});
