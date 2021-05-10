/** @jsxImportSource @emotion/react */
import React from 'react';

import Logout from 'components/Logout';

const NoAccess = () => (
  <div
    css={(theme) => ({
      backgroundColor: theme.colors.primary_5,
      color: theme.colors.white,
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    })}
  >
    Your account does not have an administrator user type.
    <Logout />
  </div>
);

export default NoAccess;
