'use strict';

/**
 * 申请管理
 */
app.controller('applyListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams) {
    $scope.init = function () {
        $scope.criteria = {
            page: 1,
            count: 25
        };
        $scope.criteria.startTime = moment().subtract(10, 'days').format("YYYY-MM-DD");
        $scope.criteria.endTime = moment().subtract(-1, 'days').format("YYYY-MM-DD");
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
            $scope.loadingPromise = autoaskService.getApplyList($scope.criteria, function (resp) {
                $scope.data = resp.data.result;
                console.log($scope.data);
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

    $scope.init();
});