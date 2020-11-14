import React from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";
import axios from "axios";
interface Props {
  fetchBooks: (query: { title: string; author: string }) => Promise<object>;
}

export function AddBookSearch({ fetchBooks }: Props) {
  const [searchResult, setSearchResult] = React.useState([]);

  const initialValues = { title: "", author: "" };

  const handleSubmitSearch = async (values) => {
    const res = await fetchBooks({ title: values.title, author: values.author });
    const books = res.data.docs.slice(0, 10);
    setSearchResult(books);
  };

  return searchResult.length > 0 ? (
    <SearchResults>
      {searchResult.map((book) => (
        <SearchResultItem key={book.title}>{book.title} </SearchResultItem>
      ))}
    </SearchResults>
  ) : (
    <Formik initialValues={initialValues} onSubmit={handleSubmitSearch}>
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

          <button type="submit">Search</button>
        </Form>
      )}
    </Formik>
  );
}

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
`;

const SearchResults = styled.div`
  height: 60vh;
  overflow: scroll;
`;

const SearchResultItem = styled.div<{ selected?: boolean }>`
  border: 1px solid grey;
  padding: 0.25rem;
  margin: 0.25rem;
  cursor: pointer;
  background: ${(props) => (props.selected ? "lightgray" : "transparent")};

  &:hover {
    background: lightgray;
  }
`;

function AddBookSearchContainer(props: Omit<Props, "fetchBooks">) {
  const fetchBooks = async (query: { title: string; author: string }) => {
    const title = query.title.split(" ").join("+");
    const author = query.author.split(" ").join("+");
    console.log(title, author);
    return await axios.get(`http://openlibrary.org/search.json?title=${title}&author=${author}`);
  };
  return <AddBookSearch fetchBooks={fetchBooks} {...props} />;
}

export default AddBookSearchContainer;
