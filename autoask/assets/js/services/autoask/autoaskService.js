'use strict';

/**
 * AuthController
 *
 * @constructor
 */


app.factory('autoaskService', function (restProxyService, autoaskProvider, commonService, $q, $window, $localStorage) {

    function _handleResp(resp, successHandler, errorHandler) {
        if (successHandler == undefined) {
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
        path = path + "?staff_session_id=" + $localStorage.staff_session_id;

        var resp = restProxyService.sendHttpGet(host, path, params, options);
        return _handleResp(resp, successHandler, errorHandler);
    }

    function _post(host, path, params, successHandler, errorHandler, options) {
        path = path + "?staff_session_id=" + $localStorage.staff_session_id;

        var resp = restProxyService.sendHttpPost(host, path, params, options);
        return _handleResp(resp, successHandler, errorHandler);
    }

    function _postJson(host, path, params, successHandler, errorHandler) {
        path = path + "?staff_session_id=" + $localStorage.staff_session_id;

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

        //------------------------------ 首页统计 ------------------------------------------------
        getStatistics: function (params, success) {
            return _get(autoaskProvider, '/statistics/index/', params, success);
        },

        // ------------------------- 渠道管理 -----------------------
        // 合作商
        getPartnerList: function (params, success) {
            return _get(autoaskProvider, '/merchant/partner/list/', params, success);
        },
        getPartner: function (params, success) {
            return _get(autoaskProvider, '/merchant/partner/get/', params, success);
        },
        addPartner: function (params, success) {
            return _post(autoaskProvider, '/merchant/partner/add/', params, success);
        },
        updatePartner: function (params, success) {
            return _post(autoaskProvider, '/merchant/partner/update/', params, success);
        },
        deletePartner: function (params, success) {
            return _post(autoaskProvider, '/merchant/partner/delete/', params, success);
        },
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
        // 合作工厂
        getFactoryList: function (params, success) {
            return _get(autoaskProvider, '/merchant/factory/list/', params, success);
        },
        getFactory: function (params, success) {
            return _get(autoaskProvider, '/merchant/factory/get/', params, success);
        },
        addFactory: function (params, success) {
            return _post(autoaskProvider, '/merchant/factory/add/', params, success);
        },
        updateFactory: function (params, success) {
            return _post(autoaskProvider, '/merchant/factory/update/', params, success);
        },
        deleteFactory: function (params, success) {
            return _post(autoaskProvider, '/merchant/factory/delete/', params, success);
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


        // ---------------------------- 产品服务 -----------------------------
        // 产品类别
        getProductCategoryList: function (params, success) {
            return _get(autoaskProvider, '/product/category/list/', params, success);
        },
        getProductCategory: function (params, success) {
            return _get(autoaskProvider, '/product/category/get/', params, success);
        },
        addProductCategory: function (params, success) {
            return _post(autoaskProvider, '/product/category/add/', params, success);
        },
        updateProductCategory: function (params, success) {
            return _post(autoaskProvider, '/product/category/update/', params, success);
        },
        deleteProductCategory: function (params, success) {
            return _post(autoaskProvider, '/product/category/delete/', params, success);
        },
        // 产品
        getProductList: function (params, success) {
            return _get(autoaskProvider, '/product/product/list/', params, success);
        },
        getProduct: function (params, success) {
            return _get(autoaskProvider, '/product/product/get/', params, success);
        },
        addProduct: function (params, success) {
            return _post(autoaskProvider, '/product/product/add/', params, success);
        },
        updateProduct: function (params, success) {
            return _post(autoaskProvider, '/product/product/update/', params, success);
        },
        deleteProduct: function (params, success) {
            return _post(autoaskProvider, '/product/product/delete/', params, success);
        },
        // 商品
        getGoodsList: function (params, success) {
            return _get(autoaskProvider, '/product/goods/list/', params, success);
        },
        getGoods: function (params, success) {
            return _get(autoaskProvider, '/product/goods/get/', params, success);
        },
        addGoods: function (params, success) {
            return _post(autoaskProvider, '/product/goods/add/', params, success);
        },
        updateGoods: function (params, success) {
            return _post(autoaskProvider, '/product/goods/update/', params, success);
        },
        deleteGoods: function (params, success) {
            return _post(autoaskProvider, '/product/goods/delete/', params, success);
        },
        confirmGoods: function (params, success) {
            return _post(autoaskProvider, '/product/goods/confirm/', params, success);
        },
        onlineGoods: function (params, success) {
            return _post(autoaskProvider, '/product/goods/online/', params, success);
        },
        offlineGoods: function (params, success) {
            return _post(autoaskProvider, '/product/goods/offline/', params, success);
        },


        // ---------------------------- 订单服务 -----------------------------
        getOrderList: function (params, success) {
            return _get(autoaskProvider, '/order/list/', params, success);
        },
        getOffLineList: function (params, success) {
            return _get(autoaskProvider, '/order/offline/list/', params, success);
        },
        getOnLineList: function (params, success) {
            return _get(autoaskProvider, '/order/online/list/', params, success);
        },
        getOrderDetail: function (params, success) {
            return _get(autoaskProvider, '/order/detail/', params, success);
        },
        confirmOnline: function (params, success) {
            return _post(autoaskProvider, '/order/autoask/online/confirm/', params, success);
        },
        refundOrder: function (params, success) {
            return _post(autoaskProvider, '/order/autoask/refuse/', params, success);
        },
        refuseAppoint: function (params, success) {
            return _post(autoaskProvider, '/order/autoask/appoint/refuse/', params, success);
        },
        updateOrderExpress: function (params, success) {
            return _post(autoaskProvider, '/order/express/update/', params, success);
        },


        // ---------------------------- 分成历史 ----------------------------
        confirmApplies: function (params, success) {
            return _postJson(autoaskProvider, '/alipay/transfer/', params, success)
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
        getShareCheckList: function (params, success) {
            return _get(autoaskProvider, '/order/share/check/list/', params, success);
        },
        shareOrder: function (params, success) {
            return _get(autoaskProvider, '/order/share/check/', params, success);
        },

        // ---------------------------- 用户管理 -----------------------------

        getUsersList: function (params, success) {

            return _get(autoaskProvider, '/statistics/user/list/', params, success);
        },

        // ---------------------------- 网站管理服务 -----------------------------


        getBannerList: function (params, success, error) {
            return _get(autoaskProvider, '/config/banner/list/', params, success, error);
        },
        updateBannerList: function (params, success, error) {
            return _postJson(autoaskProvider, '/config/banner/update/', params, success, error);
        },
        getIndexProductList: function (params, success, error) {
            return _get(autoaskProvider, '/product/indexProduct/list/', params, success, error);
        },
        updateIndexProductList: function (params, success, error) {
            return _postJson(autoaskProvider, '/product/indexProduct/update/', params, success, error);
        },

        getActivityList: function (params, success, error) {
            return _get(autoaskProvider, '/config/richtext/query/activity/', params, success, error);
        },

        addActivity: function (params, success, error) {
            return _postJson(autoaskProvider, '/config/richtext/add/activity/', params, success, error);
        },

        modifyActivity: function (params, success, error) {
            return _postJson(autoaskProvider, '/config/richtext/modify/activity/', params, success, error);
        },

        getActivityDetail: function (params, success, error) {
            return _get(autoaskProvider, '/config/richtext/detail/', params, success, error);
        },

        deleteActivityDetail: function (params, success, error) {
            return _post(autoaskProvider, '/config/richtext/delete/', params, success, error);
        },

        getServiceList: function (params, success, error) {
            return _get(autoaskProvider, '/config/richtext/query/service/', params, success, error);
        },

        addService: function (params, success, error) {
            return _postJson(autoaskProvider, '/config/richtext/add/service/', params, success, error);
        },

        addExplore: function (params, success, error) {
            return _postJson(autoaskProvider, '/config/richtext/add/explore/', params, success, error);
        },

        modifyService: function (params, success, error) {
            return _postJson(autoaskProvider, '/config/richtext/modify/service/', params, success, error);
        },

        getExploreList: function (params, success, error) {
            return _get(autoaskProvider, '/config/richtext/query/explore/', params, success, error);
        },

        getRichTextDetail: function (params, success, error) {
            return _get(autoaskProvider, '/config/richtext/detail/', params, success, error);
        },

        getHowSelectList: function (params, success, error) {
            return _get(autoaskProvider, '/config/richtext/query/how_select/', params, success, error);
        },

        getHowBuyList: function (params, success, error) {
            return _get(autoaskProvider, '/config/richtext/query/how_buy/', params, success, error);
        },

        getHowPayList: function (params, success, error) {
            return _get(autoaskProvider, '/config/richtext/query/how_pay/', params, success, error);
        },

        addHowSelect: function (params, success, error) {
            return _postJson(autoaskProvider, '/config/richtext/add/how_select/', params, success, error);
        },

        addHowBuy: function (params, success, error) {
            return _postJson(autoaskProvider, '/config/richtext/add/how_buy/', params, success, error);
        },

        addHowPay: function (params, success, error) {
            return _postJson(autoaskProvider, '/config/richtext/add/how_pay/', params, success, error);
        },

        modifyHowSelect: function (params, success, error) {
            return _postJson(autoaskProvider, '/config/richtext/modify/how_select/', params, success, error);
        },

        modifyHowBuy: function (params, success, error) {
            return _postJson(autoaskProvider, '/config/richtext/modify/how_buy/', params, success, error);
        },

        modifyHowPay: function (params, success, error) {
            return _postJson(autoaskProvider, '/config/richtext/modify/how_pay/', params, success, error);
        },

        getAboutUsList: function (params, success, error) {
            return _get(autoaskProvider, '/config/richtext/query/about_us/', params, success, error);
        },

        addAboutUs: function (params, success, error) {
            return _postJson(autoaskProvider, '/config/richtext/add/about_us/', params, success, error);
        },

        modifyAboutUs: function (params, success, error) {
            return _postJson(autoaskProvider, '/config/richtext/modify/about_us/', params, success, error);
        },
        getDeliveryFreeAmount: function (params, success, error) {
            return _get(autoaskProvider, '/config/deliveryFree/', params, success, error);
        },
        updateDeliveryFreeAmount: function (params, success, error) {
            return _post(autoaskProvider, '/config/deliveryFree/update/', params, success, error);
        },

        // ---------------------------- 卡片 ----------------------------
        addCard: function (params, success) {
            return _postJson(autoaskProvider, '/merchant/card/add/', params, success);
        },
        getCardList: function (params, success) {
            return _get(autoaskProvider, '/merchant/card/list/', params, success);
        },
        activeCardType: function (params, success) {
            return _get(autoaskProvider, '/merchant/card/active/', params, success);
        },
        deleteCardType: function (params, success) {
            return _post(autoaskProvider, '/merchant/card/delete/', params, success);
        },
        getCardDetail: function (params, success) {
            return _get(autoaskProvider, '/merchant/card/view/', params, success);
        },
        getCardUseList: function (params, success) {
            return _get(autoaskProvider, '/merchant/card/use/list/', params, success);
        },
        exportCardIds: function (params, success) {
            return _get(autoaskProvider, '/merchant/card/export/', params, success);
        },
        getCardItemList: function (params, success) {
            return _get(autoaskProvider, '/merchant/card/item/list/', params, success);
        },
        activeCardItem: function (params, success) {
            return _post(autoaskProvider, '/merchant/card/item/active/', params, success);
        },
        activeCadItemList: function (params, success) {
            return _post(autoaskProvider, '/merchant/card/item/active-list/', params, success);
        },
        deleteCardItem: function (params, success) {
            return _post(autoaskProvider, '/merchant/card/item/delete/', params, success);
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

        //----------------------评价-----------------------------------
        getCommentList: function (params, success, error) {
            return _get(autoaskProvider, '/order/comment/goods/list/', params, success, error);
        },
        replayComment: function (params, success, error) {
            return _post(autoaskProvider, '/order/comment/goods/replay/', params, success, error);
        },

        //系统
        getStaffList: function (params, success, error) {
            return _get(autoaskProvider, '/staff/list/', params, success, error);
        },
        insertStaff: function (params, success, error) {
            return _postJson(autoaskProvider, '/staff/add/', params, success, error);
        },
        getStaff: function (params, success, error) {
            return _get(autoaskProvider, '/staff/get/', params, success, error);
        },
        updateStaff: function (params, success, error) {
            return _postJson(autoaskProvider, '/staff/update/', params, success, error);
        },
        deleteStaff: function (params, success, error) {
            return _post(autoaskProvider, '/staff/delete/', params, success, error);
        },

        //------------  公告         -------------
        getNoticeList: function (params, success, error) {
            return _get(autoaskProvider, '/merchant/notice/list/', params, success, error);
        },
        getNotice: function (params, success, error) {
            return _get(autoaskProvider, '/merchant/notice/view/', params, success, error);
        },
        insertNotice: function (params, success, error) {
            return _postJson(autoaskProvider, '/merchant/notice/insert/', params, success, error);
        },
        //------------  快递模板         -------------
        getExpressTemplateList: function (params, success, error) {
            return _get(autoaskProvider, '/expressTemplate/list/', params, success, error);
        },
        insertExpressTemplate: function (params, success, error) {
            return _postJson(autoaskProvider, '/expressTemplate/add/', params, success, error);
        },
        getExpressTemplate: function (params, success, error) {
            return _get(autoaskProvider, '/expressTemplate/get/', params, success, error);
        },
        updateExpressTemplate: function (params, success, error) {
            return _postJson(autoaskProvider, '/expressTemplate/update/', params, success, error);
        },
        deleteExpressTemplate: function (params, success, error) {
            return _post(autoaskProvider, '/expressTemplate/delete/', params, success, error);
        },
        notPageList: function (params, success, error) {
            return _get(autoaskProvider, '/expressType/notPageList/', params, success, error);
        },
        getTemplateProvinceList: function (params, success, error) {
            return _post(autoaskProvider, '/expressTemplate/getProvinceList/', params, success, error);
        },
        //------------  快递类型         --------------------------------------
        getExpressTypeList: function (params, success, error) {
            return _get(autoaskProvider, '/expressType/list/', params, success, error);
        },
        insertExpressType: function (params, success, error) {
            return _postJson(autoaskProvider, '/expressType/add/', params, success, error);
        },
        getExpressType: function (params, success, error) {
            return _get(autoaskProvider, '/expressType/get/', params, success, error);
        },
        updateExpressType: function (params, success, error) {
            return _postJson(autoaskProvider, '/expressType/update/', params, success, error);
        },
        deleteExpressType: function (params, success, error) {
            return _post(autoaskProvider, '/expressType/delete/', params, success, error);
        },
        getProvinceList: function (params, success, error) {
            return _get(autoaskProvider, '/config/getProvinceList/', params, success, error);
        },

        //------------  微信管理         --------------------------------------
        getWeiXinQrcodeInfoList: function (params, success, error) {
            return _get(autoaskProvider, '/weixin/qrCodeInfo/list/', params, success, error);
        },
        insertWeiXinQrcodeInfo: function (params, success, error) {
            return _postJson(autoaskProvider, '/weixin/qrCodeInfo/add/', params, success, error);
        },
        downloadWeiXinQrcodeImage: function (params, success, error) {
            return _postJson(autoaskProvider, '/weixin/qrCodeInfo/downloadImg/', params, success, error);
        },
        deleteWeiXinQrcodeInfo: function (params, success, error) {
            return _postJson(autoaskProvider, '/weixin/qrCodeInfo/delete/', params, success, error);
        },
        getWeiXinUserInfoList: function (params, success, error) {
            return _get(autoaskProvider, '/weixin/userInfo/list/', params, success, error);
        },

        // ---------------------------- 登陆服务 -----------------------------

        updatePassword: function (params, success, error) {
            return _post(autoaskProvider, '/merchant/password/update/', params, success, error);
        },


        //登录
        login: function (params) {
            return restProxyService.sendHttpPost(autoaskProvider, '/login/merchant/', params);
        }
        ,
        logout: function () {
            return restProxyService.sendHttpGet(autoaskProvider, 'login/logout/');
        },

        // 页面表格相关信息
        getTableKey: function () {
            var $tds = $('table tbody:last-child tr td');
            var keys = [];
            var key = '';

            $tds.each(function (index, td) {
                key = td.dataset.key;
                key = key || '';

                if (key.trim() !== '') {
                    keys.push(key);
                }
            });

            return keys;
        },

        getTableHeader: function () {
            var $ths = $('table thead tr:last-child th');
            var headerTitles = [];
            var title = '';

            $ths.each(function (index, th) {
                title = $(th).data('titleText');
                title = title || '';

                if (title.trim() !== '') {
                    headerTitles.push(title);
                }
            });

            return headerTitles;
        }
    };
})
;

