import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiFetch from "../functions/apiFetch";
import styled from "styled-components";
import * as Constants from "../constants.js";
import LabeledCheckbox from "../components/LabeledCheckbox.js";
import PageLayout from "../components/PageLayout";
import Select from "../components/Select.js";
import Alert from "../components/Alert.js";
import Button from "../components/Button";
import List from "../components/List.js";
import {
  updateTodoError,
  updateTodoSuccess,
  clearTodoAlerts,
} from "../actions/todo";
import {
  sortByCriteria,
  applySortingField,
  sortByCreationDate,
  getFilteredActiveList,
  configureAllTab,
  configureIncompleteTab,
  configureCompleteTab,
} from "../functions/helpers.js";
import { Colours, Typography } from "../definitions";

const Todos = () => {
  const todoState = useSelector((state) => state.todo);
  const [activeTab, setActiveTab] = useState(Constants.todoTabLiterals.all); // Defaults to display all todos
  const [sortOption, setSortOption] = useState(
    Constants.sortOptionLiterals.creationDateDescending
  );
  const [isUnaltered, setIsUnaltered] = useState(true); // Controls clickability of <Change Status / Delete Selected> buttons
  const [allChecked, setAllChecked] = useState(null); // Controls whether to display <Check All || Uncheck All>
  const [activeList, setActiveList] = useState([]); // List of todos to display based on activeTab <All || Incompleted || Completed>
  const [todos, setTodos] = useState([]); // Fetched user todos from DB
  const dispatch = useDispatch();

  // Retrieve user todo's on page load
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        let response = await apiFetch("/todo/todos", {});

        if (response.body && response.body.length) {
          // Apply a `checked` field so user can locally mark todo's
          const todos = sortByCreationDate(applySortingField(response.body));
          setTodos(todos);
          setActiveList(todos);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTodos();
  }, []);

  // Edit visibility of mass check/uncheck and <Change Status | Delete Selected> buttons
  useEffect(() => {
    if (!activeList.length) {
      // Checkmark should be disabled if there's nothing in the list
      setAllChecked(null);
    } else {
      // If all todos in current tab are checked -> display Uncheck All, otherwise display Check All
      setAllChecked(activeList.filter((todo) => !todo.checked).length === 0);
    }

    // No user changes made locally if nothing is checked
    setIsUnaltered(todos.filter((todo) => todo.checked).length === 0);
  }, [activeList, todos]);

  // Create a shallow copy of the whole todos to display only the relevant todo(s) based on activeTab
  // Shallow copy since changes made in <Completed || Incompleted> should reflect in All
  useEffect(() => {
    const shallowCopy = todos.map((todo) => todo);
    sortByCriteria(shallowCopy, sortOption);

    setActiveList(getFilteredActiveList(shallowCopy, activeTab));
  }, [activeTab, sortOption, todos]);

  // Updates all checkmarks for todos in activeTab to <checked>
  const adjustAllCheckboxes = (checked) => {
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
      prev.map((todo) => ({
        ...todo,
        checked: todo.todoID === todoID ? !todo.checked : todo.checked,
      }))
    );
  };

  // Update selected todo(s) completion status for user in DB
  const changeSelectedStatus = async () => {
    const markedTodos = todos.filter((todo) => todo.checked);

    dispatch(clearTodoAlerts());
    let response = await apiFetch("/todo/update", {
      body: markedTodos,
      method: "POST",
    });

    if (response.status === 200) {
      setTodos((prev) =>
        prev.map((todo) => ({
          ...todo,
          completed: todo.checked ? !todo.completed : todo.completed,
          checked: false,
        }))
      );

      dispatch(
        updateTodoSuccess({
          success: `Completion status changed successfully.`,
        })
      );
    } else {
      dispatch(updateTodoError({ error: response.body.error }));
    }
  };

  // Delete selected todo(s) for user in DB
  const deleteTodos = async () => {
    const markedTodos = todos.filter((todo) => todo.checked);

    dispatch(clearTodoAlerts());
    let response = await apiFetch("/todo/delete", {
      body: markedTodos,
      method: "POST",
    });

    if (response.status === 200) {
      // Remove all of the todos that were just deleted
      setTodos((prev) => prev.filter((todo) => !todo.checked));

      dispatch(
        updateTodoSuccess({
          success: `Todo's successfully deleted.`,
        })
      );
    } else {
      dispatch(updateTodoError({ error: response.body.error }));
    }
  };

  // JSX returned to enable <List /> as a reusable component
  const renderTodo = (item) => (
    <ListItem key={item.todoID}>
      <ListContent>{item.name}</ListContent>
      <ListContent>
        {item.completed ? "completed\n" : "incompleted\n"}
      </ListContent>
      <ListContent>{new Date(item.created).toLocaleDateString()}</ListContent>
      <ListContent>
        <LabeledCheckbox
          checked={item.checked}
          onChange={() => updateCheck(item.todoID)}
        />
      </ListContent>
    </ListItem>
  );

  return (
    <PageLayout title="Todos">
      <Alert
        message={todoState.alerts.success}
        onClose={() => dispatch(clearTodoAlerts())}
        variant="success"
      />
      <Alert
        message={todoState.alerts.error}
        onClose={() => dispatch(clearTodoAlerts())}
      />
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
            text="Change Status"
            onClick={changeSelectedStatus}
            disabled={isUnaltered}
          />
          <Button
            text="Delete Selected"
            onClick={deleteTodos}
            disabled={isUnaltered}
          />
          {allChecked ? (
            <LabeledCheckbox
              text={"Uncheck All"}
              checked={allChecked}
              disabled={!activeList.length}
              onChange={() => adjustAllCheckboxes(!allChecked)}
            />
          ) : (
            <LabeledCheckbox
              text={"Check All"}
              checked={false}
              disabled={!activeList.length}
              onChange={() => adjustAllCheckboxes(!allChecked)}
            />
          )}
        </OptionsContainer>
        <HeadingContainer>
          {Constants.todoHeaders.map((header, idx) => (
            <Header key={idx}>{header}</Header>
          ))}
        </HeadingContainer>
        <List items={activeList} renderItem={renderTodo} />
      </Container>
    </PageLayout>
  );
};

export default Todos;

const Container = styled.div`
  flex: 1 1 auto;
  border: 3px solid ${Colours.GRAY_DARKER};
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
  border-bottom: 3px solid ${Colours.GRAY_DARK};
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

  border-bottom: 2px dotted ${Colours.GRAY_DARK};
  border-radius: 0.25rem;
  :last-child {
    border: none;
  }
`;

const ListContent = styled.div`
  display: flex;
  flex-direction: row;
  overflow-wrap: break-word;
  align-self: center;
  justify-content: center;
  width: 6vw;
  height: 7vh;
  overflow: scroll;

  /* Hide scrollbar for webkit-based browsers */
  &::-webkit-scrollbar {
    display: none;
  }
`;
