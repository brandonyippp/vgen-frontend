/**
 * 1. Updated redirect to /signin if sign-up successful
 * 2. Stored username & password as local state instead of global
 *    -POST request made accordingly if valid inputs given for username/password/confirmedPassword
 * 3. Surrounding try-catch for async/await call & response.status check
 */

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
import { Colours, Typography } from "../definitions";
import {
  clearSignUp,
  clearSignUpAlerts,
  updateSignUpConfirmPassword,
  updateSignUpError,
  updateSignUpPassword,
  updateSignUpSuccess,
  updateSignUpUsername,
} from "../actions/signUp";
import apiFetch from "../functions/apiFetch";
import Form from "../components/Form";
import InputField from "../components/InputField";
import Button from "../components/Button";
import PageLayout from "../components/PageLayout";
import Alert from "../components/Alert";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const signUpState = useSelector((state) => state.signUp);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username) {
      dispatch(updateSignUpError({ error: "You must choose a username" }));
    } else if (password.length < 6) {
      dispatch(
        updateSignUpError({
          error: "Your password must be at least 6 characters long",
        })
      );
    } else if (confirmedPassword !== password) {
      dispatch(updateSignUpError({ error: "The passwords must match!" }));
    } else {
      //store credentials in global state on successful sign-up
      // dispatch(updateSignUpUsername({ username }));
      // dispatch(updateSignUpPassword({ password }));

      setIsSigningUp(true);
      dispatch(clearSignUpAlerts());
      try {
        let response = await apiFetch("/user", {
          body: {
            username,
            password,
            confirmedPassword,
          },
          method: "POST",
          includeCredentials: false,
        });

        if (response.status === 201) {
          dispatch(clearSignUp());
          dispatch(
            updateSignUpSuccess({
              success: "Account creation successful, redirecting...",
            })
          );

          router.replace("/signin");
        }
      } catch (error) {
        setIsSigningUp(false);
        dispatch(updateSignUpError({ error: response.body.error }));
      }
    }
  };

  return (
    <PageLayout title="Sign up">
      <Container>
        <div className="content">
          <h1>Sign up</h1>
          <Alert
            message={signUpState.alerts.error}
            onClose={() => dispatch(clearSignUpAlerts())}
          />
          <Alert
            message={signUpState.alerts.success}
            onClose={() => dispatch(clearSignUpAlerts())}
            variant="success"
          />
          <Form onSubmit={handleSubmit}>
            <InputField
              className="input"
              type="text"
              placeholder="Username"
              required
              // value={signUpState.body.username}
              // onChange={(e) =>
              //   dispatch(updateSignUpUsername({ username: e.target.value }))
              // }
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <InputField
              className="input"
              type="password"
              placeholder="Password"
              required
              // value={signUpState.body.password}
              // onChange={(e) =>
              //   dispatch(updateSignUpPassword({ password: e.target.value }))
              // }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputField
              className="input"
              type="password"
              placeholder="Confirm password"
              required
              // value={signUpState.body.confirmPassword}
              // onChange={(e) =>
              //   dispatch(
              //     updateSignUpConfirmPassword({
              //       confirmPassword: e.target.value,
              //     })
              //   )
              // }
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
            />
            <Button
              className="loginButton"
              type="submit"
              text="Sign up"
              size="large"
              variant="primary"
              disabled={isSigningUp}
              isFullWidth
            />
          </Form>
        </div>
        <Footer>
          <p>
            Already have an account?{" "}
            <Link className="highlightedLink" href="/signin">
              Sign in
            </Link>
          </p>
        </Footer>
      </Container>
    </PageLayout>
  );
};

export default SignUp;

const Container = styled.div`
  width: 100%;

  h1 {
    color: ${Colours.BLACK};
    font-size: ${Typography.HEADING_SIZES.M};
    font-weight: ${Typography.WEIGHTS.LIGHT};
    line-height: 2.625rem;
    margin-bottom: 2rem;
    margin-top: 1rem;
  }

  .input {
    margin-bottom: 0.5rem;
  }

  .loginButton {
    margin-bottom: 2.0625rem;
  }

  .signUpOptions {
    margin-bottom: 2rem;

    .signUpOption {
      margin-bottom: 0.5rem;
    }
  }
`;

const Footer = styled.div`
  padding: 1.5rem 0rem;
  text-align: center;

  p {
    font-size: ${Typography.BODY_SIZES.L};
    font-weight: ${Typography.WEIGHTS.MEDIUM};

    .highlightedLink {
      color: ${Colours.ACCENT_1};
    }
  }
`;
