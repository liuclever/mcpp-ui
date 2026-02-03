import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/',
      name: 'layout',
      component: () => import('../layouts/AdminLayout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/Dashboard.vue'),
          meta: { title: '控制台', icon: 'Odometer' }
        },
        // 用户管理
        {
          path: 'user',
          name: 'user',
          redirect: '/user/list',
          meta: { title: '用户管理', icon: 'User' },
          children: [
            {
              path: 'list',
              name: 'userList',
              component: () => import('../views/user/UserList.vue'),
              meta: { title: '用户列表' }
            },
            {
              path: 'points',
              name: 'userPoints',
              component: () => import('../views/user/UserPoints.vue'),
              meta: { title: '积分管理' }
            },
            {
              path: 'points-rules',
              name: 'pointsRules',
              component: () => import('../views/points/PointsRulesEdit.vue'),
              meta: { title: '积分规则说明', icon: 'Trophy' }
            },
            {
              path: 'points-config',
              name: 'pointsConfig',
              component: () => import('../views/points/PointsConfigList.vue'),
              meta: { title: '积分规则配置', icon: 'Setting' }
            }
          ]
        },
        // 产品管理
        {
          path: 'product',
          name: 'product',
          redirect: '/product/list',
          meta: { title: '产品管理', icon: 'Goods' },
          children: [
            {
              path: 'list',
              name: 'productList',
              component: () => import('../views/product/ProductList.vue'),
              meta: { title: '产品列表' }
            },
            {
              path: 'category',
              name: 'productCategory',
              component: () => import('../views/product/CategoryList.vue'),
              meta: { title: '分类管理' }
            },
            {
              path: 'comment',
              name: 'productComment',
              component: () => import('../views/product/ProductCommentList.vue'),
              meta: { title: '评论管理' }
            },
            {
              path: 'videos/:productId',
              name: 'ProductVideoList',
              component: () => import('../views/product/ProductVideoList.vue'),
              meta: { title: '产品视频管理', requiresAuth: true }
            }
          ]
        },
        // 门店管理
        {
          path: 'store',
          name: 'store',
          redirect: '/store/list',
          meta: { title: '门店管理', icon: 'Shop' },
          children: [
            {
              path: 'list',
              name: 'storeList',
              component: () => import('../views/store/StoreList.vue'),
              meta: { title: '门店列表' }
            },
            {
              path: 'apply',
              name: 'storeApply',
              component: () => import('../views/store/ApplyList.vue'),
              meta: { title: '入驻申请' }
            }
          ]
        },
        // UGC管理
        {
          path: 'ugc',
          name: 'ugc',
          redirect: '/ugc/video',
          meta: { title: 'UGC管理', icon: 'VideoCamera' },
          children: [
            {
              path: 'video',
              name: 'ugcVideo',
              component: () => import('../views/ugc/UgcVideoList.vue'),
              meta: { title: '视频管理' }
            },
            {
              path: 'comment',
              name: 'ugcComment',
              component: () => import('../views/ugc/CommentList.vue'),
              meta: { title: '评论管理' }
            }
          ]
        },
        // CMS管理
        {
          path: 'cms',
          name: 'cms',
          redirect: '/cms/column/list',
          meta: { title: 'CMS管理', icon: 'Reading' },
          children: [
            {
              path: 'column/list',
              name: 'cmsColumnList',
              component: () => import('../views/cms/ColumnList.vue'),
              meta: { title: '栏目管理' }
            },
            {
              path: 'content/list',
              name: 'cmsContentList',
              component: () => import('../views/cms/ContentList.vue'),
              meta: { title: '内容管理' }
            },
            {
              path: 'content/edit',
              name: 'cmsContentEdit',
              component: () => import('../views/cms/ContentEdit.vue'),
              meta: { title: '编辑内容', hidden: true }
            },
            {
              path: 'brand',
              name: 'cmsBrand',
              component: () => import('../views/cms/BrandStory.vue'),
              meta: { title: '品牌故事', hidden: true }
            },
            {
              path: 'join',
              name: 'cmsJoin',
              component: () => import('../views/cms/JoinPolicy.vue'),
              meta: { title: '招商加盟', hidden: true }
            },
            {
              path: 'service',
              name: 'cmsService',
              component: () => import('../views/cms/ServiceCenter.vue'),
              meta: { title: '服务中心', hidden: true }
            }
          ]
        },
        // 关于我们
        {
          path: 'about',
          name: 'about',
          redirect: '/about/contact',
          meta: { title: '关于我们', icon: 'InfoFilled' },
          children: [
            {
              path: 'us',
              name: 'aboutUs',
              component: () => import('../views/about/AboutUsEdit.vue'),
              meta: { title: '品牌故事', hidden: true }
            },
            {
              path: 'contact',
              name: 'aboutContact',
              component: () => import('../views/about/AboutContactEdit.vue'),
              meta: { title: '联系信息' }
            }
          ]
        },
        // 服务中心
        {
          path: 'service',
          name: 'service',
          redirect: '/service/list',
          meta: { title: '服务中心', icon: 'QuestionFilled' },
          children: [
            {
              path: 'list',
              name: 'serviceList',
              component: () => import('../views/service/ServiceList.vue'),
              meta: { title: '内容列表' }
            },
            {
              path: 'edit',
              name: 'serviceEdit',
              component: () => import('../views/service/ServiceEdit.vue'),
              meta: { title: '编辑内容' }
            }
          ]
        },
        // 活动话题管理
        {
          path: 'activity',
          name: 'activity',
          redirect: '/activity/list',
          meta: { title: '活动话题', icon: 'CollectionTag' },
          children: [
            {
              path: 'list',
              name: 'activityList',
              component: () => import('../views/activity/ActivityList.vue'),
              meta: { title: '话题管理' }
            }
          ]
        },
        // 企业中心管理
        {
          path: 'enterprise',
          name: 'enterprise',
          redirect: '/enterprise/config',
          meta: { title: '企业中心', icon: 'OfficeBuilding' },
          children: [
            {
              path: 'config',
              name: 'enterpriseConfig',
              component: () => import('../views/enterprise/ConfigEdit.vue'),
              meta: { title: '配置管理' }
            },
            {
              path: 'column/list',
              name: 'enterpriseColumnList',
              component: () => import('../views/enterprise/ColumnList.vue'),
              meta: { title: '栏目管理' }
            },
            {
              path: 'content/list',
              name: 'enterpriseContentList',
              component: () => import('../views/enterprise/ContentList.vue'),
              meta: { title: '企业中心内容管理' }
            },
            {
              path: 'content/edit',
              name: 'enterpriseContentEdit',
              component: () => import('../views/enterprise/ContentEdit.vue'),
              meta: { title: '编辑内容', hidden: true }
            },
            {
              path: 'form',
              name: 'enterpriseForm',
              component: () => import('../views/enterprise/FormList.vue'),
              meta: { title: '表单管理' }
            },
            {
              path: 'form/detail',
              name: 'enterpriseFormDetail',
              component: () => import('../views/enterprise/FormDetail.vue'),
              meta: { title: '表单详情', hidden: true }
            },
            {
              path: 'sales-point',
              name: 'enterpriseSalesPoint',
              component: () => import('../views/enterprise/SalesPointList.vue'),
              meta: { title: '销售网点' }
            },
            {
              path: 'sales-point/edit',
              name: 'enterpriseSalesPointEdit',
              component: () => import('../views/enterprise/SalesPointEdit.vue'),
              meta: { title: '编辑网点', hidden: true }
            }
          ]
        },
        // 首页管理
        {
          path: 'home',
          name: 'home',
          redirect: '/home/gallery',
          meta: { title: '首页管理', icon: 'HomeFilled' },
          children: [
            {
              path: 'gallery',
              name: 'homeGallery',
              component: () => import('../views/home/GalleryList.vue'),
              meta: { title: '首页图片管理' }
            }
          ]
        },
        // 系统设置
        {
          path: 'system',
          name: 'system',
          redirect: '/system/admin',
          meta: { title: '系统设置', icon: 'Setting' },
          children: [
            {
              path: 'admin',
              name: 'systemAdmin',
              component: () => import('../views/system/AdminList.vue'),
              meta: { title: '管理员' }
            },
            {
              path: 'login-config',
              name: 'systemLoginConfig',
              component: () => import('../views/system/LoginConfig.vue'),
              meta: { title: '登录配置' }
            },
            {
              path: 'video-config',
              name: 'systemVideoConfig',
              component: () => import('../views/system/VideoConfig.vue'),
              meta: { title: '视频配置' }
            },
            {
              path: 'page-banner',
              name: 'systemPageBanner',
              component: () => import('../views/system/PageBannerConfig.vue'),
              meta: { title: '页面横幅' }
            }
          ]
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  console.log('🔍 路由守卫 - 目标路径:', to.path)
  const token = localStorage.getItem('admin_token')
  console.log('🔍 路由守卫 - Token:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND')
  
  if (to.path !== '/login' && !token) {
    console.log('❌ 未登录，跳转到登录页')
    next('/login')
    return
  }
  
  if (to.path !== '/login' && token) {
    console.log('✅ 已登录，允许访问')
  }
  
  next()
})

export default router
