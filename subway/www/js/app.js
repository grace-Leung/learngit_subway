// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'start.controllers', 'starter.services'])

  .run(function ($ionicPlatform, $location, $ionicPopup, $ionicHistory,$timeout) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      $timeout(function(){
        navigator.splashscreen.hide();
      },1000);

    });

    //  退出APP
    /*$ionicPlatform.registerBackButtonAction(function (e) {
      function showConfirm() {
        var confirmPopup = $ionicPopup.confirm({
          title: '<strong>退出应用?</strong>',
          template: '你确定要退出应用吗?',
          okText: '退出',
          cancelText: '取消'
        });

        confirmPopup.then(function (res) {
          if (res) {
            ionic.Platform.exitApp();
          } else {
            // Don't close
          }
        });
      }

      //  判断处于哪个页面时双击退出
      if ($location.path() == '/tab/home' || $location.path() == '/indexTidy') {
        showConfirm();
      } else {
        // This is the last page: Show confirmation popup
        $ionicHistory.goBack();
      }
      e.preventDefault();
      return false;
    }, 101);*/

    /*$ionicPlatform.registerBackButtonAction(function (e) {
      if ($location.path() == '/tab/home' || $location.path() == '/indexTidy') {
        $scope.exitPop = {};
        $scope.exitPop.optionsPopup = $ionicPopup.show({
          templateUrl: "templates/exitDialog.html",
          scope: $scope
        });
      }
      return false;
    }, 101);

    //  退出应用
    $scope.exitApp = function(){
      ionic.Platform.exitApp();
    }
    //  取消退出
    $scope.cancelExit = function(){
      $scope.exitPop.optionsPopup.close();
    }*/
  })
  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    /*$ionicNativeTransitionsProvider.setDefaultOptions({
     duration: 200, // in milliseconds (ms), default 400,
     slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
     iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
     androiddelay: -1, // same as above but for Android, default -1
     winphonedelay: -1, // same as above but for Windows Phone, default -1,
     fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
     fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
     triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
     backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
     });
     $ionicNativeTransitionsProvider.setDefaultTransition({
     type: 'slide',
     direction: 'right'
     });

     $ionicNativeTransitionsProvider.setDefaultBackTransition({
     type: 'slide',
     direction: 'left'
     });*/

    //  设置Tab样式和位置
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');


    $stateProvider

    /*------------------------------完整版----------------------------------------------------*/
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tab.html',
        controller: 'TabCtrl'
      })

      //  首页
      .state('tab.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: 'templates/tab-home.html',
            controller: 'HomeCtrl'
          }
        }
      })


      //  在线购票
      .state('subway', {
        url: '/subway',
        templateUrl: 'templates/tab-home/subway.html',
        controller: 'SubwayCtrl'
      })

      //  起点选择
      .state('selectStart', {
        url: '/selectStart',
        templateUrl: 'templates/tab-home/selectStart.html',
        controller: 'SelectStartCtrl'
      })

      //  终点选择
      .state('selectEnd', {
        url: '/selectEnd/:selectStartId',
        templateUrl: 'templates/tab-home/selectEnd.html',
        controller: 'SelectEndCtrl'
      })

      //  购票结果
      .state('result', {
        url: '/result/:resultStId&:resultEdId&:isLocal',
        templateUrl: 'templates/tab-home/result.html',

        controller: 'ResultCtrl'
      })

      //  我的订单
      .state('orderTab', {
        url: '/orderTab',
        abstract: true,
        templateUrl: 'templates/orderTab.html'
      })

      //  未付款
      .state('orderTab.notPay', {
        url: '/notPay',
        views: {
          'orderTab-notPay': {
            templateUrl: 'templates/orderTab-notPay.html',
            controller: 'NotPayCtrl'
          }
        }
      })

      //  未使用
      .state('orderTab.notUse', {
        url: '/notUse',
        views: {
          'orderTab-notUse': {
            templateUrl: 'templates/orderTab-notUse.html',
            controller: 'NotUseCtrl'
          }
        }
      })

      //  已失效
      .state('orderTab.noUse', {
        url: '/noUse',
        views: {
          'orderTab-noUse': {
            templateUrl: 'templates/orderTab-noUse.html',
            controller: 'NoUseCtrl'
          }
        }
      })

      //  地标检索
      .state('point', {
        url: '/point',
        templateUrl: 'templates/tab-home/point.html',
        controller: 'PointCtrl'
      })


      //  赛吧-新闻
      .state('tab.pubNews', {
        url: '/pubNews',
        views: {
          'tab-pub': {
            templateUrl: 'templates/tab-pubNews.html',
            controller: 'PubNewsCtrl'
          }
        }
      })

      //  赛吧-新闻详情
      .state('contentDetail', {
        url: '/contentDetail/:id',
        templateUrl: 'templates/tab-pub/contentDetail.html',
        controller: 'ContentDetailCtrl'

      })

      //  赛吧-求助
      .state('tab.pubHelp', {
        url: '/pubHelp',
        views: {
          'tab-pub': {
            templateUrl: 'templates/tab-pubHelp.html',
            controller: 'PubHelpCtrl'
          }
        }
      })

      //  赛吧-发送求助
      .state('sendPub4Help', {
        url: '/sendPub4Help',
        templateUrl: 'templates/tab-pub/sendPub4Help.html',
        controller: 'SendPub4HelpCtrl'

      })

      //  赛吧-转发
      .state('transmit', {
        url: '/transmit/:flag',
        templateUrl: 'templates/tab-pub/transmit.html',
        controller: 'TransmitCtrl'

      })

      //  赛吧-发送新鲜事
      .state('sendPub4News', {
        url: '/sendPub4News',
        templateUrl: 'templates/tab-pub/sendPub4News.html',
        controller: 'SendPub4NewsCtrl'

      })

      //  赛吧-我的动态
      .state('myPub', {
        url: '/myPub',
        templateUrl: 'templates/tab-pub/myPub.html',
        controller: 'MyPubCtrl'

      })

      //  赛吧-我的消息
      .state('myMessage', {
        url: '/myMessage',
        templateUrl: 'templates/tab-pub/myMessage.html',
        controller: 'MyMessageCtrl'

      })

      //  搜索-搜索新鲜事
      .state('search4News', {
        url: '/search4News',
        templateUrl: 'templates/tab-pub/search4News.html',
        cache: false,
        controller: 'Search4NewsCtrl'

      })

      //  搜索-搜索求助
      .state('search4Help', {
        url: '/search4Help',
        templateUrl: 'templates/tab-pub/search4Help.html',
        cache: false,
        controller: 'Search4HelpCtrl'

      })


      //  发现TAB-DT1
      .state('tab.dt1', {
        url: '/dt1',
        views: {
          'discoverTab-dt1': {
            templateUrl: 'templates/tab-discover/dt1.html',
            controller: 'Dt1Ctrl'
          }
        }
      })

      //  发现TAB-DT2
      .state('tab.dt2', {
        url: '/dt2',
        views: {
          'discoverTab-dt2': {
            templateUrl: 'templates/tab-discover/dt2.html',
            controller: 'Dt2Ctrl'
          }
        }
      })

      //  发现TAB-DT3
      .state('tab.dt3', {
        url: '/dt3',
        views: {
          'discoverTab-dt3': {
            templateUrl: 'templates/tab-discover/dt3.html',
            controller: 'Dt3Ctrl'
          }
        }
      })

      //  地标
      .state('landmark', {
        url: '/landmark/:id',
        templateUrl: 'templates/tab-discover/landmark.html',
        controller: 'LandmarkCtrl'
      })

      //  地标详情
      .state('landmarkDetail', {
        url: '/landmarkDetail/:row&:col',
        templateUrl: 'templates/tab-discover/landmarkDetail.html',
        controller: 'LandmarkDetailCtrl'
      })

      //  搜索站点
      .state('searchStation', {
        url: '/searchStation',
        templateUrl: 'templates/tab-discover/searchStation.html',
        controller: 'SearchStationCtrl'
      })

      //  搜索地标
      .state('searchPoint', {
        url: '/searchPoint',
        templateUrl: 'templates/tab-discover/searchPoint.html',
        controller: 'SearchPointCtrl'
      })

      //  我的
      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      })

      //  支付记录
      .state('payRecord', {
        url: '/payRecord',
        templateUrl: 'templates/tab-account/payRecord.html',
        controller: 'PayRecordCtrl'
      })

      //  支付方式
      .state('payWay', {
        url: '/payWay',
        templateUrl: 'templates/tab-account/payWay.html',
        controller: 'PayWayCtrl'
      })

      //  账户安全
      .state('safe', {
        url: '/safe',
        templateUrl: 'templates/tab-account/safe.html',
        controller: 'SafeCtrl'
      })

      //  添加支付方式
      .state('morePayWay', {
        url: '/morePayWay',
        templateUrl: 'templates/tab-account/morePayWay.html',
        controller: 'MorePayWayCtrl'
      })

      //  用户安全详情
      .state('safeDetail', {
        url: '/safeDetail',
        templateUrl: 'templates/tab-account/safeDetail.html',
        controller: 'SafeDetailCtrl'
      })

      //  系统消息
      .state('systemMessage', {
        url: '/systemMessage',
        templateUrl: 'templates/tab-account/systemMessage.html',
        controller: 'SystemMessageCtrl'
      })

      //  系统设置
      .state('setting', {
        url: '/setting',
        templateUrl: 'templates/tab-account/setting.html',
        controller: 'SettingCtrl'
      })

      //  语言设置
      .state('setLang', {
        url: '/setLang',
        templateUrl: 'templates/setting/setLang.html',
        controller: 'SetLangCtrl'
      })

      //  环保贡献
      .state('enpt', {
        url: '/enpt',
        templateUrl: 'templates/tab-account/enpt.html',
        animation: "slide-in-up",
        controller: 'EnptCtrl'
      })

      //  环保贡献详情
      .state('enptDetail', {
        url: '/enptDetail',
        templateUrl: 'templates/tab-account/enptDetail.html',
        animation: "slide-in-up",
        controller: 'EnptDetailCtrl'
      })

      //  编辑用户信息
      .state("edit", {
        url: '/edit',
        templateUrl: 'templates/tab-account/edit.html',
        controller: 'EditCtrl'
      })


      /*------------------------------精简版----------------------------------------------------*/

      //  首页
      .state("indexTidy", {
        url: '/indexTidy',
        templateUrl: 'templates/indexTidy.html',
        controller: 'IndexTidyCtrl'
      })

      //  个人二维码
      .state("personCodeTidy", {
        url: '/personCodeTidy',
        templateUrl: 'templates/tidy/personCode.html',
        controller: 'PersonCodeTidyCtrl'
      })

      //  地铁搜索
      .state("subwaySearch", {
        url: '/subwaySearch',
        templateUrl: 'templates/tidy/subwaySearch.html',
        controller: 'SubwaySearchCtrl'
      })

      //  设置
      .state("settingTidy", {
        url: '/settingTidy',
        templateUrl: 'templates/tidy/settingTidy.html',
        controller: 'SettingTidyCtrl'
      })

      //  钱包
      .state("wallet", {
        url: '/wallet',
        templateUrl: 'templates/tidy/wallet.html',
        controller: 'WalletCtrl'
      })

      //  语音
      .state("speech", {
        url: '/speech',
        templateUrl: 'templates/tidy/speech.html',
        controller: 'SpeechCtrl'
      })

      //  地铁图Tidy
      .state("subwayTidy", {
        url: '/subwayTidy/:stId&:edId',
        templateUrl: 'templates/tidy/subwayTidy.html',
        controller: 'SubwayTidyCtrl'
      })

      //  线路详情
      .state("wayDetail", {
        url: '/wayDetail/:st&:ed&:isChange',
        templateUrl: 'templates/tidy/wayDetail.html',
        controller: 'WayDetailCtrl'
      })

      //  地铁站
      .state("subwayStation", {
        url: '/subwayStation',
        templateUrl: 'templates/tidy/subwayStation.html',
        controller: 'SubwayStationCtrl'
      })

      //  地铁站详情
      .state("staDetail", {
        url: '/staDetail/:lineIndex&:id',
        templateUrl: 'templates/tidy/staDetail.html',
        controller: 'StaDetailCtrl'
      })

      //  地标搜索
      .state("landmarkSearch", {
        url: '/landmarkSearch',
        templateUrl: 'templates/tidy/landmarkSearch.html',
        controller: 'LandmarkSearchCtrl'
      })

      //  地标搜索
      .state("landmarkChoose", {
        url: '/landmarkChoose/:id',
        templateUrl: 'templates/tidy/landmarkChoose.html',
        controller: 'LandmarkChooseCtrl'
      })

      //  地铁站详情
      .state("landmarkDetailTidy", {
        url: '/landmarkDetailTidy/:lineIndex&:id&:flag',
        templateUrl: 'templates/tidy/landmarkDetailTidy.html',
        controller: 'LandmarkDetailTidyCtrl'
      })

      //  地铁设施
      .state("facility", {
        url: '/facility',
        templateUrl: 'templates/tidy/facility.html',
        controller: 'FacilityCtrl'
      })

      //  系统消息
      .state("systemMessageTidy", {
        url: '/systemMessageTidy',
        templateUrl: 'templates/tidy/systemMessageTidy.html',
        controller: 'SystemMessageTidyCtrl'
      })

      //  编辑个人信息
      .state("editTidy", {
        url: '/editTidy',
        templateUrl: 'templates/tidy/editTidy.html',
        controller: 'EditTidyCtrl'
      })

      //  设置语言
      .state('setLangTidy', {
        url: '/setLangTidy',
        templateUrl: 'templates/tidy/setLangTidy.html',
        controller: 'SetLangTidyCtrl'
      })


      /*------------------------------公共页面----------------------------------------------------*/

      //  登陆
      .state("login", {
        url: '/login',
        templateUrl: 'templates/login/login.html',
        controller: 'LoginCtrl'
      })

      //  选择版本
      .state("selectVersion", {
        url: '/selectVersion',
        templateUrl: 'templates/setting/selectVersion.html',
        controller: 'SelectVersionCtrl'
      })

      //  引导页面
      .state("lead", {
        url: '/lead',
        templateUrl: 'templates/lead.html',
        controller: 'LeadCtrl'
      });

    if (localStorage.isFirstIn != 1) {
      $urlRouterProvider.otherwise('/lead')
    } else if (localStorage.isTidy == 0) {
      //window.location.href = "#/tab/home";
      $urlRouterProvider.otherwise('/tab/home')
    } else if (localStorage.isTidy == 1) {
      //window.location.href = "#/indexTidy";
      $urlRouterProvider.otherwise('indexTidy')
    } else {
      //window.location.href = "#/selectVersion";
      $urlRouterProvider.otherwise('selectVersion')
    }
    // $urlRouterProvider.otherwise('/tab/home');

  });
/*.state('pay', {
 url: '/pay/:start&:end',
 templateUrl: 'templates/subwayPage/pay.html',
 controller: 'payCtrl'
 })*/
