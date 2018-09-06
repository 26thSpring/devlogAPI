const {
  Types: { ObjectId }
} = require("mongoose");

const User = require("../models/User");
const Post = require("../models/Post");

exports.create = async ctx => {
  console.log(ctx.request);
  // request body에서 값 추출
  const { email, name, nickname, introduce } = ctx.request.body;
  // User 인스턴스 생성
  const user = new User({ email, name, nickname, introduce });

  // .save 함수로 실제 데이터베이스에 저장
  // Promise를 반환함
  try {
    await user.save();
  } catch (err) {
    return ctx.throw(500, err);
  }
  // 저장한 결과 반환
  ctx.body = user;
};

exports.list = async ctx => {
  let users;

  try {
    // 데이터 조회
    users = await User.find();
  } catch (err) {
    return ctx.throw(500, err);
  }

  ctx.body = users;
};

exports.get = async ctx => {
  const { email } = ctx.params;
  let user;

  try {
    user = await User.findOne({ email });
  } catch (err) {
    ctx.status = 404;
    ctx.body = { message: "user not found" };
    return;
  }
  ctx.body = user;
};

exports.postList = async ctx => {
  let user;

  try {
    // 데이터 조회
    user = await User.findOne({ email: ctx.params.email });
  } catch (err) {
    return ctx.throw(500, err);
  }

  ctx.body = user;
};

exports.postUpdate = async ctx => {
  const { email } = ctx.params;
  console.log(email);
  console.log(`파일리스트: ${ctx.request.files}`);

  const { title, content } = ctx.request.body;
  const thumnail =
    ctx.request.files.thumnail.name === ""
      ? null
      : ctx.request.files.thumnail.path;

  try {
    await User.findOneAndUpdate(
      { email },
      {
        $push: {
          posts: { $each: [{ title, content, thumnail }], $sort: -1 }
        }
      }
    );
  } catch (err) {
    return ctx.throw(500, err);
  }

  ctx.redirect("https://devlog-test2.herokuapp.com");
};

exports.imageUpload = async ctx => {
  console.log(`파일!!!${ctx.request.files.images.path}`);
  const image = ctx.request.files.images;

  ctx.body = `
      <img src="http://localhost:3002/${image.path}" alt="${image.name}" />
   `;
};
