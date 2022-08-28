import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiUpload } from "react-icons/fi";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreatePost() {
  const [withPhoto, setWithPhoto] = useState(true);
  const [postImg, setPostImg] = useState(undefined);
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [captionTitle, setCaptionTitle] = useState("Enter Caption");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/welcome");
    }
  }, []);

  const toggleSwitch = () => {
    if (withPhoto) {
      setCaptionTitle("Enter Text");
    } else {
      setCaptionTitle("Enter Caption");
    }
    setWithPhoto(!withPhoto);
  };

  const handleChange = (e) => {
    if (e.target.name === "img") {
      setPostImg(e.target.files[0]);
    } else if (e.target.name === "title") {
      setTitle(e.target.value);
    } else if (e.target.name === "caption") {
      setCaption(e.target.value);
    }
  };

  const showToastError = (msg) => {
    toast.error(msg , {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  const handleSubmit = async () => {
    if(title.length < 4){
      showToastError('Please Enter title having more than 3 characters');
      return ;
    }

    if(caption.length < 6){
      showToastError(`Please Enter ${captionTitle.substring(6)} having more than 5 characters`)
      return ;
    }

    if (withPhoto) {
      // create post with photo
      if(!postImg){
        showToastError("Please Select Photo")
        return ;
      }
      const formData = new FormData();
      formData.append("file", postImg);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
      );
      formData.append("folder", process.env.NEXT_PUBLIC_CLOUDINARY_POST);
      // console.log(formData);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      ).then((response) => response.json());
      const index = res.secure_url.lastIndexOf("/");
      const imgName = res.secure_url.substring(index + 1);
      uploadData(imgName);
    } else {
      uploadData(undefined);
    }
  };

  const uploadData = async (img) => {
    let imageName = "";
    let isText = true;
    if (img) {
      imageName = img;
      isText = false;
    }
    const res = await fetch("/api/createpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title,
        body: caption,
        pic: imageName,
        isOnlyText: isText,
      }),
    }).then((response) => response.json());
    // console.log(res);
    if (res.post) {
      toast.success('Post Created Successfully..', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
      setTitle("");
      setCaption("");
      setPostImg(undefined);
      setCaptionTitle("Enter Caption");
      setWithPhoto(true);
    } else {
      // not getting post as response means something went wrong..
      showToastError('Something went wrong !! Please try again later');
    }
  };

  return (
    <div className="min-h-screen py-2 dark:text-white dark:bg-gray-800">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h1 className="text-center mt-4 mb-6 text-3xl font-bold">Create Post</h1>
      <div className="my-4 flex justify-center">
        <label
          htmlFor="large-toggle"
          className="inline-flex relative items-center cursor-pointer"
        >
          <input
            type="checkbox"
            value=""
            id="large-toggle"
            className="sr-only peer"
            onChange={toggleSwitch}
            checked={withPhoto}
          />
          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            With Photo
          </span>
        </label>
      </div>
      <div className="w-full max-w-md mx-auto px-2 md:py-0">
        {withPhoto && (
          <div className="mb-4">
            <span className="block text-center mt-10 mb-4">
              {postImg && (
                <Image
                  className="rounded-md bg-white"
                  src={URL.createObjectURL(postImg)}
                  width={300}
                  height={300}
                />
              )}
            </span>

            <label
              className="block cursor-pointer text-center text-gray-700 dark:text-white text-lg font-bold"
              htmlFor="img"
            >
              <span>
                <FiUpload className="mx-auto text-3xl dark:text-white text-black" />
              </span>
              <h1>{postImg ? postImg.name : "Choose Photo"}</h1>
            </label>
            <input
              className="shadow hidden appearance-none border rounded w-full py-2 px-3 text-gray-800  leading-tight focus:outline-none focus:shadow-outline"
              id="img"
              name="img"
              type="file"
              accept="image/*"
              // value={email}
              onChange={handleChange}
            />
          </div>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-lg font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800  leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={handleChange}
            placeholder="Enter Title"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-lg font-bold mb-2"
            htmlFor="caption"
          >
            {captionTitle}
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800  leading-tight focus:outline-none focus:shadow-outline"
            id="caption"
            name="caption"
            value={caption}
            onChange={handleChange}
            rows={4}
            placeholder={captionTitle}
          ></textarea>
        </div>
        <div className="my-4 text-center">
          <button
            className="text-white mx-2.5 dark:border-white border-black border-2 py-1 px-2 rounded-md hover:border-blue-400 hover:text-blue-400"
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
