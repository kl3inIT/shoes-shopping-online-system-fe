import type { PropsWithChildren } from 'react';
import { useEffect, useCallback, useRef } from 'react';
import { AuthProvider as OidcProvider, useAuth } from 'react-oidc-context';

import { oidcConfig } from '@/features/auth/oidcConfig';
import {
  registerAccessToken,
  unregisterAccessToken,
} from '@/features/auth/accessTokenProvider';

function AccessTokenRegistration({ children }: PropsWithChildren) {
  const auth = useAuth();

  const refreshPromiseRef = useRef<Promise<string> | null>(null);
  const isLoading = auth.isLoading;
  const isAuthenticated = auth.isAuthenticated;
  const accessToken = auth.user?.access_token;
  const isExpired = auth.user?.expired ?? true;

  const getToken = useCallback(async (): Promise<string> => {
    if (isLoading) {
      throw new Error('Auth is still loading');
    }

    if (!isAuthenticated || !auth.user) {
      throw new Error('User is not authenticated');
    }

    if (isExpired) {
      if (refreshPromiseRef.current) {
        return refreshPromiseRef.current;
      }

      const refreshPromise = (async () => {
        try {
          const user = await auth.signinSilent();
          if (user?.access_token) {
            return user.access_token;
          }
          throw new Error('Silent renew returned no token');
        } catch (error) {
          console.error('[Auth] Silent renew failed:', error);
          await auth.signoutRedirect();
          throw new Error('Token expired and silent renew failed');
        } finally {
          refreshPromiseRef.current = null;
        }
      })();

      refreshPromiseRef.current = refreshPromise;
      return refreshPromise;
    }

    return auth.user.access_token;
  }, [isLoading, isAuthenticated, isExpired, auth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && accessToken) {
      registerAccessToken(getToken);
    } else {
      unregisterAccessToken();
    }

    return () => {
      unregisterAccessToken();
    };
  }, [isLoading, isAuthenticated, accessToken, getToken]);

  return <>{children}</>;
}

export function AuthProvider({ children }: PropsWithChildren) {
  return (
    <OidcProvider {...oidcConfig}>
      <AccessTokenRegistration>{children}</AccessTokenRegistration>
    </OidcProvider>
  );
}
