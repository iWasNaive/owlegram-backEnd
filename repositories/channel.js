const db = require("./../db");

exports.findByUsername = async (username) => {
  const query = "SELECT id FROM channels WHERE username = ?";

  const [result] = await db.execute(query, [username]);

  return result[0];
};

exports.findById = async (id) => {
  const query = "SELECT id, name, creator_id FROM channels WHERE id = ?";

  const [result] = await db.execute(query, [id]);

  return result[0];
};

exports.isAdmin = async (user_id, channel_id) => {
  const query = "SELECT id FROM admins WHERE user_id = ? AND channel_id = ?";

  const [result] = await db.execute(query, [user_id, channel_id]);

  return !!result[0];
};

exports.getAdminChannels = async (userId) => {
  const query = `SELECT
    c.id AS channel_id,
    c.name AS channel_name,
    c.username AS channel_username,
    c.private_link,
    c.photo AS channel_photo,
    c.bio AS channel_bio,
    c.is_private,
    cm.text AS last_message,
    cm.photo AS last_message_photo,
    cm.created_at AS last_message_time
  FROM admins AS a
  JOIN channels AS c ON c.id = a.channel_id
  LEFT JOIN (
    SELECT channel_id, MAX(created_at) AS max_time
    FROM channel_messages
    GROUP BY channel_id
  ) AS latest ON latest.channel_id = c.id
  LEFT JOIN channel_messages AS cm
    ON cm.channel_id = latest.channel_id
    AND cm.created_at = latest.max_time
  WHERE a.user_id = ?
  ORDER BY last_message_time DESC`;

  const [result] = await db.execute(query, [userId]);

  return result;
};

exports.create = async ({
  name,
  creator_id,
  username,
  is_private,
  private_link,
  photo,
  bio,
}) => {
  const query = `INSERT INTO channels (name, creator_id, username, is_private, private_link, photo, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const [result] = await db.execute(query, [
    name,
    creator_id,
    username,
    is_private,
    private_link,
    photo,
    bio,
  ]);

  return {
    id: result.insertId,
    name,
    creator_id,
    username,
    is_private,
    private_link,
    photo,
    bio,
  };
};

exports.getUserChannels = async (userId) => {
  const query = `SELECT DISTINCT
    c.id AS channel_id,
    c.name AS channel_name,
    c.username AS channel_username,
    c.private_link,
    c.photo AS channel_photo,
    c.bio AS channel_bio,
    c.is_private,
    CASE
      WHEN c.creator_id = ? THEN 'owner'
      WHEN a.user_id IS NOT NULL THEN 'admin'
      WHEN j.user_id IS NOT NULL THEN 'member'
      ELSE NULL
    END AS role
  FROM channels AS c
  LEFT JOIN admins AS a ON a.channel_id = c.id AND a.user_id = ?
  LEFT JOIN joins AS j ON j.channel_id = c.id AND j.user_id = ?
  WHERE c.creator_id = ? OR a.user_id IS NOT NULL OR j.user_id IS NOT NULL
  ORDER BY c.created_at DESC`;

  const [result] = await db.execute(query, [userId, userId, userId, userId]);

  return result;
};

exports.addAdmin = async ({ user_id, channel_id, admin_by }) => {
  const query =
    "INSERT INTO admins (user_id, channel_id, admin_by) VALUES (?, ?, ?)";

  await db.execute(query, [user_id, channel_id, admin_by]);
};

exports.findChannelByIdentifier = async ({
  channelId,
  privateLink,
  username,
}) => {
  let query =
    "SELECT id, name, is_private, private_link, creator_id FROM channels WHERE ";
  const params = [];

  if (channelId) {
    query += "id = ?";
    params.push(channelId);
  } else if (privateLink) {
    query += "private_link = ?";
    params.push(privateLink);
  } else if (username) {
    query += "username = ?";
    params.push(username);
  } else {
    return null;
  }

  const [result] = await db.execute(query, params);
  return result[0] || null;
};

exports.isMember = async (user_id, channel_id) => {
  const query = "SELECT id FROM joins WHERE user_id = ? AND channel_id = ?";

  const [result] = await db.execute(query, [user_id, channel_id]);

  return !!result[0];
};

exports.joinChannel = async ({ user_id, channel_id }) => {
  const query = "INSERT INTO joins (user_id, channel_id) VALUES (?, ?)";

  await db.execute(query, [user_id, channel_id]);
};

exports.searchChannel = async (identifier, userId) => {
  const query = `
    SELECT 
      c.id AS channel_id, 
      c.name AS channel_name, 
      c.username AS channel_username, 
      c.photo AS channel_photo, 
      c.bio AS channel_bio, 
      c.is_private, 
      c.private_link,
      CASE
        WHEN c.creator_id = ? THEN 'owner'
        WHEN a.user_id IS NOT NULL THEN 'admin'
        WHEN j.user_id IS NOT NULL THEN 'member'
        ELSE NULL
      END AS role
    FROM channels AS c
    LEFT JOIN admins AS a ON a.channel_id = c.id AND a.user_id = ?
    LEFT JOIN joins AS j ON j.channel_id = c.id AND j.user_id = ?
    WHERE c.username = ? OR c.private_link = ?
  `;
  const [result] = await db.execute(query, [
    userId,
    userId,
    userId,
    identifier,
    identifier,
  ]);

  return result[0] || null;
};

exports.getChannelInfo = async (channelId) => {
  // کوئری برای گرفتن اطلاعات کامل کانال
  const query = `
      SELECT 
        id AS channel_id,
        name AS channel_name,
        username AS channel_username,
        private_link,
        photo AS channel_photo,
        bio AS channel_bio,
        is_private
      FROM channels 
      WHERE id = ?
    `;

  const [result] = await db.execute(query, [channelId]);

  return result[0];
};
