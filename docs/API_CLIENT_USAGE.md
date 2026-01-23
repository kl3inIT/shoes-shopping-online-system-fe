# API Client Usage Guide

## Public vs Protected Endpoints

API Client hỗ trợ cả **public endpoints** (không cần token) và **protected endpoints** (cần token).

## 🔓 Public Endpoints (Guest Users)

Đối với các endpoint công khai mà guest users có thể truy cập, sử dụng option `skipAuth: true`:

```typescript
import apiClient from '@/features/apiClient';

// ✅ Public endpoint - không cần token
const products = await apiClient.get('/api/products', {
  skipAuth: true, // Đánh dấu đây là public endpoint
});
```

**Khi nào dùng `skipAuth: true`:**

- Xem danh sách sản phẩm
- Xem chi tiết sản phẩm
- Tìm kiếm sản phẩm
- Xem blog posts
- Các endpoint công khai khác

## 🔒 Protected Endpoints (Authenticated Users)

Đối với các endpoint yêu cầu authentication, **không cần** chỉ định gì cả - token sẽ tự động được attach:

```typescript
import apiClient from '@/features/apiClient';

// ✅ Protected endpoint - token tự động được attach
const user = await apiClient.get('/api/users/me');
// Token sẽ tự động được lấy và attach vào header
```

**Khi nào không dùng `skipAuth`:**

- Lấy thông tin user hiện tại
- Thêm vào giỏ hàng
- Đặt hàng
- Quản lý profile
- Các endpoint yêu cầu authentication

## 📝 Ví Dụ Thực Tế

### 1. Public Endpoint - Get Products

```typescript
// src/features/products/api.ts
import apiClient, { type ApiResponse } from '../apiClient';

export interface Product {
  id: string;
  name: string;
  price: number;
}

export async function getProducts(): Promise<Product[]> {
  const response: ApiResponse<Product[]> = await apiClient.get(
    '/api/products',
    {
      skipAuth: true, // ✅ Public endpoint
    }
  );
  return response.data;
}
```

### 2. Protected Endpoint - Get Current User

```typescript
// src/features/user/api.ts
import apiClient, { type ApiResponse } from '../apiClient';

export interface User {
  id: string;
  username: string;
  email: string;
}

export async function getCurrentUser(): Promise<User> {
  // ✅ Không cần skipAuth - token tự động được attach
  const response: ApiResponse<User> = await apiClient.get('/api/users/me');
  return response.data;
}
```

### 3. Mixed - Public Search, Protected Add to Cart

```typescript
// src/features/products/api.ts

// Public - tìm kiếm sản phẩm
export async function searchProducts(query: string): Promise<Product[]> {
  const response = await apiClient.get('/api/products/search', {
    params: { q: query },
    skipAuth: true, // ✅ Guest có thể tìm kiếm
  });
  return response.data;
}

// Protected - thêm vào giỏ hàng
export async function addToCart(
  productId: string,
  quantity: number
): Promise<void> {
  // ✅ Không có skipAuth - chỉ user đã login mới có thể thêm vào giỏ
  await apiClient.post('/api/cart/items', {
    productId,
    quantity,
  });
}
```

## 🔄 Cách Hoạt Động

### Request Flow

1. **Public Endpoint (`skipAuth: true`)**:

   ```
   Request → Skip token check → Send without Authorization header
   ```

2. **Protected Endpoint (default)**:

   ```
   Request → Check if auth ready → Get token → Attach to header → Send
   ```

3. **Protected Endpoint (user not logged in)**:
   ```
   Request → Auth not ready → Send without token → Backend returns 401
   ```

### Automatic Token Refresh

- Nếu token expired, hệ thống tự động refresh token
- Nếu refresh failed, user sẽ được redirect đến login page
- Request sẽ được retry với token mới (nếu nhận 401)

## ⚠️ Lưu Ý

1. **Backend Validation**: Dù frontend có thể gửi request không có token, backend vẫn sẽ validate và trả về 401 nếu endpoint yêu cầu authentication.

2. **Error Handling**: Luôn handle 401 errors cho protected endpoints:

   ```typescript
   try {
     await apiClient.post('/api/cart/items', data);
   } catch (error) {
     if (error instanceof ApiError && error.statusCode === 401) {
       // Redirect to login hoặc show message
       console.log('Please log in to continue');
     }
   }
   ```

3. **Development Mode**: Trong dev mode, bạn sẽ thấy logs về việc skip auth hoặc attach token.

## 🎯 Best Practices

1. ✅ **Luôn dùng `skipAuth: true`** cho public endpoints
2. ✅ **Không dùng `skipAuth`** cho protected endpoints (mặc định)
3. ✅ **Handle 401 errors** cho protected endpoints
4. ✅ **Type-safe responses** với `ApiResponse<T>`
5. ✅ **Sử dụng helper functions** từ `apiClient` (getErrorMessage, isApiError)
