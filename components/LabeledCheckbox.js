import React from "react";
import { Checkbox } from "@mui/material";
import styled from "styled-components";

const LabeledCheckbox = (props) => {
  return (
    <CheckboxContainer>
      <CheckboxLabel disabled={props.disabled}>{props.text}</CheckboxLabel>
      <Checkbox
        checked={props.checked}
        onChange={props.onChange}
        disabled={props.disabled}
      />
    </CheckboxContainer>
  );
};

export default LabeledCheckbox;

const CheckboxContainer = styled.div``;

const CheckboxLabel = styled.p`
  ${(props) => {
    console.log(props);
    if (props.disabled) {
      return `
        opacity: 0.5;
      `;
    }
  }}
`;
