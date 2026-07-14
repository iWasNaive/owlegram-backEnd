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

exports.findById = async (id) => {
  const query = "select * from users where id = ?";

  const [result] = await db.execute(query, [id]);

  return result[0];
};

exports.updateUsername = async (userId, username) => {
  try {
    const query = "UPDATE users SET username = ? WHERE id = ?";

    const [result] = await db.execute(query, [username, userId]);

    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

exports.updateProfile = async (userId, profile) => {
  try {
    const query = "UPDATE users SET profile = ? WHERE id = ?";

    const [result] = await db.execute(query, [profile, userId]);

    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};


exports.removeProfile = async (userId) => {
  try {
    const query = "UPDATE users SET profile = NULL WHERE id = ?";

    const [result] = await db.execute(query, [userId]);

    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};