# `@sito/dashboard` in a Consumer Project

## 1. Installation

```bash
npm install @sito/dashboard
```

Required peer dependencies:

- `react` `>=18.2 <20`
- `react-dom` `>=18.2 <20`

## 2. Minimum Required Setup (Providers)

To use the library with `Table`, wrap your app (or at least the view rendering the table) with:

1. `TranslationProvider`
2. `TableOptionsProvider`

```tsx
import { TableOptionsProvider, TranslationProvider } from "@sito/dashboard";

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

const t = (key: string, options?: Record<string, unknown>) => {
  const raw = translations[key] ?? key;
  if (typeof options?.count === "number") {
    return raw.replace("{{count}}", String(options.count));
  }
  return raw;
};

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider t={t} language="en">
      <TableOptionsProvider>{children}</TableOptionsProvider>
    </TranslationProvider>
  );
}
```

Common runtime errors when providers are missing:

- `translationContext must be used within a Provider`
- `tableOptionsContext must be used within a Provider`

## 3. Base Types You Must Respect

```ts
import type { BaseDto } from "@sito/dashboard";

type Row = BaseDto & {
  id: number;
  deletedAt?: string | Date | null;
};
```

`Table<TRow>` requires `TRow` to extend `BaseDto`.

## 4. Table: Recommended Usage

```tsx
import {
  FilterTypes,
  Table,
  useTableOptions,
  type ActionType,
  type BaseDto,
  type ColumnType,
} from "@sito/dashboard";
import { useEffect, useState } from "react";

type User = BaseDto & {
  name: string;
  email: string;
  role: string;
  deletedAt?: string | null;
};

const columns: ColumnType<User>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  {
    key: "role",
    label: "Role",
    filterOptions: {
      type: FilterTypes.select,
      options: [
        { id: "", value: "All" },
        { id: "admin", value: "Admin" },
        { id: "viewer", value: "Viewer" },
      ],
    },
  },
];

export function UsersTable() {
  const [rows, setRows] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { currentPage, pageSize, sortingBy, sortingOrder, filters, setTotal } =
    useTableOptions();

  useEffect(() => {
    setIsLoading(true);
    fetchUsers({ currentPage, pageSize, sortingBy, sortingOrder, filters })
      .then(({ data, total }) => {
        setRows(data);
        setTotal(total);
      })
      .finally(() => setIsLoading(false));
  }, [currentPage, pageSize, sortingBy, sortingOrder, filters, setTotal]);

  const actions = (row: User): ActionType<User>[] => [
    {
      id: "edit",
      tooltip: "Edit",
      icon: <span>E</span>,
      onClick: () => openEditModal(row),
      sticky: true,
    },
    {
      id: "delete",
      tooltip: "Delete",
      icon: <span>X</span>,
      onClick: () => deleteUser(row),
      hidden: !!row.deletedAt,
    },
    {
      id: "export",
      tooltip: "Export selection",
      icon: <span>v</span>,
      onClick: () => undefined,
      multiple: true,
      onMultipleClick: (selectedRows) => exportUsers(selectedRows),
    },
  ];

  return (
    <Table<User>
      entity="user"
      title="Users"
      data={rows}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      onSort={(prop, order) => {
        console.log("sort", prop, order);
      }}
    />
  );
}
```

## 5. `TableOptionsProvider`: Internal Default State

- `currentPage`: `0`
- `pageSize`: `20`
- `pageSizes`: `[20, 50, 100]`
- `sortingBy`: `"id"`
- `sortingOrder`: `SortOrder.DESC`
- `filters`: `{}`
- `total`: `0`
- `hiddenColumns`: `[]` (or `defaultHiddenColumns` if provided)

You can override the initial table state through `initialState`:

```tsx
<TableOptionsProvider
  defaultHiddenColumns={["email"]}
  initialState={{
    currentPage: 0,
    pageSize: 50,
    pageSizes: [25, 50, 100],
    sortingBy: "createdAt",
    sortingOrder: SortOrder.ASC,
    filters: { status: "active" },
  }}
>
  <UsersTable />
</TableOptionsProvider>
```

