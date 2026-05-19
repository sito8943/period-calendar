# Integration Recipes for `@sito/dashboard-app`

Copy-ready recipes for consumer projects.

This guide is intentionally broad: it covers the main usage path for every feature family exported by the package (providers, layout, dialogs, forms, hooks, notifications, auth, and clients).

## 1. Required provider bootstrap (correct order)

```tsx
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AuthProvider,
  BottomNavActionProvider,
  ConfigProvider,
  DrawerMenuProvider,
  IManager,
  ManagerProvider,
  NavbarProvider,
  NotificationProvider,
} from "@sito/dashboard-app";

const authStorageKeys = {
  user: "user",
  remember: "remember",
  refreshTokenKey: "refreshToken",
  accessTokenExpiresAtKey: "accessTokenExpiresAt",
};

const manager = new IManager(
  import.meta.env.VITE_API_URL,
  authStorageKeys.user,
  {
    rememberKey: authStorageKeys.remember,
    refreshTokenKey: authStorageKeys.refreshTokenKey,
    accessTokenExpiresAtKey: authStorageKeys.accessTokenExpiresAtKey,
  },
);

export function AppProviders({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ConfigProvider
      location={location}
      navigate={(route) => {
        if (typeof route === "number") navigate(route);
        else navigate(route);
      }}
      linkComponent={Link}
      motion="auto"
    >
      {/* ManagerProvider already mounts QueryClientProvider internally */}
      <ManagerProvider manager={manager}>
        <AuthProvider
          user={authStorageKeys.user}
          remember={authStorageKeys.remember}
          refreshTokenKey={authStorageKeys.refreshTokenKey}
          accessTokenExpiresAtKey={authStorageKeys.accessTokenExpiresAtKey}
        >
          <NotificationProvider>
            <DrawerMenuProvider>
              {/* Optional unless you use Navbar/useNavbar */}
              <NavbarProvider>
                {/* Optional: only when pages register dynamic BottomNavigation center actions */}
                <BottomNavActionProvider>{children}</BottomNavActionProvider>
              </NavbarProvider>
            </DrawerMenuProvider>
          </NotificationProvider>
        </AuthProvider>
      </ManagerProvider>
    </ConfigProvider>
  );
}
```

`ConfigProvider.motion` controls library transitions globally:

- `"auto"` respects `prefers-reduced-motion`.
- `"none"` disables library transitions and animations.
- `"always"` keeps library transitions enabled even when the OS/browser requests reduced motion.

## 2. Base app shell with layout helpers (`AppShell` + `DashboardHeader` + `DashboardFooter`)

Prefer the bundled shells over hand-rolling Navbar/Drawer/Footer wiring. `AppShell` mounts the layout slots in fixed order (`header → children → footer → bottomNavigation → extras → Notification`) and `DashboardHeader` owns the drawer open/close state internally.

```tsx
import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { faBox, faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AppShell,
  DashboardFooter,
  DashboardHeader,
  MenuItemType,
} from "@sito/dashboard-app";

type AppPages = "home" | "products";

export function AppLayout() {
  const menuMap = useMemo<MenuItemType<AppPages>[]>(
    () => [
      {
        page: "home",
        path: "/",
        icon: <FontAwesomeIcon icon={faHouse} />,
        type: "menu",
      },
      {
        page: "products",
        path: "/products",
        icon: <FontAwesomeIcon icon={faBox} />,
        type: "menu",
      },
    ],
    [],
  );

  return (
    <AppShell
      header={
        <DashboardHeader<AppPages>
          menuMap={menuMap}
          showOfflineBanner
          navbarProps={{ showSearch: true }}
        />
      }
      footer={
        <DashboardFooter
          copyrightText="© Acme Corp"
          toTopProps={{ threshold: 160, tooltip: "Back to top" }}
        />
      }
      extras={<Tooltip id="tooltip" />}
    >
      <Outlet />
    </AppShell>
  );
}
```

Notes:

- `AppShell` already mounts `<Notification />` at the end of its slot order. Pass `withNotification={false}` only when you mount your own portal.
- `DashboardHeader` is generic over `MenuKeys`. The drawer state lives inside the component; consumers only supply `menuMap` and optional `logo` / `showOfflineBanner` / `navbarProps`.
- `DashboardFooter` renders `ToTop` by default. Toggle with `showToTop={false}` or pass `toTopProps` to customize. Set `bottomNavSpacing` when the app also mounts `BottomNavigation` so the footer stays clear of the fixed bottom bar on mobile.

If you need a hand-rolled shell (custom slot order, special wrappers), the lower-level `Navbar`/`Drawer`/`Notification`/`ToTop` primitives remain available and continue to work the same way.

### 2.1 Mobile bottom nav with `BottomNavigation`

Use this when you need quick primary navigation on mobile while keeping the desktop drawer/navbar flow.

```tsx
import {
  BottomNavigation,
  type BottomNavigationItemType,
} from "@sito/dashboard-app";
import {
  faBox,
  faHouse,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

type BottomNavId = "home" | "products" | "profile";

const bottomNavItems: BottomNavigationItemType<BottomNavId>[] = [
  { id: "home", label: "Home", to: "/", icon: faHouse, position: "left" },
  {
    id: "products",
    label: "Products",
    to: "/products",
    icon: faBox,
    position: "left",
  },
  {
    id: "profile",
    label: "Profile",
    to: "/profile",
    icon: faUser,
    position: "right",
  },
];

<BottomNavigation
  items={bottomNavItems}
  centerAction={{
    icon: faPlus,
    to: "/products/new",
    ariaLabel: "Create product",
  }}
/>;
```

Dynamic center-action override (optional provider):

```tsx
import {
  BottomNavActionProvider,
  BottomNavigation,
  useRegisterBottomNavAction,
  type BottomNavigationItemType,
} from "@sito/dashboard-app";
import { faTags } from "@fortawesome/free-solid-svg-icons";

function CategoriesCenterAction() {
  useRegisterBottomNavAction({
    icon: faTags,
    ariaLabel: "Create category",
    to: "/categories/new",
  });
  return null;
}

<BottomNavActionProvider>
  <CategoriesCenterAction />
  <BottomNavigation
    items={bottomNavItems}
    centerAction={{ ariaLabel: "Create product", to: "/products/new" }}
  />
</BottomNavActionProvider>;
```

`BottomNavigation` uses `ConfigProvider` routing primitives under the hood and renders only on mobile by default (`sm:hidden`).

### 2.2 Auth route shell with `AuthShell`

Wrap your auth route group with `AuthShell` so the global `Notification` portal stays mounted even before the user signs in. The shell does not include redirect or error-boundary logic — those decisions stay in the consumer where route constants live.

```tsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthShell, useAuth } from "@sito/dashboard-app";

import { AppRoutes, publicAuthRoutes } from "../lib/routes";

export function AuthLayout() {
  const { account } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!account.email) return;
    if (publicAuthRoutes.has(location.pathname)) return;
    navigate(AppRoutes.Home);
  }, [account.email, location.pathname, navigate]);

  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
}
```

If you mount your own toast portal, opt out of the built-in one with `withNotification={false}`.

### 2.3 Reusable fallback views (`NotFoundView`, `FeatureUnavailableView`)

Both views consume `linkComponent` from `ConfigProvider`, so navigation stays router-agnostic. Pass `ctaTo` from your own `routes.ts` constants — never hardcode.

```tsx
import { useTranslation } from "react-i18next";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FeatureUnavailableView, NotFoundView } from "@sito/dashboard-app";

import { AppRoutes } from "../lib/routes";

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <NotFoundView
      title={t("_pages:notFound.title")}
      body={t("_pages:notFound.body")}
      ctaLabel={t("_pages:home.title")}
      ctaTo={AppRoutes.Home}
    />
  );
}

export function FeatureDisabledPage({ module }: { module: string }) {
  const { t } = useTranslation();

  return (
    <FeatureUnavailableView
      icon={faLock}
      title={t("_pages:featureFlags.route.title")}
      body={t("_pages:featureFlags.route.body", {
        module: t(`_pages:featureFlags.modules.${module}`),
      })}
      ctaLabel={t("_pages:featureFlags.route.cta")}
      ctaTo={AppRoutes.Home}
    />
  );
}
```

`FeatureUnavailableView.icon` defaults to `faWarning`. Both accept className overrides (`className`, `titleClassName`, `bodyClassName`, `ctaClassName`, plus `iconClassName` on `FeatureUnavailableView`). All className overrides merge after the library's base classes, so consumer CSS keeps targeting `.not-found-view-*` / `.feature-unavailable-view-*` while extending visual customization.

### 2.4 PWA update prompt with `PwaUpdateDialog`

