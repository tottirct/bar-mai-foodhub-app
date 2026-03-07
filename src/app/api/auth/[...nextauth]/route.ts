import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { mongo } from "@/lib/mongo";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<any | null> {
                if (!credentials?.username || !credentials?.password) return null;
                const { username, password } = credentials as { username: string; password: string };
                try {
                    const user = await prisma.user.findUnique({
                        where: { username: username }
                    })

                    if (!user) return null;

                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if (!passwordMatch) return null;

                    try {
                        await mongo.activityLog.create({
                            data: {
                                userId: user.id,
                                userRole: user.role,
                                action: "USER_LOGIN",
                                description: `เข้าสู่ระบบ ${user.name}`,
                                metadata: { userId: user.id, userRole: user.role }
                            }
                        });

                    } catch (mongoError) {
                        console.error("บันทึกลง mongo พลาด", mongoError);
                    }

                    return user as any;
                } catch (error) {
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
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },

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