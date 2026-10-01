# argonmodel.com — 域名出售页

[中文](README.md) | [English](README.en.md)

`argonmodel.com` 的单页双语（中/英）出售展示站。纯静态，无后端、无数据库。
英文页显示美元，中文页显示人民币。

---

## 快速开始

```bash
pnpm install
cp .env.example .env.local   # 然后填上 CONTACT_EMAIL —— 构建需要它
pnpm dev                     # http://localhost:3000 → 自动跳转到 /en 或 /zh
```

> 开发模式下**首次**打开页面需要约 12 秒：它要拉取实时竞品报价，
> 请求之间必须留间隔以避开对方的限流。结果会被缓存，之后每次打开都是秒开。

| 命令 | 作用 |
|---|---|
| `pnpm dev` | 开发服务器 |
| `pnpm build` | 生产构建（会先自动跑价格检查） |
| `pnpm start` | 启动生产构建 |
| `pnpm lint` | ESLint |
| `pnpm check-prices` | 检查过期或未填写的竞品价格 |
| `pnpm check-prices:strict` | 同上，但有过期项时以非零码退出 |

---

## 配置

部署相关的值走**环境变量**，不进仓库。其余都在两个文件里。

### 环境变量

```bash
cp .env.example .env.local     # 然后填写
```

| 变量 | 是否必需 | 用途 |
|---|---|---|
| `CONTACT_EMAIL` | **必需** | mailto 链接——买家唯一的联系途径。**未设置或仍是占位符时构建会失败**，而不是发布一个 CTA 打不通的页面。 |
| `SITE_URL` | 可选 | canonical 标签、hreflang、sitemap、`robots.txt` 和结构化数据用的站点源。默认 `https://argonmodel.com`。 |

`.env.local` 已被 gitignore。生产环境在 Vercel 面板
**Project → Settings → Environment Variables** 里设置同名变量。

> ⚠️ **全站静态生成，这些变量在构建期读取。** 在 Vercel 改了值必须**重新部署**才生效。

### 1. `config/site.ts`

站点身份（域名标识）、可选的平台挂售链接、以及 `lastReviewed`（你最后一次核实价格的日期）。

### 2. `config/pricing.ts`

你的要价与竞品条目。

**你的要价是三态值，不是裸数字：**

```ts
export const askingPrice: AskingPrice = { mode: "tbd" };
export const askingPrice: AskingPrice = { mode: "indicative", amount: 888, currency: "USD" };
export const askingPrice: AskingPrice = { mode: "firm",       amount: 888, currency: "USD" };
```

- `tbd` — 任何位置都不渲染数字，hero 显示「价格面议」。
- `indicative` / `firm` — 数字**与状态标记一起**渲染。两者来自同一个对象，
  所以页面在结构上不可能「显示了数字却没说清这是什么数字」。

FAQ 里「这个报价是实价吗」的答案由同一个值派生，因此永远不会和 hero 矛盾。

**竞品价格**各自声明价格单元格该怎么渲染，类型会强制价格与之一致：

```ts
{ …, display: "price", amount: 38_024, currency: "CNY", checkedAt: "2026-10-01", liveQuery: "astramodel.com" }
{ …, display: "make-offer", checkedAt: "2026-10-01", liveQuery: null }
{ …, display: "unchecked", liveQuery: null }
```

- `price` — 必须同时提供 `amount`、`currency` 和 `checkedAt`。
- `make-offer` — 卖方未公开价格。渲染文字，绝不渲染 `0` 或 `—`（破折号会被读成「免费」）。
- `unchecked` — 你还没去看过。渲染「待查证」，但仍保留外链供访客自行查看。

金额**按来源报价的原币种存储**（`currency`），不要预先换算。
在这里换算等于把当天的汇率烤进数据里，数字将无法与挂牌页面核对。

`checkedAt` 是类型必填，所以不存在「没有日期的报价」。
日期超过 30 天后该行转为警告样式（图标**和**文字标签，绝不单靠颜色），构建时也会打印警告。

**绝不估算竞品价格。** 表里出现一个编造的数字，是唯一能摧毁整页可信度的东西——
而自动刷新机制存在的意义，正是为了让「估算」永远没有必要。

---

## 竞品价格如何刷新

Atom.com 和 Sedo 都对自家挂牌页面做了自动化封锁，其卖家 API 又有账号体量门槛，
单个域名永远达不到。直接对接是死路。

**但阿里云的域名交易市场把两家的数据都聚合了。**
`domainapi.aliyun.com/onsale/saleSearch.jsonp` 的响应里有个 `orgPlatForm` 字段，
值就是字面量 `"atom"` 或 `"sedo"`——也就是说，一个免费、免鉴权的 JSON 接口
同时覆盖了两个平台的挂售数据。`lib/prices.ts` 用的就是它。该接口报价为人民币。

