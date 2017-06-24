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

        //  -------------------  账户管理  --------------------------
            .state('app.account', {
                url: '/account',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '账户管理',
                ncyBreadcrumb: {
                    label: '账户管理'
                },
                resolve: loadSequence('modifyPasswordCtrl')
            }).state('app.account.passwordModify', {
            url: '/passwordModify',
            templateUrl: 'assets/views/account/modify_password.html',
            title: '修改密码',
            ncyBreadcrumb: {
                label: '修改密码'
            }
        })

        //  -------------------  本店信息  --------------------------
            .state('app.factoryInfo', {
                url: '/factoryInfo',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '本店信息',
                ncyBreadcrumb: {
                    label: '本店信息'
                }
            }).state('app.factoryInfo.detail', {
            url: '/detail',
            templateUrl: 'assets/views/factory/factory_detail.html',
            title: '基本信息',
            ncyBreadcrumb: {
                label: '基本信息'
            },
            resolve: loadSequence('factoryDetailCtrl')
        }).state('app.factoryInfo.modify', {
            url: '/modify',
            templateUrl: 'assets/views/factory/factory_modify.html',
            title: '编辑基本信息',
            ncyBreadcrumb: {
                label: '编辑基本信息'
            },
            resolve: loadSequence('factoryModifyCtrl')
        }).state('app.factoryInfo.invoiceDetail', {
            url: '/invoice/detail',
            templateUrl: 'assets/views/factory/invoice_detail.html',
            title: '开票信息',
            ncyBreadcrumb: {
                label: '开票信息'
            },
            resolve: loadSequence('invoiceDetailCtrl')
        }).state('app.factoryInfo.invoiceModify', {
            url: '/invoice/modify',
            templateUrl: 'assets/views/factory/invoice_modify.html',
            title: '编辑开票信息',
            ncyBreadcrumb: {
                label: '编辑开票信息'
            },
            resolve: loadSequence('invoiceModifyCtrl')
        }).state('app.factoryInfo.qrCodeDetail', {
            url: '/qrcode/detail',
            templateUrl: 'assets/views/factory/bind_qrcode_detail.html',
            title: '绑定二维码',
            ncyBreadcrumb: {
                label: '绑定二维码'
            },
            resolve: loadSequence('bindQRCodeDetailCtrl')
        }).state('app.factoryInfo.qrCodeModify', {
            url: '/qrcode/modify',
            templateUrl: 'assets/views/factory/bind_qrcode_modify.html',
            title: '绑定二维码',
            ncyBreadcrumb: {
                label: '绑定二维码'
            },
            resolve: loadSequence('bindQRCodeModifyCtrl')
        })


        //  -------------------  订单  --------------------------
            .state('app.order', {
                url: '/order',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '订单管理',
                ncyBreadcrumb: {
                    label: '订单管理'
                },
                resolve: loadSequence('onlineListCtrl', 'orderDetailCtrl')
            }).state('app.order.onlineList', {
            url: '/onlineList',
            templateUrl: 'assets/views/order/online_list.html',
            title: '订单列表',
            ncyBreadcrumb: {
                label: '订单列表'
            }
        }).state('app.order.onlineToDealList', {
            url: '/onlineToDealList',
            templateUrl: 'assets/views/order/online_to_deal_list.html',
            title: '未处理订单',
            ncyBreadcrumb: {
                label: '未处理订单'
            }
        }).state('app.order.detail', {
            url: '/detail/:id',
            templateUrl: 'assets/views/order/order_detail.html',
            title: '订单详情',
            ncyBreadcrumb: {
                label: '订单详情'
            }
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
        }).state('app.share.applyList', {
            url: '/applyList',
            templateUrl: 'assets/views/share/apply_list.html',
            title: '提现历史',
            ncyBreadcrumb: {
                label: '提现历史'
            }
        }).state('app.share.factoryList', {
            url: '/partnerList',
            templateUrl: 'assets/views/share/factory_share_list.html',
            title: '本店分成',
            ncyBreadcrumb: {
                label: '本店分成'
            }
        })

        //  -------------------  库存  --------------------------
            .state('app.goodsNum', {
                url: '/goodsNum',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '库存管理',
                ncyBreadcrumb: {
                    label: '库存管理'
                },
                resolve: loadSequence('goodsNumListCtrl')
            }).state('app.goodsNum.list', {
            url: '/list',
            templateUrl: 'assets/views/goodsNum/factory_goods_num_list.html',
            title: '本店库存',
            ncyBreadcrumb: {
                label: '本店库存'
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

        //  -------------------  用户  --------------------------
            .state('app.users', {
                url: '/users',
                templateUrl: 'assets/views/users/users.html',
                title: '用户列表',
                ncyBreadcrumb: {
                    label: '用户列表'
                },
                resolve: loadSequence('usersCtrl')
            })

            //  -------------------  配置  --------------------------
            .state('app.config', {
                url: '/config',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '配置管理',
                ncyBreadcrumb: {
                    label: '配置管理'
                },
                resolve: loadSequence('bannerCtrl', 'indexProductCtrl')
            }).state('app.config.banner', {
            url: '/banner',
            templateUrl: 'assets/views/config/banner.html',
            title: 'banner管理',
            ncyBreadcrumb: {
                label: 'banner管理'
            }
        }).state('app.config.indexProduct', {
            url: '/indexProduct',
            templateUrl: 'assets/views/config/indexProduct.html',
            title: '首页产品管理',
            ncyBreadcrumb: {
                label: '首页产品管理'
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