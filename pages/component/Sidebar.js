import React from 'react'

import {BellIcon,
HashtagIcon,
BookmarkIcon,

EllipsisHorizontalCircleIcon,
EnvelopeIcon,
EllipsisHorizontalIcon,
UserIcon,

IdentificationIcon,
} from '@heroicons/react/24/outline';
import {HomeIcon} from '@heroicons/react/24/solid'
import SidebarMenuItems from './SidebarMenuItems'


import { useSession, signOut } from "next-auth/react"

export default function Sidebar() {

  const {data: session } = useSession();




  return (



   //div className="col-span-3 flex flex-col px-4 md:items-start fixed bg-white">
   <div className="hidden sm:flex flex-col p-2 xl:items-start fixed h-full xl:ml-24">
   {/* Twitter Logo */}

   
     <img className="h-10 w-10 ml-4 mb-5 hover:bg-blue-100 rounded-full p-1 cursor-pointer transition-all duration-200" src="https://links.papareact.com/drq" alt="" />

    <SidebarMenuItems Icon={HomeIcon}  title="Home" active={true} />
    <SidebarMenuItems Icon={HashtagIcon} title="Explore" active={false}/>
    <SidebarMenuItems Icon={BellIcon}  title="Notifications" active={false} />
    <SidebarMenuItems Icon={EnvelopeIcon}  title="Messages" active={false}/>
    <SidebarMenuItems Icon={BookmarkIcon}  title="Bookmarks" active={false} />
    <SidebarMenuItems Icon={IdentificationIcon}  title="Lists" active={false} />
    <SidebarMenuItems Icon={UserIcon}  title="Profile"  active={false}/>
    <SidebarMenuItems Icon={EllipsisHorizontalCircleIcon}  title="More"  active={false}/>


<div className="py-10 ">



<img  className="lg:hidden lg:inline-flex cursor-pointer" width="100"  height="100" src="https://thumbs.dreamstime.com/b/add-tweet-post-button-icon-vector-twitter-social-media-element-219099895.jpg" />

<button className="hidden xl:inline mx-5 bg-twitter p-2 text-white font-bold w-56 h-12 rounded-full">Tweet</button>
 


</div>

    <div className="flex transiton-all p-2 absolute bottom-5 duration-200 hover:bg-gray-100 rounded-full cursor-pointer">
      <img className="w-12 h-12 rounded-full mx-5 items-center" onClick={() => signOut()}   alt="" src= {session?.user.image} />
      <div className="px-1 hidden xl:inline"><h1 className="font-semibold text-sm">{session?.user.name}</h1>
      <p className="text-sm ">@{session?.user.username}</p></div>
      <EllipsisHorizontalIcon className="h-7 w-7 hidden xl:inline"/>
   </div>


   </div>
   
    
  )
}
