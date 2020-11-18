import React from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import useSWR, { mutate } from "swr";

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
  reading_status: string;
  rating?: number;
  bookshelf: string[];
}

interface APIBookshelvesResponse {
  data: {
    name: string;
    id: string;
  }[];
}
interface Props {
  onClose: () => void;
}

const fetchBooks = async (query: { title: string; author: string }) => {
  const title = query.title.split(" ").join("+");
  const author = query.author.split(" ").join("+");
  return await axios.get(`http://openlibrary.org/search.json?title=${title}&author=${author}`);
};

const fetchBookShelves = async () => {
  return await axios.get("http://localhost:8000/bookshelves");
};

const addBook = async (query: APIBooksQuery) => {
  return await axios.post("http://localhost:8000/books/", query);
};

export function AddBookSearch({ onClose }: Props) {
  const [searchResult, setSearchResult] = React.useState<OLAPIBook[]>([]);
  const [selectedBook, setSelectedBook] = React.useState<OLAPIBook>();
  const [currentStep, setCurrentStep] = React.useState<
    "loading" | "form" | "searchResults" | "final"
  >("form");

  const { data: bookshelves, error } = useSWR("/bookshelves", fetchBookShelves);

  const initialValues = { title: "", author: "" };

  const initialValuesRating = bookshelves && {
    readingStatus: "TO_READ",
    rating: 0,
    bookshelf: bookshelves.data[0].id,
  };

  const handleSubmitSearch = async (values) => {
    setCurrentStep("loading");
    const res = await fetchBooks({ title: values.title, author: values.author });
    const books = res.data.docs.slice(0, 10);
    setSearchResult(books);
    setCurrentStep("searchResults");
  };

  const handleAddBook = async (values) => {
    if (selectedBook) {
      const addedBook = await addBook({
        title: selectedBook.title,
        author: selectedBook.author_name[0],
        cover: selectedBook.cover_i,
        description: "description",
        reading_status: values.readingStatus,
        rating: values.rating,
        bookshelf: values.bookshelf,
      });
      mutate("/books");
      onClose();
      return addedBook;
    }
  };

  const handleSubmitAddBook = async (values) => {
    await handleAddBook(values);
  };

  return {
    loading: <div>LOADIG</div>,
    form: (
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
    ),
    searchResults:
      searchResult.length > 0 ? (
        <>
          <SearchResults>
            {searchResult.map((book) => (
              <SearchResultItem
                disabled={Boolean(selectedBook)}
                selected={selectedBook && selectedBook.key === book.key}
                key={book.key}
                onClick={() => setSelectedBook(book)}
              >
                <img src={`http://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`} alt="" />
                {book.title}
                <em>{book.author_name?.[0]}</em>
              </SearchResultItem>
            ))}
          </SearchResults>
          <button onClick={() => setCurrentStep("final")}>NEXT</button>
        </>
      ) : (
        <div>
          No results <button onClick={() => setCurrentStep("form")}>Back</button>
        </div>
      ),
    final: (
      <Formik initialValues={initialValuesRating} onSubmit={handleSubmitAddBook}>
        {({ values }) => (
          <Form>
            <FieldGroup>
              <label htmlFor="readingStatus">Status</label>
              <Field as="select" name="readingStatus">
                <option value="READ">Read</option>
                <option value="READING">Reading</option>
                <option value="TO_READ">To Read</option>
              </Field>
            </FieldGroup>
            {values.readingStatus === "READ" && (
              <FieldGroup>
                <label htmlFor="rating">Your rating</label>
                <Field type="number" name="rating" />
              </FieldGroup>
            )}
            <label htmlFor="rating">Your rating</label>
            <FieldGroup>
              <Field as="select" name="bookshelf">
                {bookshelves.data.map((bookshelf) => (
                  <option value={bookshelf.name} key={bookshelf.id}>
                    {bookshelf.name}
                  </option>
                ))}
              </Field>
            </FieldGroup>

            <button type="submit">ADD</button>
          </Form>
        )}
      </Formik>
    ),
  }[currentStep];
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

export default AddBookSearch;
