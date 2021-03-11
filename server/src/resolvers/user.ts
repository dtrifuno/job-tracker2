import argon2 from 'argon2'
import { Length, MinLength, validate } from 'class-validator'
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  InputType,
  Field,
  Ctx,
  ObjectType,
  createUnionType,
} from 'type-graphql'

import { Context } from '../types'
import { User } from '../entities/User'
import {
  FieldErrors,
  createFieldError,
  validationErrorsToFieldErrors,
} from './errors'

@InputType()
class UsernamePasswordInput {
  @Field()
  @Length(5, 30, {
    message:
      'Username must be between $constraint1 and $constraint2 characters long.',
  })
  username!: string

  @Field()
  @MinLength(6, {
    message: 'Password must be at least $constraint1 characters long.',
  })
  password!: string
}

const createUsernameAlreadyExistsError = (
  username: string,
  field = 'username'
): FieldErrors => {
  return createFieldError(field, `Username "${username}" is already taken.`)
}

const createNoSuchUserError = (
  username: string,
  field = 'username'
): FieldErrors => {
  return createFieldError(
    field,
    `Cannot find user with username "${username}".`
  )
}

const createIncorrectPasswordError = (field = 'password'): FieldErrors => {
  return createFieldError(field, `Incorrect password.`)
}

const UserResultUnion = createUnionType({
  name: 'UserResult',
  types: () => [User, FieldErrors] as const,
  resolveType: (value) => {
    if ('username' in value) {
      return User
    }
    if ('errors' in value) {
      return FieldErrors
    }
    return undefined
  },
})

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: Context) {
    if (!req.session.userId) {
      return null
    }

    const user = await em.findOne(User, { id: req.session.userId })
    return user
  }

  @Mutation(() => UserResultUnion)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: Context
  ): Promise<typeof UserResultUnion> {
    const { username, password } = options

    const validationErrors = await validate(options)
    if (validationErrors.length > 0) {
      return validationErrorsToFieldErrors(validationErrors)
    }

    const existingUser = await em.findOne(User, { username })
    if (existingUser) {
      return createUsernameAlreadyExistsError(username)
    }

    const passwordHash = await argon2.hash(password)

    const user = em.create(User, { username, passwordHash })
    await em.persistAndFlush(user)
    req.session!.userId = user.id
    return user
  }

  @Mutation(() => UserResultUnion)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: Context
  ): Promise<typeof UserResultUnion> {
    const { username, password } = options

    const user = await em.findOne(User, { username })
    if (!user) {
      return createNoSuchUserError(username)
    }

    if (!(await argon2.verify(user.passwordHash, password))) {
      return createIncorrectPasswordError()
    }

    req.session!.userId = user.id
    user.lastLogin = new Date()
    await em.persistAndFlush(user)
    return user
  }
}
