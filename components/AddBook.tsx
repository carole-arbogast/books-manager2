import React from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";

export function AddBook() {
  const [manualAdd, setManualAdd] = React.useState(false);

  const handleSubmit = (values) => {
    console.log(values);
  };

  const initialValues = { title: "", author: "" };

  const options = [
    { name: "Swedish", value: "sv" },
    { name: "English", value: "en" },
    {
      type: "group",
      name: "Group name",
      items: [{ name: "Spanish", value: "es" }],
    },
  ];

  return (
    <div>
      <h3>Add Book</h3>

      {manualAdd ? (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {(props) => (
            <Form>
              <FieldGroup>
                <label>Title</label>
                <Field type="text" name="title" />
              </FieldGroup>
              <FieldGroup>
                <label>Author</label>
                <Field type="text" name="author" />
              </FieldGroup>

              <button type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      ) : (
        <div></div>
      )}
    </div>
  );
}

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
`;

export default AddBook;
