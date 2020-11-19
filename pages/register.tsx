import React from "react";
import { Formik, Form, Field } from "formik";
import Axios from "axios";
import Navbar from "../components/Navbar";

const handleRegister = async (query) => Axios.post("http://localhost:8000/users/", query);

function Register() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    typeof window !== "undefined" && Boolean(localStorage.getItem("token"))
  );

  const handleSubmit = async (values) => {
    try {
      const res = await handleRegister(values);
      console.log(res);
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
          <Form>
            <label htmlFor="username">Username</label>
            <Field type="text" name="username"></Field>
            <label htmlFor="email">Email</label>
            <Field type="text" name="email"></Field>
            <label htmlFor="password">Pasword</label>
            <Field type="text" name="password"></Field>

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default Register;
