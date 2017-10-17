import React from 'react';
import ReactDOM from 'react-dom';
import { injectIntl, IntlProvider, FormattedRelative } from 'react-intl';
import qs from 'qs';
import 'flexboxgrid';
import 'common/injectGlobals';
import './index.css';

import App from './App';

const locale = qs.parse('?locale=en', { ignoreQueryPrefix: true });

const messages = {};

ReactDOM.render(
  <IntlProvider>
    <App />
  </IntlProvider>,
  document.getElementById('root') as HTMLElement,
);
