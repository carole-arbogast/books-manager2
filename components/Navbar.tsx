import React from "react";
import styled from "styled-components";
import { AuthContext } from "../components/AuthProvider";
import { useRouter } from "next/router";
import { Button } from "./layouts";

export function Navbar() {
  const router = useRouter();

  const { isLoggedIn, setIsLoggedIn } = React.useContext(AuthContext);

  const handleLogout = () => {
    typeof window !== "undefined" && localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };
  return (
    <NavbarWrapper>
      <NavbarContent>
        <div>
          <a href="/">BOOKS MANAGER</a>
        </div>
        {isLoggedIn && (
          <div>
            <Button onClick={handleLogout}>Log out</Button>
          </div>
        )}
      </NavbarContent>
    </NavbarWrapper>
  );
}

const NavbarWrapper = styled.div`
  width: 100%;
  height: 4rem;
  background: lightgray;
`;

const NavbarContent = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Navbar;
