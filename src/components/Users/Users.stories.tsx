import React from 'react';
import { storiesOf } from '@storybook/react';
import UserList from './UserList';

storiesOf('Users', module).add('User List', () => (
  <UserList onSelect={() => {}} />
));
