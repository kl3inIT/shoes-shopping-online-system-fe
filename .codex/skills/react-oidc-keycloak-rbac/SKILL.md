---
name: react-oidc-keycloak-rbac
description: Use when working on React apps that use Keycloak with react-oidc-context, especially for route protection, role parsing, RBAC, token storage, protected API calls, and auth-related bugs. Applies to cases where roles may exist in the access token but not in user.profile, or where loaders/services need tokens outside React components.
---

# React OIDC Keycloak RBAC

Use this skill when the app uses `react-oidc-context` with Keycloak.

## Core rules

- Treat `auth.user.profile` as identity claims only.
- Treat Keycloak roles as coming from `auth.user.access_token` unless you have explicitly confirmed they are present in the ID token or userinfo payload.
- For Keycloak client roles, read `resource_access[clientId].roles`.
- For Keycloak realm roles, read `realm_access.roles`.
- Normalize role names before mapping them to app roles or permissions.

## Important implementation detail

With `react-oidc-context`, the object stored in local storage contains:

- `profile`: usually ID token claims
- `access_token`: bearer token used for API authorization

Do not assume `profile` contains Keycloak roles. In many setups it does not.

## Recommended architecture

- Auth layer:
  - Parse token claims.
  - Map external roles to internal app roles.
  - Map roles to permissions.
- Routing layer:
  - One guard for authentication.
  - One guard for authorization.
- UI layer:
  - Use permission-based guards/wrappers.
  - Avoid inline role checks in components.

## Loader and service rule

If a route loader, query prefetch, or non-React service needs a token:

- First prefer the active auth resolver.
- If the resolver is not registered yet, fall back to the `oidc-client-ts` user in local storage.
- Never rely on React hooks inside loaders or plain utilities.

## Debug checklist

If a user says "the token has the role but the UI still hides the feature":

1. Inspect the stored `User` object from `react-oidc-context`.
2. Compare `profile` claims vs `access_token` claims.
3. Verify the configured `client_id` matches the `resource_access` key.
4. Confirm role normalization matches the real Keycloak names like `ROLE_ADMIN`.
5. Check whether authorization is happening before the token resolver is ready.

## SaaS RBAC guidance

- Keep business rules permission-based, not role-name-based.
- Layouts should render from permission-filtered config.
- Sensitive routes should return `403`, not silently redirect home.
- Hide modules users can never use; disable controls only when temporary context matters.
