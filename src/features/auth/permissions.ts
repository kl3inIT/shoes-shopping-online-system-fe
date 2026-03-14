import type { User, UserProfile } from 'oidc-client-ts';

import { client_id } from './oidcConfig';

export const APP_ROLES = ['admin', 'manager', 'user'] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const PERMISSIONS = {
  dashboardView: 'dashboard.view',
  notificationsManage: 'notifications.manage',
  productsManage: 'products.manage',
  ordersManage: 'orders.manage',
  brandsManage: 'brands.manage',
  categoriesManage: 'categories.manage',
  reviewsModerate: 'reviews.moderate',
  usersManage: 'users.manage',
  aiManage: 'ai.manage',
  cartManage: 'cart.manage',
  wishlistManage: 'wishlist.manage',
  checkoutCreate: 'checkout.create',
  profileReadOwn: 'profile.read.own',
  ordersReadOwn: 'orders.read.own',
} as const;

export type AppPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type PermissionRequirement =
  | AppPermission
  | {
      allOf?: AppPermission[];
      anyOf?: AppPermission[];
    };

type KeycloakResourceAccess = Record<string, { roles?: string[] } | undefined>;

type KeycloakClaims = {
  realm_access?: {
    roles?: string[];
  };
  resource_access?: KeycloakResourceAccess;
};

type KeycloakProfile = UserProfile & KeycloakClaims;
type AuthUserLike = Pick<User, 'profile' | 'access_token'>;

const ROLE_ALIAS_MAP: Record<string, AppRole> = {
  admin: 'admin',
  administrator: 'admin',
  'role-admin': 'admin',
  manager: 'manager',
  'role-manager': 'manager',
  user: 'user',
  customer: 'user',
  'role-customer': 'user',
};

const ROLE_PERMISSION_MAP: Record<AppRole, readonly AppPermission[]> = {
  admin: Object.values(PERMISSIONS),
  manager: [
    PERMISSIONS.dashboardView,
    PERMISSIONS.notificationsManage,
    PERMISSIONS.productsManage,
    PERMISSIONS.ordersManage,
    PERMISSIONS.brandsManage,
    PERMISSIONS.categoriesManage,
    PERMISSIONS.reviewsModerate,
    PERMISSIONS.cartManage,
    PERMISSIONS.wishlistManage,
    PERMISSIONS.checkoutCreate,
    PERMISSIONS.profileReadOwn,
    PERMISSIONS.ordersReadOwn,
  ],
  user: [
    PERMISSIONS.cartManage,
    PERMISSIONS.wishlistManage,
    PERMISSIONS.checkoutCreate,
    PERMISSIONS.profileReadOwn,
    PERMISSIONS.ordersReadOwn,
  ],
};

function normalizeRoleName(role: string) {
  return role.trim().toLowerCase().replaceAll('_', '-').replaceAll(' ', '-');
}

function hasAccessToken(
  source: AuthUserLike | UserProfile
): source is AuthUserLike {
  return (
    'access_token' in source &&
    typeof (source as { access_token?: unknown }).access_token === 'string'
  );
}

function decodeJwtPayload(token?: string | null): KeycloakClaims | null {
  if (!token) {
    return null;
  }

  const [, payload] = token.split('.');

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload.replaceAll('-', '+').replaceAll('_', '/');
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      '='
    );

    return JSON.parse(globalThis.atob(paddedPayload)) as KeycloakClaims;
  } catch (error) {
    console.warn('[Auth] Failed to decode JWT payload for permissions:', error);
    return null;
  }
}

export function extractKeycloakRoles(
  source?: AuthUserLike | UserProfile | null,
  options?: {
    clientId?: string;
    additionalClientIds?: string[];
  }
) {
  if (!source) {
    return [];
  }

  const keycloakProfile = (
    'profile' in source ? source.profile : source
  ) as KeycloakProfile;
  const accessTokenClaims = hasAccessToken(source)
    ? decodeJwtPayload(source.access_token)
    : null;
  const clientIds = new Set<string>(
    [options?.clientId ?? client_id, ...(options?.additionalClientIds ?? [])]
      .filter(Boolean)
      .map((value) => value.trim())
  );

  const realmRoles = [
    ...(keycloakProfile.realm_access?.roles ?? []),
    ...(accessTokenClaims?.realm_access?.roles ?? []),
  ];
  const clientRoles = [...clientIds].flatMap((clientKey) => [
    ...(keycloakProfile.resource_access?.[clientKey]?.roles ?? []),
    ...(accessTokenClaims?.resource_access?.[clientKey]?.roles ?? []),
  ]);

  return [...new Set([...realmRoles, ...clientRoles].map(normalizeRoleName))];
}

export function resolveAppRoles(keycloakRoles: readonly string[]) {
  const resolvedRoles = keycloakRoles.flatMap((roleName) => {
    const appRole = ROLE_ALIAS_MAP[roleName];
    return appRole ? [appRole] : [];
  });

  if (resolvedRoles.length === 0) {
    return [] as AppRole[];
  }

  return [...new Set(resolvedRoles)];
}

export function buildPermissionSet(roles: readonly AppRole[]) {
  return new Set(roles.flatMap((role) => ROLE_PERMISSION_MAP[role] ?? []));
}

export function hasPermission(
  permissionSet: ReadonlySet<AppPermission>,
  requirement?: PermissionRequirement
) {
  if (!requirement) {
    return true;
  }

  if (typeof requirement === 'string') {
    return permissionSet.has(requirement);
  }

  const { allOf, anyOf } = requirement;

  const passesAllOf =
    !allOf || allOf.every((permission) => permissionSet.has(permission));
  const passesAnyOf =
    !anyOf || anyOf.some((permission) => permissionSet.has(permission));

  return passesAllOf && passesAnyOf;
}

export function getAccessSnapshot(source?: AuthUserLike | UserProfile | null) {
  const keycloakRoles = extractKeycloakRoles(source);
  const roles = resolveAppRoles(keycloakRoles);
  const permissionSet = buildPermissionSet(roles);

  return {
    keycloakRoles,
    roles,
    roleSet: new Set(roles),
    permissionSet,
  };
}
