import type { AuthProviderProps } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';

import { appEnv } from '@/lib/env';

export const authority = appEnv.oidcAuthority;
export const client_id = appEnv.oidcClientId;

export const oidcConfig: AuthProviderProps = {
  authority: authority,
  client_id: client_id,
  redirect_uri: `${globalThis.location.origin}/auth/callback`,
  post_logout_redirect_uri: globalThis.location.origin,
  scope: 'openid profile email',
  automaticSilentRenew: true, // Tự động renew token
  loadUserInfo: true,
  onSigninCallback: () => {
    // Remove OIDC params from URL
    const searchParams = new URLSearchParams(globalThis.location.search);
    searchParams.delete('state');
    searchParams.delete('code');
    searchParams.delete('session_state');

    const newUrl = searchParams.toString().length
      ? `${globalThis.location.pathname}?${searchParams.toString()}`
      : globalThis.location.pathname;

    globalThis.history.replaceState({}, document.title, newUrl);
  },
  userStore: new WebStorageStateStore({ store: globalThis.localStorage }),
};
