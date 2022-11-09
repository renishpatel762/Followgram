import React, { useState } from "react";
import Image from "next/image";
import { GrClose } from "react-icons/gr";
import { AiOutlineUserAdd, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import styles from "../styles/Modal.module.css";
import { useRouter } from "next/router";

export default function Modal({ closeModal, post, state, likePost, makeComment, unLikePost, posts, setPosts, setPost }) {
  console.log("post is", post);
  const router = useRouter();
  return (
    <div className="opacity-100">
      <div
        className={`fixed w-[100vw] md:w-[90vw] lg:w-[80vw] md:ml-[5vw] lg:ml-[10vw] top-[5vh] z-30 md:text-lg xl:text-xl bg-gray-200 rounded-md py-4`}
      >
        <div className="relative">
          <span
            className="absolute right-4 -top-1 cursor-pointer z-30"
            onClick={closeModal}
          >
            <GrClose />
          </span>
        </div>
        <div className="flex ">
          <div className="pl-6 w-1/2">
            <Image
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/posts/${post.photo}`}
              width={500}
              height={500}
            />
          </div>
          {/* className="relative pl-6 w-1/2 pr-6 " */}
          <div className={styles.maincontainer} >
            <div className="flex items-center pb-1 border-b-2 border-gray-300 upperdiv cursor-pointer"
              onClick={() => {
                if (post.postedBy._id !== state._id)
                  router.push("/profile/" + post.postedBy._id)
                else {
                  router.push("/profile");
                  closeModal();
                }
              }}
            >
              <Image
                className="rounded-full bg-white"
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${post.postedBy.pic}`}
                width={40}
                height={40}
              />
              <div>
                <p className="pl-4">{post.postedBy.name}</p>
                {/* <div style={{height:'100px'}}> */}
                  <p className="pl-4 text-sm mr-20">{post.body}</p>
                {/* </div> */}
              </div>
              <div className="absolute right-10 text-xl cursor-pointer">
                <AiOutlineUserAdd />
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
                      <div className="flex m-5" key={citem._id}>
                        <div className="flex cursor-pointer"
                          onClick={() => {
                            closeModal();
                            if (citem.postedBy._id !== state._id) {
                              router.push("/profile/" + citem.postedBy._id)
                            }
                            else {
                              router.push("/profile");
                            }
                          }}>
                          <Image
                            className="rounded-full bg-white"
                            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${citem.postedBy.pic}`}
                            width={40}
                            height={40}
                          />
                          <p className="pl-1">{citem.postedBy.name}</p>
                        </div>
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
                    // ikePost(post._id)
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
                    // makeComment(e.target[0].value, post._id);
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
