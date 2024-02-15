import React from "react";
import styled from "styled-components";
import LabeledCheckbox from "./LabeledCheckbox";

const List = (props) => {
  return (
    <UnorderedList>
      {props.items && props.items.length ? (
        props.items.map((item) => (
          <ListItem key={item.todoID}>
            <div>{item.name}</div>
            <LabeledCheckbox
              text={`Mark as ${item.status ? "incomplete" : "complete"}`}
              checked={item.status}
              onChange={() => props.onChange(item.todoID)}
            />
          </ListItem>
        ))
      ) : (
        <p>Nothing to display.</p>
      )}
    </UnorderedList>
  );
};

export default List;

const UnorderedList = styled.ul`
  flex: 1 1 auto;
  border: 2px solid grey;
  border-radius: 1rem;
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid grey;
  :last-child {
    border: none;
  }
`;
