import { css } from 'glamor';
import React from 'react';

import { TEAL } from 'common/colors';
import Logout from 'components/Logout';

const styles = {
  container: {
    backgroundColor: TEAL,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
};

const NoAccess = () => (
  <div className={`${css(styles.container)}`}>
    Your account does not have an administrator user type.
    <Logout />
  </div>
);

export default NoAccess;
