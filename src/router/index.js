import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


/* Layout */
import Layout from '@/layout'


export const constantRoutes = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/auth-redirect',
        component: () => import('@/views/login/auth-redirect'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/error-page/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error-page/401'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard/index'),
                name: 'Dashboard',
                meta: {title: '首页', icon: 'dashboard', affix: true}
            }
        ]
    }
]

/**
 * asyncRoutes
 * 在meta字段设: 设置该页面的访问权限
 */
export const asyncRoutes = [
    {
        path: '/system',
        component: Layout,
        redirect: '/system/permit',
        name: 'System',
        meta: {title: '系统管理', icon: 'tree'},
        children: [
            {
                path: 'permit',
                component: () => import('@/views/system/permit/index'),
                name: 'Permit',
                // meta: {title: '权限管理', icon: 'user', noCache: false},
                meta: {title: '权限管理', icon: '', noCache: false},
                children: [
                    {
                        path: 'roles',
                        component: () => import('@/views/system/permit/roles'),
                        name: 'Roles',
                        meta: {title: '角色列表', icon: '', noCache: false}
                    },
                    {
                        path: 'users',
                        component: () => import('@/views/system/permit/users'),
                        name: 'Users',
                        meta: {title: '人赋权详情页', icon: '', noCache: false}
                    },
                    {
                        path: 'groups',
                        component: () => import('@/views/system/permit/groups'),
                        name: 'Groups',
                        meta: {title: '组详情页', icon: '', noCache: false}
                    },
                ]
            },
        ]
    },
    {
        path: '/docs',
        component: Layout,
        redirect: '/docs/list',
        name: 'Docs',
        meta: {
            title: 'Docs',
            icon: 'docs',
        },
        hidden: true,
        children: [
            {
                path: 'create',
                component: () => import('@/views/docs/create'),
                name: 'CreateArticle',
                meta: {title: '创建文档', icon: 'edit'}
            },
            {
                path: 'edit',
                component: () => import('@/views/docs/edit'),
                name: 'EditArticle',
                meta: {title: '修改文档', noCache: false, activeMenu: '/docs/list'},
                hidden: true
            },
            {
                path: 'list',
                component: () => import('@/views/docs/list'),
                name: 'ArticleList',
                meta: {title: '文档列表', icon: 'list'}
            }
        ]
    },
    //  用户管理模块
    {
        path: '/accounts',
        component: Layout,
        redirect: '/accounts/profile',
        name: 'Accounts',
        meta: {title: '用户中心', icon: 'user'},
        children: [

            {
                path: 'profile',
                component: () => import('@/views/accounts/profile'),
                name: 'Profile',
                // meta: {title: '个人中心', icon: 'user', noCache: false}
                meta: {title: '个人中心', icon: '', noCache: false}
            },
            {
                path: 'dingding',
                component: () => import('@/views/accounts/dingding'),
                name: 'Dingding',
                // meta: {title: '钉钉管理', icon: 'user', noCache: false}
                meta: {title: '钉钉管理', icon: '', noCache: false}
            },
        ]
    },
    {
        path: '/error',
        component: Layout,
        redirect: 'noRedirect',
        name: 'ErrorPages',
        // hidden: true,
        meta: {
            title: 'Error Pages',
            icon: '404'
        },
        children: [
            {
                path: '401',
                component: () => import('@/views/error-page/401'),
                name: 'Page401',
                meta: {title: '401', noCache: false}
            },
            {
                path: '404',
                component: () => import('@/views/error-page/404'),
                name: 'Page404',
                meta: {title: '404', noCache: false}
            },
            {
                path: '403',
                component: () => import('@/views/error-page/403'),
                name: 'Page403',
                meta: {title: '403', noCache: false}
            }
        ]
    },
    // 404 page 必须被放置在最后 !!!
    {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
