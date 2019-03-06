import React from 'react';

import { storiesOf } from '@storybook/react';
/* import { getGroups } from 'services/getGroups'; */
import Associator from './Associator';

storiesOf('Associator', module).add('Add Groups to User', () => (
  <Associator
    editing
    fetchItems={() => {
      return Promise.resolve({
        limit: 22,
        offset: 0,
        count: 1,
        resultSet: [
          {
            id: 'b12b826f-4f33-42df-afd0-5aec3c8bfc17',
            name: 'Test group for test',
            description: 'hi',
            status: 'Approved',
          },
        ],
      });
    }}
  />
));
