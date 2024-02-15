import React from "react";
import { Checkbox } from "@mui/material";
import styled from "styled-components";

const LabeledCheckbox = (props) => {
  return (
    <>
      {!props.disabled && (
        <CheckboxContainer>
          <span>{props.text}</span>
          <Checkbox checked={props.checked} onChange={props.onChange} />
        </CheckboxContainer>
      )}
    </>
  );
};

export default LabeledCheckbox;

const CheckboxContainer = styled.div``;
