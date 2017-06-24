'use strict';

/**
 * AuthController
 *
 * @constructor
 */


app.factory('autoaskService', function (restProxyService, autoaskProvider, $localStorage, commonService, $q, $window) {

    function _handleResp(resp, successHandler, errorHandler) {
        if (successHandler == undefined) {
            throw Error("未定义成功方法");
        } else {
            resp = resp.success(function (resp) {
                if (resp.errCode == 0) {
                    successHandler(resp);
                } else {
                    //没有登录
                    if (resp.errCode == 100) {
                        $window.location.href = '#/login/sign';
                    } else {
                        swal("发现问题", resp.errMsg, "error");
                    }
                }
            });
        }
        if (undefined == errorHandler) {
            resp = resp.error(function (resp) {
                swal("网络错误", "请检查网络连接", "error")
            })
        } else {
            resp = resp.error(errorHandler(resp));
        }
        return resp;
    }

    function _get(host, path, params, successHandler, errorHandler, options) {
        path = path + "?factory_session_id=" + $localStorage.factory_session_id;

        var resp = restProxyService.sendHttpGet(host, path, params, options);
        return _handleResp(resp, successHandler, errorHandler);
    }

    function _post(host, path, params, successHandler, errorHandler, options) {
        path = path + "?factory_session_id=" + $localStorage.factory_session_id;

        var resp = restProxyService.sendHttpPost(host, path, params, options);
        return _handleResp(resp, successHandler, errorHandler);
    }

    function _postJson(host, path, params, successHandler, errorHandler) {
        path = path + "?factory_session_id=" + $localStorage.factory_session_id;

        var resp = restProxyService.sendHttpPost(host, path, params, {
            headers: {'Content-Type': "application/json"}
        });
        return _handleResp(resp, successHandler, errorHandler);
    }

    // 地区字典
    var regions;
    var provincesList = [];
    var provinceCities = {};
    var provinceCityRegions = {};
    // 加载地区信息
    function loadRegion(success) {
        return restProxyService.sendHttpGet('./', '../common/resources/region.json', {}).success(function (resp) {
            regions = resp;
            for (var p in regions) {
                // 装载省份数组
                var provinceName = commonService.getAttrNames(regions[p])[0];
                provincesList.push(provinceName);

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
            }
            success();
        }).error(function (resp) {
            swal("网络错误", "请检查网络连接", "error")
        })
    }

    return {
        // ------------------------- 公用服务 -----------------------
        reloadPage: function () {
            var hasReloaded = window.sessionStorage.hasOwnProperty("hasReloaded");
            if (!hasReloaded) {
                location.reload();
                window.sessionStorage.setItem("hasReloaded", "1");
            }
        },

        // 地址服务
        getProvinces: function (success) {
            if (provincesList.length == 0) {
                return loadRegion(function () {
                    success(provincesList);
                });
            }
            else {
                return $q.defer().promise.then(success(provincesList))
            }
        },
        getCities: function (province, success) {
            if (provincesList.length == 0) {
                return loadRegion(function () {
                    success(provinceCities[province])
                });
            }
            else {
                return $q.defer().promise.then(success(provinceCities[province]))
            }
        },
        getRegions: function (province, city, success) {
            if (provincesList.length == 0) {
                return loadRegion(function () {
                    success(provinceCityRegions[province + city])
                });
            }
            else {
                return $q.defer().promise.then(success(provinceCityRegions[province + city]))
            }
        },
        getStreets: function (province, city, region, success) {
            return _get(autoaskProvider, '/area/street/list/', {
                province: province,
                city: city,
                region: region
            }, function (resp) {
                success(resp.data)
            })
        },

        // 上传图片
        uploadFile: function (data, success, error) {
            return _post(autoaskProvider, '/upload/qiniu/common/', data, success, error, {
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            })
        },

        //--------------------------- sendMsg -----------------------------
        sendMsg: function (params, success) {
            return _get(autoaskProvider, '/phone/code/', params, success);
        },

        //-------------------------- face ---------------------------------
        getFactoryStatistics: function (params, success) {
            return _get(autoaskProvider, '/statistics/factory/index/', params, success);
        },

        // ------------------------- factory ------------------------------
        getFactory: function (params, success) {
            return _get(autoaskProvider, '/merchant/factory/get/', params, success);
        },
        updateFactory: function (params, success) {
            return _post(autoaskProvider, '/merchant/factory/update/', params, success);
        },
        //发票信息
        getVatInfo: function (params, success) {
            return _get(autoaskProvider, '/merchant/vatInvoice/get/', params, success);
        },
        updateVatInfo: function (params, success) {
            return _postJson(autoaskProvider, '/merchant/vatInvoice/update/', params, success);
        },
        //二维码信息
        getSelfQRCode: function (params, success) {
            return _get(autoaskProvider, '/merchant/qrCode/self/get/', params, success);
        },
        updateSelfQRCode: function (params, success) {
            return _post(autoaskProvider, '/merchant/qrCode/self/bind/', params, success);
        },
        //支付宝帐号保存
        getAccountInfo: function (params, success) {
            return _get(autoaskProvider, '/merchant/account/', params, success);
        },
        updateAccountInfo: function (params, success) {
            return _post(autoaskProvider, '/merchant/account/update/', params, success);
        },

        //---------------------------- 商品 --------------------------------------
        getProductCategoryList: function (params, success) {
            return _get(autoaskProvider, '/product/category/list/', params, success);
        },
        getProductList: function (params, success) {
            return _get(autoaskProvider, '/product/product/list/', params, success);
        },
        getGoodsList: function (params, success) {
            return _get(autoaskProvider, '/product/goods/list/', params, success);
        },
        // ---------------------------- 订单服务 -----------------------------
        getOnLineList: function (params, success) {
            return _get(autoaskProvider, '/order/online/list/', params, success);
        },
        getOrderDetail: function (params, success) {
            return _get(autoaskProvider, '/order/detail/', params, success);
        },
        confirmOnline: function (params, success) {
            return _post(autoaskProvider, '/order/factory/online/confirm/', params, success);
        },

        // ---------------------------- 分成历史 ----------------------------
        submitApply: function (params, success) {
            return _post(autoaskProvider, '/merchant/share/apply/', params, success);
        },
        getApplyList: function (params, success) {
            return _get(autoaskProvider, '/merchant/apply/list/', params, success);
        },
        getShareList: function (params, success) {
            return _get(autoaskProvider, '/merchantAssets/record/list/', params, success);
        },

        // ---------------------------- 库存管理 -----------------------------
        getGoodsNumList: function (params, success, error) {
            return _get(autoaskProvider, '/merchant/goodsNum/list/', params, success, error);
        },

        //----------------------------- 公告 ---------------------------
        getNoticeItemList: function (params, success, error) {
            return _get(autoaskProvider, '/merchant/notice/item/list/', params, success, error);
        },
        getNoticeItem: function (params, success, error) {
            return _get(autoaskProvider, '/merchant/notice/item/get/', params, success, error);
        },

        // ---------------------------- 登陆服务 -----------------------------
        //更改密码
        updatePassword: function (params, success, error) {
            return _post(autoaskProvider, '/merchant/password/update/', params, success, error);
        },
        login: function (params) {
            return restProxyService.sendHttpPost(autoaskProvider, '/login/merchant/', params);
        },
        logout: function () {
            return restProxyService.sendHttpGet(autoaskProvider, 'login/logout/');
        }
    }
});

