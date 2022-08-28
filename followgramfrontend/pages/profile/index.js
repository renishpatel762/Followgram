import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

export default function MyProfile() {
  const [user, setUser] = useState({});
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUser(parsedUser);
    } else{
      router.push("/welcome");
    }
  }, []);
  return (
      <div className="min-h-screen px-2 dark:text-white dark:bg-gray-800">
        <Head>
          <title>Profile - Followgram</title>
          <meta
            name="description"
            content="Followgram share posts & text with your friend"
          />
        </Head>
        <div className="flex w-full pt-5 md:pt-10">
          <div className="w-1/3 text-center items-center">
            <div>
              {!user && <Image
                className="rounded-full bg-white"
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/default_user_jvzpsn.png`}
                width={150}
                height={150}
              />}
              {user && <Image
                className="rounded-full bg-white"
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${user.pic}`}
                width={150}
                height={150}
              />}
            </div>
            <button className="mt-2">Change Profile</button>
          </div>
          <div className="w-2/3 pt-3 pl-4 md:pl-0 overflow-x-hidden">
            <h2 className="text-2xl">{user.name}</h2>
            <h2 className="text-md">{user.email}</h2>
            <div className="flex py-5 text-sm md:text-lg">
              <div className="w-1/3 md:w-1/5 text-center"><p>0</p><p>Posts</p></div>
              <div className="w-1/3 md:w-1/5 text-center"><p>{user.followers ? user.followers.length : 0}</p><p>Followers</p></div>
              <div className="w-1/3 md:w-1/5 text-center"><p>{user.following ? user.following.length : 0}</p><p>Following</p></div>
            </div>
            <button className="text-white dark:border-white border-black border-2 py-1 px-2 rounded-md hover:border-blue-400 hover:text-blue-400">
              Edit Profile
            </button>
          </div>
        </div>

        {/* load posts here */}
      </div>
  );
}
