import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';
import DisplayName from './DisplayName';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px 0',
  },
  email: {
    color: '#aaa',
    fontWeight: 200,
    fontSize: '0.9em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userAdmin: {
    marginLeft: 5,
    fontSize: '0.5em',
    color: colors.purple,
  },
};

export default ({
  item: { firstName, lastName, email, status, role },
  className = '',
  style,
  ...props,
}) => {
  return (
    <div
      className={`Item ${className} ${css(
        styles.container,
        status === 'Deactivated' && {
          opacity: 0.3,
          fontStyle: 'italic',
        },
        style,
      )}`}
      {...props}
    >
      <DisplayName firstName={firstName} lastName={lastName} role={role} />
      <span className={`email ${css(styles.email)}`}>{email}</span>
    </div>
  );
};
