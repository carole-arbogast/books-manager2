import React from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";
import { FieldGroup } from "./layouts";
import axios from "axios";
import { mutate } from "swr";

interface Props {
  onClose: () => void;
}

const createBookshelf = async (query) => {
  return await axios.post("http://localhost:8000/bookshelves/", query);
};

export function AddBook({ onClose }: Props) {
  const handleSubmit = async (values) => {
    try {
      await createBookshelf({ name: values.name });
      mutate("/books");
      mutate("/bookshelves");
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  const initialValues = {
    name: "",
  };
  return (
    <Wrapper>
      <h2>Add a bookshelf</h2>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(props) => (
          <Form>
            <FieldGroup>
              <label htmlFor="title">Name</label>
              <Field type="text" name="name" />
            </FieldGroup>

            <button type="submit">Add</button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 25em;
`;

export default AddBook;
