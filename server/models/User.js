const mongoose = require('mongoose');

const Post = require('./Post');

const userSchema = new mongoose.Schema({
   email: { type: String, required: true, unique: true },
   name: { type: String, required: true },
   nickname: String,
   introduce: String,
   posts: [
      {
         title: { type: String, required: true },
         content: String,
         regdate: { type: Date, default: Date.now },
         maintag: String,
         thumnail: String,
         register: { type: Number, default: 1 }
      }
   ]
});

module.exports = mongoose.model('User', userSchema, 'user');
