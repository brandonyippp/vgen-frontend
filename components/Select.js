import React from "react";
import styled from "styled-components";

const Select = (props) => {
  return (
    <SelectionContainer>
      <Label>{props.text}</Label>
      <select
        value={props.active}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.options &&
          props.options.map((option, idx) => (
            <option value={option} key={idx}>
              {option}
            </option>
          ))}
      </select>
    </SelectionContainer>
  );
};

export default Select;

const SelectionContainer = styled.div`
  display: flex;
`;

const Label = styled.label``;
