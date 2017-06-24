app.controller("userInfoListCtrl", ["$scope", "autoaskService", "ngTableParams", function ($scope, autoaskService, ngTableParams) {
    $scope.init = function () {
        //查询条件
        $scope.criteria = {
            page: 1,
            count: 10
        };
        $scope.data = [];
        $scope.imgView = false;
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
            $scope.loadingPromise = autoaskService.getWeiXinUserInfoList($scope.criteria, function (resp) {
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

    //查看图片
    $scope.seeImage = function (imgUrl){
        $scope.seeImgUrl = imgUrl;
        $scope.imgView = true;
    };
    $scope.hideImgView = function () {
        $scope.imgView = false;
    };
    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };
    $scope.init();
}]);