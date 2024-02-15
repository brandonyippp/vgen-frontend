import React from "react";
import styled from "styled-components";
import { Colours, Typography } from "../definitions";

const List = (props) => {
  return (
    <UnorderedList>
      {props.items && props.items.length ? (
        props.items.map((item) => props.renderItem(item))
      ) : (
        <Placeholder>Nothing to display.</Placeholder>
      )}
    </UnorderedList>
  );
};

export default List;

const UnorderedList = styled.ul`
  max-height: 75vh;
  overflow-y: scroll;
  overflow-x: hidden;

  /* Hide scrollbar for webkit-based browsers */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Placeholder = styled.p`
  font-weight: 400;
  font-style: italic;
  text-decoration: underline;
  margin-top: ${Typography.BODY_SIZES.L};
  margin-bottom: ${Typography.BODY_SIZES.L};
`;
