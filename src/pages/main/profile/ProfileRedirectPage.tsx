import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'react-oidc-context';

export default function ProfileRedirectPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const keycloakId = auth.user?.profile.sub as string | undefined;
    if (keycloakId) {
      navigate(`/profile/${keycloakId}`, { replace: true });
      return;
    }
    navigate('/', { replace: true });
  }, [auth.user, navigate]);

  return null;
}
