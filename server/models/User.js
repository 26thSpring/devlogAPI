const mongoose = require("mongoose");
const { generateToken } = require("../lib/token");

const userSchema = new mongoose.Schema({
  email: { type: String },
  profile: {
    name: String,
    nickname: String,
    thumnail: String,
    introduce: String
  },
  social: {
    google: {
      id: String,
      accessToken: String
    }
  },
  posts: [
    {
      title: { type: String },
      content: String,
      regdate: { type: Date, default: Date.now },
      tags: { mainTag: String, others: [{ tagName: String }] },
      thumnail: String,
      register: { type: Number, default: 1 }
    }
  ]
});

userSchema.methods.generateToken = () => {
  // JWT 에 담을 내용
  const payload = {
    id: this._id,
    thumnail: this.profile.thumnail,
    nickname: this.profile.nickname
  };

  return generateToken(payload, "user");
};

module.exports = mongoose.model("User", userSchema, "user");
