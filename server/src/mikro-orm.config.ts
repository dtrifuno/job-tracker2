import path from 'path'
import { MikroORM } from '@mikro-orm/core'

import { __prod__ } from './constants'
import { Position } from './entities/Position'
import { User } from './entities/User'

type MikroORMOptions = Parameters<typeof MikroORM.init>[0]

const config: MikroORMOptions = {
  type: 'postgresql',
  clientUrl: process.env.DB_URL,
  entities: [Position, User],
  debug: !__prod__,
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
}

export default config
