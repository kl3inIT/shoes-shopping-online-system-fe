# React Router + TanStack Query Integration Guide

Tài liệu này mô tả cách tích hợp **React Router** và **TanStack Query** trong dự án `shoes-shopping-online-system-fe`.

## Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Cấu Hình Cơ Bản](#cấu-hình-cơ-bản)
3. [Pattern 1: Loader với ensureQueryData](#pattern-1-loader-với-ensurequerydata)
4. [Pattern 2: Component với useSuspenseQuery](#pattern-2-component-với-usesuspensequery)
5. [Pattern 3: Mutations trong Actions](#pattern-3-mutations-trong-actions)
6. [Pattern 4: Optimistic Updates](#pattern-4-optimistic-updates)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

---

## Tổng Quan

### Tại sao kết hợp React Router và TanStack Query?

- **React Router Loaders**: Pre-fetch data trước khi render component, giảm loading states
- **TanStack Query**: Quản lý server state, caching, refetching tự động
- **Kết hợp**: Loader đảm bảo data có sẵn, TanStack Query quản lý cache và synchronization

### Kiến Trúc

```
┌─────────────────┐
│  React Router   │
│     Loader      │ ──► ensureQueryData ──► TanStack Query Cache
└─────────────────┘
         │
         ▼
┌─────────────────┐
│    Component    │ ──► useSuspenseQuery ──► Read from Cache
└─────────────────┘
```

---

## Cấu Hình Cơ Bản

### 1. Setup QueryClient

**File:** `src/features/queryClient.ts`

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 2. Setup QueryProvider

**File:** `src/providers/QueryProvider.tsx`

```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/features/queryClient';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 3. Export QueryClient để dùng trong Router

**File:** `src/features/queryClient.ts`

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  // ... config
});

// Export để dùng trong router loaders
export default queryClient;
```

---

## Pattern 1: Loader với ensureQueryData

### Mục đích

Pre-fetch data trong React Router loader, đảm bảo data có sẵn khi component render.

### Cấu Trúc

1. **QueryOptions**: Định nghĩa query options
2. **Loader**: Sử dụng `ensureQueryData` để pre-fetch
3. **Component**: Sử dụng `useSuspenseQuery` để đọc từ cache

### Ví Dụ: Profile Page

#### Bước 1: Tạo Query Options

**File:** `src/features/user/queryOptions.ts`

```typescript
import { queryOptions } from '@tanstack/react-query';
import { getUserById } from './api';
import type { User } from './types';

export const userKeys = {
  all: ['users'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export const getUserDetailQueryOptions = (id: string) =>
  queryOptions<User>({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
```

#### Bước 2: Tạo Loader

**File:** `src/pages/profile/profileLoader.ts`

```typescript
import type { LoaderFunctionArgs } from 'react-router';
import type { QueryClient } from '@tanstack/react-query';
import { getUserDetailQueryOptions } from '@/features/user/queryOptions';
import { isHttpError } from '@/features/apiClient';

export const profileLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const keycloakId = params.keycloakId;

    if (!keycloakId) {
      throw new Response('Keycloak ID is required', {
        status: 400,
        statusText: 'Bad Request',
      });
    }

    try {
      // Pre-fetch data vào TanStack Query cache
      await queryClient.ensureQueryData(getUserDetailQueryOptions(keycloakId));
    } catch (error) {
      // Convert HttpError thành Response để React Router xử lý
      if (isHttpError(error)) {
        throw new Response(error.userMessage(), {
          status: error.status,
          statusText: error.status === 401 ? 'Unauthorized' : 'Forbidden',
        });
      }
      throw error;
    }

    // Return data để component có thể access qua useLoaderData
    return { keycloakId };
  };
```

**Lưu ý quan trọng:**

- `ensureQueryData`: Đảm bảo data có trong cache, nếu chưa có thì fetch
- Error handling: Convert `HttpError` thành `Response` để React Router hiển thị error boundary phù hợp
- Return minimal data: Chỉ return params/IDs, không return full data (data đã có trong cache)

#### Bước 3: Đăng ký Loader trong Router

**File:** `src/routes/router.tsx`

```typescript
import { createBrowserRouter } from 'react-router';
import { queryClient } from '@/features/queryClient';

export const router = createBrowserRouter([
  {
    path: 'profile/:keycloakId',
    lazy: async () => {
      const [{ default: Component }, { profileLoader }] = await Promise.all([
        import('@/pages/profile/ProfilePage'),
        import('@/pages/profile/profileLoader'),
      ]);
      return {
        Component,
        loader: profileLoader(queryClient), // Pass queryClient vào loader
      };
    },
    errorElement: <RootErrorBoundary />,
  },
]);
```

#### Bước 4: Component sử dụng useSuspenseQuery

**File:** `src/pages/profile/ProfilePage.tsx`

```typescript
import { useLoaderData } from 'react-router';
import { useUserDetailQuery } from '@/features/user/hooks';

export default function ProfilePage() {
  const { keycloakId } = useLoaderData() as { keycloakId: string };

  // useSuspenseQuery đọc từ cache (đã được pre-fetch trong loader)
  // Không cần loading state vì data đã có sẵn
  const { data: user } = useUserDetailQuery(keycloakId);

  return (
    <div>
      <h1>{user.username}</h1>
      {/* ... */}
    </div>
  );
}
```

**File:** `src/features/user/hooks.ts`

```typescript
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserDetailQueryOptions } from './queryOptions';

export const useUserDetailQuery = (id: string) =>
  useSuspenseQuery(getUserDetailQueryOptions(id));
```

### Lợi Ích

✅ **No loading states**: Data đã có sẵn khi component render  
✅ **Type safety**: TypeScript biết chính xác data structure  
✅ **Error boundaries**: Errors được handle tự động  
✅ **Cache management**: TanStack Query quản lý cache tự động

---

## Pattern 2: Component với useSuspenseQuery

### Mục đích

Khi không cần pre-fetch trong loader, có thể fetch trực tiếp trong component với Suspense.

### Ví Dụ: Products List

#### Component

**File:** `src/pages/products/ProductsPage.tsx`

```typescript
import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getProductsQueryOptions } from '@/features/products/queryOptions';

function ProductsList() {
  // Fetch data trực tiếp trong component
  const { data: products } = useSuspenseQuery(getProductsQueryOptions());

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductsList />
    </Suspense>
  );
}
```

### Khi Nào Dùng Pattern Này?

- ✅ Data không critical cho initial render
- ✅ Có thể hiển thị skeleton/loading state
- ✅ Data có thể fetch sau khi component mount

---

## Pattern 3: Mutations trong Actions

### Mục đích

Xử lý form submissions và mutations trong React Router actions.

### Ví Dụ: Update User Profile

#### Bước 1: Tạo Mutation Function

**File:** `src/features/user/api.ts`

```typescript
import apiClient from '../apiClient';
import type { User } from './types';

export async function updateUser(
  id: string,
  data: Partial<User>
): Promise<User> {
  const response = await apiClient.put(`/user/${id}`, data);
  return response.data.data;
}
```

#### Bước 2: Tạo Mutation Options

**File:** `src/features/user/queryOptions.ts`

```typescript
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { updateUser } from './api';
import { userKeys } from './queryOptions';

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      updateUser(id, data),
    onSuccess: (data, variables) => {
      // Invalidate và refetch user detail
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
    },
  });
};
```

#### Bước 3: Component với Form Action

**File:** `src/pages/profile/ProfilePage.tsx`

```typescript
import { useLoaderData, useNavigate } from 'react-router';
import { useUpdateUserMutation } from '@/features/user/queryOptions';

export default function ProfilePage() {
  const { keycloakId } = useLoaderData() as { keycloakId: string };
  const { data: user } = useUserDetailQuery(keycloakId);
  const updateMutation = useUpdateUserMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await updateMutation.mutateAsync({
      id: keycloakId,
      data: {
        username: formData.get('username') as string,
        email: formData.get('email') as string,
      },
    });

    // Navigate hoặc show success message
    navigate('.', { replace: true });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Alternative: React Router Action

Nếu muốn dùng React Router action pattern:

**File:** `src/pages/profile/profileAction.ts`

```typescript
import type { ActionFunctionArgs } from 'react-router';
import type { QueryClient } from '@tanstack/react-query';
import { updateUser } from '@/features/user/api';
import { userKeys } from '@/features/user/queryOptions';

export const profileAction =
  (queryClient: QueryClient) =>
  async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const keycloakId = params.keycloakId!;

    try {
      const updatedUser = await updateUser(keycloakId, {
        username: formData.get('username') as string,
        email: formData.get('email') as string,
      });

      // Invalidate cache để refetch
      await queryClient.invalidateQueries({
        queryKey: userKeys.detail(keycloakId),
      });

      return { success: true };
    } catch (error) {
      if (isHttpError(error)) {
        throw new Response(error.userMessage(), {
          status: error.status,
        });
      }
      throw error;
    }
  };
```

**File:** `src/routes/router.tsx`

```typescript
{
  path: 'profile/:keycloakId',
  lazy: async () => {
    const [
      { default: Component },
      { profileLoader },
      { profileAction },
    ] = await Promise.all([
      import('@/pages/profile/ProfilePage'),
      import('@/pages/profile/profileLoader'),
      import('@/pages/profile/profileAction'),
    ]);
    return {
      Component,
      loader: profileLoader(queryClient),
      action: profileAction(queryClient),
    };
  },
}
```

---

## Pattern 4: Optimistic Updates

### Mục đích

Update UI ngay lập tức trước khi server response về.

### Ví Dụ: Toggle User Status

**File:** `src/features/user/queryOptions.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleUserStatus } from './api';
import { userKeys } from './queryOptions';

export const useToggleUserStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => toggleUserStatus(id),
    onMutate: async ({ id }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.detail(id) });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<User>(userKeys.detail(id));

      // Optimistically update
      queryClient.setQueryData<User>(userKeys.detail(id), (old) => {
        if (!old) return old;
        return { ...old, isActive: !old.isActive };
      });

      return { previousUser };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          userKeys.detail(variables.id),
          context.previousUser
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch để đảm bảo sync với server
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
    },
  });
};
```

---

## Error Handling

### 1. Loader Errors

**File:** `src/pages/profile/profileLoader.ts`

```typescript
try {
  await queryClient.ensureQueryData(getUserDetailQueryOptions(keycloakId));
} catch (error) {
  // Convert HttpError thành Response
  if (isHttpError(error)) {
    throw new Response(error.userMessage(), {
      status: error.status,
      statusText: error.status === 401 ? 'Unauthorized' : 'Forbidden',
    });
  }
  throw error;
}
```

### 2. Error Boundary

**File:** `src/routes/RootErrorBoundary.tsx`

```typescript
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

  // Handle HttpError trực tiếp (nếu không được convert trong loader)
  if (isHttpError(error)) {
    if (error.status === 401 || error.status === 403) {
      return <Page403 />;
    }
    // ... handle other status codes
  }

  return <Page500 />;
}
```

### 3. Component Error Handling

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return <div>Error: {error.message}</div>;
}

export default function ProductsPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsList />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

## Best Practices

### 1. Query Key Structure

```typescript
export const userKeys = {
  all: ['users'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), filters] as const,
};
```

### 2. Type Safety

```typescript
// Loader return type
type ProfileLoaderData = Awaited<
  ReturnType<ReturnType<typeof import('./profileLoader').profileLoader>>
