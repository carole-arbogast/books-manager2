import React from "react";
import { Formik, Form, Field } from "formik";
import Axios from "axios";
import { AuthContext } from "../components/AuthProvider";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import { FieldGroup, FormWrapper, Button, Container } from "../components/layouts";
import { APIQueryLogin } from "../index";

const handleLogin = async (query: APIQueryLogin) =>
  Axios.post("http://localhost:8000/token-auth/", query);

function Login() {
  const router = useRouter();
  const { setIsLoggedIn } = React.useContext(AuthContext);
  const [err, setErr] = React.useState("");

  const handleSubmit = async (values: APIQueryLogin) => {
    try {
      const res = await handleLogin(values);
      typeof window !== "undefined" && localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      router.push("/");
    } catch (err) {
      setErr(err);
      console.log(err);
    }
  };

  const initialValues = { username: "", password: "" };
  return (
    <>
      <Navbar />
      <Container>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {() => (
            <FormWrapper>
              <Form>
                <FieldGroup>
                  <label htmlFor="username">Username</label>
                  <Field type="text" name="username"></Field>
                </FieldGroup>
                <FieldGroup>
                  <label htmlFor="password">Pasword</label>
                  <Field type="text" name="password"></Field>
                </FieldGroup>

                <Button type="submit">Submit</Button>
                {err && <div>Could not log in. Please check your credentials.</div>}

                <div>
                  No account yet? <a href="/register">Register</a>
                </div>
              </Form>
            </FormWrapper>
          )}
        </Formik>
      </Container>
    </>
  );
}

export default Login;
