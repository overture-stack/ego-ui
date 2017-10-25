import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';

const styles = {
  container: {
    minWidth: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    color: colors.mediumGrey,
    fontWeight: 200,
  },
};
export default ({ message, className = '' }) => (
  <div className={`${className} ${css(styles.container)}`}>{message}</div>
);
