app.controller("expressTemplateListCtrl", ["$scope", "autoaskService", "ngTableParams", function ($scope, autoaskService, ngTableParams) {
    $scope.init = function () {
        //查询条件
        $scope.criteria = {
            page: 1,
            count: 25
        };
        $scope.data = [];
        //删除
        $scope.delete = function (id) {
            $scope.loadingPromise = autoaskService.deleteExpressTemplate({id: id}, function () {
                swal('删除成功', '', 'success');
                $scope.tableParams.reload();
            });
        };
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
            $scope.loadingPromise = autoaskService.getExpressTemplateList($scope.criteria, function (resp) {
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

    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    $scope.init();

    //没有分页参数的快递类型list
    autoaskService.notPageList(null, function (resp) {
        $scope.notPageExpressTypeList = resp.data.result;
    });
}]);