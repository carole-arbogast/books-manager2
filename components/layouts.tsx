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

export const Button = styled.button<{ alignSelf?: string; margin?: string; selected?: boolean }>`
  background: ${(props) => (props.selected ? "#055499" : "#deecfa")};
  border: 1px solid#055499;
  border-radius: 5px;
  cursor: pointer;
  padding: 0.5rem;
  align-self: ${(props) => props.alignSelf};
  color: ${(props) => (props.selected ? "#deecfa" : "#034178")};

  margin: ${(props) => (props.margin ? props.margin : "0")};

  &:hover {
    background: ${(props) => (props.selected ? "#055499" : "#a0d1fc")};
  }
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    color: #4b4a4a;
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export const FlexWrapper = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction};
  justify-content: ${(props) => props.justify};
`;
