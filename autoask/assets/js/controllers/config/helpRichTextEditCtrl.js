app.controller('helpRichTextEditCtrl', ['$scope', 'autoaskService', 'ueditorService', '$location', '$stateParams',
    function ($scope, autoaskService, ueditorService, $location, $stateParams) {
        $scope.init = function () {
            // ueditor配置初始化
            $scope._simpleConfig = ueditorService.getConfig();
            ueditorService.ueditorInit();

            $scope.data = {};

            $scope.action = $stateParams.mode;

            $scope.helpType = $stateParams.type;

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
                if ($stateParams.type === 'HOW_SELECT') {
                    apiService = autoaskService.modifyHowSelect;
                } else if ($stateParams.type === 'HOW_BUY') {
                    apiService = autoaskService.modifyHowBuy();
                } else if ($stateParams.type === 'HOW_PAY') {
                    apiService = autoaskService.modifyHowPay;
                }
            } else if ($stateParams.mode === 'add') {
                if ($stateParams.type === 'HOW_SELECT') {
                    apiService = autoaskService.addHowSelect;
                } else if ($stateParams.type === 'HOW_BUY') {
                    apiService = autoaskService.addHowBuy
                } else if ($stateParams.type === 'HOW_PAY') {
                    apiService = autoaskService.addHowPay;
                }
            }


            $scope.loadingPromise = apiService($scope.data, function (resp) {
                swal("操作成功", "", "success");
                history.back();
            });
        };

        $scope.init();
    }]);