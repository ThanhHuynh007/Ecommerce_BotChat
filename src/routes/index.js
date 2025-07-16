import AdminPage from "../pages/AdminPage/AdminPage"
import HomePage from "../pages/HomePages/HomePage"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import OrderPage from "../pages/OrderPages/OrderPage"
import OrderSucess from "../pages/OrderSuccess/OrderSuccess";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage"
import ProductPage from "../pages/ProductPages/ProductPage"
import ProfilePage from "../pages/ProfilePage/ProfilePage"
import SignInPage from "../pages/SignInPage/SignInPage"
import SignUpPage from "../pages/SignUpPage/SignUpPage"
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage"
import MyOrderPage from "../pages/MyOrder/MyOrder";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";


export const routes = [
    {
        path: "/",
        page: HomePage,
        isShowHeader: true
    },
    {
        path: "/products",
        page: ProductPage,
        isShowHeader: true
    },
    {
        path: "/order",
        page: OrderPage,
        isShowHeader: true
    },
    {
        path: '/orderSuccess',
        page: OrderSucess,
        isShowHeader: true
    },
    {
        path: "/my-order",
        page: MyOrderPage,
        isShowHeader: true,
    },
    {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true
    },
    {
        path: "/payment",
        page: PaymentPage,
        isShowHeader: true,
    },
    {
        path: "/product/:type",
        page: TypeProductPage,
        isShowHeader: true
    },
    {
        path: "/sign-in",
        page: SignInPage,
        isShowHeader: false
    },
    {
        path: "/sign-up",
        page: SignUpPage,
        isShowHeader: false
    },
    {
        path: "/product-details/:id",
        page: ProductDetailsPage,
        isShowHeader: true
    },
    {
        path: "/profile-user",
        page: ProfilePage,
        isShowHeader: true
    },
    {
        path: "/system/admin",
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: "*",
        page: NotFoundPage
    }
]