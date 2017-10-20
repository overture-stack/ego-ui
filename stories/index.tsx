import React from 'react';
import { css } from 'glamor';
import { configure, storiesOf, addDecorator } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import StoryRouter from 'storybook-router';
import 'flexboxgrid';

import providerUsers from 'stateProviders/provideUser';

import 'common/injectGlobals';

global.gapi = {
  load: () => {},
};

css.global('#root > div', {
  height: '100%',
});

const req = require.context(
  '../src/components',
  true,
  /\.stories\.(js|ts|tsx)$/,
);

const StateProviders = providerUsers(({ children }) => children);

addDecorator(storyFn => <StateProviders>{storyFn()}</StateProviders>);
addDecorator(StoryRouter());

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
