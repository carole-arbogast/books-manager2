import React from "react";
import Axios, { AxiosResponse } from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import styled from "styled-components";
import BoxModal from "../../components/BoxModal";
import { Field, Form, Formik } from "formik";
import { Button } from "../../components/layouts";
import { APIQueryBook, APIResBook, APIResBookshelf } from "../../index";

const fetchBookShelves = async (): Promise<AxiosResponse<APIResBookshelf[]>> => {
  return await Axios.get("http://localhost:8000/bookshelves", {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });
};
const fetchBook = async (path: string): Promise<AxiosResponse<APIResBook>> =>
  await Axios.get(`http://localhost:8000${path}`, {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });

const updateBook = async (id: string, query: APIQueryBook): Promise<AxiosResponse<any>> =>
  await Axios.patch(`http://localhost:8000/books/${id}/`, query, {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });

const deleteBook = async (id: number): Promise<AxiosResponse<any>> =>
  await Axios.delete(`http://localhost:8000/books/${id}/`, {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });

export function Book() {
  const router = useRouter();

  const { data: res, mutate } = useSWR(
    router.query.id ? `/books/${router.query.id}` : null,
    fetchBook
  );

  const { data: bookshelves } = useSWR("/bookshelves", fetchBookShelves);

  const [modalOpen, setModalOpen] = React.useState(false);

  const book = res?.data;

  const reading_statusList = ["TO_READ", "READING", "READ"];

  const handleChangereading_status = async (status) => {
    await updateBook(router.query.id as string, { reading_status: status });
    mutate();
  };

  const handleDeleteBook = async (id: number) => {
    await deleteBook(id);
    router.push("/");
  };

  const handleChangeBookshelf = async (values: APIQueryBook) => {
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
                    <Button type="submit">OK</Button>
                  </Form>
                )}
              </Formik>
            </BoxModal>
          )}
          <h1>{book.title}</h1>
          <h2>{book.author}</h2>
          <img src={`http://covers.openlibrary.org/b/id/${book.cover}-M.jpg`} alt="cover"></img>
          <em>
            {book.bookshelf.name} <Button onClick={() => setModalOpen(true)}>Move</Button>
          </em>
          <p>
            Status:{" "}
            <>
              {reading_statusList.map((status) => (
                <StatusButton
                  key={status}
                  onClick={() => handleChangereading_status(status)}
                  selected={book.reading_status === status}
                >
                  {status}
                </StatusButton>
              ))}
            </>
          </p>
          <p>Your rating: {book.rating}/10</p>
          <Button onClick={() => handleDeleteBook(book.id)}>DELETE</Button>
        </>
      )}
    </>
  );
}

const StatusButton = styled.button<{ selected?: boolean }>`
  background: ${(props) => (props.selected ? "lightblue" : "transparent")};
`;

export default Book;
