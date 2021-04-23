/** @jsxImportSource @emotion/react */
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';

import BreadCrumb from 'components/BreadCrumb';
import Login from 'components/Login';
import ResourceRoute from 'components/ResourceRoute';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import Nav from 'components/Nav';
import NoAccess from 'components/NoAccess';
import { PUBLIC_PATH } from 'common/injectGlobals';
import { AuthProvider } from 'components/global/hooks/useAuthContext';
import defaultTheme from './theme';

const ProtectedRoute = ({
  component,
  ...rest
}: {
  component?: any;
  path?: string;
  render?: any;
}) => {
  const initialJwt = localStorage.getItem('user-token');
  return <Route {...rest} component={initialJwt ? component : Login} />;
};

const App = () => {
  return (
    <Router basename={PUBLIC_PATH}>
      <AuthProvider>
        <ThemeProvider theme={defaultTheme}>
          <div css={{ height: '100%', display: 'flex' }}>
            <Switch>
              <Route path="/" exact component={Login} />
              <Route path="/no-access" exact component={NoAccess} />
              <ProtectedRoute
                component={(props) => (
                  <React.Fragment>
                    <Nav />
                    <div css={{ width: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <BreadCrumb path={props.location.pathname} />
                      <Switch>
                        {Object.keys(RESOURCE_MAP).map((key) => {
                          const resource = RESOURCE_MAP[key];
                          return (
                            <ProtectedRoute
                              key={key}
                              path={`/${resource.name.plural}/:id?/:subResourceType?/:subResourceId?`}
                              render={(p) => <ResourceRoute {...p} resource={resource} />}
                            />
                          );
                        })}
                      </Switch>
                    </div>
                  </React.Fragment>
                )}
              />
            </Switch>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
