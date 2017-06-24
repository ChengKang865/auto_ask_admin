'use strict';

/**
 * 申请管理
 */
app.controller('applyListCtrl', function ($scope, $rootScope, autoaskService, ngTableParams, loginType, $state, $sessionStorage) {

    // 加载商户类型所对应的商户
    $scope.merchantTypeChanged = function () {
        switch ($scope.criteria.merchantType) {
            case 'factory':
                $scope.merchants = $scope.factories;
                break;
            case 'partner':
                $scope.merchants = $scope.partners;
                break;
            default:
                [];
        }
    };


    $scope.init = function () {
        $scope.applyIds = [];

        $scope.criteria = {
            page: 1,
            count: 25
        };

        // 加载工厂列表
        $scope.loadingPromise = autoaskService.getFactoryList({page: 1, count: 10000}, function (resp) {
            $scope.factories = resp.data.result;
        });

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
                    params.total(resp.data.total);
                    $defer.resolve([$scope.data]);
                });
            }
        });
    };

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
    };

    $scope.confirmApplies = function () {
        $scope.loadingPromise = autoaskService.confirmApplies({applyIds: $scope.applyIds}, function (resp) {
            $sessionStorage.sHtmlText = resp.data;
            $state.go('app.share.applyHTML');
        });
    };

    $scope.init();
});