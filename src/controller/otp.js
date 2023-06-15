const { checkCache, delCache, setCache } = require("../utils/cacheHandler");
const { genHash } = require("../utils/crypto");
const { otpSender } = require("../utils/otpHandler");

const otpVerifyController = async (req, res) => {
  try {
    console.log('------> OTP Verify <------')

    const { email, otp } = req.body;
    const cachedResult = await checkCache(genHash(email));
    if (!cachedResult || cachedResult !== otp) {
      return res.status(200).send({ isVerified: false });
    }
    await delCache(genHash(email));
    res.status(200).send({ isVerified: true });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

const otpSendController = async (req, res) => {
  try {
    console.log('------> OTP Send <------')
    const { email } = req.body;
    const cachedResult = await checkCache(genHash(email));
    if (cachedResult) {
      return res
        .status(200)
        .send({ message: "OTP already sent", otpSent: false });
    }
    // const cacheduserInfo = await checkCache(email);

    // if (!cacheduserInfo) {
    //   return res.status(401).send({ message: "Email is not registered" });
    // }

    await otpSender(email);

    res.status(201).send({ message: "OTP sent", otpSent: true });
  } catch (e) {
    res.status(400).send({ error: e.message, otpSent: false });
  }
};

module.exports = { otpVerifyController, otpSendController };
