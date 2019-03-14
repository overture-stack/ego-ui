import React from 'react';
import { css } from 'glamor';
import { configure } from '@storybook/react';
/* import { action } from '@storybook/addon-actions';
 * import { linkTo } from '@storybook/addon-links'; */
/* import StoryRouter from 'storybook-router'; */
import 'flexboxgrid';

import 'common/injectGlobals';

global.gapi = {
  load: () => {
    /* empty */
  },
};

css.global('#root > div', {
  height: '100%',
});

const req = require.context('../src/components', true, /\.stories\.(js|ts|tsx)$/);

/* addDecorator(StoryRouter()); */

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
