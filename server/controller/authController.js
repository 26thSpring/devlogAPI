const Joi = require("joi");
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
      .required()
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
