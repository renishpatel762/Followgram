import React, { useEffect, useState,useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./_app";

export default function Login() {
  const [state,dispatch]=useContext(UserContext);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);
  // console.log(user);
  console.log("state is login ",state);
  useEffect(() => {
    if (email.length > 0 && password.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password]);

  const handleChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async () => {
    if (email && password) {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }).then((response) => response.json());
      // console.log("res is", res);
      if (res.success) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        // dispatch({type:"USER",payload:res.user})
        dispatch({type:'USER',payload:res.user})
        router.push("/");
      } else {
        toast.error(res.error, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  return (
    <div className="min-h-screen py-2 dark:text-white dark:bg-gray-800">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Head>
        <title>Login - Followgram</title>
        <meta
          name="description"
          content="Followgram share posts & text with your friend"
        />
      </Head>

      <h1 className="text-2xl font-bold text-center py-3 md:py-6 lg:py-10 dark:text-white text-gray-800">
        Login
      </h1>
      <div className="w-full max-w-md mx-auto">
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-lg font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800  leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter Email"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-lg font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
            placeholder="Enter Password"
          />
        </div>
        <div className="my-4 text-center">
          <button
            disabled={disabled}
            className="text-white mx-2.5 cursor-pointer disabled:text-gray-700 disabled:border-gray-700 dark:border-white border-black border-2 py-1 px-2 rounded-md hover:border-blue-400 hover:text-blue-400"
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
