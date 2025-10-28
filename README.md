# 陈恩极简个人主页

## 项目预览
https://chenen-home.vercel.app/

## 🧭 项目简介

这是一个极简风格的个人主页模板，专为开发者、创作者和AI时代的超级个体设计。采用简洁优雅的设计理念，帮助您快速搭建专属的数字名片，高效展示个人品牌。

**设计理念**：在信息爆炸与个体崛起并行的时代，每一个独特的人都应该拥有一个代表自己的精美主页。

## 📌 项目特色

- **极简设计**：去除冗余，专注核心信息展示
- **高性能优化**：优化动画效果，减少DOM操作，提升用户体验
- **响应式布局**：完美适配桌面、平板、手机等各种设备
- **现代交互**：流畅的动画效果和触摸反馈
- **易于定制**：模块化配置，轻松个性化

## 🎯 为什么你需要这样一个主页？

相比传统的“图片式名片”或单一平台主页，一个定制化的网页具备更强的表达力与链接能力：
- 引导关注：访客一旦打开主页，就能被结构清晰地引导至你的核心平台（如博客、GitHub、微信公众号等）。
- 聚合链接：整合你所有重要账号和内容输出渠道，构建完整的个人网络入口。
- 满足好奇心：简单直接的界面满足访客对“你是谁”的第一层好奇，有效提升转化率。
- 控制权更高：独立部署、完全掌控，不受限于任何平台规则。

一个好主页，不需要堆砌大量内容，只需准确传递你的核心价值，并为真正感兴趣的用户提供继续了解的路径。

## 📁 项目结构

```
.
├── index.html           # 主页HTML文件
├── baoming.html         # 课程报名页面
├── knowledge.html       # AI知识库页面
├── style.css            # 主页样式文件
├── knowledge-style.css  # 知识库样式文件
├── script.js            # 主页功能文件
├── knowledge.js         # 知识库功能文件
├── vercel.json          # Vercel部署配置文件
├── assets/              # 资源文件夹（图片等）
│   └── images/
│       ├── chenen_logo.jpg  # Logo/头像
│       ├── Muse.jpg
│       ├── Wechat.jpg
│       ├── gzh.jpg
│       └── qr.png          # 报名二维码
├── README.md            # 项目说明
├── CHANGELOG.md         # 修改历史记录
└── TODO.md              # 待办任务列表
```

## ✨ 核心功能

### 🎨 视觉设计
- **柔和渐变背景**：优化的动画频率，更舒适的视觉体验
- **微妙阴影层次**：多重阴影效果，增强界面深度感
- **优雅动画效果**：流畅的悬停和交互动画
- **现代毛玻璃效果**：backdrop-filter增强视觉层次

### 📱 交互体验
- **智能设备适配**：桌面悬停效果，移动端触摸反馈
- **一键复制功能**：微信号快速复制到剪贴板
- **社交媒体集成**：支持微信、GitHub、B站等平台
- **二维码展示**：公众号二维码弹窗显示

### 📚 AI 知识库系统（NEW）
- **笔记管理**：创建、编辑、删除笔记，支持 Markdown 格式
- **文件夹分类**：多层级文件夹管理，展开/折叠功能
- **拖拽操作**：直观的拖拽笔记到文件夹进行分类
- **权限控制**：管理员登录系统，公开/私密笔记设置
- **数据持久化**：本地存储，无需后端数据库
- **飞书/思源风格**：参考主流笔记应用的 UI/UX 设计
- **响应式设计**：完美适配桌面和移动设备

### ⚡ 性能优化
- **节流优化**：鼠标跟随效果和滚动进度条性能优化
- **元素池技术**：减少DOM操作，提升动画流畅度
- **响应式布局**：完美适配各种屏幕尺寸
- **移动端优化**：专门的触摸交互和性能调优

## 📋 页面结构

当前页面包含以下核心模块：

1. **个人资料** - 头像、姓名、职位、位置信息
2. **联系方式** - 社交媒体链接和联系方式
3. **关于我** - 个人介绍和背景描述
4. **个人产品** - 产品展示区域（可配置）

## ☁️ 一键部署

点击下面的按钮，可以直接将此项目部署到Vercel平台：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchenen1225%2chenen-home)

### 部署步骤：
1. 点击上方 "Deploy with Vercel" 按钮
2. 使用 GitHub 账号登录 Vercel
3. 授权 Vercel 访问您的 GitHub 仓库
4. 等待自动部署完成
5. 获得您的专属域名，如：`https://chenen-home.vercel.app`

### 自定义域名：
部署完成后，您可以在 Vercel 控制台中：
- 添加自定义域名
- 配置 HTTPS 证书（自动）
- 设置环境变量（如需要）

## 🚀 快速开始

### 方法一：直接打开
直接在浏览器中打开 `index.html` 文件即可。

### 方法二：本地服务器
```bash
# 使用Python启动本地服务器
python3 -m http.server 8000

# 然后在浏览器访问
http://localhost:8000
```

### 方法三：使用Node.js
```bash
# 安装serve
npm install -g serve

# 启动服务器
serve

# 或者使用npx
npx serve
```

### 方法四：部署到其他平台
由于项目已经极度简化，您可以轻松部署到任何静态网站托管平台：

