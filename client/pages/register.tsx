import { Formik } from 'formik'
import React from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import InputField from '../components/InputField'

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  return (
    <Container>
      <Row>
        <Col sm={7}>
          <Card>
            <Card.Body>
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                  confirmPassword: '',
                }}
                onSubmit={(values, actions) => {
                  console.log(values)
                }}
              >
                {({ values, handleChange, handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <InputField
                      name="username"
                      label="Username"
                      placeholder="Enter username"
                    />
                    <InputField
                      name="password"
                      label="Password"
                      placeholder="Enter password"
                      type="password"
                    />
                    <InputField
                      name="confirmPassword"
                      label="Confirm Password"
                      placeholder="Re-enter password"
                      type="password"
                    />
                    <Form.Group>
                      <Button type="submit">Register</Button>
                    </Form.Group>
                    <Form.Text muted>
                      Already have an account? Click here to login instead.
                    </Form.Text>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Register

// <template>
//   <div class="container">
//     <Bouncer bounceAuthorized bounceTo="jobs" />
//     <div class="col-sm-7 m-auto">
//       <div class="card card-body mt-5">
//         <h2 class="text-center">Register</h2>
//         <form @submit.prevent="pressRegister">
//           <div class="form-group">
//             <label for="usernameInput">Username</label>
//             <input
//               type="text"
//               class="form-control"
//               v-model="username"
//               id="usernameInput"
//             />
//           </div>
//           <div class="form-group">
//             <label for="passwordInput">Password</label>
//             <input
//               type="password"
//               class="form-control"
//               v-model="password"
//               id="passwordInput"
//             />
//           </div>
//           <div class="form-group">
//             <label for="confirmPasswordInput">Confirm Password</label>
//             <input
//               type="password"
//               class="form-control"
//               v-model="confirmPassword"
//               id="confirmPasswordInput"
//             />
//           </div>
//           <div class="form-group">
//             <button type="submit" class="btn btn-primary">
//               Register
//             </button>
//           </div>
//         </form>
//         <small class="text-muted form-text">
//           Already have an account?
//           <router-link to="/login">Click here</router-link>
//           to login instead.
//         </small>
//       </div>
//     </div>
//   </div>
// </template>
