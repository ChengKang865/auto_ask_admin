'use strict';

/**
 * AuthController
 *
 * @constructor
 */

app.factory('areaService', function (restProxyService, commonService, autoaskProvider, $q) {
    var regions = {};
    var provinceList = [];
    var provinceCities = {};
    var provinceCityRegions = {};

    return {
        loadRegion: function () {
            var deferred = $q.defer();
            restProxyService.sendHttpGet('./', '../common/resources/region.json', {}).success(function (resp) {
                regions = resp;
                provinceList = [];
                for (var p in regions) {
                    // 装载省份数组
                    var provinceName = commonService.getAttrNames(regions[p])[0];
                    provinceList.push(provinceName);

                    // 装载省份-城市字典
                    var cities = [];
                    var cityList = regions[p][provinceName];
                    for (var c in cityList) {
                        var cityName = commonService.getAttrNames(cityList[c])[0];
                        cities.push(cityName);

                        // 装载区域字典
                        var regionList = cityList[c][cityName];
                        provinceCityRegions[provinceName + cityName] = regionList;
                    }
                    provinceCities[provinceName] = cities;
                    deferred.resolve();
                }
            }).error(function () {
                swal("网络错误", "请检查网络连接", "error");
                deferred.reject();
            })
            return deferred.promise;
        },
        getProvinces: function () {
            if (provinceList.length === 0) {
                this.loadRegion();
            }
            return provinceList;
        },
        getCities: function (province) {
            return provinceCities[province] != null ? provinceCities[province] : [];
        },
        getRegions: function (province, city) {
            return provinceCityRegions[province + city] != null ? provinceCityRegions[province + city] : [];
        },
        getStreets: function (province, city, region) {
            return restProxyService.sendHttpGet(autoaskProvider, '/area/street/list/', {
                province: province,
                city: city,
                region: region
            }, null);
        }
    }
});