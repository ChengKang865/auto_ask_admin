app.controller('partnerModifyCtrl', ['$scope', 'autoaskService', 'areaService', '$location', function ($scope, autoaskService, areaService, $location) {
    $scope.action = 'edit';

    $scope.partner = {};

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
            $scope.partner.address.city = '';
            $scope.partner.address.region = '';
            $scope.partner.address.street = '';
            $scope.partner.address.detail = '';
        })
    };
    $scope.cityChanged = function (province, city) {
        return autoaskService.getRegions(province, city, function (regions) {
            $scope.regions = regions;
            $scope.streets = [];
            $scope.partner.address.region = '';
            $scope.partner.address.street = '';
            $scope.partner.address.detail = '';
        })
    };
    $scope.regionChanged = function (province, city, region) {
        return autoaskService.getStreets(province, city, region, function (streets) {
            $scope.streets = streets;
            $scope.partner.address.street = '';
            $scope.partner.address.detail = '';
        })
    };


    // 提交
    var submit = function () {
        $scope.loadingPromise = autoaskService.updatePartner($scope.partner, function () {
            swal("修改信息成功", "", "success");
            //$location.path("app/partner/partner/detail");
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
                $scope.partner.logoUrl = resp.data;
            })
        } else {
            if (commonService.isUndefinedOrNull($scope.partner.picUrlList)) {
                $scope.partner.picUrlList = [];
            }
            $scope.loadingPromise = autoaskService.uploadFile(formData, function (resp) {
                $scope.partner.picUrlList.push(resp.data);
            })
        }


    };

    // 初始化
    $scope.init = function () {

        //加载省份列表
        $scope.loadingPromise = areaService.loadRegion().then(function () {
            $scope.provinces = areaService.getProvinces();
        });

        // 确定操作类型
        if ($scope.action == 'add') {
            // 什么都不做
        } else {
            $scope.loadingPromise = autoaskService.getPartner(null, function (resp) {
                $scope.partner = resp.data;
                var address = angular.copy($scope.partner.address);
                $scope.provinceChanged(address.province);
                $scope.cityChanged(address.province, address.city);
                $scope.regionChanged(address.province, address.city, address.region).then(function () {
                        $scope.partner.address = address;
                    }
                );
            });
        }
        if ($scope.action == 'info') {
            $('input').attr('disabled', true).attr('placeholder', '');
            $('select').attr('disabled', true);
        }
    };

    // 删除图片
    $scope.deleteImage = function (picArr, listIndex) {
        picArr.splice(listIndex, 1);
    };

    $scope.init();
}]);