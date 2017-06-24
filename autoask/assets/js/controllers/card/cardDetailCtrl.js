app.controller('cardDetailCtrl', ['$scope', 'autoaskService', '$location', '$stateParams', 'ngTableParams', function ($scope, autoaskService, $location, $stateParams, ngTableParams) {
    $scope.init = function () {

        $scope.criteria = {
            page:0,
            count:25,
            cardTypeId:$stateParams.id
        };

        // 获取卡券信息
        $scope.loadingPromise = autoaskService.getCardDetail({
            cardTypeId: $stateParams.id
        }, function (resp) {
            $scope.data = resp.data;

            $scope.data.actualNum = $scope.data.num - $scope.data.useNum;
        });

        //获取卡券的使用记录历史
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 25,
            cardTypeId: $stateParams.id
        }, {
            total: 0,
            getData: function ($defer, params) {
                $scope.criteria.page = params.page();
                $scope.criteria.count = params.count();
                $scope.loadingPromise = autoaskService.getCardUseList($scope.criteria, function (resp) {
                    $scope.cardUseList = resp.data.result;
                    $scope.cardUseList = $scope.cardUseList == null ? [] : $scope.cardUseList;
                    params.total(resp.data.total);
                    $defer.resolve([$scope.cardUseList]);
                });
            }
        });
    };


    $scope.init();
}]);