const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./../repositories/user");

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const exist = await User.findByUsername(username);

    if (exist) {
      return res.json({ error: "کاربر از قبل وجود دارد" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    let profile = null;

    if (req.file) {
      profile = `/uploads/profiles/${req.file.filename}`;
    }

    const user = await User.create({
      username,
      password: hashedPass,
      profile,
    });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.SECRETKEY,
    );

    res.cookie("carrot", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(201).json("کاربر با موفقیت ساخته شد");
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "کاربری وجود ندارد ثبت نام کنید" });
    }

    const correctPass = await bcrypt.compare(password, user.password);

    if (!correctPass) {
      return res
        .status(401)
        .json({ error: "نام کاربری یا رمز عبور اشتباه است" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.SECRETKEY,
    );

    res.cookie("carrot", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({ message: "ورود موفقیت آمیز بود" });
  } catch (error) {
    next(error);
  }
};
