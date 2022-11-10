import React, { useState } from "react";
import Image from "next/image";
import { GrClose } from "react-icons/gr";
import { AiOutlineUserAdd, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import styles from "../styles/TextModal.module.css";
import { BsPlay, BsPause, BsStop } from "react-icons/bs";
import { useRouter } from "next/router";

export default function TextModal({ closeTex, tModal, post, state, likePost, makeComment, unLikePost, speaking, postId, handleAudio, closeTextModal, isFromProfilePage, posts, setPosts, setPost, handleDeletePost }) {
    const router = useRouter();
    const [postSettingModal, setPostSettingModal] = useState(false);
    // console.log("post is", post);
    return (
        <div className="opacity-100">
            <div
                className={`fixed w-[100vw] md:w-[90vw] lg:w-[80vw] md:ml-[5vw] lg:ml-[10vw] top-[5vh] z-30 md:text-lg xl:text-xl bg-gray-200 rounded-md py-4`}
            >
                <div className="relative">
                    <span
                        className="absolute right-4 -top-1 cursor-pointer z-30"
                        onClick={closeTextModal}
                    >
                        <GrClose />
                    </span>
                </div>
                {
                    postSettingModal
                    &&
                    <div className="opacity-100">
                        <div
                            className={`fixed w-[50vw] md:w-[50vw] lg:w-[50vw] md:ml-[25vw] lg:ml-[25vw] top-[20vh] z-30 md:text-lg xl:text-xl bg-gray-200 rounded-md py-4`}
                        >
                            <div className="text-center cursor-pointer">
                                <p className="text-red-600" onClick={() => {
                                    handleDeletePost(post._id)
                                    closeTextModal()
                                }}>Delete Post</p>
                                <p onClick={() => setPostSettingModal(false)}>Cancel</p>
                            </div>
                        </div>
                    </div>
                }
                <div className="flex ">
                    <div className="pl-6 w-1/2">
                        <h3>{post.type}</h3>
                        <h1>{post.title}</h1>
                        <p className="text-xl">{post.body}</p>
                        {/* <Image
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/posts/${post.photo}`}
              width={500}
              height={500}
            /> */}
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
                    {/* className="relative pl-6 w-1/2 pr-6 " */}
                    <div className={styles.maincontainer} >
                        <div className="flex items-center pb-1 border-b-2 border-gray-300 upperdiv ">
                            <Image
                                className="rounded-full bg-white cursor-pointer"
                                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${post.postedBy.pic}`}
                                width={40}
                                height={40}
                                onClick={() => {
                                    if (post.postedBy._id !== state._id)
                                        router.push("/profile/" + post.postedBy._id)
                                    else {
                                        router.push("/profile");
                                        closeTextModal();
                                    }
                                }}
                            />
                            <div>
                                <p className="pl-4 cursor-pointer" onClick={() => {
                                    if (post.postedBy._id !== state._id)
                                        router.push("/profile/" + post.postedBy._id)
                                    else {
                                        router.push("/profile");
                                        closeTextModal();
                                    }
                                }}>{post.postedBy.name}</p>
                                <p className="pl-4 text-sm">{post.title}</p>
                            </div>

                            <div className="absolute right-10 text-xl">
                                {
                                    // console.log("isFromProfilePage",isFromProfilePage)
                                    isFromProfilePage
                                        ?
                                        <p className="text-3xl cursor-pointer" onClick={() => setPostSettingModal(true)}>...</p>
                                        :
                                        <AiOutlineUserAdd className="cursor-pointer" onClick={() => {
                                            if (post.postedBy._id !== state._id)
                                                router.push("/profile/" + post.postedBy._id)
                                            else {
                                                router.push("/profile");
                                                closeTextModal();
                                            }
                                        }} />
                                }
                                <p className="text-xs">
                                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                        {/* border-b-2 border-gray-300  */}
                        <div className={styles.middlediv}>
                            {
                                post.comments.length > 0
                                    ?
                                    post.comments.map(citem => {
                                        console.log(citem)
                                        return (
                                            <div className="flex m-5 cursor-pointer"
                                                onClick={() => {
                                                    closeTextModal();
                                                    if (citem.postedBy._id !== state._id) {
                                                        router.push("/profile/" + post.postedBy._id)
                                                    }
                                                    else {
                                                        router.push("/profile");
                                                    }
                                                }}
                                                key={citem._id}>
                                                <Image
                                                    className="rounded-full bg-white"
                                                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${citem.postedBy.pic}`}
                                                    width={40}
                                                    height={40}
                                                />
                                                <p className="pl-1">{citem.postedBy.name}</p>
                                                <p className="font-light pl-2">{citem.text}</p>
                                            </div>
                                        )
                                    })
                                    :
                                    <div>
                                        <p className="m-5">No Comments yet</p>
                                    </div>
                            }
                        </div>
                        {/* flex text-2xl mt-2 */}
                        <div className={styles.bottomdiv}>
                            {
                                (state && post.likes.includes(state._id))
                                    ?
                                    <div onClick={() => {
                                        unLikePost(post._id, posts, setPosts, setPost)
                                    }}>
                                        <AiFillHeart className="cursor-pointer" />
                                        <p>{post.likes.length} likes</p>
                                    </div>
                                    :
                                    <div onClick={() => {
                                        // if (!isFromFunctionset)
                                        //     likePost(post._id)
                                        // else {
                                        //     likePost(post._id, posts, setPosts, setPost)

                                        // }
                                        likePost(post._id, posts, setPosts, setPost)
                                    }}>
                                        <AiOutlineHeart className="cursor-pointer" />
                                        <p>{post.likes.length} likes</p>
                                    </div>
                            }
                            <div className="ml-2">
                                <form
                                    className={styles.CommentBox}
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        console.log(e.target[0].value);
                                        makeComment(e.target[0].value, post._id, posts, setPost, setPosts);
                                        e.target[0].value = "";
                                    }}>
                                    <input className={styles.CommentInput} type="text" placeholder="add a comment" />
                                    <button >Post</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
