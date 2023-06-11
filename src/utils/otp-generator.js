const otpGenerator = require('otp-generator')

const  otpGen = (len)=>{
    return otpGenerator.generate(parseInt(len), { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets:false });
}

module.exports  = otpGen

