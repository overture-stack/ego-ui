import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';
import Logout from 'components/Logout';

const styles = {
  container: {
    backgroundColor: colors.teal,
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
