import React from "react";
import Axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import styled from "styled-components";
import BoxModal from "../../components/BoxModal";
import { Field, Form, Formik } from "formik";

const fetchBookShelves = async () => {
  return await Axios.get("http://localhost:8000/bookshelves", {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });
};
const fetchBook = async (path: string) =>
  await Axios.get(`http://localhost:8000${path}`, {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });

const updateBook = async (id: string, query: Record<string, any>) =>
  await Axios.patch(`http://localhost:8000/books/${id}/`, query, {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });

const deleteBook = async (id: string) =>
  await Axios.delete(`http://localhost:8000/books/${id}/`, {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });

export function Book() {
  const router = useRouter();

  const { data: res, error, mutate } = useSWR(
    router.query.id ? `/books/${router.query.id}` : null,
    fetchBook
  );

  const { data: bookshelves, error: bookshelvesError } = useSWR("/bookshelves", fetchBookShelves);

  const [modalOpen, setModalOpen] = React.useState(false);

  const book = res?.data;

  const readingStatusList = ["TO_READ", "READING", "READ"];

  const handleChangeReadingStatus = async (status) => {
    await updateBook(router.query.id as string, { reading_status: status });
    mutate();
  };

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id);
    router.push("/");
  };

  const handleChangeBookshelf = async (values) => {
    try {
      await updateBook(router.query.id as string, { bookshelf: values.bookshelf });
      setModalOpen(false);
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
      {book && bookshelves && (
        <>
          {modalOpen && (
            <BoxModal open={modalOpen} onClose={() => setModalOpen(false)}>
              <Formik
                initialValues={{ bookshelf: book.bookshelf.id }}
                onSubmit={handleChangeBookshelf}
              >
                {() => (
                  <Form>
                    <Field as="select" name="bookshelf">
                      {bookshelves.data.map((bookshelf) => (
                        <option value={bookshelf.id} key={bookshelf.id}>
                          {bookshelf.name}
                        </option>
                      ))}
                    </Field>
                    <button type="submit">OK</button>
                  </Form>
                )}
              </Formik>
            </BoxModal>
          )}
          <h1>{book.title}</h1>
          <h2>{book.author}</h2>
          <img src={`http://covers.openlibrary.org/b/id/${book.cover}-M.jpg`} alt="cover"></img>
          <em>
            {book.bookshelf.name} <button onClick={() => setModalOpen(true)}>Move</button>
          </em>
          <p>{book.description}</p>
          <p>
            Status:{" "}
            <>
              {readingStatusList.map((status) => (
                <StatusButton
                  key={status}
                  onClick={() => handleChangeReadingStatus(status)}
                  selected={book.reading_status === status}
                >
                  {status}
                </StatusButton>
              ))}
            </>
          </p>
          <p>Your rating: {book.rating}/10</p>
          <button onClick={() => handleDeleteBook(book.id)}>DELETE</button>
        </>
      )}
    </>
  );
}

const StatusButton = styled.button<{ selected?: boolean }>`
  background: ${(props) => (props.selected ? "lightblue" : "transparent")};
`;

export default Book;
