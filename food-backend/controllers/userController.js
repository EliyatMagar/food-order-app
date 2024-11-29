import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//login user
const loginUser = async (req, res) => { // Ensure req and res are included here
    const { email, password } = req.body;
  
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ success: false, message: "User does not exist" });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password); // Fix: Changed use.password to user.password
  
      if (!isMatch) {
        return res.json({ success: false, message: "Invalid credentials" });
      }
  
      // Generate token
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Token expiration time
      );
  
      // Send token and user info in the response
      return res.json({
        success: true,
        message: "User logged in successfully",
        token,
        user: { id: user._id, email: user.email } // Fix: Changed user_id to user._id
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Error while logging in" });
    }
  };
//register user

const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // Check if the user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email format and password strength
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the user in the database
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload: user id and email
      process.env.JWT_SECRET, // Secret key from env
      { expiresIn: "1h" } // Token expiration time
    );

    // Send token and user info in the response
    return res.json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser };
