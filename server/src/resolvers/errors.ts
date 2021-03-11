import { ValidationError } from 'class-validator'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class FieldErrors {
  @Field(() => [FieldError])
  errors!: FieldError[]
}

@ObjectType()
class FieldError {
  @Field(() => String)
  field!: string

  @Field(() => [String])
  messages!: string[]

  constructor(field: string, messages: string[]) {
    this.field = field
    this.messages = [...messages]
  }
}

export const createFieldError = (
  field: string,
  message: string
): FieldErrors => {
  return wrapFieldErrors(new FieldError(field, [message]))
}

export const validationErrorsToFieldErrors = (
  validationErrors: ValidationError[]
): FieldErrors => {
  return wrapFieldErrors(
    ...validationErrors.map((err) => {
      const field = err.property
      const messages = Object.values(err.constraints ?? {})
      return new FieldError(field, messages)
    })
  )
}

const wrapFieldErrors = (...fieldError: FieldError[]): FieldErrors => {
  const fieldErrrors = new FieldErrors()
  fieldErrrors.errors = [...fieldError]
  return fieldErrrors
}
