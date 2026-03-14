import type { PropsWithChildren, ReactNode } from 'react';

import { type PermissionRequirement } from './permissions';
import { usePermission } from './usePermission';

type PermissionGuardProps = PropsWithChildren<{
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  requirement?: PermissionRequirement;
}>;

export function PermissionGuard({
  children,
  fallback = null,
  loadingFallback = null,
  requirement,
}: PermissionGuardProps) {
  const permission = usePermission(requirement);

  if (permission.isLoading) {
    return <>{loadingFallback}</>;
  }

  if (!permission.canAccess(requirement)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
