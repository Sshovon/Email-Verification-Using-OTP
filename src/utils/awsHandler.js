const fs = require('fs')
const AWS = require('aws-sdk')


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})




 async function uploadFile(file,key){
    const fileStream= fs.createReadStream(file)
    const uploadParams ={
        Bucket:process.env.AWS_S3_BUCKET_NAME,
        Body: fileStream,
        Key:key // we change it later
    }

    return s3.upload(uploadParams).promise()
}


function downloadFile(key){
    const downloadParams= {
        Bucket:process.env.AWS_S3_BUCKET_NAME,
        Key:key
    }

    return s3.getObject(downloadParams).createReadStream()
}



module.exports = {uploadFile,downloadFile}