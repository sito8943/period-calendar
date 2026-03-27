# Theming and CSS customization in `@sito/dashboard-app`

Reference for customizing colors, classes, and visual behavior from consumer projects.

## 1. Available theme variables

These are defined by the library and can be overridden in your app:

| Variable                   | Default                 |
| -------------------------- | ----------------------- |
| `--color-primary`          | `#041e42`               |
| `--color-bg-primary`       | `#021327`               |
| `--color-hover-primary`    | `#0a2f66`               |
| `--color-secondary`        | `#cd212a`               |
| `--color-bg-secondary`     | `#8f151b`               |
| `--color-hover-secondary`  | `#e03a42`               |
| `--color-tertiary`         | `#00997b`               |
| `--color-bg-tertiary`      | `#006654`               |
| `--color-hover-tertiary`   | `#1ab89a`               |
| `--color-quaternary`       | `#d7942e`               |
| `--color-bg-quaternary`    | `#9e6a1f`               |
| `--color-hover-quaternary` | `#ebb04a`               |
| `--color-base-dark`        | `hsl(0 0% 90%)`         |
| `--color-base`             | `hsl(0 0% 95%)`         |
| `--color-base-light`       | `hsl(0 0% 100%)`        |
| `--color-text`             | `#0d0d0d`               |
| `--color-border`           | `hsl(0 0% 80%)`         |
| `--color-text-muted`       | `hsl(0 0% 30%)`         |
| `--color-bg-info`          | `#0070ba`               |
| `--color-info`             | `#fbfbfb`               |
| `--color-bg-success`       | `hsl(149.76, 68%, 36%)` |
| `--color-success`          | `#fbfbfb`               |
| `--color-bg-warning`       | `#ffa500`               |
| `--color-warning`          | `#000000`               |
| `--color-bg-error`         | `hsl(0, 50%, 51%)`      |
| `--color-error`            | `#fbfbfb`               |
| `--breakpoint-xs`          | `28rem`                 |

## 2. Overriding theme tokens in the consumer app

Create a theme CSS file and load it after the library styles.

```css
/* src/styles/dashboard-theme.css */
:root {
  --color-primary: #0f172a;
  --color-secondary: #b91c1c;
  --color-base: #f8fafc;
  --color-base-light: #ffffff;
  --color-text: #0f172a;
  --color-border: #d1d5db;
  --color-bg-success: #166534;
  --color-bg-error: #b91c1c;
}

[data-theme="dark"] {
  --color-primary: #111827;
  --color-base: #0b1220;
  --color-base-light: #172033;
  --color-text: #e5e7eb;
  --color-text-muted: #9ca3af;
  --color-border: #334155;
}
```

## 3. Safe extension points via `className` props

| Area             | Extension point                                                                 |
| ---------------- | ------------------------------------------------------------------------------- |
| `TabsLayout`     | `className`, `tabsContainerClassName`, `tabButtonProps.className`               |
| `PrettyGrid`     | `className`, `itemClassName`, `loadMoreComponent`                               |
| `Dialog`         | `containerClassName`, `className`, `animationClass`                             |
| `DialogActions`  | `containerClassName`, `primaryClassName`                                        |
| `Error`          | `className`, `messageProps.className`, `retryButtonProps.className`             |
| `Empty`          | `messageProps.className`                                                        |
| `ParagraphInput` | `containerClassName`, `inputClassName`, `labelClassName`, `helperTextClassName` |
| `Navbar`         | `menuButtonProps.className`                                                     |
| `Page`           | `addOptions.className`                                                          |
| `ToTop`          | `className`                                                                     |
| `SplashScreen`   | `className`                                                                     |
| `ImportDialog`   | `renderCustomPreview` to replace default preview                                |

## 4. Exported CSS class map by component

### 4.1 Buttons and helpers

- `.to-top`, `.to-top.show`, `.to-top.hide`
- `.page-fab`
- `.password-icon`

### 4.2 Drawer

- `.drawer-backdrop`, `.drawer-backdrop.opened`, `.drawer-backdrop.closed`
- `.drawer`, `.drawer.opened`, `.drawer.closed`
- `.drawer-list-item`, `.drawer-list-item.active`
- `.drawer-children-list`
- `.drawer-list-item-child`, `.drawer-list-item-child.active`
- `.drawer-link`
- `.drawer-divider`
- `.drawer-header-container`
- `.drawer-header`
- `.drawer-menu-list`

### 4.3 Dialog

- `.dialog-backdrop`, `.dialog-backdrop.opened`, `.dialog-backdrop.closed`
- `.dialog`, `.dialog.opened`, `.dialog.closed`
- `.dialog-header`, `.dialog-title`
- `.dialog-actions`, `.dialog-actions.end`
- `.dialog-close-btn`
- `.dialog-form-primary`

### 4.4 ImportDialog

- `.import-override-label`
- `.import-dialog-actions`
- `.import-preview`
- `.import-preview-count`
- `.import-preview-content`
- `.import-error-message`
- `.import-loading`

### 4.5 Page, Navbar, Tabs, Onboarding

- `.page-header`, `.page-header-left`, `.page-header-title`
- `.page-main`, `.page-main-content`, `.page-loading`
- `.page-header-actions-desktop`, `.page-header-actions-mobile`
- `.header`, `.navbar-title`, `.navbar-left`, `.navbar-right`, `.navbar-menu`
- `.tabs-layout-main`, `.tabs-container`, `.tab`
- `.onboarding-main`, `.step-container`, `.step-title`, `.step-body`, `.step-content`, `.step-actions`, `.step-button`

### 4.6 Feedback and states

- `.error-container`, `.error-icon`, `.error-message`, `.error-retry`
- `.empty-container`, `.empty-message`
- `.notification-portal`, `.notification`, `.notification.closing`
- `.notification-body`, `.notification-icon`, `.notification-text`
- `.notification-close`, `.notification-close-icon`
- `.splash-screen`

### 4.7 Form and grid

- `.form-container`
- `.form-actions`, `.form-actions.end`
- `.form-paragraph-container`
- `.pretty-grid-main`, `.pretty-grid-item`, `.pretty-grid-load-more`

## 5. Class override examples

```css
/* Header and page */
.page-header,
.header {
  backdrop-filter: saturate(120%) blur(8px);
}

/* Dialog */
.dialog {
  max-width: 860px;
}

/* Active drawer item */
.drawer-list-item.active > .drawer-link {
  font-weight: 700;
}

/* ToTop position */
.to-top {
  right: 2rem;
  bottom: 2rem;
}
```

## 6. Tailwind in the consumer project (if used)

```ts
// tailwind.config.ts
export default {
  darkMode: "class",
  corePlugins: { preflight: false },
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@sito/dashboard-app/dist/**/*.js",
  ],
};
```

## 7. Practical recommendations

1. Use theme variables first for global branding.
2. Use `className` props for component-level adjustments.
3. Avoid broad overrides of `.button`, `.action`, `.text-input` without scoping.
4. For complex import UI, use `renderCustomPreview` instead of forking `ImportDialog`.
