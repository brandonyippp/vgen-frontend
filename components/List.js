import React from "react";
import styled from "styled-components";

const List = (props) => {
  return (
    <UnorderedList>
      {props.items && props.items.length ? (
        props.items.map(
          (item) => props.type === "todo" && props.renderItem(item)
        )
      ) : (
        <p>Nothing to display.</p>
      )}
    </UnorderedList>
  );
};

export default List;

const UnorderedList = styled.ul`
  flex: 1 1 auto;
`;
