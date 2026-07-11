const User = require("./../repositories/user");

exports.findUser = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.SearchByUsername(username);

    console.log(user);
  } catch (error) {}
};
