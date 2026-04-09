# Visual Customization for `@sito/dashboard`

This guide focuses on:

- theme variable tuning,
- CSS class customization,
- style props (`className`, `containerClassName`, etc.).

## 1. Recommended Strategy

Use 3 levels, from lowest to highest impact:

1. Component style props (`className`, `inputClassName`, etc.).
2. CSS variable overrides (`--color-*`) to recolor the whole library.
3. Internal class overrides (`.table-row`, `.filter-popup`, etc.) for fine control.

## 2. Theme Variables (`--color-*`)

The library defines these base tokens:

| Token                      | Default value           |
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

### Global override example

```css
/* src/styles/sito-dashboard-theme.css */
:root {
  --color-primary: #0f4c81;
  --color-bg-primary: #0b355a;
  --color-hover-primary: #1f639f;

  --color-secondary: #a81f5b;
  --color-bg-secondary: #7a1441;
  --color-hover-secondary: #bf2a6a;

  --color-base-light: #ffffff;
  --color-base: #f5f7fb;
  --color-base-dark: #e8ecf5;
  --color-text: #101828;
  --color-border: #d0d5dd;
}
```

### Dark mode class-based variant

```css
.dark {
  --color-base-light: #0b1220;
  --color-base: #111827;
  --color-base-dark: #1f2937;
  --color-text: #e5e7eb;
  --color-text-muted: #9ca3af;
  --color-border: #374151;
}
```

## 3. Style Props by Component

| Component           | Style props                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `Table`             | `className`, `contentClassName`, `columns[].className`                                           |
| `Actions`           | `className`, `itemClassName`, `actionClassName`                                                  |
| `Action`            | `className`                                                                                      |
| `ActionsDropdown`   | `className`                                                                                      |
| `Button`            | `className`                                                                                      |
| `IconButton`        | `className`, `iconClassName`                                                                     |
| `Chip`              | `className`, `textClassName`, `iconClassName`                                                    |
| `Badge`             | `className`                                                                                      |
| `Tooltip`           | `className`                                                                                      |
| `Loading`           | `className`, `loaderClass`, `color`, `strokeWidth`                                               |
| `TextInput`         | `containerClassName`, `inputClassName`, `labelClassName`, `helperTextClassName`                  |
| `SelectInput`       | `containerClassName`, `inputClassName`, `labelClassName`, `helperTextClassName`                  |
| `AutocompleteInput` | `containerClassName`, `inputContainerClassName`, plus inherited `TextInput` style props          |
| `CheckInput`        | `containerClassName`, `inputClassName`, `labelClassName`                                         |
| `FileInput`         | `containerClassName`, `inputClassName`, `labelClassName`, `helperTextClassName`, `iconClassName` |

## 4. Useful Internal Classes for Overrides

If you need high granularity, you can override internal library classes.

### Inputs

- `.input-error`
- `.input-good`
- `.input-normal`
- `.input-label-error`
- `.input-label-good`
- `.input-label-normal`
- `.input-helper-text-error`
- `.input-helper-text-good`
- `.input-helper-text-normal`

### Table

- `.table-main`
- `.table-header`
- `.table-body`
- `.table-content`
- `.table-row`
- `.table-row.selected`
- `.table-row.expanded`
- `.table-row-cell`
- `.table-row-cell-action`
- `.table-row-expanded-inner`
- `.table-selection-bar`
- `.table-footer`
- `.table-headers-row`
- `.table-headers-cell`
- `.column-visibility-menu`
- `.column-visibility-trigger`
- `.column-visibility-dropdown`
- `.column-visibility-item`
- `.reset-table-icon`

### Filters

- `.filter-popup`
- `.filter-title`
- `.filter-footer`
- `.filter-dropdown-button`
- `.filter-dropdown-trigger-icon`

### Other

- `.badge-main`
- `.chip-main`
- `.chip-delete-button`
- `.dropdown-main`
- `.tooltip-text`
- `.actions-container`
- `.action`
- `.icon-action`
- `.text-action`

## 5. Practical Examples

### Compact table and denser rows

```css
.users-table .table-row-cell {
  padding: 0.5rem 0.75rem;
}

.users-table .table-header-title {
  font-size: 1.5rem;
}
```

```tsx
<Table className="users-table" contentClassName="max-h-[70vh]" {...props} />
```

### Style sticky actions and dropdown items

```css
.users-table .row-table-action {
  border: 1px solid var(--color-border);
}

.users-table .actions-dropdown-list .action-dropdown-item {
  border-radius: 0.5rem;
}
```

### Change tooltip look and feel

```css
.tooltip-text {
  background: var(--color-bg-primary);
  color: var(--color-base-light);
  font-size: 12px;
  border-radius: 8px;
}
```

## 6. Best Practices

1. Load your override CSS after your app's global styles.
2. Start with theme variable overrides before overriding internal classes.
3. If your consumer app uses Tailwind, avoid purging classes used by the library.
4. For complex tables, scope overrides with container classes (`.users-table`, `.orders-table`).
