/**
 * 1. Added HOC to verify sign-in status prior to showing /create
 * 2. Surrounding try-catch for async/await call & response.status check
 */

import React, { useState } from "react";
import styled from "styled-components";
import { Colours, Typography } from "../definitions";
import Button from "../components/Button";
import PageLayout from "../components/PageLayout";
import {
  clearTodoAlerts,
  clearTodoBody,
  updateTodoError,
  updateTodoName,
  updateTodoSuccess,
} from "../actions/todo";
import Form from "../components/Form";
import InputField from "../components/InputField";
import apiFetch from "../functions/apiFetch";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../components/Alert";
import withAuth from "../utils/WithAuth";

const Create = () => {
  const [isSaving, setIsSaving] = useState(false);
  const todoState = useSelector((state) => state.todo);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (todoState.body.name) {
      setIsSaving(true);
      dispatch(clearTodoAlerts());

      try {
        let response = await apiFetch("/todo", {
          body: todoState.body,
          method: "POST",
        });

        if (response.status === 201) {
          dispatch(
            updateTodoSuccess({
              success: `Todo "${todoState.body.name}" saved successfully`,
            })
          );
          dispatch(clearTodoBody());
        }
      } catch (error) {
        console.log(`Failed to create todo: ${error}`);
        dispatch(updateTodoError({ error: response.body.error }));
      }
      setIsSaving(false);
    }
  };

  return (
    <PageLayout title="Create todo">
      <Container>
        <div className="content">
          <h1>Create todo</h1>
          <Alert
            message={todoState.alerts.error}
            onClose={() => dispatch(clearTodoAlerts())}
          />
          <Alert
            message={todoState.alerts.success}
            onClose={() => dispatch(clearTodoAlerts())}
            variant="success"
          />
          <Form onSubmit={handleSubmit}>
            <InputField
              className="input"
              type="text"
              placeholder="Todo item name"
              required
              value={todoState.body.name}
              onChange={(e) =>
                dispatch(updateTodoName({ name: e.target.value }))
              }
            />
            <Button
              className="saveButton"
              type="submit"
              text="Save"
              size="large"
              variant="primary"
              disabled={isSaving || !todoState.body.name}
              isFullWidth
            />
          </Form>
        </div>
      </Container>
    </PageLayout>
  );
};

export default withAuth(Create);

const Container = styled.div`
  width: 100%;

  .content {
    h1 {
      color: ${Colours.BLACK};
      font-size: ${Typography.HEADING_SIZES.M};
      font-weight: ${Typography.WEIGHTS.LIGHT};
      line-height: 2.625rem;
      margin-bottom: 2rem;
      margin-top: 1rem;
    }

    .saveButton {
      margin-top: 1rem;
    }
  }
`;
