import 'reflect-metadata'

import express from 'express'
import { MikroORM } from '@mikro-orm/core'
import { buildSchema } from 'type-graphql'
import { ApolloServer } from 'apollo-server-express'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'

import { __prod__ } from './constants'
import mikroConfig from './mikro-orm.config'
import { PositionResolver } from './resolvers/position'
import { UserResolver } from './resolvers/user'
import { Context } from './types'

const main = async () => {
  const app = express()

  // Setup DB and MikroORM
  const orm = await MikroORM.init(mikroConfig)
  orm.getMigrator().up()

  // Setup Redis and session store
  const RedisStore = connectRedis(session)
  const redis = new Redis(process.env.REDIS_HOST!)

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({ client: redis, disableTouch: true }),
      secret: process.env.SESSION_SECRET!,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__,
      },
      saveUninitialized: false,
    })
  )

  // Setup Apollo Server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PositionResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({ em: orm.em, req, res, redis }),
  })
  apolloServer.applyMiddleware({ app })

  app.listen(3000)
}

main().catch((err) => {
  console.error(err)
})