### Provider Props

| Prop                   | Type                                   | Description                                                                                                     |
| ---------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `children`             | `ReactNode`                            | Required.                                                                                                       |
| `defaultHiddenColumns` | `string[]`                             | Column keys hidden on mount and after reset.                                                                    |
| `initialState`         | `TableOptionsProviderInitialStateType` | Optional initial values for `currentPage`, `pageSize`, `pageSizes`, `sortingBy`, `sortingOrder`, and `filters`. |

## 6. Key `Table` Props

| Prop                        | Type                                       | Description                                          |
| --------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| `entity`                    | `string`                                   | Logical entity identifier (recommended).             |
| `data`                      | `TRow[]`                                   | Rows to render.                                      |
| `columns`                   | `ColumnType<TRow>[]`                       | Column definitions.                                  |
| `actions`                   | `(row) => ActionType<TRow>[]`              | Row actions.                                         |
| `title`                     | `string`                                   | Header title.                                        |
| `toolbar`                   | `ReactNode`                                | Right area in header.                                |
| `isLoading`                 | `boolean`                                  | Loading state.                                       |
| `onSort`                    | `(prop, order) => void`                    | Sort callback.                                       |
| `onRowSelect`               | `(row, selected) => void`                  | Single-row selection callback.                       |
| `onSelectedRowsChange`      | `(rows) => void`                           | All selected rows callback.                          |
| `onRowExpand`               | `(expandedRow, collapsedRow) => ReactNode` | Expanded row content.                                |
| `expandedRowId`             | `TRow["id"] \| null`                       | External expanded row control.                       |
| `allowMultipleExpandedRows` | `boolean`                                  | Multiple expanded rows in uncontrolled mode.         |
| `onExpandedRowChange`       | `(expandedRow, collapsedRow) => void`      | Expansion state change callback.                     |
| `softDeleteProperty`        | `keyof TRow`                               | Soft-delete marker field (`"deletedAt"` by default). |
| `className`                 | `string`                                   | Main wrapper class.                                  |
| `contentClassName`          | `string`                                   | Scrollable table body class.                         |
| `canHideColumns`            | `boolean`                                  | Show column visibility menu in header.               |
| `canReset`                  | `boolean`                                  | Show reset button in header.                         |

## 7. Actions: Sticky vs Dropdown vs Bulk

- `sticky: true`: always visible next to the row.
- `sticky` omitted or `false`: rendered inside ellipsis menu (`ActionsDropdown`).
- `multiple: true`: shown in multi-selection bar.
- `onMultipleClick(rows)`: direct bulk action handler.

## 8. Filters

You can define filters per column with `column.filterOptions`:

```ts
import { FilterTypes, type ColumnType } from "@sito/dashboard";

const columns: ColumnType<User>[] = [
  {
    key: "name",
    label: "Name",
    filterOptions: {
      type: FilterTypes.text,
      placeholder: "Search by name",
    },
  },
  {
    key: "role",
    label: "Role",
    filterOptions: {
      type: FilterTypes.select,
      options: [
        { id: "", value: "All" },
        { id: "admin", value: "Admin" },
      ],
    },
  },
];
```

Global filter control (`Table.filterOptions`) to control dropdown visibility:

```tsx
<Table
  filterOptions={{
    button: { hide: false },
    dropdown: {
      opened: openFilters,
      setOpened: setOpenFilters,
    },
  }}
  {...rest}
/>
```

## 9. Column Visibility & Reset

Columns can be hidden/shown at runtime via a dropdown menu, and table state can be reset to defaults.

### Enable column visibility

```tsx
<TableOptionsProvider defaultHiddenColumns={["email"]}>
  <Table<User> data={rows} columns={columns} canHideColumns canReset />
</TableOptionsProvider>
```

### `ColumnType` visibility props

