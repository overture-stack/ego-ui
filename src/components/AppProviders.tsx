import { ThemeProvider } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { AuthProvider } from './global/hooks/useAuthContext';
import { ListProvider } from './global/hooks/useListContext';
import defaultTheme from '../theme';

import { EGO_JWT_KEY } from 'common/constants';
// import { EntityProvider } from './global/hooks/useEntityContext';
// import RESOURCE_MAP from 'common/RESOURCE_MAP';

const AppProviders = ({ children }: { children: React.ReactElement }) => {
  const [initialJwt, setInitialJwt] = useState<string>(undefined);
  const [initialResourceName, setInitialResourceName] = useState<string>(undefined);
  const [initialResourceId, setInitialResourceId] = useState<string>(undefined);
  const [initialSubResourceName, setInitialSubResourceName] = useState<string>(undefined);
  // app does not respond to route change on login when useLocation() is not called (???)
  const location = useLocation();
  useEffect(() => {
    const jwt = localStorage.getItem(EGO_JWT_KEY);
    if (jwt) {
      setInitialJwt(jwt); // will handle whether valid in authContext
    } else {
      setInitialJwt(undefined);
    }
    // TODO: this will kick out the user when the path changes and the jwt is found to be expired
    // but does not handle a 403 on a request like saving changes to an entity. Will need to handle this in
    // https://github.com/overture-stack/ego-ui/issues/144
  }, [location.pathname]);

  useEffect(() => {
    const pathInfo = location.pathname.split('/');
    const resourceName = pathInfo[1];
    const id = pathInfo[2];
    const subResourceName = pathInfo[3];
    setInitialResourceName(resourceName);
    setInitialResourceId(id);
    setInitialSubResourceName(subResourceName);
  }, [location.pathname]);

  return (
    <AuthProvider initialJwt={initialJwt}>
      <ThemeProvider theme={defaultTheme}>
        <ListProvider
          resourceName={initialResourceName}
          // resourceId={initialResourceId}
        >
          {/* <EntityProvider
            id={initialResourceId}
            subResource={initialSubResourceName}
            resource={RESOURCE_MAP[initialResourceName]}
          > */}
          {children}
          {/* </EntityProvider> */}
        </ListProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default AppProviders;
