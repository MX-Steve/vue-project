## 小橙平台开发

### 搭建流程
#### 环境部署

下载源码：

```
git clone http://172.16.25.89/devops/vea-orange.git
```

配置npm仓库： 

```
npm config set registry http://172.16.3.243/repository/t3-npm/
```

安装npm包依赖：

```
 npm install   --unsafe-perm
```

#### 修改配置

主配置文件 vue.config.js

```
devServer: { 
    port: port,  
    open: true, 
    overlay: { 
      warnings: false, 
      errors: true 
    },
      proxy: {
        "/api": { 
            target: "http://127.0.0.1:10082", // 要访问的接口域名
            ws: true, // 是否启用websockets
            changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
            pathRewrite: {
                "^/api": "/api" //这里理解成用'/api'代替target里面的地址,比如我要调用'http://40.00.100.100:3002/api/user/add'，直接写'/api/user/add'即可
            }
        }
      }
  },
```



**target: 修改成自己的后端端口地址**


#### 启动服务


```
npm run dev
```
