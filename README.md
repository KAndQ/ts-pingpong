# ts-pingpong

TypeScript + Socket 处理粘包问题的简单 ping pong.

## 一、协议格式

4 字节 + 数据

* 4 字节: 表示数据长度(大端)
* 数据: 实际的数据内容

## 二、部署

```bash
npm install typescript -g
```

### 2.1 服务端

```bash
npm install
npm run launch
```

### 2.2 模拟客户端

```bash
npm install # 如果已经部署过服务端, 此步骤可跳过
tsc
node ./build/SimClientApp.js
```
