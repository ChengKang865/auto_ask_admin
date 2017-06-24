'use strict';

app.controller('usersCtrl', function ($scope, $rootScope, autoaskService, ngTableParams) {
    // 初始化
    $scope.init = function() {
        $scope.criteria = {
            phone: '',
            page: 1,
            count: 10
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
                $scope.loadingPromise = autoaskService.getUsersList($scope.criteria, function(resp) {
                    $scope.data = resp.data.result;
                    console.log($scope.data);
                    if ($scope.data != null) $scope.data = processData($scope.data);
                    else $scope.data = [];
                    params.total(resp.data.total);
                    $defer.resolve([$scope.data]);
                });
            }
        });
    };

    var processData = function (params) {
        return params;
    };

    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    $scope.init();
});
