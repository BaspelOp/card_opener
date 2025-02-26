import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Přihlášení",
            credentials: {
                username: { label: "Uživatelské jméno", type: "text" },
                password: { label: "Heslo", type: "password" },
            },
            async authorize(credentials) {

                // Tady napojit na databázi a ověřit uživatele

                if (credentials.username === "admin" && credentials.password === "1234") {
                    return { id: "1", name: "Admin", role: "admin" };
                } else if (credentials.username === "user" && credentials.password === "user") {
                    return { id: "2", name: "Uživatel", role: "user" };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async session(session, user) {
            session.user.role = user.role;
            return session;
        },
        async jwt(token, user) {
            if (user) token.role = user.role;
            return token;
        }
    },
    pages: {
        signIn: "/login"
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };