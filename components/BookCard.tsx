import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { APIResBook } from "../index";

interface Props {
  book: APIResBook;
}

export function BookCard({ book }: Props) {
  return (
    <CardWrapper>
      <Info>
        <div>
          <Link href={`/books/${encodeURIComponent(book.id)}`}>{book.title}</Link>
        </div>
        <div>Author: {book.author}</div>
        {book.rating && <div>Your rating: {book.rating}/10</div>}
      </Info>
      <Cover
        src={
          `http://covers.openlibrary.org/b/id/${book.cover}-S.jpg` ||
          // FIXME find placeholder
          "https://images-na.ssl-images-amazon.com/images/I/914CT7iyyvL.jpg"
        }
        placeholder="book-cover"
      ></Cover>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  margin: 1rem;
  padding: 0.5rem;
  display: flex;
  border: 1px solid grey;
  width: 15em;
`;

const Info = styled.div``;

const Cover = styled.img`
  height: 5rem;
`;

export default BookCard;
