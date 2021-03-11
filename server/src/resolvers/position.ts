import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql'
import { Position } from '../entities/Position'
import { Context } from '../types'

@Resolver()
export class PositionResolver {
  @Query(() => [Position])
  positions(@Ctx() { em }: Context): Promise<Position[]> {
    return em.find(Position, {})
  }

  @Query(() => Position, { nullable: true })
  position(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: Context
  ): Promise<Position | null> {
    return em.findOne(Position, { id })
  }

  @Mutation(() => Position)
  async createPosition(
    @Arg('jobTitle') jobTitle: string,
    @Ctx() { em }: Context
  ): Promise<Position> {
    const position = em.create(Position, { jobTitle })
    await em.persistAndFlush(position)
    return position
  }

  @Mutation(() => Position, { nullable: true })
  async updatePosition(
    @Arg('id', () => Int) id: number,
    @Arg('jobTitle') jobTitle: string,
    @Ctx() { em }: Context
  ): Promise<Position | null> {
    const position = await em.findOne(Position, { id })
    if (!position) {
      return null
    }
    if (jobTitle) {
      position.jobTitle = jobTitle
      await em.persistAndFlush(position)
    }
    return position
  }

  @Mutation(() => Boolean)
  async deletePosition(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: Context
  ): Promise<boolean> {
    await em.nativeDelete(Position, { id })
    return true
  }
}
