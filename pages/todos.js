import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import styled from "styled-components";
import { Colours, Typography } from "../definitions";
import apiFetch from "../functions/apiFetch";
import OrderedList from "../components/OrderedList";
import Button from "../components/Button";
import { Checkbox } from "@mui/material";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  // Retrieve user todo's on page load
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        let response = await apiFetch("/todo/todos", {});

        if (response) {
          setTodos(response.body);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTodos();
  }, []);

  // Functionality for making checkmark resposible for marking all as checked to be checked if all are already checked
  useEffect(() => {
    let res = true;

    // res will only be false (and stay falsy) if you see an unchecked todo
    todos.forEach((todo) =>
      todo.completed && res ? (res = res) : (res = false)
    );

    setAllSelected(res);
  }, [todos]);

  // Update a single checkbox for a given todo
  const updateCheck = (todoID) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.todoID === todoID) {
          todo.completed = !todo.completed;
        }

        return todo;
      })
    );
  };

  // Update all checkmarks for listed todos
  const checkAll = () => {
    setTodos((prev) => prev.map((todo) => ({ ...todo, completed: true })));
  };

  const uncheckAll = () => {
    setTodos((prev) =>
      prev.map((todo) => ({ ...todo, completed: !todo.completed }))
    );
  };

  return (
    <PageLayout title="Todos">
      <div>
        <span>{allSelected ? "Uncheck All" : "Check All"}</span>
        <Checkbox
          checked={allSelected}
          onChange={allSelected ? uncheckAll : checkAll}
        />
      </div>
      <OrderedList items={todos} onChange={updateCheck} />
      <Button text="Apply Changes" />
    </PageLayout>
  );
};

export default Todos;
