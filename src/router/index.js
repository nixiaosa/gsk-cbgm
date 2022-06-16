import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

Vue.use(Router)

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will not redirct in the levelbar
 * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
 * meta : `{ role: ['admin'] }`  will control the page role
 **/
export const constantRouterMap = [
    {path: '/login', component: _import('login/index'), hidden: true},
    {path: '/404', component: _import('404'), hidden: true},
    {path: '/forgetPassword', component: _import('userInfo/forgetPassword'), hidden: true},
    {path: '/checkPdf/:url', name: 'checkPdf', component: _import('base/check-pdf'), hidden: true},
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: '数据展示',
        hidden: true,
        children: [
            {path: 'dashboard', component: _import('dashboard/index')}
        ]
    },
    {
        path: '/userInfo',
        component: Layout,
        redirect: '/userInfo/index',
        name: '个人中心',
        hidden: true,
        children: [
            {path: 'index', component: _import('userInfo/index'), name: '个人信息', meta: {role: ['/#/userInfo/index']}},
            {
                path: 'changePass',
                component: _import('userInfo/changePassword'),
                name: '修改密码',
                meta: {role: ['/#/userInfo/changaPass']}
            }
        ]
    }
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})

export const asyncRouter404 = [{path: '*', redirect: '/404', hidden: true}]


