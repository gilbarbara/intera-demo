import React from 'react';
import SVG from 'react-inlinesvg';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Container from 'src/components/Container';
import Switch from 'src/components/Switch';

const Wrapper = styled.header`
  background-color: #fff;
  padding-bottom: var(--gutter-lg);
  padding-top: var(--gutter-lg);
`;

const HeaderContainer = styled(Container)`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  color: #000;
  display: flex;
  height: 14px;

  svg {
    height: 14px;
    width: auto;
  }
`;

function Header(): JSX.Element {
  return (
    <Wrapper>
      <HeaderContainer>
        <Logo to="/">
          <SVG src="/brand/logo.svg" title="Intera" />
        </Logo>
        <Switch />
      </HeaderContainer>
    </Wrapper>
  );
}

export default Header;
