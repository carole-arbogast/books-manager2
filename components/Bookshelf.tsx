import React from "react";
import styled from "styled-components";
import BookCard from "./BookCard";
import useSWR, { mutate } from "swr";
import Axios, { AxiosResponse } from "axios";
import { AuthContext } from "./AuthProvider";
import { IconButton } from "./layouts";
import { APIResBook } from "../index";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface APIBookshelf {
  id: number;
  name: string;
}

interface Props {
  bookshelf: APIBookshelf;
  onDeleteBookshelf: (id: number) => Promise<AxiosResponse<any>>;
}

const fetchBooks = async (id: number): Promise<AxiosResponse<APIResBook[]>> =>
  await Axios.get(`http://localhost:8000/books?bookshelf=${id}`, {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });

export function Bookshelf({ bookshelf, onDeleteBookshelf }: Props) {
  const { user } = React.useContext(AuthContext);

  const { data: books } = useSWR(bookshelf ? `/books?bookshelf=${bookshelf.id}` : null, () =>
    fetchBooks(bookshelf.id)
  );

  return (
    <div>
      <h2>
        {bookshelf.name}
        <IconButton
          onClick={() => {
            onDeleteBookshelf(bookshelf.id);
            mutate(`/books?bookshelf=${bookshelf.id}`);
            mutate(`/bookshelves?user=${user.id}`);
          }}
        >
          <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
        </IconButton>
      </h2>
      <Group>
        {books?.data.length === 0 && <div>This bookshelf is empty.</div>}
        {books?.data?.map((book) => (
          <BookCard key={book.id} book={book}></BookCard>
        ))}
      </Group>
    </div>
  );
}

const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

export default Bookshelf;
