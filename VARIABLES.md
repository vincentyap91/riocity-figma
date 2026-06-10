# Riocity 设计变量参考（CSS Custom Properties）

> 自动生成自 `figma-variables.json`，导出日期：**2026-06-10**
> 重新生成：`node scripts/generate-variables-doc.mjs`（Figma 同步后建议重跑）
>
> **命名与跨网站复用规则（手写、稳定）：** [VARIABLE-RULES.md](./VARIABLE-RULES.md)

## 1. 在其他网页如何使用

### 引入样式

```html
<link rel="stylesheet" href="/path/to/theme.css" />
<link rel="stylesheet" href="/path/to/theme-cam88.css" />
```

### 切换主题

| Figma Mode | HTML `data-theme` | 样式文件 |
|------------|-------------------|----------|
| Default（RioCity9） | `default` 或省略 | `theme.css` |
| CAM88 | `cam88` | `theme-cam88.css` |

```html
<!-- Default -->
<html data-theme="default">

<!-- CAM88 -->
<html data-theme="cam88">
```

### CSS 用法（推荐语义变量）

```css
.card {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.cta {
  background: var(--color-primary);
  color: var(--color-text-cta-inverse);
}
```

**原则：** 页面组件只引用 `--color-*` 语义变量，不要写死 hex。换主题时只改 `data-theme`，同一套变量名会自动解析到不同颜色。

## 2. 命名对照（Figma → CSS）

| 层级 | Figma 集合 | Figma 变量名示例 | CSS 自定义属性 |
|------|------------|------------------|----------------|
| 原始色 | `01 Primitives` | `mono/700` | `--mono-700` |
| 原始色 | `01 Primitives` | `brand/500` | `--brand-500` |
| 原始色 | `01 Primitives` | `raw-brand-cam` | `--raw-brand-cam` |
| 语义色 | `02 Semantic` | `color/text/primary` | `--color-text-primary` |
| 语义色 | `02 Semantic` | `color/surface/base` | `--color-surface-base` |
| 渐变 | `02 Semantic` | `color/gradient/home/cta/start` + `/end` | `--color-gradient-home-cta` |

规则：`/` 替换为 `-`，前缀加 `--`。

## 3. 变量统计

| 类型 | 数量 |
|------|------|
| 01 Primitives（原始色） | 286 |
| 02 Semantic Default | 348 |
| 02 Semantic CAM88 | 346 |
| 渐变合成（`--color-gradient-*`） | 31 |

### 仅存在于某一 Mode 的语义变量

**仅 Default：**
- `--color-button-cta-category` ← Figma `color/button/cta-category`
- `--color-gradient-dashboard-button-brand-start` ← Figma `color/gradient/dashboard/button/brand/start`

## 4. 01 Primitives — 原始色（`--mono-*` / `--brand-*` / …）

定义于 `:root` / `[data-theme="default"]` 与 `[data-theme="cam88"]`（两主题共用同一套原始色表）。**组件层一般不要直接使用**，除非做调试或特殊场景。

### accent（23）

| CSS 变量 | Figma 名 | 色值 |
|----------|----------|------|
| `--accent-200` | `accent/200` | `#fdd182` |
| `--accent-280` | `accent/280` | `#7e6f52` |
| `--accent-300` | `accent/300` | `#8a6b2a` |
| `--accent-310` | `accent/310` | `#c08605` |
| `--accent-330` | `accent/330` | `#cdb355` |
| `--accent-340` | `accent/340` | `#d4b12c` |
| `--accent-350` | `accent/350` | `#d4af37` |
| `--accent-360` | `accent/360` | `#e6c252` |
| `--accent-400` | `accent/400` | `#f8d840` |
| `--accent-420` | `accent/420` | `#f6c722` |
| `--accent-450` | `accent/450` | `#f4cf08` |
| `--accent-460` | `accent/460` | `#f0d10c` |
| `--accent-470` | `accent/470` | `#ffda29` |
| `--accent-475` | `accent/475` | `#dd8545` |
| `--accent-476` | `accent/476` | `#ae5300` |
| `--accent-500` | `accent/500` | `#fff500` |
| `--accent-brown-700` | `accent/brown-700` | `#774505` |
| `--accent-brown-800` | `accent/brown-800` | `#432800` |
| `--accent-brown-900` | `accent/brown-900` | `#3c1100` |
| `--accent-khaki-900` | `accent/khaki-900` | `#3b3722` |
| `--accent-orange-500` | `accent/orange-500` | `#fc8448` |
| `--accent-orange-700` | `accent/orange-700` | `#923f03` |
| `--accent-pale-100` | `accent/pale-100` | `#fffd90` |

### brand（40）

| CSS 变量 | Figma 名 | 色值 |
|----------|----------|------|
| `--brand-400` | `brand/400` | `#2eff8b` |
| `--brand-500` | `brand/500` | `#45ff8b` |
| `--brand-500-soft` | `brand/500-soft` | `rgba(69, 255, 139, 0.2)` |
| `--brand-600` | `brand/600` | `#125a48` |
| `--brand-630` | `brand/630` | `#1f3728` |
| `--brand-646` | `brand/646` | `#2b3c2b` |
| `--brand-648` | `brand/648` | `#2c352c` |
| `--brand-650` | `brand/650` | `#2c352d` |
| `--brand-700` | `brand/700` | `#26583b` |
| `--brand-750` | `brand/750` | `#134438` |
| `--brand-760` | `brand/760` | `#057734` |
| `--brand-761` | `brand/761` | `#039940` |
| `--brand-762` | `brand/762` | `#126e51` |
| `--brand-809` | `brand/809` | `#0e510e` |
| `--brand-810` | `brand/810` | `#00431b` |
| `--brand-811` | `brand/811` | `#114617` |
| `--brand-812` | `brand/812` | `#00742f` |
| `--brand-815` | `brand/815` | `#033424` |
| `--brand-820` | `brand/820` | `#1e2921` |
| `--brand-821` | `brand/821` | `#1f3728` |
| `--brand-822` | `brand/822` | `#262e27` |
| `--brand-823` | `brand/823` | `#27302a` |
| `--brand-824` | `brand/824` | `#202620` |
| `--brand-826` | `brand/826` | `#29372a` |
| `--brand-827` | `brand/827` | `#2e3b2f` |
| `--brand-828` | `brand/828` | `#447156` |
| `--brand-830` | `brand/830` | `#477658` |
| `--brand-831` | `brand/831` | `#334c33` |
| `--brand-832` | `brand/832` | `#334034` |
| `--brand-833` | `brand/833` | `#3b453c` |
| `--brand-839` | `brand/839` | `#2a4b36` |
| `--brand-840` | `brand/840` | `#164027` |
| `--brand-845` | `brand/845` | `#2e905b` |
| `--brand-846` | `brand/846` | `#1c8649` |
| `--brand-847` | `brand/847` | `#34774f` |
| `--brand-850` | `brand/850` | `#214c33` |
| `--brand-855` | `brand/855` | `#348641` |
| `--brand-856` | `brand/856` | `#2eac61` |
| `--brand-858` | `brand/858` | `#2f8856` |
| `--brand-862` | `brand/862` | `#72e0a0` |

### mono / Surface（92）