关于它有三点必须知道：

- **未公开文档，且有限流。** 连续几个快速请求会触发人机校验，返回 HTML 而非 JSON，
  约 90 秒后自行恢复。因此请求间隔设为 6 秒——这也是冷启动渲染要 ~12 秒的原因。
- **是模糊匹配。** 查 `astramodel.com` 会连 `astramigo.com` 一起返回。
  代码要求 `domainName` 精确相等——近似结果一律当作「没查到」，绝不当作「差不多」。
- **任何失败都降级到 `config/pricing.ts` 里的人工值。** 上游变慢或变脸都不会让构建失败，
  一个略旧但正确的数字永远好过没有数字。

来自接口的价格在表格里标记为 **`auto`**，日期为拉取日期；其余为人工读取，各带自己的日期。
表格下方的出处说明会讲清楚哪些是哪种。

想让某个域名退出自动刷新，把它的 `liveQuery` 设为 `null`，就会始终使用人工值。

`pnpm check-prices` 会报告过期的人工值，并提醒你配置里的数字同时也是故障时的兜底值。

---

## 价格与货币的处理

显示货币与语言绑定——**英文用美元，中文用人民币**——但每个价格都按来源实际报价的币种存储。
这个区分就是整个设计的核心：

| | 渲染为 |
|---|---|
| **原生** —— 本就是这个显示币种 | 精确值：`$888`、`¥38,024` |
| **换算** 到该显示币种 | 带 `≈` 并取整：`≈ $5,660`、`≈ ¥6,000` |

给换算值取整不是马虎，而是**诚实的呈现**：换算值本身没有精度可言，
汇率每天都在动、本身也是估计。显示 `$5,660.87` 等于宣称一种并不存在的精确度。
这一点对「中位数」和「最高价」两个统计块尤其重要——它们是**跨币种**算出来的统计量，
只要有任何参与计算的价格是换算来的，它们就必须标记为近似。

对中文页而言，好处是阿里云来源的竞品价格**原样精确显示**（`¥38,024`），
因为阿里云本就以人民币报价。只有以美元计价的要价会在中文页被换算。

- `lib/fx.ts` 拉取 `open.er-api.com/v6/latest/USD`（免费、无需 key），
  3 秒超时、24 小时 ISR 重新验证，失败回退到固定值 `6.72`。它永不抛错——
  构建不能因为一个汇率接口慢就失败。
- 拿不到实时汇率时，页脚文案会自动切换为「参考汇率」并写明所用的固定值。
  **回退值绝不会被伪装成实时值。**
- 比价条的宽度和统计块都基于显示币种这一统一基准计算——
  直接跨币种比较原始数字会让柱子失去意义。
- 中文页脚明确写出**「交易货币为美元」**，且 hero 上的换算价格下方会重申原始币种金额。
  没有这句话，中文买家可能会以为自己同意的是人民币那个数字。

---

## 架构说明

**i18n 是手写的，没有用 next-intl。** `i18n/dictionaries/en.ts` 导出 `Dictionary` 接口，
`zh.ts` 声明为该类型，因此漏译或拼错是**编译错误**，而不是静默回退到英文。
约 60 条文案不值得引入一个库。

**是 `proxy.ts`，不是 `middleware.ts`。** Next.js 16 改了文件约定与导出函数名，
并把默认运行时改为 Node.js。它用 `Accept-Language`（正确处理 q 值）把无前缀路径重定向到对应语言，
返回 **307 而非 308**——目标依赖请求头，绝不能被永久缓存。它不写任何 cookie，
所以页脚「不使用 Cookie」的说法成立。

**只有三个客户端组件，其余全是服务端组件。** `PriceCounter`、`ThemeToggle`、`CopyEmailButton`。
值得一提的：FAQ 用的是原生 `<details>/<summary>`，比价表是纯 HTML——
shadcn 的 `Table` 和 `Separator` 带 `"use client"`，用在静态表格上会把客户端包白白拉进来。
shadcn/ui 的安装与配置（`components.json`）保留着，供你以后需要真正的交互组件时使用。

**比价区在 `md` 以下是卡片、以上是表格。** 五列表格放不进手机，
而常见的横向滚动方案在窄视口会把溢出泄漏到页面级滚动宽度——
当表格远宽于视口时，Chrome 会让滚动容器的范围泄漏进根滚动宽度。
实测在 320px 和 360px 下均会泄漏。卡片布局直接消除了滚动容器，
让这个 bug 不可能发生，而不是把它调参调掉。

