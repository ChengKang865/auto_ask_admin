app.controller("operationHistoryListCtrl", ["$scope", "autoaskService", "ngTableParams", function ($scope, autoaskService, ngTableParams) {
    $scope.init = function () {
        //查询条件
        $scope.criteria = {};
        $scope.data = {};
        //表单数据
    };

    $scope.init();
}]);