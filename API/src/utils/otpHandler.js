const otpGenerator = require('otp-generator');
const mailSender = require('./mail-sender');
const { setCache } = require('./cacheHandler');
const { genHash } = require('./crypto');
const validator  = require('validator')

const  otpGen = (len=4)=>{
    return otpGenerator.generate(parseInt(len), { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets:false });
}

const otpSender = async(email)=>{
    const otp = otpGen()
    if(!validator.isEmail(email)){
        throw new Error("Invalid Email")
    }
    // mailSender(email,otp)
    await setCache(genHash(email), otp, 90);

}

module.exports  = {otpGen,otpSender}

