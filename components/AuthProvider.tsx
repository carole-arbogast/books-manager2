import React from "react";
import Axios from "axios";
import useSWR from "swr";

export const AuthContext = React.createContext({
  user: null,
  isLoggedIn: false,
  setIsLoggedIn: null,
});

interface Props {
  children: React.ReactNode;
}

const fetchUser = async () =>
  Axios.get("http://localhost:8000/current_user/", {
    headers: {
      Authorization: `JWT ${typeof window !== "undefined" && localStorage.getItem("token")}`,
    },
  });

function AuthProvider({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    typeof window !== "undefined" && Boolean(localStorage.getItem("token"))
  );

  const { data: user, error } = useSWR(isLoggedIn ? "/books_server/current_user" : null, fetchUser);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