| Prop       | Type                  | Description                                              |
| ---------- | --------------------- | -------------------------------------------------------- |
| `display`  | `"visible" \| "none"` | Static visibility — `"none"` columns are always hidden.  |
| `hideable` | `boolean`             | If `false`, column is excluded from the visibility menu. |

### Reset behavior

When the reset button is clicked (`canReset`), the following state is restored:

- `hiddenColumns` → `defaultHiddenColumns` (or `[]`)
- `sortingBy` → `initialState.sortingBy` (or `"id"` if omitted)
- `sortingOrder` → `initialState.sortingOrder` (or `SortOrder.DESC` if omitted)
- `filters` → `initialState.filters` (or `{}` if omitted)
- `currentPage` → `initialState.currentPage` (or `0` if omitted)

### Programmatic access

```tsx
const { hiddenColumns, toggleColumn, setHiddenColumns, resetTableOptions } =
  useTableOptions();
```

## 10. Form Components (Quick API)

All inputs expose style hooks (`containerClassName`, `inputClassName`, etc.).

```tsx
import {
  AutocompleteInput,
  CheckInput,
  FileInput,
  SelectInput,
  TextInput,
  type Option,
} from "@sito/dashboard";

const options: Option[] = [
  { id: "", value: "Select..." },
  { id: "admin", value: "Admin" },
];

<TextInput
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  label="Email"
/>;

<SelectInput
  value={role}
  onChange={(e) => setRole(e.target.value)}
  options={options}
  label="Role"
/>;

<AutocompleteInput
  value={country}
  onChange={setCountry}
  options={[
    { id: "es", name: "Spain" },
    { id: "us", name: "USA" },
  ]}
  label="Country"
/>;

<CheckInput
  checked={active}
  onChange={(e) => setActive(e.target.checked)}
  label="Active"
/>;

<FileInput
  id="csv"
  label="Upload CSV"
  onChange={(e) => console.log(e.target.files)}
/>;
```

`Option` shape expected by selection components:

```ts
type Option = {
  id: number | string;
  value?: number | string;
  name?: string;
};
```

## 11. Quick UI Components (Outside Table)

```tsx
import {
  Action,
  Actions,
  ActionsDropdown,
  Badge,
  Button,
  Chip,
  Dropdown,
  IconButton,
  Loading,
  Tooltip,
} from "@sito/dashboard";
import { useRef, useState } from "react";

<Button variant="submit" color="primary">
  Save
</Button>;

<IconButton icon={<span>*</span>} color="secondary" aria-label="Settings" />;

<Tooltip content="Delete">
  <IconButton icon={<span>X</span>} aria-label="Delete" />
</Tooltip>;

<Badge count={3} />;

<Chip text="Active" onDelete={() => console.log("delete")} />;

<Action
  id="view"
  tooltip="View"
  icon={<span>eye</span>}
  onClick={() => console.log("view")}
/>;

<Actions
  actions={[
    { id: "edit", tooltip: "Edit", icon: <span>E</span>, onClick: () => {} },
    {
      id: "remove",
      tooltip: "Delete",
      icon: <span>X</span>,
      onClick: () => {},
    },
  ]}
/>;

<ActionsDropdown
  actions={[
    {
      id: "archive",
      tooltip: "Archive",
      icon: <span>A</span>,
      onClick: () => {},
    },
  ]}
/>;

function ExampleDropdown() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <button ref={triggerRef} onClick={() => setOpen((v) => !v)}>
        Open menu
      </button>
      <Dropdown
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={triggerRef.current}
      >
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </Dropdown>
    </>
  );
}

<Loading className="h-20" />;
```

## 12. Integration Checklist

1. Install `@sito/dashboard` and verify peer dependencies.
2. Wrap the app with `TranslationProvider`.
3. Wrap each table view with `TableOptionsProvider`.
4. Ensure each row has `id: number`.
5. Refetch when `currentPage`, `pageSize`, `sortingBy`, `sortingOrder`, or `filters` change.
6. Call `setTotal(total)` after every API response.
