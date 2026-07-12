const Message = require("./../repositories/message");

exports.create = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiverId, text } = req.body;
    const uploadedFiles = req.files;
    const forwardedMedia = req.body.media;
    const forwardFromId = req.body.forward_from_id || null;
    const forwardFromType = req.body.forward_from_type || null;

    if (forwardFromId === null && forwardFromType != null) {
      return res.status(400).json({ error: "اطلاعات فوروارد ناقص است" });
    } else if (forwardFromId != null && forwardFromType === null) {
      return res.status(400).json({ error: "اطلاعات فوروارد ناقص است" });
    }

    if (
      !(
        forwardFromType === "user" ||
        forwardFromType === "channel" ||
        forwardFromType === "group" ||
        forwardFromType === null
      )
    ) {
      return res.status(400).json({ error: "نوع فوروارد معتبر نیست" });
    }

    let parentId = null;
    if (req.body.parent_id) {
      parentId = req.body.parent_id;
    }

    let mediaPath = null;
    if (uploadedFiles && uploadedFiles.length > 0) {
      const pathsArray = uploadedFiles.map((file) => {
        return `/uploads/posts/${file.filename}`;
      });
      mediaPath = JSON.stringify(pathsArray);
    } else {
      mediaPath = forwardedMedia || null;
    }

    const result = await Message.create({
      sender_id: senderId,
      receiver_id: receiverId,
      text,
      media: mediaPath,
      parent_id: parentId,
      forward_from_id: forwardFromId,
      forward_from_type: forwardFromType,
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
      if (message.media !== null && message.media !== "") {
        try {
          message.media = JSON.parse(message.media);
        } catch (e) {
          console.log("فرمت عکس خراب بود، نادیده گرفته شد.");
          message.media = [];
        }
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

exports.remove = async (req, res, next) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user.id;

    const result = await Message.deleteMessageById(messageId, userId);
    if (!result) {
      return res.status(400).json({ error: "همچین پیامی یافت نشد" });
    }
    return res.status(200).json({ message: "پیام با موفقیت حذف شد" });
  } catch (error) {
    next(error);
  }
};
exports.deletePv = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const receiverId = req.params.pv;

    const result = await Message.deletePv(receiverId, userId);
    if (!result) {
      return res.status(400).json({ error: "همچین پیامی یافت نشد" });
    }
    return res.status(200).json({ message: "پی وی حذف شد" });
  } catch (error) {
    next(error);
  }
};
