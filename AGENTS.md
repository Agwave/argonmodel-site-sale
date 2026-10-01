# AGENTS.md — 本仓库对 AI 助手的工作要求

## 1. 每次改完代码，必须依次完成以下检查（禁止跳过）

```bash
pnpm lint      # 1. ESLint，必须 0 error
pnpm build     # 2. 类型检查 + 静态生成（会自动先跑 pnpm check-prices）
```

- **`pnpm build` 需要 `.env.local`。** 若报 `CONTACT_EMAIL is not set`，
  执行 `cp .env.example .env.local` 并填上——这是刻意设计的失败，
  防止发布一个 mailto 打不通的页面。
- `pnpm lint` 有输出必须修到 **0 error** 才能收尾
- `pnpm build` 同时承担 TypeScript 类型检查。本仓库把大量业务约束放进了类型系统，
  所以它失败时往往**不是"构建坏了"，而是"业务规则被破坏了"**：
  - 字典漏译或缺键 → `zh.ts` 声明为 `Dictionary` 类型，漏一条即编译失败
  - 价格状态非法 → `AskingPrice` / `Comparable` 是可辨识联合，写不出「有数字没状态说明」
  - 比较对象跨币种混算 → `Currency` 类型会拦住
- 改动界面文案时，**必须同时改 `i18n/dictionaries/en.ts` 和 `zh.ts`**。
  只改一个会编译失败——这是刻意设计，不是麻烦。
- 改动 `config/pricing.ts` 或 `config/site.ts` 后，单独跑一次 `pnpm check-prices` 确认。

## 2. Git commit message 格式

首行：`[改动类型](改动核心模块): 细节描述`

**改动类型**（常用）：`feat` `fix` `perf` `chore` `test` `refactor` `docs` `style` `build` `revert`

**核心模块**（对应本仓库实际目录）：

| 模块 | 对应位置 | 职责 |
|---|---|---|
| `i18n` | `i18n/` | 文案字典、语言配置、locale 路由 |
| `pricing` | `config/pricing.ts` | 要价与比价条目、价格模型 |
| `fx` | `lib/fx.ts` | 汇率获取与回退 |
| `prices` | `lib/prices.ts` | 竞品价格实时抓取 |
| `format` | `lib/format.ts` | 货币换算与格式化 |
| `sections` | `components/sections/` | 页面各区块 |
| `ui` | `components/`、`app/globals.css` | 主题、配色、交互组件 |
| `seo` | `app/robots.ts`、`sitemap.ts`、`opengraph-image.tsx` | 抓取与分享 |
| `config` | `config/site.ts` | 站点身份与联系方式 |
| `build` | `scripts/`、`package.json` | 构建脚本与校验 |

**规则**：
- 首行简洁，说清楚"改了什么、为什么"
- 单次改动内容较多时，首行之后空一行，用「- 」短横线分点列出

示例：

```
[feat](prices): 接入阿里云公开接口实时刷新竞品报价

- 阿里云域名交易检索接口聚合了 Atom / Sedo 数据，免鉴权
- 请求间隔 6s 规避限流，失败一律回退 config/pricing.ts
- 抓取到的行在表格中标记 auto 并显示拉取日期
```

```
[fix](sections): 修复窄视口下比价表格撑出页面横向滚动
```

## 3. 校验命令（本仓库没有测试框架）

本仓库**没有**单元测试框架，也刻意不引入——站点是纯静态展示，绝大部分逻辑是
「把配置渲染成 HTML」，为它搭测试框架的收益低于维护成本。**类型系统承担了测试的职责**：
`pnpm build` 会拦住漏译、非法价格状态、跨币种混算等大多数真实错误。

| 目的 | 命令 |
|---|---|
| 完整校验（类型 + 构建 + 价格检查） | `pnpm build` |
| 只跑 lint | `pnpm lint` |
| 只检查价格数据新鲜度 | `pnpm check-prices` |
| 价格检查转严格模式（过期即非零退出） | `pnpm check-prices:strict` |
| 本地预览生产构建 | `pnpm build && pnpm start` |
| 开发服务器 | `pnpm dev` |

