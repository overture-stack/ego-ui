import React from 'react';

import { storiesOf } from '@storybook/react';
import { getGroups } from 'services/getGroups';
import Associator from './Associator';

storiesOf('Associator', module).add('Add Groups to User', () => (
  <div>
    <Associator fetchItems={getGroups} />
  </div>
));
