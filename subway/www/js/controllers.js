/**
 * Created by wiky on 2016/6/8.
 */

angular.module('start.controllers', [])

/*------------------------------完整版----------------------------------------------------*/
//  主控制器
  .controller('FatherCtrl', ['$scope', 'Data', '$interval', '$timeout', '$ionicPlatform','$ionicPopup','$location','$ionicHistory', function ($scope, Data, $interval, $timeout, $ionicPlatform,$ionicPopup,$location,$ionicHistory) {

    $ionicPlatform.registerBackButtonAction(function (e) {
      if ($location.path() == '/tab/home' || $location.path() == '/indexTidy') {
        $scope.exitPop = {};
        $scope.exitPop.optionsPopup = $ionicPopup.show({
          templateUrl: "templates/exitDialog.html",
          scope: $scope
        });
      }else{
        $ionicHistory.goBack();
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
    }

    //localStorage.isTidy = 0;
    localStorage.isFirstIn = 1;
    localStorage.lang = 0;
    localStorage.isVist = 0;
    localStorage.isTiming = 0;
    localStorage.isLogin = 0;
    $scope.delayTime = 40;
    //  地铁数据
    $scope.subwayData = "";
    $scope.stations = "";
    $scope.ways = "";
    $scope.staData = "";

    $scope.pubHelpCon = "";
    $scope.pubHelpShow = false;

    //  用户头像
    $scope.userImg = "img/tab-home/notLogin.png";
    //  用户名
    $scope.userName = "未登陆";

    //  是否有消息提醒
    $scope.hasMessage = true;

    //  个人二维码倒计时
    $scope.homeMin = "15";
    $scope.homeSec = "0";

    //  创建数据库
    $scope.subwayDataBase = openDatabase('subwayDB', '', 'Test Database', 102400);

    //  地铁数据
    Data.getSubwayData().success(function (data) {
      $scope.subwayData = data;
    }).error(function () {
      alert('数据请求失败1!');
    });
    Data.getWays().success(function (data) {
      $scope.ways = data;
    }).error(function () {
      alert('数据请求失败2!');
    });
    Data.getNodes().success(function (data) {
      $scope.stations = data;
    }).error(function () {
      alert('数据请求失败3!');
    });
    Data.getStaData().success(function (data) {
      $scope.staData = data;
    }).error(function () {
      alert('数据请求失败3!');
    });

    //  提醒站起点/终点/时间
    $scope.noticeStName = "";
    $scope.noticeEdName = "";
    $scope.arriveMin = "";
    $scope.arriveSec = 10;


    // content高度
    $scope.windowHeight = window.innerHeight;
    $scope.windowWidth = window.innerWidth;
    $scope.dt1Height = $scope.windowHeight - 70 - 74 - 50;
    $scope.dt2Height = $scope.windowHeight - 70 - 74 - 50;
    $scope.dt3Height = $scope.windowHeight - 70 - 74 - 50;
    $scope.dt1Scroll = $scope.dt1Height * 0.6;
    //  indexTidy
    $scope.indexTidyHeight = window.innerHeight;
    $scope.indexTidyDiv1 = $scope.indexTidyHeight * 0.4;
    $scope.indexTidyImgTop = $scope.indexTidyHeight * 0.3;

    //  中文版
    $scope.nowLang = Data.getLnagCh();


    /*****  接受消息 *****/

    //  切换语言
    $scope.$on("changeLang", function (e, data) {
      if (data.lang == 0) {
        $scope.nowLang = Data.getLnagCh();
      } else {
        $scope.nowLang = Data.getLnagEn();
      }

    });

    //  开启到提醒
    $scope.$on("noticeStart", function (e, data) {
      $scope.noticeStName = $scope.subwayData.stations[data.id].name;
    });

    $scope.$on("personCode", function (e, data) {
      $scope.personCodeTiming = $interval(function () {
        if ($scope.homeSec == 0) {
          $scope.homeSec = 59;
          $scope.homeMin--;
        } else if ($scope.arriveSec < 10) {
          $scope.homeSec--;
          $scope.homeSec = '0' + $scope.homeSec;
        } else {
          $scope.homeSec--;
        }
      }, 1000);
    });

    $scope.$on("pubHelpMsg", function (e, data) {
      $scope.pubHelpCon = data.content;
      $scope.pubHelpShow = true;
    });

    $scope.$on("homeMsg", function (e, data) {
      $scope.userName = "未登录";
      $scope.userImg = "img/tab-home/notLogin.png";
    });

    $scope.$on("loginMsg", function (e, data) {
      //$scope.userName = data.userName;
      $scope.userName = "支付宝";
      $scope.userImg = "img/tab-account/user.png";
    });

    //  已阅读消息
    $scope.$on("readMsg", function (e, data) {
      $scope.hasMessage = false;
    });

    //  关闭提醒
    $scope.$on("cancelNotice", function (e, data) {
      $interval.cancel($scope.noticeTime);
      $timeout.cancel($scope.noticeOut);
      $scope.isTiming = false;
    });

    //  开启提醒
    $scope.isTiming = false;
    $scope.$on("startNotice", function (e, data) {
      //console.log(data.selectStartId+','+data.selectEndId);
      $scope.noticeStName = $scope.subwayData.stations[data.selectStartId].name;
      $scope.noticeEdName = $scope.subwayData.stations[data.selectEndId].name;
      if (data.selectStartId - 0 > data.selectEndId - 0) {
        $scope.arriveMin = $scope.ways.ways[data.selectEndId][data.selectStartId - 1].time;
      } else {
        $scope.arriveMin = $scope.ways.ways[data.selectStartId][data.selectEndId - 1].time;
      }
      $scope.isTiming = true;
      //  倒计时
      $scope.noticeTime = $interval(function () {
        if ($scope.arriveSec == 0) {
          $scope.arriveSec = 59;
          $scope.arriveMin--;
        } else if ($scope.arriveSec < 10) {
          $scope.arriveSec--;
          $scope.arriveSec = '0' + $scope.arriveSec;
        } else {
          $scope.arriveSec--;
        }
      }, 1000);

      //  到站震动提醒
      $scope.noticeOut = $timeout(function () {

      }, ($scope.arriveMin - 0) * 60 * 1000);
    });

    $scope.linkPage = function (pageUrl) {
      window.location.href = pageUrl;
    }

    //  线路颜色
    $scope.lineColor = ["red", "red", "green", "#4b8bf4", "#4b8bf4"];
    $scope.lineDic = [
      {"lineName": "1", "st": "湘湖", "ed": "文泽路"},
      {"lineName": "1", "st": "湘湖", "ed": "文泽路"},
      {"lineName": "2", "st": "钱江路", "ed": "朝阳"},
      {"lineName": "4", "st": "近江", "ed": "彭埠"}
    ];

  }])

  //  Tab
  .controller('TabCtrl', ['$scope', 'Data', function ($scope, Data) {
    //选项卡
    $scope.newsIsOn = true;
    $scope.helpIsOn = false;
    $scope.toggleCard1 = function () {
      if (!$scope.newsIsOn) {
        $("#news").css({"color": "#49c29d", "background-color": "#fff"});
        $("#help").css({"color": "#fff", "background-color": ""});
        $scope.newsIsOn = true;
        $scope.helpIsOn = false;
        window.location.href = "#/tab/pubNews";
      }
    }
    $scope.toggleCard2 = function () {
      if (!$scope.helpIsOn) {
        $("#news").css({"color": "#fff", "background-color": ""});
        $("#help").css({"color": "#49c29d", "background-color": "#fff"});
        $scope.newsIsOn = false;
        $scope.helpIsOn = true;
        window.location.href = "#/tab/pubHelp";
      }
    }

    $scope.isAddPub = false;
    //  发帖子
    $scope.sendPub = function () {
      $scope.isAddPub = !$scope.isAddPub;
    }

    //  跳转到我的动态
    $scope.tabToMyPub = function () {
      $scope.$emit("readMsg", {});
      $scope.linkPage("#/myPub");
    }

  }])


  //  首页
  .controller('HomeCtrl', ['$scope', 'Data', '$http', '$ionicPlatform', '$ionicModal', '$interval', '$ionicPopup', '$timeout', function ($scope, Data, $http, $ionicPlatform, $ionicModal, $interval, $ionicPopup, $timeout) {

    //  载入时局部刷新
    $scope.$on("$ionicView.beforeEnter", function () {
      if (localStorage.isLogin == 0) {
        $scope.$emit("homeMsg", {});
      }
    });

    //alert(window.innerHeight);
    $scope.cusWidth = window.innerHeight - 300;

    //  是否打开Modal
    $scope.isOpenModal = false;
    $scope.inWidth = 0;
    $scope.num = 9;

    //  到站提醒弹窗
    $scope.popupConfirm = {};
    $scope.popupNotice = {};


    //  打开到站提醒
    $scope.openNotice = function () {
      if (localStorage.isTiming != 1) {
        $scope.popupConfirm.optionsPopup = $ionicPopup.show({
          templateUrl: "templates/tab-home/notice1.html",
          scope: $scope
        });
      } else {
        $scope.popupNotice.optionsPopup = $ionicPopup.show({
          templateUrl: "templates/tab-home/notice2.html",
          scope: $scope
        });
      }
    };

    //  关闭弹窗1
    $scope.closePop1 = function () {
      $scope.popupConfirm.optionsPopup.close();
    };
    //  跳转到选择起点
    $scope.toSelectStart = function () {
      $scope.popupConfirm.optionsPopup.close();
      $scope.linkPage("#/selectStart");
    }
    //  取消提醒
    $scope.closePop2 = function () {
      $scope.$emit("cancelNotice", {});
      localStorage.isTiming = 0;
      $scope.popupNotice.optionsPopup.close();
      console.log("hello");
    };
    //  我知道了
    $scope.closePopNotice = function () {
      $scope.popupNotice.optionsPopup.close();
    };


    //  配置Modal
    $ionicModal.fromTemplateUrl("templates/tab-home/personCode.html", {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      $scope.modal = modal;
    });

    //  打开Modal
    $scope.toPersonCode = function () {
      $scope.modal.show();
      if (!$scope.isOpenModal) {
        $scope.isOpenModal = !$scope.isOpenModal;
        var personCode = new QRCode("personCode", {
          width: 128,
          height: 128
        });
        personCode.makeCode("545236987141100324587");
        $scope.$emit("personCode", {});
        var t = $interval(function () {

          $scope.inWidth = $scope.inWidth + 0.22;
          $(".in").css("width", $scope.inWidth);
          if ($scope.inWidth > 200) {
            $scope.inWidth = 0;
            personCode.makeCode("hellojkhjkhkj");
          }

        }, 100);
      }
    }

    //  关闭Modal
    $scope.closePersonCode = function () {
      $scope.modal.hide();
    }
  }])



  //  在线购票
  .controller('SubwayCtrl', ['$scope', 'Data', '$http', '$ionicSideMenuDelegate', '$timeout', '$ionicModal', '$ionicPopup', function ($scope, Data, $http, $ionicSideMenuDelegate, $timeout, $ionicModal, $ionicPopup) {

    //  信息面板是否显示
    $scope.isShow = false;
    $scope.arr = [0, 31, 38];
    //  线路透明度
    $scope.r1 = {opacity: 1};
    $scope.r2 = {opacity: 1};
    $scope.r3 = {opacity: 1};

    //  线路选择按钮样式
    $scope.way1 = {"button": true, "button-assertive": true};
    $scope.way2 = {"button": true, "button-balanced": true};
    $scope.way3 = {"button": true, "button-positive": true};

    //  右侧菜单栏按钮样式
    $scope.sAfter = {'background-color': 'gray', 'color': '#fff'};
    $scope.sBefore = {'color': 'gray'};

    //右侧菜单栏按钮样式初始化
    $scope.s1 = $scope.sAfter;
    $scope.s2 = $scope.sBefore;

    //  线路选择按钮状态
    $scope.flag = true;

    //  起点/终点图标显示状态
    $scope.showSTPoint = false;
    $scope.showEDPoint = false;

    //  起点/终点按钮选择状态
    $scope.isStart = false;
    $scope.isEnd = false;

    // 线路信息
    $scope.selectWay = {};
    $scope.selectWay.stName = "起点";
    $scope.selectWay.edName = "终点";

    //  导航栏右边按钮内容
    $scope.rightBtn = "收藏";

    //元素获取
    var stPoint = document.getElementById("subwayStPoint");
    var edPoint = document.getElementById("subwayEdPoint");
    var result = document.getElementById("subwayResult");

    //  右侧按钮状态
    $scope.flag_rightBtn = true;

    //ng-class
    $scope.isChoose = {"balanced-bg": true};

    $scope.startIndex = 0;
    $scope.endIndex = 1;

    //  路线类型选择
    $scope.choose = function (i) {
      //$scope.isChoose["balanced-bg"] = false;
      $("#choose0").css({"color": "#fff", "background-color": "#ccc"});
      $("#choose1").css({"color": "#fff", "background-color": "#ccc"});
      $("#choose" + i).css({"color": "#49c29d", "background-color": "#fff"});
    }

    //  线路选择按钮动画
    $scope.change = function () {
      $scope.isShow = !$scope.isShow;
    }

    //  线路选择
    $scope.opacity1 = function () {
      $scope.r1.opacity = 0.3;
    }


    //  右侧菜单栏
    $scope.isLike = true;
    $scope.history = function () {
      $scope.isLike = false;
      $scope.s2 = $scope.sAfter;
      $scope.s1 = $scope.sBefore;

    }
    $scope.like = function () {
      $scope.isLike = true;
      $scope.s1 = $scope.sAfter;
      $scope.s2 = $scope.sBefore;

    }


    //  点击站点事件
    var stTemp = 0;
    var enTemp = 0;
    //  显示起点
    $scope.showST = function (index, x, y) {
      $scope.rightBtn = "取消";
      stPoint.setAttribute("x", x - 0 - 16);
      stPoint.setAttribute("y", y - 0 - 37);
      $scope.showSTPoint = true;
      $scope.startIndex = index;
      $scope.selectWay.stName = $scope.subwayData.stations[index].name;
    }
    //  显示终点
    $scope.showED = function (index, x, y) {
      $scope.endIndex = index;
      if ($scope.startIndex-0 > index-0) {
        stTemp = index;
        enTemp = $scope.startIndex;
        $scope.selectWay.passLine = angular.copy($scope.ways.ways[stTemp][enTemp - 1].pass);
        $scope.selectWay.passLine.reverse();
      } else {
        stTemp = $scope.startIndex;
        enTemp = index;
        $scope.selectWay.passLine = angular.copy($scope.ways.ways[stTemp][enTemp - 1].pass);
      }
      $scope.selectWay.edName = $scope.subwayData.stations[index].name;
      $scope.selectWay.time = $scope.ways.ways[stTemp][enTemp - 1].time;
      $scope.selectWay.sumSta = $scope.ways.ways[stTemp][enTemp - 1].node.length;
      $scope.selectWay.money = 5;
      result.innerHTML = "";
      edPoint.setAttribute("x", x - 16);
      edPoint.setAttribute("y", y - 37);
      console.log($scope.startIndex + ',' + index);
      $scope.nodes = $scope.ways.ways[stTemp][enTemp - 1].node;
      $scope.line = $scope.ways.ways[stTemp][enTemp - 1].line;
      console.log($scope.ways.ways[stTemp][enTemp - 1].line);
      $scope.w1 = "0.3";
      $scope.w2 = "0.3";
      $scope.w4 = "0.3";
      $scope.showEDPoint = true;
      //  动态生成经过线路
      var passLine = document.getElementById("subwayPassLine");
      passLine.innerHTML = "";
      console.log(passLine);
      for (var i = 0; i < $scope.selectWay.passLine.length; i++) {
        var img = document.createElement("img");
        img.setAttribute("src", "img/number/" + $scope.selectWay.passLine[i] + ".png");
        img.setAttribute("height", "16");
        img.setAttribute("width", "16");
        passLine.appendChild(img);
        if (i + 1 != $scope.selectWay.passLine.length) {
          var spanLine = document.createElement("span");
          spanLine.innerHTML = "----->";
          spanLine.style.color = "gray";
          passLine.appendChild(spanLine);
        }
      }
      //  绘制svg中地铁线路
      for (var i = 0; i < $scope.line.length; i++) {
        var line = document.createElementNS("http://www.w3.org/2000/svg", "path");
        line.setAttribute("d", $scope.subwayData.router[$scope.line[i]].path);
        line.setAttribute("stroke-width", "3");
        line.setAttribute("stroke", $scope.subwayData.router[$scope.line[i]].color);
        result.appendChild(line);
      }
      //  绘制svg中地铁站点
      for (var i = 0; i < $scope.nodes.length; i++) {
        var node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        node.setAttribute("cx", $scope.subwayData.stations[$scope.nodes[i]].x);
        node.setAttribute("cy", $scope.subwayData.stations[$scope.nodes[i]].y);
        node.setAttribute("r", "3");
        node.style.fill = "#fff";
        node.style.stroke = $scope.subwayData.stations[$scope.nodes[i]].color;
        //node.style.stroke = "black";
        text.setAttribute("x", $scope.subwayData.stations[$scope.nodes[i]].tx);
        text.setAttribute("y", $scope.subwayData.stations[$scope.nodes[i]].ty);
        text.style["font-family"] = "微软雅黑";
        text.style["font-size"] = "x-small";
        text.innerHTML = $scope.subwayData.stations[$scope.nodes[i]].name;
        text.style["text-anchor"] = $scope.subwayData.stations[$scope.nodes[i]].anchor;
        result.appendChild(node);
        result.appendChild(text);
      }
    }

    $scope.selectStation = function (index, x, y) {
      if (!$scope.showSTPoint) {
        $scope.showST(index, x, y);
      } else {
        if (index == $scope.startIndex) {
          alert("起点和终点重合了");
        }
        else {
          $scope.showED(index, x, y);
        }
      }
    }

    //  导航栏右侧按钮点击事件
    $scope.towFunction = function () {
      if (!$scope.showSTPoint) {
        $ionicSideMenuDelegate.toggleRight();
      } else {
        $scope.subwayCancel();
      }
    };

    //  取消
    $scope.subwayCancel = function () {
      $scope.rightBtn = "收藏";
      $scope.selectWay.stName = "起点";
      $scope.selectWay.edName = "终点";
      $scope.showSTPoint = false;
      $scope.showEDPoint = false;
      $scope.isStart = false;
      result.innerHTML = "";
      $scope.w1 = "1";
      $scope.w2 = "1";
      $scope.w4 = "1";
    }

    //  指定线路透明
    $scope.opacity1 = function () {
      $scope.w1 = "1";
      $scope.w2 = "0.2";
      $scope.w4 = "0.2";
      $scope.line1 = "gray";
      $scope.line2 = "";
      $scope.line4 = "";
    }
    $scope.opacity2 = function () {
      $scope.w1 = "0.2";
      $scope.w2 = "1";
      $scope.w4 = "0.2";
      $scope.line1 = "";
      $scope.line2 = "gray";
      $scope.line4 = "";
    }
    $scope.opacity4 = function () {
      $scope.w1 = "0.2";
      $scope.w2 = "0.2";
      $scope.w4 = "1";
      $scope.line1 = "";
      $scope.line2 = "";
      $scope.line4 = "gray";
    }

    //  取消线路透明
    $scope.sub = function () {
      if (!$scope.showSTPoint) {
        $scope.w1 = "1";
        $scope.w2 = "1";
        $scope.w4 = "1";
        $scope.line1 = "";
        $scope.line2 = "";
        $scope.line4 = "";
      }
    }

    //  注册弹窗
    $scope.registerPop = {};
    //  确认购票窗口
    $scope.confirmBuy = {};

    //  跳转到购票结果
    $scope.subwayToResult = function () {
      if (localStorage.isLogin == 0) {
        $scope.registerPop.optionsPopup = $ionicPopup.show({
          templateUrl: "templates/tab-home/registerPop.html",
          scope: $scope
        });
      } else {
        $scope.confirmBuy.optionsPopup = $ionicPopup.show({
          templateUrl: "templates/tab-home/confirmBuyDialog.html",
          scope: $scope
        });
      }
    }

    //  关闭登录音提示
    $scope.colseRegisterPop = function () {
      $scope.registerPop.optionsPopup.close();
    }

    //  跳转到登陆界面
    $scope.toLogin = function () {
      $scope.linkPage("#/login");
      $scope.registerPop.optionsPopup.close();
    }
    
    //  确认购票
    $scope.toBuyTicket = function(){
      $scope.linkPage("#/result/" + $scope.startIndex + "&" + $scope.endIndex + "&0");
      $scope.confirmBuy.optionsPopup.close();
    }
    //  取消购票
    $scope.closeBuyDialog = function(){
      $scope.confirmBuy.optionsPopup.close();
    }


    //  配置选择站点Modal
    $ionicModal.fromTemplateUrl("templates/tab-home/subwayssModal.html", {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      $scope.modalss = modal;
    });

    //  站点数据
    $scope.sta = $scope.staData.stations[0];
    //$("#line1").css("background-color","red");
    //  线路索引
    $scope.lineIndex = 0;
    $("#line1ss").css("background-color", "#fff");
    $scope.changeLine = function (i) {
      $("#line0ss").css("background-color", "#f2f2f2");
      $("#line1ss").css("background-color", "#f2f2f2");
      $("#line2ss").css("background-color", "#f2f2f2");
      $("#line3ss").css("background-color", "#f2f2f2");
      $("#line4ss").css("background-color", "#f2f2f2");
      $("#line" + (i + 1) + "ss").css("background-color", "#fff");
      $scope.lineIndex = i;
      if (i == -1) {
        $scope.sta = $scope.subwayData.stations;
      } else {
        $scope.sta = $scope.staData.stations[i];
      }
    }
    //  打开选择起点Modal
    $scope.isSelectSt = false;
    $scope.isSelectEd = false;
    $scope.openssModal = function () {
      if (!$scope.showEDPoint) {
        $scope.isSelectSt = true;
        $scope.modalss.show();
      }
    }


    //  关闭选择起点Modal
    $scope.closessModal = function () {
      $scope.isSelectSt = false;
      $scope.isSelectEd = false;
      $scope.modalss.hide();
    }

    //  打开选择终点Modal
    $scope.openedModal = function () {
      if ($scope.showSTPoint) {
        $scope.isSelectEd = true;
        $scope.modalss.show();
      } else {
        alert("请先选择起点");
      }
      console.log($scope.isSelectSt);
    }

    //  关闭选择终点Modal
    $scope.closeedModal = function () {
      $scope.isSelectEd = false;
      $scope.modalss.hide();
    }

    $scope.selectSS = function (index) {
      if ($scope.isSelectSt) {
        $scope.showST(index, $scope.subwayData.stations[index].x, $scope.subwayData.stations[index].y);
        $scope.isSelectSt = false;
      }
      else {
        $scope.showED(index, $scope.subwayData.stations[index].x, $scope.subwayData.stations[index].y);
      }

      $scope.modalss.hide();
    }

    //  根据收藏画线路图
    $scope.subwayDraw = function () {
      $scope.showST(11, $scope.subwayData.stations[11].x, $scope.subwayData.stations[11].y);
      $scope.showED(15, $scope.subwayData.stations[15].x, $scope.subwayData.stations[15].y);
      $ionicSideMenuDelegate.toggleRight();
    }

  }])


  //  起点选择
  .controller('SelectStartCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  站点数据
    $scope.sta = $scope.staData.stations[0];
    //$("#line1").css("background-color","red");
    //  线路索引
    $scope.lineIndex = 0;
    $("#line1ss").css("background-color", "#fff");
    $scope.changeLine = function (i) {
      $("#line0ss").css("background-color", "#f2f2f2");
      $("#line1ss").css("background-color", "#f2f2f2");
      $("#line2ss").css("background-color", "#f2f2f2");
      $("#line3ss").css("background-color", "#f2f2f2");
      $("#line4ss").css("background-color", "#f2f2f2");
      $("#line" + (i + 1) + "ss").css("background-color", "#fff");
      $scope.lineIndex = i;
      if (i == -1) {
        $scope.sta = $scope.subwayData.stations;
      } else {
        $scope.sta = $scope.staData.stations[i];
      }
    }
    //  提醒站起点
    $scope.selectStartNotice = function (index) {
      $scope.linkPage("#/selectEnd/" + index);
    }
  }])

  //  终点选择
  .controller('SelectEndCtrl', ['$scope', 'Data', '$stateParams', function ($scope, Data, $stateParams) {
    //  站点数据
    $scope.sta = $scope.staData.stations[0];
    //$("#line1").css("background-color","red");
    //  线路索引
    $scope.lineIndex = 0;
    $("#line1se").css("background-color", "#fff");
    $scope.changeLine = function (i) {
      $("#line0se").css("background-color", "#f2f2f2");
      $("#line1se").css("background-color", "#f2f2f2");
      $("#line2se").css("background-color", "#f2f2f2");
      $("#line3se").css("background-color", "#f2f2f2");
      $("#line4se").css("background-color", "#f2f2f2");
      $("#line" + (i + 1) + "se").css("background-color", "#fff");
      $scope.lineIndex = i;
      if (i == -1) {
        $scope.sta = $scope.subwayData.stations;
      } else {
        $scope.sta = $scope.staData.stations[i];
      }
    }

    //  提醒站终点
    $scope.selectEndNotice = function (index) {
      $scope.$emit("startNotice", {selectStartId: $stateParams.selectStartId, selectEndId: index});
      localStorage.isTiming = 1;
      $scope.linkPage("#/tab/home");
    }
  }])


  //  购票结果
  .controller('ResultCtrl', ['$scope', 'Data', '$ionicPopup', '$interval', '$timeout', '$ionicHistory', '$stateParams', function ($scope, Data, $ionicPopup, $interval, $timeout, $ionicHistory, $stateParams) {
    //  起点和终点索引
    $scope.resultStId = $stateParams.resultStId;
    $scope.resultEdId = $stateParams.resultEdId;
    $scope.stPoint = $scope.subwayData.stations[$scope.resultStId].name;
    $scope.edPoint = $scope.subwayData.stations[$scope.resultEdId].name;

    //  取票码
    $scope.ticketCode = "371205";

    //  票面信息
    $scope.ticket = {};
    $scope.ticket.date = "5月20日 星期天";
    $scope.ticket.id = 1231545649;
    $scope.ticket.money = 11;
    $scope.ticket.payWay = "支付宝";
    $scope.ticket.points = 122;

    $scope.likeContent = "收藏路线";
    $scope.isLike = false;

    //  回退
    $scope.resultToBack = function () {
      $ionicHistory.goBack();
    }

    $scope.likeRouter = function () {
      if ($scope.isLike) {
        $scope.isLike = false;
        $("#likeImg").css({top: "-14px", opacity: "1"});
        $scope.likeContent = "收藏路线";

      } else {
        $scope.isLike = true;
        $("#likeImg").animate({
          top: "-=20px",
          opacity: "0"
        }, 1000)
        $scope.likeContent = "已收藏";

      }
    }

    //  绘制二维码
    $scope.barcodeInfo = {};
    $scope.barcodeInfo.st = "1";
    $scope.barcodeInfo.ed = "2";
    var qrcode = new QRCode("barcode", {
      width: 128,
      height: 128
    });

    //qrcode.makeCode(JSON.stringify($scope.barcodeInfo));
    qrcode.makeCode(angular.toJson($scope.barcodeInfo));

    //  申请退票信息弹窗
    $scope.popup = {};
    $scope.popupSucceed = {};

    //  打开弹窗
    $scope.ticketOut = function () {
      $scope.popup.optionsPopup = $ionicPopup.show({
        templateUrl: "templates/tab-home/confirm.html",
        scope: $scope
      });
    };

    var countOptions = {
      useEasing: true,
      useGrouping: true,
      separator: '',
      decimal: '',
      prefix: '',
      suffix: ''
    };
    var demo = new countUp("resultEnptPoint", 0, $scope.ticket.points, 0, 3, countOptions);
    demo.start();

    //  关闭弹窗
    $scope.closePop = function () {
      $scope.popup.optionsPopup.close();
    };

    //  环形计时1
    $scope.h1 = 0;
    $scope.m1 = 12;
    $scope.t1 = ($scope.h1 * 60 + $scope.m1) * 1000;
    var myCircle1 = Circles.create({
      id: 'circles-1',
      radius: 35,
      value: 100,
      maxValue: 100,
      width: 3,
      text: function () {
        if ($scope.m1 < 10) {
          return $scope.h1 + ":0" + $scope.m1;
        } else {
          return $scope.h1 + ":" + $scope.m1;
        }
      },
      colors: ['#c0e6de', '#49c29d'],
      duration: $scope.t1,
      wrpClass: 'circles-wrp',
      textClass: 'circles-text',
      valueStrokeClass: 'circles-valueStroke',
      maxValueStrokeClass: 'circles-maxValueStroke',
      styleWrapper: true,
      styleText: true
    });

    //  环形计时2
    $scope.h2 = 3;
    $scope.m2 = 3;
    $scope.t2 = ($scope.h2 * 60 + $scope.m2) * 1000;
    var myCircle2 = Circles.create({
      id: 'circles-2',
      radius: 35,
      value: 100,
      maxValue: 100,
      width: 3,
      text: function () {
        if ($scope.m2 < 10) {
          return $scope.h2 + ":0" + $scope.m2;
        } else {
          return $scope.h2 + ":" + $scope.m2;
        }
      },
      colors: ['#c0e6de', '#49c29d'],
      duration: $scope.t2,
      wrpClass: 'circles-wrp',
      textClass: 'circles-text',
      valueStrokeClass: 'circles-valueStroke',
      maxValueStrokeClass: 'circles-maxValueStroke',
      styleWrapper: true,
      styleText: true
    });

    //  环形计时3
    var myCircle3 = Circles.create({
      id: 'circles-3',
      radius: 35,
      value: 100,
      maxValue: 100,
      width: 3,
      text: "22:30",
      colors: ['#c0e6de', '#49c29d'],
      duration: 0,
      wrpClass: 'circles-wrp',
      textClass: 'circles-text',
      valueStrokeClass: 'circles-valueStroke',
      maxValueStrokeClass: 'circles-maxValueStroke',
      styleWrapper: true,
      styleText: true
    });

    //  计时动画
    var interval1 = $interval(function () {
      if ($scope.h1 == 0 && $scope.m1 == 0) {
        myCircle1.update(0, 10);
        $timeout(function () {
          $scope.h1 = 0;
          $scope.m1 = 50;
          $scope.t1 = ($scope.h1 * 60 + $scope.m1) * 1000;
          myCircle1.update(100, $scope.t1);
        }, 50);
      } else if ($scope.m1 == 0) {
        $scope.m1 = 59;
        $scope.h1--;
      } else {
        $scope.m1--;
      }
    }, 1000);
    var interval2 = $interval(function () {
      if ($scope.h2 == 0 && $scope.m2 == 0) {
        myCircle2.update(0, 10);
        $timeout(function () {
          $scope.h2 = 0;
          $scope.m2 = 50;
          $scope.t2 = ($scope.h2 * 60 + $scope.m2) * 1000;
          myCircle2.update(100, $scope.t2);
        }, 50);
      } else if ($scope.m2 == 0) {
        $scope.m2 = 59;
        $scope.h2--;
      } else {
        $scope.m2--;
      }
    }, 1000);


    /*console.log($scope.resultStId +"," +$scope.resultEdId);
     console.log($scope.resultStId-0 >$scope.resultEdId-0);*/
    /*    $scope.stId = 3;
     $scope.edId = 38;*/
    //  经过线路
    if ($scope.resultStId - 0 > $scope.resultEdId - 0) {
      $scope.way = $scope.ways.ways[$scope.resultEdId][$scope.resultStId - 1];
      $scope.crossLine = angular.copy($scope.way.pass).reverse();
      $scope.passPath = angular.copy($scope.way.line).reverse();
      $scope.way.sta = angular.copy($scope.way.node).reverse();
    } else {
      $scope.way = $scope.ways.ways[$scope.resultStId][$scope.resultEdId - 1];
      console.log($scope.way);
      $scope.crossLine = $scope.way.pass;
      $scope.passPath = $scope.way.line;
      $scope.way.sta = $scope.way.node;
    }

    //  svg宽度
    $scope.passStaWidth = ($scope.way.node.length + 2) * 40;

    //  线路站点
    var para = document.getElementById("resultPassedLines");
    for (var i = 0; i < $scope.crossLine.length; i++) {
      var spanText = document.createElement("span");
      spanText.innerHTML = $scope.crossLine[i] + "号线";
      spanText.style.color = $scope.lineColor[$scope.crossLine[i]];
      para.appendChild(spanText);
      if (i + 1 != $scope.crossLine.length) {
        var spanLine = document.createElement("span");
        spanLine.innerHTML = "--->";
        spanLine.style.color = "green";
        spanLine.style.margin = "0px 10px";
        para.appendChild(spanLine);
      }
    }

    var passStation = document.getElementById("resultPassStation");

    for (i = 0; i < $scope.passPath.length; i++) {
      var line = document.createElementNS("http://www.w3.org/2000/svg", "path");
      line.setAttribute("d", "M" + (i + 1) * 40 + ",10 l40,0");
      line.setAttribute("stroke-width", "6");
      line.setAttribute("stroke", $scope.subwayData.router[$scope.passPath[i]].color);
      line.style["stroke-linecap"] = "round";
      passStation.appendChild(line);
    }

    for (i = 0, p = 40; i < $scope.way.sta.length; i++, p += 40) {
      var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      circle.setAttribute("cx", p + '');
      circle.setAttribute("cy", "10");
      circle.setAttribute("r", "2");
      circle.style.fill = "#fff";
      text.style['writing-mode'] = "tb";
      text.setAttribute("x", p + '');
      text.setAttribute("y", "25");
      text.innerHTML = $scope.subwayData.stations[$scope.way.sta[i]].name;
      passStation.appendChild(circle);
      passStation.appendChild(text);
    }
  }])


  //  订单-未付款
  .controller('NotPayCtrl', ['$scope', 'Data', function ($scope, Data) {
    $scope.notPayList = Data.getNotPayList();
  }])

  //  订单-未使用
  .controller('NotUseCtrl', ['$scope', 'Data', function ($scope, Data) {
    $scope.orderList = [{st: 4, ed: 7}, {st: 12, ed: 33}, {st: 3, ed: 25}];
    $scope.norUse2Result = function (stId, edId) {
      window.location.href = "#/result/" + stId + "&" + edId + "&1";
    }
  }])

  //  订单-无效
  .controller('NoUseCtrl', ['$scope', 'Data', function ($scope, Data) {
    //无效订单列表
    $scope.noUseList = Data.getNoUseList();
  }])

  //  赛吧-新闻
  .controller('PubNewsCtrl', ['$scope', 'Data', '$timeout', function ($scope, Data, $timeout) {
    //  载入时局部刷新
    $scope.$on("$ionicView.beforeEnter", function () {
      $scope.sta = $scope.subwayData.stations;
    });

    //  赛吧内容
    $scope.pubContent = Data.getPubContent();
    $scope.changeLine = function (i) {
      if (i == -1) {
        $scope.sta = $scope.subwayData.stations;
      } else {
        $scope.sta = $scope.stations.stations[i];
      }
    }
    //  赛吧内容刷新
    $scope.doRefresh = function () {
      $timeout(function () {
        $scope.pubContent.unshift({
          userImg: "img/tab-pub/user.png",
          user: "小猫",
          time: "16：60",
          place: "龙翔桥",
          hasImage: true,
          image: "img/tab-pub/uImg.jpg",
          content: "这个取票app真不错！！！",
          comment: 2,
          like: 1,
          good: 7
        });
        $scope.$broadcast("scroll.refreshComplete");
      }, 500);

    }

    //  特定站点赛吧内容
    $scope.pubStations = function () {
      $scope.pubContent.unshift({
        userImg: "img/tab-pub/user.png",
        user: "小猫",
        time: "16：60",
        place: "龙翔桥",
        hasImage: true,
        image: "img/tab-pub/uImg.jpg",
        content: "这个取票app真不错！！！",
        hasContact: false,
        contact: "",
        comment: 2,
        like: 1,
        good: 7
      });
    }

    //  跳转到详情
    $scope.toContentDetail = function () {
      window.location.href = "#/contentDetail/0";
    }

    //  跳转到搜索新闻
    $scope.toSearchNews = function () {
      window.location.href = "#/search4News";
    }

    //   跳转到转发
    $scope.toTransmit = function (index) {
      $scope.linkPage("#/transmit/0");
    }

  }])

  //  赛吧-详情
  .controller('ContentDetailCtrl', ['$scope', 'Data', '$stateParams', function ($scope, Data, $stateParams) {
    //  详情内容
    $scope.contentTitle = [];
    $scope.contentComment = [];
    if ($stateParams.id == 0) {
      $scope.contentTitle[0] = Data.getPubContent()[0];
      $scope.contentComment = Data.getNewsComment();
    } else {
      $scope.contentTitle[0] = Data.getPubContent4Help()[0];
      $scope.contentComment = Data.getHelpComment();
    }

    $scope.goBack = function () {
      if ($stateParams.id == 0) {
        window.location.href = "#/tab/pubNews";
      } else {
        window.location.href = "#/tab/pubHelp";
      }
    }

    //  是否从新闻页跳转
    if ($stateParams.id == 0) {
      $scope.isNews = true;
    } else {
      $scope.isNews = false;
    }


  }])

  //  赛吧-求助
  .controller('PubHelpCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  载入时局部刷新
    $scope.$on("$ionicView.beforeEnter", function () {
      $scope.pubContent4Help = Data.getPubContent4Help();
    });
    $scope.items = [1, 2, 3, 4, 5, 6, 7, 8];
    //  跳转到详情
    $scope.toContentDetail = function () {
      window.location.href = "#/contentDetail/1";
    }

    //  跳转到搜索求助
    $scope.toSearchHelp = function () {
      window.location.href = "#/search4Help";
    }

    //  跳转到转发
    $scope.toTransmit = function (index) {
      $scope.linkPage("#/transmit/1");
    }

  }])

  //  赛吧-发送求助
  .controller('SendPub4HelpCtrl', ['$scope', 'Data', function ($scope, Data) {

  }])

  //  赛吧-发送新闻
  .controller('SendPub4NewsCtrl', ['$scope', 'Data', '$ionicModal', function ($scope, Data, $ionicModal) {
    //  选择的站点
    $scope.sendPub4NewsPosition = "";

    //  配置选择站点Modal
    $ionicModal.fromTemplateUrl("templates/tab-home/subwayssModal.html", {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      $scope.modal = modal;
    });

    //  站点数据
    $scope.sta = $scope.staData.stations[0];

    //  线路索引
    $scope.lineIndex = 0;
    $("#line1ss").css("background-color", "#fff");
    $scope.changeLine = function (i) {
      $("#line0ss").css("background-color", "#f2f2f2");
      $("#line1ss").css("background-color", "#f2f2f2");
      $("#line2ss").css("background-color", "#f2f2f2");
      $("#line3ss").css("background-color", "#f2f2f2");
      $("#line4ss").css("background-color", "#f2f2f2");
      $("#line" + (i + 1) + "ss").css("background-color", "#fff");
      $scope.lineIndex = i;
      if (i == -1) {
        $scope.sta = $scope.subwayData.stations;
      } else {
        $scope.sta = $scope.staData.stations[i];
      }
    }

    $scope.selectSS = function (index) {
      $scope.sendPub4NewsPosition = $scope.subwayData.stations[index].name;
      $scope.modal.hide();
    }

    //  打开modal
    $scope.openSp4nModal = function () {
      $scope.modal.show();
    }

    //  关闭modal
    $scope.closessModal = function () {
      $scope.modal.show();
    }

  }])

  //  赛吧-搜索新闻
  .controller('Search4NewsCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  搜索内容
    $scope.searchText = "";

    //  是否有结果
    $scope.hasResrult = false;

    //  搜索结果
    $scope.results = Data.getNewsResult();

    //  是否在输入
    $scope.isInput = false;
    $scope.hasInput = true;


    $scope.toInput = function () {
      $scope.isInput = true;
    }

    //  跳转到详情
    $scope.toDetail = function () {
      window.location.href = "#/contentDetail/0";
    }

    /*function calculateDiscount(newValue, oldValue, scope) {
     console.log(newValue);
     }
     $scope.$watch($scope.searchText, calculateDiscount);*/

    /*$scope.$watch($scope.searchText,function(newVal,oldVal){
     /!*if(newVal.length == 0)
     $scope.hasInput = false;
     else
     $scope.hasInput = true;*!/
     console.log(newVal);
     });*/

  }])

  //  赛吧-搜索求助
  .controller('Search4HelpCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  搜索内容
    $scope.searchText = "";

    //  是否有结果
    $scope.hasResrult = false;

    //  搜索结果
    $scope.results = Data.getHelpResult();

    //  是否在输入
    $scope.isInput = false;
    $scope.hasInput = true;


    $scope.toInput = function () {
      $scope.isInput = true;
    }

    //  跳转到详情
    $scope.toDetail = function () {
      window.location.href = "#/contentDetail/1";
    }
  }])


  //  赛吧-转发
  .controller('TransmitCtrl', ['$scope', 'Data', '$ionicHistory', '$stateParams', function ($scope, Data, $ionicHistory, $stateParams) {
    $scope.message = "";
    //  回退
    $scope.transmitToBack = function () {
      if ($stateParams.flag == 0) {
        $scope.linkPage("#/tab/pubNews");
      } else {
        $scope.linkPage("#/tab/pubHelp");
      }
    }

    //  发送
    $scope.transmitSend = function () {
      if ($stateParams.flag == 0) {
        $scope.linkPage("#/tab/pubNews");
      } else {
        $scope.$emit("pubHelpMsg", {content: $scope.message});
        $scope.linkPage("#/tab/pubHelp");
      }
    }

    $scope.left = function () {
      return 140;
    }
  }])

  //  赛吧-我的动态
  .controller('MyPubCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  详情内容
    $scope.contentTitle = [{
      userImg: "img/tab-pub/user.png",
      user: "小猫",
      time: "16：60",
      place: "龙翔桥",
      hasImage: true,
      image: "img/tab-pub/uImg.jpg",
      content: "这个取票app真不错！！！",
      comment: 2,
      like: 1,
      good: 7
    }];
    $scope.contentComment = [];
    $scope.contentComment = Data.getNewsComment();
  }])

  //  赛吧-我的消息
  .controller('MyMessageCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  消息列表
    $scope.messageList = Data.getMyMessage();
  }])

  //  发现
  .controller('DiscoverCtrl', ['$scope', 'Data', function ($scope, Data) {

  }])

  //  发现TAB-DT1
  .controller('Dt1Ctrl', ['$scope', 'Data', '$ionicScrollDelegate', '$ionicModal', function ($scope, Data, $ionicScrollDelegate, $ionicModal) {
    $scope.nearStation = "火车东站";
    //  选项卡状态
    $scope.dt1Card1Selected = true;
    $scope.dt1Card2Selected = false;
    $scope.dt1Card3Selected = false;
    //  选项卡点击事件
    $scope.dt1SelectCard = function (i) {

      if (i == 1) {
        $("#dt1Card1").css({"color": "red", "background-color": "#fff"});
        $("#dt1Card2").css({"color": "#fff", "background-color": ""});
        $("#dt1Card3").css({"color": "#fff", "background-color": ""});
      } else if (i == 2) {
        $("#dt1Card1").css({"color": "#fff", "background-color": ""});
        $("#dt1Card2").css({"color": "red", "background-color": "#fff"});
        $("#dt1Card3").css({"color": "#fff", "background-color": ""});
      } else {
        $("#dt1Card1").css({"color": "#fff", "background-color": ""});
        $("#dt1Card2").css({"color": "#fff", "background-color": ""});
        $("#dt1Card3").css({"color": "red", "background-color": "#fff"});
      }
      $("#dt1Map").attr("src", "img/tab-discover/map" + i + ".jpg");
    }

    // 原始大小
    $scope.nowZoom = 1;

    //  地铁图放大0.1
    $scope.dt1Bigger = function () {
      $ionicScrollDelegate.$getByHandle('dt1Scroll').zoomBy($scope.nowZoom + 0.1);
    }

    //  地铁图缩小0.1
    $scope.dt1Smaller = function () {
      $ionicScrollDelegate.$getByHandle('dt1Scroll').zoomBy($scope.nowZoom - 0.1);
    }

    //  配置选择站点Modal
    $ionicModal.fromTemplateUrl("templates/tab-home/subwayssModal.html", {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      $scope.modal = modal;
    });

    //  站点数据
    $scope.sta = $scope.staData.stations[0];

    //  线路索引
    $scope.lineIndex = 0;
    $("#line1ss").css("background-color", "#fff");
    $scope.changeLine = function (i) {
      $("#line0ss").css("background-color", "#f2f2f2");
      $("#line1ss").css("background-color", "#f2f2f2");
      $("#line2ss").css("background-color", "#f2f2f2");
      $("#line3ss").css("background-color", "#f2f2f2");
      $("#line4ss").css("background-color", "#f2f2f2");
      $("#line" + (i + 1) + "ss").css("background-color", "#fff");
      $scope.lineIndex = i;
      if (i == -1) {
        $scope.sta = $scope.subwayData.stations;
      } else {
        $scope.sta = $scope.staData.stations[i];
      }
    }

    $scope.selectSS = function (index) {
      $scope.nearStation = $scope.subwayData.stations[index].name;
      $scope.modal.hide();
    }

    $scope.dt1OpenModal = function () {
      $scope.modal.show();
    }
    $scope.closessModal = function () {
      $scope.modal.hide();
    }

  }])

  //  发现TAB-DT2
  .controller('Dt2Ctrl', ['$scope', 'Data', '$ionicScrollDelegate', '$ionicModal', function ($scope, Data, $ionicScrollDelegate, $ionicModal) {

    $scope.showLocPoint = false;

    //  获取元素
    var LocPoint = document.getElementById("location");

    //  线路信息
    $scope.dt2Way = {};

    //  判断前后是否有站点
    $scope.getDt2WayNext = function (index) {
      if ($scope.subwayData.stations[index + 1]) {
        $scope.dt2Way.next1 = $scope.subwayData.stations[index + 1].name;
        $scope.dt2Way.time1 = "3";
      } else {
        $scope.dt2Way.next1 = "--"
        $scope.dt2Way.time1 = "5";
      }
      if ($scope.subwayData.stations[index - 1]) {
        $scope.dt2Way.next2 = $scope.subwayData.stations[index - 1].name;
        $scope.dt2Way.time2 = "3";
      } else {
        $scope.dt2Way.next2 = "--"
        $scope.dt2Way.time2 = "5";
      }
    }

    //  获取线路信息
    $scope.getDt2Way = function (index) {
      if (index <= 30) {
        $scope.dt2Way.img = 1;
        $scope.dt2Way.st = "湘湖";
        $scope.dt2Way.ed = "临平";
        $scope.getDt2WayNext(index);

      } else if (index <= 37) {
        $scope.dt2Way.img = 4;
        $scope.dt2Way.st = "近江";
        $scope.dt2Way.ed = "彭埠";
        $scope.getDt2WayNext(index);
      } else {
        $scope.dt2Way.img = 2;
        $scope.dt2Way.st = "钱江路";
        $scope.dt2Way.ed = "朝阳";
        $scope.getDt2WayNext(index);
      }
    }


    //  显示定位点
    $scope.showLoc = function (x, y) {
      LocPoint.setAttribute("x", x - 0 - 16);
      LocPoint.setAttribute("y", y - 0 - 37);
      $scope.showLocPoint = true;
    }

    //  初始化
    $scope.nearStation = $scope.subwayData.stations[15].name;
    $scope.showLoc($scope.subwayData.stations[15].x, $scope.subwayData.stations[15].y);
    $scope.getDt2Way(15);

    //  选定站点
    $scope.showLocation = function (id, x, y) {
      $scope.nearStation = $scope.subwayData.stations[id].name;
      $scope.showLoc(x, y);
      $scope.getDt2Way(id);
    }

    //  配置选择站点Modal
    $ionicModal.fromTemplateUrl("templates/tab-home/subwayssModal.html", {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      $scope.modal = modal;
    });

    //  站点数据
    $scope.sta = $scope.staData.stations[0];

    //  线路索引
    $scope.lineIndex = 0;
    $("#line1ss").css("background-color", "#fff");
    $scope.changeLine = function (i) {
      $("#line0ss").css("background-color", "#f2f2f2");
      $("#line1ss").css("background-color", "#f2f2f2");
      $("#line2ss").css("background-color", "#f2f2f2");
      $("#line3ss").css("background-color", "#f2f2f2");
      $("#line4ss").css("background-color", "#f2f2f2");
      $("#line" + (i + 1) + "ss").css("background-color", "#fff");
      $scope.lineIndex = i;
      if (i == -1) {
        $scope.sta = $scope.subwayData.stations;
      } else {
        $scope.sta = $scope.staData.stations[i];
      }
    }

    $scope.selectSS = function (index) {
      $scope.nearStation = $scope.subwayData.stations[index].name;
      $scope.showLoc($scope.subwayData.stations[index].x, $scope.subwayData.stations[index].y);
      $scope.getDt2Way(index);
      $scope.modal.hide();
    }

    $scope.dt2OpenModal = function () {
      $scope.modal.show();
    }


    $scope.closessModal = function () {
      $scope.modal.hide();
    }

  }])

  //  发现TAB-DT3
  .controller('Dt3Ctrl', ['$scope', 'Data', function ($scope, Data) {
    $scope.toSearchPoint = function () {
      window.location.href = "#/searchPoint";
    }

    $scope.dt3ToPoint = function (i) {
      window.location.href = "#/landmark/" + i;
    }
  }])

  //  地标
  .controller('LandmarkCtrl', ['$scope', 'Data', '$stateParams', '$ionicModal', function ($scope, Data, $stateParams, $ionicModal) {
    //  地标名字
    $scope.landmarkName = Data.getLandmark()[$stateParams.id];
    //  地标下的内容
    $scope.landmarkContent = Data.getLandmarkContent()[0];
    //  地区
    $scope.areaId = 0;
    $scope.area = Data.getArea();
    //  当前地区
    $scope.nowArea = Data.getArea()[0];


    //  配置Modal
    $ionicModal.fromTemplateUrl("templates/tab-discover/selectArea.html", {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      $scope.modal = modal;
    });


    //  右侧按钮点击
    $scope.landmarkOpenModal = function () {
      $scope.modal.show();
    }

    //  关闭modal
    $scope.landMarkCloseModal = function () {
      $scope.modal.hide();
    }

    //  选择地区
    $scope.landmarkSelectArea = function (i) {
      $scope.areaId = i;
      $scope.nowArea = Data.getArea()[i];
      $scope.landmarkContent = Data.getLandmarkContent()[i];
      $scope.modal.hide();
    }

    //  选择地标
    $scope.selectLandmark = function (i) {
      window.location.href = "#/landmarkDetail/" + $scope.areaId + "&" + i;
    }
  }])

  //  地标详情
  .controller('LandmarkDetailCtrl', ['$scope', 'Data', '$stateParams', '$interval', '$timeout', '$ionicLoading', function ($scope, Data, $stateParams, $interval, $timeout, $ionicLoading) {
    //  返回
    $scope.landmarkDetailBack = function () {
      window.location.href = "#/landmark/" + $stateParams.row;
    }
    //  地点名
    $scope.placeName = Data.getLandmarkContent()[$stateParams.row][$stateParams.col];
    //  图片
    $scope.landmarkContentImg = "img/tab-discover/hospital/" + Data.getLandmarkContentImg()[$stateParams.row][$stateParams.col];
    $scope.ldmStaName = $scope.subwayData.stations[($stateParams.row - 0 * 4 + ($stateParams.col - 0))].name;

    //  锁定Slide
    /* $scope.lockSlide = function () {
     $ionicSlideBoxDelegate.enableSlide( false );
     }*/

    //  动车起点终点
    $scope.ldmStart = "湘湖";
    $scope.ldmEnd = "临平";

    //  收藏
    $scope.lmdFill = function () {

    }

    //  是否交换起点终点
    $scope.isChange = false;

    //  交换起点终点
    $scope.ldmExchange = function () {
      var temp = $scope.ldmStart;
      $scope.ldmStart = $scope.ldmEnd;
      $scope.ldmEnd = $scope.ldmStart;
      if (!$scope.isChange) {
        $("#ldm1").animate({left: '-100%'}, 200);
        $("#ldm2").animate({left: ($scope.windowWidth - 344) / 2}, 200);
        $scope.isChange = true;
      } else {
        $("#ldm1").animate({left: ($scope.windowWidth - 344) / 2}, 200);
        $("#ldm2").animate({left: '100%'}, 200);
        $scope.isChange = false;
      }
    }


    $scope.h1 = Math.floor(Math.random() * 3);
    $scope.m1 = Math.floor(Math.random() * 58) + 1;
    $scope.t1 = ($scope.h1 * 60 + $scope.m1) * 1000;
    var myCircle1 = Circles.create({
      id: 'circles-1',
      radius: 40,
      value: 100,
      maxValue: 100,
      width: 3,
      text: function () {
        if ($scope.m1 < 10) {
          return +$scope.h1 + ":0" + $scope.m1;
        } else {
          return $scope.h1 + ":" + $scope.m1;
        }
      },
      colors: ['#C0E6DE', '#49c29d'],
      duration: $scope.t1,
      wrpClass: 'circles-wrp',
      textClass: 'circles-text',
      valueStrokeClass: 'circles-valueStroke',
      maxValueStrokeClass: 'circles-maxValueStroke',
      styleWrapper: true,
      styleText: true
    });


    //  环形计时2
    $scope.h2 = Math.floor(Math.random() * 3) + 2;
    $scope.m2 = Math.floor(Math.random() * 58) + 1;
    $scope.t2 = ($scope.h2 * 60 + $scope.m2) * 1000;
    var myCircle2 = Circles.create({
      id: 'circles-2',
      radius: 40,
      value: 100,
      maxValue: 100,
      width: 3,
      text: function (value) {
        if ($scope.m2 < 10) {
          return $scope.h2 + ":0" + $scope.m2;
        } else {
          return $scope.h2 + ":" + $scope.m2;
        }
      },
      colors: ['#c0e6de', '#49c29d'],
      duration: $scope.t2,
      wrpClass: 'circles-wrp',
      textClass: 'circles-text',
      valueStrokeClass: 'circles-valueStroke',
      maxValueStrokeClass: 'circles-maxValueStroke',
      styleWrapper: true,
      styleText: true
    });

    //  环形计时3
    var myCircle3 = Circles.create({
      id: 'circles-3',
      radius: 40,
      value: 100,
      maxValue: 100,
      width: 3,
      text: "22:30",
      colors: ['#c0e6de', '#49c29d'],
      duration: 0,
      wrpClass: 'circles-wrp',
      textClass: 'circles-text',
      valueStrokeClass: 'circles-valueStroke',
      maxValueStrokeClass: 'circles-maxValueStroke',
      styleWrapper: true,
      styleText: true
    });

    //  环形计时4
    $scope.h4 = Math.floor(Math.random() * 3);
    $scope.m4 = Math.floor(Math.random() * 58) + 1;
    $scope.t4 = ($scope.h4 * 60 + $scope.m4) * 1000;
    var myCircle4 = Circles.create({
      id: 'circles-4',
      radius: 40,
      value: 100,
      maxValue: 100,
      width: 3,
      text: function (value) {
        if ($scope.m4 < 10) {
          return $scope.h4 + ":0" + $scope.m4;
        } else {
          return $scope.h4 + ":" + $scope.m4;
        }
      },
      colors: ['#c0e6de', '#49c29d'],
      duration: $scope.t4,
      wrpClass: 'circles-wrp',
      textClass: 'circles-text',
      valueStrokeClass: 'circles-valueStroke',
      maxValueStrokeClass: 'circles-maxValueStroke',
      styleWrapper: true,
      styleText: true
    });

    //  环形计时5
    $scope.h5 = Math.floor(Math.random() * 3) + 2;
    $scope.m5 = Math.floor(Math.random() * 58) + 1;
    $scope.t5 = ($scope.h5 * 60 + $scope.m5) * 1000;
    var myCircle5 = Circles.create({
      id: 'circles-5',
      radius: 40,
      value: 100,
      maxValue: 100,
      width: 3,
      text: function (value) {
        if ($scope.m5 < 10) {
          return $scope.h5 + ":0" + $scope.m5;
        } else {
          return $scope.h5 + ":" + $scope.m5;
        }
      },
      colors: ['#c0e6de', '#49c29d'],
      duration: $scope.t5,
      wrpClass: 'circles-wrp',
      textClass: 'circles-text',
      valueStrokeClass: 'circles-valueStroke',
      maxValueStrokeClass: 'circles-maxValueStroke',
      styleWrapper: true,
      styleText: true
    });

    //  环形计时6
    var myCircle6 = Circles.create({
      id: 'circles-6',
      radius: 40,
      value: 100,
      maxValue: 100,
      width: 3,
      text: "23:00",
      colors: ['#c0e6de', '#49c29d'],
      duration: 0,
      wrpClass: 'circles-wrp',
      textClass: 'circles-text',
      valueStrokeClass: 'circles-valueStroke',
      maxValueStrokeClass: 'circles-maxValueStroke',
      styleWrapper: true,
      styleText: true
    });
    $(".circles-text").css("font-size", "20px");

    //  计时动画
    var interval1 = $interval(function () {
      if ($scope.h1 == 0 && $scope.m1 == 0) {
        myCircle1.update(0, 10);
        $timeout(function () {
          $scope.h1 = 0;
          $scope.m1 = 50;
          $scope.t1 = ($scope.h1 * 60 + $scope.m1) * 1000;
          myCircle1.update(100, $scope.t1);
        }, 50);
      } else if ($scope.m1 == 0) {
        $scope.m1 = 59;
        $scope.h1--;
      } else {
        $scope.m1--;
      }
    }, 1000);
    var interval2 = $interval(function () {
      if ($scope.h2 == 0 && $scope.m2 == 0) {
        myCircle2.update(0, 10);
        $timeout(function () {
          $scope.h2 = 0;
          $scope.m2 = 50;
          $scope.t2 = ($scope.h2 * 60 + $scope.m2) * 1000;
          myCircle2.update(100, $scope.t2);
        }, 50);
      } else if ($scope.m2 == 0) {
        $scope.m2 = 59;
        $scope.h2--;
      } else {
        $scope.m2--;
      }
    }, 1000);
    var interval4 = $interval(function () {
      if ($scope.h4 == 0 && $scope.m4 == 0) {
        myCircle4.update(0, 10);
        $timeout(function () {
          $scope.h4 = 0;
          $scope.m4 = 50;
          $scope.t4 = ($scope.h4 * 60 + $scope.m4) * 1000;
          myCircle4.update(100, $scope.t4);
        }, 50);
      } else if ($scope.m4 == 0) {
        $scope.m4 = 59;
        $scope.h4--;
      } else {
        $scope.m4--;
      }
    }, 1000);
    var interval5 = $interval(function () {
      console.log($scope.m5);
      if ($scope.h5 == 0 && $scope.m5 == 0) {
        myCircle5.update(0, 10);
        $timeout(function () {
          $scope.h5 = 0;
          $scope.m5 = 50;
          $scope.t5 = ($scope.h5 * 60 + $scope.m5) * 1000;
          myCircle5.update(100, $scope.t5);
        }, 50);
      } else if ($scope.m5 == 0) {
        $scope.m5 = 59;
        $scope.h5--;
      } else {
        $scope.m5--;
      }
    }, 1000);

    //  线路站点
    var passStation = document.getElementById("ldmLine");
    var line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", "M18,10 L1228,10");
    line.setAttribute("stroke-width", "6");
    line.setAttribute("stroke", "red");
    passStation.appendChild(line);
    for (i = 0, p = 20; i < $scope.stations.stations[0].length; i++, p += 40) {
      var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      circle.setAttribute("cx", p + '');
      circle.setAttribute("cy", "10");
      circle.setAttribute("r", "2");
      circle.style.fill = "#fff";
      text.style['writing-mode'] = "tb";
      text.setAttribute("x", p + '');
      text.setAttribute("y", "25");
      text.innerHTML = $scope.stations.stations[0][i].name;
      passStation.appendChild(circle);
      passStation.appendChild(text);
    }

    $scope.stop = function () {

    }
  }])

  //  搜索站点
  .controller('SearchStationCtrl', ['$scope', 'Data', '$timeout', '$ionicHistory', function ($scope, Data, $timeout, $ionicHistory) {
    //  站点数据
    $scope.sta = $scope.subwayData.stations;
    $scope.changeLine = function (i) {
      if (i == -1) {
        $scope.sta = $scope.subwayData.stations;
      } else {
        $scope.sta = $scope.stations.stations[i];
      }
    }

    //  改变站点
    $scope.changeStation = function (sta) {
      //$scope.test = Data.getNearStation(); = "武林广场";
      //alert($scope.nearStation);
      //$scope.$emit("nearStaChange", sta);
      Data.setNearStation(sta);
      window.location.href = "#/tab/dt1";
    }

    $scope.searchStationToBack = function () {
      $ionicHistory.goBack();
    }
  }])


  //  搜索地标
  .controller('SearchPointCtrl', ['$scope', 'Data', function ($scope, Data) {

  }])


  //  个人中心
  .controller('AccountCtrl', ['$scope', 'Data', function ($scope, Data) {
    $scope.toSystemMessage = function () {
      window.location.href = "#/systemMessage";
    };

    $scope.toSetting = function () {
      window.location.href = "#/setting";
    };

    $scope.toEnpt = function () {
      window.location.href = "#/enpt";
    };

    $scope.toEdit = function () {
      window.location.href = "#/edit";
    }
  }])

  //  支付方式
  .controller('PayWayCtrl', ['$scope', 'Data', function ($scope, Data) {
    $scope.isAdd = false;
    $scope.toShowPayway = function () {
      $scope.isAdd = !$scope.isAdd;
    }
  }])

  //  账户安全
  .controller('SafeCtrl', ['$scope', 'Data', function ($scope, Data) {

  }])

  //  支付记录
  .controller('PayRecordCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  载入时局部刷新
    $scope.$on("$ionicView.beforeEnter", function () {
      if (localStorage.isTidy == 1) {
        $scope.isTidy = true;
      } else {
        $scope.isTidy = false;
      }
    });
    //  回退
    $scope.payRecordBack = function () {
      if (localStorage.isTidy == 0) {
        window.location.href = "#/tab/account";
      } else {
        window.location.href = "#/wallet";
      }
    }
  }])

  //  添加支付方式
  .controller('MorePayWayCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  载入时局部刷新
    $scope.$on("$ionicView.beforeEnter", function () {
      if (localStorage.isTidy == 1) {
        $scope.isTidy = true;
      } else {
        $scope.isTidy = false;
      }
    });

    //回退
    $scope.morePaywayBack = function () {
      if (localStorage.isTidy == 1) {
        window.location.href = "#/wallet";
      } else {
        window.location.href = "#/payWay";
      }
    }
  }])


  //  账户安全详情
  .controller('SafeDetailCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  载入时局部刷新
    $scope.$on("$ionicView.beforeEnter", function () {
      if (localStorage.isTidy == 1) {
        $scope.isTidy = true;
      } else {
        $scope.isTidy = false;
      }
    });

    //回退
    $scope.safeDetailBack = function () {
      if (localStorage.isTidy == 1) {
        window.location.href = "#/wallet";
      } else {
        window.location.href = "#/safe";
      }
    }
  }])


  //  系统消息
  .controller('SystemMessageCtrl', ['$scope', 'Data', function ($scope, Data) {

  }])

  //  系统设置
  .controller('SettingCtrl', ['$scope', 'Data', function ($scope, Data) {

    //  页面载入时，局部刷新
    $scope.$on("$ionicView.beforeEnter", function () {
      if (localStorage.lang == 0) {
        $scope.lang = "中文";
        if (localStorage.isTidy == 0) {
          $scope.ver = "经典版";
        } else {
          $scope.ver = "精华版";
        }
      } else {
        $scope.lang = "English";
        if (localStorage.isTidy == 0) {
          $scope.ver = "Full";
        } else {
          $scope.ver = "Tidy";
        }
      }
      // $scope.ver = Data.getVersionName()[localStorage.isTidy];
      // $scope.lang = Data.getLanguage()[localStorage.lang];
    });

    //  跳转到切换版本页面
    $scope.toSetVersion = function () {
      window.location.href = "#/selectVersion";
    }
  }])


  //  语言设置
  .controller('SetLangCtrl', ['$scope', 'Data', '$ionicLoading', function ($scope, Data, $ionicLoading) {
    //  载入时局部刷新
    $scope.$on("$ionicView.beforeEnter", function () {

    });
    //  语言名
    $scope.ch = "ch";
    $scope.en = "en";
    //  当前语言
    $scope.nowSelectLang = Data.getLanguage()[localStorage.lang];

    if (localStorage.lang == 0) {
      $scope.chinese = "中文";
      $scope.english = "英文";
    } else {
      $scope.chinese = "Chinese";
      $scope.english = "English";
    }

    //  选择版本
    $scope.changeLang = function (i) {
      if (localStorage.lang == i) {

      } else {
        $ionicLoading.show({
          template: "<ion-spinner icon='android'></ion-spinner>语言切换中",
          duration: 1500,
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        if (i == 0) {
          $scope.chinese = "中文";
          $scope.english = "英文";
        } else {
          $scope.chinese = "Chinese";
          $scope.english = "English";
        }
        localStorage.lang = i;
        $scope.$emit("changeLang", {lang: i});
      }
    }
  }])

  //  编辑用户信息
  .controller('EditCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  载入时局部刷新
    $scope.$on("$ionicView.beforeEnter", function () {

    });


  }])

  //  环保贡献
  .controller('EnptCtrl', ['$scope', 'Data', '$interval', '$timeout', function ($scope, Data, $interval, $timeout) {
    //  免费乘车次数
    $scope.freeTime = 2;

    //  载入时局部刷新
    $scope.$on("$ionicView.beforeEnter", function () {
      if (localStorage.isTidy == 1) {
        $scope.isTidy = true;
      } else {
        $scope.isTidy = false;
      }
    });

    //回退
    $scope.enptBack = function () {
      if (localStorage.isTidy == 1) {
        window.location.href = "#/settingTidy";
      } else {
        window.location.href = "#/tab/account";
      }
    }

    //  计数动画
    var lv5Img = document.getElementById("lv5Img");
    var triangleFlag = document.getElementById("triangleFlag");
    var countOptions = {
      useEasing: true,
      useGrouping: true,
      separator: '',
      decimal: '',
      prefix: '',
      suffix: ''
    };
    var demo = new countUp("enptPoint", 0, 2001, 0, 3, countOptions);
    var demo2 = new countUp("enptPercent", 0, 50, 0, 4, countOptions);
    demo.start();
    demo2.start();

    $timeout(function () {
      //lv5Img.setAttribute("xlink",'img/tab-account/lv5-gold.png');
      //lv5Img.setAttribute("xlink","href='img/tab-account/lv5.png'");
      $("#lv5Img").fadeOut();
    }, 1000);

    //  三角形标记动画
    $scope.moveTo = function (endPosition, freeT) {
      $("#triangleFlag").animate({left: endPosition}, 200);
      $scope.freeTime = freeT;
    }

  }])

  //  环保贡献详情
  .controller('EnptDetailCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  载入时局部刷新
    $scope.$on("$ionicView.beforeEnter", function () {
      if (localStorage.isTidy == 1) {
        $scope.isTidy = true;
      } else {
        $scope.isTidy = false;
      }
    });

  }])

  /*------------------------------精简版----------------------------------------------------*/
  //  首页
  .controller('IndexTidyCtrl', ['$scope', 'Data', '$timeout','$ionicPlatform','$ionicPopup', function ($scope, Data, $timeout,$ionicPlatform,$ionicPopup) {
    //  跳转到个人二维码
    $scope.toPersonCodeTidy = function () {
      window.location.href = "#/personCodeTidy";
    }

    //  跳转到地铁搜索页面
    $scope.toSubwaySearch = function () {
      $scope.linkPage("#/subwaySearch");
    }

    //  跳转到地铁搜索页面
    $scope.toLandmarkSearch = function () {
      $scope.linkPage("#/landmarkSearch");
    }

    //  跳转到站点设施
    $scope.toFacility = function () {
      $scope.linkPage("#/facility");
    }

    //  跳转到系统消息
    $scope.toSystemMsgTidy = function () {
      $scope.linkPage("#/systemMessageTidy");
    }

  }])

  //  进站出站
  .controller('PersonCodeTidyCtrl', ['$scope', 'Data', '$interval', function ($scope, Data, $interval) {
    $scope.inWidth = 0;
    var personCode = new QRCode("personCode", {
      width: 256,
      height: 256
    });
    personCode.makeCode("545236987141100324587");
    if (localStorage.isVist == 0) {

      var t = $interval(function () {
        $scope.inWidth = $scope.inWidth + 1;
        $(".inTidy").css("width", $scope.inWidth);
        if ($scope.inWidth > 200) {
          $scope.inWidth = 0;
          personCode.makeCode("1231632132112313213");
        }
      }, 100);
      localStorage.isVist = 1;
    }

  }])


  //  设置
  .controller('SettingTidyCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  页面载入时，局部刷新
    $scope.$on("$ionicView.beforeEnter", function () {
      $scope.ver = Data.getVersionName()[localStorage.isTidy];
      if (localStorage.lang == 0) {
        $scope.lang = "中文";
      } else {
        $scope.lang = "英文";
      }
    });

  }])

  //  钱包
  .controller('WalletCtrl', ['$scope', 'Data', function ($scope, Data) {

  }])

  //  地铁搜素
  .controller('SubwaySearchCtrl', ['$scope', 'Data', function ($scope, Data) {

  }])

  //  地铁搜素
  .controller('SubwaySearchCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  跳转到语音
    $scope.toSpeech = function () {
      $scope.linkPage("#/speech");
    }

    //  跳转到地铁图
    $scope.toSubwayTidy = function () {
      $scope.linkPage("#/subwayTidy/-1&-1");
    }

    //  跳转到地铁站
    $scope.toSubwayStation = function () {
      $scope.linkPage("#/subwayStation");
    }


  }])

  //  语音
  .controller('SpeechCtrl', ['$scope', 'Data', '$ionicPlatform', '$ionicPopup', function ($scope, Data, $ionicPlatform, $ionicPopup) {

    //  是否能够使用语音
    $scope.popupCanSpeech = {};


    //  上传地铁站点词表
    $scope.init = function () {
      var extraInfo = cordova.require('cn.net.wenzhixin.cordova.ExtraInfo');
      extraInfo.init(function (message) {
      }, function (message) {
        alert(message);
      });
    }

    //  判断当前设备
    if (ionic.Platform.platform() == "android") {
      $scope.init();
    } else {
      $scope.popupCanSpeech.optionsPopup = $ionicPopup.show({
        templateUrl: "templates/tidy/speechDialog.html",
        scope: $scope
      });
    }

    //  关闭弹窗
    $scope.speech2SubwaySearch = function () {
      $scope.linkPage("#/subwaySearch");
      $scope.popupCanSpeech.optionsPopup.close();
    }

    $scope.id1 = -1;
    $scope.id2 = -1;
    //  开始语音
    $scope.sta = function () {
      var extraInfo = cordova.require('cn.net.wenzhixin.cordova.ExtraInfo');
      extraInfo.start(function (message) {
        var array = message.split("到");
        if(typeof (array[0]) != "undefined"){
          $scope.id1 = $scope.searchIndex(array[0]);
        }
        if(typeof (array[1]) != "undefined"){
         $scope.id2 = $scope.searchIndex(array[1]);
         }
        if($scope.id1 == -1 && $scope.id2 == -1){
          alert("您所说的站点有误");
        }else{
         $scope.linkPage("#/subwayTidy/"+$scope.id1+"&"+$scope.id2);
        }

      }, function (message) {
        alert(message);
      });
    }


    $scope.searchIndex = function(str){
      for(var i=0;i<$scope.subwayData.stations.length;i++){
        if($scope.subwayData.stations[i].name.indexOf(str) >= 0){
          return i;
        }
      }
      return -1;
    }

  }])

  //  地铁图Tidy
  .controller('SubwayTidyCtrl', ['$scope', 'Data', '$ionicScrollDelegate','$stateParams','$ionicHistory', function ($scope, Data, $ionicScrollDelegate,$stateParams,$ionicHistory) {
    //console.log($ionicScrollDelegate);

    var stTemp = 0;
    var enTemp = 0;
    $scope.subwayTidySt = "起点";
    $scope.subwayTidyEd = "终点";
    //  线路透明度
    $scope.r1 = {opacity: 1};
    $scope.r2 = {opacity: 1};
    $scope.r3 = {opacity: 1};

    //  起点/终点图标显示状态
    $scope.showSTPoint = false;
    $scope.showEDPoint = false;

    //  起点/终点按钮选择状态
    $scope.isStart = false;
    $scope.isEnd = false;

    //  起点终点索引
    $scope.startIndex = 0;
    $scope.endIndex = 1;

    //元素获取
    var stPoint = document.getElementById("stPoint");
    var edPoint = document.getElementById("edPoint");
    var result = document.getElementById("result");
    //  地铁图原始大小
    $scope.nowZoom = 1;

    //  地铁图放大0.1
    $scope.larger = function () {
      //$ionicScrollDelegate.zoomTo("0.5");
      $ionicScrollDelegate.$getByHandle('subwayScroll').zoomBy($scope.nowZoom + 0.1);
    }

    //  地铁图缩小0.1
    $scope.smaller = function () {
      $ionicScrollDelegate.$getByHandle('subwayScroll').zoomBy($scope.nowZoom - 0.1);
    }


    //  显示线路
    /*$scope.subwayTidyShow = function(id1,id2){
      $scope.selectStation(id1,$scope.subwayData.stations[id1].x,$scope.subwayData.stations[id2].y);
      $scope.selectStation(id2,$scope.subwayData.stations[id2].x,$scope.subwayData.stations[id2].y);
    }*/

    //  点击站点事件

    $scope.selectStation = function (index, x, y) {
      if (!$scope.showSTPoint) {
        $scope.rightBtn = "取消";
        stPoint.setAttribute("x", x - 16);
        stPoint.setAttribute("y", y - 37);
        $scope.showSTPoint = true;
        $scope.startIndex = index;
        $scope.subwayTidySt = $scope.subwayData.stations[index].name;
      } else {
        $scope.endIndex = index;
        if (index == $scope.startIndex) {
          alert("起点和终点重合了");
        }
        else {
          $scope.subwayTidyEd = $scope.subwayData.stations[index].name;
          if ($scope.startIndex-0 > index-0) {
            stTemp = index;
            enTemp = $scope.startIndex;
          } else {
            stTemp = $scope.startIndex;
            enTemp = index;
          }
          result.innerHTML = "";
          edPoint.setAttribute("x", x - 16);
          edPoint.setAttribute("y", y - 37);
          console.log($scope.startIndex + ',' + index);
          //console.log($scope.subwayData.stations[index]);
          //console.log($scope.subwayData.router[index]);
          $scope.nodes = $scope.ways.ways[stTemp][enTemp - 1].node;
          $scope.line = $scope.ways.ways[stTemp][enTemp - 1].line;
          console.log(stTemp+","+enTemp);
          console.log($scope.ways.ways[stTemp][enTemp - 1].line);
          $scope.w1 = "0.3";
          $scope.w2 = "0.3";
          $scope.w4 = "0.3";
          /*var line = document.createElementNS("http://www.w3.org/2000/svg", "path");
           line.setAttribute("d", $scope.subwayData.router[35].path);
           line.setAttribute("stroke-width", "3");
           line.setAttribute("stroke", $scope.subwayData.router[35].color);
           console.log($scope.subwayData.router[35]);
           result.appendChild(line);*/
          for (var i = 0; i < $scope.line.length; i++) {
            var line = document.createElementNS("http://www.w3.org/2000/svg", "path");
            line.setAttribute("d", $scope.subwayData.router[$scope.line[i]].path);
            line.setAttribute("stroke-width", "3");
            line.setAttribute("stroke", $scope.subwayData.router[$scope.line[i]].color);
            result.appendChild(line);
          }
          for (var i = 0; i < $scope.nodes.length; i++) {
            var node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            node.setAttribute("cx", $scope.subwayData.stations[$scope.nodes[i]].x);
            node.setAttribute("cy", $scope.subwayData.stations[$scope.nodes[i]].y);
            node.setAttribute("r", "3");
            node.style.fill = "#fff";
            //node.style.stroke = $scope.subwayData.stations[$scope.nodes[i]].color;
            node.style.stroke = "black";
            text.setAttribute("x", $scope.subwayData.stations[$scope.nodes[i]].tx);
            text.setAttribute("y", $scope.subwayData.stations[$scope.nodes[i]].ty);
            text.style["font-family"] = "微软雅黑";
            text.style["font-size"] = "x-small";
            text.innerHTML = $scope.subwayData.stations[$scope.nodes[i]].name;
            text.style["text-anchor"] = $scope.subwayData.stations[$scope.nodes[i]].anchor;
            result.appendChild(node);
            result.appendChild(text);
          }
          $scope.showEDPoint = true;
        }
      }
    }

    //  导航栏右侧按钮点击事件
    $scope.selectCancel = function () {
      $scope.showSTPoint = false;
      $scope.showEDPoint = false;
      result.innerHTML = "";
      $scope.w1 = "1";
      $scope.w2 = "1";
      $scope.w4 = "1";
      $scope.subwayTidySt = "起点";
      $scope.subwayTidyEd = "终点";
    };

    //  跳转到线路详情
    $scope.toWayDetail = function () {
      if ($scope.startIndex > $scope.endIndex) {
        $scope.linkPage("#/wayDetail/" + stTemp + "&" + enTemp + "&1");
      }
      else {
        $scope.linkPage("#/wayDetail/" + stTemp + "&" + enTemp + "&0");
      }
    }

    if($stateParams.stId == -1 && $stateParams.edId == -1){

    }else if($stateParams.stId != -1 && $stateParams.edId == -1){
      $scope.selectStation($stateParams.stId,$scope.subwayData.stations[$stateParams.stId].x,$scope.subwayData.stations[$stateParams.stId].y);
    }else if($stateParams.stId == -1 && $stateParams.edId != -1){
      $scope.selectStation($stateParams.edId,$scope.subwayData.stations[$stateParams.edId].x,$scope.subwayData.stations[$stateParams.edId].y);
    }else{
      $scope.selectStation($stateParams.stId,$scope.subwayData.stations[$stateParams.stId].x,$scope.subwayData.stations[$stateParams.stId].y);
      $scope.selectStation($stateParams.edId,$scope.subwayData.stations[$stateParams.edId].x,$scope.subwayData.stations[$stateParams.edId].y);
    }

    $scope.subwayTidy2Back = function(){
      $ionicHistory.goBack();
    }
  }])


  //  线路详情
  .controller('WayDetailCtrl', ['$scope', 'Data', '$stateParams', function ($scope, Data, $stateParams) {
    // 起点和终点ID
    $scope.stID = $stateParams.st;
    $scope.edID = $stateParams.ed;
    //console.log($scope.stID+","+$scope.edID);
    //  线路信息
    $scope.way = {};

    //  时间
    $scope.way.time = $scope.ways.ways[$scope.stID][$scope.edID - 1].time;
    //  金额
    $scope.way.money = 5;
    //  总站数
    $scope.way.sta = angular.copy($scope.ways.ways[$scope.stID][$scope.edID - 1].node);
    //  积分
    $scope.way.points = 60;
    //  经过线路
    $scope.crossLine = $scope.ways.ways[$scope.stID][$scope.edID - 1].pass;
    $scope.passPath = $scope.ways.ways[$scope.stID][$scope.edID - 1].line;
    //  svg宽度
    $scope.passStaWidth = ($scope.way.sta.length + 2) * 40;
    if ($stateParams.isChange == 1) {
      $scope.stID = $stateParams.ed;
      $scope.edID = $stateParams.st;
      $scope.passPath.reverse();
      $scope.crossLine.reverse();
      $scope.way.sta.reverse();
    }
    //  起点
    $scope.way.st = $scope.subwayData.stations[$scope.stID].name;
    //  终点
    $scope.way.ed = $scope.subwayData.stations[$scope.edID].name;

    //  线路站点
    var para = document.getElementById("passedLines");
    for (var i = 0; i < $scope.crossLine.length; i++) {
      var spanText = document.createElement("span");
      spanText.innerHTML = $scope.crossLine[i] + "号线";
      spanText.style.color = $scope.lineColor[$scope.crossLine[i]];
      para.appendChild(spanText);
      if (i + 1 != $scope.crossLine.length) {
        var spanLine = document.createElement("span");
        spanLine.innerHTML = "--->";
        spanLine.style.color = "green";
        para.appendChild(spanLine);
      }
    }

    var passStation = document.getElementById("passSta");

    for (i = 0; i < $scope.passPath.length; i++) {
      var line = document.createElementNS("http://www.w3.org/2000/svg", "path");
      line.setAttribute("d", "M" + (i + 1) * 40 + ",10 l40,0");
      line.setAttribute("stroke-width", "6");
      line.setAttribute("stroke", $scope.subwayData.router[$scope.passPath[i]].color);
      line.style["stroke-linecap"] = "round";
      passStation.appendChild(line);
    }

    for (i = 0, p = 40; i < $scope.way.sta.length; i++, p += 40) {
      var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      circle.setAttribute("cx", p + '');
      circle.setAttribute("cy", "10");
      circle.setAttribute("r", "2");
      circle.style.fill = "#fff";
      text.style['writing-mode'] = "tb";
      text.setAttribute("x", p + '');
      text.setAttribute("y", "25");
      text.innerHTML = $scope.subwayData.stations[$scope.way.sta[i]].name;
      passStation.appendChild(circle);
      passStation.appendChild(text);
    }
  }])

  //  地铁站
  .controller('SubwayStationCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  站点数据
    $scope.sta = $scope.staData.stations[0];
    //$("#line1").css("background-color","red");
    //  线路索引
    $scope.lineIndex = 0;
    $("#line1").css("background-color", "#fff");
    $scope.changeLine = function (i) {
      $("#line1").css("background-color", "rgb(242, 242, 242)");
      $("#line2").css("background-color", "rgb(242, 242, 242)");
      $("#line3").css("background-color", "rgb(242, 242, 242)");
      $("#line4").css("background-color", "rgb(242, 242, 242)");
      $("#line" + (i + 1)).css("background-color", "#fff");
      $scope.lineIndex = i;
      $scope.sta = $scope.staData.stations[i];
    }

    //  跳转到线路详情
    $scope.toStaDeatil = function (i) {
      $scope.linkPage("#/staDetail/" + $scope.lineIndex + "&" + i);
    }
  }])

  //  地铁站详情
  .controller('StaDetailCtrl', ['$scope', 'Data', '$stateParams', function ($scope, Data, $stateParams) {
    console.log($stateParams.lineIndex + "," + $stateParams.id);
    //  地铁线路
    $scope.passLine = $scope.lineDic[$stateParams.lineIndex].lineName;
    //  起点和终点
    $scope.stLine = $scope.lineDic[$stateParams.lineIndex].st;
    $scope.edLine = $scope.lineDic[$stateParams.lineIndex].ed;
    //线路站点
    $scope.stas = $scope.staData.stations[$stateParams.lineIndex];
    //  站点名
    $scope.staName = $scope.subwayData.stations[$stateParams.id].name;
    //  svg宽度
    $scope.passStaWidth = ($scope.stas.length + 2) * 40;
    $scope.color = $scope.lineColor[$stateParams.lineIndex];

    //  SVG地铁线
    var passStation = document.getElementById("passSta");
    for (i = 0; i < $scope.stas.length - 1; i++) {
      var line = document.createElementNS("http://www.w3.org/2000/svg", "path");
      line.setAttribute("d", "M" + (i + 1) * 40 + ",10 l40,0");
      line.setAttribute("stroke-width", "6");
      line.setAttribute("stroke", $scope.color);
      line.style["stroke-linecap"] = "round";
      passStation.appendChild(line);
    }

    for (i = 0, p = 40; i < $scope.stas.length; i++, p += 40) {
      var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      circle.setAttribute("cx", p + '');
      circle.setAttribute("cy", "10");
      circle.setAttribute("r", "2");
      circle.style.fill = "#fff";
      text.style['writing-mode'] = "tb";
      text.setAttribute("x", p + '');
      text.setAttribute("y", "25");
      if ($scope.stas[i].id == $stateParams.id) {
        text.setAttribute("fill", $scope.lineColor[$stateParams.lineIndex]);
      }
      text.innerHTML = $scope.stas[i].name;
      passStation.appendChild(circle);
      passStation.appendChild(text);
    }

  }])

  //  地标搜素
  .controller('LandmarkSearchCtrl', ['$scope', 'Data', function ($scope, Data) {
    $scope.toLdmChoose = function (i) {
      //console.log(i);
      $scope.linkPage("#/landmarkChoose/0");
      //alert("h");
    }
  }])

  //  地标选择
  .controller('LandmarkChooseCtrl', ['$scope', 'Data', '$stateParams', function ($scope, Data, $stateParams) {
    //  地标名字
    $scope.landmarkName = Data.getLandmark()[$stateParams.id];
    //  地标下的内容
    $scope.landmarkContent = Data.getLandmarkContent4Tidy()[0];

    //  选择地标
    $scope.selectLandmark = function (i) {
      $scope.linkPage("#/landmarkDetailTidy/" + ((i + 3) % 4) + "&" + (i * 10) % 49 + "&" + i);
    }
  }])

  //  地标详情
  .controller('LandmarkDetailTidyCtrl', ['$scope', 'Data', '$stateParams', '$ionicHistory', function ($scope, Data, $stateParams, $ionicHistory) {
    console.log($stateParams.lineIndex);
    $scope.titleName = Data.getLandmarkContent4Tidy()[0][$stateParams.flag];
    //  地铁线路
    $scope.passLine = $scope.lineDic[$stateParams.lineIndex].lineName;
    //  起点和终点
    $scope.stLine = $scope.lineDic[$stateParams.lineIndex].st;
    $scope.edLine = $scope.lineDic[$stateParams.lineIndex].ed;
    //线路站点
    $scope.stas = $scope.staData.stations[$stateParams.lineIndex];
    //  站点名
    $scope.staName = $scope.subwayData.stations[$stateParams.id].name;
    //  svg宽度
    $scope.passStaWidth = ($scope.stas.length + 2) * 40;
    $scope.color = $scope.lineColor[$stateParams.lineIndex];

    $scope.toBack = function () {
      $ionicHistory.goBack();
    }

    //  SVG地铁线
    var passStation = document.getElementById("passSta");
    for (i = 0; i < $scope.stas.length - 1; i++) {
      var line = document.createElementNS("http://www.w3.org/2000/svg", "path");
      line.setAttribute("d", "M" + (i + 1) * 40 + ",10 l40,0");
      line.setAttribute("stroke-width", "6");
      line.setAttribute("stroke", $scope.color);
      line.style["stroke-linecap"] = "round";
      passStation.appendChild(line);
    }

    for (i = 0, p = 40; i < $scope.stas.length; i++, p += 40) {
      var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      circle.setAttribute("cx", p + '');
      circle.setAttribute("cy", "10");
      circle.setAttribute("r", "2");
      circle.style.fill = "#fff";
      text.style['writing-mode'] = "tb";
      text.setAttribute("x", p + '');
      text.setAttribute("y", "25");
      if ($scope.stas[i].id == $stateParams.id) {
        text.setAttribute("fill", $scope.lineColor[$stateParams.lineIndex]);
      }
      text.innerHTML = $scope.stas[i].name;
      passStation.appendChild(circle);
      passStation.appendChild(text);
    }

  }])

  //  地铁搜素
  .controller('FacilityCtrl', ['$scope', 'Data', '$ionicModal', function ($scope, Data, $ionicModal) {
    //  当前站点
    $scope.nowSta = "火车东站";

    //  地铁站
    $scope.sta = $scope.staData.stations[0];

    $("#dt1Card1").css({"color": "red", "background-color": "#fff"});
    //  选项卡点击事件
    $scope.dt1SelectCard = function (i) {

      if (i == 1) {
        $("#dt1Card1").css({"color": "red", "background-color": "#fff"});
        $("#dt1Card2").css({"color": "#fff", "background-color": ""});
        $("#dt1Card3").css({"color": "#fff", "background-color": ""});
      } else if (i == 2) {
        $("#dt1Card1").css({"color": "#fff", "background-color": ""});
        $("#dt1Card2").css({"color": "red", "background-color": "#fff"});
        $("#dt1Card3").css({"color": "#fff", "background-color": ""});
      } else {
        $("#dt1Card1").css({"color": "#fff", "background-color": ""});
        $("#dt1Card2").css({"color": "#fff", "background-color": ""});
        $("#dt1Card3").css({"color": "red", "background-color": "#fff"});
      }
      $("#dt1Map").attr("src", "img/tab-discover/map" + i + ".jpg");
    }

    //  配置Modal
    $ionicModal.fromTemplateUrl("templates/tidy/stationModal.html", {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      $scope.modal = modal;
    });

    //  更换站点
    $scope.openModal = function () {
      $scope.modal.show();
      $("#line1").css("background-color", "#fff");
    }
    $scope.closeModal = function () {
      $scope.modal.hide();
    }

    //  选择站点
    $scope.selectSta = function (i) {
      $scope.nowSta = $scope.subwayData.stations[i].name;
      $scope.modal.hide();
    }

    $scope.changeLine = function (i) {
      $("#line1").css("background-color", "rgb(242, 242, 242)");
      $("#line2").css("background-color", "rgb(242, 242, 242)");
      $("#line3").css("background-color", "rgb(242, 242, 242)");
      $("#line4").css("background-color", "rgb(242, 242, 242)");
      $("#line" + (i + 1)).css("background-color", "#fff");
      $scope.sta = $scope.staData.stations[i];
    }

  }])

  //  系统消息
  .controller('SystemMessageTidyCtrl', ['$scope', 'Data', '$ionicHistory', function ($scope, Data, $ionicHistory) {

  }])

  //  登录
  .controller('LoginCtrl', ['$scope', 'Data', '$ionicHistory', '$ionicPopup', function ($scope, Data, $ionicHistory, $ionicPopup) {
    //  切换到注册1
    $scope.toRegister1 = function () {
      $("#login").animate({left: '-100%'}, 200);
      $("#register1").animate({left: '0'}, 200);
    }
    //  切换到注册2
    $scope.toRegister2 = function () {
      $("#register1").animate({left: '-100%'}, 200);
      $("#register2").animate({left: '0'}, 200);
    }
    //  切换到忘记密码1
    $scope.toForgetPwd1 = function () {
      $("#login").animate({left: '-100%'}, 200);
      $("#forgetPwd1").animate({left: '0'}, 200);
    }
    //  切换到忘记密码2
    $scope.toForgetPwd2 = function () {
      $("#forgetPwd1").animate({left: '-100%'}, 200);
      $("#forgetPwd2").animate({left: '0'}, 200);
    }
    //  注册1返回
    $scope.r1toBack = function () {
      $("#register1").animate({left: '100%'}, 200);
      $("#login").animate({left: '0'}, 200);
    }
    //  注册2返回
    $scope.r2toBack = function () {
      $("#register2").animate({left: '100%'}, 200);
      $("#register1").animate({left: '0'}, 200);
    }
    //  忘记密码1返回
    $scope.f1toBack = function () {
      $("#login").animate({left: '0'}, 200);
      $("#forgetPwd1").animate({left: '100%'}, 200);
    }
    //  忘记密码2返回
    $scope.f2toBack = function () {
      $("#forgetPwd2").animate({left: '100%'}, 200);
      $("#forgetPwd1").animate({left: '0'}, 200);
    }

    //  回退
    $scope.loginToBack = function () {
      $ionicHistory.goBack();
    }

    //  登陆弹窗
    $scope.popupLogin = {};
    $scope.loginPopClose = function () {
      $scope.popupLogin.optionsPopup.close();
    }

    //  注册弹窗
    $scope.popupRegister = {};
    $scope.registerPopClose = function () {
      $scope.popupRegister.optionsPopup.close();
    }


    //  登录
    $scope.user = {};
    $scope.user.name = "";
    $scope.user.pwd = "";
    $scope.loginLogin = function () {
      if ($scope.user.name == "" || $scope.user.pwd == "") {
        $scope.popupLogin.optionsPopup = $ionicPopup.show({
          templateUrl: "templates/login/loginPop.html",
          scope: $scope
        });
      } else {
        $scope.$emit("loginMsg", {userName: $scope.user.name});
        localStorage.isLogin = 1;
        $scope.linkPage("#/tab/home");
      }
    }


    //  注册
    $scope.loginRegister = function () {
      $scope.popupRegister.optionsPopup = $ionicPopup.show({
        templateUrl: "templates/login/registerPop.html",
        scope: $scope
      });
    }
  }])

  //  选择版本
  .controller('SelectVersionCtrl', ['$scope', 'Data', function ($scope, Data) {
    //  当前选择
    if (localStorage.isTidy == 0) {
      $scope.selectTidy = false;
    } else if (localStorage.isTidy == 1) {
      $scope.selectTidy = true;
    } else {
      $scope.selectTidy = false;
    }


    //  改变版本
    $scope.changeVersion = function (ver) {
      if (ver == 0) {
        $scope.selectTidy = false;
      } else {
        $scope.selectTidy = true;
      }
    }

    $scope.start = function () {
      if ($scope.selectTidy) {
        localStorage.isTidy = 1;
        $scope.linkPage("#/indexTidy");
      } else {
        localStorage.isTidy = 0;
        $scope.linkPage("#/tab/home");
      }
    }
  }])


  //  编辑个人信息
  .controller('EditTidyCtrl', ['$scope', 'Data', function ($scope, Data) {

  }])

  //  设置语言
  .controller('SetLangTidyCtrl', ['$scope', 'Data', '$ionicLoading', function ($scope, Data, $ionicLoading) {
    //  语言名
    $scope.ch = "ch";
    $scope.en = "en";


    //  当前语言
    $scope.nowSelectLang = Data.getLanguage()[localStorage.lang];
    if (localStorage.lang == 0) {
      $scope.chinese = "中文";
      $scope.english = "英文";
    } else {
      $scope.chinese = "Chinese";
      $scope.english = "English";
    }


    //  选择语言
    $scope.changeLang = function (i) {
      if (localStorage.lang == i) {

      } else {
        $ionicLoading.show({
          template: "<ion-spinner icon='android'></ion-spinner>语言切换中",
          duration: 1500,
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        localStorage.lang = i;
      }
    }
  }])

  //  引导页面
  .controller('LeadCtrl', ['$scope', 'Data', '$interval', '$ionicSlideBoxDelegate', function ($scope, Data, $interval, $ionicSlideBoxDelegate) {
    $scope.lead = $interval(function () {
      if ($ionicSlideBoxDelegate.currentIndex() == 2) {
        $scope.linkPage("#/selectVersion");
        $interval.cancel($scope.lead);
      } else {
        $ionicSlideBoxDelegate.next();
      }
    }, 3000);
  }])


/*

 //  地铁搜素
 .controller('SubwaySearchCtrl', ['$scope', 'Data', function ($scope, Data) {

 }])
 */



