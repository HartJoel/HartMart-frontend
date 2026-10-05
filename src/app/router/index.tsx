import { createBrowserRouter } from "react-router";
import AdminLayout from "@/app/layouts/AdminLayout";
import FocusedLayout from "@/app/layouts/FocusedLayout";
import RootLayout from "@/app/layouts/RootLayout";
import StandaloneLayout from "@/app/layouts/StandaloneLayout";
import StorefrontLayout from "@/app/layouts/StorefrontLayout";
import VendorLayout from "@/app/layouts/VendorLayout";
import NotFoundPage from "@/app/NotFoundPage";
import AuthPage from "@/features/auth/pages/AuthPage";
import CartPage from "@/features/cart/pages/CartPage";
import WishlistPage from "@/features/wishlist/pages/WishlistPage";
import HomePage from "@/features/catalog/pages/HomePage";
import ProductDetailPage from "@/features/catalog/pages/ProductDetailPage";
import ProductsPage from "@/features/catalog/pages/ProductsPage";
import CheckoutPage from "@/features/checkout/pages/CheckoutPage";
import PaymentCallbackPage from "@/features/checkout/pages/PaymentCallbackPage";
import AddressesPage from "@/features/account/pages/AddressesPage";
import ProfilePage from "@/features/account/pages/ProfilePage";
import NotificationsPage from "@/features/notifications/pages/NotificationsPage";
import OrderDetailPage from "@/features/orders/pages/OrderDetailPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import AdminCategoriesPage from "@/features/admin/pages/CategoriesPage";
import AdminDashboardPage from "@/features/admin/pages/DashboardPage";
import AdminLogsPage from "@/features/admin/pages/LogsPage";
import AdminReportsPage from "@/features/admin/pages/ReportsPage";
import AdminUsersPage from "@/features/admin/pages/UsersPage";
import AdminVendorsPage from "@/features/admin/pages/VendorsPage";
import VendorApplicationPage from "@/features/vendor-storefront/pages/VendorApplicationPage";
import VendorDashboardPage from "@/features/vendor-dashboard/pages/DashboardPage";
import VendorOrdersPage from "@/features/vendor-dashboard/pages/OrdersPage";
import VendorProductFormPage from "@/features/vendor-dashboard/pages/ProductFormPage";
import VendorProductsPage from "@/features/vendor-dashboard/pages/ProductsPage";
import VendorReviewsPage from "@/features/vendor-dashboard/pages/ReviewsPage";
import VendorSettingsPage from "@/features/vendor-dashboard/pages/SettingsPage";
import VendorDirectoryPage from "@/features/vendor-storefront/pages/VendorDirectoryPage";
import VendorStorefrontPage from "@/features/vendor-storefront/pages/VendorStorefrontPage";

export const router = createBrowserRouter([
  {
    // Every route sits under the root, which resets scroll position on each page change.
    element: <RootLayout />,
    children: [
      // Standalone screens with their own chrome.
      {
        element: <StandaloneLayout />,
        children: [
          { path: "/login", element: <AuthPage initialScreen="login" /> },
          { path: "/register", element: <AuthPage initialScreen="register" /> },
          { path: "/forgot-password", element: <AuthPage initialScreen="forgot" /> },
          { path: "/payment/callback", element: <PaymentCallbackPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },

      // Single-column flows: brand at the top, no storefront header or footer.
      {
        element: <FocusedLayout />,
        children: [
          { path: "/checkout", element: <CheckoutPage /> },
          { path: "/become-a-vendor", element: <VendorApplicationPage /> },
        ],
      },

      // Shopper pages share the storefront header and footer.
      {
        element: <StorefrontLayout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/products", element: <ProductsPage /> },
          { path: "/products/:id", element: <ProductDetailPage /> },
          { path: "/cart", element: <CartPage /> },
          { path: "/wishlist", element: <WishlistPage /> },
          { path: "/orders", element: <OrdersPage /> },
          { path: "/orders/:id", element: <OrderDetailPage /> },
          { path: "/account", element: <ProfilePage /> },
          { path: "/account/addresses", element: <AddressesPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/vendors", element: <VendorDirectoryPage /> },
          { path: "/vendors/:id", element: <VendorStorefrontPage /> },
        ],
      },

      {
        path: "/vendor",
        element: <VendorLayout />,
        children: [
          { index: true, element: <VendorDashboardPage /> },
          { path: "dashboard", element: <VendorDashboardPage /> },
          { path: "products", element: <VendorProductsPage /> },
          { path: "products/new", element: <VendorProductFormPage /> },
          { path: "products/:id/edit", element: <VendorProductFormPage /> },
          { path: "orders", element: <VendorOrdersPage /> },
          { path: "reviews", element: <VendorReviewsPage /> },
          { path: "settings", element: <VendorSettingsPage /> },
          { path: "notifications", element: <NotificationsPage area="vendor" /> },
        ],
      },

      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "vendors", element: <AdminVendorsPage /> },
          { path: "categories", element: <AdminCategoriesPage /> },
          { path: "reports", element: <AdminReportsPage /> },
          { path: "logs", element: <AdminLogsPage /> },
          { path: "notifications", element: <NotificationsPage area="admin" /> },
        ],
      },
    ],
  },
]);
