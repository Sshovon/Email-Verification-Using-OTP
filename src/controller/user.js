const User = require("../model/userModel");
const { checkCache, setCache } = require("../utils/cacheHandler");
const bcryptjs = require("bcryptjs");
const {otpSender} = require('../utils/otpHandler')
const userRegistrationController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = new User({ email, password });
    await user.save();
    await setCache(email, JSON.stringify(user));

    res.status(201).send(user);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};
const userAuthenticationController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cachedUserInfo = await checkCache(email);
    let parsedCachedUserInfo;

    if (!cachedUserInfo) {
      // no cache, checking main db for cache failure
      const result = await User.find({ email });
      // cache and main db both missing
      if (result.length === 0) {
        // await otpSender(email)
        return res
          .status(200)
          .send({
            message: "Email is not registered",
            isVerified: false,
            isRegisted: false,
          });
      } else {
        // cache missing but data is available in main db that means the user is registered
        // setting cache
        await setCache(email, JSON.stringify(result[0]));
        parsedCachedUserInfo = result[0];
      }
    } else {
      parsedCachedUserInfo = JSON.parse(cachedUserInfo);
    }
    // comapring password
    const isMatch = await bcryptjs.compare(
      password,
      parsedCachedUserInfo.password
    );
    if (isMatch) {

      // await otpSender(email)

      return res.status(200).send({ isVerified: true, isRegistered: true });
    } else {
      return res.status(200).send({ isVerified: false, isRegistered: true });
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

// const emailVerificationController = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const cacheRes = await checkCache(email);
//     if (cacheRes) {
//       return res.status(409).send({ message: "Email already exists" });
//     }
//     // handling cache failure
//     if (!cacheRes) {
//       const result = await User.find({ email });
//       if (result.length) {
//         // setting cache
//         await setCache(email, JSON.stringify(result[0]));
//         return res.status(409).send({ message: "Email already exists" });
//       }
//     }
//     const otp = otpGen(4);
//     mailSender(email, otp);

//     // console.log(genHash(email))
//     await setCache(genHash(email), otp, 90);

//     res.status(200).send({ message: "OK" });
//   } catch (e) {
//     res.status(400).send({ message: e.message });
//   }
// };

module.exports = {
  // emailVerificationController,
  userRegistrationController,
  userAuthenticationController,
};
