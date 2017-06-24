app.controller('activityAddCtrl', ['$scope', 'autoaskService', 'ueditorService', '$location', function ($scope, autoaskService, ueditorService, $location) {
    $scope.init = function () {
        $scope.data = {};

        // ueditor配置初始化
        $scope._simpleConfig = ueditorService.getConfig();
        ueditorService.ueditorInit();

        /*ueditor内容双向绑定*/
        $scope.data.content = '';
    };

    $scope.saveActivity = function () {
        autoaskService.addActivity($scope.data, function (resp) {
            swal("操作成功", "", "success");
            $location.path('/app/config/activity');
        });
    };

    $scope.init();
}]);