import React from "react";
import { Formik, Form, Field } from "formik";
import Axios, { AxiosResponse } from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../components/AuthProvider";
import { FieldGroup, FormWrapper, Button } from "../components/layouts";
import { APIQueryRegister, APIResRegister } from "../index";

const handleRegister = async (query: APIQueryRegister) =>
  Axios.post("http://localhost:8000/users/", query);

function Register() {
  const { setIsLoggedIn } = React.useContext(AuthContext);

  const handleSubmit = async (values: APIQueryRegister) => {
    try {
      const res: AxiosResponse<APIResRegister> = await handleRegister(values);
      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      console.log(err);
    }
  };

  const initialValues = { username: "", email: "", password: "" };
  return (
    <>
      <Navbar />
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {() => (
          <FormWrapper>
            <Form>
              <FieldGroup>
                <label htmlFor="username">Username</label>
                <Field type="text" name="username"></Field>
              </FieldGroup>

              <FieldGroup>
                <label htmlFor="email">Email</label>
                <Field type="text" name="email"></Field>
              </FieldGroup>

              <FieldGroup>
                <label htmlFor="password">Pasword</label>
                <Field type="text" name="password"></Field>
              </FieldGroup>

              <Button type="submit">Submit</Button>
            </Form>
          </FormWrapper>
        )}
      </Formik>
    </>
  );
}

export default Register;
