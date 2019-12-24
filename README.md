# @hyder/cli


## 接入hyder product appcache


接入之后，h5应用将具备离线缓存功能，可以有效地提升页面打开性能！


1. 安装 hyder cli

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

3. 打包


```
yarn clean   # 清理文件
yarn build   # 编译前端资源
yarn hyder package build  # 打出hyder产品包
```

