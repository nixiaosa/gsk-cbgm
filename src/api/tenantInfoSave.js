// let host = 'https://30.100api.cn/' // 开发API地址
// let host = 'https://liveapi.cn/' // 测试API地址
let host = 'https://api.cmalive.cn/' // 线上API地址
const href = window.location.href
if (href.indexOf('localhost') >= 0 || window.location.port === '9004') {
  host = '' // 本地调试走代理
} else if (href.indexOf('.test.') >= 0) {
  host = 'https://30.100api.cn/'
} else if (href.indexOf('.100live.') >= 0 || href.indexOf('saas-test.') >= 0) {
  host = 'https://liveapi.cn/'
} else if (href.indexOf('.100doc.') >= 0) {
  host = 'https://api.cmalive.cn/'
}

const getSig = `${host}djb_company/yb-resource-api-ntk/`
const versionHost = `${host}djb_company/yb-user-api-ntk/`
const companyHost = `${host}yb-company/`
const djbUserApiHost = `${host}djb_company/yb-user-api/`
const vmsHost = `${host}yb-vms/`
const djbPayHost = `${host}djb_company/yb-pay-api/`
const djbHost = `${host}djb_company/yb-question-api/`
const djbCompanyHost = `${host}djb_company/yb-business-api/`
const djbResourceHost = `${host}djb_company/yb-resource-api/`
const djbImHost = `${host}djb_company/yb-im-api/`
const djbCommentHost = `${host}djb_company/yb-comment-api/`
const djbCMSHost = `${host}djb_company/yb-cms-api/`
const djbSignHost = `${host}djb_company/yb-sign-api/`
const djbQaHost = `${host}djb_company/yb-qa-api/`
const djbTask = `${host}djb_company/yb-task-api/`
const djbVote = `${host}djb_company/yb-vote-api/`
const djbContent = `${host}djb_company/yb-strategy-api/`
const userHost = `${host}djb_company/yb-user-api/`
const djbLotteryHost = `${host}djb_company/yb-lottery-api/`
const djbVoteHost = `${host}djb_company/yb-saas-vote-api/vote/`
const djbDocumentHost = `${host}djb_company/yb-document-api/`
const djbUserNtkHost = `${host}djb/yb-user-api-ntk/`


