## Shoes Shopping Online System - Frontend

Frontend của hệ thống **Shoes Shopping Online System** được xây dựng bằng **React + TypeScript + Vite**, kết hợp với **React Router**, **React Query**, **i18n**, và bộ component UI tuỳ chỉnh.

### 1. Công nghệ chính

- **Vite + React + TypeScript**: bundler & UI framework.
- **React Router**: điều hướng giữa các trang (main, admin, auth, error).
- **TanStack Query (React Query)**: quản lý data fetching / caching.
- **Axios hoặc fetch wrapper** (thông qua `features/apiClient.ts`): gọi API backend.
- **OIDC / Auth**: xử lý đăng nhập, token qua `features/auth`.
- **i18n**: đa ngôn ngữ thông qua thư mục `i18n`.
- **UI Components**: hệ thống component tái sử dụng trong `components/ui`.

---

### 2. Cấu trúc thư mục `src`

```text
src/
  App.tsx
  main.tsx
  index.css
  assets/
  components/
  features/
  hooks/
  i18n/
  layouts/
  lib/
  pages/
  providers/
  routes/
  types/
```

#### 2.1. Entry & cấu hình gốc

- **`main.tsx`**: Entry chính, mount React, bọc app bằng các `Provider` (Theme, Query, Auth, Router, i18n, ...).
- **`App.tsx`**: Root component, thường render router + layout.
- **`index.css`**: Global styles.

#### 2.2. `components/`

- Các component dùng lại xuyên suốt hệ thống:
  - `chart-area-interactive.tsx`, `data-table.tsx`, `section-cards.tsx`: component chức năng (biểu đồ, bảng dữ liệu, các card thống kê, ...).
  - `language-toggle.tsx`, `mode-toggle.tsx`: nút chuyển **ngôn ngữ** và **theme** (dark/light).
- **`components/ui/`**: thư viện UI base (giống Shadcn UI):
  - `button.tsx`, `card.tsx`, `table.tsx`, `tabs.tsx`, `tooltip.tsx`, `sidebar.tsx`, `sheet.tsx`, `drawer.tsx`, `input.tsx`, `select.tsx`, `checkbox.tsx`, `badge.tsx`, `avatar.tsx`, `alert.tsx`, `skeleton.tsx`, ...
  - Mục đích: chuẩn hoá giao diện, tái sử dụng, dễ maintain.

#### 2.3. `features/`

- **Mục đích**: gom các “tính năng” có logic riêng (auth, user, HTTP, query client).

- **`features/apiClient.ts`**:
  - Khởi tạo HTTP client (thường là Axios hoặc fetch wrapper).
  - Thiết lập base URL, interceptor, header token, ...

- **`features/HttpError.ts`**:
  - Định nghĩa model/tiện ích xử lý lỗi HTTP trả về từ backend.

- **`features/queryClient.ts`**:
  - Khởi tạo và cấu hình React Query client.

- **`features/auth/`**:
  - `oidcConfig.ts`: cấu hình OIDC/OpenID Connect.
  - `accessTokenProvider.ts`: lấy / lưu / cung cấp access token.
  - `authUtils.ts`: các hàm tiện ích liên quan đến xác thực.
  - `index.ts`: export chung cho module auth.

- **`features/user/`**:
  - `api.ts`: các hàm gọi API liên quan đến người dùng (lấy profile, cập nhật, ...).
  - `hooks.ts`: các React hook (ví dụ `useUser`, `useUserProfile`, ...) dùng React Query.
  - `queryOptions.ts`: định nghĩa query key và options chuẩn.
  - `types.ts`: type/interface cho dữ liệu user.
  - `index.ts`: export chung.

#### 2.4. `hooks/`

- **`useMobile.ts`**:
  - Hook custom để xác định xem màn hình đang ở kích thước mobile / desktop.
  - Thường dùng để thay đổi layout (ẩn/hiện sidebar, menu mobile, ...).

#### 2.5. `i18n/`

- **`i18nConfig.ts`, `i18n.ts`, `useLanguage.ts`, `index.ts`**:
  - Khởi tạo và cấu hình hệ thống đa ngôn ngữ.
  - Cung cấp hook `useLanguage` để đổi ngôn ngữ, kết hợp với component `language-toggle`.

