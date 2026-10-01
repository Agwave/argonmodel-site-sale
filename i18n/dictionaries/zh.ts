import type { Dictionary } from "./en";

/**
 * Typed as `Dictionary`, so a missing or misnamed key here fails the build.
 *
 * This is a localisation, not a literal translation. Where Chinese readers weigh
 * things differently — the element association, how strongly a price disclaimer
 * needs to be worded — the copy is adjusted and noted inline.
 */
export const zh: Dictionary = {
  meta: {
    title: "argonmodel.com — 精品域名出售",
    description:
      "argonmodel.com 正在出售。两个词典单词，一个明确的含义：AI 时代的 model 层。仅走第三方担保交易，24 小时内回复。",
    ogAlt: "argonmodel.com — 精品域名出售",
  },

  header: {
    wordmark: "argonmodel.com",
    available: "可出售",
    availableAria: (date) => `可出售，状态更新于 ${date}`,
    themeToggle: "切换主题",
    languageLabel: "语言",
    otherLocaleName: "EN",
  },

  hero: {
    eyebrow: "精品域名 · 正在出售",
    subhead: "两个词典单词，一个明确的含义——AI 时代的 model 层。",
    priceLabel: (currencyLabel) => `报价 · ${currencyLabel}`,
    currencyNames: { USD: "美元", CNY: "人民币" },
    priceOnRequest: "价格面议",
    statusNote: {
      tbd: "暂无公开报价 — 欢迎出价",
      indicative: "指示性价格 — 以最终确认为准",
      firm: "实价",
    },
    originalQuote: (formatted) => `原始报价 ${formatted}（交易货币为美元）`,
    ctaPrimary: "发送邮件出价",
    ctaSecondary: "复制邮箱地址",
    copied: "已复制",
    mailSubject: "对 argonmodel.com 的出价",
    trust: ["仅走第三方担保交易", "1–7 天完成过户", "24 小时内回复"],
    element: {
      category: "稀有气体",
      state: "惰性 · 不易反应",
    },
  },

  name: {
    heading: "为什么 argonmodel.com 值得拥有",
    lead: "它读起来像一个产品名，而不是一个占位符。",
    cards: [
      {
        // ZH intent: the chemical-element association lands harder for a Chinese
        // reader than the Argon2 reference, so it leads and Argon2 supplements.
        title: "氩 — 第 18 号元素",
        body: "一种稀有气体：稳定、惰性、不易反应。在安全工程领域，Argon2 是密码哈希的行业标准。这个词首先传达的是稳定性——对一个「模型」来说，这是有用的含义。",
      },
      {
        title: "Model — 这个十年的名词",
        body: "基础模型、语言模型、扩散模型。这个赛道的每一家公司都围绕这一个词来组织自己。在复合词中拥有它，就等于拥有了一个品类描述词。",
      },
      {
        title: "合起来：the model layer",
        body: "argonmodel.com 读起来像一个实验室、一个平台，或一条产品线。既描述品类又具备品牌感——这是命名中最罕见的组合，也正是双词 .com 复合域名成为二级市场争夺最激烈空间的原因。",
      },
    ],
    stats: ["11 个字符", "2 个单词", "均为词典单词", ".com", "无连字符", "无数字"],
  },

  comparables: {
    // ZH intent: 「报价」, never 「市场价」or「估值」— the distinction is the point.
    heading: "同类域名目前的报价",
    subhead:
      "相近 .com 域名的挂牌报价，每条均标注最近一次核实或拉取的日期。挂牌价是卖方的期望价格，不是成交价。",
    columns: {
      domain: "域名",
      price: "报价",
      marketplace: "平台",
      status: "状态",
      checked: "查询日期",
    },
    thisDomain: "本域名",
    forSale: "在售",
    activeListing: "挂牌中",
    parked: "停放中",
    makeOffer: "接受报价",
    noPublicPrice: "无公开报价",
    checkedOn: (date) => `${date} 查证`,
    checkedDaysAgo: (days) => `${days} 天前查证`,
    autoTag: "自动",
    autoTagTitle: "由公开的域名交易接口自动刷新，所标日期为最近一次拉取时间。",
    staleWarning:
      "下表中有报价的查证时间已超过 30 天，可能已经发生变化。",
    provenanceTitle: "这些数字的来源",
    // ZH intent: deliberately firmer than the English. 「非成交价、非估值、请自行核实」
    // is spelled out because the gap between 「报价」and 「价值」is where Chinese
    // domain buyers most often get misled.
    provenanceBody:
      "标记「自动」的行，价格由阿里云公开的域名交易检索接口自动刷新（该接口聚合了 Atom、Sedo 等平台的挂售数据），所标日期为最近一次拉取时间；其余各行由人工在上方所链接的页面读取。表中每个数字都是其他卖方的挂牌报价——既非评估价值，也非已成交价格——且随时可能变动或下架。请在依赖前自行到来源处核实。",
    tiles: {
      median: "表内报价中位数",
      medianSub: "非估值",
      highest: "表内最高报价",
      count: "参与对比的域名",
      countSub: "含本域名",
    },
    barAria: (domain, price) => `${domain} 报价 ${price}`,
    awaitingCheck: "待查证",
  },

  rationale: {
    heading: "定价依据",
    // ZH intent: the nature of the number comes first, the reasoning second —
    // otherwise the section reads as a self-flattering appraisal.
    lead: "这是卖方的报价，不是评估价。域名的价值是观点，不是事实——这正是本页每个数字都标注为「报价」的原因。",
    points: [
      "双词典单词构成的 .com 复合域名——二级市场上最稀缺、竞争最激烈的形式。",
      "第二个词直接指向品类。「Model」不是装饰，它是 AI 产业赖以构建的那个名词。",
      "通过「广播测试」：口头说一遍，听者就能拼写正确。",
      "无连字符、无数字，无需额外解释拼写。",
      "定价与上表中的同类报价持平，并未高于它们。",
    ],
    closing: "合理的报价会被认真考虑。上面的数字是谈判起点，不是门槛。",
  },

  transfer: {
    heading: "过户流程",
    lead: "本站不设表单、不需注册、不收取任何款项。三个步骤，在域名到手之前每一步都可撤回。",
    steps: [
      {
        title: "谈定价格",
        body: "发邮件给我们。24 小时内回复——接受、还价，或拒绝。",
      },
      {
        // ZH intent: 「托管」needs concrete examples to be understood.
        title: "第三方担保",
        body: "托管服务商由你选择——Escrow.com、Dan.com 或 Afternic。款项由托管服务商持有，不经过我们。我们不接受任何其他付款方式。",
      },
      {
        title: "过户",
        body: "我们把域名推送到你的注册商账户，或提供转移授权码。同注册商推送当天完成；跨注册商转移最长 7 天。你确认自己已掌控该域名后，托管方才放款。",
      },
    ],
    feeNote: "托管费用由买方承担，除非交易前双方另有书面约定。",
    noPaymentNote: "本站不收款、不收集任何个人信息，也没有需要填写的表单。",
  },

  faq: {
    heading: "常见问题",
    items: [
      {
        id: "negotiable",
        q: "价格可以谈吗？",
        a: "可以。欢迎报价。合理的报价会得到认真答复，而不是模板回信。",
      },
      {
        id: "firmness",
        q: "这个报价是实价吗？",
        // 渲染时由 firmnessAnswers[askingPrice.mode] 替换。
        a: "",
      },
      {
        id: "escrowFee",
        q: "托管费用谁付？",
        a: "由买方承担，除非事先另有书面约定。",
      },
      {
        id: "timeline",
        q: "过户需要多久？",
        a: "同注册商推送当天可完成。跨注册商转移通常需 5–7 天，受 ICANN 规则约束。",
      },
      {
        // ZH intent: this is the most common overclaim in Chinese domain
        // listings; a flat denial is the credibility signal.
        id: "traffic",
        q: "这个域名有流量或收入吗？",
        a: "本页不作任何流量或收入声明。这个域名出售的是名字本身，不是一个业务。若情况有变，我们会在此处附证据说明。",
      },
      {
        id: "ownership",
        q: "你是域名所有者吗？",
        a: "是。所有权可通过注册商的公开 WHOIS 记录，以及本页链接的平台挂牌页面进行核实。",
      },
      {
        id: "whySelling",
        q: "为什么要出售？",
        a: "这个域名值得一个真正的运营者。我们不是这个品类的运营者。",
      },
      {
        id: "trademark",
        q: "是否存在商标冲突？",
        a: "本次出售不作出也不暗示任何商标主张。买方应自行完成其所在司法辖区内的商标检索与合规。",
      },
    ],
    firmnessAnswers: {
      tbd: "目前尚未公布价格，因此谈不上是否为实价。欢迎直接出价，我们会回复一个具体数字或还价。",
      indicative:
        "这是指示性报价，不是最终要价。真正有约束力的数字，是双方在托管启动前书面确认的那个。",
      firm: "这是实价。我们仍会考虑低于该价格的报价，但不会把这个数字本身当作竞价起点。",
    },
  },

  finalCta: {
    heading: "对 argonmodel.com 出价",
    body: "一封邮件就够了。无需填表、无需注册、不构成任何义务。",
    ctaPrimary: "发送邮件出价",
    ctaSecondary: "复制邮箱地址",
    note: "24 小时内回复，通常更快。",
  },

  footer: {
    reviewed: (date) => `数据最后复核：${date}`,
    dataNote: "竞品报价为人工查证的公开挂牌价——不是估值，也不是已成交价格。",
    fxNoteLive: (rate, date) =>
      `人民币数字按 1 美元 = ${rate} 人民币换算，汇率来自 open.er-api.com，最后更新于 ${date}。`,
    fxNoteFallback: (rate) =>
      `人民币数字按固定参考汇率 1 美元 = ${rate} 人民币换算。本页上次构建时无法获取实时汇率。`,
    // ZH intent: without this line a Chinese buyer may reasonably assume the
    // CNY figure is the number they are agreeing to.
    currencyNote: "交易货币为美元。",
    copyright: "© 2026 · 本页为私人域名出售信息。",
    noTracking: "不使用 Cookie、不做统计、无第三方追踪。",
  },

  common: {
    externalLink: "外部链接",
    opensInNewTab: "在新标签页打开",
    backToTop: "回到顶部",
  },
};
