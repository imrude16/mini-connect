import { registerSchema, loginSchema } from "./auth.validation.js";
import { registerUser, loginUser } from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const user = await registerUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const token = await loginUser(req.body);

    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
