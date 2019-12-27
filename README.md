# @hyder/cli


## 使用


### H5应用接入hyder appcache


接入之后，h5应用将具备离线缓存功能，可以有效地提升页面打开性能。


1. 安装`hyder-cli`

```
yarn add --dev @hyder/cli
```

2. 在`package.json`中添加配置


```json
  "scripts": {
    "hyder": "hyder"
  },

  ...

  "hyder": {
    "from": "dist/assets",
    "to": {
      "service": "proxyimg/zmw/hyder-raw/shop",
      "assets": "zmw/hyder-raw/shop",
      "html": "stuff/shop"
    }
  },
```

以上配置将会把 `dist/assets` 中的文件，根据不同类型打包到不同的目录下。


3. 打包


```
yarn clean   # 清理文件
yarn build   # 编译前端资源
yarn hyder package build    # 打出产品包
yarn hyder package release  # 发布产品包
```

其他命令可参考

```
yarn hyder --help
```

### 全局安装

```
npm install -g @hyder/cli
```

在`.zshrc`或`.bashrc`中配置`HYDER_TOKEN`

```
export HYDER_TOKEN=xxx
```

安装后可以直接使用以下命令

```
hyder product list         # 查看产品列表
hyder product info         # 查看指定产品信息

hyder package list         # 查看指定产品包列表
hyder package build        # 构造产品包
hyder package release      # 上传并发布最新构造的产品包
hyder package uplaod dist/shop-2.8.10-47ed.zip # 仅上传指定产品包

hyder rollout list
hyder rollout update -V 2.8.9-fde0    # 发布指定版本产品包
hyder rollout delete       # 回滚最近发布

hyder help # 查看帮助
```

