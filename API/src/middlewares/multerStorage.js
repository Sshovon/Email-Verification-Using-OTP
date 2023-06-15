const multer = require('multer')



const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, process.env.WALLET_BACKUP_DIRECTORY)
    },
    filename: function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})
const upload= multer({storage})


module.exports = upload