- **Vercel**: 使用上方一键部署按钮
- **Netlify**: 直接拖拽项目文件夹到 Netlify
- **GitHub Pages**: 推送到 GitHub 仓库并启用 Pages
- **Cloudflare Pages**: 连接 GitHub 仓库自动部署

## 🔧 自定义配置

### 📝 基本信息配置

要自定义个人信息，只需编辑 `script.js` 文件中的 `CONFIG` 对象：

```javascript
const CONFIG = {
  // 基本信息
  basic: {
    name: "你的名字",
    title: "你的职位描述",
    location: "你的位置",
    avatar: "./assets/images/你的头像.jpg"
  },

  // 联系方式
  contact: {
    contactText: "欢迎添加个人社交媒体互相学习！",
    wechat: "你的微信号",
    publicAccount: "./assets/images/你的公众号二维码.jpg",
    github: "https://github.com/你的用户名",
    youtube: "https://www.youtube.com/@你的频道",
    bilibili: "https://space.bilibili.com/你的UID"
  },

  // 关于我
  about: {
    content: "你的个人介绍，可以包含专业背景、兴趣爱好、价值观等"
  },

  // 个人产品
  products: {
    comingSoon: true,  // 设为false可展示具体产品
    productsList: []   // 产品列表（当comingSoon为false时使用）
  },

  // 版权信息
  copyright: {
    year: "2021 - 2025",
    name: "你的名字",
    url: "https://你的网站.com"
  }
};
```

### 🎨 主题颜色配置

在 `CONFIG` 对象中还可以自定义主题颜色：

```javascript
// 主题颜色
theme: {
  primary: "#3b82f6",        // 主色调
  primaryLight: "#60a5fa",   // 浅色主色调
  primaryDark: "#2563eb",    // 深色主色调
  background: "#f9fafb",     // 背景色
  cardBackground: "#ffffff", // 卡片背景色
  text: "#1f2937",          // 文字颜色
  textLight: "#6b7280",     // 浅色文字
  accentGreen: "#10b981",   // 绿色强调色
  accentPurple: "#8b5cf6",  // 紫色强调色
  accentOrange: "#f59e0b"   // 橙色强调色
}
```

### 🖼️ 图片资源配置

确保在 `assets/images/` 文件夹中包含以下图片：

- `Muse.jpg` - 个人头像
- `Wechat.jpg` - 微信二维码
- `gzh.jpg` - 公众号二维码

## 🎨 样式自定义

### CSS变量系统

项目使用CSS变量系统，可以轻松自定义主题：

```css
:root {
    /* 主色调 */
    --primary: #3b82f6;
    --primary-light: #60a5fa;
    --primary-dark: #2563eb;

    /* 背景色 */
    --bg: #f9fafb;
    --card-bg: #ffffff;

    /* 文字颜色 */
    --text: #1f2937;
    --text-light: #6b7280;
    --text-muted: #9ca3af;

    /* 阴影效果 */
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 40px -10px rgba(0, 0, 0, 0.15);

    /* 排版变量 */
    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;
}
```

## 📱 响应式支持

项目完全支持响应式设计，在以下设备上都能完美显示：

- **桌面电脑** (> 1024px) - 完整功能，包含悬停效果和鼠标跟随
- **平板设备** (768px - 1024px) - 适配触摸交互
- **手机设备** (< 768px) - 优化的移动端体验
- **小屏手机** (< 480px) - 紧凑布局，保持可用性

## 🔄 版本更新记录

### v2.1.0 (2025-01-25)
- ✨ 新增 AI 知识库页面 (knowledge.html)
- 📝 笔记管理功能：创建、编辑、删除笔记
- 📁 文件夹分类管理：创建文件夹、展开/折叠
- 🎯 拖拽功能：拖拽笔记到文件夹进行分类
- 🔐 管理员登录系统（默认账号：admin / admin123）
- 💾 数据本地持久化（使用 localStorage）
- 📱 参考飞书/思源笔记的 UI 设计
- 🎨 Markdown 渲染支持
- 🐛 修复 Toast 提示在移动端占用满屏的问题
- 🐛 修复笔记保存到选中文件夹的逻辑问题

### v2.0.0
- ✨ 极简化设计，移除冗余模块
- ⚡ 性能大幅优化，减少DOM操作
- 📱 增强移动端体验
- 🎨 优化视觉效果和动画

### v1.0.0
- 🎉 初始版本发布
- 📋 完整的个人主页模板

## 🛠️ 技术栈

- **HTML5** - 语义化标记
- **CSS3** - 现代样式特性
- **Vanilla JavaScript** - 原生JS，无依赖
- **Font Awesome** - 图标库
- **Google Fonts** - 字体支持

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📞 支持

如果您在使用过程中遇到问题，可以：

- 提交 [Issue](https://github.com/chenen1225/chenen-home/issues)
- 查看 [Wiki](https://github.com/chenen1225/chenen-home/wiki)
- 联系作者：[GitHub](https://github.com/chenen1225)

---

**注意**：请确保 `assets/images/` 文件夹中包含必要的图片文件（头像、微信二维码等）。

Made with ❤️ by [陈恩](https://github.com/chenen1225)
