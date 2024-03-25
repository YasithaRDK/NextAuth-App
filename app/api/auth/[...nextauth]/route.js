import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connection from "@/utils/db";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connection();
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("No user found with this email.");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password.");
          }
          return user;
        } catch (err) {
          throw new Error(`Authentication failed: ${err.message}`);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, error }) {
      if (error) {
        // Handle error during sign-in
        console.error("Sign-in error:", error);
        return false; // Prevent sign-in
      }
      if (account?.provider === "credentials") {
        return true;
      }
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