`PwaUpdateDialog` is presentational only: the consumer owns the service-worker source (custom hook, `vite-plugin-pwa`'s `useRegisterSW`, etc.). Mount it inside `AppShell.extras` so it sits above the route content.

Using `vite-plugin-pwa`:

```tsx
import { useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";
import { PwaUpdateDialog } from "@sito/dashboard-app";

export function PwaUpdate() {
  const { t } = useTranslation();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  return (
    <PwaUpdateDialog
      open={needRefresh}
      onDismiss={() => setNeedRefresh(false)}
      onUpdate={() => updateServiceWorker(true)}
      title={t("_pages:pwaUpdate.title")}
      description={t("_pages:pwaUpdate.description")}
      dismissLabel={t("_pages:pwaUpdate.actions.later")}
      updateLabel={t("_pages:pwaUpdate.actions.update")}
    />
  );
}
```

Using a vanilla `navigator.serviceWorker` setup:

```tsx
import { useEffect, useRef, useState } from "react";
import { PwaUpdateDialog } from "@sito/dashboard-app";

function useServiceWorkerUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

    void navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        registrationRef.current = registration;
        if (registration.waiting) setNeedRefresh(true);

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (
              worker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setNeedRefresh(true);
            }
          });
        });
      });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }, []);

  return {
    needRefresh,
    dismissUpdate: () => setNeedRefresh(false),
    applyUpdate: () =>
      registrationRef.current?.waiting?.postMessage({ type: "SKIP_WAITING" }),
  };
}

export function PwaUpdate() {
  const { needRefresh, dismissUpdate, applyUpdate } = useServiceWorkerUpdate();
  return (
    <PwaUpdateDialog
      open={needRefresh}
      onDismiss={dismissUpdate}
      onUpdate={applyUpdate}
      title="Update available"
      description="A new version is ready. Reload to apply."
      dismissLabel="Later"
      updateLabel="Update"
    />
  );
}
```

The library never imports `navigator.serviceWorker` or `virtual:pwa-register/react` — only the consumer does.

## 3. Dynamic drawer children with `useDrawerMenu`

```tsx
import { useEffect } from "react";
import { useDrawerMenu, type SubMenuItemType } from "@sito/dashboard-app";

type MenuKeys = "products" | "orders";

export function ProductsDynamicMenuItems() {
  const { addChildItem, clearDynamicItems } = useDrawerMenu<MenuKeys>();

  useEffect(() => {
    const dynamicItem: SubMenuItemType = {
      id: "products-import-history",
      label: "Import history",
      path: "/products/import-history",
    };

    addChildItem("products", dynamicItem);

    return () => {
      clearDynamicItems("products");
    };
  }, [addChildItem, clearDynamicItems]);

  return null;
}
```

## 4. CRUD page with `Page`, `PageHeader`, `PrettyGrid`, and action hooks

```tsx
import { useMemo } from "react";
import {
  ConfirmationDialog,
  Page,
  PageHeader,
  PrettyGrid,
  useDeleteDialog,
  useEditAction,
  useRestoreDialog,
  type BaseEntityDto,
  type ButtonPropsType,
} from "@sito/dashboard-app";

interface ProductDto extends BaseEntityDto {
  name: string;
  price: number;
}

const QUERY_KEY = ["products"];

export function ProductsPage() {
  const rows: ProductDto[] = []; // from your query/api
  const isLoading = false;

  const deleteDialog = useDeleteDialog({
    queryKey: QUERY_KEY,
    mutationFn: (ids) => api.products.softDelete(ids),
  });

  const restoreDialog = useRestoreDialog({
    queryKey: QUERY_KEY,
    mutationFn: (ids) => api.products.restore(ids),
  });

  const { action: editAction } = useEditAction({
    onClick: (id) => openEditDialog(id),
  });

  const rowActions = useMemo(
    () => (item: ProductDto) => [
      editAction(item),
      deleteDialog.action(item),
      restoreDialog.action(item),
    ],
    [deleteDialog, editAction, restoreDialog],
  );

  const confirmExtraActions: ButtonPropsType[] = [
    {
      id: "review-ids",
      type: "button",
      variant: "outlined",
      color: "secondary",
      children: "Review selection",
      onClick: () => openSelectionPreview(),
    },
  ];

  return (
    <>
      <PageHeader<ProductDto> title="Products" />

      <Page<ProductDto>
        title="Products"
        isLoading={isLoading}
        queryKey={QUERY_KEY}
        addOptions={{ onClick: () => openCreateDialog() }}
      >
        <PrettyGrid<ProductDto>
          data={rows}
          renderComponent={(item) => (
            <ProductCard item={item} actions={rowActions(item)} />
          )}
        />
      </Page>

      <ConfirmationDialog
        open={deleteDialog.open}
        title={deleteDialog.title}
        isLoading={deleteDialog.isLoading}
        handleClose={deleteDialog.handleClose}
        handleSubmit={deleteDialog.handleSubmit}
        extraActions={confirmExtraActions}
      >
        Are you sure you want to delete the selected items?
      </ConfirmationDialog>

      <ConfirmationDialog
        open={restoreDialog.open}
        title={restoreDialog.title}
        isLoading={restoreDialog.isLoading}
        handleClose={restoreDialog.handleClose}
        handleSubmit={restoreDialog.handleSubmit}
      >
        Are you sure you want to restore the selected items?
      </ConfirmationDialog>
    </>
  );
}
```

### 4.1 Action primitives without dialog hooks

```tsx
import {
  Actions,
  useDeleteAction,
  useExportAction,
  useImportAction,
  useRestoreAction,
  type BaseEntityDto,
} from "@sito/dashboard-app";

export function ProductActionsBar({ record }: { record: BaseEntityDto }) {
  const { action: deleteAction } = useDeleteAction({
    onClick: (ids) => api.products.softDelete(ids),
  });

  const { action: restoreAction } = useRestoreAction({
    onClick: (ids) => api.products.restore(ids),
  });

  const { action: exportAction } = useExportAction({
    onClick: () => api.products.export(),
  });

  const { action: importAction } = useImportAction({
    onClick: () => openImportDialog(),
  });

  return (
    <Actions
      actions={[
        exportAction(),
        importAction(),
        deleteAction(record),
        restoreAction(record),
      ]}
    />
  );
}
```

## 5. Form primitives (`useMutationForm` + `FormContainer` + input components)

```tsx
import { Controller } from "react-hook-form";
import {
  FormContainer,
  ParagraphInput,
  PasswordInput,
  State,
  TextInput,
  useMutationForm,
  type BaseEntityDto,
} from "@sito/dashboard-app";

type ProductForm = {
  name: string;
  description: string;
  adminPassword: string;
};

interface ProductDto extends BaseEntityDto {
  name: string;
  description: string;
}

type CreateProductDto = {
  name: string;
  description: string;
  adminPassword: string;
};

export function CreateProductForm() {
  const form = useMutationForm<
    ProductDto,
    CreateProductDto,
    ProductDto,
    ProductForm
  >({
    defaultValues: {
      name: "",
      description: "",
      adminPassword: "",
    },
    queryKey: ["products"],
    mutationFn: (payload) => api.products.insert(payload),
    formToDto: (values) => values,
    onSuccessMessage: "Product created",
  });

  return (
    <FormContainer<ProductForm> {...form}>
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => (
          <TextInput {...field} label="Name" placeholder="Product name" />
        )}
      />

      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <ParagraphInput
            {...field}
            label="Description"
            helperText="Explain what this product does"
            state={State.default}
            placeholder="Type details"
          />
        )}
      />

      <Controller
        name="adminPassword"
        control={form.control}
        render={({ field }) => (
          <PasswordInput
            {...field}
            state={State.default}
            label="Admin password"
            placeholder="Required to publish"
          />
        )}
      />
    </FormContainer>
  );
}
```

## 6. Form modal patterns: state, create, and edit

```tsx
import { useState } from "react";
import { Controller } from "react-hook-form";
import {
  FormDialog,
  useFormDialog,
  usePostDialog,
  usePutDialog,
  type BaseEntityDto,
  type DeleteDto,
  type ButtonPropsType,
} from "@sito/dashboard-app";

type ProductForm = {
  name: string;
  price: number;
};

interface ProductDto extends BaseEntityDto {
  name: string;
  price: number;
}

type UpsertProductDto = DeleteDto & ProductForm;

type ProductFilters = {
  search: string;
  minPrice: number;
};

export function ProductDialogs() {
  const [tableFilters, setTableFilters] = useState<ProductFilters>({
    search: "",
    minPrice: 0,
  });
  const [lastSubmittedFilters, setLastSubmittedFilters] =
    useState<ProductFilters>({
      search: "",
      minPrice: 0,
    });

  const filtersDialog = useFormDialog<ProductFilters>({
    mode: "state",
    title: "Filters",
    defaultValues: { search: "", minPrice: 0 },
    reinitializeOnOpen: true,
    dtoToForm: (data) => ({ ...data, ...tableFilters }),
    onSubmit: (values) => {
      setTableFilters(values);
      setLastSubmittedFilters(values);
    },
  });

  const openFiltersWithLastSubmitted = () => {
    filtersDialog.openDialog({ values: lastSubmittedFilters });
  };

  const createDialog = usePostDialog<
    Omit<ProductDto, "id" | "createdAt" | "updatedAt" | "deletedAt">,
    ProductDto,
    ProductForm
  >({
    title: "Create product",
    defaultValues: { name: "", price: 0 },
    mutationFn: (dto) => api.products.insert(dto),
    formToDto: (form) => ({ name: form.name, price: form.price }),
    queryKey: ["products"],
  });

  const editDialog = usePutDialog<
    ProductDto,
    UpsertProductDto,
    ProductDto,
    ProductForm
  >({
    title: "Edit product",
    defaultValues: { name: "", price: 0 },
    getFunction: (id) => api.products.getById(id),
    dtoToForm: (dto) => ({ name: dto.name, price: dto.price }),
    mutationFn: (dto) => api.products.update(dto),
    formToDto: (form, dto) => ({ id: dto?.id ?? 0, ...form }),
    queryKey: ["products"],
  });

  const extraActions: ButtonPropsType[] = [
    {
      id: "save-draft",
      type: "button",
      variant: "outlined",
      color: "secondary",
      children: "Save draft",
      onClick: () => saveDraft(),
    },
  ];

  return (
    <>
      <button type="button" onClick={openFiltersWithLastSubmitted}>
        Open filters with last submitted values
      </button>

      <FormDialog<ProductFilters> {...filtersDialog}>
        <Controller
          name="search"
          control={filtersDialog.control}
          render={({ field }) => (
            <input {...field} className="text-input" placeholder="Search" />
          )}
        />
      </FormDialog>

      <FormDialog<ProductForm> {...createDialog} extraActions={extraActions}>
        <Controller
          name="name"
          control={createDialog.control}
          rules={{ required: true }}
          render={({ field }) => (
            <input {...field} className="text-input" placeholder="Name" />
          )}
        />
      </FormDialog>

      <FormDialog<ProductForm> {...editDialog}>
        <Controller
          name="name"
          control={editDialog.control}
          rules={{ required: true }}
          render={({ field }) => (
            <input {...field} className="text-input" placeholder="Name" />
          )}
        />
      </FormDialog>
    </>
  );
}
```

Storybook reference: see `Hooks/Dialogs/FormDialogs` -> `StateModeSetValuesOnOpen` and `StateModeReopenWithSubmittedValues`.

## 7. Base dialog control with `useDialog` + `DialogActions`

```tsx
import { Dialog, DialogActions, useDialog } from "@sito/dashboard-app";

export function RawDialogExample() {
  const { open, handleOpen, handleClose } = useDialog();

  return (
    <>
      <button type="button" onClick={handleOpen}>
        Open
      </button>

      <Dialog open={open} title="Quick dialog" handleClose={handleClose}>
        <p>Body content</p>
        <DialogActions
          primaryText="Confirm"
          cancelText="Cancel"
          onPrimaryClick={handleClose}
          onCancel={handleClose}
          extraActions={[
            {
              id: "secondary-help",
              type: "button",
              variant: "text",
              children: "Help",
              onClick: () => openHelp(),
            },
          ]}
        />
      </Dialog>
    </>
  );
}
```

## 8. Import flows with `ImportDialog` / `useImportDialog`

`ImportDialog` accepts `extraFields` to inject custom inputs (checkboxes,
selects, etc.) between the preview and the footer actions.

`useImportDialog` adds an optional third generic `TExtra` plus two new props:

- `defaultExtra?: TExtra` — initial value for the extra fields.
- `renderExtraFields?: ({ values, setValue, setValues }) => ReactNode` — render
  prop owned by the hook; the returned node is wired into `ImportDialog` through
  the `extraFields` slot.

The hook merges the extra values into the mutation payload as
`{ items, override, ...extra }`. `mutationFn` is typed as
`ImportDto<TPreview> & TExtra`.

```tsx
import {
  ImportDialog,
  useImportDialog,
  type BaseEntityDto,
  type ButtonPropsType,
  type ImportPreviewDto,
} from "@sito/dashboard-app";

interface ProductDto extends BaseEntityDto {
  name: string;
  price: number;
}

interface ProductImportPreviewDto extends ImportPreviewDto {
  id: number;
  name: string;
  price: number;
}

export function ProductsImport() {
  const importDialog = useImportDialog<ProductDto, ProductImportPreviewDto>({
    queryKey: ["products"],
    entity: "products",
    mutationFn: (payload) => api.products.import(payload),
    fileProcessor: (file, options) =>
      parseProductsCsv(file, options?.override ?? false),
    renderCustomPreview: (items) => (
      <ProductsPreviewTable items={items ?? []} />
    ),
  });

  const extraActions: ButtonPropsType[] = [
    {
      id: "download-template",
      type: "button",
      variant: "outlined",
      color: "secondary",
      children: "Download template",
      onClick: () => downloadTemplate(),
    },
  ];

  return (
    <>
      <button type="button" onClick={() => importDialog.action().onClick?.()}>
        Import
      </button>

      <ImportDialog<ProductImportPreviewDto>
        {...importDialog}
        extraActions={extraActions}
      />
    </>
  );
}
```

### 8.1 Extra fields wired by the hook

```tsx
import {
  ImportDialog,
  useImportDialog,
  type BaseEntityDto,
  type ImportPreviewDto,
} from "@sito/dashboard-app";

interface TransactionDto extends BaseEntityDto {
  amount: number;
  description: string;
}

interface TransactionImportPreviewDto extends ImportPreviewDto {
  amount: number;
  description: string;
}

type ExtraImport = {
  useCurrentAccount: boolean;
  note: string;
};

export function TransactionsImport({
  currentAccountId,
}: {
  currentAccountId: number;
}) {
  const importDialog = useImportDialog<
    TransactionDto,
    TransactionImportPreviewDto,
    ExtraImport
  >({
    queryKey: ["transactions"],
    entity: "transactions",
    fileProcessor: parseTransactionsFile,
    defaultExtra: { useCurrentAccount: true, note: "" },
    mutationFn: ({ items, override, useCurrentAccount, note }) =>
      api.transactions.import({
        items,
        override,
        accountId: useCurrentAccount ? currentAccountId : null,
        note,
      }),
    renderExtraFields: ({ values, setValue }) => (
      <div className="grid gap-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.useCurrentAccount}
            onChange={(e) => setValue("useCurrentAccount", e.target.checked)}
          />
          <span>Use current account</span>
        </label>
        <label className="grid gap-1">
          <span>Note</span>
          <input
            type="text"
            value={values.note}
            onChange={(e) => setValue("note", e.target.value)}
          />
        </label>
      </div>
    ),
  });

  return (
    <>
      <button type="button" onClick={() => importDialog.action().onClick?.()}>
        Import transactions
      </button>
      <ImportDialog<TransactionImportPreviewDto> {...importDialog} />
    </>
  );
}
```

Notes:

- The hook returns `extraFields` in its result and spreads into
  `ImportDialog` automatically via `{...importDialog}`. Do not duplicate
  `extraFields` manually.
- `defaultExtra` is also used to reset the form on dialog close/submit.
- For static custom inputs whose state lives in the parent component, use the
  component-level `extraFields` prop directly (see `CONSUMER_GUIDE.md` §5.4.1).

## 9. Tabs and onboarding flows (`TabsLayout` + `Onboarding`)

```tsx
import { useState } from "react";
import { Onboarding, TabsLayout } from "@sito/dashboard-app";

const tabs = [
  { id: 1, label: "General", content: <div>General settings</div> },
  { id: 2, label: "Permissions", content: <div>Permissions settings</div> },
];

export function SettingsTabs() {
  const [tab, setTab] = useState(1);

  return (
    <TabsLayout
      tabs={tabs}
      currentTab={tab}
      onTabChange={(id) => setTab(Number(id))}
      useLinks={false}
      tabButtonProps={{ variant: "outlined", color: "secondary" }}
    />
  );
}

export function WelcomeOnboarding() {
  return (
    <Onboarding
      remountStepOnChange
      steps={[
        {
          title: "Welcome",
          body: "This flow explains the main features.",
        },
        {
          title: "Set up your workspace",
          body: "You can inject custom step content.",
          content: <WorkspaceChecklist />,
          image: "/images/onboarding-workspace.png",
          alt: "Workspace setup preview",
        },
      ]}
      signInPath="/auth/sign-in"
      guestPath="/"
    />
  );
}
```

`remountStepOnChange` is opt-in (default `false`). Set it to `true` for wizard-style flows where every step should replay its entry animation (`onboarding-step-rise-in` for title/body/content with stagger 30ms/90ms/140ms, `onboarding-step-pop-in` for actions with stagger 180ms/230ms). The animations are gated by `ConfigProvider.motion` (`auto`/`none`/`always`) and respect `prefers-reduced-motion`.

## 10. Dynamic navbar title/slot with `useNavbar`

```tsx
import { useEffect } from "react";
import { useNavbar } from "@sito/dashboard-app";

export function OrdersPage() {
  const { setTitle, setRightContent } = useNavbar();

  useEffect(() => {
    setTitle("Orders");
    setRightContent(<button type="button">New order</button>);

    return () => {
      setTitle("");
      setRightContent(null);
    };
  }, [setTitle, setRightContent]);

  return <div>...</div>;
}
```

## 11. Feedback patterns (`Error`, `Empty`, `SplashScreen`, `ToTop`, `IconButton`)

```tsx
import {
  Empty,
  Error as ErrorComponent,
  IconButton,
  SplashScreen,
  ToTop,
} from "@sito/dashboard-app";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

export function FeedbackExamples({
  isLoading,
  error,
  onRetry,
}: {
  isLoading: boolean;
  error: globalThis.Error | null;
  onRetry: () => void;
}) {
  if (isLoading) return <SplashScreen />;

  if (error) {
    return <ErrorComponent error={error} onRetry={onRetry} />;
    // Custom mode alternative:
    // return <ErrorComponent><MyCustomErrorPanel /></ErrorComponent>;
  }

  return (
    <>
      <Empty message="No records found" />

      <IconButton
        type="button"
        icon={faRotateRight}
        variant="outlined"
        color="secondary"
        onClick={onRetry}
      />

      <ToTop
        threshold={120}
        tooltip="Back to top"
        variant="outlined"
        color="secondary"
      />
    </>
  );
}
```

## 12. Notification patterns with `useNotification`

```tsx
import { useNotification } from "@sito/dashboard-app";
import { NotificationEnumType } from "@sito/dashboard-app";

export function SaveButton() {
  const {
    showSuccessNotification,
    showErrorNotification,
    showStackNotifications,
  } = useNotification();

  const onSave = async () => {
    try {
      await api.products.insert({ name: "Milk", price: 3 });
      showSuccessNotification({ message: "Saved" });
    } catch {
      showErrorNotification({ message: "Save failed" });
      showStackNotifications([
        { message: "Name is required", type: NotificationEnumType.error },
        { message: "Price must be positive", type: NotificationEnumType.error },
      ]);
    }
  };

  return (
    <button type="button" onClick={onSave}>
      Save
    </button>
  );
}
```

## 13. Auth patterns with `useAuth` (`rememberMe`, guest mode)

```tsx
import { useAuth, type AuthDto } from "@sito/dashboard-app";

export function SignInForm() {
  const { logUser, logUserFromLocal, logoutUser, isInGuestMode, setGuestMode } =
    useAuth();

  const onLogin = async () => {
    const credentials: AuthDto = {
      email: "user@mail.com",
      password: "secret",
      rememberMe: true,
    };

    const session = await api.auth.login(credentials);
    logUser(session, credentials.rememberMe);
  };

  return (
    <div>
      <button type="button" onClick={onLogin}>
        Sign in
      </button>
      <button type="button" onClick={() => logUserFromLocal()}>
        Restore session
      </button>
      <button type="button" onClick={() => logoutUser()}>
        Logout
      </button>
      <button type="button" onClick={() => setGuestMode(true)}>
        Continue as guest
      </button>
      <p>{isInGuestMode() ? "Guest mode" : "User mode"}</p>
    </div>
  );
}
```

## 14. Entity clients (`BaseClient`), offline fallback (`IndexedDBClient`), and Supabase (`SupabaseDataClient`)

```tsx
import {
  BaseClient,
  IndexedDBClient,
  SupabaseDataClient,
  type BaseCommonEntityDto,
  type BaseEntityDto,
  type BaseFilterDto,
  type DeleteDto,
  type ImportPreviewDto,
} from "@sito/dashboard-app";
import type { SupabaseClient } from "@supabase/supabase-js";

interface ProductDto extends BaseEntityDto {
  name: string;
  price: number;
}

interface ProductCommonDto extends BaseCommonEntityDto {
  name: string;
}

type ProductCreateDto = Omit<
  ProductDto,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

type ProductUpdateDto = DeleteDto & ProductCreateDto;

interface ProductFilterDto extends BaseFilterDto {
  category?: string;
}

interface ProductImportPreviewDto extends ImportPreviewDto {
  id: number;
  name: string;
}

class ProductsClient extends BaseClient<
  "products",
  ProductDto,
  ProductCommonDto,
  ProductCreateDto,
  ProductUpdateDto,
  ProductFilterDto,
  ProductImportPreviewDto
> {
  constructor(baseUrl: string) {
    super("products", baseUrl);
  }
}

class ProductsIndexedDBClient extends IndexedDBClient<
  "products",
  ProductDto,
  ProductCommonDto,
  ProductCreateDto,
  ProductUpdateDto,
  ProductFilterDto,
  ProductImportPreviewDto
> {
  constructor() {
    super("products", "my-app-db");
  }
}

class ProductsSupabaseClient extends SupabaseDataClient<
  "products",
  ProductDto,
  ProductCommonDto,
  ProductCreateDto,
  ProductUpdateDto,
  ProductFilterDto,
  ProductImportPreviewDto
> {
  constructor(supabase: SupabaseClient) {
    super("products", supabase);
  }
}

export const productsClient = navigator.onLine
  ? new ProductsClient(import.meta.env.VITE_API_URL)
  : new ProductsIndexedDBClient();
```

### 14.1 Sharing a `dbName` across multiple `IndexedDBClient` instances

When several entity clients belong to the same logical database, construct them with the same `dbName`. The client's internal registry tracks every `table`, and opens are serialized per `dbName` so concurrent CRUD is safe and no previously registered store is dropped by later opens.

```ts
class UsersIndexedDBClient extends IndexedDBClient<
  "users",
  UserDto,
  UserCommonDto,
  UserCreateDto,
  UserUpdateDto,
  UserFilterDto,
  UserImportPreviewDto
> {
  constructor() {
    super("users", "my-app-db");
  }
}

class AccountsIndexedDBClient extends IndexedDBClient<
  "accounts",
  AccountDto,
  AccountCommonDto,
  AccountCreateDto,
  AccountUpdateDto,
  AccountFilterDto,
  AccountImportPreviewDto
> {
  constructor() {
    super("accounts", "my-app-db");
  }
}

const users = new UsersIndexedDBClient();
const accounts = new AccountsIndexedDBClient();

await Promise.all([
  users.insert({ name: "Alice", email: "alice@test.com" }),
  accounts.insert({ userId: 1, balance: 100 }),
]);
```

Notes:

- The effective open version is `max(registered versions, current db version)`; if a registered store is missing at open time, the version is bumped once and all registered stores are created in a single `onupgradeneeded` pass.
- Registering a new store after the database already exists is supported — the next `open()` detects the missing store and upgrades transparently.

## 15. Ready-to-use export action with `useExportActionMutate`

```tsx
import {
  Page,
  useExportActionMutate,
  type BaseEntityDto,
} from "@sito/dashboard-app";

interface ProductDto extends BaseEntityDto {
  name: string;
  price: number;
}

export function ProductsHeaderActions() {
  const exportProducts = useExportActionMutate<ProductDto[], "products", Error>(
    {
      entity: "products",
      mutationFn: () => api.products.export(),
      onSuccessMessage: "Export generated",
    },
  );

  return (
    <Page<ProductDto> title="Products" actions={[exportProducts.action()]}>
      {/* ... */}
    </Page>
  );
}
```

## 15.1 Export with configuration dialog using `useExportDialog`

Use `useExportDialog` when the export needs extra configuration (date range,
format, columns, etc.) before hitting the backend. The hook owns the dialog
state, the extra form, and the mutation; the returned `action()` shape matches
`useExportAction`, so `Page`/`Actions`/`PrettyGrid` consume it without changes.

```tsx
import {
  ExportDialog,
  Page,
  useExportDialog,
  type BaseEntityDto,
} from "@sito/dashboard-app";

interface TransactionDto extends BaseEntityDto {
  amount: number;
  description: string;
}

type ExportExtra = {
  from: string;
  to: string;
  format: "csv" | "xlsx";
};

export function TransactionsHeaderActions() {
  const exportDialog = useExportDialog<TransactionDto, ExportExtra, Blob>({
    entity: "transactions",
    defaultExtra: { from: "", to: "", format: "csv" },
    mutationFn: ({ from, to, format }) =>
      api.transactions.exportRange({ from, to, format }),
    renderExtraFields: ({ values, setValue }) => (
      <div className="grid gap-2">
        <label className="grid gap-1">
          <span>From</span>
          <input
            type="date"
            value={values.from}
            onChange={(e) => setValue("from", e.target.value)}
          />
        </label>
        <label className="grid gap-1">
          <span>To</span>
          <input
            type="date"
            value={values.to}
            onChange={(e) => setValue("to", e.target.value)}
          />
        </label>
        <label className="grid gap-1">
          <span>Format</span>
          <select
            value={values.format}
            onChange={(e) =>
              setValue("format", e.target.value as ExportExtra["format"])
            }
          >
            <option value="csv">CSV</option>
            <option value="xlsx">XLSX</option>
          </select>
        </label>
      </div>
    ),
  });

  return (
    <>
      <Page<TransactionDto>
        title="Transactions"
        actions={[exportDialog.action()]}
      >
        {/* ... */}
      </Page>
      <ExportDialog {...exportDialog} title="Export transactions" />
    </>
  );
}
```

Notes:

- The hook does **not** invalidate any query — export does not mutate server
  state. If your backend changes server state on export (rare), pass an
  `onSuccess` callback and trigger invalidation there.
- `defaultExtra` is used to reset the form on close/submit.
- Opt out anytime: switch back to `useExportAction` + `useExportActionMutate`
  for entities that don't need a dialog. The `action()` descriptor is
  interchangeable.
- The hook does **not** auto-trigger file download. `mutationFn` should return
  whatever your backend produces (Blob/url/void); handle the download in the
  consumer (e.g. trigger an anchor with the Blob in `onSuccess`).

## 16. Error handling guards (`isValidationError`, `isHttpError`)

```tsx
import {
  NotificationEnumType,
  isHttpError,
  isValidationError,
  useNotification,
} from "@sito/dashboard-app";

export function ApiActionButton() {
  const { showErrorNotification, showStackNotifications } = useNotification();

  const onClick = async () => {
    try {
      await api.products.insert({});
    } catch (error) {
      if (isValidationError(error)) {
        showStackNotifications(
          error.errors.map(([field, message]) => ({
            type: NotificationEnumType.error,
            message: `${field}: ${message}`,
          })),
        );
        return;
      }

      if (isHttpError(error)) {
        showErrorNotification({
          message: `${error.status} - ${error.message}`,
        });
        return;
      }

      showErrorNotification({ message: "Unknown error" });
    }
  };

  return (
    <button type="button" onClick={onClick}>
      Run API action
    </button>
  );
}
```

## 17. Utility hooks (`useTimeAge`, `useScrollTrigger`)

```tsx
import { useTimeAge, useScrollTrigger } from "@sito/dashboard-app";

export function RelativeDateBadge({ createdAt }: { createdAt: Date }) {
  const { timeAge } = useTimeAge();
  const compact = useScrollTrigger(120);

  return <span>{compact ? "..." : timeAge(createdAt)}</span>;
}
```

## 18. Recipe usage recommendations

1. Keep provider order exactly as in section 1.
2. Use the same `queryKey` between listing and mutate/dialog hooks.
3. Always pass generics for entity-driven components and hooks.
4. Reuse official extension points (`extraActions`, `renderCustomPreview`, `tabButtonProps`) before forking components.
5. Keep auth storage keys aligned between `AuthProvider` and `IManager`/client auth config.
6. Prefer `update(value)` in `IndexedDBClient` consumers; keep `(id, value)` only for transitional code.
7. Prefer `useExportActionMutate` for export flows to keep loading and notifications consistent.
