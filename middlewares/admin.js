const UnauthorizedError = require("../errors/unauthorized");
const User = require("../api/users/users.model");

module.exports = async (req, res, next) => {
  try {
    const userId = req.user && req.user.userId;
    if (!userId) {
      throw new UnauthorizedError();
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      throw new UnauthorizedError("Admin role required");
    }

    next();
  } catch (err) {
    next(err);
  }
};
