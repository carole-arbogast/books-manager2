import { createGlobalStyle } from "styled-components";
import AuthProvider from "../components/AuthProvider";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <GlobalStyle /> <Component {...pageProps} />
    </AuthProvider>
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
