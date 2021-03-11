import React, { InputHTMLAttributes } from 'react'
import { useField } from 'formik'
import { Form } from 'react-bootstrap'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  placeholder: string
  name: string
  type?: 'text' | 'password'
}

const InputField: React.FC<InputFieldProps> = ({ type = 'text', ...props }) => {
  const { label, placeholder } = props

  const [field, { error }] = useField(props)
  return (
    <Form.Group>
      <Form.Label htmlFor={field.name}>{label}</Form.Label>
      <Form.Control
        {...field}
        type={type}
        placeholder={placeholder}
        id={field.name}
        isInvalid={!!error}
      />
      {error ? (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      ) : undefined}
    </Form.Group>
  )
}

export default InputField
