<template>
    <div id="tags-view-container" class="tags-view-container">
        <scroll-pane ref="scrollPane" class="tags-view-wrapper">
            <router-link
                v-for="tag in visitedViews"
                ref="tag"
                :key="tag.path"
                :class="isActive(tag)?'active':''"
                :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                tag="span"
                class="tags-view-item"
                @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
                @contextmenu.prevent.native="openMenu(tag,$event)"
            >
                {{ tag.title }}
                <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"/>
            </router-link>
        </scroll-pane>
        <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
            <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
            <li @click="closeOthersTags">Close Others</li>
            <li @click="closeAllTags(selectedTag)">Close All</li>
        </ul>
    </div>
</template>

<script>
    import ScrollPane from './ScrollPane'
    import path from 'path'
    import Cookies from "js-cookie";
    import {recursion_reset} from "@/utils/mypath";
    import {asyncRoutes} from "@/router";
    import $ from 'jquery'

    if (typeof String.prototype.endsWith != 'function') {
        String.prototype.endsWith = function (str) {
            return this.slice(-str.length) == str;
        };
    }
    export default {
        components: {ScrollPane},
        data() {
            return {
                visible: false,
                top: 0,
                left: 0,
                selectedTag: {},
                affixTags: [],
                histories: ''
            }
        },
        computed: {
            visitedViews() {
                return this.$store.state.tagsView.visitedViews
            },
            routes() {
                return this.$store.state.permission.routes
            }
        },
        watch: {
            $route() {
                this.addTags()
                this.moveToCurrentTag()
            },
            visible(value) {
                if (value) {
                    document.body.addEventListener('click', this.closeMenu)
                } else {
                    document.body.removeEventListener('click', this.closeMenu)
                }
            }
        },
        mounted() {
            this.initTags()
            this.addTags()
        },
        methods: {
            isActive(route) {
                return route.path === this.$route.path
            },
            isAffix(tag) {
                return tag.meta && tag.meta.affix
            },
            filterAffixTags(routes, user_path, basePath = '/') {
                var userPaths = window.localStorage.getItem('menusFromAuth')
                var u1 = JSON.parse(userPaths)
                let tags = []
                var histories = Cookies.get('histories')
                var histories_list = histories.split(',')
//                console.log(user_path)
                routes.forEach(route => {
                    // if (route.meta && route.meta.affix) {
                    if (route.meta) {
                        const tagPath = path.resolve(basePath, route.path)
                        for (let i = 0; i < histories_list.length; i++) {
                            let item = histories_list[i]
                            if (item === route.name) {
                                for (let j = 0; j < user_path.length; j++) {
                                    let jtem = user_path[j]
                                    if (jtem.endsWith(tagPath)) {
                                        let fullpath = jtem
                                        let query = {}
                                        var pathwp = Cookies.get("pathsWithParams")
                                        var pathwp_list = pathwp.split(',')
                                        for (let m = 0; m < pathwp_list.length; m++) {
                                            if (jtem === pathwp_list[m].split('?')[0]) {
                                                fullpath = pathwp_list[m]
                                                try {
                                                    var query_str = pathwp_list[m].split('?')[1]
                                                    query_str = query_str.split('&')
                                                } catch (e) {
                                                    var query_str = []
                                                }
                                                for (let n = 0; n < query_str.length; n++) {
                                                    let k = query_str[n].split('=')[0]
                                                    let v = query_str[n].split('=')[1]
                                                    query[k] = v
                                                }
                                            }
                                        }
                                        if (u1.indexOf(jtem) !== -1) {
                                            tags.push({
                                                query: query,
                                                fullPath: fullpath,
                                                path: jtem,
                                                name: route.name,
                                                meta: {...route.meta}
                                            })
                                        }

                                    }
                                }

                            }
                        }

                    }
                    if (route.children) {
                        const tempTags = this.filterAffixTags(route.children, user_path, route.path)
                        if (tempTags.length >= 1) {
                            tags = [...tags, ...tempTags]
                        }
                    }
                })
                return tags
            },
            initTags() {
                var userPaths = window.localStorage.getItem('menusFromAuth')
                var user_menus = recursion_reset(asyncRoutes, userPaths)
                userPaths = JSON.parse(userPaths)
                const affixTags = this.affixTags = this.filterAffixTags(user_menus, userPaths)
                for (const tag of affixTags) {
                    // Must have tag name
                    if (tag.name) {
                        this.$store.dispatch('tagsView/addVisitedView', tag)
                    }
                }
            },
            addTags() {
                var path = this.$route.path
                var params = window.location.href.split('?')[1]
                if (params === undefined) {
                    params = ""
                }
                const {name} = this.$route
                var histories_list = []
                var histories = Cookies.get('histories')
                var pathwp = Cookies.get("pathsWithParams")
                if (histories === undefined) {
                    histories = ''
                } else {
                    if (histories.indexOf(',') !== -1) {
                        histories_list = histories.split(',')
                    } else {
                        histories_list = [histories]
                    }
                }
                var pathwp_list = []
                if (pathwp.indexOf(',') !== -1) {
                    pathwp_list = pathwp.split(',')
                } else {
                    pathwp_list = [pathwp]
                }
                if (name) {
                    if (histories.indexOf(name) === -1) {
                        histories_list.push(name)
                        for (let i = 0; i < pathwp_list.length; i++) {
                            if (pathwp_list[i].split('?')[0] === path) {
                                pathwp_list.splice($.inArray(pathwp_list[i], pathwp_list), 1)
                            }
                        }
                        pathwp_list.push(path + "?" + params)
                    }
                    var histories_str = histories_list.join(',')
                    Cookies.set('histories', histories_str)
                    var pathwp_str = pathwp_list.join(',')
                    Cookies.set('pathsWithParams', pathwp_str)
                    this.$store.dispatch('tagsView/addView', this.$route)
                }
                return false
            },
            moveToCurrentTag() {
                const tags = this.$refs.tag
                // console.log(tags)
                var pathwp = Cookies.get("pathsWithParams")
                var pathwp_list = pathwp.split(',')
                // console.log(pathwp_list)
                this.$nextTick(() => {
                    for (const tag of tags) {
                        if (tag.to.path === this.$route.path) {
                            for (let i = 0; i < pathwp_list.length; i++) {
                                let pwp = pathwp_list[i].split('?')[0]
                                if (pwp === tag.to.path) {
                                    // console.log("应该携带参数url" + pathwp_list[i])
                                    try {
                                        var query_str = pathwp_list[i].split('?')[1]
                                        query_str = query_str.split('&')
                                    } catch (e) {
                                        var query_str = []
                                    }
                                    // console.log(query_str)
                                    var query = {}
                                    for (let i = 0; i < query_str.length; i++) {
                                        let k = query_str[i].split('=')[0]
                                        let v = query_str[i].split('=')[1]
                                        query[k] = v
                                    }
                                    var that = this
                                    // console.log(query)
//                                    that.$router.push({
//                                        path: pwp,
//                                        query: query
//                                    })
                                    $(document).click(function (e) {
                                        e.stopPropagation()
                                        try {
                                            if ($(e.target).attr('class').indexOf('tags-view-item') !== -1) {
                                                that.$router.push({
                                                    path: pwp,
                                                    query: query
                                                })
                                            } else {
                                                let now_url = window.location.href.split('#')[1]
                                                for (let i = 0; i < pathwp_list.length; i++) {
                                                    if (now_url.indexOf('?') !== -1) {
                                                        if (pathwp_list[i].split('?')[0] === now_url.split('?')[0] &&
                                                            pathwp_list[i].split('?')[1] !== now_url.split('?')[1]) {
                                                            pathwp_list[i] = now_url
                                                            break
                                                        }
                                                    }

                                                }
                                                Cookies.set('pathsWithParams', pathwp_list.join(','))
                                            }
                                        } catch (err) {
                                            let now_url = window.location.href.split('#')[1]
                                            for (let i = 0; i < pathwp_list.length; i++) {
                                                if (now_url.indexOf('?') !== -1) {
                                                    if (pathwp_list[i].split('?')[0] === now_url.split('?')[0] &&
                                                        pathwp_list[i].split('?')[1] !== now_url.split('?')[1]) {
                                                        pathwp_list[i] = now_url
                                                        break
                                                    }
                                                }
                                            }
                                            Cookies.set('pathsWithParams', pathwp_list.join(','))
                                        }

                                    })
                                    // this.$router.push({
                                    //     path: pwp,
                                    //     query: query
                                    // })
                                }
                            }

                        }
                    }
                })
            },
            refreshSelectedTag(view) {
                this.$store.dispatch('tagsView/delCachedView', view).then(() => {
                    const {fullPath} = view
                    this.$nextTick(() => {
                        this.$router.replace({
                            path: '/redirect' + fullPath
                        })
                    })
                })
            },
            closeSelectedTag(view) {
                var histories = Cookies.get('histories')
                var pathwp = Cookies.get("pathsWithParams")
                var histories_list = histories.split(',')
                var pathwp_list = pathwp.split(',')
                for (var i = 0; i < histories_list.length; i++) {
                    var item = histories_list[i]
                    if (item === view.name) {
                        histories_list.splice($.inArray(item, histories_list), 1)
                        Cookies.set("histories", histories_list.join(','))
                    }
                }
                for (var j = 0; j < pathwp_list.length; j++) {
                    var jitem = pathwp_list[j]
                    if (jitem.split('?')[0] === view.path) {
                        pathwp_list.splice($.inArray(jitem, pathwp_list), 1)
                        Cookies.set("pathsWithParams", pathwp_list.join(','))
                    }
                }
                this.$store.dispatch('tagsView/delView', view).then(({visitedViews}) => {
                    if (this.isActive(view)) {
                        this.toLastView(visitedViews, view)
                    }
                })
            },
            closeOthersTags() {
                this.$router.push(this.selectedTag)
                this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
                    this.moveToCurrentTag()
                })
            },
            closeAllTags(view) {
                this.$store.dispatch('tagsView/delAllViews').then(({visitedViews}) => {
                    if (this.affixTags.some(tag => tag.path === view.path)) {
                        return
                    }
                    this.toLastView(visitedViews, view)
                })
            },
            toLastView(visitedViews, view) {
                const latestView = visitedViews.slice(-1)[0]
                if (latestView) {
                    this.$router.push(latestView.fullPath)
                } else {
                    // now the default is to redirect to the home page if there is no tags-view,
                    // you can adjust it according to your needs.
                    if (view.name === 'Dashboard') {
                        // to reload home page
                        this.$router.replace({path: '/redirect' + view.fullPath})
                    } else {
                        this.$router.push('/')
                    }
                }
            },
            openMenu(tag, e) {
                const menuMinWidth = 105
                const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
                const offsetWidth = this.$el.offsetWidth // container width
                const maxLeft = offsetWidth - menuMinWidth // left boundary
                const left = e.clientX - offsetLeft + 15 // 15: margin right

                if (left > maxLeft) {
                    this.left = maxLeft
                } else {
                    this.left = left
                }

                this.top = e.clientY
                this.visible = true
                this.selectedTag = tag
            },
            closeMenu() {
                this.visible = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tags-view-container {
        height: 34px;
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #d8dce5;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

        .tags-view-wrapper {
            .tags-view-item {
                display: inline-block;
                position: relative;
                cursor: pointer;
                height: 26px;
                line-height: 26px;
                border: 1px solid #d8dce5;
                color: #495060;
                background: #fff;
                padding: 0 8px;
                font-size: 12px;
                margin-left: 5px;
                margin-top: 4px;

                &:first-of-type {
                    margin-left: 15px;
                }

                &:last-of-type {
                    margin-right: 15px;
                }

                &.active {
                    background-color: #42b983;
                    color: #fff;
                    border-color: #42b983;

                    &::before {
                        content: '';
                        background: #fff;
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        position: relative;
                        margin-right: 2px;
                    }
                }
            }
        }

        .contextmenu {
            margin: 0;
            background: #fff;
            z-index: 3000;
            position: absolute;
            list-style-type: none;
            padding: 5px 0;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 400;
            color: #333;
            box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

            li {
                margin: 0;
                padding: 7px 16px;
                cursor: pointer;

                &:hover {
                    background: #eee;
                }
            }
        }
    }
</style>

<style lang="scss">
    //reset element css of el-icon-close
    .tags-view-wrapper {
        .tags-view-item {
            .el-icon-close {
                width: 16px;
                height: 16px;
                vertical-align: 2px;
                border-radius: 50%;
                text-align: center;
                transition: all .3s cubic-bezier(.645, .045, .355, 1);
                transform-origin: 100% 50%;

                &:before {
                    transform: scale(.6);
                    display: inline-block;
                    vertical-align: -3px;
                }

                &:hover {
                    background-color: #b4bccc;
                    color: #fff;
                }
            }
        }
    }
</style>
