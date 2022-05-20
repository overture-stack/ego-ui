import { ThemeProvider } from '@emotion/react';

import defaultTheme from '../theme';
import { EGO_JWT_KEY } from 'common/constants';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './global/hooks/useAuthContext';

const AppProviders = ({ children }: { children: React.ReactElement }) => {
  const [initialJwt, setInitialJwt] = useState<string>(undefined);

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
  }, [location.pathname]); // TODO: revisit this setup in https://github.com/overture-stack/ego-ui/issues/144

  return (
    <AuthProvider initialJwt={initialJwt}>
      <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
    </AuthProvider>
  );
};

export default AppProviders;
