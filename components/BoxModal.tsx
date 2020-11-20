import React from "react";
import styled from "styled-components";

interface BoxModalProps {
  children?: any;
  open?: boolean;
  onClose?: () => void;
}

export function BoxModal(props: BoxModalProps) {
  const { children, open, onClose } = props;

  return (
    <ModalWrapper open={open} onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Cross onClick={onClose}>X</Cross>
        {children}
      </ModalBox>
    </ModalWrapper>
  );
}

interface ModalWrapperProps {
  open?: boolean;
}

const ModalWrapper = styled.div<ModalWrapperProps>`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: ${(props) => (props.open ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  background: rgba(106, 105, 105, 0.4);
  z-index: 2;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 3px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  cursor: default;
  min-width: 15em;
`;

const Cross = styled.span`
  align-self: flex-end;
  cursor: pointer;
`;

export default BoxModal;
