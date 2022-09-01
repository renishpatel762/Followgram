import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { NextUIProvider } from '@nextui-org/react';
import { useState } from "react";

function MyApp({ Component, pageProps }) {

  const [key , setKey] = useState(0);

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setKey(Math.random());
  }
  
  return (
    <NextUIProvider>
      <Navbar logoutUser={logoutUser} />
      <Component {...pageProps} key={key}/>
    </NextUIProvider>
  );
}

export default MyApp;
