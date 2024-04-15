const router = require("express").Router();
const Post = require("../models/Post");
const verifyToken = require("../MaddleWare/MaddleWare");




// Like a post
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if the user has already liked the post
    if (post.likedBy.includes(req.user._id)) {
      // Unlike the post
      post.likes -= 1;
      post.likedBy = post.likedBy.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      // Like the post
      post.likes += 1;
      post.likedBy.push(req.user._id);
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
