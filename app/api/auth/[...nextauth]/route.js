import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { config } from "@utils/database"; // Ensure this is correctly exported
const sql = require("mssql");

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      try {
        const email = profile.email;
        const pool = await sql.connect(config);

        // Check if the user exists and get the user ID
        const result = await pool
          .request()
          .input("Email", sql.VarChar, email)
          .output("UserId", sql.Int)
          .execute("GetUserIdByEmail");

        const userId = result.output.UserId;

        // If user does not exist, create a new user
        if (userId === -1) {
          const insertResult = await pool
            .request()
            .input("Email", sql.VarChar, email)
            .input("Username", sql.VarChar, profile.name || "")
            .input("Image", sql.VarChar, profile.picture || "").query(`
              INSERT INTO Users (email, username, image)
              VALUES (@Email, @Username, @Image);
            `);

          // Get the newly created user's ID
          const newUserResult = await pool
            .request()
            .input("Email", sql.VarChar, email)
            .output("UserId", sql.Int)
            .execute("GetUserIdByEmail");

          const newUserId = newUserResult.output.UserId;
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async session({ session }) {
      try {
        const email = session.user.email;
        const pool = await sql.connect(config);

        // Get user ID by email
        const result = await pool
          .request()
          .input("Email", sql.VarChar, email)
          .output("UserId", sql.Int)
          .execute("GetUserIdByEmail");

        const userId = result.output.UserId;

        if (userId !== -1) {
          session.user.id = userId.toString(); // Attach user ID to session
        }

        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
  },
});

export { handler as GET, handler as POST };
