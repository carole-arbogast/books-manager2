import React from "react";
import styled from "styled-components";

interface Props {
  title: string;
  author: string;
  rating: number;
  cover?: string;
}

export function Card({ title, author, rating, cover }: Props) {
  return (
    <CardWrapper>
      <Info>
        <div>{title}</div>
        <div>Author: {author}</div>
        <div>Your rating: {rating}/10</div>
      </Info>
      <Cover
        src={cover || "https://images-na.ssl-images-amazon.com/images/I/914CT7iyyvL.jpg"}
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

export default Card;
