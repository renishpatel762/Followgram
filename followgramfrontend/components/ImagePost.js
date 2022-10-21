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
  return `/api/allpost?page=${pageIndex}&limit=${PAGE_SIZE}&category=media`; // SWR key
};

export default function ImagePost({ postFilter, previousPostFilter, date1, date2 }) {
  const [state, dispatch] = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [post , setPost] = useState(null);
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

  const likePost = (pid) => {
    console.log(pid);
    fetch('/api/like', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: pid
      })
    })
      .then((res) => res.json())
      .then(result => {
        const newData = posts.map(item => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        })
        setPosts(newData);
        console.log("like result is", result);
      }).catch(err => {
        console.error(err);
      })
  }

  const unLikePost = (pid) => {
    console.log(pid);
    fetch('/api/unlike', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: pid
      })
    })
      .then((res) => res.json())
      .then(result => {
        const newData = posts.map(item => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        })
        setPosts(newData);
        console.log("like result is", result);
      }).catch(err => {
        console.error(err);
      })
  }

  const makeComment = (text, postId) => {
    if (text === "" || text === null || text == " ") {
      return;
    }
    fetch("/api/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId,
        text
      }),
    }).then((response) => response.json())
      .then(result => {
        const newData = posts.map(item => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        })
        setPosts(newData);
      }).catch(err => {
        console.log(err);
      })
  }

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
                  {
                    console.log(post)
                  }
                  <div className="flex items-center pb-1 border-b-2 border-gray-300 relative">
                    {/* <Image
                      className="rounded-full bg-white"
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${post.postedBy.pic}`}
                      width={35}
                      height={35}
                    /> */}
                    <h1 className="pl-4">{post.postedBy.name}</h1>
                    <span className="absolute right-4 text-xl cursor-pointer">
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
                    />
                    <div className="flex my-2 justify-evenly text-2xl">
                      {
                        (state && post.likes.includes(state._id))
                          ?
                          <div onClick={() => { unLikePost(post._id) }}>
                            <AiFillHeart style={{ cursor: 'pointer' }} />
                            <p>{post.likes.length} likes</p>
                          </div>
                          :
                          <div onClick={() => { likePost(post._id) }}>
                            <AiOutlineHeart style={{ cursor: 'pointer' }} />
                            <p>{post.likes.length} likes</p>
                          </div>
                      }
                      {/* <FaRegComment style={{ cursor: 'pointer' }} onClick={() => { router.push("/post/" + post._id); }} /> */}
                      <FaRegComment style={{ cursor: 'pointer' }} onClick={() => { setPost(post); setModal(true); }} />
                    </div>
                    <div>
                      {
                        (post.comments && post.comments.length > 0)
                        &&
                        <div>
                          <p>view all {post.comments.length} comments</p>
                        </div>
                      }

                    </div>
                    <div>
                      <form
                        className={styles.CommentBox}
                        onSubmit={(e) => {
                          e.preventDefault();
                          console.log(e.target[0].value);
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

          <div>
            {/* <!-- Button trigger modal --> */}
            <button type="button" class="px-6
      py-2.5
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out" data-bs-toggle="modal" data-bs-target="#exampleModal">
              Launch demo modal
            </button>

            {/* <!-- Modal --> */}
            <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
              id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog relative w-auto pointer-events-none">
                <div
                  class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                  <div
                    class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                    <h5 class="text-xl font-medium leading-normal text-gray-800" id="exampleModalLabel">Modal title</h5>
                    <button type="button"
                      class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                      data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body relative p-4">
                    Modal body text goes here.
                  </div>
                  <div
                    class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                    <button type="button" class="px-6
          py-2.5
          bg-purple-600
          text-white
          font-medium
          text-xs
          leading-tight
          uppercase
          rounded
          shadow-md
          hover:bg-purple-700 hover:shadow-lg
          focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0
          active:bg-purple-800 active:shadow-lg
          transition
          duration-150
          ease-in-out" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="px-6
      py-2.5
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out
      ml-1">Save changes</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
