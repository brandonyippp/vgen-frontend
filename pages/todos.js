import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import styled from "styled-components";
import { Colours, Typography } from "../definitions";
import apiFetch from "../functions/apiFetch";
import List from "../components/List.js";
import Button from "../components/Button";
import * as Constants from "../constants.js";
import Select from "../components/Select.js";
import LabeledCheckbox from "../components/LabeledCheckbox.js";
import {
  compareArrays,
  applySortingField,
  sortByCreationDate,
  configureAllTab,
  configureIncompleteTab,
  configureCompleteTab,
} from "../functions/helpers.js";

const Todos = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeList, setActiveList] = useState([]);
  const [todos, setTodos] = useState([]);
  const [originalTodos, setOriginalTodos] = useState([]);
  const [isUnaltered, setIsUnaltered] = useState(true);
  const [allChecked, setAllChecked] = useState(null);

  // Retrieve user todo's on page load
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        let response = await apiFetch("/todo/todos", {});

        if (response.body && response.body.length) {
          const todos = sortByCreationDate(applySortingField(response.body));
          setTodos(todos);
          setActiveList(todos);

          // Create an original copy to compare changes. If none -> disable Apply Changes button
          setOriginalTodos(todos.map((todo) => ({ ...todo })));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTodos();
  }, []);

  // Determine which list to render out
  useEffect(() => {
    if (activeTab === Constants.todoTabLiterals.all) {
      setActiveList(todos);
    } else if (activeTab === Constants.todoTabLiterals.incomplete) {
      setActiveList(todos.filter((todo) => !todo.completed));
    } else if (activeTab === Constants.todoTabLiterals.complete) {
      setActiveList(todos.filter((todo) => todo.completed));
    }
  }, [activeTab, todos]);

  /* Update the following components of the OptionsContainer:
      1. Accessibility/visibility and functionality (uncheck/check) of mass checkmark
      2. Accessibility of "Apply Changes" button -> shouldn't be clickable if no changes were made
  */
  useEffect(() => {
    if (!activeList.length) {
      setAllChecked(null);
    } else {
      // Checkbox for select all on current tab should be checked if there aren't any boxes that are
      setAllChecked(activeList.filter((todo) => !todo.status).length === 0);
    }

    setIsUnaltered(compareArrays(todos, originalTodos, [`status`]));
  }, [activeList, todos]);

  // Update a single checkbox for a given todo
  const updateCheck = (todoID) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.todoID === todoID) {
          todo.status = !todo.status;
        }

        return todo;
      })
    );
  };

  // Updates all checkmarks for listed todos to <checked>
  const configureTabCheckboxes = (checked) => {
    if (activeTab === Constants.todoTabLiterals.all) {
      configureAllTab(setTodos, checked);
    } else if (activeTab === Constants.todoTabLiterals.incomplete) {
      configureIncompleteTab(setTodos, checked);
    } else if (activeTab === Constants.todoTabLiterals.complete) {
      configureCompleteTab(setTodos, checked);
    }
  };

  const applyChanges = () => {
    setTodos((prev) =>
      prev.map((todo) => ({ ...todo, completed: todo.status }))
    );
  };

  return (
    <PageLayout title="Todos">
      <Container>
        <OptionsContainer>
          <Select
            active={activeTab}
            onChange={setActiveTab}
            options={Constants.todoTabs}
          />
          <Button
            text="Apply Changes"
            onClick={applyChanges}
            disabled={isUnaltered}
          />
          <LabeledCheckbox
            text={allChecked ? "Uncheck All" : "Check All"}
            checked={allChecked}
            disabled={allChecked === null ? true : false}
            onChange={() => configureTabCheckboxes(!allChecked)}
          />
        </OptionsContainer>
        <List items={activeList} onChange={updateCheck} />
      </Container>
    </PageLayout>
  );
};

export default Todos;

const Container = styled.div`
  flex: 1 1 auto;
  border: 1px solid green;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid blue;
`;
