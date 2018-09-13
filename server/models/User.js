const mongoose = require("mongoose");
const { generateToken } = require("../lib/token");

const userSchema = new mongoose.Schema({
  email: { type: String },
  username: String,
  profile: { name: String, thumnail: String, introduce: String },
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
    _id: this._id,
    profile: this.profile
  };

  return generateToken(payload, "account");
};

module.exports = mongoose.model("User", userSchema, "user");
