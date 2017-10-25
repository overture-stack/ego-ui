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
    '& .DisplayName, & .email': {
      position: 'relative',
    },
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
  selected: {
    '& .DisplayName, & .email': {
      '&::before': {
        transform: 'translateY(0) !important',
        opacity: 1,
      },
    },
  },
};

export default ({
  item: { firstName, lastName, email, status, role },
  style,
  className,
  selected,
  ...props,
}) => {
  return (
    <div
      className={`Item ${className ? className : ''} ${css(
        styles.container,
        status === 'Deactivated' && {
          opacity: 0.3,
          fontStyle: 'italic',
        },
        selected && styles.selected,
        style,
      )}`}
      {...props}
    >
      <DisplayName firstName={firstName} lastName={lastName} role={role} />
      <span className={`email ${css(styles.email)}`}>{email}</span>
    </div>
  );
};
