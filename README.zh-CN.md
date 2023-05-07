<div align="center">
  <img alt="V3 Admin Vite Logo" width="120" height="120" src="./src/assets/layout/logo.png">
  <h1>V3 Admin Vite</h1>
  <span><a href="./README.md">English</a> | 中文</span>
</div>

## 📚 文档

[中文文档](https://juejin.cn/post/7089377403717287972)

[手摸手教程](https://juejin.cn/column/7207659644487139387)

## 国内仓库

[Gitee](https://gitee.com/un-pany/v3-admin-vite)

## 在线预览

| 位置         | 账号            | 链接                                            |
| ------------ | --------------- | ----------------------------------------------- |
| github-pages | admin 或 editor | [链接](https://un-pany.github.io/v3-admin-vite) |

## 🚀 开发

```bash
# 配置
1. 一键安装 .vscode 目录中推荐的插件
3. node 版本 16+
4. pnpm 版本 8.x

# 克隆项目
git clone https://github.com/un-pany/v3-admin-vite.git

# 进入项目目录
cd v3-admin-vite

# 安装依赖
pnpm i

# 启动服务
pnpm dev
```

## ✔️ 预览

```bash
# 预览预发布环境
pnpm preview:stage

# 预览正式环境
pnpm preview:prod
```

## 📦️ 多环境打包

```bash
# 构建预发布环境
pnpm build:stage

# 构建正式环境
pnpm build:prod
```

## 🔧 代码检查

```bash
# 代码格式化
pnpm lint

# 单元测试
pnpm test
```

## Git 提交规范参考

- `feat` 增加新的业务功能
- `fix` 修复业务问题/BUG
- `perf` 优化性能
- `style` 更改代码风格, 不影响运行结果
- `refactor` 重构代码
- `revert` 撤销更改
- `test` 测试相关, 不涉及业务代码的更改
- `docs` 文档和注释相关
- `chore` 更新依赖/修改脚手架配置等琐事
- `workflow` 工作流改进
- `ci` 持续集成相关
- `types` 类型定义文件更改
- `wip` 开发中

## 项目预览图

![preview1.png](./src/assets/docs/preview1.png)
![preview2.png](./src/assets/docs/preview2.png)
![preview3.png](./src/assets/docs/preview3.png)