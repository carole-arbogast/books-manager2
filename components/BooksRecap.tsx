import React from "react";
import styled from "styled-components";
import Card from "./Card";
import BoxModal from "./BoxModal";
import AddBook from "./AddBook";
import Axios from "axios";
import useSWR from "swr";

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

interface Props {
  fetchBooks: () => Promise<APIBooksResponse>;
  fetchBookshelves: () => Promise<object>;
}

export function BooksRecap({ fetchBooks, fetchBookshelves }: Props) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const { data, error } = useSWR("/books", fetchBooks);

  const books = data?.data;

  const loading = !data && !error;

  return (
    <Container>
      {modalOpen && (
        <BoxModal open={modalOpen} onClose={() => setModalOpen(false)}>
          <AddBook onClose={() => setModalOpen(false)} />
        </BoxModal>
      )}
      <Content>
        <Title>Your books</Title>
        <Button onClick={() => setModalOpen(true)}>Add book</Button>
        <div>
          <h2>Recent</h2>
          {loading ? (
            <div>LOADING </div>
          ) : (
            <>
              <Group>
                {books &&
                  books.map((book) => (
                    <Card
                      key={book.id}
                      title={book.title}
                      author={book.author}
                      cover={`http://covers.openlibrary.org/b/id/${book.cover}-S.jpg`}
                      rating={book.rating}
                      readingStatus={book.reading_status}
                    ></Card>
                  ))}
              </Group>
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

function BooksRecapContainer(props: Omit<Props, "fetchBooks" | "fetchBookCover">) {
  const fetchBooks = async () => await Axios.get("http://localhost:8000/books");
  const fetchBookshelves = async () => await Axios.get("http://localhost:8000/bookshelves");
  return <BooksRecap fetchBooks={fetchBooks} fetchBookshelves={fetchBookshelves} {...props} />;
}

export default BooksRecapContainer;
