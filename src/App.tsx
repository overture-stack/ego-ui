import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { css } from 'glamor';
import colors from 'common/colors';
import { googleLogin } from 'services/login';
import { provideUser } from 'stateProviders';

import Login from 'components/Login';
import Users from 'components/Users';
import Groups from 'components/Groups';
import Apps from 'components/Apps';
import NoAccess from 'components/NoAccess';

import './App.css';

const GOOGLE_CLIENT_ID =
  '814606937527-kk7ooglk6pj2tvpn7ldip6g3b74f8o72.apps.googleusercontent.com';

const styles = {
  container: {
    height: '100%',
  },
};

const gapi = global.gapi;

const enhance = compose(provideUser);

class App extends React.Component {
  render() {
    return (
      <Router>
        <div style={{ height: '100%' }}>
          <Route path="/" exact component={Login} />
          <Route path="/users" component={Users} />
          <Route path="/groups" component={Groups} />
          <Route path="/apps" component={Apps} />
          <Route path="/no-access" exact component={NoAccess} />
        </div>
      </Router>
    );
  }
}

export default enhance(App);
