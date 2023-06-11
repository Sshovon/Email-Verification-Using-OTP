const router =  require('express').Router()
const User = require('../model/userModel')
const {checkCache,setCache} = require('../utils/cacheHandler')
const mailSender = require('../utils/mail-sender')
const otpGen = require('../utils/otp-generator')



router.post('/register',async(req,res)=>{

    try{
        const {email,password} = req.body
        const cacheRes= await checkCache(email)

        if (cacheRes){
            return res.status(200).send({message:"Email already exists"})
        }

        const user = new User({email,password})
        await user.save()
        await setCache(email,JSON.stringify(user))

        const otp =  otpGen(4)
        await mailSender(email,otp)

        res.send(user)
        
    }catch(e){

        res.status(400).send({message:e.message})
    }
    


})





module.exports = router 