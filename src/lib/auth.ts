import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Mock users for local development
// In production, replace with real DB lookup
const MOCK_USERS = [
  {
    id: "user-1",
    email: "admin@startupos.com",
    password: "admin123",
    name: "Alex Kim",
    role: "owner",
    orgName: "StartupOS Demo",
  },
  {
    id: "user-2",
    email: "sales@startupos.com",
    password: "sales123",
    name: "Sam Lee",
    role: "sales_manager",
    orgName: "StartupOS Demo",
  },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const user = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          orgName: user.orgName,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.orgName = (user as { orgName: string }).orgName;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as { role: string }).role = token.role as string;
        (session.user as unknown as { orgName: string }).orgName = token.orgName as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
