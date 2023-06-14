const router = require('express').Router()
const upload = require('../middlewares/multerStorage')
const User = require('../model/userModel')
const { backupController } = require('../controller/backup')
const { restoreController } = require('../controller/restore')




router.post('/backup', upload.single('file'),backupController)

router.get('/restore/:email', restoreController)






module.exports = router