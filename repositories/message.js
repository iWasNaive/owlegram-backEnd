const db = require("./../db");

exports.create = async ({
  sender_id,
  receiver_id,
  text,
  media,
  parent_id,
  forward_from_id,
  forward_from_type,
}) => {
  try {
    const query = `INSERT INTO pv_messages (sender_id, receiver_id, text, media, parent_id, forward_from_id, forward_from_type) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.execute(query, [
      sender_id,
      receiver_id,
      text,
      media,
      parent_id,
      forward_from_id,
      forward_from_type,
    ]);

    return true;
  } catch (error) {
    return false;
  }
};

exports.findMessageByBothId = async (senderId, receiverId) => {
  const updateQuery = `
    UPDATE pv_messages 
    SET is_read = 1 
    WHERE sender_id = ? AND receiver_id = ? AND is_read = 0
  `;

  await db.execute(updateQuery, [receiverId, senderId]);

  const query = `
        SELECT 
            m.id AS message_id,
            m.text,
            m.media,
            m.parent_id,
            m.forward_from_type,
            m.created_at,
            m.forward_from_id,
            m.is_edited,
            m.is_read,
            
            sender.id AS sender_id,
            sender.username AS sender_username,
            sender.profile AS sender_profile,
            
            parent_m.text AS reply_to_text,
            parent_sender.username AS reply_to_username,
            parent_sender.id AS reply_user_id,
            
            forward_user.username AS forward_user_name,
            forward_channel.name AS forward_channel_name,

(
        SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('user_id', user_id, 'reaction_type', reaction_type)), ']')
        FROM pv_reactions 
        WHERE message_id = m.id
    ) AS reactions

            
        FROM pv_messages AS m
        
        JOIN users AS sender ON m.sender_id = sender.id
        
        LEFT JOIN pv_messages AS parent_m ON m.parent_id = parent_m.id
        LEFT JOIN users AS parent_sender ON parent_m.sender_id = parent_sender.id
        
        LEFT JOIN users AS forward_user 
            ON m.forward_from_id = forward_user.id 
            AND m.forward_from_type = 'user'
            
        LEFT JOIN channels AS forward_channel 
            ON m.forward_from_id = forward_channel.id 
            AND m.forward_from_type = 'channel'
            
        WHERE (m.sender_id = ? AND m.receiver_id = ?) 
           OR (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.created_at ASC
    `;

  const [result] = await db.execute(query, [
    senderId,
    receiverId,
    receiverId,
    senderId,
  ]);

  const formattedResult = result.map((msg) => {
    return {
      ...msg,
      // اگه ری‌اکشن داشت پارسش کن، وگرنه یه آرایه خالی بذار
      reactions: msg.reactions ? JSON.parse(msg.reactions) : [],
    };
  });

  return formattedResult;
};

exports.getContact = async (userId) => {
  const query = `SELECT 
    u.id AS contact_id,
    u.username AS contact_username,
    u.profile AS contact_profile,
    m.text AS last_message,
    m.created_at AS last_message_time,
    m.is_read
FROM (
    -- قدم اول: پیدا کردن آیدی طرف مقابل و زمانِ آخرین پیامی که بینشون رد و بدل شده
    SELECT 
        -- اگه فرستنده منم، پس طرف مقابل گیرنده است، وگرنه طرف مقابل فرستنده است
        IF(sender_id = ?, receiver_id, sender_id) AS contact_id,
        MAX(created_at) AS max_time
    FROM pv_messages
    WHERE sender_id = ? OR receiver_id = ?
    GROUP BY contact_id
) AS latest_chats

-- قدم دوم: وصل کردن این زمان به جدول پیام‌ها برای درآوردن متنِ آخرین پیام
JOIN pv_messages AS m 
  ON IF(m.sender_id = ?, m.receiver_id, m.sender_id) = latest_chats.contact_id 
  AND m.created_at = latest_chats.max_time

-- قدم سوم: جوین زدن با جدول کاربرها برای گرفتن اسم و عکس طرف مقابل
JOIN users AS u 
  ON u.id = latest_chats.contact_id

-- مرتب‌سازی از جدیدترین چت به قدیمی‌ترین (مثل تلگرام که پیام جدید میاد میپره بالا)
ORDER BY last_message_time DESC;`;

  const [result] = await db.execute(query, [userId, userId, userId, userId]);

  return result;
};

exports.deleteMessageById = async (message_id, user_id) => {
  const query = "DELETE FROM pv_messages WHERE id = ? AND sender_id = ?";

  const [result] = await db.execute(query, [message_id, user_id]);

  if (result.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
};

exports.deletePv = async (receiver_id, sender_id) => {
  const query =
    "DELETE FROM pv_messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)";

  const [result] = await db.execute(query, [
    receiver_id,
    sender_id,
    sender_id,
    receiver_id,
  ]);

  if (result.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
};

exports.updateMessage = async (text, message_id, user_id) => {
  try {
    const query =
      "UPDATE pv_messages SET text= ?, is_edited = true  WHERE id = ? AND sender_id = ?";

    const [result] = await db.execute(query, [text, message_id, user_id]);

    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
