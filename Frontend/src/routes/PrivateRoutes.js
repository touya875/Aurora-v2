import { useEffect, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PrivateRoutes = (props) => {
    // useEffect(() => {
    //     let session = sessionStorage.getItem('account');
    //     if (!session) {
    //         navigate("/login");
    //         window.location.reload();
    //     }
    //     if (session) {
    //         //check role
    //     }
    // }, [])

    let navigate = useNavigate();

    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user && user.isAuthenticated) {
            // User is authenticated, no need to navigate away
            return;
        } else {
            // User is not authenticated, navigate to login
            navigate("/login");
        }
    }, [user, navigate]);

    if (user && user.isAuthenticated) {
        return (
            <>
                {props.children}
            </>
        );
    } else {
        return null;
    }

    //     if (user && user.isAuthenticated === true) {

    //         return (
    //             <>
    //                 {props.children}
    //             </>
    //         )
    //     } else {
    //         navigate("/login");
    //     }



}

export default PrivateRoutes;