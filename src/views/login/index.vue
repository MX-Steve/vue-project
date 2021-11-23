<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
                 label-position="left">
            <div class="title-container">
                <h3 class="title">{{title}}登录</h3>
            </div>
            <el-form-item prop="username">
                <span class="svg-container">
                  <svg-icon icon-class="user"/>
                </span>
                <el-input
                    ref="username"
                    v-model="loginForm.username"
                    placeholder="用户名"
                    name="username"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                />
            </el-form-item>
            <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                <el-form-item prop="password">
                      <span class="svg-container">
                          <svg-icon icon-class="password"/>
                      </span>
                      <el-input
                        :key="passwordType"
                        ref="password"
                        v-model="loginForm.password"
                        :type="passwordType"
                        placeholder="密码"
                        name="password"
                        tabindex="2"
                        autocomplete="on"
                        @keyup.native="checkCapslock"
                        @blur="capsTooltip = false"
                        @keyup.enter.native="handleLogin"
                        />
                      <span class="show-pwd" @click="showPwd">
                          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
                      </span>
                </el-form-item>
            </el-tooltip>
            <el-form-item prop="authcode" v-if="loginForm.secCert === 1">
                <span class="svg-container">
                  <svg-icon icon-class="example"/>
                </span>
                <el-input
                    ref="authcode"
                    v-model="loginForm.authcode"
                    placeholder="谷歌验证码"
                    name="authcode"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                    @keyup.enter.native="handleLogin"
                />
            </el-form-item>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                       @click.native.prevent="handleLogin">登 录
            </el-button>
        </el-form>
    </div>
</template>

<script>
    import {validUsername} from '@/utils/validate'
    import SocialSign from './components/SocialSignin'
    import Cookies from "js-cookie";

    const defaultSettings = require('@/settings.js')
    export default {
        name: 'Login',
        components: {SocialSign},
        data() {
            const validateUsername = (rule, value, callback) => {
                if (!validUsername(value)) {
                    callback(new Error('请输入正确用户名'))
                } else {
                    callback()
                }
            }
            const validatePassword = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('密码长度不能小于6位字符'))
                } else {
                    callback()
                }
            }
            return {
                loginForm: {
                    username: '',
                    password: '',
                    authcode: '',
                    secCert: 0,
                    project_id: 2
                },
                loginRules: {
                    username: [{required: true, trigger: 'blur', validator: validateUsername}],
                    password: [{required: true, trigger: 'blur', validator: validatePassword}],
                    authcode: [{required: true, message: '请输入谷歌验证码', trigger: 'blur'}]
                },
                passwordType: 'password',
                capsTooltip: false,
                loading: false,
                showDialog: false,
                redirect: undefined,
                otherQuery: {},
                title: defaultSettings.title
            }
        },
        watch: {
            $route: {
                handler: function (route) {
                    const query = route.query
                    if (query) {
                        this.redirect = query.redirect
                        this.otherQuery = this.getOtherQuery(query)
                    }
                },
                immediate: true
            }
        },
        created() {
            // window.addEventListener('storage', this.afterQRScan)
        },
        mounted() {

            if (this.loginForm.username === '') {
                this.$refs.username.focus()
            } else if (this.loginForm.password === '') {
                this.$refs.password.focus()
            }
            // console.log(document.cookie.length)
        },
        destroyed() {
            // window.removeEventListener('storage', this.afterQRScan)
        },
        methods: {
            checkCapslock(e) {
                const {key} = e
                this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
            },
            showPwd() {
                if (this.passwordType === 'password') {
                    this.passwordType = ''
                } else {
                    this.passwordType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.password.focus()
                })
            },
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        Cookies.set('histories', 'Dashboard')
                        Cookies.set('pathsWithParams', 'Dashboard?')
                        //  调用user模块红的login
                        this.$store.dispatch('user/login', this.loginForm)
                            .then(res => {
                                if (res.isSecCert === 2) {
                                    this.loginForm.secCert = 1;
                                    this.loading = false;
                                    this.$message({
                                        type: 'error',
                                        message: res.res
                                    });
                                } else {
                                    this.$router.push({path: this.redirect || '/', query: this.otherQuery})
                                    this.loading = false
                                }
                            })
                            .catch(() => {
                                this.loading = false
                            })
                    } else {
                        console.log('登录失败!!')
                        return false
                    }
                })
            },
            getOtherQuery(query) {
                return Object.keys(query).reduce((acc, cur) => {
                    if (cur !== 'redirect') {
                        acc[cur] = query[cur]
                    }
                    return acc
                }, {})
            }
            // afterQRScan() {
            //   if (e.key === 'x-admin-oauth-code') {
            //     const code = getQueryObject(e.newValue)
            //     const codeMap = {
            //       wechat: 'code',
            //       tencent: 'code'
            //     }
            //     const type = codeMap[this.auth_type]
            //     const codeName = code[type]
            //     if (codeName) {
            //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
            //         this.$router.push({ path: this.redirect || '/' })
            //       })
            //     } else {
            //       alert('第三方登录失败')
            //     }
            //   }
            // }
        }
    }
</script>

<style lang="scss">
    /* 修复input 背景不协调 和光标变色 */
    $bg: #283443;
    $light_gray: #fff;
    $cursor: #fff;

    /* 主要用于检测当前浏览器是否支持某个CSS属性并加载具体样式. */
    @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
        .login-container .el-input input {
            color: $cursor;
        }
    }

    /* 重置 element-ui 样式 */
    .login-container {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;

            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                caret-color: $cursor;

                &:-webkit-autofill {
                    box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: $cursor !important;
                }
            }
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }
    }
</style>

<style lang="scss" scoped>
    @import "src/common";

    .login-container {
        min-height: 100%;
        width: 100%;
        background-color: $bg;
        overflow: hidden;

        .login-form {
            position: relative;
            width: 520px;
            max-width: 100%;
            padding: 160px 35px 0;
            margin: 0 auto;
            overflow: hidden;
        }

        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;

            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }

        .svg-container {
            padding: 6px 5px 6px 15px;
            color: $dark_gray;
            vertical-align: middle;
            width: 30px;
            display: inline-block;
        }

        .title-container {
            position: relative;

            .title {
                font-size: 26px;
                color: $light_gray;
                margin: 0px auto 40px auto;
                text-align: center;
                font-weight: bold;
            }
        }

        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }

        .thirdparty-button {
            position: absolute;
            right: 0;
            bottom: 6px;
        }

        @media only screen and (max-width: 470px) {
            .thirdparty-button {
                display: none;
            }
        }
    }
</style>