| CSS 变量 | Figma 名 | 色值 |
|----------|----------|------|
| `--Surface-Active-Positive` | `Surface/Active-Positive` | `#a7c5c1` |
| `--mono-0` | `mono/0` | `#ffffff` |
| `--mono-0909` | `mono/0909` | `rgba(255, 255, 255, 0)` |
| `--mono-105` | `mono/105` | `#f0f0f0` |
| `--mono-108` | `mono/108` | `#e9e9e9` |
| `--mono-110` | `mono/110` | `#e9eff4` |
| `--mono-112` | `mono/112` | `#e9f3fc` |
| `--mono-114` | `mono/114` | `#e7e7e7` |
| `--mono-115` | `mono/115` | `#dfe3e6` |
| `--mono-220` | `mono/220` | `#dbdad8` |
| `--mono-250` | `mono/250` | `#d8d8d8` |
| `--mono-255` | `mono/255` | `#d9d9d9` |
| `--mono-280` | `mono/280` | `#b9b9b9` |
| `--mono-300` | `mono/300` | `#b0baed` |
| `--mono-310` | `mono/310` | `#313131` |
| `--mono-330` | `mono/330` | `#333333` |
| `--mono-330-a0` | `mono/330-a0` | `rgba(51, 51, 51, 0)` |
| `--mono-350` | `mono/350` | `#99a4b0` |
| `--mono-400` | `mono/400` | `#99a4b0` |
| `--mono-450` | `mono/450` | `#4f5357` |
| `--mono-453` | `mono/453` | `#454545` |
| `--mono-462` | `mono/462` | `#878e95` |
| `--mono-465` | `mono/465` | `#878787` |
| `--mono-468` | `mono/468` | `#8d8d8d` |
| `--mono-471` | `mono/471` | `#8b8b8b` |
| `--mono-472` | `mono/472` | `#a2a2a2` |
| `--mono-474` | `mono/474` | `#b7b7b7` |
| `--mono-475` | `mono/475` | `#b8b8b8` |
| `--mono-488` | `mono/488` | `#adadad` |
| `--mono-490` | `mono/490` | `#a5afc0` |
| `--mono-500` | `mono/500` | `#6b7280` |
| `--mono-510` | `mono/510` | `#6b7180` |
| `--mono-520` | `mono/520` | `#616d62` |
| `--mono-530` | `mono/530` | `#5c6270` |
| `--mono-540` | `mono/540` | `#50535c` |
| `--mono-542` | `mono/542` | `#959595` |
| `--mono-545` | `mono/545` | `#575757` |
| `--mono-550` | `mono/550` | `#919191` |
| `--mono-555` | `mono/555` | `#929292` |
| `--mono-560` | `mono/560` | `#a6a6a6` |
| `--mono-565` | `mono/565` | `#aaaaaa` |
| `--mono-580` | `mono/580` | `#5b5b5b` |
| `--mono-600` | `mono/600` | `#565656` |
| `--mono-604` | `mono/604` | `#545454` |
| `--mono-622` | `mono/622` | `#3e3e3e` |
| `--mono-628` | `mono/628` | `#424242` |
| `--mono-630` | `mono/630` | `#434343` |
| `--mono-632` | `mono/632` | `#464646` |
| `--mono-635` | `mono/635` | `#474747` |
| `--mono-636` | `mono/636` | `#363636` |
| `--mono-640` | `mono/640` | `#484848` |
| `--mono-644` | `mono/644` | `#636363` |
| `--mono-646` | `mono/646` | `#676767` |
| `--mono-647` | `mono/647` | `#7a7a7a` |
| `--mono-648` | `mono/648` | `#7d7d7d` |
| `--mono-650` | `mono/650` | `#5d5d5d` |
| `--mono-660` | `mono/660` | `#383838` |
| `--mono-666` | `mono/666` | `#666666` |
| `--mono-697` | `mono/697` | `#697bd7` |
| `--mono-700` | `mono/700` | `#292929` |
| `--mono-710` | `mono/710` | `#303030` |
| `--mono-720` | `mono/720` | `#323232` |
| `--mono-735` | `mono/735` | `#343434` |
| `--mono-750` | `mono/750` | `#282828` |
| `--mono-768` | `mono/768` | `#2c2c2c` |
| `--mono-770` | `mono/770` | `#2b2b2b` |
| `--mono-775` | `mono/775` | `#2d2d2d` |
| `--mono-795` | `mono/795` | `#272727` |
| `--mono-798` | `mono/798` | `#262626` |
| `--mono-800` | `mono/800` | `#252525` |
| `--mono-808` | `mono/808` | `#25272b` |
| `--mono-818` | `mono/818` | `#323a38` |
| `--mono-825` | `mono/825` | `#28292c` |
| `--mono-850` | `mono/850` | `#252525` |
| `--mono-855` | `mono/855` | `#353535` |
| `--mono-860` | `mono/860` | `#2b2d33` |
| `--mono-862` | `mono/862` | `#27282b` |
| `--mono-865` | `mono/865` | `#2e2f33` |
| `--mono-867` | `mono/867` | `#2d3035` |
| `--mono-868` | `mono/868` | `#2e2f2f` |
| `--mono-870` | `mono/870` | `#3a3a3a` |
| `--mono-896` | `mono/896` | `#242424` |
| `--mono-900` | `mono/900` | `#222222` |
| `--mono-905` | `mono/905` | `#232323` |
| `--mono-910` | `mono/910` | `#1b1b1b` |
| `--mono-915` | `mono/915` | `#1e1e1e` |
| `--mono-920` | `mono/920` | `#1d1d1d` |
| `--mono-930` | `mono/930` | `#111111` |
| `--mono-940` | `mono/940` | `#0f0f0f` |
| `--mono-950` | `mono/950` | `#000000` |
| `--mono-950-a25` | `mono/950-a25` | `rgba(0, 0, 0, 0.25)` |
| `--mono-990` | `mono/990` | `#99a4b0` |

### other（5）

| CSS 变量 | Figma 名 | 色值 |
|----------|----------|------|
| `--KH168-raw-gradient-icon-end` | `KH168/raw-gradient-icon-end` | `#a61218` |
| `--KH168-raw-gradient-icon-start` | `KH168/raw-gradient-icon-start` | `#ff6b71` |
| `--KH168-raw-kh-primary` | `KH168/raw-kh-primary` | `#3b1919` |
| `--color-button-cta-end` | `color-button-cta-end` | `#961900` |
| `--color-button-cta-start` | `color-button-cta-start` | `#ff2a00` |

### overlay（8）

| CSS 变量 | Figma 名 | 色值 |
|----------|----------|------|
| `--overlay-default` | `overlay/default` | `rgba(0, 0, 0, 0.6)` |
| `--overlay-hairline` | `overlay/hairline` | `rgba(255, 255, 255, 0.1)` |
| `--overlay-inverse` | `overlay/inverse` | `rgba(255, 255, 255, 0.6)` |
| `--overlay-scrim` | `overlay/scrim` | `rgba(0, 0, 0, 0.2)` |
| `--overlay-shadow-soft` | `overlay/shadow-soft` | `rgba(29, 34, 37, 0.1)` |
| `--overlay-sports-card` | `overlay/sports-card` | `rgba(7, 13, 24, 0.4)` |
| `--overlay-sports-event` | `overlay/sports-event` | `rgba(7, 24, 9, 0.4)` |
| `--overlay-strong` | `overlay/strong` | `rgba(0, 0, 0, 0.8)` |

### raw（CAM88 等扩展色）（68）

