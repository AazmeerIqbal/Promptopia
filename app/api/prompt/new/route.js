import { config, connectToDB } from "../../../../utils/database";
const sql = require("mssql");
export const POST = async (req) => {
  try {
    await connectToDB();
    const { userId, prompt, tag } = await req.json();

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .input("Prompt", sql.VarChar, prompt)
      .input("Tag", sql.VarChar, tag)
      .execute("PromptsInsert");

    return new Response("Prompt created successfully");
  } catch (err) {
    console.log(err);
    return new Response("Prompt failed", { status: 201 });
  }
};
