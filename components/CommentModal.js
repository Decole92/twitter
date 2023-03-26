import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "/atom/modalAtom";
import Modal from "react-modal";
import { postIdState } from "/atom/modalAtom";
import {
  XMarkIcon,
  CalendarIcon,
  FaceSmileIcon,
  GifIcon,
  MapPinIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "/firebase";
import Moment from "react-moment";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
export default function CommentModal() {
  const { data: session } = useSession();
  const filePickerRef = useRef(null);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId] = useRecoilState(postIdState);
  const [post, setPost] = useState(null);
  const [input, setInput] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [loading, setLoading] = useState([]);

  const router = useRouter();

  const sendComment = async () => {
    await addDoc(collection(db, "posts", postId, "comments"), {
      id: session.user.uid,
      comment: input,
      name: session.user.name,
      username: session.user.username,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    });
    setOpen(false);
    setInput("");

    if (router !== `/posts/${postId}`) {
      router.push(`/posts/${postId}`);
    }
  };

  const addImageToPost = () => {};

  useEffect(
    () => onSnapshot(doc(db, "posts", postId), (snapshot) => setPost(snapshot)),
    [postId, db]
  );

  return (
    <div>
      {open && (
        <Modal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          className="max-w-lg w-[90%]  h-[auto] absolute top-40  left-[50%] translate-x-[-50%] bg-white border-2 border-gray-200 rounded-lg shadow-md"
        >
          <div className="p-1">
            <div className="">
              <div className="hover:bg-gray-100 rounded-full h-9 w-9 justify-center items-center flex">
                <XMarkIcon
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="h-[22px] text-black"
                />
              </div>

              <div className="p-2 flex items-center space-x-1 relative">
                <span className="w-0.5 h-full z-[-1] absolute left-8 top-[60px] bg-gray-300"></span>
                <img
                  className="h-11 w-11 rounded-full mr-4"
                  src={post?.data()?.userImg}
                />

                <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                  {post?.data()?.name}
                </h4>
                <span className="text-sm sm:text-[15px]">
                  @{post?.data()?.username} -{" "}
                </span>
                <span className="text-sm sm:text-[15px] hover:underline">
                  <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
                </span>
              </div>
              <p className="text-black text-[15px] sm:text-[16px] -mt-4 ml-[58px]">
                {post?.data()?.text}
              </p>

              <p className="text-gray-500 -[15px] sm:text-[16px]  ml-[58px]">
                Replying to{" "}
                <span className="text-twitter">@{post?.data()?.username}</span>
              </p>

              <div className="flex pl-2.5 mt-5">
                <img
                  className=" w-11 h-11 rounded-full"
                  alt="user-photo"
                  src={session?.user.image}
                />

                <div className="flex flex-1 items-center pl-2">
                  <div className="flex flex-1 flex-col">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      type="text"
                      className=" -mt-4 h-20 w-full text-xl outline-none placeholder:text-xl"
                      placeholder="Tweet your reply"
                    />

                    <div className="flex  items-center px-3">
                      <div className="flex space-x-2 -ml-6 flex-1 relative text-twitter">
                        <PhotoIcon
                          onClick={() => filePickerRef.current.click()}
                          className=" hidden h-7 w-7 cursor-pointer hover:bg-blue-200 rounded-full p-1"
                        />
                        <input
                          type="file"
                          hidden
                          ref={filePickerRef}
                          onChange={addImageToPost}
                        />
                        <GifIcon className="h-7 w-7 cursor-pointer hover:bg-blue-100 rounded-full p-1" />
                        <FaceSmileIcon className="h-7 w-7 hover:bg-blue-100 rounded-full p-1" />
                        <CalendarIcon className="h-7 w-7  hover:bg-blue-100 rounded-full p-1 " />
                        <MapPinIcon className="h-7 w-7 opacity-40" />
                      </div>

                      <button
                        onClick={() => sendComment()}
                        disabled={!input}
                        className=" rounded-full bg-twitter px-5 py-2 font-bold text-white disabled:opacity-40"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
