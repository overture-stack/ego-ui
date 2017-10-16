import React from 'react';
import { storiesOf } from '@storybook/react';
import Users from './Users';
import StoryRouter from 'storybook-router';
import ProviderUsers from 'stateProviders/provideUser';

const StateProviders = ProviderUsers(({ children }) => children);

storiesOf('Screens', module)
  .addDecorator(StoryRouter())
  .addDecorator(storyFn => <StateProviders>{storyFn()}</StateProviders>)
  .add('Users', () => <Users />);
