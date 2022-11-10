import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import useSWRInfinite from "swr/infinite";
import loader from "../../public/loader.svg";
import { UserContext } from "../_app";
import Modal from "../../components/Modal";
import { FaRegCalendar, FaRegComment } from "react-icons/fa";



export default function Setting({
  speak,
  cancel,
  speaking,
  supported,
  voices,
}) {

  const [state, dispatch] = useContext(UserContext);
  // const[totalpost,setTotalPost]=useState(0);
  // const [user, setUser] = useState({});
//   const [posts, setPosts] = useState([]);
//   const [morePosts, setMorePosts] = useState(true);
//   const [fetchedCategory, setFetchedCategory] = useState("Media");
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [postId, setPostId] = useState("");
  // const { data, error } = useSWR("/api/allpost", fetcher);
  // const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
  //   getKey,
  //   fetcher
  // );
  const [post, setPost] = useState(null);
  const [modal, setModal] = useState(false);
  const [textModal, setTextModal] = useState(false);

  const router = useRouter();
  let isLoadingMore = true,
    isReachedEnd = false;
  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "numeric",
    // minute: "numeric",
    // second: "numeric",
  };
  // console.log("state is", state);

  // useEffect(() => {
  // const user = localStorage.getItem("user");
  // if (user) {
  //   const parsedUser = JSON.parse(user);
  //   setUser(parsedUser);
  //   // console.log("lhklj", parsedUser.posts);
  //   // console.log(user.posts.length);
  //   // setTotalPost(parsedUser.posts.length);
  // } else {
  //   router.push("/welcome");
  // }
  // }, []);

  // useEffect(() => {
  //   // console.log(data);
  //   // console.log(size);
  //   isLoadingMore = data && typeof data[size - 1] === "undefined";
  //   isReachedEnd = data && data[data.length - 1]?.length < PAGE_SIZE;

  //   if (isReachedEnd) {
  //     setMorePosts(false);
  //   } else {
  //     setMorePosts(true);
  //   }

  //   if (data) {
  //     setPosts([].concat.apply([], data));
  //   }
  //   console.log(posts);
  // }, [data]);






  return (
    <div className="min-h-screen px-2 dark:text-white dark:bg-gray-800">
      <Head>
        <title>Setting - Followgram</title>
        <meta
          name="description"
          content="Followgram share posts & text with your friend"
        />
      </Head>
      <div className="flex w-full pt-5 md:pt-10">
        <div className="w-1/3 text-center items-center">
          <div>
            {!state && (
              <Image
                className="rounded-full bg-white"
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/default_user_jvzpsn.png`}
                width={150}
                height={150}
              />
            )}
            {(state && state.pic) && (
              <Image
                className="rounded-full bg-white"
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${state.pic}`}
                width={150}
                height={150}
              />
            )}
          </div>
          <button className="mt-2">Set Profile </button>
        </div>
        <div className="w-2/3 pt-3 pl-4 md:pl-0 overflow-x-hidden">
          <h2 className="text-2xl">{state && state.name}</h2>
          <h2 className="text-md">{state && state.email}</h2>
          <div className="flex py-5 text-sm md:text-lg">
            <div className="w-1/3 md:w-1/5 text-center">
              <p>{state ? state.posts.length : 0}</p>
              <p>Posts</p>
            </div>
            <div className="w-1/3 md:w-1/5 text-center">
              <p>{state ? state.followers.length : 0}</p>
              <p>Followers</p>
            </div>
            <div className="w-1/3 md:w-1/5 text-center">
              <p>{state ? state.following.length : 0}</p>
              <p>Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* load posts here */}
      <hr className="mt-7 h-0.5 bg-white" />
      {/* {error && (
        <h1 className="my-5 text-center text-2xl">
          Something went wrong.. Please try again later...
        </h1>
      )} */}
    </div>
  );
}
