import React from "react";
import { Formik, Form, Field } from "formik";
import Axios from "axios";
import { AuthContext } from "../components/AuthProvider";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";

const handleLogin = async (query) => Axios.post("http://localhost:8000/token-auth/", query);

function Login() {
  const router = useRouter();
  const { isLoggedIn, user } = React.useContext(AuthContext);

  const handleSubmit = async (values) => {
    try {
      await handleLogin(values);
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  const initialValues = { username: "", password: "" };
  return (
    <>
      <Navbar />
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <label htmlFor="username">Username</label>
            <Field type="text" name="username"></Field>
            <label htmlFor="password">Pasword</label>
            <Field type="text" name="password"></Field>

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default Login;
