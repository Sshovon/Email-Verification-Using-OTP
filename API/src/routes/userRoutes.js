const {
  // emailVerificationController,
  userRegistrationController,
  userAuthenticationController,
} = require("../controller/user");

const router = require("express").Router();

// router.post("/email/verify", emailVerificationController);

router.post("/register", userRegistrationController);

router.post("/authentication", userAuthenticationController);

module.exports = router;
