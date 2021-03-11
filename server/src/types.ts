import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core'
import { Request, Response } from 'express'
import { Redis } from 'ioredis'

type EM = EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>

export type Context = {
  em: EM
  redis: Redis
  req: Request
  res: Response
}

declare module 'express-session' {
  interface Session {
    userId: number
  }
}
