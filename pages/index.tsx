import type { NextPage } from 'next'
import Head from 'next/head'
import Sidebar from './component/Sidebar'
import Feed from './component/Feed'
import Widgets from './component/Widgets'
import { useSession } from "next-auth/react"
import { json } from 'stream/consumers'
//import Router from "next/router";
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import CommentModal from './component/CommentModal';

const Home: NextPage = ({newsResults, userRandom}) => {
const {data: session } = useSession();

console.log(session);

const router = useRouter()

useEffect(() => {

//const { pathname } = Router;

  //pathname === "/"

 if (session) {
     console.log("session = true")
    router.push('/');
    //  Router.push('/')
    }else{
      // maybe go to login page
      router.push('/auth/SignInPage')
  }
 


}, [session])

  return (
    <div className="xl max-h-screen mx-auto">
      <Head>
        <title>Twitter Clone</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <main className="flex min-h-screen mx-auto">

      
  <Sidebar />


<Feed />

<Widgets newsResults={newsResults.articles}  userRandom={userRandom.results}/>

<CommentModal />
   
      </main>

    
    </div>
  )
}

export default Home;
//https://randomuser.me/api/?result=20&&inc=name,login,picture

//https://saurav.tech/NewsAPI/top-headlines/category/business/US.json
export async function getServerSideProps(){

  const newsResults = await fetch("https://saurav.tech/NewsAPI/top-headlines/category/business/us.json")
  .then((res) => res.json());

  

  let userRandom = [];

  try {
    const res = await fetch(
      "https://randomuser.me/api/?results=30&inc=name,login,picture"
    );

    userRandom = await res.json();
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