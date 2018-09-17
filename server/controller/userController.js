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

  const { title, content } = ctx.request.body;
  const thumnail =
    ctx.request.files.thumnail.name === ""
      ? null
      : ctx.request.files.thumnail.path;

  console.log(`파일경로: ${thumnail}`);
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
  const path = image.path.split("/")[2];
  ctx.body = `
      <img src="https://api-devlog.herokuapp.com/${path}" alt="${image.name}" />
   `;
};

exports.postView = async ctx => {
  let post;
  const id = ObjectId(ctx.params.post_id);
  console.log(id);
  console.log(ctx.params.nickname);
  try {
    post = await User.findOne(
      {
        "profile.nickname": ctx.params.nickname
      },
      { posts: { $elemMatch: { _id: id } } }
    );
  } catch (err) {
    return ctx.throw(500, err);
  }
  console.log(post);
  ctx.body = post;
};
