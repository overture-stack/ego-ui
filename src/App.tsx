/** @jsxImportSource @emotion/react */
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import BreadCrumb from 'components/BreadCrumb';
import Login from 'components/Login';
import ResourceRoute from 'components/ResourceRoute';
import Nav from 'components/Nav';
import NoAccess from 'components/NoAccess';
import useAuthContext from 'components/global/hooks/useAuthContext';
import { navResourceList } from 'components/Nav/Nav';
import ContentProviders from 'components/ContentProviders';

const ProtectedRoute = ({
  component,
  ...rest
}: {
  component?: any;
  path?: string;
  render?: any;
}) => {
  const { token } = useAuthContext();
  return <Route {...rest} component={token ? component : Login} />;
};

const App = () => {
  return (
    <div css={{ height: '100%', display: 'flex' }}>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/no-access" exact component={NoAccess} />
        <ProtectedRoute
          path={`/:resourceName?/:id?/:childResourceName?`}
          component={(props) => (
            <ContentProviders {...props}>
              <React.Fragment>
                <Nav />
                <div css={{ width: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* TODO: is this the right path? */}
                  <BreadCrumb path={props.location.pathname} />
                  <Switch>
                    {navResourceList.map((resourceName) => {
                      return (
                        <ProtectedRoute
                          key={resourceName}
                          render={(props: any) => <ResourceRoute {...props} />}
                        />
                      );
                    })}
                  </Switch>
                </div>
              </React.Fragment>
            </ContentProviders>
          )}
        />
      </Switch>
    </div>
  );
};

export default App;
