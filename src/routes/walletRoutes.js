const router = require('express').Router()

const util = require('util')
const { uploadFile, downloadFile } = require('../utils/awsHandler')
const upload = require('../middlewares/multerStorage')





router.post('/backup', upload.single('file'), async (req, res) => {

    try {
        const { email: key } = req.body
        const { filename } = req.file
        const upload = await uploadFile(`${process.env.WALLET_BACKUP_DIRECTORY}/${filename}`, key)
        res.status(200).send(upload)

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
        const {email:key} = req.body
        const upload = downloadFile(key)
        upload.pipe(res)

    } catch (e) {
        res.status(400).send({ message: e.message })

    }


})






module.exports = router