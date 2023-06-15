const router = require("express").Router();
const { otpVerifyController, otpSendController } = require("../controller/otp");

router.post("/verify", otpVerifyController);

router.post("/send", otpSendController);

module.exports = router;
