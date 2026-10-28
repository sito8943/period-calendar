# Changelog

Este archivo documenta cambios relevantes del proyecto.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) y versionado semantico.

## [Unreleased]

### Added

- Documentacion inicial de proyecto en `README.md`.
- Registro historico inicial en `CHANGELOG.md`.
- Modo oscuro con preferencia `Sistema` / `Claro` / `Oscuro` guardada por dispositivo (`localStorage`, clave `period-calendar:color-theme`). Nuevo `ThemeProvider` (`src/providers/Theme`) que alterna la clase `.dark` en `<html>`, sigue los cambios del sistema en vivo y actualiza `<meta name="theme-color">`; un script inline en `index.html` aplica el tema guardado antes de montar React (sin destello claro).
- Paleta oscura en `src/styles/variables.css` con los mismos nombres de tokens (superficies neutras, marca chica/chico, colores del calendario: periodo, fertil, ovulacion, prediccion), mas los tokens `--color-on-brand` (texto sobre rellenos de marca) y `--color-text-primary` (marca usada como texto). Overrides `.dark` en `dashboard.css` para los selectores de `@sito/dashboard-app` que usan `base-light` como color de texto.
- Seccion "Apariencia" en Perfil con selector de tema (es/en); se aplica al instante, sin boton de guardar. Es independiente del perfil chica/chico.

### Changed

- Migracion de persistencia de `periods` y `daily-logs` a clientes offline basados en `IndexedDBClient` (`@sito/dashboard-app`).
- Nueva base `period-calendar-offline-db` con stores `periods` y `dailyLogs`.
- Migracion automatica inicial que combina datos legados desde `localStorage` y desde la base IndexedDB previa (`period-calendar-db`).
- Fallback operativo a `localStorage` cuando IndexedDB no esta disponible.
- Actualizacion de `@sito/dashboard-app` de `0.2.0` a `0.3.0`. Se agregan como dependencias directas sus peers `@sito/dashboard` (`0.4.2`) y `@sito/ui` (`0.10.1`), que desde `0.2.7` ya no se instalan transitivamente. Incluye el fondo corregido de cabecera/acciones de dialogos y el color legible de opciones resaltadas en temas oscuros.

## [0.0.0] - 2026-04-04

### Added

- Base de aplicacion React + TypeScript + Vite.
- Navegacion principal con rutas para Home, registro de periodo, diario diario, historial y perfil.
- Persistencia local con `localStorage` para periodos, diario diario, configuracion y perfil.
- Calculo de estadisticas de ciclo y prediccion de proximo periodo.
- Soporte i18n para `es` y `en` con variantes de tema.
- Onboarding inicial y seleccion de tema visual.
