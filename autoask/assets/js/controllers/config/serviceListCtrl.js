app.controller("serviceListCtrl", ["$scope", "autoaskService", "ngTableParams", function ($scope, autoaskService, ngTableParams) {
    $scope.init = function () {
        //查询条件
        $scope.criteria = {};

        //表单数据列表
        $scope.dataList = [];
    };

    // 加载列表
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 25
    }, {
        total: 0,
        getData: function ($defer, params) {
            $scope.loadingPromise = autoaskService.getServiceList($scope.criteria, function (resp) {
                $scope.dataList = resp.data;
                $scope.dataList = $scope.dataList == null ? [] : $scope.dataList;
                params.total(resp.data.total);
                $defer.resolve([$scope.dataList]);
            });
        }
    });

    // 删除服务富文本
    $scope.delete = function (richTextId) {
        $scope.loadingPromise = autoaskService.deleteActivityDetail({
            id: richTextId
        }, function () {
            swal("操作成功", "", "success");
            $scope.tableParams.reload();
        });
    }
}]);