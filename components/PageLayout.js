import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearSignIn } from "../actions/signIn";
import apiFetch from "../functions/apiFetch";
import { Colours } from "../definitions";
import { useRouter } from "next/router";
import styled from "styled-components";
import Head from "next/head";
import Navbar from "./Navbar";

const PageLayout = ({ className, title, children }) => {
  const signInState = useSelector((state) => state.signIn);
  const [signedIn, setSignedIn] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  //Establishes sign-in status to determine visibility of sign-out button
  const isSignedIn = async () => {
    try {
      let response = await apiFetch("/user/session", {});
      return response.status === 200 ? setSignedIn(true) : setSignedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isSignedIn();
  }, [signInState]);

  const handleSignout = async () => {
    let response = await apiFetch("/user/session", {
      body: signInState.body,
      method: "DELETE",
    });

    if (response.status === 200) {
      dispatch(clearSignIn());
      setSignedIn(false);
      router.push("/signin");
    }
  };

  return (
    <Container className={className}>
      <Head>
        <title>{`${title} - TodoX`}</title>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar
        onClick={handleSignout}
        disabled={!signedIn}
        hideAll={!signedIn}
      />
      <div className="contentContainer">{children}</div>
    </Container>
  );
};

export default PageLayout;

const Container = styled.div`
  align-items: center;
  background-color: ${Colours.GRAY_LIGHTER};
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;

  .contentContainer {
    background-color: ${Colours.WHITE};
    border-radius: 1.5rem;
    flex-grow: 1;
    margin: 5rem 1.25rem 3rem 1.25rem;
    max-width: 37.5rem;
    padding: 1.5rem;
    text-align: center;
  }
`;
