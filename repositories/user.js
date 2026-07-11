const db = require("./../db");

exports.create = async ({ username, password, profile }) => {
  const query = `INSERT INTO users(username, password, profile) VALUES (?, ?, ?)`;

  const [result] = await db.execute(query, [username, password, profile]);

  return {
    id: result.insertId,
    username,
  };
};

exports.findByUsername = async (username) => {
  const query =
    "select id, username, profile, password from users where username = ?";

  const [result] = await db.execute(query, [username]);

  return result[0];
};

exports.SearchByUsername = async (username) => {
  const query = "SELECT id, username, profile FROM `users` WHERE username = ?";

  const [result] = await db.execute(query, [username]);

  return result[0];
};
