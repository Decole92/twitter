import { CalendarIcon, FaceSmileIcon, GifIcon, MapPinIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { useState, useRef } from 'react'
import {useSession, signOut} from "next-auth/react"
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import {db, storage} from "/firebase";
import { getDownloadURL, ref, uploadString } from 'firebase/storage';





export default function TweetBox() {

    const [input, setInput]  = useState("");

    const{data: session} = useSession();

    const filePickerRef = useRef(null);

    const[selectedImage, setSelectedImage] = useState(null);

    const [loading, setLoading] = useState(false);


    
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
   

    const sendPost = async() => {
      if(loading) return;

      setLoading(true);

      const docRef = await  addDoc(collection(db, "posts"), {
        id:session.user.uid,
        text: input,
        timestamp: serverTimestamp(),
        userImg: session.user.image,
        name: session.user.name,
        username: session.user.username,

})
    
      const imageRef = ref(storage, `posts/${docRef.id}/image`);
           if(selectedImage){

            await uploadString(imageRef, selectedImage, "data_url").then(async() => {
              const downloadURL = await getDownloadURL(imageRef);
              await updateDoc(doc(db, "posts", docRef.id), {
                postImage: downloadURL
              });
            })
           }
setInput("")
setSelectedImage(null);
setLoading(false);

 
}
  
        

  return (


<div className="flex space-x-2 p-5  border-b">

 
<img onClick={() => signOut()}  className="mt-4 w-14 h-14 rounded-full cursor-pointer" alt="user-photo" src={session?.user.image} />

<div className="flex flex-1 items-center pl-2 ">
  <div className="flex flex-1 flex-col">

    <input value={input}  onChange={(e) => setInput(e.target.value)} type="text" className="h-24 w-full text-xl outline-none placeholder:text-xl" placeholder="What's Happening?"/>
    
          { selectedImage && <div className="-left-20   flex ">
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
          
          <button onClick={()=>sendPost()} disabled={!input} className=" rounded-full bg-twitter px-5 py-2 font-bold text-white disabled:opacity-40">Tweet</button>
          </>

         }
</div>
  </div>

</div>
</div>
  )
}
