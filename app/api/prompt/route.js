import { config, connectToDB } from "../../../utils/database";
const sql = require("mssql");

export const GET = async (req) => {
  try {
    await connectToDB();
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "SELECT UserPrompts.*,Users.image,Users.username, Users.email FROM UserPrompts JOIN Users ON UserPrompts.UserId = Users.id;"
      );

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to fetch all Prompts", { status: 500 });
  }
};
