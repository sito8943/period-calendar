# Integration Recipes for `@sito/dashboard-app`

Copy-ready recipes for consumer projects.

This guide is intentionally broad: it covers the main usage path for every feature family exported by the package (providers, layout, dialogs, forms, hooks, notifications, auth, and clients).

## 1. Required provider bootstrap (correct order)

```tsx
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AuthProvider,
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
              <NavbarProvider>{children}</NavbarProvider>
            </DrawerMenuProvider>
          </NotificationProvider>
        </AuthProvider>
      </ManagerProvider>
    </ConfigProvider>
  );
}
```

## 2. Base app shell (Navbar + Drawer + Notification + ToTop)

```tsx
import { useMemo, useState } from "react";
import { faBox, faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Drawer,
  MenuItemType,
  Navbar,
  Notification,
  ToTop,
} from "@sito/dashboard-app";

type AppPages = "home" | "products";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    <>
      <Navbar openDrawer={() => setDrawerOpen(true)} showSearch />
      <Drawer<AppPages>
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        menuMap={menuMap}
      />

      {/* Mount once at app shell level */}
      <Notification />

      <main>{children}</main>
      <ToTop threshold={160} tooltip="Back to top" />
    </>
  );
}
```

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

`BottomNavigation` uses `ConfigProvider` routing primitives under the hood and renders only on mobile by default (`sm:hidden`).

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

## 5. Form primitives (`usePostForm` + `FormContainer` + input components)

```tsx
import { Controller } from "react-hook-form";
import {
  FormContainer,
  ParagraphInput,
  PasswordInput,
  State,
  TextInput,
  usePostForm,
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
  const form = usePostForm<
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
