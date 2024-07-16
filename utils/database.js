const sql = require("mssql");

const config = {
  user: "sa",
  password: "test",
  server: "MEHRAM",
  database: "promptopia",
  options: {
    trustServerCertificate: true,
    trustedConnection: false,
    enableArithAbort: true,
    encrypt: false,
  },
  port: 1433,
};

let isConnected = false;

const connectToDB = async () => {
  try {
    // Create a new connection pool
    await sql.connect(config);
    console.log("Connected to the database!");
    isConnected = true;
  } catch (error) {
    console.error("Database connection failed:", error);
    isConnected = false;
  } finally {
    // Close the connection pool if it was created
    if (isConnected) {
      sql.close();
    }
  }
};

// Invoke the connectToDB function
connectToDB();

module.exports = { config, connectToDB };
