const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
   title: { type: String, required: true },
   content: String,
   regdate: { type: Date, default: Date.now },
   maintag: String,
   thumnail: String,
   register: { type: Number, default: 1 }
});

module.exports = mongoose.model('Post', postSchema, 'post');
