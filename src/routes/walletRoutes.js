const router = require('express').Router()

const util = require('util')
const { uploadFile, downloadFile } = require('../utils/awsHandler')
const upload = require('../middlewares/multerStorage')
const { checkCache, setCache } = require('../utils/cacheHandler')
const User = require('../model/userModel')
const { deleteFile } = require('../utils/fileHandler')




router.post('/backup', upload.single('file'), async (req, res) => {

    try {
        const { email: key } = req.body
        const { filename } = req.file
        const filePath = `${process.env.WALLET_BACKUP_DIRECTORY}/${filename}`
        const upload = await uploadFile(filePath, key)

        deleteFile(filePath)

        const cachedUserInfo = await checkCache(key)
        // handing cache failure
        if (!cachedUserInfo) {
            const result = await User.findOneAndUpdate({ email: key }, { isBackedup: true }, { new: true })
            // console.log(result)
            await setCache(key, JSON.stringify(result))

        }

        if (cachedUserInfo) {
            const jsonParsedCachedUserInfo = JSON.parse(cachedUserInfo)
            if (!jsonParsedCachedUserInfo.isBackedup) {
                const result = await User.findOneAndUpdate({ email: key }, { isBackedup: true }, { new: true })
                await setCache(key, JSON.stringify(result))
            }
        }

        res.status(204).send()

    } catch (e) {
        res.status(400).send({ message: e.message })

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

})

router.get('/restore', async (req, res) => {

    try {
        const { email: key } = req.body
        const cachedUserInfo = await checkCache(key)

        // handling cache failure
        if (!cachedUserInfo) {
            const result = await User.find({ email: key })
            if (result.length === 0 || result[0].isBackedup === false) {
                return res.status(404).send({ message: "No backup found" })
            }
        }

        // has cache but no backup data 
        if (cachedUserInfo) {
            const jsonParsedCachedUserInfo = JSON.parse(cachedUserInfo)
            if (!jsonParsedCachedUserInfo.isBackedup) {
                return res.status(404).send({ message: "No backup found" })
            }
        }



        const upload = downloadFile(key)
        upload.pipe(res)

    } catch (e) {
        res.status(400).send({ message: e.message })

    }


})






module.exports = router