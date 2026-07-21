# DESIGN.md — Technical Blueprint Homepage

> Figma-style design specification. Tokens, components, exact values, literal copy.
> Source of truth for every pixel, color, font setting, and string in the project.
> Hand-off document from design to code.

---

## Table of Contents

1. [Design Tokens](#1-design-tokens)
   - 1.1 [Color Tokens](#11-color-tokens)
   - 1.2 [Typography Tokens](#12-typography-tokens)
   - 1.3 [Spacing & Sizing Tokens](#13-spacing--sizing-tokens)
   - 1.4 [Radius, Border & Shadow Tokens](#14-radius-border--shadow-tokens)
   - 1.5 [Motion Tokens](#15-motion-tokens)
   - 1.6 [Z-Index & Opacity Tokens](#16-z-index--opacity-tokens)
2. [Layout & Grid](#2-layout--grid)
3. [Breakpoints / Responsive Spec](#3-breakpoints--responsive-spec)
4. [Component Library](#4-component-library)
   - 4.1 [TickMarks](#41-tickmarks)
   - 4.2 [Navbar](#42-navbar)
   - 4.3 [Hero + Schematic](#43-hero--schematic)
   - 4.4 [WhatIBuild / Capability Panels](#44-whatibuild--capability-panels)
   - 4.5 [SheetIndex / Project Table](#45-sheetindex--project-table)
   - 4.6 [CaseStudySheet / Drawing Sheet](#46-casestudysheet--drawing-sheet)
   - 4.7 [RevisionLog / Career Table](#47-revisionlog--career-table)
   - 4.8 [PerformanceData / Results Table](#48-performancedata--results-table)
   - 4.9 [BOM / Skills Grid](#49-bom--skills-grid)
   - 4.10 [ResumePanel](#410-resumepanel)
   - 4.11 [Closing CTA](#411-closing-cta)
   - 4.12 [Footer](#412-footer)
   - 4.13 [Button — Primary / Secondary / Brass-pill](#413-button--primary--secondary--brass-pill)
   - 4.14 [Input — Text / Date / Textarea / Select](#414-input--text--date--textarea--select)
   - 4.15 [TimeSlot Chip](#415-timeslot-chip)
   - 4.16 [Status Badge — CURRENT](#416-status-badge--current)
   - 4.17 [BookCallModal](#417-bookcallmodal)
   - 4.18 [AdminLoginModal](#418-adminloginmodal)
   - 4.19 [AnanOS Desktop (Dashboard)](#419-ananos-desktop-dashboard)
5. [Iconography](#5-iconography)
6. [Asset Manifest](#6-asset-manifest)
7. [Literal Text Strings (All Copy)](#7-literal-text-strings-all-copy)
8. [Accessibility Spec](#8-accessibility-spec)
9. [Background & Surface Utilities](#9-background--surface-utilities)
10. [Tailwind Config Reference](#10-tailwind-config-reference)
11. [File Map](#11-file-map)

---

## 1. Design Tokens

### 1.1 Color Tokens

All colors live in `tailwind.config.js` under `theme.extend.colors.blueprint`. The CSS equivalent in `src/index.css` is the body background `#0E1F33` and body text `#EDE8DC`.

#### Palette

| Token | HEX | RGB | HSL | Tailwind Class | Used For |
|---|---|---|---|---|---|
| `blueprint-bg` | `#0E1F33` | `14, 31, 51` | `213°, 58%, 16%` | `bg-blueprint-bg` | Page background (body), full-bleed surfaces, input fields, inner sheet cells. Never use pure black. |
| `blueprint-surface` | `#16283F` | `22, 40, 63` | `213°, 46%, 17%` | `bg-blueprint-surface` | Card / panel fill, dashboard widget fill, modal surface, mobile menu background. |
| `blueprint-grid` | `#6E93B7` | `110, 147, 183` | `210°, 33%, 57%` | `text-blueprint-grid`, `border-blueprint-grid` | Drawing grid lines, hairlines, borders, dividers, schematic node strokes. Never as body text. |
| `blueprint-brass` | `#C9A15D` | `201, 161, 93` | `36°, 46%, 58%` | `text-blueprint-brass`, `bg-blueprint-brass`, `border-blueprint-brass` | Accent — focus ring, primary CTA fill, sheet numbers, current-state badges, top-edge accents, the entire "interactive" language. |
| `blueprint-paper` | `#EDE8DC` | `237, 232, 220` | `40°, 38%, 90%` | `text-blueprint-paper` | Primary text. Warm cream. Never pure white. |
| `blueprint-muted` | `#9FB0C4` | `159, 176, 196` | `210°, 25%, 70%` | `text-blueprint-muted` | Secondary text, captions, sheet numbers (when passive), date ranges, KPI labels, sheet-type labels. |

#### Hover / Off-state Brass

| Token | HEX | Use |
|---|---|---|
| `blueprint-brass-hover` | `#d8b06a` | Hover color of `bg-blueprint-brass` primary button. Hardcoded inline (not a Tailwind token). |
| `blueprint-brass-glow` | `rgba(201,161,93,0.5)` | 24px outer shadow on primary button hover (`shadow-[0_0_24px_-4px_rgba(201,161,93,0.5)]`). |

#### Opacity Modifiers (used everywhere)

All structural colors appear at these opacities:

| Modifier | Hex (computed) | Typical Use |
|---|---|---|
| `/5` | `~13%` | Subtle surface fills, modals inner cells. |
| `/10` | `~25%` | Drafting-paper background grid lines, ambient glows, selected row tint. |
| `/12` | `~30%` | Dashboard widget border. |
| `/15` | `~38%` | Row dividers, table dividers, stat cell separators. |
| `/20` | `~50%` | Card / sheet outer border, header bottom border. |
| `/25` | `~63%` | Input border, tag pill border. |
| `/30` | `~75%` | Stronger input / card border, modal border. |
| `/40` | `~100%` (ish) | Secondary button border, active state. |
| `/50` | `~60%` | Decorative hairlines, schematic node stroke. |
| `/60` | `~70%` | Status icon dim (e.g. WiFi/Volume). |
| `/70` | `~80%` | Body micro copy, coordinate label. |
| `/80` | `~90%` | Strong micro copy, brass in inactive chip. |

#### Status Colors (sparingly)

| Token | Value | Use |
|---|---|---|
| Error text | `red-400/80` | Inline form validation messages. |
| Error border | `red-400/60` | Error input border, error banner. |
| Error surface | `red-500/10` to `red-500/20` | Error banner background. |
| Error text on banner | `red-200` | Admin login error banner body text. |
| Success / positive delta | `green-400` | "ALL SYSTEMS OPERATIONAL" ping, KPI up-arrows, Battery/Security indicators. |

#### Background Grid Line

| Token | Value |
|---|---|
| Grid line color | `rgba(110, 147, 183, 0.10)` (10% of `blueprint-grid`) |
| Fine grid line color | `rgba(110, 147, 183, 0.06)` (6% of `blueprint-grid`) |
| Grid cell size | `48px × 48px` (body + `.bp-grid`) |
| Background attachment | `fixed` |

### 1.2 Typography Tokens

#### Families (Google Fonts via `index.html`)

| Family | Weights Loaded | CSS Class | Used For |
|---|---|---|---|
| IBM Plex Sans | 300, 400, 500, 600 | `font-sans` (default) | Body copy, long-form descriptions, lead paragraphs, form body, modal descriptions. |
| IBM Plex Mono | 400, 500, 600, 700 | `font-mono` | All UI chrome: eyebrows, sheet numbers, nav links, button labels, BOM tags, badges, captions, axis labels, KPI values. |

Antialiasing: `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;` set on `body`.

#### Type Scale (every text style in the project)

| Style Name | Class | Size | Weight | Line-Height | Tracking | Color | Use |
|---|---|---|---|---|---|---|---|
| **Eyebrow** | `font-mono text-[11px] tracking-annotation` | 11px | 400 (default) | normal | `0.18em` (annotation) | `blueprint-muted` | Section pre-titles: "DRAWING SET — PROJECT INDEX", "CAREER LOG". Prefixed by an 8px brass hairline. |
| **Eyebrow Strong** | `font-mono text-[11px] tracking-annotation` | 11px | 600 | normal | `0.18em` | `blueprint-paper` | "ALL SYSTEMS OPERATIONAL" footer status. |
| **H1 Hero** | `font-mono text-4xl sm:text-5xl lg:text-6xl font-bold` | 36 / 48 / 60px | 700 | 1.08 (`leading-[1.08]`) | normal | `blueprint-paper` (with one `blueprint-brass` span) | Hero only. |
| **H2 Section** | `font-mono text-3xl sm:text-4xl font-bold` | 30 / 36px | 700 | normal | normal | `blueprint-paper` | "Projects", "What I Build", "Revision History", "Results", "Bill of Materials". |
| **H3 Sheet** | `font-mono text-2xl font-bold` | 24px | 700 | normal | normal | `blueprint-paper` | Project case-study titles. |
| **H3 Modal** | `font-mono text-lg font-semibold` | 18px | 600 | normal | normal | `blueprint-paper` | "Select a Date & Time", "Your Details". |
| **H3 Modal Confirm** | `font-mono text-xl font-semibold` | 20px | 600 | normal | normal | `blueprint-paper` | "Consultation Booked" success state. |
| **H3 Resume / Panel** | `font-mono text-xl font-semibold` | 20px | 600 | normal | normal | `blueprint-paper` | "Full Resume" panel heading. |
| **Card Title** | `font-mono text-xl font-semibold` | 20px | 600 | normal | normal | `blueprint-paper` | Capability panel titles ("AI Automation"). |
| **Sheet Row Title** | `font-mono text-[15px] font-semibold` | 15px | 600 | normal | normal | `blueprint-paper` (hover → `blueprint-brass`) | Sheet index title column. |
| **Rev Row Title** | `font-mono text-[15px] font-semibold` | 15px | 600 | normal | normal | `blueprint-paper` | Revision log role column. |
| **Lead Body** | `font-sans text-lg leading-relaxed` | 18px | 400 (default) | relaxed (~1.625) | normal | `blueprint-muted` | Hero description, Closing description. |
| **Body** | `font-sans text-[15px] leading-relaxed` | 15px | 400 | relaxed | normal | `blueprint-muted` | Capability panel body. |
| **Body Small** | `font-sans text-[14px] leading-relaxed` | 14px | 400 | relaxed | normal | `blueprint-muted` | Sheet quadrant copy, modal body, form helper text. |
| **Body Smaller** | `font-sans text-[13px]` | 13px | 400 | normal | normal | `blueprint-muted` | "Full detail available in the downloadable resume below." footnote. |
| **Micro Caption** | `font-mono text-[10px] tracking-annotation` | 10px | 400 | normal | `0.18em` | `blueprint-muted/70` to `/80` | Table column headers, schematic title block, footer items, coordinate label. |
| **Sheet No. Number** | `font-mono text-[13px] font-semibold` | 13px | 600 | normal | normal | `blueprint-brass` | "01"–"09" sheet index column. |
| **Sheet Type Label** | `font-mono text-[11px] tracking-annotation` | 11px | 400 | normal | `0.18em` | `blueprint-muted` (or `blueprint-brass/80` in case-study) | "Business OS", "Automation", etc. |
| **Quadrant Label** | `font-mono text-[10px] tracking-annotation` | 10px | 400 | normal | `0.18em` | `blueprint-brass/80` | "PROBLEM" / "SOLUTION" / "STACK" / "RESULT" inside the case-study grid. |
| **BOM Tag** | `font-mono text-[12px]` | 12px | 400 | normal | normal | `blueprint-paper/90` | Skill tags inside BOM cells. |
| **BOM Category** | `font-mono text-[11px] tracking-annotation` | 11px | 400 | normal | `0.18em` | `blueprint-muted` | "Frontend", "Backend & DB", etc. |
| **Time Slot Chip** | `font-mono text-[11px]` | 11px | 400 | normal | normal | `blueprint-muted` (selected → `blueprint-brass`) | "9:00 AM EST", etc. |
| **Selected Slot Chip** | `font-mono text-[11px]` | 11px | 400 | normal | normal | `blueprint-brass` | Date+time pill in Step 2 of BookCallModal. |
| **Field Label** | `font-mono text-[11px] tracking-annotation` | 11px | 400 | normal | `0.18em` | `blueprint-muted` | "DATE", "TIME SLOT", "NAME", "EMAIL", "COMPANY", "PROJECT TYPE", "MESSAGE". |
| **Field Error** | `font-mono text-[10px]` | 10px | 400 | normal | normal | `red-400/80` | Inline form error text. |
| **Sheet Quadrant Body** | `font-sans text-[14px] leading-relaxed` | 14px | 400 | relaxed | normal | `blueprint-muted` | All four quadrants of a case study. |
| **Side Note** | `font-sans text-[12px] italic leading-relaxed` | 12px | 400 italic | relaxed | normal | `blueprint-muted/60` | Parenthetical side note in revision log (e.g. "Concurrently ran Coin Arabia FZE…"). |
| **Sub Line** | `font-mono text-[11px]` | 11px | 400 | normal | normal | `blueprint-muted/70` | "Client site: Aramex, Dubai." sub line. |
| **Date Range** | `font-mono text-[12px]` | 12px | 400 | normal | normal | `blueprint-muted` | "2023–Present" column. |
| **Footer Item** | `font-mono text-[11px] tracking-annotation` | 11px | 400 | normal | `0.18em` | `blueprint-muted/70` | "© 2026 ANAN ALMASRI", "DRAWING NO. AA-001". |
| **Modal Eyebrow** | `text-sm uppercase tracking-[0.34em]` | 14px | 400 | normal | `0.34em` | `blueprint-brass/80` to `/90` | "Admin Login", "OUTPUT — FULL SPEC" in resume panel. |
| **Modal H2** | `text-2xl font-semibold` | 24px | 600 | normal | normal | `blueprint-paper` | "Secure access" in AdminLoginModal. |
| **Schematic Title** | `font-mono text-[10px] tracking-annotation` | 10px | 400 | normal | `0.18em` | `blueprint-muted/80` to `/70` | "FIG.01 — AUTOMATION FLOW", "SCALE 1:1", "REV 2025.01", "DRAWN BY: A.A.". |
| **Schematic Node Label** | `font-mono` `fontSize="9"` | 9px | 400 | normal | `0.5` | `#EDE8DC` | "WEBHOOK", "ROUTER", etc. |
| **Schematic Node Sub** | `font-mono` `fontSize="7"` | 7px | 400 | normal | normal | `#9FB0C4` | "trigger", "branch", etc. |
| **Schematic Annotation** | `font-mono` `fontSize="8"` | 8px | 400 | normal | `0.5` | `#C9A15D` | "τ ≈ 320ms", "pgvector", "async". |

#### Custom Spacing

| Token | Value | Use |
|---|---|---|
| `tracking-annotation` | `0.18em` | All all-caps mono labels (the only custom tracking value). |

### 1.3 Spacing & Sizing Tokens

| Token | px | Tailwind | Use |
|---|---|---|---|
| Container max-width (marketing) | 1280px | `max-w-7xl` | All marketing sections. |
| Container max-width (dashboard) | 1152px | `max-w-6xl` | Standalone dashboard wrapper. |
| Container max-width (closing) | 768px | `max-w-3xl` | Closing CTA centered block. |
| Container horizontal padding (mobile) | 24px | `px-6` | All sections. |
| Container horizontal padding (desktop) | 40px | `md:px-10` | All sections. |
| Section vertical padding (mobile) | 96px | `py-24` | Hero, sections. |
| Section vertical padding (desktop) | 128px | `md:py-32` | Hero, sections. |
| Closing vertical padding (mobile) | 112px | `py-28` | Closing section. |
| Closing vertical padding (desktop) | 144px | `md:py-36` | Closing section. |
| Card / sheet padding (small) | 32px | `p-8` | Case study sheets, output panel. |
| Card / sheet padding (large) | 40px | `md:p-10` | Case study sheets. |
| Quadrant cell padding (small) | 24px | `p-6` | Case study quadrant cells. |
| Quadrant cell padding (large) | 28px | `md:p-7` | Case study quadrant cells. |
| Button padding | 24px × 12px | `px-6 py-3` | Standard primary/secondary button. |
| Button padding (hero) | 28px × 14px | `px-7 py-3.5` | Hero CTA. |
| Top nav padding | 24px × 16px | `px-6 py-4` mobile, `md:px-10` desktop | Navbar inner nav. |
| Section eyebrow gap | 8px wide | `w-8 h-px` | Brass hairline before eyebrow text. |
| Section eyebrow gap-to-text | 12px | `gap-3` | Between hairline and eyebrow text. |
| Mobile menu list item padding | 16px vertical | `py-4` | Each link in mobile overlay. |
| Brass top-edge strip | 2px tall | `h-[2px]` | Top edge of sheets and output panel. |
| Brass top-edge strip (BOM) | 1px tall × 40px wide | `h-px w-10` | Top tick on each BOM cell. |
| Brass corner tick (sheet) | 12px square | `h-3 w-3` | Top-right + bottom-left of sheet cards. |
| Grid unit (body) | 48px | `48px 48px` | Drafting-paper background. |
| Grid unit (fine, in-modal) | 48px @ 6% alpha | `48px 48px` | `.bp-grid-fine`. |
| Schematic viewBox | 800 × 220 | inline SVG | The animated workflow diagram. |
| Tick mark size | 14px | default | `TickMarks` component prop `size=14`. |
| Status dot (footer) | 6px | `h-1.5 w-1.5` | Brass square next to "ALL SYSTEMS OPERATIONAL". |
| Check icon (CURRENT badge) | 10px | inline | `strokeWidth={2.5}`. |
| Check icon (Step 3 confirm) | 24px | inline | Round brass-bordered circle around check. |
| Step indicator bar (BookCall) | 1px tall | `h-1` | The 1/2/3 progress bar. |
| Time slot grid gap | 8px | `gap-2` | 3-column slot grid. |
| StatCell padding | 24px | `p-6` | Stat cell. |
| Card border thickness (BOM) | 1px | `border` | Hairline grid. |
| Card border thickness (sheet) | 1px | `border` | Sheet outer border. |
| Dashboard widget radius | 16px | `rounded-2xl` | Widgets & modals. |
| Dashboard app icon radius | 16px | `rounded-2xl` | App icon tile. |
| Dashboard app icon size | 56–64px | `h-14 w-14 lg:h-16 lg:w-16` | App icon tile. |
| Dashboard start menu width | 360px | `w-[360px]` | Start menu popover. |
| Dashboard context menu width | 192px | `w-48` | Right-click menu. |
| Dashboard taskbar height (mobile) | 56px | `h-14` | Bottom bar. |
| Dashboard taskbar height (desktop) | 64px | `lg:h-16` | Bottom bar. |
| Dashboard app icon (taskbar) | 40–44px | `h-10 w-10 lg:h-11 lg:w-11` | Pinned dock icon. |
| Dashboard app icon (desktop) | 88px wide | `w-[88px]` | Desktop icon block. |

### 1.4 Radius, Border & Shadow Tokens

| Token | Value | Tailwind | Use |
|---|---|---|---|
| Radius — Card / Sheet | 0 (sharp) | none | Marketing sheets and panels have no rounded corners. They are rectangles. |
| Radius — Input | 4px | `rounded` (default 0.25rem) | All form fields. |
| Radius — Tag chip | 2px | `rounded-sm` | BOM skill tags, status badges. |
| Radius — Dashboard widget | 16px | `rounded-2xl` | AnanOS widgets, modals, panels. |
| Radius — Dashboard app tile | 16px | `rounded-2xl` | App icon background. |
| Radius — Stat icon | 12px | `rounded-xl` | Inside StatCell. |
| Radius — Confirm check | full | `rounded-full` | Round confirmation check ring. |
| Border weight | 1px | `border` | All structural borders. |
| Border weight (accent) | 2px | `border-2` or `h-[2px]` | Brass top edge, brass left edge. |
| Shadow (none on marketing) | — | none | Marketing site intentionally has no box-shadows. The only "depth" comes from borders. |
| Shadow — button hover (primary) | `0 0 24px -4px rgba(201,161,93,0.5)` | `shadow-[0_0_24px_-4px_rgba(201,161,93,0.5)]` | 24px soft brass glow on primary CTA hover. |
| Shadow — modal (Admin) | `0 25px 50px -12px rgb(0 0 0 / 0.25)` | `shadow-2xl` | AdminLoginModal panel. |
| Shadow — modal (BookCall) | `0 20px 25px -5px rgb(0 0 0 / 0.1)` | `shadow-xl` | BookCallModal panel. |
| Shadow — dashboard widget | `0 25px 50px -12px rgb(0 0 0 / 0.25)` | `shadow-2xl shadow-black/20` | Modal panel. |
| Shadow — app icon | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | `shadow-lg` → `shadow-xl` (hover) | App tile. |
| Backdrop — modal (BookCall) | `bg-blueprint-bg/85 backdrop-blur-sm` | — | Modal overlay. |
| Backdrop — modal (Admin) | `bg-black/45` | — | AdminLoginModal overlay. |

### 1.5 Motion Tokens

| Token | Value | Use |
|---|---|---|
| Easing — default enter | `easeOut` | All UI motion. |
| Easing — schematic | `easeInOut` | The path draw. |
| Easing — hero | `[0.22, 1, 0.36, 1]` (out-expo) | Hero title fade-up. |
| Duration — fade-up | 0.5–0.6s | Section headers, hero text. |
| Duration — stagger row | 0.4–0.45s per item, 0.04–0.1s stagger | Tables, sheet index, BOM. |
| Duration — modal enter | 0.18–0.2s | Modals. |
| Duration — schematic line | 0.5s | Edge draw. |
| Duration — schematic node | 0.35s | Node pop-in. |
| Duration — tick marks | 0.6s | TickMarks fade-in. |
| Stagger — mobile menu | `0.08 + i * 0.06` | Navbar mobile overlay items. |
| Reduced motion guard | All initial/transition skipped when `prefers-reduced-motion: reduce` | See `useReducedMotion`. |
| CSS fallback | All animations `0.001ms` and scroll-behavior `auto` | `src/index.css` media query. |

### 1.6 Z-Index & Opacity Tokens

| Layer | z-index | Component |
|---|---|---|
| Header / Navbar | `z-50` | Fixed top nav. |
| Mobile menu overlay | `z-[60]` | Full-screen menu. |
| Start menu (dashboard) | `z-50` | Slide-up start. |
| Context menu (dashboard) | `z-[60]` | Right-click. |
| Taskbar (dashboard) | `z-40` | Bottom dock. |
| BookCallModal overlay | `z-[70]` | Modal. |
| AdminLoginModal overlay | `z-[9999]` | Modal. |
| AdminLoginModal panel | `z-[10000]` | Inside overlay. |

| Opacity value | Token | Use |
|---|---|---|
| 1 | full | All default. |
| 0.10 | `blueprint-grid/10` | Body grid lines. |
| 0.06 | `blueprint-grid/6` | `.bp-grid-fine`. |
| 0.04–0.10 | `blueprint-brass/4` to `/10` | Dashboard ambient glows. |
| 0.5 | hover brass glow | Primary CTA hover. |
| 0.95 | modal panel background | `bg-blueprint-surface/95`. |

---

## 2. Layout & Grid

### Page Grid

- **Desktop:** 12-column implied grid inside a 1280px container with 40px gutters (`px-10`).
- **Mobile:** single column, 24px side padding (`px-6`).
- **Background:** 48px × 48px drafting-paper grid fixed to the body. Visible through the entire marketing site.

### Section Template

```
<section id="…" class="relative bp-grid py-24 md:py-32">
  <div class="relative mx-auto max-w-7xl px-6 md:px-10">
    <TickMarks />
    <motion.div class="mb-14 max-w-2xl">
      <div class="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
        <span class="h-px w-8 bg-blueprint-brass/70" />
        EYEBROW TEXT
      </div>
      <h2 class="font-mono text-3xl font-bold text-blueprint-paper sm:text-4xl">Section Title</h2>
    </motion.div>
    {/* content */}
  </div>
</section>
```

### Card / Sheet Template

```
<motion.article class="relative border border-blueprint-grid/20 bg-blueprint-surface/50 p-8 md:p-10">
  <span class="absolute left-0 top-0 h-[2px] w-full bg-blueprint-brass/70" />  // top brass edge
  <span class="absolute right-3 top-3 h-3 w-3 border-r border-t border-blueprint-brass/50" /> // TL corner tick
  <span class="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-blueprint-brass/50" /> // BR corner tick
  {/* content */}
</motion.article>
```

---

## 3. Breakpoints / Responsive Spec

Tailwind default breakpoints, used as follows:

| Breakpoint | Width | Major Changes |
|---|---|---|
| (base) | < 640px | Mobile: stacked single-column, hamburger nav, 24px side padding, sheet quadrants stack vertically, no tick marks on hero, smaller type. |
| `sm:` | ≥ 640px | BOM grid becomes 2-col. AdminLoginModal inline button row. |
| `md:` | ≥ 768px | Desktop nav appears, table headers visible, sheets render 2×2 quadrants, section padding steps to `py-32`, container padding to `px-10`. |
| `lg:` | ≥ 1024px | TickMarks on hero visible, hero becomes 2-column, dashboard widgets visible, type scales to `text-5xl` / `text-6xl`, BOM grid becomes 3-col. |

### Component-Level Responsive Map

| Component | Mobile | Tablet (md) | Desktop (lg) |
|---|---|---|---|
| Navbar | Hamburger + full-screen overlay menu | Desktop nav links + Admin button | Same as md, larger spacing. |
| Hero | Stacked, schematic below text | Same | 2-column, tick marks appear. |
| Schematic | 100% width | Same | 100% width, viewBox 800×220. |
| WhatIBuild panels | 1 column | 3 columns (`md:grid-cols-3`) | Same. |
| Sheet index table | 2-line row (sheet+title left, type right) | 3-column row (100px / 1fr / 220px) | Same. |
| Case study sheet | Quadrants stacked vertically | 2×2 grid | Same. |
| Revision log | Stacked card (REV / date / role / desc) | 3-column row (60 / 160 / 1fr) | Same. |
| Performance data | Single column stacked | 2-col grid, 3-col row | Same. |
| BOM grid | 1 column | 2 columns | 3 columns. |
| Resume panel | Stacked (text above button) | Side-by-side | Same. |
| Closing | Centered text, single CTA | Same | Larger heading (`md:text-5xl`). |
| Dashboard desktop icons | Visible | Visible | Visible. |
| Dashboard right widgets | Hidden | Hidden | Visible. |
| Dashboard taskbar right | Hidden | Hidden | Visible. |

---

## 4. Component Library

Each component spec lists: file path, all props/state, the literal text it renders, exact pixel/color/typography values, and any motion.

### 4.1 TickMarks

| Property | Value |
|---|---|
| **File** | `src/components/TickMarks.tsx` |
| **Props** | `className?: string` (default `""`), `size?: number` (default `14`), `color?: string` (default `"#6E93B7"`) |
| **State** | None. |
| **Renders** | An `<svg>` filling its parent absolutely, with two pairs of perpendicular hairlines (top-left + bottom-right). |
| **Stroke** | `color`, `strokeWidth: 1`, `vectorEffect: "non-scaling-stroke"`. |
| **Position** | Absolute, fills parent. Parent must be `relative`. |
| **Pointer events** | `pointer-events-none`. |
| **A11y** | `aria-hidden="true"`. |
| **Motion** | Opacity 0 → 1 over 0.6s, `easeOut`. Skipped on reduced motion. |
| **Used in** | Hero (`<TickMarks className="hidden md:block" />`), Hero schematic panel (`<TickMarks />`), WhatIBuild, Projects, Closing. |

### 4.2 Navbar

| Property | Value |
|---|---|
| **File** | `src/components/Navbar.tsx` |
| **Props** | `onAdminClick: () => void` |
| **State** | `scrolled: boolean` (true after 50px scroll), `open: boolean` (mobile menu). |
| **Behavior** | Listens to scroll (`{ passive: true }`). On mobile menu open, sets `body.style.overflow = "hidden"`. Restores on close. |
| **Monogram** | `[ AA ]` — `[` and `]` are `font-mono text-blueprint-grid/70 text-xs select-none`, "AA" is `font-mono text-lg font-semibold tracking-widest text-blueprint-paper`. |
| **Links (literal, desktop)** | Home `#home` · Projects `#projects` · Services `#services` · AnanOS `#ananos` · Experience `#experience` · Contact `#contact` |
| **Link style** | `font-mono text-[13px] tracking-annotation text-blueprint-muted` hover → `text-blueprint-paper`. |
| **Admin button** | `font-mono text-[13px] tracking-annotation text-blueprint-brass border border-blueprint-brass/60 px-4 py-2` hover → `bg-blueprint-brass/10 border-blueprint-brass`. Label: "Admin Login". |
| **Scrolled style** | `bg-blueprint-surface/90 backdrop-blur-sm border-b border-blueprint-grid/20`. |
| **Top style** | `bg-transparent border-b border-transparent`. |
| **Transition** | `transition-colors duration-300`. |
| **Mobile menu button** | `Menu` icon (lucide), `size=22`, `text-blueprint-paper`. `aria-label="Open menu"`. |
| **Mobile overlay** | `fixed inset-0 z-[60] bg-blueprint-bg`. Fade in 0.25s. |
| **Mobile menu items** | Each link is a `block border-b border-blueprint-grid/15 py-4 font-mono text-2xl text-blueprint-paper`. Prefixed with `0X` brass number `text-blueprint-brass text-sm`. Items animate in with stagger 0.06s, delay 0.08s. |
| **Mobile Admin button** | Inside menu. `border border-blueprint-brass px-4 py-3 text-center font-mono tracking-annotation text-blueprint-brass w-full`. Label: "Admin Login". |
| **Z-index** | `z-50` (header), `z-[60]` (overlay). |

### 4.3 Hero + Schematic

#### Hero (file: `src/components/Hero.tsx`)

| Section | Spec |
|---|---|
| Section element | `<section id="home" class="relative bp-grid overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">` |
| Container | `relative mx-auto max-w-7xl px-6 md:px-10` |
| Grid | `grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16` |
| TickMarks | `<TickMarks className="hidden md:block" />` (desktop only) |
| Eyebrow | "SYSTEM SPEC — AUTOMATION ENGINEER — MIAMI, FL". `font-mono text-[11px] tracking-annotation text-blueprint-muted`. Prefixed with `<span class="h-px w-8 bg-blueprint-brass/70" />`. |
| H1 | "I design systems." (line 1, `text-blueprint-paper`). `<br/>`. "Now they're digital." (line 2, `text-blueprint-brass`). |
| H1 class | `font-mono text-4xl font-bold leading-[1.08] text-blueprint-paper sm:text-5xl lg:text-6xl` |
| Lead body | "I'm Anan Almasri — a full-stack AI automation engineer building automated AI infrastructure end to end: n8n workflows, Supabase backends, and self-hosted AI agents that run without babysitting." |
| Lead class | `mt-7 max-w-xl font-sans text-lg leading-relaxed text-blueprint-muted` |
| CTA container | `mt-9 flex flex-wrap items-center gap-4` |
| CTA 1 (primary) | "Book a Consultation" + `ArrowUpRight` icon. `bg-blueprint-brass px-6 py-3 font-mono text-sm tracking-annotation text-blueprint-bg hover:bg-[#d8b06a] hover:shadow-[0_0_24px_-4px_rgba(201,161,93,0.5)]`. Icon `size=16` translates +0.5/-0.5 on group hover. |
| CTA 2 (secondary) | "Download Resume" + `Download` icon (`size=15`). `border border-blueprint-grid/40 px-6 py-3 font-mono text-sm tracking-annotation text-blueprint-paper hover:border-blueprint-paper/70`. Links to `/AnanAlmasri.pdf`, `target="_blank" rel="noreferrer" download`. |
| Coordinate | "25.7617° N · 80.1918° W". `mt-12 font-mono text-[10px] tracking-annotation text-blueprint-muted/60`. |
| Schematic panel | `relative rounded-lg border border-blueprint-grid/15 bg-blueprint-surface/40 p-5 md:p-7`. Contains `<TickMarks />` + `<Schematic />`. |
| Motion — text | Staggered fade-up: 0.05s eyebrow → 0.15s h1 → 0.3s lead → 0.45s CTAs → 0.6s coord. Duration 0.6s. Easing `[0.22, 1, 0.36, 1]`. |
| Motion — schematic | Fade-up 0.7s, delay 0.2s. |

#### Schematic (file: `src/components/Schematic.tsx`)

| Property | Value |
|---|---|
| Container | `<div class="relative w-full">` |
| Title block (top) | `mb-4 flex items-center justify-between font-mono text-[10px] tracking-annotation text-blueprint-muted/80`. Left: "FIG.01 — AUTOMATION FLOW". Right: "SCALE 1:1". |
| SVG | `viewBox="0 0 800 220"`, `class="w-full h-auto"`, `aria-label="Automation workflow schematic"`. |
| Sub-grid | `<pattern id="bp-fine" width="20" height="20">`, stroke `#6E93B7`, opacity 0.08, weight 0.5. |
| Border frame | `<rect x="8" y="8" width="784" height="204" stroke="#6E93B7" strokeOpacity="0.18" strokeWidth="1" />` |
| **Nodes (6)** | `WEBHOOK/trigger (70,90)`, `ROUTER/branch (230,90)`, `AI AGENT/llm (400,50)`, `SUPABASE/db (400,150)`, `TRANSFORM/shape (570,50)`, `NOTIFY/slack (720,100)` |
| Node body | `<rect>` 68×32, x=`n.x-34`, y=`n.y-16`, `rx="3"`, `fill="#16283F"`, `stroke="#6E93B7"`, `strokeOpacity="0.5"`, `strokeWidth="1"`. |
| Node ports | 2 × `<circle r="2" fill="#C9A15D">` at left and right of node. |
| Node label | `fontSize="9" fill="#EDE8DC" letterSpacing="0.5"`. |
| Node sub | `fontSize="7" fill="#9FB0C4"`. |
| **Edges (6)** | Orthogonal paths: `M ax ay L midX ay L midX by L bx by`. Stroke `#6E93B7`, opacity 0.55, weight 1.25, linecap square. |
| **Annotations (3)** | `AI AGENT` → "τ ≈ 320ms" at (dx:18, dy:-34). `SUPABASE` → "pgvector" at (dx:18, dy:38). `NOTIFY` → "async" at (dx:-86, dy:-28). Leader line dashed brass (2,2) with cross-tick and text. |
| Title block (bottom) | "REV 2025.01" (left) · "DRAWN BY: A.A." (right). `mt-3 flex items-center justify-between font-mono text-[10px] tracking-annotation text-blueprint-muted/70`. |
| Motion | Lines: 0.5s `pathLength: 0→1`, stagger 0.18s. Nodes: 0.35s `opacity + scale: 0.85→1`, delay = `nodeBase + lastIncomingEdge * 0.18 + 0.3`. Annotations: 0.4s opacity, delay = `nodeDelay + 0.25`. All skipped on reduced motion. |

### 4.4 WhatIBuild / Capability Panels

| Property | Value |
|---|---|
| **File** | `src/components/WhatIBuild.tsx` |
| **Section** | `<section id="services" class="relative bp-grid py-24 md:py-32">` |
| **Eyebrow** | "SECTION 02 — CAPABILITIES" |
| **Heading** | "What I Build" |
| **Grid** | `grid gap-px bg-blueprint-grid/15 md:grid-cols-3` |
| **Panel** | `group relative bg-blueprint-bg p-8 md:p-10` |
| **Brass left edge** | `absolute left-0 top-0 h-full w-[2px] bg-blueprint-brass/25` hover → `bg-blueprint-brass`. |
| **Corner tick** | `absolute right-3 top-3 h-3 w-3 border-r border-t border-blueprint-grid/30` hover → `border-blueprint-brass/60`. |
| **Index** | `font-mono text-[11px] tracking-annotation`. `01`/`02`/`03` in `text-blueprint-brass`. `/03` in `text-blueprint-grid/50`. |
| **Title** | `font-mono text-xl font-semibold text-blueprint-paper` |
| **Body** | `mt-4 font-sans text-[15px] leading-relaxed text-blueprint-muted` |
| **Motion** | `whileInView` fade-up, 0.5s, stagger 0.1s. |
| **Literal copy (panels)** |  |
| 01 | Title: "AI Automation". Body: "Event-driven n8n workflows that connect triggers, AI agents, and APIs into reliable pipelines — replacing repetitive ops work with systems that run themselves." |
| 02 | Title: "Full-Stack Systems". Body: "Supabase-backed applications with typed APIs, auth, and row-level security — production architectures that scale from prototype to real users without rewrites." |
| 03 | Title: "Self-Hosted Infrastructure". Body: "Self-hosted AI agents and tooling deployed on your own hardware — keeping data, models, and compute under your control instead of a third-party's." |

### 4.5 SheetIndex / Project Table

| Property | Value |
|---|---|
| **File** | `src/components/SheetIndex.tsx` |
| **Wrapper** | `border-t border-blueprint-grid/20` |
| **Header (desktop only)** | `hidden md:grid grid-cols-[100px_1fr_220px] gap-6 border-b border-blueprint-grid/20 py-3 font-mono text-[10px] tracking-annotation text-blueprint-muted/70` |
| **Header columns** | "SHEET NO." · "TITLE" · "TYPE" |
| **List** | `<ol class="divide-y divide-blueprint-grid/15">` |
| **Row (desktop)** | `hidden md:grid grid-cols-[100px_1fr_220px] gap-6 items-baseline` |
| **Row (mobile)** | `md:hidden flex items-baseline justify-between gap-3` |
| **Sheet number cell** | `font-mono text-[13px] font-semibold text-blueprint-brass` |
| **Title cell** | `font-mono text-[15px] font-semibold text-blueprint-paper` hover → `text-blueprint-brass` |
| **Type cell** | `font-mono text-[11px] tracking-annotation text-blueprint-muted` |
| **Row link** | `href="#sheet-{sheetNo}"`, `class="group block py-4 md:py-5 transition-colors duration-200"` |
| **Motion** | `whileInView` fade-up 0.4s, stagger 0.06s. |
| **Data source** | `projects` from `src/data/projectsData.ts` (9 sheets). |

### 4.6 CaseStudySheet / Drawing Sheet

| Property | Value |
|---|---|
| **File** | `src/components/CaseStudySheet.tsx` |
| **Element** | `<motion.article id="sheet-{sheetNo}" class="relative scroll-mt-24 border border-blueprint-grid/20 bg-blueprint-surface/50 p-8 md:p-10">` |
| **Brass top edge** | `<span class="absolute left-0 top-0 h-[2px] w-full bg-blueprint-brass/70" />` |
| **Corner ticks** | top-right + bottom-left, 12px, `border-brass/50` |
| **Sheet label** | `mb-2 font-mono text-[11px] tracking-annotation text-blueprint-muted` — "SHEET {sheetNo}" |
| **Title** | `font-mono text-2xl font-bold text-blueprint-paper` |
| **Type** | `mt-1.5 font-mono text-[11px] tracking-annotation text-blueprint-brass/80` |
| **Quadrant grid** | `mt-8 grid grid-cols-1 gap-px bg-blueprint-grid/15 md:grid-cols-2` |
| **Quadrant cell** | `bg-blueprint-bg/40 p-6 md:p-7` |
| **Quadrant label** | `mb-3 font-mono text-[10px] tracking-annotation text-blueprint-brass/80` — "PROBLEM" / "SOLUTION" / "STACK" / "RESULT" |
| **Quadrant body** | `font-sans text-[14px] leading-relaxed text-blueprint-muted` |
| **Motion** | `whileInView` fade-up 0.5s, delay `(index % 2) * 0.05`. |
| **Data shape** | `{ sheetNo, title, type, problem, solution, stack, result }` |

### 4.7 RevisionLog / Career Table

| Property | Value |
|---|---|
| **File** | `src/components/Experience.tsx` (Part 1) |
| **Wrapper** | `border-t border-blueprint-grid/20` |
| **Header (desktop)** | `hidden md:grid grid-cols-[60px_160px_1fr] gap-6 border-b border-blueprint-grid/20 py-3 font-mono text-[10px] tracking-annotation text-blueprint-muted/70` |
| **Header columns** | "REV" · "DATE RANGE" · "ROLE / DESCRIPTION" |
| **List** | `<ol class="divide-y divide-blueprint-grid/15">` |
| **Row class** | `group relative py-6 md:py-7` |
| **Left-edge hover** | `absolute left-0 top-1/2 hidden h-6 w-[2px] -translate-y-1/2 bg-blueprint-brass/0 group-hover:bg-blueprint-brass/60 md:block` |
| **Desktop row** | `hidden md:grid grid-cols-[60px_160px_1fr] gap-6 items-start` |
| **REV cell** | `font-mono text-sm font-semibold text-blueprint-brass` |
| **Date cell** | `font-mono text-[12px] text-blueprint-muted` |
| **Role title** | `font-mono text-[15px] font-semibold text-blueprint-paper` |
| **CURRENT badge** | `inline-flex items-center gap-1 rounded-sm border border-blueprint-brass/40 bg-blueprint-brass/10 px-1.5 py-0.5 font-mono text-[9px] tracking-annotation text-blueprint-brass` + `Check` icon `size=10 strokeWidth=2.5` |
| **Sub line** | `mt-1 font-mono text-[11px] text-blueprint-muted/70` (e.g. "Client site: Aramex, Dubai.") |
| **Description** | `mt-2 font-sans text-[14px] leading-relaxed text-blueprint-muted` |
| **Side note** | `mt-3 border-l border-blueprint-grid/20 pl-4 font-sans text-[12px] italic leading-relaxed text-blueprint-muted/60` |
| **Mobile row** | Stacked: REV/CURRENT row, date, role, sub, desc, side. Same typography but stacked. |
| **Motion** | `whileInView` fade-up 0.45s, stagger 0.1s. |
| **Data (revisions array, 10 items)** | See §7. |

### 4.8 PerformanceData / Results Table

| Property | Value |
|---|---|
| **File** | `src/components/Experience.tsx` (Part 2) |
| **Header (desktop)** | `hidden md:grid grid-cols-[1fr_140px_1fr] gap-6 border-t border-b border-blueprint-grid/20 py-3 font-mono text-[10px] tracking-annotation text-blueprint-muted/70` |
| **Header columns** | "METRIC" · "RESULT" · "CONTEXT" |
| **Grid** | `grid grid-cols-1 gap-x-12 md:grid-cols-2` |
| **Row** | `border-b border-blueprint-grid/15 py-5` |
| **Desktop row** | `hidden md:grid grid-cols-[1fr_140px_1fr] gap-6 items-baseline` |
| **Metric** | `font-sans text-[14px] text-blueprint-paper/90` |
| **Result** | `font-mono text-[14px] font-bold text-blueprint-brass` |
| **Context** | `font-sans text-[13px] text-blueprint-muted` |
| **Mobile row** | Stacked: metric / result (brass, `text-[15px]`) / context. |
| **Footer line** | `mt-6 font-sans text-[13px] text-blueprint-muted` — "Full detail available in the downloadable resume below." |
| **Motion** | `whileInView` fade-up 0.4s, stagger `(i % 2) * 0.06 + floor(i/2) * 0.04`. |
| **Data (11 rows)** | See §7. |

### 4.9 BOM / Skills Grid

| Property | Value |
|---|---|
| **File** | `src/components/Experience.tsx` (Part 3) |
| **Grid** | `grid grid-cols-1 gap-px border-t border-l border-blueprint-grid/20 bg-blueprint-grid/10 sm:grid-cols-2 lg:grid-cols-3` |
| **Cell** | `relative border-b border-r border-blueprint-grid/20 bg-blueprint-surface/40 p-6 md:p-7` |
| **Brass top tick** | `absolute left-0 top-0 h-px w-10 bg-blueprint-brass/60` |
| **Category** | `font-mono text-[11px] tracking-annotation text-blueprint-muted` |
| **Tag list** | `flex flex-wrap gap-2` |
| **Tag** | `rounded-sm border border-blueprint-grid/25 bg-blueprint-bg/40 px-2.5 py-1 font-mono text-[12px] text-blueprint-paper/90` |
| **Footer line** | `mt-6 font-sans text-[13px] text-blueprint-muted` — "Bilingual — English & Arabic. MENA market experience." |
| **Data (8 categories)** | See §7. |

### 4.10 ResumePanel

| Property | Value |
|---|---|
| **File** | `src/components/Experience.tsx` (Part 4) |
| **Container** | `relative border border-blueprint-grid/20 bg-blueprint-surface/50 p-8 md:p-12` |
| **Brass top edge** | `absolute left-0 top-0 h-[2px] w-full bg-blueprint-brass/70` |
| **Corner ticks** | 12px brass top-right + bottom-left |
| **Inner row** | `flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between` |
| **Eyebrow** | `mb-3 font-mono text-[11px] tracking-annotation text-blueprint-muted` — "OUTPUT — FULL SPEC" |
| **H3** | `font-mono text-xl font-semibold text-blueprint-paper` — "Full Resume" |
| **Body** | `mt-2 font-sans text-[14px] text-blueprint-muted` — "Complete career history, references, and project archive." |
| **CTA container** | `flex flex-col items-start gap-2 md:items-end` |
| **Primary CTA** | `rounded-sm bg-blueprint-brass px-5 py-3 font-mono text-[12px] font-semibold tracking-annotation text-blueprint-bg hover:bg-blueprint-brass/90` — "Download Full Resume (PDF)" |
| **Updated label** | `font-mono text-[11px] text-blueprint-muted/70` — "Last updated: [DATE]" (placeholder) |

### 4.11 Closing CTA

| Property | Value |
|---|---|
| **File** | `src/components/Closing.tsx` |
| **Section** | `<section id="contact" class="relative bp-grid border-t border-blueprint-grid/15 py-28 md:py-36">` |
| **Container** | `relative mx-auto max-w-3xl px-6 text-center md:px-10` |
| **TickMarks** | Present, full-bleed. |
| **Eyebrow** | "END OF SPEC", centered, with brass hairlines on both sides. `mb-6 inline-flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted`. |
| **H2** | "Let's draft the next system." `font-mono text-3xl font-bold leading-tight text-blueprint-paper sm:text-4xl md:text-5xl` |
| **Lead** | "If you have a process that should run itself, a stack that should scale, or an idea worth engineering — book a consultation and we'll map it out." `mx-auto mt-6 max-w-xl font-sans text-lg text-blueprint-muted` |
| **CTA** | "Book a Consultation" + `ArrowUpRight`. `bg-blueprint-brass px-7 py-3.5 font-mono text-sm tracking-annotation text-blueprint-bg hover:bg-[#d8b06a] hover:shadow-[0_0_24px_-4px_rgba(201,161,93,0.5)]` |
| **Footer line** | "ANAN ALMASRI · MIAMI, FL · 2025". `mt-12 font-mono text-[10px] tracking-annotation text-blueprint-muted/60` |
| **Motion** | `whileInView` fade-up 0.5s. |

### 4.12 Footer

| Property | Value |
|---|---|
| **File** | `src/components/Footer.tsx` |
| **Element** | `<footer class="border-t border-blueprint-grid/15 bg-blueprint-bg py-8">` |
| **Inner** | `mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 font-mono text-[11px] tracking-annotation text-blueprint-muted/70 md:flex-row md:px-10` |
| **Items (literal)** | Left: "© 2026 ANAN ALMASRI". Center: brass 1.5px dot + "ALL SYSTEMS OPERATIONAL". Right: "DRAWING NO. AA-001". |
| **Brass dot** | `<span class="h-1.5 w-1.5 bg-blueprint-brass" />` |

### 4.13 Button — Primary / Secondary / Brass-pill

#### Primary (Filled Brass)

```
className="bg-blueprint-brass px-6 py-3 font-mono text-sm tracking-annotation text-blueprint-bg
           transition-all duration-200 hover:bg-[#d8b06a] hover:shadow-[0_0_24px_-4px_rgba(201,161,93,0.5)]"
```

| Property | Value |
|---|---|
| Background | `blueprint-brass` `#C9A15D` |
| Background (hover) | `#d8b06a` |
| Text | `blueprint-bg` `#0E1F33` |
| Padding | 24 × 12 px |
| Font | `font-mono text-sm tracking-annotation` |
| Hover shadow | `0 0 24px -4px rgba(201,161,93,0.5)` |
| Transition | `transition-all duration-200` |
| Optional icon | `ArrowUpRight`/`ArrowRight`/`Download`, `size=15-16`, with `group-hover:translate-x-0.5 group-hover:-translate-y-0.5` |

#### Secondary (Outlined Grid)

```
className="border border-blueprint-grid/40 px-6 py-3 font-mono text-sm tracking-annotation
           text-blueprint-paper transition-colors duration-200 hover:border-blueprint-paper/70"
```

#### Brass-bordered Pill (Admin)

```
className="font-mono text-[13px] tracking-annotation text-blueprint-brass
           border border-blueprint-brass/60 px-4 py-2
           transition-colors duration-200 hover:bg-blueprint-brass/10 hover:border-blueprint-brass"
```

#### Brass-pill Rounded (Resume / Small CTA)

```
className="rounded-sm bg-blueprint-brass px-5 py-3 font-mono text-[12px] font-semibold
           tracking-annotation text-blueprint-bg transition-colors duration-200 hover:bg-blueprint-brass/90"
```

#### Disabled state (primary)

`disabled:opacity-60 disabled:cursor-not-allowed` on form submit / OTP verify.

### 4.14 Input — Text / Date / Textarea / Select

#### Base

```
className="mt-1 w-full rounded border bg-blueprint-bg px-3 py-2.5
           font-sans text-sm text-blueprint-paper placeholder:text-blueprint-muted/40
           outline-none transition-colors
           border-blueprint-grid/30 focus:border-blueprint-brass"
```

| Property | Value |
|---|---|
| Background | `blueprint-bg` `#0E1F33` |
| Border | 1px `blueprint-grid/30` `#6E93B7 @ 30%` |
| Border (focus) | 1px `blueprint-brass` `#C9A15D` |
| Border (error) | 1px `red-400/60` |
| Text | `blueprint-paper` `text-sm` `font-sans` |
| Placeholder | `blueprint-muted/40` |
| Padding | 12 × 10 px |
| Radius | 4px |

#### Date input (Step 1)

```
className="w-full rounded border bg-blueprint-bg px-4 py-2.5 pl-10 font-mono text-sm text-blueprint-paper
           outline-none transition-colors
           border-blueprint-grid/30 focus:border-blueprint-brass
           [error: border-red-400/60]"
```

Includes left-side `Calendar` icon (`size=16`, `text-blueprint-muted/60`, absolute, `left-3 top-1/2 -translate-y-1/2 pointer-events-none`).

#### Select

Same base as text, but `<select>` with custom chevron-free native dropdown. Options include the project-type choices.

#### Textarea

Same as base + `resize-none` + `rows={3}`.

### 4.15 TimeSlot Chip

| Property | Value |
|---|---|
| Element | `<button type="button">` inside a `grid grid-cols-3 gap-2`. |
| Default | `rounded border border-blueprint-grid/25 px-2 py-2 font-mono text-[11px] text-blueprint-muted hover:border-blueprint-brass/50 hover:text-blueprint-paper` |
| Selected | `border-blueprint-brass bg-blueprint-brass/10 text-blueprint-brass` |
| Disabled | `border-blueprint-grid/10 text-blueprint-muted/30 cursor-not-allowed` |
| Icon | `Clock` icon, `size=10`, `inline mr-1 opacity-60`. |
| Content | 16 generated slots from 9:00 AM EST to 4:00 PM EST in 30-min increments. |
| Disabled logic | Past slots for today are disabled (`isSlotInPast` helper). |
| Selected-slot summary chip (Step 2) | `mb-5 inline-flex items-center gap-2 rounded border border-blueprint-brass/40 bg-blueprint-brass/5 px-3 py-1.5 font-mono text-[11px] text-blueprint-brass` with `Calendar` icon (`size=12`). Shows "{date} · {timeSlot}". |

### 4.16 Status Badge — CURRENT

```
className="inline-flex items-center gap-1 rounded-sm border border-blueprint-brass/40
           bg-blueprint-brass/10 px-1.5 py-0.5
           font-mono text-[9px] tracking-annotation text-blueprint-brass"
```

Icon: `Check` from lucide, `size=10`, `strokeWidth={2.5}`.
Padding: 6 × 2 px.
Radius: 2px.
Label: "CURRENT" (all caps).

### 4.17 BookCallModal

| Property | Value |
|---|---|
| **File** | `src/components/BookCallModal/BookCallModal.tsx` (orchestrator) + `steps.tsx` (Step1/2/3) + `types.ts` (FormData, INITIAL_FORM, WEBHOOK_URL) + `context.tsx` (BookCallProvider, useBookCall) |
| **Mounted via** | `BookCallProvider` in `src/routes/__root.tsx`. `useBookCall()` exposes `openBookCall()` / `closeBookCall()`. |
| **Backdrop** | `fixed inset-0 z-[70] flex items-center justify-center bg-blueprint-bg/85 backdrop-blur-sm p-4` |
| **Panel** | `relative w-full max-w-lg rounded border border-blueprint-grid/30 bg-blueprint-surface bp-grid-fine p-6 shadow-xl overflow-hidden` |
| **Close** | `<button class="absolute right-4 top-4 z-10 text-blueprint-muted/60 hover:text-blueprint-paper">` + `X` icon `size=18`. |
| **Step indicator** | 1px tall × `flex-1` × 3 segments. `s <= step ? bg-blueprint-brass : bg-blueprint-grid/20`. `rounded`. |
| **AnimatePresence mode** | `wait` between steps. |
| **Step 1 (date+time)** | H3 "Select a Date & Time", lead "30-minute consultation — weekdays, 9 AM – 5 PM EST.", date input, 3×8 grid of time slots, error text per field, primary "Next: Your Details" + `ArrowRight`. Animate x: ±20, 0.2s. |
| **Step 2 (details)** | H3 "Your Details", lead "Tell me a bit about your project so I come prepared.", selected-slot chip, fields: NAME (req), EMAIL (req), COMPANY, PROJECT TYPE (select), MESSAGE (textarea, rows 3). Back button (outlined) + "Book Consultation" submit. `Loader2` icon `size=16 animate-spin` while submitting. |
| **Step 3 (confirm)** | Centered. 56px brass-bordered circle with `Check` icon `size=24 text-blueprint-brass`. H3 "Consultation Booked". Lead "Thanks{firstName}! I'll review your request and confirm via email." Selected-slot pill in `blueprint-bg/40`. Primary "Close" button. |
| **Submit** | `POST https://n8n.ananalmasri.com/webhook/submit` with `{ ...form, timestamp: ISO }`. |
| **Validation** | Step 1: date + timeSlot required. Step 2: name + valid email required. |
| **Field component** | `Field label={UPPER} required error={?}` with `<span class="font-mono text-[11px] tracking-annotation text-blueprint-muted">{label}{required && <span class="text-blueprint-brass ml-0.5">*</span>}</span>`. Error: `mt-0.5 font-mono text-[10px] text-red-400/80`. |
| **Time slots (16 total)** | 9:00 AM, 9:30 AM, 10:00 AM, 10:30 AM, 11:00 AM, 11:30 AM, 12:00 PM, 12:30 PM, 1:00 PM, 1:30 PM, 2:00 PM, 2:30 PM, 3:00 PM, 3:30 PM, 4:00 PM EST. |
| **Project type options** | n8n Workflow, AI Agent, Full-Stack App, Consulting / Strategy, Other. |
| **Z-index** | 70 (backdrop). |

### 4.18 AdminLoginModal

| Property | Value |
|---|---|
| **File** | `src/components/AdminLoginModal.tsx` |
| **Props** | `isOpen: boolean`, `onClose: () => void` |
| **State** | `step: "request" \| "verify"`, `otp: string`, `loading: boolean`, `message: string \| null`, `error: string \| null` |
| **Backdrop** | `fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-6`. Fade 0.18s. |
| **Panel** | `w-full max-w-xl rounded-[1.25rem] border border-blueprint-grid/20 bg-blueprint-surface p-8 shadow-2xl shadow-black/20 z-[10000]`. Scale 0.98→1, 0.18s. |
| **Header** | Brass eyebrow: `text-sm uppercase tracking-[0.34em] text-blueprint-brass/90` — "Admin Login". H2: `mt-3 text-2xl font-semibold text-blueprint-paper` — "Secure access". Close: ✕ glyph, `text-blueprint-paper/80 hover:text-blueprint-paper`. `aria-label="Close admin login"`. |
| **Body intro** | `text-sm leading-6 text-blueprint-muted` — "Request a one-time code via Telegram, then enter it below to continue." |
| **Message banner** | `rounded-2xl border border-blueprint-grid/20 bg-blueprint-bg p-4 text-sm text-blueprint-paper` |
| **Error banner** | `rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200` |
| **Step "request"** | Single primary CTA: `rounded-2xl bg-blueprint-brass px-6 py-3 text-sm font-semibold text-blueprint-bg hover:bg-blueprint-brass/90 disabled:opacity-60 disabled:cursor-not-allowed w-full`. Label: "Request OTP" (or "Requesting code..." while loading). |
| **Step "verify"** | Form. OTP input: `mt-2 w-full rounded-2xl border border-blueprint-grid/20 bg-blueprint-bg px-4 py-3 text-sm text-blueprint-paper outline-none focus:border-blueprint-brass`. `placeholder="Enter 6-digit code"`, `inputMode="numeric"`, `autoComplete="one-time-code"`. Two-button row: "Verify code" (primary) + "Request again" (outlined). |
| **Webhook** | `POST https://n8n.ananalmasri.com/webhook/admin-login` with `{action: "request_code" \| "verify_code", code?}`. Env override: `VITE_ADMIN_OTP_WEBHOOK_URL`. |
| **Response shape** | Normalizes `Array[0].json` and `.json` envelopes. Looks for `success: true` (verify) and `success !== false` (request). |
| **Success** | `onClose()` then `navigate({ to: "/dashboard" })` (TanStack Router). |

### 4.19 AnanOS Desktop (Dashboard)

| Property | Value |
|---|---|
| **File** | `src/routes/dashboard/index.tsx` |
| **Route** | `/dashboard/` |
| **Component name** | `AnanOSDesktop` |
| **State** | `time: string`, `date: string`, `mounted: boolean`, `startOpen: boolean`, `search: string`, `showWidgets: boolean`, `selectedIcons: string[]`, `contextMenu: {x,y} \| null` |
| **Clock** | `setInterval(1000)` updates `time` and `date` via `toLocaleTimeString` / `toLocaleDateString` (en-US). |
| **Wallpaper layers** | 1. Diagonal gradient `from-[#080f20]/70 via-[#0c1a35]/70 to-[#040b18]/70`. 2. 5% brass grid `linear-gradient(rgba(201,161,93,.18) 1px, transparent 1px) × 2`, `80px 80px`. 3. Three ambient glows: `rounded-full bg-blueprint-brass/4 blur-[120px]` 500px (top-left), `bg-violet-500/4 blur-[120px]` 500px (bottom-right), `bg-blue-500/2 blur-[100px]` 300×600px (center). 4. 20 floating brass particles 2×2px, `bg-blueprint-brass/10`, animated `float 8-20s ease-in-out infinite`. |
| **Top bar (lg+)** | Left: 6×6 brass-tinted `A` mark + "ANANOS ENTERPRISE" eyebrow. Right: tray icons (Shield=green-400/60, Wifi=muted/60, Volume=muted/60, BatteryFull=green-400/60, Sun=muted/60, all `size=13`), clock tile `rounded-xl border border-blueprint-grid/15 bg-blueprint-surface/40 px-3.5 py-2 backdrop-blur-lg` showing `Clock` icon (`size=13 text-blueprint-brass`) + mono time + date, bell with red badge "3". |
| **App icons (left)** | 15 apps × `w-[88px] flex flex-col items-center gap-2 rounded-2xl p-3 hover:bg-white/[0.06]`. Tile: `h-14 w-14 lg:h-16 lg:w-16 rounded-2xl bg-gradient-to-br {from-color/20 to-color/5} shadow-lg hover:scale-110 hover:shadow-xl` + `absolute inset-0 rounded-2xl border border-white/10` + `app.icon size=28 text-{color}-400 drop-shadow-sm`. Label: `rounded-md px-2 py-0.5 text-center text-[11px] font-medium leading-tight text-blueprint-paper/80` with text-shadow. Each is a `<Link to={app.to}>` with stagger 40ms. |
| **Desktop folders** | 2 items (Financials, Contracts). Same tile style but `from-amber-500/10 to-yellow-500/5`. |
| **Right widgets (lg+)** | 2-col grid. KPI widget (full width, 4 stat cells), System Monitor widget (4 stats with progress bars), Live Activity widget (6 feed items). |
| **KPI widget** | Header: `TrendingUp` icon + "Business Overview" + "View All" button. 4 cells: icon, delta in `text-green-400` (up) or `text-red-400` (down), mono value `text-lg font-bold text-blueprint-paper`, mono label `text-[10px] text-blueprint-muted/70`. |
| **System Monitor** | Header: `Cpu` + "System Monitor". 4 stats (CPU 23%, Memory 5.2GB, Network 48ms, Temp 68°C). Each: icon (emerald/amber/blue/rose), label, mono value, 1.5px progress bar `linear-gradient(90deg, {barColor}99, {barColor}cc)` width=bar%. |
| **Live Activity** | Header: `Activity` + "Live Activity" + green pulse dot. 6 items: 32×32 rounded-xl icon tile, truncated text, mono time `text-[10px] text-blueprint-muted/50`. |
| **Taskbar (bottom, fixed)** | `h-14 lg:h-16 border-t border-white/[0.06] bg-blueprint-surface/80 backdrop-blur-2xl px-4`. Left: Start button `h-10 w-10 rounded-xl` (active = `bg-blueprint-brass/15 text-blueprint-brass shadow-lg shadow-blueprint-brass/10`) + Search button (md+) with `⌘K` kbd. Center: 8 pinned apps `h-10 w-10 lg:h-11 lg:w-11 rounded-xl` with `Icon size=18 text-blueprint-muted hover:text-blueprint-paper hover:scale-110` + active dot indicator `absolute -bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-blueprint-brass/0 group-hover:bg-blueprint-brass/60`. Right (sm+): MessageSquare, Bell, ChevronUp (toggle widgets), clock tile. |
| **Start menu** | `fixed bottom-20 left-4 lg:bottom-[72px] lg:left-6 z-50 w-[360px] origin-bottom-left animate-[fadeIn_0.15s_ease-out] rounded-2xl border border-white/[0.08] bg-blueprint-surface/95 p-4 shadow-2xl shadow-black/60 backdrop-blur-2xl`. Search input (autoFocus), "Pinned" 4-col grid (8 apps), "All Apps" scrollable list (last:max-h-40 scrollbar-thin), footer with user "AA" avatar (32×32 brass gradient) + name/email + Settings/Help/Power icons. |
| **Context menu** | 192px wide. Items: View, Sort by, Refresh, separator, New Folder, New Text File, separator, Display Settings, Personalize. Each: `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-blueprint-muted hover:bg-white/[0.06] hover:text-blueprint-paper`. Icons: `size=13 text-blueprint-muted/60`. |
| **Keyframes** | `fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`. `float { 0%, 100% { translate(0,0) opacity 0; } 25% { opacity 0.3 } 50% { opacity 0.5 } 75% { opacity 0.2 } }`. |
| **Custom scrollbar** | `.scrollbar-thin::-webkit-scrollbar { width: 4px; } track transparent, thumb `rgba(201,161,93,0.15)`. |

#### Dashboard App Roster (15 apps)

| Label | To | Icon | Color | Desc |
|---|---|---|---|---|
| CRM | `/dashboard/crm` | Users | blue-400 | Customer management |
| Operations | `/dashboard/operations` | Briefcase | emerald-400 | Work orders & assets |
| Accounting | `/dashboard/accounting` | Calculator | amber-400 | Finance & ledger |
| HRM | `/dashboard/hrm` | Monitor | violet-400 | Employee management |
| Legal | `/dashboard/legal` | Scale | rose-400 | Cases & compliance |
| Inventory | `/dashboard/inventory` | Package | cyan-400 | Stock & warehouse |
| Projects | `/dashboard/projects` | FolderKanban | orange-400 | Tasks & tracking |
| Analytics | `/dashboard/analytics` | BarChart3 | indigo-400 | Reports & KPIs |
| Mail | `/dashboard/mail` | Mail | blue-400 | Email client |
| Calendar | `/dashboard/calendar` | Calendar | rose-400 | Schedule & events |
| Tasks | `/dashboard/tasks` | ListTodo | emerald-400 | Task management |
| Notes | `/dashboard/notes` | StickyNote | amber-400 | Documentation |
| Drive | `/dashboard/drive` | HardDrive | sky-400 | File storage |
| AI Chat | `/dashboard/ai-chat` | Sparkles | fuchsia-400 | AI assistant |
| Support | `/dashboard/support` | HeadphonesIcon | teal-400 | Help desk |

#### Dashboard Desktop Folders (2)

| Label | Icon | Color | Items |
|---|---|---|---|
| Financials | FolderOpen | emerald-400 | 34 files |
| Contracts | FolderOpen | rose-400 | 28 files |

#### Dashboard System Stats

| Label | Value | Icon | Bar% | Bar Color |
|---|---|---|---|---|
| CPU | 23% | Cpu | 23 | `#34d399` (emerald) |
| Memory | 5.2 GB | HardDrive | 42 | `#fbbf24` (amber) |
| Network | 48 ms | Globe | 15 | `#60a5fa` (blue) |
| Temp | 68°C | Thermometer | 55 | `#fb7185` (rose) |

#### Dashboard KPI Widgets

| Label | Value | Change | Icon | Up? |
|---|---|---|---|---|
| Revenue MTD | $2.4M | +18.2% | DollarSign | yes |
| Active Users | 3,842 | +7.4% | Users | yes |
| Open Tickets | 8 | -3 | MessageSquare | no |
| Tasks Done | 142 | +12 | CheckCircle | yes |

#### Dashboard Activity Feed (6)

| App | Text | Time | Icon | Color |
|---|---|---|---|---|
| CRM | David Kim marked as Hot lead | 2m | Users | blue-400 |
| Drive | Q3_Report.pdf uploaded | 5m | HardDrive | sky-400 |
| AI Chat | Revenue analysis completed | 12m | Sparkles | fuchsia-400 |
| Tasks | SSL certificate renewal done | 18m | ListTodo | emerald-400 |
| Mail | 3 new emails from TechNova | 24m | Mail | blue-400 |
| Projects | API Integration at 90% | 35m | FolderKanban | orange-400 |

---

## 5. Iconography

**Library:** `lucide-react` v0.344.0. MIT, tree-shakable. Default `stroke-width: 2` (tightened to `2.5` only for the small `Check` inside the `CURRENT` badge).

### Icons Used (alphabetical)

| Icon | Component | Size | Notes |
|---|---|---|---|
| `Activity` | Dashboard activity widget | 12 | Eyebrow row. |
| `ArrowLeft` | BookCallModal Step 2 | 16 | Back button. |
| `ArrowRight` | BookCallModal primary CTAs | 16 | "Next" + "Book Consultation". |
| `ArrowUpDown` | Dashboard context menu | 13 | "Sort by" item. |
| `ArrowUpRight` | Hero + Closing primary CTAs | 16 | `group-hover:translate-x-0.5 group-hover:-translate-y-0.5`. |
| `BatteryFull` | Dashboard tray + taskbar | 10–13 | green-400/60 to /80. |
| `Bell` | Dashboard tray | 13–16 | Red dot "3". |
| `Briefcase` | Dashboard Operations app | 28 | emerald-400. |
| `Calculator` | Dashboard Accounting app | 28 | amber-400. |
| `Calendar` | BookCallModal (date picker + selected chip) | 12–16 | Pl-10 spacer. |
| `Check` | CURRENT badge + Step 3 confirm | 10 (badge), 24 (confirm) | `strokeWidth={2.5}` in badge. |
| `CheckCircle` | Dashboard Tasks Done KPI | 14 | emerald-400. |
| `ChevronRight` | (Available, unused) | — | — |
| `ChevronUp` | Dashboard taskbar right | 16 | `rotate-180` when widgets shown. |
| `Clock` | BookCallModal time slot + dashboard clock | 10–13 | brass in dashboard clock. |
| `Close (X)` | BookCallModal + AdminLoginModal | 18 | `text-blueprint-muted/60`. |
| `Cpu` | Dashboard System Monitor | 11–12 | Eyebrow + per-stat. |
| `DollarSign` | Dashboard Revenue KPI | 14 | — |
| `Download` | Hero "Download Resume" | 15 | Inside secondary button. |
| `Edit3` | Dashboard context menu | 13 | "Personalize". |
| `FileText` | Dashboard context menu | 13 | "New Text File". |
| `FolderKanban` | Dashboard Projects app | 28 | orange-400. |
| `FolderOpen` | Dashboard folders + context menu | 13, 28 | amber-500 base. |
| `Globe` | Dashboard Network stat + tray | 11, 13 | blue-400. |
| `HardDrive` | Dashboard Memory stat + Drive app | 11, 28 | sky-400. |
| `HeadphonesIcon` | Dashboard Support app | 28 | teal-400. |
| `HelpCircle` | Dashboard start menu | 15 | "?" |
| `LayoutDashboard` | Dashboard taskbar Start | 18 | — |
| `ListTodo` | Dashboard Tasks app | 28 | emerald-400. |
| `Loader2` | BookCallModal Step 2 submit | 16 | `animate-spin`. |
| `Mail` | Dashboard Mail app | 28 | blue-400. |
| `Menu` | Navbar mobile | 22 | — |
| `MessageSquare` | Dashboard Open Tickets KPI + taskbar | 14, 16 | — |
| `Monitor` | Dashboard HRM app | 28 | violet-400. |
| `Package` | Dashboard Inventory app | 28 | cyan-400. |
| `Power` | Dashboard start menu | 15 | hover → rose-400. |
| `RefreshCw` | Dashboard context menu | 13 | "Refresh". |
| `Scale` | Dashboard Legal app | 28 | rose-400. |
| `Search` | Dashboard taskbar + start menu | 14, 15 | — |
| `Settings` | Dashboard start menu + context menu | 13, 15 | — |
| `Shield` | Dashboard tray | 13 | green-400/60. |
| `Sparkles` | Dashboard AI Chat app | 28 | fuchsia-400. |
| `StickyNote` | Dashboard Notes app | 28 | amber-400. |
| `Sun` | Dashboard tray + context menu | 13 | — |
| `Thermometer` | Dashboard Temp stat | 11 | rose-400. |
| `TrendingUp` | Dashboard KPI eyebrow | 12 | — |
| `Users` | Dashboard CRM app + Active Users KPI | 14, 28 | blue-400. |
| `Volume2` | Dashboard tray | 13 | — |
| `Wifi` | Dashboard tray + taskbar | 10, 13 | — |
| `X` | Navbar mobile close | 22 | — |
| `✕` (text) | AdminLoginModal close | text | Glyph. |
| `BarChart3` | Dashboard Analytics app | 28 | indigo-400. |
| `Bell` | Dashboard bell | 14 | With red dot. |
| `Zap` | (imported, unused) | — | — |
| `Activity` | Dashboard activity widget | 12 | — |
| `FolderOpen` | Desktop folders | 28 | — |
| `FolderOpen` | Context menu | 13 | "New Folder". |

---

## 6. Asset Manifest

| Asset | Path | Used In |
|---|---|---|
| Vite favicon (default) | `/vite.svg` | `<link rel="icon">` in `index.html`. |
| Resume PDF (canonical) | `public/AnanAlmasri.pdf` | Hero "Download Resume" CTA. Path is `/AnanAlmasri.pdf`. |
| Resume PDF (legacy) | `public/resume.pdf` | Present, not currently linked from primary CTA. |
| README placeholder | `public/README.md` | Placeholder, not rendered. |
| Google Fonts (IBM Plex Sans, IBM Plex Mono) | external CDN | Loaded in `index.html` with preconnect. |
| Inline SVG | `src/components/TickMarks.tsx` | Rendered in many components. |
| Inline SVG | `src/components/Schematic.tsx` | Rendered inside Hero. |
| Inline keyframes | `src/routes/dashboard/index.tsx` `<style>` block | Dashboard-only. |

---

## 7. Literal Text Strings (All Copy)

### Navigation (6 links)
- `Home` · `Projects` · `Services` · `AnanOS` · `Experience` · `Contact`
- `Admin Login`

### Hero
- Eyebrow: `SYSTEM SPEC — AUTOMATION ENGINEER — MIAMI, FL`
- H1: `I design systems.`
- H1 span: `Now they're digital.`
- Lead: `I'm Anan Almasri — a full-stack AI automation engineer building automated AI infrastructure end to end: n8n workflows, Supabase backends, and self-hosted AI agents that run without babysitting.`
- CTA 1: `Book a Consultation`
- CTA 2: `Download Resume`
- Coordinate: `25.7617° N · 80.1918° W`

### Schematic
- Top left: `FIG.01 — AUTOMATION FLOW`
- Top right: `SCALE 1:1`
- Bottom left: `REV 2025.01`
- Bottom right: `DRAWN BY: A.A.`
- Nodes: `WEBHOOK / trigger` · `ROUTER / branch` · `AI AGENT / llm` · `SUPABASE / db` · `TRANSFORM / shape` · `NOTIFY / slack`
- Annotations: `τ ≈ 320ms` · `pgvector` · `async`

### What I Build
- Eyebrow: `SECTION 02 — CAPABILITIES`
- H2: `What I Build`
- Index pattern: `01 / 03` · `02 / 03` · `03 / 03`
- Panel 1: `AI Automation` + body
- Panel 2: `Full-Stack Systems` + body
- Panel 3: `Self-Hosted Infrastructure` + body

### Projects
- Eyebrow: `DRAWING SET — PROJECT INDEX`
- H2: `Projects`
- Header columns: `SHEET NO.` · `TITLE` · `TYPE`
- Quadrant labels: `PROBLEM` · `SOLUTION` · `STACK` · `RESULT`
- Per-sheet label: `SHEET {sheetNo}`

#### Project Sheets (9 total)

| # | Title | Type |
|---|---|---|
| 01 | AnanOS | Business OS |
| 02 | Pocket CFO | Financial Dashboard |
| 03 | ANORA | Automation |
| 04 | RAQEEB | Contract AI |
| 05 | SignDeal | E-Signature |
| 06 | EatSafe | Consumer App |
| 07 | Baiti.ai | PropTech Marketplace |
| 08 | Mizaan | Business OS |
| 09 | Multi-Agent Build System | Dev Infrastructure |

Full problem/solution/stack/result copy for each sheet lives in `src/data/projectsData.ts`.

### Experience — Revision History

| Rev | Date | Role | Description |
|---|---|---|---|
| 10 | 2023–Present | Founder & AI Automation Consultant, Anan Technology LLC (Miami) | Founded Anan Technology LLC in Miami, building full-stack AI automation systems spanning frontend, backend, Supabase, and n8n-driven automation. `[CURRENT]` |
| 09 | Aug 2025–Mar 2026 | Senior Product Manager, Robotic Imaging (Brickell, Miami) | Served as Senior Product Manager at Robotic Imaging, leading product direction on robotics/imaging systems. |
| 08 | Feb 2022–Aug 2025 | Founder & Product Architect, JOBR (Miami) | Founded and architected JOBR, an all-in-one business platform (marketplace, POS, driver app), from Figma to live product, leading a 13-person cross-functional team. |
| 07 | Apr 2021–Jan 2023 | VP of Product Development, Purekana (Miami) | As VP of Product Development at Purekana, launched 16 new product lines and built a B2B eCommerce platform on Shopify with a custom admin dashboard. |
| 06 | Aug 2015–May 2021 | Chief Executive Officer, Lake Tiberias (Saudi Arabia) | Led Lake Tiberias as CEO, achieving a 25% reduction in purchasing costs, a 60% improvement in labor cost estimation accuracy, and 400,000 SAR in new recurring revenue. Conducted final quality checks and sign-offs on all MEP designs for SPASA compliance. *Side note:* "Concurrently ran Coin Arabia FZE, a cryptocurrency exchange platform, 2017–2019." |
| 05 | Apr 2014–Aug 2015 | COO / Co-Founder, Worry Free Boat Club (Dubai) | Co-founded Worry Free Boat Club in Dubai, launching a boat-fleet membership startup and securing an Emirates Aviation Club partnership generating 1.8M AED in revenue. |
| 04 | Sep 2011–Nov 2013 | Facility Manager, Total Care | Managed warehouse and office facilities at the Aramex Jebel Ali warehouse (client site), developing Site Operation Reports covering KPIs, cost savings, and energy consumption. *Sub:* "Client site: Aramex, Dubai." |
| 03 | Mar 2011–Sep 2011 | Projects Coordinator, EMCO Engineering (Dubai) | Coordinated engineering projects at EMCO Engineering in Dubai. |
| 02 | Jun 2009–Mar 2011 | Projects Mechanical Engineer, AlMalki Establishment / Almalki Fountains (Riyadh) | Created Excel-based software for MEP equipment and pipe/tank sizing selection in swimming pool design. Self-taught and built a dancing fountain control system in Al-Khubar, Saudi Arabia using OASE technology. |
| 01 | 2003–2015 | Education | BSc Mechanical Engineering, American University of Sharjah (2003–2009). MSc Facilities Management, Heriot-Watt University Dubai (2014–2015). |

### Experience — Performance Data

Header: `METRIC` · `RESULT` · `CONTEXT`

| Metric | Result | Context |
|---|---|---|
| Purchasing costs | 25% reduction | Lake Tiberias |
| New recurring revenue | 400,000 SAR | Lake Tiberias |
| Labor cost estimation accuracy | 60% improvement | Lake Tiberias |
| Design calculation time | 2 days → 30 minutes | Lake Tiberias (in-house iOS software) |
| Water & electricity consumption | 22% reduction | VFD pool pump installation |
| Energy consumption | 17% reduction | Motion sensor lighting retrofit |
| Monthly job completion rate | 78% → 95% | Facility ops org-chart redesign |
| Maintenance schedule throughput | 32% increase | MS Visio workflow redesign |
| Partnership revenue | 1.8M AED | Emirates Aviation Club partnership |
| Product ecosystem shipped | 5 interconnected apps | JOBR |
| New product lines launched | 16 | Purekana |

Footer line: `Full detail available in the downloadable resume below.`

### Experience — BOM (Skills)

Eyebrow: `BOM — SKILLS` · H2: `Bill of Materials`

| Category | Items |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS, Figma, Lovable |
| Backend & DB | Supabase, PostgreSQL, REST APIs, FastAPI, Python, Webhooks |
| AI | Claude API, Claude Code, Codex, RAG, AI Agents |
| Automation & AI Builders | n8n, bolt.diy, Telegram Bots |
| Cloud & Deployment | AWS, Google Cloud, Firebase, Hetzner VPS, Docker, Cloudflare Tunnel |
| Dev Tools | VS Code, Git |
| Infrastructure & Security | Infisical, NocoDB |
| Payments | Stripe |

Footer line: `Bilingual — English & Arabic. MENA market experience.`

### Resume Panel
- Eyebrow: `OUTPUT — FULL SPEC`
- H3: `Full Resume`
- Body: `Complete career history, references, and project archive.`
- CTA: `Download Full Resume (PDF)`
- Date placeholder: `Last updated: [DATE]`

### Closing
- Eyebrow: `END OF SPEC`
- H2: `Let's draft the next system.`
- Lead: `If you have a process that should run itself, a stack that should scale, or an idea worth engineering — book a consultation and we'll map it out.`
- CTA: `Book a Consultation`
- Footer: `ANAN ALMASRI · MIAMI, FL · 2025`

### Footer
- `© 2026 ANAN ALMASRI`
- `ALL SYSTEMS OPERATIONAL`
- `DRAWING NO. AA-001`

### BookCallModal
- Step indicator segments (3)
- Step 1 H3: `Select a Date & Time`
- Step 1 lead: `30-minute consultation — weekdays, 9 AM – 5 PM EST.`
- Step 1 field labels: `DATE` · `TIME SLOT`
- Step 1 errors: `Please select a date` · `Please select a time slot`
- Step 1 CTA: `Next: Your Details`
- Step 2 H3: `Your Details`
- Step 2 lead: `Tell me a bit about your project so I come prepared.`
- Step 2 field labels: `NAME` · `EMAIL` · `COMPANY` · `PROJECT TYPE` · `MESSAGE`
- Step 2 errors: `Name is required` · `Email is required` · `Enter a valid email address`
- Step 2 placeholders: `Jane Doe` · `jane@example.com` · `Acme Corp (optional)` · `Tell me about your idea, stack, or problem...`
- Step 2 project types: `n8n Workflow` · `AI Agent` · `Full-Stack App` · `Consulting / Strategy` · `Other`
- Step 2 selected slot chip: `{date} · {timeSlot}`
- Step 2 submit: `Book Consultation` (loading: `Submitting...`)
- Step 2 back: `Back`
- Step 3 H3: `Consultation Booked`
- Step 3 lead: `Thanks{firstName}! I'll review your request and confirm via email.`
- Step 3 close: `Close`

### AdminLoginModal
- Eyebrow: `Admin Login`
- H2: `Secure access`
- Body: `Request a one-time code via Telegram, then enter it below to continue.`
- Step "request" CTA: `Request OTP` (loading: `Requesting code...`)
- Step "verify" field: `One-time code`, placeholder `Enter 6-digit code`
- Step "verify" CTAs: `Verify code` (loading: `Verifying...`) · `Request again`
- Error fallback messages: `Unable to request OTP. Please try again.` · `Invalid code. Please try again.` · `Please enter the code you received.`
- Success message: `OTP sent to Telegram. Enter the code below.` (fallback)

### Document Meta (`index.html`)
- `<title>`: `Anan Almasri — AI Automation Engineer`
- `<meta name="description">`: `Anan Almasri — Full-stack AI automation engineer in Miami. Building automated AI infrastructure end to end.`

---

## 8. Accessibility Spec

| Item | Spec |
|---|---|
| Focus ring | Global `*:focus-visible { outline: 2px solid #C9A15D; outline-offset: 3px; border-radius: 2px; }` in `index.css`. Brass, 2px, 3px offset. |
| Color contrast — `blueprint-paper` on `blueprint-bg` | ≈ 11.6 : 1 (WCAG AAA). |
| Color contrast — `blueprint-muted` on `blueprint-bg` | ≈ 6.6 : 1 (WCAG AA). |
| Color contrast — `blueprint-brass` on `blueprint-bg` | ≈ 6.1 : 1 (WCAG AA). |
| Reduced motion | `useReducedMotion()` hook + global `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; } html { scroll-behavior: auto; } }`. |
| `aria-label` | `aria-label="Anan Almasri — home"` on monogram. `aria-label="Open menu"` / `"Close menu"`. `aria-label="Close modal"` on BookCallModal close. `aria-label="Close admin login"` on AdminLoginModal close. `aria-label="Automation workflow schematic"` on the schematic SVG. |
| `aria-hidden` | `true` on TickMarks SVG. |
| OTP input | `inputMode="numeric"`, `autoComplete="one-time-code"`. |
| Date input min | `min={new Date().toISOString().split("T")[0]}`. |
| Form labels | Visible `<span>` labels via the `Field` component in BookCallModal steps. |
| Keyboard | All interactive elements are native `<button>` / `<a>` / `<input>` / `<select>` / `<textarea>`. No custom divs with click handlers. |
| Scroll offset | Case study sheets use `scroll-mt-24` so anchor jumps account for the fixed navbar. |
| Semantic HTML | `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`, `<ol>`, `<ul>`, `<li>`, `<form>`, `<label>`. |
| Antialiasing | `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;` on body. |
| `color-scheme` | `dark` set on `:root`. |

---

## 9. Background & Surface Utilities

### `body` background (`src/index.css`)

```css
body {
  background-color: #0E1F33;
  background-image:
    linear-gradient(to right, rgba(110, 147, 183, 0.10) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(110, 147, 183, 0.10) 1px, transparent 1px);
  background-size: 48px 48px;
  background-attachment: fixed;
  color: #EDE8DC;
  font-family: "IBM Plex Sans", system-ui, sans-serif;
}
```

### `.bp-grid`

```css
.bp-grid {
  background-image:
    linear-gradient(to right, rgba(110, 147, 183, 0.10) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(110, 147, 183, 0.10) 1px, transparent 1px);
  background-size: 48px 48px;
}
```

### `.bp-grid-fine`

```css
.bp-grid-fine {
  background-image:
    linear-gradient(to right, rgba(110, 147, 183, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(110, 147, 183, 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
}
```

### Dashboard wallpaper

Defined inline in `src/routes/dashboard/index.tsx`. See §4.19.

---

## 10. Tailwind Config Reference

```js
// tailwind.config.js
{
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blueprint: {
          bg:      "#0E1F33",
          surface: "#16283F",
          grid:    "#6E93B7",
          brass:   "#C9A15D",
          paper:   "#EDE8DC",
          muted:   "#9FB0C4",
        },
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', "monospace"],
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        annotation: "0.18em",
      },
    },
  },
  plugins: [],
}
```

**Plugins:** `tailwindcss`, `autoprefixer` (via `postcss.config.js`).

---

## 11. File Map

```
project-root/
├── index.html                       # Title, meta, font preconnect, root div
├── public/
│   ├── resume.pdf                   # Legacy resume
│   └── AnanAlmasri.pdf              # Canonical resume (linked from Hero)
├── src/
│   ├── main.tsx                     # createRoot, RouterProvider, StrictMode
│   ├── index.css                    # Background, focus ring, reduced-motion, .bp-grid*
│   ├── routeTree.gen.ts             # TanStack Router generated routes
│   ├── vite-env.d.ts
│   ├── routes/
│   │   ├── __root.tsx               # Root route, BookCallProvider
│   │   ├── index.tsx                # HomePage composition
│   │   └── dashboard/
│   │       ├── __path.tsx           # Dashboard layout
│   │       ├── index.tsx            # AnanOSDesktop (528 LOC)
│   │       ├── accounting.tsx       # 15 sub-routes (mostly stubs)
│   │       ├── ai-chat.tsx
│   │       ├── analytics.tsx
│   │       ├── calendar.tsx
│   │       ├── crm.tsx
│   │       ├── drive.tsx
│   │       ├── hrm.tsx
│   │       ├── inventory.tsx
│   │       ├── legal.tsx
│   │       ├── mail.tsx
│   │       ├── notes.tsx
│   │       ├── notifications.tsx
│   │       ├── operations.tsx
│   │       ├── projects.tsx
│   │       ├── settings.tsx
│   │       ├── support.tsx
│   │       └── tasks.tsx
│   ├── components/
│   │   ├── Navbar.tsx               # Fixed top nav
│   │   ├── Hero.tsx                 # Above-the-fold
│   │   ├── Schematic.tsx            # Animated SVG workflow
│   │   ├── TickMarks.tsx            # Corner registration marks
│   │   ├── WhatIBuild.tsx           # 3 capability panels
│   │   ├── Projects.tsx             # Container
│   │   ├── SheetIndex.tsx           # Project table
│   │   ├── CaseStudySheet.tsx       # 2x2 quadrant sheet
│   │   ├── Experience.tsx           # 4-part career/results/skills/resume
│   │   ├── Closing.tsx              # Final CTA
│   │   ├── Footer.tsx               # Status bar
│   │   ├── AdminLoginModal.tsx      # OTP modal
│   │   ├── Dashboard.tsx            # Legacy standalone wrapper
│   │   ├── BookCallModal/
│   │   │   ├── BookCallModal.tsx    # Orchestrator
│   │   │   ├── steps.tsx            # Step1/2/3 + Field
│   │   │   ├── context.tsx          # Provider + useBookCall
│   │   │   └── types.ts             # FormData, INITIAL_FORM, WEBHOOK_URL
│   │   └── ui/
│   │       ├── Panel.tsx            # rounded-[1.25rem] blueprint card
│   │       └── StatCell.tsx         # stat cell with .anan-brass class
│   ├── data/
│   │   └── projectsData.ts          # 9 projects, Problem/Solution/Stack/Result
│   └── hooks/
│       └── useReducedMotion.ts      # matchMedia hook
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── package.json
├── Dockerfile
├── docker-compose.yml
└── nginx.conf
```

---

*Last updated: 2026-07-21 — DESIGN.md v2.0 (Figma-style spec)*
*Source: `/Users/ananalmasri/Downloads/Technical Blueprint Homepage (3)`*
