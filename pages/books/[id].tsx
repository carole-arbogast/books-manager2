import React from "react";
import Axios, { AxiosResponse } from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import styled from "styled-components";
import BoxModal from "../../components/BoxModal";
import { Field, Form, Formik } from "formik";
import { Button, FieldGroup, FlexWrapper, IconButton } from "../../components/layouts";
import { APIQueryBook, APIResBook, APIResBookshelf } from "../../index";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  const [openModal, setOpenModal] = React.useState<"" | "rating" | "bookshelf">("");

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
      setOpenModal("");
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeRating = async (values: APIQueryBook) => {
    try {
      await updateBook(router.query.id as string, { rating: values.rating });
      setOpenModal("");
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
      {book && bookshelves && (
        <Container>
          {openModal && (
            <BoxModal open={true} onClose={() => setOpenModal("")}>
              {openModal === "rating" && (
                <Formik initialValues={{ rating: book.rating }} onSubmit={handleChangeRating}>
                  {() => (
                    <Form>
                      <FieldGroup>
                        <label htmlFor="rating">Your Rating</label>
                        <Field type="number" name="rating" min={1} max={10}></Field>
                      </FieldGroup>

                      <FlexWrapper justify="flex-end">
                        <Button type="submit">OK</Button>
                      </FlexWrapper>
                    </Form>
                  )}
                </Formik>
              )}
              {openModal === "bookshelf" && (
                <Formik
                  initialValues={{ bookshelf: book.bookshelf.id }}
                  onSubmit={handleChangeBookshelf}
                >
                  {() => (
                    <Form>
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
                        <Button type="submit">OK</Button>
                      </FlexWrapper>
                    </Form>
                  )}
                </Formik>
              )}
            </BoxModal>
          )}
          <h1>{book.title}</h1>
          <FlexWrapper justify="space-around">
            <div>
              <h2>{book.author}</h2>
              <Content>
                <Cover
                  src={`http://covers.openlibrary.org/b/id/${book.cover}-M.jpg`}
                  alt="cover"
                ></Cover>
              </Content>
            </div>

            <div>
              Bookshelf: <em>{book.bookshelf.name} </em>
              <IconButton onClick={() => setOpenModal("bookshelf")}>
                <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
              </IconButton>
              <p>
                Status:{" "}
                <>
                  {reading_statusList.map((status) => (
                    <Button
                      selected={book.reading_status === status}
                      margin="0 0.25rem"
                      key={status}
                      onClick={() => handleChangereading_status(status)}
                    >
                      {status}
                    </Button>
                    // <StatusButton
                    //   key={status}
                    //   onClick={() => handleChangereading_status(status)}
                    //   selected={book.reading_status === status}
                    // >
                    //   {status}
                    // </StatusButton>
                  ))}
                </>
              </p>
              <p>
                Your rating: {book.rating}/10{" "}
                <IconButton onClick={() => setOpenModal("rating")}>
                  <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                </IconButton>
              </p>
              <Button onClick={() => handleDeleteBook(book.id)}>DELETE</Button>
            </div>
          </FlexWrapper>
        </Container>
      )}
    </>
  );
}

const StatusButton = styled.button<{ selected?: boolean }>`
  background: ${(props) => (props.selected ? "lightblue" : "transparent")};
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 90%;
  margin: auto;
`;

const Cover = styled.img`
  width: 12em;
`;

const Content = styled.div`
  margin: 1rem;
`;

export default Book;
