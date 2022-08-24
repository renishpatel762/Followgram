import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState(undefined);
  const [imageName, setImageName] = useState("");

  const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const router = useRouter();

  useEffect(() => {
    if (imageName.length > 0) {
      uploadData();
      // console.log("here");
    }
  }, [imageName]);

  const handleChange = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    } else if (e.target.name === "confirmPassword") {
      setConfirmPassword(e.target.value);
    } else if (e.target.name === "profile") {
      setProfile(e.target.files[0]);
    }
    console.log(profile);
  };

  const showErrorToast = (msg) => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSubmit = async () => {
    // check for name
    if (name.length < 2) {
      showErrorToast("Name have atleast length 2");
      return;
    }
    // check for email
    if (!email.match(EMAIL_REGEX)) {
      showErrorToast("Please enter valid email address");
      return;
    }
    // check for password
    if (password.length < 1) {
      showErrorToast("Please enter password");
      return;
    }
    if (password === confirmPassword) {
      if (profile) {
        // uploading image to cloudinary
        const formData = new FormData();
        formData.append("file", profile);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
        );
        formData.append("folder", process.env.NEXT_PUBLIC_CLOUDINARY_PROFILE);
        console.log(formData);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        ).then((response) => response.json());
        const index = res.secure_url.lastIndexOf("/");
        const imgName = res.secure_url.substring(index + 1);
        setImageName(imgName);
      } else {
        // set default image
        setImageName("default_user_jvzpsn.png");
      }
    } else {
      showErrorToast("Password must match with Confirm Password");
    }
  };

  const uploadData = async () => {
    const res = await fetch("/signup", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        pic: imageName,
      }),
    }).then((response) => response.json());
    if (res.success) {
      const userEmail = email;
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setImageName("");
      setProfile(undefined);
      toast.success("Successfully Registered..", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        router.push(`/verify?email=${userEmail}`);
      }, 1000);
    } else {
      showErrorToast("Something went wrong.Please try again after some time..");
    }
  };

  return (
    <div className="min-h-screen py-2 dark:text-white dark:bg-gray-800">
      <Head>
        <title>Signup - Followgram</title>
        <meta
          name="description"
          content="Followgram share posts & text with your friend"
        />
      </Head>
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
      <h1 className="text-2xl font-bold text-center py-3 text-gray-800">
        SignUp
      </h1>
      <div className="w-full max-w-md mx-auto">
        <div className="mb-4 text-center">
          {profile && (
            <Image
              className="rounded-full bg-white"
              src={URL.createObjectURL(profile)}
              width={150}
              height={150}
            />
          )}
          {!profile && (
            <Image
              className="rounded-full bg-white"
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/default_user_jvzpsn.png`}
              width={150}
              height={150}
            />
          )}
          <label
            className="block text-gray-700 text-lg font-bold my-2"
            htmlFor="profile"
          >
            <img
              src="https://img.icons8.com/fluency-systems-filled/96/000000/file-upload.png"
              className="cursor-pointer mx-auto"
              height={40}
              width={40}
            />
          </label>
          {profile && (
            <span className="text-lg">
              {profile.name.substring(0,40)}{profile.name.length > 40 ? '...' : ''}
            </span>
          )}
          {!profile && (
            <span className="text-lg">Select Your Profile Photo</span>
          )}
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline hidden"
            id="profile"
            name="profile"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block dark:text-white text-gray-700 text-lg font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={handleChange}
            placeholder="Enter Your Name"
          />
        </div>
        <div className="mb-4">
          <label
            className="block dark:text-white text-gray-700 text-lg font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
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
            className="block dark:text-white text-gray-700 text-lg font-bold mb-2"
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
        <div className="mb-4">
          <label
            className="block dark:text-white text-gray-700 text-lg font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
          />
        </div>
        <div className="my-4 text-center">
          <button
            className="text-white mx-2.5 text-xl dark:border-white border-black border-2 py-1 px-3 rounded-md hover:border-blue-400 hover:text-blue-400 "
            onClick={handleSubmit}
          >
            Register
          </button>
        </div>
        {/* <div className="my-4 text-center">
          <Link href={"/login"}>
            <a className="text-white mx-2.5 dark:border-white border-black border-2 py-1 px-2 rounded-md hover:border-blue-400 hover:text-blue-400">
              Go to Login
            </a>
          </Link>
        </div> */}
      </div>
    </div>
  );
}
