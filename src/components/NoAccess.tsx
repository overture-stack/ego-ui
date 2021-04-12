/** @jsxImportSource @emotion/react */
import React from 'react';

import Logout from 'components/Logout';
import defaultTheme from 'theme';

const NoAccess = () => (
  <div
    css={(theme: typeof defaultTheme) => ({
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
