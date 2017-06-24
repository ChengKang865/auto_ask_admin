app.controller('exploreDetailCtrl', ['$scope', 'autoaskService', 'ueditorService', '$location', '$stateParams', function ($scope, autoaskService, ueditorService, $location, $stateParams) {
    $scope.init = function () {
        $scope.data = {};

        // ueditor配置初始化
        $scope._simpleConfig = ueditorService.getConfig();
        ueditorService.ueditorInit();

        $scope.picUrlList = [];
        $scope.infoUrlList = [];

    };

    // 获取活动信息
    $scope.loadingPromise = autoaskService.getRichTextDetail({
        id: $stateParams.id
    }, function (resp) {
        $scope.data = resp.data;
        $scope.picUrlList.push($scope.data.picUrl);
        $scope.infoUrlList.push($scope.data.picUrl);
    });


    $scope.init();
}]);