| CSS 变量 | Figma 名 | 色值 |
|----------|----------|------|
| `--raw-bar` | `raw-bar` | `#3a3a3a` |
| `--raw-border-cam-panel` | `raw-border-cam-panel` | `#5162b3` |
| `--raw-border-sports-card` | `raw-border-sports-card` | `#0e192d` |
| `--raw-border-sports-market` | `raw-border-sports-market` | `#0e2d13` |
| `--raw-brand-cam` | `raw-brand-cam` | `#032ea1` |
| `--raw-brand-cam-strong` | `raw-brand-cam-strong` | `#d90d32` |
| `--raw-cam-muted` | `raw-cam-muted` | `#7b90d0` |
| `--raw-content-cam-nav` | `raw-content-cam-nav` | `#1a1755` |
| `--raw-disabled-color` | `raw-disabled-color` | `#5d68a2` |
| `--raw-disabled-text` | `raw-disabled-text` | `#8995d3` |
| `--raw-effect-cam-glow` | `raw-effect-cam-glow` | `rgba(69, 100, 255, 0.2)` |
| `--raw-gradient-cam-highlight-end` | `raw-gradient-cam-highlight-end` | `#eef2ca` |
| `--raw-gradient-cam-highlight-start` | `raw-gradient-cam-highlight-start` | `#e0ddc3` |
| `--raw-gradient-cam-icon-end` | `raw-gradient-cam-icon-end` | `#110d35` |
| `--raw-gradient-cam-icon-start` | `raw-gradient-cam-icon-start` | `#1f223c` |
| `--raw-gradient-fourth-end` | `raw-gradient-fourth-end` | `#b3520c` |
| `--raw-gradient-fourth-start` | `raw-gradient-fourth-start` | `#433300` |
| `--raw-gradient-icon-end` | `raw-gradient-icon-end` | `#433300` |
| `--raw-gradient-icon-start` | `raw-gradient-icon-start` | `#b3520c` |
| `--raw-gradient-primary-card-end` | `raw-gradient-primary-card-end` | `#000341` |
| `--raw-gradient-primary-card-start` | `raw-gradient-primary-card-start` | `#0d277f` |
| `--raw-gradient-rank-first-end` | `raw-gradient-rank-first-end` | `#cb9e30` |
| `--raw-gradient-rank-first-start` | `raw-gradient-rank-first-start` | `#ffde8d` |
| `--raw-gradient-rank-second-end` | `raw-gradient-rank-second-end` | `#696969` |
| `--raw-gradient-rank-second-start` | `raw-gradient-rank-second-start` | `#8a8a8a` |
| `--raw-gradient-rank-selected-end` | `raw-gradient-rank-selected-end` | `#6d1004` |
| `--raw-gradient-rank-selected-start` | `raw-gradient-rank-selected-start` | `#4a0301` |
| `--raw-gradient-rank-third-end` | `raw-gradient-rank-third-end` | `#9d642d` |
| `--raw-gradient-rank-third-start` | `raw-gradient-rank-third-start` | `#faa757` |
| `--raw-gradient-secondary-card-end` | `raw-gradient-secondary-card-end` | `#4a2418` |
| `--raw-gradient-secondary-card-start` | `raw-gradient-secondary-card-start` | `#621010` |
| `--raw-gradient-sports-button-end` | `raw-gradient-sports-button-end` | `#2fc50a` |
| `--raw-gradient-sports-button-start` | `raw-gradient-sports-button-start` | `#63d347` |
| `--raw-gradient-sports-card-end` | `raw-gradient-sports-card-end` | `#17274b` |
| `--raw-gradient-sports-card-start` | `raw-gradient-sports-card-start` | `#19387e` |
| `--raw-gradient-sports-stage-end` | `raw-gradient-sports-stage-end` | `#22221b` |
| `--raw-gradient-tag-end` | `raw-gradient-tag-end` | `#925624` |
| `--raw-gradient-tag-start` | `raw-gradient-tag-start` | `#eea45f` |
| `--raw-gradient-tertiery-end` | `raw-gradient-tertiery-end` | `#771405` |
| `--raw-gradient-tertiery-start` | `raw-gradient-tertiery-start` | `#430000` |
| `--raw-highlight-cam` | `raw-highlight-cam` | `#bb571e` |
| `--raw-icon-cam-shadow` | `raw-icon-cam-shadow` | `#0c0c00` |
| `--raw-icon-rank-alert-base` | `raw-icon-rank-alert-base` | `#d32f2f` |
| `--raw-icon-rank-alert-highlight` | `raw-icon-rank-alert-highlight` | `#ef5350` |
| `--raw-icon-rank-first-mark` | `raw-icon-rank-first-mark` | `#dd810e` |
| `--raw-icon-rank-second-mark` | `raw-icon-rank-second-mark` | `#e9e9e9` |
| `--raw-icon-rank-third-mark` | `raw-icon-rank-third-mark` | `#623c16` |
| `--raw-input-muted` | `raw-input-muted` | `#b0baea` |
| `--raw-muted` | `raw-muted` | `#b6b6b6` |
| `--raw-muted-text` | `raw-muted-text` | `#737373` |
| `--raw-progress-bar` | `raw-progress-bar` | `#8995d3` |
| `--raw-promo-date` | `raw-promo-date` | `#2d9923` |
| `--raw-rank-border` | `raw-rank-border` | `#dd3636` |
| `--raw-surface-cam` | `raw-surface-cam` | `#f3f3ff` |
| `--raw-surface-cam-base` | `raw-surface-cam-base` | `#d6dbf5` |
| `--raw-surface-cam-highlight` | `raw-surface-cam-highlight` | `#d6dbf5` |
| `--raw-surface-cam-input` | `raw-surface-cam-input` | `#f1f1f1` |
| `--raw-surface-cam-menu` | `raw-surface-cam-menu` | `#7583c9` |
| `--raw-surface-cam-muted` | `raw-surface-cam-muted` | `#717fc3` |
| `--raw-surface-cam-panel` | `raw-surface-cam-panel` | `#eeeeff` |
| `--raw-surface-cam-table` | `raw-surface-cam-table` | `#f6ecff` |
| `--raw-surface-game-stage` | `raw-surface-game-stage` | `#090909` |
| `--raw-surface-hover` | `raw-surface-hover` | `#8995d3` |
| `--raw-surface-sports-button` | `raw-surface-sports-button` | `#152d0e` |
| `--raw-text-cam-primary` | `raw-text-cam-primary` | `#0c162f` |
| `--raw-text-muted` | `raw-text-muted` | `#34393a` |
| `--raw-text-sports-muted` | `raw-text-sports-muted` | `#acafbb` |
| `--raw-text-sports-primary` | `raw-text-sports-primary` | `#e5eafa` |

### raw-gradient（3）

| CSS 变量 | Figma 名 | 色值 |
|----------|----------|------|
| `--raw-gradient-home-cta-edge` | `raw-gradient/home-cta-edge` | `#01b545` |
| `--raw-gradient-home-highlight-end` | `raw-gradient/home-highlight-end` | `#ebb614` |
| `--raw-gradient-home-highlight-start` | `raw-gradient/home-highlight-start` | `#ffd963` |

### support（47）

| CSS 变量 | Figma 名 | 色值 |
|----------|----------|------|
| `--support-cyan` | `support/cyan` | `#4bc3ef` |
| `--support-cyan-strong` | `support/cyan-strong` | `#1badde` |
| `--support-danger` | `support/danger` | `#c8102e` |
| `--support-danger-dark` | `support/danger-dark` | `#990000` |
| `--support-danger-maroon` | `support/danger-maroon` | `#532320` |
| `--support-danger-red` | `support/danger-red` | `#d32030` |
| `--support-danger-soft` | `support/danger-soft` | `#dd6044` |
| `--support-danger-surface` | `support/danger-surface` | `#3a1a1a` |
| `--support-danger-vivid` | `support/danger-vivid` | `#d71f28` |
| `--support-danger-warm` | `support/danger-warm` | `#352c2c` |
| `--support-error` | `support/error` | `#ff0000` |
| `--support-error-accent` | `support/error-accent` | `#ffe4e4` |
| `--support-error-bright` | `support/error-bright` | `#f8252d` |
| `--support-error-coral` | `support/error-coral` | `#ff3f30` |
| `--support-error-crimson` | `support/error-crimson` | `#e51d35` |
| `--support-error-light` | `support/error-light` | `#ff6f6f` |
| `--support-error-medium` | `support/error-medium` | `#db3d3d` |
| `--support-error-strong` | `support/error-strong` | `#df1f1f` |
| `--support-error-vivid` | `support/error-vivid` | `#ff493f` |
| `--support-error-warm` | `support/error-warm` | `#c3371c` |
| `--support-info` | `support/info` | `#29337a` |
| `--support-info-strong` | `support/info-strong` | `#252f6c` |
| `--support-lime` | `support/lime` | `#b8eb7c` |
| `--support-lime-bright` | `support/lime-bright` | `#4abd20` |
| `--support-lime-deep` | `support/lime-deep` | `#63941e` |
| `--support-lime-medium` | `support/lime-medium` | `#79b12b` |
| `--support-lime-strong` | `support/lime-strong` | `#98db7c` |
| `--support-lime-vivid` | `support/lime-vivid` | `#6fcb20` |
| `--support-link` | `support/link` | `#4a90e2` |
| `--support-link-danger` | `support/link-danger` | `#f8d840` |
| `--support-link-danger-cam` | `support/link-danger-cam` | `#fa4b29` |
| `--support-navy` | `support/navy` | `#012169` |
| `--support-navy-deep` | `support/navy-deep` | `#001f3f` |
| `--support-navy-mid` | `support/navy-mid` | `#003366` |
| `--support-negative` | `support/negative` | `#ff6341` |
| `--support-steel` | `support/steel` | `#599bcb` |
| `--support-steel-dark` | `support/steel-dark` | `#165275` |
| `--support-steel-light` | `support/steel-light` | `#65b1ef` |
| `--support-success` | `support/success` | `#10b981` |
| `--support-success-bright` | `support/success-bright` | `#5bcc6d` |
| `--support-success-light` | `support/success-light` | `#67c667` |
| `--support-success-mid` | `support/success-mid` | `#3cbc6c` |
| `--support-success-strong` | `support/success-strong` | `#208e49` |
| `--support-success-vivid` | `support/success-vivid` | `#2d9923` |
| `--support-teal-dark` | `support/teal-dark` | `#334155` |
| `--support-warning` | `support/warning` | `#eab308` |
| `--support-warning-surface` | `support/warning-surface` | `#624d28` |

## 5. 02 Semantic — 语义色（`--color-*`）

这是**页面应引用的主要变量**。下表列出 Figma 名、CSS 变量名，以及 Default / CAM88 各自 alias 到的原始/语义 token（与 `figma-variables.json` 一致）。

