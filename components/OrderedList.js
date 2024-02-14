import React from "react";
import styled from "styled-components";
import Checkbox from "@mui/material/Checkbox";

const OrderedList = (props) => {
  return (
    <List>
      {props.items.length &&
        props.items.map((item) => (
          <ListItem key={item.todoID}>
            <div>{item.name}</div>
            <Checkbox
              checked={item.completed}
              onChange={() => props.onChange(item.todoID)}
            />
          </ListItem>
        ))}
    </List>
  );
};

export default OrderedList;

const List = styled.ul`
  //   border: 1px solid green;
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid red;
  padding: 2rem;
`;
