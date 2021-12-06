const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    check("password", "Password must be at least 6 chars email").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(409)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      const salt = await bcryptjs.genSalt(10);

      user = new User({
        name,
        email,
        password: await bcryptjs.hash(password, salt),
        avatar,
      });

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      console.error(err.stack);
      return res
        .status(500)
        .json({ errors: [{ msg: "Internal Server Error" }] });
    }
  }
);

module.exports = router;
