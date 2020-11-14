import React from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { BooksRecap } from "./BooksRecap";
import { mutate } from "swr";

interface OLAPIBookResponse {
  data: {
    num_found: number;
    docs: {
      title: string;
      author: string[];
      key: string;
      cover_i: number;
      first_publish_year: number;
    }[];
  };
}
interface APIBooksQuery {
  title: string;
  author: string;
}
interface Props {
  fetchBooks: (query: { title: string; author: string }) => Promise<OLAPIBookResponse>;
  addBook: (query: APIBooksQuery) => Promise<object>;
}

export function AddBookSearch({ fetchBooks, addBook }: Props) {
  const [searchResult, setSearchResult] = React.useState([]);
  const [selectedBook, setSelectedBook] = React.useState();

  const initialValues = { title: "", author: "" };

  const handleSubmitSearch = async (values) => {
    const res = await fetchBooks({ title: values.title, author: values.author });
    const books = res.data.docs.slice(0, 10);
    setSearchResult(books);
  };

  const handleAddBook = async () => {
    if (selectedBook) {
      const addedBook = await addBook({
        title: selectedBook.title,
        author: selectedBook.author_name[0],
      });
      mutate("/books");
      return addedBook;
    }
  };

  return searchResult.length > 0 ? (
    <>
      <SearchResults>
        {searchResult.map((book) => (
          <SearchResultItem
            disabled={Boolean(selectedBook)}
            selected={selectedBook && selectedBook.title === book.title}
            key={book.title}
            onClick={() => setSelectedBook(book)}
          >
            {book.title}
          </SearchResultItem>
        ))}
      </SearchResults>
      <button onClick={handleAddBook}>ADD</button>
    </>
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

function AddBookSearchContainer(props: Omit<Props, "fetchBooks" | "addBook">) {
  const fetchBooks = async (query: { title: string; author: string }) => {
    const title = query.title.split(" ").join("+");
    const author = query.author.split(" ").join("+");
    return await axios.get(`http://openlibrary.org/search.json?title=${title}&author=${author}`);
  };

  const addBook = async (query: APIBooksQuery) => {
    return await axios.post("http://localhost:8000/books/", query);
  };
  return <AddBookSearch fetchBooks={fetchBooks} addBook={addBook} {...props} />;
}

export default AddBookSearchContainer;
