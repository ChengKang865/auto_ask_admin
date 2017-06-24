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
        }).state('app.merchant', {
            url: '/merchant',
            template: '<div ui-view class="fade-in-up"></div>',
            title: '维修工管理',
            ncyBreadcrumb: {
                label: '维修工管理'
            },
            resolve: loadSequence('mechanicCtrl')
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
        })

        //  -------------------  本店信息  --------------------------
            .state('app.serviceProvider', {
                url: '/serviceProvider',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '本店信息',
                ncyBreadcrumb: {
                    label: '本店信息'
                }
            }).state('app.serviceProvider.detail', {
            url: '/serviceProvider/detail',
            templateUrl: 'assets/views/service_provider/service_provider_detail.html',
            title: '基本信息',
            ncyBreadcrumb: {
                label: '基本信息'
            },
            resolve: loadSequence('serviceProviderDetailCtrl')
        }).state('app.serviceProvider.modify', {
            url: '/serviceProvider/modify',
            templateUrl: 'assets/views/service_provider/service_provider_modify.html',
            title: '编辑基本信息',
            ncyBreadcrumb: {
                label: '编辑基本信息'
            },
            resolve: loadSequence('serviceProviderModifyCtrl')
        }).state('app.serviceProvider.invoiceDetail', {
            url: '/invoice/detail',
            templateUrl: 'assets/views/service_provider/invoice_detail.html',
            title: '开票信息',
            ncyBreadcrumb: {
                label: '开票信息'
            },
            resolve: loadSequence('invoiceDetailCtrl')
        }).state('app.serviceProvider.invoiceModify', {
            url: '/invoice/modify',
            templateUrl: 'assets/views/service_provider/invoice_modify.html',
            title: '编辑开票信息',
            ncyBreadcrumb: {
                label: '编辑开票信息'
            },
            resolve: loadSequence('invoiceModifyCtrl')
        }).state('app.serviceProvider.qrCodeDetail', {
            url: '/qrcode/detail',
            templateUrl: 'assets/views/service_provider/bind_qrcode_detail.html',
            title: '绑定二维码',
            ncyBreadcrumb: {
                label: '绑定二维码'
            },
            resolve: loadSequence('bindQRCodeDetailCtrl')
        }).state('app.serviceProvider.qrCodeModify', {
            url: '/qrcode/modify',
            templateUrl: 'assets/views/service_provider/bind_qrcode_modify.html',
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

        // ----------------------------------库存----------------------------------------
            .state('app.goodsNum', {
                url: '/serviceProvider',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '库存管理',
                ncyBreadcrumb: {
                    label: '库存管理'
                }
            }).state('app.goodsNum.list', {
            url: '/goodsNum/list',
            templateUrl: 'assets/views/goodsNum/service_provider_goods_num_list.html',
            title: '本店库存',
            ncyBreadcrumb: {
                label: '本店库存'
            },
            resolve: loadSequence('goodsNumListCtrl')
        })

        //  -------------------  订单  --------------------------
            .state('app.order', {
                url: '/order',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '订单管理',
                ncyBreadcrumb: {
                    label: '订单管理'
                }
            }).state('app.order.appointList', {
            url: '/appointList',
            templateUrl: 'assets/views/order/order_appoint_list.html',
            title: '线下预约订单',
            ncyBreadcrumb: {
                label: '线下预约订单'
            },
            resolve: loadSequence('orderAppointListCtrl')
        }).state('app.order.offlineList', {
            url: '/offlineList',
            templateUrl: 'assets/views/order/order_offline_list.html',
            title: '线下支付订单（店内线上支付订单）',
            ncyBreadcrumb: {
                label: '线下支付订单（店内线上支付订单）'
            },
            resolve: loadSequence('orderOffLineListCtrl')
        }).state('app.order.crashList', {
            url: '/crashList',
            templateUrl: 'assets/views/order/order_crash_list.html',
            title: '线下支付订单（店内线上支付订单）',
            ncyBreadcrumb: {
                label: '线下支付订单（店内线上支付订单）'
            },
            resolve: loadSequence('orderCrashListCtrl')
        }).state('app.order.detail', {
            url: '/detail/:id',
            templateUrl: 'assets/views/order/order_detail.html',
            resolve: loadSequence('orderDetailCtrl')
        })

        //  -------------------  分成  --------------------------
            .state('app.share', {
                url: '/share',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '分成管理',
                ncyBreadcrumb: {
                    label: '分成管理'
                },
                resolve: loadSequence('shareCtrl', 'applyCtrl', 'selfAccountCtrl')
            }).state('app.share.serviceProviderList', {
            url: '/serviceProviderList',
            templateUrl: 'assets/views/share/service_provider_share_list.html',
            title: '本店分成历史',
            ncyBreadcrumb: {
                label: '本店分成历史'
            }
        }).state('app.share.merchantList', {
            url: '/merchantList',
            templateUrl: 'assets/views/share/mechanic_share_list.html',
            title: '维修工红包',
            ncyBreadcrumb: {
                label: '维修工红包'
            }
        }).state('app.share.extract', {
            url: '/extra',
            templateUrl: 'assets/views/share/apply_list.html',
            title: '提取历史',
            ncyBreadcrumb: {
                label: '提取历史'
            }
        }).state('app.share.apply', {
            url: '/apply',
            templateUrl: 'assets/views/share/apply_list.html',
            title: '申请管理',
            ncyBreadcrumb: {
                label: '申请管理'
            }
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