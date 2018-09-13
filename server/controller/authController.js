const Joi = require("joi");
const User = require("../models/User");

// 로컬 회원가입
exports.localRegister = async ctx => {
  // 데이터 검증
  const schema = Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(4)
      .max(15)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
      .min(6)
  });

  ctx.body = "register";
};

// 로컬 로그인
exports.localLogin = async ctx => {
  ctx.body = "login";
};

// 이메일 / 아이디 존재 유무 확인
exports.exists = async ctx => {
  ctx.body = "exists";
};

// 로그아웃
exports.logout = async ctx => {
  ctx.body = "logout";
};
