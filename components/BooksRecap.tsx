import React from "react";
import styled from "styled-components";
import Card from "./Card";
import BoxModal from "./BoxModal";
import AddBook from "./AddBook";
import Axios from "axios";
import useSWR from "swr";

interface APIBooksResponse {
  data: {
    _id: number;
    title: string;
    author: string;
  }[];
}
interface Props {
  fetchBooks: () => Promise<APIBooksResponse>;
}

export function BooksRecap({ fetchBooks }: Props) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const { data, error } = useSWR("/books", fetchBooks);

  const books = data?.data;

  const loading = !data && !error;

  return (
    <Container>
      {modalOpen && (
        <BoxModal open={modalOpen} onClose={() => setModalOpen(false)}>
          <AddBook />
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
            <Group>
              {books &&
                books.map((book) => (
                  <Card title={book.title} author={book.author} rating={10}></Card>
                ))}
            </Group>
          )}

          {/* <Group>
            <Card title="Harry Potter and the Deathly Hallows" author="J.K.Rowling" rating={10} />
            <Card title="Harry Potter and the Deathly Hallows" author="J.K.Rowling" rating={10} />
            <Card title="Harry Potter and the Deathly Hallows" author="J.K.Rowling" rating={10} />
          </Group>
          <h2>Bookshelf A</h2>
          <Group>
            <Card title="Harry Potter and the Deathly Hallows" author="J.K.Rowling" rating={10} />
            <Card title="Harry Potter and the Deathly Hallows" author="J.K.Rowling" rating={10} />
          </Group>
          <h2>Bookshelf B</h2>
          <Group>
            <Card title="Harry Potter and the Deathly Hallows" author="J.K.Rowling" rating={10} />
          </Group>
          <h2>Bookshelf B</h2>
          <Group>
            <div>No books here yet</div>
          </Group> */}
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

function BooksRecapContainer(props: Omit<Props, "fetchBooks">) {
  const fetchBooks = async () => await Axios.get("http://localhost:8000/books");
  return <BooksRecap fetchBooks={fetchBooks} {...props} />;
}

export default BooksRecapContainer;
