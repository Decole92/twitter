
import { getProviders, signIn} from "next-auth/react";

export default function SignInPage({ providers }) {

  return (
  <div className="flex col-span-10">
    <div>
    <img className=" hidden lg:inline lg:h-[750px] w-[800px] md:col-span-4" src="https://cdn.cms-twdigitalassets.com/content/dam/legal-twitter/privacy-policy-2022/Twitter-terms-of-service-share.jpg.twimg.768.jpg" />
    </div>
    <div>
     <img className="h-20 px-10 mt-4" src="https://links.papareact.com/drq" />

     <h1 className="font-bold text-7xl py-[50px] px-10">Happening now</h1>
     <h2 className="font-bold text-3xl px-10">Join Twitter today.</h2>
     {
      Object.values(providers).map((provider) => (

<div key={providers.name} onClick={() => signIn(provider.id, {
  callbackUrl: "/"
})} className="ml-10 mt-8 flex border-2 rounded-full w-[270px] justify-between p-2 cursor-pointer transition-all duration-200 hover:bg-sky-100" >
  <h10></h10><h5 className="font-bold">Sign up with {provider.name}</h5>
<img className="h-5"src="https://static.cdnlogo.com/logos/g/35/google-icon.svg"/></div>
        ))}
     <div className="ml-10 mt-2 flex border-2 rounded-full w-[270px] items-center space-x-2 px-[50px] p-2"><img className="h-5" src="https://seeklogo.com/images/A/apple-logo-E3DBF3AE34-seeklogo.com.png"/><h5 className="">Sign up with Apple</h5></div>
     

     <div className="flex my-2 ml-10 items-center "><hr className="w-1/5 "></hr><p className="px-2">or</p><hr className="w-1/5"></hr></div>
     
     <h5 className="bg-twitter text-white w-[270px] text-center ml-10 rounded-full font-bold h-[40px] p-2" >Sign up with phone or email</h5>
      
      <p className="text-sm text-[10px] w-[300px] pt-2 ml-10">By signing up, you agree to the <span className="text-twitter">Terms of Service</span> and <span className="text-twitter">Privacy Policy</span>, including <span className="text-twitter">Cookie Use.</span></p>

    
    <div className="mt-[40px] mb-4"><h8 className="ml-10 text-lg font-semibold">Aready have an account?</h8></div>
    <h5 className="bg-white text-twitter w-[270px] text-center ml-10  mb-5 rounded-full border-2 border-gray-100 font-bold h-[40px] p-2" >Sign in</h5>
     

    </div>
  </div>

  )
}


export async function getServerSideProps(){
  
  const providers = await getProviders();
  return{
    props:{
      providers,
    }
  }
}