import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { loginUser } from '../../services/userService';
import { UserContext } from "../../context/UserContext";

const Login = (props) => {

    const { user, loginContext } = useContext(UserContext);

    let navigate = useNavigate();

    const [valueLogin, setValueLogin] = useState("");
    const [password, setPassword] = useState("");

    // const defaultObjValidInput = {
    //     isValidValueLogin: true,
    //     isValidValuePassword: true
    // }

    // const [objValidInput, setObjValidInput] = useState(defaultObjValidInput);

    const handleCreateNewAccount = () => {
        navigate("/register");
    }

    const handleLogin = async () => {
        // setObjValidInput(defaultObjValidInput);

        if (!valueLogin) {
            // setObjValidInput({ ...defaultObjValidInput, isValidValueLogin: false })
            toast.error("Please enter your email address or phone number");
            return;
        }

        if (!password) {
            // setObjValidInput({ ...defaultObjValidInput, isValidValuePassword: false })
            toast.error("Please enter your password");
            return;
        }

        let response = await loginUser(valueLogin, password);

        if (response && +response.EC === 0) {
            //success
            let groupWithRoles = response.DT.groupWithRoles;
            let email = response.DT.email;
            let username = response.DT.username;
            let token = response.DT.access_token;

            let data = {
                isAuthenticated: true,
                token,
                account: { groupWithRoles, email, username }
            }

            localStorage.setItem('jwt', token);
            loginContext(data);
            navigate('/users');
            // window.location.reload();
            //redux
        }

        if (response && +response.EC !== 0) {
            //error
            toast.error(response.EM)
        }
    }

    const handlePressEnter = (event) => {
        if (event.charCode === 13 && event.code === "Enter") {
            handleLogin();
        }
    }

    useEffect(() => {
        if (user && user.isAuthenticated) {
            navigate("/");
        }
    }, [])


    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    Aurora
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="abc@gmail.com" value={valueLogin} onChange={(event) => { setValueLogin(event.target.value) }} />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={password} onChange={(event) => { setPassword(event.target.value) }} onKeyPress={(event) => handlePressEnter(event)} />
                            </div>
                            <button className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={() => handleLogin()} >Sign in</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={() => handleCreateNewAccount()}>Sign up</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login