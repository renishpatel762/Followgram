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
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher
  );
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
          <button className="mt-2">Change Profile</button>
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
          <button className="text-black dark:text-white dark:border-white border-black border-2 py-1 px-2 rounded-md hover:border-blue-400 hover:text-blue-400">
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
            {fetchedCategory !== "Media" &&
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
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
