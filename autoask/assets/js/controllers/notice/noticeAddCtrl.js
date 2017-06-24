app.controller("noticeAddCtrl", ["$scope", "autoaskService", "ngTableParams", "$location", "areaService", function ($scope, autoaskService, ngTableParams, $location, areaService) {
    $scope.init = function () {
        $scope.notice = {};

        // 地址控制
        $scope.address = {
            provinces: '',
            cities: '',
            regions: ''
        };
        $scope.provinces = [];
        $scope.cities = [];
        $scope.regions = [];

        //加载省份列表
        $scope.loadingPromise = areaService.loadRegion().then(function () {
            $scope.provinces = areaService.getProvinces();
        });
    };


    $scope.provinceChanged = function (province) {
        return autoaskService.getCities(province, function (cities) {
            $scope.cities = cities;
            $scope.regions = [];
            $scope.streets = [];
            $scope.address.city = '';
            $scope.address.region = '';
        })
    };
    $scope.cityChanged = function (province, city) {
        return autoaskService.getRegions(province, city, function (regions) {
            $scope.regions = regions;
            $scope.streets = [];
            $scope.address.region = '';
        })
    };

    var submit = function () {
        $scope.loadingPromise = autoaskService.insertNotice($scope.notice, function () {
            swal('发布公告成功', '', 'success');
            $location.path('app/notice/list');
        })
    };

    // 表单
    $scope.form = {
        submit: function (form) {
            var firstError = null;
            if (form.$invalid) {
                var field = null, firstError = null;
                for (field in form) {
                    if (field[0] != '$') {
                        if (firstError === null && !form[field].$valid) {
                            firstError = form[field].$name;
                        }

                        if (form[field].$pristine) {
                            form[field].$dirty = true;
                        }
                    }
                }
                angular.element('.ng-invalid[name=' + firstError + ']').focus();
                swal("表单中存在错误", "红色标注了错误!", "error");
                return;

            } else {
                submit();
            }
        }
    };

    $scope.init();
}]);