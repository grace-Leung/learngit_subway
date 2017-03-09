/**
 * Created by wiky on 2016/6/10.
 */
angular.module('starter.services', [])

  .factory('Data', function ($ionicHistory, $http, $ionicSideMenuDelegate) {

    //首页数据
    var list = [[1, 2, 3, 4], [5, 6, 7, 8], ["..."]];
    var flag = {
      hasTicket: false
    };
    var ticketInfo = [{router: [1]}, {router: [2, 6]}, {router: [2, 6]}, {router: [2, 6]}, {router: [2, 6]}, {router: [2, 6]}, {router: [2, 6]}];
    var items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 111, 1111, 2222, 333, 444, 5556, 77, 888, 99, 9999, 99999, 9999999];

    //个人首页-消息页面数据
    var msgList = [{status: true, title: 'msg1'}, {status: false, title: 'msg2'}];


    //地图页面-历史数据
    var history = [{"time": "2016-11-1", "router": [2, 6]}, {"time": "2016-11-1", "router": [2, 6]}];

    //地铁首页-地标检索
    var imgList = [["apartment.png", "cinema.png", "food.png", "fun.png"], ["gov.png", "hospital.png", "hotel.png", "museum.png"],
      ["office.png", "PE.png", "school.png", "shopping.png"], ["tourist.png"]];

    var name = "wiky";

    //  赛吧新闻内容
    var pubContent = [
      {
        userImg: "img/user/u1.png",
        user: "大王交我来巡山",
        time: "16：40",
        place: "龙翔桥站",
        hasImage: true,
        image: "img/user/news1.jpg",
        content: "#地铁文化#闸弄口地铁站举行了一场红楼梦展示秀，古色古香，超美的~~",
        hasContact: false,
        contact: "",
        comment: 2,
        good: 6
      },
      {
        userImg: "img/user/u2.png",
        user: "枚明岚",
        time: "16：10",
        place: "龙翔桥站",
        hasImage: true,
        image: "img/user/news2.jpg",
        content: "地铁上这个姐姐好漂亮，希望她会红",
        hasContact: false,
        contact: "",
        comment: 2,
        good: 7
      },
      {
        userImg: "img/user/u3.png",
        user: "冷冻街的海区鸟",
        time: "14：40",
        place: "龙翔桥站",
        hasImage: true,
        image: "img/user/news3.jpg",
        content: "地铁上遇到一个女生涂了带紫调的口红 觉得好漂亮啊 后悔没有问她什么色号 后悔",
        hasContact: false,
        contact: "",
        comment: 3,
        good: 8
      },
      {
        userImg: "img/user/u4.png",
        user: "FYeeLSsss",
        time: "14：24",
        place: "龙翔桥站",
        hasImage: true,
        image: "img/user/news4.jpg",
        content: "当加班还是可以接受的的，追着最后一趟地铁跑很苦逼。俄罗斯妹子好漂亮。#地铁处处有美景#",
        hasContact: false,
        contact: "",
        comment: 4,
        good: 9
      },
      {
        userImg: "img/user/u5.png",
        user: "J1T18340",
        time: "12：33",
        place: "龙翔桥站",
        hasImage: true,
        image: "img/user/news5.jpg",
        content: "3号线刚开通我就坐上了，好开心，粉色系的地铁，票好漂亮",
        hasContact: false,
        contact: "",
        comment: 1,
        good: 12
      },
      {
        userImg: "img/user/u6.png",
        user: "小勋勋的胖次",
        time: "11：33",
        place: "龙翔桥站",
        hasImage: true,
        image: "img/user/news6.jpg",
        content: "粉色地铁啊啊啊啊好漂亮#魅力4号线#",
        hasContact: false,
        contact: "",
        comment: 1,
        good: 12
      },

    ];

    //  赛吧求助内容
    var pubContent4Help = [
      {
        userImg: "img/tab-pub/user.png",
        user: "小二哥",
        time: "16：40",
        place: "龙翔桥站",
        hasImage: true,
        image: "img/tab-pub/top1.jpg",
        content: "我的儿子走丢了，他穿着蓝色的T恤。若有人看到我儿子，请与我联系。万分感谢！！",
        hasContact: true,
        contact: "18273655099  陈先生"
      },
      {
        userImg: "img/tab-pub/user.png",
        user: "赛百路粉丝",
        time: "15：30",
        place: "武林广场站",
        hasImage: false,
        image: "",
        content: "我的钱包丢了，里面有我的身份证与若干银行卡，若有人捡到，请与我联系。万分感谢！！",
        hasContact: true,
        contact: "13243578089  周先生"
      },
      {
        userImg: "img/user/hu1.png",
        user: "榕树下的沙茶面",
        time: "12：08",
        place: "武林广场站",
        hasImage: true,
        image: "img/user/help1.jpg",
        content: "在乔司南地铁站看到这只丢失的狗，一直跟着我爸爸，之后没办法把它带回了家。右眼好像有问题，小狗的主人看到了联系我，私信我#狗狗回家#",
        hasContact: true,
        contact: "18832423567  张先生"
      },

      {
        userImg: "img/user/hu2.png",
        user: "干净雅观的小猪",
        time: "11：30",
        place: "彭埠站",
        hasImage: true,
        image: "img/user/help2.jpg",
        content: "在乔司南地铁站看到这只丢失的狗，一直跟着我爸爸，之后没办法把它带回了家。右眼好像有问题，小狗的主人看到了联系我，私信我#狗狗回家#",
        hasContact: true,
        contact: "18832423567  梁先生"
      },
    ];

    //  新闻评论
    var newsComment = [
      {userImg: "img/tab-pub/u3.jpg", user: "赛百路粉丝3", time: "17：30", comment: "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈，这个人真是有趣！"},
      {userImg: "img/tab-pub/u3.jpg", user: "赛百路粉丝5", time: "16：30", comment: "这两个小伙子挺靓。"}
    ];

    //  求助评论
    var helpComment = [
      {userImg: "img/tab-pub/u2.jpg", user: "小熊来了", time: "17：20", comment: "刚才在龙翔桥站的厕所门口看见一个小伙子穿着蓝色T恤，可能是他。"},
      {userImg: "img/tab-pub/u2.jpg", user: "赛鼠", time: "17：10", comment: "你儿子长得真帅！"}
    ];

    //  我的消息
    var myMessage = [
      {
        userImg: "img/user/u1.png",
        commentName: "花落意",
        case: "评论了新鲜事",
        time: "20分钟前",
        content: "刚才在龙翔桥看到一个小男孩，可能是你要找的",
        myContent: ""
      },
      {
        userImg: "img/user/u2.png",
        commentName: "水无情",
        case: "回复了你的评论",
        time: "33分钟前",
        content: "你真是幽默",
        myContent: "我的评论：我的头发很飘逸"
      },
      {
        userImg: "img/user/u3.png",
        commentName: "嘻嘻哈哈",
        case: "评论了你的求助",
        time: "55分钟前",
        content: "最近走丢的孩子很多，要小心",
        myContent: ""
      },
    ];

    //  新闻搜索结果
    var newsResult = ["陈伟霆在武林", "武林站太堵了"];

    //  求助搜索结果
    var helpResult = [{id: 1, title: "鳄鱼钱包不见了"}, {id: 2, title: "黑色钱包"}];

    //  最近地铁站
    var nearStation = "火车东站";

    //  地标名字
    var landmark = ["办公楼", "博物馆", "酒店", "商场", "体育", "景区", "小区", "政府机构", "影剧院", "美食", "医院", "娱乐"];

    //  地标内容
    var landmarkContent = [
      ["浙江省杭州消防总队医院", "浙江省中医院", "浙江大学医学院附属第二医院", "杭州华晨门诊部"],
      ["浙江省中医院", "人民医院", "爱心医院", "儿童医院"],
      ["浙江大学医学院附属儿童医院", "浙江大学医学院附属第二医院", "杭州市中医院", "浙江大学医学院附属妇产科医院"],
      ["杭州市第一人民医院", "人民医院", "爱心医院", "儿童医院"],
      ["邵逸夫医院", "浙江大学医学院附属第一医院", "浙江省肿瘤医院", "浙江省立同德医院"],
      ["杭州市红十字会医院", "浙江中医药大学附属第三医院", "杭州口腔医院", "杭州市第七人民医院"],
      ["浙江省新华医院", "杭州师范大学附属医院", "浙江萧山医院", "杭州市萧山区第一人民医院"],
      ["杭州市西溪医院", "杭州市儿童医院", "浙江医院", "武警浙江总队杭州医院"],
    ];
    var landmarkContentImg = [
      ["1.jpg", "2.jpg", "3.jpg", "4.jpg"],
      ["5.jpg", "6.jpg", "7.jpg", "8.jpg"],
      ["9.jpg", "10.jpg", "11.jpg", "12.jpg"],
      ["13.jpg", "14.jpg", "15.jpg", "16.jpg"],
      ["17.jpg", "18.jpg", "19.jpg", "20.jpg"],
      ["1.jpg", "2.jpg", "3.jpg", "4.jpg"],
      ["5.jpg", "6.jpg", "7.jpg", "8.jpg"],
      ["9.jpg", "10.jpg", "11.jpg", "12.jpg"],
    ];

    var landmarkContent4Tidy = [
      ["浙江省杭州消防总队医院", "杭州华晨门诊部", "浙江省中医院", "人民医院", "爱心医院", "儿童医院", "浙江大学医学院附属儿童医院", "浙江大学医学院附属第二医院", "杭州市中医院", "浙江大学医学院附属妇产科医院", "邵逸夫医院", "浙江大学医学院附属第一医院", "浙江省肿瘤医院", "浙江省立同德医院"]
    ];
    //  地区
    var area = ["上城区", "下城区", "拱墅区", "江干区", "西湖区", "滨江区", "萧山区", "余杭区"];

    //  版本名
    var versionName = ["经典版", "精装版"];

    //  语言
    var language = ["ch", "en"];

    //  到站提醒起点
    var noticeStName = "";
    var noticeEdName = "";

    //  未付款订单列表
    var notPayList = [{
      stId: 8,
      edId: 20,
      orderId: "2016054123548987744335",
      inTime: "2016-5-20 10:28",
      outTime: "2016-5-20-45",
      money: 5
    }];

    //  失效订单列表
    var noUseList = [{
      stId: 10,
      edId: 37,
      orderId: "2016056223548987744536",
      buyTime: "2016-5-11 12:28",
      overTime: "2016-5-20",
      money: 5,
      payWay: 1
    }];

    //  中文版
    var lang_ch =
    {
      "tab": ["主页", "发现", "赛吧", "我的"],
      "tabHome": ["赛百路", "在线购票", "我的行程", "实时购票", "请点击使用二维码扫码进站", "未登录"],
      "taDiscover": ["发现", "设施", "实时", "地标", "离我最近", "号线", "-", "下一站: ", "下一班: "],
      "tabPubNews": ["新鲜事", "求  助"],
      "tabAccount": ["个人中心", "支付方式", "账户安全", "支付记录", "环保贡献值", "距离", "还需要"],
      "setting": ["系统设置", "通用", "推送消息", "切换版本", "语言", "清理存储空间", "用户体验", "乘车须知", "帮助", "反馈", "关于", "功能介绍", "版本更新", "赛百路 2.0.134"]
    }
    /*  var tab_ch = ["主页","发现","赛吧","我的"];
     var tab_home_ch = ["赛百路","在线购票","我的行程","实时购票","请点击使用二维码扫码进站","未登录"];
     var tab_discover_ch = ["发现","设施","实时","地标","离我最近","号线","-","下一站: ","下一班: "];
     var tab_pubNews_ch = ["新鲜事","求助"];
     var tab_account_ch = ["个人中心","支付方式","账户安全","支付记录","环保贡献值","距离","还需要"];
     var setting_ch = ["系统设置","通用","推送消息","切换版本","语言","清理存储空间","用户体验","乘车须知","帮助","反馈","关于","功能介绍","版本更新","赛百路 2.0.134"];
     */


    //  英文版
    var lang_en =
    {
      "tab": ["Home", "Discover", "Bar", "Me"],
      "tabHome": ["Subway", " Buy tickets", "My tickets", "Fast Verify", "Please scan the QRcode", "Alipay"],
      "taDiscover": ["Discover", "Facility", "Nearby", "Landmark", "Nearest", "Line", "To ", "Next: ", "Waiting: "],
      "tabPubNews": ["News", "Help"],
      "tabAccount": ["Me", "Payments", "Security", "History", "Envir Contribution", "Reach", "Still Need"],
      "setting": ["Settings", "General", "Notification", "Version", "Language", "Manage Storage", "User", "Passenger Notice", "Help", "Feedback", "About", "Functions", "Update", "Subway 2.0.134"]
    }

    /*var tab_en = ["Home","Discover","Bar","Me"];
     var tab_home_en = ["Subway"," Buy tickets","My tickets","Fast Verify","Please scan the QRcode","Alipay"];
     var tab_discover_en = ["Discover","Facility","Nearby","Landmark","Nearest","Line","To ","Next: ","Waiting: "];
     var tab_pubNews_en = ["News","Help","All","Search","min","Repost"];
     var tab_account_en = ["Me","Payments","Security","History","Envir Contribution","Reach","Still Need"];
     var setting_en = ["Settings","General","Notification","Version","Language","Manage Storage","User","Passenger Notice","Help","Feedback","About","Functions","Update","Subway 2.0.134"];
     */

    return {
      setName: function () {
        name = "hello";
      },
      getName: function () {
        return name;
      },
      getList: function () {
        return list;
      },

      getFlag: function () {
        return flag;
      },

      getTicketInfo: function () {
        return ticketInfo;
      },

      getItems: function () {
        return items;
      },

      getMsgList: function () {
        return msgList;
      },

      getHistory: function () {
        return history;
      },

      getImgList: function () {
        return imgList;
      },

      getBack: function () {
        $ionicHistory.goBack();
      },

      getNodes: function () {
        return $http.get("nodes.json");
      },

      getWays: function () {
        return $http.get("ways.json");
      },

      getSubwayData: function () {
        return $http.get("subwayData.json");
      },

      getStaData: function () {
        return $http.get("staData.json");
      },

      getPubContent: function () {
        return pubContent;
      },

      getPubContent4Help: function () {
        return pubContent4Help;
      },

      getNewsComment: function () {
        return newsComment;
      },

      getHelpComment: function () {
        return helpComment;
      },

      getNewsResult: function () {
        return newsResult;
      },

      getHelpResult: function () {
        return helpResult;
      },

      getNearStation: function () {
        return nearStation;
      },

      setNearStation: function (sta) {
        nearStation = sta;
      },

      getLandmark: function () {
        return landmark;
      },

      getLandmarkContent: function () {
        return landmarkContent;
      },

      getLandmarkContent4Tidy: function () {
        return landmarkContent4Tidy;
      },

      getArea: function () {
        return area;
      },

      getLandmarkContentImg: function () {
        return landmarkContentImg;
      },

      getVersionName: function () {
        return versionName;
      },

      getLanguage: function () {
        return language;
      },

      getNoticeStName: function () {
        return noticeStName;
      },

      getNoticeEdName: function () {
        return noticeEdName;
      },

      setNoticeStName: function (s) {
        noticeStName = s;
      },

      setNoticeEdName: function (s) {
        noticeEdName = s;
      },

      getMyMessage: function () {
        return myMessage;
      },

      getNotPayList: function () {
        return notPayList;
      },

      getLnagCh: function () {
        return lang_ch;
      },

      getLnagEn: function () {
        return lang_en;
      }

    };


  });
