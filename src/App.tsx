import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import BreadCrumb from 'components/BreadCrumb';
import Login from 'components/Login';

import ResourceRoute from 'components/ResourceRoute';

import NoAccess from 'components/NoAccess';
import Nav from 'components/Nav';
import RESOURCE_MAP from 'common/RESOURCE_MAP';

import { UserProvider, UserContext } from './Contexts';

function ProtectedRoute({ component, ...rest }: any) {
  return (
    <UserContext.Consumer>
      {({ loggedInUserToken }) => (
        <Route {...rest} component={loggedInUserToken ? component : Login} />
      )}
    </UserContext.Consumer>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <div style={{ height: '100%', display: 'flex' }}>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/no-access" exact component={NoAccess} />
            <ProtectedRoute
              component={props => (
                <>
                  <Nav />
                  <div style={{ width: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <BreadCrumb path={props.location.pathname} />
                    <Switch>
                      {Object.keys(RESOURCE_MAP).map(key => {
                        const resource = RESOURCE_MAP[key];
                        return (
                          <ProtectedRoute
                            key={key}
                            path={`/${resource.name.plural}/:id?/:subResourceType?/:subResourceId?`}
                            render={p => <ResourceRoute {...p} resource={resource} />}
                            renderLogin
                          />
                        );
                      })}
                    </Switch>
                  </div>
                </>
              )}
            />
          </Switch>
        </div>
      </Router>
    </UserProvider>
  );
}
