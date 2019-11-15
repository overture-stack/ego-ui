import { TEAL } from 'common/colors';
import Logout from 'components/Logout';
import { css } from 'glamor';
import React from 'react';

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

export default () => (
  <div className={`${css(styles.container)}`}>
    Your account does not have an administrator user type.
    <Logout />
  </div>
);
