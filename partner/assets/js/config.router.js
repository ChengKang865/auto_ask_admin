'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES',
    function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires) {

        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;

        // LAZY MODULES

        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: jsRequires.modules
        });

        // APPLICATION ROUTES
        // -----------------------------------
        // For any unmatched url, redirect to /app/dashboard
        $urlRouterProvider.otherwise("/app/face");
        //
        // Set up the states
        $stateProvider.state('app', {
            url: "/app",
            templateUrl: "assets/views/app.html",
            resolve: loadSequence('modernizr', 'moment', 'angularMoment', 'uiSwitch', 'perfect-scrollbar-plugin', 'toaster',
                'ngAside', 'vAccordion', 'chartjs', 'tc.chartjs', 'chatCtrl',
                'commonService', 'autoaskService', 'authService', 'restProxyService', 'ngTagsInput', 'ngTable',
                'angularBusy', 'areaService', 'autoaskFilter', 'angular-md5'
            ),
            abstract: true
        }).state('app.face', {
            url: '/face',
            templateUrl: "assets/views/face.html",
            title: '数据概览',
            ncyBreadcrumb: {
                label: '数据概览'
            },
            resolve: loadSequence('faceCtrl'),
            data: {
                roles: ['root']
            }
        })
        //  -------------------  本店信息  --------------------------
            .state('app.partnerInfo', {
                url: '/partnerInfo',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '本店信息',
                ncyBreadcrumb: {
                    label: '本店信息'
                }
            }).state('app.partnerInfo.detail', {
            url: '/detail',
            templateUrl: 'assets/views/partner/partner_detail.html',
            title: '基本信息',
            ncyBreadcrumb: {
                label: '基本信息'
            },
            resolve: loadSequence('partnerDetailCtrl')
        }).state('app.partnerInfo.modify', {
            url: '/modify',
            templateUrl: 'assets/views/partner/partner_modify.html',
            title: '编辑基本信息',
            ncyBreadcrumb: {
                label: '编辑基本信息'
            },
            resolve: loadSequence('partnerModifyCtrl')
        }).state('app.partnerInfo.invoiceDetail', {
            url: '/invoice/detail',
            templateUrl: 'assets/views/partner/invoice_detail.html',
            title: '开票信息',
            ncyBreadcrumb: {
                label: '开票信息'
            },
            resolve: loadSequence('invoiceDetailCtrl')
        }).state('app.partnerInfo.invoiceModify', {
            url: '/invoice/modify',
            templateUrl: 'assets/views/partner/invoice_modify.html',
            title: '编辑开票信息',
            ncyBreadcrumb: {
                label: '编辑开票信息'
            },
            resolve: loadSequence('invoiceModifyCtrl')
        }).state('app.partnerInfo.qrCodeDetail', {
            url: '/qrcode/detail',
            templateUrl: 'assets/views/partner/bind_qrcode_detail.html',
            title: '绑定二维码',
            ncyBreadcrumb: {
                label: '绑定二维码'
            },
            resolve: loadSequence('bindQRCodeDetailCtrl')
        }).state('app.partnerInfo.qrCodeModify', {
            url: '/qrcode/modify',
            templateUrl: 'assets/views/partner/bind_qrcode_modify.html',
            title: '绑定二维码',
            ncyBreadcrumb: {
                label: '绑定二维码'
            },
            resolve: loadSequence('bindQRCodeModifyCtrl')
        })

        //  -------------------  账户管理  --------------------------
            .state('app.account', {
                url: '/account',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '账户管理',
                ncyBreadcrumb: {
                    label: '账户管理'
                }
            }).state('app.account.passwordModify', {
            url: '/passwordModify',
            templateUrl: 'assets/views/account/modify_password.html',
            title: '修改密码',
            ncyBreadcrumb: {
                label: '修改密码'
            },
            resolve: loadSequence('modifyPasswordCtrl')
        })

        //-------------------渠道管理------------------------
            .state('app.merchant', {
                url: '/merchant',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '合作伙伴',
                ncyBreadcrumb: {
                    label: '合作伙伴'
                },
                resolve: loadSequence('serviceProviderCtrl', 'mechanicCtrl', 'outletsCtrl')
            }).state('app.merchant.serviceProvider', {
            url: '/serviceProvider',
            templateUrl: "assets/views/merchant/serviceProvider.html",
            title: '服务店',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '服务店'
            }
        }).state('app.merchant.serviceProviderDetail', {
            url: '/serviceProviderDetail/:id/:action',
            templateUrl: "assets/views/merchant/service_provider_modify.html",
            title: '服务店信息',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '服务店信息'
            }
        }).state('app.merchant.mechanic', {
            url: '/mechanic',
            templateUrl: "assets/views/merchant/mechanic.html",
            title: '维修工',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '维修工'
            }
        }).state('app.merchant.mechanicDetail', {
            url: '/mechanicDetail/:id/:action',
            templateUrl: "assets/views/merchant/mechanic_modify.html",
            title: '维修工信息',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '维修工信息'
            }
        }).state('app.merchant.outlets', {
            url: '/outlets',
            templateUrl: "assets/views/merchant/outlets.html",
            title: '分销点',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '分销点'
            }
        }).state('app.merchant.outletsDetail', {
            url: '/outletsDetail/:id/:action',
            templateUrl: "assets/views/merchant/outlets_modify.html",
            title: '分销点信息',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '分销点信息'
            }
        })


        //  -------------------  订单  --------------------------
            .state('app.order', {
                url: '/order',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '订单管理',
                ncyBreadcrumb: {
                    label: '订单管理'
                },
                resolve: loadSequence('offlineListCtrl', 'onlineListCtrl', 'orderDetailCtrl')
            }).state('app.order.offlineList', {
            url: '/offlineList',
            templateUrl: 'assets/views/order/offline_list.html',
            title: '服务店全部订单',
            ncyBreadcrumb: {
                label: '服务店全部订单'
            }

        }).state('app.order.offlinePendingList', {
            url: '/offlinePendingList',
            templateUrl: 'assets/views/order/offline_pending_list.html',
            title: '服务店缺货订单',
            ncyBreadcrumb: {
                label: '服务店缺货订单'
            }
        }).state('app.order.onlineList', {
            url: '/onlineList',
            templateUrl: 'assets/views/order/online_list.html',
            title: '线上订单',
            ncyBreadcrumb: {
                label: '线上订单'
            }
        }).state("app.order.onlineToDealList", {
            url: '/onlineToDealList',
            templateUrl: 'assets/views/order/online_to_deal_list.html',
            title: '线上未处理订单',
            ncyBreadcrumb: {
                label: '线上未处理订单'
            }
        }).state('app.order.detail', {
            url: '/detail/:id',
            templateUrl: 'assets/views/order/order_detail.html'
        })

        // ------------------------------------ 分成 ------------------------------------------------
            .state('app.share', {
                url: '/share',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '分成管理',
                ncyBreadcrumb: {
                    label: '分成管理'
                },
                resolve: loadSequence('shareCtrl', 'applyCtrl', 'selfAccountCtrl')
            }).state('app.share.selfAccountDetail', {
            url: '/selfAccountDetail',
            templateUrl: 'assets/views/share/self_account_detail.html',
            title: '账户管理',
            ncyBreadcrumb: {
                label: '账户管理'
            }
        }).state('app.share.selfAccountModify', {
            url: '/selfAccountModify',
            templateUrl: 'assets/views/share/self_account_modify.html',
            title: '账户管理',
            ncyBreadcrumb: {
                label: '账户管理'
            }
        }).state('app.share.extract', {
            url: '/extra',
            templateUrl: 'assets/views/share/apply_list.html',
            title: '提取历史',
            ncyBreadcrumb: {
                label: '提取历史'
            }
        }).state('app.share.partnerList', {
            url: '/partnerList',
            templateUrl: 'assets/views/share/partner_share_list.html',
            title: '本店分成',
            ncyBreadcrumb: {
                label: '本店分成'
            }
        }).state('app.share.serviceProviderList', {
            url: '/serviceProviderList',
            templateUrl: 'assets/views/share/service_provider_share_list.html',
            title: '服务店分成',
            ncyBreadcrumb: {
                label: '服务店分成'
            }
        }).state('app.share.mechanicList', {
            url: '/mechanicList',
            templateUrl: 'assets/views/share/mechanic_share_list.html',
            title: '维修工红包',
            ncyBreadcrumb: {
                label: '维修工红包'
            }
        }).state('app.share.outletsList', {
            url: '/merchantList',
            templateUrl: 'assets/views/share/outlets_share_list.html',
            title: '维修工红包',
            ncyBreadcrumb: {
                label: '维修工红包'
            }
        })


        //  -------------------  库存管理  --------------------------
            .state('app.goodsNum', {
                url: '/goodsNum',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '库存管理',
                ncyBreadcrumb: {
                    label: '库存管理'
                },
                resolve: loadSequence('goodsNumRecordCtrl', 'goodsNumListCtrl')
            }).state('app.goodsNum.subList', {
            url: '/subList',
            templateUrl: 'assets/views/goods_num/goods_num_sub_list.html',
            title: '退货管理',
            ncyBreadcrumb: {
                label: '退货管理'
            }
        }).state('app.goodsNum.addList', {
            url: '/addList',
            templateUrl: 'assets/views/goods_num/goods_num_add_list.html',
            title: '发货管理',
            ncyBreadcrumb: {
                label: '发货管理'
            }
        }).state('app.goodsNum.add', {
            url: '/add',
            templateUrl: 'assets/views/goods_num/goods_num_add.html',
            title: '发货',
            ncyBreadcrumb: {
                label: '发货'
            }
        }).state('app.goodsNum.sub', {
            url: '/sub',
            templateUrl: 'assets/views/goods_num/goods_num_sub.html',
            title: '退货',
            ncyBreadcrumb: {
                label: '退货'
            }
        }).state('app.goodsNum.addDetail', {
            url: '/add/detail/:id',
            templateUrl: 'assets/views/goods_num/goods_num_add_detail.html',
            title: '添加退货管理',
            ncyBreadcrumb: {
                label: '添加退货管理'
            }
        }).state('app.goodsNum.subDetail', {
            url: '/sub/detail/:id',
            templateUrl: 'assets/views/goods_num/goods_num_sub_detail.html',
            title: '添加退货管理',
            ncyBreadcrumb: {
                label: '添加退货管理'
            }
        }).state('app.goodsNum.partnerList', {
            url: '/partnerList',
            templateUrl: 'assets/views/goods_num/partner_goods_num_list.html',
            title: '本店库存',
            ncyBreadcrumb: {
                label: '本店库存'
            }
        }).state('app.goodsNum.serviceProviderList', {
            url: '/serviceProviderList',
            templateUrl: 'assets/views/goods_num/service_provider_goods_num_list.html',
            title: '服务店库存',
            ncyBreadcrumb: {
                label: '服务店库存'
            }
        })

        //  -------------------  公告管理  --------------------------
            .state('app.noticeItem', {
                url: '/noticeItem',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '公告管理',
                ncyBreadcrumb: {
                    label: '公告管理'
                },
                resolve: loadSequence('noticeItemCtrl')
            }).state('app.noticeItem.list', {
            url: '/list',
            templateUrl: 'assets/views/notice/notice_item_list.html',
            title: '公告列表',
            ncyBreadcrumb: {
                label: '公告列表'
            }
        }).state('app.noticeItem.detail', {
            url: '/detail/:id',
            templateUrl: 'assets/views/notice/notice_item_detail.html',
            title: '公告详情',
            ncyBreadcrumb: {
                label: '公告详情'
            }
        })

        //  -------------------  错误  --------------------------
            .state('error', {
                url: '/error',
                template: '<div ui-view class="fade-in-up"></div>'
            }).state('error.404', {
            url: '/404',
            templateUrl: "assets/views/utility_404.html"
        }).state('error.500', {
            url: '/500',
            templateUrl: "assets/views/utility_500.html"
        }).state('login', {
            url: '/login',
            template: '<div ui-view class="fade-in-right-big smooth"></div>',
            abstract: true,
            resolve: loadSequence('moment', 'angularMoment',
                'commonService', 'autoaskService', 'authService', 'restProxyService', 'angularBusy', 'angular-md5', 'loginCtrl'),
            title: '登录'
        }).state('login.sign', {
            url: '/sign',
            templateUrl: 'assets/views/login/login.html',
            title: '密码登录'
        });

        // Login routes

        // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
        function loadSequence() {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q',
                    function ($ocLL, $q) {
                        var promise = $q.when(1);
                        for (var i = 0, len = _args.length; i < len; i++) {
                            promise = promiseThen(_args[i]);
                        }
                        return promise;

                        function promiseThen(_arg) {
                            if (typeof _arg == 'function')
                                return promise.then(_arg);
                            else
                                return promise.then(function () {
                                    var nowLoad = requiredData(_arg);
                                    if (!nowLoad)
                                        return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                    return $ocLL.load(nowLoad);
                                });
                        }

                        function requiredData(name) {
                            if (jsRequires.modules)
                                for (var m in jsRequires.modules)
                                    if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
                                        return jsRequires.modules[m];
                            return jsRequires.scripts && jsRequires.scripts[name];
                        }
                    }]
            };
        }
    }]);