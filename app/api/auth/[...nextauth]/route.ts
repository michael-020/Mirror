import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcrypt"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "johndoe@gmail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if(!credentials)
          return null

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email 
          }
        })

        if(!user || !user.password)
          return null

        const checkPassword = await bcrypt.compare(credentials.password, user.password);
        if(!checkPassword)
          return null

        return { id: user.id, name: user.name, email: user.email, username: user.username }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async jwt({token, user}) {
      if(user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.username = user.username
      }

      return token
    },
    async session({session, token}) {
      if(token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.username = token.username as string
      }

      return session
    },
    async signIn({user, account}) {
      if(account?.provider === "google"){
        const existingUser = await prisma.user.findUnique({
          where : {
            email: user.email
          }
        })

        if(!existingUser){
          return "/complete-registration"
        }
      }

      return true
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/signin",
    error: "/signin"
  },
  secret: process.env.AUTH_SECRET
})

export { handler as GET, handler as POST }