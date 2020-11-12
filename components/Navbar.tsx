import React from "react";
import styled from "styled-components";

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

export function Navbar() {
  return (
    <NavbarWrapper>
      <NavbarContent>
        <div>BOOKS MANAGER</div>
      </NavbarContent>
    </NavbarWrapper>
  );
}

export default Navbar;
