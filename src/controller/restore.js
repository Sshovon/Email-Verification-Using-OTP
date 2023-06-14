const { uploadFile, downloadFile } = require("../utils/awsHandler");
const { checkCache, setCache } = require("../utils/cacheHandler");

const restoreController = async (req, res) => {
  try {
    // const { email: key } = req.body;
    const email = req.params.email
    const key=email.toLowerCase()
    const cachedUserInfo = await checkCache(key);



    // handling cache failure
    if (!cachedUserInfo) {
      const result = await User.find({ email: key });
      if (result.length === 0 || result[0].isBackedup === false) {
        return res.status(404).send({ message: "No backup found" });
      }
    }

    // has cache but no backup data
    if (cachedUserInfo) {
      const jsonParsedCachedUserInfo = JSON.parse(cachedUserInfo);
      if (!jsonParsedCachedUserInfo.isBackedup) {
        return res.status(404).send({ message: "No backup found" });
      }
    }

    const upload = downloadFile(key);
    upload.pipe(res);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

module.exports = { restoreController };
