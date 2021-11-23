<template>
    <div class="app-container" style="margin:0 100px">
        <table>
            <tr>
                <td>用户名</td>
                <td>{{ data.fullname }}</td>
            </tr>
            <tr>
                <td>邮箱</td>
                <td>{{ data.email }}</td>
            </tr>
            <tr>
                <td>电话</td>
                <td>{{ data.tel }}</td>
            </tr>
            <tr>
                <td>钉钉webhook</td>
                <td>{{ data.robot }}</td>
            </tr>
            <tr>
                <td>钉钉加签</td>
                <td>{{ data.secret }}</td>
            </tr>
            <tr>
                <td>备注</td>
                <td>{{ data.remark }}</td>
            </tr>
            <tr>
                <td>BU线</td>
                <td><span v-for="bu in data.bus">{{ bu.name }},&nbsp;&nbsp</span></td>
            </tr>
            <tr>
                <td colspan="2">
                    <el-button @click="dialogFormVisible = true" type="primary">修改信息</el-button>
                    <el-button type="success" @click="$router.push('/accounts/dingding')">添加钉钉</el-button>
                </td>
            </tr>
        </table>

        <el-dialog title="修改信息" :visible.sync="dialogFormVisible">

            <el-form :model="data">
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="data.tel" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="钉钉webhook" :label-width="formLabelWidth">
                    <el-input v-model="data.robot" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="钉钉加签" :label-width="formLabelWidth">
                    <el-input v-model="data.secret" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth">
                    <el-input v-model="data.remark" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div class="tip">由于使用了ad认证，修改邮箱，密码，用户名请在ad上操作</div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="UpdateProfile">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getTokenUserId} from "@/utils/auth";
    import {getInfo,modInfo} from '@/api/user'

    export default {
        name: "UserProfile",
        data() {
            return {
                data: {},
                dialogFormVisible: false,
                formLabelWidth: "120px"
            };
        },
        created() {
            this.Profile();
        },
        methods: {
            Profile() {
                getInfo().then(response => {
                    console.log(response)
                    if (response.status !== 200) {
                        console.log(response.msg)
                    } else {
                        var data = {}
                        var bus = response.data.data.bus
                        var others = response.data.data.others[0]
                        data['fullname'] = others.username
                        data['email'] = others.email
                        data['tel'] = others.tel
                        data['bus'] = bus
                        data['remark'] = others.remark
                        data['secret'] = others.secret
                        data['robot'] = others.robot
                        this.data = data
                    }
                })
            },

            UpdateProfile() {
                this.dialogFormVisible = false;
                modInfo(this.data).then(res =>{
                    console.log(res)
                })
            }

        }
    };
</script>

<style scoped>
    tr {
        line-height: 2em;
    }

    td {
        min-width: 200px;
        padding: 10px 0;
    }

    .tip {
        margin: 50px auto auto 120px;
        color: #9f9f9f;
    }
</style>
