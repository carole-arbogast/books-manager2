import React from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";
import axios, { AxiosResponse } from "axios";
import useSWR, { mutate } from "swr";
import { AuthContext } from "../components/AuthProvider";
import { Button, FlexWrapper } from "./layouts";
import {
  OPLIBBook,
  OPLIBSearchQuery,
  OPLIBSearchResponse,
  APIResBookshelf,
  APIResBook,
  APIQueryBook,
} from "../index";

interface Props {
  onClose: () => void;
}

const fetchBooks = async (query: OPLIBSearchQuery): Promise<AxiosResponse<OPLIBSearchResponse>> => {
  const title = query.title.split(" ").join("+");
  const author = query.author.split(" ").join("+");
  return await axios.get(`http://openlibrary.org/search.json?title=${title}&author=${author}`);
};

const fetchBookShelves = async (user: number): Promise<AxiosResponse<APIResBookshelf[]>> => {
  return await axios.get(`http://localhost:8000/bookshelves?user=${user}`, {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });
};

const addBook = async (query: APIQueryBook): Promise<AxiosResponse<APIResBook>> => {
  return await axios.post("http://localhost:8000/books/", query, {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });
};

export function AddBookSearch({ onClose }: Props) {
  const { user } = React.useContext(AuthContext);

  const [searchResult, setSearchResult] = React.useState<OPLIBBook[]>([]);
  const [selectedBook, setSelectedBook] = React.useState<OPLIBBook>();
  const [currentStep, setCurrentStep] = React.useState<
    "loading" | "form" | "searchResults" | "final"
  >("form");

  const { data: bookshelves } = useSWR("/bookshelves", () => fetchBookShelves(user.id));

  const initialValues = { title: "", author: "" };

  const initialValuesRating = bookshelves && {
    reading_status: "TO_READ",
    rating: 0,
    bookshelf: bookshelves.data[0].id,
  };

  const handleSubmitSearch = async (values: OPLIBSearchQuery) => {
    setCurrentStep("loading");
    const res = await fetchBooks({ title: values.title, author: values.author });
    const books = res.data.docs.slice(0, 10);
    setSearchResult(books);
    setCurrentStep("searchResults");
  };

  const handleAddBook = async (values: APIQueryBook) => {
    if (selectedBook) {
      const addedBook = await addBook({
        title: selectedBook.title,
        author: selectedBook.author_name[0],
        cover: selectedBook.cover_i,
        reading_status: values.reading_status,
        rating: values.rating,
        bookshelf: values.bookshelf,
      });

      mutate(`/books?bookshelf=${values.bookshelf}`);
      onClose();
      return addedBook;
    }
  };

  return {
    loading: <div>LOADING</div>,
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
            <FlexWrapper justify="flex-end">
              <Button type="submit">Search</Button>
            </FlexWrapper>
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
          <FlexWrapper justify="flex-end">
            <Button onClick={() => setCurrentStep("final")}>NEXT</Button>
          </FlexWrapper>
        </>
      ) : (
        <div>
          No results <Button onClick={() => setCurrentStep("form")}>Back</Button>
        </div>
      ),
    final: bookshelves && (
      <Formik initialValues={initialValuesRating} onSubmit={handleAddBook}>
        {({ values }) => (
          <Form>
            <FieldGroup>
              <label htmlFor="reading_status">Status</label>
              <Field as="select" name="reading_status">
                <option value="READ">Read</option>
                <option value="READING">Reading</option>
                <option value="TO_READ">To Read</option>
              </Field>
            </FieldGroup>
            {values.reading_status === "READ" && (
              <FieldGroup>
                <label htmlFor="rating">Your rating</label>
                <Field type="number" name="rating" />
              </FieldGroup>
            )}

            <FieldGroup>
              <label htmlFor="bookshelf">Bookshelf</label>
              <Field as="select" name="bookshelf">
                {bookshelves.data.map((bookshelf) => (
                  <option value={bookshelf.id} key={bookshelf.id}>
                    {bookshelf.name}
                  </option>
                ))}
              </Field>
            </FieldGroup>

            <FlexWrapper justify="flex-end">
              <Button type="submit">ADD</Button>
            </FlexWrapper>
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
