import React from 'react';
import { configure, addDecorator } from '@storybook/react';
/* import { action } from '@storybook/addon-actions';
 * import { linkTo } from '@storybook/addon-links'; */
/* import StoryRouter from 'storybook-router'; */
import 'flexboxgrid';

import provideLoggedInUser from 'stateProviders/provideLoggedInUser';

import 'common/injectGlobals';

global.gapi = {
  load: () => {
    /* empty */
  },
};

const req = require.context('../src/components', true, /\.stories\.(js|ts|tsx)$/);

const StateProviders = provideLoggedInUser(({ children }) => children);

addDecorator((storyFn) => <StateProviders>{storyFn()}</StateProviders>);
/* addDecorator(StoryRouter()); */

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