### `color/*`（19）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-accent` | `color/accent` | `accent/400` | `support/error` |
| `--color-bar` | `color/bar` | `raw-bar` | `raw-bar` |
| `--color-border` | `color/border` | `mono/700` | `mono/630` |
| `--color-danger` | `color/danger` | `support/danger` | `support/error` |
| `--color-muted` | `color/muted` | `mono/510` | `mono/510` |
| `--color-overlay` | `color/overlay` | `overlay/default` | `overlay/inverse` |
| `--color-primary` | `color/primary` | `brand/500` | `raw-brand-cam` |
| `--color-primary-tag` | `color/primary-tag` | `support/error-medium` | `color/error/medium` |
| `--color-primary-tag-text` | `color/primary-tag-text` | `mono/0` | `mono/0` |
| `--color-scrollbar` | `color/scrollbar` | `brand/500` | `raw-brand-cam` |
| `--color-secondary` | `color/secondary` | `mono/0` | `mono/0` |
| `--color-secondary-tag` | `color/secondary-tag` | `color/accent/pale` | `color/accent/pale` |
| `--color-secondary-tag-text` | `color/secondary-tag-text` | `support/success-vivid` | `support/success-vivid` |
| `--color-sticky-nav` | `color/sticky-nav` | `mono/910` | `raw-brand-cam` |
| `--color-success` | `color/success` | `support/success` | `support/success` |
| `--color-surface` | `color/surface` | `mono/900` | `raw-surface-cam` |
| `--color-thumbnail` | `color/thumbnail` | `mono/950` | `raw-progress-bar` |
| `--color-transparent` | `color/transparent` | `mono/0909` | `mono/0909` |
| `--color-warning` | `color/warning` | `support/warning` | `support/warning` |

### `color/accent/*`（10）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-accent-check-in-reward` | `color/accent/check-in/reward` | `accent/470` | `accent/470` |
| `--color-accent-chip` | `color/accent/chip` | `accent/420` | `accent/420` |
| `--color-accent-glow` | `color/accent/glow` | `accent/200` | `accent/200` |
| `--color-accent-gold` | `color/accent/gold` | `accent/360` | `accent/360` |
| `--color-accent-gold-light` | `color/accent/gold-light` | `accent/200` | `accent/200` |
| `--color-accent-gold-mid` | `color/accent/gold-mid` | `accent/330` | `accent/330` |
| `--color-accent-gold-muted` | `color/accent/gold-muted` | `accent/280` | `accent/280` |
| `--color-accent-khaki` | `color/accent/khaki` | `accent/khaki-900` | `accent/khaki-900` |
| `--color-accent-pale` | `color/accent/pale` | `accent/pale-100` | `accent/pale-100` |
| `--color-accent-yellow` | `color/accent/yellow` | `accent/460` | `accent/460` |

### `color/border/*`（9）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-border-brand` | `color/border/brand` | `brand/500` | `raw-border-cam-panel` |
| `--color-border-danger` | `color/border/danger` | `brand/500` | `raw-brand-cam-strong` |
| `--color-border-divider` | `color/border/divider` | `mono/540` | `mono/540` |
| `--color-border-line` | `color/border/line` | `mono/628` | `mono/565` |
| `--color-border-sports-card` | `color/border/sports-card` | `raw-border-sports-card` | `raw-border-sports-card` |
| `--color-border-sports-market` | `color/border/sports-market` | `raw-border-sports-market` | `raw-border-sports-market` |
| `--color-border-strong` | `color/border/strong` | `mono/650` | `raw-text-cam-primary` |
| `--color-border-subtle` | `color/border/subtle` | `mono/255` | `mono/255` |
| `--color-border-tabs` | `color/border/tabs` | `color/transparent` | `raw-border-cam-panel` |

### `color/button/*`（44）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-button-accent` | `color/button/accent` | `accent/400` | `color/primary` |
| `--color-button-accent-deep` | `color/button/accent-deep` | `accent/360` | `support/error-strong` |
| `--color-button-accordian-head` | `color/button/accordian-head` | `mono/0` | `mono/0` |
| `--color-button-back` | `color/button/back` | `mono/510` | `raw-cam-muted` |
| `--color-button-cta` | `color/button/cta` | `color/primary` | `raw-brand-cam` |
| `--color-button-cta-arrow` | `color/button/cta-arrow` | `color/primary` | `color/primary` |
| `--color-button-cta-arrow-selected` | `color/button/cta-arrow-selected` | `mono/0` | `mono/0` |
| `--color-button-cta-category` | `color/button/cta-category` | `mono/510` | `—` |
| `--color-button-cta-category-text` | `color/button/cta-category-text` | `brand/500` | `raw-brand-cam` |
| `--color-button-cta-fifth` | `color/button/cta-fifth` | `color/surface` | `mono/697` |
| `--color-button-cta-fifth-text` | `color/button/cta-fifth-text` | `mono/0` | `mono/0` |
| `--color-button-cta-fourth` | `color/button/cta-fourth` | `color/button/accent` | `color/primary` |
| `--color-button-cta-fourth-text` | `color/button/cta-fourth-text` | `color/text/tertiary` | `mono/0` |
| `--color-button-cta-pagination` | `color/button/cta-pagination` | `mono/310` | `mono/300` |
| `--color-button-cta-pagination-selected` | `color/button/cta-pagination-selected` | `color/surface/colorful` | `color/primary` |
| `--color-button-cta-primary` | `color/button/cta-primary` | `color/text/tertiary` | `mono/0` |
| `--color-button-cta-secondary` | `color/button/cta-secondary` | `support/success-strong` | `raw-brand-cam` |
| `--color-button-cta-secondary-text` | `color/button/cta-secondary-text` | `color/text/primary` | `mono/0` |
| `--color-button-cta-tertiary` | `color/button/cta-tertiary` | `color/surface/accent` | `color/surface/float` |
| `--color-button-cta-tertiary-text` | `color/button/cta-tertiary-text` | `color/text/primary` | `raw-content-cam-nav` |
| `--color-button-dashboard-primary-end` | `color/button/dashboard/primary/end` | `brand/500` | `support/danger-dark` |
| `--color-button-dashboard-primary-start` | `color/button/dashboard/primary/start` | `brand/500` | `support/error` |
| `--color-button-disabled` | `color/button/disabled` | `brand/830` | `raw-disabled-color` |
| `--color-button-dot` | `color/button/dot` | `color/primary` | `raw-brand-cam-strong` |
| `--color-button-hover` | `color/button/hover` | `brand/630` | `raw-brand-cam` |
| `--color-button-hover-text` | `color/button/hover-text` | `color/primary` | `color/text/light` |
| `--color-button-lang-border` | `color/button/lang-border` | `mono/650` | `mono/650` |
| `--color-button-lang-icon` | `color/button/lang-icon` | `color/text/primary` | `color/text/primary` |
| `--color-button-lang-text` | `color/button/lang-text` | `color/text/primary` | `color/text/primary` |
| `--color-button-menu-active` | `color/button/menu-active` | `color/primary` | `color/primary` |
| `--color-button-muted` | `color/button/muted` | `mono/510` | `raw-cam-muted` |
| `--color-button-muted-text` | `color/button/muted-text` | `mono/0` | `mono/0` |
| `--color-button-nav` | `color/button/nav` | `mono/750` | `mono/300` |
| `--color-button-nav-text` | `color/button/nav-text` | `color/primary` | `raw-content-cam-nav` |
| `--color-button-pagination` | `color/button/pagination` | `mono/310` | `raw-content-cam-nav` |
| `--color-button-pagination-arrow` | `color/button/pagination-arrow` | `mono/0` | `mono/0` |
| `--color-button-pagination-disabled` | `color/button/pagination-disabled` | `mono/666` | `raw-cam-muted` |
| `--color-button-referral-cta` | `color/button/referral-cta` | `color/warning` | `color/primary` |
| `--color-button-referral-cta-text` | `color/button/referral-cta-text` | `color/text/warm` | `mono/0` |
| `--color-button-sports` | `color/button/sports` | `raw-surface-sports-button` | `raw-surface-sports-button` |
| `--color-button-tabs` | `color/button/tabs` | `mono/660` | `raw-brand-cam` |
| `--color-button-tabs-muted` | `color/button/tabs-muted` | `mono/800` | `raw-cam-muted` |
| `--color-button-tabs-muted-text` | `color/button/tabs-muted-text` | `mono/0` | `mono/0` |
| `--color-button-tabs-text` | `color/button/tabs-text` | `brand/400` | `mono/0` |

