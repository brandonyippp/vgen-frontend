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
  returnArrayDifferences,
  sortByCriteria,
  compareArrays,
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
  const [activeTab, setActiveTab] = useState(Constants.todoTabLiterals.all);
  const [sortOption, setSortOption] = useState(
    Constants.sortOptionLiterals.creationDateDescending
  );
  const [originalTodos, setOriginalTodos] = useState([]); // Deep copy reference to establish visibility of "Apply Changes" button (enable if any originalTodo[i].status !== todos[i].status)
  const [isUnaltered, setIsUnaltered] = useState(true);
  const [allChecked, setAllChecked] = useState(null);
  const [activeList, setActiveList] = useState([]);
  const [todos, setTodos] = useState([]);
  const dispatch = useDispatch();

  // Retrieve user todo's on page load
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        let response = await apiFetch("/todo/todos", {});

        if (response.body && response.body.length) {
          const todos = sortByCreationDate(applySortingField(response.body));
          setTodos(todos);
          setActiveList(todos);
          setOriginalTodos(todos.map((todo) => ({ ...todo })));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTodos();
  }, []);

  // Edit visibility of mass check/uncheck and "Apply Changes" button
  useEffect(() => {
    if (!activeList.length) {
      setAllChecked(null); // Checkmark should be disabled if there's nothing in the list
    } else {
      // If all todos are marked as complete in current tab -> display Check All, otherwise display Uncheck All
      setAllChecked(activeList.filter((todo) => !todo.status).length === 0);
    }

    // Enable "Apply Changes" button if any todos[i].status !== originalTodos[i].status
    setIsUnaltered(compareArrays(todos, originalTodos, [`status`]));
  }, [activeList, todos]);

  /**
   * todos[] and originalTodos[] must retain original element positioning for comparison between their 'status' property to
   * establish visibility of "Apply Changes" button (changes made = enabled, no changes made = disabled).
   *
   * activeList[] is always a new list of todosp[] that is able to alter its element positioning without issue.
   * Because it is a shallow copy, it still refers to the same todo objects (therefore changing todos[i].status will reflect in activeList[i].status),
   * which is intended behaviour since the only purpose of activeList is to decide which elements to render out in the list component.
   *
   * The motivation behind this implementation was to avoid cases where you edit sorting in one tab (e.g Uncompleted), causing you to
   * sort a subset of the entire list. Upon returning to the All tab, you'd have an activeList[] consisting of two subsets with differing sort properties,
   * since sorting on any tab other than All would've been referring to a subset of the entire list.
   */
  useEffect(() => {
    const shallowCopy = todos.map((todo) => todo);
    sortByCriteria(shallowCopy, sortOption);

    setActiveList(getFilteredActiveList(shallowCopy, activeTab));
  }, [activeTab, sortOption, todos]);

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

  // Update todo completion status' for user in DB
  const applyChanges = async () => {
    // Find the todo's that user changed locally
    const differences = returnArrayDifferences(todos, originalTodos, [
      `status`,
    ]);

    dispatch(clearTodoAlerts());
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

      dispatch(
        updateTodoSuccess({
          success: `Changes applied successfully.`,
        })
      );
    } else {
      dispatch(updateTodoError({ error: response.body.error }));
    }
  };

  // JSX returned to enable List as a reusable component
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
