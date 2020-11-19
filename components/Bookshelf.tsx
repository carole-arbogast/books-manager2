import React from "react";
import styled from "styled-components";
import Card from "./Card";
import useSWR, { mutate } from "swr";
import Axios from "axios";
import { AuthContext } from "../components/AuthProvider";

interface APIBookshelf {
  id: number;
  name: string;
}

interface Props {
  bookshelf: APIBookshelf;
  onDeleteBookshelf: (id: number) => Promise<object>;
}

const fetchBooks = async (id: number) =>
  await Axios.get(`http://localhost:8000/books?bookshelf=${id}`, {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });

export function Bookshelf({ bookshelf, onDeleteBookshelf }: Props) {
  const { user } = React.useContext(AuthContext);

  const { data: books, error } = useSWR(bookshelf ? `/books?bookshelf=${bookshelf.id}` : null, () =>
    fetchBooks(bookshelf.id)
  );

  return (
    <div>
      <h2>
        {bookshelf.name}
        <button
          onClick={() => {
            onDeleteBookshelf(bookshelf.id);
            mutate(`/books?bookshelf=${bookshelf.id}`);
            mutate(`/bookshelves?user=${user.id}`);
          }}
        >
          DELETE
        </button>
      </h2>
      {books?.data?.map((book) => (
        <Group key={book.id}>
          <Card
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            cover={`http://covers.openlibrary.org/b/id/${book.cover}-S.jpg`}
            rating={book.rating}
            readingStatus={book.reading_status}
          ></Card>
        </Group>
      ))}
    </div>
  );
}

const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default Bookshelf;
