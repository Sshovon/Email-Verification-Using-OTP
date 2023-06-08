const express = require('express')
const app  = express()
require('dotenv').config()
const {createClient} = require('redis')

const PORT = process.env.PORT || 5000

app.use(express.json()) //parse json

app.post('/o',(req,res)=>{

})





app.listen(PORT,()=>{
    console.log(`OTP server started on port ${PORT}`)
})

