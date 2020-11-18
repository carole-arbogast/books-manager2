import React from "react";
import styled from "styled-components";
import Card from "./Card";
import BoxModal from "./BoxModal";
import AddBook from "./AddBook";
import Axios from "axios";
import useSWR, { mutate } from "swr";
import AddBookshelf from "./AddBookshelf";

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

const populateBookshelves = async (bookshelves: { id: number; name: string }[]) => {
  try {
    const res = await Promise.all(
      bookshelves.map(async (bookshelf) => {
        const books = await Axios.get(`http://localhost:8000/books?bookshelf=${bookshelf.id}`);
        return { books: books.data, name: bookshelf.name, id: bookshelf.id };
      })
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};
const fetchBookshelves = async () => await Axios.get("http://localhost:8000/bookshelves");
const deleteBookshelf = async (id: number) =>
  await Axios.delete(`http://localhost:8000/bookshelves/${id}/`);

export function BooksRecap() {
  const [currentModal, setCurrentModal] = React.useState<"" | "addBook" | "addBookshelf">("");
  const { data: bookshelves, error: bookshelvesError } = useSWR("/bookshelves", fetchBookshelves);
  const bookshelvesList = bookshelves?.data.map((bookshelf) => ({
    id: bookshelf.id,
    name: bookshelf.name,
  }));

  const { data: populatedBookshelves, error: booksError } = useSWR(
    bookshelvesList ? "/books" : null,
    () => populateBookshelves(bookshelvesList)
  );

  const loading = !populatedBookshelves && !booksError && !bookshelvesError;

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
        <Button onClick={() => setCurrentModal("addBook")}>Add book</Button>
        <Button onClick={() => setCurrentModal("addBookshelf")}>Add Bookshelf</Button>
        <div>
          <h2>Recent</h2>
          {loading ? (
            <div>LOADING </div>
          ) : (
            <>
              {populatedBookshelves.map((bookshelf) => (
                <div key={bookshelf.id}>
                  <h2>
                    {bookshelf.name}{" "}
                    <button
                      onClick={() => {
                        deleteBookshelf(bookshelf.id);
                        mutate("/bookshelves");
                      }}
                    >
                      DELETE
                    </button>
                  </h2>
                  {bookshelf.books.map((book) => (
                    <Group key={book.id}>
                      <Card
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        author={book.author}
                        cover={`http://covers.openlibrary.org/b/id/${book.cover}-S.jpg`}
                        rating={book.rating}
                        readingStatus={book.reading_status}
                      ></Card>{" "}
                    </Group>
                  ))}
                </div>
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
