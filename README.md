# period-calendar

Aplicacion web para registrar periodos, llevar un diario diario y visualizar predicciones del ciclo. Esta app esta construida con React, TypeScript y Vite, con persistencia en IndexedDB (datos principales) y `localStorage` (preferencias).

## Caracteristicas

- Registro y edicion de periodos (`inicio` y `fin`).
- Diario por fecha con flujo, sintomas, actividad sexual, estado de animo, sueno y notas.
- Calendario mensual con estado por dia y prediccion del siguiente periodo.
- Estadisticas de ciclo: promedio, variacion y duracion.
- Historial de periodos con acceso a edicion.
- Perfil con nombre, nombre de pareja, idioma (`es`/`en`) y tema (`girl`/`boy`).
- Onboarding inicial con seleccion de tema.
- Interfaz responsive con navegacion inferior para mobile.

## Stack Tecnico

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- React Router 7
- TanStack Query 5
- i18next + react-i18next
- `@sito/dashboard-app` para componentes base (UI, notificaciones, onboarding, providers)
- Supabase (opcional) para persistencia remota autenticada

## Requisitos

- Node.js 18 o superior (recomendado 20+)
- npm 9 o superior

## Inicio Rapido

```bash
npm install
npm run dev
```

Servidor local por defecto: `http://localhost:5173`.

## Scripts

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: compila TypeScript y genera build de produccion.
- `npm run preview`: sirve localmente la build de produccion.
- `npm run lint`: ejecuta ESLint.

## Rutas Principales

- `/`: dashboard con calendario y resumen del ciclo.
- `/log`: alta de periodo.
- `/log/:id`: edicion de periodo existente.
- `/daily-log/:date`: diario de una fecha (`YYYY-MM-DD`).
- `/history`: historial de periodos.
- `/profile`: datos de perfil, idioma y tema.
- `/auth/sign-in`: inicio de sesion con Supabase.
- `/auth/sign-up`: registro con Supabase.
- `/sign-out`: cierre de sesion.

## Persistencia de Datos

No requiere backend para funcionar.

Opcionalmente puede usar Supabase cuando existe sesion autenticada y variables de entorno configuradas.
Setup completo (tablas + RLS, con script SQL listo para pegar en el SQL Editor): `SUPABASE_SETUP.md`.

Datos funcionales (IndexedDB):

- Base: `period-calendar-offline-db`
- Stores: `periods`, `dailyLogs`
- Implementacion: `IndexedDBClient` de `@sito/dashboard-app`

Preferencias y estado liviano (`localStorage`):

- `period-calendar:settings`
- `period-calendar:profile`
- `period-calendar:onboarding`
- `period-calendar:theme`
- `period-calendar:indexeddb-client-migrated:v2` (marca de migracion)

## Internacionalizacion

Idiomas soportados:

- `es`
- `en`
- variantes tematicas: `es-x-boy`, `en-x-boy`

Recursos en `src/lang/**`.

## Estructura del Proyecto

```text
period-calendar/
├─ src/
│  ├─ components/       # Calendar, PeriodCard, BottomNavigation
│  ├─ hooks/queries/    # Mutaciones y queries con TanStack Query
│  ├─ layouts/          # Layout principal (header/footer/onboarding)
│  ├─ lib/              # Logica de fechas, ciclo, tipos y storage
│  ├─ providers/        # Providers de app y accion de nav inferior
│  ├─ views/            # Home, PeriodLog, DailyLog, History, Profile
│  ├─ i18.ts            # Configuracion i18n
│  └─ main.tsx          # Entrada principal
├─ vite.config.ts       # Alias y optimizacion de chunks
└─ package.json
```

## Notas de Desarrollo

- El estado de datos se maneja con TanStack Query y fuentes locales.
- `periods` y `daily-logs` usan clientes offline sobre `IndexedDBClient`.
- La migracion inicial combina datos legados de `localStorage` y de la base IndexedDB anterior.
- El calculo de predicciones/estadisticas vive en `src/lib/cycle.ts`.
- El formulario de diario valida fechas ISO y evita duplicados por fecha.
