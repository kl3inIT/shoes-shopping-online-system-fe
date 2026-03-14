# RBAC Architecture

## Role sources

- Keycloak client roles are the source of truth for UI access.
- This app currently maps `ROLE_ADMIN`, `ROLE_MANAGER`, and `ROLE_CUSTOMER` into app roles `admin`, `manager`, and `user`.
- Role parsing lives in [permissions.ts](/D:/Study materials spring 2026/SBA301/project/shoes-shopping-online-system-fe/src/features/auth/permissions.ts) so token-shape knowledge stays inside the auth layer.

## Responsibility boundaries

- Auth layer: normalize Keycloak claims, map roles to permissions, and expose `usePermission`.
- Routing layer: use `ProtectedRoute` for authentication and `RequirePermission` for authorization.
- Layout layer: render only navigation items already filtered by permissions.
- Feature layer: describe business rules in terms of permissions, not raw roles.

## Permission primitives

- `usePermission`: the single read API for roles and permissions in React components.
- `RequirePermission`: route-level guard for authenticated pages that require a specific capability.
- `PermissionGuard`: UI-level guard for conditional actions, menu items, and panels.

## Routing strategy

- Wrap authenticated areas with `ProtectedRoute`.
- Wrap admin layout with `RequirePermission(PERMISSIONS.dashboardView)` so only admin and manager can enter `/admin`.
- Add narrower `RequirePermission` wrappers for sensitive pages like `/admin/users`.
- Prefer layout-level protection when an entire route subtree shares the same capability.
- Prefer page-level protection when only one child page is more sensitive than its siblings.

## Business rules

- Home dropdown:
  - Admin sees `Admin Dashboard`.
  - Manager sees `Dashboard`.
  - User sees no dashboard entry.
- Dashboard:
  - Admin and manager can access `/admin`.
  - Only admin can access `/admin/users`.

## Sidebar strategy

- Permission metadata should live in config.
- Filtering should live in a hook.
- Layout should only render the filtered result.

That keeps the sidebar declarative and prevents the layout from knowing role names directly.

## UX rules

- Unauthenticated user: redirect to login through `ProtectedRoute`.
- Authenticated but unauthorized user: redirect to `/403`.
- Hide entire modules the user can never use.
- Disable controls only when the user should understand the feature exists but is unavailable in the current context.
- During auth loading, render nothing or a loading shell to avoid flashing unauthorized UI.

## Scalability

- Add new roles by extending the role-to-permission map.
- Add new permissions without changing route or component contracts.
- Feature flags can be layered on top of permissions by combining checks in `usePermission`.
- Backend-driven permissions can replace static role mapping later if the backend returns capability lists; the rest of the app can keep calling `usePermission`.
