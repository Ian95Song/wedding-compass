# Wedding Compass - 备婚手帐

> 一款帮助新人规划婚礼的微信小程序

## 📋 项目简介

备婚手帐是一款专为新人打造的婚礼规划工具，帮助用户管理婚礼筹备的各个环节，包括预算管理、宾客管理、待办清单等功能。

## ✨ 功能特性

| 模块 | 功能描述 |
|------|----------|
| 🏠 首页 | 婚礼倒计时、快速入口 |
| 💍 灵感库 | 婚礼案例展示、灵感收集 |
| 📋 婚礼规划 | 预算管理、待办清单、决策记录 |
| 📝 宾客管理 | 宾客列表、座位安排、伴手礼管理 |
| 👤 个人中心 | 用户设置、隐私政策 |

## 🛠️ 技术栈

- **框架**: 微信小程序原生框架
- **语言**: JavaScript (ES6+)
- **样式**: WXSS
- **数据**: 本地存储 + Mock 数据

## 📁 项目结构

```
miniprogram/
├── assets/          # 静态资源（图标、图片）
├── data/            # Mock 数据
├── pages/           # 页面文件
│   ├── index/       # 首页
│   ├── guide/       # 灵感库
│   ├── wedding/     # 婚礼规划
│   └── profile/     # 个人中心
├── utils/           # 工具函数
├── app.js           # 应用入口
├── app.json         # 应用配置
└── app.wxss         # 全局样式
```

## 🚀 快速开始

### 开发环境

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开小程序项目目录
3. 配置小程序 AppID

### 运行项目

```bash
# 克隆项目
git clone https://github.com/Ian95Song/wedding-compass.git

# 打开微信开发者工具，导入项目
# 点击"编译"按钮启动开发
```

## 📱 页面说明

### 首页 (pages/index)
- 婚礼倒计时显示
- 快速功能入口

### 灵感库 (pages/guide)
- 婚礼案例展示
- 案例详情查看

### 婚礼规划 (pages/wedding)
- 预算管理：设置和追踪婚礼预算
- 待办清单：婚礼筹备任务列表
- 决策记录：重要决策记录
- 宾客管理：宾客名单和座位安排

### 个人中心 (pages/profile)
- 用户信息
- 隐私政策

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**祝新婚愉快！** 👰🤵
