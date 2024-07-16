import { config, connectToDB } from "../../../../../utils/database";
const sql = require("mssql");

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { id } = params; // Destructure the id from params

    const pool = await sql.connect(config);
    const que = `
        SELECT UserPrompts.*, Users.image, Users.username, Users.email 
        FROM UserPrompts 
        JOIN Users ON UserPrompts.UserId = Users.id 
        WHERE Users.id = @id;`;

    const result = await pool.request().input("id", sql.Int, id).query(que);

    return new Response(JSON.stringify(result.recordset), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to fetch all Prompts of User", { status: 500 });
  }
};
