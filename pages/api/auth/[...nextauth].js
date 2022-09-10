import NextAuth from "next-auth"

import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      // OAuth authentication providers
     
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      
     
    ],
    pages:{
        SignIn: "/auth/SignInPage"
    },
    callbacks:{
      async session({session, token}){
        session.user.username = session.user.name.split(" ").join("").toLowerCase();
        session.user.uid = token.sub;
        return session;
        
      }
    }
  })