import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { compose } from 'recompose';
import { provideUser } from 'stateProviders';
import { injectState } from 'freactal';

import Login from 'components/Login';
import Users from 'components/Users';
import Groups from 'components/Groups';
import Applications from 'components/Applications';
import NoAccess from 'components/NoAccess';
import Nav from 'components/Nav';

const enhance = compose(provideUser);

const ProtectedRoute = injectState(({ renderLogin, component, state, ...rest }) => (
  <Route {...rest} component={state.token ? component : renderLogin && Login} />
));

class App extends React.Component<any, any> {
  render() {
    return (
      <Router>
        <div style={{ height: '100%', display: 'flex' }}>
          <ProtectedRoute
            path="/(users|groups|apps)/:id?/:subResourceType?/:subResourceId?"
            exact
            component={Nav}
          />
          <Switch>
            <Route path="/" exact component={Login} />
            <ProtectedRoute
              path="/users/:id?/:subResourceType?/:subResourceId?"
              component={Users}
              renderLogin
            />
            <ProtectedRoute
              path="/groups/:id?/:subResourceType?/:subResourceId?"
              component={Groups}
              renderLogin
            />
            <ProtectedRoute
              path="/apps/:id?/:subResourceType?/:subResourceId?"
              component={Applications}
              renderLogin
            />
            <Route path="/no-access" exact component={NoAccess} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default enhance(App);
