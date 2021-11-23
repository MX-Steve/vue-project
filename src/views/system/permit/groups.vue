<template>
    <div class="app-container">
        <el-row>
            <el-col class="inside-box" :offset="5" :span="14">
                <el-form :inline="true" :model="groupForm" class="demo-form-inline">
                    <el-form-item label="输入组名">
                        <el-input v-model="groupForm.name" placeholder="请输入中文组名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="info" @click="group_btn('search')">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="inside-box" :offset="5" :span="14">
                <h3 style="text-align: center">当前组名：{{now_group}}</h3>
                <h3 style="text-align: center">组成员操作</h3>
                <el-row>
                    <el-col style="text-align: center">
                        <el-transfer
                            style="text-align: left; display: inline-block"
                            v-model="in_group"
                            filterable
                            :titles="['组外成员', '组中成员']"
                            :left-default-checked="[]"
                            :right-default-checked="[]"
                            :format="{
                                noChecked: '${total}',
                                hasChecked: '${checked}/${total}'
                            }"
                            @change="user_ops_group"
                            :data="out_group"></el-transfer>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="inside-box" :offset="5" :span="14">
                <h3 style="text-align: center">权限期限</h3>
                <el-row>
                    <el-col :span="12" style="text-align: center;border-right: 1px solid #f0f0f0;">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="权限存在时间 :">
                                <el-date-picker
                                    v-model="time"
                                    type="datetime"
                                    @change="power_time"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="12" style="text-align: center">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="角色级别 :">
                                <el-input v-model="groupLevel" type="number"
                                          placeholder="0-1000之间的整数"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="success" icon="el-icon-check" circle @click="level_modify"></el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="inside-box" :offset="5" :span="14">
                <h3 style="text-align: center">菜单黑名单管理</h3>
                <el-row>
                    <el-col style="text-align: center">
                        <el-transfer
                            style="text-align: left; display: inline-block"
                            v-model="empower"
                            filterable
                            :titles="['其他路由', '已受限制路由']"
                            :left-default-checked="[]"
                            :right-default-checked="[]"
                            :format="{
                                noChecked: '${total}',
                                hasChecked: '${checked}/${total}'
                            }"
                            @change="power_ops"
                            :data="unpower"></el-transfer>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="inside-box" :offset="5" :span="14">
                <h3 style="text-align: center">菜单白名单管理</h3>
                <el-row>
                    <el-col style="text-align: center">
                        <el-transfer
                            style="text-align: left; display: inline-block"
                            v-model="emwpower"
                            filterable
                            :titles="['其他路由', '白名单路由']"
                            :left-default-checked="[]"
                            :right-default-checked="[]"
                            :format="{
                                noChecked: '${total}',
                                hasChecked: '${checked}/${total}'
                            }"
                            @change="power_w_ops"
                            :data="unpower"></el-transfer>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!--
        <el-row>
            <el-col class="inside-box" :offset="5" :span="14">
                <h3 style="text-align: center">Api接口黑名单管理</h3>
                <el-row>
                    <el-col style="text-align: center">
                        <el-transfer
                            style="text-align: left; display: inline-block"
                            v-model="empowerApi"
                            filterable
                            :titles="['未受限制接口', '已受限制接口']"
                            :left-default-checked="[]"
                            :right-default-checked="[]"
                            :format="{
                                noChecked: '${total}',
                                hasChecked: '${checked}/${total}'
                            }"
                            @change="api_ops"
                            :data="unpowerApi"></el-transfer>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="inside-box" :offset="5" :span="14">
                <h3 style="text-align: center">Api接口白名单管理</h3>
                <el-row>
                    <el-col style="text-align: center">
                        <el-transfer
                            style="text-align: left; display: inline-block"
                            v-model="empowerApi"
                            filterable
                            :titles="['未受限制接口', '已受限制接口']"
                            :left-default-checked="[]"
                            :right-default-checked="[]"
                            :format="{
                                noChecked: '${total}',
                                hasChecked: '${checked}/${total}'
                            }"
                            @change="api_ops"
                            :data="unpowerApi"></el-transfer>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        -->
    </div>
