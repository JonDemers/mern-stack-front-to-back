const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(404).json({ errors: [{ msg: "Profile not found" }] });
    }
    res.json(profile);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ errors: [{ msg: "Profile not found" }] });
    }
    console.error(err.message);
    console.error(err.stack);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    console.info(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubUsername,
      youtube,
      twitter,
      facebook,
      linkedIn,
      instagram,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    if (bio) profileFields.bio = bio;
    if (githubUsername) profileFields.githubUsername = githubUsername;

    const social = {};
    profileFields.social = social;
    if (youtube) social.youtube = youtube;
    if (twitter) social.twitter = twitter;
    if (facebook) social.facebook = facebook;
    if (linkedIn) social.linkedIn = linkedIn;
    if (instagram) social.instagram = instagram;
    console.info(profileFields);

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
      } else {
        profile = new Profile(profileFields);
        await profile.save();
      }
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      console.error(err.stack);
      return res
        .status(500)
        .json({ errors: [{ msg: "Internal Server Error" }] });
    }
  }
);

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res
        .status(404)
        .json({ errors: [{ msg: "There is no profile for this user" }] });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findByIdAndRemove(req.user.id);
    return res.status(204).send();
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

module.exports = router;
