import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { compose } from 'recompose';
import { provideUser } from 'stateProviders';
import { injectState } from 'freactal';

import Login from 'components/Login';
import Users from 'components/Users';
import Groups from 'components/Groups';
import Apps from 'components/Apps';
import NoAccess from 'components/NoAccess';

import './App.css';

const enhance = compose(provideUser);

const ProtectedRoute = injectState(
  ({ component: Component, state, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        state.token ? <Component {...props} /> : <Login {...props} />}
    />
  ),
);

class App extends React.Component<any, any> {
  render() {
    return (
      <Router>
        <div style={{ height: '100%' }}>
          <Route path="/" exact component={Login} />
          <ProtectedRoute path="/users/:id?" component={Users} />
          <ProtectedRoute path="/groups/:id?" component={Groups} />
          <ProtectedRoute path="/apps/:id?" component={Apps} />
          <Route path="/no-access" exact component={NoAccess} />
        </div>
      </Router>
    );
  }
}

export default enhance(App);
