const db = require("./../db");

exports.create = async ({
  channel_id,
  sender_id,
  text,
  photo,
  parent_id,
  is_free,
}) => {
  const query = `INSERT INTO channel_messages (channel_id, sender_id, text, photo, parent_id, is_free)
    VALUES (?, ?, ?, ?, ?, ?)`;

  const [result] = await db.execute(query, [
    channel_id,
    sender_id,
    text,
    photo,
    parent_id,
    is_free,
  ]);

  return {
    id: result.insertId,
    channel_id,
    sender_id,
    text,
    photo,
    parent_id,
    is_free,
  };
};

exports.findById = async (id) => {
  const query = "SELECT id, channel_id FROM channel_messages WHERE id = ?";

  const [result] = await db.execute(query, [id]);

  return result[0];
};

exports.getChannelMessages = async (channel_id) => {
  const query = `
    SELECT 
        cm.*,
        u.username AS sender_username,
        u.profile AS sender_profile,
        parent_cm.text AS reply_to_text,
        parent_u.username AS reply_to_username
    FROM channel_messages AS cm
    LEFT JOIN users AS u ON cm.sender_id = u.id
    LEFT JOIN channel_messages AS parent_cm ON cm.parent_id = parent_cm.id
    LEFT JOIN users AS parent_u ON parent_cm.sender_id = parent_u.id
    WHERE cm.channel_id = ?
    ORDER BY cm.created_at ASC
  `;
  const [result] = await db.execute(query, [channel_id]);
  return result;
};
