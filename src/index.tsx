import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import qs from 'qs';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import 'common/injectGlobals';
import App from './App';
import { PUBLIC_PATH } from 'common/injectGlobals';

const { locale } = qs.parse('?locale=en', { ignoreQueryPrefix: true });
const messages = {};

ReactDOM.render(
  <IntlProvider locale={locale} messages={messages}>
    <Router basename={PUBLIC_PATH}>
      <App />
    </Router>
  </IntlProvider>,
  document.getElementById('root') as HTMLElement,
);
