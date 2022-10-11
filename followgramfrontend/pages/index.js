import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ImagePost from "../components/ImagePost";
import TextPost from "../components/TextPost";

export default function Home({
  speak,
  cancel,
  speaking,
  supported,
  voices,
  photoPost,
  postFilter,
  previousPostFilter,
  date1,
  date2,
}) {
  const router = useRouter();
  // const [photoPost, setPhotoPost] = useState(true);
  // const [postFilter, setPostFilter] = useState("all");
  // const [previousPostFilter, setPreviousPostFilter] = useState("all");
  // const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      router.push("/welcome");
    }
  }, []);

  useEffect(() => {
    console.log(date1);
    console.log(date2);
  }, [date1, date2]);

  return (
    <div className="h-full">
      <Head>
        <title>Followgram</title>
        <meta
          name="description"
          content="Followgram share posts & text with your friend"
        />
      </Head>
      <div>
        {photoPost ? (
          <ImagePost
            postFilter={postFilter}
            previousPostFilter={previousPostFilter}
            date1={date1}
            date2={date2}
          />
        ) : (
          <TextPost
            speak={speak}
            cancel={cancel}
            speaking={speaking}
            supported={supported}
            voices={voices}
            postFilter={postFilter}
            previousPostFilter={previousPostFilter}
            date1={date1}
            date2={date2}
          />
        )}
      </div>
    </div>
  );
}
