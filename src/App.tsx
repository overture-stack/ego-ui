import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { compose } from 'recompose';
import { provideLoggedInUser } from 'stateProviders';
import { injectState } from 'freactal';

import BreadCrumb from 'components/BreadCrumb';
import Login from 'components/Login';

import ResourceRoute from 'components/ResourceRoute';

import NoAccess from 'components/NoAccess';
import Nav from 'components/Nav';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import Aux from 'components/Aux';
import AuthRedirect from 'components/AuthRedirect';

const enhance = compose(provideLoggedInUser);

const ProtectedRoute = injectState(({ component, state, ...rest }) => (
  <Route {...rest} component={state.loggedInUserToken ? component : Login} />
));

class App extends React.Component<any, any> {
  render() {
    return (
      <Router>
        <div style={{ height: '100%', display: 'flex' }}>
          <Switch>
            <Route path="/auth-redirect" exact component={AuthRedirect} />
            <Route path="/redirected" exact component={() => null} />
            <Route path="/" exact component={Login} />
            <Route path="/no-access" exact component={NoAccess} />
            <ProtectedRoute
              component={props => (
                <Aux>
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
                </Aux>
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default enhance(App);
