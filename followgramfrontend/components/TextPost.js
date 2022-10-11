import React, { useState, useEffect } from "react";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import useSWRInfinite from "swr/infinite";
import loader from "../public/loader.svg";
import { AiOutlineUserAdd, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BsPlay, BsPause, BsStop } from "react-icons/bs";

const PAGE_SIZE = 5;
let cat = "joke";
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
  return `/api/allpost?page=${pageIndex}&limit=${PAGE_SIZE}&category=${cat}`; // SWR key
};

export default function TextPost({
  speak,
  cancel,
  speaking,
  supported,
  voices,
  postFilter,
  previousPostFilter,
  date1,
  date2,
}) {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("joke");
  const [morePosts, setMorePosts] = useState(true);
  const [postId, setPostId] = useState("");
  const [voiceIndex, setVoiceIndex] = useState(0);
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher
  );

  let isLoadingMore = true,
    isReachedEnd = false;

  useEffect(() => {
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
    console.log(data);
  }, [data]);

  const changeCategory = (c) => {
    setCategory(c);
    cat = c;
    setSize(1);
  };

  const handleAudio = (post) => {
    if (supported) {
      if (!post) {
        cancel();
        setPostId("");
        return;
      }

      if (speaking) {
        cancel();
        setTimeout(() => {
          setPostId(post._id);
          speak({ text: post.body, voice: voices[voiceIndex] });
        }, 300);
      } else {
        setPostId(post._id);
        speak({ text: post.body, voice: voices[voiceIndex] });
      }
    } else {
      alert("Sorry!! This feature is not supported in your browser");
    }
  };

  return (
    <div>
      <div className="pt-1 md:pt-4 dark:bg-gray-800 dark:text-white bg-white text-black">
        <div className="flex justify-evenly mb-2">
          <p
            className={`text-xl ${
              category === "joke" ? "border-b-2 font-semibold" : ""
            } border-gray-800 cursor-pointer px-2`}
            onClick={() => {
              changeCategory("joke");
            }}
          >
            Jokes
          </p>
          <p
            className={`text-xl ${
              category === "shayari" ? "border-b-2 font-semibold" : ""
            } border-gray-800 cursor-pointer px-2`}
            onClick={() => {
              changeCategory("shayari");
            }}
          >
            Shayari
          </p>
          <p
            className={`text-xl ${
              category === "quote" ? "border-b-2 font-semibold" : ""
            } border-gray-800 cursor-pointer px-2`}
            onClick={() => {
              changeCategory("quote");
            }}
          >
            Quotes
          </p>
        </div>

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
          <div className="lg:w-3/4 px-2 mx-auto md:px-10">
            <div className="md:flex md:justify-between">
              <p className="text-xl">Select voice Language -&gt;</p>
              <select
                name="voice"
                className="bg-transparent rounded-md max-w-[95vw]"
                value={voiceIndex || ""}
                onChange={(e) => {
                  setVoiceIndex(e.target.value);
                }}
              >
                {voices.map((option, index) => (
                  <option
                    key={option.voiceURI}
                    value={index}
                    className="dark:text-black"
                  >
                    {`${option.lang} - ${option.name} ${
                      option.default ? "- Default" : ""
                    }`}
                  </option>
                ))}
              </select>
            </div>
            {posts &&
              posts.map((post) => (
                <div
                  key={post._id}
                  className={`my-3 bg-gray-700 p-2 rounded-md`}
                >
                  <div className="flex items-center pb-1 border-b-2 border-gray-800 relative">
                    <Image
                      className="rounded-full bg-white"
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${post.postedBy.pic}`}
                      width={35}
                      height={35}
                    />
                    <h1 className="pl-4 text-white">{post.postedBy.name}</h1>
                    <span className="absolute right-4 text-xl cursor-pointer text-gray-800">
                      <AiOutlineUserAdd />
                    </span>
                  </div>
                  <div className="my-1">
                    <p className="text-2xl px-1 py-2 text-white">{post.body}</p>
                    <div className="flex my-2 justify-evenly text-2xl">
                      <AiFillHeart />
                      <FaRegComment />
                      {speaking && postId === post._id ? (
                        <BsStop
                          className="cursor-pointer"
                          onClick={() => {
                            handleAudio(null);
                          }}
                        />
                      ) : (
                        <BsPlay
                          className="cursor-pointer"
                          onClick={() => {
                            handleAudio(post);
                          }}
                        />
                      )}
                    </div>
                    <div className="flex justify-end my-1">
                      <p className="text-xs">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
