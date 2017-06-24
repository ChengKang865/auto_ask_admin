'use strict';

/**
 * 列表页面控制器
 */
app.controller('shareListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams) {
    $scope.init = function () {

        $scope.startTime = moment().format("YYYY-MM-DD");
        $scope.endTime = moment().subtract(-1, 'days').format("YYYY-MM-DD");
        $scope.outletsId = '';
        $scope.serviceProviderId = '';
        $scope.mechanicId = '';
        $scope.criteria = {
            startTime: $scope.startTime,
            endTime: $scope.endTime,
            page: 1,
            count: 10,
            outletsId:$scope.outletsId,
            serviceProviderId:$scope.serviceProviderId,
            mechanicId:$scope.mechanicId
        };
        // 加载工厂列表
        autoaskService.getFactoryList({page: 1, count: 10000}, function (resp) {
            $scope.factoryList = resp.data.result;
        });

        // 加载列表
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
            total: 0,
            getData: function ($defer, params) {
                $scope.criteria.page = params.page();
                $scope.criteria.count = params.count();
                $scope.loadingPromise = autoaskService.getShareList($scope.criteria, function (resp) {
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
    };
        $scope.criteria = {
            page: 1,
            count: 10000
        };
        //维修工列表
        //$scope.criteria.mechanicId = '';
        $scope.mechanicList = null;
        if ($scope.criteria.serviceProviderId === '') {
            return;
        }
        $scope.loadingPromise = autoaskService.getMechanicList({
            page: 1,
            count: 10000,
            serviceProviderId: $scope.criteria.serviceProviderId
        }, function (resp) {
            $scope.mechanicList = resp.data.result;
        });
        //服务店下拉列表
        $scope.serviceProviderList = [];
        autoaskService.getServiceProviderList({
            page: 1,
            count: 10000
        }, function (resp) {
            $scope.serviceProviderList = resp.data.result;
        });


    // 查询
    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    $scope.init();
});



