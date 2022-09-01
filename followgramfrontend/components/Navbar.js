import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { BiMessageAdd, BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { Tooltip } from '@nextui-org/react';

export default function Navbar({logoutUser}) {
  const router = useRouter();
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    // console.log(router.pathname);
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setImageName(parsedUser.pic);
    }
  }, [router.pathname]);
  return (
    <div>
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto">
          <Link href={"/"}>
            <a className="flex items-center">
              {/* <Image src={logo} height={10} width={200}/> */}
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Followgram
              </span>
            </a>
          </Link>
          <div className="flex items-center md:order-2">
            {/* <button
              type="button"
              className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="/docs/images/people/profile-picture-3.jpg"
                alt="user photo"
              />
            </button> */}
            {![
              "/signup",
              "/verify",
              "/",
              "/profile",
              "/createpost",
              "/profile/[userId]",
            ].includes(router.pathname) && (
              <Link href={"/signup"}>
                <a className="text-white mx-2.5 dark:border-white border-black border-2 py-1 px-2 rounded-md hover:border-blue-400 hover:text-blue-400">
                  Signup
                </a>
              </Link>
            )}
            {![
              "/login",
              "/profile",
              "/",
              "/createpost",
              "/profile/[userId]",
            ].includes(router.pathname) && (
              <Link href={"/login"}>
                <a className="text-white mx-2.5 dark:border-white border-black border-2 py-1 px-2 rounded-md hover:border-blue-400 hover:text-blue-400">
                  Login
                </a>
              </Link>
            )}
            {!["/login", "/signup", "/verify", "/createpost","/welcome"].includes(
              router.pathname
            ) && (
              <Tooltip placement="bottom" contentColor="default" color="primary" content="New Post"><Link href={"/createpost"}>
                <a className="text-white text-2xl mx-2 py-1 px-1 rounded-md hover:text-blue-400">
                  <BiMessageAdd />
                </a>
              </Link></Tooltip>
            )}

            {!["/login", "/signup", "/verify","/welcome"].includes(router.pathname) && (
              <Tooltip placement="bottom" contentColor="default" color="primary" content="Logout">
                <a className="text-white text-2xl mx-2 py-1 px-1 rounded-md hover:text-blue-400" onClick={logoutUser}>
                  <BiLogOut />
                </a>
              </Tooltip>
            )}

            {!["/login", "/signup", "/verify", "/profile","/welcome"].includes(
              router.pathname
            ) && (
              <Tooltip placement="bottom" contentColor="default" color="primary" content="Profile"><Link href={"/profile"}>
                <a className="text-white text-2xl mx-2 py-1 px-1 rounded-md hover:text-blue-400">
                  <CgProfile />
                </a>
              </Link></Tooltip>
            )}

            {/* <div className="z-50 my-4 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 block" id="user-dropdown" data-popper-reference-hidden="" data-popper-escaped="" data-popper-placement="bottom" style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(476px, 76px, 0px);">
        <div className="py-3 px-4">
          <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
          <span className="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
        </div>
        <ul className="py-1" aria-labelledby="user-menu-button">
          <li>
            <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
          </li>
        </ul>
      </div> */}
            {/* <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
    </button> */}
          </div>
          {/* <div className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1" id="mobile-menu-2">
    <ul className="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <li>
        <a href="#" className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" aria-current="page">Home</a>
      </li>
      <li>
        <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
      </li>
      <li>
        <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
      </li>
      <li>
        <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Pricing</a>
      </li>
      <li>
        <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
      </li>
    </ul>
  </div> */}
        </div>
      </nav>
    </div>
  );
}
