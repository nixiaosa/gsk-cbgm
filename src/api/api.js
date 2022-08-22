// let host = 'https://30.100api.cn/' // 开发API地址
// let host = 'https://liveapi.cn/' // 测试API地址
// let host = 'https://api.cmalive.cn/' // 线上API地址
// const href = window.location.href
// if (href.indexOf('localhost') >= 0 || window.location.port === '9004') {
//     host = '' // 本地调试走代理
// } else if (href.indexOf('.test.') >= 0) {
//     host = 'https://30.100api.cn/'
// } else if (href.indexOf('.100live.') >= 0 || href.indexOf('saas-test.') >= 0) {
//     host = 'https://liveapi.cn/'
// } else if (href.indexOf('.100doc.') >= 0) {
//     host = 'https://api.cmalive.cn/'
// }


// let host = '';
// const href = window.location.href
//   if (href.indexOf('localhost') >= 0 || (href.indexOf('.dev.')) >= 0) {
//       host = 'https://gsk.dev.100url.cn/' // 本地调试走代理
//   } else if (href.indexOf('.test.') >= 0) {
//       host = 'https://gsk.test.100url.cn/'
//   } else {
//       //host = 'https://api.cmalive.cn/'
// }

// let host = '';
// const href = window.location.href
//   if (href.indexOf('.dev.') >= 0) {
//       host = 'https://gsk.dev.100url.cn/' // 本地调试走代理
//   } else if (href.indexOf('.test.') >= 0) {
//       host = 'https://gsk.test.100url.cn/'
//   } else if (href.indexOf('localhost') >= 0 ){
//       host = ''
//   } else if (href.indexOf('skyyh') >= 0 ){
//     host = 'https://skyyh.healthy-bone.com.cn/' // gsk生产
//   } else {
//     host = 'https://healthy-bone.com.cn/'    // gsk测试
//   }

  let host = '';
  let yaKeHost = 'https://healthy-bone.com.cn'
  const href = window.location.href
  if (href.indexOf('.dev.') >= 0) {
    host = 'https://gsk.dev.100url.cn/' // 本地调试走代理
    yaKeHost = 'https://gsk.dev.100url.cn/yake.manage/api/'
  } else if (href.indexOf('.test.') > 0) {
    host = 'https://gsk.test.100url.cn/' // 开发
    yaKeHost = 'https://gsk.test.100url.cn/yake.manage/api/'
  }


const companyHost = `${host}yb-company/`
const djbCompanyHost = `${host}yb-user-api/`


