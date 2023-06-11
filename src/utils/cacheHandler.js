const redis = require('redis')
const client = redis.createClient()


const checkCache  = async(key)=>{
    await client.connect()

    const result = await client.get(key)
    client.quit()
    return result


}

const setCache = async(key,value)=>{
    await client.connect()
    await client.set(key,value)
    client.quit()

}

module.exports = {checkCache,setCache}





