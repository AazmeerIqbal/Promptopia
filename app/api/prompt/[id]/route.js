import { config, connectToDB } from "../../../../utils/database";
const sql = require("mssql");

// GET (read)
export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { id } = params;

    const pool = await sql.connect(config);
    const que = `SELECT UserPrompts.*, Users.image, Users.username, Users.email 
        FROM UserPrompts 
        JOIN Users ON UserPrompts.UserId = Users.id 
        WHERE UserPrompts.Id = @id;`;

    const result = await pool.request().input("id", sql.Int, id).query(que);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to fetch particular Prompt", { status: 500 });
  }
};

//PATCH (update)
export const PATCH = async (req, { params }) => {
  try {
    await connectToDB();

    const { prompt, tag } = await req.json();
    const { id } = params;

    const pool = await sql.connect(config);
    const que = `UPDATE UserPrompts SET Prompt = @Prompt,Tag = @Tag WHERE Id = @Id;`;

    const result = await pool
      .request()
      .input("Prompt", sql.VarChar, prompt)
      .input("Tag", sql.VarChar, tag)
      .input("id", sql.Int, id)
      .query(que);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to update particular Prompt", { status: 500 });
  }
};

//DELTE (delete)

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();

    const { id } = params;

    const pool = await sql.connect(config);
    const que = `DELETE FROM UserPrompts WHERE Id = @Id;`;

    const result = await pool.request().input("id", sql.Int, id).query(que);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to Delete", { status: 500 });
  }
};
