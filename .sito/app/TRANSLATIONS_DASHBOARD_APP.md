# Required translations for `@sito/dashboard-app`

This document lists **only** the i18n keys used directly by `@sito/dashboard-app`.
It does not replace the translation documentation for `@sito/dashboard`.

## 1. Static keys

### `_accessibility`

- `_accessibility:actions.retry`
- `_accessibility:ariaLabels.cancel`
- `_accessibility:ariaLabels.closeDialog`
- `_accessibility:ariaLabels.closeMenu`
- `_accessibility:ariaLabels.closeNotification`
- `_accessibility:ariaLabels.hidePassword`
- `_accessibility:ariaLabels.next`
- `_accessibility:ariaLabels.ok`
- `_accessibility:ariaLabels.openMenu`
- `_accessibility:ariaLabels.showPassword`
- `_accessibility:ariaLabels.skip`
- `_accessibility:ariaLabels.start`
- `_accessibility:ariaLabels.submit`
- `_accessibility:buttons.back`
- `_accessibility:buttons.cancel`
- `_accessibility:buttons.closeDialog`
- `_accessibility:buttons.closeNotification`
- `_accessibility:buttons.next`
- `_accessibility:buttons.ok`
- `_accessibility:buttons.openMenu`
- `_accessibility:buttons.signIn`
- `_accessibility:buttons.skip`
- `_accessibility:buttons.startAsGuest`
- `_accessibility:buttons.submit`
- `_accessibility:buttons.toTop`
- `_accessibility:errors.500`
- `_accessibility:errors.unknownError`
- `_accessibility:labels.ago`
- `_accessibility:labels.file`
- `_accessibility:labels.hour`
- `_accessibility:labels.hours`
- `_accessibility:labels.justNow`
- `_accessibility:labels.minute`
- `_accessibility:labels.minutes`
- `_accessibility:labels.yesterday`
- `_accessibility:messages.empty`

### `_pages`

- `_pages:common.actions.delete.dialog.title`
- `_pages:common.actions.delete.successMessage`
- `_pages:common.actions.delete.text`
- `_pages:common.actions.edit.text`
- `_pages:common.actions.export.successMessage`
- `_pages:common.actions.export.text`
- `_pages:common.actions.import.dialog.title`
- `_pages:common.actions.import.override`
- `_pages:common.actions.import.previewCount`
- `_pages:common.actions.import.text`
- `_pages:common.actions.refresh.text`
- `_pages:common.actions.restore.dialog.title`
- `_pages:common.actions.restore.successMessage`
- `_pages:common.actions.restore.text`
- `_pages:home.appName`

### `_messages`

- `_messages:errors.parseFile`
- `_messages:loading.processingFile`

## 2. Dynamic keys (templates)

These are not single fixed keys. They are built at runtime and must exist based on your entities/routes/errors.

- `_accessibility:ariaLabels.${child.id}`
- `_accessibility:ariaLabels.${String(link.page)}`
- `_accessibility:errors.${unknownErr.status}`
- `_entities:${queryKey}.${key}.${message}`
- `_pages:${entity}.title`
- `_pages:${key}.errors.${message}`
- `_pages:${String(link.page)}.title`
- `_pages:${link.page}.title`

## 3. Notes

- `Onboarding` no longer reads copy from internal onboarding keys. `title` and `body` are passed through props.
- If any of these keys already exists in your translation resources from other packages, you do not need to duplicate it. Just ensure it is defined.
