/** @jsxImportSource @emotion/react */
import React from 'react';
import { User } from 'common/typedefs/User';
import { css } from '@emotion/react';

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
  <div
    css={css`
      font-size: 18px;
      line-height: 1;
      display: flex;
      align-items: baseline;
      word-break: break-all;
    `}
  >
    <span
      css={css`
        ma-width: 180px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        word-break: break-word;
        white-space: nowrap;
        line-height: normal;
        padding-right: 0.1em;
        vertical-align: text-bottom;
      `}
    >
      {getName(user)}
    </span>
    {user.type === 'ADMIN' && <AdminDisplay />}
  </div>
);
