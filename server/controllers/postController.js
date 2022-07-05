const Post = require('../models/Post');

const index = async (req, res) => {
  const posts = await Post.find();
  res.status(200).json(posts);
};

const create = async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      image: req.file.path,
      user: req.user,
    });
    res.status(201).json(post);
  } catch (error) {
    console.log(error.message);
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id);
    res.status(200).json('Post deleted');
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const postController = {
  index,
  create,
  destroy,
};

module.exports = postController;
