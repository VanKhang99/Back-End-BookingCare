const { promisify } = require("util");
const { User } = require("../models/index");
const db = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userService = require("../services/userService");
const Email = require("../utils/email");
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

    const dataEmail = {
      email,
      confirmCode,
    };

    await new Email("confirmAccount", language).sendConfirmAccount(dataEmail);

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
      include: [
        {
          model: db.Allcode,
          as: "roleData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.Allcode,
          as: "positionData",
          attributes: ["valueVi", "valueEn"],
        },
      ],
      nest: true,
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
      createSendToken({ ...user, imageUrl: data.imageUrl }, 201, req, res);
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
        createSendToken({ ...userUpdated, imageUrl: data.imageUrl }, 200, req, res);
      }

      checkUserEmail = filterColumnUser(checkUserEmail);
      createSendToken({ ...checkUserEmail, imageUrl: data.imageUrl }, 200, req, res);
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

    // 4) Check if user changed password after the token was issued
    // Check password is changed after JWT created
    /// TH someone get JWT => user have to change password
    //// => previous token is no longer valid this time => must to re-login
    ///// => to create new token
    const changePasswordAfter = (JWTTimestamp) => {
      if (currentUser.passwordChangedAt) {
        const changedTimestamp = parseInt(+currentUser.passwordChangedAt / 1000, 10);

        return JWTTimestamp < changedTimestamp;
      }

      // return false => password is not changed after JWT created
      return false;
    };

    if (changePasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "error",
        message: "You recently changed password! Please log in again",
      });
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email, language } = req.body;

    // 1) Get user based POSTed email;
    const user = await db.User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "There is no user with this email address",
      });
    }

    // 2) Generate the random confirmCode => update confirmCode
    const confirmCode = (Math.floor(Math.random() * 9000000) + 1000000).toString();
    await db.User.update(
      {
        confirmCode,
      },
      {
        where: { email },
      }
    );

    // 3) Send email
    const dataEmail = {
      email,
      confirmCode,
    };

    await new Email("forgotPassword", language).sendForgotPassword(dataEmail);

    res.status(200).json({
      status: "success",
      message: "Confirm code sent to email!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "API forgot password failed from server",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, confirmCode, password, language } = req.body;

    // Hashed password and Update passwordChangedAt column
    const passwordHashedFromBcrypt = await userService.hashUserPassword(password);
    await db.User.update(
      {
        password: passwordHashedFromBcrypt,
        passwordChangedAt: Date.now() - 1000,
      },
      {
        where: { email, confirmCode },
      }
    );

    let user = await db.User.findOne({
      where: { email, confirmCode },
    });

    user = await getOneImageFromS3("User", user);
    user = filterColumnUser(user);

    // Send email
    const dataEmail = {
      email,
    };

    await new Email("passwordChanged", language).sendPasswordChanged(dataEmail);

    // Send token for client
    createSendToken(user, 200, req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "API reset password failed from server",
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const data = req.body;

    // 1) Get user from table by email;
    const user = await db.User.findOne({
      where: { email: req.user.email },
    });

    // 2) Check if password current is correct
    if (!Object.keys(user).length || !(await bcrypt.compare(data.currentPassword, req.user.password))) {
      return res.status(401).json({
        status: "error",
        message:
          data.language === "vi"
            ? "Mật khẩu hiện tại của bạn không đúng. Vui lòng kiểm tra lại!"
            : "Your current password is wrong. Please check again",
      });
    }

    if (data.newPassword !== data.confirmNewPassword) {
      return res.status(401).json({
        status: "error",
        message:
          data.language === "vi"
            ? "Mật khẩu mới không giống nhau. Vui lòng kiểm tra lại!"
            : "The new password is not the same. Please check again!",
      });
    }

    // 3) Updated new password and field passwordChangedAt
    const hashNewPassword = await userService.hashUserPassword(data.newPassword);
    await db.User.update(
      {
        password: hashNewPassword,
        passwordChangedAt: Date.now() - 1000,
      },
      {
        where: { email: req.user.email },
      }
    );

    const userAfterUpdated = await db.User.findOne({
      where: { email: req.user.email },
    });

    // 4) Re-Log the user in, send JWT
    createSendToken(userAfterUpdated, 201, req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "API update my password failed from server",
    });
  }
};

// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.roleId)) {
//       return res.status(403).json({
//         status: "error",
//         message: "You do not have permission to perform this action",
//       });
//     }

//     next();

//   };
// };
