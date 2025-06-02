import User from "../models/user.model.js";

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken",
        });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update user preferences
export const updateUserPreferences = async (req, res) => {
  try {
    const { theme, notifications } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate theme value
    if (theme && !["light", "dark", "system"].includes(theme)) {
      return res.status(400).json({
        success: false,
        message: "Invalid theme value. Must be 'light', 'dark', or 'system'",
      });
    }

    // Update preferences
    if (theme !== undefined) user.preferences.theme = theme;
    if (notifications !== undefined)
      user.preferences.notifications = notifications;

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get user preferences
export const getUserPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("preferences");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user.preferences || {
        theme: "light",
        notifications: true,
        emailNotifications: true,
      },
    });
  } catch (error) {
    console.error("Get user preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
