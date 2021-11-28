const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };
      post = new Post(newPost);
      await post.save();
      return res.json(post);
    } catch (err) {
      console.error(err.message);
      console.error(err.stack);
      return res
        .status(500)
        .json({ errors: [{ msg: "Internal Server Error" }] });
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ errors: [{ msg: "Post not found" }] });
    }
    res.json(post);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ errors: [{ msg: "Post not found" }] });
    }
    console.error(err.message);
    console.error(err.stack);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ errors: [{ msg: "Post not found" }] });
    }
    if (post.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ errors: [{ msg: "You can only delete your own posts" }] });
    }
    await Post.findByIdAndRemove(req.params.id);
    return res.status(204).send();
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ errors: [{ msg: "Post not found" }] });
    }
    console.error(err.message);
    console.error(err.stack);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ errors: [{ msg: "Post not found" }] });
    }

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res
        .status(400)
        .json({ errors: [{ msg: "You already like this post" }] });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    return res.json(post.likes);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ errors: [{ msg: "Post not found" }] });
    }
    console.error(err.message);
    console.error(err.stack);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ errors: [{ msg: "Post not found" }] });
    }

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({
        errors: [{ msg: "You can only unlike a post that you liked" }],
      });
    }

    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );

    await post.save();
    return res.json(post.likes);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ errors: [{ msg: "Post not found" }] });
    }
    console.error(err.message);
    console.error(err.stack);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ errors: [{ msg: "Post not found" }] });
      }

      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };

      post.comments.unshift(newComment);
      await post.save();
      return res.json(post.comments);
    } catch (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).json({ errors: [{ msg: "Post not found" }] });
      }
      console.error(err.message);
      console.error(err.stack);
      return res
        .status(500)
        .json({ errors: [{ msg: "Internal Server Error" }] });
    }
  }
);

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ errors: [{ msg: "Post not found" }] });
    }

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ errors: [{ msg: "Comment not found" }] });
    }

    if (comment.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ errors: [{ msg: "You can only delete your comments" }] });
    }

    post.comments = post.comments.filter(
      (comment) => comment.id !== req.params.comment_id
    );

    await post.save();
    return res.json(post.comments);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ errors: [{ msg: "Post not found" }] });
    }
    console.error(err.message);
    console.error(err.stack);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

module.exports = router;
