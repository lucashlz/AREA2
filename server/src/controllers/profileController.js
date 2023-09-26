const User = require("../models/userModels");
const {
  hasAuthService,
  updateUserEmail,
  updateUserPassword,
} = require("../utils/profileUtils");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -confirmationToken"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { email, username, oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const hasGoogleAuth = hasAuthService(user, "google");
    const hasFacebookAuth = hasAuthService(user, "facebook");

    if (username) user.username = username;

    if (email) {
      if (hasGoogleAuth || hasFacebookAuth) {
        return res.status(403).json({
          message:
            "You've previously logged in using an external service. You cannot change your email.",
        });
      }

      await updateUserEmail(user, email);
    }

    if (oldPassword && newPassword) {
      if (hasGoogleAuth || hasFacebookAuth) {
        return res.status(403).json({
          message:
            "You've previously logged in using an external service. You cannot change your password.",
        });
      }

      await updateUserPassword(user, oldPassword, newPassword);
    }

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
