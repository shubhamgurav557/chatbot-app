
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";  
import { Session } from "next-auth"; 

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { id: string } }) {
      if (user) {
        token.id = user.id; 
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.id) {
        session.user = {
          ...session.user,
          id: token.id, 
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
