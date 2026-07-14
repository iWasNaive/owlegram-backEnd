const jwt = require("jsonwebtoken");
const User = require("./../repositories/user");

module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies.carrot;

    if (!cookie) {
      return res.json({ msg: "لطفا دوباره وارد شوید" });
    }

    const token = jwt.verify(cookie, process.env.SECRETKEY);

    if (!token) {
      return res.json({ msg: "لطفا دوباره وارد شوید" });
    }

    const user = await User.findById(token.id);

    if (!user) {
      return res.json({ msg: "لطفا دوباره وارد شوید" });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
