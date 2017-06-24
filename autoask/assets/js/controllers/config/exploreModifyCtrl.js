app.controller('exploreModifyCtrl', ['$scope', 'autoaskService', 'ueditorService', '$location', '$stateParams', 'commonService', function ($scope, autoaskService, ueditorService, $location, $stateParams, commonService) {
    $scope.init = function () {
        $scope.data = {};

        // ueditor配置初始化
        $scope._simpleConfig = ueditorService.getConfig();
        ueditorService.ueditorInit();

        $scope.picUrlList = [];
        $scope.infoUrlList = [];

    };

    // 上传图片
    $scope.uploadImage = function (element) {
        var target_list;
        var tmpPicList = [];

        if (element.id == 'uploadFile') {
            if (commonService.isUndefinedOrNull($scope.picUrlList)) {
                $scope.picUrlList = [];
            }

            tmpPicList.push($scope.picUrlList.pop());

            target_list =  $scope.picUrlList;
        } else {
            if (commonService.isUndefinedOrNull($scope.infoUrlList)) {
                $scope.infoUrlList = [];
            }

            tmpPicList.push($scope.infoUrlList.pop());
            target_list =  $scope.infoUrlList;
        }
        if (element.files.length === 0)
            return;
        var file = element.files[0];
        var formData = new FormData();
        formData.append('file', file);
        autoaskService.uploadFile(formData, function (resp) {
            target_list.push(resp.data);
        })
    };

    // 删除图片
    $scope.deleteImage = function (listType, listIndex) {
        var target_list;
        if (listType === 'picUrlList') {
            target_list =  $scope.picUrlList;
        } else {
            target_list =  $scope.infoUrlList
        }
        target_list.splice(listIndex, 1);
    };

    // 获取活动信息
    $scope.loadingPromise = autoaskService.getRichTextDetail({
        id: $stateParams.id
    }, function (resp) {
        $scope.data = resp.data;
        $scope.picUrlList.push($scope.data.picUrl);
        $scope.infoUrlList.push($scope.data.picUrl);
    });

    $scope.saveActivity = function () {
        autoaskService.modifyActivity($scope.data, function (resp) {
            $location.path('/app/config/explore/list');
        });
    };

    $scope.init();
}]);