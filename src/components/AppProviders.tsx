import { ThemeProvider } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { AuthProvider } from './global/hooks/useAuthContext';
import { EntityProvider } from './global/hooks/useEntityContext';
import { ListProvider } from './global/hooks/useListContext';
import defaultTheme from '../theme';

import { EGO_JWT_KEY } from 'common/injectGlobals';

const AppProviders = ({ children }: { children: React.ReactElement }) => {
  const [initialJwt, setInitialJwt] = useState<string>(undefined);

  // app does not respond to route change on login when useLocation() is not called (???)
  const location = useLocation();
  useEffect(() => {
    const jwt = localStorage.getItem(EGO_JWT_KEY);
    if (jwt) {
      setInitialJwt(jwt); // will handle whether valid in authContext
    } else {
      setInitialJwt(undefined);
    }
  });
  return (
    <AuthProvider initialJwt={initialJwt}>
      <ThemeProvider theme={defaultTheme}>
        <ListProvider>
          <EntityProvider>{children}</EntityProvider>
        </ListProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default AppProviders;