export const asyncRouterMap = [
    {
        path: '/basedata',
        component: Layout,
        icon: 'jichuxinxizhongxin_20_hui',
        name: '基础信息中心',
        sign: 'basic_information_center',
        children: [
            {
                path: 'index',
                component: _import('base/index'),
                icon: 'zonghe',
                name: '基础信息',
                sign: 'basic_information_manage'
            },
            {
                path: 'professional',
                component: _import('base/professional'),
                icon: 'zonghe',
                name: '职称管理',
                sign: 'basics_title_manage'
            },
            {
                path: 'office',
                component: _import('base/office'),
                icon: 'zonghe',
                name: '科室管理',
                sign: 'office_manage'
            },
            {
                path: 'businessManage',
                component: _import('base/BusinessManage'),
                icon: 'zonghe',
                name: '业务列表',
                sign: 'basic_business_manage'
            },
            {
                path: 'identity/manage',
                component: _import('base/identity/IdentityManage'),
                icon: 'zonghe',
                name: '身份管理',
                sign: 'basics_identity_manage'
            },
            {
                path: 'sign/manage',
                component: _import('base/signManage'),
                icon: 'zonghe',
                name: '签到管理',
                // sign: 'basics_identity_manage'
            },
        ]
    },
    {
        path: '/user',
        component: Layout,
        icon: 'houtaiyonghuzhongxin_20_bai',
        name: '后台用户中心',
        sign: 'back_user_center',
        children: [
            {
                path: 'userlist',
                component: _import('user/userlist'),
                icon: 'zonghe',
                name: '后台用户管理',
                sign: 'back_user_manage'
            },
            {
                path: 'creatrole',
                component: _import('power/creatrole'),
                name: '后台角色管理',
                icon: 'zonghe',
                sign: 'back_role_manage'
            },
            {
                path: 'creatauth',
                component: _import('power/creatauth'),
                name: '后台权限管理',
                icon: 'zonghe',
                sign: 'back_auth_manage'
            },
            {
                path: 'authvsmenu/:name/:id',
                component: _import('power/authvsmenu'),
                name: '后台权限配置',
                role: ['back_auth_authorize'],
                hidden: true,
                icon: 'zonghe'
            }
        ]
    },
    {
        path: '/taskCenter',
        component: Layout,
        icon: 'renwuzhongxin_20_hui',
        redirect: '/taskCenter/shareTask',
        name: '任务中心',
        sign: 'task_center',
        children: [
            {
                path: 'questionnaire',
                component: _import('questionnaire/questionnaires'),
                name: '调研问卷任务',
                sign: 'questionnaire_task_manage'
            },
            {path: 'questionnaireCreate', component: _import('questionnaire/create'), name: '创建任务', hidden: true},
            {
                path: 'questionnaireDetail/:page',
                component: _import('questionnaire/details'),
                hidden: true,
                name: '调研问卷查看详情'
            },
            {
                path: 'questionnaireReceive/:page',
                component: _import('questionnaire/questionnaireReceive'),
                name: '调研问卷领取详情',
                hidden: true
            },

            {
                path: 'receive/:page',
                component: _import('invite/receive'),
                name: '邀请任务(旧)领取详情',
                meta: {type: 'old'},
                hidden: true
            },
            {
                path: 'receive/new/:page',
                component: _import('invite/receive'),
                name: '邀请任务(新)领取详情',
                meta: {type: 'new'},
                hidden: true
            },
            {
                path: 'invite',
                component: _import('invite/invite'),
                name: '邀请注册(旧)',
                meta: {type: 'old'},
                sign: 'invite_regist_manage'
            },
            {
                path: 'invite/new',
                component: _import('invite/invite'),
                name: '邀请注册(新)',
                meta: {type: 'new'},
                sign: 'invite_regist_new_manage'
            },
            {
                path: 'create',
                component: _import('invite/create'),
                name: '创建邀请任务(旧)',
                role: ['create_invite_regist', 'edit_invite_regist'],
                hidden: true
            },
            {
                path: 'create/new/:id?',
                component: _import('invite/InviteCreateNew'),
                name: '创建邀请任务(新)',
                hidden: true
            },
            {
                path: 'inviteDetails/:page',
                component: _import('invite/InviteDetails'),
                hidden: true,
                meta: {type: 'old'},
                name: '邀请任务(旧)查看详情'
            },
            {
                path: 'inviteDetails/new/:page',
                component: _import('invite/InviteDetails'),
                hidden: true,
                meta: {type: 'new'},
                name: '邀请任务(新)查看详情'
            },
            {path: 'browse', component: _import('browse/browseList'), name: '视频浏览任务', sign: 'video_look_manage'},
            {
                path: 'creates',
                component: _import('browse/create'),
                name: '创建视频浏览任务',
                role: ['create_video_look', 'edit_video_look'],
                hidden: true
            },
            {path: 'lookdetails/:page', component: _import('browse/details'), name: '视频浏览任务查看详情', hidden: true},
            {path: 'receives/:page', component: _import('browse/receive'), name: '视频浏览任务领取详情', hidden: true},
            {
                path: 'answer',
                component: _import('taskcenter/answer/manage'),
                name: '答题奖励任务',
                sign: 'answer_task_manage'
            },
            {path: 'createAll/:type', component: _import('taskcenter/base/create'), name: '创建任务', hidden: true},
            {path: 'createAll/:type/:id', component: _import('taskcenter/base/create'), name: '编辑任务任务', hidden: true},
            {
                path: 'taskdetails/:id/:page',
                component: _import('taskcenter/base/task-details'),
                name: '任务详情',
                hidden: true
            },
            {
                path: 'taskGetDetails/:id/:page?/:type',
                component: _import('taskcenter/base/task-get-detail'),
                name: '任务领取详情',
                meta: {event: 'question'},
                hidden: true
            },
            // 答题竞赛任务
            {
                path: 'answerCompetition',
                sign: 'answer_competition_task_manage',
                component: _import('taskcenter/answerCompetition/answerCompetitionManage'),
                name: '答题竞赛任务',
                meta: {
                    keepAlive: true,
                    event: 'competition' // 任务类型
                }
            },
            {
                path: 'answerCompetitionCreate/:id?/:type?',
                component: _import('taskcenter/answerCompetition/answerCompetitionCreate'),
                name: '创建答题竞赛任务',
                meta: {
                    event: 'competition', // 任务类型
                    title: '创建答题竞赛任务'
                },
                hidden: true
            },
            {
                path: 'taskGetDetails/:id',
                component: _import('taskcenter/base/task-get-detail'),
                name: '任务领取详情',
                meta: {event: 'competition'},
                hidden: true
            },
            // 答题竞赛任务
            {
                path: 'lookcmsCompetition',
                sign: 'article_look_manage',
                component: _import('taskcenter/ArticleLook/Manage'),
                name: '文章浏览任务',
                meta: {
                    keepAlive: true,
                    event: 'lookcms' // 任务类型
                }
            },
            {
                path: 'lookcmsCompetitionCreate/:id?/:type?',
                component: _import('taskcenter/ArticleLook/Create'),
                name: '创建文章浏览任务',
                meta: {
                    event: 'lookcms', // 任务类型
                    title: '创建文章浏览任务'
                },
                hidden: true
            }
        ]
    },
    {
        path: '/audit',
        component: Layout,
        icon: 'shenhezhongxin_20_hui',
        name: '审核中心',
        sign: 'audit_center',
        children: [
            {
                path: 'auditList',
                component: _import('auditCenter/auditList'),
                name: '审核列表',
                sing: 'audit_list',
                meta: {keepAlive: true,}
            },
            {
                path: 'createAudit/:id/:type?',
                component: _import('auditCenter/createAudit'),
                name: '创建审核任务',
                hidden: true
            },
            {path: 'audittj/:id/:rank', component: _import('auditCenter/audittj'), name: '统计信息', hidden: true}
        ]
    },

    {
        path: '/logs',
        component: Layout,
        icon: 'rizhiguanli_20_hui',
        name: '日志管理',
        sign: 'logs_manage',
        children: [
            {
                path: 'logList',
                component: _import('logs/logList'),
                name: '操作日志',
                sign: 'logs_operation'
            },
            {
                path: 'logDownLoad',
                component: _import('logs/logDownLoad'),
                name: '日志下载',
                sign: 'logs_download'
            }
        ]
    },

    {
        path: '/disc',
        component: Layout,
        icon: 'luzhizhongxin_20_hui',
        name: '录制中心',
        sign: 'video_disc_center',
        children: [
            {
                path: 'transcribe',
                component: _import('transcribeCenter/transcribeList'),
                name: '录制记录',
                // sign: 'video_disc_record',
                role: ['video_disc_record', 'video_disc_back'],
                // meta: {keepAlive: true,}
            },
            // {
            //     path: 'transcribeBack',
            //     component: _import('transcribeCenter/transcribeListBack'),
            //     name: '录制回传',
            //     role: ['video_disc_record','video_disc_back'],
            //     // sign: 'video_disc_back',
            // }
        ]
    },


    {
        path: '/mall',
        component: Layout,
        icon: 'shangchengguanli_20_hui',
        name: '商城管理',
        sign: 'mall_center',
        children: [
            {
                path: 'commodity',
                component: _import('mall/commodity'),
                icon: 'zonghe',
                name: '商品管理',
                sign: 'commodity_manage'
            },
            {
                path: 'commoditydetail',
                component: _import('mall/commoditydetail'),
                icon: 'zonghe',
                name: '查看商品',
                hidden: true
            },
            {path: 'basic', component: _import('mall/base/basic'), icon: 'zonghe', name: '基本信息', hidden: true},
            {
                path: 'category',
                component: _import('mall/category'),
                icon: 'zonghe',
                name: '品类管理',
                sign: 'commodity_ classify_manage'
            },
            {path: 'order', component: _import('mall/order'), icon: 'zonghe', name: '订单管理', sign: 'mall_order_manage'},
            {path: 'orderdetail', component: _import('mall/orderdetail'), icon: 'zonghe', hidden: true, name: '订单详情'}
        ]
    },
    {
        path: '/foreUser',
        component: Layout,
        icon: 'qiantaiyonghuzhongxin_20_hui',
        name: '前台用户中心',
        sign: 'front_user_center',
        children: [
            {
                path: 'user',
                name: '前台用户管理',
                icon: 'zonghe',
                component: _import('business/foreuser/userList'),
                sign: 'front_user_manage'
            },
            {
                path: 'structure',
                name: '身份组织管理',
                icon: 'zonghe',
                component: _import('structure/index'),
                sign: 'front_identity_manage'
            },
            {
                path: 'blackList',
                name: '黑名单用户',
                icon: 'zonghe',
                component: _import('base/blackList'),
                sign: 'cbgm_blacklist'
            }
        ]
    },
    {
        path: '/nav',
        component: Layout,
        icon: 'daohangzhongxin_20_hui',
        name: '导航中心',
        sign: 'navigation_center',
        children: [
            {
                path: 'index',
                component: _import('navigationManage/navigationManage'),
                name: '导航管理',
                icon: 'zonghe',
                sign: 'navigation_manage'
            },
            {
                path: 'indexNew',
                component: _import('navigationManageNew/navigationManage'),
                name: '导航管理',
                icon: 'zonghe',
                sign: 'navigation_v2_manage'
            },
            {
                path: 'navigationTitleManage',
                component: _import('navigationManageNew/navigationTitleManage'),
                name: '标题管理',
                icon: 'zonghe',
                role: ['navigation_v2_manage'],
            },
            {
                path: 'navigationTitleCreate/:id/:templateId',
                component: _import('navigationManageNew/navigationTitleCreate'),
                name: '标题配置',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'addFirstNav',
                component: _import('navigationManageNew/addFirstNav'),
                name: '添加一级栏目',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'addSecNav',
                component: _import('navigationManageNew/addSecNav'),
                name: '添加二级栏目',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'friendlink',
                component: _import('friendlink/friend'),
                name: '友情链接管理',
                icon: 'zonghe',
                sign: 'friend_link_manage'
            }
        ]
    },
    {
        path: '/resource',
        component: Layout,
        name: '资源中心',
        icon: 'ziyuanzhongxin_20_hui1',
        meta: {businessId: 999},//keepAlive不更新处理
        sign: 'resource_center',
        children: [
            {
                path: 'index',
                name: '广告管理',
                icon: 'zonghe',
                component: _import('advertising/advertisingList'),
                sign: 'ad_manage'
            },
            {
                path: 'advertisingEdit',
                component: _import('advertising/advertising'),
                icon: 'zonghe',
                role: ['ad_add', 'ad_edit'],
                hidden: true,
                name: '广告编辑'
            },
            {
                path: 'banner',
                component: _import('banner/banner'),
                name: 'Banner管理',
                icon: 'zonghe',
                sign: 'banner_manage'
            },
            {
                path: 'banneredit',
                component: _import('banner/banneredit'),
                name: 'Banner编辑',
                icon: 'zonghe',
                role: ['banner_add', 'banner_edit'],
                hidden: true
            },
            {
                path: 'content',
                component: _import('business/contentManage/contentList'),
                name: '内容管理',
                icon: 'zonghe',
                sign: 'resource_content_manage'
            },
        ]
    },
    {
      path: '/coursewareUpload',
      component: Layout,
      name: '课件上传',
      icon: 'courseware_upload',
      meta: {businessId: 999},//keepAlive不更新处理
      sign: 'courseware_upload',
      children: [
        {
          path: 'coursewareList',
          name: '课件管理',
          icon: 'zonghe',
          component: _import('coursewareUpload/coursewareList'),
          sign: 'courseware_manage'
        },
      ]
    },
    {
        path: '/material',
        component: Layout,
        name: '资料中心',
        icon: 'ziliaozhongxin_20_moren',
        meta: {businessId: 999},//keepAlive不更新处理
        sign: 'information_center',
        children: [
            {
                path: 'materialList',
                component: _import('business/material/materialList'),
                name: '资料管理',
                icon: 'zonghe',
                sign: 'information_manage'
            },
            {
                path: 'edit',
                component: _import('business/material/edit'),
                name: '资料编辑',
                icon: 'zonghe',
                hidden: true
            },
        ]
    },
    {
        path: '/article',
        component: Layout,
        icon: 'wenzhangzhongxin_20_hui',
        name: '文章中心',
        sign: 'article_center',
        children: [
            {path: 'index1', name: '栏目管理', icon: 'zonghe', component: _import('column/index1'), sign: 'column_manage'},
            {
                path: 'index',
                component: _import('business/knowledge/knowledgeList'),
                icon: 'zonghe',
                name: '文章管理',
                sign: 'article_manage'
            },
            {
                path: 'cms',
                component: _import('column/cms'),
                icon: 'zonghe',
                name: '文章统计',
                sign: 'article_statistics'
            },
            {
                path: 'oneSoltCms',
                component: _import('column/oneSoltCms'),
                icon: 'zonghe',
                name: '单篇文章统计',
                hidden: true,
            },
            {
                path: 'edit',
                component: _import('business/knowledge/knowledge'),
                icon: 'zonghe',
                hidden: true,
                role: ['article_add', 'article_edit'],
                name: '详情与编辑'
            },
            {
                path: 'comment',
                component: _import('interactioncms/interaction-manage'),
                icon: 'zonghe',
                hidden: true,
                name: '评论管理'
            },
            {
                path: 'goodsSets',
                component: _import('business/knowledge/goodsSets'),
                icon: 'zonghe',
                hidden: true,
                name: '商品设置'
            }
        ]
    },
    {
        path: '/activity',
        component: Layout,
        icon: 'huodongzhongxin_20_hui',
        name: '活动中心',
        meta: {businessId: 999},//keepAlive不更新处理
        sign: 'activity_center',
        children: [
            {path: 'checkPdf', name: '预览pdf', component: _import('base/check-pdf'), hidden: true},
            {
                path: 'luck',
                component: _import('LuckGame/LuckGamelist'),
                icon: 'zonghe',
                name: '抽奖活动管理',
                sign: 'activity_game_manage'
            },
            {
                path: 'luckdetail',
                component: _import('LuckGame/LuckGame-details'),
                icon: 'zonghe',
                name: '抽奖活动管理',
                hidden: true,
                children: [
                    {
                        path: 'gamedetail/:id/:page',
                        component: _import('LuckGame/gamedetail'),
                        icon: 'zonghe',
                        hidden: true,
                        name: '游戏详情'
                    },
                    {
                        path: 'Relation/:id/:page',
                        component: _import('LuckGame/Relation'),
                        icon: 'zonghe',
                        hidden: true,
                        name: '关联业务'
                    }
                ]
            },
            {
                path: 'Winners/:gameId',
                component: _import('LuckGame/Winner'),
                icone: 'zonghe',
                hidden: true,
                name: '中奖人列表'
            },

            {
                path: 'lottery',
                component: _import('lottery/lotteryList'),
                icon: 'zonghe',
                name: '抽奖活动管理',
                sign: 'activity_game_manage_new'
            },
            {
                path: 'lottery/statistics/:lotteryId',
                component: _import('lottery/statistics'),
                icone: 'zonghe',
                hidden: true,
                name: '抽奖统计(新)'
            },
            {
                path: 'lottery/userlist/:lotteryId',
                component: _import('lottery/userList'),
                icone: 'zonghe',
                hidden: true,
                name: '用户列表(新)'
            },
            {
                path: 'lottery/luckyList/:id/:lotteryId',
                component: _import('lottery/luckyList'),
                icone: 'zonghe',
                hidden: true,
                name: '中奖名单(新)'
            },

            {
                path: 'vote',
                component: _import('activity/vote'),
                name: '投票活动管理',
                icon: 'zonghe',
                sign: 'vote_activity_manage'
            },
            {
                path: 'votedetail/:id',
                component: _import('activity/votedetail'),
                name: '（旧）投票活动管理详情',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'makeChart/:id/:page',
                component: _import('activity/makeChart'),
                name: '排行榜',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'makeChartdetail/:id/:page',
                component: _import('activity/makeChartdetail'),
                name: '排行榜详情',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'caseVote',
                component: _import('caseVote/caseVote'),
                name: '病例投票管理',
                icon: 'zonghe',
                sign: 'case_vote_manage',
                // meta: {
                //     keepAlive: true,
                // }
            },
            {
                path: 'caseVoteDetail/:id',
                component: _import('caseVote/caseVoteDetail'),
                name: '病例投票详情',
                icon: 'zonghe',
                hidden: true,
                // meta: {
                //     keepAlive: true,
                // }
            },
            {
                path: 'rankingList/:id',
                component: _import('caseVote/rankingList'),
                name: '病例投票排行榜',
                icon: 'zonghe',
                hidden: true,
                // meta: {
                //     keepAlive: true,
                // }
            },
            {
                // path: 'definiteDetailed/:id/:page',
                path: 'definiteDetailed/:id',
                component: _import('caseVote/definiteDetailed'),
                name: '排行榜明细',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'voteSelect/:id',
                component: _import('caseVote/voteSelect'),
                name: '投票选项',
                icon: 'zonghe',
                hidden: true,
                meta: {
                    keepAlive: true,
                }
            },
            {
                path: 'selectDetail/:id',
                component: _import('caseVote/selectDetail'),
                name: '投票选项详情',
                icon: 'zonghe',
                hidden: true
            },
            // {
            //     path: 'caseprviewvote/:caseId',
            //     component: _import('caseVote/base/case-form-preview'),
            //     name: '预览表单',
            //     icon: 'zonghe',
            //     hidden: true
            // },
            {
                path: 'caseVote/applylist/:id',
                component: _import('caseVote/applyList'),
                name: '申请管理',
                icon: 'zonghe',
                hidden: true
            },


            {
                path: 'normalVote',
                component: _import('normalVote/normalVote'),
                name: '投票活动管理',
                icon: 'zonghe',
                sign: 'vote_activity_manage_v2',
                // meta: {
                //     keepAlive: true,
                // }
            },
            {
                path: 'normalVoteDetail/:id',
                component: _import('normalVote/normalVoteDetail'),
                name: '投票活动详情',
                icon: 'zonghe',
                hidden: true,
                // meta: {
                //     keepAlive: true,
                // }
            },
            {
                path: 'normalRankingList/:id',
                component: _import('normalVote/normalRankingList'),
                name: '投票活动排行榜',
                icon: 'zonghe',
                hidden: true,
                // meta: {
                //     keepAlive: true,
                // }
            },
            {
                // path: 'definiteDetailed/:id/:page',
                path: 'normalDefiniteDetailed/:id',
                component: _import('normalVote/normalDefiniteDetailed'),
                name: '排行榜明细',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'normalVoteSelect/:id',
                component: _import('normalVote/normalVoteSelect'),
                name: '投票选项',
                icon: 'zonghe',
                hidden: true,
                meta: {
                    keepAlive: true,
                }
            },
            {
                path: 'normalSelectDetail/:id',
                component: _import('normalVote/normalSelectDetail'),
                name: '投票选项详情',
                icon: 'zonghe',
                hidden: true
            },
            // {
            //     path: 'contractManageNormalprview/:id',
            //     component: _import('normalVote/base/case-form-preview'),
            //     name: '预览表单',
            //     icon: 'zonghe',
            //     hidden: true
            // },

            {
                path: 'normalVoteV3',
                component: _import('normalVoteV3/normalVote'),
                name: '(新)投票管理',
                icon: 'zonghe',
                sign: 'vote_activity_manage_v3',
                // meta: {
                //     keepAlive: true,
                // }
            },
            {
                path: 'normalVoteDetailV3/:id',
                component: _import('normalVoteV3/normalVoteDetail'),
                name: '投票活动详情',
                icon: 'zonghe',
                hidden: true,
                // meta: {
                //     keepAlive: true,
                // }
            },
            {
                path: 'normalRankingListV3/:id',
                component: _import('normalVoteV3/normalRankingList'),
                name: '投票活动排行榜',
                icon: 'zonghe',
                hidden: true,
                // meta: {
                //     keepAlive: true,
                // }
            },
            {
                // path: 'definiteDetailed/:id/:page',
                path: 'normalDefiniteDetailedV3/:id',
                component: _import('normalVoteV3/normalDefiniteDetailed'),
                name: '排行榜明细',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'normalVoteSelectV3/:id',
                component: _import('normalVoteV3/normalVoteSelect'),
                name: '投票选项',
                icon: 'zonghe',
                hidden: true,
                meta: {
                    keepAlive: true,
                }
            },
            {
                path: 'normalSelectDetailV3',
                component: _import('normalVoteV3/normalSelectDetail'),
                name: '投票选项详情',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'voteSet/:id',
                component: _import('normalVoteV3/voteSet'),
                name: '投票设置',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'styleSet/:id',
                component: _import('normalVoteV3/styleSet'),
                name: '外观设置',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'normalVote/applylist/:id',
                component: _import('normalVoteV3/applyList'),
                name: '申请管理',
                icon: 'zonghe',
                hidden: true
            },





            {
                path: 'caseCollection',
                component: _import('caseCollection/caseCollection'),
                name: '病例征集管理',
                icon: 'zonghe',
                sign: 'activity_case_manage',
                meta: {
                    keepAlive: true,
                }
            },
            {
                path: 'caseCollection/userImport',
                component: _import('caseCollection/base/userImport'),
                name: '导入用户',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'caseCollection/professorImport',
                component: _import('caseCollection/base/professorImport'),
                name: '导入专家',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'caseCollection/applylist/:id',
                component: _import('caseCollection/applyList'),
                name: '申请管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'caseActivityDetail/:id',
                component: _import('caseCollection/caseActivityDetail'),
                name: '活动详情',
                icon: 'zonghe',
                hidden: true,
                meta: {
                    keepAlive: true,
                }
            },
            {
                path: 'casedetails/:id',
                component: _import('caseCollection/base/casedetails'),
                name: '病例详情',
                icon: 'zonghe',
                role: ['activity_case_detail'],
                hidden: true
            },
            {
                path: 'activedetail',
                component: _import('caseCollection/base/activeUserDetail'),
                name: '用户活动详情',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'specialdetail',
                component: _import('caseCollection/base/specialDetail'),
                name: '专家分配详情',
                icon: 'zonghe',
                hidden: true
            },
            {
                // path: 'caseprview/:id',
                path: 'caseprview/:id/:formId',
                component: _import('caseCollection/base/case-form-preview'),
                name: '预览表单',
                icon: 'zonghe',
                meta: {navbarHidden: true},
                hidden: true
            },
            {
                path: 'caseprview/:id/:activeId?',
                component: _import('caseCollection/base/case-form-preview'),
                name: '预览表单',
                icon: 'zonghe',
                meta: {navbarHidden: true},
                hidden: true
            },

            {
                // path: 'caseprview/:id',
                path: 'caseprviewkeyword/:id/:caseCollectId',//关键字预览
                component: _import('caseCollection/base/case-form-preview-keyword'),
                name: '预览表单',
                icon: 'zonghe',
                meta: {navbarHidden: true},
                hidden: true
            },
            {
                path: 'caseprviewkeyword/:id/:activeId?',//关键字预览
                component: _import('caseCollection/base/case-form-preview-keyword'),
                name: '预览表单',
                icon: 'zonghe',
                meta: {navbarHidden: true},
                hidden: true
            },

            /*
            * 线上竞赛
            * */
            {
                path: 'raceManage',
                component: _import('activity/race/race-manage'),
                name: '线上竞赛管理',
                icon: 'zonghe',
                sign: 'activity_competition_manage'
            },
            {
                path: 'raceDetail/:id',
                component: _import('activity/race/activity-race-detail'),
                icon: 'zonghe',
                name: '竞赛详情',
                hidden: true
            },


            /*
            * 线上答题
            * */
            {
                path: 'answerManage',
                component: _import('activity/answer/answer-manage'),
                name: '线上答题管理',
                icon: 'zonghe',
                sign: 'activity_answer_manage'
            },
            {
                path: 'answerDetail/:id',
                component: _import('activity/answer/activity-answer-detail'),
                icon: 'zonghe',
                name: '答题详情',
                hidden: true
            },
            {
                path: 'answerManage/applylist/:id',
                component: _import('activity/answer/applyList'),
                name: '申请管理',
                icon: 'zonghe',
                hidden: true
            },
            // 线上签约
            {
                path: 'contractManage',
                component: _import('activity/contract/contract-manage'),
                icon: 'zonghe',
                name: '线上合约管理',
                sign: 'activity_contract_manage'
            },
            {
                path: 'contractDetail/:templateId/:id',
                component: _import('activity/contract/components/ContractDetail'),
                icon: 'zonghe',
                name: '线上合约详情',
                hidden: true
            },
            {
                path: 'contract/blacklist/:id',
                component: _import('activity/contract/blackList'),
                name: '黑名单',
                icon: 'zonghe',
                hidden: true
            },
            // 调研问卷
            {
                path: 'questionnaireManage',
                component: _import('activity/questionnaire/questionnaireManage'),
                icon: 'zonghe',
                name: '调研问卷管理',
                sign: 'activity_ questionnaire_manage',
            },
            {
                path: 'questionnaireManage/applylist/:id',
                component: _import('activity/questionnaire/applyList'),
                name: '申请管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'questionnaireDetails/:id',
                component: _import('activity/questionnaire/questionnaireDetails'),
                icon: 'zonghe',
                name: '问卷详情',
                hidden: true
            },
            {
                path: 'questionnaireDetailsV2/:id',
                component: _import('activity/questionnaire/questionnaireDetailsV2'),
                icon: 'zonghe',
                name: '问卷详情',
                hidden: true
            }
        ]
    },
    {
        path: '/features',
        component: Layout,
        icon: 'gongnengzhongxin_20_hui',
        name: '功能中心',
        sign: 'function_center',
        children: [
            {
                path: 'reward',
                component: _import('business/reward/reward'),
                name: '打赏管理',
                icon: 'zonghe',
                sign: 'reward_manage'
            },
            {
                path: 'comment',
                component: _import('business/comment/comment'),
                name: '评论管理',
                icon: 'zonghe',
                sign: 'comment_manage'
            }
        ]
    },
    {
        path: '/classroom',
        redirect: '/classroom/manage',
        component: Layout,
        name: '空中课堂管理',
        icon: 'kongzhongketangzhongxin_20_hui',
        meta: {businessId: 2},
        sign: 'classroom_center',
        children: [
            {
                path: 'manage',
                component: _import('business/class/class'),
                name: '课堂管理',
                icon: 'zonghe',
                sign: 'classroom_manage',
                meta: {keepAlive: true}
            },
            {
                path: 'classdata/:id/:page',
                component: _import('business/class/classdata'),
                name: '视频统计',
                icon: 'zonghe',
                role: ['classroom_statistics'],
                hidden: true
            },
            {
                path: 'classdata2/:id/:page',
                component: _import('business/class/classdata2'),
                name: '视频统计',
                icon: 'zonghe',
                // role: ['classroom_statistics'],
                hidden: true
            },
            {
                path: 'classVideo/:id/:videoId/:page',
                component: _import('business/class/classVideo'),
                name: '播放',
                icon: 'zonghe',
                role: ['classroom_play'],
                hidden: true
            },
            {
                path: 'blessing',
                component: _import('business/blessing/blessing'),
                name: '百福袋管理',
                icon: 'zonghe',
                sign: 'classroom_fortune_bag_manage'
            },
            {
                path: 'blessdetail/:id',
                component: _import('business/blessing/blessingdetail'),
                name: '百福袋结果详情',
                icon: 'zonghe',
                role: ['classroom_fortune_bag_detail'],
                hidden: true
            },
            {
                path: 'survey',
                component: _import('business/survey/survey'),
                name: '调查问卷管理',
                icon: 'zonghe',
                sign: 'classroom_questionnaire_manage'
            },
            {
                path: 'surveydetail/:id',
                component: _import('business/survey/surveydetail'),
                name: '调查问卷结果详情',
                icon: 'zonghe',
                role: ['classroom_questionnaire_detail'],
                hidden: true
            },
            {
                path: 'detailed/:id',
                component: _import('business/class/detailed'),
                name: '查看导入数据',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'detailed2/:id',
                component: _import('business/class/detailed2'),
                name: '查看导入数据',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'blacklist/:id',
                component: _import('business/class/blackList'),
                name: '会议黑名单',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'applylist/:id',
                component: _import('business/class/applyList'),
                name: '申请管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'index',
                component: _import('activity/activityList'),
                icon: 'zonghe',
                name: '活动管理',
                sign: 'classroom_activity_manage'
            },
            {
                path: 'interaction/:businessId/:id/:commentId',
                component: _import('interaction/interaction-manage'),
                name: '互动管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'interactionV2/:businessId/:id/:commentId',
                component: _import('interaction/interaction-manageV2'),
                name: '互动管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'videoManage/:businessId/:busId/:id',
                component: _import('business/video/video-manage'),
                name: '视频管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'activity',
                component: _import('activity/activity-details'),
                icon: 'zonghe',
                hidden: true,
                name: '活动详情',
                children: [
                    {
                        path: 'information/:businessId/:id',
                        component: _import('activity/information'),
                        icon: 'zonghe',
                        role: ['classroom_activity_detail'],
                        hidden: true,
                        name: '活动信息'
                    },
                    {
                        path: 'rank/:businessId/:id',
                        component: _import('activity/rank'),
                        icon: 'zonghe',
                        role: ['classroom_activity_detail'],
                        hidden: true,
                        name: '排行榜'
                    },
                    {
                        path: 'rank/:businessId/:type/:sourceId/:id',
                        component: _import('activity/details'),
                        icon: 'zonghe',
                        role: ['classroom_activity_detail'],
                        hidden: true,
                        name: '投票详情'
                    }
                ]
            }
        ]
    },
    {
        path: '/train',
        redirect: '/train/manage',
        component: Layout,
        icon: 'dianyuanpeixunzhongxin_20_hui',
        name: '店员培训管理',
        meta: {businessId: 1},
        sign: 'train_center',
        children: [
            {
                path: 'manage',
                component: _import('business/class/class'),
                name: '培训管理',
                icon: 'zonghe',
                sign: 'train_manage',
                meta: {keepAlive: true}
            },
            {
                path: 'classdata/:id/:page',
                component: _import('business/class/classdata'),
                name: '视频统计',
                icon: 'zonghe',
                role: ['train_statistics'],
                hidden: true
            },
            {
                path: 'classdata2/:id/:page',
                component: _import('business/class/classdata2'),
                name: '视频统计',
                icon: 'zonghe',
                // role: ['train_statistics'],
                hidden: true
            },
            {
                path: 'classVideo/:id/:videoId/:page',
                component: _import('business/class/classVideo'),
                name: '播放',
                icon: 'zonghe',
                role: ['train_play'],
                hidden: true
            },
            {
                path: 'blessing',
                component: _import('business/blessing/blessing'),
                name: '百福袋管理',
                icon: 'zonghe',
                sign: 'train_fortune_bag_manage'
            },
            {
                path: 'blessdetail/:id',
                component: _import('business/blessing/blessingdetail'),
                name: '百福袋结果详情',
                icon: 'zonghe',
                role: ['train_fortune_bag_detail'],
                hidden: true
            },
            {
                path: 'survey',
                component: _import('business/survey/survey'),
                name: '调查问卷管理',
                icon: 'zonghe',
                sign: 'train_questionnaire_manage'
            },
            {
                path: 'surveydetail/:id',
                component: _import('business/survey/surveydetail'),
                name: '调查问卷结果详情',
                icon: 'zonghe',
                role: ['train_questionnaire_detail'],
                hidden: true
            },
            {
                path: 'detailed/:id',
                component: _import('business/class/detailed'),
                name: '查看导入数据',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'detailed2/:id',
                component: _import('business/class/detailed2'),
                name: '查看导入数据',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'blacklist/:id',
                component: _import('business/class/blackList'),
                name: '会议黑名单',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'applylist/:id',
                component: _import('business/class/applyList'),
                name: '申请管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'index',
                component: _import('activity/activityList'),
                icon: 'zonghe',
                name: '活动管理',
                sign: 'train_activity_manage'
            },
            {
                path: 'interaction/:businessId/:id/:commentId',
                component: _import('interaction/interaction-manage'),
                name: '互动管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'interactionV2/:businessId/:id/:commentId',
                component: _import('interaction/interaction-manageV2'),
                name: '互动管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'videoManage/:businessId/:busId/:id',
                component: _import('business/video/video-manage'),
                name: '视频管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'activity',
                component: _import('activity/activity-details'),
                icon: 'zonghe',
                hidden: true,
                name: '活动详情',
                children: [
                    {
                        path: 'information/:businessId/:id',
                        component: _import('activity/information'),
                        icon: 'zonghe',
                        role: ['train_activity_detail'],
                        hidden: true,
                        name: '活动信息'
                    },
                    {
                        path: 'rank/:businessId/:id',
                        component: _import('activity/rank'),
                        icon: 'zonghe',
                        role: ['train_activity_detail'],
                        hidden: true,
                        name: '排行榜'
                    },
                    {
                        path: 'rank/:businessId/:type/:sourceId/:id',
                        component: _import('activity/details'),
                        icon: 'zonghe',
                        role: ['train_activity_detail'],
                        hidden: true,
                        name: '投票详情'
                    }
                ]
            }
        ]
    },
    {
        path: '/conference',
        redirect: '/conference/manage',
        component: Layout,
        icon: 'xueshuhuiyizhongxin_20_hui',
        name: '学术会议管理',
        meta: {businessId: 5},
        sign: 'academic_conference_center',
        children: [
            {
                path: 'manage',
                component: _import('business/class/class'),
                name: '会议管理',
                icon: 'zonghe',
                sign: 'academic_conference_manage',
                meta: {keepAlive: true}
            },
            {
                path: 'classdata/:id/:page',
                component: _import('business/class/classdata'),
                name: '视频统计',
                icon: 'zonghe',
                role: ['academic_conference_statistics'],
                hidden: true
            },
            {
                path: 'classdata2/:id/:page',
                component: _import('business/class/classdata2'),
                name: '视频统计',
                icon: 'zonghe',
                // role: ['academic_conference_statistics'],
                hidden: true
            },
            {
                path: 'classVideo/:id/:videoId/:page',
                component: _import('business/class/classVideo'),
                name: '播放',
                icon: 'zonghe',
                role: ['academic_conference_play'],
                hidden: true
            },
            {
                path: 'academic',
                component: _import('business/class/academicList'),
                icon: 'zonghe',
                name: '学术大会',
                sign: 'convention_manage'
            },
            {
                path: 'classdataAcademic/:id/:page',
                component: _import('business/class/classdataAcademic'),
                name: '统计信息',
                icon: 'zonghe',
                // role: ['academic_conference_statistics'],
                hidden: true
            },
            {
                path: 'blacklist/:id',
                component: _import('business/class/blackList'),
                name: '会议黑名单',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'applylist/:id',
                component: _import('business/class/applyList'),
                name: '申请管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'details/:id',
                component: _import('business/class/details'),
                name: '查看详情',
                icon: 'zonghe',
                role: ['convention_detail'],
                hidden: true
            },
            {
                path: 'blessing',
                component: _import('business/blessing/blessing'),
                name: '百福袋管理',
                icon: 'zonghe',
                sign: 'academic_conference_fortune_bag_manage'
            },
            {
                path: 'blessdetail/:id',
                component: _import('business/blessing/blessingdetail'),
                name: '百福袋结果详情',
                icon: 'zonghe',
                role: ['academic_conference_fortune_bag_detail'],
                hidden: true
            },
            {
                path: 'survey',
                component: _import('business/survey/survey'),
                name: '调查问卷管理',
                icon: 'zonghe',
                sign: 'academic_conference_questionnaire_manage'
            },
            {
                path: 'surveydetail/:id',
                component: _import('business/survey/surveydetail'),
                name: '调查问卷结果详情',
                icon: 'zonghe',
                role: ['academic_conference_questionnaire_detail'],
                hidden: true
            },
            {
                path: 'index',
                component: _import('activity/activityList'),
                icon: 'zonghe',
                name: '活动管理',
                sign: 'academic_conference_activity_manage'
            },
            {
                path: 'interaction/:businessId/:id/:commentId',
                component: _import('interaction/interaction-manage'),
                name: '互动管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'interactionV2/:businessId/:id/:commentId',
                component: _import('interaction/interaction-manageV2'),
                name: '互动管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'videoManage/:businessId/:busId/:id',
                component: _import('business/video/video-manage'),
                name: '视频管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'activity',
                component: _import('activity/activity-details'),
                icon: 'zonghe',
                hidden: true,
                name: '活动详情',
                children: [
                    {
                        path: 'information/:businessId/:id',
                        component: _import('activity/information'),
                        icon: 'zonghe',
                        role: ['academic_conference_activity_detail'],
                        hidden: true,
                        name: '活动信息'
                    },
                    {
                        path: 'rank/:businessId/:id',
                        component: _import('activity/rank'),
                        icon: 'zonghe',
                        role: ['academic_conference_activity_detail'],
                        hidden: true,
                        name: '排行榜'
                    },
                    {
                        path: 'rank/:businessId/:type/:sourceId/:id',
                        component: _import('activity/details'),
                        icon: 'zonghe',
                        role: ['academic_conference_activity_detail'],
                        hidden: true,
                        name: '投票详情'
                    }
                ]
            }
        ]
    },
    {
        path: '/online',
        redirect: '/online/manage',
        component: Layout,
        icon: 'xianshanggongkaikezhongxin_20_hui',
        name: '线上公开课管理',
        meta: {businessId: 4},
        sign: 'online_class_center',
        children: [
            {
                path: 'manage',
                component: _import('business/class/class'),
                name: '公开课管理',
                icon: 'zonghe',
                sign: 'online_class_manage',
                meta: {keepAlive: true}
            },
            {
                path: 'classdata/:id/:page',
                component: _import('business/class/classdata'),
                name: '视频统计',
                icon: 'zonghe',
                role: ['online_class_statistics'],
                hidden: true
            },
            {
                path: 'classdata2/:id/:page',
                component: _import('business/class/classdata2'),
                name: '视频统计',
                icon: 'zonghe',
                // role: ['online_class_statistics'],
                hidden: true
            },
            {
                path: 'classVideo/:id/:videoId/:page',
                component: _import('business/class/classVideo'),
                name: '播放',
                icon: 'zonghe',
                role: ['online_class_play'],
                hidden: true
            },
            {
                path: 'blessing',
                component: _import('business/blessing/blessing'),
                name: '百福袋管理',
                icon: 'zonghe',
                sign: 'online_class_fortune_bag_manage'
            },
            {
                path: 'blessdetail/:id',
                component: _import('business/blessing/blessingdetail'),
                name: '百福袋结果详情',
                icon: 'zonghe',
                role: ['online_class_fortune_bag_detail'],
                hidden: true
            },
            {
                path: 'survey',
                component: _import('business/survey/survey'),
                name: '调查问卷管理',
                icon: 'zonghe',
                sign: 'online_class_questionnaire_manage'
            },
            {
                path: 'surveydetail/:id',
                component: _import('business/survey/surveydetail'),
                name: '调查问卷结果详情',
                icon: 'zonghe',
                role: ['online_class_questionnaire_detail'],
                hidden: true
            },
            {
                path: 'index',
                component: _import('activity/activityList'),
                icon: 'zonghe',
                name: '活动管理',
                sign: 'online_class_activity_manage'
            },
            {
                path: 'interaction/:businessId/:id/:commentId',
                component: _import('interaction/interaction-manage'),
                name: '互动管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'interactionV2/:businessId/:id/:commentId',
                component: _import('interaction/interaction-manageV2'),
                name: '互动管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'videoManage/:businessId/:busId/:id',
                component: _import('business/video/video-manage'),
                name: '视频管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'blacklist/:id',
                component: _import('business/class/blackList'),
                name: '会议黑名单',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'applylist/:id',
                component: _import('business/class/applyList'),
                name: '申请管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'activity',
                component: _import('activity/activity-details'),
                icon: 'zonghe',
                hidden: true,
                name: '活动详情',
                children: [
                    {
                        path: 'information/:businessId/:id',
                        component: _import('activity/information'),
                        icon: 'zonghe',
                        role: ['online_class_activity_detail'],
                        hidden: true,
                        name: '活动信息'
                    },
                    {
                        path: 'rank/:businessId/:id',
                        component: _import('activity/rank'),
                        icon: 'zonghe',
                        role: ['online_class_activity_detail'],
                        hidden: true,
                        name: '排行榜'
                    },
                    {
                        path: 'rank/:businessId/:type/:sourceId/:id',
                        component: _import('activity/details'),
                        icon: 'zonghe',
                        role: ['online_class_activity_detail'],
                        hidden: true,
                        name: '投票详情'
                    }
                ]
            }
        ]
    },
    {
        path: '/interact',
        redirect: '/interact/manage',
        component: Layout,
        icon: 'hudonggongkaikezhongxin_20_hui',
        name: '互动公开课管理',
        meta: {businessId: 3},
        sign: 'interact_class_center',
        children: [
            {
                path: 'manage',
                component: _import('business/class/class'),
                name: '公开课管理',
                icon: 'zonghe',
                sign: 'interact_class_manage',
                meta: {keepAlive: true}
            },
            {
                path: 'classdata/:id/:page',
                component: _import('business/class/classdata'),
                name: '视频统计',
                icon: 'zonghe',
                role: ['interact_class_statistics'],
                hidden: true
            },
            {
                path: 'classdata2/:id/:page',
                component: _import('business/class/classdata2'),
                name: '视频统计',
                icon: 'zonghe',
                // role: ['interact_class_statistics'],
                hidden: true
            },
            {
                path: 'classVideo/:id/:videoId/:page',
                component: _import('business/class/classVideo'),
                name: '播放',
                icon: 'zonghe',
                role: ['interact_class_play'],
                hidden: true
            },
            {
                path: 'blessing',
                component: _import('business/blessing/blessing'),
                name: '百福袋管理',
                icon: 'zonghe',
                sign: 'interact_class_fortune_bag_manage'
            },
            {
                path: 'blessdetail/:id',
                component: _import('business/blessing/blessingdetail'),
                name: '百福袋结果详情',
                icon: 'zonghe',
                role: ['interact_class_fortune_bag_detail'],
                hidden: true
            },
            {
                path: 'survey',
                component: _import('business/survey/survey'),
                name: '调查问卷管理',
                icon: 'zonghe',
                sign: 'interact_class_questionnaire_manage'
            },
            {
                path: 'surveydetail/:id',
                component: _import('business/survey/surveydetail'),
                name: '调查问卷结果详情',
                icon: 'zonghe',
                role: ['interact_class_questionnaire_detail'],
                hidden: true
            },
            {
                path: 'index',
                component: _import('activity/activityList'),
                icon: 'zonghe',
                name: '活动管理',
                sign: 'interact_class_activity_manage'
            },
            {
                path: 'interaction/:businessId/:id/:commentId',
                // this.goInteraction(params.businessId, params.busId, params.id);
                component: _import('interaction/interaction-manage'),
                name: '互动管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'interactionV2/:businessId/:id/:commentId',
                component: _import('interaction/interaction-manageV2'),
                name: '互动管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'videoManage/:businessId/:busId/:id',
                component: _import('business/video/video-manage'),
                name: '视频管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'userManage/:id',
                component: _import('business/class/base/userManage'),
                name: '人员管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'applylist/:id',
                component: _import('business/class/applyList'),
                name: '申请管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'activity',
                component: _import('activity/activity-details'),
                icon: 'zonghe',
                hidden: true,
                name: '活动详情',
                children: [
                    {
                        path: 'information/:businessId/:id',
                        component: _import('activity/information'),
                        icon: 'zonghe',
                        role: ['interact_class_activity_detail'],
                        hidden: true,
                        name: '活动信息'
                    },
                    {
                        path: 'rank/:businessId/:id',
                        component: _import('activity/rank'),
                        icon: 'zonghe',
                        role: ['interact_class_activity_detail'],
                        hidden: true,
                        name: '排行榜'
                    },
                    {
                        path: 'rank/:businessId/:type/:sourceId/:id',
                        component: _import('activity/details'),
                        icon: 'zonghe',
                        role: ['interact_class_activity_detail'],
                        hidden: true,
                        name: '投票详情'
                    }
                ]
            }
        ]
    },
    {
        path: '/jbktWh',
        redirect: '/jbktWh/manage',
        component: Layout,
        icon: 'hudongketangzhongxin_20_hui',
        name: '互动课堂管理',
        meta: {businessId: 9},
        sign: 'jbkt_wh_centent',
        children: [
            {
                path: 'manage',
                component: _import('business/class/class'),
                name: '互动课管理',
                icon: 'zonghe',
                sign: 'jbkt_wh_manage',
                meta: {keepAlive: true}
            },
            {
                path: 'detailed/:id',
                component: _import('business/class/detailed'),
                name: '查看导入数据',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'detailed2/:id',
                component: _import('business/class/detailed2'),
                name: '查看导入数据',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'blacklist/:id',
                component: _import('business/class/blackList'),
                name: '会议黑名单',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'applylist/:id',
                component: _import('business/class/applyList'),
                name: '申请管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'classdata/:id/:page',
                component: _import('business/class/classdata'),
                name: '视频统计',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'classdata2/:id/:page',
                component: _import('business/class/classdata2'),
                name: '视频统计',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'classVideo/:id/:videoId/:page',
                component: _import('business/class/classVideo'),
                name: '播放',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'blessing',
                component: _import('business/blessing/blessing'),
                name: '百福袋管理',
                icon: 'zonghe',
                sign: 'jbkt_wh_fortune_bag_manage'
            },
            {
                path: 'blessdetail/:id',
                component: _import('business/blessing/blessingdetail'),
                name: '百福袋结果详情',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'survey',
                component: _import('business/survey/survey'),
                name: '调查问卷管理',
                icon: 'zonghe',
                sign: 'jbkt_wh_questionnaire_manage'
            },
            {
                path: 'surveydetail/:id',
                component: _import('business/survey/surveydetail'),
                name: '调查问卷结果详情',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'index',
                component: _import('activity/activityList'),
                icon: 'zonghe',
                name: '活动管理',
                sign: 'jbkt_wh_activity_manage'
            },
            {
                path: 'interaction/:businessId/:id/:commentId',
                component: _import('interaction/interaction-manage'),
                name: '互动管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'interactionV2/:businessId/:id/:commentId',
                component: _import('interaction/interaction-manageV2'),
                name: '互动管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'videoManage/:businessId/:busId/:id',
                component: _import('business/video/video-manage'),
                name: '视频管理',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'interactData/:id',
                component: _import('business/class/interact/InteractData'),
                name: '互动数据',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'activity',
                component: _import('activity/activity-details'),
                icon: 'zonghe',
                hidden: true,
                name: '活动详情',
                children: [
                    {
                        path: 'information/:businessId/:id',
                        component: _import('activity/information'),
                        icon: 'zonghe',
                        hidden: true,
                        name: '活动信息'
                    },
                    {
                        path: 'rank/:businessId/:id',
                        component: _import('activity/rank'),
                        icon: 'zonghe',
                        hidden: true,
                        name: '排行榜'
                    },
                    {
                        path: 'rank/:businessId/:type/:sourceId/:id',
                        component: _import('activity/details'),
                        icon: 'zonghe',
                        hidden: true,
                        name: '投票详情'
                    }
                ]
            }
        ]
    },
    {
        path: '/capital',
        component: Layout,
        icon: 'zijinzhongxin_20_hui',
        name: '资金中心',
        sign: 'capital_center',
        children: [
            {
                path: 'management',
                component: _import('capital/management'),
                name: '资金管理',
                icon: 'zonghe',
                sign: 'capital_manage'
            },
            {path: 'funds/:id/:page', component: _import('capital/funds'), name: '资金明细', icon: 'zonghe', hidden: true}
        ]
    },
    {
        path: '/function',
        component: Layout,
        icon: 'yibizhongxin_20_hui',
        name: '医币管理',
        // role: ['integral_manage'],
        sign: 'integral_center',
        children: [
            {
                path: 'point',
                component: _import('business/point/point'),
                name: '医币管理',
                icon: 'zonghe',
                sign: 'integral_manage'
            },
            {
                path: 'point/:id/:page',
                component: _import('business/point/pointself'),
                name: '医币详情',
                icon: 'zonghe',
                role: ['integral_detail'],
                hidden: true
            },
            {
                path: 'Platform',
                component: _import('business/point/Platform'),
                name: '平台积分管理',
                icon: 'zonghe',
                sing: 'platform_integral_manage'
            },
            {
                path: 'Platformdetail/:id/:page',
                component: _import('business/point/Platformdetail'),
                name: '平台积分明细',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'Records/:id',
                component: _import('business/point/Records'),
                name: '消费记录',
                icon: 'zonghe',
                hidden: true
            },
            {
                path: 'pointDetail',
                component: _import('business/point/pointDetail'),
                name: '积分详情',
                icon: 'zonghe',
                hidden: true
            }
        ]
    },
    {
        path: '/weixin',
        component: Layout,
        icon: 'weixinpingtaiguanli_20_hui',
        name: '微信平台管理',
        sign: 'weixin_center',
        children: [
            {path: 'QRcode', component: _import('weixin/QRcode'), name: '二维码管理', sign: 'QRcode_manage', icon: 'zonghe'},
            {
                path: 'userManage',
                component: _import('weixin/userManage'),
                name: '用户管理',
                sign: 'wx_user_manage',
                icon: 'zonghe'
            },
            {
                path: 'menuManage',
                component: _import('weixin/menuManage'),
                name: '菜单管理',
                sign: 'wx_menu_manage',
                icon: 'zonghe'
            },
            {
                path: 'messageManage',
                component: _import('weixin/messageManage'),
                name: '消息管理',
                sign: 'wx_message_manage',
                icon: 'zonghe'
            },
            {
                path: 'OfficialAccountSet',
                component: _import('weixin/OfficialAccountSet'),
                name: '公众号设置',
                sign: 'mp_weixin_setting',
                icon: 'zonghe'
            },
            {
                path: 'pushManage',
                component: _import('weixin/pushManage'),
                name: '推送管理',
                sign: 'mp_weixin_push_manage',
                icon: 'zonghe'
            }
        ]
    },
    {
        path: '/statistics',
        component: Layout,
        icon: 'tongjizhongxin_20_hui',
        name: '统计中心',
        role: ['statistics_website', 'statistics_content', 'statistics_realtime', 'platform_stats'],
        sign: 'statistics_center',
        children: [
            {
                path: 'browser',
                component: _import('statistics/browser'),
                name: '网站统计',
                icon: 'zonghe',
                sign: 'statistics_website'
            },
            {
                path: 'content',
                component: _import('statistics/content'),
                name: '内容统计',
                icon: 'zonghe',
                sign: 'statistics_content'
            },
            {
                path: 'busdays/:busid/:begin/:end',
                component: _import('statistics/busDays'),
                hidden: true,
                name: '内容日期统计'
            },
            {path: 'cmsdays/:begin/:end', component: _import('statistics/cmsDays'), hidden: true, name: 'CMS日期统计'},
            {path: 'bushours/:busid/:begin', component: _import('statistics/busHours'), hidden: true, name: '内容小时统计'},
            {path: 'cmshours/:begin', component: _import('statistics/cmsHours'), hidden: true, name: 'CMS小时统计'},
            {
                path: 'busreal',
                component: _import('statistics/busReal'),
                name: '实时统计',
                icon: 'zonghe',
                sign: 'statistics_realtime'
            },
            // {path: 'baidus', component: _import('statistics/baidus'), name: '百度统计', icon: 'zonghe'},
            {
                path: 'platformStats',
                component: _import('statistics/platformStats/platformStats'),
                name: '平台统计',
                icon: 'zonghe',
                sign: 'platform_stats'
            },
        ]
    },
    {
        path: '/finance',
        component: Layout,
        icon: 'caiwuzhongxin_20_hui',
        redirect: '/finance/payment',
        name: '财务中心',
        role: ['payment_manage', 'order_manage'],
        sign: 'finance_center',
        children: [
            // {
            //     path: 'payment',
            //     component: _import('finance/payment'),
            //     name: '支付管理',
            //     icon: 'zonghe',
            //     sign: 'payment_manage'
            // },
            {path: 'order', component: _import('finance/order'), icon: 'zonghe', name: '订单管理', sign: 'order_manage'},
            {path: 'paySet', component: _import('finance/paySet'), icon: 'zonghe', name: '支付设置', sign: 'pay_setting'}
        ]
    }
]