</template>

<script>
    import {
        UserList,
        getMenus,
        getUsers,
        getUsersFromGroup,
        addUserToGroup,
        removeUserToGroup,
        addMenuToGroup,
        getMenusFromGroup,
        getGroups, modExpire,
        addApiToGroup,
        getApisFromGroup,
        getApis,
        modLevel
    } from '@/api/system/auth'

    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    export default {
        name: "groups",
        data() {
            return {
                now_group: '',
                groupForm: {
                    name: "",
                },
                out_group: [
                    // {key: 'zhangsan', label: '张三', disabled: false},
                ],
                in_group: [],
                unpower: [
                    // {key: 'configure', label: '配置中心', disabled: true},
                ],
                unpowerApi: [],
                empower: [], // 黑名单
                emwpower: [], // 白名单
                empowerApi: [],
                time: '',
                groupLevel: null,
            }
        },
        computed: {},
        created() {
            // console.log(this.$route.query.key)
            if (this.$route.query.key === undefined) {
                this.now_group = "basic"
            } else {
                this.now_group = this.$route.query.key
            }
            this.initial_data()
        },
        methods: {
            compare_time(myDate, u_date) {
                // myDate: 当前时间
                // u_date: 入库时间
                var myYear = myDate.getFullYear()
                var myMonth = myDate.getMonth() + 1
                var myDay = myDate.getDate()
                var u_Year = Number(u_date.split('-')[0])
                var u_Month = Number(u_date.split('-')[1])
                var u_Day = Number(u_date.split('-')[2])
                var result = true // 没过期
                if (myYear > u_Year) {
                    result = false //过期
                } else if (myYear === u_Year) {
                    if (myMonth > u_Month) {
                        result = false
                    } else if (myMonth === u_Month) {
                        if (myDay > u_Day) {
                            result = false
                        } else {
                            result = true
                        }
                    } else {
                        result = true
                    }
                } else {
                    result = true
                }
                return result
            },
            async initial_data() {
                // 获取部分成员信息
                var users = await getUsers('')
                // console.log("users:", users[0])
                this.out_group = []
                for (let i = 0; i < users.length; i++) {
                    let item = users[i]
                    this.out_group.push(
                        {key: item.username, label: item.first_name, disabled: false}
                    )
                }
                // 获取属于当前组的信息
                this.in_group = []
                var user_ins = await getUsersFromGroup({'name': this.now_group, 'type': 'search'})
                this.in_group = user_ins['data']['accounts']
                // 获取所有路由信息
                var menus = await getMenus('')
                this.unpower = []
                for (let i = 0; i < menus.length; i++) {
                    let item = menus[i]
                    this.unpower.push({
                        key: item.en_name, label: item.zh_name, disabled: !(item.mechanism === 1)
                    })
                }
                // 获取组已有路由信息
                this.empower = []
                var menu_ins = await getMenusFromGroup({'gname': this.now_group, 'type': 'getMenu'})
                this.empower = menu_ins.data['menuNames']
                this.emwpower = menu_ins.data['menuWNames']
                var apis = await getApis('')
                this.unpowerApi = []
                for (let i = 0; i < apis.length; i++) {
                    let item = apis[i]
                    this.unpowerApi.push({
                        key: item.api, label: item.api, disabled: !(item.mechanism === 1)
                    })
                }
                var api_ins = await getApisFromGroup({'gname': this.now_group, 'type': 'getApi'})
                this.empowerApi = api_ins.data['apiPaths']
            },
            async user_ops_group(value, direction, movedKeys) {
                // 给当前组增加或移除用户
                // console.log(value, direction, movedKeys);
                if (direction === 'right') {
                    // console.log("添加用户")
                    let g = await addUserToGroup({'groupname': this.now_group, 'username': movedKeys, 'type': 'add'})
                    if (g.code === 200) {
                        this.$message("用户添加成功")
                    } else {
                        this.$message("用户添加失败")
                    }
                } else {
                    // console.log("移除用户")
                    let g = await removeUserToGroup({
                        'groupname': this.now_group,
                        'username': movedKeys,
                        'type': 'remove'
                    })
                    if (g.code === 200) {
                        this.$message("删除成功")
                    } else {
                        this.$message("删除失败")
                    }
                }
            },
            // 黑名单
            async power_ops(value, direction, movedKeys) {
                // 给当前组增加或移除菜单
                // console.log(value, direction, movedKeys);
                if (direction === 'right') {
                    // console.log("添加至黑名单")
                    let g = await addMenuToGroup({'gname': this.now_group, 'menus': value, 'type': 'addMenu'})
                    if (g.code === 200) {
                        this.$message("添加成功")
                    } else {
                        this.$message("添加失败")
                    }
                } else {
                    // console.log("移除黑名单")
                    var g = await addMenuToGroup({'gname': this.now_group, 'menus': value, 'type': 'remMenu'})
                    if (g.code === 200) {
                        this.$message("删除成功")
                    } else {
                        this.$message("删除失败")
                    }
                }
            },
            // 白名单
            async power_w_ops(value, direction, movedKeys) {
                // 给当前组增加或移除菜单
                // console.log(value, direction, movedKeys);
                if (direction === 'right') {
                    // console.log("添加至白名单")
                    let g = await addMenuToGroup({'gname': this.now_group, 'menusW': value, 'type': 'addMenu'})
                    if (g.code === 200) {
                        this.$message("添加成功")
                    } else {
                        this.$message("添加失败")
                    }
                } else {
                    // console.log("移除白名单")
                    var g = await addMenuToGroup({'gname': this.now_group, 'menusW': value, 'type': 'remMenu'})
                    if (g.code === 200) {
                        this.$message("删除成功")
                    } else {
                        this.$message("删除失败")
                    }
                }
            },
            async api_ops(value, direction, movedKeys) {
                // 给当前组增加或移除Api接口
                // console.log(value, direction, movedKeys);
                if (direction === 'right') {
                    // console.log("添加至黑名单")
                    let g = await addApiToGroup({'gname': this.now_group, 'apis': value, 'type': 'addApi'})
                    if (g.code === 200) {
                        this.$message("添加成功")
                    } else {
                        this.$message("添加失败")
                    }
                } else {
                    // console.log("移除黑名单")
                    var g = await addApiToGroup({'gname': this.now_group, 'apis': value, 'type': 'remApi'})
                    if (g.code === 200) {
                        this.$message("删除成功")
                    } else {
                        this.$message("删除失败")
                    }
                }
            },
            level_modify() {
                var data = {
                    "type": "modLevel",
                    "groupname": this.now_group,
                    "level": this.groupLevel
                }
                modLevel(data).then(response => {
                    if (response.code === 200) {
                        this.$message(response.msg)
                    } else {
                        this.$message(response.msg)
                    }
                })
            },
            power_time() {
                var time2 = new Date(this.time).Format("yyyy-MM-dd HH:mm:ss")
                var data = {
                    "type": "modExpire",
                    "groupname": this.now_group,
                    "time": time2
                }
                modExpire(data).then(response => {
                    if (response.code === 200) {
                        this.$message(response.msg)
                    } else {
                        this.$message(response.msg)
                    }
                })
            },
            async group_btn(ops) {
                var name = this.groupForm.name
                var all_groups = await getGroups('')
                var n = 0
                for (let i = 0; i < all_groups.length; i++) {

                    let item = all_groups[i]
                    if (name === item['zh_name']) {
                        break
                    }
                    n++
                }
                if (n >= all_groups.length) {
                    this.$message("不存在这个组")
                } else {
                    this.now_group = name
                    this.initial_data()
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .app-container {
        .inside-box {
            border: 1px solid #c0c4cc;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 15px;
        }

        .sub-line {
            padding-bottom: 10px;
        }

        .subtitle {
            font-weight: bold;
            text-align: right;
            padding-right: 15px;
        }

        .input-box {
            height: 250px;
            border-radius: 4px;
            border: 1px solid #4AB7BD;
            padding: 10px;
            word-break: break-all;
        }
    }
</style>
