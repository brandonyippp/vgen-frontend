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
  returnArrayDifferences,
  compareArrays,
  applySortingField,
  sortByCreationDate,
  sortByAlphabetical,
  configureAllTab,
  configureIncompleteTab,
  configureCompleteTab,
} from "../functions/helpers.js";

const Todos = () => {
  const [activeTab, setActiveTab] = useState(Constants.todoTabLiterals.all);
  const [sortOption, setSortOption] = useState(
    Constants.sortOptionLiterals.creationDateDescending
  );
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
      // If there are no todo's on current tab that are marked as completed -> Display Check All, otherwise display Uncheck All
      setAllChecked(activeList.filter((todo) => !todo.status).length === 0);
    }

    setIsUnaltered(compareArrays(todos, originalTodos, [`status`]));
  }, [activeList, todos]);

  useEffect(() => {
    const deepCopy = activeList.map((todo) => ({ ...todo }));

    if (sortOption === Constants.sortOptionLiterals.creationDateAscending) {
      // setActiveList((prev) => sortByCreationDate(prev, false));
      sortByCreationDate(deepCopy, false);
      setActiveList(deepCopy);
    } else if (
      sortOption === Constants.sortOptionLiterals.creationDateDescending
    ) {
      // setActiveList((prev) => sortByCreationDate(prev));
      sortByCreationDate(deepCopy);
      setActiveList(deepCopy);
    } else if (
      sortOption === Constants.sortOptionLiterals.alphabeticalAscending
    ) {
      // setActiveList((prev) => sortByAlphabetical(prev, false));
      sortByAlphabetical(deepCopy, false);
      setActiveList(deepCopy);
    } else if (
      sortOption === Constants.sortOptionLiterals.alphabeticalDescending
    ) {
      // setActiveList((prev) => sortByAlphabetical(prev));
      sortByAlphabetical(deepCopy);
      setActiveList(deepCopy);
    }
  }, [sortOption]);

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

  const applyChanges = async () => {
    const differences = returnArrayDifferences(todos, originalTodos, [
      `status`,
    ]);

    let response = await apiFetch("/todo/update", {
      body: differences,
      method: "POST",
    });
    if (response.status === 200) {
      setTodos((prev) =>
        prev.map((todo) => ({
          ...todo,
          completed: todo.status,
        }))
      );
      setOriginalTodos(todos.map((todo) => ({ ...todo })));
      // dispatch(
      //   updateTodoSuccess({
      //     success: `Todo "${todoState.body.name}" saved successfully`,
      //   })
      // );
      // dispatch(clearTodoBody());
    } else {
      // dispatch(updateTodoError({ error: response.body.error }));
    }
  };

  const renderTodo = (item) => (
    <ListItem key={item.todoID}>
      <ListContent>{item.name}</ListContent>
      <ListContent>
        {item.completed ? "completed\n" : "incompleted\n"}
      </ListContent>
      <ListContent>{new Date(item.created).toLocaleDateString()}</ListContent>
      <ListContent>
        <LabeledCheckbox
          text={`Click to mark as ${item.status ? "incomplete" : "complete"}`}
          checked={item.status}
          onChange={() => updateCheck(item.todoID)}
        />
      </ListContent>
    </ListItem>
  );

  return (
    <PageLayout title="Todos">
      <Container>
        <OptionsContainer>
          <SelectContainer>
            <Select
              active={activeTab}
              onChange={setActiveTab}
              options={Constants.todoTabs}
              text={"Filter:"}
            />
            <Select
              active={sortOption}
              onChange={setSortOption}
              options={Constants.sortOptions}
              text={"Sort:"}
            />
          </SelectContainer>
          <Button
            text="Apply Changes"
            onClick={applyChanges}
            disabled={isUnaltered}
          />
          {allChecked ? (
            <LabeledCheckbox
              text={"Uncheck All"}
              checked={allChecked}
              disabled={
                !activeList.length || allChecked === null ? true : false
              }
              onChange={() => configureTabCheckboxes(!allChecked)}
            />
          ) : (
            <LabeledCheckbox
              text={"Check All"}
              checked={false}
              disabled={
                !activeList.length || allChecked === null ? true : false
              }
              onChange={() => configureTabCheckboxes(!allChecked)}
            />
          )}
        </OptionsContainer>
        <HeadingContainer>
          <Header>Todo Name</Header>
          <Header>Status</Header>
          <Header>Created (mm/dd/yy)</Header>
          <Header>Action</Header>
        </HeadingContainer>
        <List items={activeList} renderItem={renderTodo} type={"todo"} />
      </Container>
    </PageLayout>
  );
};

export default Todos;

const Container = styled.div`
  flex: 1 1 auto;
  border: 2px solid grey;
  border-radius: 1rem;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 1rem;
`;

const SelectContainer = styled.div`
  flex: 1 1 auto;
`;

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 0.5rem;
`;

const Header = styled.div`
  font-weight: bold;
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid grey;
  :first-child {
    border-top: 1px solid grey;
  }
  :last-child {
    border: none;
  }
`;

const ListContent = styled.div`
  overflow-wrap: break-word;
  width: 20%;
  height: 100%;
`;
