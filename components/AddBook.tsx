import React from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import AddBookSearch from "./AddBooksSearch";

interface Props {
  fetchBooks: (query: { title: string; author: string }) => Promise<object>;
}

export function AddBook({ fetchBooks }: Props) {
  const [manualAdd, setManualAdd] = React.useState(false);

  const handleSubmit = (values) => {
    console.log(values);
  };

  const initialValues = { title: "", author: "" };

  return (
    <Wrapper>
      <h3>Add Book</h3>

      {manualAdd ? (
        <button onClick={() => setManualAdd(false)}>Search Books</button>
      ) : (
        <button onClick={() => setManualAdd(true)}>Manual Add</button>
      )}

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
        <AddBookSearch />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 25em;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
`;

function AddBookContainer(props: Omit<Props, "fetchBooks">) {
  const fetchBooks = async (query: { title: string; author: string }) => {
    const title = query.title.split(" ").join("+");
    const author = query.author.split(" ").join("+");
    console.log(title, author);
    return await axios.get(`http://openlibrary.org/search.json?title=${title}&author=${author}`);
  };
  return <AddBook fetchBooks={fetchBooks} {...props} />;
}

export default AddBookContainer;
