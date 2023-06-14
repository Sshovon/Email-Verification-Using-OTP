const express = require('express')
const app  = express()
require('dotenv').config()
require('./src/db/mongoose')
const cors = require('cors')

const redis = require("redis")
const client = redis.createClient()


const { lowercaseEmail } = require('./src/middlewares/emailCase')

const PORT = process.env.PORT || 5000
app.use(cors())
// app.use(express.urlencoded({extended:false}))

app.use(express.json()) //parse json
app.use(lowercaseEmail)



const userRoutes = require('./src/routes/userRoutes')
const otpRoutes = require('./src/routes/otpRoutes')
const walletRoutes = require('./src/routes/walletRoutes')
  // handle email case

app.use('/user',userRoutes)
app.use('/otp',otpRoutes)
app.use('/wallet',walletRoutes)




app.all('/*',(req,res)=>{
    res.status(404).send({})
})






app.listen(PORT,()=>{
    console.log(`OTP server started on port ${PORT}`)
})

