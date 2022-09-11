import React from 'react'
import { useRouter } from 'next/router'

import Head from 'next/head'
import Sidebar from '../../components/Sidebar'
import Feed from '../../components/Feed'
import Widgets from '../../components/Widgets'
import { useSession, signOut } from "next-auth/react"
import { AnimatePresence, motion } from 'framer-motion'
import Post from '../../components/Post'
import Comments from '../../components/Comments'
import { useEffect, useState, useRef } from 'react'
import CommentModal from '../../components/CommentModal';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

import { ArrowLeftIcon, CalendarIcon, FaceSmileIcon, GifIcon, MapPinIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { onSnapshot, addDoc,updateDoc, serverTimestamp, collection, doc, orderBy, query } from 'firebase/firestore'
import { db, storage } from '../../firebase'

export default function posts({newsResults, userRandom}) {
  const{data: session} = useSession();
    const router = useRouter();

    const {id} = router.query;

  const[post, setPost] = useState();
  const [comment, setComment] = useState([]);
  const[input, setInput] = useState("");
  const filePickerRef = useRef(null);
  const[selectedImage, setSelectedImage] = useState(null);
   const [loading, setLoading] = useState(false);

  

 useEffect(
  () => onSnapshot(doc(db, "posts", id), (snapshot) => setPost(snapshot)),
  [db, id]);



  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setComment(snapshot.docs)
    );
  }, [db, id]);




  useEffect(()=>{

 if(!session){
  
router.push("/")
 }
  
  },[db, id])

  console.log(posts);


      
  const addImageToPost = (e)=> {

    const reader = new FileReader();
 
    if(e.target.files[0]){
     reader.readAsDataURL(e.target.files[0])
    }
    reader.onload = (readerEvent) => {
  
setSelectedImage(readerEvent.target.result);

console.log(setSelectedImage);
    


}
   
     }


     


  const sendComment = async() => {
      if(loading) return;

      setLoading(true);

      const docRef = await addDoc(collection(db, "posts", id, "comments"), {
        id:session.user.uid,
        comment: input,
        timestamp: serverTimestamp(),
        userImg: session.user.image,
        name: session.user.name,

        username: session.user.username,

})
    
      const imageRef = ref(storage, `comments/${id}/image`);

      if(selectedImage){

        await uploadString(imageRef, selectedImage, "data_url").then(async() => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "posts", id, "comments", docRef.id ), {
            postImage: downloadURL
          });
        })
       }
         

setInput("")
setSelectedImage(null);
setLoading(false);

 
}



  return (
   

<div className="xl max-h-screen mx-auto">
      <Head>
        <title>{post?.data()?.name} Post</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <main className="flex min-h-screen mx-auto">

      
  <Sidebar />


  <div className="xl:ml-[370px] border-l border-r border-gray-200 xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
     <div className="flex py-2 px-3 space-x-8 items-center sticky top-0 z-50 bg-white border-b border-gray-200">
      <ArrowLeftIcon onClick={() =>{
        router.push("/")
      } } className="h-7 hover:bg-gray-200 rounded-full p-1" />
 <h1 className="font-bold">Tweet</h1>

{/* className="h-5 mr-2 w-5 cursor-pointer text-twitter transition-all duration-500 ease-out hover:rotate-180 active:scale-125 */}
</div>



<AnimatePresence>


<motion.div
    key={id}
    initial={{opacity:0}}
    animate={{opacity:1}}
    exit={{opacity:0}}
    transition={{duration: 1}}
   >
<Post id={id} key={id} post={post} />

</motion.div>

</AnimatePresence>




<div className="flex space-x-2 p-5  border-b">

 
<img className="mt-4 w-14 h-14 rounded-full" alt="user-photo" src={session?.user.image} />

<div className="flex flex-1 items-center pl-2 ">
  <div className="flex flex-1 flex-col">


    <input value={input}  onChange={(e) => setInput(e.target.value)} type="text" className="h-24 w-full text-xl outline-none placeholder:text-xl" placeholder="Tweet your reply"/>


    { selectedImage && <div className="-left-20  flex ">
  <XMarkIcon onClick={()=> setSelectedImage(null)} className="hover:bg-black shadow-md shadow-white h-10 w-10 cursor-pointer text-white  absolute bg-red-500 left-30 font-bold rounded-full"/>
            <img src={selectedImage} className={`h-25 w-50 pb-2 rounded-lg ${loading && "animate-pulse"}`} />
            </div>
          }


    <div className="flex  items-center">


        <div className="flex space-x-2 flex-1 relative text-twitter" >

        
    <PhotoIcon  onClick={()=>filePickerRef.current.click()} className="h-7 w-7 cursor-pointer hover:bg-blue-200 rounded-full p-1"/>
  <input type="file" hidden  ref={filePickerRef} onChange={addImageToPost} />
    <GifIcon className="h-7 w-7 cursor-pointer hover:bg-blue-100 rounded-full p-1 h-7 w-7" />
     <FaceSmileIcon className="h-7 w-7 hover:bg-blue-100 rounded-full p-1 w-7 h-7" />
  <CalendarIcon className="h-7 w-7  hover:bg-blue-100 rounded-full p-1 w-7 h-7" />
  <MapPinIcon className="h-7 w-7 opacity-40" />
         </div>
         {
          !loading && <>
          
          <button onClick={()=>sendComment()} disabled={!input} className=" rounded-full bg-twitter px-5 py-2 font-bold text-white disabled:opacity-40">Reply</button>
          </>

         }
</div>
  </div>

</div>
</div>


<AnimatePresence>



{
  comment.map((comment) => (

    <Comments key={comment.id} commentId={comment.id} post={post} comment={comment} orginalPostId={id} />

  ))
}

</AnimatePresence>

 </div>




<Widgets newsResults={newsResults.articles}  userRandom={userRandom.results}/>

<CommentModal />
   
      </main>

    
    </div>
  )
}

export const getServerSideProps = async () => {

  const newsResults = await fetch("https://saurav.tech/NewsAPI/top-headlines/category/business/us.json")
  .then((res) => res.json());

  
  let userRandom = [];

  try {
    const res = await fetch(
      "https://randomuser.me/api/?results=30&inc=name,login,picture"
    );

    userRandom= await res.json();
  } catch (e) {
   userRandom = [];
  }

  
  return{
    props:{
      newsResults,
      userRandom,

    }
  }


}
