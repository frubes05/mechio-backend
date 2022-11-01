const express = require("express");
const router = express.Router();
const user = require("../../controllers/users/users");
const fileUpload = require("../../middleware/file-upload");

router.post("/login-posloprimac", user.loginUser);
router.post(
  "/novi-posloprimac",
  fileUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  user.registerUser
);
router.get("/", user.getAllUsers);
router.get("/odredeni-posloprimac/:email", user.getSpecificUser);

module.exports = router;