#### 2.6. `layouts/`

- **Mục đích**: tách bố cục (layout) của từng khu vực trong app.

- **`layouts/admin/`**:
  - `AdminLayout.tsx`: layout chính cho trang admin.
  - `app-sidebar.tsx`, `sidebar.tsx`: sidebar admin.
  - `site-header.tsx`, `nav-main.tsx`, `nav-secondary.tsx`, `nav-documents.tsx`, `nav-user.tsx`: header và các menu điều hướng trong khu vực admin.
  - `index.ts`: export chung cho layout admin.

- **`layouts/main/`**:
  - `MainLayout.tsx`: layout cho phần “website chính” (trang home, products, profile, ...).
  - `Footer.tsx`: footer chung.
  - `header/` với `Header.tsx`, `UserMenu.tsx`, `index.ts`: phần header & menu người dùng.

- **`layouts/index.ts`**:
  - Re-export các layout để import gọn hơn.

#### 2.7. `pages/`

- **Mục đích**: khai báo các “trang” gắn với route.

- **`pages/admin/dashboard/`**:
  - `Dashboard.tsx`, `data.json`: trang dashboard admin, có thể hiển thị thống kê, biểu đồ, bảng, ...

- **`pages/auth/`**:
  - `AuthCallBack.tsx`: xử lý callback sau khi đăng nhập (OIDC/OAuth), nhận code/token từ IdP rồi chuyển tiếp.
  - `index.ts`: export.

- **`pages/error/`**:
  - `Page403.tsx`, `Page404.tsx`, `Page500.tsx`: các trang lỗi tương ứng **403/404/500**.
  - `index.ts`: export.

- **`pages/main/`**:
  - `home/HomePage.tsx`: trang chủ (home).
  - `products/ProductsPage.tsx`: trang danh sách / lưới sản phẩm giày.
  - `profile/ProfilePage.tsx`, `profileLoader.ts`: trang hồ sơ người dùng và loader dữ liệu kèm theo.

- **`pages/index.ts`**:
  - Export các page để sử dụng trong router.

#### 2.8. `providers/`

- **Mục đích**: gom các context provider lại để bọc toàn bộ ứng dụng.

- `AppProviders.tsx`: bọc lần lượt ThemeProvider, QueryProvider, AuthProvider, Router, i18n, ...
- `AuthProvider.tsx`: context xác thực (trạng thái đăng nhập, thông tin user, token).
- `QueryProvider.tsx`: cung cấp React Query client.
- `ThemeProvider.tsx`: quản lý dark/light mode.
- `index.ts`: export tiện lợi.

#### 2.9. `routes/`

- **`router.tsx`**:
  - Định nghĩa cây route cho toàn bộ ứng dụng: route public, route bảo vệ, route admin, route lỗi, ...
- **`ProtectedRoute.tsx`**:
  - Component bao route, chỉ cho phép truy cập khi người dùng đã đăng nhập (và có thể kèm kiểm tra quyền).
- **`RootErrorBoundary.tsx`**:
  - Error boundary cho router, bắt lỗi render và chuyển hướng sang trang error phù hợp.

#### 2.10. `types/`

- **`apiTypes.ts`**:
  - Định nghĩa type cho dữ liệu trao đổi với backend (request/response, DTO, ...).
- **`index.ts`**:
  - Export chung các type.

#### 2.11. `assets/` và `lib/`

- **`assets/`**:
  - Lưu trữ asset tĩnh (ví dụ `react.svg`, logo, icon, ...).
- **`lib/utils.ts`**:
  - Các hàm tiện ích chung (format, parse, helper logic nhỏ).

---

### 3. Chạy dự án

```bash
# Cài đặt phụ thuộc
npm install

# Chạy dev
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

---

### 4. Hướng phát triển tiếp theo (gợi ý)

- Kết nối đầy đủ với backend (API shoes, order, cart, payment, ...).
- Hoàn thiện luồng đăng nhập/đăng ký, phân quyền (user / admin).
- Bổ sung test (unit test cho hooks, component, và integration test cho pages chính).
