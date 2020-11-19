import React from "react";
import styled from "styled-components";
import Card from "./Card";
import BoxModal from "./BoxModal";
import AddBook from "./AddBook";
import Axios from "axios";
import useSWR, { mutate } from "swr";
import AddBookshelf from "./AddBookshelf";
import { AuthContext } from "../components/AuthProvider";
import Bookshelf from "./Bookshelf";

interface APIBooksResponse {
  data: {
    id: number;
    title: string;
    author: string;
    cover: number;
    reading_status: string;
    bookshelves: string[];
    rating?: number;
  }[];
}

const fetchBookshelves = async (user: number) =>
  await Axios.get(`http://localhost:8000/bookshelves?user=${user}`, {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });

const deleteBookshelf = async (id: number) =>
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
          <Button onClick={() => setCurrentModal("addBook")}>Add book</Button>
        )}
        <Button onClick={() => setCurrentModal("addBookshelf")}>Add Bookshelf</Button>
        <div>
          {loading ? (
            <div>LOADING </div>
          ) : (
            <>
              {bookshelves.data.length === 0 && <div>You have no books yet.</div>}
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

const Button = styled.button`
  align-self: flex-end;
`;

const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default BooksRecap;
