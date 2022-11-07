import React, { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import useSWRInfinite from "swr/infinite";
import loader from "../public/loader.svg";
import { AiOutlineUserAdd, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { UserContext } from "../pages/_app";
import { useRouter } from "next/router";
import styles from "../styles/ImagePost.module.css";
import Modal from "./Modal";

const PAGE_SIZE = 5;
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
  return `/api/allpost?page=${pageIndex}&limit=${PAGE_SIZE}&category=Media`; // SWR key
};

export default function ImagePost({ postFilter, previousPostFilter, date1, date2, post, posts, setPost, setPosts, likePost, unLikePost, makeComment }) {
  const [state, dispatch] = useContext(UserContext);
  // const [posts, setPosts] = useState([]);
  // const [post, setPost] = useState(null);
  const [morePosts, setMorePosts] = useState(true);
  const [modal, setModal] = useState(false);
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher
  );
  const router = useRouter();

  let isLoadingMore = true,
    isReachedEnd = false;

  // useEffect(() => {
  //   modal.current.style.display = 'none';
  // },[]);
  // console.log("state is ",state);
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
    // console.log(data);
  }, [data]);

  // const likePost = (pid) => {
  //   // console.log(pid);
  //   fetch('/api/like', {
  //     method: "put",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + localStorage.getItem("token"),
  //     },
  //     body: JSON.stringify({
  //       postId: pid
  //     })
  //   })
  //     .then((res) => res.json())
  //     .then(result => {
  //       setPost(result);
  //       const newData = posts.map(item => {
  //         if (item._id === result._id) {
  //           return result;
  //         } else {
  //           return item;
  //         }
  //       })
  //       setPosts(newData);
  //       // console.log("like result is", result);
  //     }).catch(err => {
  //       console.error(err);
  //     })
  // }

  // const unLikePost = (pid) => {
  //   // console.log(pid);
  //   fetch('/api/unlike', {
  //     method: "put",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + localStorage.getItem("token"),
  //     },
  //     body: JSON.stringify({
  //       postId: pid
  //     })
  //   })
  //     .then((res) => res.json())
  //     .then(result => {
  //       setPost(result);//setting post for modal

  //       const newData = posts.map(item => {
  //         if (item._id === result._id) {
  //           return result;
  //         } else {
  //           return item;
  //         }
  //       })
  //       setPosts(newData);
  //       // console.log("like result is", result);
  //     }).catch(err => {
  //       console.error(err);
  //     })
  // }

  // const makeComment = (text, postId) => {
  //   if (text === "" || text === null || text == " ") {
  //     return;
  //   }
  //   fetch("/api/comment", {
  //     method: "put",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + localStorage.getItem("token"),
  //     },
  //     body: JSON.stringify({
  //       postId,
  //       text
  //     }),
  //   }).then((response) => response.json())
  //     .then(result => {
  //       setPost(result);//for modal
  //       const newData = posts.map(item => {
  //         if (item._id === result._id) {
  //           return result;
  //         } else {
  //           return item;
  //         }
  //       })
  //       setPosts(newData);
  //     }).catch(err => {
  //       console.log(err);
  //     })
  // }

  // if (typeof window !== "undefined") {
  //   // Client-side-only code
  //   window.addEventListener("click", function (e) {
  //     // console.log(e.target);
  //     if(!this.document.getElementById('modalBox').contains(e.target)){
  //       // setModal(false);
  //       console.log("Got it");
  //     }
  //   });
  // }

  return (
    <div>
      {/* <Modal /> */}
      {/* <div
        ref={modal}
        className={`absolute w-[90vw] md:w-[70vw] lg:w-[50vw] ml-[5vw] md:ml-[15vw] lg:ml-[25vw] top-[30vh] z-10 md:text-lg xl:text-xl bg-gray-400 rounded-md py-4`}
      >
        <div className="flex justify-evenly mt-2">
          <div>
            <p>From</p>
            <input type="date" className="bg-gray-400 cursor-pointer" />
          </div>
          <div className="pb-2">
            <p>To</p>
            <input type="date" className="bg-gray-400 cursor-pointer" />
          </div>
        </div>
        <div className="text-center mt-3 pb-2">
          <button
            type="button"
            className="border-2 border-gray-800 px-3 py-1 rounded-md bg-white hover:bg-gray-700 hover:text-white"
          >
            Filter
          </button>
        </div>
      </div> */}
      <div id="modalBox">
        {modal && (
          <Modal
            post={post}
            state={state}
            likePost={likePost}
            unLikePost={unLikePost}
            makeComment={makeComment}
            closeModal={() => {
              setModal(false);
            }}
          />
        )}
      </div>
      <div
        className={`pt-1 md:pt-4 -z-0 dark:bg-gray-800 dark:text-white bg-white text-black ${modal ? 'opacity-80' : 'opacity-100'}`}
      >
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
          <div className="lg:w-2/4 md:w-2/3 px-2 mx-auto md:px-10">
            {posts &&
              posts.map((post) => (
                <div key={post._id} className={`my-3`} >
                  <div className="flex items-center pb-1 border-b-2 border-gray-300 relative  cursor-pointer"
                    onClick={() => {
                      if (post.postedBy._id !== state._id)
                        router.push("/profile/" + post.postedBy._id)
                      else
                        router.push("/profile");
                    }}>
                    <Image
                      className="rounded-full bg-white"
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${post.postedBy.pic}`}
                      width={35}
                      height={35}
                    />
                    <h1 className="pl-4">{post.postedBy.name}</h1>
                    {/* <h1 className="pl-4 cursor-pointer">{post.postedBy.name}</h1> */}
                    <span className="absolute right-4 text-xl">
                      <AiOutlineUserAdd />
                    </span>
                  </div>
                  <div className="my-1">
                    <div className="flex justify-end my-1">
                      <p className="text-xs">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Image
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/posts/${post.photo}`}
                      width={600}
                      height={600}
                      className="cursor-pointer"
                      onClick={() => { setPost(post); setModal(true); }}
                    />
                    <div className="flex my-2 justify-evenly text-2xl">
                      {
                        (state && post.likes.includes(state._id))
                          ?
                          <div onClick={() => { unLikePost(post._id) }}>
                            <AiFillHeart className="cursor-pointer" />
                            <p>{post.likes.length} likes</p>
                          </div>
                          :
                          <div onClick={() => { likePost(post._id) }}>
                            <AiOutlineHeart className="cursor-pointer" />
                            <p>{post.likes.length} likes</p>
                          </div>
                      }
                      {/* <FaRegComment style={{ cursor: 'pointer' }} onClick={() => { router.push("/post/" + post._id); }} /> */}
                      <div className="cursor-pointer">
                        <FaRegComment  onClick={() => { setPost(post); setModal(true); }} />
                        {
                          (post.comments && post.comments.length > 0)
                          &&
                          <div>
                            <p className="cursor-pointer" onClick={() => { setPost(post); setModal(true); }}>{post.comments.length} comments</p>
                          </div>
                        }

                      </div>
                    </div>
                    <div>
                      <form
                        className={styles.CommentBox}
                        onSubmit={(e) => {
                          e.preventDefault();
                          // console.log(e.target[0].value);
                          makeComment(e.target[0].value, post._id);
                          e.target[0].value = "";
                        }}>
                        <input className={styles.CommentInput} type="text" placeholder="add a comment" />
                        <button className="mr-10">Post</button>
                      </form>
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
