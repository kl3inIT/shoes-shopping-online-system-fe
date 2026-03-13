import { useAuth } from 'react-oidc-context';

import {
  type AppRole,
  type PermissionRequirement,
  getAccessSnapshot,
  hasPermission,
} from './permissions';

export function usePermission(requirement?: PermissionRequirement) {
  const auth = useAuth();
  const access = getAccessSnapshot(auth.user?.profile);

  const hasRole = (...roles: AppRole[]) =>
    roles.some((role) => access.roleSet.has(role));

  const canAccess = (nextRequirement?: PermissionRequirement) =>
    auth.isAuthenticated &&
    hasPermission(access.permissionSet, nextRequirement ?? requirement);

  return {
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    keycloakRoles: access.keycloakRoles,
    roles: access.roles,
    hasRole,
    canAccess,
    permissionSet: access.permissionSet,
  };
}
