import _ from 'lodash';
import React from 'react';
import { compose, withState, withProps, defaultProps } from 'recompose';
import { css } from 'glamor';
import { storiesOf } from '@storybook/react';

import Associator from './Associator';

const addItem = item => {
  console.log('addItem');
};

storiesOf('Associator', module).add('Add Groups to User', () => (
  <div>
    <Associator />
  </div>
));
