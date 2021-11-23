<template>
    <div class="app-container">
        <!--   人员管理页开发     -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="人赋权页面" name="first">
                <el-row>
                    <el-col class="inside-box" :offset="4" :span="16">
                        <el-form :inline="true" :model="formInlineUsers" class="demo-form-inline">
                            <el-form-item label="人查询">
                                <el-input v-model="formInlineUsers.user" placeholder="人查询"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSearch('users')">查询</el-button>
                            </el-form-item>
                        </el-form>
                        <el-alert
                            title="表中展示已在组中的用户信息,最多展示10条。不在表格中的数据请搜索"
                            type="success">
                        </el-alert>
                        <el-table
                            v-if="!listLoadingUser"
                            v-loading="listLoadingUser"
                            fit
                            highlight-current-row
                            stripe
                            :data="users.slice(listQueryUser.limit*(listQueryUser.page-1),listQueryUser.limit*listQueryUser.page)"
                            style="width: 100%"
                        >
                            <el-table-column
                                prop="username"
                                label="用户名">
                            </el-table-column>
                            <el-table-column
                                prop="email"
                                label="邮箱">
                            </el-table-column>
                            <el-table-column
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="toModify('/users',scope)" plain>修改</el-button>
                                    <el-popconfirm
                                        :title="del.del_msg"
                                        @onConfirm="userRemove(scope.row.username)"
                                    >
                                        <el-button type="danger" plain slot="reference">删除</el-button>
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px;">
                    <el-col :offset="8">
                        <pagination
                            v-show="totalUser>0"
                            :total="totalUser"
                            :page.sync="listQueryUser.page"
                            :limit.sync="listQueryUser.limit"
                        />
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="组赋权页面" name="second">
                <el-row>
                    <el-col class="inside-box" :offset="4" :span="16">
                        <el-form :inline="true" :model="formInlineGroups" class="demo-form-inline">
                            <el-form-item label="组查询">
                                <el-input v-model="formInlineGroups.group" placeholder="组查询"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSearch('groups')">查询</el-button>
                                <el-button type="primary" @click="group_dialogVisible = true">添加</el-button>
                            </el-form-item>
                        </el-form>
                        <el-alert
                            :title="'最多展示10条。不在表格中的数据请搜索'"
                            type="success">
                        </el-alert>
                        <el-table
                            v-if="!listLoadingGroup"
                            v-loading="listLoadingGroup"
                            fit
                            highlight-current-row
                            stripe
                            :data="groups.slice(listQueryGroup.limit*(listQueryGroup.page-1),listQueryGroup.limit*listQueryGroup.page)"
                            style="width: 100%">
                            <el-table-column
                                prop="zh_name"
                                label="中文名称">
                            </el-table-column>
                            <el-table-column
                                prop="en_name"
                                label="英文名称">
                            </el-table-column>
                            <el-table-column
                                prop="expire"
                                label="有效时间">
                            </el-table-column>
                            <el-table-column
                                prop="level"
                                label="角色级别">
                            </el-table-column>
                            <el-table-column
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="toGroupModify('/groups',scope)" plain>修改
                                    </el-button>
                                    <el-popconfirm
                                        :title="del.del_msg"
                                        @onConfirm="groupRemove(scope.row.en_name)"
                                    >
                                        <el-button type="danger" plain slot="reference">删除</el-button>
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px;">
                    <el-col :offset="8">
                        <pagination
                            v-show="totalGroup>0"
                            :total="totalGroup"
                            :page.sync="listQueryGroup.page"
                            :limit.sync="listQueryGroup.limit"
                        />
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="侧边栏信息" name="third">
                <el-row>
                    <el-col class="inside-box" :offset="2" :span="20">
                        <el-form :inline="true" :model="formInlineMenus" class="demo-form-inline">
                            <el-form-item label="侧边栏查询">
                                <el-input v-model="formInlineMenus.menu" placeholder="侧边栏查询"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSearch('menus')">查询</el-button>
                                <el-button type="primary" @click="menuCreate">添加</el-button>
                            </el-form-item>
                        </el-form>
                        <el-alert
                            :title="'最多展示10条。不在表格中的数据请搜索'"
                            type="success">
                        </el-alert>
                        <el-table
                            v-if="!listLoading"
                            v-loading="listLoading"
                            fit
                            highlight-current-row
                            stripe
                            :data="menus.slice(listQuery.limit*(listQuery.page-1),listQuery.limit*listQuery.page)"
                            style="width: 100%">
                            <el-table-column
                                prop="zh_name"
                                label="侧边栏显示名">
                            </el-table-column>
                            <el-table-column
                                prop="en_name"
                                label="侧边栏路由名">
                            </el-table-column>
                            <el-table-column
                                label="侧边栏层级">
                                <template slot-scope="scope">
                                    {{scope.row.level===1?'一级菜单':scope.row.level===2?'二级菜单':'三级菜单'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="mechanism"
                                label="机制">
                                <template slot-scope="scope">
                                    {{scope.row.mechanism===1?'上线':'维护'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="menuModify(scope)" plain>修改</el-button>
                                    <el-popconfirm
                                        :title="del.del_msg"
                                        @onConfirm="menuRemoveConfirm(scope.row.en_name)"
                                    >
                                        <el-button type="danger" plain slot="reference">删除</el-button>
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px;">
                    <el-col :offset="8">
                        <pagination
                            v-show="total>0"
                            :total="total"
                            :page.sync="listQuery.page"
                            :limit.sync="listQuery.limit"
                        />
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="api接口信息" name="firth">
                <el-row>
                    <el-col class="inside-box" :offset="2" :span="20">
                        <el-form :inline="true" :model="formInlineApis" class="demo-form-inline">
                            <el-form-item label="api接口查询">
                                <el-input v-model="formInlineApis.api" placeholder="api接口查询"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSearch('apis')">查询</el-button>
                                <el-button type="primary" @click="apiCreate">添加</el-button>
                            </el-form-item>
                        </el-form>
                        <el-alert
                            :title="'最多展示10条。不在表格中的数据请搜索'"
                            type="success">
                        </el-alert>
                        <el-table
                            v-if="!listLoadingApi"
                            v-loading="listLoadingApi"
                            fit
                            highlight-current-row
                            stripe
                            :data="apis.slice(listQueryApi.limit*(listQueryApi.page-1),listQueryApi.limit*listQueryApi.page)"
                            style="width: 100%">
                            <el-table-column
                                prop="api"
                                label="api接口名">
                            </el-table-column>
                            <el-table-column
                                prop="request_method"
                                label="请求方法">
                                <template slot-scope="scope">
                                    {{scope.row.request_method===0?'ALL':
                                    scope.row.request_method===1?'GET':
                                    scope.row.request_method===2?'POST':
                                    scope.row.request_method === 3?"HEAD":
                                    scope.row.request_method === 4?"PUT":
                                    scope.row.request_method === 5?"PATCH":
                                    'DELETE'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="mechanism"
                                label="机制">
                                <template slot-scope="scope">
                                    {{scope.row.mechanism===1?'线上':
                                    '维护'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="apiModify(scope)" plain>修改</el-button>
                                    <el-popconfirm
                                        :title="del.del_msg"
                                        @onConfirm="apiRemoveConfirm(scope.row.api)"
                                    >
                                        <el-button type="danger" plain slot="reference">删除</el-button>
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px;">
                    <el-col :offset="8">
                        <pagination
                            v-show="totalApi>0"
                            :total="totalApi"
                            :page.sync="listQueryApi.page"
                            :limit.sync="listQueryApi.limit"
                        />
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>

        <!-- 组信息添加弹框 -->
        <el-dialog :visible.sync="group_dialogVisible" title="添加新组">
            <el-form :model="group" label-width="120px" label-position="right">
                <el-form-item label="组中文名">
                    <el-input v-model="group.zh_name" placeholder="组中文名"/>
                </el-form-item>
                <el-form-item label="组英文名">
                    <el-input v-model="group.en_name" placeholder="组英文名"/>
                </el-form-item>
                <el-form-item label="过期时间">
                    <el-input v-model="group.expire" placeholder="过期时间"/>
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="groupAddConfirm">确认</el-button>
            </div>
        </el-dialog>

        <!--   侧边栏信息修改弹框  -->
        <el-dialog :visible.sync="dialogVisible" :title="menuDialogTitle">
            <el-form :model="menu" label-width="120px" label-position="right">
                <el-form-item label="侧边栏显示名">
                    <el-input v-model="menu.zh_name"  placeholder="侧边栏显示名"/>
                </el-form-item>
                <el-form-item label="侧边栏路由名">
                    <el-input v-model="menu.en_name" :disabled=!isMenuCreate placeholder="侧边栏路由名"/>
                </el-form-item>
                <el-form-item label="侧边栏层级">
                    <el-select v-model="menu.level"  placeholder="侧边栏层级">
                        <el-option
                            v-for="item in levels"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机制">
                    <el-select v-model="menu.mechanism" placeholder="机制">
                        <el-option
                            v-for="item in mechanisms"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="confirmMenu">确认</el-button>
            </div>
        </el-dialog>

        <!--   api接口信息修改弹框  -->
        <el-dialog :visible.sync="apiDialogVisible" :title="apiDialogTitle">
            <el-form :model="api" label-width="120px" label-position="right">
                <el-form-item label="api接口名">
                    <el-input v-model="api.api" :disabled=!isApiCreate placeholder="api接口名"/>
                </el-form-item>
                <el-form-item label="api请求方法">
                    <el-select v-model="api.request_method" placeholder="api请求方法">
                        <el-option
                            v-for="item in methods"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机制">
                    <el-select v-model="api.mechanism" placeholder="机制">
                        <el-option
                            v-for="item in mechanisms"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="apiDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="confirmApi">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import {
        AuthMethods,
        AuthMechanisms,
        AuthLevels,
        getGroups,
        getMenus,
        getUsers,
        removeGroups,
        addGroups,
        removeMenus,
        addMenus,
        removeUsers,
        getApis,
        removeApis,
        addApis,
        modifyMenus,
    } from '@/api/system/auth'

    const defaultRole = {
        role: '',
        name: '',
        introduction: '',
        routes: []
    }


    export default {
        data() {
            return {
                //=======
                isAll: false,
                total: 0,
                pages: 3, // 每次拿的页数
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10
                },
                //========
                isAllUser: false,
                totalUser: 0,
                pagesUser: 3, // 每次拿的页数
                listLoadingUser: true,
                listQueryUser: {
                    page: 1,
                    limit: 10
                },
                //========
                isAllGroup: false,
                totalGroup: 0,
                pagesGroup: 3, // 每次拿的页数
                listLoadingGroup: true,
                listQueryGroup: {
                    page: 1,
                    limit: 10
                },
                //========
                isAllApi: false,
                totalApi: 0,
                pagesApi: 3, // 每次拿的页数
                listLoadingApi: true,
                listQueryApi: {
                    page: 1,
                    limit: 10
                },
                //========
                dialogVisible: false,
                apiDialogVisible: false,
                group_dialogVisible: false,
                dialogType: 'new',
                checkStrictly: false,
                defaultProps: {
                    children: 'children',
                    label: 'title'
                },
                activeName: 'first',
                formInlineUsers: {
                    user: '',
                },
                formInlineGroups: {
                    group: '',
                },
                formInlineMenus: {
                    menu: '',
                },
                formInlineApis: {
                    api: '',
                },
                users: [
                    // {username: 'root', email: 12},
                ],
                groups: [
                    // {id: 1, name: "超级管理员", expire: '2020-06-30 00:00:00'},
                ],
                menus: [
                    // {
                    //     zh_name: "配置中心",
                    //     en_name: "configure",
                    //     level: 1,
                    //     mechanism: 1,
                    // },
                ],
                apis: [
                    // api: '/api/',
                    //request_method: 0,
                    //mechanism: "",
                ],
                menu: {
                    zh_name: "",
                    en_name: "",
                    level: '',
                    mechanism: "",
                },
                group: {
                    zh_name: "",
                    en_name: "",
                    expire: "",
                    level: "",
                },
                api: {
                    api: "",
                    request_method: 0,
                    mechanism: "",
                    type: 'add'
                },
                del: {
                    del_msg: "确定要删除该数据吗？"
                },
                levels: AuthLevels,
                mechanisms: AuthMechanisms,
                methods: AuthMethods,
                inputVisible: false,
                inputValue: '',
                menuDialogTitle: '',
                apiDialogTitle: '',
                isMenuCreate: true,
                isApiCreate: true,
            }
        },
        components: {Pagination},
        computed: {
            nowPage() {
                return this.total - this.listQuery.page * this.listQuery.limit
            },
            nowPageUser() {
                return this.totalUser - this.listQueryUser.page * this.listQueryUser.limit
            },
            nowPageGroup() {
                return this.totalGroup - this.listQueryGroup.page * this.listQueryGroup.limit
            },
            nowPageApi() {
                return this.totalApi - this.listQueryApi.page * this.listQueryApi.limit
            },
        },
        watch: {
            nowPage(va) {
                if (va < this.listQuery.limit) {
                    var data = {
                        'index': this.total,
                        'counts': this.pages * this.listQuery.limit
                    }
                    this.new_page('?index=' + data['index'] + '&counts=' + data['counts'])
                }
            },
            nowPageUser(va) {
                if (va < this.listQueryUser.limit) {
                    var data = {
                        'index': this.totalUser,
                        // 'counts': this.totalUser * this.listQueryUser.limit
                        'counts': this.pagesUser * this.listQueryUser.limit
                    }
                    this.new_pageUser('?index=' + data['index'] + '&counts=' + data['counts'])
                }
            },
            nowPageGroup(va) {
                if (va < this.listQueryGroup.limit) {
                    var data = {
                        'index': this.totalGroup,
                        'counts': this.pagesGroup * this.listQueryGroup.limit
                    }
                    this.new_pageGroup('&index=' + data['index'] + '&counts=' + data['counts'])
                }
            },
            nowPageApi(va) {
                if (va < this.listQueryApi.limit) {
                    var data = {
                        'index': this.totalApi,
                        'counts': this.pagesApi * this.listQueryApi.limit
                    }
                    this.new_pageApi('&index=' + data['index'] + '&counts=' + data['counts'])
                }
            },
        },
        created() {
            this.initial_data()
        },
        methods: {
            // ================= 新信息展示 ====================
            new_page(data) {
                var vm = this
                if (this.isAll === false) {
                    getMenus(data).then(response => {
                        var data = response
                        for (let i = 0; i < data.length; i++) {
                            var item = data[i]
                            vm.menus.push(item)
                        }
                        vm.total = vm.menus.length
                        if (data.length < this.listQuery.limit * this.pages) {
                            vm.isAll = true
                        }
                    })
                } else {
                    console.log('没有数据了')
                }
            },
            new_pageUser(data) {
                var vm = this
                if (this.isAllUser === false) {
                    getUsers(data).then(response => {
                        var data = response
                        for (let i = 0; i < data.length; i++) {
                            var item = data[i]
                            vm.users.push(item)
                        }
                        vm.totalUser = vm.users.length
                        if (data.length < this.listQueryUser.limit * this.pagesUser) {
                            vm.isAllUser = true
                        }
                    })
                } else {
                    console.log('没有数据了')
                }
            },
            new_pageGroup(data) {
                var vm = this
                if (this.isAllGroup === false) {
                    getGroups(data).then(response => {
                        var data = response
                        for (let i = 0; i < data.length; i++) {
                            var item = data[i]
                            vm.groups.push(item)
                        }
                        vm.totalGroup = vm.groups.length
                        if (data.length < this.listQueryGroup.limit * this.pagesGroup) {
                            vm.isAllGroup = true
                        }
                    })
                } else {
                    console.log('没有数据了')
                }
            },
            new_pageApi(data) {
                var vm = this
                if (this.isAllApi === false) {
                    getApis(data).then(response => {
                        var data = response
                        for (let i = 0; i < data.length; i++) {
                            var item = data[i]
                            vm.apis.push(item)
                        }
                        vm.totalApi = vm.apis.length
                        if (data.length < this.listQueryApi.limit * this.pagesApi) {
                            vm.isAllApi = true
                        }
                    })
                } else {
                    console.log('没有数据了')
                }
            },
            //初始化数据信息
            async initial_data() {
                var dataUser = {
                    'index': 0,
                    'counts': this.pagesUser * this.listQueryUser.limit
                }
                this.users = await getUsers('?index=' + dataUser['index'] + '&counts=' + dataUser['counts'])
                if (this.users.length < dataUser['counts']) {
                    this.isAllUser = true
                }
                this.totalUser = this.users.length
                this.listLoadingUser = false
            },
            //查询区域
            onSearch(type) {
                if (type === 'menus') {
                    // "开始菜单查询"
                    if (this.formInlineMenus.menu.trim() === "") {
                        this.$message("不能为空")
                    } else {
                        getMenus('?name=' + this.formInlineMenus.menu + "&type=1").then(response => {
                            // response = response[0]
                            if (response.length < 1) {
                                this.$message("为空")
                            } else {
                                this.total = -1
                                this.isAll = true
                                this.menus = []
                                for (let i = 0; i < response.length; i++) {
                                    let item = response[i]
                                    this.menus.push({
                                        zh_name: item.zh_name,
                                        en_name: item.en_name,
                                        level: item.level,
                                        mechanism: item.mechanism,
                                        api: item.api,
                                        request_method: item.request_method,
                                        relation_persons: item.relation_persons,
                                    })
                                }
                            }

                        })
                    }
                } else if (type === 'users') {
                    // "开始用户查询"
                    if (this.formInlineUsers.user.trim() === "") {
                        this.$message("不能为空")
                    } else {
                        getUsers('?name=' + this.formInlineUsers.user).then(response => {
                            if (response.accounts === undefined) {
                                this.$message("为空")
                            } else {
                                this.totalUser = -1
                                this.isAllUser = true
                                this.users = []
                                this.users.push({
                                    username: response['accounts'][0]['username'],
                                    email: response['accounts'][0]['email']
                                })
                            }
                        })
                    }
                } else if (type === "apis") {
                    // "开始用户查询"
                    if (this.formInlineApis.api.trim() === "") {
                        this.$message("不能为空")
                    } else {
                        getApis(this.formInlineApis.api.trim()).then(response => {
                            if (response.length < 1) {
                                this.$message("为空")
                            } else {
                                this.totalApi = -1
                                this.isAllApi = true
                                this.apis = []
                                this.apis.push({
                                    api: response[0].api,
                                    request_method: response[0].request_method,
                                    mechanism: response[0].mechanism
                                })
                            }
                        })
                    }
                } else {
                    // "开始组查询"
                    if (this.formInlineGroups.group.trim() === "") {
                        this.$message("不能为空")
                    } else {
                        getGroups(this.formInlineGroups.group).then(response => {
                            if (response.zh_name === undefined) {
                                this.$message("为空")
                            } else {
                                this.totalGroup = -1
                                this.isAllGroup = true
                                this.groups = []
                                this.groups.push({
                                    zh_name: response.zh_name,
                                    expire: response.expire,
                                    en_name: response.en_name,
                                    level: response.level
                                })
                            }
                        })
                    }
                }
            },
            async handleClick(tab, event) {
                if (tab.label === '组赋权页面') {
                    var dataGroup = {
                        'index': 0,
                        'counts': this.pagesGroup * this.listQueryGroup.limit
                    }
                    this.groups = await getGroups('&index=' + dataGroup['index'] + '&counts=' + dataGroup['counts'])
                    this.totalGroup = this.groups.length
                    this.listLoadingGroup = false
                    if (this.groups.length < dataGroup['counts']) {
                        this.isAllGroup = true
                    }
                } else if (tab.label === "侧边栏信息") {
                    var data = {
                        'index': 0,
                        'counts': this.pages * this.listQuery.limit
                    }
                    this.menus = await getMenus('?index=' + data['index'] + '&counts=' + data['counts'])
                    this.total = this.menus.length
                    this.listLoading = false
                    if (this.menus.length < data['counts']) {
                        this.isAll = true
                    }
                } else if (tab.label === "api接口信息") {
                    var dataApi = {
                        'index': 0,
                        'counts': this.pagesApi * this.listQueryApi.limit
                    }
                    this.apis = await getApis('&index=' + dataApi['index'] + '&counts=' + dataApi['counts'])
                    this.totalApi = this.apis.length
                    this.listLoadingApi = false
                    if (this.apis.length < dataApi['counts']) {
                        this.isAllApi = true
                    }
                }
            },
            toModify(url, value) {
                var name = value.row.username
                url = "/system/permit" + url
                this.$router.push({path: url, query: {key: name}})
            },
            toGroupModify(url, value) {
                var name = value.row.en_name
                url = "/system/permit" + url
                this.$router.push({path: url, query: {key: name}})
            },
            menuModify(scope) {
                this.menuDialogTitle = "修改侧边栏路由信息"
                this.isMenuCreate = false
                this.dialogVisible = true
                this.menu = scope.row
                this.menu.type = "modify"
            },
            apiModify(scope) {
                this.apiDialogTitle = "修改api接口信息"
                this.isApiCreate = false
                this.apiDialogVisible = true
                this.api = scope.row
                this.api.type = "modify"
            },
            async groupRemove(group_name) {
                if (group_name === "tests" || group_name === "pressures" || group_name === "ops_dev") {
                    this.$message("该分组不能删除")
                } else {
                    var result = await removeGroups(group_name)
                    if (result.code === 200) {
                        this.$router.go(0)
                    }
                }
            },
            async userRemove(name) {
                var result = await removeUsers({"name": name, "type": "removeUser"})
                if (result.code === 200) {
                    this.$router.go(0)
                } else {
                    this.$message("用户不存在")
                }
            },
            async groupAddConfirm() {
                var result = await addGroups(this.group)
                if (result.code === 200) {
                    this.$router.go(0)
                }
            },
            async menuRemoveConfirm(menu_name) {
                var re = new RegExp("/", "g")
                var menu_name_str = menu_name.replace(re, "_")
                var result = await removeMenus(menu_name_str)
                if (result.code === 200) {
                    this.$router.go(0)
                }
            },
            async apiRemoveConfirm(api_name) {
                var re = new RegExp("/", "g")
                var api_name_str = api_name.replace(re, "_")
                var result = await removeApis(api_name_str)
                if (result.code === 200) {
                    this.$router.go(0)
                } else {
                    this.$message(result.msg)
                }
            },
            async confirmMenu() {
                if (this.menu.en_name.trim() === ""
                    || this.menu.zh_name.trim() === ""
                    || this.menu.level === ""
                    || this.menu.mechanism === "") {
                    this.$message("侧边栏显示名/侧边栏路由名/侧边栏层级/机制不能为空")
                } else {
                    if (this.menu.type === "modify") {
                        let result = await modifyMenus(this.menu)
                        if (result.code === 200) {
                            this.$router.go(0)
                        }
                    } else {
                        let result = await addMenus(this.menu)
                        if (result.code === 200) {
                            this.$router.go(0)
                        }
                    }

                }
            },
            async confirmApi() {
                if (this.api.api.trim() === "") {
                    this.$message("api接口地址不能为空")
                } else {
                    var result = await addApis(this.api)
                    if (result.code === 200) {
                        this.$router.go(0)
                    } else {
                        this.$message(result.msg)
                    }
                }
            },
            menuCreate() {
                this.menuDialogTitle = "添加侧边栏路由信息"
                this.isMenuCreate = true
                this.dialogVisible = true
                this.menu = {
                    zh_name: "",
                    en_name: "",
                    level: '',
                    mechanism: "",
                    type: "add"
                }
            },
            apiCreate() {
                this.apiDialogTitle = "添加api接口信息"
                this.isApiCreate = true
                this.apiDialogVisible = true
                this.api = {
                    api: "",
                    mechanism: "",
                    request_method: "",
                    type: "add"
                }
            },
            handleClose(p) {
                this.menu.relation_persons.splice(this.menu.relation_persons.indexOf(p), 1);
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue && this.menu.relation_persons.indexOf(inputValue) === -1) {
                    this.menu.relation_persons.push(inputValue);
                } else {
                    this.$message(inputValue + "已经存在，无需添加")
                }
                this.inputVisible = false;
                this.inputValue = '';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .app-container {
        .roles-table {
            margin-top: 30px;
        }

        .permission-tree {
            margin-bottom: 30px;
        }

        .inside-box {
            border: 1px solid #c0c4cc;
            padding: 15px;
            border-radius: 5px;
        }

        .el-tag + .el-tag {
            margin-left: 10px;
        }

        .button-new-tag {
            margin-left: 10px;
            height: 32px;
            line-height: 30px;
            padding-top: 0;
            padding-bottom: 0;
        }

        .input-new-tag {
            width: 90px;
            margin-left: 10px;
            vertical-align: bottom;
        }
    }

</style>
