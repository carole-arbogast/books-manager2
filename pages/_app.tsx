import { createGlobalStyle } from "styled-components";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle /> <Component {...pageProps} />
    </>
  );
}

const GlobalStyle = createGlobalStyle`

  html{
  margin: 0
  }
  body {
    padding: 0;
    margin: 0;
    font-family: "Raleway";
    padding-bottom: 1.5rem;
  }
`;

export default MyApp;
