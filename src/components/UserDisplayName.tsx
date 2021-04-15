/** @jsxImportSource @emotion/react */
import React from 'react';
import { User } from 'common/typedefs/User';
import { css } from '@emotion/react';

const styles = {
  container: {
    fontSize: 18,
    lineHeight: 1,
    display: 'flex',
    alignItems: 'baseline',
    WordBreak: 'break-all',
  },
  formattedName: {
    maxWidth: '180px',
    OverflowX: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    WordBreak: 'break-word',
    WhiteSpace: 'nowrap',
    lineHeight: 'normal',
    paddingRight: '0.1em',
    verticalAlign: 'text-bottom',
  },
};

const getName = (user) => {
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

const AdminDisplay = () => (
  <div
    css={(theme) => css`
      margin-left: 5px;
      font-size: 0.5em;
      color: ${theme.colors.primary_5};
    `}
  >
    ADMIN
  </div>
);

export const UserDisplayName = ({ user }: { user: User }) => (
  <div css={styles.container}>
    <span css={styles.formattedName}>{getName(user)}</span>
    {user.type === 'ADMIN' && <AdminDisplay />}
  </div>
);