### `color/danger/*`（6）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-danger-accent` | `color/danger/accent` | `support/danger-maroon` | `support/error-accent` |
| `--color-danger-deep` | `color/danger/deep` | `support/danger-maroon` | `support/error-accent` |
| `--color-danger-maroon` | `color/danger/maroon` | `support/danger-maroon` | `support/danger-maroon` |
| `--color-danger-negative` | `color/danger/negative` | `support/negative` | `support/negative` |
| `--color-danger-red` | `color/danger/red` | `support/danger-red` | `support/danger` |
| `--color-danger-vivid` | `color/danger/vivid` | `support/danger-vivid` | `support/danger-vivid` |

### `color/effect/*`（3）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-effect-glow` | `color/effect/glow` | `brand/500-soft` | `raw-effect-cam-glow` |
| `--color-effect-header-shadow` | `color/effect/header/shadow` | `mono/950-a25` | `overlay/shadow-soft` |
| `--color-effect-shadow-soft` | `color/effect/shadow-soft` | `overlay/shadow-soft` | `overlay/shadow-soft` |

### `color/error/*`（8）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-error-alert` | `color/error/alert` | `support/error-vivid` | `support/error-vivid` |
| `--color-error-bright` | `color/error/bright` | `support/error-bright` | `support/error-bright` |
| `--color-error-coral` | `color/error/coral` | `support/error-coral` | `support/error-coral` |
| `--color-error-crimson` | `color/error/crimson` | `support/error-crimson` | `support/error-crimson` |
| `--color-error-icon` | `color/error/icon` | `support/error` | `support/error` |
| `--color-error-medium` | `color/error/medium` | `support/error-medium` | `support/error-medium` |
| `--color-error-strong` | `color/error/strong` | `support/error-strong` | `support/error-strong` |
| `--color-error-warm` | `color/error/warm` | `support/error-warm` | `support/error-warm` |

### `color/gradient/*`（62）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-gradient-button-cta-end` | `color/gradient/button/cta/end` | `color/primary` | `support/danger-dark` |
| `--color-gradient-button-cta-start` | `color/gradient/button/cta/start` | `color/primary` | `support/error` |
| `--color-gradient-card-brand-end` | `color/gradient/card/brand/end` | `color/surface/forest-4` | `raw-surface-cam-panel` |
| `--color-gradient-card-brand-start` | `color/gradient/card/brand/start` | `brand/700` | `raw-surface-cam-panel` |
| `--color-gradient-check-in-card-end` | `color/gradient/check-in/card/end` | `brand/810` | `raw-gradient-primary-card-end` |
| `--color-gradient-check-in-card-start` | `color/gradient/check-in/card/start` | `support/success-strong` | `raw-brand-cam` |
| `--color-gradient-check-in-day-end` | `color/gradient/check-in/day/end` | `brand/811` | `brand/811` |
| `--color-gradient-check-in-day-start` | `color/gradient/check-in/day/start` | `brand/846` | `brand/846` |
| `--color-gradient-check-in-reward-end` | `color/gradient/check-in/reward/end` | `accent/476` | `accent/476` |
| `--color-gradient-check-in-reward-start` | `color/gradient/check-in/reward/start` | `accent/475` | `accent/475` |
| `--color-gradient-dashboard-button-brand-start` | `color/gradient/dashboard/button/brand/start` | `color/primary` | `—` |
| `--color-gradient-dashboard-warm-end` | `color/gradient/dashboard/warm/end` | `accent/orange-700` | `accent/orange-700` |
| `--color-gradient-dashboard-warm-start` | `color/gradient/dashboard/warm/start` | `accent/orange-500` | `accent/orange-500` |
| `--color-gradient-header-balance-end` | `color/gradient/header/balance/end` | `mono/600` | `raw-brand-cam` |
| `--color-gradient-header-balance-start` | `color/gradient/header/balance/start` | `mono/550` | `raw-brand-cam` |
| `--color-gradient-home-card-end` | `color/gradient/home/card/end` | `brand/850` | `raw-gradient-rank-selected-end` |
| `--color-gradient-home-card-start` | `color/gradient/home/card/start` | `brand/700` | `raw-gradient-rank-selected-start` |
| `--color-gradient-home-cta-end` | `color/gradient/home/cta/end` | `raw-gradient/home-cta-edge` | `raw-brand-cam` |
| `--color-gradient-home-cta-start` | `color/gradient/home/cta/start` | `brand/500` | `raw-brand-cam` |
| `--color-gradient-home-dashboard-end` | `color/gradient/home/dashboard/end` | `brand/850` | `raw-surface-cam-base` |
| `--color-gradient-home-dashboard-start` | `color/gradient/home/dashboard/start` | `brand/700` | `raw-surface-cam-base` |
| `--color-gradient-home-highlight-end` | `color/gradient/home/highlight/end` | `raw-gradient/home-highlight-end` | `color/transparent` |
| `--color-gradient-home-highlight-start` | `color/gradient/home/highlight/start` | `raw-gradient/home-highlight-start` | `color/transparent` |
| `--color-gradient-home-muted-end` | `color/gradient/home/muted/end` | `mono/604` | `mono/604` |
| `--color-gradient-home-muted-start` | `color/gradient/home/muted/start` | `mono/542` | `mono/542` |
| `--color-gradient-menu-warm-end` | `color/gradient/menu/warm/end` | `accent/brown-700` | `accent/brown-700` |
| `--color-gradient-menu-warm-start` | `color/gradient/menu/warm/start` | `accent/brown-800` | `accent/brown-800` |
| `--color-gradient-rank-first-end` | `color/gradient/rank/first/end` | `raw-gradient-rank-first-end` | `raw-gradient-rank-first-end` |
| `--color-gradient-rank-first-start` | `color/gradient/rank/first/start` | `raw-gradient-rank-first-start` | `raw-gradient-rank-first-start` |
| `--color-gradient-rank-second-end` | `color/gradient/rank/second/end` | `raw-gradient-rank-second-end` | `raw-gradient-rank-second-end` |
| `--color-gradient-rank-second-start` | `color/gradient/rank/second/start` | `raw-gradient-rank-second-start` | `raw-gradient-rank-second-start` |
| `--color-gradient-rank-third-end` | `color/gradient/rank/third/end` | `raw-gradient-rank-third-end` | `raw-gradient-rank-third-end` |
| `--color-gradient-rank-third-start` | `color/gradient/rank/third/start` | `raw-gradient-rank-third-start` | `raw-gradient-rank-third-start` |
| `--color-gradient-referral-card-end` | `color/gradient/referral/card/end` | `color/surface/forest/deep` | `raw-surface-cam-panel` |
| `--color-gradient-referral-card-start` | `color/gradient/referral/card/start` | `color/surface/forest-4` | `raw-surface-cam-panel` |
| `--color-gradient-referral-commission-end` | `color/gradient/referral/commission/end` | `brand/820` | `raw-gradient-primary-card-end` |
| `--color-gradient-referral-commission-start` | `color/gradient/referral/commission/start` | `brand/826` | `raw-gradient-primary-card-start` |
| `--color-gradient-referral-deposit-end` | `color/gradient/referral/deposit/end` | `color/danger/maroon` | `raw-gradient-secondary-card-end` |
| `--color-gradient-referral-deposit-start` | `color/gradient/referral/deposit/start` | `accent/brown-700` | `raw-gradient-secondary-card-start` |
| `--color-gradient-referral-icon-end` | `color/gradient/referral/icon/end` | `accent/310` | `raw-gradient-icon-end` |
| `--color-gradient-referral-icon-start` | `color/gradient/referral/icon/start` | `accent/340` | `raw-gradient-icon-start` |
| `--color-gradient-referral-panel-end` | `color/gradient/referral/panel/end` | `brand/850` | `mono/300` |
| `--color-gradient-referral-panel-start` | `color/gradient/referral/panel/start` | `brand/700` | `mono/300` |
| `--color-gradient-side-menu-brand-end` | `color/gradient/side-menu/brand/end` | `brand/760` | `raw-gradient-cam-icon-end` |
| `--color-gradient-side-menu-brand-start` | `color/gradient/side-menu/brand/start` | `brand/810` | `raw-gradient-cam-icon-start` |
| `--color-gradient-sidenav-daily-bonus-end` | `color/gradient/sidenav/daily-bonus/end` | `brand/760` | `raw-gradient-tertiery-end` |
| `--color-gradient-sidenav-daily-bonus-start` | `color/gradient/sidenav/daily-bonus/start` | `brand/810` | `raw-gradient-tertiery-start` |
| `--color-gradient-sidenav-highlight-end` | `color/gradient/sidenav/highlight/end` | `accent/310` | `raw-gradient-cam-highlight-end` |
| `--color-gradient-sidenav-highlight-start` | `color/gradient/sidenav/highlight/start` | `accent/340` | `raw-gradient-cam-highlight-start` |
| `--color-gradient-sidenav-info-end` | `color/gradient/sidenav/info/end` | `support/navy-mid` | `support/navy-mid` |
| `--color-gradient-sidenav-info-start` | `color/gradient/sidenav/info/start` | `support/navy-deep` | `support/navy-deep` |
| `--color-gradient-sidenav-scrim-end` | `color/gradient/sidenav/scrim/end` | `mono/330-a0` | `mono/330-a0` |
| `--color-gradient-sidenav-scrim-start` | `color/gradient/sidenav/scrim/start` | `mono/330` | `mono/330` |
| `--color-gradient-slot-panel-end` | `color/gradient/slot/panel/end` | `mono/750` | `mono/750` |
| `--color-gradient-slot-panel-start` | `color/gradient/slot/panel/start` | `mono/750` | `mono/750` |
| `--color-gradient-sports-button-end` | `color/gradient/sports/button/end` | `raw-gradient-sports-button-end` | `raw-gradient-sports-button-end` |
| `--color-gradient-sports-button-start` | `color/gradient/sports/button/start` | `raw-gradient-sports-button-start` | `raw-gradient-sports-button-start` |
| `--color-gradient-sports-card-end` | `color/gradient/sports/card/end` | `raw-gradient-sports-card-end` | `raw-gradient-sports-card-end` |
| `--color-gradient-sports-card-start` | `color/gradient/sports/card/start` | `raw-gradient-sports-card-start` | `raw-gradient-sports-card-start` |
| `--color-gradient-sports-stage-end` | `color/gradient/sports/stage/end` | `raw-gradient-sports-stage-end` | `raw-gradient-sports-stage-end` |
| `--color-gradient-tag-end` | `color/gradient/tag/end` | `color/danger/maroon` | `color/danger/maroon` |
| `--color-gradient-tag-start` | `color/gradient/tag/start` | `color/error/bright` | `color/error/bright` |

