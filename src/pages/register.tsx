import React from 'react'
import { Formik, Form } from 'formik'
import InputField from '../components/InputField'
import { Wrapper } from '../components/layout/Wrapper'
import LoadingIcon from '../components/layout/LoadingIcon'
import { useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter()
  const [{}, register] = useRegisterMutation()

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
      }}
      onSubmit={async (values, { setErrors }) => {
        const response = await register({ data: { ...values } })
        if (response.error) {
          const validationErrorsResponse = response.error.graphQLErrors.find(
            (item) => {
              const validateHint = item.extensions.exception as unknown as any
              if (validateHint.validationErrors) return item
            }
          )
          if (validationErrorsResponse) {
            const validationErrors = toErrorMap(validationErrorsResponse)
            setErrors(validationErrors)
          }
        } else if (response.data?.register) {
          //worked
          router.push('/login')
        }
      }}
    >
      {({ isSubmitting }) => {
        return (
          <Wrapper>
            <Form>
              <InputField
                name="firstName"
                label="First name"
                type="text"
              ></InputField>
              <InputField
                name="lastName"
                label="Last Name"
                type="text"
              ></InputField>
              <InputField name="email" label="Email" type="text"></InputField>
              <InputField
                name="username"
                label="Username"
                type="text"
              ></InputField>
              <InputField
                name="password"
                label="Password"
                type="password"
              ></InputField>
              <button
                className="flex rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-700"
                type="submit"
              >
                {isSubmitting ? <LoadingIcon /> : null}
                {isSubmitting ? 'Loading' : 'Register'}
              </button>
            </Form>
          </Wrapper>
        )
      }}
    </Formik>
  )
}

export default Register
