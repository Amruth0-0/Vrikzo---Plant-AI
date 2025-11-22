import EmailUser from "../models/EmailUser.js";

export const registerEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // store it if not exists
    let user = await EmailUser.findOne({ email });
    if (!user) {
      user = await EmailUser.create({ email });
    }

    return res.json({ success: true, message: "Email registered successfully" });

  } catch (err) {
    console.error("Email register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
