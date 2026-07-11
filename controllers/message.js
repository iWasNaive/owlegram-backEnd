const Message = require("./../repositories/message");

exports.create = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiverId, text } = req.body;
    const media = req.files;

    let parentId = null;
    if (req.body.parent_id) {
      parentId = req.body.parent_id;
    }

    let mediaPath = null;
    if (req.files) {
      mediaPath = media.map((media) => {
        return `/uploads/posts/${media.filename}`;
      });
      if (mediaPath.length === 0) {
        mediaPath = null;
      } else {
        mediaPath = JSON.stringify(mediaPath);
      }
    }

    const result = await Message.create({
      sender_id: senderId,
      receiver_id: receiverId,
      text,
      media: mediaPath,
      parent_id: parentId,
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.pv;

    const result = await Message.findMessageByBothId(senderId, receiverId);

    result.forEach((message) => {
      if (message.media) {
        message.media = JSON.parse(message.media);
      }
    });

    res.send(result);
  } catch (error) {
    next(error);
  }
};

exports.getContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await Message.getContact(userId);

    res.send(result);
  } catch (error) {
    next(error);
  }
};
