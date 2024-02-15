import React from "react";
import { Colours } from "../definitions";
import styled from "styled-components";
import Link from "next/link";
import Button from "./Button";

const Navbar = ({ ...props }) => {
  return (
    <Header className={props.className}>
      <HeaderContents>
        <Link href="/" onClick={props.handleRedirect}>
          <img className="headerLogo" src="/img/todox-logo-white.svg" />
        </Link>
        <Button
          className="loginButton"
          text="Sign out"
          size="large"
          variant="primary"
          {...props}
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
