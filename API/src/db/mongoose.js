const mongoose = require('mongoose')

// mongoose.set('strictQuery',false)
// mongoose.connect(process.env.DB_URL_LOCAL,{ 
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology:true
// }).then(()=>{
//     console.log("Database connection successful")
// }).catch(()=>{
//     console.log("Database connection failed")
// })

mongoose.connect(process.env.DB_URL_LOCAL)
.then(()=>{
    console.log("DB Connection successful")
})
.catch(()=>{
    console.log("DB Connection failed")
})

