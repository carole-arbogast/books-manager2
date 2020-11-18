import React from "react";
import styled from "styled-components";
import AddBookSearch from "./AddBooksSearch";

interface Props {
  onClose: () => void;
}

export function AddBook({ onClose }: Props) {
  return (
    <Wrapper>
      <h2>Add a Book to your collection</h2>
      <p>Search for a book</p>
      <AddBookSearch onClose={onClose} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 25em;
`;

export default AddBook;
