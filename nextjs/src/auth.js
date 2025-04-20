import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import PostgresAdapter from "@auth/pg-adapter";
import pool from "@/lib/db";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  adapter: PostgresAdapter(pool),
  secret: "b2e52a4311c531e447f5d5817278198eeeb83e257adbd0161c2fa0d494270b8a",
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "uzivatel@email.com"
        },
        password: { label: "Heslo", type: "password" }
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const client = await pool.connect();
        const queryResult = await client.query(
          "SELECT login($1, $2) AS result",
          [JSON.stringify(email), password]
        );
        const result = queryResult.rows[0]?.result;

        const addInfoResult = await client.query(
          "SELECT id, username FROM users WHERE email = $1",
          [JSON.stringify(email)]
        );

        const infoResult = addInfoResult.rows[0];

        client.release();

        if (!result || !result.success) {
          return false;
        }

        return {
          databaseId: infoResult.id,
          email,
          message: result.message,
          role: result.role,
          username: infoResult.username
        };
      }
    })
  ],
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/login",
    newUser: "/register",
    profile: "/profile"
  },
  callbacks: {
    async signIn({ user, _account, _profile, _email, _credentials }) {
      if (user?.error) {
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.email = user.email;
        token.databaseId = user.databaseId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.databaseId = token.databaseId;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/profile");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    }
  }
});
