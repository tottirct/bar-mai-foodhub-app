import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize (credentials,req): Promise<any | null> {
                if (!credentials?.username || !credentials?.password) return null;
                const { username, password } = credentials as { username: string; password: string };
                try{
                    const user = await prisma.user.findUnique({
                        where: {username: username}
                    })
                    
                    if(!user) return null;

                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if(!passwordMatch) return null;

                    return user as any;
                }catch (error){
                    console.log(error);
                }
            }
        })
    ],

    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session.user){ 
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },

    session :{
        strategy : 'jwt'
    },

    secret : process.env.NEXTAUTH_SECRET,
    pages : {
        signIn : '/auth/login'
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };