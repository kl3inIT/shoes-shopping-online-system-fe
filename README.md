## Shoes Shopping Online System – Frontend

Ứng dụng frontend cho hệ thống **Shoes Shopping Online System**, xây dựng trên **React 19 + TypeScript + Vite (rolldown-vite)**, quản lý state server bằng **TanStack Query**, giao diện với **shadcn/ui + Tailwind CSS v4**, xác thực bằng **Keycloak (OIDC)**, hỗ trợ **đa ngôn ngữ (en/vi)** và có **khu vực admin** để quản lý sản phẩm, đơn hàng, người dùng,...

### 1. Tech stack chính

- **UI & build**
  - React 19 + TypeScript
  - Vite (rolldown-vite) + Tailwind CSS v4
  - shadcn/ui (Radix UI primitives)
- **Routing & data**
  - React Router v7 (`src/routes/router.tsx`)
  - TanStack Query v5 (`@tanstack/react-query`)
- **Auth & Keycloak**
  - `react-oidc-context` + `oidc-client-ts` (OIDC client)
  - Keycloak realm cấu hình qua biến môi trường (backend cung cấp JWT)
- **Khác**
  - Axios HTTP client wrapper: `src/features/apiClient.ts`
  - i18n: `react-i18next` + `public/locales/{en,vi}/translation.json`
  - WebSocket + STOMP (thông báo real‑time)

### 2. Cấu trúc chính của `src/`

```text
src/
  components/        # UI components (shadcn) + component dùng lại
  features/          # Logic theo feature: auth, user, products, admin/...
  hooks/             # Custom hooks chung
  i18n/              # Cấu hình đa ngôn ngữ
  layouts/           # MainLayout, AdminLayout, sidebar, header...
  pages/             # Các trang gắn với route
  providers/         # AppProviders, AuthProvider, QueryProvider, ThemeProvider...
  routes/            # router.tsx, ProtectedRoute, RootErrorBoundary
  types/             # Kiểu dữ liệu dùng chung (API DTO, wrapper...)
```

#### 2.1. Khu vực main (khách hàng)

- `pages/main/home/HomePage.tsx` – trang chủ
- `pages/main/products/ProductsPage.tsx` – danh sách sản phẩm
- `pages/main/products/ShoeDetailPage.tsx` – chi tiết sản phẩm
- `pages/main/cart/CartPage.tsx`, `wishlist`, `orders`, `checkout`, `profile`...
- Layout: `layouts/main/MainLayout.tsx` (header, footer, user menu)

#### 2.2. Khu vực admin

- Layout: `layouts/admin/AdminLayout.tsx` + `app-sidebar.tsx`
- Các trang admin chính:
  - `/admin` – Dashboard
  - `/admin/products`, `/admin/addshoe`, `/admin/products/:id` – quản lý sản phẩm
  - `/admin/orders` – quản lý đơn hàng
  - `/admin/brands` – quản lý thương hiệu
  - `/admin/categories` – quản lý danh mục
  - `/admin/reviews` – quản lý đánh giá
  - `/admin/ai` – cấu hình AI
  - **`/admin/users` – quản lý người dùng (admin & manager)**:
    - Dữ liệu gọi qua `src/features/admin/users/api.ts`
    - State với React Query `useQueryAdminUsers`
    - CRUD:
      - Tạo admin/manager mới (create user Keycloak + DB)
      - Đổi role (ROLE_ADMIN / ROLE_MANAGER / ROLE_CUSTOMER)
      - Suspend / Activate (bật/tắt trên Keycloak + cập nhật DB)
      - Xoá user (xóa Keycloak + DB)
    - UI: `UserStatsCards`, `UserTable`, `UserDetailDialog`, `UserFormDialog`, `UserRoleDialog`

### 3. Tích hợp backend & Keycloak

- Toàn bộ API được gọi thông qua `apiClient` ở `src/features/apiClient.ts`:
  - Base URL: `VITE_API_BASE_URL` (mặc định `http://localhost:8088`)
  - Tự gắn header `Authorization: Bearer <access_token>` nếu có
  - Tự gắn header `Accept-Language` theo ngôn ngữ i18n hiện tại
  - Tự xử lý refresh token 401 (gọi `signinSilent` từ `react-oidc-context`)
- Auth:
  - `src/features/auth/oidcConfig.ts` đọc các biến:
    - `VITE_OIDC_AUTHORITY` – URL realm Keycloak (ví dụ: `http://localhost:8080/realms/ssos-realm`)
    - `VITE_OIDC_CLIENT_ID` – client Id (ví dụ: `ssos-app`)
  - Callback sau đăng nhập: `/auth/callback` (`pages/auth/AuthCallBack.tsx`)
- Các endpoint admin users khớp với backend:
  - `GET /api/admin/users?page=&size=&search=&role=&status=`
  - `POST /api/admin/users`
  - `PATCH /api/admin/users/{keycloakId}/role`
  - `PATCH /api/admin/users/{keycloakId}/status`
  - `DELETE /api/admin/users/{keycloakId}`

### 4. Scripts & cách chạy

Project dùng **pnpm** (xem `packageManager` trong `package.json`).

```bash
# 1. Cài dependencies
pnpm install

# 2. Chạy dev trên http://localhost:5173
pnpm dev

# 3. Lint
pnpm lint

# 4. Build production
pnpm build

# 5. Preview build
pnpm preview
```

> Lưu ý: cần chạy backend (`shoes-shopping-online-system-be`) trên `http://localhost:8088` (hoặc chỉnh `VITE_API_BASE_URL`) và Keycloak đang hoạt động đúng realm/client để login thành công.

### 5. Quy ước i18n & UI

- Tất cả trang trong `src/pages/**` **không được** hard‑code text:
  - luôn dùng `const { t } = useTranslation();`
  - thêm key mới vào `public/locales/en/translation.json` và `public/locales/vi/translation.json`
- UI sử dụng component từ `components/ui/*` (shadcn):
  - `button`, `card`, `table`, `dialog`, `select`, `input`, `badge`, `sidebar`, ...
  - tránh dùng thẳng HTML thô cho các pattern đã có component sẵn.