// const vmsHost = `${host}yb-vms/`
const vmsHost = `${host}api/yb-vms-api/`
const djbHost = `${host}api/yb-question-api/`
const userHostNTK = `${host}api/yb-user-api-ntk/`
const BUSINESS_HOST = `${host}api/yb-business-api/`
const djbResourceHost = `${host}api/yb-resource-api/`
const djbImHost = `${host}api/yb-im-api/`
const djbCommentHost = `${host}api/yb-comment-api/`
const djbCMSHost = `${host}api/yb-cms-api/`
const djbSignHost = `${host}api/yb-sign-api/`
const djbQaHost = `${host}api/yb-qa-api/`
const djbTask = `${host}api/yb-task-api/`
const userHost = `${host}api/yb-user-api/`
const djbStatistics = `${host}api/yb-statistics-api/`
const djbstrategy = `${host}api/yb-strategy-api/`
export var Api = {
    // gskUploadImg: `yake.manage/api/file/upload`,
    gskUploadImg: `${yaKeHost}file/upload`,
    // getCodeGenerate: `${userHost}user/code/generate`, // 获取衡石code
    getCodeGenerate: `${userHost}user/code/generate`, // 获取衡石code
    watch: { // 观看统计
        getLiveTime: `${BUSINESS_HOST}video/getByBusId/`, // 直播推流时间
        locationStatistics: `${djbStatistics}video/statistics/get/locationStatistics`, // 地域分布
        userCountByDateHistogram: `${djbStatistics}video/statistics/get/userCountByDateHistogram`, // 用户分布情况
        watchDeviceDistribute: `${djbStatistics}video/statistics/get/watchDeviceDistribute`, // 观看方式
        watchHistory: `${djbStatistics}video/statistics/get/watchHistory`, // 观看统计
        watchHistoryeExport: `${djbStatistics}video/statistics/export/watchHistory`, // 观看统计导出
        watchRecord: `${djbStatistics}video/statistics/get/watchRecord`, // 观看流水
        watchRecordExport: `${djbStatistics}video/statistics/export/watchRecord`, // 观看流水导出
        watchSituation: `${djbStatistics}video/statistics/get/watchSituation`, // 直播 点播 情况
        watchTimeCount: `${djbStatistics}video/statistics/get/watchTimeCount`, // 时间---人数
    },
    identity: { // 身份管理
        get: `${userHost}companytitle/list`, // 获取租户身份列表
        cancel: `${userHost}companytitle/delete`, // 取消使用该身份
        save: `${userHost}companytitle/save`, // 使用该身份
    },
    room: {
      // 互动会议
        datailList: `${companyHost}room/detail/list`,
        out: `${companyHost}room/detail/out`, // 推出房间
    },
    signUp: {
        // 大会、会议报名
        list: `${BUSINESS_HOST}sign/up/manager/list`, // 报名列表
        export: `${BUSINESS_HOST}sign/up/export`, // 导出报名列表
    },
    signIn: {
        // 大会、会议签到
        list: `${BUSINESS_HOST}sign/in/manager/list`, // 签到列表
        export: `${BUSINESS_HOST}sign/in/export`, // 导出签到列表
    },
    businessList: {
        // 新版业务列表  增加别名设置
        list: `${djbCMSHost}navigation/bussinessList`,
        update: `${djbCMSHost}navigation/updateAlias`
    },
    navigation: {
        // 新导航
        list: `${djbCMSHost}navigation/backList`,
        editByContentIdAndBusinessId: `${djbstrategy}contentManager/editByContentIdAndBusinessId`,
        title: {
            list: `${djbCMSHost}titles/getAllTitles`, // 导航2.0 首页标题观看
            get: `${djbCMSHost}titles//getUpdateTitles/`, // 获取标题
            update: `${djbCMSHost}titles/update`, // 编辑标题
        }
    },
    interact: {
        // 互动会议
        getInteractData: `${BUSINESS_HOST}video/interactStatistic/`, // 互动数据
        export: `${BUSINESS_HOST}/video/interactStatistic/export/`, // 互动数据导出
    },
    video: {
        statusCorrection: `${BUSINESS_HOST}video/correction/status/`,
        credentialsExport: `${BUSINESS_HOST}video/credentials/export/`, // 导出证件照
    },
    getProfessional: `${userHost}title/company/all`, //小后台显示职称列表
    handleProfessional: `${userHost}title/batch/display`, //根设置医院科室是否可见
    handleCompanyOffices: `${userHost}companyOffice/handleCompanyOffices`, //根设置医院科室是否可见
    getcompanyoffice: `${userHost}companyOffice/getAllCompanyOffice`, // 获取租户下全部医院科室
    frozenList: `${userHost}company/user/frozen/company/list`, // 冻结列表
    unfreeze: `${userHost}company/user/unfreeze`, // 解除绑定
    company: {
        taskFinish: `${companyHost}company/task/finish`, // 结束任务(旧)
        taskFinishNew: `${djbTask}task/finish/` // 结束任务(新)
    },
    // 登录 个人信息相关
    login: `${companyHost}company/user/login`, // 登录
    loginOut: `${companyHost}admin/user/logout`, // 退出
    // getcompanyconf: `${djbCompanyHost}company/config/get`, // 得到租户信息
    getuserinfo: `${companyHost}company/user/`, // 得到后台用户信息
    updateinfo: `${companyHost}company/user/update`, // 更新个人信息
    // 调研问卷 2.0版
    questionnaireList: `${djbQaHost}qa/company/question/query`, // 调研问卷管理列表
    questionnaireFinish: `${djbQaHost}qa/company/question/close/`, // 结束调研问卷
    questionnaireEdit: `${djbQaHost}qa/questionnaire/query/`, // 问卷详情
    questionnaireItem: `${djbQaHost}qa/questionnaire/query/static/`, // 获取问卷 问题统计
    questionnaireUserList: `${djbQaHost}qa/static/query/users/submit`, // 获取用户列表
    questionnaireUserExport: `${djbQaHost}qa/export/exp/user/submit`, // 调研问卷 用户列表导出
    questionnaireUserExportWithoutId: `${djbQaHost}qa/export/exp/user/submit/withoutId`, // 调研问卷 用户列表导出 未开通多身份调用
    questionnaireExportList: `${djbQaHost}qa/export/exp/task/list/`, // 调研问卷导出记录

    handle: `${companyHost}company/config/update`, // 保存租户信息
    companyGet: `${companyHost}company/config/`, // 获取信息
    regist: `${companyHost}company/user/regist`, // 小后台创建用户
    userList: `${companyHost}company/user/list`, // 小后台用户列表

    djbCommentAudit: `${djbCommentHost}comment/manage/audit`, // 评论审核
    djbCommentForbidden: `${djbCommentHost}comment/manage/stop`, // 评论停用
    djbCommentSet: `${djbCommentHost}comment/manage/modifystatus`, // 评论设置
    djbCommentBtn: `${djbCommentHost}comment/manage/index`, // 评论管理按钮
    djbCommentList: `${djbCommentHost}comment/manage/commentList`, // 评论管理
    commentShieldChange: `${djbCommentHost}/comment/manage/changeStatus`, // 评论屏蔽状态切换
    commentSetTop: `${djbCommentHost}comment/manage/setTop`, // 评论置顶
    commentForbiddenStatus: `${djbCommentHost}comment/manage/forbiddenStatus`, // 查询是否启用停用系统聊天
    commentForbidden: `${djbCommentHost}comment/manage/forbidden`, // 启用停用系统聊天
    imForbiddenStatus: `${djbImHost}im/manage/forbiddenStatus`, // 查询是否启用停用IM
    imForbidden: `${djbImHost}im/manage/forbidden`, // 启用停用IM
    iMList: `${djbImHost}im/manage/messageList`, // 聊天管理
    iMShieldChange: `${djbImHost}im/manage/changeStatus`, // 聊天屏蔽状态切换
    iMGetGroupId: `${djbImHost}im/manage/getImIndex`,

    adduser: `${companyHost}company/user/regist`, // 增加用户

    userinfoList: `${companyHost}company/user/front/userinfo/list`, // 前台用户列表
    smsHandle: `${companyHost}company/config/handle`, // 保存更新短信配置
    smsList: `${companyHost}company/config/list`, // 短信配置列表
    pushTool: `${companyHost}company/manager/pushTool/query`, // 客户端地址查找
    programQuery: `${companyHost}manager/program/query`, // 后台获取视频列表
    liveQuery: `${companyHost}manager/live/query`, // 后台获取直播列表
    programGet: `${companyHost}manager/program/get/`, // 获取点播视频详情
    liveGet: `${companyHost}company/video/get/`, // 获取直播视频详情
    forgetypassword: `${companyHost}company/user/forgetypassword`, // 忘记密码
    sendcode: `${userHostNTK}sms/sendcode`, // 获取验证码
    getUserHistory: `${companyHost}user/history/tag/list`, // 获取验证码
    modifypassword: `${companyHost}company/user/modifypassword`, // 修改密码
    postRegist: `${companyHost}company/user/front/regist`, // 前端用户注册
    exist: `${companyHost}company/user/username/exist`, // 验证用户是否存在
    getInfo: `${companyHost}company/user/front/get`, // id 获取前端用户信息
    updated: `${companyHost}company/user/front/update`, // 修改前台用户信息
    delete: `${companyHost}company/user/front/delete`, // 前台用户删除
    recharge: `${djbTask}currency/operate`, // 前台批量充值积分
    getuserlist: `${companyHost}company/userinfo/list`, // 获取用户列表
    userinfo: `${companyHost}company/userinfo/`, // id 获取用户信息
    update: `${companyHost}company/userinfo/update`, // 修改用户信息
    deleteAdmin: `${companyHost}company/user/delete`, // 后台用户删除
    award: `${companyHost}company/award/list/`, // 查询百福袋列表
    baifuDetail: `${companyHost}company/award/get/`, // 获取百福袋详情
    result: `${companyHost}company/award/result/list`, // 百福袋领取明细
    awardresult: `${companyHost}company/v3/export/award/result`, // 百福袋导出
    getphone: `${companyHost}company/user/username/phone`, // 获取手机号
    namesendcode: `${companyHost}sms/username/sendcode`, // 用户名发送code

    createDrugStore: `${companyHost}company/organization/create`, // 创建药店
    drugStoreList: `${companyHost}company/organization/query`, // 药店列表
    drugStoreUser: `${companyHost}company/organization/get/userList`, // 药店列表
    getStoreOne: `${companyHost}company/organization/get/`, // 单个药店信息

    saverole: `${companyHost}company/business/auth/save`, // 创建角色
    frontrolelist: `${companyHost}company/business/auth/list`, // 前台角色列表
    powerlist: `${companyHost}company/business/auth/auth/list`, // 前台权限列表
    rolepowerlist: `${companyHost}company/business/auth/roleauthlist`, // 前台角色权限
    rolepowerlink: `${companyHost}company/business/auth/roleauth`, // 建立连接
    userIdRoleId: `${companyHost}company/business/auth/userIdRoleId`, // 用户角色关联
    userIdRoleDelete: `${companyHost}company/business/auth/userIdRoleId/delete`, // 删除用户角色
    resetPassword: `${companyHost}company/user/front/modifypassword`, // 重置、修改前台用户密码

    getPointList: `${companyHost}company/point/user/list`, // 医币列表
    // pointSelfList: `${companyHost}company/point/detail/list`, // 个人积分明细
    pointSelfList: `${companyHost}company/point/list`, // 医币明细数据查看
    exportDetailList: `${companyHost}company/point/exportDetailList/`, // 导出医币明细
    isUserisExists: `${companyHost}company/point/isUserExists/`, // 用户是否存在历史数据
    isCompanyExists: `${companyHost}company/point/isCompanyExists/`, // 租户是否存在历史数据
    historicalList: `${companyHost}company/point/listBeforeApril2`, // 医币历史明细数据
    exporthistoricalList: `${companyHost}company/point/exportBeforeApril2/`, // 导出医币历史明细数据
    platformPointList: `${companyHost}company/coin/user/list`, // 平台积分列表
    UserBudgetList: `${companyHost}company/coin/list`, // 用户收支积分明细列表
    pointSum: `${companyHost}company/coin/pointSum`, // 用户收支积分合计
    capitalList: `${companyHost}company/account/userlist`, // 用户资金列表
    capitaldetail: `${companyHost}company/account/accountlist`, // 资金明细列表
    getMyAccount: `${companyHost}company/coin/`, // 获取用户剩余积分
    Userpointdetail: `${companyHost}company/coin/detail/`, // 用户积分详情

    // banner
    createBanner: `${companyHost}company/banner/create`, // 创建banner
    deleteBanner: `${companyHost}company/banner/delete`, // 删除banner
    getBanner: `${companyHost}company/banner/get`, // 获得banner
    bannerList: `${companyHost}company/banner/list`, // banner list
    bannerUpdate: `${companyHost}company/banner/update`, // 跟新banner

    // menu
    createMenu: `${companyHost}company/navigation/create`, // 创建menu
    deteleMenu: `${companyHost}company/navigation/delete`, // 删除menu
    getMenu: `${companyHost}company/navigation/get`, // get menu
    getMenuList: `${BUSINESS_HOST}navigation/navigationList`, // 获取业务下的子级导航
    updateMenu: `${companyHost}company/navigation/update`, // 更新 menu
    getNavList: `${djbCMSHost}navigation/backList`, // 获取Nav列表
    createNav: `${djbCMSHost}navigation/create`, // 创建Nav
    updateNav: `${djbCMSHost}navigation/update`, // 启停Nav
    cmsPasswordSave: `${djbCMSHost}news/viewSet`, // cms设置浏览密码
    cmsPasswordGet: `${djbCMSHost}news/getViewSet`, // cms浏览密码回显
    cmsListTask: `${djbCMSHost}news/listForTask`, // 获取任务文章列表

    getVideoList: [`${companyHost}company/`, 'video/list'], // 获得视频直播类信息列表
    videoDataList: `${companyHost}oss/manager/watchhistory/result`, // 视频统计结果
    queryQuestionnaire: `${companyHost}company/answer/list/`, // 问卷调查列表
    stopQuestionnaire: `${companyHost}manager/answers/questionnaire/stop`, // 调查文件停用
    naireBasic: `${companyHost}company/answer/get/`, // 问卷基本信息 /*新*/
    naireResult: `${companyHost}company/answer/result/busId`, // 问卷结果 /*新*/
    questionnairesult: `${companyHost}company/v3/export/answer/result/busId`, // 问卷结果导出

    rewardlist: `${companyHost}company/vp/product/list`, // 打赏列表
    commentList: `${companyHost}company/comment/getcommentlist`, // 评论列表
    commentEdit: `${companyHost}company/comment/update`, // 修改评论（包括起停）

    deleterole: `${companyHost}company/business/auth/delete`, // 删除角色

    detailsLive: [`${companyHost}company/`, 'video/get/'], // 直播详情
    detailsProgram: [`${companyHost}company/`, 'video/get/'], // 视频详情

    // getTrainType: `${companyHost}company/tongji/get/1/type`, // 产品找培训
    // getTrainprovince: `${companyHost}company/tongji/get/1/province`, // 省份找培训
    // getTrainCity: `${companyHost}company/tongji/get/1/city`, // 城市找培训
    // getTrainTag: `${companyHost}company/tongji/get/1/tags`, // 标签找培训

    getNews: `${djbCMSHost}news/`, // 获取文章
    getNewsList: `${djbCMSHost}news/queryNews`, // 新闻列表
    createNews: `${djbCMSHost}news/save`, // 保存新闻
    newsTop: `${djbCMSHost}news/isTop`, // 置顶新闻
    newsUpdate: `${djbCMSHost}news/update `, // 更新新闻
    newsStop: `${djbCMSHost}news//setIsdeleteOrRecommend`, // 停用启用
    deleteNews: `${companyHost}company/news/delete`, // 删除新闻

    createFriend: `${companyHost}company/friendList/create`, // 建立友情链接
    deleteFriend: `${companyHost}company/friendList/delete`, // 删除友情链接
    getFriend: `${companyHost}company/friendList/get`, // 获取友情链接
    friendList: `${companyHost}company/friendList/list`, // 友情链接列表
    updateFriend: `${companyHost}company/friendList/update`, // 修改友情链接
    getBusinessId: `${companyHost}company/business/get`, // 获取租户的业务

    getService: `${companyHost}company/business/get`,

    addAccount: `${companyHost}company/account/add`, // 充值（前台）
    getAccount: `${companyHost}company/account/get`, // 获得账户余额
    getUserAccount: `${companyHost}company/user/account/`, // 获得前台用户账户余额
    uploadVideo: `${vmsHost}vms/getsignature`, // 上传视频
    uploadImg: `${vmsHost}vms/asset/file`, // 上传图片
    columnSave: `${companyHost}company/column/save`, // 添加栏目
    columnUpdate: `${companyHost}company/column/update`, // 更新栏目
    columnList: `${companyHost}company/column/list`, // 栏目列表
    columnDelete: `${companyHost}company/column/delete`, // 删除栏目
    columnGet: `${companyHost}company/column/columnlist`, // 获取子栏目
    columnDeleteAll: `${companyHost}company/column/all/delete`, // 栏目批量删除
    getcolumn: `${companyHost}company/column/getcolumn`,
    sourceSave: `${companyHost}company/source/save`, // 创建广告
    sourceList: `${companyHost}company/source/list`, // 广告列表
    sourceGet: `${companyHost}company/source/get`, // 广告详情
    sourceUpdata: `${companyHost}company/source/update`, // 更新广告
    sourceDelect: `${companyHost}company/source/delete`, // 删除广告

    getUserPoint: `${companyHost}company/point/`, // 获取前台用户的积分余额
    payUserPoint: `${djbTask}currency/operate`, // 给前台用户充医币
    companyCoinAdd: `${companyHost}company/coin/add`, // 给前台用户充积分
    getAccountPoint: `${companyHost}company/point/getpoint`, // 获取后台账户积分

    stopVideo: [`${companyHost}company/`, 'video/delete/'], // 停用视频
    enableVideo: [`${companyHost}company/`, 'video/revert/'], // 启用视频

    /* 线上答题 */
    findExamManageLis: `${djbHost}question/company/findTaskExamManageList`, // 线上答题管理列表
    findManageLis: `${djbHost}question/company/findExamManageList`, // 线上答题管理列表
    findExamPaper: `${djbHost}question/company/findExamPaper/`, // 线上答题详情
    findUserList: `${djbHost}question/company/findUserList`, // 线上答题参与用户列表
    doFinish: `${djbHost}question/company/doFinish/`, // 停止线上答题活动
    answerExport: `${djbResourceHost}export/onlineQuestion/`, // 线上答题导出

    // 答题竞赛 // 任务接口 可以统一
    taskList: `${djbTask}task/list`, // 答题竞赛  任务管理列表
    taskFinish: `${djbTask}task/finish/`, // 结束任务
    taskDetail: `${djbTask}task/detail/`, // 任务详情
    taskSave: `${djbTask}task/save`, // 创建任务
    findTaskCompetitionList: `${djbHost}competition/manage/findTaskCompetitionList`, // 获取答题竞赛关联内容
    taskGet: `${djbTask}task/get/`, // 答题竞赛 领取详情
    taskLogList: `${djbTask}task/log/list`, // 积分发放统计
    taskLogExport: `${djbTask}task/log/export`, // 领取积分导出
    taskStatisticsExport: `${djbTask}task/log/statistics/export`, // 总排行导出
    taskLogStatistics: `${djbTask}task/log/statistics`, // 领取积分排名
    taskLogJoincount: `${djbTask}task/log/joincount/`, // 排行榜总人数

    /*
    * 线上合约
    * */
    contractManageList: `${djbSignHost}contract/manage/company/contractList`, // 合约管理列表
    contractManageExport: `${djbSignHost}contract/manage/company/batch/export`, // 合约批量导出
    contractCodeList: `${djbSignHost}contract/manage/company/contractCodeList`, // 合约编号
    contractDetail: `${djbSignHost}contract/manage/company/contractDetail`, // 合约详情
    addContractCode: `${djbSignHost}contract/manage/company/addContractCode`, // 创建编号
    modifyContractCode: `${djbSignHost}contract/manage/company/modifyContractCode`, // 更新编号
    exportContract: `${djbSignHost}contract/manage/company/exportContract`, // 导出合约

    activeList: `${companyHost}company/active/vote/list`, // 活动列表
    activeDetail: `${companyHost}company/active/vote/get/`, // 活动详情
    deteleActive: `${companyHost}company/active/vote/delete/`, // 删除活动
    stopStartActive: `${companyHost}company/active/vote/stop`, // 暂停/继续活动
    activeRank: `${companyHost}company/active/rank/list`, // 活动排名
    ticketsDetail: `${companyHost}company/active/vote/detaillist`, // 活动投票明细
    sourceInfo: `${companyHost}company/active/vote/source/get`, // 活动资源信息

    getPlayUrl: [`${companyHost}company/`, 'video/get/playback/'], // 获取播放地址
    getPlayInfo: [`${companyHost}company/`, 'video/get/'], // 获取播放地址

    upPlayBackVideo: `${companyHost}company/video/live/program/create`, // 回放视频上传
    delPlayBackVideo: `${companyHost}company/video/live/program/delete`, // 回放视频删除
    playBckVideoOne: `${companyHost}company/video/live/program/get/`, // 回放列表获取
    playBckVideoList: `${companyHost}company/video/live/program/list`, // 回放视频列表
    updatePlayBackVideo: `${companyHost}company/video/live/program/update`, // 更新回放
    videoAddress: `${BUSINESS_HOST}video/play/back/get/`, // 获取视频地址
    // videoBusId: `${companyHost}company/video/source/get/`,
    videoBusId: `${BUSINESS_HOST}api/video/details/admin/`,
    videoList: `${companyHost}company/video/source/list`, // 老的业务管理列表
    adminVideoList: `${BUSINESS_HOST}video/admin/list`, // 新的业务管理列表
    adminVideoDetail: `${BUSINESS_HOST}video/details/admin/`, // 新版列表详情
    adminWatchList: `${BUSINESS_HOST}video/watch/list`, // 新版数据统计
    adminWatchListExport: `${BUSINESS_HOST}video/watch/list/export/`, // 新统计信息导出
    adminLivePush: `${BUSINESS_HOST}video/live/push/`, // 新版结束
    updateVideo: `${companyHost}company/video/source/update`,
    watchList: `${companyHost}company/video/source/watch/list`, // 老版数据
    watch2List: `${companyHost}company/video/source/watch2/list`, // 新版数据
    stopOrStartVideo: `${companyHost}company/video/source/switch/`, // 老版课程停用
    videoSst: `${BUSINESS_HOST}video/sst`, // 新版课程停用
    meetingList: `${companyHost}company/meeting/list`, // 学术大会列表
    meetingBusId: `${companyHost}company/meeting/get/`, // 获取大会
    meetingStart: `${companyHost}company/meeting/switch/`, // 大会启停
    // endVideolist: `${companyHost}company/video/push/`, // 结束直播
    endVideolist: `${BUSINESS_HOST}video/live/push/`, // 结束直播
    audiencelist: `${BUSINESS_HOST}enroll/import/get`, // 邀请观众列表
    audienceListExport: `${BUSINESS_HOST}enroll/export/`, // 导出观众列表
    launchlist: `${BUSINESS_HOST}launch/get/`, // 讲师观众列表

    videoExport: `${BUSINESS_HOST}video/export`, // 导出业务下视频列表
    getStatisticData: `${companyHost}company/mta/h5/api`, // 获取统计数据
    getAllBus: `${companyHost}company/tongji/video/get`, // 所有业务的总数据
    getOneBus: `${companyHost}company/tongji/video/get/business`, // 单个业务的数据统计
    realTimeBus: `${companyHost}company/tongji/video/get/realTime`, // 实时数据统计
    getCmsData: `${companyHost}company/tongji/news/get`, // cms内容获取
    videoWatchOut: `${companyHost}company/export/manager/watch/excel/`, // 观看信息导出
    videoWatchOut2: `${companyHost}company/export/manager/watch2/excel/`, // 观看信息导出2

    updateAuth: `${companyHost}company/auth/auth/update`, // 更新权限
    delAuth: `${companyHost}company/auth/auth/delete`, // 删除权限
    addAuth: `${companyHost}company/auth/auth/add`, // 增加权限
    getAuthListtwo: `${companyHost}company/auth/auth/list`, // 获取权限列表
    authVsMenu: `${companyHost}company/auth/auth/menuresource/add`, // 菜单与权限进行关联
    getAuthMenuList: `${companyHost}company/auth/auth/menuresource/list`, // 获取权限已经关联的菜单
    getMenuAndBtns: `${companyHost}company/auth/company/menuresource/list`, // 租户对应的菜单以及buttons

    updateRole: `${companyHost}company/auth/role/update`, // 更新角色
    authOfRole: `${companyHost}company/auth/roleauth/list`, // 角色的权限获取
    delrole: `${companyHost}company/auth/role/delete`, // 删除角色
    addrole: `${companyHost}company/auth/role/add`, // 创建一个角色
    getRoleList: `${companyHost}company/auth/role/list`, // 获得角色列表
    roleAndAuth: `${companyHost}company/auth/roleauth/add`, // 角色和权限关联
    userVsRole: `${companyHost}company/auth/userrole/add`, // 用户角色关联
    getUserRole: `${companyHost}company/auth/userrole/list`, // 获取用户的角色

    identityAdd: `${companyHost}company/role/add`, // 增加身份
    identityUpdate: `${companyHost}company/role/update`, // 编辑身份
    identityDelete: `${companyHost}company/role/delete`, // 删除身份
    identityTree: `${companyHost}company/role/tree`, // 身份树
    userAddIdentity: `${companyHost}company/role/userrole/add`, // 给用户增加身份
    userDeleteIdentity: `${companyHost}company/role/userrole/delete`, // 清空用户身份

    inviteCreate: `${companyHost}company/task/create/enroll`, // 创建邀请任务{旧}
    inviteCreateNew: `${djbTask}task/save`, // 创建邀请任务「新」
    inviteDetails: `${companyHost}company/task/get/enroll/`, // 获取邀请任务详情「旧」
    enrollNewGet: `${djbTask}task/get/`, // 积分已发放统计「旧」
    inviteDetailsNew: `${djbTask}/task/detail/enroll_new/`, // 获取邀请任务详情「新」
    inviteUpdate: `${companyHost}company/task/update/enroll`, // 修改邀请任务
    inviteSearch: `${companyHost}company/task/search/enroll`, // 邀请任务搜索「旧」
    inviteSearchNew: `${djbTask}task/list`, // 邀请任务搜索「新」
    inviteReceive: `${companyHost}company/task/log/search/enroll`,  // 邀请任务领取详情{旧}
    inviteReceiveNew: `${djbTask}task/log/list`,  // 邀请任务领取详情「新」
    ReceiveWatch: `${companyHost}company/v3/export/task/log/search/enroll/`, // 邀请任务领取详情导出「旧」
    ReceiveWatchNew: `${djbTask}task/log/export`, // 邀请任务领取详情导出{新}

    lookCreate: `${companyHost}company/task/create/look`, // 创建浏览任务
    lookSearch: `${companyHost}company/task/search/look`, // 创建任务搜索
    lookdetails: `${companyHost}company/task/get/look/`, // 获取浏览任务详情
    lookReceive: `${companyHost}company/task/log/search/look`,  // 浏览任务领取详情
    lookWatch: `${companyHost}company/v3/export/task/log/search/look/`, // 浏览任务领取详情导出
    lookUpdate: `${companyHost}company/task/update/look`, // 修改邀请任务

    taskExport: `${djbResourceHost}export/task/`,

    answerCreate: `${companyHost}company/task/create/question`, // 创建答题任务
    answerUpdate: `${companyHost}company/task/update/question`, // 修改答题任务
    answerList: `${companyHost}company/task/search/question`, // 答题任务列表
    answerDetail: `${companyHost}company/task/get/question/`, // 获取答题任务详情
    answerReceive: `${companyHost}company/task/log/search/question`,  // 答题任务领取详情
    answerWatch: `${companyHost}company/v3/export/task/log/search/question/`, // 答题任务领取详情导出

    luckyGamelist: `${companyHost}company/lotteryGame/list`, // 游戏抽奖列表
    luckyGamedetail: `${companyHost}company/lotteryGame/detail`, // 游戏详情
    GRelateBusin: `${companyHost}company/lGRelateBusin/get`, // 关联业务
    GPersonWin: `${companyHost}company/lGPersonWin/getWinList`, // 中奖人列表
    GeneralexportXls: `${companyHost}company/lGPersonWin/exportXls`, // 中奖人列表导出

    getWXqr: `${companyHost}officialAccount/twoDimensionCode/get`,     // 获取 微信/小程序 二维码
    getWXUserList: `${companyHost}officialAccount/user/list`,          //  微信公众号用户列表---获取
    getWXMenuList: `${companyHost}officialAccount/customMenu/list`,            //  微信公众号全部菜单列表---获取
    getWXMenuOneList: `${companyHost}officialAccount/customMenu/getLevelOne/`, //  微信公众号一级菜单列表---获取
    addWXMenu: `${companyHost}officialAccount/customMenu/save`,                //  自定义菜单---新增
    updateWXMenu: `${companyHost}officialAccount/customMenu/update`,           //  自定义菜单---编辑
    removeWXMenu: `${companyHost}officialAccount/customMenu/delete`,           //  自定义菜单---删除
    publishWXMenu: `${companyHost}officialAccount/customMenu/publish`,           //  自定义菜单---发布
    getWXmessageList: `${companyHost}officialAccount/message/list`,      //  微信消息管理---获取
    addWXmessage: `${companyHost}officialAccount/message/save`,          //  微信消息管理---新增
    updateWXmessage: `${companyHost}officialAccount/message/update`,      //  微信消息管理---编辑
    deleteWXmessage: `${companyHost}officialAccount/message/delete`,    // 微信消息管理 --- 删除

    commodityList: `${companyHost}company/pointMall/goods/list`, // 商品列表
    commoditydetail: `${companyHost}company/pointMall/goods/info`, // 商品详情
    commodityadd: `${companyHost}company/pointMall/goods/save`, // 添加商品
    commodityupdate: `${companyHost}company/pointMall/goods/update`, // 修改商品

    categoryList: `${companyHost}company/pointMall/category/list`, // 品类列表
    categoryupdate: `${companyHost}company/pointMall/category/update`, // 品类修改
    categorydescribe: `${companyHost}company/pointMall/goods/update`, // 修改商品(增加商品描述)
    AlbumList: `${companyHost}company/pointMall/goodsImg/list`, // 商品相册列表
    goodsImgupdate: `${companyHost}company/pointMall/goodsImg/update`, // 相册排序
    Albumadd: `${companyHost}company/pointMall/goodsImg/save`, // 添加相册
    Albumdelete: `${companyHost}company/pointMall/goodsImg/delete`, // 删除相册
    categroyAdd: `${companyHost}company/pointMall/category/save`, // 品类添加
    categrodetail: `${companyHost}company/pointMall/category/info`, // 品类详情

    stockList: `${companyHost}company/pointMall/stock/list`, // 库存列表
    stocksList: `${companyHost}company/pointMall/stock/info`, // 非卡券库存信息
    stockupdate: `${companyHost}company/pointMall/stock/update`, // 编辑库存
    stokcardAdd: `${companyHost}company/pointMall/stock/saveCardStock`, // 添加卡券库存
    stockAdd: `${companyHost}company/pointMall/stock/saveStock/`, // 添加非卡券库存

    OrderList: `${companyHost}company/pointMall/order/list`, // 订单列表
    Orderdetail: `${companyHost}company/pointMall/order/info`, // 订单详情
    orderAudit: `${companyHost}company/pointMall/order/audit`, // 审核通过/拒绝
    deliverGoods: `${companyHost}company/pointMall/order/deliverGoods`, // 发货

    voteList: `${companyHost}company/active/getVotingActiveList`, // 投票活动管理
    votedetail: `${companyHost}company/active/getTopic`, // 投票活动管理--活动详情
    votedelete: `${companyHost}company/active/delete`, // 投票活动管理--删除
    makeChart: `${companyHost}company/active/getActiveTopList`, // 投票活动管理--活动排行榜
    makeChartdetail: `${companyHost}company/active/getVotingDetailList`, // 投票活动管理--活动排行榜--投票详情
    case: {
        stop: `${companyHost}company/case/fill/sst/`, // 病例启停
        export: `${companyHost}company/case/fill/download/`, // 病例征集统计数据申请导出
        exportList: `${companyHost}company/case/fill/async/export/list`, // 病例征集 统计数据申请人员列表
        exportCredentials: `${companyHost}company/case/fill/credentials/export/`, // 导出证件照
    },
    caseCollection: `${companyHost}company/case/collect/list`, // 病例征集管理列表
    endcaseCollection: `${companyHost}company/case/collect/endactivity`, // 结束病例征集活动
    caseActivityDetail: `${companyHost}company/case/collect/details/`, // 病例征集--活动详情
    statisticsCount: `${companyHost}company/case/fill/statistics/count/`, // 病例征集参与用户列表病例统计
    caseCollectSst: `${companyHost}company/case/collect/sst`, // 病例征集启停
    caseFillExport: `${companyHost}company/case/fill/export/`, // 导出病例
    audittaskList: `${companyHost}company/audittask/list`, // 审核列表
    participants: `${companyHost}company/case/fill/list`, // 参与人员列表
    casedetail: `${companyHost}company/case/fill/detail/`, // 病例详情
    casePreview: `${companyHost}company/case/form/fill/content/get/`, // 用户病历表单预览
    caseFillCount: `${companyHost}company/case/fill/count/`, // 审核通过病例数
    caseSetshow: `${companyHost}company/case/fill/setShow`, // 病例显示设置
    seeCaseForm: `${companyHost}company/case/form/preview/`, // 查看表单
    audittjform: `${companyHost}company/case/fill/statisticsHead/`, // 审核任务统计分析表头
    // audittjList: `${companyHost}company/case/fill/statistics`, // 审核任务统计分析列表
    audittjDown: `${companyHost}company/case/fill/download`, // 下载审核任务统计数据
    audittaskDetails: `${companyHost}company/audittask/details/`, // 加载审核任务详情
    // auditcloum: `${companyHost}company/navigation/list`, // 选择内容(加载栏目)
    auditcloum: `${BUSINESS_HOST}navigation/navigationList`, // 选择内容(加载栏目)
    distributeUser: `${companyHost}company/audittask/distribute/user`, // 获取审核人列表
    auditservice: `${companyHost}company/audittask/business/contents`, // 选择内容(加载业务内容)
    auditidentify: `${companyHost}company/audittask/distribut/identify/`, // 添加审核身份(加载审核身份)
    saveidentify: `${companyHost}company/audittask/conditions/save`, // 添加审核身份(保存)
    auditarea: `${companyHost}company/audittask/distribut/province/`, // 分配区域(加载审核区域)
    getProvince: `${companyHost}company/audittask/distribute/province/`, // 加载审核区域
    getConditions: `${companyHost}company/audittask/conditions/get/`, // 9).~加载某个审核级别下的所有审核人及关联审核条件:
    relateSave: `${companyHost}company/audittask/conditions/relate/save`, // 保存审核
    savearea: `${companyHost}company/audittask/conditions/relate/save`, // 分配区域(保存)
    relationIdentify: `${companyHost}company/audittask/conditions/getRelateConditions/`, // 关联审核身份(加载审核身份)
    relationSave: `${companyHost}company/audittask/conditions/relate/save`, // 关联审核身份(保存)
    getSuperlist: `${companyHost}company/audittask/conditions/superlist/`, // 加载上级审核人
    deleteIdentify: `${companyHost}company/audittask/conditions/delete/`, // 删除审核身份
    deletecondition: `${companyHost}company/audittask/conditions/relate/delete/`, // 删除关联条件
    audittasksave: `${companyHost}company/audittask/save`, // 保存审核任务
    audittaskcancel: `${companyHost}company/audittask/cancel/`, // 取消审核任务
    audittaskdelete: `${companyHost}company/audittask/delete/`, // 删除审核任务
    auditTaskEnd: `${companyHost}company/audittask/endtask/`, // 结束审核任务
    auditExport: `${companyHost}company/auditflowstates/taskstatistics/export/`, // 导出审核任务列表
    auditTaskTtatistics: `${companyHost}company/auditflowstates/taskstatistics`, // 1).加载审核任务统计列表:
    videoManage: {
        list: `${BUSINESS_HOST}video/warehouse/list/`, // 获取视频库列表
        save: `${BUSINESS_HOST}video/warehouse/save`, // 上传回放视频保存 （1，保存） （2，编辑） 编辑 {"id":"接口1里的id","name":"文件名"}
        delete: `${BUSINESS_HOST}video/warehouse/delete/`, // 回放视频删除  /接口1里的id
        sort: `${BUSINESS_HOST}video/warehouse/sort/`, // 视频排序 /接口1里的id/排序号
        sst: `${BUSINESS_HOST}video/warehouse/sst/`, // 视频启停 接口1里的id/是否停用<0否1是>
        getsignature: `${vmsHost}vms/getsignature`  // 上传视频 getsignature
    }
}
