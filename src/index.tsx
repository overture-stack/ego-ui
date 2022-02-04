import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import qs from 'qs';
import { BrowserRouter as Router } from 'react-router-dom';

import 'common/injectGlobals';
import App from './App';
import { PUBLIC_PATH } from 'common/injectGlobals';
import AppProviders from 'components/AppProviders';

const { locale } = qs.parse('?locale=en', { ignoreQueryPrefix: true });
const messages = {};

ReactDOM.render(
  <IntlProvider locale={locale} messages={messages}>
    <Router basename={PUBLIC_PATH}>
      <AppProviders>
        <App />
      </AppProviders>
    </Router>
  </IntlProvider>,
  document.getElementById('root') as HTMLElement,
);
