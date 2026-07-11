const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createPool({ uri: process.env.URI });

const testConnection = async () => {
  try {
    const [rows] = await connection.query("SELECT 1");
    console.log("Connected to the database successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error.code);
  }
};

testConnection();

module.exports = connection;
