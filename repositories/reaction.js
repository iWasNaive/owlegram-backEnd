const db = require("./../db");

exports.create = async (message_id, user_id, reaction_type) => {
  try {
    const query = `INSERT INTO pv_reactions(message_id, user_id, reaction_type) VALUES (?, ?, ?)`;

    const a = await db.execute(query, [message_id, user_id, reaction_type]);

    return true;
  } catch (error) {
    return false;
  }
};

exports.update = async (message_id, user_id, reaction_type) => {
  try {
    const query = `UPDATE pv_reactions SET reaction_type = ? WHERE message_id = ? AND user_id = ?`;

    const a = await db.execute(query, [reaction_type, message_id, user_id]);

    return true;
  } catch (error) {
    return false;
  }
};

exports.delete = async (message_id, user_id) => {
  try {
    const query = `DELETE FROM pv_reactions WHERE message_id = ? AND user_id = ?`;

    const a = await db.execute(query, [message_id, user_id]);

    return true;
  } catch (error) {
    return false;
  }
};
