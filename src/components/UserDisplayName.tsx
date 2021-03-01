import { TEAL } from 'common/colors';
import { User } from 'common/typedefs/User';
import { css } from 'glamor';
import React from 'react';

import Truncate from 'react-truncate';

const styles = {
  container: {
    fontSize: 18,
    lineHeight: 1,
    display: 'flex',
    alignItems: 'baseline',
    wordBreak: 'break-all',
  },
  userAdmin: {
    marginLeft: 5,
    fontSize: '0.5em',
    color: TEAL,
  },
  formattedName: {
    maxWidth: '180px',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    wordBreak: 'break-word',
    whiteSpace: 'nowrap',
    lineHeight: 'normal',
    paddingRight: '0.1em',
    verticalAlign: 'text-bottom',
  },
};

const getName = user => {
  const { lastName, firstName, id } = user;
  if (lastName) {
    if (firstName) {
      return `${lastName}, ${firstName[0].toUpperCase()}.`;
    }
    return lastName;
  } else if (firstName) {
    return firstName;
  } else {
    return id;
  }
};

export const UserDisplayName = ({ user, style = {} }: { user: User; style?: any }) => (
  <div className={`DisplayName ${css(styles.container, style)}`}>
    <span className={`${css(styles.formattedName)}`}>{getName(user)}</span>
    {user.type === 'ADMIN' && <div className={`${css(styles.userAdmin)}`}>ADMIN</div>}
  </div>
);