**因此下列行为没有自动化覆盖，改动相关代码后必须人工验证**：

| 行为 | 验证方式 |
|---|---|
| 中英双语完整性 | 访问 `/en` 与 `/zh`，逐屏确认无漏译、无豆腐块 |
| 货币显示规则 | `/en` 原生美元应精确（`$888`），换算值应带 `≈`；`/zh` 阿里云价格应精确（`¥38,024`） |
| 汇率回退 | 断网或让 `open.er-api.com` 超时，页脚应改为「参考汇率」并写明固定值 |
| 抓取回退 | 让 `domainapi.aliyun.com` 失败，表格应回退到配置值且**不再**显示 `auto` 标记 |
| 无 JS 可用性 | 禁用 JS：hero 数字仍为最终值、FAQ 仍可展开、语言切换仍可用 |
| 窄视口无横向滚动 | 320 / 360 / 390 / 414 宽度下 `window.scrollX` 必须恒为 0 |

## 4. 本仓库的坑（改动前务必先读）

这些都是实际踩过并已修复的，**不要"顺手改回去"**：

- **`proxy.ts`，不是 `middleware.ts`。** Next.js 16 改了文件约定与导出函数名。
  写回 `middleware.ts` 会让 i18n 路由**静默失效**（不报错，只是不跳转）。
- **不要用 shadcn 的 `Table` / `Separator`。** 新版的这两个组件带 `"use client"`，
  用在纯静态表格上会白白把整块推进客户端包。`components/ui/` 保留着，
  是给真正的交互组件（Dialog 之类）用的。
- **比价区在 `md` 以下是卡片，不是表格。** 5 列表格放不进手机，而横向滚动容器
  在窄视口会把溢出泄漏到页面级滚动宽度（实测 320px / 360px 均泄漏）。
  卡片布局直接消除滚动容器，让这类 bug 不可能发生——不要用"把 min-width 调小"来"优化"回去。
- **字体栈必须带 CJK 回退。** Geist 没有中文字形。删掉 `globals.css` 里的
  PingFang / 微软雅黑 / Noto CJK 那一串，中文页会全部变成豆腐块。
- **阿里云接口有限流。** 连续几个快速请求会触发反爬（返回 HTML 而非 JSON），
  约 90 秒后自行恢复。`lib/prices.ts` 里的 6 秒间隔不是保守，是必需的。
  这个接口还是**模糊匹配**（查 `astramodel.com` 会返回 `astramigo.com`），
  必须校验 `domainName` 精确相等，近似结果一律当作"没查到"。
- **换算值一律带 `≈` 并取整。** 原生币种才显示精确值。这是本页面对"数字诚实"的
  核心规则：换算值没有自己的精度，汇率每天都在动。统计值（中位数/最高价）
  只要是跨币种算出来的，同样要按换算值处理。
- **价格联合类型不能绕过。** 想加"直接写个裸数字"的快捷路径时请打住——
  `AskingPrice` 的三态与 `Comparable` 的 `checkedAt` 必填，是为了让
  「显示假数字」「无日期的报价」在类型上不可表达。
- **依赖安装走镜像。** `.npmrc` 指向 `registry.npmmirror.com`；官方源在本机实测约 237 KB/s，
  一次 `create-next-app` 要 9 分钟。注意 `create-next-app` 拒绝在含 `.npmrc` 的目录里脚手架，
  需要先挪开再放回。
- **环境变量在构建期读取，不是运行时。** 全站静态生成，所以改了 Vercel 的环境变量
  **必须重新部署**才生效——只改设置不会生效。这是最容易被误判为"改了没反应"的地方。
- **`.gitignore` 的 `.env*` 会连 `.env.example` 一起吞掉。** 已有 `!.env.example` 例外，
  别删。新增 env 模板文件时记得同样加例外。
- **邮箱等个人信息一律走环境变量，不进仓库。** 已做历史重写，git 历史里不应出现真实邮箱；
  提交前用 `git ls-files -z | xargs -0 grep -nIoE '[\w.+-]+@[\w.-]+'` 自查一遍。
