app.controller("cardItemListCtrl", ["$scope", "autoaskService", "ngTableParams", '$q', '$stateParams', function ($scope, autoaskService, ngTableParams, $q, $stateParams) {
    $scope.init = function () {
        //查询条件
        $scope.criteria = {
            page: 1,
            count: 50,
            cardTypeId: $stateParams.cardTypeId
        };

        //表单数据列表
        $scope.cardList = [];
    };

    // 加载列表
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 50
    }, {
        total: 0,
        getData: function ($defer, params) {
            $scope.criteria.page = params.page();
            $scope.criteria.count = params.count();
            $scope.loadingPromise = autoaskService.getCardItemList($scope.criteria, function (resp) {
                $scope.cardList = resp.data.result;
                params.total(resp.data.total);
                $defer.resolve([$scope.cardList]);
            });
        }
    });

    $scope.activeCardItem = function (cardId) {
        $scope.loadingPromise = autoaskService.activeCardItem({cardId: cardId}, function () {
            swal("激活成功", "", "success");
            $scope.tableParams.reload();
        });
    };

    $scope.batchActive = function () {
        $scope.startNum = $scope.startNum || '';
        if ($scope.startNum === '') {
            swal('起始值请输入合法数字', '', 'error');
            return;
        }
        $scope.endNum = $scope.endNum || '';
        if ($scope.endNum === '') {
            swal('起始值请输入合法数字', '', 'error');
            return;
        }
        $scope.startNum = parseInt($scope.startNum);
        $scope.endNum = parseInt($scope.endNum);
        if ($scope.startNum === NaN || $scope.endNum === NaN) {
            swal('数字非法', '', 'error');
            retrun;
        }
        if ($scope.startNum <= 0) {
            swal('起始值需大于0', '', 'error');
            return;
        }
        var params = {
            start: $scope.startNum,
            end: $scope.endNum,
            cardTypeId: $scope.criteria.cardTypeId
        };
        $scope.loadingPromise = autoaskService.activeCadItemList(params, function () {
            swal("批量激活成功", "", "success");
            $scope.tableParams.reload();
        });
    };

    // 查询
    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    $scope.init();
}]);