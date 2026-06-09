# Figma 变量规则（跨网站复用）

> **目的：** 在新网站、新页面、新模块里，**沿用同一套变量名**。换品牌/主题只改 `data-theme` 和 CSS 文件，**不要**在代码里改 `--color-*` 名字，也不要写死 hex。
>
> **完整变量清单：** [VARIABLES.md](./VARIABLES.md)（Figma 同步后 `node scripts/generate-variables-doc.mjs` 重生成）

---

## 1. 核心原则（必记）

| 规则 | 说明 |
|------|------|
| **名字稳定** | 已发布的 `--color-*` / `--mono-*` 等名字视为 API，**禁止随意改名或删除**（见 [THEME_CSS_INCREMENTAL_UPDATE.md](./THEME_CSS_INCREMENTAL_UPDATE.md)） |
| **组件只用语义层** | HTML/CSS/组件里写 `var(--color-surface)`，不写 `var(--mono-900)`，不写 `#222222` |
| **主题换色不改名** | Default ↔ CAM88 等同名变量，值在 `theme.css` / `theme-cam88.css` 里各自解析 |
| **新名字只给新模块** | 只有 Figma 里出现**新的 UI 角色/模块**时才加 token；同一按钮、同一 surface 不要另起 `--color-my-card-bg` |
| **Figma 是设计源** | 先在 Figma `02 Semantic` 加变量并绑好 alias，再同步到 repo，最后在新网站引用 |

---

## 2. 两层结构（Figma ↔ CSS）

```
01 Primitives (Value)     →  hex / rgba，物理色板
        ↑ alias
02 Semantic (Default / CAM88 / …)  →  UI 角色，多 Mode 可指向不同 primitive
        ↑
   网页组件只引用这一层的 CSS 名
```

| 层级 | Figma 集合 | 谁用 | 示例 Figma | 示例 CSS |
|------|------------|------|------------|----------|
| 原始色 | `01 Primitives` | 设计系统维护；**网页一般不直接引用** | `mono/700` | `--mono-700` |
| 语义色 | `02 Semantic` | **所有页面、组件、新网站** | `color/text/primary` | `--color-text-primary` |
| 渐变合成 | `02 Semantic` 成对 start/end | 背景用 `linear-gradient` 时 | `color/gradient/home/cta/start` + `/end` | `--color-gradient-home-cta` |

### Figma → CSS 命名公式

1. 把 Figma 路径里的 `/` 换成 `-`
2. 前面加 `--`

```
mono/700              →  --mono-700
brand/500             →  --brand-500
raw-brand-cam         →  --raw-brand-cam
color/surface/float   →  --color-surface-float
color/gradient/home/cta/start + end  →  --color-gradient-home-cta
```

---

## 3. 语义变量模块（path 第一段）

新 token 必须落在已有 **module** 下，不要发明平行命名体系。

| Module（`color/{module}/…`） | 用途 | 引用示例 |
|------------------------------|------|----------|
| `text` | 文字颜色、标题、链接、placeholder | `--color-text-primary` |
| `surface` | 背景、卡片、输入框、表格、浮层 | `--color-surface`, `--color-surface-float` |
| `border` | 边框、分割线 | `--color-border`, `--color-border-brand` |
| `button` | 按钮背景/文字/分页/CTA 系列 | `--color-button-cta`, `--color-button-nav` |
| `primary` | 品牌主色（全局 CTA） | `--color-primary` |
| `accent` | 强调色、金色、chip | `--color-accent` |
| `error` / `danger` / `success` / `warning` | 状态色 | `--color-error-strong` |
| `overlay` | 遮罩、scrim | `--color-overlay` |
| `icon` | 图标色 | `--color-icon-um` |
| `gradient` | 渐变 stop（成对）+ 合成 `--color-gradient-*` | `--color-gradient-home-cta` |
| `popup` / `progress` / `table` / `sticky-nav` / `scrollbar` | 对应 UI 区块 | 见 [VARIABLES.md §7](./VARIABLES.md) |

**何时可以起新名字：** Figma 里新增了**新的 module 或新的 role**（例如新的 `color/surface/rtp-card`）。  
**何时不可以：** 只是换了一个相近的灰色——应复用已有 `color/surface/*` 或 `color/text/*`。

---

## 4. 在新网站接入（复制即用）

### 4.1 引入 CSS

```html
<link rel="stylesheet" href="/path/to/theme.css" />
<link rel="stylesheet" href="/path/to/theme-cam88.css" />
```

### 4.2 选主题

| 品牌 / Figma Mode | `data-theme` | 生效语义来自 |
|-------------------|--------------|--------------|
| Default（RioCity9） | `default` 或省略 | `theme.css` 的 `:root` |
| CAM88 | `cam88` | `theme-cam88.css` |

```html
<html lang="zh" data-theme="cam88">
```

### 4.3 组件样式模板

```css
/* ✅ 正确：语义变量 */
.page {
  background: var(--color-surface);
  color: var(--color-text-primary);
}
.card {
  background: var(--color-surface-float);
  border: 1px solid var(--color-border);
}
.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-cta-inverse);
}
.hero {
  background: var(--color-gradient-home-cta);
}

/* ❌ 避免 */
.bad { background: #222222; }
.bad { color: var(--mono-0); }   /* 除非调试 primitive */
```

### 4.4 React / Vue / Tailwind 等

