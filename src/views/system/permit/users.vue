<template>
    <div class="app-container">
        <el-row>
            <el-col class="inside-box" :offset="5" :span="14">
                <h3 style="text-align: center">用户信息展示</h3>
                <el-row class="sub-line" v-for="(v,k) in objList" :key="k">
                    <el-col class="subtitle" :span="4">{{
                        k === 'id'?'ID号':
                        k === 'username'?'用户名':
                        k === 'email'?'邮箱':"超级管理员"}} :
                    </el-col>
                    <el-col :span="10">
                        {{v}}
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="inside-box" :offset="5" :span="14">
                <h3 style="text-align: center">用户属组</h3>
                <el-row>
                    <el-col :offset="3" style="text-align: center">
                        <el-table
                            :data="groups"
                            style="width: 75%">
                            <el-table-column
                                prop="zh_name"
                                label="组中文名"
                                width="200">
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                label="组英文名"
                                width="200">
                            </el-table-column>
                            <el-table-column
                                prop="expire"
                                label="期限"
                                width="200">
                            </el-table-column>
                            <el-table-column
                                label="组url">
                                <template slot-scope="scope">
                                    <el-button @click="goToCenter(scope.row.name)" type="text">详情
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
<!--        <el-row>-->
<!--            <el-col class="inside-box" :offset="5" :span="14">-->
<!--                <h3 style="text-align: center">权限期限</h3>-->
<!--                <el-row>-->
<!--                    <el-col style="text-align: center">-->
<!--                        <el-form :inline="true" class="demo-form-inline">-->
<!--                            <el-form-item label="权限存在时间 :">-->
<!--                                <el-date-picker-->
<!--                                    v-model="time"-->
<!--                                    type="datetime"-->
<!--                                    @change="power_time"-->
<!--                                    placeholder="选择日期时间">-->
<!--                                </el-date-picker>-->
<!--                            </el-form-item>-->
<!--                        </el-form>-->
<!--                    </el-col>-->
<!--                </el-row>-->
<!--            </el-col>-->
<!--        </el-row>-->
<!--        <el-row>-->
<!--            <el-col class="inside-box" :offset="5" :span="14">-->
<!--                <h3 style="text-align: center">菜单黑名单管理【{{groups[0]['name']}}】</h3>-->
<!--                <el-row>-->
<!--                    <el-col style="text-align: center">-->
<!--                        <el-transfer-->
<!--                            style="text-align: left; display: inline-block"-->
<!--                            v-model="empower"-->
<!--                            filterable-->
<!--                            :titles="['未限制', '黑名单']"-->
<!--                            :left-default-checked="[]"-->
<!--                            :right-default-checked="[]"-->
<!--                            :format="{-->
<!--                                noChecked: '${total}',-->
<!--                                hasChecked: '${checked}/${total}'-->
<!--                            }"-->
<!--                            @change="handleChange"-->
<!--                            :data="unpower"></el-transfer>-->
<!--                    </el-col>-->
<!--                </el-row>-->
<!--            </el-col>-->
<!--        </el-row>-->
        <el-row>
            <el-col class="inside-box" :offset="5" :span="14">
                <h3 style="text-align: center">用户所在BU线</h3>
                <el-row>
                    <el-col :offset="3" style="text-align: center">
                        <el-table
                            :data="bus"
                            style="width: 75%">
                            <el-table-column
                                prop="name"
                                label="BU中文名"
                                width="200">
                            </el-table-column>
                            <el-table-column
                                prop="en_name"
                                label="BU英文名"
                                width="200">
                            </el-table-column>
                            <el-table-column
                                label="BU线url">
                                <template slot-scope="scope">
                                    <el-button type="text">详情
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="inside-box" :offset="5" :span="14">
                <h3 style="text-align: center">用户所在中心</h3>
                <el-row>
                    <el-col :offset="3" style="text-align: center">
                        <el-table
                            :data="centers"
                            style="width: 75%">
                            <el-table-column
                                prop="name"
                                label="中心中文名"
                                width="200">
                            </el-table-column>
                            <el-table-column
                                prop="en_name"
                                label="中心英文名">
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {
        getMenus,
        getUsers,
        addMenuToUser,
        removeMenuToUser,
        modExpire,
        getMenusFromUser
    } from '@/api/system/auth'
    import jwtDecode from 'jwt-decode'
    import Cookies from "js-cookie";

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
        name: "users",
        data() {
            return {
                unpower: [
                    // {key: 'configure', label: '配置中心', disabled: true},
                ],
                empower: [],
                time: '',
                name: '',
                groupname: '',
                objList: {
                    // "id": 11,
                    // "is_superuser": 0,
                    // "name": "",
                    // "is_center": 1,
                    // "expire": "2021-06-30 00:00:00"
                },
                centers: [],
                bus: [],
                groups: [
                    {"name": "basic","zh_name":"", "expire": "2020-10-20 00:00:00"}
                ]
            }
        },
        created() {
            this.initial_data()
        },
        computed: {},
        methods: {
            async initial_data() {
                try{
                    this.name = this.$route.query.key
                }catch (e) {
                    this.name = "root"
                }
                if (this.name === undefined) {
                    // 展示当前用户的用户信息
                    this.name = jwtDecode(Cookies.get('Authorization'))["username"]
                }
                var objList = await getUsers('?name=' + this.name)
                var groups = objList.groupObjs
                this.groups = []
                for (let i = 0; i < groups.length; i++) {
                    this.groups.push({'name': groups[i]["en_name"],'zh_name':groups[i]['zh_name'], 'expire': groups[i]['expire']})
                }
                this.bus = objList.bus['bu_list']
                this.centers = objList.centers['center_list']
                this.objList = {
                    id: objList['accounts'][0].id,
                    username: objList['accounts'][0].username,
                    is_superuser: objList['accounts'][0].is_superuser,
                    email: objList['accounts'][0].email
                }
                // 获取所有菜单
                var unpower_initial = await getMenus('')
                var unpower = []
                for (let i = 0; i < unpower_initial.length; i++) {
                    let item = unpower_initial[i]
                    unpower.push({key: item['en_name'], label: item['zh_name'], disabled: item['mechanism'] !== 1})
                }
                this.unpower = unpower
                var gname = this.groups[0]['name']
                // this.empower =(await  getMenusFromUser(this.name))[0][gname]
                this.empower =(await  getMenusFromUser(this.name))
            },
            async handleChange(value, direction, movedKeys) {
                if (direction === 'right') {
                    // 给用户添加菜单
                    let result = await addMenuToUser({'uname': this.name, 'menus': movedKeys, 'type': 'addMenu'})
                    if (result.code === 200) {
                        this.$message("添加成功")
                    } else {
                        this.$message("添加失败")
                    }
                } else {
                    // 给用户移除菜单
                    let result = await removeMenuToUser({'uname': this.name, 'menus': movedKeys, 'type': 'remMenu'})
                    if (result.code === 200) {
                        this.$message("移除成功")
                    } else {
                        this.$message("移除失败")
                    }
                }
            },
            power_time() {
                var time2 = new Date(this.time).Format("yyyy-MM-dd HH:mm:ss")
                this.groupname = this.groups[0]['name']
                var data = {
                    "type": "modExpire",
                    "name": this.name,
                    "groupname": this.groupname,
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
            goToCenter(groupName) {
                // console.log("gt",groupName)
                var url = '/system/permit/groups'
                this.$router.push({path: url, query: {key: groupName}})
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
