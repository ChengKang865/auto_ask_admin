'use strict';

/**
 * 列表页面控制器
 */
app.controller('shareListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams) {
    $scope.init = function () {
        $scope.startTime = moment().subtract('10', 'days').format("YYYY-MM-DD");
        $scope.endTime = moment().subtract(-1, 'days').format("YYYY-MM-DD");
        $scope.criteria = {
            startTime: $scope.startTime,
            endTime: $scope.endTime,
            page: 1,
            count: 10
        };
        // 加载维修工列表
        autoaskService.getMechanicList({page: 1, count: 10000}, function (resp) {
            $scope.mechanicList = resp.data.result;
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

    //合作商变化
    $scope.partnerChanged = function () {
        $scope.criteria.serviceProviderId = '';
        $scope.serviceProviderList = null;
        $scope.criteria.mechanicId = '';
        $scope.mechanicList = null;
        if ($scope.criteria.partnerId === '') {
            return;
        }
        $scope.loadingPromise = autoaskService.getServiceProviderList({
            page: 1,
            count: 10000,
            partnerId: $scope.criteria.partnerId
        }, function (resp) {
            $scope.serviceProviderList = resp.data.result;
        })
    };

    $scope.partnerChangeOutlets = function () {
        $scope.criteria.outletsId = '';
        $scope.outletsList = null;
        if ($scope.criteria.partnerId === '') {
            return;
        }
        $scope.loadingPromise = autoaskService.getOutletsList({
            page: 1,
            count: 10000,
            partnerId: $scope.criteria.partnerId
        }, function (resp) {
            $scope.outletsList = resp.data.result;
        })
    };


    // 查询
    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    $scope.init();
});