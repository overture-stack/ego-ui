import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';
import FullName from './FullName';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px 0',
  },
  userName: {
    width: '16em',
    fontSize: 18,
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

export default ({
  item: { firstName, lastName, email, status, role },
  style,
  className,
  ...props,
}) => {
  return (
    <div
      className={`${className ? className : ''} ${css(
        styles.container,
        status === 'Deactivated' && {
          opacity: 0.3,
          fontStyle: 'italic',
        },
        style,
      )}`}
      {...props}
    >
      <FullName firstName={firstName} lastName={lastName} role={role} />
      {email}
    </div>
  );
};
