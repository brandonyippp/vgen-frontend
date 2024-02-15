import React from "react";
import { Checkbox } from "@mui/material";
import styled from "styled-components";

const LabeledCheckbox = (props) => {
  return (
    <CheckboxContainer>
      <p>{props.text}</p>
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
