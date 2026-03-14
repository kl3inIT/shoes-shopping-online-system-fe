export { oidcConfig } from './oidcConfig';
export {
  APP_ROLES,
  PERMISSIONS,
  type AppPermission,
  type AppRole,
  type PermissionRequirement,
  buildPermissionSet,
  extractKeycloakRoles,
  getAccessSnapshot,
  hasPermission,
  resolveAppRoles,
} from './permissions';
export { PermissionGuard } from './PermissionGuard';
export { useAuthorizedItems } from './useAuthorizedItems';
export { usePermission } from './usePermission';
