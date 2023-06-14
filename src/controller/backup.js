const { deleteFile } = require("../utils/fileHandler");
const { checkCache, setCache } = require("../utils/cacheHandler");
const { uploadFile, downloadFile } = require("../utils/awsHandler");
const User = require("../model/userModel");

const backupController = async (req, res) => {
  try {
    
    let { email: key } = req.body;
    key=key.toLowerCase()
    const { filename } = req.file;
    const filePath = `${process.env.WALLET_BACKUP_DIRECTORY}/${filename}`;

    const upload = await uploadFile(filePath, key);

    deleteFile(filePath);

    const cachedUserInfo = await checkCache(key);
    // handing cache failure
    if (!cachedUserInfo) {
      const result = await User.findOneAndUpdate(
        { email: key },
        { isBackedup: true },

        { new: true }
      );
      // console.log(result)
      await setCache(key, JSON.stringify(result));
    }
    if (cachedUserInfo) {
      const jsonParsedCachedUserInfo = JSON.parse(cachedUserInfo);
      if (!jsonParsedCachedUserInfo.isBackedup) {
        const result = await User.findOneAndUpdate(
          { email: key },
          { isBackedup: true },
          { new: true }
        );
        await setCache(key, JSON.stringify(result));
      }
    }

    res.status(204).send();
  } catch (e) {
    res.status(400).send({ message: e.message });
  }

  // create s3 bucket
  // s3.createBucket({
  //     Bucket:"bifold-bucket"
  // },(error,success)=>{
  //     if(error){
  //         return res.send(error)
  //     }
  //     return res.send(success)

  // })
};

module.exports = { backupController };
