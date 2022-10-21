import React, { useState } from "react";
import Image from "next/image";
import { GrClose } from "react-icons/gr";
import { AiOutlineUserAdd, AiFillHeart, AiOutlineHeart } from "react-icons/ai";

export default function Modal({ closeModal, post }) {
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
        <div className="flex">
          <div className="pl-6 w-1/2">
            <Image
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/posts/${post.photo}`}
              width={500}
              height={500}
            />
          </div>
          <div className="relative pl-6 w-1/2 pr-6">
            <div className="flex items-center pb-1 border-b-2 border-gray-400">
              <Image
                className="rounded-full bg-white"
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${post.postedBy.pic}`}
                width={20}
                height={20}
              />
              <p className="pl-4">{post.postedBy.name}</p>
              <span className="absolute right-10 text-xl cursor-pointer">
                <AiOutlineUserAdd />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
