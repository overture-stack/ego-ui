import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';

const styles = {
  container: {
    width: '16em',
    fontSize: 20,
    paddingBottom: 5,
    display: 'flex',
    alignItems: 'baseline',
    wordBreak: 'break-all',
  },
  userAdmin: {
    marginLeft: 5,
    fontSize: '0.5em',
    color: colors.purple,
  },
};

export default ({ firstName, lastName, role, style }: any) => (
  <div className={`${css(styles.container, style)}`}>
    <div>
      {firstName} {lastName}
    </div>
    {role === 'ADMIN' && (
      <div className={`${css(styles.userAdmin)}`}>ADMIN</div>
    )}
  </div>
);