**CJK 字体回退。** Geist 不含中文字形，中文页会渲染成豆腐块。
`globals.css` 里追加了系统 CJK 字体栈（PingFang SC、Hiragino Sans GB、微软雅黑、
Noto Sans SC/CJK SC、文泉驿微米黑）。中文 webfont 每种字重好几 MB——
这也是几乎每个中文站点都用系统字体栈的原因。

**无 JS 契约。** hero 价格在服务端就渲染为最终值，仅在客户端做动画，
因此禁用脚本时依然正确。FAQ、语言切换和所有链接也都不依赖 JS。

### 数据配色

比价区采用**强调（emphasis）**形式：一个主体，其余作为背景。
三个数据色都跑过 dataviz 校验器、在明暗两种表面下验证通过：
明度带、CVD 分离度（ΔE 亮色 15.0 / 暗色 12.6，目标 ≥ 8）、
常视觉分离度（21.5 / 20.0，下限 15）、对比度（全部 ≥ 3:1）。

| Token | 亮色 | 暗色 | 用途 |
|---|---|---|---|
| `--data` | `#0891b2` | `#0891b2` | 主体色条、规线、网格、辉光 |
| `--data-ink` | `#0e7490` | `#22d3ee` | 链接与小号强调文字 |
| `--deemphasis` | `#64748b` | `#7d8998` | 竞品色条 |

去强调灰是**刻意**不满足校验器的 chroma 下限的——「去强调」就是这个意思，
且在这里成立，因为灰色不是标识色。每根色条旁都有文字标签，
所以没有任何信息是仅靠颜色编码的，文字也从不穿数据色。

---

## 部署

构建与 lint 均干净通过；应用完全静态，两个 ISR 路由（页面）加一个动态路由（OG 图）。

### 1. Vercel

推到 Git 仓库后在 Vercel 导入，或：

```bash
pnpm dlx vercel        # 预览
pnpm dlx vercel --prod # 生产
```

**首次部署前先在 Vercel 项目设置里配上 `CONTACT_EMAIL`**——缺它构建会中止。
`SITE_URL` 可选，默认 `https://argonmodel.com`。

### 2. 域名

`argonmodel.com` 通过阿里云/万网注册，当前状态为 `active`（实名认证已完成），
但仍然**没有任何 DNS 记录**——NS 还是万网的默认值。要先把它指向 Vercel，它才会解析。

NS 变更在注册商处操作。若保留万网的 NS，就在那里添加 Vercel 的记录；
**具体值以 Vercel 域名卡片上显示的为准**——A 记录的地址现在因项目而异，
不要抄旧教程里的。

### 3. Cloudflare

Vercel 官方明确不建议在它前面套反向代理（Cloudflare 橙云）：双重 TLS 终止带来约 20ms 延迟、
削弱其 Bot 防护与流量可见性，并让面板持续显示 "Invalid Configuration"。
**灰云（仅 DNS）是低风险方案**——Vercel 的边缘本身就是全球 CDN。

如果确实要上 Cloudflare 的 CDN/WAF，顺序很重要：

1. 在 Vercel 添加域名，复制它显示的 DNS 记录。
2. 记录先保持**灰云（仅 DNS）**，让 Vercel 能完成 ACME 校验并签发证书。
3. 等 Vercel 把域名标记为 **Valid Configuration**。
4. 这时才把记录切为**橙云（代理）**。
5. Cloudflare 的 SSL/TLS 设为 **Full (Strict)**——*绝不*用 Flexible，那会导致重定向循环。
   Vercel 的源站证书已被 Cloudflare 信任，无需手动上传。
6. 在边缘开启 "Always Use HTTPS"。

DNS 校验用的 TXT 记录和 MX 记录请保持灰云——Cloudflare 不代理邮件，校验方需要拿到原始记录。

---

## 上线前检查清单

- [ ] 把 `argonmodel.com` 的 DNS 指向 Vercel（见上）——目前一条记录都没有
- [ ] 在 Vercel 项目设置里配置 `CONTACT_EMAIL`（见上）
- [x] `askingPrice` 已设为 `$888`（`indicative`）
- [ ] 决定 `$888` 应该是 `indicative` 还是 `firm`——状态标记和 FAQ 答案都由它派生，
      改一个词即可
- [ ] 确认上线后三个竞品价格仍然合理；它们会自动刷新，`auto` 标记能告诉你哪些来自接口
- [ ] 如果你也在某个平台挂了售，把链接填进 `config/site.ts`；
      第三方的归属证明比页面上的任何自述都更有价值
