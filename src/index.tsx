import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import qs from 'qs';
import 'common/injectGlobals';

import App from './App';

const { locale } = qs.parse('?locale=en', { ignoreQueryPrefix: true });

const messages = {};

ReactDOM.render(
  <IntlProvider locale={locale} messages={messages}>
    <App />
  </IntlProvider>,
  document.getElementById('root') as HTMLElement,
);
