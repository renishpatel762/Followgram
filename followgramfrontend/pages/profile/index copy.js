import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import useSWRInfinite from "swr/infinite";
import loader from "../../public/loader.svg";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsPlay, BsPause, BsStop } from "react-icons/bs";
import { UserContext } from "../_app";
import Modal from "../../components/Modal";
import { FaRegCalendar, FaRegComment } from "react-icons/fa";
import TextModal from "../../components/TextModal";
import { likePost, unLikePost, makeComment } from "../../components/Functionset";
const PAGE_SIZE = 3;
let category = "Media";
let expandArray = [];
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

  const [state, dispatch] = useContext(UserContext);
  // const[totalpost,setTotalPost]=useState(0);
  // const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [morePosts, setMorePosts] = useState(true);
  const [fetchedCategory, setFetchedCategory] = useState("Media");
  const [isPlaying, setIsPlaying] = useState(false);
  const [postId, setPostId] = useState("");
  // const { data, error } = useSWR("/api/allpost", fetcher);
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher
  );
  const [post, setPost] = useState(null);
  const [modal, setModal] = useState(false);
  const [textModal, setTextModal] = useState(false);

  const [collectionData, setCollectionData] = useState([]);
  const [expand, setExpand] = useState(false);

  const router = useRouter();
  let isLoadingMore = true,
    isReachedEnd = false;
  let options = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };


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
    console.log(posts);
  }, [data]);


  const changeCategory = (cat) => {
    setFetchedCategory(cat);

    if (cat !== "Collection")
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
        setTimeout(() => {
          setPostId(post._id);
          // speak({ text: post.body, voice: voices[voiceIndex] });
          speak({ text: post.body });
        }, 300);
      } else {
        setPostId(post._id);
        // speak({ text: post.body, voice: voices[voiceIndex] });
        speak({ text: post.body });
      }

      // if (speaking) {
      //   cancel();
      // }

      // setPostId(post._id);
      // setIsPlaying(true);
      // speak({ text: post.body });
    } else {
      alert("Sorry!! This feature is not supported in your browser");
    }
  };

  const handleDeletePost = (pid) => {
    console.log("handleDeletePost called", pid);
    fetch(`/api/deletepost/${pid}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((response) => response.json())
      .then(result => {
        console.log(result);
        const newData = posts.map(item => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        })
        setPosts(newData);
      })

  }
  useEffect(() => {
    console.log(postId);
  }, [postId]);

  useEffect(() => {
    fetch('/api/getcollections', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((response) => response.json())
      .then(({ usercoll }) => {
        console.log("collection result is", usercoll);
        expandArray = Array(usercoll.length);
        expandArray.fill(1)
        console.log("expandArray", expandArray);
        setCollectionData(usercoll)
      })
      .catch(err => {
        console.error(err);
      })



  }, []);

  return (
    <div className="min-h-screen px-2 dark:text-white dark:bg-gray-800">
      <div id="modalBox">
        {modal && (
          <Modal
            post={post}
            state={state}
            posts={posts}
            setPosts={setPosts}
            setPost={setPost}
            likePost={likePost}
            unLikePost={unLikePost}
            makeComment={makeComment}
            isFromProfilePage={true}
            handleDeletePost={handleDeletePost}
            closeModal={() => {
              setModal(false);
            }}
          />
        )}
        {
          textModal && (
            <TextModal
              post={post}
              state={state}
              posts={posts}
              setPosts={setPosts}
              setPost={setPost}
              likePost={likePost}
              unLikePost={unLikePost}
              makeComment={makeComment}
              handleAudio={handleAudio}
              isFromProfilePage={true}
              handleDeletePost={handleDeletePost}
              // isFromFunctionset="true"
              //just some

              closeTextModal={() => {
                setTextModal(false);
              }}
            />
          )
        }
      </div>
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
          <button className="mt-2">Change Profile</button>
        </div>
        <div className="w-2/3 pt-3 pl-4 md:pl-0 overflow-x-hidden">
          <h2 className="text-2xl">{state && state.name}</h2>
          <h2 className="text-md">{state && state.email}</h2>
          <div className="flex py-5 text-sm md:text-lg">
            <div className="w-1/3 md:w-1/5 text-center">
              <p>{(state && state.posts ) ? state.posts.length : 0}</p>
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
          <button className="text-black dark:text-white dark:border-white border-black border-2 py-1 px-2 rounded-md hover:border-blue-400 hover:text-blue-400" 
          onClick={()=>router.push('/profile/setting')}>
              Settings
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
          className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Media" ? "" : "border-blue-400 border-b-2"
            }`}
          onClick={() => {
            changeCategory("Media");
          }}
        >
          Photos
        </p>
        <p
          className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Joke" ? "" : "border-blue-400 border-b-2"
            }`}
          onClick={() => {
            changeCategory("Joke");
          }}
        >
          Jokes
        </p>
        <p
          className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Shayari" ? "" : "border-blue-400 border-b-2"
            }`}
          onClick={() => {
            changeCategory("Shayari");
          }}
        >
          Shayari
        </p>
        <p
          className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Quote" ? "" : "border-blue-400 border-b-2"
            }`}
          onClick={() => {
            changeCategory("Quote");
          }}
        >
          Quotes
        </p>

        {/* <p
          className={`mx-2 text-2xl cursor-pointer ${(fetchedCategory !== "TextPost" && fetchedCategory !== "Joke" && fetchedCategory !== "Shayari" && fetchedCategory !== "Quote") ? "" : "border-blue-400 border-b-2"
            }`}
          onClick={() => {
            changeCategory("Joke");
          }}
        >
          TextPost
        </p> */}
        {/* <p
          className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Collection" ? "" : "border-blue-400 border-b-2"
            }`}
          onClick={() => {
            changeCategory("Collection");
          }}
        >
          Collections
        </p> */}
      </div>
      {/* <div className="flex justify-evenly mt-10">
        {
          (fetchedCategory === "TextPost" || fetchedCategory === "Joke" || fetchedCategory === "Shayari" || fetchedCategory === "Quote") &&
          <>
            <p
              className={`mx-2 text- xl cursor-pointer ${fetchedCategory !== "Joke" ? "" : "border-blue-400 border-b-2"
                }`}
              onClick={() => {
                changeCategory("Joke");
              }}
            >
              Jokes
            </p>
            <p
              className={`mx-2 text-xl cursor-pointer ${fetchedCategory !== "Shayari" ? "" : "border-blue-400 border-b-2"
                }`}
              onClick={() => {
                changeCategory("Shayari");
              }}
            >
              Shayari
            </p>
            <p
              className={`mx-2 text-xl cursor-pointer ${fetchedCategory !== "Quote" ? "" : "border-blue-400 border-b-2"
                }`}
              onClick={() => {
                changeCategory("Quote");
              }}
            >
              Quotes
            </p>
          </>}
      </div> */}
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
          <div className="flex flex-wrap items-center w-full px-2 md:px-10 dark:bg-gray-800">
            {fetchedCategory === "Media" &&
              posts.map((post) => (
                <div
                  key={post._id}
                  className="w-1/3 text-center py-1 px-1 md:py-2 md:px-3"
                >
                  <Image
                    className="hover:opacity-40 hover:cursor-pointer"
                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/posts/${post.photo}`}
                    width={50}
                    height={50}
                    layout="responsive"
                    // onMouseEnter={}
                    onClick={() => {
                      setPost(post);
                      setModal(true);
                    }}
                  />
                </div>
              ))}
            {(fetchedCategory === "TextPost" || fetchedCategory === "Joke" || fetchedCategory === "Shayari" || fetchedCategory === "Quote") &&
              posts.map((post) => (
                <div
                  key={post._id}
                  className="w-full my-2 py-2 px-1 rounded-md md:my-2 md:py-4 md:px-3 dark:bg-gray-600 dark:text-white bg-gray-300 text-black"
                >
                  <p className="pl-4 text-2xl font-bold cursor-pointer" onClick={() => { setPost(post); setTextModal(true); }}>{post.body}</p>
                  <p className="text-right pr-4">
                    {new Date(post.createdAt).toLocaleDateString(
                      "en-US",
                      options
                    )}
                  </p>
                  <div className="flex justify-evenly">
                    {
                      (state && post.likes.includes(state._id))
                        ?
                        <div onClick={() => { unLikePost(post._id, posts, setPosts, setPost) }}>
                          <AiFillHeart className="cursor-pointer" />
                          <p>{post.likes.length} likes</p>
                        </div>
                        :
                        <div onClick={() => { likePost(post._id, posts, setPosts, setPost) }}>
                          <AiOutlineHeart className="cursor-pointer" />
                          <p>{post.likes.length} likes</p>
                        </div>
                    }
                    <div className="cursor-pointer" onClick={() => {
                      setPost(post);
                      setTextModal(true);
                    }}>
                      <FaRegComment />
                      {
                        post.comments.length > 0
                          ?
                          <p>{post.comments.length} comments</p>
                          :
                          <p>No Comments</p>
                      }
                    </div>
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


            {/* {
              fetchedCategory === "Collection"
              &&
              collectionData.map((citem,cindex) => (
                <div
                  key={citem._id}
                  className="w-full my-2 py-2 px-1 rounded-md md:my-2 md:py-4 md:px-3 dark:bg-gray-600 dark:text-white bg-gray-300 text-black"
                >
                  <p>Name: {citem.name}</p>
                  <p>ImagePost {citem.imagePost.length}</p>
                  <p>TextPost {citem.textPost.length}</p>
                  <div className="">
                    <button onClick={() => {
                      expandArray[cindex]= 1
                      console.log(expandArray[cindex]);
                      }}>expand</button>
                    {
                      expandArray[cindex] === 1 &&
                      <>
                        {
                          citem.imagePost.length > 0
                          &&
                          citem.imagePost.map(ciitem => (
                            <div
                              key={ciitem._id}
                              className="w-1/3 text-center py-1 px-1 md:py-2 md:px-3"
                            >
                              <Image
                                className="hover:opacity-40 hover:cursor-pointer"
                                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/posts/${ciitem.photo}`}
                                width={50}
                                height={50}
                                layout="responsive"
                                onClick={() => {
                                  setPost(ciitem);
                                  setModal(true);
                                }}
                              />

                            </div>
                          ))
                        }
                        {
                          citem.textPost.length > 0
                          &&
                          citem.textPost.map(ctitem => (
                            <div
                              key={ctitem._id}
                              className="w-full my-2 py-2 px-1 rounded-md md:my-2 md:py-4 md:px-3 dark:bg-gray-600 dark:text-white bg-gray-300 text-black"
                            >
                              <p>{ctitem.type}</p>
                              <p className="pl-4 text-2xl font-bold cursor-pointer" onClick={() => {
                                setPost(ctitem);
                                setTextModal(true);
                              }}>{ctitem.body}</p>
                            </div>
                          ))
                        }
                      </>

                    }
                  </div>
                  <div>
                  </div>
                </div>
              ))

            } */}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