- **CSS Modules / SCSS：** 同样写 `var(--color-*)`
- **Tailwind：** 在 `theme.extend.colors` 里映射到 `var(--color-surface)` 等，**不要**在 Tailwind 里重新定义一套颜色名
- **内联 style：** 仍用 `style={{ background: 'var(--color-surface)' }}`

---

## 5. 常用语义变量（新页面优先对照）

与 [VARIABLES.md §7](./VARIABLES.md) 一致，新网站 80% 场景够用：

| 场景 | CSS 变量 |
|------|----------|
| 页面背景 | `--color-surface` |
| 主文字 | `--color-text-primary` |
| 次要文字 | `--color-text-secondary` |
| 弱化文字 | `--color-text-muted` |
| 品牌主色 / 主 CTA | `--color-primary` |
| 默认边框 | `--color-border` |
| 卡片 / 浮层 | `--color-surface-float` |
| 输入框底 | `--color-surface-input` |
| 链接 | `--color-text-link` |
| 错误 / 成功 / 警告 | `--color-error-strong` / `--color-success-strong` / `--color-warning` |
| Sticky 顶栏 | `--color-sticky-nav` + `--color-text-sticky-nav-text` |
| 遮罩 | `--color-overlay` |

找不到合适角色时：先查 [VARIABLES.md](./VARIABLES.md) 全文表，再考虑在 Figma 加语义变量（不要先在代码里硬编码）。

---

## 6. 渐变规则

1. Figma 里用 `color/gradient/{path}/start` 与 `…/end` 两个语义变量（alias 到 primitive）
2. CSS 生成一个合成变量：`--color-gradient-{path}`（`/` → `-`）
3. 网页里只引用合成变量：

```css
.banner {
  background: var(--color-gradient-home-cta);
}
```

`color/table/highlight/start|end` → `--color-gradient-table`。

---

## 7. Primitives 分组（仅供理解 alias）

网页不直接引用，但有助于读懂 `--color-*` 最终落在哪类色板上：

| 前缀 | 含义 |
|------|------|
| `mono/*` | 中性灰阶 |
| `brand/*` | 品牌绿（Default 主色来源） |
| `accent/*` | 金黄 / 促销强调 |
| `support/*` | 成功、错误、链接等功能色 |
| `overlay/*` | 半透明遮罩 |
| `raw-*` | 品牌/场景专用（CAM88 等大量语义指向此类） |
| `raw-gradient-*` | 渐变 stop 用的物理色 |

---

## 8. 多 Mode / 仅某一品牌有的变量

- `02 Semantic` 每个 **Mode**（Default、CAM88、KH168…）同一 Figma 名可 alias 到**不同** primitive
- 网页侧 **变量名相同**；只有 `data-theme` 决定读哪份 CSS
- 部分变量仅 Default 有 mode（例如 `--color-button-cta-category`）— CAM88 页面勿依赖未导出的名，以 [VARIABLES.md §3](./VARIABLES.md) 为准

---

## 9. 在 Figma 新增变量时的 checklist

1. **能复用吗？** 先在 `02 Semantic` 搜索相近 role（`surface`、`text`、`button`…）
2. **命名：** `color/{module}/{role}`，与现有 path 风格一致（kebab，用 `/` 分层）
3. **Alias：** 指向 `01 Primitives`（或链式 alias 到另一语义，导出时会保留 direct alias）
4. **Scopes：** 按用途设 TEXT_FILL / FRAME_FILL 等，避免 `ALL_SCOPES`
5. **每个品牌 Mode** 都设好 alias（Default + CAM88 至少）
6. **同步 repo：**
   ```bash
   node scripts/renew-both-themes.mjs
   node scripts/audit-themes.mjs
   node scripts/generate-variables-doc.mjs
   ```
7. **新网站：** 只加 `var(--color-新名)`，不改旧名

---

## 10. 禁止事项

| 不要 | 原因 |
|------|------|
| 在组件里写 hex/rgb | 无法换主题 |
| 在组件里用 `--mono-*` / `--brand-*` | 绕过语义层，CAM88 不会对 |
| 为同一 UI 发明第二套名字（如 `--card-bg`） | 与 Figma / 其他站不一致 |
| 同步时删除或重命名已有 CSS 变量 | 破坏已上线页面 |
| 在 Figma 用 `-` 当 primitive 名（如 `color-button-cta-end`） | 会被当成 semantic 形状；primitive 用 `group/name` 或 `raw-*` |

---

## 11. 相关文件

| 文件 | 作用 |
|------|------|
| [VARIABLES.md](./VARIABLES.md) | 全部变量名 + Default/CAM88 alias 对照（自动生成） |
| [theme.css](./theme.css) | Default 主题 CSS |
| [theme-cam88.css](./theme-cam88.css) | CAM88 主题 CSS |
| [figma-variables.json](./figma-variables.json) | 同步后的 JSON 源 |
| [THEME_CSS_INCREMENTAL_UPDATE.md](./THEME_CSS_INCREMENTAL_UPDATE.md) | 增量更新、禁止改名细则 |
| [generate-theme-css.mjs](./generate-theme-css.mjs) | JSON → CSS 生成器 |

---

## 12. 一句话总结

**Figma 定名 → CSS `--color-*` 固定 → 所有网站同一套名字；换肤只换 `data-theme`，换模块才在 Figma 加新 `color/{module}/{role}`。**
