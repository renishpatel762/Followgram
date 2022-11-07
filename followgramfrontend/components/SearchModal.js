import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GrClose } from "react-icons/gr";
import { AiOutlineUserAdd, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import styles from "../styles/Modal.module.css";
import { useRouter } from "next/router";

export default function SearchModal({ closeModal }) {
    // console.log("post is", post);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const searchRef = useRef(null);
    const [resultData, setResultData] = useState([]);

    useEffect(() => {

    }, []);

    const handleSearchTermChange = (event) => {
        // console.log("handlesearchTerm called");
        const input = event.target.value;
        setSearchTerm(input);
        searchRef.current = input;
        BetterFunction();
    }
    const handleAPICall = () => {
        const searchTermCurrent = searchRef.current;
        // console.log("searchTermCurrent", searchTermCurrent);
        // console.log("searchRef is ", searchRef);
        // console.log("searchRef Current ", searchRef.current);
        // console.log("handleAPICall called");
        fetch('/api/search', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({
                searchquery:searchTermCurrent 
            })
        }).then((response) => response.json())
            .then(({ accountdata }) => {
                console.log("accountdata",accountdata);
                setResultData(accountdata);
            })
    }


    const myDeBounce = (fn, delay) => {
        let timer;
        return () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn();
            }, delay);
        };
    };

    const BetterFunction = useCallback(myDeBounce(() => handleAPICall(), 500), []);

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
                <div className="flex border-2 border-black">
                    {/* <p className="">Hello </p> */}
                    <input className={styles.CommentInput} type="text" placeholder="search" onChange={handleSearchTermChange} />
                    <button onClick={handleAPICall}>Search</button>
                </div>
                {
                    resultData
                    &&
                    resultData.map(ritem =>
                        <div id={ritem._id}>
                            <p>{ritem.name}</p>
                            <p>{ritem.email}</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
