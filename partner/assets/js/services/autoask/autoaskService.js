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
        path = path + "?partner_session_id=" + $localStorage.partner_session_id;

        var resp = restProxyService.sendHttpGet(host, path, params, options);
        return _handleResp(resp, successHandler, errorHandler);
    }

    function _post(host, path, params, successHandler, errorHandler, options) {
        path = path + "?partner_session_id=" + $localStorage.partner_session_id;

        var resp = restProxyService.sendHttpPost(host, path, params, options);
        return _handleResp(resp, successHandler, errorHandler);
    }

    function _postJson(host, path, params, successHandler, errorHandler) {
        path = path + "?partner_session_id=" + $localStorage.partner_session_id;

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
        sendMsg:function (params, success) {
            return _get(autoaskProvider, '/phone/code/', params, success);
        },

        //----------------------------- 首页信息 ------------------------------------------
        getPartnerStatistics: function (params, success) {
            return _get(autoaskProvider, '/statistics/partner/index/', params, success);
        },
        getPartnerOrderList: function (params, success) {
            return _get(autoaskProvider, '/order/partner/list/', params, success);
        },

        //------------------------------本店信息-------------------------------------------
        getPartner: function (params, success) {
            return _get(autoaskProvider, '/merchant/partner/get/', params, success);
        },
        updatePartner: function (params, success) {
            return _post(autoaskProvider, '/merchant/partner/update/', params, success);
        },
        //支付宝帐号保存
        getAccountInfo: function (params, success) {
            return _get(autoaskProvider, '/merchant/account/', params, success);
        },
        updateAccountInfo: function (params, success) {
            return _post(autoaskProvider, '/merchant/account/update/', params, success);
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

        // ---------------------------- 产品服务 -----------------------------
        // 产品类别
        getProductCategoryList: function (params, success) {
            return _get(autoaskProvider, '/product/category/list/', params, success);
        },
        getProductCategory: function (params, success) {
            return _get(autoaskProvider, '/product/category/get/', params, success);
        },
        // 产品
        getProductList: function (params, success) {
            return _get(autoaskProvider, '/product/product/list/', params, success);
        },
        getProduct: function (params, success) {
            return _get(autoaskProvider, '/product/product/get/', params, success);
        },
        // 商品
        getGoodsList: function (params, success) {
            return _get(autoaskProvider, '/product/goods/list/', params, success);
        },
        getGoods: function (params, success) {
            return _get(autoaskProvider, '/product/goods/get/', params, success);
        },

        //------------------------------  渠道管理 -------------------------------------
        // 服务店
        getServiceProviderList: function (params, success) {
            return _get(autoaskProvider, '/merchant/serviceProvider/list/', params, success);
        },
        getServiceProvider: function (params, success) {
            return _get(autoaskProvider, '/merchant/serviceProvider/get/', params, success);
        },
        addServiceProvider: function (params, success) {
            return _post(autoaskProvider, '/merchant/serviceProvider/add/', params, success);
        },
        updateServiceProvider: function (params, success) {
            return _post(autoaskProvider, '/merchant/serviceProvider/update/', params, success);
        },
        deleteServiceProvider: function (params, success) {
            return _post(autoaskProvider, '/merchant/serviceProvider/delete/', params, success);
        },
        // 维修工
        getMechanicList: function (params, success) {
            return _get(autoaskProvider, '/merchant/mechanic/list/', params, success);
        },
        getMechanic: function (params, success) {
            return _get(autoaskProvider, '/merchant/mechanic/get/', params, success);
        },
        addMechanic: function (params, success) {
            return _post(autoaskProvider, '/merchant/mechanic/add/', params, success);
        },
        updateMechanic: function (params, success) {
            return _post(autoaskProvider, '/merchant/mechanic/update/', params, success);
        },
        deleteMechanic: function (params, success) {
            return _post(autoaskProvider, '/merchant/mechanic/delete/', params, success);
        },
        // 分销点
        getOutletsList: function (params, success) {
            return _get(autoaskProvider, '/merchant/outlets/list/', params, success);
        },
        getOutlets: function (params, success) {
            return _get(autoaskProvider, '/merchant/outlets/get/', params, success);
        },
        addOutlets: function (params, success) {
            return _post(autoaskProvider, '/merchant/outlets/add/', params, success);
        },
        updateOutlets: function (params, success) {
            return _post(autoaskProvider, '/merchant/outlets/update/', params, success);
        },
        deleteOutlets: function (params, success) {
            return _post(autoaskProvider, '/merchant/outlets/delete/', params, success);
        },

        //---------------------------------二维码 --------------------------------
        bindQRCode: function (params, success) {
            return _post(autoaskProvider, '/merchant/bindQRCode/', params, success);
        },

        // ---------------------------- 订单服务 -----------------------------
        getOffLineList: function (params, success) {
            return _get(autoaskProvider, '/order/offline/list/', params, success);
        },
        getOnLineList: function (params, success) {
            return _get(autoaskProvider, '/order/online/list/', params, success);
        },
        getOrderDetail: function (params, success) {
            return _get(autoaskProvider, '/order/detail/', params, success);
        },
        pendingOnline: function (params, success) {
            return _post(autoaskProvider, '/order/partner/online/pending/', params, success);
        },
        confirmOnline: function (params, success) {
            return _post(autoaskProvider, '/order/partner/online/confirm/', params, success);
        },
        pendingOffline: function (params, success) {
            return _post(autoaskProvider, '/order/partner/offline/pending/', params, success);
        },

        // ---------------------------- 分成历史 ----------------------------

        submitApply: function (params, success) {
            return _post(autoaskProvider, '/merchant/share/apply/', params, success);
        },
        getMerchantAssets: function (params, success) {
            return _get(autoaskProvider, '/merchantAssets/list/', params, success);
        },
        getApplyList: function (params, success) {
            return _get(autoaskProvider, '/merchant/apply/list/', params, success);
        },
        getShareList: function (params, success) {
            return _get(autoaskProvider, '/merchantAssets/record/list/', params, success);
        },

        // ---------------------------- 库存管理 -----------------------------
        goodsNumRecordList: function (params, success, error) {
            return _get(autoaskProvider, '/merchant/goodsNum/change/list/', params, success, error);
        },
        addGoodsNumRecord: function (params, success, error) {
            return _postJson(autoaskProvider, '/merchant/goodsNum/change/', params, success, error);
        },
        getGoodsNumRecord: function (params, success, error) {
            return _get(autoaskProvider, '/merchant/goodsNum/record/get/', params, success, error);
        },
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
        //登录
        login: function (params) {
            return restProxyService.sendHttpPost(autoaskProvider, '/login/merchant/', params);
        },
        logout: function () {
            return restProxyService.sendHttpGet(autoaskProvider, 'login/logout/');
        },
    };
});

