const db = require("./../db");

exports.create = async ({ sender_id, receiver_id, text, media, parent_id }) => {
  try {
    const query = `INSERT INTO pv_messages (sender_id, receiver_id, text, media, parent_id) VALUES (?, ?, ?, ?, ?)`;

    const [result] = await db.execute(query, [
      sender_id,
      receiver_id,
      text,
      media,
      parent_id,
    ]);

    return true;
  } catch (error) {
    return false;
  }
};

exports.findMessageByBothId = async (senderId, receiverId) => {
  const query = `SELECT 
    m.id AS message_id,
    m.text,
    m.media,
    m.parent_id,
    m.created_at,
    
    sender.id AS sender_id,
    sender.username AS sender_username,
    sender.profile AS sender_profile,
    
    parent_m.text AS reply_to_text, 
    parent_sender.username AS reply_to_username

FROM pv_messages AS m
JOIN users AS sender ON m.sender_id = sender.id 
LEFT JOIN pv_messages AS parent_m ON m.parent_id = parent_m.id
LEFT JOIN users AS parent_sender ON parent_m.sender_id = parent_sender.id

WHERE (m.sender_id = ? AND m.receiver_id = ?) 
   OR (m.sender_id = ? AND m.receiver_id = ?)
ORDER BY m.created_at ASC;`;

  const [result] = await db.execute(query, [
    senderId,
    receiverId,
    receiverId,
    senderId,
  ]);

  return result;
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
