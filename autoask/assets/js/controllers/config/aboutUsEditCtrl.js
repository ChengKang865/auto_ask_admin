app.controller('aboutUsEditCtrl', ['$scope', 'autoaskService', 'ueditorService', '$location', '$stateParams',
    function ($scope, autoaskService, ueditorService, $location, $stateParams) {
        $scope.init = function () {
            // ueditor配置初始化
            $scope._simpleConfig = ueditorService.getConfig();
            ueditorService.ueditorInit();

            $scope.data = {};

            /*ueditor内容双向绑定*/
            $scope.data.content = '';

            if ($stateParams.mode === 'modify') {
                $scope.loadingPromise = autoaskService.getRichTextDetail({
                    id: $stateParams.id
                }, function (resp) {
                    $scope.data = resp.data;
                });
            }
        };

        $scope.saveActivity = function () {
            var apiService;

            if ($stateParams.mode === 'modify') {
                apiService = autoaskService.modifyAboutUs;
            } else if($stateParams.mode === 'add') {
                apiService = autoaskService.addAboutUs;
            }

            $scope.loadingPromise = apiService($scope.data, function (resp) {
                swal("操作成功", "", "success");
                history.back();
            });
        };

        $scope.init();
    }]);