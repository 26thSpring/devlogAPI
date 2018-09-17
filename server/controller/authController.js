const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 로컬 회원가입
exports.localRegister = async ctx => {
  // 데이터 검증
  const schema = Joi.object().keys({
    nickname: Joi.string()
      .alphanum()
      .min(3)
      .max(15)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    thumnail: Joi.string()
  });

  const result = Joi.validate(ctx.request.body, schema);

  // 스키마 검증 실패
  if (result.error) {
    ctx.status = 400;
    return;
  }

  ctx.body = "register";
};

// 로컬 로그인
exports.localLogin = async ctx => {
  const { email } = ctx.request.body;
  let user;
  let user_profile;

  try {
    user = await User.findOne({ email });
  } catch (err) {
    return ctx.throw(500, err);
  }

  if (!user) {
    ctx.status = 404;
    return;
  }

  let token = null;
  try {
    token = await user.generateToken();
  } catch (err) {
    ctx.throw(500, err);
  }

  ctx.cookis.set("access-token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 3 // 3일
  });

  ctx.body = user;
};

// 이메일 / 아이디 존재 유무 확인
exports.exists = async ctx => {
  ctx.body = "exists";
};

// 로그아웃
exports.logout = async ctx => {
  ctx.body = "logout";
};
