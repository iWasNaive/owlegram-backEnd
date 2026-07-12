const Reaction = require("./../repositories/reaction");

exports.create = async (req, res, next) => {
  try {
    const { messageId, userId, reactionType } = req.body;
    const result = await Reaction.create(messageId, userId, reactionType);
    return res.status(201).json({ message: "ری اکشن ساخته شد" });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { messageId, userId, reactionType } = req.body;
    const result = await Reaction.update(messageId, userId, reactionType);
    return res.status(200).json({ message: "ری اکشن آپدیت شد" });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { messageId, userId } = req.body;
    const result = await Reaction.delete(messageId, userId);
    return res.status(200).json({ message: "ری اکشن حذف شد" });
  } catch (error) {
    next(error);
  }
};
