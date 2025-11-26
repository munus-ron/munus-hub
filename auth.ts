import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { findUserByEmail, createUser } from "./app/actions/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT}/v2.0`,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "microsoft-entra-id" && user.email) {
        return true;
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        const email = token.email as string;
        const name = token.name as string;

        console.log("[JWT] Performing Just-in-Time Provisioning for:", email);

        // 1. CHECK: Find user in DB
        let userRecord = await findUserByEmail(email);

        if (!userRecord) {
          // 2. PROVISION: User doesn't exist. Create the new user record (JIT).
          console.log("[JWT] User not found. Creating new user record.");
          userRecord = await createUser({
            email: email,
            name: name,
            role: "user",
          });
        } else {
          // 3. USE EXISTING: User exists. The userRecord contains their existing data (role, etc.)
          console.log("[JWT] User found. Using existing role:", userRecord.role);
        }

        // 4. MAP: Inject custom data from the database record into the token
        if (userRecord) {
          (token as any).dbUserId = userRecord.id;
          (token as any).role = userRecord.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      (session.user as any).dbUserId = token.dbUserId;
      (session.user as any).role = (token as any).role;
      return session;
    },
  },
});
