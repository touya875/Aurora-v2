import { Fragment, useState } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { logoutUser } from '../../services/userService';
import { toast } from 'react-toastify';

const navigation = {
    pages: [
        { name: 'Trang chủ', href: '/' },
        { name: 'Cửa hàng', href: '/shop' },
        { name: 'Quản lý người dùng', href: '/users' },
    ],
}


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const NavHeader = () => {
    const { user, logoutContext } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false)

    const [isdropdown, setIsdropdown] = useState(false);

    const toggleDropdown = () => {
        setIsdropdown((isdropdown) => !isdropdown);
    }
    const handleLogout = async () => {
        let data = await logoutUser(); //clear cookies
        localStorage.removeItem('jwt'); //clear local storage
        logoutContext(); //clear user in context

        if (data && +data.EC === 0) {
            toast.success('Đăng xuất thành công...');
            navigate('/login');
        } else {
            toast.error(data.EM);
        }
    }


    if (user && user.isAuthenticated === true || location.pathname === '/' || location.pathname === '/shop' || location.pathname === '/cart') {
        return (
            <>
                <div className="bg-white">
                    {/* Mobile menu */}
                    <Transition.Root show={open} as={Fragment}>
                        <Dialog className="relative z-40 lg:hidden" onClose={setOpen}>
                            <Transition.Child
                                as={Fragment}
                                enter="transition-opacity ease-linear duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity ease-linear duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black bg-opacity-25" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-40 flex">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transition ease-in-out duration-300 transform"
                                    enterFrom="-translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transition ease-in-out duration-300 transform"
                                    leaveFrom="translate-x-0"
                                    leaveTo="-translate-x-full"
                                >
                                    <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                                        <div className="flex px-4 pb-2 pt-5">
                                            <button
                                                type="button"
                                                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="absolute -inset-0.5" />
                                                <span className="sr-only">Close menu</span>
                                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </div>

                                        {/* Links */}
                                        <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                                            {navigation.pages.map((page) => (
                                                <div key={page.name} className="flow-root">
                                                    <a href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
                                                        {page.name}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>

                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition.Root>

                    <header className="relative bg-white">
                        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="border-b border-gray-200">
                                <div className="flex h-16 items-center">
                                    <button
                                        type="button"
                                        className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                                        onClick={() => setOpen(true)}
                                    >
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Open menu</span>
                                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                                    </button>

                                    {/* Logo */}
                                    <div className="ml-4 flex lg:ml-0">
                                        <a href="/">
                                            <span className="sr-only">Your Company</span>
                                            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">AURORA</span>

                                        </a>
                                    </div>

                                    {/* Flyout menus */}
                                    <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                                        <div className="flex h-full space-x-8">
                                            {navigation.pages.map((page) => (
                                                <a
                                                    key={page.name}
                                                    href={page.href}
                                                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                                                >
                                                    {page.name}
                                                </a>
                                            ))}
                                        </div>
                                    </Popover.Group>

                                    <div className="ml-auto flex items-center">
                                        {user && user.isAuthenticated === true ?
                                            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                                <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                                                    {user.account.username}
                                                </a>
                                                <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                                                {/* <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                                                    Cài đặt
                                                </a> */}
                                                <div className="relative ml-5">
                                                    <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900" onClick={toggleDropdown}>Cài đặt
                                                        <svg className="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    {isdropdown && (
                                                        <div id="dropdownDivider" className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                                                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDividerButton">
                                                                {/* <li>
                                                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                                                                </li> */}
                                                            </ul>
                                                            <div className="py-2">
                                                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" onClick={() => handleLogout()}>Đăng xuất</a>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            :
                                            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                                <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                                                <a href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                                                    Đăng nhập
                                                </a>
                                            </div>
                                        }

                                        {/* Cart */}
                                        <div className="ml-4 flow-root lg:ml-6">
                                            <a href="/cart" className="group -m-2 flex items-center p-2">
                                                <ShoppingBagIcon
                                                    className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                    aria-hidden="true"
                                                />
                                                {/* <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span> */}
                                                <span className="sr-only">items in cart, view bag</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </header>
                </div>
            </>
        );
    } else {
        return <></>
    }
}

export default NavHeader;
