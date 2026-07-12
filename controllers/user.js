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
