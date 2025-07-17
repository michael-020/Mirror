import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcrypt"
import { AuthOptions } from "next-auth";
import { AUTHOPTIONS } from "@/prisma/app/generated/prisma";

export const authOptions: AuthOptions = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" }
      },
      async authorize(credentials) {
        if(!credentials?.email || !credentials?.password)
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

        return { id: user.id, email: user.email }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    session: ({session, token}) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id
        }
      }
    },
    jwt: ({token, user}) => {
      if(user){
        return {
          ...token,
          id: user.id
        }
      }
      return token
    }, 
async signIn({ account, profile }) {
      try {
        if (!profile?.email) {
          return false;
        }

        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: {
              email: profile.email
            }
          });

          if (!existingUser) {
            await prisma.user.upsert({
  where: {
    email: profile.email, // Unique field (must be marked as @unique in schema)
  },
  update: {
    provider: AUTHOPTIONS.GOOGLE, // What to update if user already exists
  },
  create: {
    email: profile.email,
    provider: AUTHOPTIONS.GOOGLE, // What to insert if user doesn't exist
  },
});

            return true;
          }

          // Check if the existing user was created with Google
          return existingUser.provider === AUTHOPTIONS.GOOGLE;
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/signin",
    error: '/auth/error'
  },
  secret: process.env.AUTH_SECRET
})

const handler = authOptions
export { handler as GET, handler as POST}