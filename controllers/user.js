const User = require("./../repositories/user");

exports.findUser = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.SearchByUsername(username);

    return res.json({ user });
  } catch (error) {
    next(error);
  }
};

exports.userProfile = async (req, res, next) => {
  try {
    const username = req.user.username;

    const user = await User.SearchByUsername(username);

    return res.json({ user });
  } catch (error) {
    next(error);
  }
};

exports.updateUsername = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;

    if (!req.body) {
      return res.status(400).json({ error: "یوزرنیم را وارد کنید" });
    }

    const exist = await User.SearchByUsername(username);

    if (exist) {
      return res
        .status(400)
        .json({ error: "نام کاربری توسط شخص دیگه ای دریافت شده" });
    }

    const updateUser = await User.updateUsername(userId, username);

    if (!updateUser) {
      return res.status(401).json({ message: "یوزرنیم اپدیت نشد" });
    } else {
      return res.status(200).json({ message: "یوزرنیم اپدیت شد" });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let profile = null;
    if (req.file) {
      profile = `/uploads/profiles/${req.file.filename}`;
    } else {
      return res.status(400).json({ error: "پروفایل را ارسال کنید" });
    }

    const updateUser = await User.updateProfile(userId, profile);

    if (!updateUser) {
      return res.status(401).json({ message: "پروفایل اپدیت نشد" });
    } else {
      return res.status(200).json({ message: "پروفایل اپدیت شد" });
    }
  } catch (error) {
    next(error);
  }
};

exports.removeProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const updateUser = await User.removeProfile(userId);

    if (!updateUser) {
      return res.status(401).json({ message: "پروفایل حذف نشد" });
    } else {
      return res.status(200).json({ message: "پروفایل حذف شد" });
    }
  } catch (error) {
    next(error);
  }
};