### `color/icon/*`（12）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-icon-action` | `color/icon/action` | `mono/580` | `mono/580` |
| `--color-icon-check-in-active` | `color/icon/check-in/active` | `brand/856` | `raw-gradient-cam-icon-end` |
| `--color-icon-check-in-muted` | `color/icon/check-in/muted` | `mono/468` | `raw-surface-cam-highlight` |
| `--color-icon-check-in-star-deep` | `color/icon/check-in/star-deep` | `brand/812` | `brand/812` |
| `--color-icon-muted` | `color/icon/muted` | `mono/555` | `raw-icon-cam-shadow` |
| `--color-icon-rank-alert-base` | `color/icon/rank/alert/base` | `raw-icon-rank-alert-base` | `raw-icon-rank-alert-base` |
| `--color-icon-rank-alert-highlight` | `color/icon/rank/alert/highlight` | `raw-icon-rank-alert-highlight` | `raw-icon-rank-alert-highlight` |
| `--color-icon-rank-first` | `color/icon/rank/first` | `raw-icon-rank-first-mark` | `raw-icon-rank-first-mark` |
| `--color-icon-rank-second` | `color/icon/rank/second` | `raw-icon-rank-second-mark` | `raw-icon-rank-second-mark` |
| `--color-icon-rank-third` | `color/icon/rank/third` | `raw-icon-rank-third-mark` | `raw-icon-rank-third-mark` |
| `--color-icon-subtle` | `color/icon/subtle` | `mono/560` | `raw-content-cam-nav` |
| `--color-icon-um` | `color/icon/um` | `brand/500` | `raw-brand-cam` |

### `color/info/*`（2）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-info-icon` | `color/info/icon` | `mono/648` | `mono/648` |
| `--color-info-steel-light` | `color/info/steel-light` | `support/steel-light` | `support/steel-light` |

### `color/overlay/*`（3）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-overlay-sports-card` | `color/overlay/sports-card` | `overlay/sports-card` | `overlay/sports-card` |
| `--color-overlay-sports-event` | `color/overlay/sports-event` | `overlay/sports-event` | `overlay/sports-event` |
| `--color-overlay-strong` | `color/overlay/strong` | `overlay/strong` | `overlay/strong` |

### `color/popup/*`（2）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-popup-body` | `color/popup/body` | `color/surface` | `raw-surface-cam-panel` |
| `--color-popup-head` | `color/popup/head` | `mono/910` | `mono/300` |

### `color/progress/*`（2）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-progress-bar-bg` | `color/progress/bar/bg` | `color/surface/deep-dark` | `raw-progress-bar` |
| `--color-progress-bar-fill` | `color/progress/bar/fill` | `color/primary` | `color/primary` |

### `color/success/*`（9）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-success-light` | `color/success/light` | `support/success-light` | `support/success-light` |
| `--color-success-lime-bright` | `color/success/lime-bright` | `support/lime-bright` | `support/lime-bright` |
| `--color-success-lime-deep` | `color/success/lime-deep` | `support/lime-deep` | `support/lime-deep` |
| `--color-success-lime-medium` | `color/success/lime-medium` | `support/lime-medium` | `support/lime-medium` |
| `--color-success-mid` | `color/success/mid` | `support/success-mid` | `support/success-mid` |
| `--color-success-positive` | `color/success/positive` | `support/success-bright` | `support/success-bright` |
| `--color-success-strong` | `color/success/strong` | `support/success-strong` | `raw-rank-border` |
| `--color-success-vivid` | `color/success/vivid` | `support/lime-vivid` | `support/lime-vivid` |
| `--color-success-vivid-green` | `color/success/vivid-green` | `support/success-vivid` | `support/success-vivid` |

