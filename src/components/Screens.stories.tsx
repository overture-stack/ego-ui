import React from 'react';
import { storiesOf } from '@storybook/react';
import Users from './Users';
import StoryRouter from 'storybook-router';

storiesOf('Screens', module)
  .addDecorator(StoryRouter())
  .add('Users', () => <Users />);
