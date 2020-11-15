import React from "react";
import styled from "styled-components";
import axios from "axios";
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

function AddBookContainer(props: Omit<Props, "fetchBooks">) {
  const fetchBooks = async (query: { title: string; author: string }) => {
    const title = query.title.split(" ").join("+");
    const author = query.author.split(" ").join("+");
    return await axios.get(`http://openlibrary.org/search.json?title=${title}&author=${author}`);
  };
  return <AddBook fetchBooks={fetchBooks} {...props} />;
}

export default AddBookContainer;
