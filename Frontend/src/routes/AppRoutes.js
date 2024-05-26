import {
    Route,
    Routes
} from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import Users from '../components/ManageUsers/Users';
import HomePage from "../components/HomePage/Home";
import ProductDetails from "../components/Product/ProductDetails";
import Shop from "../components/ShopPage/Shop"
import Cart from "../components/CartPage/Cart";
import ErrorPages from "../components/ErrorPage/ErrorPages";
import SidebarPage from "../components/AdminPage/SidebarPage";

const AppRoutes = (props) => {

    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route path="/shop" element={<Shop />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/cart" element={<Cart />} />

                <Route path="/product-details" element={<ProductDetails />} />

                <Route path="/admin" element={<SidebarPage />} />

                {/* <Route path="*" element={<ErrorPages />} /> */}

                <Route
                    path="/users"
                    element={
                        <PrivateRoutes>
                            <Users />
                        </PrivateRoutes >
                    }
                />

            </Routes>
        </>
    )
}

export default AppRoutes;