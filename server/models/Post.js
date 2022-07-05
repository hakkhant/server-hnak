const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title cannot be empty'],
    },
    content: {
      type: String,
      required: [true, 'Description cannot be empty'],
    },
    image: {
      type: String,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

postSchema.pre('save', async function (next) {
  this.slug = await slugify(this.title.toLowerCase());
  next();
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;
