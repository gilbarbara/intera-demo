import React from 'react';
import ReactDOM from 'react-dom';

import { OptionsProvider } from 'src/modules/context';

import GlobalStyles from 'src/components/GlobalStyles';

import reportWebVitals from './reportWebVitals';
import Root from './Root';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <OptionsProvider>
      <Root />
    </OptionsProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
