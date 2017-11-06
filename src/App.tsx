import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { compose } from 'recompose';
import { provideLoggedInUser } from 'stateProviders';
import { injectState } from 'freactal';

import Login from 'components/Login';

import ResourceRoute from 'components/ResourceRoute';

import NoAccess from 'components/NoAccess';
import Nav from 'components/Nav';
import RESOURCE_MAP from 'common/RESOURCE_MAP';

const enhance = compose(provideLoggedInUser);

const ProtectedRoute = injectState(({ renderLogin, component, state, ...rest }) => (
  <Route {...rest} component={state.loggedInUserToken ? component : renderLogin && Login} />
));

class App extends React.Component<any, any> {
  render() {
    return (
      <Router>
        <div style={{ height: '100%', display: 'flex' }}>
          <ProtectedRoute
            path={`/(${Object.keys(RESOURCE_MAP).join(
              '|',
            )})/:id?/:subResourceType?/:subResourceId?`}
            exact
            component={Nav}
          />
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/no-access" exact component={NoAccess} />
            {Object.keys(RESOURCE_MAP).map(key => (
              <ProtectedRoute
                key={key}
                path={`/${key}/:id?/:subResourceType?/:subResourceId?`}
                component={props => <ResourceRoute {...props} type={key} />}
                renderLogin
              />
            ))}
          </Switch>
        </div>
      </Router>
    );
  }
}

export default enhance(App);
