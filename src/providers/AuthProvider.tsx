import type { PropsWithChildren } from 'react';
import { AuthProvider as OidcProvider } from 'react-oidc-context';

import { oidcConfig } from '@/features/auth/oidcConfig';
export function AuthProvider({ children }: PropsWithChildren) {
  return <OidcProvider {...oidcConfig}>{children}</OidcProvider>;
}
