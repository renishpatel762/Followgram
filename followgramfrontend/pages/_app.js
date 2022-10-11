import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useSpeechSynthesis } from "react-speech-kit";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [photoPost, setPhotoPost] = useState(true);
  const [postFilter, setPostFilter] = useState("all");
  const [previousPostFilter, setPreviousPostFilter] = useState("all");
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis();

  const logoutUser = () => {
    if (speaking) {
      cancel();
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/welcome");
  };

  return (
    <NextUIProvider>
      <Navbar
        logoutUser={logoutUser}
        cancel={cancel}
        speaking={speaking}
        supported={supported}
        photoPost={photoPost}
        setPhotoPost={setPhotoPost}
        postFilter={postFilter}
        setPostFilter={setPostFilter}
        previousPostFilter={previousPostFilter}
        setPreviousPostFilter={setPreviousPostFilter}
        date1={date1}
        setDate1={setDate1}
        date2={date2}
        setDate2={setDate2}
      />
      <Component
        {...pageProps}
        speak={speak}
        cancel={cancel}
        speaking={speaking}
        supported={supported}
        voices={voices}
        photoPost={photoPost}
        postFilter={postFilter}
        previousPostFilter={previousPostFilter}
        date1={date1}
        date2={date2}
      />
    </NextUIProvider>
  );
}

export default MyApp;
