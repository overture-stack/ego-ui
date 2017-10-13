import * as React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';

const styles = {
  container: {
    backgroundColor: colors.purple,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
};

export default () => (
  <div className={`${css(styles.container)}`}>
    Your account does not have an administrator role.
  </div>
);
