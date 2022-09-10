import React, { useEffect, useState } from 'react';

import { ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline'
import TweetBox from './TweetBox';
import Post from './Post';
import {signOut} from "next-auth/react";
import { db } from '../../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { AnimatePresence, motion } from "framer-motion"




export default function feed() {


  const[posts, setPosts] = useState([]);



  useEffect(() =>  onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), (snapshot) => setPosts(snapshot.docs)), [db])
  






  
  return (
    /*div className="flex sticky -top-1 bg-white border-b justify-between items-center px-2*/
 //div className="col-span-9 pt-2 lg:col-span-6  max-h-screen border-x">

 <div className="xl:ml-[370px] border-l border-r border-gray-200 xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
     <div className="flex py-2 px-3  justify-between items-center sticky top-0 z-50 bg-white border-b border-gray-200">
 <h1 className="font-bold">Home</h1>
 <SparklesIcon className="h-10 mr-2 w-10 p-2 rounded-full cursor-pointer hover:bg-gray-100" />
{/* className="h-5 mr-2 w-5 cursor-pointer text-twitter transition-all duration-500 ease-out hover:rotate-180 active:scale-125 */}
</div>
<TweetBox />
<AnimatePresence>


{
  posts.map((post) => (

    <motion.div
    key={post.id}
    initial={{opacity:0}}
    animate={{opacity:1}}
    exit={{opacity:0}}
    transition={{duration: 1}}
   >
      <Post key={post.id}  id={post.id} post={post} />
    </motion.div>
    
    
  ))
  
}
</AnimatePresence>


 </div>

  )
}
