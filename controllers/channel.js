const crypto = require("crypto");
const Channel = require("./../repositories/channel");
const ChannelMessage = require("./../repositories/channelMessage");

exports.create = async (req, res, next) => {
  try {
    const creatorId = req.user.id;
    const { name, username, is_private, bio } = req.body;

    const normalizedUsername = username?.trim() || null;
    const normalizedBio = bio?.trim() || null;

    if (normalizedUsername) {
      const exist = await Channel.findByUsername(normalizedUsername);

      if (exist) {
        return res
          .status(400)
          .json({ error: "یوزرنیم کانال قبلاً ثبت شده است" });
      }
    }

    let photo = null;
    if (req.file) {
      photo = `/uploads/profiles/${req.file.filename}`;
    }

    const privateLink = is_private
      ? crypto.randomBytes(16).toString("hex")
      : null;

    const channel = await Channel.create({
      name: name.trim(),
      creator_id: creatorId,
      username: normalizedUsername,
      is_private: is_private ? 1 : 0,
      private_link: privateLink,
      photo,
      bio: normalizedBio,
    });

    await Channel.addAdmin({
      user_id: creatorId,
      channel_id: channel.id,
      admin_by: creatorId,
    });

    return res.status(201).json({
      message: "کانال با موفقیت ساخته شد",
      channel,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "یوزرنیم کانال قبلاً ثبت شده است" });
    }

    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { channel_id, text, parent_id, is_free } = req.body;

    const channel = await Channel.findById(channel_id);

    if (!channel) {
      return res.status(404).json({ error: "کانال یافت نشد" });
    }

    const isAdmin = await Channel.isAdmin(senderId, channel_id);

    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "فقط مدیران کانال می‌توانند پیام ارسال کنند" });
    }

    const normalizedText = text?.trim() || null;

    let photo = null;
    const uploadedFiles = req.files;

    if (uploadedFiles && uploadedFiles.length > 0) {
      const pathsArray = uploadedFiles.map(
        (file) => `/uploads/posts/${file.filename}`,
      );
      photo = JSON.stringify(pathsArray);
    }

    if (!normalizedText && !photo) {
      return res.status(400).json({ error: "متن یا عکس پیام را ارسال کنید" });
    }

    let parentId = null;
    if (parent_id) {
      const parentMessage = await ChannelMessage.findById(parent_id);

      if (!parentMessage || parentMessage.channel_id !== Number(channel_id)) {
        return res.status(400).json({ error: "پیام والد معتبر نیست" });
      }

      parentId = parent_id;
    }

    const message = await ChannelMessage.create({
      channel_id,
      sender_id: senderId,
      text: normalizedText,
      photo,
      parent_id: parentId,
      is_free: is_free ? 1 : 0,
    });

    if (message.photo) {
      try {
        message.photo = JSON.parse(message.photo);
      } catch (e) {
        message.photo = [];
      }
    }

    return res.status(201).json({
      message: "پیام با موفقیت ارسال شد",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminChannels = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await Channel.getAdminChannels(userId);

    result.forEach((channel) => {
      channel.is_admin = true;

      if (channel.last_message_photo) {
        try {
          channel.last_message_photo = JSON.parse(channel.last_message_photo);
        } catch (e) {
          channel.last_message_photo = [];
        }
      }
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getUserChannels = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const channels = await Channel.getUserChannels(userId);

    return res.json(channels);
  } catch (error) {
    next(error);
  }
};

exports.joinChannel = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { channel_id, private_link, username } = req.body;

    const channel = await Channel.findChannelByIdentifier({
      channelId: channel_id || null,
      privateLink: private_link || null,
      username: username || null,
    });

    if (!channel) {
      return res.status(404).json({ error: "کانال یافت نشد" });
    }

    if (channel.creator_id === userId) {
      return res.status(400).json({ error: "شما سازنده این کانال هستید" });
    }

    const isAdmin = await Channel.isAdmin(userId, channel.id);
    if (isAdmin) {
      return res.status(400).json({ error: "شما مدیر این کانال هستید" });
    }

    const isMember = await Channel.isMember(userId, channel.id);
    if (isMember) {
      return res.status(400).json({ error: "شما قبلاً عضو این کانال هستید" });
    }

    if (channel.is_private && channel.private_link !== private_link) {
      return res.status(403).json({ error: "لینک خصوصی کانال نامعتبر است" });
    }

    await Channel.joinChannel({
      user_id: userId,
      channel_id: channel.id,
    });

    return res
      .status(201)
      .json({ message: "عضویت در کانال با موفقیت انجام شد" });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    const messages = await ChannelMessage.getChannelMessages(channelId);

    messages.forEach((msg) => {
      if (msg.photo && msg.photo !== "null") {
        try {
          msg.photo = JSON.parse(msg.photo);
        } catch (e) {
          msg.photo = [];
        }
      }
    });

    return res.json(messages);
  } catch (error) {
    next(error);
  }
};

exports.searchChannel = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { identifier } = req.params;
    const Channel = require("./../repositories/channel");

    const channel = await Channel.searchChannel(identifier, userId);

    if (!channel) {
      return res.status(404).json({ error: "کانالی با این مشخصات یافت نشد" });
    }

    return res.json({ channel });
  } catch (error) {
    next(error);
  }
};

exports.getChannelInfo = async (req, res, next) => {
  try {
    const channelId = req.params.id; // آیدی کانال از URL میاد

    const result = await Channel.getChannelInfo(channelId);

    if (!result) {
      return res.status(404).json({ error: "کانال یافت نشد" });
    }

    // فرستادن اطلاعات کانال به فرانت
    return res.json(result);
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کانال:", error);
    next(error);
  }
};
