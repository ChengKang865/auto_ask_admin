'use strict';

/**
 * 申请管理
 */
app.controller('applyListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams, loginType, $state, $sessionStorage) {
    $scope.init = function () {
        $scope.startTime = moment().subtract(10, 'days').format("YYYY-MM-DD");
        $scope.endTime = moment().subtract(-1, 'days').format("YYYY-MM-DD");
        $scope.criteria = {
            startTime: $scope.startTime,
            endTime: $scope.endTime,
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
                prepareParams($scope.criteria);
                $scope.loadingPromise = autoaskService.getApplyList($scope.criteria, function (resp) {
                    $scope.data = resp.data.result;
                    console.log($scope.data);
                    params.total(resp.data.total);
                    $defer.resolve([$scope.data]);
                });
            }
        });
    };

    // 准备参数
    function prepareParams(params) {
        $scope.criteria.startTime = $scope.startTime;
        $scope.criteria.endTime = $scope.endTime;
    }

    // 查询
    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    // 更新确定的申请数组
    $scope.toggleSelection = function (applyId) {
        var idx = $scope.applyIds.indexOf(applyId);

        // is currently selected
        if (idx > -1) {
            $scope.applyIds.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.applyIds.push(applyId);
        }
        console.log($scope.applyIds);
    };

    $scope.confirmApplies = function (data) {
        $scope.loadingPromise = autoaskService.confirmApplies({applyIds: $scope.applyIds}, function (resp) {
            $sessionStorage.sHtmlText = resp.data;
        });
        $state.go('app.share.applyHTML');
    };

    $scope.init();
});