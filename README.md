# @hyder/cli


## 接入hyder product appcache


接入之后，h5应用将具备离线缓存功能，可以有效地提升页面打开性能！


1. 安装 hyder cli

```
yarn add --dev @hyder/cli
```

2. 在`package.json`中添加


```json
  "scripts": {
    "hyder": "hyder"
  },

  ...

  "hyder": {
    "from": "dist/assets",
    "to": [
      "assets": "zmw/hyder-raw/shop",
      "html": "stuff/shop"
    ]
  },
```

3. 打包


根据上述配置应输出文件到 `dist/assets` 目录下


```
yarn build
```


将`dist/assets` 目录下的文件根据配置打成 hyder 产品包


```
yarn hyder package build  # 
```

