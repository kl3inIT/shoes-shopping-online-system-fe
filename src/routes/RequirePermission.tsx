import type { PropsWithChildren, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { type PermissionRequirement, usePermission } from '@/features/auth';

type RequirePermissionProps = PropsWithChildren<{
  fallback?: ReactNode;
  redirectTo?: string;
  requirement: PermissionRequirement;
}>;

export function RequirePermission({
  children,
  fallback,
  redirectTo = '/403',
  requirement,
}: RequirePermissionProps) {
  const location = useLocation();
  const permission = usePermission(requirement);

  if (permission.isLoading) {
    return (
      fallback ?? (
        <div className='flex min-h-screen items-center justify-center bg-muted/20'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      )
    );
  }

  if (!permission.canAccess(requirement)) {
    return (
      <Navigate
        replace
        to={redirectTo}
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
