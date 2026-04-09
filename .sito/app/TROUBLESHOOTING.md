# Troubleshooting `@sito/dashboard-app`

Quick diagnosis guide for common issues in consumer projects.

## 1. Quick checklist (60s)

1. Verify peers are installed (`react`, `@sito/dashboard`, `react-hook-form`, `@tanstack/react-query`, FontAwesome).
2. If your app uses auth/session hooks, verify provider order (`ConfigProvider` > `ManagerProvider` > `AuthProvider` > `NotificationProvider` > `DrawerMenuProvider`).
3. Ensure imports are only from `@sito/dashboard-app`.
4. Ensure `AuthProvider` and `IManager` use the same storage keys.
5. If Tailwind is used in the consumer app: `preflight: false` and `content` includes `node_modules/@sito/dashboard-app/dist/**/*.js`.

## 2. Frequent errors and fixes

### 2.1 `"Config provider has not been set..."`

**Cause**

- `useConfig()` is used (directly or through `Page`, `TabsLayout`, `Navbar`, `Drawer`) outside `ConfigProvider`.

**Fix**

- Mount `ConfigProvider` in the root and pass `location`, `navigate`, `linkComponent`.
- In React Router, `navigate` must handle `string | number`.

```tsx
<ConfigProvider
  location={location}
  navigate={(route) => {
    if (typeof route === "number") navigate(route);
    else navigate(route);
  }}
  linkComponent={Link}
>
  {children}
</ConfigProvider>
```

### 2.2 `"managerContext must be used within a Provider"`

**Cause**

- `useManager()` (or dependent hooks) is used outside `ManagerProvider`.

**Fix**

- Wrap your tree with `ManagerProvider manager={manager}`.

### 2.3 `"authContext must be used within a Provider"`

**Cause**

- `useAuth()` is used outside `AuthProvider`.

**Fix**

- Mount `AuthProvider` below `ManagerProvider`.
- For auth-optional wrappers (`Drawer`, `Onboarding`), `AuthProvider` is no longer required unless your app itself calls `useAuth()`.

### 2.4 `"NotificationContext must be used within a Provider"`

**Cause**

- `useNotification()` is used outside `NotificationProvider`.

**Fix**

- Mount `NotificationProvider` in root.
- Also render `<Notification />` so toast UI is visible.

### 2.5 `PageHeader` back button does nothing

**Cause**

- `navigate` in `ConfigProvider` only handles strings, not numbers.

**Fix**

- Support both types (`string | number`).

### 2.6 Styles not applied / broken layout

**Cause**

- Tailwind conflict (`preflight` enabled) or missing scan of `node_modules`.

**Fix**

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

### 2.7 `IconButton` type error on `icon`

**Cause**

- Passing a React node to `icon`.

**Fix**

- In `@sito/dashboard-app`, `IconButton` expects `icon: IconDefinition` (FontAwesome), not `ReactNode`.

### 2.8 Login works, but refresh/logout fails or session is cleared unexpectedly

**Cause**

- Storage keys are misaligned between `AuthProvider` and `IManager`/`BaseClient`.

**Fix**

- Define one shared key object and reuse it everywhere.

```ts
const authStorageKeys = {
  user: "user",
  remember: "remember",
  refreshTokenKey: "refreshToken",
  accessTokenExpiresAtKey: "accessTokenExpiresAt",
};
```

### 2.9 `Drawer` active item is wrong or navigation is inconsistent

**Cause**

- Stale/incorrect `location` or incompatible `linkComponent`.

**Fix**

- Pass real `useLocation()` into `ConfigProvider`.
- Use your router's actual `Link` as `linkComponent`.

### 2.10 `Onboarding` / `Error` behave unexpectedly

**Cause**

- Unsupported prop mode mixing.

**Fix**

- `Error`: use default mode (`error/message/onRetry`) **or** custom mode (`children`), never both.
- `Onboarding`: pass content via `steps`; do not rely on internal `_pages:onboarding.*` keys.

### 2.11 `IndexedDBClient`: `indexedDB is not defined`

**Cause**

- Client is instantiated in SSR/Node.

**Fix**

- Instantiate only in browser (for example inside `useEffect` or after checking `typeof window !== "undefined"`).

### 2.12 App crashes in SSR/server-render pipelines

**Cause**

- `@sito/dashboard-app` is a browser-focused package and relies on browser APIs (`window`, `document`, storage, portal targets).

**Fix**

- Do not integrate this package in SSR/server-render paths.
- Mount usage only in client/browser-rendered app trees.

## 3. Common typing pitfalls

### 3.1 Lost type safety due to missing generics

**Symptom**

- `record` becomes `any` or autocomplete is lost.

**Fix**

```tsx
<Page<ProductDto> ... />
<PrettyGrid<ProductDto> ... />
const importDialog = useImportDialog<ProductDto, ProductImportPreviewDto>(...)
```

### 3.2 Update DTO missing `id`

**Symptom**

- `BaseClient.update(...)` fails because `id` is missing.

**Fix**

- Update DTO must extend `DeleteDto`.

```ts
interface ProductUpdateDto extends DeleteDto {
  name?: string;
}
```

## 4. CLI diagnosis commands

### 4.1 Check installed peers

```bash
npm ls react react-dom @sito/dashboard @tanstack/react-query react-hook-form @fortawesome/react-fontawesome
```

### 4.2 Check library versions

```bash
npm ls @sito/dashboard-app @sito/dashboard
```

### 4.3 Check for forbidden internal imports

```bash
rg "@sito/dashboard-app/src/" src
```

## 5. Recommended baseline to avoid most issues

1. Build a centralized `AppProviders` component.
2. Keep shared `authStorageKeys` in one module.
3. Reuse official hooks (`useDeleteDialog`, `usePostForm`, `useImportDialog`).
4. Customize visuals via theme variables and `className` extension points.
