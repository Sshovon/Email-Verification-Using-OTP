const router =  require('express').Router()
const { checkCache, delCache,setCache } = require('../utils/cacheHandler')
const { genHash } = require('../utils/crypto')
const mailSender = require('../utils/mail-sender')
const { otpGen } = require('../utils/otpHandler')




router.post('/verify', async (req, res) => {
    try {
        const { email, otp } = req.body
        const cachedResult = await checkCache(genHash(email))
        if (!cachedResult || cachedResult !== otp) {
            return res.status(401).send({ isVerified: false })
        }
        await delCache(genHash(email))
        res.status(200).send({isVerified:true})

    } catch (e) {
        res.status(400).send({ message: e.message })
    }
})

router.post('/send',async(req,res)=>{
    try{
        const {email} = req.body
        const cachedResult = await checkCache(genHash(email))
        if(cachedResult){
            return res.status(200).send({message:"Already sent"})
        }
        const cacheduserInfo = await checkCache(email)

        if (!cacheduserInfo){
            return res.status(401).send({message:"Email is not registered"})
        }

        const otp = otpGen(4)
        mailSender(email,otp)
        await setCache(genHash(email),otp,90)
        
        res.status(201).send({message:"OTP sent"})

    }catch(e){
        res.status(400).send({message:e.message})
    }
})



module.exports = router 