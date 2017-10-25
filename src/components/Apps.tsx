import React from 'react';
import { css } from 'glamor';
import _ from 'lodash';
import {
  getApps,
  getApp,
  getUsers,
  getGroups,
  addApplicationToUser,
  removeApplicationFromUser,
  addApplicationToGroup,
  removeApplicationFromGroup,
  getAppUsers,
  getAppGroups,
} from 'services';
import ListPane from 'components/ListPane';
import Content from 'components/Content';
import EmptyContent from 'components/EmptyContent';

import Associator from 'components/Associator/Associator';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
};

const App = ({ item: { name }, style, className = '', ...props }) => {
  return (
    <div
      className={`${className} ${css(
        {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '10px 0',
          fontSize: 20,
        },
        style,
      )}`}
      {...props}
    >
      {name}
    </div>
  );
};

export default class extends React.Component<any, any> {
  state = { currentApp: null, currentGroups: null, currentUsers: null };

  fetchApp = async id => {
    const [currentApp, currentUsers, currentGroups] = await Promise.all([
      getApp(id),
      getAppUsers(id),
      getAppGroups(id),
    ]);

    this.setState({
      currentApp,
      currentUsers: currentUsers.resultSet,
      currentGroups: currentGroups.resultSet,
    });
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.fetchApp(id);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const id = nextProps.match.params.id;

    if (id !== this.props.match.params.id) {
      if (id) {
        this.fetchApp(id);
      } else {
        this.setState({ currentApp: null, currentGroups: null, currentUsers: null });
      }
    }
  }

  render() {
    const currentApp = this.state.currentApp as any;
    const appId = _.get(currentApp, 'id');
    const { currentUsers, currentGroups } = this.state;

    return (
      <div className={`row ${css(styles.container)}`}>
        <ListPane
          Component={App}
          getData={getApps}
          selectedItem={currentApp}
          onSelect={app => {
            if (app.id === appId) {
              this.props.history.push(`/apps`);
            } else {
              this.props.history.push(`/apps/${app.id}`);
            }
          }}
        />
        {!currentApp ? (
          <EmptyContent message="Please select an application" />
        ) : (
          <Content
            data={{
              ...currentApp,
              users: (
                <Associator
                  key={`${currentApp.id}-users`}
                  initialItems={currentUsers}
                  fetchItems={getUsers}
                  onAdd={user => {
                    addApplicationToUser({ user, application: currentApp });
                  }}
                  onRemove={user => {
                    removeApplicationFromUser({
                      user,
                      application: currentApp,
                    });
                  }}
                />
              ),
              groups: (
                <Associator
                  key={`${currentApp.id}-groups`}
                  initialItems={currentGroups}
                  fetchItems={getGroups}
                  onAdd={group => {
                    addApplicationToGroup({ group, application: currentApp });
                  }}
                  onRemove={group => {
                    removeApplicationFromGroup({
                      group,
                      application: currentApp,
                    });
                  }}
                />
              ),
            }}
            keys={[
              'name',
              'clientId',
              'clientSecret',
              'description',
              'id',
              'redirectUri',
              'status',
              'groups',
              'users',
            ]}
          />
        )}
      </div>
    );
  }
}
