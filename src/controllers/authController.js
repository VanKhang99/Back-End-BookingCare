const { promisify } = require("util");
const { User } = require("../models/index");
const db = require("../models/index");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const sendEmail = require("../utils/email");
const { getOneImageFromS3 } = require("./awsS3controller");
const { filterColumnUser } = require("../utils/helpers");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.id);

  // SET COOKIE
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user ? user : {},
    },
  });
};

exports.sendCode = async (req, res) => {
  const { email, language } = req.body;
  const confirmCode = (Math.floor(Math.random() * 9000000) + 1000000).toString();
  try {
    const user = await User.findOne({ where: { email } });

    if (user && user.isConfirmed && !user.googleId && !user.facebookId) {
      return res.status(400).json({
        status: "error",
        message: "Email is already used to register an account, please use another email!",
      });
    } else if (user && !user.isConfirmed && !user.googleId && !user.facebookId) {
      await User.update(
        {
          confirmCode,
          isConfirmed: false,
        },
        {
          where: { email },
        }
      );
    } else {
      await User.create({
        email,
        confirmCode,
        isConfirmed: false,
      });
    }

    await sendEmail(
      {
        email,
        language,
        confirmCode,
      },
      "confirmAccount"
    );

    return res.status(200).json({
      status: "success",
      code: confirmCode,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Generate confirm code failed from the server",
    });
  }
};

exports.verifyCode = async (req, res) => {
  const { email, confirmCode } = req.body;
  try {
    const user = await User.findOne({ where: { email, confirmCode } });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Invalid email and confirm code",
      });
    }

    await User.update(
      {
        isConfirmed: true,
      },
      {
        where: { email },
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Code is verified",
    });
  } catch (error) {}
};

exports.signUp = async (req, res) => {
  try {
    const dataFromClient = req.body;
    const { email, password, isNewUser } = dataFromClient;
    const passwordHashedFromBcrypt = await userService.hashUserPassword(password);

    await User.update(
      {
        ...req.body,
        password: passwordHashedFromBcrypt,
        roleId: isNewUser ? "R7" : null,
      },
      {
        where: { email },
      }
    );

    const newUser = await User.findOne({
      where: { email },
      raw: true,
    });

    createSendToken(newUser, 201, req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Sign-up user failed from the server",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email and password!",
      });
    }

    // 1) Find user by email input
    const user = await User.findOne({
      // attributes: ["email", "roleId", "password", "firstName", "lastName"],
      where: { email },
      raw: true,
    });

    const userData = await getOneImageFromS3("User", user);

    // 2) If have email and password, check user and password valid in DB
    if (!user || !(await userService.checkPassword(password, user.password))) {
      return res.status(400).json({
        status: "error",
        message: `Invalid email or password`,
      });
    }

    // 3) If everything ok , response token for client
    createSendToken(userData, 200, req, res);
  } catch (error) {
    console.log(error);
  }
};

exports.logout = async (req, res) => {
  try {
    const cookieOptions = {
      expires: new Date(Date.now() + 10 * 1000),
      // httpOnly: true,
    };

    res.cookie("jwt", "loggedOut", cookieOptions);
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.socialLogin = async (req, res) => {
  try {
    const data = req.body;
    const { loginBy } = data;

    let checkUserEmail = await db.User.findOne({
      where: { email: data.email },
    });

    if (!checkUserEmail || !Object.keys(checkUserEmail).length) {
      let user = await db.User.create({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        roleId: "R7",
        [`${loginBy}Flag`]: true,
      });

      user = filterColumnUser(user);

      return res.status(200).json({
        status: "success",
        data: {
          user: { ...user, imageUrl: data.imageUrl },
        },
      });
    }

    if (checkUserEmail && loginBy) {
      if (!checkUserEmail[`${loginBy}Flag`]) {
        await db.User.update(
          {
            [`${loginBy}Flag`]: true,
          },
          {
            where: { email: data.email },
          }
        );

        let userUpdated = await db.User.findOne({
          where: { email: data.email },
        });

        userUpdated = filterColumnUser(userUpdated);

        return res.status(200).json({
          status: "success",
          data: {
            user: { ...userUpdated, imageUrl: data.imageUrl },
          },
        });
      }

      checkUserEmail = filterColumnUser(checkUserEmail);
      return res.status(200).json({
        status: "success",
        data: {
          user: { ...checkUserEmail, imageUrl: data.imageUrl },
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Log-in by Google, Facebook failed from server",
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1) Getting token and check of it's there
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "You are not logged in! Please log in to get access",
      });
    }

    // 2) Validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check user is still exists based on token
    const currentUser = await User.findOne({ where: { id: decoded.id } });

    const changePasswordAfter = (JWTTimestamp) => {
      if (currentUser.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
      }

      // FALSE mean password has not been changed before the token is issued
      return false;
    };

    if (changePasswordAfter(decoded.iat)) {
      return next(new AppError("User recently changed password! Please log in again", 401));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.isLoggedIn = async function (req, res, next) {
  if (req.cookies.jwt) {
    try {
      // 1) Verify token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

      // 2) Check user is still exists based on token
      const currentUser = await User.findOne({ where: { id: decoded.id } });

      if (!currentUser) {
        return next();
      }

      return next();
    } catch (error) {
      return next();
    }
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roleId)) {
      return res.status(403).json({
        status: "error",
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};
