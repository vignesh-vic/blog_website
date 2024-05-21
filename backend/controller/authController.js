const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error");
const jwt = require("jsonwebtoken");
const signup = async (req, res, next) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    next(errorHandler(400, "All fields are required"));
  }

  const salt = bcryptjs.genSaltSync(10); // Generate salt
  const hashedPassword = bcryptjs.hashSync(password, salt);

  const newUser = new User({ userName, email, password: hashedPassword });

  try {
    await newUser.save();
    res.json("SignUp successful");
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(400, "All Fileds Are Required ");
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User Not Found"));
    }
    const vaildPassword = bcryptjs.compareSync(password, validUser.password);
    if (!vaildPassword) {
      return next(errorHandler(400, "Invaild password"));
    }
    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, `${process.env.JWT_SECRET}` || "blogwebite");
    const { password: pass, ...rest } = validUser._doc;

    return res.status(200).json({ ...rest, token });

  } catch (error) {
    next(error);
  }
};

const google = async (req, res, next) => {
  const { name, email, gPhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, `${process.env.JWT_SECRET}` || "blogwebsite");

      const { password, ...rest } = user._doc;

      return res.status(200).json({ ...rest, token });


    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        userName:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profile: gPhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, `${process.env.JWT_SECRET}` || "blogwebite");
      const { password, ...rest } = newUser._doc;
      return res.status(200).json({ ...rest, token });

    }

  } catch (error) {
    console.log(error);
  }
};

module.exports = { signup, signin, google };
