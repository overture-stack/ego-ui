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
            <Route path="/" exact component={Login} />
            <Route path="/no-access" exact component={NoAccess} />
            <ProtectedRoute
              component={props => (
                <Aux>
                  <Nav />
                  <div style={{ width: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Switch>
                      {Object.keys(RESOURCE_MAP).map(key => (
                        <ProtectedRoute
                          key={key}
                          path={`/${key}/:id?/:subResourceType?/:subResourceId?`}
                          render={props => <ResourceRoute {...props} type={key} />}
                          renderLogin
                        />
                      ))}
                    </Switch>
                    <BreadCrumb path={props.location.pathname} />
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
