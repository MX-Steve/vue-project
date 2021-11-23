function deepClone(target) {
    // 定义一个变量
    let result;
    // 如果当前需要深拷贝的是一个对象的话
    if (typeof target === 'object') {
        // 如果是一个数组的话
        if (Array.isArray(target)) {
            result = []; // 将result赋值为一个数组，并且执行遍历
            for (let i in target) {
                // 递归克隆数组中的每一项
                result.push(deepClone(target[i]))
            }
            // 判断如果当前的值是null的话；直接赋值为null
        } else if (target === null) {
            result = null;
            // 判断如果当前的值是一个RegExp对象的话，直接赋值
        } else if (target.constructor === RegExp) {
            result = target;
        } else {
            // 否则是普通对象，直接for in循环，递归赋值对象的所有值
            result = {};
            for (let i in target) {
                result[i] = deepClone(target[i]);
            }
        }
        // 如果不是对象的话，就是基本数据类型，那么直接赋值
    } else {
        result = target;
    }
    // 返回最终结果
    return result;
}

export function recursion_reset(allmenus, userpaths) {
    userpaths=JSON.parse(userpaths)
    var usermenus = []
    var paths = []
    for (var i in allmenus) {
        var item = allmenus[i]
        var path = item['path']
        let item_tmp = deepClone(item)
        paths.push(path)
        // 第一层菜单
        if (userpaths.indexOf(path) !== -1) {
            // 在列表中的走这里
            var sub = item['children']
            if (sub !== undefined) {
                // 有儿子项目占位符的走这里: 第一层菜单之后可能有子菜单
                if (sub.length > 0) {
                    // 儿子个数 大于 0 的:  第一层菜单之后一定有子菜单
                    item_tmp['children']=[]
                    for (let j in sub) {
                        // 第二层菜单循环
                        let jitem = sub[j]
                        let jpath = path + '/' + jitem['path']
                        let jitem_tmp = deepClone(jitem)
                        paths.push(jpath)
                        let son_sub = jitem['children']
                        if (userpaths.indexOf(jpath) !== -1) {
                            // 孙子项目在列表中的: 第二层菜单在列表中的
                            jitem_tmp['children']=[]
                            if (son_sub !== undefined && son_sub.length > 0) {
                                // 孙子项目个数大于 0 的: 第三次菜单开始循环
                                for (let s in son_sub) {
                                    let sitem = son_sub[s]
                                    let sitem_tmp = deepClone(sitem)
                                    let spath = jpath + '/' + sitem['path']
                                    paths.push(spath)
                                    if(userpaths.indexOf(spath) !== -1){
                                        // 曾孙子在列表中的: 第三次菜单在列表中的
                                        jitem_tmp['children'].push(sitem_tmp)
                                    }
                                }
                            }
                            item_tmp['children'].push(jitem_tmp)
                        } else {
                            // 孙子项目不在列表中的
                            if (son_sub !== undefined && son_sub.length > 0) {
                                for (var s in son_sub) {
                                    var sitem = son_sub[s]
                                    let sitem_tmp = deepClone(sitem)
                                    var spath = jpath + '/' + sitem['path']
                                    // if (userpaths.indexOf(spath) !== -1) {
                                    //     jitem_tmp['children'].push(sitem_tmp)
                                    //     item_tmp['children'].push(jitem_tmp)
                                    //     // usermenus.push(item_tmp)
                                    // }
                                    paths.push(spath)
                                }
                            }
                        }
                    }
                    usermenus.push(item_tmp)
                } else {
                    // 儿子个数 等于 0 的:  第一层菜单之后一定没有子菜单
                    usermenus.push(item_tmp)
                }
            } else {
                // 没有儿子项目占位符的走这里: 第一层菜单之后就没有子菜单
                usermenus.push(item_tmp)
            }
        } else {
            var sub = item['children']
            if (sub !== undefined) {
                if (sub.length > 0) {
                    for (var j in sub) {
                        var jitem = sub[j]
                        var jpath = path + '/' + jitem['path']
                        paths.push(jpath)
                        var son_sub = jitem['children']
                        if (son_sub !== undefined && son_sub.length > 0) {
                            for (var s in son_sub) {
                                var sitem = son_sub[s]
                                var spath = jpath + '/' + sitem['path']
                                paths.push(spath)
                            }
                        }
                    }
                }
            }
        }
    }
    for (var m in paths) {
        if (paths[m].indexOf('//') !== -1) {
            paths[m] = paths[m].replace('//', '/')
        }
    }
    // return paths
    return usermenus
}
