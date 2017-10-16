import React from 'react';

import { configure, storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

global.gapi = {
  load: () => {},
};

const req = require.context(
  '../src/components',
  true,
  /\.stories\.(js|ts|tsx)$/,
);

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
));

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
