# Propuesta de Migración a `@sito/dashboard-app`

Fecha: 2026-05-04  
Apps analizadas: `period-calendar`, `wallet`, `notes`

## 1. Objetivo

Extraer a `@sito/dashboard-app` piezas transversales (no de dominio) que hoy están repetidas en varias apps, para reducir duplicación y facilitar mantenimiento.

## 2. Criterio de migración

Una pieza se migra si cumple todo:

1. Existe en 2+ apps con implementación muy similar.
2. No depende del dominio de negocio (periodos, transacciones, notas).
3. Puede configurarse por props/options sin romper compatibilidad.
4. Aporta mantenimiento centralizado real.

## 3. Qué migrar (priorizado)

## P0 (alto impacto / bajo riesgo)

### 3.1 `useOnlineStatus` + `OfflineBanner`

Problema actual:

1. `wallet` y `notes` repiten hooks/infra de conectividad.
2. El banner offline es UI transversal.

Propuesta en librería:

1. `useOnlineStatus(options?)`
2. `OfflineBanner` desacoplado del dominio

API mínima sugerida:

```ts
export type OnlineStatus = {
  isOnline: boolean;
  isChecking: boolean;
  lastCheckedAt: number | null;
};

export type UseOnlineStatusOptions = {
  checkIntervalMs?: number;
  probeUrl?: string;
  timeoutMs?: number;
};

export function useOnlineStatus(
  options?: UseOnlineStatusOptions,
): OnlineStatus;

export type OfflineBannerProps = {
  isOnline?: boolean;
  message?: string;
  className?: string;
};
```

### 3.2 Helper genérico de `menuMap` con feature flags

Problema actual:

1. Las 3 apps repiten filtrado por feature flags.
2. También repiten cleanup de dividers consecutivos.

Propuesta en librería:

1. `filterMenuByFeatureFlags(items, isFeatureEnabled, dependencies)`
2. `normalizeMenuDividers(items)`

API mínima sugerida:

```ts
type FeatureEnabledFn<K extends string> = (key: K) => boolean;

type MenuItem<K extends string> = {
  type?: "divider";
  page?: string;
  [key: string]: unknown;
};

export function filterMenuByFeatureFlags<
  Item extends MenuItem<FeatureKey>,
  FeatureKey extends string,
>(
  items: Item[],
  isFeatureEnabled: FeatureEnabledFn<FeatureKey>,
  dependencies: Partial<Record<NonNullable<Item["page"]>, FeatureKey>>,
): Item[];

export function normalizeMenuDividers<Item extends { type?: "divider" }>(
  items: Item[],
): Item[];
```

## P1 (alto valor / riesgo medio)

### 3.3 Composer base de providers

Problema actual:

1. `wallet` y `notes` tienen casi el mismo árbol de providers.
2. `period-calendar` comparte parte del stack (`Notification`, `Translation`, `FeatureFlags`), con otra estrategia de auth.

Propuesta en librería:

1. `createAppProviders(config)` o componente `AppProviders`.
2. Variantes configurables para:
3. `AuthProvider` (activable/desactivable)
4. `FeatureFlagsProvider` custom
5. `OfflineSyncProvider` opcional
6. Wrapper custom por app para casos especiales

Objetivo:

1. Compartir orden y wiring base.
2. Permitir inyectar providers propios sin acoplar dominio.

## P2 (evaluar según cobertura existente)

### 3.4 UI genérica repetida entre `wallet` y `notes`

Piezas candidatas:

1. `Search` wrapper genérico
2. `Tutorial` base
3. `Card`/`Accordion` si su contrato visual ya es estable

Condición:

1. Mover solo si no rompe personalizaciones visuales actuales.

## 4. Qué NO migrar

1. Vistas de negocio: `PeriodLog`, `DailyLog`, `Transactions`, `Notes`, etc.
2. `routes` concretas por app y contenido final de `menuMap`.
3. API clients y entidades de dominio (`lib/api`, `lib/entities` por app).
4. Lógica de negocio de cada vertical.

## 5. Plan de rollout

## Fase 1

1. Extraer `useOnlineStatus` + `OfflineBanner`.
2. Publicar versión menor de `@sito/dashboard-app`.
3. Migrar `notes` y `wallet` primero.

## Fase 2

1. Extraer helpers de menú con feature flags.
2. Migrar `menuMap` en las 3 apps manteniendo comportamiento.

## Fase 3

1. Introducir composer de providers.
2. Adoptar en `notes` y `wallet`.
3. Evaluar adaptación de `period-calendar` con variante Supabase.

## Fase 4

1. Revisar componentes UI genéricos.
2. Mover solo lo que tenga contrato estable y pruebas.

## 6. Criterios de aceptación

1. No hay regresiones funcionales en navegación, auth u offline.
2. Las 3 apps compilan y renderizan igual en rutas equivalentes.
3. Se elimina duplicación real de código (medible por archivos borrados/locales simplificados).
4. Nuevas APIs en `@sito/dashboard-app` tienen tests unitarios.
5. Changelog documenta breaking/non-breaking changes.

## 7. Riesgos y mitigación

Riesgos:

1. Sobre-generalización prematura.
2. Acoplar librería a detalles de una app.
3. Romper comportamiento existente por cambios de defaults.

Mitigación:

1. Empezar por P0.
2. Mantener APIs pequeñas y explícitas.
3. Migrar app por app con feature branch y smoke tests manuales.

## 8. Checklist para Codex de la librería

1. Crear módulos P0 (`useOnlineStatus`, `OfflineBanner`, helpers de menú).
2. Añadir tests unitarios para casos edge (online/offline intermitente, dividers extremos).
3. Publicar release canary.
4. Preparar ejemplos de integración para `notes` y `wallet`.
5. Definir plan de deprecación de utilidades locales repetidas.