export default {
  company: {
    taskFinish: `${companyHost}company/task/finish` // 结束任务
  },
  // 登录 个人信息相关
  login: `${companyHost}company/user/login`, // 登录
  loginOut: `${companyHost}admin/user/logout`, // 退出
  getcompanyconf: `${djbUserApiHost}company/config/get`, // 得到租户信息

  getuserinfo: `${companyHost}company/user/`, // 得到后台用户信息
  updateinfo: `${companyHost}company/user/update`, // 更新个人信息
  // 调研问卷 2.0版
  questionnaireList: `${djbQaHost}/questionnaire/list`, // 调研问卷管理列表
  questionnaireFinish: `${djbQaHost}questionnaire/finish/`, // 结束调研问卷
  questionnaireStop: `${djbQaHost}/qa/company/question/stop/`, // 调研问卷——停用/启用 {questionId}
  questionnaireEdit: `${djbQaHost}manage/questionnaire/detail/`, // 问卷详情
  questionnaireItem: `${djbQaHost}statistics/questionnaire/`, // 获取问卷 问题统计
  questionnaireUserList: `${djbQaHost}statistics/user`, // 获取用户列表
  questionnaireUserExport: `${djbQaHost}statistics/user/export`, // 调研问卷 用户列表导出
  questionnaiRerelation: `${djbQaHost}qa/company/question/query/notaskbind`, // 调研问卷 关联业务
  questionnaireExportIdPhotoList: `${djbQaHost}qa/company/question/import/credentials/`, //调研问卷证件照导出

  questionnaireApplyList: `${djbQaHost}qa/user/apply/company/list`, // 调研问卷申请管理列表
  questionnaireApplyAudit: `${djbQaHost}qa/user/apply/company/audit`, // 调研问卷申请管理审核


  handle: `${companyHost}company/config/update`, // 保存租户信息
  companyGet: `${companyHost}company/config/`, // 获取信息
  regist: `${companyHost}company/user/regist`, // 小后台创建用户
  userList: `${companyHost}company/user/list`, // 小后台用户列表

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
  sendcode: `${companyHost}sms/sendcode`, // 获取验证码
  getUserHistory: `${companyHost}user/history/tag/list`, // 获取验证码
  modifypassword: `${companyHost}company/user/modifypassword`, // 修改密码
  postRegist: `${companyHost}company/user/front/regist`, // 前端用户注册
  exist: `${companyHost}company/user/username/exist`, // 验证用户是否存在
  getInfo: `${companyHost}company/user/front/get`, // id 获取前端用户信息
  updated: `${companyHost}company/user/front/update`, // 修改前台用户信息
  delete: `${djbUserApiHost}user/front/delete`, // 前台用户删除
  recharge: `${companyHost}company/point/import`, // 前台批量充值积分
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
  getMenuList: `${companyHost}company/navigation/list`, // 获取业务下的子级导航
  updateMenu: `${companyHost}company/navigation/update`, // 更新 menu
  getNavList: `${djbCMSHost}navigation/backList`, // 获取Nav列表
  createNav: `${djbCMSHost}navigation/create`, // 创建Nav
  updateNav: `${djbCMSHost}navigation/update`, // 启停Nav

  getVideoList: [`${companyHost}company/`, 'video/list'], // 获得视频直播类信息列表
  videoDataList: `${companyHost}oss/manager/watchhistory/result`, // 视频统计结果
  queryQuestionnaire: `${companyHost}company/answer/list/`, // 问卷调查列表
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

  //课程审核
  dataSourceApprove: `${djbCompanyHost}dataSource/approve`, // 课程审核
  //申请管理
  applyManageList: `${djbCompanyHost}enroll/apply/manage`, // 申请管理列表
  applyManageListExport: `${djbCompanyHost}enroll/apply/manage/export/`, // 申请管理导出
  applyApprove: `${djbCompanyHost}enroll/approve`, // 申请管理审核
  applyApproveBatch: `${djbCompanyHost}enroll/approve/batch`, // 申请管理批量审核

  getIdentityVideoVersion: `${djbCompanyHost}video/user/config/exist/`, // 获取身份新老视频区分
  getIdentityList: `${djbCompanyHost}video/user/config/get/identities/`, // 观看统计--身份列表
  getIdentityFields: `${djbCompanyHost}video/user/config/get/fields/`, // 观看统计--表头
  getIdentityWatchList: `${djbCompanyHost}video/watch/list`, // 观看统计--数据
  getIdentitySignList: `${djbCompanyHost}enroll/sign/get`, // 报名统计、签到统计
  getIdentitySignExport: `${djbCompanyHost}enroll/sign/export`, // 报名签到统计导出

  blackListSet: `${djbCompanyHost}blank/list/set`, // 上传黑名单
  blackList: `${djbCompanyHost}blank/list/`, // 黑名单列表
  blackListRemove: `${djbCompanyHost}blank/list/remove/`, // 移除黑名单

  getQaIdentityList: `${djbQaHost}qa/question/user/title`, // 调研问卷--身份列表

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
  payUserPoint: `${companyHost}company/point/add`, // 给前台用户充医币
  companyCoinAdd: `${companyHost}company/coin/add`, // 给前台用户充积分
  getAccountPoint: `${companyHost}company/point/getpoint`, // 获取后台账户积分

  stopVideo: [`${companyHost}company/`, 'video/delete/'], // 停用视频
  enableVideo: [`${companyHost}company/`, 'video/revert/'], // 启用视频

  /* 线上答题 */
  findExamManageLis: `${djbHost}question/company/findTaskExamManageList`, // 线上答题管理列表
  findManageLis: `${djbHost}question/company/findExamManageList`, // 线上答题管理列表
  questionManageCredentialsExport: `${djbHost}question/manage/credentials/export/`, // 线上答题证件照导出
  findExamPaper: `${djbHost}question/company/findExamPaper/`, // 线上答题详情
  findUserList: `${djbHost}question/company/findUserList`, // 线上答题参与用户列表
  doFinish: `${djbHost}question/company/doFinish/`, // 停止线上答题活动
  answerExport: `${djbResourceHost}export/onlineQuestion/`, // 线上答题导出
  answerExportNew: `${djbHost}question/manage/exportResult`, // 线上答题导出新
  answerApplyList: `${djbHost}question/company/apply/list`, // 线上答题申请管理列表
  answerApplyAudit: `${djbHost}question/company/apply/audit`, // 线上答题申请管理审核 1=审核通过;2=审核拒绝

  /* 知识付费 */
  payUploadFile: `${djbPayHost}pay/paySettings/uploadFile`, // 授权文件上传
  paySettingsInfo: `${djbPayHost}pay/paySettings/get`, // 设置回显
  paySettingsEdit: `${djbPayHost}pay/paySettings/edit`, // 商品设置（保存，更新）
  getMerchantPayStatus: `${djbPayHost}pay/paySettings/getMerchantPayStatus/`, // 支付验证状态轮询
  deleteAuthFile: `${djbPayHost}pay/paySettings/deleteAuthFile`, // 授权文件删除

  payArticleEdit: `${djbPayHost}pay/item/articleEdit`, // 文章商品设置
  payArticleGetInfo: `${djbPayHost}pay/item/get/`, // 文章商品回显
  payOrderList: `${djbPayHost}pay/orders/getOrders`, // 订单列表
  payOrderRefund: `${djbPayHost}pay/orders/refund`, // 退款
  getOrdersExcel: `${djbPayHost}pay/orders/getOrdersExcel`, // 订单导出
  // 答题竞赛
  questionTaskList: `${djbTask}task/list`, // 答题竞赛管理列表
  finishTask: `${djbTask}task/finish`, // 调研问卷结束任务
  questionDetails: `${djbTask}task/detail/qa_question/`, // 获取调研问卷详情
  questionSave: `${djbTask}task/save`, // 调研问卷创建
  questionReceiveDetails: `${djbTask}task/get/`, // 调研问卷领取详情
  questionReceiveList: `${djbTask}task/log/list`, // 调研问卷领取详情列表
  questionReceiveListExport: `${djbTask}task/log/export`, // 调研问卷领取详情列表导出
  /*
  * 线上合约
  * */
  contractBlacklist: `${djbSignHost}contract/manage/blacklist`, // 线上合约黑名单
  contractBlacklistImport: `${djbSignHost}contract/manage/blacklist/import`, // 线上合约黑名单导入
  contractBlackListRemove: `${djbSignHost}contract/manage/blacklist/del`, // 移除黑名单
  contractBlackCredentialsExport: `${djbSignHost}contract/manage/export/credentials/`, // 线上合约证件照导出


  contractForbidden: `${djbSignHost}contract/manage/stop`, // 启用停用
  contractDownload: `${djbSignHost}contract/manage/company/download`, // 下载合约
  contractManageList: `${djbSignHost}contract/manage/company/contractList`, // 合约管理列表
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
  videoAddress: `${companyHost}company/video/source/get/playback/`, // 获取视频地址
  videoBusId: `${companyHost}company/video/source/get/`,
  videoList: `${companyHost}company/video/source/list`, // 老的业务管理列表
  adminVideoList: `${djbCompanyHost}video/admin/list`, // 新的业务管理列表
  adminVideoDetail: `${djbCompanyHost}video/details/admin/`, // 新版列表详情
  adminWatchList: `${djbCompanyHost}video/watch/list`, // 新版数据统计
  adminWatchListExport: `${djbCompanyHost}video/watch/list/export`, // 新统计信息导出
  adminLivePush: `${djbCompanyHost}video/live/push/`, // 新版结束
  adminLivePause: `${djbCompanyHost}video/pause/`, // 直播暂停
  updateVideo: `${companyHost}company/video/source/update`,
  watchList: `${companyHost}company/video/source/watch/list`, // 老版数据
  watch2List: `${companyHost}company/video/source/watch2/list`, // 新版数据
  watch3List: `${companyHost}company/video/source/watch3/list`, // 学术会议新版数据
  stopOrStartVideo: `${companyHost}company/video/source/switch/`, // 老版课程停用
  videoSst: `${djbCompanyHost}video/sst`, // 新版课程停用
  meetingList: `${companyHost}company/meeting/list`, // 学术大会列表
  meetingBusId: `${companyHost}company/meeting/get/`, // 获取大会
  meetingStart: `${companyHost}company/meeting/switch/`, // 大会启停
  endVideolist: `${companyHost}company/video/push/`, // 结束直播
  audiencelist: `${companyHost}company/video/source/enroll/list`, // 邀请观众列表
  audienceListExport: `${djbCompanyHost}enroll/export/`, // 导出观众列表
  launchlist: `${companyHost}company/video/source/launch/list`, // 讲师观众列表

  videoExport: `${djbCompanyHost}video/export`, // 导出业务下视频列表
  getStatisticData: `${companyHost}company/mta/h5/api`, // 获取统计数据
  getAllBus: `${companyHost}company/tongji/video/get`, // 所有业务的总数据
  getOneBus: `${companyHost}company/tongji/video/get/business`, // 单个业务的数据统计
  realTimeBus: `${companyHost}company/tongji/video/get/realTime`, // 实时数据统计
  getCmsData: `${companyHost}company/tongji/news/get`, // cms内容获取
  videoWatchOut: `${companyHost}company/export/manager/watch/excel/`, // 观看信息导出
  videoWatchOut2: `${companyHost}company/export/manager/watch2/excel/`, // 观看信息导出2
  videoWatchOut3: `${companyHost}company/export/manager/watch3/excel/`, // 观看信息导出3 学术会议

  statisticsList: `${djbCMSHost}news/statistics/list`, // cms文章统计回显
  statisticsGetUv: `${djbCMSHost}news/statistics/getUv`, // cms获取UV
  statisticsGetPv: `${djbCMSHost}news/statistics/getPv`, // cms获取PV
  statisticsGetIp: `${djbCMSHost}news/statistics/getIp`, // cms获取IP
  statisticsGetDurationCount: `${djbCMSHost}news/statistics/getDurationCount`, // cms获取总时长
  statisticsGetDurationAvg: `${djbCMSHost}news/statistics/getDurationAvg`, // cms获取平均浏览时长
  statisticsExcelcms: `${djbCMSHost}news/statistics/excel`, // cms获取平均浏览时长
  oneSoltExcel: `${djbCMSHost}news/statistics/getViewsExcel`, // 单篇文章浏览记录导出
  oneSoltViewRecords: `${djbCMSHost}news/statistics/viewRecords`, // 单篇文章浏览记录列表


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

  userIdentityList: `${userHost}userinfo/list`, // 多条件获取用户信息列表
  userIdentityUpdate: `${userHost}userinfo/update`, // 修改用户信息
  userIdentityUserInfo: `${userHost}userinfo`, // 获取用户信息
  userCompanyUpdate: `${userHost}company/update`, // 修改用户信息

  inviteCreate: `${companyHost}company/task/create/enroll`, // 创建邀请任务
  invitedetails: `${companyHost}company/task/get/enroll/`, // 获取邀请任务详情
  inviteUpdate: `${companyHost}company/task/update/enroll`, // 修改邀请任务
  inviteSearch: `${companyHost}company/task/search/enroll`, // 邀请任务搜索
  inviteReceive: `${companyHost}company/task/log/search/enroll`,  // 邀请任务领取详情
  ReceiveWatch: `${companyHost}company/v3/export/task/log/search/enroll/`, // 邀请任务领取详情导出

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

  luckyGameForbidden: `${companyHost}company/lotteryGame/sst`, // 游戏抽奖启用停用
  luckyGamelist: `${companyHost}company/lotteryGame/list`, // 游戏抽奖列表
  luckyGamedetail: `${companyHost}company/lotteryGame/detail`, // 游戏详情
  GRelateBusin: `${companyHost}company/lGRelateBusin/get`, // 关联业务
  GPersonWin: `${companyHost}company/lGPersonWin/getWinList`, // 中奖人列表
  GeneralexportXls: `${companyHost}company/lGPersonWin/exportXls`, // 中奖人列表导出

  lotteryGamelist: `${djbLotteryHost}lottery/manage/GetCompanyActivities`, // (新)游戏抽奖列表
  lotteryForbidden: `${djbLotteryHost}lottery/status`, // (新)启用停用暂停结束
  getActivityDetail: `${djbLotteryHost}lottery/manage/getActivityDetail/`, // (新)启用停用暂停结束
  lotteryGameCount: `${djbLotteryHost}lottery/count`, // (新)抽奖统计
  statisticsExcel: `${djbLotteryHost}lottery/statisticsExcel`, // (新)抽奖统计导出
  lotteryAllUsers: `${djbLotteryHost}lottery/allUsers`, // (新)用户列表
  getAllUserExcel: `${djbLotteryHost}lottery/getAllUserExcel`, // (新)用户列表导出
  lotteryWinners: `${djbLotteryHost}lottery/winners`, // (新)中奖名单
  winnersVerify: `${djbLotteryHost}lottery/winners/verify`, // 中奖名单审核
  getRejectReason: `${djbLotteryHost}lottery/getRejectReason/`, // 拒绝原因回显
  exportWinners: `${djbLotteryHost}lottery/export/winners`, // (新)中奖名单导出

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

  companyWxSetting: `${userHost}wx/companyWxSetting`,    // 公众号配置——微信配置
  getCompanyWxSetting: `${userHost}wx/getCompanyWxSetting`,    // 公众号配置——租户配置回显
  templateMessageSend: `${userHost}wx/templateMessage/send`,    // 微信模板消息发送

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

  userEnrollImport: `${djbCompanyHost}enroll/import`, //导入用户
  professorEnrollImport: `${djbCompanyHost}case/professor/import`, //导入专家
  professorRemarkExport: `${companyHost}company/case/professor/remark/export/`, //专家点评导出点评列表
  professorRemarkHide: `${companyHost}company/case/professor/remark/sst/`, //专家点评列表
  professorRemarkList: `${companyHost}company/case/professor/remark/list`, //专家点评列表
  professorRemarkTotal: `${companyHost}company/case/professor/remark/count`, //当前活动专家点评总数
  professorList: `${companyHost}company/case/professor/list`, //分配专家点评弹窗-专家列表
  remarkLimitSave: `${companyHost}company/case/professor/remark/limit/save`, //分配专家点评弹窗-保存当页设置
  personUploadTotalSave: `${companyHost}company/case/allow/num/save/`, // 病例征集设置每人可上传总数保存
  personUploadTotalList: `${companyHost}company/case/allow/num/list`, // 病例征集设置每人可上传总数列表 --》活动用户列表
  caseFormList: `${companyHost}company/case/form/list/`, // 病例征集表单列表
  ocrCount: `${companyHost}company/case/fill/statistics/ocr/count`, // 病例征集当前表单收集数及ocr统计
  caseWithstatistic: `${companyHost}company/case/fill/forms/withstatistic/`, // 病例征集统计分析表单列表及统计数
  collectStopUser: `${companyHost}company/case/collect/stop/user/sst`, // 活动用户列表启停
  collectBatchStopUser: `${companyHost}company/case/collect/stop/user/sstBatch`, // 活动用户列表批量启停
  allowNumSaveBatch: `${companyHost}company/case/allow/num/saveBatch`, // 批量设置上传数量
  caseFillUserDetail: `${companyHost}company/case/fill/user/`, // 用户活动详情
  allowNumSetNum: `${companyHost}company/case/allow/num/setNum`, // 设置每人可上传病例数量
  allowNumSetPerMonthNum: `${companyHost}company/case/allow/num/setPerMonthNum`, // 设置每人每月可上传病例数量
  caseFillUserList: `${companyHost}company/case/fill/user/list`, // 当前用户病例列表
  professorListWithcount: `${companyHost}company/case/professor/list/withcount`, // 活动专家列表
  caseProfessorInfo: `${companyHost}company/case/professor/info/`, // 专家信息
  professorRemarkLimitFindWithProfessor: `${companyHost}company/case/professor/remark/limit/findWithProfessor`, // 病例分配记录
  getCaseFormRanks: `${companyHost}company/case/form/ranks/`, // 病例征集统计分析获取表单级别
  getUserAllExcport: `${djbCompanyHost}enroll/export/`, // 病例征集导出全部用户数据
  CasePdfDownload: `${companyHost}company/case/fill/page/download`, //pdf导出


  caseFormChilds: `${companyHost}company/case/form/childs`, // 病例征集参与用户列表--表单阶段
  caseCollection: `${companyHost}company/case/collect/list`, // 病例征集管理列表
  endcaseCollection: `${companyHost}company/case/collect/endactivity`, // 结束病例征集活动
  caseActivityDetail: `${companyHost}company/case/collect/details/`, // 病例征集--活动详情
  statisticsCount: `${companyHost}company/case/fill/statistics/count/`, // 病例征集参与用户列表病例统计
  caseCollectSst: `${companyHost}company/case/collect/sst`, // 病例征集启停
  caseFillExport: `${companyHost}company/case/fill/export/`, // 导出病例
  audittaskList: `${companyHost}company/audittask/list`, // 审核列表
  taskstatisticsCount: `${companyHost}company/auditflowstates/taskstatistics/count/`, // 参与用户列表 审核流程
  participants: `${companyHost}company/case/fill/list`, // 参与人员列表
  casedetail: `${companyHost}company/case/fill/detail/`, // 病例详情
  casePreview: `${companyHost}company/case/form/fill/content/get/`, // 用户病历表单预览
  casePreviewInclus: `${companyHost}company/case/form/fill/content/audit/get/`, // 用户病历表单详情
  caseFillCount: `${companyHost}company/case/fill/count/`, // 审核通过病例数
  caseSetshow: `${companyHost}company/case/fill/setShow`, // 病例显示设置
  seeCaseForm: `${companyHost}company/case/form/preview/`, // 查看表单
  professorRemarkLimitList: `${companyHost}company/case/professor/remark/limit/list/`, // 某个病例下已分配专家列表
  professorRemarkLimitCancel: `${companyHost}company/case/professor/remark/limit/cancel`, // 取消分配点评专家
  inclusionCriteria: `${companyHost}company/case/form/inclusion/criteria/list/foruser/`, // 获取入排标准
  caseCollectConfig: `${companyHost}company/case/collect/config/get/`, // 获取活动配置

  distributeCity: `${companyHost}company/audittask/distribute/city/`, // 加载审核城市
  belongsProvinces: `${companyHost}company/audittask/belongs/provinces/`, // 城市所属省份
  audittjform: `${companyHost}company/case/fill/statisticsHead/`, // 审核任务统计分析表头
  // audittjList: `${companyHost}company/case/fill/statistics`, // 审核任务统计分析列表
  audittjDown: `${companyHost}company/case/fill/download/`, // 下载审核任务统计数据
  audittaskDetails: `${companyHost}company/audittask/details/`, // 加载审核任务详情
  auditcloum: `${companyHost}company/navigation/list`, // 选择内容(加载栏目)
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
    list: `${djbCompanyHost}video/warehouse/list/`, // 获取视频库列表
    save: `${djbCompanyHost}video/warehouse/save`, // 上传回放视频保存 （1，保存） （2，编辑） 编辑 {"id":"接口1里的id","name":"文件名"}
    delete: `${djbCompanyHost}video/warehouse/delete/`, // 回放视频删除  /接口1里的id
    sort: `${djbCompanyHost}video/warehouse/sort/`, // 视频排序 /接口1里的id/排序号
    sst: `${djbCompanyHost}video/warehouse/sst/`, // 视频启停 接口1里的id/是否停用<0否1是>
    getsignature: `${vmsHost}vms/getsignature`,  // 上传视频 getsignature
    countadd: `${djbCompanyHost}dataSource/update/countadd`,
  },

  //病例征集投票
  voteCaseApplyList: `${djbVote}company/vote/apply/list`, // 病例投票申请管理列表
  voteCaseApplyAudit: `${djbVote}company/vote/apply`, // 病例投票申请管理审核

  voteCaseList: `${djbVote}company/vote/list`, // 病例投票管理列表
  forbiddenVote: `${djbVote}company/vote/forbidden`, // 启用停用
  endVoteCase: `${djbVote}company/vote/finish`, // 结束活动
  voteCaseDetail: `${djbVote}company/vote/detail`, // 投票详情
  rankList: `${djbVote}company/vote/rank`, // 排行列表
  rankDetail: `${djbVote}company/vote/rank/detail`, // 投票明细
  voteOption: `${djbVote}company/vote/option`, // 投票选项
  voteOptionDetail: `${djbVote}company/vote/option/detail`, // 投票选项详情
  HiddenVote: `${djbVote}company/vote/hidden`, // 投票选项 启动隐藏

   //普通投票V3
  voteManageList: `${djbVoteHost}manage/background/list`, // 投票管理列表
  voteBasicInfoDetail: `${djbVoteHost}manage/basic/info/`, // 投票基本信息详情
  voteStyleQuery: `${djbVoteHost}manage/query/style/`, // 投票外观设置查询
  voteManageQuerySet: `${djbVoteHost}manage/query/settings/`, // 投票设置查询
  voteQueryResult: `${djbVoteHost}manage/query/result`, // 排行榜列表
  voteQueryResultRecord: `${djbVoteHost}manage/query/result/record`, // 排行榜明细
  voteQueryResultRecordByIdentity: `${djbVoteHost}manage/query/result/recordByIdentity`, // 排行榜明细(多身份)
  voteQueryResultExport: `${djbVoteHost}manage/export/result/`, // 投票结果导出
  voteQueryOptions: `${djbVoteHost}manage/query/options/`, // 投票选项查询
  voteControlEnable: `${djbVoteHost}manage/control/enable`, // 活动启停设置
  voteQueryOptionsDetail: `${djbVoteHost}manage/query/options/item/`, // 投票选项详情查询

  voteApplicationApplyList: `${djbVoteHost}application/manage/apply/list`, // 审核列表
  voteApplicationApplyListExport: `${djbVoteHost}application/apply/list/export`, // 审核列表导出
  voteApplyOperate: `${djbVoteHost}application/apply/operate`, // 审核(通过/拒绝)

  //新导航
  getChildByParentId: `${djbCMSHost}navigation/getChildByParentId/`, // 根据一级栏目选择二级
  getAllparents: `${djbCMSHost}navigation/getAllParents`, // 一级栏目列表
  parentsList: `${djbCMSHost}navigation/parents`, // 一级栏目列表
  childList: `${djbCMSHost}navigation/child`, // 二级栏目列表
  navigationAdd: `${djbCMSHost}navigation/add`, // 添加导航栏
  NavigationUpdate: `${djbCMSHost}navigation/updateNavigation`, // 启停Nav && 编辑
  getType: `${djbCMSHost}navigation/getType`, // 获取栏目类型
  relateList: `${djbCMSHost}navigation/chooseParent`, // 关联的一级栏目
  getStyle: `${djbCMSHost}navigation/getStyle`, // 关联的一级栏目

  //内容管理
  updateNavigation: `${djbContent}contentManager/updateNavigation`, // 编辑内容
  addContent: `${djbContent}contentManager/addContent`, // 添加内容
  contentManageList: `${djbContent}contentManager/findContents`, // 内容管理列表
  getContentTypes: `${djbContent}contentManager/getContentTypes`, // 获取内容类型
  editContent: `${djbContent}contentManager/editContent`, // 编辑内容
  setTopContent: `${djbContent}contentManager/setTop`, // 置顶内容
  cancelTopContent: `${djbContent}contentManager/cancelTop`, // 取消置顶
  available: `${djbContent}contentManager/available`, // 启停
  getContentColumnsByIds: `${djbContent}contentManager/getContentColumnsByIds`, // 批量获取内容对应的栏目
  editReShow: `${djbContent}contentManager/findByContentId`, // 根据contentId获取内容详情
  editReShowContent: `${djbContent}contentManager/editByContentId`, // 根据contentId编辑内容
  getVersion: `${versionHost}company/config/get`, // 获取新老网站版本
  cancelRelation: `${djbContent}contentManager/deleteContentById`, // 取消栏目关联
  getSig: `${getSig}upload/getsignature`, // 获取腾讯桶签名
  batchAdd: `${userHost}user/manager/batch/add`, // 批量创建培训管理者

  //录制中心
  videoRecList: `${djbCMSHost}vedioREC/videoRecList`, // 录制中心列表
  videoRecListSearch: `${djbCMSHost}vedioREC/search`, // 录制信息查询
  videoRecExportExcel: `${djbCMSHost}vedioREC/exportExcel`, // 列表信息Excel文件导出
  videoRecManageList: `${djbCMSHost}videoManage/videoRecManageList`, // 回传信息列表
  videoRecManageListSearch: `${djbCMSHost}videoManage/search`, // 回传信息查询
  // 线上竞赛
  raceList: `${djbHost}competition/company/exam/list`, // 线上竞赛页面列表
  dayList: `${djbHost}competition/company/statistics/day`, // 每日竞赛统计
  totalStatisticsList: `${djbHost}competition/company/statistics/total`, // 总排行统计
  teamStatisticsList: `${djbHost}competition/company/statistics/team`, // 团队统计
  teamStatisticsDetail: `${djbHost}competition/company/statistics/team/detail`, // 团队统计详情
  getUserId: `${userHost}companytitle/get/`,  //获取租户用户身份
  dayExport: `${djbHost}competition/company/export/statistics/day`, //每日竞赛导出
  totalExport: `${djbHost}competition/company/export/statistics/total`, //总排名竞赛导出
  teamExport: `${djbHost}competition/company/export/statistics/teamDetail`, //团队竞赛导出
  logList: `${userHost}company/user/sys/log/list`, //日志列表
  logDownList: `${userHost}company/user/sys/log/download/list`, // 日志下载列表
  logDown: `${userHost}company/user/sys/log/download`, // 生成日志文件

  //资料中心
  documentCreate: `${djbDocumentHost}manage/save`, // 资料中心创建，编辑，启停
  documentList: `${djbDocumentHost}manage/list`, // 资料中心列表
  documentGetDetail: `${djbDocumentHost}manage/getDetail/`, // 资料中心详情
  getSig2: `${getSig}upload/getsignature`, // 获取腾讯桶签名

  //微信管理
  // documentCreate: `${djbDocumentHost}manage/save`, // 资料中心创建，编辑，启停
  // documentList: `${djbDocumentHost}manage/list`, // 资料中心列表
  // documentGetDetail: `${djbDocumentHost}manage/getDetail/`, // 资料中心详情
  // getSig2: `${getSig}upload/getsignature`, // 获取腾讯桶签名

  // 课件上传
  coursewareUserinfo: `${djbUserNtkHost}userinfo/`,                                 // 课件上传——上传者信息 GET请求/{userId}
  coursewareManageList: `${djbDocumentHost}courseware/manage/list`,                 // 课件上传——管理列表
  coursewareManageIsdelete: `${djbDocumentHost}courseware/manage/isdelete`,         // 课件上传——启停
  coursewareManageGetContract: `${djbDocumentHost}courseware/manage/getContract/`,  // 课件上传——劳务合同查询 GET请求/{id}
  coursewareManageReTranslate: `${djbDocumentHost}courseware/manage/reTranslate`,   // 课件上传——重新解析
}

