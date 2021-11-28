const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

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

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res
          .status(404)
          .json({ errors: [{ msg: "There is no profile for this user" }] });
      }
      profile.experience.unshift(newExperience);
      await profile.save();
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

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ errors: [{ msg: "There is no profile for this user" }] });
    }

    profile.experience = profile.experience.filter(
      (exp) => exp.id !== req.params.exp_id
    );

    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldOfStudy", "FieldOfStudy is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldOfStudy, from, to, current, description } =
      req.body;

    const newEducation = {
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res
          .status(404)
          .json({ errors: [{ msg: "There is no profile for this user" }] });
      }
      profile.education.unshift(newEducation);
      await profile.save();
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

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ errors: [{ msg: "There is no profile for this user" }] });
    }

    profile.education = profile.education.filter(
      (edu) => edu.id !== req.params.edu_id
    );

    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

router.get("/github/:username", async (req, res) => {
  try {
    const githubClientId = config.get("githubClientId");
    const githubClientSecret = config.get("githubClientSecret");
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created&direction=desc&client_id=${githubClientId}&client_secret=${githubClientSecret}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Github profile not found" }] });
      }
      return res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

module.exports = router;
