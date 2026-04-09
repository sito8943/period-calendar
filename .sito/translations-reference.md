# Translation Keys Reference (`@sito/dashboard`)

This document lists every translation key currently used at runtime by the library, where it is used, and when it is needed.

`@sito/dashboard` expects your app to provide a translation function through `TranslationProvider`:

```tsx
type TFunction = (key: string, options?: Record<string, unknown>) => string;
```

If a component that calls `useTranslation()` is rendered without the provider, it throws:

- `translationContext must be used within a Provider`

## Required Keys by Feature

### Always required when using `Table`

| Key                                             | Where used            | Purpose                                               |
| ----------------------------------------------- | --------------------- | ----------------------------------------------------- |
| `_accessibility:components.table.empty`         | `TableEmpty`          | Empty-state message when table has no rows.           |
| `_accessibility:components.table.selectAllRows` | `Columns`             | Aria label for header checkbox (select visible rows). |
| `_accessibility:components.table.selectRow`     | `Rows`                | Aria label for each row checkbox.                     |
| `_accessibility:components.table.jumpToPage`    | `Footer/JumpToPage`   | Label next to page selector.                          |
| `_accessibility:components.table.pageSizes`     | `Footer/PageSize`     | Label next to page size selector.                     |
| `_accessibility:components.table.of`            | `Footer/CountOfTotal` | Text for count display, e.g. `1 - 20 of 95`.          |
| `_accessibility:buttons.previous`               | `Footer/Navigation`   | Aria label/name for previous page button.             |
| `_accessibility:buttons.next`                   | `Footer/Navigation`   | Aria label/name for next page button.                 |
| `_accessibility:components.table.selectedCount` | `TableSelectionBar`   | Selected rows text in multi-select bar.               |

### Required when row actions are enabled (`actions` prop in `Table`)

| Key                             | Where used | Purpose                          |
| ------------------------------- | ---------- | -------------------------------- |
| `_accessibility:labels.actions` | `Columns`  | Header label for actions column. |

### Required when non-sticky actions are used (ellipsis dropdown)

| Key                                  | Where used        | Purpose                                           |
| ------------------------------------ | ----------------- | ------------------------------------------------- |
| `_accessibility:buttons.openActions` | `ActionsDropdown` | Aria label/name/tooltip for actions menu trigger. |

### Required when column visibility or reset is used (`canHideColumns` / `canReset`)

| Key                              | Where used             | Purpose                                       |
| -------------------------------- | ---------------------- | --------------------------------------------- |
| `_accessibility:buttons.columns` | `ColumnVisibilityMenu` | Aria label for column visibility menu button. |
| `_accessibility:buttons.reset`   | `TableHeader`          | Aria label for reset table options button.    |

### Required when filters UI is used (`filterOptions` or column filters)

| Key                                   | Where used                      | Purpose                       |
| ------------------------------------- | ------------------------------- | ----------------------------- |
| `_accessibility:buttons.filters`      | `TableHeader`, `FilterDropdown` | Filters button/section label. |
| `_accessibility:buttons.clear`        | `FilterDropdown`                | Clear filters button text.    |
| `_accessibility:buttons.applyFilters` | `FilterDropdown`                | Apply filters button text.    |

### Required when range filters are used (`FilterTypes.number` or `FilterTypes.date`)

| Key                                                   | Where used            | Purpose                            |
| ----------------------------------------------------- | --------------------- | ---------------------------------- |
| `_accessibility:components.table.filters.range.start` | `Widgets/RangeWidget` | Placeholder for range start input. |
| `_accessibility:components.table.filters.range.end`   | `Widgets/RangeWidget` | Placeholder for range end input.   |

## Interpolation Requirements

Only one key currently uses interpolation options:

- `_accessibility:components.table.selectedCount`
  - Called as: `t("_accessibility:components.table.selectedCount", { count })`
  - Your `t` implementation should replace `{{count}}` (or equivalent) with a number.

Example expected output:

- `Selected 3 rows`

## Complete English Dictionary (Current Runtime Set)

```ts
const translations: Record<string, string> = {
  "_accessibility:buttons.applyFilters": "Apply filters",
  "_accessibility:buttons.clear": "Clear",
  "_accessibility:buttons.columns": "Columns",
  "_accessibility:buttons.filters": "Filters",
  "_accessibility:buttons.next": "Next",
  "_accessibility:buttons.openActions": "Open actions",
  "_accessibility:buttons.previous": "Previous",
  "_accessibility:buttons.reset": "Reset",
  "_accessibility:components.table.empty": "No results",
  "_accessibility:components.table.filters.range.end": "To",
  "_accessibility:components.table.filters.range.start": "From",
  "_accessibility:components.table.jumpToPage": "Go to page",
  "_accessibility:components.table.of": "of",
  "_accessibility:components.table.pageSizes": "Rows per page",
  "_accessibility:components.table.selectAllRows": "Select visible rows",
  "_accessibility:components.table.selectRow": "Select row",
  "_accessibility:components.table.selectedCount": "Selected {{count}} rows",
  "_accessibility:labels.actions": "Actions",
};
```

## Source Map (File-Level)

For fast maintenance, these keys are currently referenced in:

- `src/components/Actions/ActionsDropdown.tsx`
- `src/components/Table/components/Columns.tsx`
- `src/components/Table/components/ColumnVisibilityMenu.tsx`
- `src/components/Table/components/Filters/FilterDropdown/FilterDropdown.tsx`
- `src/components/Table/components/Footer/CountOfTotal.tsx`
- `src/components/Table/components/Footer/JumpToPage.tsx`
- `src/components/Table/components/Footer/Navigation.tsx`
- `src/components/Table/components/Footer/PageSize.tsx`
- `src/components/Table/components/Rows.tsx`
- `src/components/Table/components/TableEmpty.tsx`
- `src/components/Table/components/TableHeader/TableHeader.tsx`
- `src/components/Table/components/TableSelectionBar.tsx`
- `src/components/Table/components/Widgets/RangeWidget.tsx`
