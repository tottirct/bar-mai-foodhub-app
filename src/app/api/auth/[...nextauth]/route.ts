import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<any | null> {
                if (!credentials?.email || !credentials?.password) return null;
                const { email, password } = credentials as { email: string; password: string };
                try {
                    const user = await prisma.user.findUnique({
                        where: { email: email }
                    })

                    if (!user) return null;

                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if (!passwordMatch) return null;

                    return user as any;
                } catch (error) {
                    console.log(error);
                }
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/login'
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };