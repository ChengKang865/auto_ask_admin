app.controller('helpRichTextDetailCtrl', ['$scope', 'autoaskService', 'ueditorService', '$location', '$stateParams',
    function ($scope, autoaskService, ueditorService, $location, $stateParams) {
        $scope.init = function () {
            // ueditor配置初始化
            $scope._simpleConfig = ueditorService.getConfig();
            ueditorService.ueditorInit();

            $scope.data = {};

            /*ueditor内容双向绑定*/
            $scope.data.content = '';

            $scope.helpType = $stateParams.type;

            $scope.loadingPromise = autoaskService.getRichTextDetail({
                id: $stateParams.id
            }, function (resp) {
                $scope.data = resp.data;
            });
        };

        $scope.init();
    }]);