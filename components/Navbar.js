import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearSignIn, updateSignInError } from "../actions/signIn";
import apiFetch from "../functions/apiFetch";
import { Colours } from "../definitions";
import { useRouter } from "next/router";
import styled from "styled-components";
import Link from "next/link";
import Button from "./Button";

const Navbar = ({ className }) => {
  const signInState = useSelector((state) => state.signIn);
  const [signedIn, setSignedIn] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const isSignedIn = async () => {
    try {
      let response = await apiFetch("/user/session", {});
      return response.status === 200 ? setSignedIn(true) : setSignedIn(false);
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  //Establishes sign-in status to determine visibility of sign-out button
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

    //TODO: maybe else here for something
    /**
     *           <Alert
            message={signInState.alerts.error}
            onClose={() => dispatch(clearSignInAlerts())}
          />
     */
  };

  return (
    <Header className={className}>
      <HeaderContents>
        <Link href="/">
          <img className="headerLogo" src="/img/todox-logo-white.svg" />
        </Link>
        <Button
          className="loginButton"
          text="Sign out"
          size="large"
          variant="primary"
          onClick={handleSignout}
          disabled={!signedIn}
        />
      </HeaderContents>
    </Header>
  );
};

export default Navbar;

const HeaderContents = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const Header = styled.header`
  align-items: center;
  background: ${Colours.NAVIGATION_BAR};
  box-sizing: border-box;
  display: flex;
  height: 4rem;
  padding: 1rem 2.25rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;

  .headerLogo {
    height: 4.6875rem;
    width: 8.4375rem;
  }
`;
