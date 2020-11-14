import React from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { mutate } from "swr";

interface OLAPISearchResponse {
  data: {
    num_found: number;
    docs: OLAPIBook[];
  };
}

interface OLAPIBook {
  title: string;
  author_name: string[];
  key: string;
  cover_i: number;
  first_publish_year: number;
}
interface APIBooksQuery {
  title: string;
  author: string;
  cover: number;
  description: string;
}
interface Props {
  fetchBooks: (query: { title: string; author: string }) => Promise<OLAPISearchResponse>;
  addBook: (query: APIBooksQuery) => Promise<object>;
}

export function AddBookSearch({ fetchBooks, addBook }: Props) {
  const [searchResult, setSearchResult] = React.useState<OLAPIBook[]>([]);
  const [selectedBook, setSelectedBook] = React.useState<OLAPIBook>();
  const [loading, setLoading] = React.useState(false);

  const initialValues = { title: "", author: "" };

  const handleSubmitSearch = async (values) => {
    setLoading(true);
    const res = await fetchBooks({ title: values.title, author: values.author });
    const books = res.data.docs.slice(0, 10);
    setSearchResult(books);
    setLoading(false);
  };

  const handleAddBook = async () => {
    if (selectedBook) {
      const addedBook = await addBook({
        title: selectedBook.title,
        author: selectedBook.author_name[0],
        cover: selectedBook.cover_i,
        description: "description",
      });
      mutate("/books");
      return addedBook;
    }
  };

  return loading ? (
    <div>LOADING</div>
  ) : searchResult.length > 0 ? (
    <>
      <SearchResults>
        {searchResult.map((book) => (
          <SearchResultItem
            disabled={Boolean(selectedBook)}
            selected={selectedBook && selectedBook.title === book.title}
            key={book.title}
            onClick={() => setSelectedBook(book)}
          >
            <img src={`http://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`} alt="" />
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
            <label htmlFor="title">Title</label>
            <Field type="text" name="title" />
          </FieldGroup>
          <FieldGroup>
            <label htmlFor="author">Author</label>
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
