import styled from "styled-components";

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 23em;
`;

export const Button = styled.button<{ alignSelf?: string }>`
  background: transparent;
  border: 1px solid grey;
  border-radius: 3px;
  cursor: pointer;
  padding: 0.5rem;
  align-self: ${(props) => props.alignSelf};

  &:hover {
    background: lightgray;
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
`;
