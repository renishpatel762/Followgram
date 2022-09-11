import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import useSWRInfinite from "swr/infinite";
import loader from "../../public/loader.svg";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { BsPlay, BsPause, BsStop } from "react-icons/bs";

const PAGE_SIZE = 3;
let category = "media";
const fetcher = (url) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  }).then((response) => response.json());

const getKey = (pageIndex, previousPageData) => {
  pageIndex = pageIndex + 1;
  if (previousPageData && !previousPageData.length) return null; // reached the end
  // return `/api/allpost`; // SWR key
  return `/api/mypost?page=${pageIndex}&limit=${PAGE_SIZE}&category=${category}`; // SWR key
};

export default function MyProfile({
  speak,
  cancel,
  speaking,
  supported,
  voices,
}) {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [morePosts, setMorePosts] = useState(true);
  const [fetchedCategory, setFetchedCategory] = useState("media");
  const [isPlaying, setIsPlaying] = useState(false);
  const [postId, setPostId] = useState("");
  // const { data, error } = useSWR("/api/allpost", fetcher);
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher
  );
  const router = useRouter();
  let isLoadingMore = true,
    isReachedEnd = false;
  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUser(parsedUser);
    } else {
      router.push("/welcome");
    }
  }, []);

  useEffect(() => {
    // console.log(data);
    // console.log(size);
    isLoadingMore = data && typeof data[size - 1] === "undefined";
    isReachedEnd = data && data[data.length - 1]?.length < PAGE_SIZE;

    if (isReachedEnd) {
      setMorePosts(false);
    } else {
      setMorePosts(true);
    }

    if (data) {
      setPosts([].concat.apply([], data));
    }
  }, [data]);

  const changeCategory = (cat) => {
    setFetchedCategory(cat);
    category = cat;
    setSize(1);
  };

  const handleAudio = (post) => {
    if (supported) {
      if (!post) {
        cancel();
        setIsPlaying(false);
        setPostId("");
        return;
      }

      if (speaking) {
        cancel();
      }

      setPostId(post._id);
      setIsPlaying(true);
      speak({ text: post.body });

    } else {
      alert("Sorry!! This feature is not supported in your browser");
    }
  };
  

  useEffect(() => {
    console.log(postId);
  }, [postId]);

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
            {!user && (
              <Image
                className="rounded-full bg-white"
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/default_user_jvzpsn.png`}
                width={150}
                height={150}
              />
            )}
            {user && (
              <Image
                className="rounded-full bg-white"
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${user.pic}`}
                width={150}
                height={150}
              />
            )}
          </div>
          <button className="mt-2">Change Profile</button>
        </div>
        <div className="w-2/3 pt-3 pl-4 md:pl-0 overflow-x-hidden">
          <h2 className="text-2xl">{user.name}</h2>
          <h2 className="text-md">{user.email}</h2>
          <div className="flex py-5 text-sm md:text-lg">
            <div className="w-1/3 md:w-1/5 text-center">
              <p>0</p>
              <p>Posts</p>
            </div>
            <div className="w-1/3 md:w-1/5 text-center">
              <p>{user.followers ? user.followers.length : 0}</p>
              <p>Followers</p>
            </div>
            <div className="w-1/3 md:w-1/5 text-center">
              <p>{user.following ? user.following.length : 0}</p>
              <p>Following</p>
            </div>
          </div>
          <button className="text-white dark:border-white border-black border-2 py-1 px-2 rounded-md hover:border-blue-400 hover:text-blue-400">
            Edit Profile
          </button>
        </div>
      </div>

      {/* load posts here */}
      <hr className="mt-7 h-0.5 bg-white" />
      {error && (
        <h1 className="my-5 text-center text-2xl">
          Something went wrong.. Please try again later...
        </h1>
      )}

      {/* Show while loading */}
      {/* {!error && !data && <h1>Loading...</h1>} */}
      <div className="flex justify-evenly mt-10">
        <p
          className={`mx-2 text-2xl cursor-pointer ${
            fetchedCategory !== "media" ? "" : "border-blue-400 border-b-2"
          }`}
          onClick={() => {
            changeCategory("media");
          }}
        >
          Photos
        </p>
        <p
          className={`mx-2 text-2xl cursor-pointer ${
            fetchedCategory !== "joke" ? "" : "border-blue-400 border-b-2"
          }`}
          onClick={() => {
            changeCategory("joke");
          }}
        >
          Jokes
        </p>
        <p
          className={`mx-2 text-2xl cursor-pointer ${
            fetchedCategory !== "shayari" ? "" : "border-blue-400 border-b-2"
          }`}
          onClick={() => {
            changeCategory("shayari");
          }}
        >
          Shayari
        </p>
        <p
          className={`mx-2 text-2xl cursor-pointer ${
            fetchedCategory !== "quote" ? "" : "border-blue-400 border-b-2"
          }`}
          onClick={() => {
            changeCategory("quote");
          }}
        >
          Quotes
        </p>
      </div>
      {/* posts */}
      <div className="mt-10">
        <InfiniteScroll
          dataLength={posts.length}
          next={() => setSize(size + 1)}
          hasMore={morePosts}
          loader={
            <div className="text-center py-4">
              <Image src={loader} width={50} height={50} />
            </div>
          }
          endMessage={
            <p className="text-center pt-4 pb-3">
              <b>----x----x----</b>
            </p>
          }
        >
          <div className="flex flex-wrap items-center w-full px-2 md:px-10">
            {fetchedCategory === "media" &&
              posts.map((post) => (
                <div
                  key={post._id}
                  className="w-1/3 text-center py-1 px-1 md:py-2 md:px-3"
                >
                  <Image
                    className="hover:opacity-20"
                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/posts/${post.photo}`}
                    width={50}
                    height={50}
                    layout="responsive"
                  />
                </div>
              ))}
            {fetchedCategory !== "media" &&
              posts.map((post) => (
                <div
                  key={post._id}
                  className="w-full my-2 py-2 px-1 rounded-md md:my-2 md:py-4 md:px-3 bg-black"
                >
                  <p className="pl-4 text-2xl font-bold">{post.body}</p>
                  <p className="text-right pr-4">
                    {new Date(post.createdAt).toLocaleDateString(
                      "en-US",
                      options
                    )}
                  </p>
                  <div className="flex justify-evenly">
                    <AiOutlineLike className="text-2xl cursor-pointer" />
                    <AiOutlineDislike className="text-2xl cursor-pointer" />
                    {speaking && postId === post._id ? (
                      <BsStop
                        className={`text-2xl cursor-pointer`}
                        // className={`text-2xl cursor-pointer ${
                        //   (speaking && postId === post._id) ? "" : "hidden"
                        // }`}
                        onClick={() => {
                          handleAudio(undefined);
                        }}
                      />
                    ) : (
                      <BsPlay
                        className={`text-2xl cursor-pointer`}
                        // className={`text-2xl cursor-pointer ${
                        //   (speaking && postId === post._id) ? "hidden" : ""
                        // }`}
                        onClick={() => {
                          handleAudio(post);
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
