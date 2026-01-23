import { useRouteError, isRouteErrorResponse } from 'react-router';
import { Page403, Page404, Page500 } from '../pages/error';
import { isHttpError } from '@/features/apiClient';

export function RootErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 401 || error.status === 403) {
      return <Page403 />;
    }
    if (error.status === 404) {
      return <Page404 />;
    }
    if (error.status >= 500) {
      return <Page500 />;
    }

    return <Page500 />;
  }

  // Xử lý HttpError trực tiếp (nếu không được convert thành Response trong loader)
  if (isHttpError(error)) {
    if (error.status === 401 || error.status === 403) {
      return <Page403 />;
    }
    if (error.status === 404) {
      return <Page404 />;
    }
    if (error.status >= 500) {
      return <Page500 />;
    }
    return <Page500 />;
  }

  if (error instanceof Error) {
    return <Page500 />;
  }

  return <Page500 />;
}
