'use strict';
/**
 * controller face page.
 */
app.controller('faceCtrl', function ($scope, autoaskService, ngTableParams) {

    $scope.init = function () {
        $scope.newOrderNum = 0;
        $scope.criteria = {
            page: 1,
            count: 25
        };
        $scope.info = {};
        $scope.loadingPromise = autoaskService.getFactoryStatistics(null, function (resp) {
            $scope.info = resp.data;
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
            $scope.criteria.status = 'payed';
            $scope.loadingPromise = autoaskService.getOnLineList($scope.criteria, function (resp) {
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
