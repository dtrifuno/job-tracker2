import express from 'express'
import argon2 from 'argon2'
import Redis from 'ioredis'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import path from 'path'

const main = async () => {
    // Setup DB and TypeORM
    const conn = await createConnection({
        type: 'postgres',
        url: process.env.DB_URL,
        migrations: [path.join(__dirname, "./migrations/*")],
        entities: []
    })

    // Setup Redis and session store
    const redis = new Redis(process.env.REDIS_HOST)
    redis.set("key", "yaaay")

    const app = express()

    app.get('/', async (req, res) => {
        const hash = await argon2.hash("password")
        res.send(`Hello World, ${await redis.get("key")}! ${hash}`)
    })

    app.listen(3000)
}

main().catch((err) => {
    console.error(err)
})