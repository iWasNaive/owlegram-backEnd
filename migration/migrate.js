const db = require("./../db");
const path = require("path");
const fs = require("fs");

const migrate = async () => {
  try {
    const connection = await db.getConnection();
    const migrationsDir = path.join(__dirname);

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"));

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");
      await connection.query(sql);
      console.log(`Migration ok: ${file}`);
    }

    connection.release();
  } catch (error) {
    console.error("Error executing migrations:", error);
  }
};

migrate();
