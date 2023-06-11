const express = require('express')
const app  = express()
require('dotenv').config()

require('./src/db/mongoose')
const redis = require("redis")
const client = redis.createClient()
const PORT = process.env.PORT || 5000
app.use(express.json()) //parse json


const userRoutes = require('./src/routes/userRoutes')
const otpRoutes = require('./src/routes/otpRoutes')

app.use('/user',userRoutes)
app.use('/otp',otpRoutes)



app.post('/create-backup',async(req,res)=>{
    await client.connect()
    const {email,password}=req.body


    console.log(response)

    client.quit()
    res.send(response)
})






app.get('/get',async(req,res)=>{
    const {key} = req.body
    await client.connect()
    const response = await client.get(key)
    res.send(response)
})






app.listen(PORT,()=>{
    console.log(`OTP server started on port ${PORT}`)
})

