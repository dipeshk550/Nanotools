const crypto = require("crypto");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const { sendOTP, sendWelcome, sendPasswordReset } = require("../utils/email");
const { success, error } = require("../utils/response");

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return error(res, "Email already registered");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({
      name, email, password,
      otp: { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    });

    await sendOTP(email, otp);
    success(res, { userId: user._id }, "OTP sent to your email", 201);
  } catch (err) { next(err); }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) return error(res, "User not found");
    if (!user.otp?.code || user.otp.code !== otp) return error(res, "Invalid OTP");
    if (new Date() > user.otp.expiresAt) return error(res, "OTP expired");

    user.isVerified = true;
    user.otp = undefined;
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    await sendWelcome(user.email, user.name);

    setRefreshCookie(res, refreshToken);
    success(res, { token: generateAccessToken(user._id), user: { id: user._id, name: user.name, email: user.email, plan: user.plan } }, "Email verified");
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) return error(res, "Invalid credentials", 401);
    if (!user.isVerified) return error(res, "Please verify your email first", 403);

    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    setRefreshCookie(res, refreshToken);

    success(res, {
      token: generateAccessToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan, role: user.role, avatar: user.avatar },
    }, "Login successful");
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return error(res, "No refresh token", 401);
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token) return error(res, "Invalid refresh token", 401);
    success(res, { token: generateAccessToken(user._id) }, "Token refreshed");
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    if (req.user) { req.user.refreshToken = undefined; await req.user.save(); }
    res.clearCookie("refreshToken");
    success(res, {}, "Logged out");
  } catch (err) { next(err); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return success(res, {}, "If that email exists, a reset link was sent");
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.otp = { code: resetToken, expiresAt: new Date(Date.now() + 60 * 60 * 1000) };
    await user.save();
    await sendPasswordReset(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    success(res, {}, "Reset link sent");
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ "otp.code": token });
    if (!user || new Date() > user.otp.expiresAt) return error(res, "Invalid or expired reset link");
    user.password = password;
    user.otp = undefined;
    await user.save();
    success(res, {}, "Password reset successful");
  } catch (err) { next(err); }
};

exports.oauthSuccess = (req, res) => {
  const token = generateAccessToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
};