>;

// Component
const { keycloakId } = useLoaderData() as ProfileLoaderData;
```

### 3. Lazy Loading Routes

```typescript
{
  path: 'profile/:keycloakId',
  lazy: async () => {
    const [{ default: Component }, { profileLoader }] = await Promise.all([
      import('@/pages/profile/ProfilePage'),
      import('@/pages/profile/profileLoader'),
    ]);
    return {
      Component,
      loader: profileLoader(queryClient),
    };
  },
}
```

### 4. Cache Invalidation

```typescript
// Invalidate specific query
queryClient.invalidateQueries({
  queryKey: userKeys.detail(id),
});

// Invalidate all user queries
queryClient.invalidateQueries({
  queryKey: userKeys.all,
});
```

### 5. Prefetching

```typescript
// Prefetch khi hover vào link
<Link
  to={`/profile/${userId}`}
  onMouseEnter={() => {
    queryClient.prefetchQuery(getUserDetailQueryOptions(userId));
  }}
>
  View Profile
</Link>
```

---

## Tóm Tắt

| Pattern                      | Khi Nào Dùng                                 | Lợi Ích                      |
| ---------------------------- | -------------------------------------------- | ---------------------------- |
| **Loader + ensureQueryData** | Critical data cần có trước khi render        | No loading states, type-safe |
| **useSuspenseQuery**         | Non-critical data, có thể show loading       | Đơn giản, dễ implement       |
| **Mutations trong Actions**  | Form submissions, cần server-side validation | Centralized error handling   |
| **Optimistic Updates**       | UI cần update ngay lập tức                   | Better UX, instant feedback  |

---

## Tài Liệu Tham Khảo

- [React Router Data Loading](https://reactrouter.com/en/main/route/loader)
- [TanStack Query Integration](https://tanstack.com/query/latest/docs/react/guides/react-router)
- [TanStack Query Suspense](https://tanstack.com/query/latest/docs/react/guides/suspense)
