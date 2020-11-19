import React from "react";
import styled from "styled-components";
import BoxModal from "./BoxModal";
import AddBook from "./AddBook";
import Axios, { AxiosResponse } from "axios";
import useSWR from "swr";
import AddBookshelf from "./AddBookshelf";
import { AuthContext } from "../components/AuthProvider";
import Bookshelf from "./Bookshelf";
import { Button } from "./layouts";
import { APIResBookshelf } from "..";

const fetchBookshelves = async (user: number): Promise<AxiosResponse<APIResBookshelf[]>> =>
  await Axios.get(`http://localhost:8000/bookshelves?user=${user}`, {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });

const deleteBookshelf = async (id: number): Promise<AxiosResponse<any>> =>
  await Axios.delete(`http://localhost:8000/bookshelves/${id}/`, {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });

export function BooksRecap() {
  const { user } = React.useContext(AuthContext);

  const [currentModal, setCurrentModal] = React.useState<"" | "addBook" | "addBookshelf">("");
  const { data: bookshelves, error: bookshelvesError } = useSWR(
    user ? `/bookshelves?user=${user.id}` : null,
    () => fetchBookshelves(user.id)
  );

  const loading = !bookshelves && !bookshelvesError;

  return (
    <Container>
      {currentModal && (
        <BoxModal open={Boolean(currentModal)} onClose={() => setCurrentModal("")}>
          {currentModal === "addBook" && <AddBook onClose={() => setCurrentModal("")} />}
          {currentModal === "addBookshelf" && <AddBookshelf onClose={() => setCurrentModal("")} />}
        </BoxModal>
      )}
      <Content>
        <Title>Your books</Title>
        {bookshelves?.data.length > 0 && (
          <Button alignSelf="flex-end" onClick={() => setCurrentModal("addBook")}>
            Add book
          </Button>
        )}
        <Button alignSelf="flex-end" onClick={() => setCurrentModal("addBookshelf")}>
          Add Bookshelf
        </Button>
        <div>
          {loading ? (
            <div>LOADING </div>
          ) : (
            <>
              {bookshelves.data.length === 0 && <InfoText>You have no books yet.</InfoText>}
              {bookshelves.data.map((bookshelf) => (
                <Bookshelf
                  bookshelf={bookshelf}
                  onDeleteBookshelf={deleteBookshelf}
                  key={bookshelf.id}
                ></Bookshelf>
              ))}
            </>
          )}
        </div>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  text-align: center;
`;

const InfoText = styled.div`
  margin: 1rem;
`;

export default BooksRecap;
