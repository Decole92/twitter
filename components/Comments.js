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
import { db, storage } from "../firebase";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";

export default function Comments({ comment, commentId, orginalPostId, post }) {
  const { data: session } = useSession();
  const [likesComment, setLikesComment] = useState([]);
  const [hasLikedComment, setHasLikedComment] = useState(false);

  const router = useRouter();

  const deleteComment = () => {
    if (window.confirm("Are you Sure ?")) {
      deleteDoc(doc(db, "posts", orginalPostId, "comments", commentId));

      if (post.data().image) {
        deleteObject(ref(storage, `comments/${id}/image`));
      }
    }
  };

  useEffect(
    () =>
      onSnapshot(
        collection(db, "posts", orginalPostId, "comments", commentId, "likes"),
        (snapshot) => setLikesComment(snapshot.docs)
      ),

    [db],
    commentId,
    orginalPostId
  );

  useEffect(() => {
    setHasLikedComment(
      likesComment.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
  }, [likesComment]);

  const likeComment = async () => {
    if (hasLikedComment) {
      await deleteDoc(
        doc(
          db,
          "posts",
          orginalPostId,
          "comments",
          commentId,
          "likes",
          session?.user?.uid
        )
      );
    } else {
      await setDoc(
        doc(
          db,
          "posts",
          orginalPostId,
          "comments",
          commentId,
          "likes",
          session?.user?.uid
        ),
        {
          username: session.user.username,
        }
      );
    }
  };

  return (
    <div className="hover:bg-gray-50 flex p-3 cursor-pointer border-b border-gray-200">
      <img
        className="h-11 w-11 rounded-full mr-4"
        src={comment?.data()?.userImg}
        alt="user-img"
      />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
              {comment?.data()?.name}
            </h4>
            <span className="text-sm sm:text-[15px]">
              @{comment?.data()?.username} -{" "}
            </span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>{comment?.data()?.timestamp?.toDate()}</Moment>
            </span>
          </div>

          <EllipsisHorizontalIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2 " />
        </div>
        <p className="-mt-2 mb-1 text-gray-500">
          Replying to{" "}
          <span className="text-twitter">@{post?.data()?.name}</span>
        </p>

        <p className="text-gray-800 text-[15px sm:text-[16px] mb-2">
          {comment?.data()?.comment}
        </p>
        <img
          className="rounded-2xl mr-15"
          src={comment?.data()?.postImage}
          alt=""
        />

        {/* icons */}

        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex justify-center items-center">
            <ChatBubbleOvalLeftIcon className="h-9 w-9 hover:bg-sky-100 rounded-full p-2 hover:text-sky-500 hover:bg-sky-100" />
            {comment.length > 0 && <span>{comment.length}</span>}
          </div>

          <ArrowPathIcon className="h-9  p-2 hover:bg-sky-100 hover:text-sky-500 rounded-full cursor-pointer transition-all duration-60" />

          <div className="flex items-center">
            {hasLikedComment ? (
              <FilledIcon
                onClick={() => likeComment()}
                className="text-red-500 h-9 p-2"
              />
            ) : (
              <HeartIcon
                onClick={() => likeComment()}
                className="h-9 p-2 hover:bg-red-100 hover:text-red-500 rounded-full cursor-pointer transition-all duration-60"
              />
            )}
            {likesComment.length > 0 && (
              <span className={`${hasLikedComment && "text-red-400"}`}>
                {likesComment.length}
              </span>
            )}
          </div>

          {comment?.data()?.id === session?.user.uid && (
            <TrashIcon
              onClick={() => deleteComment()}
              className="h-9 p-2 hover:bg-red-100 hover:text-red-500 rounded-full cursor-pointer transition-all duration-60"
            />
          )}
          <ArrowUpTrayIcon className="h-9  p-2 hover:bg-sky-100 hover:text-sky-500 rounded-full cursor-pointer transition-all duration-60" />
        </div>
      </div>
    </div>
  );
}
