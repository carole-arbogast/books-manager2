import React from "react";
import styled from "styled-components";
import { AuthContext } from "../components/AuthProvider";
import { useRouter } from "next/router";
import { Button } from "./layouts";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        <a href="/">Home</a>
        <div>
          <Title href="/">
            BOOKS MANAGER <Icon icon={faBook} />
          </Title>
        </div>
        {isLoggedIn && (
          <Logout>
            <Button onClick={handleLogout}>Log out</Button>
          </Logout>
        )}
      </NavbarContent>
    </NavbarWrapper>
  );
}

const NavbarWrapper = styled.div`
  width: 100%;
  height: 4rem;
  background: lightblue;
  display: flex;
  justify-content: center;
`;

const NavbarContent = styled.div`
  height: 100%;
  width: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logout = styled.div`
  /* margin-left: auto; */
`;
const Title = styled.a`
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 700;
  color: black;

  &:hover {
    color: #252525;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: #464444;
`;

export default Navbar;
