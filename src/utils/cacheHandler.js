const redis = require('redis')
const client = redis.createClient()


const checkCache = async (key) => {
    await client.connect()

    const result = await client.get(key)
    console.log(result)
    await client.disconnect()
    return result

}

const setCache = async (key, value, ttl = 0) => {
    await client.connect()
    const result = await client.set(key, value)
    if (ttl) {
        await client.expire(key, ttl)
    }

    await client.disconnect()
    return result

}


const delCache = async (key) => {
    await client.connect()
    const result = await client.del(key)
    await client.disconnect()
    return result
}

module.exports = { checkCache, setCache, delCache }





