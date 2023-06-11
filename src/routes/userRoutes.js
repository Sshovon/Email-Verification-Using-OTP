const router = require('express').Router()
const User = require('../model/userModel')
const { checkCache, setCache } = require('../utils/cacheHandler')
const { genHash } = require('../utils/crypto')
const mailSender = require('../utils/mail-sender')
const { otpGen } = require('../utils/otpHandler')
const bcryptjs = require("bcryptjs");




router.post('/email/verify', async (req, res) => {
    try {
        const { email } = req.body
        const cacheRes = await checkCache(email)
        if (cacheRes) {
            return res.status(200).send({ message: "Email already exists" })
        }
        const otp = otpGen(4)
        mailSender(email, otp)

        // console.log(genHash(email))
        await setCache(genHash(email), otp, 90)

        res.send({ message: "OK" })


    } catch (e) {
        res.status(400).send({ message: e.message })
    }
})


router.post('/register', async (req, res) => {

    try {
        const { email, password } = req.body

        const user = new User({ email, password })
        await user.save()
        await setCache(email, JSON.stringify(user))

        res.send(user)

    } catch (e) {

        res.status(400).send({ message: e.message })
    }



})

router.post('/authenticate', async (req, res) => {
    try {
        const { email, password } = req.body
        const cachedUserInfo = await checkCache(email)
        const parsedCachedUserInfo = JSON.parse(cachedUserInfo)
        if (!cachedUserInfo) {
            return res.status(200).send({ message: "Email is not registered", isVerified: false })
        }
        const isMatch = await bcryptjs.compare(password, parsedCachedUserInfo.password);
        if (isMatch) {
            return res.status(200).send({ isVerified: true })
        } else {
            return res.status(200).send({ isVerified: false })

        }
    }catch(e){
        res.status(400).send({message:e.message})
    }
})






module.exports = router 