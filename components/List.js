import React from "react";
import styled from "styled-components";

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
  flex: 1 1 auto;
`;

const Placeholder = styled.p`
  font-weight: 400;
  font-style: italic;
  text-decoration: underline;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;
