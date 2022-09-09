import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useSpeechSynthesis } from 'react-speech-kit';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [text, setText] = useState('');
  const { speak , cancel , speaking , supported , voices } = useSpeechSynthesis();

  const logoutUser = () => {
    if(speaking){
      cancel();
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/welcome");
  };

  return (
    <NextUIProvider>
      <Navbar logoutUser={logoutUser} cancel={cancel} speaking={speaking} supported={supported}/>
      <Component {...pageProps} speak={speak} cancel={cancel} speaking={speaking} supported={supported} voices={voices}/>
    </NextUIProvider>
  );
}

export default MyApp;
