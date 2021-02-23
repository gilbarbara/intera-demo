import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { TranslationsProvider } from '@eo-locale/react';
import styled from 'styled-components';

import { useOptions } from 'src/modules/context';
import locales from 'src/locales';

import Header from 'src/components/Header';
import Auth from 'src/routes/Auth';
import Form from 'src/routes/Form';
import Home from 'src/routes/Home';
import Profile from 'src/routes/Profile';

const Main = styled.main`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 70px);
  width: 100%;
`;

function Root(): JSX.Element {
  const { options } = useOptions();

  return (
    <div key={options.locale}>
      <TranslationsProvider language={options.locale} locales={locales}>
        <Router>
          <Header />
          <Main>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/auth" exact component={Auth} />
              <Route path="/form" exact component={Form} />
              <Route path="/profile" exact component={Profile} />
            </Switch>
          </Main>
        </Router>
      </TranslationsProvider>
    </div>
  );
}

export default Root;
