app.controller("expressTemplateDetailCtrl", ["$scope", "autoaskService", "$stateParams", function ($scope, autoaskService, $stateParams) {
    $scope.init = function () {
        $scope.express = {};
        $scope.loadingPromise = autoaskService.getExpressTemplate({id: $stateParams.id}, function (resp) {
            $scope.express = resp.data;
        });
    };
    $('input').attr('disabled', true).attr('placeholder', '');
    $('select').attr('disabled', true).attr('placeholder', '');
    $scope.init();

    //没有分页参数的快递类型list
    autoaskService.notPageList(null, function (resp) {
        $scope.notPageExpressTypeList = resp.data.result;
    });

    //定义变量
    $scope.m = [];
    $scope.checked = [];
    $scope.checkedName = [];
    //地区(省)checkBox封装
    autoaskService.getTemplateProvinceList({id:$stateParams.id}, function (resp) {
        $scope.list = resp.data;
        //初始化添加默认选中的数据
        if (resp.data.length > 0) {
            angular.forEach(resp.data, function (i) {
                if (i.isChoice == true) {
                    i.checked = true;
                    $scope.checked.push(i.id);
                }
            })
        }

        $scope.selectAll = function () {
            if ($scope.select_all) {
                $scope.checked = [];
                angular.forEach(resp.data, function (i) {
                    i.checked = true;
                    $scope.checked.push(i.id);
                })
            } else {
                angular.forEach(resp.data, function (i) {
                    i.checked = false;
                    $scope.checked = [];
                })
            }
        };
        $scope.selectOne = function () {
            angular.forEach(resp.data, function (i) {
                var index = $scope.checked.indexOf(i.id);
                if (i.checked && index === -1) {
                    $scope.checked.push(i.id);
                } else if (!i.checked && index !== -1) {
                    $scope.checked.splice(index, 1);
                }
                ;
            })
            if (resp.data.length === $scope.checked.length) {
                $scope.select_all = true;
            } else {
                $scope.select_all = false;
            }
        }
    });
}]);