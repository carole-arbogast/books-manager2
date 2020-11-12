import React from "react";
import Head from "next/head";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import BooksRecap from "../components/BooksRecap";

export default function Home() {
  return (
    <div>
      <Navbar />
      <BooksRecap />
    </div>
  );
}
