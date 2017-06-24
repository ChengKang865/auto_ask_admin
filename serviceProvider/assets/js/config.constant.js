'use strict';

/**
 * Config constant
 */
app.constant('APP_MEDIAQUERY', {
    'desktopXL': 1200,
    'desktop': 992,
    'tablet': 768,
    'mobile': 480
});

//var AUTOASK_HOST = '127.0.0.1:8087/autoask';
var AUTOASK_HOST = 'www.autoask.com/autoask';

var ACTIVE_URL = "oizq85p8q.bkt.clouddn.com/active.png";
app.constant('ACTIVE_URL', 'http://' + ACTIVE_URL);


app.constant('autoaskProvider', 'http://' + AUTOASK_HOST);
app.constant('PAY_TYPES', {
    'ali': '支付宝',
    'weixin': '微信',
    'union_pay': '银联'
});
app.constant('loginType', 'autoask');

app.constant('JS_REQUIRES', {
    //*** Scripts
    scripts: {
        //*** Javascript Plugins
        'modernizr': ['../bower_components/components-modernizr/modernizr.js'],
        'moment': ['../bower_components/moment/min/moment.min.js'],
        'spin': '../bower_components/spin.js/spin.js',
        //ng-tags


        //*** jQuery Plugins
        'perfect-scrollbar-plugin': ['../bower_components/perfect-scrollbar/js/min/perfect-scrollbar.jquery.min.js', '../bower_components/perfect-scrollbar/css/perfect-scrollbar.min.css'],
        'ladda': ['../bower_components/ladda/dist/ladda.min.js', '../bower_components/ladda/dist/ladda-themeless.min.css'],
        'chartjs': '../bower_components/chartjs/Chart.min.js',
        'jquery-sparkline': '../bower_components/jquery.sparkline.build/dist/jquery.sparkline.min.js',
        'ckeditor-plugin': '../bower_components/ckeditor/ckeditor.js',
        'jquery-nestable-plugin': ['../bower_components/jquery-nestable/jquery.nestable.js'],
        'touchspin-plugin': ['../bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js', '../bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css'],


        //*** Filters
        'htmlToPlaintext': '../common/js/filters/htmlToPlaintext.js',
        'autoaskFilter': 'assets/js/filters/autoaskFilters.js',

        // ***************** autoask START ********************

        //*** Controllers
        'chatCtrl': 'assets/js/controllers/chatCtrl.js',
        'loginCtrl': 'assets/js/controllers/loginCtrl.js',

        //首页
        'faceCtrl': 'assets/js/controllers/faceCtrl.js',

        //本店信息更改
        'serviceProviderDetailCtrl': 'assets/js/controllers/service_provider/serviceProviderDetailCtrl.js',
        'serviceProviderModifyCtrl': 'assets/js/controllers/service_provider/serviceProviderModifyCtrl.js',
        'invoiceDetailCtrl': 'assets/js/controllers/service_provider/invoiceDetailCtrl.js',
        'invoiceModifyCtrl': 'assets/js/controllers/service_provider/invoiceModifyCtrl.js',
        'modifyPasswordCtrl': 'assets/js/controllers/account/modifyPasswordCtrl.js',
        'bindQRCodeDetailCtrl': 'assets/js/controllers/service_provider/bindQRCodeDetailCtrl.js',
        'bindQRCodeModifyCtrl': 'assets/js/controllers/service_provider/bindQRCodeModifyCtrl.js',

        //渠道管理
        //维修工相关
        'serviceProviderCtrl': 'assets/js/controllers/merchant/serviceProviderCtrl.js',
        'mechanicCtrl': 'assets/js/controllers/merchant/mechanicCtrl.js',

        //订单相关
        'orderAppointListCtrl': 'assets/js/controllers/order/orderAppointListCtrl.js',
        'orderOffLineListCtrl': 'assets/js/controllers/order/orderOffLineListCtrl.js',
        'orderCrashListCtrl': 'assets/js/controllers/order/orderCrashListCtrl.js',
        'orderDetailCtrl': 'assets/js/controllers/order/orderDetailCtrl.js',

        //分成相关
        'shareCtrl': 'assets/js/controllers/share/shareCtrl.js',
        'extraCtrl': 'assets/js/controllers/share/extraCtrl.js',
        'applyCtrl': 'assets/js/controllers/share/applyCtrl.js',
        'selfAccountCtrl': 'assets/js/controllers/share/selfAccountCtrl.js',

        //库存
        'goodsNumListCtrl': 'assets/js/controllers/goodsNum/goodsNumListCtrl.js',

        //通知公告
        'noticeItemCtrl': 'assets/js/controllers/notice/noticeItemCtrl.js',

        //*** Services
        'restProxyService': 'assets/js/services/common/restProxyService.js',
        'autoaskService': 'assets/js/services/autoask/autoaskService.js',
        'authService': 'assets/js/services/autoask/authService.js',
        'commonService': 'assets/js/services/common/commonService.js',
        'areaService': 'assets/js/services/autoask/areaService.js'
    },
    //*** angularJS Modules
    modules: [{
        name: 'angularMoment',
        files: ['../bower_components/angular-moment/angular-moment.min.js']
    }, {
        name: 'toaster',
        files: ['../bower_components/AngularJS-Toaster/toaster.js', '../bower_components/AngularJS-Toaster/toaster.css']
    }, {
        name: 'angularBootstrapNavTree',
        files: ['../bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js', '../bower_components/angular-bootstrap-nav-tree/dist/abn_tree.css']
    }, {
        name: 'angular-ladda',
        files: ['../bower_components/angular-ladda/dist/angular-ladda.min.js']
    }, {
        name: 'ngTable',
        files: ['../bower_components/ng-table/dist/ng-table.min.js', '../bower_components/ng-table/dist/ng-table.min.css']
    }, {
        name: 'ui.select',
        files: ['../bower_components/angular-ui-select/dist/select.min.js', '../bower_components/angular-ui-select/dist/select.min.css', '../bower_components/select2/dist/css/select2.min.css', '../bower_components/select2-bootstrap-css/select2-bootstrap.min.css', '../bower_components/selectize/dist/css/selectize.bootstrap3.css']
    }, {
        name: 'ui.mask',
        files: ['../bower_components/angular-ui-utils/mask.min.js']
    }, {
        name: 'ngImgCrop',
        files: ['../bower_components/ngImgCrop/compile/minified/ng-img-crop.js', '../bower_components/ngImgCrop/compile/minified/ng-img-crop.css']
    }, {
        name: 'angularFileUpload',
        files: ['../bower_components/angular-file-upload/angular-file-upload.min.js']
    }, {
        name: 'ngAside',
        files: ['../bower_components/angular-aside/dist/js/angular-aside.min.js', '../bower_components/angular-aside/dist/css/angular-aside.min.css']
    }, {
        name: 'truncate',
        files: ['../bower_components/angular-truncate/src/truncate.js']
    }, {
        name: 'monospaced.elastic',
        files: ['../bower_components/angular-elastic/elastic.js']
    }, {
        name: 'ngMap',
        files: ['../bower_components/ngmap/build/scripts/ng-map.min.js']
    }, {
        name: 'tc.chartjs',
        files: ['../bower_components/tc-angular-chartjs/dist/tc-angular-chartjs.min.js']
    }, {
        name: 'flow',
        files: ['../bower_components/ng-flow/dist/ng-flow-standalone.min.js']
    }, {
        name: 'uiSwitch',
        files: ['../bower_components/angular-ui-switch/angular-ui-switch.min.js', '../bower_components/angular-ui-switch/angular-ui-switch.min.css']
    }, {
        name: 'ckeditor',
        files: ['../bower_components/angular-ckeditor/angular-ckeditor.min.js']
    }, {
        name: 'mwl.calendar',
        files: ['../bower_components/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar.js', '../bower_components/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js', '../bower_components/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css']
    }, {
        name: 'ng-nestable',
        files: ['../bower_components/ng-nestable/src/angular-nestable.js']
    }, {
        name: 'vAccordion',
        files: ['../bower_components/v-accordion/dist/v-accordion.min.js', '../bower_components/v-accordion/dist/v-accordion.min.css']
    }, {
        name: 'xeditable',
        files: ['../bower_components/angular-xeditable/dist/js/xeditable.min.js', '../bower_components/angular-xeditable/dist/css/xeditable.css', '../common/js/config/config-xeditable.js']
    }, {
        name: 'checklist-model',
        files: ['../bower_components/checklist-model/checklist-model.js']
    }, {
        name: 'ngTagsInput',
        files: ['../common/js/directives/ng-tags-input.js', '../common/css/ng-tags/ng-tags-input.bootstrap.min.css', '../common/css/ng-tags/ng-tags-input.min.css']
    }, {
        name: 'angularBusy',
        files: ['../bower_components/angular-busy/angular-busy.min.css', '../bower_components/angular-busy/angular-busy.min.js']
    },{
        name:'angular-md5',
        files:[' ../bower_components/angular-md5/angular-md5.min.js']
    }]
});