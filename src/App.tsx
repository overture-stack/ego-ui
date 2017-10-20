import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { compose } from 'recompose';
import { provideUser } from 'stateProviders';

import Login from 'components/Login';
import Users from 'components/Users';
import Groups from 'components/Groups';
import Apps from 'components/Apps';
import NoAccess from 'components/NoAccess';

import { getToken } from 'services/ajax';

import './App.css';

const enhance = compose(provideUser);

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      getToken() ? <Component {...props} /> : <Login {...props} />}
  />
);

class App extends React.Component {
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
