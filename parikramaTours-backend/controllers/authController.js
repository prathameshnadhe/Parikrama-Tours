const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppErrorHandling = require('../utils/appErrorHandling');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  // Remove password from the output
  user.password = undefined;

  res.status(statusCode);
  res.json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;
  const userEmail = await User.findOne({ email });
  if (userEmail) {
    return next(
      new AppErrorHandling(
        'Email already exists! Please sign up with new email.',
        401
      )
    );
  }

  if (password.length < 8 || passwordConfirm.length < 8) {
    return next(
      new AppErrorHandling('Password must be at least 8 characters long.', 400)
    );
  }

  if (password !== passwordConfirm) {
    return next(new AppErrorHandling('Passwords do not match.', 400));
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(
      new AppErrorHandling('Please provide email and password!', 400)
    );
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppErrorHandling('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppErrorHandling(
        'You are not logged in! Please login to get access.',
        401
      )
    );
  }

  // 2) Verification token
  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3) Check if user still exists
  const currentUser = await User.findById(decodedData.id);
  if (!currentUser) {
    return next(
      new AppErrorHandling(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changes password after the token was issued
  if (currentUser.changedPasswordAfter(decodedData.iat)) {
    return next(
      new AppErrorHandling(
        'User recently changed password! please login again.',
        401
      )
    );
  }

  // Grant Access to Protected Route
  req.user = currentUser;
  next();
});

// Only for render pages, no error!
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    // 1) Verify token
    const decodedData = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    // 2) Check if user still exists
    const currentUser = await User.findById(decodedData.id);
    if (!currentUser) {
      return next();
    }

    // 3) Check if user changes password after the token was issued
    if (currentUser.changedPasswordAfter(decodedData.iat)) {
      return next();
    }

    // THERE IS A LOGGED IN USER
    res.locals.user = currentUser;
    return next();
  }
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppErrorHandling(
          'You do not have permission to perform this action',
          403
        )
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppErrorHandling('There is no user with email address.', 404)
    );
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

  const textMessage = `
    Forgot your password? Click the link below to reset your password:\n
    ${resetURL}\n
    \n
    If you didn't forget your password, please ignore this email!\n
  `;

  const htmlMessage = `
    <p>Forgot your password? Click the link below to reset your password:</p>
    <p><a href="${resetURL}">Reset Your Password</a></p>
    <p>If you didn't forget your password, please ignore this email!</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Only valid for 10 min)',
      textMessage: textMessage, // Plain text version
      htmlMessage: htmlMessage, // HTML version
    });

    res.status(200);
    res.json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppErrorHandling(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (password.length < 8 || passwordConfirm.length < 8) {
    return next(
      new AppErrorHandling('Password must be at least 8 characters long.', 400)
    );
  }

  if (password !== passwordConfirm) {
    return next(new AppErrorHandling('Passwords do not match.', 400));
  }

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppErrorHandling('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user (in userModule.js)

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.body.id).select('+password');

  // const user = await User.findOne({ email: req.body.email });

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppErrorHandling('Your current password is wrong', 401));
  }

  // 3) Check if POSTed  password and passwordConfirm is same
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppErrorHandling('Password do nat match!', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