### `color/surface/*`（103）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-surface-accent` | `color/surface/accent` | `mono/330` | `mono/300` |
| `--color-surface-accent-hover` | `color/surface/accent-hover` | `color/surface/colorful` | `raw-surface-hover` |
| `--color-surface-base` | `color/surface/base` | `mono/910` | `raw-surface-cam-base` |
| `--color-surface-base-dark` | `color/surface/base-dark` | `mono/808` | `mono/808` |
| `--color-surface-border` | `color/surface/border` | `mono/870` | `mono/870` |
| `--color-surface-card-container` | `color/surface/card-container` | `color/surface` | `color/surface/float` |
| `--color-surface-card-dark` | `color/surface/card-dark` | `mono/628` | `raw-surface-cam-base` |
| `--color-surface-card-light` | `color/surface/card-light` | `color/surface/accent` | `color/surface/base` |
| `--color-surface-cat-navigation` | `color/surface/cat-navigation` | `color/surface/float` | `color/primary` |
| `--color-surface-chatbox` | `color/surface/chatbox` | `color/surface/float` | `raw-surface-cam-base` |
| `--color-surface-check-in-cell` | `color/surface/check-in/cell` | `mono/453` | `raw-border-cam-panel` |
| `--color-surface-check-in-cell-active` | `color/surface/check-in/cell-active` | `brand/831` | `raw-gradient-cam-icon-end` |
| `--color-surface-check-in-cell-alt` | `color/surface/check-in/cell-alt` | `mono/855` | `mono/855` |
| `--color-surface-check-in-cell-hover` | `color/surface/check-in/cell-hover` | `mono/636` | `raw-cam-muted` |
| `--color-surface-check-in-cta` | `color/surface/check-in/cta` | `brand/761` | `brand/761` |
| `--color-surface-check-in-day-bg` | `color/surface/check-in/day-bg` | `brand/646` | `raw-gradient-cam-icon-start` |
| `--color-surface-check-in-day-current` | `color/surface/check-in/day-current` | `brand/847` | `brand/847` |
| `--color-surface-check-in-footer` | `color/surface/check-in/footer` | `brand/809` | `raw-surface-cam-highlight` |
| `--color-surface-check-in-icon` | `color/surface/check-in/icon` | `color/border/strong` | `raw-disabled-color` |
| `--color-surface-check-in-inverse` | `color/surface/check-in/inverse` | `accent/450` | `mono/0` |
| `--color-surface-check-in-text` | `color/surface/check-in/text` | `brand/500` | `raw-gradient-cam-icon-end` |
| `--color-surface-chip` | `color/surface/chip` | `mono/632` | `color/primary` |
| `--color-surface-chip-hover` | `color/surface/chip-hover` | `color/primary` | `raw-brand-cam-strong` |
| `--color-surface-chip-info` | `color/surface/chip-info` | `brand/839` | `color/surface/secondary-table-head` |
| `--color-surface-chip-muted` | `color/surface/chip-muted` | `mono/640` | `raw-surface-cam-base` |
| `--color-surface-code` | `color/surface/code` | `mono/622` | `mono/622` |
| `--color-surface-coloful-deep` | `color/surface/coloful-deep` | `brand/850` | `brand/850` |
| `--color-surface-colorful` | `color/surface/colorful` | `brand/700` | `raw-progress-bar` |
| `--color-surface-cool-light` | `color/surface/cool-light` | `mono/115` | `mono/115` |
| `--color-surface-darkest` | `color/surface/darkest` | `mono/940` | `mono/940` |
| `--color-surface-deep` | `color/surface/deep` | `mono/920` | `mono/0` |
| `--color-surface-deep-dark` | `color/surface/deep-dark` | `mono/915` | `mono/915` |
| `--color-surface-filter` | `color/surface/filter` | `mono/825` | `mono/0` |
| `--color-surface-filter-active` | `color/surface/filter-active` | `brand/845` | `mono/300` |
| `--color-surface-filter-dark` | `color/surface/filter-dark` | `mono/867` | `mono/867` |
| `--color-surface-filter-deep` | `color/surface/filter-deep` | `mono/868` | `mono/868` |
| `--color-surface-float` | `color/surface/float` | `mono/750` | `mono/300` |
| `--color-surface-forest-1` | `color/surface/forest-1` | `brand/822` | `brand/822` |
| `--color-surface-forest-2` | `color/surface/forest-2` | `brand/823` | `brand/823` |
| `--color-surface-forest-3` | `color/surface/forest-3` | `brand/824` | `brand/824` |
| `--color-surface-forest-4` | `color/surface/forest-4` | `brand/826` | `brand/826` |
| `--color-surface-forest-5` | `color/surface/forest-5` | `brand/827` | `brand/827` |
| `--color-surface-forest-accent` | `color/surface/forest-accent` | `brand/828` | `brand/828` |
| `--color-surface-forest-card` | `color/surface/forest-card` | `brand/832` | `raw-surface-cam-base` |
| `--color-surface-forest-card-alt` | `color/surface/forest-card-alt` | `brand/833` | `brand/833` |
| `--color-surface-forest-darkest` | `color/surface/forest-darkest` | `brand/815` | `brand/815` |
| `--color-surface-forest-deep` | `color/surface/forest-deep` | `brand/762` | `brand/762` |
| `--color-surface-forest-deep` | `color/surface/forest/deep` | `brand/820` | `brand/820` |
| `--color-surface-game-stage` | `color/surface/game-stage` | `raw-surface-game-stage` | `raw-surface-game-stage` |
| `--color-surface-high` | `color/surface/high` | `mono/800` | `raw-surface-cam-menu` |
| `--color-surface-highlight` | `color/surface/highlight` | `mono/310` | `raw-surface-cam-highlight` |
| `--color-surface-info` | `color/surface/info` | `support/info` | `support/info` |
| `--color-surface-info-deep` | `color/surface/info/deep` | `support/info-strong` | `support/info-strong` |
| `--color-surface-info-warning` | `color/surface/info/warning` | `support/warning-surface` | `support/warning-surface` |
| `--color-surface-input` | `color/surface/input` | `mono/905` | `mono/905` |
| `--color-surface-input-color` | `color/surface/input-color` | `color/surface/forest-5` | `raw-surface-cam-input` |
| `--color-surface-input-inverse` | `color/surface/input-inverse` | `color/surface/accent` | `mono/0` |
| `--color-surface-input-light` | `color/surface/input-light` | `mono/0` | `mono/0` |
| `--color-surface-input-light-border` | `color/surface/input-light-border` | `mono/0` | `mono/0` |
| `--color-surface-input-muted` | `color/surface/input-muted` | `mono/565` | `raw-input-muted` |
| `--color-surface-input-muted-border` | `color/surface/input-muted-border` | `mono/565` | `mono/565` |
| `--color-surface-inset` | `color/surface/inset` | `mono/950` | `mono/950` |
| `--color-surface-light` | `color/surface/light` | `mono/108` | `mono/108` |
| `--color-surface-light-active` | `color/surface/light-active` | `brand/500-soft` | `brand/500-soft` |
| `--color-surface-low` | `color/surface/low` | `mono/930` | `raw-surface-cam-muted` |
| `--color-surface-menu-active` | `color/surface/menu-active` | `color/primary` | `raw-brand-cam-strong` |
| `--color-surface-mid` | `color/surface/mid` | `mono/660` | `mono/660` |
| `--color-surface-mid-dark` | `color/surface/mid-dark` | `mono/630` | `raw-surface-cam-base` |
| `--color-surface-mid-color` | `color/surface/mid/color` | `brand/830` | `color/primary` |
| `--color-surface-mid-container` | `color/surface/mid/container` | `brand/700` | `raw-text-cam-primary` |
| `--color-surface-mid-text` | `color/surface/mid/text` | `mono/0` | `mono/0` |
| `--color-surface-nav` | `color/surface/nav` | `mono/720` | `raw-surface-cam-menu` |
| `--color-surface-navy` | `color/surface/navy` | `support/navy` | `support/navy` |
| `--color-surface-near-black` | `color/surface/near-black` | `mono/770` | `mono/770` |
| `--color-surface-near-black-alt` | `color/surface/near-black-alt` | `mono/768` | `mono/697` |
| `--color-surface-neutral-light` | `color/surface/neutral-light` | `mono/114` | `mono/114` |
| `--color-surface-notify` | `color/surface/notify` | `color/surface/float` | `color/surface/float` |
| `--color-surface-overlay-dark` | `color/surface/overlay-dark` | `mono/775` | `mono/775` |
| `--color-surface-pale-blue` | `color/surface/pale-blue` | `mono/112` | `mono/112` |
| `--color-surface-panel` | `color/surface/panel` | `mono/860` | `raw-surface-cam-panel` |
| `--color-surface-panel-border` | `color/surface/panel-border` | `support/success-strong` | `mono/300` |
| `--color-surface-primary-shape` | `color/surface/primary-shape` | `support/success-strong` | `color/transparent` |
| `--color-surface-qrcode` | `color/surface/qrcode` | `mono/0` | `mono/0` |
| `--color-surface-referral-card` | `color/surface/referral-card` | `brand/600` | `color/surface/float` |
| `--color-surface-referral-input` | `color/surface/referral-input` | `brand/750` | `raw-surface-cam-input` |
| `--color-surface-rtp-card` | `color/surface/rtp-card` | `color/surface/float` | `color/primary` |
| `--color-surface-rtp-secondary-card` | `color/surface/rtp-secondary-card` | `accent/450` | `raw-brand-cam` |
| `--color-surface-rtp-secondary-card-text` | `color/surface/rtp-secondary-card-text` | `mono/950` | `mono/0` |
| `--color-surface-scrim-dark` | `color/surface/scrim-dark` | `mono/798` | `mono/798` |
| `--color-surface-search` | `color/surface/search` | `mono/896` | `mono/896` |
| `--color-surface-secondary-chip` | `color/surface/secondary-chip` | `mono/632` | `color/surface` |
| `--color-surface-secondary-shape` | `color/surface/secondary-shape` | `color/danger/deep` | `support/danger-maroon` |
| `--color-surface-secondary-table-head` | `color/surface/secondary-table-head` | `brand/839` | `mono/697` |
| `--color-surface-sheet` | `color/surface/sheet` | `mono/735` | `mono/697` |
| `--color-surface-sidebar` | `color/surface/sidebar` | `mono/710` | `mono/710` |
| `--color-surface-slate` | `color/surface/slate` | `support/teal-dark` | `support/teal-dark` |
| `--color-surface-start` | `color/surface/start` | `mono/990` | `mono/990` |
| `--color-surface-striped-even` | `color/surface/striped-even` | `color/surface/highlight` | `raw-surface-cam-highlight` |
| `--color-surface-striped-odd` | `color/surface/striped-odd` | `color/surface/mid` | `raw-surface-cam-highlight` |
| `--color-surface-subtle` | `color/surface/subtle` | `mono/105` | `mono/105` |
| `--color-surface-table` | `color/surface/table` | `mono/795` | `mono/300` |
| `--color-surface-table-head` | `color/surface/table-head` | `color/surface/float` | `color/primary` |
| `--color-surface-teal-dark` | `color/surface/teal-dark` | `mono/818` | `mono/818` |

### `color/table/*`（2）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-table-highlight-end` | `color/table/highlight/end` | `mono/720` | `raw-surface-cam-base` |
| `--color-table-highlight-start` | `color/table/highlight/start` | `brand/700` | `raw-surface-cam-base` |

