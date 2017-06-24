app.controller('factoryModifyCtrl', ['$scope', 'autoaskService', '$location', 'areaService', function ($scope, autoaskService, $location, areaService) {

    $scope.factory = {};

    // 地址控制
    $scope.provinces = [];
    $scope.cities = [];
    $scope.regions = [];
    $scope.streets = [];

    $scope.provinceChanged = function (province) {
        return autoaskService.getCities(province, function (cities) {
            $scope.cities = cities;
            $scope.regions = [];
            $scope.streets = [];
            $scope.factory.address.city = '';
            $scope.factory.address.region = '';
            $scope.factory.address.street = '';
            $scope.factory.address.detail = '';
        })
    };
    $scope.cityChanged = function (province, city) {
        return autoaskService.getRegions(province, city, function (regions) {
            $scope.regions = regions;
            $scope.streets = [];
            $scope.factory.address.region = '';
            $scope.factory.address.street = '';
            $scope.factory.address.detail = '';
        })
    };
    $scope.regionChanged = function (province, city, region) {
        return autoaskService.getStreets(province, city, region, function (streets) {
            $scope.streets = streets;
            $scope.factory.address.street = '';
            $scope.factory.address.detail = '';
        })
    };


    // 提交
    var submit = function () {
        $scope.loadingPromise = autoaskService.updateFactory($scope.factory, function () {
            swal("修改信息成功", "", "success");
            $location.path("app/factoryInfo/detail");
        });
    };

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
            } else {
                submit();
            }

        },
        reset: function (form) {

            $scope.myModel = angular.copy($scope.master);
            form.$setPristine(true);

        }
    };

    // 上传图片
    $scope.uploadImage = function (element) {
        if (element.files.length === 0)
            return;
        var file = element.files[0];
        var formData = new FormData();
        formData.append('file', file);

        if (element.id == 'uploadLogo') {
            $scope.loadingPromise = autoaskService.uploadFile(formData, function (resp) {
                $scope.factory.logoUrl = resp.data;
            })
        } else {
            if (commonService.isUndefinedOrNull($scope.factory.picUrlList)) {
                $scope.factory.picUrlList = [];
            }
            $scope.loadingPromise = autoaskService.uploadFile(formData, function (resp) {
                $scope.factory.picUrlList.push(resp.data);
            })
        }


    };

    // 初始化
    $scope.init = function () {

        //加载省份列表
        $scope.loadingPromise = areaService.loadRegion().then(function () {
            $scope.provinces = areaService.getProvinces();
        });


        $scope.loadingPromise = autoaskService.getFactory(null, function (resp) {
            $scope.factory = resp.data;
            var address = angular.copy($scope.factory.address);
            $scope.provinceChanged(address.province);
            $scope.cityChanged(address.province, address.city);
            $scope.regionChanged(address.province, address.city, address.region).then(function () {
                    $scope.factory.address = address;
                }
            );
        });
    };

    $scope.init();
}]);