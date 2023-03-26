import React, { useEffect, useState } from "react";
import {
  EllipsisHorizontalIcon,
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  ShareIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  ArrowPathIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { HeartIcon as FilledIcon } from "@heroicons/react/24/solid";
import Moment from "react-moment";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "/firebase";
import { deleteObject, ref } from "firebase/storage";
import { useRecoilState } from "recoil";
import { modalState } from "/atom/modalAtom";
import { postIdState } from "/atom/modalAtom";
import { useRouter } from "next/router";

export default function Post({ post, id }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [comment, setComment] = useState([]);
  const router = useRouter();

  const deletePost = () => {
    if (window.confirm("Are you Sure ?")) {
      deleteDoc(doc(db, "posts", id));
      if (post.data().image) {
        deleteObject(ref(storage, `posts/${id}/image`));
      }
      router.push("/");
    }
  };

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "comments"), (snapshot) =>
        setComment(snapshot.docs)
      ),

    [db]
  );

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === session?.user.uid) != -1);
  }, [likes]);

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),

    [db]
  );

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", session?.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session?.user.uid), {
        username: session.user.username,
      });
    }
  };

  return (
    <div className="hover:bg-gray-50 flex p-3 cursor-pointer border-b border-gray-200">
      <img
        className="h-11 w-11 rounded-full mr-4"
        src={post?.data()?.userImg}
        alt="user-img"
      />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
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
          <EllipsisHorizontalIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2 " />
        </div>

        <p
          onClick={() => {
            if (router !== `/posts/${id}/`) {
              router.push(`/posts/${id}/`);
            }
          }}
          className="text-gray-800 text-[15px sm:text-[16px] mb-2"
        >
          {post?.data()?.text}
        </p>
        <img
          onClick={() => {
            if (router !== `/posts/${id}/`) {
              router.push(`/posts/${id}/`);
            }
          }}
          className="rounded-2xl mr-15"
          src={post?.data()?.postImage}
          alt=""
        />

        {/* icons */}
        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex justify-center items-center">
            <ChatBubbleOvalLeftIcon
              onClick={() => {
                setPostId(id);
                setOpen(!open);
              }}
              className="h-9 w-9 hover:bg-sky-100 rounded-full p-2 hover:text-sky-500 hover:bg-sky-100"
            />
            {comment.length > 0 && <span>{comment.length}</span>}
          </div>

          <ArrowPathIcon className="h-9  p-2 hover:bg-sky-100 hover:text-sky-500 rounded-full cursor-pointer transition-all duration-60" />

          <div className="flex items-center">
            {hasLiked ? (
              <FilledIcon
                onClick={() => likePost()}
                className="text-red-500 h-9 p-2"
              />
            ) : (
              <HeartIcon
                onClick={() => likePost()}
                className="h-9 p-2 hover:bg-red-100 hover:text-red-500 rounded-full cursor-pointer transition-all duration-60"
              />
            )}
            {likes.length > 0 && (
              <span className={`${hasLiked && "text-red-400"}`}>
                {likes.length}
              </span>
            )}
          </div>

          {post?.data()?.id === session?.user.uid && (
            <TrashIcon
              onClick={() => deletePost()}
              className="h-9 p-2 hover:bg-red-100 hover:text-red-500 rounded-full cursor-pointer transition-all duration-60"
            />
          )}

          <ArrowUpTrayIcon className="h-9  p-2 hover:bg-sky-100 hover:text-sky-500 rounded-full cursor-pointer transition-all duration-60" />
        </div>
      </div>
    </div>
  );
}
