<template>
    <div id="dingding">
        <el-row>
            <el-col :offset="3" :span="18">
                <h2>当前接收的钉钉消息</h2>
                <el-table
                    :data="dingList"
                    style="width: 100%">
                    <el-table-column
                        label="环境"
                        width="180">
                        <template slot-scope="{row, $id}">
                            {{row.env.env_name === "all"?"所有环境":row.env.env_name}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="BU线"
                        width="180">
                        <template slot-scope="{row, $id}">
                            {{row.bu.en_name === "all"?"所有BU线":row.bu.en_name}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="服务">
                        <template slot-scope="{row, $id}">
                            {{row.service.jf_service_name === "all"?"所有服务":row.service.jf_service_name}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="场景">
                        <template slot-scope="{row, $id}">
                            {{row.scope === "all"?"所有场景":row.scope}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="删除">
                        <template slot-scope="{row, $id}">
                            <el-button type="primary" icon="el-icon-close" @click="delDingMsg(row)" circle
                                       style="line-height:0.8em"/>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row style="margin-top:50px;">
            <el-col :offset="3" :span="18">
                <h2>添加钉钉关注</h2>
                <el-form ref="form" :model="form" label-width="240px" label-position="left">
                    <el-form-item label="请选择环境">
                        <el-select v-model="form.env" placeholder="请选择环境" style="width: 100%">
                            <el-option label="所有环境" value="0"></el-option>
                            <el-option v-for="item in envs" :label="item.env_name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="请选择BU线">
                        <el-select v-model="form.bu" placeholder="请选择BU线" style="width: 100%"
                                   @change="getServiceFromBu(form.bu)">
                            <el-option label="所有BU线" value="0"></el-option>
                            <el-option v-for="item in bus" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="请选择服务">
                        <el-select v-model="form.service" placeholder="请选择服务" style="width: 100%">
                            <el-option label="所有服务" value="0"></el-option>
                            <el-option v-for="item in services" :label="item.jf_service_name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="请选择场景">
                        <el-select v-model="form.scope" placeholder="请选择场景" style="width: 100%">
                            <el-option v-for="item in Scopes" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="large" type="success" round @click="addDingding()">创建</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {getDingtalk, getSvcFromBu, addDingMsg, delDingMsg} from '@/api/user'
    import {Scopes} from '@/api/system/auth'

    var data = {
        dingList: [],
        form: {
            env: '',
            bu: '',
            service: '',
            scope: '',
        },
        Scopes: Scopes,
        envs: [],
        bus: [],
        services: [],
        groups: []
    }
    export default {
        name: "dingding",
        data() {
            return data
        },
        created() {
            this.initData()
        },
        methods: {
            initData() {
                getDingtalk().then(res => {
                    if (res.data.code === 200) {
                        var dingList = res.data.data
                        for (let i = 0; i < dingList.length; i++) {
                            let scope = dingList[i]['scope']
                            for (let j = 0; j < Scopes.length; j++) {
                                if (Scopes[j]['value'] === scope) {
                                    dingList[i]["scope"] = Scopes[j]['label']
                                    break
                                }
                            }
                        }
                        this.dingList = dingList
                        this.groups = res.data.groups
                        var bus = JSON.parse(window.localStorage.getItem('bus_str'))
                        this.bus = bus
                        if (this.groups.indexOf('superuser') !== -1) {
                            this.bus = res.data.bus
                        }
                        this.envs = res.data.envs
                    } else {
                        this.dingList = []
                    }
                })
            },
            addDingding() {
                console.log("开始创建")
                addDingMsg(this.form).then(res => {
                    if (res.data.code === 200) {
                        alert(res.data.msg)
                        this.$router.go(0);
                    } else {
                        alert(res.data.msg)
                    }
                })
            },
            getServiceFromBu(id) {
                getSvcFromBu(id).then(res => {
                    this.services = res.data.svcs
                })
            },
            delDingMsg(row) {
                var bu_id = row['bu']['id']
                var env_id = row['env']['id']
                var service_id = row['service']['id']
                var scope = row['scope']
                var interest = 0
                for (let i = 0; i < Scopes.length; i++) {
                    let item = Scopes[i]
                    if (item['label'] === scope) {
                        interest = item['value']
                    }
                }
                delDingMsg({"bu_id": bu_id, "env_id": env_id, "service_id": service_id,"interest":interest}).then(res => {
                    if(res.data.code === 200){
                        alert(res.data.msg)
                        this.$router.go(0);
                    }else {
                        alert(res.data.msg)
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    #dingding {
        margin: 15px 50px;
    }
</style>