### `color/text/*`（52）

| CSS 变量 | Figma 名 | Default alias | CAM88 alias |
|----------|----------|---------------|-------------|
| `--color-text-accent` | `color/text/accent` | `accent/460` | `raw-brand-cam-strong` |
| `--color-text-accent-deep` | `color/text/accent-deep` | `accent/420` | `mono/660` |
| `--color-text-accent-light` | `color/text/accent-light` | `accent/460` | `accent/460` |
| `--color-text-card-text` | `color/text/card-text` | `mono/0` | `mono/0` |
| `--color-text-check-in-day-active` | `color/text/check-in/day-active` | `brand/862` | `raw-border-cam-panel` |
| `--color-text-check-in-day-muted` | `color/text/check-in/day-muted` | `mono/475` | `mono/475` |
| `--color-text-check-in-day-past` | `color/text/check-in/day-past` | `mono/471` | `raw-disabled-text` |
| `--color-text-check-in-reward` | `color/text/check-in/reward` | `mono/647` | `raw-disabled-color` |
| `--color-text-cta-inverse` | `color/text/cta-inverse` | `mono/950` | `mono/0` |
| `--color-text-cta-transparent` | `color/text/cta-transparent` | `mono/950` | `raw-brand-cam` |
| `--color-text-dim` | `color/text/dim` | `mono/604` | `mono/604` |
| `--color-text-disabled` | `color/text/disabled` | `mono/220` | `raw-disabled-text` |
| `--color-text-download` | `color/text/download` | `support/link` | `mono/0` |
| `--color-text-faded` | `color/text/faded` | `mono/565` | `mono/565` |
| `--color-text-fifth` | `color/text/fifth` | `mono/950` | `mono/950` |
| `--color-text-fifth-title` | `color/text/fifth-title` | `brand/500` | `mono/660` |
| `--color-text-footer` | `color/text/footer` | `mono/0` | `mono/0` |
| `--color-text-four-title` | `color/text/four-title` | `accent/450` | `raw-brand-cam` |
| `--color-text-fourth` | `color/text/fourth` | `mono/750` | `mono/750` |
| `--color-text-game-title` | `color/text/game-title` | `mono/660` | `mono/660` |
| `--color-text-highlight` | `color/text/highlight` | `raw-promo-date` | `raw-highlight-cam` |
| `--color-text-hover` | `color/text/hover` | `mono/950` | `mono/0` |
| `--color-text-label` | `color/text/label` | `mono/490` | `mono/490` |
| `--color-text-light` | `color/text/light` | `mono/488` | `mono/0` |
| `--color-text-link` | `color/text/link` | `support/link` | `raw-brand-cam` |
| `--color-text-link-danger` | `color/text/link-danger` | `support/link-danger` | `support/link-danger-cam` |
| `--color-text-link-inverse` | `color/text/link-inverse` | `mono/0` | `mono/950` |
| `--color-text-mid` | `color/text/mid` | `mono/644` | `mono/644` |
| `--color-text-mid-alt` | `color/text/mid-alt` | `mono/646` | `raw-surface-cam-input` |
| `--color-text-mid-neutral` | `color/text/mid-neutral` | `mono/465` | `mono/465` |
| `--color-text-muted` | `color/text/muted` | `mono/510` | `raw-text-muted` |
| `--color-text-placeholder` | `color/text/placeholder` | `mono/400` | `mono/400` |
| `--color-text-primary` | `color/text/primary` | `mono/0` | `mono/660` |
| `--color-text-primary-card-title` | `color/text/primary-card-title` | `brand/500` | `mono/0` |
| `--color-text-recent-amount` | `color/text/recent-amount` | `brand/500` | `support/link-danger-cam` |
| `--color-text-referral-accent` | `color/text/referral-accent` | `accent/420` | `mono/660` |
| `--color-text-secondary` | `color/text/secondary` | `mono/400` | `support/error` |
| `--color-text-secondary-card-title` | `color/text/secondary-card-title` | `accent/450` | `mono/0` |
| `--color-text-small` | `color/text/small` | `mono/400` | `mono/450` |
| `--color-text-soft` | `color/text/soft` | `mono/472` | `mono/472` |
| `--color-text-sports-muted` | `color/text/sports-muted` | `raw-text-sports-muted` | `raw-text-sports-muted` |
| `--color-text-sports-primary` | `color/text/sports-primary` | `raw-text-sports-primary` | `raw-text-sports-primary` |
| `--color-text-sticky-nav-active` | `color/text/sticky-nav-active` | `mono/0` | `mono/0` |
| `--color-text-sticky-nav-text` | `color/text/sticky-nav-text` | `mono/0` | `mono/0` |
| `--color-text-sub-highlight` | `color/text/sub-highlight` | `accent/460` | `raw-highlight-cam` |
| `--color-text-sub-title` | `color/text/sub-title` | `color/warning` | `raw-brand-cam` |
| `--color-text-subtle` | `color/text/subtle` | `mono/542` | `mono/300` |
| `--color-text-subtle-dark` | `color/text/subtle-dark` | `mono/545` | `mono/545` |
| `--color-text-tertiary` | `color/text/tertiary` | `mono/950` | `mono/0` |
| `--color-text-third-title` | `color/text/third-title` | `brand/500` | `raw-brand-cam-strong` |
| `--color-text-title` | `color/text/title` | `color/accent` | `support/error` |
| `--color-text-warm` | `color/text/warm` | `accent/brown-800` | `mono/0` |

## 6. 渐变变量（`--color-gradient-*`）

由 Figma 中成对的 `color/gradient/.../start` + `.../end` 合成，值为 `linear-gradient(90deg, …)`。

| CSS 变量 |
|----------|
| `--color-gradient-button-cta` |
| `--color-gradient-card-brand` |
| `--color-gradient-check-in-card` |
| `--color-gradient-check-in-day` |
| `--color-gradient-check-in-reward` |
| `--color-gradient-dashboard-warm` |
| `--color-gradient-header-balance` |
| `--color-gradient-home-card` |
| `--color-gradient-home-cta` |
| `--color-gradient-home-dashboard` |
| `--color-gradient-home-highlight` |
| `--color-gradient-home-muted` |
| `--color-gradient-menu-warm` |
| `--color-gradient-rank-first` |
| `--color-gradient-rank-second` |
| `--color-gradient-rank-third` |
| `--color-gradient-referral-card` |
| `--color-gradient-referral-commission` |
| `--color-gradient-referral-deposit` |
| `--color-gradient-referral-icon` |
| `--color-gradient-referral-panel` |
| `--color-gradient-side-menu-brand` |
| `--color-gradient-sidenav-daily-bonus` |
| `--color-gradient-sidenav-highlight` |
| `--color-gradient-sidenav-info` |
| `--color-gradient-sidenav-scrim` |
| `--color-gradient-slot-panel` |
| `--color-gradient-sports-button` |
| `--color-gradient-sports-card` |
| `--color-gradient-table` |
| `--color-gradient-tag` |

## 7. 常用语义变量速查

| 用途 | CSS 变量 | Figma 名 |
|------|----------|----------|
| 页面背景 | `--color-surface` | `color/surface` |
| 主文字 | `--color-text-primary` | `color/text/primary` |
| 次要文字 | `--color-text-secondary` | `color/text/secondary` |
| 弱化文字 | `--color-text-muted` | `color/text/muted` |
| 品牌主色 / CTA | `--color-primary` | `color/primary` |
| 边框 | `--color-border` | `color/border` |
| 卡片浮层 | `--color-surface-float` | `color/surface/float` |
| 输入框背景 | `--color-surface-input` | `color/surface/input` |
| 链接 | `--color-text-link` | `color/text/link` |
| 错误 | `--color-error-strong` | `color/error/strong` |
| 成功 | `--color-success-strong` | `color/success/strong` |
| 警告 | `--color-warning` | `color/warning` |
| Sticky 导航背景 | `--color-sticky-nav` | `color/sticky-nav` |
| Sticky 导航文字 | `--color-text-sticky-nav-text` | `color/text/sticky-nav-text` |
| 滚动条 | `--color-scrollbar` | `color/scrollbar` |
| 遮罩 | `--color-overlay` | `color/overlay` |

## 8. 维护流程

1. 在 Figma **Riocity-MCP** 修改 `01 Primitives` / `02 Semantic` 变量
2. 运行同步：`node scripts/renew-both-themes.mjs`
3. 重新生成本文档：`node scripts/generate-variables-doc.mjs`
4. 页面无需改变量名，只需确保 `data-theme` 与 CSS 文件已引入

