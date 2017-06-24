app.controller('exploreAddCtrl', ['$scope', 'autoaskService', 'ueditorService', '$location', 'commonService', function ($scope, autoaskService, ueditorService, $location, commonService) {
    $scope.init = function () {
        $scope.data = {};

        // ueditor配置初始化
        $scope._simpleConfig = ueditorService.getConfig();
        ueditorService.ueditorInit();

        /*ueditor内容双向绑定*/
        $scope.data.content = '';
    };

    $scope.saveActivity = function () {
        var params;
        
        if ($scope.picUrlList.length > 0) {
            params = angular.extend({}, $scope.data, {
                picUrl: $scope.picUrlList[0]
            });
            autoaskService.addExplore(params, function (resp) {
                swal("操作成功", "", "success");
                $location.path('/app/config/explore/list');
            });
        } else {
            swal('添加探索失败', '请上传图片', 'error');
        }
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

    $scope.init();
}]);