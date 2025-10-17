import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const user = await User.findOne({ userName });
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hashing password before saving to database for security

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // https://avatars.placeholder.iran.liara.run/

    const BoyProfilePic = `https://avatars.placeholder.iran.liara.run/public/boy?username=${userName}`;
    const GirlProfilePic = `https://avatars.placeholder.iran.liara.run/public/girld?username=${userName}`;

    const newUser = new User({
      fullName,
      userName,
      password: hashedPassword,
      gender,
      profilePicture: gender === "male" ? BoyProfilePic : GirlProfilePic,
    });

    if(newUser){
        // Generate a JWT token here

        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      userName: newUser.userName,
      gender: newUser.gender,
      profilePicture: newUser.profilePicture,
      message: "User created successfully",
    }); 
    }else{
      res.status(400).json({message:"Invalid user data"});
    }
  } catch (error) {
    console.error("error in signup:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        const user = await User.findOne({ userName });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if ( !user || !isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            gender: user.gender,
            profilePicture: user.profilePicture,
            message: "Login successful",
        });
    } catch (error) {
        console.error("error in login:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const logout = (req, res) => {
  try {
      res.cookie("jwt", "", {maxAge: 0}); 
      res.status(200).json({ message: "Logout successful" });
  } catch (error) {
      console.error("error in logout:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};
